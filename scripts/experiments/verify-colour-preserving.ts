import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { auditTraceV1,compareScheduledPassesToMachineTrace,deriveMachineTraceAdvisoriesV1,KNITERATE_7GG_KCODE_PROFILE_V2 as profile,parseKCodeDocument,projectKCodeMachineTrace,projectMachineTopologyV1,validateKCodeMachineSafetyV1,validateKCodeMachineTrace } from '../../packages/machine-lib/src/browser.js';
import type { buildColourPreserving } from './colour-preserving-increase.js';
export function verifyColourPreserving(built:ReturnType<typeof buildColourPreserving>){
 const parsed=parseKCodeDocument(built.compiled.kcode,{profile,dialect:'knitout-vendor',strict:true});assert(parsed.ok);
 const trace=projectKCodeMachineTrace(parsed.document,profile),validation=validateKCodeMachineTrace(trace,profile),safety=validateKCodeMachineSafetyV1(trace,profile),diff=compareScheduledPassesToMachineTrace(built.compiled.scheduledPasses,trace);
 let label={row:0,slot:'frame'};const ls=built.source.split('\n').map(l=>{const m=l.match(/^; COLOUR ROW (\d+) (\S+)$/);if(m)label={row:+m[1],slot:m[2]};if(l==='; COLOUR BODY END')label={row:0,slot:'finish'};return label;});
 const sourceLines=built.source.split('\n');
 const labels=built.compiled.scheduledPasses.map(p=>{const work=p.sourceLines.filter(n=>/^(knit|tuck|split|xfer|drop) /.test(sourceLines[n-1]));const selected=work.length?work:p.sourceLines;assert(new Set(selected.map(n=>ls[n-1].row)).size<=1,'Working pass crosses rows');return ls[selected.at(-1)!-1];});
 const first=labels.findIndex(x=>x.row>0),last=labels.findLastIndex(x=>x.row>0);
 const audit=auditTraceV1(trace,{sections:[{name:'waste',from:1,to:first},{name:'body',from:first+1,to:last+1},{name:'top',from:last+2,to:trace.passes.length}]});
 const topology=projectMachineTopologyV1(trace),offset=built.compiled.coordinateMapping.frontSourceSlotToKCodeColumnOffset;
 const stacks=new Map<string,number[]>(),key=(a:{bed:string;traceCoordinate:number})=>`${a.bed}:${a.traceCoordinate}`;
 const created=new Map(topology.loops.map(l=>[`${l.createdAt.passIndex}:${l.createdAt.actionIndex}`,l]));
 const errors:string[]=[],check=(ok:boolean,msg:string)=>{if(!ok)errors.push(msg);};
 const leftJoins=new Set<number>();
 const joins:number[]=[],events:any[]=[],rowAdvances:number[]=[];
 for(const p of trace.passes){const lab=labels[p.index],row=built.rows[lab.row-1];
  if(row){check(!['1','6'].includes(p.carrier),'idle body carrier');check(Math.abs(p.rack)<=2,'Rack exceeds temporary-loop plan');if(p.roller>0)check(p.roller===(row.row===1?100:450),'Unexpected take-down value');if(p.roller>0)rowAdvances[lab.row-1]=(rowAdvances[lab.row-1]??0)+1;}
  p.actions.forEach((a,i)=>{const newLoop=created.get(`${p.index}:${i}`);
   if(a.kind==='xfer'||a.kind==='split'){
    const src=stacks.get(key(a.source))??[],dst=stacks.get(key(a.target))??[];
    if(row){check(src.length===1,`pass${p.index+1} missing/stacked source`);check(dst.length===0,`pass${p.index+1} occupied receiver`);}
    stacks.set(key(a.target),[...dst,...src]);stacks.set(key(a.source),a.kind==='split'?[newLoop!.id]:[]);
    if(row&&a.kind==='split'){check(a.source.bed==='front'&&a.target.bed==='rear'&&p.rack===0,'Uncaptured split');check(newLoop!.parentLoopIds.every(id=>topology.loops[id].carrier===p.carrier),'Split crossed colour parent');events.push({row:row.row,pass:p.index+1,carrier:p.carrier,source:a.source.traceCoordinate-offset,parentIds:newLoop!.parentLoopIds});}
   }else if(a.kind==='knit'||a.kind==='tuck'){
    const held=stacks.get(key(a.at))??[];
    if(row){check(held.length>0,`pass${p.index+1} empty ${a.kind}`);if(a.kind==='knit'&&a.at.traceCoordinate-offset>row.lo)check(p.carrier===(a.at.bed==='front'?built.front:built.rear),'Wrong face knitting');
     if(a.kind==='knit'&&a.at.bed==='rear'&&a.at.traceCoordinate-offset===row.hi&&newLoop!.parentLoopIds.some(id=>topology.loops[id].creation==='tuck'&&topology.loops[id].carrier===built.front))joins.push(row.row);
    }
    stacks.set(key(a.at),a.kind==='tuck'?[...held,newLoop!.id]:[newLoop!.id]);
   }else if(a.kind==='drop')stacks.set(key(a.at),[]);
  });
  if(row&&labels[p.index+1]?.row!==row.row){
   check([...stacks.values()].reduce((n,s)=>n+s.length,0)===2*(row.hi-row.lo+1),`Row${row.row} live count`);
   for(let n=row.lo;n<=row.hi;n++)for(const bed of ['front','rear']){const ids=stacks.get(`${bed}:${n+offset}`)??[];check(ids.length===1,`Row${row.row} occupancy ${bed}${n}`);if(n>row.lo&&ids.length===1)check(topology.loops[ids[0]].carrier===(bed==='front'?built.front:built.rear),`Row${row.row} face colour ${bed}${n}`);}
   check(![...stacks.entries()].some(([key,s])=>s.length&&(+key.split(':')[1]-offset>row.hi)),`Row${row.row} temporary loop left outside`);
  }
 }
 for(const row of built.rows){if(row.kind==='plain')check(joins.includes(row.row),`Row${row.row} missing tuck join`);check(rowAdvances[row.row-1]===2,`Row${row.row} has ${rowAdvances[row.row-1]} take-down advances`);}
 const bodyLoops=topology.loops.filter(l=>labels[l.createdAt.passIndex].row>0);
 for(const l of bodyLoops){const prev=l.previousCarrierLoopId===null?undefined:topology.loops[l.previousCarrierLoopId];if(prev&&prev.createdAt.location.bed!==l.createdAt.location.bed&&prev.createdAt.location.traceCoordinate===built.rows[0].lo+offset&&l.createdAt.location.traceCoordinate===built.rows[0].lo+offset)leftJoins.add(labels[l.createdAt.passIndex].row);}
 for(let start=1;start<=built.rows.length-3;start++)check([...leftJoins].some(r=>r>=start&&r<=start+3),`Left side unlinked rows${start}..${start+3}`);
 check(bodyLoops.every(l=>l.creation==='tuck'||l.parentLoopIds.length>0),'Unsupported body loop');
 return{passed:validation.ok&&safety.ok&&diff.ok&&audit.checks.every(c=>c.ok)&&errors.length===0,scope:'candidate software checks; tuck visibility and temporary-front rear split physically untested',sha256:createHash('sha256').update(built.compiled.kcode).digest('hex'),bytes:Buffer.byteLength(built.compiled.kcode),passes:trace.passes.length,errors,validation:validation.diagnostics,safety:safety.diagnostics,differential:diff,auditFailed:audit.checks.filter(c=>!c.ok),advisories:deriveMachineTraceAdvisoriesV1(trace,profile),events,joins,leftJoins:[...leftJoins],rowAdvances,rows:built.rows};
}
