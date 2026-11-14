import test from 'node:test';
import assert from 'node:assert/strict';
import { buildColourPreserving } from './colour-preserving-increase.js';
import { verifyColourPreserving } from './verify-colour-preserving.js';
import { knitoutToKCodeWithTrace } from '../../packages/machine-lib/src/knitout/kniterate/to-kcode.js';
const built=buildColourPreserving();
function mutate(source:string){assert.notEqual(source,built.source);const compiled=knitoutToKCodeWithTrace(source,'program.k');assert(compiled.ok);return verifyColourPreserving({...built,source,compiled});}
test('full frame, two supported same-colour increases, both joins and colour restoration',()=>{const r=verifyColourPreserving(built);assert(r.passed,JSON.stringify(r));assert.equal(r.events.length,4);assert.equal(r.rows.at(-1)!.hi-r.rows[0].hi,2);assert.equal(r.joins.length,10);});
test('no-tuck variant fails joining despite intact same-colour increase loops',()=>{const r=verifyColourPreserving(buildColourPreserving({join:false}));assert(!r.passed);assert(r.errors.some(x=>x.includes('missing tuck join')));});
test('missing temporary-loop restoration fails colour/occupancy checks',()=>{const source=built.source.replace(/^xfer b136 f135\n/m,'');const r=mutate(source);assert(!r.passed);assert(r.errors.some(x=>x.includes('occupancy')||x.includes('temporary loop')));});
test('wrong split yarn fails same-colour ancestry check',()=>{const source=built.source.replace(/^(split [+-] f134 b134) 4$/m,'$1 3');const r=mutate(source);assert(!r.passed);assert(r.errors.includes('Split crossed colour parent'));});
test('missing rear return cannot be hidden by following whole rows',()=>{const source=built.source.replace(/^xfer f135 b134\n/m,'');const r=mutate(source);assert(!r.passed);assert(r.errors.some(x=>x.includes('occupancy')));});
