#!/usr/bin/env python3
"""crown_gold_collector.py — 替代 application/bdata/bat/BAT.exe

BAT.exe 实际只做一件事：把 bdata/bat/*.bat 列出的 14 个 .bat 各起一个独立
Console 循环跑 `php ../<name>.php start`，重启间隔由 hm_config.ini 控制
(`重启时间=1600` 秒)。每个 .bat 进程其实就是 PHP 脚本本身在 do{...} while(true)
循环里采集，BAT.exe 只是个"看门狗"。

本脚本用 subprocess 子进程 + 监督循环原样复刻：
  - bat.txt 列出的每个名字 → 启动 `php /<bdata>/<name>.php`
  - 子进程退出 / 跑飞超时 → 自动重启
  - SIGTERM → 优雅停所有子进程
  - 所有 stdout/stderr 经 logging 落 /var/log/crown-gold/<name>.log

运行：
  python3 crown_gold_collector.py \\
      --bdata /home/ubuntu/crown-gold/wwwroot_F5PEa/application/bdata \\
      --log-dir /var/log/crown-gold \\
      --restart-interval 1600

systemd: crown-gold-collector.service
"""
from __future__ import annotations

import argparse
import configparser
import logging
import os
import signal
import subprocess
import sys
import threading
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional

DEFAULT_BAT_LIST = [
    "uid",
    "uid1",
    "url",
    "aguid",
    "danger",
    "result",
    "oddsapi",      # Odds-API.io 采集守护（替代 data5/data10/data60）
    "accept180",
    "accept600",
    "copy_match",
    "wrte_db",
    "jiefeng",
]


@dataclass
class Worker:
    name: str
    php_script: Path
    log_path: Path
    restart_interval: int
    proc: Optional[subprocess.Popen] = None
    started_at: float = 0.0
    restarts: int = 0
    stop_flag: threading.Event = field(default_factory=threading.Event)

    def spawn(self) -> None:
        """Launch the PHP CLI subprocess."""
        self.log_path.parent.mkdir(parents=True, exist_ok=True)
        log_fp = open(self.log_path, "ab", buffering=0)
        log_fp.write(
            f"\n===== {self.name} start @ {time.strftime('%F %T')} restarts={self.restarts} =====\n".encode()
        )
        self.proc = subprocess.Popen(
            ["php", str(self.php_script), "start"],
            cwd=str(self.php_script.parent),
            stdout=log_fp,
            stderr=subprocess.STDOUT,
            stdin=subprocess.DEVNULL,
            preexec_fn=os.setsid,  # own pgid → 干净 kill
            env={**os.environ, "LANG": "zh_CN.UTF-8"},
        )
        self.started_at = time.monotonic()

    def alive(self) -> bool:
        return self.proc is not None and self.proc.poll() is None

    def should_restart(self) -> bool:
        if self.stop_flag.is_set():
            return False
        if not self.alive():
            return True
        # 强制周期性重启（对齐 hm_config.ini 重启时间）
        if time.monotonic() - self.started_at > self.restart_interval:
            return True
        return False

    def kill(self) -> None:
        if self.alive():
            try:
                os.killpg(os.getpgid(self.proc.pid), signal.SIGTERM)
            except ProcessLookupError:
                pass
            try:
                self.proc.wait(timeout=10)
            except subprocess.TimeoutExpired:
                try:
                    os.killpg(os.getpgid(self.proc.pid), signal.SIGKILL)
                except ProcessLookupError:
                    pass


class Supervisor:
    def __init__(
        self,
        bdata_dir: Path,
        log_dir: Path,
        restart_interval: int,
        names: List[str],
        check_interval: float = 5.0,
    ) -> None:
        self.bdata_dir = bdata_dir
        self.log_dir = log_dir
        self.restart_interval = restart_interval
        self.check_interval = check_interval
        self.shutdown = threading.Event()
        self.workers: Dict[str, Worker] = {}
        for name in names:
            php = bdata_dir / f"{name}.php"
            if not php.exists():
                logging.warning("skip %s — %s missing", name, php)
                continue
            self.workers[name] = Worker(
                name=name,
                php_script=php,
                log_path=log_dir / f"{name}.log",
                restart_interval=restart_interval,
            )

    def start_all(self) -> None:
        for w in self.workers.values():
            w.spawn()
            logging.info("started %s pid=%s", w.name, w.proc.pid)

    def stop_all(self) -> None:
        self.shutdown.set()
        for w in self.workers.values():
            w.stop_flag.set()
        for w in self.workers.values():
            logging.info("stopping %s", w.name)
            w.kill()

    def loop(self) -> None:
        while not self.shutdown.is_set():
            for w in self.workers.values():
                if w.should_restart():
                    if w.alive():
                        logging.info("cyclic restart %s (uptime=%.0fs)", w.name,
                                     time.monotonic() - w.started_at)
                        w.kill()
                    else:
                        rc = w.proc.returncode if w.proc else "?"
                        logging.warning("respawn %s (exited rc=%s)", w.name, rc)
                    w.restarts += 1
                    w.spawn()
            self.shutdown.wait(self.check_interval)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Crown-Gold BAT.exe replacement")
    p.add_argument("--bdata", required=True, type=Path,
                   help="路径：application/bdata 目录")
    p.add_argument("--log-dir", default=Path("/var/log/crown-gold"), type=Path)
    p.add_argument("--restart-interval", type=int, default=1600,
                   help="单个子进程的强制重启周期秒数（对齐 hm_config.ini）")
    p.add_argument("--names", nargs="*", default=None,
                   help="覆盖默认 14 个采集脚本名（不带 .php）")
    p.add_argument("--config", type=Path, default=None,
                   help="可选: bdata/bat/hm_config.ini，自动读取重启时间")
    return p.parse_args()


def load_restart_from_ini(ini: Path, fallback: int) -> int:
    cfg = configparser.RawConfigParser(strict=False)
    try:
        cfg.read(ini, encoding="gbk")
    except Exception as e:
        logging.warning("ini read failed (%s) — using fallback %ds", e, fallback)
        return fallback
    for section in cfg.sections():
        for k, v in cfg.items(section):
            if "重启" in k or k.lower() in ("restart", "restart_time"):
                try:
                    return int(v)
                except ValueError:
                    pass
    return fallback


def main() -> int:
    args = parse_args()
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
    )

    if not args.bdata.is_dir():
        logging.error("bdata dir not found: %s", args.bdata)
        return 1

    interval = args.restart_interval
    if args.config and args.config.exists():
        interval = load_restart_from_ini(args.config, args.restart_interval)
        logging.info("restart_interval from ini = %ds", interval)

    names = args.names or DEFAULT_BAT_LIST
    sup = Supervisor(args.bdata, args.log_dir, interval, names)

    if not sup.workers:
        logging.error("no workers — abort")
        return 2

    def handle_sig(signum, _frame):
        logging.info("signal %d → shutdown", signum)
        sup.stop_all()

    signal.signal(signal.SIGTERM, handle_sig)
    signal.signal(signal.SIGINT, handle_sig)

    sup.start_all()
    try:
        sup.loop()
    finally:
        sup.stop_all()
    return 0


if __name__ == "__main__":
    sys.exit(main())
