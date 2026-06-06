#!/usr/bin/env python3
"""rewrite_dump_for_sqlite.py

Take a mysqldump produced for MySQL 5.7 (MyISAM tables, --compatible=ansi)
and rewrite the DDL so it loads cleanly into SQLite.

Rules applied:
  * Drop MySQL-specific suffixes: ENGINE=..., DEFAULT CHARSET=..., COLLATE=...,
    ROW_FORMAT=..., AUTO_INCREMENT=...
  * Replace tinyint/smallint/mediumint/bigint/int(...) -> INTEGER
  * Replace float/double/decimal(...) -> REAL
  * datetime / timestamp / date / time -> TEXT
  * varchar(N) / char(N) / longtext / mediumtext / tinytext / text -> TEXT
  * blob/* -> BLOB
  * enum(...)/set(...) -> TEXT
  * KEY/INDEX/UNIQUE KEY lines inside CREATE TABLE -> moved out as CREATE INDEX
  * Strip backticks; quote identifiers with double quotes (ANSI).
  * Drop "/*!40101 ... */" comment blocks and LOCK/UNLOCK lines.
  * Strip "DEFAULT 'value'" when type is auto-converted (kept as-is otherwise).
"""
from __future__ import annotations

import re
import sys
from pathlib import Path


TYPE_RE = re.compile(
    r"""\b(
        tinyint|smallint|mediumint|bigint|int|integer
      | float|double|decimal|numeric
      | datetime|timestamp|date|time|year
      | varchar|char|longtext|mediumtext|tinytext|text
      | longblob|mediumblob|tinyblob|blob|binary|varbinary
      | enum|set|bit|json
    )\b\s*(\([^)]*\))?""",
    re.IGNORECASE | re.VERBOSE,
)

TYPE_MAP = {
    "tinyint": "INTEGER", "smallint": "INTEGER", "mediumint": "INTEGER",
    "bigint": "INTEGER", "int": "INTEGER", "integer": "INTEGER",
    "float": "REAL", "double": "REAL", "decimal": "REAL", "numeric": "REAL",
    "datetime": "TEXT", "timestamp": "TEXT", "date": "TEXT",
    "time": "TEXT", "year": "INTEGER",
    "varchar": "TEXT", "char": "TEXT", "longtext": "TEXT",
    "mediumtext": "TEXT", "tinytext": "TEXT", "text": "TEXT",
    "longblob": "BLOB", "mediumblob": "BLOB", "tinyblob": "BLOB",
    "blob": "BLOB", "binary": "BLOB", "varbinary": "BLOB",
    "enum": "TEXT", "set": "TEXT", "bit": "INTEGER", "json": "TEXT",
}

# qualifiers we silently delete from column defs
DEAD_QUALIFIERS = re.compile(
    r"\b(unsigned|zerofill|auto_increment|character\s+set\s+\w+|collate\s+\w+|on\s+update\s+current_timestamp(?:\([^)]*\))?)\b",
    re.IGNORECASE,
)

# strip `COMMENT 'free text'` qualifiers (MySQL only)
COMMENT_RE = re.compile(r"\bCOMMENT\s+'(?:''|[^'])*'", re.IGNORECASE)

# "/*!40101 ... */"-style MySQL conditional comments
CONDITIONAL_COMMENT = re.compile(r"/\*!\d+\s.*?\*/;?", re.DOTALL)

LOCK_LINE = re.compile(r"^\s*(LOCK|UNLOCK)\s+TABLES.*?;\s*$",
                       re.IGNORECASE | re.MULTILINE)

CREATE_TABLE_HEAD_RE = re.compile(
    r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(?P<name>[^`"\s(]+)[`"]?\s*\(',
    re.IGNORECASE,
)


def convert_type(match: re.Match) -> str:
    base = match.group(1).lower()
    # NOTE: TYPE_RE also consumes the trailing length spec (e.g. "(11)")
    # and any whitespace before it. We append a trailing space so that
    # `date NOT NULL` doesn't collapse to `TEXTNOT NULL` after the
    # whitespace got swallowed; the later squash-spaces step removes
    # the duplicate.
    return TYPE_MAP.get(base, base.upper()) + " "


_LEADING_IDENT_RE = re.compile(r'^\s*[`"](?P<name>[^`"]+)[`"]\s*')


def rewrite_column_line(line: str) -> str:
    # strip backticks for consistency
    line = line.replace("`", '"')
    # separate the leading identifier from the rest so that column names
    # which happen to equal a reserved type keyword (e.g. "datetime",
    # "date", "time") aren't accidentally rewritten.
    m = _LEADING_IDENT_RE.match(line)
    if m:
        head = line[: m.end()]
        tail = line[m.end():]
    else:
        head, tail = "", line
    # strip COMMENT '...'
    tail = COMMENT_RE.sub("", tail)
    # remove dead qualifiers
    tail = DEAD_QUALIFIERS.sub("", tail)
    # convert types
    tail = TYPE_RE.sub(convert_type, tail)
    line = head + tail
    # collapse multi-spaces
    line = re.sub(r"\s+", " ", line).strip().rstrip(",")
    return line


def find_matching_paren(text: str, open_pos: int) -> int:
    """Given text[open_pos] == '(', return index of the matching ')'.
    Handles single/double-quoted strings and backtick identifiers so that
    parens inside string literals are ignored.
    """
    depth = 0
    i = open_pos
    n = len(text)
    in_str: str | None = None
    while i < n:
        ch = text[i]
        if in_str:
            if ch == "\\" and i + 1 < n:
                i += 2
                continue
            if ch == in_str:
                in_str = None
        else:
            if ch in ("'", '"', "`"):
                in_str = ch
            elif ch == "(":
                depth += 1
            elif ch == ")":
                depth -= 1
                if depth == 0:
                    return i
        i += 1
    raise ValueError("unbalanced parens in CREATE TABLE")


def rewrite_create_table(name: str, body: str) -> str:
    columns: list[str] = []
    indexes: list[str] = []
    pk_cols: list[str] | None = None

    # split by comma at top level only, ignoring commas inside quoted
    # string literals and inside parenthesised type lengths / enum lists.
    depth = 0
    buf: list[str] = []
    parts: list[str] = []
    in_str: str | None = None
    i = 0
    while i < len(body):
        ch = body[i]
        if in_str:
            buf.append(ch)
            if ch == "\\" and i + 1 < len(body):
                buf.append(body[i + 1])
                i += 2
                continue
            if ch == in_str:
                in_str = None
            i += 1
            continue
        if ch in ("'", '"', "`"):
            in_str = ch
            buf.append(ch)
        elif ch == "(":
            depth += 1
            buf.append(ch)
        elif ch == ")":
            depth -= 1
            buf.append(ch)
        elif ch == "," and depth == 0:
            parts.append("".join(buf))
            buf = []
        else:
            buf.append(ch)
        i += 1
    if buf:
        parts.append("".join(buf))

    for raw in parts:
        s = raw.strip()
        if not s:
            continue
        low = s.lower()
        if low.startswith("primary key"):
            cols = re.search(r"\((.*)\)", s).group(1).replace("`", '"')
            pk_cols = [c.strip() for c in cols.split(",")]
            continue
        if low.startswith(("key ", "index ", "unique key", "unique index",
                           "fulltext", "spatial")):
            unique = "UNIQUE" if low.startswith("unique") else ""
            # extract optional index name and columns; accept ` or " quoting
            idx_match = re.match(
                r'(?:unique\s+)?(?:key|index)\s+'
                r'(?:[`"]?(?P<idx>[^`"(\s]+)[`"]?\s*)?'
                r'\((?P<cols>[^)]+)\)',
                s, re.IGNORECASE,
            )
            if not idx_match:
                continue
            idx_name = idx_match.group("idx") or f"k{len(indexes)}"
            # strip wrapping quotes/backticks just in case
            idx_name = idx_name.strip('`"')
            cols_raw = idx_match.group("cols")
            # MySQL prefix length like col(10) -> drop
            cols_raw = re.sub(r"\((\d+)\)", "", cols_raw)
            # normalise column quoting to double-quotes
            cols_norm = ", ".join(
                f'"{c.strip().strip(chr(96)).strip(chr(34))}"'
                for c in cols_raw.split(",") if c.strip()
            )
            indexes.append(
                f'CREATE {unique} INDEX IF NOT EXISTS '
                f'"idx_{name}_{idx_name}" ON "{name}" ({cols_norm});'.replace(
                    "CREATE  INDEX", "CREATE INDEX")
            )
            continue
        if low.startswith("constraint"):
            continue
        columns.append(rewrite_column_line(s))

    body_out = ",\n  ".join(columns)
    if pk_cols:
        body_out += f',\n  PRIMARY KEY ({", ".join(pk_cols)})'

    ddl = f'CREATE TABLE IF NOT EXISTS "{name}" (\n  {body_out}\n);'
    if indexes:
        ddl += "\n" + "\n".join(indexes)
    return ddl


def process_create_tables(text: str) -> str:
    """Find every CREATE TABLE statement (with depth-aware paren matching)
    and replace it with the SQLite-friendly version.
    """
    out_parts: list[str] = []
    cursor = 0
    for m in CREATE_TABLE_HEAD_RE.finditer(text):
        name = m.group("name")
        body_open = m.end() - 1  # position of '('
        body_close = find_matching_paren(text, body_open)
        # find the terminating ';' after the closing paren (and any
        # ENGINE=..., DEFAULT CHARSET=... clauses).
        semi = text.find(";", body_close)
        if semi == -1:
            raise ValueError(f"missing ';' for CREATE TABLE {name}")
        body = text[body_open + 1 : body_close]
        out_parts.append(text[cursor : m.start()])
        out_parts.append(rewrite_create_table(name, body))
        cursor = semi + 1
    out_parts.append(text[cursor:])
    return "".join(out_parts)


def rewrite_inserts(text: str) -> str:
    # backticks -> double quotes in INSERT INTO lines
    return re.sub(
        r'INSERT\s+INTO\s+`([^`]+)`',
        lambda m: f'INSERT INTO "{m.group(1)}"',
        text,
    )


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: rewrite_dump_for_sqlite.py <in.sql> <out.sql>",
              file=sys.stderr)
        return 2
    src = Path(sys.argv[1]).read_text(encoding="utf-8", errors="replace")

    # drop conditional comments and LOCK/UNLOCK
    src = CONDITIONAL_COMMENT.sub("", src)
    src = LOCK_LINE.sub("", src)

    # rewrite each CREATE TABLE (depth-aware)
    src = process_create_tables(src)

    # rewrite INSERT INTO `t` -> "t"
    src = rewrite_inserts(src)

    # leftover MySQL-only top-level statements
    src = re.sub(r"^\s*SET\s+.*?;\s*$", "", src, flags=re.MULTILINE)
    src = re.sub(r"^\s*--.*$", "", src, flags=re.MULTILINE)

    Path(sys.argv[2]).write_text(src, encoding="utf-8")
    print(f"  rewrote -> {sys.argv[2]} ({len(src)} chars)", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
