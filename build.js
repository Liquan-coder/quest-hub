// Builds the quest page.
//   index.html    full document, for local testing
//   artifact.html body content for the Artifact publisher (it adds its own doctype/head/body)
// Topics: every topics/*.js is inlined in name order. Past papers: EXAM_SOURCES maps a topic id to a
// hub exam page whose `const DB={...}` is pulled in as EXAMS[id].
const fs=require('fs'),os=require('os'),p=require('path');
const HUB=p.join(os.homedir(),'Documents/learning-hub');
const EXAM_SOURCES={net:'notes/computer-networks/midterm-exams.html'};
const exams={};
for(const[id,rel]of Object.entries(EXAM_SOURCES)){const x=fs.readFileSync(p.join(HUB,rel),'utf8');const m=x.match(/const DB=(\{[\s\S]*?\n\});?\n\nconst \$/);if(!m)throw new Error('no DB in '+rel);exams[id]=eval('('+m[1]+')')}
const topics=fs.readdirSync(p.join(__dirname,'topics')).filter(f=>f.endsWith('.js')).sort().map(f=>`/* ---- topics/${f} ---- */\n`+fs.readFileSync(p.join(__dirname,'topics',f),'utf8')).join('\n');
const src=fs.readFileSync(p.join(__dirname,'src.html'),'utf8');
for(const k of['/*__EXAMS__*/{}','/*__TOPICS__*/'])if(!src.includes(k))throw new Error('placeholder missing: '+k);
const safe=t=>t.replace(/<\/script/gi,'<\\/script');
const full=src.replace('/*__EXAMS__*/{}',()=>safe(JSON.stringify(exams))).replace('/*__TOPICS__*/',()=>safe(topics));
fs.writeFileSync(p.join(__dirname,'index.html'),full);
const body=full.replace(/^<!DOCTYPE html>\s*<html[^>]*>\s*<head>\s*<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*/i,'')
  .replace(/<\/head>\s*<body>\s*/i,'\n').replace(/\s*<\/body>\s*<\/html>\s*$/i,'\n');
if(/<\/?(html|head|body)[\s>]/i.test(body)||/<!doctype/i.test(body))throw new Error('skeleton tags left in artifact.html');
fs.writeFileSync(p.join(__dirname,'artifact.html'),body);
for(const m of full.matchAll(/<script>([\s\S]*?)<\/script>/g)){try{new Function(m[1])}catch(e){throw new Error('script syntax: '+e.message)}}
console.log('built: index.html',full.length,'bytes; artifact.html',body.length,'bytes; topics:',fs.readdirSync(p.join(__dirname,'topics')).join(', '));
