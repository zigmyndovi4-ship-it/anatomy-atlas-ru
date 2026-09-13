# Desktop QA checklist

The desktop shell uses the existing Vite production output and does not change
the web application or anatomy data.

## macOS local checklist

- [ ] `.app` starts from the generated bundle.
- [ ] DMG opens and contains the application.
- [ ] WebGL canvas renders.
- [ ] Russian and English search work.
- [ ] RU/EN toggle updates the interface and detail card.
- [ ] Window resize keeps the canvas and controls usable.
- [ ] About/Credits remains available.
- [ ] No native shell crash occurs during repeated search and selection.

## Local build evidence

On the Apple Silicon Mac mini used for this release:

- Rust `1.98.1` and Tauri CLI `2.11.4` are installed.
- The release `.app` was built and launched as a live process.
- The release DMG was created at
  `src-tauri/target/release/bundle/macos/Anatomy Atlas RU_0.1.1_aarch64.dmg`.
- The managed non-interactive session cannot run Finder's optional AppleScript
  window-decoration step. The official `create-dmg --skip-jenkins` fallback
  produced the same unsigned DMG without custom Finder icon positioning.
- The frontend behavior is covered by the existing 10/10 Chromium/WebGL suite;
  native signing and Windows GUI QA remain release follow-ups.

## CI checklist

- [ ] macOS `aarch64-apple-darwin` DMG is produced.
- [ ] Windows `x86_64-pc-windows-msvc` NSIS installer is produced.
- [ ] No signing credentials are required for the unsigned v0.1.1 build.

The browser/WebGL interaction suite remains the primary automated functional
test because it exercises the same bundled frontend in Chromium.
