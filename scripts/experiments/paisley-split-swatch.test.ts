import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildPaisleySplit } from './paisley-split-swatch.js';
import { verifyPaisleySplit } from './verify-paisley-split.js';
import { knitoutToKCodeWithTrace } from '../../packages/machine-lib/src/knitout/kniterate/to-kcode.js';
const built=buildPaisleySplit();
function mutated(source:string){assert.notEqual(source,built.source);const compiled=knitoutToKCodeWithTrace(source,'program.k');assert(compiled.ok);return {...built,source,compiled};}
test('serialized loops, supported splits, decreases, motif and yarn-path joins',()=>{const r=verifyPaisleySplit(built);assert.equal(r.increases,13);assert.equal(r.decreases,13);});
test('historical silhouette and every interior cell match issued paisley',()=>{
 const old=JSON.parse(fs.readFileSync('docs/physical-trials/2026-11-12/reversible-mixed-paisley-spaced/plan.json','utf8'));
 for(const row of built.rows){const previous=old.rows[row.row-1];assert.equal(row.width,previous.width);for(let x=1;x<row.width-2;x++)assert.equal(row.front[x],previous.front[x]);}
});
test('reject unsupported rear loop caused by replacing first split with knit',()=>{
 const source=built.source.replace(/^split \+ f(\d+) b\1 ([34])$/m,'knit + f$1 $2');const candidate=mutated(source);assert.throws(()=>verifyPaisleySplit(candidate));
});
test('reject extra take-down after split when colourwork creates a separate pass',()=>{
 const source=built.source.replace(/(split - f\d+ b\d+ [34]\nx-roller-advance )0/,(_,prefix)=>prefix+'450');const candidate=mutated(source);assert.throws(()=>verifyPaisleySplit(candidate));
});
test('reject lost fixed-side joins even with valid per-row loop counts',()=>{
 const source=built.source.replace(/^(knit [+-]) ([fb])119 ([34])$/gm,(_,op,bed,c)=>`${op} ${c==='3'?'f':'b'}119 ${c}`);
 const candidate=mutated(source);assert.throws(()=>verifyPaisleySplit(candidate));
});
