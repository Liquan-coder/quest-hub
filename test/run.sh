#!/bin/zsh
# Usage: test/run.sh <scratch dir>   — builds, plays every lesson in headless Chrome, prints the JSON report.
set -e
DIR=${0:A:h}/..; OUT=${1:?scratch dir}; mkdir -p "$OUT"
node "$DIR/build.js"
python3 - "$DIR" "$OUT" <<'P'
import sys
d,o=sys.argv[1],sys.argv[2]
s=open(d+'/index.html',encoding='utf8').read();h=open(d+'/test/harness.js',encoding='utf8').read()
open(o+'/quest-test.html','w',encoding='utf8').write(s.replace('</body>','<script>'+h+'</script></body>'))
P
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --allow-file-access-from-files --window-size=500,900 --virtual-time-budget=30000 --dump-dom "file://$OUT/quest-test.html" 2>/dev/null \
 | python3 -c "import sys,re,html,json;m=re.findall(r'<pre id=\"RESULT\">(.*?)</pre>',sys.stdin.read(),re.S);print(json.dumps(json.loads(html.unescape(m[-1])),ensure_ascii=False,indent=1) if m else 'NO RESULT (page crashed?)')"
