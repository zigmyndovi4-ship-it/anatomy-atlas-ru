import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';

async function run(script) {
  await new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[script],{stdio:'inherit'});
    child.on('error',reject);
    child.on('exit',code=>code===0?resolve():reject(new Error(`${script} exited with ${code}`)));
  });
}

await run('scripts/validate-atlas.mjs');
await run('scripts/validate-interactions.mjs');
await run('scripts/test-analytics.mjs');
const analytics=await readFile('app/analytics.ts','utf8');
assert.match(analytics,/deploymentTarget==='github-pages'/);
assert.match(analytics,/__TAURI_INTERNALS__/);
console.log('Smoke checks passed.');
