/* Topic: 電腦網路 期中 (CSB051, CH1–2). Past-paper data comes in as EXAM.net (see build.js). */
TOPIC_BUILDERS.push((()=>{
const EXAM=EXAMS.net;
const fromExam=(y,part,idx)=>EXAM[y].parts[part].items[idx];
/* ---------- RTT question generators (same arithmetic as the hub's simulator) ---------- */
const NS=[3,4,6,7,8];
const rtt={
  np:n=>(1+n)*2,
  p:n=>2+n,
  np2:n=>(1+Math.ceil(n/2))*2,
  p2:n=>3+Math.ceil((n-1)/2),
  two:(n,m)=>Math.max(2+(n-m),3+m)
};
const gNp=()=>{const n=pick(NS);return F(`HTML＋<b>${n}</b> 張圖<br>non-persistent，1 條連線。總共幾 RTT？`,[String(rtt.np(n))],rtt.np(n)+" RTT",`<code>(1 + ${n} JPEG) × 2 = ${rtt.np(n)}</code>`,{num:true})};
const gP=()=>{const n=pick(NS);return F(`HTML＋<b>${n}</b> 張圖<br>persistent，1 條連線。總共幾 RTT？`,[String(rtt.p(n))],rtt.p(n)+" RTT",`<code>2 + ${n} JPEG = ${rtt.p(n)}</code>`,{num:true})};
const gNp2=()=>{const n=pick(NS);return F(`HTML＋<b>${n}</b> 張圖<br>non-persistent，總共 <b>2 條</b>同時。總共幾 RTT？`,[String(rtt.np2(n))],rtt.np2(n)+" RTT",`<code>(1 + ⌈${n}/2⌉ JPEG) × 2 = (1 + ${Math.ceil(n/2)}) × 2 = ${rtt.np2(n)}</code>`,{num:true})};
const gP2=()=>{const n=pick(NS);return F(`HTML＋<b>${n}</b> 張圖<br>persistent，總共 <b>2 條</b>。第二條看完 HTML 才開。總共幾 RTT？`,[String(rtt.p2(n))],rtt.p2(n)+" RTT",`<code>2 + 1 + ⌈${n-1}/2⌉ = ${rtt.p2(n)}</code><br>第 3 趟舊線拿 1 張、新線握手，其餘 ${n-1} 張兩條分。`,{num:true})};
const gTwo=()=>{const n=pick([4,5,6,7]),m=pick([1,2,3].filter(x=>x<n));const a=2+(n-m),b=3+m,t=rtt.two(n,m);
  return F(`HTML＋<b>${n}</b> 張圖，其中 <b>${m}</b> 張在另一台。<br>persistent，兩台可同時連。總共幾 RTT？`,[String(t)],t+" RTT",`第一台 <code>2 + ${n-m} = ${a}</code>；第二台 <code>2 + 1 + ${m} = ${b}</code>。同時進行，取較慢的 <b>${t}</b>。`,{num:true})};

/* ---------- Concept question generators ---------- */
const gTx=()=>{const L=pick([500,1000,1250,1500]),R=pick([1,10]),ms=+(L*8/(R*1000)).toFixed(3);return F(`封包 <b>${L} bytes</b>，線路 <b>${R} Mbps</b>。transmission delay 幾 ms？`,[String(ms)],ms+" ms",`<code>${L} × 8 ÷ ${R},000,000 = ${ms} ms</code>`,{num:true})};
const gProp=()=>{const km=pick([200,1000,2000,4000]),ms=km/200;return F(`距離 <b>${km} km</b>，訊號速度 2×10⁸ m/s。propagation delay 幾 ms？`,[String(ms)],ms+" ms",`<code>${km},000 m ÷ 2×10⁸ m/s = ${ms} ms</code>`,{num:true})};
const gSF=()=>{const r=pick([1,2,3]),L=pick([8000,4000,2000]),R=pick([1,2]),n=r+1,ms=+(n*L/(R*1000)).toFixed(3);return F(`中間有 <b>${r}</b> 台路由器，封包 <b>${L} bits</b>，每段 <b>${R} Mbps</b>。傳完要幾 ms？（不計 propagation 和排隊）`,[String(ms)],ms+" ms",`${n} 段：<code>${n} × ${L} ÷ ${R},000,000 = ${ms} ms</code>`,{num:true})};
const gBottle=()=>{const a=shuffle([pick([100,50,20]),pick([10,5]),pick([2,1,8])]),m=Math.min(...a);return F(`路徑三段依序是 <b>${a.join("、")}</b> Mbps。throughput 最多幾 Mbps？`,[String(m)],m+" Mbps","看最慢的一段。",{num:true})};
const gTdm=()=>{const[R,n]=pick([[4,4],[8,4],[10,5],[6,3],[12,4]]),v=R/n;return F(`TDM：線路 <b>${R} Mbps</b>，一個 frame 有 <b>${n}</b> 個時槽。每條連線分到幾 Mbps？`,[String(v)],v+" Mbps",`<code>${R} ÷ ${n} = ${v}</code>`,{num:true})};
const gSucc=()=>{const P=[1,3,4,5,8,10,12,14],k=pick([0,2,6,7,9,11,13,15]),s=P.find(p=>p>=k)??P[0];return F(`key = <b>${k}</b>，歸哪個 peer？（peer：1、3、4、5、8、10、12、14）`,[String(s)],"Peer "+s,k>14?"比最大的 14 還大，繞回最小的 1。":`第一個大於等於 ${k} 的是 ${s}。`,{num:true})};
const gDist=()=>{const pool=[64,32,16,8];let d,hs,ms;do{d=1025+(Math.random()*2500|0);hs=[];for(let k=11;k>=0;k--)if(d&(1<<k))hs.push(1<<k);ms=pool.filter(x=>!hs.includes(x))}while(ms.length!==1);
  return C(`環上 4096 個 peer，距離是 <b>${d}</b>。哪個<b>不是</b>走過的距離？`,pool.map(String),pool.indexOf(ms[0]),`<code>${d} = ${hs.join(" + ")}</code>`,{keep:true})};
const gHops=()=>{const a=pick([20,100,256,700]),d=pick([513,1034,1300,2049,3000]),b=a+d;let n=0,hs=[];for(let k=11;k>=0;k--)if(d&(1<<k)){n++;hs.push(1<<k)}return F(`環上 4096 個 peer，有 2ᵏ 捷徑。Peer ${a} 查 Peer ${b}，要走幾步？`,[String(n)],n+" 步",`距離 ${d} = ${hs.join(" + ")}，有 ${n} 個 1。`,{num:true})};

/* ---------- Slider generators (Sl): drag a number, watch the result change ---------- */
const fmt=x=>String(+x.toFixed(3));
const batches=(n,k)=>{let h=`<div class="batch"><b>第 1 批</b><i class="h">HTML</i><span class="small muted">2 趟</span></div>`;
  for(let b=0,left=n;left>0;b++){const c=Math.min(k,left);left-=c;h+=`<div class="batch"><b>第 ${b+2} 批</b>${"<i>圖</i>".repeat(c)}<span class="small muted">2 趟</span></div>`}return h};
const gParR=()=>{const n=pick([5,6,7,8,9]),f=k=>(1+Math.ceil(n/k))*2,T=f(pick([2,3])),good=[1,2,3,4,5,6].filter(k=>f(k)===T);
  return Sl(`HTML＋<b>${n}</b> 張圖，non-persistent。<br>拉「同時開幾條連線」，讓總共剛好 <b>${T} RTT</b>。`,
    {min:1,max:6,init:1,unit:"條",label:"同時",ok:k=>f(k)===T,show:good.join(" 或 ")+" 條",
     view:k=>`${batches(n,k)}<code class="formula">(1 + ⌈${n}/${k}⌉) × 2 = ${f(k)} RTT</code>`},
    `圖每 ${good[0]} 張一批，${n} 張要 ${Math.ceil(n/good[0])} 批，加上 HTML 那批，每批 2 趟：<code>(1 + ${Math.ceil(n/good[0])}) × 2 = ${T}</code>。`)};
const gPersR=()=>{const n=pick([3,4,5,6,7,8,9]),T=2+n;
  return Sl(`persistent、1 條連線，抓完整頁花了 <b>${T} RTT</b>。<br>拉圖片張數，找出這頁有幾張圖。`,
    {min:1,max:12,init:n===1?2:1,unit:"張",label:"圖",ok:v=>v===n,show:n+" 張",
     view:v=>`<div class="batch"><b>開連線</b><i class="h">1 趟</i></div><div class="batch"><b>HTML</b><i class="h">1 趟</i></div><div class="batch"><b>圖</b>${"<i>1</i>".repeat(v)}</div><code class="formula">2 + ${v} = ${2+v} RTT</code>`},
    `persistent 只握手一次：<code>2 + n = ${T}</code>，所以 n = ${n}。`)};
const gTxR=()=>{const R=pick([2,4,8,16]),T=8/R;
  return Sl(`封包 <b>1000 bytes</b>。拉線路速率，讓 transmission delay 剛好 <b>${fmt(T)} ms</b>。`,
    {min:1,max:16,init:1,unit:"Mbps",label:"線路",ok:v=>v===R,show:R+" Mbps",
     view:v=>`<div class="rbars"><div class="rbar"><span>推上線</span><i style="width:${Math.round(8/v*30)}px"></i><span>${fmt(8/v)} ms</span></div></div><code class="formula">8000 bits ÷ ${v} Mbps = ${fmt(8/v)} ms</code>`},
    `transmission = L / R。<code>8000 ÷ (${R} × 10⁶) = ${fmt(T)} ms</code>。線路越快，推上線越快。`)};
const gBotR=()=>{const a=pick([8,10,12,15]),c=pick([5,6,7,9].filter(x=>x!==a)),m=Math.min(a,c);
  return Sl(`伺服器那段 <b>${a} Mbps</b>，你家那段 <b>${c} Mbps</b>。<br>拉中間那段的速率，找出<b>最少</b>要幾 Mbps，throughput 才能達到最大？`,
    {min:1,max:20,init:1,unit:"Mbps",label:"中間",ok:v=>v===m,show:m+" Mbps",
     view:v=>{const t=Math.min(a,v,c),row=(n,x)=>`<div class="rbar${x===t?" hot":""}"><span>${n}</span><i style="width:${x*9}px"></i><span>${x}</span></div>`;
       return `<div class="rbars">${row("伺服器",a)}${row("中間",v)}${row("你家",c)}</div><code class="formula">throughput = min(${a}, ${v}, ${c}) = ${t} Mbps</code>`}},
    `throughput 由最慢的一段決定。中間至少要跟另外兩段裡比較慢的一樣快，也就是 ${m}；再快也不會超過 ${m}。`)};
const gCircR=()=>{const[Lk,u]=pick([[100,25],[60,20],[120,30],[100,20],[90,30],[80,20]]),N=Lk/u;
  return Sl(`circuit switching：線路 <b>${Lk} Mbps</b>，每人通話時要 <b>${u} Mbps</b>。<br>拉人數，找出最多能同時服務幾人。`,
    {min:1,max:10,init:1,unit:"人",label:"",ok:v=>v===N,show:N+" 人",
     view:v=>`<code class="formula">${v} 人 × ${u} = ${v*u} Mbps</code>${v*u>Lk?`<span class="warn">超過 ${Lk} Mbps，第 ${v} 人預留不到資源</span>`:`<span class="small muted">還在 ${Lk} Mbps 以內</span>`}`},
    `電路交換要先預留：<code>${Lk} ÷ ${u} = ${N}</code>。就算有人沒在講話，資源也被佔著。`)};

/* ---------- Topic: computer networks midterm ---------- */
function buildNet(){return{
  id:"net",name:"電腦網路 期中",desc:"CH1–2，先練概念，考古題在最後",
  note:'看不懂概念時，回<a href="https://claude.ai/artifact/1HUUG2mEu1Eo4wFTNzzkQo" target="_blank" rel="noopener">學習區的總整理</a>。問答題和流程圖記得也要動筆練。',
  units:[
  {title:"RTT 大題",sub:"老師說必考，先把這個單元練熟",must:true,nodes:[
    {title:"4 條規則",steps:[
      K("先記這 4 條",`<ol style="margin:0;padding-left:20px"><li>開連線＝1 趟，拿一個檔案＝1 趟。</li><li>前 2 趟固定拿 HTML，有了它才知道有哪些圖。</li><li>每條連線一次只拿一個檔案（non-pipelined）。</li><li><b>non-persistent</b> 拿完就關；<b>persistent</b> 連線留著。</li></ol>`),
      C("建立一條 TCP 連線要幾 RTT？（題目的假設）",["1","2","0","看檔案大小"],0,"題目寫明 one round-trip delay is required to setup a TCP connection。"),
      C("為什麼前 2 趟一定是拿 HTML？",["要先有 HTML 才知道有哪些圖","HTML 檔案最小","伺服器規定的","圖片要等 TCP 關閉"],0,"HTML 裡才有圖片的網址。"),
      C("non-persistent 時，每拿一個檔案要幾 RTT？",["1","2","3","4"],1,"每個檔案都要重開連線：開連線 1 + 拿檔案 1。",{keep:true}),
      C("persistent 且連線已開好，再拿一個檔案要幾 RTT？",["0","1","2","3"],1,"不用再開連線，一問一答就好。",{keep:true}),
      C("non-pipelined 是什麼意思？",["拿到上一個檔案才問下一個","一次問完所有檔案","不用開 TCP","只能拿一個檔案"],0,"所以每個檔案各佔 1 趟。")
    ]},
    {title:"non-persistent",steps:[
      Gd("自己推出 non-persistent 的公式：HTML＋3 張圖為什麼是 8 RTT？",[
        {q:"瀏覽器想拿 HTML。送出「請給我 HTML」之前，一定要先做什麼？",o:["先跟伺服器建立 TCP 連線","什麼都不用，直接送","先把圖片下載下來","先換成 UDP 比較快"],a:0,
         miss:["","HTTP 是靠 TCP 送的，TCP 規定要先握手建立連線，才能開始傳資料。","還沒拿到 HTML，根本不知道這頁有哪些圖。","HTTP 一直都跑在 TCP 上，不會換成 UDP。"],
         why:"HTTP 跑在 TCP 上，TCP 要先握手。題目假設握手花 <b>1 RTT</b>。",note:"開連線：1 RTT"},
        {q:"連線建好了。送出請求、等 HTML 回來，又要多久？",o:["1 RTT","0，握手時就順便拿到了","2 RTT","看 HTML 多大，沒辦法算"],a:0,
         miss:["","握手只是確認雙方準備好了，還沒開始要檔案。","請求送過去、檔案傳回來，只有一來一回。","題目把傳檔案的時間忽略，只數來回幾趟。"],
         why:"請求過去、檔案回來，剛好一個來回。",note:"拿一個檔案：1 RTT"},
        {q:"HTML 拿到了。non-persistent 接著怎麼處理這條連線？",o:["關掉，下一個檔案要重新開","留著，繼續拿圖","交給另一台伺服器","改成一次要全部的圖"],a:0,
         miss:["","連線留著不關的是 <b>persistent</b>。","圖片也在同一台伺服器上，不用換。","一次要很多個是 pipelining，這題是 non-pipelined，一次只問一個。"],
         why:"non-persistent 的意思就是：一條連線只拿一個檔案，拿完就關。",note:"non-persistent：每個檔案都要重開連線"},
        {q:"所以在 non-persistent 下，<b>每個</b>檔案要花幾 RTT？",o:["2（開連線 1 + 拿檔案 1）","1","3","只有第一個要 2，後面的只要 1"],a:0,
         miss:["","只算了拿檔案，忘了每次都要先重開連線。","握手 1 + 拿檔案 1，沒有第三趟。","後面只要 1 是 persistent。non-persistent 每個檔案都要重新握手。"],
         why:"每個檔案都是「開連線 1 + 拿檔案 1」。",note:"每個檔案：2 RTT"},
        {q:"HTML＋3 張圖，一個一個依序抓，總共幾 RTT？",o:["8","4","5","6"],a:0,
         miss:["","4 是檔案數。每個檔案都要 2 RTT，不是 1。","5 是 persistent 的算法：握手 1 次，再拿 4 個檔案。","6 可能只算了 3 張圖 × 2，漏了 HTML 也要 2。"],
         why:"4 個檔案 × 2 = 8。",note:"HTML＋n 張圖 = (1 + n) 個檔案，各 2 RTT"}
      ],`<code class="formula">non-persistent：(1 + n) × 2</code>1 是 HTML、n 是圖片數，乘 2 是因為每個檔案都要「開連線＋拿檔案」。`),
      K("公式",`<code class="formula">1 條：(1 + n JPEG) × 2
2 條：(1 + ⌈n/2⌉ JPEG) × 2</code><p class="small muted" style="margin:0">⌈⌉ 是無條件進位。HTML 算 1 批，圖分批抓，每批 2 趟。</p>`),
      G(gNp),G(gNp),G(gNp2),G(gNp2),G(gNp2),G(gParR)
    ]},
    {title:"persistent",steps:[
      Gd("自己推出 persistent 的公式：為什麼是 2 + n？",[
        {q:"persistent 跟 non-persistent 差在哪？",o:["拿完一個檔案不關連線，下一個繼續用","一次把所有檔案一起要","不用 TCP","每個檔案用不同的伺服器"],a:0,
         miss:["","一次全要是 pipelining。這題是 non-pipelined，還是一次只問一個。","還是用 TCP。","圖片都在同一台伺服器上。"],
         why:"persistent＝連線持續開著，所以握手只要做一次。",note:"連線只開一次"},
        {q:"HTML＋3 張圖，persistent、1 條連線。總共要握手幾次？",o:["1 次","4 次","2 次","0 次"],a:0,
         miss:["","每個檔案都重新握手是 non-persistent。","只有一台伺服器、一條連線，開一次就一直用。","還是要先握手，才能開始傳。"],
         why:"只有一條連線，一開始握手一次就好。",note:"握手：1 RTT（只有一次）"},
        {q:"連線開著以後，HTML 和 3 張圖各要幾 RTT？",o:["各 1 RTT，共 4","4 個加起來只要 1 RTT","各 2 RTT，共 8","HTML 要 2，圖各要 1"],a:0,
         miss:["","non-pipelined：拿到上一個才能要下一個，不能 4 個一起要。","連線已經開著，不用再握手，每個只要 1。","HTML 也只要請求＋回應 1 趟；握手已經另外算過了。"],
         why:"連線開著，每個檔案只剩「請求＋回應」1 趟。",note:"每個檔案：1 RTT"},
        {q:"總共幾 RTT？",o:["5","4","8","6"],a:0,
         miss:["","漏了一開始握手的 1 RTT。","8 是 non-persistent，每個檔案都重新握手。","多算了一次握手。persistent 只握手 1 次。"],
         why:"握手 1 + HTML 1 + 3 張圖 = 5。",note:"1 + 1 + n = 2 + n"}
      ],`<code class="formula">persistent：2 + n</code>「2」是握手＋拿 HTML，後面 n 張圖各 1 RTT。跟 non-persistent 比，省下的就是每個檔案的重新握手。`),
      K("公式",`<code class="formula">1 條：2 + n JPEG
總共 2 條：2 + 1 + ⌈(n−1)/2⌉</code><p class="small muted" style="margin:0">第二條要看完 HTML 才開，握手佔 1 趟，這趟舊線順便拿 1 張圖。</p>`),
      G(gP),G(gP),G(gP2),G(gP2),G(gPersR)
    ]},
    {title:"兩台伺服器",steps:[
      K("公式",`<code class="formula">第一台：2 + 留在這台的圖
第二台：2 + 1 + 搬過去的圖
總共：取較慢的那台</code><p class="small muted" style="margin:0">第二台要等看完 HTML 才知道要連，所以從第 2 趟後開始，還要多 1 趟握手。</p>`),
      G(gTwo),G(gTwo),G(gTwo),G(gTwo),G(gTwo)
    ]},
    {title:"排流程圖",steps:[
      K("考卷要畫圖",`<p style="margin:0">每條連線畫一組 client、server，每趟畫一個來回的 V 字，再標上 TCP、HTML、JPEG。這一關先練順序，<b>答完到紙上畫一次</b>。</p>`),
      O("HTML＋2 張圖，<b>persistent</b>、1 條。照時間排出每一趟。",["TCP","HTML","JPEG1","JPEG2"],"總共 4 RTT，只握手一次。"+flow([{s:"S",seq:["TCP","HTML","JPEG1","JPEG2"]}])),
      O("HTML＋2 張圖，<b>non-persistent</b>、1 條。照時間排出每一趟。",["TCP","HTML","TCP","JPEG1","TCP","JPEG2"],"總共 6 RTT，每個檔案都要重新握手。"+flow([{s:"S",seq:["TCP","HTML","TCP","JPEG1","TCP","JPEG2"]}])),
      O("HTML＋3 張圖，persistent、1 條。照時間排出每一趟。",["TCP","HTML","JPEG1","JPEG2","JPEG3"],"總共 5 RTT。"+flow([{s:"S",seq:["TCP","HTML","JPEG1","JPEG2","JPEG3"]}])),
      O("HTML＋3 張圖，其中 2 張在另一台，persistent。<b>第二台</b>的連線依序做什麼？",["TCP","JPEG2","JPEG3"],"第二台從第 2 趟後才開始，總共 2 + 1 + 2 = 5 RTT。"+flow([{s:"S1",seq:["TCP","HTML","JPEG1"]},{s:"S2",start:2,seq:["TCP","JPEG2","JPEG3"]}]))
    ]}
  ]},
  {title:"封包的旅程",sub:"第 1 章：邊緣、延遲、吞吐量、交換、分層、安全",nodes:[
    {title:"邊緣與核心",steps:[
      K("網路分兩塊",`<p style="margin:0"><b>邊緣</b>是跑應用程式的 host，例如手機、筆電、伺服器。<b>核心</b>是轉送封包的 router。host 連到第一台 router（edge router）的那段叫 <b>access network</b>。</p>`),
      C("家裡的路由器只負責轉送封包，它算 host 嗎？",["不算，host 要跑應用程式","算，有 IP 就是 host","算，因為它在你家","要看有沒有開 Wi-Fi"],0,"router 屬於轉送設備，所以不算 host。"),
      C("你家光纖接到 ISP 第一台路由器的這段，叫什麼？",["access network","network core","IXP","data center"],0,"它把 host 接進網路。"),
      C("兩家 ISP 想直接互換流量，可以到哪裡接線？",["IXP","DNS server","access point","web cache"],0,"Internet Exchange Point 是 ISP 碰面 peering 的地方。"),
      C("光纖屬於哪種媒介？",["guided","unguided","wireless","shared radio"],0,"訊號沿著實體線路走。"),
      C("手機和 4G 基地台之間屬於哪種媒介？",["unguided","guided","twisted-pair","coaxial"],0,"訊號在空氣中傳。"),
      C("哪一項<b>不是</b> protocol 規定的內容？",["線路用什麼材質","訊息的格式","訊息的順序","收到訊息後的動作"],0,"protocol 只規定格式、順序和動作。"),
      C("路由器收到封包，查表決定從哪個出口送出，這個動作叫？",["forwarding","routing","peering","multiplexing"],0,"查表送出是 forwarding；建表、算路徑是 routing。")
    ]},
    {title:"四種延遲",steps:[
      Gd("分清楚 transmission 和 propagation：一個是「推上路」，一個是「在路上跑」",[
        {q:"把封包想成 10 台車的車隊，要通過收費站。收費站一次放行一台，把整個車隊放完要花時間。這段時間跟什麼有關？",o:["車隊有幾台車、收費站放行多快","收費站到下一站有多遠","車子在高速公路上開多快","路上塞不塞車"],a:0,
         miss:["","距離影響的是車子在路上開多久，跟放行多久無關。","車速影響的也是在路上開多久。","等前面的車放完才輪到你，那是排隊（queueing）。"],
         why:"放行時間 = 車數 ÷ 放行速度。換成封包：封包大小 L ÷ 線路速率 R。",note:"transmission：把整包推上線，L / R"},
        {q:"整個車隊出了收費站，開到下一站要多久，跟什麼有關？",o:["兩站的距離和車速","車隊有幾台車","收費站放行多快","下一站放行多快"],a:0,
         miss:["","車數影響的是放行時間，不是開過去的時間。","放行速度影響的是放行時間。","那是到了下一站之後的事。"],
         why:"開過去的時間 = 距離 ÷ 車速。換成封包：距離 d ÷ 訊號速度 s。",note:"propagation：在線路上跑，d / s"},
        {q:"把線路從 10 Mbps 升級到 100 Mbps，等於改變了什麼？",o:["收費站放行變快，transmission 變小","高速公路變短，propagation 變小","車速變快，propagation 變小","車隊變短了"],a:0,
         miss:["","距離沒變。","訊號在線路上跑的速度由材質決定（接近光速），跟 Mbps 無關。","封包大小 L 沒變。"],
         why:"Mbps 是線路速率 R，只出現在 L / R 裡。",note:"升級 Mbps 只會減少 transmission"},
        {q:"台北傳一個很小的封包（1 bit）到紐約，時間主要花在哪？",o:["propagation","transmission","兩個差不多","processing"],a:0,
         miss:["","1 bit 推上線幾乎是一瞬間。","距離上萬公里，在路上跑的時間大得多。","processing 只是檢查 header，非常短。"],
         why:"封包小、距離遠，propagation 為主；封包大、線路慢，transmission 為主。",note:"哪個大，要看封包大小和距離"}
      ],`<div class="tw"><table><tr><th></th><th>比喻</th><th>公式</th><th>改變它</th></tr><tr><td>transmission</td><td>收費站放行整個車隊</td><td>L / R</td><td>封包大小、線路速率</td></tr><tr><td>propagation</td><td>車隊開到下一站</td><td>d / s</td><td>距離、訊號速度</td></tr></table></div>`),
      K("四種延遲",`<div class="tw"><table><tr><th>延遲</th><th>意思</th><th>算法</th></tr><tr><td>processing</td><td>檢查 header、決定出口</td><td>極短</td></tr><tr><td>queueing</td><td>在出口排隊</td><td>看塞車</td></tr><tr><td>transmission</td><td>把封包推上線路</td><td><code>L / R</code></td></tr><tr><td>propagation</td><td>訊號在線路上跑</td><td><code>d / s</code></td></tr></table></div>`),
      C("尖峰時段變慢，但距離和線路都沒變。主要是哪種延遲變大？",["queueing","propagation","transmission","processing"],0,"流量變多，排隊就變久。"),
      C("把線路速率升級，距離不變。哪種延遲<b>不受影響</b>？",["propagation","transmission","兩個都受影響","兩個都不受影響"],0,"propagation 是 d/s，跟線路速率無關。"),
      G(gTx),G(gTx),G(gProp),G(gProp),
      F("一段線路 transmission 8 ms、propagation 10 ms，不計其他延遲。整包到對方要幾 ms？",["18"],"18 ms","<code>8 + 10 = 18</code>。最後一個 bit 推出去後，還要在線路上跑完。",{num:true}),
      C("buffer 已滿時又來一個封包，會怎樣？",["封包被丟掉","路由器當機","封包插到最前面","線路速率變快"],0,"這就是 packet loss。buffer 變大比較不會丟，但可能排得更久。"),
      D("封包經過一台路由器，依序花掉哪四種延遲？",["processing：檢查 header、決定出口","queueing：在出口排隊","transmission：把整包推上線路","propagation：在線路上跑到下一站"],"先決定往哪走，再排隊；輪到了才推上線，最後在線路上跑到下一站。"),
      B("每個改變影響的是哪一種延遲？",["transmission（L / R）","propagation（d / s）"],[["封包從 1000 bytes 變成 1500 bytes",0],["線路從 10 Mbps 升級到 100 Mbps",0],["兩台路由器的距離從 100 km 變 1000 km",1],["訊號在線路上跑得更快",1]],"transmission 看封包大小 L 和線路速率 R；propagation 看距離 d 和訊號速度 s。"),
      G(gTxR)
    ]},
    {title:"即時語音算一次",steps:[
      K("語音多了一段等待",`<code class="formula">總時間 = 湊滿一包 + transmission + propagation</code><p class="small muted" style="margin:0">bit 產生後，要等封包湊滿才能送出。這段最容易漏掉。</p>`),
      K("題目設定",`<p style="margin:0">語音 64 kbps，封包 80 bytes，線路 1 Mbps，propagation 5 ms。</p>`),
      F("湊滿一包要幾 ms？",["10"],"10 ms","<code>80 × 8 = 640 bits；640 ÷ 64000 = 0.01 s</code>",{num:true}),
      F("transmission 是幾 ms？",["0.64"],"0.64 ms","<code>640 bits ÷ 1,000,000 bps = 0.00064 s</code>",{num:true}),
      F("從 bit 產生到解碼，總共幾 ms？",["15.64"],"15.64 ms","<code>10 + 0.64 + 5 = 15.64</code>",{num:true})
    ]},
    {title:"Store-and-forward",steps:[
      K("公式",`<code class="formula">經過 N 段線路：N × L / R</code><p class="small muted" style="margin:0">每台路由器都要收完整包才往外送。這裡先不計 propagation 和排隊。</p>`),
      C("來源和目的地之間有 1 台路由器，總共幾段線路？",["2","1","3","4"],0,"來源 → 路由器 → 目的地。",{keep:true}),
      C("來源和目的地之間有 3 台路由器，總共幾段線路？",["4","3","5","6"],0,"段數 = 路由器數 + 1。",{keep:true}),
      G(gSF),G(gSF),G(gSF),
      C("路由器什麼時候才開始送出第 1 個 bit？",["收到整包之後","收到第 1 個 bit 時","收到一半時","排隊結束前"],0,"這就是 store-and-forward。")
    ]},
    {title:"吞吐量",steps:[
      K("看最細的水管",`<p style="margin:0">端到端的 <b>throughput</b> 由路徑上最慢的那段決定，那段叫 <b>bottleneck link</b>。</p>`),
      G(gBottle),G(gBottle),G(gBottle),
      C("線路標示 100 Mbps，實際下載測到 30 Mbps。30 Mbps 是什麼？",["throughput","bandwidth","latency","propagation"],0,"bandwidth 是線路上限，throughput 是實際速率。"),
      C("伺服器上傳 1 Gbps，你家下載 10 Mbps，中間都很快。伺服器升到 10 Gbps 會變快嗎？",["不會，瓶頸在你家","會快 10 倍","會快 2 倍","要看 DNS"],0,"最慢的那段沒變。"),
      C("「傳完 80 Mb 的檔案，路徑最慢一段 10 Mbps」大約要多久？",["8 秒","80 秒","0.8 秒","800 秒"],0,"<code>80 ÷ 10 = 8</code>。",{keep:true}),
      G(gBotR),G(gBotR)
    ]},
    {title:"電路 vs 封包交換",steps:[
      K("差別",`<div class="tw"><table><tr><th></th><th>circuit</th><th>packet</th></tr><tr><td>資源</td><td>先預留</td><td>不預留，用時再搶</td></tr><tr><td>切法</td><td>TDM、FDM</td><td>切成封包</td></tr><tr><td>缺點</td><td>沒用也佔著</td><td>可能排隊</td></tr></table></div>`),
      C("打電話前先把整條路的資源預留好，這是？",["circuit switching","packet switching","pipelining","peering"],0,"資源預留是電路交換的特徵。"),
      C("把線路依<b>時間</b>切成時槽，每條連線輪流用，這是？",["TDM","FDM","DNS","CDN"],0,"Time-Division Multiplexing。切頻率才是 FDM。"),
      G(gTdm),G(gTdm),
      K("換個數字",`<p style="margin:0">線路 100 Mbps，每人傳送時用 50 Mbps，但只有 <b>50%</b> 的時間在傳。總共 3 人。</p>`),
      F("circuit switching 最多服務幾人？",["2"],"2 人","<code>100 ÷ 50 = 2</code>",{num:true}),
      F("3 人同時傳的機率？（寫小數）",["0.125",".125"],"0.125","<code>0.5³ = 0.125</code>",{num:true}),
      F("佇列變長的時間比例？（寫小數）",["0.125",".125"],"0.125","只有 3 人同時傳時，150 才會大於 100。",{num:true}),
      F("佇列變短的時間比例？（寫小數）",["0.5",".5"],"0.5","最多 1 人在傳：<code>0.125 + 0.375 = 0.5</code>。剛好 2 人時輸入等於輸出，佇列不變。",{num:true}),
      B("每個特徵屬於哪一種交換？",["circuit switching","packet switching"],[["通話開始前先預留資源",0],["用 TDM 或 FDM 切線路",0],["沒在傳的時候資源也被佔著",0],["store-and-forward",1],["可能要排隊，也可能掉封包",1],["使用者斷斷續續傳時，能服務更多人",1]],"電路交換先預留、保證品質；封包交換按需搶用，適合斷斷續續（bursty）的流量。"),
      G(gCircR)
    ]},
    {title:"分層與封裝",steps:[
      K("往下一層，多包一層",`<code class="formula">message → segment → datagram → frame
應用層    傳輸層    網路層     鏈路層</code>`),
      O("傳送端由上往下，資料的名字依序是？",["message","segment","datagram","frame"],"每往下一層就多包一個 header，這叫 encapsulation。"),
      M("把東西和它所在的層配起來",[["HTTP","application"],["port number","transport"],["IP address","network"],["802.11","link"]]),
      C("傳輸層把 header 加到 message 外面後，叫什麼？",["segment","datagram","frame","bit"],0,"再往下加 IP header 才是 datagram。"),
      C("路由器處理封包，最高處理到哪一層？",["network","transport","application","physical"],0,"它看 IP 位址決定怎麼轉送。"),
      C("哪個協定是所有上網設備都需要的共通語言？",["IP","TCP","HTTP","SMTP"],0,"router 不一定跑 TCP 或 HTTP，但一定要有 IP。"),
      D("網際網路的協定堆疊，由上往下排",["application","transport","network","link","physical"],"五層：應用、傳輸、網路、鏈路、實體。往下每層多包一個 header。"),
      B("把每個協定放進它所在的層",["application","transport","network","link"],[["HTTP",0],["DNS",0],["TLS",0],["TCP",1],["UDP",1],["IP",2],["802.11（Wi-Fi）",3],["Ethernet",3]],"TLS 名字裡有 transport，但投影片說它實作在應用層，考古題考過。")
    ]},
    {title:"網路安全",steps:[
      M("把情境和攻擊配起來",[["大量流量塞爆網站","DoS"],["抄下經過的封包","packet sniffing"],["偽造來源位址","IP spoofing"],["攔截並修改轉帳金額","man-in-the-middle"]]),
      C("上萬台被駭的電腦同時攻擊同一個網站，這批電腦叫？",["botnet","CDN","torrent","proxy"],0,"受控制的電腦大軍。"),
      C("只送幾個特製訊息，就讓有漏洞的程式當掉，這是？",["vulnerability attack","bandwidth flooding","connection flooding","packet sniffing"],0,"不靠流量大，靠漏洞。"),
      C("哪種攻擊<b>只聽不改</b>？",["packet sniffing","man-in-the-middle","DoS","IP spoofing"],0,"它是被動的，所以很難察覺。"),
      C("哪個指令能看到路徑上經過哪些路由器？",["traceroute","nslookup","ipconfig","telnet"],0,"traceroute 會列出每一跳。"),
      C("哪個指令只會問 DNS，不會去碰目標主機？",["nslookup","ping","traceroute","telnet"],0,"它查的是名字對應。")
    ]}
  ]},
  {title:"HTTP",sub:"第 2 章：網頁怎麼拿到手",nodes:[
    {title:"HTTP 基本",steps:[
      K("先看網址",`<code class="formula">www.someschool.edu/someDept/pic.gif
└── host name ──┘ └── path name ──┘</code>`),
      C("<code>www.school.edu/cs/a.png</code> 的 host name 是？",["www.school.edu","/cs/a.png","a.png","cs"],0,"前面是主機，後面是路徑。"),
      F("網頁有 1 個 HTML、3 張圖、1 個音檔，總共幾個 object？",["5"],"5 個","每個檔案都是一個 object。",{num:true}),
      C("HTTP 跑在哪個傳輸協定上？（HTTP/1.1）",["TCP","UDP","IP","DNS"],0,"網頁不能掉資料。"),
      F("HTTP 伺服器預設的 port？",["80"],"80","HTTPS 才是 443。",{num:true}),
      C("HTTP 是 stateless，意思是？",["伺服器不記得之前的請求","連線不能重複使用","不能傳圖片","不用 TCP"],0,"要記住使用者就得靠 cookie。"),
      C("為什麼 HTTP 設計成 stateless？",["記狀態很複雜，當機時兩邊還可能不一致","這樣才能加密","因為 TCP 不能記狀態","這樣比較安全"],0,"投影片的說法：protocols that maintain state are complex。")
    ]},
    {title:"訊息格式",steps:[
      O("排出 HTTP 請求的第一行",["GET","/index.html","HTTP/1.1"],"依序是方法、URL、版本。",{extra:["200","OK"]}),
      O("排出 HTTP 回應的第一行",["HTTP/1.1","200","OK"],"依序是版本、狀態碼、狀態文字。",{extra:["GET","Host:"]}),
      C("header 結束的記號是？",["一行空行（\\r\\n）","一個句點","Connection: close","狀態碼"],0,"空行之後就是 body。"),
      C("哪個方法適合用來送登入表單（資料放 body）？",["POST","GET","HEAD","DELETE"],0,"放在 body，不會出現在網址上。"),
      C("<code>/search?q=dns</code> 這種把資料放網址的是？",["GET","POST","PUT","HEAD"],0,"資料接在 ? 後面。"),
      C("只想看 header、不要檔案內容，用哪個方法？",["HEAD","GET","POST","PUT"],0,"回應不含內容。"),
      C("要上傳檔案並取代伺服器上的舊檔，用哪個方法？",["PUT","HEAD","GET","TRACE"],0,"PUT 是 HTTP/1.1 才加入的。"),
      M("把情境和狀態碼配起來",[["網址打錯，找不到","404"],["網站搬家","301"],["成功","200"],["請求格式看不懂","400"],["HTTP 版本不支援","505"]])
    ]},
    {title:"Cookie",steps:[
      K("Cookie 的四個部分",`<ol style="margin:0;padding-left:20px"><li>回應裡的 <code>Set-Cookie</code></li><li>請求裡的 <code>Cookie</code></li><li>瀏覽器存的 cookie 檔</li><li>網站的後端資料庫</li></ol>`),
      O("第一次逛網站到再次造訪，依序發生什麼？",["普通請求","Set-Cookie","瀏覽器存檔","帶 Cookie 請求"],"伺服器發編號，瀏覽器存著，下次帶回去。"),
      C("Cookie 主要是用來解決什麼？",["HTTP 不記得使用者","封包會掉","DNS 太慢","傳輸速度太慢"],0,"用編號在多次請求之間保留狀態。"),
      C("你逛 A 網站，頁面嵌了 B 公司的廣告，B 設定的 cookie 叫？",["third-party cookie","first-party cookie","session ticket","manifest"],0,"你沒有選擇逛 B。"),
      C("B 公司怎麼知道你逛過 A 和 C？",["兩站都嵌 B 的內容，瀏覽器都帶同一個 cookie 和 Referrer","A 和 C 共用資料庫","DNS 會通知 B","B 監聽你家線路"],0,"同一個 cookie 值把紀錄串起來。"),
      C("在 HTTP（非 HTTPS）下，cookie 有什麼安全風險？",["明文傳輸，被竊聽後可冒用身分","cookie 會中毒","會讓 TCP 中斷","會讓 DNS 失效"],0,"這就是 session hijacking。"),
      C("哪一項<b>不是</b> cookie 的常見用途？",["減少 propagation delay","購物車","登入狀態","推薦內容"],0,"cookie 跟線路延遲無關。")
    ]},
    {title:"快取與 Proxy",steps:[
      K("問一下還能不能用",`<code class="formula">瀏覽器：If-Modified-Since: 日期
沒改過 → 304，不附內容
改過了 → 200，附新內容</code>`),
      C("你手上的圖片是最新的，伺服器回？",["304 Not Modified","200 OK","301","404"],0,"省下傳檔案的時間和流量。"),
      C("哪個日期欄位是<b>瀏覽器</b>送出的？",["If-Modified-Since","Last-Modified","Expires-At","Set-Cookie"],0,"Last-Modified 是伺服器給的。"),
      C("Proxy 沒有這個檔案（miss）時，下一步是？",["向原始伺服器要，存一份再回傳","直接回 404","叫瀏覽器自己去要","回傳舊版本"],0,"所以它同時是 client 也是 server。"),
      C("Proxy 為什麼能讓網頁變快？",["它離使用者比較近","它提高了光速","它取消 TCP","它壓縮 DNS"],0,"也能減少機構對外線路的流量。"),
      C("學校放一台 proxy，讓全校師生共用快取，這比較像？",["forward proxy","reverse proxy","DNS server","tracker"],0,"它站在使用者這邊。投影片沒定義 remote proxy，一般當成這一種。"),
      C("網站在一群後端伺服器前放一台，負責分流，這是？",["reverse proxy","forward proxy","local DNS","access point"],0,"它站在伺服器這邊。"),
      F("命中率 0.5，機構總需求 1.5 Mbps。對外線路的流量剩幾 Mbps？",["0.75",".75"],"0.75 Mbps","沒命中的才要往外抓：<code>0.5 × 1.5 = 0.75</code>",{num:true})
    ]},
    {title:"HTTP/2 與 HTTPS",steps:[
      K("HOL blocking",`<p style="margin:0">HTTP/1.1 照順序回應，大物件 O1 排第一時，後面的小物件都要等。HTTP/2 把物件切成 frame 輪流傳。</p>`),
      F("O1 要 8 格，O2、O3、O4 各 1 格。HTTP/1.1 照順序送，O2 第幾格送完？",["9"],"第 9 格","O1 佔掉前 8 格。",{num:true}),
      F("同一題改用 HTTP/2 輪流送，O2 第幾格送完？",["2"],"第 2 格","順序是 O1、O2、O3、O4，然後送完 O1 剩下的。",{num:true}),
      F("HTTP/2 輪流送時，O1 第幾格送完？",["11"],"第 11 格","總共 11 格，O1 最後完成，只比原本慢一點。",{num:true}),
      C("HTTP/2 跑在一條 TCP 上，還剩什麼問題？",["掉一個封包會卡住全部物件","不能設優先權","不能傳圖片","必須用 UDP"],0,"所以 HTTP/3 改走 QUIC。"),
      C("HTTP/3 底層用什麼？",["QUIC over UDP","TCP","IP only","SMTP"],0,"QUIC 是應用層協定，跑在 UDP 上。"),
      M("把 TLS 提供的東西和它防的事配起來",[["encryption","被偷看"],["data integrity","被竄改"],["end-point authentication","遇到冒牌網站"]])
    ]}
  ]},
  {title:"Email 與 FTP",sub:"第 2 章：四個協定比一比",nodes:[
    {title:"Email 流程",steps:[
      K("誰用什麼",`<code class="formula">Alice 的程式 → Alice 的伺服器：SMTP
Alice 的伺服器 → Bob 的伺服器：SMTP
Bob 的程式 ← Bob 的伺服器：IMAP / POP3 / HTTP</code>`),
      O("Alice 寄信給 Bob，信依序經過哪裡？",["Alice 的程式","Alice 的伺服器","Bob 的伺服器","Bob 的程式"],"信會先到自己的郵件伺服器，由伺服器互傳。"),
      C("兩台郵件伺服器之間用什麼傳信？",["SMTP","IMAP","POP3","FTP"],0,"SMTP 負責送信。"),
      C("Bob 想在手機和筆電都看到同一批信和資料夾，選哪個？",["IMAP","POP3 下載後刪除","SMTP","FTP"],0,"IMAP 把信留在伺服器。"),
      C("POP3 的「下載後刪除」有什麼缺點？",["換裝置就看不到舊信","不能收信","不能用 TCP","無法寄信"],0,"信已經從伺服器刪了。"),
      C("相較 HTTP 是 pull，SMTP 是？",["push","pull","stateless","P2P"],0,"寄件方主動把信推過去。"),
      C("SMTP 的內容要符合什麼格式？",["7-bit ASCII","UTF-32","任意二進位","HTML"],0,"投影片：message must be in 7-bit ASCII。"),
      C("SMTP 伺服器怎麼判斷信結束？",["一行只有句點（CRLF.CRLF）","對方關閉 TCP","Content-Length","空白行"],0,"範例裡的 . 就是結束記號。"),
      F("SMTP 的 port？",["25"],"25","",{num:true}),
      D("SMTP 寄信時，客戶端依序送出哪些指令？",["HELO","MAIL FROM","RCPT TO","DATA","QUIT"],"先打招呼，說寄件人、收件人，再用 DATA 送內容（單獨一行句點結束），最後 QUIT。")
    ]},
    {title:"FTP",steps:[
      K("FTP 開兩種連線",`<code class="formula">控制連線 port 21：登入、指令（全程開著）
資料連線 port 20：每傳 1 個檔案開 1 條</code>`),
      F("用 FTP 傳 3 個檔案，總共開幾條 TCP 連線？",["4"],"4 條","1 條控制 + 3 條資料。",{num:true}),
      F("用 FTP 傳 5 個檔案，總共開幾條 TCP 連線？",["6"],"6 條","1 條控制 + 5 條資料。",{num:true}),
      C("FTP 把指令放在另一條連線上，這叫？",["out-of-band","in-band","pipelining","multiplexing"],0,"HTTP 則是 in-band，指令和資料走同一條。"),
      C("FTP 是 stateful 還是 stateless？",["stateful，會記目前目錄和登入","stateless","只有資料連線有狀態","看 port"],0,"跟 HTTP 相反。"),
      C("指令 <code>RETR file.txt</code> 是做什麼？",["下載檔案","上傳檔案","列出目錄","登入"],0,"上傳是 STOR，列目錄是 LIST。")
    ]},
    {title:"四協定比較",steps:[
      K("題目問什麼就選什麼",`<div class="tw"><table><tr><th>題目問</th><th>答案</th></tr><tr><td>stateless、RTT 最少</td><td>HTTP</td></tr><tr><td>TCP 連線最多</td><td>FTP</td></tr><tr><td>push、身分可偽造</td><td>SMTP</td></tr><tr><td>回應格式不同</td><td>POP3</td></tr></table></div>`),
      C("收到一封寄件人是校長的詐騙信，寄件人被冒用。問題出在哪個協定？",["HTTP","FTP","SMTP","POP3"],2,"SMTP 不驗證寄件人。",{keep:true}),
      C("要傳 100 個檔案，哪個協定開的 TCP 連線最多？",["HTTP","FTP","SMTP","POP3"],1,"1 條控制連線，加上每個檔案各 1 條資料連線。",{keep:true}),
      C("哪個協定回 <code>+OK</code>、<code>-ERR</code>，不是三位數字？",["HTTP","FTP","SMTP","POP3"],3,"其他三個都有三位數狀態碼。",{keep:true}),
      C("哪個協定的伺服器完全不記得上一個請求？",["HTTP","FTP","SMTP","POP3"],0,"投影片也說 POP3 跨 session 無狀態，但四選一時選 HTTP。",{keep:true}),
      C("哪個協定走主動把內容推過去的模式？",["HTTP","FTP","SMTP","POP3"],2,"HTTP、POP3 都是對方來拿。",{keep:true}),
      C("哪個是 HTTP 和 SMTP 的<b>共同點</b>？",["都有 ASCII 指令和狀態碼","都是 pull","都一個回應只放一個物件","都 stateless"],0,"投影片的比較：both have ASCII command/response interaction, status codes。"),
      M("把協定和 port 配起來",[["HTTP","80"],["FTP 控制","21"],["FTP 資料","20"],["SMTP","25"]]),
      B("指令和資料走同一條連線嗎？",["in-band：同一條","out-of-band：另開一條"],[["HTTP",0],["SMTP",0],["POP3",0],["FTP",1]],"FTP 的指令走 port 21 的控制連線，檔案另開 port 20 的資料連線。")
    ]}
  ]},
  {title:"DNS",sub:"第 2 章：把名字查成 IP",nodes:[
    {title:"階層與角色",steps:[
      Gd("搞懂 DNS 為什麼要分成 root → TLD → authoritative 好幾層",[
        {q:"如果全世界的網域都放在<b>同一台</b> DNS 伺服器上，會怎樣？",o:["它一壞全世界都查不到，流量也扛不住，離多數人又很遠","比較快，因為只要問一次","比較安全，因為只有一台要顧","沒什麼差別"],a:0,
         miss:["","只問一次沒錯，但全世界都擠來問這一台，又離大部分人很遠，反而更慢。","只有一台，壞了就全部停擺，這叫單點故障，最不安全。","差很多：它一壞，全世界都查不到任何網址。"],
         why:"集中在一台有三個問題：單點故障、流量太大、距離太遠。所以要分散。",note:"一台扛全部：會壞、會塞、會遠"},
        {q:"改成分層後，root 只記「.com 去問誰、.edu 去問誰」。root 要記的東西變成？",o:["很少，只有各個 TLD 在哪","全世界所有的網址","每個人電腦的 IP","每個網站的網頁內容"],a:0,
         miss:["","root 不記個別網址，只指路到下一層。","DNS 記的是主機名稱對 IP，不記使用者電腦。","DNS 只查名字，網頁內容在網站伺服器上。"],
         why:"root 只負責指路：「.edu 的事去問 edu 的 TLD」。",note:"root：只知道各個 TLD 在哪"},
        {q:"umass.edu 新增一台主機 www2.umass.edu，要去改哪裡？",o:["umass.edu 自己的 authoritative server","root server","edu 的 TLD server","全世界的 local DNS"],a:0,
         miss:["","root 只知道 .edu 在哪，不管 umass 底下有什麼主機。","TLD 只記「umass.edu 的 authoritative 是誰」，不管它底下的主機。","local DNS 只是快取，過了 TTL 會自己重查。"],
         why:"每個組織管自己的 authoritative server，加主機不用麻煩上層。",note:"authoritative：每個組織管自己的主機"},
        {q:"你的電腦要查 www.umass.edu，<b>第一個</b>問的是誰？",o:["local DNS server","root server","edu 的 TLD server","umass.edu 的 authoritative"],a:0,
         miss:["","電腦不直接找 root，是交給 local DNS 去跑。","電腦不知道 TLD 在哪。","電腦還不知道它在哪，要一層一層問才知道。"],
         why:"local DNS 替你一路往上問，還會把結果存起來（快取），下次更快。",note:"local DNS：替你跑腿＋快取"}
      ],`<code class="formula">你的電腦 → local DNS → root → TLD → authoritative</code>root 指路到 TLD，TLD 指路到 authoritative，authoritative 才有真正的 IP。分層讓每台只管一小塊，壞一台也不會全倒。`),
      K("誰負責什麼",`<code class="formula">root → TLD（.com .edu）→ authoritative（umass.edu）
local DNS 替你跑腿，不嚴格屬於階層</code>`),
      O("從上到下，DNS 階層依序是？",["root","TLD","authoritative"],"local DNS 不在這條階層裡。",{extra:["registrar"]}),
      M("把名字和伺服器種類配起來",[[".edu","TLD server"],["umass.edu 自己的","authoritative"],["ISP 給你用的","local DNS"],["13 個邏輯伺服器","root"]]),
      C("電腦要查名字時，第一個問誰？",["local DNS","root","TLD","authoritative"],0,"local DNS 再替你往階層裡查。"),
      C("為什麼 DNS 不做成一台集中式伺服器？",["單點故障、流量太大、距離遠、難維護","因為 IP 不夠","因為 HTTP 不支援","因為 TCP 太慢"],0,"一句話：doesn't scale。"),
      C("哪一項<b>不是</b> DNS 提供的服務？",["加密網頁內容","host aliasing","mail server aliasing","load distribution"],0,"加密是 TLS 的工作。"),
      C("DNS 屬於哪一層的協定？",["application","transport","network","link"],0,"核心功能，但放在網路邊緣的應用層實作。")
    ]},
    {title:"資源紀錄",steps:[
      K("格式",`<code class="formula">(name, value, type, TTL)</code>`),
      M("把紀錄類型和 value 裝什麼配起來",[["A","IP 位址"],["NS","權威伺服器名字"],["CNAME","真正的主機名"],["MX","郵件伺服器名字"]]),
      C("<code>(dns1.foo.com, 212.212.212.1, ?)</code> 的 type 是？",["A","NS","CNAME","MX"],0,"名字對 IP。",{keep:true}),
      C("<code>(foo.com, dns1.foo.com, ?)</code> 的 type 是？",["A","NS","CNAME","MX"],1,"網域對權威伺服器的名字。",{keep:true}),
      C("www.ibm.com 其實是 servereast.backup2.ibm.com，這筆紀錄的 type 是？",["A","NS","CNAME","MX"],2,"別名對真正的名字。",{keep:true}),
      C("要寄信到 <code>bob@foo.com</code>，查哪種紀錄？",["A","NS","CNAME","MX"],3,"MX 指向郵件伺服器。",{keep:true}),
      C("TTL 是做什麼的？",["決定快取多久失效","決定封包大小","記錄建立日期","記錄查詢次數"],0,"注意：紀錄裡沒有 date。")
    ]},
    {title:"查詢方式與快取",steps:[
      K("兩種查法",`<p style="margin:0"><b>iterated</b>：「我不知道，你去問他。」<br><b>recursive</b>：「我幫你問到底。」</p>`),
      C("root 回「去問 .edu 的 TLD」，這是哪一種？",["iterated","recursive","pipelined","persistent"],0,"只告訴你下一個該問誰。"),
      C("哪一種會讓上層伺服器負擔比較重？",["recursive","iterated","兩者一樣","都沒有負擔"],0,"被問的伺服器要扛下整件事。"),
      F("電腦→local→root→TLD→authoritative 全部問過再回來，訊息總共幾則？",["8"],"8 則","投影片的圖就是 1 到 8。去 4 則、回 4 則。",{num:true}),
      F("local DNS 已快取 TLD 的位置，可略過 root。訊息變幾則？",["6"],"6 則","少了問 root 的一來一回。",{num:true}),
      C("網站剛換 IP，有人還連到舊 IP，為什麼？",["舊紀錄還在快取裡，TTL 還沒到","DNS 當機了","HTTP 不支援","TCP 有狀態"],0,"所以 DNS 是 best-effort。"),
      C("DNS 回覆怎麼對應到當初的查詢？",["identification 欄位相同","TTL 相同","port 都是 80","靠 cookie"],0,"16-bit 的編號。"),
      D("iterated 查詢：local DNS 依序做什麼？",["收到主機的查詢","問 root server","問 TLD server","問 authoritative server","把 IP 回給主機"],"root 和 TLD 都只回「下一個該問誰」，local DNS 自己一路問下去。")
    ]},
    {title:"註冊網域",steps:[
      O("新公司要讓大家連到 www.foo.com，依序做什麼？",["向 registrar 註冊","registrar 把 NS、A 寫進 TLD","權威伺服器加 www 的 A 紀錄"],"registrar 把權威伺服器的資訊放進 TLD，之後才查得到你。"),
      C("驗證網域沒重複、登記並收費的公司叫？",["registrar","registry office","root","tracker"],0,"投影片例子是 Network Solutions。"),
      C("要<b>擁有網域</b>，組織要架或委託哪種伺服器？",["authoritative","local","root","top-level"],0,"對外提供自己主機的 IP。"),
      C("要讓<b>內部電腦查名字</b>，組織要架哪種伺服器？",["local","authoritative","root","top-level"],0,"替內部電腦跑腿。"),
      C("公司想讓 foo.com 能收信，權威伺服器要加哪種紀錄？",["MX","A","CNAME","NS"],0,"MX 指向郵件伺服器。")
    ]}
  ]},
  {title:"P2P",sub:"第 2 章：大家互相傳",nodes:[
    {title:"Client-server vs P2P",steps:[
      Gd("搞懂為什麼 P2P 人越多也不會越慢（self-scalability）",[
        {q:"伺服器要把 1 GB 的檔案送給 10 個人，伺服器總共要上傳多少？",o:["10 GB","1 GB","0.1 GB","看網速，沒辦法算"],a:0,
         miss:["","每個人都要一整份，伺服器要送 10 份。","這是把 1 GB 分給 10 人，但每個人都要完整檔案。","題目問的是總量，跟速度無關。"],
         why:"每人一份完整檔案：10 × 1 GB。",note:"client-server：伺服器要上傳 N 份"},
        {q:"人數變成 1000 人，伺服器只靠自己上傳，時間會怎樣？",o:["要送 1000 GB，時間跟著人數線性變長","還是一樣快","只多一點點","反而變快"],a:0,
         miss:["","伺服器上傳速度固定，要送的量多了 100 倍。","要送的量變成 100 倍，不會只多一點。","沒有理由變快。"],
         why:"伺服器上傳速度固定，人越多要送越多份。",note:"人越多，client-server 越慢（線性）"},
        {q:"P2P 裡，Alice 下載到檔案的其中一塊後，可以做什麼？",o:["把這塊傳給其他還沒有的 peer","只能自己用","要先還給伺服器","下載完才能分享"],a:0,
         miss:["","P2P 的重點就是每個 peer 也能上傳。","不用經過伺服器，peer 之間直接傳。","拿到一塊就可以分享那一塊，不用等全部下載完。"],
         why:"每個 peer 邊下載、邊把手上的碎片傳給別人。",note:"P2P：每個 peer 邊下載邊上傳"},
        {q:"所以人變多時，P2P 整體的上傳能力會怎樣？",o:["跟著變多，因為新來的 peer 也會上傳","不變，還是只有伺服器在傳","變少","歸零"],a:0,
         miss:["","peer 會互相傳，不是只有伺服器。","新來的人也會貢獻上傳能力，不會變少。","只要還有 peer 在線上，就能繼續傳。"],
         why:"需求（下載的人）和供應（上傳的人）一起增加。",note:"人多 → 上傳能力也多 = self-scalability"}
      ],`<p style="margin:0"><b>client-server</b>：只有伺服器在上傳，人越多越慢。<br><b>P2P</b>：每個 peer 都會上傳，人越多、供應也越多，所以撐得住。這叫 <b>self-scalability</b>。</p>`),
      K("差別",`<p style="margin:0"><b>client-server</b>：全部靠伺服器上傳。<br><b>P2P</b>：每個 peer 下載時也上傳，人越多供應也越多，這叫 <b>self-scalability</b>。</p>`),
      C("使用者暴增時，P2P 比較撐得住，因為？",["新 peer 同時帶來上傳能力","伺服器自動變快","不用 TCP","檔案會變小"],0,"需求和供應一起增加。"),
      F("檔案 100 MB，10 人要下載。伺服器上傳 10 MB/s，只靠伺服器至少幾秒？",["100"],"100 秒","總共要送 1000 MB：<code>1000 ÷ 10 = 100</code>",{num:true}),
      C("P2P 的管理為什麼比較複雜？",["peer 時有時無，IP 還會變","peer 不能上傳","要用 UDP","要買伺服器"],0,"這種來來去去叫 churn。"),
      C("哪個例子是 P2P？",["BitTorrent","瀏覽網頁","Gmail 網頁版","FTP"],0,"HTTP、IMAP、FTP 都是 client-server。"),
      C("server 的特徵是？",["一直開著、IP 固定","時開時關","IP 常變","彼此直接通訊"],0,"後面三個比較像 client 或 peer。"),
      B("每個描述屬於哪一種架構？",["client-server","P2P"],[["永遠開著、IP 固定的伺服器",0],["人越多，分發時間跟著線性變長",0],["Web 瀏覽",0],["人越多，上傳能力也跟著變多",1],["peer 來來去去（churn）",1],["BitTorrent",1]],"P2P 的每個 peer 下載時也上傳，所以有 self-scalability；代價是管理比較複雜。")
    ]},
    {title:"BitTorrent",steps:[
      K("流程",`<ol style="margin:0;padding-left:20px"><li>向 <b>tracker</b> 拿 peer 名單。</li><li>碎片從最少人有的開始要（<b>rarest first</b>）。</li><li>只傳給最快的 <b>4</b> 位，每 <b>10</b> 秒重選。</li><li>每 <b>30</b> 秒隨機挑一位（<b>optimistic unchoke</b>）。</li></ol>`),
      O("新 peer 加入後，依序發生什麼？",["向 tracker 註冊","拿到 peer 名單","連上鄰居","交換碎片"],"一開始手上沒有碎片，要慢慢累積。"),
      C("你有 3 個鄰居，各有不同碎片。依 rarest first，該先要哪個？",["只有 1 人有的碎片","3 人都有的碎片","檔案開頭的碎片","最大的碎片"],0,"稀有碎片先拿，才不會因為對方離開而斷貨。"),
      C("Alice 把上傳名額給誰？",["目前傳給她最快的 4 位","IP 最小的 4 位","最先加入的 4 位","隨機 4 位"],0,"其他人被 choke。"),
      C("某位新 peer 還沒傳過東西給 Alice，他怎麼可能拿到 Alice 的碎片？",["被 optimistic unchoke 選中","向 tracker 申請","付費","不可能"],0,"每 30 秒隨機挑一位。"),
      C("tit-for-tat 想鼓勵什麼？",["多上傳的人下載也快","少下載","用固定 IP","只連 4 個人"],0,"上傳越快，越容易找到好夥伴。"),
      C("Carol 完全不上傳，可能下載完整檔案嗎？",["可能，只是很慢","不可能，一定被踢除","可能，而且最快","要先付費給 tracker"],0,"靠別人的 optimistic unchoke。"),
      C("Carol 用多台不同 IP 的電腦 free-ride，效果呢？",["被選中的機會變多，再合併碎片","完全沒有差別","tracker 會直接封鎖","只會拿到重複碎片"],0,"可以協調各台要不同碎片。")
    ]},
    {title:"DHT",steps:[
      K("規則",`<code class="formula">key 歸 ID 大於等於它的第一個 peer
到底了就繞回最小的 peer</code><p class="small muted" style="margin:0">peer：1、3、4、5、8、10、12、14（ID 範圍 0–15）</p>`),
      G(gSucc),G(gSucc),G(gSucc),
      K("有捷徑時怎麼走",`<code class="formula">距離 = 終點 − 起點
寫成二進位，每個 1 走一步，由大到小</code><p class="small muted" style="margin:0">例：513 = 512 + 1，走 512 再走 1。</p>`),
      G(gDist),G(gDist),G(gHops),G(gHops),
      C("有捷徑的環，查詢訊息數大約是？",["O(log N)","O(N)","O(1)","O(N²)"],0,"每步至少走掉剩餘距離的最高位。"),
      C("為什麼每個 peer 要記<b>兩個</b>後繼者？",["一個離開時還接得上環","加快下載","省記憶體","給 tracker 用"],0,"這是用來處理 peer churn。"),
      C("Peer 5 突然離開，它的前一位 Peer 4 會怎麼做？",["把 8 當新的直接後繼，再問 8 的後繼","重建整個 DHT","通知 tracker","什麼都不做"],0,"投影片的例子。")
    ]}
  ]},
  {title:"串流與 CDN",sub:"第 2 章：影片怎麼送到你手上",nodes:[
    {title:"DASH 串流",steps:[
      K("DASH",`<p style="margin:0">影片切成小段，每段存多種畫質。<b>manifest file</b> 列出各畫質的 URL 和 bit rate，由<b>播放端</b>決定下一段要什麼。</p>`),
      C("看影片時網路突然變慢，DASH 會怎麼做？",["下一段改要較低的畫質","伺服器重新壓縮影片","改用 FTP","暫停 TCP"],0,"決定權在 client。"),
      C("DASH 裡，誰決定要哪個畫質？",["client","server","DNS","ISP"],0,"這叫 intelligence at client。"),
      C("播放端為什麼要先緩衝一段才開始播？",["吸收網路延遲的變動（jitter）","減少影片大小","加密內容","避免 DNS 查詢"],0,"播放速度要固定，網路延遲卻會變。"),
      C("manifest file 裡有什麼？",["各畫質的 URL 和 bit rate","使用者密碼","DNS 紀錄","影片的全部內容"],0,"播放端靠它選檔。"),
      M("把編碼方式和做法配起來",[["spatial coding","同一張圖內，重複顏色只記一次"],["temporal coding","只送跟上一張的差異"]])
    ]},
    {title:"CDN",steps:[
      K("兩種放法",`<p style="margin:0"><b>enter deep</b>：很多小叢集，深入 access ISP。<br><b>bring home</b>：幾十個大叢集，放在 IXP 或 POP。</p>`),
      C("把伺服器放進世界各地的 access ISP，這是？",["enter deep","bring home","peering","pipelining"],0,"Akamai 的做法。"),
      C("只蓋幾十個大機房，放在 IXP 附近，這是？",["bring home","enter deep","torrent","multihoming"],0,"Limelight 的做法。"),
      C("為什麼不用一台超大伺服器服務全世界？",["單點故障、壅塞、離遠處使用者很遠","機器買不到","HTTP 不允許","DNS 不支援"],0,"一句話：doesn't scale。"),
      O("Bob 看影片，CDN 依序怎麼把他導過去？",["向 local DNS 查","網站 DNS 回 CNAME","CDN 的 DNS 給 IP","向 CDN 伺服器要影片"],"關鍵是 CNAME 把查詢轉給 CDN。"),
      C("CDN 靠哪種 DNS 紀錄接手查詢？",["CNAME","MX","NS","TTL"],0,"指向 CDN 的網域。")
    ]}
  ]},
  {title:"填充題全名",sub:"20 分，2025 寫明縮寫不給分",nodes:[
    {title:"第 1 章全名",steps:[
      F("receives the <b>entire packet</b> before it can begin to transmit the first bit onto the outbound link",["store-and-forward"],"Store-and-forward","路由器要收到整包才往外送。",{en:true}),
      O("拼出全名：ISPs peer together, stand-alone building（IXP）",["Internet","Exchange","Point"],"寫 IXP 不給分。",{extra:["Interchange","Peering"]}),
      F("ISPs can peer together, stand-alone building with its own switches",["internet exchange point"],"Internet Exchange Point","2025 明寫縮寫不給分。",{en:true,abbr:["ixp"]}),
      F("thousands of compromised devices which the bad guys control",["botnet"],"botnet","被控制的受害電腦大軍。",{en:true}),
      F("defines the <b>format and the order</b> of messages, and the actions taken",["protocol"],"protocol","格式、順序、動作三件事。",{en:true}),
      O("拼出全名：documents of standards approved by IETF（RFC）",["Request","for","Comments"],"寫 RFC 不給分。",{extra:["Review","Reference"]}),
      F("documents of Internet standards approved by IETF, designated by numbers",["request for comments","requests for comments"],"Request for Comments","2025 明寫縮寫不給分。",{en:true,abbr:["rfc","rfcs"]}),
      F("the link that determines the end-to-end throughput",["bottleneck","bottleneck link"],"bottleneck","最慢的那段決定整條的 throughput。",{en:true})
    ]},
    {title:"第 1 章進階",steps:[
      F("the first router on a path from the end system",["edge router"],"edge router","網路邊緣的第一台路由器。",{en:true}),
      F("the ____ network connects an end system to the first router",["access"],"access","你家到第一台路由器那段。",{en:true}),
      F("____ delay: waiting at the output link, depends on congestion",["queueing","queuing"],"queueing","在出口排隊。",{en:true}),
      F("the router searches its ____ using the destination address",["forwarding table"],"forwarding table","查表決定走哪個出口。",{en:true}),
      F("resources along a path are <b>reserved</b> for the session: ____ networks",["circuit-switched","circuit switched","circuit switching"],"circuit-switched","先預留資源。",{en:true}),
      F("time is divided into frames, each frame into time slots",["time-division multiplexing","time division multiplexing"],"time-division multiplexing","切時間給每條連線。",{en:true,abbr:["tdm"]}),
      F("a layer appends a header and passes it to the lower layer",["encapsulation"],"encapsulation","每層多包一層 header。",{en:true}),
      F("a few well-crafted messages to a vulnerable application",["vulnerability attack","vulnerability attacks"],"vulnerability attack","DoS 的一類，少量但精準。",{en:true})
    ]},
    {title:"第 2 章全名",steps:[
      F("many autonomous peers join or leave simultaneously",["churn","peer churn"],"churn","peer 來來去去。",{en:true}),
      F("the incentive mechanism for trading in BitTorrent",["tit-for-tat"],"tit-for-tat","你傳給我，我才傳給你。",{en:true}),
      O("拼出全名：a line of packets is held up by the first packet",["head-of-line","blocking"],"HOL 的全名。",{extra:["end-of-line","queueing"]}),
      F("a line of packets is held up by the first packet",["head-of-line blocking"],"head-of-line blocking","前面的大物件擋住後面的小物件。",{en:true,abbr:["hol","hol blocking"]}),
      F("geographically distributed proxy servers for multiple providers",["content distribution network","content delivery network"],"content distribution network","把內容放到各地倉庫。",{en:true,abbr:["cdn"]}),
      F("CDN: large clusters at <b>tens of sites</b>, placed in IXPs",["bring home"],"bring home","少量大倉庫。",{en:true}),
      F("CDN: clusters in <b>access ISPs all over the world</b>",["enter deep"],"enter deep","深入各地 access ISP。",{en:true}),
      F("DASH: provides a URL for each version along with its bit rate",["manifest file","manifest"],"manifest file","播放端靠這份清單選畫質。",{en:true}),
      F("verifies the uniqueness of the domain name, collects a small fee",["registrar"],"registrar","網域註冊商。",{en:true}),
      F("software interface between a process and the network",["socket"],"socket","程式和網路之間的門。",{en:true}),
      F("the base station of 802.11 (WiFi)",["access point"],"access point","Wi-Fi 基地台。",{en:true})
    ]},
    {title:"關鍵字配對",steps:[
      M("把題目關鍵字和答案配起來",[["entire packet first","store-and-forward"],["peer together","Internet Exchange Point"],["compromised devices","botnet"],["IETF documents","Request for Comments"],["held up by first","head-of-line blocking"]]),
      M("再一組",[["join or leave","churn"],["tens of sites","bring home"],["access ISPs everywhere","enter deep"],["URL + bit rate","manifest file"],["BitTorrent incentive","tit-for-tat"]]),
      M("最後一組",[["time slots","time-division multiplexing"],["resources reserved","circuit-switched"],["add a header","encapsulation"],["first router","edge router"],["end-to-end throughput","bottleneck"]])
    ]}
  ]},
  {title:"2025 考卷",sub:"考古題：沒有愛心，答錯不重考，最後看分數",nodes:[
    {title:"2025 RTT 大題",exam:true,steps:[
      F("(a) HTML＋5 張圖，non-persistent，non-parallel",["12"],"12 RTT","老師的算法：<code>(1 + 5 JPEG) × 2 = 12</code>",{num:true,tag:"2025 問答 1"}),
      F("(b) persistent，non-parallel",["7"],"7 RTT","老師的算法：<code>2 + 5 JPEG = 7</code>",{num:true,tag:"2025 問答 1"}),
      F("(c) non-persistent，one additional parallel connection（總共 2 條）",["8"],"8 RTT","老師的算法：<code>(1 + ⌈5/2⌉ JPEG) × 2 = 8</code>",{num:true,tag:"2025 問答 1"}),
      F("(d) persistent，non-parallel，3 張圖在另一台，可同時連",["6"],"6 RTT","老師的算法：<code>2 + 1 + 3 JPEG = 6</code>"+flow([{s:"S1",seq:["TCP","HTML","JPEG1","JPEG2"]},{s:"S2",start:2,seq:["TCP","JPEG3","JPEG4","JPEG5"]}]),{num:true,tag:"2025 問答 1"})
    ]},
    {title:"2025 填充",exam:true,steps:EXAM.y2025.parts[0].items.map(i=>examFill(i,"2025"))},
    {title:"2025 單選",exam:true,steps:EXAM.y2025.parts[1].items.map(i=>examChoice(i,"2025"))},
    {title:"2025 問答",exam:true,steps:[examFlash(fromExam("y2025",2,1),"2025"),examFlash(fromExam("y2025",2,2),"2025")]}
  ]},
  {title:"2024 考卷",sub:"考古題：沒有愛心，答錯不重考，最後看分數",nodes:[
    {title:"2024 RTT 大題",exam:true,steps:[
      F("(a) HTML＋6 張圖，non-persistent，non-parallel",["14"],"14 RTT","<code>(1 + 6) × 2 = 14</code>",{num:true,tag:"2024 問答 1"}),
      F("(b) persistent，non-parallel",["8"],"8 RTT","<code>2 + 6 = 8</code>",{num:true,tag:"2024 問答 1"}),
      F("(c) persistent，以<b>總共 2 條</b>計算",["6"],"6 RTT","<code>2 + 1 + ⌈5/2⌉ = 6</code>。原題自相矛盾，同時寫了 two additional 和 two in total，作答時要先寫明假設。總共 3 條則是 5 RTT。",{num:true,tag:"2024 問答 1"})
    ]},
    {title:"2024 填充",exam:true,steps:EXAM.y2024.parts[0].items.map(i=>examFill(i,"2024"))},
    {title:"2024 單選",exam:true,steps:EXAM.y2024.parts[1].items.map(i=>examChoice(i,"2024"))},
    {title:"2024 問答",exam:true,steps:[examFlash(fromExam("y2024",2,1),"2024"),examFlash(fromExam("y2024",2,2),"2024")]}
  ]},
  {title:"2021–23 補充",sub:"考古題：2024、2025 沒考過的題目",nodes:[
    {title:"補充填充",exam:true,steps:EXAM.older.parts[0].items.map(i=>examFill(i))},
    {title:"補充單選",exam:true,steps:EXAM.older.parts[1].items.map(i=>examChoice(i))},
    {title:"補充問答",exam:true,steps:EXAM.older.parts[2].items.map(i=>examFlash(i))}
  ]}
  ],
  terms:[
    ["Store-and-forward","收到整包才往外送"],["Internet Exchange Point","IXP：多家 ISP 互連的大樓"],["botnet","被控制的受害電腦大軍"],["protocol","訊息的格式、順序、動作"],["Request for Comments","RFC：IETF 的標準文件"],["bottleneck link","決定端到端 throughput 的最慢那段"],["edge router","路徑上第一台路由器"],["access network","連到第一台路由器的那段"],["queueing delay","在出口排隊，變動最大"],["transmission delay","L/R，把封包推上線路"],["propagation delay","d/s，訊號在線路上跑"],["forwarding table","路由器用目的地址查的表"],["circuit-switched","資源先預留"],["time-division multiplexing","TDM：切時間"],["encapsulation","每層多包一層 header"],["vulnerability attack","少量精準訊息弄垮目標"],["packet sniffer","被動抄封包"],["man-in-the-middle","夾在中間，能改能刪"],["socket","程式和網路之間的門"],["access point","Wi-Fi 基地台"],
    ["GET / POST / HEAD / PUT","GET 資料在網址；POST 在 body；HEAD 只要 header；PUT 是 1.1 新增"],["200 / 301 / 304 / 404 / 505","OK／搬家／沒改過／找不到／版本不支援"],["Set-Cookie / Cookie","回應用 Set-Cookie；請求用 Cookie"],["Last-Modified / If-Modified-Since","伺服器回 Last-Modified；瀏覽器送 If-Modified-Since"],["head-of-line blocking","HOL：大物件擋住小物件"],["A / NS / CNAME / MX","名字→IP／權威伺服器／別名／郵件伺服器"],["authoritative / local","要擁有網域架 authoritative；要解析架 local"],["registrar","網域註冊商"],["tit-for-tat","只傳給傳最快的 4 位，每 10 秒重選"],["optimistic unchoke","每 30 秒隨機挑一位"],["rarest first","先要最少人有的碎片"],["churn","peer 不斷加入和離開"],["content distribution network","CDN：內容放各地"],["enter deep / bring home","深入 access ISP／幾十個大叢集"],["manifest file","DASH 的畫質與 URL 清單"]
  ]
}}
return buildNet;
})());
