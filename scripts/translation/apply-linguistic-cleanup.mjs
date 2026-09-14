import fs from 'node:fs';

const dataFile = 'public/models/anatomy-ru.json';
const reviewFile = 'scripts/translation/linguistic-cleanup-review.tsv';
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const [header, ...lines] = fs.readFileSync(reviewFile, 'utf8').trimEnd().split('\n');
const columns = header.split('\t');
const rows = lines.map(line => Object.fromEntries(line.split('\t').map((value, index) => [columns[index], value])));
let changed = 0;

for (const row of rows) {
  if (row.decision !== 'APPLY' || row.confidence !== 'HIGH') continue;
  if (!data[row.conceptId]) throw new Error(`Unknown conceptId: ${row.conceptId}`);
  if (data[row.conceptId].en !== row.en) throw new Error(`English mismatch for ${row.conceptId}`);
  if (!row.final_ru) throw new Error(`Empty final_ru for ${row.conceptId}`);
  if (data[row.conceptId].ru !== row.current_ru) throw new Error(`Current ru mismatch for ${row.conceptId}`);
  data[row.conceptId].ru = row.final_ru;
  changed++;
}

fs.writeFileSync(dataFile, `${JSON.stringify(data, null, 2)}\n`);
console.log(`changed: ${changed}`);
