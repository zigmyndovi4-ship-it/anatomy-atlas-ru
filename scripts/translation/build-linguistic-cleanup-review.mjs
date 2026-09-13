import fs from 'node:fs';

function parse(file) {
  const [header, ...lines] = fs.readFileSync(file, 'utf8').trimEnd().split('\n');
  const columns = header.split('\t');
  return lines.map(line => Object.fromEntries(line.split('\t').map((value, index) => [columns[index], value])));
}

const anatomy = JSON.parse(fs.readFileSync('public/models/anatomy-ru.json', 'utf8'));
const qa = new Map(parse('scripts/translation/normative-review.tsv').map(row => [row.conceptId, row]));
const translit = /скапулаэ|фаскиаэ|фасциаэ|\bлата\b|дигиторум|карпи|радиалис|ульнарис|феморис|тибиалис|клустэр|хэтэрогэнэоус|дивисион|прэкоммуникатинг|скэлэтон|нэураксис|кэлл|инфэромэдиал|гэникулатэ|таламогэникулатэ|сидэ|кагэ/i;
const english = /\b(?:muscle|artery|vein|nerve|branch|part|cluster|division|wall|layer|bone|cartilage|proper|digital|left|right)\b/i;
const badAgreement = /(?:^|\s)(?:левый|правый)\s+(?:лопатка|мышца|артерия|вена|кость|железа|кишка|связка|фасция|ветвь|оболочка|перегородка|полость|борозда|извилина|подключичная|позвоночная|внутренняя|верхняя|глубокая|латеральная|медиальная|поверхностная|поперечная|подмышечная|бедренная|слёзная|лобная|ресничная|сосудистая|пяточное|глазное)(?=\s|$)/i;
const embeddedLaterality = /(?:^|\s)(?:левый|правый)\s+(?=(?:верхняя|средняя|нижняя|задняя|передняя|внутренняя|наружная|сегментарный|сегментарная|мозговая|межжелудочковая|соединительная)(?:\s|$))/i;
const badOrdinal = /(?:^|\s)(?:первая|вторая|третья|четвёртая|пятая|шестая|седьмая|восьмая|девятая|десятая|одиннадцатая|двенадцатая)\s+(?:ребро|рёберная\s+хрящ)(?=\s|$)/i;
const badMorphology = /(?:позвоночная\s+столб|межпозвоночное\s+диск|грудная\s+позвонок|поясничная\s+позвонок|шейная\s+позвонок|тощий\s+кишка|тощая\s+кишка\s+зона|конус\s+артерия|рёберная\s+хрящ|правое\s+\S+ая\s+|левое\s+\S+ая\s+|правое\s+\S+ный\s+|левое\s+\S+ный\s+)/i;
const feminineNouns = new Set(['артерия', 'вена', 'мышца', 'кость', 'железа', 'кишка', 'связка', 'фасция', 'ветвь', 'оболочка', 'перегородка', 'полость', 'борозда', 'извилина', 'дуга', 'доля', 'часть', 'головка', 'кора', 'область', 'конечность']);
const masculineNouns = new Set(['нерв', 'хрящ', 'столб', 'диск', 'позвонок', 'сегмент', 'аппарат', 'ганглий', 'проток', 'мозг', 'сосуд', 'вращатель', 'пальца', 'мешок', 'канальчик', 'компартмент', 'кластер']);
const neuterNouns = new Set(['ребро', 'тело', 'дерево', 'полушарие', 'озеро', 'содержимое', 'сухожилие', 'ядро', 'кольцо', 'туловище']);

function agreementDefect(text) {
  const words = text.toLowerCase().replace(/[(),]/g, '').split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const noun = words[i];
    const previous = words[i - 1] ?? '';
    if (feminineNouns.has(noun) && /(?:ый|ий|ое|ее|ный|ний)$/.test(previous)) return true;
    if (masculineNouns.has(noun) && /(?:ая|яя|ое|ее)$/.test(previous)) return true;
    if (neuterNouns.has(noun) && /(?:ая|яя|ый|ий)$/.test(previous)) return true;
    if (['артерия', 'вена', 'мышца', 'железа', 'кость', 'связка', 'фасция'].includes(noun) && i > 0 && !/(?:ая|яя)$/.test(previous)) return true;
  }
  return /(?:мышца\s+(?:передняя|задняя|верхняя|нижняя)|железа\s+артерия|конус\s+артерия)/i.test(text);
}

function explicit(en) {
  const e = en.toLowerCase();
  let m;
  if (e === 'left superior segmental artery') return 'Левая верхняя сегментарная артерия';
  if (e === 'right superior segmental artery') return 'Правая верхняя сегментарная артерия';
  if (e === 'right superior segmental vein') return 'Правая верхняя сегментарная вена';
  if (e === 'levator scapulae') return 'Мышца, поднимающая лопатку';
  if ((m = e.match(/^(right|left) levator scapulae$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} мышца, поднимающая лопатку`;
  if ((m = e.match(/^(right|left) superior pharyngeal constrictor$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} верхний сжиматель глотки`;
  if (e === 'tibialis anterior') return 'Передняя большеберцовая мышца';
  if ((m = e.match(/^(right|left) tibialis anterior$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} передняя большеберцовая мышца`;
  if (e === 'tibialis posterior') return 'Задняя большеберцовая мышца';
  if ((m = e.match(/^(right|left) tibialis posterior$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} задняя большеберцовая мышца`;
  if (e === 'subscapular artery') return 'Подлопаточная артерия';
  if ((m = e.match(/^(right|left) subscapular artery$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} подлопаточная артерия`;
  if (e === 'subscapular vein') return 'Подлопаточная вена';
  if ((m = e.match(/^(right|left) subscapular vein$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} подлопаточная вена`;
  if ((m = e.match(/^(right|left) (anterior|posterior) basal segmental vein$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} ${m[2] === 'anterior' ? 'передняя' : 'задняя'} базальная сегментарная вена`;
  if ((m = e.match(/^(right|left) inferior thyroid artery$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} нижняя щитовидная артерия`;
  if ((m = e.match(/^(right|left) serratus anterior$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} передняя зубчатая мышца`;
  if ((m = e.match(/^(right|left) serratus posterior (superior|inferior)$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} ${m[2] === 'superior' ? 'верхняя' : 'нижняя'} задняя зубчатая мышца`;
  if ((m = e.match(/^(right|left) (middle|inferior) pharyngeal constrictor$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} ${m[2] === 'middle' ? 'средний' : 'нижний'} сжиматель глотки`;
  if ((m = e.match(/^(right|left) inferior nasal concha$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} нижняя носовая раковина`;
  if ((m = e.match(/^(right|left) (anterior|posterior) ethmoidal nerve$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} ${m[2] === 'anterior' ? 'передний' : 'задний'} решётчатый нерв`;
  if ((m = e.match(/^(right|left) thumb$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} большой палец кисти`;
  if ((m = e.match(/^(?:(first|second) )?septal branch of (right|left) posterior interventricular artery$/))) return `${m[1] ? ({ first: 'Первая', second: 'Вторая' }[m[1]] + ' ') : ''}перегородочная ветвь ${m[2] === 'right' ? 'правой' : 'левой'} задней межжелудочковой артерии`;
  if ((m = e.match(/^sphenoid part of (right|left) middle cerebral artery$/))) return `Клиновидная часть ${m[1] === 'right' ? 'правой' : 'левой'} средней мозговой артерии`;
  if ((m = e.match(/^insular part of (right|left) middle cerebral artery$/))) return `Островковая часть ${m[1] === 'right' ? 'правой' : 'левой'} средней мозговой артерии`;
  if ((m = e.match(/^hypothalamic branch of (right|left) posterior communicating artery$/))) return `Гипоталамическая ветвь ${m[1] === 'right' ? 'правой' : 'левой'} задней соединительной артерии`;
  if ((m = e.match(/^(middle|posterior) temporal branch of (right|left) middle cerebral artery$/))) return `${m[1] === 'middle' ? 'Средняя' : 'Задняя'} височная ветвь ${m[2] === 'right' ? 'правой' : 'левой'} средней мозговой артерии`;
  if ((m = e.match(/^temporo-occipital branch of (right|left) middle cerebral artery$/))) return `Височно-затылочная ветвь ${m[1] === 'right' ? 'правой' : 'левой'} средней мозговой артерии`;
  if ((m = e.match(/^postcommunicating part of (right|left) posterior cerebral artery$/))) return `Посткоммуникационная часть ${m[1] === 'right' ? 'правой' : 'левой'} задней мозговой артерии`;
  if ((m = e.match(/^posteromedial central branch of (right|left) posterior cerebral artery$/))) return `Постеромедиальная центральная ветвь ${m[1] === 'right' ? 'правой' : 'левой'} задней мозговой артерии`;
  if ((m = e.match(/^trochlea of (right|left) superior oblique$/))) return `Блок ${m[1] === 'right' ? 'правой' : 'левой'} верхней косой мышцы`;
  if ((m = e.match(/^(right|left) thyrohyoid membrane$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} щитоподъязычная мембрана`;
  if ((m = e.match(/^(right|left) vitreous body$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} стекловидное тело`;
  if ((m = e.match(/^tarsal plate of (right|left) (lower|upper) eyelid$/))) return `Предплюсневая пластинка ${m[1] === 'right' ? 'правого' : 'левого'} ${m[2] === 'lower' ? 'нижнего' : 'верхнего'} века`;
  if ((m = e.match(/^(right|left) superior bronchopulmonary segment$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} верхний бронхолёгочный сегмент`;
  if ((m = e.match(/^(right|left) (anterior|posterior)(?: (basal))? bronchopulmonary segment$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} ${m[2] === 'anterior' ? 'передний' : 'задний'}${m[3] ? ' базальный' : ''} бронхолёгочный сегмент`;
  if ((m = e.match(/^(right|left) (anterior|posterior)(?: (basal))? segmental bronchial tree$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} ${m[2] === 'anterior' ? 'переднее' : 'заднее'}${m[3] ? ' базальное' : ''} сегментарное бронхиальное дерево`;
  if ((m = e.match(/^(right|left) (anterior|posterior) basal segmental artery$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} ${m[2] === 'anterior' ? 'передняя' : 'задняя'} базальная сегментарная артерия`;
  if ((m = e.match(/^posterior (part|branch) of (right|left) posterior segmental artery$/))) return `${m[1] === 'part' ? 'Задняя часть' : 'Задняя ветвь'} ${m[2] === 'right' ? 'правой' : 'левой'} задней сегментарной артерии`;
  if ((m = e.match(/^(superior|inferior) part of (right|left) anterior segmental vein$/))) return `${m[1] === 'superior' ? 'Верхняя' : 'Нижняя'} часть ${m[2] === 'right' ? 'правой' : 'левой'} передней сегментарной вены`;
  if ((m = e.match(/^(laterobasal|mediobasal) branch of (right|left) posterior basal segmental artery$/))) return `${m[1] === 'laterobasal' ? 'Латеробазальная' : 'Медиобазальная'} ветвь ${m[2] === 'right' ? 'правой' : 'левой'} задней базальной сегментарной артерии`;
  if ((m = e.match(/^lateral branch of (right|left) anterior basal segmental artery$/))) return `Латеральная ветвь ${m[1] === 'right' ? 'правой' : 'левой'} передней базальной сегментарной артерии`;
  if ((m = e.match(/^(right|left) scapula$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} лопатка`;
  if ((m = e.match(/^(right|left) (middle|inferior) temporal gyrus$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} ${m[2] === 'middle' ? 'средняя' : 'нижняя'} височная извилина`;
  if ((m = e.match(/^(right|left) inferior colliculus$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} нижний холмик`;
  if ((m = e.match(/^(right|left) lower eyelid$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} нижнее веко`;
  if ((m = e.match(/^(right|left) pectoral girdle$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} плечевой пояс`;
  if ((m = e.match(/^skeleton of (right|left) pectoral girdle$/))) return `Скелет ${m[1] === 'right' ? 'правого' : 'левого'} плечевого пояса`;
  if ((m = e.match(/^(right|left) bony pectoral girdle$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} костный плечевой пояс`;
  if ((m = e.match(/^pectoral part of (right|left) pectoral girdle$/))) return `Грудная часть ${m[1] === 'right' ? 'правого' : 'левого'} плечевого пояса`;
  if ((m = e.match(/^scapular part of (right|left) pectoral girdle$/))) return `Лопаточная часть ${m[1] === 'right' ? 'правого' : 'левого'} плечевого пояса`;
  if ((m = e.match(/^trunk of inferior terminal branch of (right|left) middle cerebral artery$/))) return `Туловище нижней концевой ветви ${m[1] === 'right' ? 'правой' : 'левой'} средней мозговой артерии`;
  if ((m = e.match(/^intrapulmonary part of (right|left) inferior pulmonary vein$/))) return `Внутрилёгочная часть ${m[1] === 'right' ? 'правой' : 'левой'} нижней лёгочной вены`;
  if ((m = e.match(/^intrapulmonary part of (right|left) pulmonary artery$/))) return `Внутрилёгочная часть ${m[1] === 'right' ? 'правой' : 'левой'} лёгочной артерии`;
  if (e === 'trunk of intrapulmonary vein') return 'Туловище внутрилёгочной вены';
  if ((m = e.match(/^posterior branch of (right|left) anterior segmental artery$/))) return `Задняя ветвь ${m[1] === 'right' ? 'правой' : 'левой'} передней сегментарной артерии`;
  if ((m = e.match(/^(right|left) intrapulmonary part of (right|left) superior pulmonary vein$/))) return `Внутрилёгочная часть ${m[2] === 'right' ? 'правой' : 'левой'} верхней лёгочной вены`;
  if ((m = e.match(/^intrapulmonary part of (right|left) superior pulmonary vein$/))) return `Внутрилёгочная часть ${m[1] === 'right' ? 'правой' : 'левой'} верхней лёгочной вены`;
  if ((m = e.match(/^(right|left) superior segmental artery$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} верхняя сегментарная артерия`;
  if ((m = e.match(/^(medial|superior|lateral) branch of (right|left) superior segmental artery$/))) return `${m[1] === 'medial' ? 'Медиальная' : m[1] === 'superior' ? 'Верхняя' : 'Латеральная'} ветвь ${m[2] === 'right' ? 'правой' : 'левой'} верхней сегментарной артерии`;
  if (e === 'thalamogeniculate artery') return 'Таламоколенчатая артерия';
  if ((m = e.match(/^(right|left) thalamogeniculate artery$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} таламоколенчатая артерия`;
  if (e === 'lateral geniculate body') return 'Латеральное коленчатое тело';
  if (e === 'medial geniculate body') return 'Медиальное коленчатое тело';
  if ((m = e.match(/^(right|left) (lateral|medial) geniculate body$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} ${m[2] === 'lateral' ? 'латеральное' : 'медиальное'} коленчатое тело`;
  if (e === 'inferomedial branch of right pulmonary artery') return 'Нижнемедиальная ветвь правой лёгочной артерии';
  if (e === 'inferomedial part of right bronchial tree') return 'Нижнемедиальная часть правого бронхиального дерева';
  if ((m = e.match(/^(right|left) side of rib cage$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} боковая стенка грудной клетки`;
  if ((m = e.match(/^fascia lata of (right|left) thigh$/))) return `Широкая фасция ${m[1] === 'right' ? 'правого' : 'левого'} бедра`;
  if ((m = e.match(/^trunk of (right|left) middle cerebral artery$/))) return `Туловище ${m[1] === 'right' ? 'правой' : 'левой'} средней мозговой артерии`;
  if ((m = e.match(/^(right|left) pectoral part of chest$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} грудная часть грудной клетки`;
  if (e === 'eleventh rib') return 'Одиннадцатое ребро';
  if (e === 'twelfth rib') return 'Двенадцатое ребро';
  if ((m = e.match(/^(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) (thoracic|cervical|lumbar) vertebra$/))) {
    const ordinal = { first: 'Первый', second: 'Второй', third: 'Третий', fourth: 'Четвёртый', fifth: 'Пятый', sixth: 'Шестой', seventh: 'Седьмой', eighth: 'Восьмой', ninth: 'Девятый', tenth: 'Десятый', eleventh: 'Одиннадцатый', twelfth: 'Двенадцатый' }[m[1]];
    const region = { thoracic: 'грудной', cervical: 'шейный', lumbar: 'поясничный' }[m[2]];
    return `${ordinal} ${region} позвонок`;
  }
  if ((m = e.match(/^(thoracic|cervical|lumbar) vertebra$/))) return `${m[1] === 'thoracic' ? 'Грудной' : m[1] === 'cervical' ? 'Шейный' : 'Поясничный'} позвонок`;
  if (e === 'intervertebral disk') return 'Межпозвоночный диск';
  if ((m = e.match(/^intervertebral disk of (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) (thoracic|cervical|lumbar) vertebra$/))) {
    const ordinal = { first: 'первого', second: 'второго', third: 'третьего', fourth: 'четвёртого', fifth: 'пятого', sixth: 'шестого', seventh: 'седьмого', eighth: 'восьмого', ninth: 'девятого', tenth: 'десятого', eleventh: 'одиннадцатого', twelfth: 'двенадцатого' }[m[1]];
    const region = { thoracic: 'грудного', cervical: 'шейного', lumbar: 'поясничного' }[m[2]];
    return `Межпозвоночный диск ${ordinal} ${region} позвонка`;
  }
  if ((m = e.match(/^intervertebral disk of (thoracic|cervical|lumbar) vertebra$/))) return `Межпозвоночный диск ${m[1] === 'thoracic' ? 'грудного' : m[1] === 'cervical' ? 'шейного' : 'поясничного'} позвонка`;
  if (e === 'muscle of vertebral column') return 'Мышца позвоночного столба';
  if (e === 'vertebral column') return 'Позвоночный столб';
  if (e === 'thoracic vertebral column') return 'Грудной позвоночный столб';
  if (e === 'cervical vertebral column') return 'Шейный позвоночный столб';
  if (e === 'lumbar vertebral column') return 'Поясничный позвоночный столб';
  if (e === 'right conus artery') return 'Правая конусная артерия';
  if ((m = e.match(/^(right|left) (upper|lower) limb$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} ${m[2] === 'upper' ? 'верхняя' : 'нижняя'} конечность`;
  if ((m = e.match(/^(right|left) maxilla$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} верхняя челюсть`;
  if ((m = e.match(/^(right|left) upper eyelid$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} верхнее веко`;
  if ((m = e.match(/^(right|left) internal capsule$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} внутренняя капсула`;
  if ((m = e.match(/^(right|left) (superior|middle|inferior) frontal gyrus$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} ${m[2] === 'superior' ? 'верхняя' : m[2] === 'middle' ? 'средняя' : 'нижняя'} лобная извилина`;
  if ((m = e.match(/^(right|left) superior parietal lobule$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} верхняя теменная долька`;
  if ((m = e.match(/^posterior part of (right|left) superior temporal gyrus$/))) return `Задняя часть ${m[1] === 'right' ? 'правой' : 'левой'} верхней височной извилины`;
  if ((m = e.match(/^(right|left) superior colliculus$/))) return `${m[1] === 'right' ? 'Правый' : 'Левый'} верхний холмик`;
  if ((m = e.match(/^(right|left) superior segmental artery$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} верхняя сегментарная артерия`;
  if ((m = e.match(/^(right|left) (anterior|posterior|superior|inferior) segmental (artery|vein)$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} ${m[2] === 'anterior' ? 'передняя' : m[2] === 'posterior' ? 'задняя' : m[2] === 'superior' ? 'верхняя' : 'нижняя'} сегментарная ${m[3] === 'artery' ? 'артерия' : 'вена'}`;
  if ((m = e.match(/^(right|left) superior segmental bronchial tree$/))) return `${m[1] === 'right' ? 'Правое' : 'Левое'} верхнее сегментарное бронхиальное дерево`;
  if ((m = e.match(/^(right|left) (upper|lower) lobar (artery|vein)$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} ${m[2] === 'upper' ? 'верхняя' : 'нижняя'} долевая ${m[3] === 'artery' ? 'артерия' : 'вена'}`;
  if ((m = e.match(/^(lateral|medial) branch of (right|left) superior cerebellar artery$/))) return `${m[1] === 'lateral' ? 'Латеральная' : 'Медиальная'} ветвь ${m[2] === 'right' ? 'правой' : 'левой'} верхней мозжечковой артерии`;
  if ((m = e.match(/^(right|left) side of heart$/))) return `${m[1] === 'right' ? 'Правая' : 'Левая'} половина сердца`;
  if (e === 'rib cage') return 'Грудная клетка';
  if ((m = e.match(/^(proximal|middle|distal) phalanx of (right|left) thumb$/))) return `${m[1] === 'proximal' ? 'Проксимальная' : m[1] === 'middle' ? 'Средняя' : 'Дистальная'} фаланга ${m[2] === 'right' ? 'правого' : 'левого'} большого пальца`;
  return null;
}

function problemTypes(value, candidate) {
  const types = [];
  if (translit.test(value.ru) || (candidate && translit.test(value.ru))) types.push('TRANSLITERATION');
  if (english.test(value.ru)) types.push('ENGLISH_LEAK');
  if (badAgreement.test(value.ru) || embeddedLaterality.test(value.ru)) types.push('GENDER', 'AGREEMENT');
  if (badOrdinal.test(value.ru)) types.push('AGREEMENT');
  if (badMorphology.test(value.ru)) types.push('MORPHOLOGY', 'AGREEMENT');
  const q = qa.get(value.id);
  if (q?.status === 'FIX' && q.reason.includes('word_order')) types.push('WORD_ORDER');
  return [...new Set(types)];
}

const rows = [];
for (const [conceptId, value] of Object.entries(anatomy)) {
  const q = qa.get(conceptId);
  const candidate = explicit(value.en) ?? (q?.status === 'FIX' ? q.suggested_ru : '');
  const currentProblem = translit.test(value.ru) || english.test(value.ru) || badAgreement.test(value.ru) || embeddedLaterality.test(value.ru) || badOrdinal.test(value.ru) || badMorphology.test(value.ru);
  const qUsable = q?.current_ru === value.ru;
  const qCandidate = candidate && candidate !== value.ru && (explicit(value.en) || qUsable) && !/[A-Za-z]/.test(candidate) && !/\s[А-ЯЁ]/.test(candidate) && !translit.test(candidate) && !badAgreement.test(candidate) && !badOrdinal.test(candidate) && !badMorphology.test(candidate) && !agreementDefect(candidate);
  const types = problemTypes({ ...value, id: conceptId }, candidate);
  if (!currentProblem && !qCandidate) continue;
  const apply = Boolean(qCandidate);
  rows.push({ conceptId, en: value.en, current_ru: value.ru, problem_type: types.join('|') || 'OTHER', decision: apply ? 'APPLY' : 'REVIEW', confidence: apply ? 'HIGH' : 'LOW', final_ru: apply ? candidate : '', reason: apply ? 'Явный языковой дефект; форма однозначно восстановлена по en и согласованным анатомическим шаблонам.' : 'Подозрение найдено, но безопасная русская форма требует внешней редакторской проверки.' });
}

const columns = ['conceptId', 'en', 'current_ru', 'problem_type', 'decision', 'confidence', 'final_ru', 'reason'];
const out = [columns.join('\t'), ...rows.map(row => columns.map(column => String(row[column] ?? '').replace(/[\t\r\n]/g, ' ')).join('\t'))];
fs.writeFileSync('scripts/translation/linguistic-cleanup-review.tsv', `${out.join('\n')}\n`);
const counts = {};
for (const row of rows) counts[`${row.decision}/${row.confidence}`] = (counts[`${row.decision}/${row.confidence}`] ?? 0) + 1;
console.log(`suspicious: ${rows.length}`);
for (const [key, count] of Object.entries(counts)) console.log(`${key}: ${count}`);
