"""Original triangular paisley artwork and provisional binary chart; no machine export."""
from pathlib import Path
import math,json,subprocess
ROOT=Path(__file__).resolve().parent
NAVY='#172b39'; BUTTER='#eadcb9'
AW,AH=900,400
COLS,ROWS=232,480
OUTER='M 66 12 C 91 16 101 36 86 47 C 76 55 60 48 64 38 C 67 30 79 32 78 39 C 76 45 69 43 70 39 C 65 49 81 52 86 42 C 91 29 71 24 58 36 C 40 52 19 72 13 96 C 5 125 23 150 48 153 C 75 157 95 139 94 117 C 93 97 79 84 66 73 C 55 63 53 55 58 48'
INNER='M 54 48 C 39 65 25 79 23 101 C 20 124 31 142 51 144 C 72 146 86 134 85 116 C 84 101 72 89 60 79 C 48 69 44 62 54 48 Z'
def flower(cx,cy,r,n=8):
 s=''
 for k in range(n):
  a=k*360/n
  s+=f'<ellipse cx="{cx}" cy="{cy-r*.66}" rx="{r*.23}" ry="{r*.42}" transform="rotate({a} {cx} {cy})"/>'
 return s+f'<circle cx="{cx}" cy="{cy}" r="{r*.20}"/>'
def motif(color):
 s=f'<g fill="none" stroke="{color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="{OUTER}" stroke-width="2.9"/><path d="{INNER}" stroke-width="2"/>'
 s+=f'<path d="{INNER}" transform="translate(7 13) scale(.86)" stroke-width="2" stroke-dasharray=".1 5.4"/>'
 s+='<path d="M 55 62 C 53 79 77 87 78 106 C 76 126 63 138 45 132 C 27 126 27 109 34 98 C 42 88 55 91 59 99" stroke-width="2.3"/>'
 s+=flower(49,113,13,8)
 for x,y,a in [(31,79,-30),(24,91,-25),(19,107,-10),(23,125,-55),(36,140,-70),(58,148,20),(77,140,55),(88,125,65)]:
  s+=f'<path d="M {x} {y} q -5 -9 0 -13 q 5 7 0 13" transform="rotate({a} {x} {y})"/>'
 s+='<path d="M 59 80 Q 45 81 39 91 M 63 86 Q 54 87 53 94 M 69 92 Q 63 95 62 101"/>'
 s+='<circle cx="67" cy="20" r="2"/><circle cx="83" cy="28" r="1.6"/>'
 return s+'</g>'
def tri(d=0):
 m=AH/(AW/2);q=math.sqrt(1+m*m)
 left=(d+d*q)/m
 return [(left,d),(AW-left,d),(AW/2,AH-d*q)]
def points(pts):return ' '.join(f'{x:.3f},{y:.3f}' for x,y in pts)
def svg(inner,w=AW,h=AH):return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{inner}</svg>'
def composition(bg,fg):
 s=f'<polygon points="{points(tri())}" fill="{bg}"/>'
 # Border rules and beaded floral vine follow all three sides.
 for inset,sw in [(7,2),(12,1.5),(40,2),(45,1.3)]:
  s+=f'<polygon points="{points(tri(inset))}" fill="none" stroke="{fg}" stroke-width="{sw}"/>'
 verts=tri(26)
 for i in range(3):
  a=verts[i];b=verts[(i+1)%3];dx=b[0]-a[0];dy=b[1]-a[1];length=math.hypot(dx,dy);ang=math.degrees(math.atan2(dy,dx))
  count=round(length/23)
  s+=f'<path d="M {a[0]} {a[1]} L {b[0]} {b[1]}" fill="none" stroke="{fg}" stroke-width="1.2"/>'
  for k in range(1,count):
   t=k/count;x=a[0]+dx*t;y=a[1]+dy*t
   s+=f'<g transform="translate({x} {y}) rotate({ang})" fill="none" stroke="{fg}" stroke-width="1.8"><path d="M0 0 Q-5 -10 -10 -6 Q-7 1 0 0 M0 0 Q5 10 10 6 Q7 -1 0 0"/><circle r="2"/></g>'
 # Rich central paired butas and smaller tip-facing echoes.
 placements=[(326,100,1.0,False),(574,100,1.0,True),(234,57,.50,False),(666,57,.50,True)]
 for x,y,scale,mirror in placements:
  s+=f'<g transform="translate({x} {y}) scale({-scale if mirror else scale} {scale})">{motif(fg)}</g>'
 # Floral crown and branching sprays connect the composition.
 s+=f'<g fill="none" stroke="{fg}" stroke-width="2">{flower(450,77,24,8)}{flower(450,288,12,6)}</g>'
 for mirror in [False,True]:
  tr='translate(900 0) scale(-1 1)' if mirror else ''
  s+=f'<g transform="{tr}" fill="none" stroke="{fg}" stroke-width="2"><path d="M 440 101 Q 395 110 365 68 M 417 104 Q 401 84 404 71 M 390 93 Q 375 92 368 83"/>'
  for x,y,ang in [(406,78,-20),(391,91,-55),(375,80,-35),(429,102,30)]:
   s+=f'<path d="M{x} {y} q-10 -16 0 -21 q10 16 0 21" transform="rotate({ang} {x} {y})"/>'
  s+='</g>'
 # Carefully spaced ground details; no random noise.
 for x,y,r in [(196,75,7),(704,75,7),(303,82,7),(597,82,7),(303,140,8),(597,140,8),(450,147,6),(450,209,5),(321,179,6),(579,179,6),(401,281,5),(499,281,5)]:
  s+=f'<g fill="none" stroke="{fg}" stroke-width="1.7">{flower(x,y,r,4)}</g>'
 for x,y in [(284,112),(616,112),(281,158),(619,158),(366,246),(534,246),(450,329)]:
  s+=f'<path d="M{x} {y-4} l4,4 l-4,4 l-4,-4 Z" fill="{fg}"/>'
 return s
master=svg(f'<rect width="110" height="164" fill="{NAVY}"/>'+motif(BUTTER),110,164)
(ROOT/'paisley-master.svg').write_text(master)
(ROOT/'composition-master.svg').write_text(svg(composition(NAVY,BUTTER)))
# Rasterization is only the planning chart; vector master remains editable.
(ROOT/'raster-source.svg').write_text(svg(composition('black','white')))
subprocess.run(['node',str(ROOT/'render.cjs'),str(ROOT/'raster-source.svg'),str(ROOT/'raster-source.png')],check=True)
subprocess.run(['magick',str(ROOT/'raster-source.png'),'-background','black','-alpha','remove','-resize',f'{ROWS}x{COLS}!','-colorspace','gray','-depth','8',str(ROOT/'raster.gray')],check=True)
buf=(ROOT/'raster.gray').read_bytes();assert len(buf)==ROWS*COLS
# Machine X = scarf depth; machine course order = left tip to right tip.
# Preserve 8-column tips for planning. These endpoints still need chart/shaping review.
widths=[8+round((COLS-8)*(1-abs(2*r/(ROWS-1)-1))) for r in range(ROWS)]
cells=[[int(buf[x*ROWS+r]>=100) if x<widths[r] else 0 for x in range(COLS)] for r in range(ROWS)]
assert 0.05<sum(map(sum,cells))/sum(widths)<0.7,'Artwork failed to rasterize'
chart={'kind':'knitlab-colorwork-chart','version':1,'title':'Atelier paisley triangle — DESIGN ONLY','width':COLS,'height':ROWS,'rowNumbering':'bottom-up','palette':[{'id':'c1','name':'Midnight','hex':NAVY},{'id':'c2','name':'Butter','hex':BUTTER}],'cells':cells}
(ROOT/'chart.json').write_text(json.dumps(chart,separators=(',',':'))+'\n')
shape={'status':'DESIGN_ONLY_NOT_MACHINE_READY','width':COLS,'height':ROWS,'rowNumbering':'bottom-up','activeIntervalsExclusive':[[0,w] for w in widths],'tipColumns':8,'shape':'triangle — fixed left needle boundary; right boundary increases then decreases','targetSizeCm':{'longEdge':141,'depth':62.5},'physicalDimensions':'target only; final yarn washed gauge required','displayOrientation':'courses run left-to-right; needle index runs top-to-bottom'}
(ROOT/'shape.json').write_text(json.dumps(shape,indent=2)+'\n')
def quantized(invert=False):
 bg,fg=(BUTTER,NAVY) if invert else (NAVY,BUTTER)
 out=[]
 for r,row in enumerate(cells):
  xx=ROWS-1-r if invert else r
  # Each vertical strip is one design course; zero cells inside are background.
  out.append(f'<rect x="{xx}" y="0" width="1" height="{widths[r]}" fill="{bg}"/>')
  for x,c in enumerate(row):
   if c:out.append(f'<rect x="{xx}" y="{x}" width="1" height="1" fill="{fg}"/>')
 return '<g shape-rendering="crispEdges">'+''.join(out)+'</g>'
for name,rev in [('front',False),('reverse',True)]:
 (ROOT/f'{name}.svg').write_text(svg(quantized(rev),ROWS,COLS))
# Board shows artwork and the actual stitch-resolution draft separately.
p=[f'<rect width="1500" height="1480" fill="#f4f0e8"/><text x="70" y="75" font-family="Georgia" font-size="40" fill="{NAVY}">Atelier / paisley triangle</text><text x="70" y="112" font-family="Arial" font-size="19" fill="#686962">Original artwork for a reversible scarf · Tafi-inspired proportions · first design study</text>']
p.append(f'<text x="70" y="168" font-family="Arial" font-size="16" letter-spacing="2" fill="{NAVY}">01 / ARTWORK DIRECTION</text><g transform="translate(70 200) scale(1.5)">{composition(NAVY,BUTTER)}</g>')
p.append(f'<text x="70" y="878" font-family="Arial" font-size="16" letter-spacing="2" fill="{NAVY}">02 / STITCH-RESOLUTION STUDY</text>')
for px,rev,label in [(70,False,'MIDNIGHT FACE'),(790,True,'BUTTER FACE · MIRRORED')]:
 p.append(f'<text x="{px}" y="924" font-family="Arial" font-size="15" fill="{NAVY}">{label}</text><g transform="translate({px} 952) scale(1.33 1.22)">{quantized(rev)}</g>')
p.append(f'<text x="70" y="1310" font-family="Georgia" font-size="24" fill="{NAVY}">Paired floral paisleys · continuous vine border · quiet ground</text><text x="70" y="1350" font-family="Arial" font-size="18" fill="#686962">Target 141 × 62.5 cm. Planning grid: 232 columns × 480 courses; dimensions require washed gauge.</text><text x="70" y="1384" font-family="Arial" font-size="18" fill="#686962">Tip-to-tip construction concept: one straight edge, one shaped edge. No KCode exported.</text><text x="70" y="1418" font-family="Arial" font-size="18" fill="#686962">Flat artwork and binary chart previews; fabric texture, stretch and drape are not simulated.</text>')
(ROOT/'design-board.svg').write_text(svg(''.join(p),1500,1480))
for name in ['design-board','paisley-master']:
 subprocess.run(['node',str(ROOT/'render.cjs'),str(ROOT/f'{name}.svg'),str(ROOT/f'{name}.png'),'1500' if name=='design-board' else '440'],check=True)
for name in ['raster.gray','raster-source.svg','raster-source.png']:(ROOT/name).unlink()
print(json.dumps({'chart':[COLS,ROWS],'activeCells':sum(widths),'contrastCells':sum(map(sum,cells)),'status':'design only'}))
