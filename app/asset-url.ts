/** Resolve files from public/ for both GitHub Pages and the Tauri bundle. */
export function assetUrl(path: string): string {
  const base = (import.meta as ImportMeta & {env?: {BASE_URL?: string}}).env?.BASE_URL ?? '/';
  return `${base}${path.replace(/^\/+/, '')}`;
}
