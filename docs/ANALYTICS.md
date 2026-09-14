# Web analytics

Anatomy Atlas RU uses Umami Cloud for privacy-friendly analytics in the public GitHub Pages web deployment only.

- Provider: Umami Cloud
- Region: Europe
- Website ID: `4e14b236-ced8-49c3-84ab-d3183031b210`
- Script: `https://cloud.umami.is/script.js`

Tracked events:

- `search`: language, result count, and query length; the search text is never sent.
- `structure_opened`: concept ID, language, and source (`search`, `3d`, or `other`).
- `language_toggle`: source and destination language.
- `download_mac` and `download_windows`: reserved for platform download links when present.
- `about_opened`: language.

Analytics is disabled for localhost, local development, non-GitHub-Pages deployments, Playwright/test runs, and Tauri macOS or Windows builds. The app does not send IP addresses manually, email addresses, names, user IDs, full search queries, or other personal or sensitive data. If the Umami client is unavailable, event calls are safely ignored and the viewer continues to work.

The deployment loads the Umami script from the exact Umami Cloud origin and does not add a broad Content Security Policy. No existing CSP was present in this static app.
