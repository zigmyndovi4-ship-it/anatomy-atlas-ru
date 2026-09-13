# Anatomy Atlas RU v0.1.0

## Highlights

Первый релиз Anatomy Atlas RU как самостоятельного open-source продукта:
русскоязычный интерфейс, 3D WebGL-анатомия, поиск и responsive UI.

## What is included

- 3 432 анатомические concepts с русской локализацией;
- RU/EN интерфейс и поиск по русским, английским названиям, aliases и FMA ID;
- выбор, detail card, изоляция, режим разборки и переключение систем;
- desktop, tablet и mobile layouts;
- Playwright Chromium/WebGL QA и smoke contracts.

## Known limitations

- 11 deferred terminology concepts оставлены для внешней медицинской редакторской проверки;
- validator сохраняет 15 диагностических findings для служебных/неоднозначных форм;
- production JavaScript bundle имеет warning о размере >500 kB;
- native desktop app пока отсутствует.

Эти ограничения не блокируют текущий v0.1.0 release, но учитываются в roadmap.

## Testing

Перед release прошли:

```sh
node scripts/translation/status.mjs
node scripts/translation/validate-russian-terminology.mjs
npm run test:smoke
npm run test:e2e
npm run check
npm run build
git diff --check
```

Playwright: 10/10 passed, WebGL context и canvas rendering проверены на восьми
viewport-размерах. Console errors, page errors, failed requests и HTTP 400+
responses не обнаружены.

## Licensing / attribution

Код распространяется по MIT License. Исходный application code основан на
Human Atlas by ashemag. Анатомические данные происходят из BodyParts3D 4.0 и
распространяются по CC BY 4.0. Полная attribution находится в
[public/ATTRIBUTION.md](../public/ATTRIBUTION.md), сводка — в
[public/CREDITS.md](../public/CREDITS.md).
