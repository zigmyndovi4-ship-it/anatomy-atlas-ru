import assert from 'node:assert/strict';
import {createAnalytics,UMAMI_SCRIPT,UMAMI_WEBSITE_ID} from '../app/analytics.ts';

function fakeDocument() {
  const scripts=[];
  return {
    scripts,
    head:{appendChild(script){scripts.push(script);}},
    querySelector(){return scripts.find(script=>script.dataset.websiteId===UMAMI_WEBSITE_ID)??null;},
    createElement(){return {dataset:{},defer:false,src:''};},
  };
}

function fakeWindow(umami) {
  return {navigator:{userAgent:'Mozilla/5.0'},umami};
}

const local=createAnalytics({production:false,deploymentTarget:'pages',window:fakeWindow(),document:fakeDocument()});
assert.equal(local.enabled,false);
assert.equal(local.initialize(),false);
assert.doesNotThrow(()=>local.trackEvent('about_opened',{language:'ru'}));

const missingClient=createAnalytics({production:true,deploymentTarget:'pages',window:fakeWindow(),document:fakeDocument()});
assert.equal(missingClient.enabled,true);
assert.equal(missingClient.initialize(),true);
assert.doesNotThrow(()=>missingClient.trackEvent('search',{language:'ru',result_count:2,query_length:4}));

const calls=[];
const document=fakeDocument();
const production=createAnalytics({production:true,deploymentTarget:'pages',window:fakeWindow({track:(name,data)=>calls.push({name,data})}),document});
assert.equal(production.initialize(),true);
assert.equal(document.scripts.length,1);
assert.equal(document.scripts[0].src,UMAMI_SCRIPT);
assert.equal(document.scripts[0].defer,true);
assert.equal(document.scripts[0].dataset.websiteId,UMAMI_WEBSITE_ID);
production.trackEvent('structure_opened',{conceptId:'FMA1',language:'ru',source:'3d'});
assert.deepEqual(calls,[{name:'structure_opened',data:{conceptId:'FMA1',language:'ru',source:'3d'}}]);
production.trackEvent('download_mac',{version:'0.1.1',architecture:'arm64',format:'dmg'});
assert.deepEqual(calls[1],{name:'download_mac',data:{version:'0.1.1',architecture:'arm64',format:'dmg'}});

const tauri=createAnalytics({production:true,deploymentTarget:'pages',window:{...fakeWindow(),__TAURI_INTERNALS__:{}},document:fakeDocument()});
assert.equal(tauri.enabled,false);
assert.equal(tauri.initialize(),false);
assert.doesNotThrow(()=>tauri.trackEvent('about_opened',{language:'en'}));

console.log('Analytics helper checks passed: local disabled, missing client safe, production web script/events enabled, Tauri disabled.');
