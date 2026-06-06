#!/usr/bin/env python3
"""
Tiny dev server for hand-written H5 mockups in `out/`.

- Serves `out/` as static files (so /sports-new.html etc. work).
- Reverse-proxies any URL starting with `/api/` or `/health` to the live
  pmppm.com backend, so the page can call real endpoints same-origin.

Usage:
    python3 dev_static_proxy.py [port]   # defaults to 3003

The upstream is hard-coded to https://pmppm.com because the local FastAPI
on 127.0.0.1:8787 is not running in this environment. Override via env var:

    UPSTREAM=https://pmppm.com python3 dev_static_proxy.py 3003
"""
from __future__ import annotations

import os
import sys
import ssl
import json
import urllib.request
import urllib.error
from http import HTTPStatus
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlsplit


UPSTREAM = os.environ.get("UPSTREAM", "https://pmppm.com").rstrip("/")
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERVE_DIR = os.path.join(SCRIPT_DIR, "out")
PROXY_PREFIXES = ("/api/", "/health")
SSL_CTX = ssl.create_default_context()
# Local dev proxy: macOS Python sometimes lacks an updated CA bundle and
# fails to verify Cloudflare-fronted endpoints. Since this is a local
# tooling-only proxy bound to 127.0.0.1, disable verification.
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE


class ProxyingHandler(SimpleHTTPRequestHandler):
    """Static handler that forwards /api/* to UPSTREAM."""

    # Anchor SimpleHTTPRequestHandler to out/ regardless of cwd.
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SERVE_DIR, **kwargs)

    # Quieter logs — one line per non-static request.
    def log_message(self, fmt, *args):  # noqa: D401
        path = self.path.split("?", 1)[0]
        if path.startswith(PROXY_PREFIXES) or path.endswith(".html") or path == "/":
            sys.stderr.write("[proxy] %s %s\n" % (self.command, self.path))

    # --- HTTP verbs ---------------------------------------------------
    def do_GET(self):       self._dispatch("GET")
    def do_POST(self):      self._dispatch("POST")
    def do_PUT(self):       self._dispatch("PUT")
    def do_DELETE(self):    self._dispatch("DELETE")
    def do_OPTIONS(self):   self._dispatch("OPTIONS")

    def _dispatch(self, method: str):
        path = self.path
        if path.startswith(PROXY_PREFIXES):
            self._proxy(method)
        else:
            # Fall back to static behaviour for everything else.
            if method == "GET":
                return super().do_GET()
            self.send_error(HTTPStatus.METHOD_NOT_ALLOWED, "static-only for non-/api paths")

    def _proxy(self, method: str):
        upstream_url = f"{UPSTREAM}{self.path}"
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length) if length > 0 else None

        # Forward most headers, but rewrite Host/Origin/Referer to upstream.
        fwd_headers = {}
        upstream_host = urlsplit(UPSTREAM).netloc
        for k, v in self.headers.items():
            kl = k.lower()
            if kl in ("host", "origin", "referer", "connection",
                      "accept-encoding", "content-length"):
                continue
            fwd_headers[k] = v
        fwd_headers["Host"] = upstream_host
        fwd_headers["Origin"] = UPSTREAM
        fwd_headers["Referer"] = UPSTREAM + "/"
        # Identify ourselves so it's clear in upstream logs.
        fwd_headers.setdefault("User-Agent",
                               "crowngold-static-proxy/1.0")

        req = urllib.request.Request(upstream_url, data=body,
                                     headers=fwd_headers, method=method)
        try:
            resp = urllib.request.urlopen(req, context=SSL_CTX, timeout=15)
            status = resp.getcode()
            payload = resp.read()
            resp_headers = resp.headers
        except urllib.error.HTTPError as e:
            status = e.code
            payload = e.read()
            resp_headers = e.headers
        except Exception as e:
            self.send_error(HTTPStatus.BAD_GATEWAY,
                            f"upstream error: {e!s}")
            return

        # Relay status + a sane subset of response headers.
        self.send_response(status)
        ct = (resp_headers.get("Content-Type") or "application/octet-stream")
        self.send_header("Content-Type", ct)
        self.send_header("Content-Length", str(len(payload)))
        cc = resp_headers.get("Cache-Control")
        if cc:
            self.send_header("Cache-Control", cc)
        # Permit same-origin XHR from the static page itself.
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers",
                         "Content-Type, Authorization, Accept")
        self.send_header("Access-Control-Allow-Methods",
                         "GET, POST, PUT, DELETE, OPTIONS")
        self.end_headers()
        if payload:
            self.wfile.write(payload)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3003
    if not os.path.isdir(SERVE_DIR):
        sys.exit(f"serve dir not found: {SERVE_DIR}")
    httpd = HTTPServer(("127.0.0.1", port), ProxyingHandler)
    print(f"[proxy] serving {SERVE_DIR}")
    print(f"[proxy] http://127.0.0.1:{port}/sports-new.html")
    print(f"[proxy] /api/* and /health -> {UPSTREAM}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[proxy] bye")


if __name__ == "__main__":
    main()
