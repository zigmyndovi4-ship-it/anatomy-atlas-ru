import fs from 'node:fs';

function parse(file) {
  const [header, ...lines] = fs.readFileSync(file, 'utf8').trimEnd().split('\n');
  const columns = header.split('\t');
  return lines.map(line => Object.fromEntries(line.split('\t').map((value, index) => [columns[index], value])));
}

const anatomy = JSON.parse(fs.readFileSync('public/models/anatomy-ru.json', 'utf8'));
const ta = new Map(parse('scripts/translation/ta-mapping.tsv').map(row => [row.conceptId, row]));
const translit = /фаскиаэ|фасциаэ|латаэ|дигитал|хумэрал|ангулар|интринсик|дивисион|клустэр|кластер|нэураксис|скэлэтон|прэкоммуникатинг|улнарис/i;
const laterality = /(?:^|\s)(левый|правый)\s+[А-Яа-яЁё]+(?:ая|ое|ые)(?=\s|$)/i;
const ordinal = /(?:^|\s)(первая|вторая|третья|четвёртая|пятая|шестая|седьмая|восьмая|девятая|десятая)\s+(ребро|рёберная\s+хрящ)(?=\s|$)/i;

const side = { right: 'Прав', left: 'Лев' };
function pair(en, right, left) {
  const m = en.match(/^(right|left) (.*)$/i);
  if (!m) return null;
  return (m[1].toLowerCase() === 'right' ? right : left);
}
function exact(en) {
  const lower = en.toLowerCase();
  let m;
  if ((m = lower.match(/^(right|left) (?:anterior branch of )?anterior interventricular branch of (right|left) coronary artery$/))) {
    return `${m[1] === 'right' ? 'Правая' : 'Левая'} передняя ветвь передней межжелудочковой ветви ${m[2] === 'right' ? 'правой' : 'левой'} коронарной артерии`;
  }
  if ((m = lower.match(/^(first|second|third) (right|left) anterior branch of anterior interventricular branch of (right|left) coronary artery$/))) {
    const n = { first: 'Первая', second: 'Вторая', third: 'Третья' }[m[1]];
    return `${n} ${m[2] === 'right' ? 'правая' : 'левая'} передняя ветвь передней межжелудочковой ветви ${m[3] === 'right' ? 'правой' : 'левой'} коронарной артерии`;
  }
  if ((m = lower.match(/^(right|left) (eleventh|twelfth) rib$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} ${m[2] === 'eleventh' ? 'одиннадцатое' : 'двенадцатое'} ребро`;
  if ((m = lower.match(/^(right|left) (superficial|deep) (palmar arterial|palmar venous) arch$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} ${m[2] === 'superficial' ? 'поверхностная' : 'глубокая'} ${m[3] === 'palmar arterial' ? 'ладонная артериальная' : 'ладонная венозная'} дуга`;
  if ((m = lower.match(/^(right|left) deep palmar arch$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} глубокая ладонная дуга`;
  if ((m = lower.match(/^(right|left) lumbar rotator$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} поясничный вращатель`;
  if ((m = lower.match(/^(right|left) supraspinatus$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} надостная мышца`;
  if ((m = lower.match(/^(proximal|middle|distal) phalanx of (right|left) (second|fourth) toe$/))) {
    const part = { proximal: 'Проксимальная', middle: 'Средняя', distal: 'Дистальная' }[m[1]];
    const toe = { second: 'второго', fourth: 'четвёртого' }[m[3]];
    return `${part} фаланга ${m[2] === 'right' ? 'правого' : 'левого'} ${toe} пальца стопы`;
  }
  if ((m = lower.match(/^(right|left) extensor carpi radialis (longus|brevis)$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} ${m[2] === 'longus' ? 'длинная' : 'короткая'} лучевая мышца, разгибающая запястье`;
  if ((m = lower.match(/^(right|left) plantar arch$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} подошвенная дуга`;
  if ((m = lower.match(/^(right|left) stylohyoid$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} шилоподъязычная мышца`;
  if (lower === 'superior oblique part of left longus colli') return 'Верхняя косая часть левой длинной мышцы шеи';
  if (lower === 'vertical intermediate part of left longus colli') return 'Вертикальная промежуточная часть левой длинной мышцы шеи';
  if (lower === 'inferior oblique part of left longus colli') return 'Нижняя косая часть левой длинной мышцы шеи';
  if ((m = lower.match(/^(right|left) longus capitis$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} длинная мышца головы`;
  if ((m = lower.match(/^(right|left) common tendinous ring$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} общее сухожильное кольцо`;
  if ((m = lower.match(/^(right|left) (lacrimal|frontal) nerve$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} ${m[2] === 'lacrimal' ? 'слёзный' : 'лобный'} нерв`;
  if ((m = lower.match(/^(right|left) ciliary ganglion$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} ресничный ганглий`;
  if ((m = lower.match(/^(right|left) choroid$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} сосудистая оболочка`;
  if ((m = lower.match(/^(right|left) lacrimal gland$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} слёзная железа`;
  if ((m = lower.match(/^(right|left) (greater|major) alar cartilage$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} большой крыльный хрящ`;
  if ((m = lower.match(/^(right|left) lateral nasal cartilage$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} латеральный носовой хрящ`;
  if ((m = lower.match(/^(right|left) lacrimal (lake|sac|canaliculus)$/))) return `${m[1] === 'right' ? (m[2] === 'lake' ? 'Правое' : 'Правый') : (m[2] === 'lake' ? 'Левое' : 'Левый')} ${m[2] === 'lake' ? 'слёзное озеро' : m[2] === 'sac' ? 'слёзный мешок' : 'слёзный канальчик'}`;
  if ((m = lower.match(/^(right|left) (apical|medial basal|lateral basal) (segmental )?bronchial tree$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} ${m[2] === 'apical' ? 'верхушечное' : m[2] === 'medial basal' ? 'медиальное базальное' : 'латеральное базальное'} ${m[3] ? 'сегментарное ' : ''}бронхиальное дерево`;
  if ((m = lower.match(/^(right|left) hepatic biliary tree$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} печёночное желчное дерево`;
  if ((m = lower.match(/^(right|left) caudate nucleus$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} хвостатое ядро`;
  if ((m = lower.match(/^(right|left) amygdaloid body$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} миндалевидное тело`;
  if ((m = lower.match(/^(right|left) amygdala$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} миндалевидное тело`;
  if ((m = lower.match(/^(right|left) (lateral|medial) geniculate body$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} ${m[2] === 'lateral' ? 'латеральное' : 'медиальное'} коленчатое тело`;
  if ((m = lower.match(/^(right|left) cervical rotator$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} шейный вращатель`;
  if ((m = lower.match(/^(right|left) long ciliary nerve$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} длинный ресничный нерв`;
  if ((m = lower.match(/^(right|left) (calcaneal|intermediate) tendon$/))) return `${m[1] === 'right' ? (m[2] === 'calcaneal' ? 'Правое' : 'Правое') : 'Левое'} ${m[2] === 'calcaneal' ? 'пяточное' : 'промежуточное'} сухожилие`;
  if ((m = lower.match(/^(right|left) (free upper|free lower) limb$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} свободная ${m[2] === 'free upper' ? 'верхняя' : 'нижняя'} конечность`;
  if ((m = lower.match(/^(right|left) eyeball$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} глазное яблоко`;
  if ((m = lower.match(/^(right|left) bronchial tree$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} бронхиальное дерево`;
  if ((m = lower.match(/^posterior division of (right|left) renal artery$/))) return `Задний отдел ${m[1] === 'right' ? 'правой' : 'левой'} почечной артерии`;
  if ((m = lower.match(/^subdivision of (right|left) lobe branch of (right|left) hepatic artery$/))) return `Подразделение ${m[1] === 'right' ? 'правой' : 'левой'} долевой ветви ${m[2] === 'right' ? 'правой' : 'левой'} печёночной артерии`;
  if ((m = lower.match(/^segment of (right|left) hepatic biliary tree$/))) return `Сегмент ${m[1] === 'right' ? 'правого' : 'левого'} печёночного желчного дерева`;
  if ((m = lower.match(/^segmental tributary of (right|left) hepatic biliary tree$/))) return `Сегментарный приток ${m[1] === 'right' ? 'правого' : 'левого'} печёночного желчного дерева`;
  if ((m = lower.match(/^(posterior superior|posterior inferior|medial superior|medial inferior|lateral superior|lateral inferior) tributary of (right|left) hepatic biliary tree$/))) return `${m[1] === 'posterior superior' ? 'Задний верхний' : m[1] === 'posterior inferior' ? 'Задний нижний' : m[1] === 'medial superior' ? 'Медиальный верхний' : m[1] === 'medial inferior' ? 'Медиальный нижний' : m[1] === 'lateral superior' ? 'Латеральный верхний' : 'Латеральный нижний'} приток ${m[2] === 'right' ? 'правого' : 'левого'} печёночного желчного дерева`;
  if ((m = lower.match(/^caudate lobe tributary of (right|left) hepatic biliary tree$/))) return `Приток хвостатой доли ${m[1] === 'right' ? 'правого' : 'левого'} печёночного желчного дерева`;
  if ((m = lower.match(/^(right|left) (upper|lower) lobe of lung$/))) return `${m[2] === 'upper' ? 'Верхняя' : 'Нижняя'} доля ${m[1] === 'right' ? 'правого' : 'левого'} лёгкого`;
  if ((m = lower.match(/^(upper|lower) lobe of (right|left) lung$/))) return `${m[1] === 'upper' ? 'Верхняя' : 'Нижняя'} доля ${m[2] === 'right' ? 'правого' : 'левого'} лёгкого`;
  if ((m = lower.match(/^(right|left) (apical|medial basal|lateral basal) bronchopulmonary segment$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} ${m[2] === 'apical' ? 'верхушечный' : m[2] === 'medial basal' ? 'медиальный базальный' : 'латеральный базальный'} бронхолёгочный сегмент`;
  if ((m = lower.match(/^(right|left) orbital compartment$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} глазничный компартмент`;
  if ((m = lower.match(/^(wall|fibrous layer|vascular layer) of (right|left) eyeball$/))) return `${m[1] === 'wall' ? 'Стенка' : m[1] === 'fibrous layer' ? 'Фиброзный слой' : 'Сосудистый слой'} ${m[2] === 'right' ? 'правого' : 'левого'} глазного яблока`;
  if ((m = lower.match(/^(right|left) lacrimal apparatus$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} слёзный аппарат`;
  if ((m = lower.match(/^(right|left) (second|fourth) toe$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} ${m[2] === 'second' ? 'второй' : 'четвёртый'} палец стопы`;
  if ((m = lower.match(/^(right|left) lacrimal duct$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} слёзный проток`;
  if ((m = lower.match(/^(right|left) prefrontal cortex$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} префронтальная кора`;
  if ((m = lower.match(/^(right|left) (cerebral hemisphere|orbital content|orbital contents|hippocampal formation)$/))) return `${m[1] === 'right' ? (m[2] === 'cerebral hemisphere' ? 'Правое' : 'Правое') : 'Левое'} ${m[2] === 'cerebral hemisphere' ? 'мозговое полушарие' : m[2].startsWith('orbital') ? 'глазничное содержимое' : 'гиппокампальное образование'}`;
  if ((m = lower.match(/^(cortex|subcortex) of (right|left) cerebral hemisphere$/))) return `${m[1] === 'cortex' ? 'Кора' : 'Подкорка'} ${m[2] === 'right' ? 'правого' : 'левого'} мозгового полушария`;
  if ((m = lower.match(/^white matter of (right|left) cerebral hemisphere$/))) return `Белое вещество ${m[1] === 'right' ? 'правого' : 'левого'} мозгового полушария`;
  if ((m = lower.match(/^(right|left) (upper|lower) lobe part of (right|left) bronchial tree$/))) return `${m[2] === 'upper' ? 'Верхняя' : 'Нижняя'} доля, часть ${m[1] === 'right' ? 'правого' : 'левого'} бронхиального дерева`;
  if ((m = lower.match(/^(upper|middle|lower) lobe part of (right|left) bronchial tree$/))) return `${m[1] === 'upper' ? 'Верхняя' : m[1] === 'middle' ? 'Средняя' : 'Нижняя'} доля, часть ${m[2] === 'right' ? 'правого' : 'левого'} бронхиального дерева`;
  if ((m = lower.match(/^inferomedial part of (right|left) bronchial tree$/))) return `Нижнемедиальная часть ${m[1] === 'right' ? 'правого' : 'левого'} бронхиального дерева`;
  if ((m = lower.match(/^(posterior|lateral|medial) tributary of (right|left) hepatic biliary tree$/))) return `${m[1] === 'posterior' ? 'Задний' : m[1] === 'lateral' ? 'Латеральный' : 'Медиальный'} приток ${m[2] === 'right' ? 'правого' : 'левого'} печёночного желчного дерева`;
  return null;
}

const findings = new Map();
for (const [conceptId, value] of Object.entries(anatomy)) {
  const types = [];
  if (translit.test(value.ru)) types.push('TRANSLITERATION');
  if (laterality.test(value.ru)) types.push('LATERALITY', 'GRAMMAR');
  if (ordinal.test(value.ru)) types.push('GRAMMAR', 'LATERALITY');
  if (types.length) findings.set(conceptId, { value, types: [...new Set(types)] });
}

const rows = [];
for (const [conceptId, { value, types }] of findings) {
  const mapping = ta.get(conceptId) ?? {};
  const finalRu = exact(value.en);
  const canApply = finalRu && finalRu !== value.ru && !translit.test(finalRu) && !laterality.test(finalRu) && !ordinal.test(finalRu);
  rows.push({ conceptId, en: value.en, current_ru: value.ru, problem_type: types.join('|'), mapping_status: mapping.mapping_status ?? 'NO_MATCH', latin_ta: mapping.latin_ta ?? '', english_ta: mapping.english_ta ?? '', decision: canApply ? 'APPLY' : 'REVIEW', confidence: canApply ? 'HIGH' : 'LOW', final_ru: canApply ? finalRu : '', reason: canApply ? 'Однозначная нормативная форма по en/TA и согласованной left/right паре.' : 'Требуется внешняя русская анатомическая проверка; безопасная автоматическая форма не подтверждена.' });
}

const columns = ['conceptId', 'en', 'current_ru', 'problem_type', 'mapping_status', 'latin_ta', 'english_ta', 'decision', 'confidence', 'final_ru', 'reason'];
const out = [columns.join('\t'), ...rows.map(row => columns.map(column => String(row[column] ?? '').replace(/[\t\r\n]/g, ' ')).join('\t'))];
fs.writeFileSync('scripts/translation/final-172-review.tsv', `${out.join('\n')}\n`);
const counts = {};
for (const row of rows) counts[`${row.decision}/${row.confidence}`] = (counts[`${row.decision}/${row.confidence}`] ?? 0) + 1;
console.log(`findings: ${rows.length}`);
for (const [key, count] of Object.entries(counts)) console.log(`${key}: ${count}`);
