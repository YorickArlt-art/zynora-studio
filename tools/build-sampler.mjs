import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../supabase/functions/zynora-beta/',import.meta.url);
const source=await readFile(new URL('sampler-client.js',root),'utf8');
await writeFile(new URL('sampler-source.mjs',root),'export const source='+JSON.stringify(source)+';\n');
console.log('Sampler bundle rebuilt from sampler-client.js.');
