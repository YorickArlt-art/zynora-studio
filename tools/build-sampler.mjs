import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../supabase/functions/zynora-beta/',import.meta.url);
const base=await readFile(new URL('sampler-client.js',root),'utf8');
const phone=await readFile(new URL('sampler-phone.js',root),'utf8');
const source=base+'\n'+phone;
await writeFile(new URL('sampler-source.mjs',root),'export const source='+JSON.stringify(source)+';\n');
console.log('Sampler bundle rebuilt from sampler-client.js.');
