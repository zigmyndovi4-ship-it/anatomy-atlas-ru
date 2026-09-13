import fs from 'node:fs';

const file = 'public/models/anatomy-ru.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const entries = Object.entries(data);
const findings = [];
const translit = /фаскиаэ|фасциаэ|латаэ|дигитал|хумэрал|ангулар|интринсик|дивисион|клустэр|кластер|нэураксис|скэлэтон|прэкоммуникатинг|улнарис/i;
const badLaterality = /(?:^|\s)(левый|правый)\s+[А-Яа-яЁё]+(?:ая|ое|ые)(?=\s|$)/i;
const badOrdinal = /(?:^|\s)(первая|вторая|третья|четвёртая|пятая|шестая|седьмая|восьмая|девятая|десятая)\s+(ребро|рёберная\s+хрящ)(?=\s|$)/i;
const ids = new Set();

for (const [conceptId, value] of entries) {
  if (ids.has(conceptId)) findings.push({ conceptId, kind: 'duplicate conceptId', value: value.ru });
  ids.add(conceptId);
  const ru = String(value.ru ?? '');
  if (!ru.trim()) findings.push({ conceptId, kind: 'empty ru', value: ru });
  if (/[A-Za-z]/.test(ru)) findings.push({ conceptId, kind: 'English/Latin letters in ru', value: ru });
  if (translit.test(ru)) findings.push({ conceptId, kind: 'transliteration', value: ru });
  if (/\s{2,}/.test(ru)) findings.push({ conceptId, kind: 'repeated spaces', value: ru });
  if (badLaterality.test(ru)) findings.push({ conceptId, kind: 'laterality/gender agreement', value: ru });
  if (badOrdinal.test(ru)) findings.push({ conceptId, kind: 'ordinal/gender agreement', value: ru });
}

const counts = {};
for (const finding of findings) counts[finding.kind] = (counts[finding.kind] ?? 0) + 1;
console.log(`concepts: ${entries.length}`);
console.log(`findings: ${findings.length}`);
for (const [kind, count] of Object.entries(counts)) console.log(`${kind}: ${count}`);
for (const finding of findings) console.log(`${finding.conceptId}\t${finding.kind}\t${finding.value}`);
// This script is intentionally a detector, not a medical authority or a gate.
// Findings require review and therefore do not make the command fail.
