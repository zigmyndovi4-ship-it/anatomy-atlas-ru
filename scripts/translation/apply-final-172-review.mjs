import fs from 'node:fs';

function parse(file) {
  const [header, ...lines] = fs.readFileSync(file, 'utf8').trimEnd().split('\n');
  const columns = header.split('\t');
  return lines.map(line => Object.fromEntries(line.split('\t').map((value, index) => [columns[index], value])));
}

const dictionaryFile = 'public/models/anatomy-ru.json';
const data = JSON.parse(fs.readFileSync(dictionaryFile, 'utf8'));
const review = parse('scripts/translation/final-172-review.tsv');
let changed = 0;
for (const row of review) {
  if (row.decision !== 'APPLY' || row.confidence !== 'HIGH') continue;
  if (!data[row.conceptId]) throw new Error(`Unknown conceptId: ${row.conceptId}`);
  if (data[row.conceptId].en !== row.en) throw new Error(`English term changed for ${row.conceptId}`);
  if (data[row.conceptId].ru !== row.final_ru) {
    data[row.conceptId].ru = row.final_ru;
    changed++;
  }
}
fs.writeFileSync(dictionaryFile, `${JSON.stringify(data, null, 2)}\n`);
console.log(`changed: ${changed}`);
