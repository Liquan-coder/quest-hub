/* Injected into a copy of index.html by test/run.sh. Plays every lesson of every topic with correct answers,
   lints every step (generated ones 60 times), then checks wrong answers, hearts, abbreviations and the review list.
   Writes the JSON report into a pre element with id RESULT. */
window.__e=[];addEventListener('error',e=>__e.push(e.message+' @'+e.lineno));
addEventListener('load',()=>{const R={topics:{}};
const answer=()=>{const s=L.step;
 if(s.k==='choice'){pickOpt(s.a);onGo()}
 else if(s.k==='fill'){const t=$('#ti');t.value=s.ans[0];t.oninput();onGo()}
 else if(s.k==='order'){L.picked=[];const used=new Set();s.seq.forEach(w=>{const i=s.bank.findIndex((x,j)=>x===w&&!used.has(j));used.add(i);L.picked.push(i)});onGo()}
 else if(s.k==='match'){s.pairs.forEach((p,i)=>{document.querySelector('.mt[data-side=l][data-i="'+i+'"]').click();document.querySelector('.mt[data-side=r][data-i="'+i+'"]').click()})}
 else if(s.k==='sort'){s.items.forEach((it,i)=>{L.ssel=i;document.querySelector('.bkh[data-b="'+it[1]+'"]').click()});onGo()}
 else if(s.k==='guide'){let g=0;while(L.state==='check'&&g++<50){L.gsel=s.steps[L.gi].a;onGo();if(L.state==='check')onGo()}}
 else if(s.k==='drag'){L.ord=s.seq.map((_,i)=>i);onGo()}
 else if(s.k==='range'){const st=s.step||1;let v=s.min;while(v<=s.max&&!s.ok(v))v+=st;const rg=$('#rg');rg.value=v;rg.oninput();onGo()}
 else if(s.k==='flash'){onGo();$('#yes').click();return 'advanced'}
 else if(s.k==='card'){onGo();return 'advanced'}};
R.kinds={};
const play=n=>{startLesson(n);let g=0;while(L&&!document.querySelector('.result')&&g++<400){const r=answer();if(r!=='advanced'&&!document.querySelector('.result')){if(L.state!=='cont')throw new Error('stuck in '+n.title+' on '+L.step.k);onGo()}}return !!document.querySelector('.rstamp')};
try{
 for(const t of TOPICS){S.topic=t.id;const nodes=t.allNodes,bad=[],lint=[],ids=new Set(),sid=new Set();
  nodes.forEach(n=>{if(ids.has(n.id))lint.push('duplicate lesson title: '+n.title);ids.add(n.id)});
  for(const n of nodes){
   if(!n.steps.length)lint.push('empty lesson: '+n.title);
   n.steps.forEach(d=>{if(sid.has(d.id))lint.push('duplicate step: '+d.id);sid.add(d.id);
    for(let i=0;i<(d.gen?60:1);i++){const s=inst(d);const where=n.title+' / '+String(s.q||s.title||'').replace(/<[^>]+>/g,'').slice(0,40);
     if(!['card','choice','fill','order','match','flash','sort','drag','range','guide'].includes(s.k))lint.push('unknown kind: '+where);
     if(s.k==='choice'){if(!(s.a>=0&&s.a<s.o.length))lint.push('answer index out of range: '+where);if(new Set(s.o.map(String)).size!==s.o.length)lint.push('duplicate options: '+where);if(!s.why)lint.push('missing why: '+where)}
     if(s.k==='fill'){if(!s.ans||!s.ans.length||s.ans.some(a=>a===''||/NaN|undefined/.test(a)))lint.push('bad answers: '+where);if(s.num&&s.ans.some(a=>isNaN(+a)))lint.push('num answer not a number: '+where);if(!s.show)lint.push('missing show: '+where)}
     if(s.k==='order'&&s.seq.some(w=>!s.bank.includes(w)))lint.push('order tile missing: '+where);
     if(s.k==='match'&&(new Set(s.pairs.map(p=>p[1])).size!==s.pairs.length||new Set(s.pairs.map(p=>p[0])).size!==s.pairs.length))lint.push('match duplicates: '+where);
     if(s.k==='flash'&&!s.a)lint.push('flash without answer: '+where);
     if(s.k==='sort'){if(s.cats.length<2||s.items.length<3)lint.push('sort too small: '+where);if(s.items.some(x=>!(x[1]>=0&&x[1]<s.cats.length)))lint.push('sort bucket out of range: '+where);if(s.cats.some((c,b)=>!s.items.some(x=>x[1]===b)))lint.push('empty bucket: '+where);if(new Set(s.items.map(x=>x[0])).size!==s.items.length)lint.push('duplicate sort items: '+where);if(!s.why)lint.push('missing why: '+where)}
     if(s.k==='drag'){if(s.seq.length<3||new Set(s.seq).size!==s.seq.length)lint.push('drag needs 3+ unique rows: '+where);if(s.start.every((v,i)=>v===i))lint.push('drag starts solved: '+where);if(!s.why)lint.push('missing why: '+where)}
     if(s.k==='guide'){if(!s.goal||!s.wrap||s.steps.length<2)lint.push('guide needs goal, wrap, 2+ steps: '+where);s.steps.forEach((g,j)=>{const w=where+' #'+(j+1);if(!(g.a>=0&&g.a<g.o.length))lint.push('guide answer out of range: '+w);if(new Set(g.o).size!==g.o.length)lint.push('guide duplicate options: '+w);if(!g.note)lint.push('guide step missing note: '+w);if(g.o.some((o,i)=>i!==g.a&&!g.miss[i]))lint.push('guide wrong option without explanation: '+w)})}
     if(s.k==='range'){const st=s.step||1,vals=[];for(let v=s.min;v<=s.max;v+=st)vals.push(v);if(!vals.some(v=>s.ok(v)))lint.push('range has no answer: '+where);if(s.ok(s.init))lint.push('range starts solved: '+where);if(s.init<s.min||s.init>s.max)lint.push('range init out of bounds: '+where);if(vals.some(v=>typeof s.view(v)!=='string'||/NaN|undefined|Infinity/.test(s.view(v))))lint.push('range view broken: '+where);if(!s.show||/NaN|undefined/.test(s.show))lint.push('range missing show: '+where)}}});
   for(let r=0;r<2;r++){const ok=play(n);if(!ok||L.wrong>0||L.hearts!==5)bad.push(n.title)}quit()}
  nodes.forEach(n=>n.steps.forEach(d=>{const k=d.gen?inst(d).k:d.k;R.kinds[k]=(R.kinds[k]||0)+1}));
  R.topics[t.id]={lessons:nodes.length,questions:nodes.reduce((a,n)=>a+n.steps.filter(s=>s.k!=='card').length,0),failedPlaythrough:[...new Set(bad)],lint:[...new Set(lint)].slice(0,30)};
  const st=tState();st.done={};st.wrong={}}
 // behaviour checks on the first topic
 S.topic=TOPICS[0].id;const nodes=topic().allNodes;
 const ch=nodes.find(n=>!n.exam&&n.steps.some(s=>s.k==='choice'&&!s.gen));startLesson(ch);while(L.step.k!=='choice')onGo();
 pickOpt((L.step.a+1)%L.step.o.length);onGo();R.wrongAnswer={hearts:L.hearts,requeued:!!L.queue[L.queue.length-1].retry,inReview:Object.keys(tState().wrong).length};quit();
 const ab=nodes.find(n=>n.steps.some(s=>s.abbr));if(ab){startLesson(ab);L.step=inst(ab.steps.find(s=>s.abbr));L.state='check';renderStep();$('#ti').value=L.step.abbr[0];$('#ti').oninput();onGo();R.abbreviationRejected=L.lastOk===false;quit()}
 startReview();R.reviewOpens=!!L;quit();
 render();R.pageOverflow=document.documentElement.scrollWidth>innerWidth;
}catch(e){R.exception=e.message+' '+(e.stack||'').slice(0,300)}
const o=document.createElement('pre');o.id='RESULT';o.textContent=JSON.stringify({R,errors:__e});document.body.append(o)});
