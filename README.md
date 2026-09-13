# Anatomy Atlas RU

An open-source Russian-language 3D human anatomy atlas based on BodyParts3D/FMA.
The application is based on [Human Atlas by ashemag](https://github.com/ashemag/human-atlas), with Russian localization and additional product changes maintained in this repository.

Открытый русскоязычный 3D-анатомический атлас человека для образовательного и справочного использования.

## Возможности

- интерактивная WebGL-модель взрослой мужской референсной анатомии;
- 3 432 анатомические структуры и русская локализация 3 432/3 432 concepts;
- интерфейс и карточки структур на русском и английском языках;
- поиск по русским и английским названиям, aliases и FMA ID;
- выбор структуры, detail card, связанные части, изоляция и режим разборки;
- responsive UI для desktop, tablet и mobile;
- базовая keyboard/accessibility поддержка;
- локальная работа без API-ключей, аналитики и телеметрии.

## Скриншоты

![Главный экран](docs/screenshots/desktop-home.png)

![Поиск](docs/screenshots/desktop-search.png)

![Выбранная структура](docs/screenshots/desktop-structure.png)

![English interface](docs/screenshots/desktop-en.png)

![Mobile interface](docs/screenshots/mobile.png)

## Запуск

Требования: Node.js 22.13+ и npm.

```sh
npm install
npm run dev
```

Откройте <http://localhost:3016>.

Production-сборка:

```sh
npm run build
```

## Проверки

```sh
npm run test:smoke
npm run test:e2e
npm run check
npm run build
```

Playwright suite проверяет Chromium/WebGL, поиск, selection flow, RU/EN toggle,
responsive layout и отсутствие console/network errors на desktop, tablet и mobile.

## Источники данных

Анатомическая модель и исходные метаданные происходят из BodyParts3D 4.0,
© The Database Center for Life Science. Concept IDs и английские названия
связаны с FMA. Terminologia Anatomica 2 / FIPAT использовалась как один из
источников терминологической сверки в QA-проходах.

Русский словарь этого проекта не является официальным изданием TA2 и не
утверждает воспроизведение полного русского TA2.

## Лицензии и attribution

- код приложения — [MIT License](LICENSE);
- исходный проект — [Human Atlas by ashemag](https://github.com/ashemag/human-atlas), авторство и лицензия сохранены;
- анатомические данные BodyParts3D — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/);
- полная attribution, ссылки на источники и сведения об адаптации — [public/ATTRIBUTION.md](public/ATTRIBUTION.md);
- сводка credits — [public/CREDITS.md](public/CREDITS.md).

Не заявляются права на исходную геометрию и данные сверх условий соответствующих лицензий.

## Статус

**v0.1.0 — первый публичный release.**

Локализация завершена: 3 432 из 3 432 concepts заполнены. Smoke, typecheck,
build и Chromium/WebGL e2e QA проходят. Известные ограничения перечислены в
[release notes](docs/RELEASE_NOTES_v0.1.0.md).

## Roadmap

- дальнейшее улучшение визуального UX и поиска;
- desktop app;
- избранное и связанные структуры;
- учебный режим и дополнительные тесты;
- optional AI explanations без изменения базовых анатомических данных.

Сроки не обещаются; roadmap не является обязательством по релизам.

## Contributing

См. [CONTRIBUTING.md](CONTRIBUTING.md). Приветствуются issues, bug reports,
предложения исправлений терминологии и pull requests с понятным описанием.

## Disclaimer

Проект предназначен только для образовательных и справочных целей. Он не
является заменой профессиональной медицинской консультации, диагностики,
лечения или хирургической навигации.
