type AnalyticsValue = string | number | boolean;
export type AnalyticsData = Record<string, AnalyticsValue>;
export type AnalyticsEvent = 'search' | 'structure_opened' | 'language_toggle' | 'download_mac' | 'download_windows' | 'about_opened';

type UmamiClient = {track:(name:string,data?:AnalyticsData)=>void};
type AnalyticsWindow = Window & {
  umami?:UmamiClient;
  __TAURI__?:unknown;
  __TAURI_INTERNALS__?:unknown;
};

export type AnalyticsRuntime = {
  production:boolean;
  deploymentTarget?:string;
  window?:AnalyticsWindow;
  document?:Document;
};

export const UMAMI_SCRIPT='https://cloud.umami.is/script.js';
export const UMAMI_WEBSITE_ID='4e14b236-ced8-49c3-84ab-d3183031b210';
const buildEnv=import.meta.env??{};

function isTauri(runtime:AnalyticsRuntime) {
  const win=runtime.window;
  return !!win && (!!win.__TAURI__||!!win.__TAURI_INTERNALS__||win.navigator.userAgent.toLowerCase().includes('tauri'));
}

export function createAnalytics(runtime:AnalyticsRuntime) {
  const enabled=runtime.production&&runtime.deploymentTarget==='pages'&&!isTauri(runtime);

  function initialize() {
    if(!enabled||!runtime.document)return false;
    const existing=runtime.document.querySelector(`script[data-website-id="${UMAMI_WEBSITE_ID}"]`);
    if(existing)return true;
    const script=runtime.document.createElement('script');
    script.defer=true;
    script.src=UMAMI_SCRIPT;
    script.dataset.websiteId=UMAMI_WEBSITE_ID;
    runtime.document.head.appendChild(script);
    return true;
  }

  function trackEvent(name:AnalyticsEvent,data?:AnalyticsData) {
    if(!enabled)return;
    try { runtime.window?.umami?.track(name,data); } catch { /* analytics must never affect the app */ }
  }

  return {enabled,initialize,trackEvent};
}

export const analytics=createAnalytics({
  production:buildEnv.PROD,
  deploymentTarget:buildEnv.VITE_DEPLOY_TARGET,
  window:typeof window==='undefined'?undefined:window as AnalyticsWindow,
  document:typeof document==='undefined'?undefined:document,
});

export const {trackEvent}=analytics;
