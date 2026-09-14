# Desktop signing

v0.1.1 intentionally uses unsigned desktop bundles. This keeps the first
open-source packaging pipeline reproducible without storing private signing
credentials in the repository or GitHub.

## macOS

Production signing and notarization require an Apple Developer membership,
an Apple Developer Application certificate, a Developer ID Installer
certificate, and an App Store Connect API key or equivalent notarization
credentials. The CI workflow should receive these values only through GitHub
Actions secrets, never through committed files.

Typical future secrets are a signing certificate in an encrypted base64 form,
its password, an Apple team identifier, and notarization API-key material. The
exact secret names should be selected when signing is implemented. Until then,
the DMG is unsigned/ad-hoc and macOS may display an identity warning.

### Если macOS пишет, что приложение повреждено

Для v0.1.1 это может быть результатом Gatekeeper: приложение не имеет
подписи Apple Developer ID и notarization, поэтому macOS может считать его
недоверенным и показать сообщение «Приложение повреждено, и его не удается
открыть». Это не доказывает, что файл действительно повреждён.

Пользователь должен сначала скачать DMG с официальной [страницы релиза](https://github.com/zigmyndovi4-ship-it/anatomy-atlas-ru/releases),
скопировать `Anatomy Atlas RU.app` в `/Applications`, открыть Terminal и
выполнить:

```bash
xattr -dr com.apple.quarantine "/Applications/Anatomy Atlas RU.app"
```

После этого приложение можно открыть обычным способом. Команда действует
только на явно указанный application bundle; она не отключает Gatekeeper
глобально. Не следует применять её к приложениям из неизвестных источников и
не следует отключать системную защиту целиком.

Это временное ограничение unsigned-сборки v0.1.1. После появления Apple
Developer ID signing и notarization эта инструкция для подписанных релизов не
понадобится.

## Windows

Signed Windows installers require a code-signing certificate and its protected
password, stored as GitHub Actions secrets or provided by a dedicated signing
service. Unsigned NSIS installers may trigger a SmartScreen warning because
they do not yet have publisher reputation.

Do not disable Gatekeeper or SmartScreen globally. Verify the download source,
release tag, and checksums instead. Signing is a follow-up release-hardening
step, not a prerequisite for testing this v0.1.1 pipeline.
