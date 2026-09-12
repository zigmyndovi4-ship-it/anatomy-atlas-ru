# Desktop app feasibility

## Assessment

The current Vite/React entry point is a reasonable base for a future Tauri desktop app: it serves a static viewer, keeps anatomy assets local, has no required API keys, and already builds with Vite. No Tauri packages or configuration were added during this pass.

## Likely work later

1. Add the Tauri CLI and Rust application shell in a dedicated change.
2. Add `src-tauri/tauri.conf.json`, Rust source, icons, and scripts such as `tauri:dev` and `tauri:build`.
3. Reuse the existing Vite `dist` output and explicitly include `public/models` in the packaged resources.
4. Verify asset loading, WebGL context handling, window sizing, keyboard shortcuts, and update/release signing on macOS.
5. Add a reproducible macOS build workflow only after a desktop dependency decision is made.

## macOS permissions

The viewer should not need camera, microphone, contacts, location, or network permissions. A future release may need standard app-bundle signing/notarization entitlements, but it should request no user-data permissions unless a separately approved feature requires them.

## Main risks

- The compressed and uncompressed 3D assets increase bundle size and update time.
- WebGL behavior and GPU memory use vary across Intel, Apple Silicon, and integrated GPUs.
- Tauri/Rust toolchain installation increases CI and contributor requirements.
- The current static deployment assumptions must remain valid when assets are loaded from the packaged resource base URL.
