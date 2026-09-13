# Финальный пересмотр русской анатомической терминологии

Дата: 2026-09-13

## Итог

Проверены все 3432 concepts из `public/models/anatomy-ru.json`. На основании
итогового TSV автоматически применены только исправления с `decision=APPLY` и
`confidence=HIGH`.

| Решение | Количество |
| --- | ---: |
| KEEP | 1390 |
| APPLY / HIGH | 609 |
| APPLY / MEDIUM | 694 |
| REVIEW | 1144 |

В словаре реально изменено 609 значений `ru` (204 в основном проходе и 405 в
validator cleanup-pass). Поля `conceptId` и `en` не
изменялись; `atlas.json` и геометрия моделей не изменялись.

## Что исправлено

Исправлены однозначные ошибки согласования и терминологии в проверенных
семействах: стороны сосудов и их ветвей, рёбра и рёберные хрящи, части тощей
кишки, платизма, мышца-напрягатель широкой фасции, фаланги пальцев и собственно
ладонные пальцевые сосуды. Исправления сохраняют полный смысл английского/FMA
названия.

Примеры:

- `Левый напрягатель фаскиаэ латаэ` → `Левая мышца, напрягающая широкую фасцию`;
- `Левый третья ребро` → `Левое третье ребро`;
- `Средняя часть тощая кишка` → `Средняя часть тощей кишки`;
- `Левый платизма` → `Левая подкожная мышца шеи`;
- `...вена левый мизинца палец` → `...вена левого мизинца`.

## Оставшиеся ограничения

`APPLY / MEDIUM` и `REVIEW` не применялись. В них есть кандидаты, требующие
проверки русским анатомическим источником, а также сложные FMA-агрегаты,
ветви и производные, для которых нельзя безопасно вывести нормативную форму
только из английского и латинского TA2.

До отдельного cleanup-pass автоматический detector выявлял 577 подозрительных
строк (555 согласований сторон, 22 транслитерации). Это был диагностический
результат, а не утверждение о медицинской неправильности каждой строки.

## Mapping и причины

По `ta-mapping.tsv`: EXACT — 570, PROBABLE — 646, NO_MATCH — 2216.
В итоговом review причины исправлений представлены грамматикой, латеральностью,
порядком слов, потерей информации и терминологией; автоматическое применение
ограничено только уверенными случаями из exact TA2 и детерминированных семейств.

## Артефакты

- `scripts/translation/final-normative-review.tsv` — полный построчный audit;
- `scripts/translation/validate-russian-terminology.mjs` — detector подозрительных
  русских строк;
- `scripts/translation/ta-mapping.tsv` — сопоставление с TA2;
- `scripts/translation/exact-ta-review.tsv` — углублённая проверка exact-пересечения.

## Источники и лицензии

Использованы структура FMA, официальный TA2/FIPAT mapping и нормативная русская
анатомическая лексика. TA2/FIPAT использовался для подтверждения структуры и
латинско-английского соответствия, но не как автоматический источник русских
эквивалентов. Лицензии и attribution исходного Human Atlas и BodyParts3D не
изменялись.

## Следующий шаг

Провести ручную проверку 1144 `REVIEW` и 694 `APPLY / MEDIUM` с русским
анатомическим справочником, затем повторно прогнать validator и парный аудит
left/right. Не применять массовые предложения без источника.

## Validator cleanup pass

До cleanup-pass validator сообщал 577 findings, соответствующих 575 уникальным
concepts: две записи одновременно имели по две категории. Создан полный
`scripts/translation/validator-cleanup-review.tsv` с исходным `current_ru`,
типами проблемы, TA2-данными и решением для каждой подозрительной записи.

Применено 405 исправлений с `APPLY/HIGH`. Исправлялись только очевидные
согласования рода/стороны, порядковые числительные для рёбер, устойчивые
анатомические формы и явная транслитерация вроде `улнарис`, `ангулар`,
`дивисион` и `прэкоммуникатинг`. `REVIEW/LOW` не применялись.

После cleanup-pass validator сообщает 172 findings:

| Категория | До | После |
| --- | ---: | ---: |
| TRANSLITERATION | 22 | 10 |
| GRAMMAR | 0 самостоятельных* | 0 самостоятельных* |
| LATERALITY | 555 | 162 |
| LOST_INFORMATION | 0 | 0 |
| WORD_ORDER | 0 | 0 |
| TERMINOLOGY | 0 | 0 |
| OTHER | 0 | 0 |

\* Текущий validator помечает ошибки порядковых числительных как отдельную
grammar-категорию, но в исходном наборе они совпадали с laterality; после
применения high-confidence исправлений таких отдельных findings не осталось.

Оставшиеся 162 латерально-грамматические записи и 10 транслитерированных либо
являются сложными FMA-производными/агрегатами, либо требуют подтверждения
русским анатомическим источником. Они сознательно не применялись автоматически.

### 50 наиболее явных строк до cleanup-pass

```text
+FMA3802	laterality/gender agreement	Туловище правый коронарная артерия
FMA3815	laterality/gender agreement	Первая передняя желудочковая ветвь правый коронарная артерия
FMA3818	laterality/gender agreement	Краевая ветвь правый коронарная артерия
FMA3835	laterality/gender agreement	Задняя желудочковая ветвь правый коронарная артерия
FMA3837	laterality/gender agreement	Первая задняя желудочковая ветвь правый коронарная артерия
FMA3855	laterality/gender agreement	Туловище левый коронарная артерия
FMA3860	laterality/gender agreement	Диагональная ветвь передняя нисходящая ветвь левый коронарная артерия
FMA3868	laterality/gender agreement	Конус ветвь передняя межжелудочковая ветвь левый коронарная артерия
FMA3870	laterality/gender agreement	Правый передняя ветвь передняя межжелудочковая ветвь левый коронарная артерия
FMA3872	laterality/gender agreement	Первая правый передняя ветвь передняя межжелудочковая ветвь левый коронарная артерия
FMA3874	laterality/gender agreement	Вторая правый передняя ветвь передняя межжелудочковая ветвь левый коронарная артерия
FMA3876	laterality/gender agreement	Третья правый передняя ветвь передняя межжелудочковая ветвь левый коронарная артерия
FMA3958	laterality/gender agreement	Правый позвоночная артерия
FMA4057	laterality/gender agreement	Правый тыльная лопаточная артерия
FMA4066	laterality/gender agreement	Левый позвоночная артерия
FMA4112	laterality/gender agreement	Левый вторая задняя межрёберная артерия
FMA4134	laterality/gender agreement	Левый глубокая шейная артерия
FMA4634	laterality/gender agreement	Правый подрёберная артерия
FMA4654	laterality/gender agreement	Левый подрёберная артерия
FMA4708	laterality/gender agreement	Левый краевая вена
FMA4716	laterality/gender agreement	Правый краевая вена
FMA4755	laterality/gender agreement	Правый подключичная вена
FMA4763	laterality/gender agreement	Левый подключичная вена
FMA5041	laterality/gender agreement	Правый вторая задняя межрёберная артерия
FMA8531	laterality/gender agreement	Правый одиннадцатая ребро
FMA8532	laterality/gender agreement	Левый одиннадцатая ребро
FMA8533	laterality/gender agreement	Правый двенадцатая ребро
FMA8534	laterality/gender agreement	Левый двенадцатая ребро
FMA8634	laterality/gender agreement	Левый верхушечная сегментарный артерия
FMA8644	laterality/gender agreement	Левый медиальная базальная сегментарный артерия
FMA8646	laterality/gender agreement	Левый латеральная базальная сегментарный артерия
FMA9422	laterality/gender agreement	Правый медиальная базальная сегментарный вена
FMA9425	laterality/gender agreement	Правый латеральная базальная сегментарный вена
FMA9437	laterality/gender agreement	Левый верхушечная сегментарный вена
FMA9450	laterality/gender agreement	Левый латеральная базальная сегментарный вена
FMA9761	laterality/gender agreement	Правый поперечная мышца груди
FMA9762	laterality/gender agreement	Левый поперечная мышца груди
FMA10552	laterality/gender agreement	Левый тыльная лопаточная артерия
FMA10660	laterality/gender agreement	Правый глубокая шейная артерия
FMA10682	laterality/gender agreement	Левый поперечная шейная артерия
FMA10683	laterality/gender agreement	Левый поверхностная шейная артерия
FMA10699	laterality/gender agreement	Правый поперечная шейная артерия
FMA10700	laterality/gender agreement	Правый поверхностная шейная артерия
FMA13325	laterality/gender agreement	Правый латеральная подкожная вена
FMA13326	laterality/gender agreement	Левый латеральная подкожная вена
FMA13330	laterality/gender agreement	Правый подмышечная вена
FMA13331	laterality/gender agreement	Левый подмышечная вена
FMA13336	laterality/gender agreement	Правый наружная косая мышца
FMA13337	laterality/gender agreement	Левый наружная косая мышца
FMA13375	laterality/gender agreement	Правый грудная мышца малая
```

### 50 оставшихся наиболее подозрительных строк после cleanup-pass

```text
+FMA3870	laterality/gender agreement	Правый передняя ветвь передняя межжелудочковая ветвь левый коронарная артерия
FMA3872	laterality/gender agreement	Первая правый передняя ветвь передняя межжелудочковая ветвь левый коронарная артерия
FMA3874	laterality/gender agreement	Вторая правый передняя ветвь передняя межжелудочковая ветвь левый коронарная артерия
FMA3876	laterality/gender agreement	Третья правый передняя ветвь передняя межжелудочковая ветвь левый коронарная артерия
FMA8531	laterality/gender agreement	Правый одиннадцатая ребро
FMA8532	laterality/gender agreement	Левый одиннадцатая ребро
FMA8533	laterality/gender agreement	Правый двенадцатая ребро
FMA8534	laterality/gender agreement	Левый двенадцатая ребро
FMA22835	laterality/gender agreement	Правый поверхностная ладонная артериальная дуга
FMA22837	laterality/gender agreement	Левый поверхностная ладонная артериальная дуга
FMA22839	laterality/gender agreement	Правый глубокая ладонная дуга
FMA22840	laterality/gender agreement	Левый глубокая ладонная дуга
FMA22912	laterality/gender agreement	Правый глубокая ладонная венозная дуга
FMA22913	laterality/gender agreement	Левый глубокая ладонная венозная дуга
FMA22915	laterality/gender agreement	Правый поверхностная ладонная венозная дуга
FMA22916	laterality/gender agreement	Левый поверхностная ладонная венозная дуга
FMA23089	laterality/gender agreement	Правый поясничная вращатель
FMA23090	laterality/gender agreement	Левый поясничная вращатель
FMA32544	laterality/gender agreement	Правый надостная
FMA32545	laterality/gender agreement	Левый надостная
FMA32634	laterality/gender agreement	Проксимальная фаланга правый вторая палец стопы
FMA32635	laterality/gender agreement	Проксимальная фаланга левый вторая палец стопы
FMA32638	laterality/gender agreement	Проксимальная фаланга правый четвёртая палец стопы
FMA32639	laterality/gender agreement	Проксимальная фаланга левый четвёртая палец стопы
FMA32642	laterality/gender agreement	Средняя фаланга правый вторая палец стопы
FMA32643	laterality/gender agreement	Средняя фаланга левый вторая палец стопы
FMA32646	laterality/gender agreement	Средняя фаланга правый четвёртая палец стопы
FMA32647	laterality/gender agreement	Средняя фаланга левый четвёртая палец стопы
FMA32652	laterality/gender agreement	Дистальная фаланга правый вторая палец стопы
FMA32653	laterality/gender agreement	Дистальная фаланга левый вторая палец стопы
FMA32656	laterality/gender agreement	Дистальная фаланга правый четвёртая палец стопы
FMA32657	laterality/gender agreement	Дистальная фаланга левый четвёртая палец стопы
FMA38495	laterality/gender agreement	Правый длинная лучевая мышца, разгибающая запястье
FMA38496	laterality/gender agreement	Левый длинная лучевая мышца, разгибающая запястье
FMA38498	laterality/gender agreement	Правый короткая лучевая мышца, разгибающая запястье
FMA38499	laterality/gender agreement	Левый короткая лучевая мышца, разгибающая запястье
FMA42603	transliteration	Орган компонент клустэр
FMA43943	laterality/gender agreement	Правый подошвенная дуга
FMA43944	laterality/gender agreement	Левый подошвенная дуга
FMA45826	laterality/gender agreement	Правый шилоподъязычная
FMA45827	laterality/gender agreement	Левый шилоподъязычная
FMA46284	laterality/gender agreement	Верхняя косая мышца часть левый длинная колли
FMA46286	laterality/gender agreement	Вертикальная промежуточная часть левый длинная колли
FMA46288	laterality/gender agreement	Нижняя косая мышца часть левый длинная колли
FMA46309	laterality/gender agreement	Правый длинная головки
FMA46310	laterality/gender agreement	Левый длинная головки
FMA49072	laterality/gender agreement	Правый общая сухожильная кольцо
FMA49073	laterality/gender agreement	Левый общая сухожильная кольцо
FMA49443	transliteration	Анатомический кластер
FMA52629	laterality/gender agreement	Правый слёзная нерв
```
