import fs from 'node:fs';

function parse(file){
  const [header,...lines]=fs.readFileSync(file,'utf8').trimEnd().split('\n');
  const columns=header.split('\t');
  return lines.map(line=>Object.fromEntries(line.split('\t').map((value,index)=>[columns[index],value])));
}

const qa=parse('scripts/translation/normative-review.tsv');
const ta=parse('scripts/translation/ta-mapping.tsv');
const qaById=new Map(qa.map(row=>[row.conceptId,row]));
const targets=ta.filter(row=>row.mapping_status==='EXACT' && ['FIX','NEEDS_EXTERNAL_REVIEW'].includes(qaById.get(row.conceptId)?.status));

const safeFix={
  FMA7261:'Задняя сосочковая мышца правого желудочка',
  FMA7262:'Перегородочная сосочковая мышца правого желудочка',
  FMA3840:'Задняя межжелудочковая ветвь правой коронарной артерии',
  FMA3895:'Огибающая ветвь левой коронарной артерии',
  FMA3941:'Правая общая сонная артерия',
  FMA3953:'Правая подключичная артерия',
  FMA4058:'Левая общая сонная артерия',
  FMA4694:'Левая подключичная артерия',
  FMA4751:'Правая плечеголовная вена',
  FMA4761:'Левая плечеголовная вена',
  FMA4797:'Левая верхняя межрёберная вена',
  FMA4843:'Правая восходящая поясничная вена',
  FMA4844:'Правая подрёберная вена',
  FMA4877:'Правая верхняя межрёберная вена',
  FMA4950:'Левая восходящая поясничная вена',
  FMA4951:'Левая подрёберная вена',
  FMA14669:'Правый печёночный проток',
  FMA14670:'Левый печёночный проток',
  FMA7591:'Рёберный хрящ',
  FMA7597:'Первое ребро',
  FMA7620:'Второе ребро',
  FMA7603:'Первый рёберный хрящ',
  FMA7703:'Второй рёберный хрящ',
  FMA7741:'Третий рёберный хрящ',
  FMA7768:'Четвёртый рёберный хрящ',
  FMA7795:'Пятый рёберный хрящ',
  FMA7822:'Шестой рёберный хрящ',
  FMA7849:'Седьмой рёберный хрящ',
  FMA7875:'Правый первый рёберный хрящ',
  FMA7886:'Правый второй рёберный хрящ',
  FMA7913:'Правый третий рёберный хрящ',
  FMA7976:'Правый четвёртый рёберный хрящ',
  FMA8005:'Левый первый рёберный хрящ',
  FMA8031:'Левый второй рёберный хрящ',
  FMA8058:'Левый третий рёберный хрящ',
  FMA8070:'Правый пятый рёберный хрящ',
  FMA8112:'Левый пятый рёберный хрящ',
  FMA8167:'Левый четвёртый рёберный хрящ',
  FMA8194:'Правый шестой рёберный хрящ',
  FMA8221:'Левый шестой рёберный хрящ',
  FMA8248:'Правый седьмой рёберный хрящ',
  FMA8275:'Левый седьмой рёберный хрящ',
  FMA14335:'Правая почечная вена',
  FMA14336:'Левая почечная вена',
  FMA14338:'Правая печёночная вена',
  FMA14339:'Левая печёночная вена',
  FMA14341:'Правая яичковая вена',
  FMA14343:'Правая надпочечниковая вена',
  FMA14345:'Левая яичковая вена',
  FMA14349:'Левая надпочечниковая вена',
  FMA14768:'Левая желудочная артерия',
  FMA14776:'Правая желудочная артерия',
  FMA14811:'Правая ободочная артерия',
  FMA14826:'Левая ободочная артерия',
  FMA14829:'Нисходящая ветвь левой ободочной артерии',
  FMA15394:'Левая ободочная вена',
  FMA15399:'Левая желудочная вена',
  FMA15400:'Правая желудочная вена',
  FMA15407:'Правая ободочная вена',
  FMA20805:'Нисходящая ветвь латеральной огибающей бедренной артерии',
  FMA21354:'Глубокая тыльная вена полового члена',
  FMA22423:'Мышца, напрягающая широкую фасцию',
  FMA22533:'Длинная мышца, разгибающая большой палец стопы',
  FMA22593:'Длинная мышца, сгибающая большой палец стопы',
  FMA22755:'Тыльная запястная ветвь лучевой артерии',
  FMA22820:'Тыльная запястная ветвь локтевой артерии',
  FMA37378:'Короткая мышца, сгибающая большой палец кисти',
  FMA37682:'Короткая головка двуглавой мышцы плеча',
  FMA37683:'Длинная головка двуглавой мышцы плеча',
  FMA37692:'Длинная головка трёхглавой мышцы плеча',
  FMA37693:'Медиальная головка трёхглавой мышцы плеча',
  FMA37694:'Латеральная головка трёхглавой мышцы плеча',
  FMA38481:'Длинная мышца, сгибающая большой палец кисти',
  FMA38518:'Короткая мышца, разгибающая большой палец кисти',
  FMA38521:'Длинная мышца, разгибающая большой палец кисти',
  FMA45887:'Длинная головка двуглавой мышцы бедра',
  FMA45890:'Короткая головка двуглавой мышцы бедра',
  FMA45969:'Медиальная головка короткого сгибателя большого пальца стопы',
  FMA45970:'Латеральная головка короткого сгибателя большого пальца стопы',
  FMA46014:'Косая головка приводящей мышцы большого пальца стопы',
  FMA46015:'Поперечная головка приводящей мышцы большого пальца стопы',
  FMA46104:'Поверхностная головка короткого сгибателя большого пальца кисти',
  FMA46119:'Косая головка приводящей мышцы большого пальца кисти',
  FMA46120:'Поперечная головка приводящей мышцы большого пальца кисти',
  FMA49911:'Правая нижняя лёгочная вена',
  FMA49913:'Левая нижняя лёгочная вена',
  FMA49914:'Правая верхняя лёгочная вена',
  FMA49916:'Левая верхняя лёгочная вена',
  FMA50872:'Правая лёгочная артерия',
  FMA50873:'Левая лёгочная артерия',
  FMA51141:'Короткая мышца, разгибающая большой палец стопы',
  FMA7309:'Правое лёгкое',
  FMA7310:'Левое лёгкое',
  FMA13362:'Правая доля печени',
  FMA13363:'Левая доля печени',
  FMA14778:'Правая печёночная артерия',
  FMA14779:'Левая печёночная артерия',
  FMA50039:'Правая коронарная артерия',
  FMA50040:'Левая коронарная артерия',
};

const keep=new Set([
  'FMA7260','FMA7396','FMA7574','FMA14818','FMA14828','FMA22680','FMA22684','FMA37373','FMA37448',
  'FMA38494','FMA38497','FMA38515','FMA38615','FMA77499','FMA65132','FMA7096','FMA7097',
  'FMA7098','FMA7101','FMA7395','FMA7485','FMA7396','FMA3862'
]);

const rows=[];
for(const row of targets){
  const old=qaById.get(row.conceptId);
  let decision='REVIEW',final_ru='',reason='Russian normative equivalent still requires external source verification.';
  if(Object.hasOwn(safeFix,row.conceptId)){
    decision='SAFE_FIX'; final_ru=safeFix[row.conceptId]; reason='TA2 exact structure; current Russian form has an unambiguous grammar, case, laterality, or terminology defect.';
  }else if(keep.has(row.conceptId)){
    decision='KEEP'; final_ru=row.current_ru; reason='Current Russian term is grammatical and preserves the exact TA2 structure; prior QA flag was conservative.';
  }
  rows.push([row.conceptId,row.en,row.latin_ta,row.english_ta,row.current_ru,old.status,old.suggested_ru,decision,final_ru,reason].map(value=>String(value??'').replace(/\t|\r?\n/g,' ')).join('\t'));
}

fs.writeFileSync('scripts/translation/exact-ta-review.tsv',['conceptId\ten\tlatin_ta\tenglish_ta\tcurrent_ru\told_status\tsuggested_ru\tdecision\tfinal_ru\treason',...rows].join('\n')+'\n');
const counts={SAFE_FIX:rows.filter(x=>x.split('\t')[7]==='SAFE_FIX').length,KEEP:rows.filter(x=>x.split('\t')[7]==='KEEP').length,REVIEW:rows.filter(x=>x.split('\t')[7]==='REVIEW').length};
console.log(`total: ${rows.length}`);console.log(`SAFE_FIX: ${counts.SAFE_FIX}`);console.log(`KEEP: ${counts.KEEP}`);console.log(`REVIEW: ${counts.REVIEW}`);
console.log('\nSAFE_FIX full list:');rows.filter(x=>x.split('\t')[7]==='SAFE_FIX').forEach(line=>console.log(line));
console.log('\nREVIEW full list:');rows.filter(x=>x.split('\t')[7]==='REVIEW').forEach(line=>console.log(line));
