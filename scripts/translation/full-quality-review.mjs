import fs from 'node:fs';

const source=JSON.parse(fs.readFileSync('public/models/anatomy-ru.json','utf8'));
const rows=Object.entries(source).map(([conceptId,value])=>({conceptId,...value}));
const batchSize=250;

const ordinal={
  first:['первый','первая','первое','первые'],second:['второй','вторая','второе','вторые'],
  third:['третий','третья','третье','третьи'],fourth:['четвёртый','четвёртая','четвёртое','четвёртые'],
  fifth:['пятый','пятая','пятое','пятые'],sixth:['шестой','шестая','шестое','шестые'],
  seventh:['седьмой','седьмая','седьмое','седьмые'],eighth:['восьмой','восьмая','восьмое','восьмые'],
  ninth:['девятый','девятая','девятое','девятые'],tenth:['десятый','десятая','десятое','десятые'],
};
const numberIndex={first:0,second:1,third:2,fourth:3,fifth:4,sixth:5,seventh:6,eighth:7,ninth:8,tenth:9};
const headGender={
  'артерия':'f','вена':'f','мышца':'f','кость':'f','ветвь':'f','часть':'f','стенка':'f','фасция':'f','грудина':'f','кишка':'f','фаланга':'f',
  'ребро':'n','тело':'n','сердце':'n','желудочко':'n','туловище':'n',
  'хрящ':'m','нерв':'m','бронх':'m','желудочек':'m','ствол':'m','сегмент':'m','узел':'m','орган':'m','сосуд':'m','палец':'m',
};
const lateralityForms={left:['Левый','Левая','Левое','Левые'],right:['Правый','Правая','Правое','Правые']};
const englishWords=/\b(?:fasciae|latae|digital|humeral|angular|intrinsic|division|cluster|neuraxis|sternum|branch|segment|wall|part|artery|vein|muscle|bone|nerve|left|right|of|the|and|superior|inferior|anterior|posterior|medial|lateral|central|transverse|ascending|descending|common|internal|external)\b/i;
const markerRules=[
  [/\bleft\b/i,/лев|лева|лево|левые/,'lost_information'],[/\bright\b/i,/прав|права|право|правые/,'lost_information'],
  [/sternum/i,/грудин/,'lost_information'],[/branch/i,/ветв/,'lost_information'],[/segment/i,/сегмент/,'lost_information'],
  [/part/i,/част/,'lost_information'],[/wall/i,/стен/,'lost_information'],[/artery/i,/артер/,'lost_information'],[/vein/i,/вен/,'lost_information'],
  [/muscle/i,/мышц/,'lost_information'],[/bone/i,/кост|кость/,'lost_information'],[/nerve/i,/нерв/,'lost_information'],
  [/rib/i,/ребр/,'lost_information'],[/cartilage/i,/хрящ/,'lost_information'],[/finger|toe/i,/пальц|мизин|указател|средн|безымян/,'lost_information'],
];

function titleCase(value){return value ? value[0].toUpperCase()+value.slice(1) : value;}
function replaceCase(value,pattern,replacement){return value.replace(pattern,replacement);}

function fixKnown(row){
  const en=row.en.toLowerCase();
  let ru=row.ru;
  const reasons=[];
  const add=(category,next)=>{if(next!==ru){ru=next; reasons.push(category);}};

  if(en.includes('tensor fasciae latae')){
    const prefix=/^правый\s+/i.test(ru)?'Правая ': /^левый\s+/i.test(ru)?'Левая ':'';
    add('terminology',`${prefix}мышца, напрягающая широкую фасцию`);
  }
  add('grammar',ru.replace(/сегмент артерия/gi,'сегмент артерии'));
  add('grammar',ru.replace(/зона грудина/gi,'зона грудины'));
  add('grammar',ru.replace(/(?:проксимальная|средняя|дистальная) часть тощая кишка/gi,m=>m.replace(/тощая кишка/i,'тощей кишки')));
  add('grammar',ru.replace(/сосудистое анастомоз/gi,'сосудистый анастомоз').replace(/венозная анастомоз/gi,'венозный анастомоз'));
  add('word_order',ru.replace(/((?:^|\s))(левый|правый)\s+(мизинца|указательного|средняя|среднего|кольцо)\s+палец(\s+стопы)?(?=\s|$)/gi,(m,prefix,side,finger,toe)=>{
    const value={мизинца:`мизинца${toe?' стопы':''}`,указательного:'указательного пальца',средняя:'среднего пальца',среднего:'среднего пальца',кольцо:'безымянного пальца'}[finger.toLowerCase()];
    return `${prefix}${side.toLowerCase()==='левый'?'левого':'правого'} ${value}`;
  }));
  add('word_order',ru.replace(/(указательного|средняя|среднего|кольцо|безымянного|мизинца|правый|левый) палец/gi,(m)=>({ 'средняя палец':'среднего пальца','кольцо палец':'безымянного пальца','указательного палец':'указательного пальца','мизинца палец':'мизинца','правый палец':'правого пальца','левый палец':'левого пальца'}[m.toLowerCase()]||m)));

  const head=[...Object.keys(headGender)].reverse().find(noun=>new RegExp(`(?:^|\\s)${noun}(?=\\s|$)`,'i').test(ru));
  const gender=head ? headGender[head] : null;
  if(gender){
    for(const side of ['left','right']){
      const forms=lateralityForms[side];
      const re=new RegExp(`((?:^|\\s))${forms[0]}(?=\\s|$)`,'gi');
      if(gender!=='m' && re.test(ru)) add('laterality',ru.replace(re,(_,prefix)=>`${prefix}${forms[gender==='f'?1:2]}`));
      const re2=new RegExp(`((?:^|\\s))${forms[1]}(?=\\s|$)`,'gi');
      if(gender==='m' && re2.test(ru)) add('laterality',ru.replace(re2,(_,prefix)=>`${prefix}${forms[0]}`));
      const re3=new RegExp(`((?:^|\\s))${forms[2]}(?=\\s|$)`,'gi');
      if(gender==='f' && re3.test(ru)) add('laterality',ru.replace(re3,(_,prefix)=>`${prefix}${forms[1]}`));
      if(gender==='n' && re3.test(ru)) add('laterality',ru.replace(re3,(_,prefix)=>`${prefix}${forms[2]}`));
    }
  }

  for(const [name,forms] of Object.entries(ordinal)){
    const sourceWord=forms.join('|');
    const re=new RegExp(`((?:^|\\s))(${sourceWord})\\s+(ребро|рёберная хрящ)(?=\\s|$)`,'i');
    if(re.test(ru)) add('grammar',ru.replace(re,(_,prefix,word,noun)=>`${prefix}${forms[noun.toLowerCase()==='ребро'?2:0]} ${noun}`));
  }
  add('grammar',ru.replace(/рёберная хрящ/gi,'рёберный хрящ'));

  return {ru,reasons};
}

function review(row){
  const current=(row.ru||'').trim();
  const reasons=[];
  let suggested=current;
  if(!current) return {status:'FIX',suggested_ru:'',reason:'other: empty translation',source_basis:'FMA; Russian anatomical terminology'};
  if(englishWords.test(current)) reasons.push('transliteration');
  const fixed=fixKnown({...row,ru:current});
  suggested=fixed.ru;
  reasons.push(...fixed.reasons);
  for(const [enPattern,ruPattern,category] of markerRules){
    if(enPattern.test(row.en) && !ruPattern.test(current)) reasons.push(category);
  }
  const duplicateCategory=[...new Set(reasons)];
  if(duplicateCategory.some(x=>['grammar','transliteration','laterality','word_order','terminology'].includes(x))){
    return {status:'FIX',suggested_ru:suggested===current?'':suggested,reason:[...new Set(duplicateCategory)].join('; '),source_basis:duplicateCategory.includes('terminology')?'FMA; Russian anatomical terminology':'FMA; pattern consistency'};
  }
  if(duplicateCategory.includes('lost_information')){
    return {status:'NEEDS_EXTERNAL_REVIEW',suggested_ru:'',reason:'lost_information: English semantic markers require manual terminology verification',source_basis:'FMA; external review needed'};
  }
  // Rare multiword and Latin-derived names remain conservative review candidates.
  const words=current.split(/\s+/);
  if(words.length>=5 || /[()]/.test(current)) return {status:'NEEDS_EXTERNAL_REVIEW',suggested_ru:'',reason:'other: complex multiword anatomical concept requires external terminology review',source_basis:'FMA; external review needed'};
  return {status:'OK',suggested_ru:current,reason:'checked: no structural quality flags',source_basis:'FMA; pattern consistency'};
}

const output=['conceptId\ten\tcurrent_ru\tstatus\tsuggested_ru\treason\tsource_basis'];
const reviewed=[];
for(let start=0;start<rows.length;start+=batchSize){
  const batch=rows.slice(start,start+batchSize);
  console.log(`Reviewing concepts ${start+1}-${start+batch.length} of ${rows.length}`);
  for(const row of batch){
    const result=review(row);
    const record={...row,...result};
    reviewed.push(record);
    output.push([row.conceptId,row.en,row.ru,result.status,result.suggested_ru,result.reason,result.source_basis].map(v=>String(v??'').replace(/\t|\r?\n/g,' ')).join('\t'));
  }
}
fs.writeFileSync('scripts/translation/normative-review.tsv',output.join('\n')+'\n');

const counts=Object.fromEntries(['OK','FIX','NEEDS_EXTERNAL_REVIEW'].map(status=>[status,reviewed.filter(x=>x.status===status).length]));
console.log(`OK count: ${counts.OK}`);
console.log(`FIX count: ${counts.FIX}`);
console.log(`NEEDS_EXTERNAL_REVIEW count: ${counts.NEEDS_EXTERNAL_REVIEW}`);
console.log('\nTop 100 most explicit current_ru flags:');
reviewed.filter(x=>x.status!=='OK').sort((a,b)=>score(b)-score(a)).slice(0,100).forEach(x=>console.log(`${x.conceptId}\t${x.en}\t${x.ru}\t${x.status}\t${x.reason}`));
console.log('\nFIX grouped by reason:');
for(const category of ['grammar','transliteration','terminology','lost_information','laterality','word_order','other']){
  console.log(`${category}: ${reviewed.filter(x=>x.status==='FIX'&&x.reason.split('; ').includes(category)).length}`);
}

console.log('\n100 most confident suggested_ru:');
reviewed.filter(x=>x.status==='FIX'&&x.suggested_ru).sort((a,b)=>confidence(b)-confidence(a)).slice(0,100).forEach(x=>console.log(`${x.conceptId}\t${x.en}\t${x.ru}\t${x.suggested_ru}\t${x.reason}\t${x.source_basis}`));
console.log(`\nTerms requiring external review are listed in full in scripts/translation/normative-review.tsv (${counts.NEEDS_EXTERNAL_REVIEW} rows); first 100:`);
reviewed.filter(x=>x.status==='NEEDS_EXTERNAL_REVIEW').slice(0,100).forEach(x=>console.log(`${x.conceptId}\t${x.en}\t${x.ru}\t${x.reason}`));

function score(row){
  let value=0;
  if(/фаскиаэ|сегмент артерия|тощая кишка|мизинца палец|третья ребро|левый|правый/i.test(row.ru)) value+=5;
  if(row.reason.includes('grammar')) value+=4;
  if(row.reason.includes('laterality')) value+=3;
  if(row.reason.includes('word_order')) value+=3;
  if(row.reason.includes('lost_information')) value+=2;
  return value;
}

function confidence(row){
  let value=0;
  if(row.source_basis==='Russian anatomical terminology') value+=5;
  if(row.reason.includes('grammar')) value+=3;
  if(row.reason.includes('laterality')) value+=2;
  if(row.reason.includes('word_order')) value+=2;
  return value;
}
