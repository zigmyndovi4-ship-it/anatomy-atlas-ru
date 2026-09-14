import fs from 'node:fs';

function parse(file){
  const [header,...lines]=fs.readFileSync(file,'utf8').trimEnd().split('\n');
  const columns=header.split('\t');
  return lines.map(line=>Object.fromEntries(line.split('\t').map((value,index)=>[columns[index],value])));
}
function put(map,id,value){map[id]=value;}

const anatomy=JSON.parse(fs.readFileSync('public/models/anatomy-ru.json','utf8'));
const qa=parse('scripts/translation/normative-review.tsv');
const ta=parse('scripts/translation/ta-mapping.tsv');
const exact=parse('scripts/translation/exact-ta-review.tsv');
const qaById=new Map(qa.map(row=>[row.conceptId,row]));
const taById=new Map(ta.map(row=>[row.conceptId,row]));
const exactById=new Map(exact.map(row=>[row.conceptId,row]));
const high={};
for(const row of exact) if(row.decision==='SAFE_FIX') put(high,row.conceptId,row.final_ru);

const ord={first:'первый',second:'второй',third:'третий',fourth:'четвёртый',fifth:'пятый',sixth:'шестой',seventh:'седьмой',eighth:'восьмой',ninth:'девятый',tenth:'десятый'};
const ordN={first:'первое',second:'второе',third:'третье',fourth:'четвёртое',fifth:'пятое',sixth:'шестое',seventh:'седьмое',eighth:'восьмое',ninth:'девятое',tenth:'десятое'};
const finger={index:'указательный палец',middle:'средний палец',ring:'безымянный палец',little:'мизинец'};
const fingerGen={index:'указательного пальца',middle:'среднего пальца',ring:'безымянного пальца',little:'мизинца'};
const side={right:{nomM:'Правый',nomF:'Правая',nomN:'Правое',gen:'правого'},left:{nomM:'Левый',nomF:'Левая',nomN:'Левое',gen:'левого'}};

for(const [id,value] of Object.entries(anatomy)){
  const en=value.en.toLowerCase().trim();
  const m=en.match(/^(right|left) (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) rib$/);
  if(m) put(high,id,`${side[m[1]].nomN} ${ordN[m[2]]} ребро`);
  const c=en.match(/^(right|left) (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) costal cartilage$/);
  if(c) put(high,id,`${side[c[1]].nomM} ${ord[c[2]]} рёберный хрящ`);
  const plainRib=en.match(/^(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) rib$/);
  if(plainRib) put(high,id,`${ordN[plainRib[1]]} ребро`);
  const plainCartilage=en.match(/^(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) costal cartilage$/);
  if(plainCartilage) put(high,id,`${ord[plainCartilage[1]][0].toUpperCase()}${ord[plainCartilage[1]].slice(1)} рёберный хрящ`);
  if(en==='costal cartilage') put(high,id,'Рёберный хрящ');
  if(en==='third rib') put(high,id,'Третье ребро');
  if(en==='zone of jejunum') put(high,id,'Зона тощей кишки');
  if(en==='proximal part of jejunum') put(high,id,'Проксимальная часть тощей кишки');
  if(en==='middle part of jejunum') put(high,id,'Средняя часть тощей кишки');
  if(en==='distal part of jejunum') put(high,id,'Дистальная часть тощей кишки');
  if(en==='tensor fasciae latae') put(high,id,'Мышца, напрягающая широкую фасцию');
  if(en==='right tensor fasciae latae') put(high,id,'Правая мышца, напрягающая широкую фасцию');
  if(en==='left tensor fasciae latae') put(high,id,'Левая мышца, напрягающая широкую фасцию');
  if(en==='platysma') put(high,id,'Подкожная мышца шеи');
  if(en==='right platysma') put(high,id,'Правая подкожная мышца шеи');
  if(en==='left platysma') put(high,id,'Левая подкожная мышца шеи');
  const simpleFinger=en.match(/^(right|left) (index|middle|ring|little) finger$/);
  if(simpleFinger) put(high,id,`${side[simpleFinger[1]].nomM.replace('ый','ый')} ${finger[simpleFinger[2]]}`);
  const phalanx=en.match(/^(proximal|middle|distal) phalanx of (right|left) (index|middle|ring|little) finger$/);
  if(phalanx) put(high,id,`${phalanx[1]==='proximal'?'Проксимальная':phalanx[1]==='middle'?'Средняя':'Дистальная'} фаланга ${side[phalanx[2]].gen} ${fingerGen[phalanx[3]]}`);
  const plainPhalanx=en.match(/^(proximal|middle|distal) phalanx of (index|middle|ring|little) finger$/);
  if(plainPhalanx) put(high,id,`${plainPhalanx[1]==='proximal'?'Проксимальная':plainPhalanx[1]==='middle'?'Средняя':'Дистальная'} фаланга ${fingerGen[plainPhalanx[2]]}`);
  const toe=en.match(/^(right|left) little toe$/);
  if(toe) put(high,id,`${side[toe[1]].nomM} мизинец стопы`);
  const toePhalanx=en.match(/^(proximal|middle|distal) phalanx of (right|left) little toe$/);
  if(toePhalanx) put(high,id,`${toePhalanx[1]==='proximal'?'Проксимальная':toePhalanx[1]==='middle'?'Средняя':'Дистальная'} фаланга ${side[toePhalanx[2]].gen} мизинца стопы`);
  const palmar=en.match(/^(?:(medial|lateral) )?proper palmar digital (artery|vein) of (right|left) (index|middle|ring|little) finger$/);
  if(palmar){
    const prefix=palmar[1] ? (palmar[1]==='medial'?'Медиальная':'Латеральная')+' ' : '';
    const vessel=palmar[2]==='artery'?'артерия':'вена';
    put(high,id,`${prefix}собственно ладонная пальцевая ${vessel} ${side[palmar[3]].gen} ${fingerGen[palmar[4]]}`);
  }
}

const badSuggestion=/фаскиаэ|фасциаэ|латаэ|дигитал|хумэрал|ангулар|интринсик|дивисион|клустэр|кластер|нэураксис|скэлэтон|прэкоммуникатинг|улнарис/i;
const output=['conceptId\ten\tlatin_ta\tenglish_ta\tmapping_status\tcurrent_ru\tdecision\tfinal_ru\treason\tconfidence'];
const counts={KEEP:0,APPLY_HIGH:0,APPLY_MEDIUM:0,REVIEW:0};
for(const [conceptId,value] of Object.entries(anatomy)){
  const q=qaById.get(conceptId), t=taById.get(conceptId), e=exactById.get(conceptId);
  let decision='REVIEW',final_ru='',reason='Needs external Russian anatomical terminology verification.',confidence='LOW';
  if(e?.decision==='KEEP') {decision='KEEP';final_ru=value.ru;reason='Exact TA2 mapping; current Russian term is grammatical and semantically complete.';confidence='HIGH';}
  else if(e?.decision==='SAFE_FIX') {decision='APPLY';final_ru=e.final_ru;reason='Exact TA2 mapping and unambiguous Russian correction; no source information is lost.';confidence='HIGH';}
  else if(high[conceptId] && high[conceptId]!==value.ru){decision='APPLY';final_ru=high[conceptId];reason='FMA/TA2 structure family with unambiguous Russian grammatical normalization.';confidence='HIGH';}
  else if(q?.status==='FIX' && q.suggested_ru && !badSuggestion.test(q.suggested_ru)){decision='APPLY';final_ru=q.suggested_ru;reason=`Candidate from QA (${q.reason}); requires final Russian terminology review before application.`;confidence='MEDIUM';}
  else if(q?.status==='OK'){decision='KEEP';final_ru=value.ru;reason='No deterministic QA defect detected; normative Russian source not independently confirmed.';confidence='MEDIUM';}
  counts[decision === 'APPLY' ? (confidence === 'HIGH' ? 'APPLY_HIGH' : 'APPLY_MEDIUM') : decision]++;
  output.push([conceptId,value.en,t?.latin_ta||'',t?.english_ta||'',t?.mapping_status||'NO_MATCH',value.ru,decision,final_ru,reason,confidence].map(x=>String(x??'').replace(/\t|\r?\n/g,' ')).join('\t'));
}
fs.writeFileSync('scripts/translation/final-normative-review.tsv',output.join('\n')+'\n');
console.log(`total: ${output.length-1}`);for(const key of Object.keys(counts)) console.log(`${key}: ${counts[key]}`);
