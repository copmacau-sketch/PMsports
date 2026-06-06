#!/bin/bash
# SPA E2E 验收：模拟浏览器登陆 → 调用 5 个 action → 验证 DbBridge 数据
# 用法: bash spa_e2e_test.sh [BASE_URL]
set -e
BASE="${1:-http://3.25.180.205:8080}"
COOKIE=$(mktemp)
trap "rm -f $COOKIE" EXIT

echo "=================================="
echo "Crown-Gold SPA × Odds-API 联调验收"
echo "BASE: $BASE"
echo "=================================="

ok() { printf "\033[32m✓\033[0m %s\n" "$1"; }
fail() { printf "\033[31m✗\033[0m %s\n" "$1"; FAILED=1; }

# 1. 登陆
echo
echo "--- 1) chk_login (ceshi1 / Test1234) ---"
LOGIN_RESP=$(curl -s -c "$COOKIE" -X POST "$BASE/transform.php" \
    --data-urlencode "p=chk_login" \
    --data-urlencode "langx=zh-cn" \
    --data-urlencode "username=ceshi1" \
    --data-urlencode "password=Test1234" \
    --data-urlencode "ver=-3ed5-iovation-0000-95881ae5676be3" \
    --data-urlencode "app=N" --data-urlencode "auto=HDICAD" --data-urlencode "blackbox=" \
    --data-urlencode "userAgent=$(echo Mozilla/5.0 | base64)" \
    --max-time 15)
UID_=$(echo "$LOGIN_RESP" | grep -oE '<uid>[^<]+' | sed 's/<uid>//')
MID_=$(echo "$LOGIN_RESP" | grep -oE '<mid>[^<]+' | sed 's/<mid>//')
STATUS_=$(echo "$LOGIN_RESP" | grep -oE '<status>[^<]+' | sed 's/<status>//')
if [ "$STATUS_" = "200" ] && [ -n "$UID_" ]; then
    ok "login status=200, uid=${UID_:0:16}..., mid=$MID_"
else
    fail "login failed: $LOGIN_RESP"
    exit 1
fi

# 共用 query 参数
COMMON="ts=test&uid=$UID_&mid=$MID_&langx=zh-cn"

# 2. get_league_count
echo
echo "--- 2) get_league_count ---"
R=$(curl -s -b "$COOKIE" -X POST "$BASE/transform.php" -d "p=get_league_count&$COMMON&gtype=FT" --max-time 15)
[[ "$R" == *"<gtype>FT</gtype>"* ]] && [[ "$R" == *"<P3_count>"* ]] \
    && ok "FT 计数节点存在" || fail "FT 计数缺失"

# 3. get_league_list_All
echo
echo "--- 3) get_league_list_All (early FT) ---"
R=$(curl -s -b "$COOKIE" -X POST "$BASE/transform.php" -d "p=get_league_list_All&$COMMON&gtype=FT&showtype=early" --max-time 15)
[[ "$R" == *'name="英超"'* ]] && ok "英超节点存在 (lid=101)" || fail "英超 region 缺失"
[[ "$R" == *'name="意甲"'* ]] && ok "意甲节点存在 (lid=102)" || fail "意甲 region 缺失"
[[ "$R" == *'name="世界杯"'* ]] && ok "世界杯节点存在 (lid=108)" || fail "世界杯 region 缺失"

# 4. get_page_count
echo
echo "--- 4) get_page_count ---"
R=$(curl -s -b "$COOKIE" -X POST "$BASE/transform.php" -d "p=get_page_count&$COMMON&gtype=FT&showtype=early" --max-time 15)
[[ "$R" == *'<pgcount id="101"'* ]] && ok "lid=101 计数存在" || fail "pgcount 缺失"

# 5. get_game_list (lid=101 EPL early)
echo
echo "--- 5) get_game_list lid=101 early ---"
R=$(curl -s -b "$COOKIE" -X POST "$BASE/transform.php" -d "p=get_game_list&$COMMON&gtype=FT&showtype=early&lid=101" --max-time 15)
COUNT=$(echo "$R" | grep -oE 'totalDataCount>[0-9]+' | head -1 | grep -oE '[0-9]+')
[[ "$COUNT" -ge 5 ]] && ok "至少 5 场 EPL (实际 $COUNT)" || fail "EPL 比赛太少 ($COUNT)"
[[ "$R" == *"<ior_mh>"*"</ior_mh>"* ]] && [[ "$R" != *"<ior_mh></ior_mh>"* ]] \
    && ok "独赢主队赔率非空" || fail "ior_mh 为空"
[[ "$R" == *"<ior_rh>"*"</ior_rh>"* ]] && [[ "$R" != *"<ior_rh></ior_rh>"* ]] \
    && ok "让球主队赔率非空" || fail "ior_rh 为空"

# 6. get_game_more
echo
echo "--- 6) get_game_more ecid=61301267 (Brighton vs Man Utd) ---"
R=$(curl -s -b "$COOKIE" -X POST "$BASE/transform.php" -d "p=get_game_more&$COMMON&gtype=FT&ecid=61301267&lid=101&isRB=N" --max-time 15)
[[ "$R" == *"<sw_M>Y</sw_M>"* ]]   && ok "独赢盘口已开" || fail "sw_M 缺失"
[[ "$R" == *"<sw_RE>Y</sw_RE>"* ]] && ok "让球盘口已开" || fail "sw_RE 缺失"
[[ "$R" == *"<sw_OU>Y</sw_OU>"* ]] && ok "大小盘口已开" || fail "sw_OU 缺失"
[[ "$R" == *"<sw_DC>Y</sw_DC>"* ]] && ok "双重机会已开" || fail "sw_DC 缺失"
[[ "$R" == *"<sw_TS>Y</sw_TS>"* ]] && ok "双方进球已开" || fail "sw_TS 缺失"
[[ "$R" == *"<sw_HM>Y</sw_HM>"* ]] && ok "半场独赢已开" || fail "sw_HM 缺失"
[[ "$R" == *"<sw_PD>Y</sw_PD>"* ]] && ok "波胆已开" || fail "sw_PD 缺失"
PD_COUNT=$(echo "$R" | grep -oE 'ior_H[0-9]+C[0-9]+>' | wc -l)
[[ "$PD_COUNT" -ge 20 ]] && ok "波胆赔率行 >= 20 (实际 $PD_COUNT)" || fail "波胆只有 $PD_COUNT 行"

echo
echo "=================================="
if [ -z "$FAILED" ]; then
    echo "全部通过 ✓"
    exit 0
else
    echo "有失败 ✗"
    exit 1
fi
