#!/usr/bin/env bash
# Curl-based login probe for /admin/, /d0/, /agents/.
# Resolves the math captcha via SSH session-file read.
set -u
BASE=http://3.25.180.205:8080
PEM=/Volumes/T7/Crown-gold/Crowngold.pem
SSH="ssh -o StrictHostKeyChecking=no -i $PEM ubuntu@3.25.180.205"

# (path, user, pwd, safe, layer)  — for /agents/ layer is co|su|ag
CASES=(
  "/admin/   abu777    Aa123456    -        ad"
  "/admin/   admin1    Aa123456    -        ad"
  "/admin/   Aa100000  Aa11223344  -        ad"
  "/admin/   Aa11111   Aa11223344  -        ad"
  "/d0/      d010101   Aa12345678  -        d0"
  "/agents/  d111111   Aa12345678  Aa123123 co"
  "/agents/  d222222   Aa12345678  Aa123123 su"
  "/agents/  aa1002    aa123123    -        ag"
  "/agents/  d223333   Aa12345678  -        ag"
  "/agents/  Aa10001   Aa11223344  -        ag"
)

for line in "${CASES[@]}"; do
  set -- $line
  path=$1; user=$2; pwd=$3; safe=$4; layer=$5
  echo "============================================================"
  echo "URL=$BASE$path  user=$user  layer=$layer"
  CK=$(mktemp)

  # 1. fetch verifycode.php (sets $_SESSION['hrhverifycode'])
  PHPSESSID=$(curl -sS -c "$CK" -o /dev/null -D - "$BASE${path}verifycode.php" \
              | grep -i 'set-cookie' | grep -oE 'PHPSESSID=[^;]*' | head -1 | cut -d= -f2)
  echo "PHPSESSID=$PHPSESSID"

  # 2. read session file
  SESS=$($SSH "sudo cat /var/lib/php/sessions/sess_$PHPSESSID 2>/dev/null")
  echo "session: $SESS"
  CAPCHA=$(echo "$SESS" | grep -oE 'verifycode\|i:[0-9]+;' | grep -oE '[0-9]+' | tail -1)
  echo "captcha=$CAPCHA"

  # 3. POST chk_login
  SAFE_PARAM=""
  if [ "$safe" != "-" ]; then SAFE_PARAM="--data-urlencode pwd_safe=$safe"; fi
  RESP=$(curl -sS -b "$CK" -c "$CK" -X POST "$BASE${path}transform.php" \
    --data-urlencode "p=login_chk" \
    --data-urlencode "ver=version-02-05" \
    --data-urlencode "login_layer=$layer" \
    --data-urlencode "username=$user" \
    --data-urlencode "pwd=$pwd" \
    $SAFE_PARAM \
    --data-urlencode "verifycode=$CAPCHA" \
    --data-urlencode "langx=zh-cn" \
    --data-urlencode "uid=" \
    --data-urlencode "auto=" \
    --data-urlencode "blackbox=" \
    --data-urlencode "userAgent=YnJvd3Nlcg==")
  echo "resp: $RESP"

  rm -f "$CK"
  echo
done
