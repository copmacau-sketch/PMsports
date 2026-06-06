"""HG / Crown sportsbook code dictionaries.

The schema is full of single-letter codes (`gtype`, `ptype`, `wtype`, ...).
We map them to readable strings here once instead of scattering switch
statements across the frontend.
"""
from __future__ import annotations

GTYPE = {
    "FT": "足球",
    "BK": "篮球",
    "BS": "棒球",
    "TN": "网球",
    "VB": "排球",
    "BM": "羽毛球",
    "SK": "美式足球",
    "ES": "电竞",
    "FS": "电竞",
    "OP": "其它",
}

PTYPE = {
    "Y": "全场",
    "N": "半场",
}

WTYPE = {
    "M": "独赢/让球",
    "R": "大小",
    "RE": "反波胆",
    "DT": "单双",
    "RDT": "反单双",
    "FS": "电竞玩法",
    "OU": "大小",
    "HDP": "让球",
}

LTYPE = {
    "1": "玩法层级 1",
    "2": "玩法层级 2",
    "3": "玩法层级 3",
    "4": "玩法层级 4",
}

USERTYPE = {
    "0": "会员",
    "1": "代理",
    "2": "管理员",
    "Y": "已结算",
    "N": "未结算",
}

RANK_LEVEL = {
    1: "D0 / 总公司",
    2: "D1 / 公司",
    3: "D2 / 大股",
    4: "D3 / 代理",
}


def decode(table: dict, code) -> str | None:
    if code is None:
        return None
    return table.get(code) or table.get(str(code))
