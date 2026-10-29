// Requires @oai/artifact-tool in the Codex bundled Node runtime.
// Usage: node build.mjs <destination-directory> <A|B>
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';

const here=path.dirname(fileURLToPath(import.meta.url));
const out=path.resolve(process.argv[2] || './draft');
const theme=process.argv[3] || 'A';
const slides=JSON.parse(await fs.readFile(path.join(here,'slides.json'),'utf8'));
const sources=JSON.parse(await fs.readFile(path.join(here,'sources.json'),'utf8'));
await fs.mkdir(out,{recursive:true});
const C=theme==='B'
 ? {bg:'#101E2B',fg:'#F4F6F5',muted:'#AEBEC9',accent:'#55D5CD',line:'#3C515D'}
 : {bg:'#F5F4F0',fg:'#152E3D',muted:'#50616A',accent:'#007F83',line:'#D1D9D9'};
const p=Presentation.create({slideSize:{width:1280,height:720}});
function txt(s,t,x,y,w,h,size=27,color=C.fg,bold=false,font='Arial'){
 const a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 a.text=t;a.text.style={typeface:font,fontSize:size,color,bold:font==='Courier New'?true:bold,autoFit:'none',wrap:font==='Courier New'?'none':'square',insets:0};return a;
}
function table(s,headers,rows,widths,y,h,bodySize=26){
 const values=[headers,...rows];
 const t=s.tables.add({rows:values.length,columns:headers.length,left:68,top:y,width:1144,height:h,columnWidths:widths,values});
 t.borders.assign({fill:C.line,width:0.5,style:'solid'});
 t.styleOptions={headerRow:false,bandedRows:false};
 for(let r=0;r<values.length;r++){
  t.rows[r].height=h/values.length;
  for(let c=0;c<headers.length;c++){
   const a=t.getCell(r,c);a.fill=r===0?C.fg:C.bg;
   a.text.style={typeface:'Arial',fontSize:r===0?24:bodySize,color:r===0?C.bg:C.fg,bold:r===0,autoFit:'none',verticalAlignment:'middle',insets:{left:16,right:14,top:10,bottom:10}};
  }
 }
 return t;
}
function bottom(s,text,y=599,size=26){txt(s,text,68,y,1144,60,size,C.accent,true);}
function footer(s,d,i){
 txt(s,`${String(i+1).padStart(2,'0')} / ${slides.length}`,1140,675,75,22,16,C.muted);
 if(i===0){txt(s,'29 Ekim 2026',68,675,400,23,16,C.muted);return;}
 if(!d.sources.length)return;
 const refs=d.sources.map(k=>({run:`${k}  `,style:{typeface:'Arial',fontSize:'14px',color:C.muted},link:{uri:sources[k].url,isExternal:true}}));
 const a=txt(s,'',68,676,1035,23,14,C.muted);a.text=[[{run:'Kaynaklar: ',style:{typeface:'Arial',fontSize:'14px',color:C.muted}},...refs]];
}
for(const [i,d] of slides.entries()){
 const s=p.slides.add();s.background.fill=C.bg;
 if(d.kind==='cover'){
  txt(s,d.title,68,124,1144,210,78,C.fg,true);
  txt(s,d.subtitle,72,382,1130,70,42,C.accent);
  txt(s,d.tag,74,483,1125,55,28,C.muted);
 }else{
  txt(s,d.title,68,52,1150,68,44,C.fg,true);
  if(d.kind==='entrypoints'){
   txt(s,'Query DSL',68,154,530,48,32,C.accent,true);
   txt(s,'Dashboards > Dev Tools',68,217,530,47,27,C.fg,true);
   txt(s,'POST /logs_demo/_search',68,289,550,42,25,C.accent,false,'Courier New');
   txt(s,'JSON sorgu gövdesi.\nDev Tools ve uygulama API’si aynı\nSearch API üzerinden çalışır.',68,353,530,135,27,C.muted);
   txt(s,'PPL',672,154,530,48,32,C.accent,true);
   txt(s,'OpenSearch Plugins\n> Query Workbench > PPL',672,217,540,80,27,C.fg,true);
   txt(s,'POST /_plugins/_ppl',672,322,540,40,25,C.accent,false,'Courier New');
   txt(s,'{"query":"source=logs_demo"}',672,379,540,41,22,C.accent,false,'Courier New');
   txt(s,'SQL/PPL eklentisi gerekir.\nYeni Discover > Logs: 3.5+,\nworkspace ve yapılandırmaya bağlı.',672,442,540,117,25,C.muted);
   bottom(s,'API istemcisi: curl, Postman veya SDK. İndeks okuma yetkisi gerekir.',610,25);
  }
  if(d.kind==='recipes'||d.kind==='appendix_recipes'){
   table(s,['Amaç','DQL'],d.rows,[320,824],165,d.kind==='recipes'?365:417,24);
   bottom(s,d.bottom,d.kind==='recipes'?581:604,24);
  }
  if(d.kind==='agent_choices'){
   table(s,d.headers,d.rows,[300,500,344],176,365,25);
   bottom(s,d.bottom,578,25);
  }
  if(d.kind==='agent_api'){
   txt(s,'OpenSearch 3.2+. QueryPlanningTool + agentic_query_translator gerekir.',68,143,1144,65,25,C.muted);
   txt(s,d.code,68,242,1144,300,24,C.accent,false,'Courier New');
   bottom(s,d.bottom,588,26);
  }
  if(d.kind==='code_notes'||d.kind==='api_curl'){
   txt(s,d.intro,68,138,1144,67,25,C.muted);
   txt(s,d.code,68,213,1144,d.kind==='code_notes'?400:350,d.kind==='code_notes'?21:23,C.accent,false,'Courier New');
   if(d.extra)txt(s,d.extra,68,568,1144,36,22,C.muted);
   bottom(s,d.bottom,625,23);
  }
  if(d.kind==='two_code'){
   txt(s,d.intro,68,139,1144,69,25,C.muted);
   txt(s,d.left_title,68,242,550,64,27,C.fg,true);
   txt(s,d.right_title,672,242,540,64,25,C.fg,true);
   txt(s,d.left_code,68,327,550,260,21,C.accent,false,'Courier New');
   txt(s,d.right_code,672,327,540,260,21,C.accent,false,'Courier New');
   if(d.extra)txt(s,d.extra,672,560,540,38,20,C.muted);
   bottom(s,d.bottom,610,24);
  }
  if(d.kind==='dense_pairs'){
   d.rows.forEach(([a,b],j)=>{const y=159+j*70;txt(s,a,68,y,185,45,25,C.accent,true);txt(s,b,270,y,942,65,25,C.fg);});
   bottom(s,d.bottom,614,23);
  }
  if(d.kind==='source_list'){
   txt(s,'Birincil kaynaklar. Başlıklar tıklanabilir. Erişim: 29 Ekim 2026.',68,137,1144,45,25,C.muted);
   d.keys.forEach((k,j)=>{const x=j<8?68:672;const y=211+(j%8)*52;const label=k+'  '+sources[k].title;const a=txt(s,label,x,y,540,49,22,C.accent);a.text.get(label).link={uri:sources[k].url,isExternal:true};});
  }
  if(d.kind==='steps'){
   d.rows.forEach(([n,label,body],j)=>{const y=174+j*94;txt(s,n,68,y,80,58,42,C.accent);txt(s,label,170,y+2,200,48,29,C.fg,true);txt(s,body,375,y+4,835,62,27,C.muted);});
   bottom(s,d.bottom,592,26);
  }
  if(d.kind==='table'){
   table(s,d.headers,d.rows,i===2?[435,230,479]:[440,250,454],170,i===2?350:330);
   bottom(s,d.bottom,574,26);
  }
  if(d.kind==='dql'){
   txt(s,'Discover zaman filtresi: 29 Ekim, 10:00–10:15 UTC',68,143,1144,44,26,C.muted);
   txt(s,d.code,68,229,1144,100,29,C.accent,false,'Courier New');
   txt(s,'Alanı bulunan ve 200 olmayan kayıtlar',68,374,1144,50,29,C.fg,true);
   txt(s,d.code2,68,441,1144,50,30,C.accent,false,'Courier New');
   txt(s,'Yalnız “not status_code: 200” eksik alanları da kapsar.',68,510,1144,48,26,C.muted);
   bottom(s,d.bottom,601,26);
  }
  if(d.kind==='dsl'){
   txt(s,d.code,68,145,1144,446,23,C.accent,false,'Courier New');
   txt(s,'filter: skor üretmez. _source: dönen alanlar. size: en fazla 20 kayıt.',68,608,1144,45,25,C.fg,true);
  }
  if(d.kind==='ppl'){
   txt(s,'Örnek oturumu: UTC. API sorgusunda zaman sınırları açık.',68,143,1144,42,26,C.muted);
   txt(s,d.code,68,221,1144,309,26,C.accent,false,'Courier New');
   bottom(s,d.bottom,579,26);
  }
  if(d.kind==='ratio'){
   txt(s,'Sentetik örnek. Aynı servis ve eşit uzunluktaki pencereler.',68,144,1144,45,26,C.muted);
   table(s,d.headers,d.rows,[300,190,384,270],232,213);
   bottom(s,d.bottom,489,34);
   txt(s,'Pay ve payda aynı istek evreninden gelmeli.\nRetry, duplicate ve sampling sonucu değiştirebilir.',68,556,1144,79,27,C.muted);
  }
  if(d.kind==='pairs'||d.kind==='checklist'){
   const labelWidth=d.kind==='checklist'?265:205;
   d.rows.forEach(([a,b],j)=>{const y=177+j*99;txt(s,a,68,y,labelWidth,52,29,C.accent,true);txt(s,b,68+labelWidth+20,y+1,1124-labelWidth,78,27,C.fg);});
   bottom(s,d.bottom,605,24);
  }
  if(d.kind==='retention'){
   txt(s,d.number,68,153,575,94,68,C.accent,true);
   txt(s,d.label,646,166,565,100,27,C.muted);
   d.rows.forEach(([a,b],j)=>{const y=309+j*83;txt(s,a,68,y,230,48,29,C.fg,true);txt(s,b,326,y+2,886,65,27,C.muted);});
   bottom(s,d.bottom,595,27);
  }
 }
 footer(s,d,i);
 s.speakerNotes.text=d.notes+'\n\nKaynaklar (29 Ekim 2026):\n'+d.sources.map(k=>`${k}: ${sources[k].title}\n${sources[k].url}`).join('\n');
 const stem='slide-'+String(i+1).padStart(2,'0');
 const png=await p.export({slide:s,format:'png',scale:1});await fs.writeFile(path.join(out,stem+'.png'),new Uint8Array(await png.arrayBuffer()));
 const layout=await s.export({format:'layout'});await fs.writeFile(path.join(out,stem+'.json'),await layout.text());
}
await (await PresentationFile.exportPptx(p)).save(path.join(out,'candidate.pptx'));
console.log(`Created ${slides.length} draft slides in ${out}`);
