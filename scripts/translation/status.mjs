import fs from 'node:fs';

const file='public/models/anatomy-ru.json';
const dict=JSON.parse(fs.readFileSync(file,'utf8'));

const rows=Object.entries(dict).map(([id,x])=>({
  id,
  en:x.en,
  ru:(x.ru||'').trim(),
  system:x.system||'unknown',
}));

const translated=rows.filter(x=>x.ru);
const missing=rows.filter(x=>!x.ru);

console.log(`Total:      ${rows.length}`);
console.log(`Translated: ${translated.length}`);
console.log(`Missing:    ${missing.length}`);
console.log(`Progress:   ${(translated.length/rows.length*100).toFixed(2)}%`);

const systems={};

for (const x of rows) {
  systems[x.system] ??={total:0,translated:0};
  systems[x.system].total++;
  if (x.ru) systems[x.system].translated++;
}

console.table(
  Object.fromEntries(
    Object.entries(systems)
      .sort((a,b)=>a[0].localeCompare(b[0]))
      .map(([system,v])=>[
        system,
        {
          total:v.total,
          translated:v.translated,
          missing:v.total-v.translated,
        }
      ])
  )
);

fs.writeFileSync(
  'scripts/translation/untranslated.tsv',
  [
    'conceptId\tsystem\ten\tru',
    ...missing.map(x=>`${x.id}\t${x.system}\t${x.en}\t`)
  ].join('\n')+'\n'
);

console.log('\nWritten scripts/translation/untranslated.tsv');
