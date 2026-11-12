/** Scoped rebuild of partner's hash-pinned edge experiment. Production emitters unchanged. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parseKnitoutProgram} from '../../packages/machine-lib/src/knitout/parser.js';
import {writeKnitoutProgram} from '../../packages/machine-lib/src/knitout/emitter.js';
import {knitoutToKCodeWithTrace} from '../../packages/machine-lib/src/knitout/kniterate/to-kcode.js';
import {knit,f,b,rack,xfer,drop,miss,xSpeedNumber,xRollerAdvance,xStitchNumber,xXferStitchNumber} from '../../packages/machine-lib/src/knitout/types.js';
const original=fs.readFileSync('fixtures/experiments/edge-swatch-original.k','utf8');
assert.equal(createHash('sha256').update(original).digest('hex'),'890992f60693ddb23e9baddf9fb9167ef72a248f6ea399f8f33aa841168a341a');
const parsed=parseKnitoutProgram(original);assert.equal(parsed.issues.length,0);
const ops=parsed.program.ops;
const firstXfer=ops.findIndex(o=>o.kind==='xfer');assert(firstXfer>0);
const body=ops.findIndex(o=>o.kind==='comment' && o.text.includes('SHAPED PANEL: BODY'));assert(body>firstXfer);
const firstBody=ops.findIndex((o,i)=>i>body&&o.kind==='knit');
let secondBody=firstBody;while(secondBody<ops.length){const op=ops[secondBody]!;if(op.kind!=='knit'||op.direction!=='+')break;secondBody++;}
assert.equal(secondBody-firstBody,40);
// Retain original start until the final full-bed waste tube; discard its 1x1 consolidation.
const prefix=ops.slice(0,firstXfer);
const settings=(speed:number,roller:number,stitch:number)=>[xSpeedNumber(speed),xRollerAdvance(roller),xStitchNumber(stitch)];
const up=Array.from({length:40},(_,i)=>107+i), down=[...up].reverse();
const caston=[
  miss('-',f(99),'6'),
  ...settings(300,450,5),...up.map(n=>drop(b(n))),
  ...settings(100,200,8),...down.map(n=>knit('-',f(n),'1')),miss('-',f(102),'1'),
  rack(0.5),...settings(200,400,4),...down.flatMap(n=>[knit('-',b(n),'3'),knit('-',f(n),'3')]),
  rack(0),...settings(200,400,5),...up.map(n=>knit('+',f(n),'3')),
  ...down.map(n=>knit('-',b(n),'3')),miss('-',f(106),'3'),
  xSpeedNumber(100),xRollerAdvance(0),xXferStitchNumber(3),...up.map(n=>xfer(b(n),f(n))),
  ...settings(300,450,6),...up.map(n=>knit('+',f(n),'3')),
  // Restore experiment settings after the reference's first consolidation row.
  ...settings(200,450,9),xXferStitchNumber(0),
];
const program={...parsed.program,ops:[...prefix,...caston,...ops.slice(secondBody)]};
const output=process.argv[2]??'../edge-full-caston-swatch';fs.mkdirSync(output,{recursive:true});
const text=writeKnitoutProgram(program);const compiled=knitoutToKCodeWithTrace(text,'program.k');assert(compiled.ok,JSON.stringify(compiled));
fs.writeFileSync(path.join(output,'program.k'),text);fs.writeFileSync(path.join(output,'program.kc'),compiled.kcode);
console.log(JSON.stringify({output,sha256:createHash('sha256').update(compiled.kcode).digest('hex'),bytes:Buffer.byteLength(compiled.kcode),unchangedSuffixOps:ops.length-secondBody},null,2));
