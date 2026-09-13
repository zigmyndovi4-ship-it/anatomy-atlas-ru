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

## Windows

Signed Windows installers require a code-signing certificate and its protected
password, stored as GitHub Actions secrets or provided by a dedicated signing
service. Unsigned NSIS installers may trigger a SmartScreen warning because
they do not yet have publisher reputation.

Do not disable Gatekeeper or SmartScreen globally. Verify the download source,
release tag, and checksums instead. Signing is a follow-up release-hardening
step, not a prerequisite for testing this v0.1.1 pipeline.
