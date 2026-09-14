import fs from 'node:fs';

function parse(file) {
  const [header, ...lines] = fs.readFileSync(file, 'utf8').trimEnd().split('\n');
  const columns = header.split('\t');
  return lines.map(line => Object.fromEntries(line.split('\t').map((value, index) => [columns[index], value])));
}

const input = parse('scripts/translation/linguistic-cleanup-review.tsv');
const ta = new Map(parse('scripts/translation/ta-mapping.tsv').map(row => [row.conceptId, row]));
const dental = /secondary (incisor|canine|premolar|molar) tooth$/;
const ordinal = { first: 'первый', second: 'второй' };

function dentalRu(en) {
  const match = en.match(/^(right|left) (upper|lower)(?: (lateral|central))?(?: (first|second))? secondary (incisor|canine|premolar|molar) tooth$/);
  if (!match || !dental.test(en)) return null;
  const [, laterality, jaw, position, number, kind] = match;
  const kindRu = { incisor: 'резец', canine: 'клык', premolar: 'премоляр', molar: 'моляр' }[kind];
  const pieces = [laterality === 'right' ? 'Правый' : 'Левый', jaw === 'upper' ? 'верхний' : 'нижний'];
  if (position) pieces.push(position === 'lateral' ? 'латеральный' : 'центральный');
  if (number) pieces.push(ordinal[number]);
  pieces.push('постоянный', kindRu);
  return pieces.join(' ');
}

const rows = input.map(row => {
  const mapping = ta.get(row.conceptId) ?? {};
  const finalRu = dentalRu(row.en);
  const apply = Boolean(finalRu);
  return {
    conceptId: row.conceptId,
    en: row.en,
    current_ru: row.current_ru,
    problem_type: row.problem_type,
    mapping_status: mapping.mapping_status ?? 'NO_MATCH',
    latin_ta: mapping.latin_ta ?? '',
    english_ta: mapping.english_ta ?? '',
    decision: apply ? 'APPLY' : 'DEFER',
    confidence: apply ? 'HIGH' : 'LOW',
    final_ru: apply ? finalRu : '',
    reason: apply
      ? 'Однозначная русская стоматологическая форма: сторона, верхняя/нижняя челюсть, положение и постоянный зуб сохранены; «tooth» не дублируется после названия типа зуба.'
      : 'NO_MATCH в TA mapping; служебный FMA aggregate или структура с неоднозначным русским эквивалентом оставлена для внешнего медицинского редактора.'
  };
});

const columns = ['conceptId', 'en', 'current_ru', 'problem_type', 'mapping_status', 'latin_ta', 'english_ta', 'decision', 'confidence', 'final_ru', 'reason'];
const out = [columns.join('\t'), ...rows.map(row => columns.map(column => String(row[column] ?? '').replace(/[\t\r\n]/g, ' ')).join('\t'))];
fs.writeFileSync('scripts/translation/final-review-39.tsv', `${out.join('\n')}\n`);
console.log(`total: ${rows.length}`);
console.log(`APPLY/HIGH: ${rows.filter(row => row.decision === 'APPLY' && row.confidence === 'HIGH').length}`);
console.log(`APPLY/MEDIUM: ${rows.filter(row => row.decision === 'APPLY' && row.confidence === 'MEDIUM').length}`);
console.log(`KEEP: ${rows.filter(row => row.decision === 'KEEP').length}`);
console.log(`DEFER: ${rows.filter(row => row.decision === 'DEFER').length}`);
