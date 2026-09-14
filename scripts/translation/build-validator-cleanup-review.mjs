import fs from 'node:fs';

function parse(file) {
  const [header, ...lines] = fs.readFileSync(file, 'utf8').trimEnd().split('\n');
  const columns = header.split('\t');
  return lines.map(line => Object.fromEntries(line.split('\t').map((value, index) => [columns[index], value])));
}

const anatomy = JSON.parse(fs.readFileSync('public/models/anatomy-ru.json', 'utf8'));
const ta = parse('scripts/translation/ta-mapping.tsv');
const taById = new Map(ta.map(row => [row.conceptId, row]));
const translit = /фаскиаэ|фасциаэ|латаэ|дигитал|хумэрал|ангулар|интринсик|дивисион|клустэр|кластер|нэураксис|скэлэтон|прэкоммуникатинг|улнарис/i;
const badLaterality = /(?:^|\s)(левый|правый)\s+[А-Яа-яЁё]+(?:ая|ое|ые)(?=\s|$)/i;
const badOrdinal = /(?:^|\s)(первая|вторая|третья|четвёртая|пятая|шестая|седьмая|восьмая|девятая|десятая)\s+(ребро|рёберная\s+хрящ)(?=\s|$)/i;
const femaleHeads = new Set(['артерия', 'вена', 'мышца', 'кость', 'область', 'ветвь', 'почка', 'доля', 'извилина', 'часть', 'головка', 'кишка', 'стенка', 'связка']);
const femGen = new Map([
  ['артерия', 'артерии'], ['вена', 'вены'], ['мышца', 'мышцы'], ['кость', 'кости'],
  ['область', 'области'], ['ветвь', 'ветви'], ['почка', 'почки'], ['доля', 'доли'],
  ['извилина', 'извилины'], ['часть', 'части'], ['головка', 'головки'], ['кишка', 'кишки'],
  ['стенка', 'стенки'], ['связка', 'связки']
]);
const ordinalRib = new Map([
  ['одиннадцатая', 'одиннадцатое'], ['двенадцатая', 'двенадцатое'],
  ['первая', 'первое'], ['вторая', 'второе'], ['третья', 'третье'], ['четвёртая', 'четвёртое'],
  ['пятая', 'пятое'], ['шестая', 'шестое'], ['седьмая', 'седьмое'], ['восьмая', 'восьмое'],
  ['девятая', 'девятое'], ['десятая', 'десятое']
]);

function inflectFemGen(word) {
  if (word.endsWith('яя')) return `${word.slice(0, -2)}ей`;
  if (word.endsWith('ая')) return `${word.slice(0, -2)}ой`;
  if (word.endsWith('альный')) return `${word.slice(0, -5)}альной`;
  if (word.endsWith('ельный')) return `${word.slice(0, -5)}ельной`;
  if (word.endsWith('ительный')) return `${word.slice(0, -6)}ительной`;
  if (word.endsWith('ный')) return `${word.slice(0, -3)}ной`;
  if (word.endsWith('ый')) return `${word.slice(0, -2)}ой`;
  if (word.endsWith('ий')) return `${word.slice(0, -2)}ей`;
  return word;
}

function sideAgreement(ru) {
  const words = ru.split(' ');
  for (let i = 0; i < words.length - 1; i++) {
    const side = words[i].toLowerCase();
    if (side !== 'правый' && side !== 'левый') continue;
    const rest = words.slice(i + 1);
    const headIndex = rest.findIndex(word => femaleHeads.has(word.toLowerCase()));
    const head = headIndex >= 0 ? rest[headIndex].toLowerCase() : '';
    if (head === 'ребро' && i === 0 && ordinalRib.has(rest[0].toLowerCase())) {
      words[i] = side === 'правый' ? 'Правое' : 'Левое';
      words[i + 1] = ordinalRib.get(rest[0].toLowerCase());
      return words.join(' ');
    }
    if (i === 0 && headIndex >= 0 && rest[0].match(/(?:ая|яя)$/i)) {
      words[i] = side === 'правый' ? 'Правая' : 'Левая';
      return words.join(' ');
    }
    if (i > 0 && headIndex >= 0) {
      words[i] = side === 'правый' ? 'правой' : 'левой';
      for (let j = i + 1; j < i + headIndex + 1; j++) words[j] = inflectFemGen(words[j]);
      words[i + headIndex + 1] = femGen.get(head) ?? words[i + headIndex + 1];
      return words.join(' ');
    }
  }
  return ru;
}

function explicitFix(ru, en) {
  const lower = en.toLowerCase();
  if (lower.includes('angular gyrus')) return ru.replace(/ангулар\s+извилина/gi, 'угловая извилина').replace(/Правый\s+угловая/gi, 'Правая угловая').replace(/Левый\s+угловая/gi, 'Левая угловая');
  if (lower.includes('extensor carpi ulnaris')) return ru.replace(/разгибатель кисти улнарис/gi, 'локтевой разгибатель запястья');
  if (lower.includes('flexor carpi ulnaris')) return ru.replace(/сгибатель кисти улнарис/gi, 'локтевой сгибатель запястья');
  if (lower === 'musculoskeletal system') return 'Костно-мышечная система';
  if (lower.includes('precommunicating part of')) return ru.replace(/прэкоммуникатинг/gi, 'предсоединительная').replace(/задняя мозговая артерия/gi, 'задней мозговой артерии');
  if (lower.includes('posterior division of renal artery')) return ru.replace(/дивисион/gi, 'отдел').replace(/почечная артерия/gi, 'почечной артерии');
  return ru;
}

function classify(value) {
  const ru = String(value.ru ?? '');
  const types = [];
  if (translit.test(ru)) types.push('TRANSLITERATION');
  if (badLaterality.test(ru)) types.push('LATERALITY', 'GRAMMAR');
  if (badOrdinal.test(ru)) types.push('GRAMMAR', 'LATERALITY');
  return [...new Set(types)];
}

const rows = [];
for (const [conceptId, value] of Object.entries(anatomy)) {
  const problemTypes = classify(value);
  if (!problemTypes.length) continue;
  const mapping = taById.get(conceptId) ?? {};
  let finalRu = explicitFix(value.ru, value.en);
  finalRu = sideAgreement(finalRu);
  let decision = 'REVIEW';
  let confidence = 'LOW';
  let reason = 'Suspicious validator finding requires Russian anatomical terminology review.';
  if (finalRu !== value.ru && !translit.test(finalRu) && !badLaterality.test(finalRu) && !badOrdinal.test(finalRu)) {
    decision = 'APPLY';
    confidence = 'HIGH';
    reason = 'Deterministic grammatical or established terminology correction; source meaning is preserved.';
  }
  rows.push({ conceptId, en: value.en, current_ru: value.ru, problem_types: [...new Set(problemTypes)].join('|'), mapping_status: mapping.mapping_status ?? 'NO_MATCH', latin_ta: mapping.latin_ta ?? '', english_ta: mapping.english_ta ?? '', decision, confidence, final_ru: decision === 'APPLY' ? finalRu : '', reason });
}

const columns = ['conceptId', 'en', 'current_ru', 'problem_types', 'mapping_status', 'latin_ta', 'english_ta', 'decision', 'confidence', 'final_ru', 'reason'];
const out = [columns.join('\t'), ...rows.map(row => columns.map(column => String(row[column] ?? '').replace(/[\t\r\n]/g, ' ')).join('\t'))];
fs.writeFileSync('scripts/translation/validator-cleanup-review.tsv', `${out.join('\n')}\n`);
const counts = {};
for (const row of rows) counts[`${row.decision}/${row.confidence}`] = (counts[`${row.decision}/${row.confidence}`] ?? 0) + 1;
console.log(`suspicious rows: ${rows.length}`);
for (const [key, count] of Object.entries(counts)) console.log(`${key}: ${count}`);
