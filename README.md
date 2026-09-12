# Anatomy Atlas RU

An interactive 3D anatomy explorer for an adult male reference model. The working product name is **Anatomy Atlas RU**; the project is based on [Human Atlas by ashemag](https://github.com/ashemag/human-atlas), with Russian localization and additional product changes maintained here.

## Возможности

- интерактивная 3D-модель анатомических структур BodyParts3D;
- интерфейс на русском и английском языках;
- поиск по английским и русским названиям, aliases и идентификаторам FMA/концептов;
- выбор структуры, просмотр связанных частей, изоляция и режим разборки;
- переключение анатомических систем и управление сценой на мобильных экранах;
- 3 432 именованных concepts, переведённых на русский язык.

## Локальный запуск

Требуется Node.js 22.13 или новее. API-ключи и аккаунты не нужны.

```sh
npm install
npm run dev
```

Откройте http://localhost:3016. Production-сборка выполняется командой `npm run build` и создаёт каталог `dist/`.

## Проверки

```sh
npm run check
node scripts/translation/status.mjs
node scripts/validate-atlas.mjs
node scripts/validate-interactions.mjs
npm run build
```

## Происхождение и лицензии

Исходный код приложения основан на [Human Atlas](https://github.com/ashemag/human-atlas) авторства ashemag и распространяется по [MIT License](LICENSE). Русская локализация, aliases, документация и дополнительные изменения выполнены в этом репозитории.

Анатомические данные происходят из BodyParts3D 4.0, © The Database Center for Life Science, и распространяются по [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Полная обязательная атрибуция и сведения об адаптации находятся в [public/ATTRIBUTION.md](public/ATTRIBUTION.md); сводка credits находится в [public/CREDITS.md](public/CREDITS.md).

Модель представляет взрослую мужскую референсную анатомию, не охватывает все возможные структуры и варианты и предназначена для обучения, а не для диагностики или хирургической навигации.

## Статус

Русская локализация завершена: 3 432 из 3 432 concepts переведены, пропуски отсутствуют. Проект собирается локально и сохраняет исходные модельные данные, геометрию, идентификаторы и attribution.

## Roadmap

Приоритеты развития зафиксированы в [docs/ROADMAP.md](docs/ROADMAP.md). Ближайшая задача — поддерживать стабильность, локализацию, документацию, credits/licenses и QA. Desktop-упаковка, избранное и расширенный поиск остаются следующими этапами и не входят в текущий ночной проход.
