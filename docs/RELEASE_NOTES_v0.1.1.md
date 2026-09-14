# Anatomy Atlas RU v0.1.1

## Highlights

- первый desktop-пакет на базе Tauri v2;
- macOS Apple Silicon DMG через GitHub Actions;
- Windows x86_64 NSIS installer через GitHub Actions;
- web-версия, русский словарь и анатомические данные сохранены без изменений.

## Web

Публичная браузерная версия публикуется через GitHub Pages из ветки `main`.

## macOS

DMG для Apple Silicon (`aarch64`).

## Windows

NSIS EXE installer для Windows x64.

## What is included

- 3D WebGL-анатомический атлас;
- русский и английский интерфейс и поиск;
- поиск по FMA ID;
- 3 432 локализованных concepts;
- responsive web UI и desktop shell.

## Known limitations

- первые desktop installers не подписаны коммерческими сертификатами;
- Windows MSI не собирается в первом desktop pipeline: выбран более простой NSIS `.exe`;
- Intel macOS/universal bundle пока не включён;
- native desktop app требует отдельного QA на Windows и на Intel Mac.
- 11 deferred terminology concepts / 15 validator diagnostic findings остаются
  явно отмеченными для внешней редакторской проверки;
- production JavaScript bundle превышает стандартный Vite warning threshold.

## Testing

Перед релизом проходят smoke, Playwright/WebGL e2e, TypeScript check и
production build. Локальная macOS сборка проверяется отдельно на Apple Silicon.

## Licensing / attribution

Код распространяется по MIT License. Анатомические данные BodyParts3D и
сведения об исходном Human Atlas сохраняют соответствующие attribution и
лицензионные условия; подробности находятся в [public/CREDITS.md](../public/CREDITS.md).
