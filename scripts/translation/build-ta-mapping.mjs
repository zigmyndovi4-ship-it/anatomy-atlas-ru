import fs from 'node:fs';
import vm from 'node:vm';

const TA2_URL='https://ta2viewer.openanatomy.org/static/js/main.0f36751c.chunk.js';
const anatomy=JSON.parse(fs.readFileSync('public/models/anatomy-ru.json','utf8'));
const qa=Object.fromEntries(fs.readFileSync('scripts/translation/normative-review.tsv','utf8').trimEnd().split('\n').slice(1).map(line=>{
  const [conceptId,en,current_ru,status]=line.split('\t');
  return [conceptId,{en,current_ru,status}];
}));

function normalize(value){
  return value.normalize('NFKC').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}
function withoutLaterality(value){
  return normalize(value).replace(/\b(?:left|right)\b/g,'').replace(/\s+/g,' ').trim();
}

const response=await fetch(TA2_URL);
if(!response.ok) throw new Error(`TA2Viewer request failed: ${response.status}`);
const bundle=await response.text();
const match=bundle.match(/234:function\(e\)\{e\.exports=JSON\.parse\('([\s\S]*?)'\)\}/);
if(!match) throw new Error('Could not locate the TA2Viewer terminology module.');
const terms=JSON.parse(vm.runInNewContext(`'${match[1]}'`));

const exact=new Map();
for(const entry of terms){
  const primary=entry.term;
  if(!primary?.la || !primary?.en) continue;
  const candidates=[primary.en,...(entry.synonyms?.en||[])];
  for(const english of candidates){
    const key=normalize(english);
    if(!exact.has(key)) exact.set(key,{latin:primary.la,english:primary.en,taId:entry.id,matchedEnglish:english});
  }
}

const rows=[];
const counts={EXACT:0,PROBABLE:0,NO_MATCH:0};
const qaExact={FIX:0,NEEDS_EXTERNAL_REVIEW:0};
for(const [index,[conceptId,value]] of Object.entries(anatomy).entries()){
  if(index%250===0) console.log(`Mapping concepts ${index+1}-${Math.min(index+250,Object.keys(anatomy).length)} of ${Object.keys(anatomy).length}`);
  const key=normalize(value.en);
  let match=exact.get(key);
  let mapping_status='EXACT';
  let confidence='1.00';
  let reason=match ? `Exact TA2 English match (TA2 id ${match.taId}${match.matchedEnglish!==match.english?', via official synonym':''}).` : '';
  if(!match){
    const base=exact.get(withoutLaterality(value.en));
    if(base && /\b(?:left|right)\b/i.test(value.en)){
      match=base;
      mapping_status='PROBABLE';
      confidence='0.86';
      reason=`TA2 base-term match after removing FMA left/right derivative; TA2 id ${base.taId}.`;
    }else{
      mapping_status='NO_MATCH';
      confidence='0.00';
      reason=/\b(?:part|branch|segment|division|wall|cluster|trunk)\b/i.test(value.en)
        ? 'No standalone TA2 English match; likely FMA aggregate, subdivision, derivative, or branch concept.'
        : 'No standalone TA2 English term or official synonym matched.';
    }
  }
  counts[mapping_status]++;
  const qaStatus=qa[conceptId]?.status;
  if(mapping_status==='EXACT' && (qaStatus==='FIX'||qaStatus==='NEEDS_EXTERNAL_REVIEW')) qaExact[qaStatus]++;
  rows.push([conceptId,value.en,value.ru,match?.latin||'',match?.english||'',mapping_status,confidence].map(x=>String(x??'').replace(/\t|\r?\n/g,' ')).join('\t'));
}

fs.writeFileSync('scripts/translation/ta-mapping.tsv',['conceptId\ten\tcurrent_ru\tlatin_ta\tenglish_ta\tmapping_status\tconfidence',...rows].join('\n')+'\n');
console.log(`EXACT count: ${counts.EXACT}`);
console.log(`PROBABLE count: ${counts.PROBABLE}`);
console.log(`NO_MATCH count: ${counts.NO_MATCH}`);
console.log(`FIX with EXACT mapping: ${qaExact.FIX}`);
console.log(`NEEDS_EXTERNAL_REVIEW with EXACT mapping: ${qaExact.NEEDS_EXTERNAL_REVIEW}`);
