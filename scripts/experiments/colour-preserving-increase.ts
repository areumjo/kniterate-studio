/** Research candidate: only captured front-to-rear rack-zero splits. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { CarriageSimulator } from '../../packages/machine-lib/src/knitout/sim/carriage-simulator.js';
import { emitCustomistFairisleFrame } from '../../packages/machine-lib/src/knitout/passes/customist-fairisle-frame.js';
import { FAIRISLE_PARK_WASTE_DEFAULTS } from '../../packages/machine-lib/src/knitout/passes/waste-section.js';
import { FAIRISLE_CARRIER_INTRO_DEFAULTS } from '../../packages/machine-lib/src/knitout/passes/carrier-intro.js';
import { ALL_CARRIERS,b,f,comment,type KnitoutOp,type KnitoutProgram,type CarrierId,type Direction } from '../../packages/machine-lib/src/knitout/types.js';
import { writeKnitoutProgram } from '../../packages/machine-lib/src/knitout/emitter.js';
import { knitoutToKCodeWithTrace } from '../../packages/machine-lib/src/knitout/kniterate/to-kcode.js';
import { verifyColourPreserving } from './verify-colour-preserving.js';
export function buildColourPreserving({join=true,front='4' as CarrierId}={}){
 const rear:CarrierId=front==='4'?'3':'4',lo=119;let hi=134;
 const frame=emitCustomistFairisleFrame({needleStart:lo,needleEnd:hi,wasteCarrier:'6',bodyCarriers:['3','4'],drawCarrier:'1',wastePasses:80,waste:FAIRISLE_PARK_WASTE_DEFAULTS,intro:FAIRISLE_CARRIER_INTRO_DEFAULTS,retainBackBed:true,catchNeedles:8});
 const ops:KnitoutOp[]=[{kind:'x-carrier-spacing',value:2},{kind:'x-carrier-stopping-distance',value:2.5},...frame.ops];
 const sim=new CarriageSimulator({carriers:ALL_CARRIERS,initialNextDirection:frame.finalNextDirection});
 for(const s of frame.finalCarrierStates.values())sim.seedCarrierState(s);sim.seedRacking(0);sim.setPresserSpeed(600);sim.setPresserRoller(0);
 const drain=()=>ops.push(...sim.drainOps());sim.miss('6','-',f(lo-8));sim.miss('1','-',f(lo-5));drain();
 const rows:{row:number;lo:number;hi:number;kind:string}[]=[];
 const slot=(name:string,fn:()=>void)=>{ops.push(comment(`COLOUR ROW ${rows.length+1} ${name}`));sim.setSourceRows([rows.length]);fn();drain();};
 const bed=(c:CarrierId,n:number)=>n===lo&&rows.length%2===0?(c===front?b(n):f(n)):(c===front?f(n):b(n));
 const sets=(roller:number)=>{sim.setSpeed(200);sim.setStitch(7);sim.setRoller(roller);};
 const move=(c:CarrierId,n:number)=>{sim.setSpeed(200);sim.setRoller(0);if(sim.positionOf(c)?.side==='right')sim.miss(c,'-',f(n-1));sim.miss(c,'+',f(n));};
 const xfer=(from:ReturnType<typeof f>,to:ReturnType<typeof f>,rack:number)=>{sim.setSpeed(100);sim.setRoller(0);sim.setXferStitch(5);sim.setRacking(rack);sim.xferBatch([{from,to}]);sim.setRacking(0);};
 const plain=()=>{
  const r=rows.length,d:Direction=sim.positionOf(front)?.side==='left'?'+':'-';
  const ns=Array.from({length:hi-lo+1},(_,i)=>lo+i);if(d==='-')ns.reverse();
  // Opposite-bed tuck is consumed by the rear yarn later in this cycle.
  if(join&&d==='-')slot('join',()=>{sets(0);sim.tuck(front,d,b(hi));});
  slot('front',()=>{sets(r===0?100:450);for(const n of ns)sim.knit(front,d,bed(front,n));});
  if(join&&d==='+')slot('join',()=>{sets(0);sim.tuck(front,d,b(hi));});
  slot('rear',()=>{sets(r===0?100:450);const rd:Direction=sim.positionOf(rear)?.side==='left'?'+':'-';const nn=Array.from({length:hi-lo+1},(_,i)=>lo+i);if(rd==='-')nn.reverse();for(const n of nn)sim.knit(rear,rd,bed(rear,n));});
  rows.push({row:r+1,lo,hi,kind:'plain'});
 };
 const growth=()=>{
  const old=hi,A=front,B=rear;
  slot('clear-B',()=>move(B,old+4));
  slot('park-rear',()=>xfer(b(old),f(old+1),1));
  slot('front-split',()=>{sets(450);const d:Direction=sim.positionOf(A)?.side==='left'?'+':'-';if(d==='+'){for(let n=lo;n<old;n++)sim.knit(A,d,bed(A,n));sim.split(A,d,f(old),b(old));}else{sim.addRollerAdvance(450);sim.split(A,d,f(old),b(old));sim.setRoller(0);for(let n=old-1;n>=lo;n--)sim.knit(A,d,bed(A,n));}});
  slot('clear-A',()=>move(A,old+4));
  slot('park-front',()=>xfer(b(old),f(old+2),2));
  slot('rear-split',()=>{sets(450);sim.addRollerAdvance(450);sim.split(B,'-',f(old+1),b(old+1));sim.setRoller(0);for(let n=old-1;n>=lo;n--)sim.knit(B,'-',bed(B,n));});
  slot('restore-rear',()=>xfer(f(old+1),b(old),1));
  slot('restore-front-1',()=>xfer(f(old+2),b(old+2),0));
  slot('restore-front-2',()=>xfer(b(old+2),f(old+1),-1));
  hi++;rows.push({row:rows.length+1,lo,hi,kind:'growth'});
 };
 for(let k=0;k<3;k++)plain();growth();for(let k=0;k<3;k++)plain();growth();for(let k=0;k<4;k++)plain();
 ops.push(comment('COLOUR BODY END'));sim.setSourceRows(undefined);sets(450);
 for(let k=0;k<8;k++){for(let n=lo;n<=hi;n++)sim.knit('6','+',f(n));for(let n=hi;n>=lo;n--)sim.knit('6','-',b(n));}
 sim.setSpeed(150);sim.setStitch(4);for(let n=lo;n<=hi;n++){sim.drop(f(n));sim.drop(b(n));}sim.setRoller(0);for(const c of ['1','3','4','6'] as CarrierId[])sim.out(c);drain();
 const program:KnitoutProgram={version:2,yarns:{'3':'Orange single 2/14 acrylic','4':'Grey single 2/14 acrylic'},machine:'kniterate',gauge:7,position:'Keep',carriers:[...ALL_CARRIERS],kniterate:{xferStyle:'four-pass'},ops};
 const source=writeKnitoutProgram(program),compiled=knitoutToKCodeWithTrace(source,'program.k');assert(compiled.ok,JSON.stringify(compiled));return{source,compiled,rows,front,rear,join};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const built=buildColourPreserving(),report=verifyColourPreserving(built),out=process.argv[2]??'../colour-preserving-research';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'validation.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 // Deliberately do not write runnable KCode until the complete candidate passes.
 if(report.passed){fs.writeFileSync(path.join(out,'program.k'),built.source);fs.writeFileSync(path.join(out,'program.kc'),built.compiled.kcode);}
}
