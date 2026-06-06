"""Sensitive-field masking.

Any column listed in SENSITIVE_COLUMNS is replaced with `••••••` in API
output unless the request includes `?reveal=true`. We intentionally do
NOT support per-column reveal at this stage — the toggle is global so
the audit trail stays simple.
"""
from __future__ import annotations

from collections.abc import Iterable, Mapping
from typing import Any

SENSITIVE_COLUMNS: frozenset[str] = frozenset({
    # auth material
    "passwd", "pw", "passcode", "passcodeMD5",
    # network identifiers
    "loginip", "setloginip", "setip",
    "logurl", "seturl",
    # personal contact
    "email", "tel",
})

MASK = "••••••"


def mask_row(row: Mapping[str, Any], reveal: bool) -> dict[str, Any]:
    if reveal:
        return dict(row)
    return {
        k: (MASK if (v not in (None, "") and k in SENSITIVE_COLUMNS) else v)
        for k, v in row.items()
    }


def mask_rows(rows: Iterable[Mapping[str, Any]], reveal: bool) -> list[dict]:
    return [mask_row(r, reveal) for r in rows]
