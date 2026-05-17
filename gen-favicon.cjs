// Wedding Favicon Options Generator v2
const { PNG } = require('pngjs')
const fs = require('fs')
const path = require('path')

const W = 1600, H = 600
const png = new PNG({ width: W, height: H, filterType: -1 })
const data = png.data

// ── core helpers ──────────────────────────────────────────────────────────────
function idx(x, y) { return (Math.round(y) * W + Math.round(x)) * 4 }
function hex2rgb(h) { const v = parseInt(h.replace('#',''),16); return [(v>>16)&255,(v>>8)&255,v&255] }
function lerp(a,b,t){ return a+(b-a)*t }
function lerpC(c1,c2,t){ return [lerp(c1[0],c2[0],t),lerp(c1[1],c2[1],t),lerp(c1[2],c2[2],t)].map(Math.round) }

function px(x,y,r,g,b,a){
  x=Math.round(x); y=Math.round(y)
  if(x<0||x>=W||y<0||y>=H) return
  const i=idx(x,y), al=a/255
  data[i]  =Math.round(data[i]*(1-al)+r*al)
  data[i+1]=Math.round(data[i+1]*(1-al)+g*al)
  data[i+2]=Math.round(data[i+2]*(1-al)+b*al)
  data[i+3]=255
}

// Anti-aliased circle stroke (Wu circles)
function strokeCircle(cx,cy,R,thick,c1,c2){
  const steps=Math.ceil(2*Math.PI*R*6)
  for(let i=0;i<=steps;i++){
    const angle=(i/steps)*2*Math.PI
    const t=i/steps
    const [r,g,b]=lerpC(c1,c2,t)
    for(let d=-thick;d<=thick;d+=0.4){
      const dd=Math.abs(d)/thick
      const alpha=Math.round(255*(1-dd*dd))
      px(cx+(R+d)*Math.cos(angle), cy+(R+d)*Math.sin(angle), r,g,b, alpha)
    }
  }
}

// Filled disk with AA edge
function disk(cx,cy,R,r,g,b,a=255){
  const iR=Math.ceil(R)
  for(let dy=-iR;dy<=iR;dy++){
    for(let dx=-iR;dx<=iR;dx++){
      const d=Math.sqrt(dx*dx+dy*dy)
      if(d>R+1) continue
      const alpha=d>R-1 ? Math.round(a*(R-d+1)) : a
      px(cx+dx,cy+dy,r,g,b,Math.max(0,Math.min(255,alpha)))
    }
  }
}

// Radial gradient disk (dark base)
function base(cx,cy,R){
  const inner=hex2rgb('#252530'), outer=hex2rgb('#111118')
  const iR=Math.ceil(R)
  for(let dy=-iR;dy<=iR;dy++){
    for(let dx=-iR;dx<=iR;dx++){
      const d=Math.sqrt(dx*dx+dy*dy)
      if(d>R+1) continue
      const t=d/R
      const [r,g,b]=lerpC(inner,outer,t*t)
      const alpha=d>R-1.5 ? Math.round(255*(R-d+1.5)/1.5) : 255
      px(cx+dx,cy+dy,r,g,b,Math.max(0,Math.min(255,alpha)))
    }
  }
}

// Soft glow
function glow(cx,cy,R,r,g,b,str){
  const iR=Math.ceil(R)
  for(let dy=-iR;dy<=iR;dy++){
    for(let dx=-iR;dx<=iR;dx++){
      const d=Math.sqrt(dx*dx+dy*dy)
      if(d>R) continue
      const t=1-d/R
      px(cx+dx,cy+dy,r,g,b,Math.round(str*t*t*255))
    }
  }
}

// Stroke parametric curve
function strokeCurve(pts,thick,c1,c2){
  const n=pts.length
  for(let i=0;i<n;i++){
    const t=i/(n-1)
    const [r,g,b]=lerpC(c1,c2,t)
    const [cx,cy]=pts[i]
    const iT=Math.ceil(thick)
    for(let dy=-iT;dy<=iT;dy+=0.5){
      for(let dx=-iT;dx<=iT;dx+=0.5){
        const d=Math.sqrt(dx*dx+dy*dy)
        if(d>thick) continue
        const alpha=Math.round(255*(1-d/thick))
        px(cx+dx,cy+dy,r,g,b,alpha)
      }
    }
  }
}

// Heart filled
function heart(cx,cy,sz,r,g,b){
  for(let dy=-sz;dy<=sz*0.8;dy++){
    for(let dx=-sz;dx<=sz;dx++){
      const nx=dx/sz, ny=-dy/sz
      if(Math.pow(nx*nx+ny*ny-1,3)-nx*nx*ny*ny*ny<=0)
        px(cx+dx,cy+dy,r,g,b,230)
    }
  }
}

// Rounded rectangle
function rrect(x,y,w,h,rad,r,g,b,a=255){
  for(let dy=0;dy<h;dy++){
    for(let dx=0;dx<w;dx++){
      const px2=dx, py2=dy
      const nearX=Math.max(rad, Math.min(w-rad, px2))
      const nearY=Math.max(rad, Math.min(h-rad, py2))
      const d=Math.sqrt((px2-nearX)**2+(py2-nearY)**2)
      if(d<=rad) px(x+dx,y+dy,r,g,b,a)
    }
  }
}

// ── FILL BACKGROUND ───────────────────────────────────────────────────────────
const bg=hex2rgb('#080810')
for(let y=0;y<H;y++) for(let x=0;x<W;x++){
  const i=idx(x,y)
  data[i]=bg[0]; data[i+1]=bg[1]; data[i+2]=bg[2]; data[i+3]=255
}

// Subtle vignette
for(let y=0;y<H;y++) for(let x=0;x<W;x++){
  const dx=(x-W/2)/(W/2), dy=(y-H/2)/(H/2)
  const v=Math.sqrt(dx*dx+dy*dy)*0.3
  const i=idx(x,y)
  data[i]=Math.max(0,data[i]-Math.round(v*30))
  data[i+1]=Math.max(0,data[i+1]-Math.round(v*30))
  data[i+2]=Math.max(0,data[i+2]-Math.round(v*30))
}

// ── SECTION SEPARATORS ────────────────────────────────────────────────────────
const sep=hex2rgb('#222232')
for(let y=30;y<H-30;y++){
  px(533,y,sep[0],sep[1],sep[2],140)
  px(534,y,sep[0],sep[1],sep[2],60)
  px(1066,y,sep[0],sep[1],sep[2],140)
  px(1067,y,sep[0],sep[1],sep[2],60)
}

const cxs=[266,800,1333]
const cy=300
const bR=195

const orange=hex2rgb('#f97316')
const gold=hex2rgb('#fbbf24')
const white=[255,255,255]
const soft=[255,200,120]

// ════════════════════════════════════════════════════════
// DESIGN A — 婚戒  (interlocked rings)
// ════════════════════════════════════════════════════════
;(()=>{
  const cx=cxs[0]
  base(cx,cy,bR)
  // outer decorative ring
  strokeCircle(cx,cy,bR-3,1,gold,orange)

  const rR=72, off=42, th=11
  const lx=cx-off, rx=cx+off

  // intersection glow
  glow(cx,cy,60,orange[0],orange[1],orange[2],0.20)
  glow(cx,cy,28,255,210,120,0.12)

  // left ring
  strokeCircle(lx,cy,rR,th,orange,gold)
  // right ring
  strokeCircle(rx,cy,rR,th,gold,orange)

  // inner thin highlight rings
  strokeCircle(lx,cy,rR,1,[255,220,140],[255,200,100])
  strokeCircle(rx,cy,rR,1,[255,200,100],[255,220,140])

  // sparkles
  const sparkles=[[cx,cy-rR-8],[cx-rR-off+10,cy],[cx+rR+off-10,cy],[cx,cy+rR+8]]
  sparkles.forEach(([sx,sy])=>{
    glow(sx,sy,10,255,220,130,0.5)
    disk(sx,sy,2,255,235,160,240)
  })
})()

// ════════════════════════════════════════════════════════
// DESIGN B — G♡E 字母徽章
// ════════════════════════════════════════════════════════
;(()=>{
  const cx=cxs[1]
  base(cx,cy,bR)

  // outer gold ring (badge border)
  strokeCircle(cx,cy,bR-3,2.5,gold,orange)
  strokeCircle(cx,cy,bR-12,0.8,[100,80,30],[100,80,30])

  // 24 tiny dots on the badge ring
  for(let i=0;i<24;i++){
    const angle=(i/24)*2*Math.PI-(Math.PI/2)
    const r2=bR-3
    disk(cx+r2*Math.cos(angle),cy+r2*Math.sin(angle),2.5,
      i%3===0?gold[0]:orange[0], i%3===0?gold[1]:orange[1], i%3===0?gold[2]:orange[2], 200)
  }

  // Draw "G" using path segments (simpler approach: filled rounded rects)
  const sz=42 // half-height of letters
  const lx=cx-62

  // G — using filled blocks
  // top bar
  rrect(lx-sz+4,cy-sz,sz*2-10,sz/4,4, white[0],white[1],white[2])
  // left bar
  rrect(lx-sz,cy-sz,sz/3.5,sz*2,4, white[0],white[1],white[2])
  // bottom bar
  rrect(lx-sz+4,cy+sz-sz/4,sz*2-10,sz/4,4, white[0],white[1],white[2])
  // right bottom half
  rrect(lx+sz/3,cy,sz/3,sz,4, white[0],white[1],white[2])
  // middle notch
  rrect(lx+sz/3,cy-sz/8,sz*2/3,sz/4,3, white[0],white[1],white[2])

  // heart
  heart(cx,cy-4,20,gold[0],gold[1],gold[2])
  glow(cx,cy-4,26,gold[0],gold[1],gold[2],0.4)

  // E — using filled blocks
  const ex=cx+62-sz
  // left bar
  rrect(ex,cy-sz,sz/3.5,sz*2,4, white[0],white[1],white[2])
  // top bar
  rrect(ex,cy-sz,sz*2-4,sz/4,4, white[0],white[1],white[2])
  // middle bar
  rrect(ex,cy-sz/8,sz*1.5,sz/4,3, white[0],white[1],white[2])
  // bottom bar
  rrect(ex,cy+sz-sz/4,sz*2-4,sz/4,4, white[0],white[1],white[2])
})()

// ════════════════════════════════════════════════════════
// DESIGN C — 無限波浪 (Lemniscate infinity)
// ════════════════════════════════════════════════════════
;(()=>{
  const cx=cxs[2]
  base(cx,cy,bR)
  strokeCircle(cx,cy,bR-3,1,orange,gold)

  // Lemniscate of Bernoulli
  const a=108
  const N=10000
  const pts=[]
  for(let i=0;i<=N;i++){
    const t=(i/N)*2*Math.PI
    const s2=Math.sin(t)**2
    const denom=1+s2
    pts.push([cx+a*Math.cos(t)/denom, cy+a*Math.sin(t)*Math.cos(t)/denom])
  }

  // glow pass
  for(let i=0;i<pts.length;i+=8){
    glow(pts[i][0],pts[i][1],20,orange[0],orange[1],orange[2],0.05)
  }

  // main curve
  strokeCurve(pts,9,orange,gold)

  // bright inner highlight
  strokeCurve(pts.filter((_,i)=>i%3===0),2.5,[255,235,180],[255,250,200])

  // center glow & dot
  glow(cx,cy,35,255,180,80,0.28)
  disk(cx,cy,5,255,225,160,230)

  // cross-point glow (where curves cross)
  glow(cx,cy,15,255,220,150,0.5)
})()

// ── 32×32 THUMBNAILS ──────────────────────────────────────────────────────────
cxs.forEach((cx2,i)=>{
  const tw=48, th2=48
  const tx=cx2+bR-tw-10, ty2=cy-bR+10
  // border
  for(let x=tx-2;x<=tx+tw+1;x++) px(x,ty2-2,gold[0],gold[1],gold[2],160),px(x,ty2+th2+1,gold[0],gold[1],gold[2],160)
  for(let y=ty2-2;y<=ty2+th2+1;y++) px(tx-2,y,gold[0],gold[1],gold[2],160),px(tx+tw+1,y,gold[0],gold[1],gold[2],160)
  // copy scaled
  for(let py2=0;py2<th2;py2++){
    for(let px2=0;px2<tw;px2++){
      const sx=Math.round(cx2-bR+px2/tw*(bR*2))
      const sy=Math.round(cy-bR+py2/th2*(bR*2))
      if(sx<0||sx>=W||sy<0||sy>=H) continue
      const si=idx(sx,sy), di=idx(tx+px2,ty2+py2)
      data[di]=data[si]; data[di+1]=data[si+1]; data[di+2]=data[si+2]; data[di+3]=data[si+3]
    }
  }
})

// ── LABEL BARS ────────────────────────────────────────────────────────────────
const labelY=H-65
cxs.forEach(cx2=>{
  for(let x=cx2-90;x<=cx2+90;x++){
    const t=Math.abs(x-cx2)/90
    const a=Math.round(180*(1-t*t*t))
    px(x,labelY,gold[0],gold[1],gold[2],a)
    px(x,labelY+1,gold[0],gold[1],gold[2],Math.round(a*0.3))
  }
  // 3 small dots
  for(let d=-1;d<=1;d++){
    glow(cx2+d*10,labelY+18,3,gold[0],gold[1],gold[2],0.5)
    disk(cx2+d*10,labelY+18,2,gold[0],gold[1],gold[2],210)
  }
})

// ── TOP TITLE LINE ────────────────────────────────────────────────────────────
const titleY=24
for(let x=W/2-150;x<=W/2+150;x++){
  const t=Math.abs(x-W/2)/150
  px(x,titleY,gold[0],gold[1],gold[2],Math.round(160*(1-t*t)))
}
// tiny dot row (decorative)
for(let i=-10;i<=10;i++){
  const a=1-Math.abs(i)/10
  glow(W/2+i*14,titleY-12,2.5,255,195,80,0.5*a)
  disk(W/2+i*14,titleY-12,1.5,255,205,100,Math.round(200*a))
}

// ── LEGEND INDICATORS ────────────────────────────────────────────────────────
const legends=['A', 'B', 'C']
cxs.forEach((cx2,i)=>{
  // letter label pill background
  const lw=34, lh=20
  const lx2=cx2-lw/2, ly2=labelY+28
  rrect(lx2,ly2,lw,lh,5, 25,20,35, 200)
  strokeCircle(cx2,ly2+lh/2,lw/2+1,0.8,gold,orange)
})

// ── WRITE PNG ─────────────────────────────────────────────────────────────────
const out=path.join(__dirname,'favicon-options.png')
fs.writeFileSync(out, PNG.sync.write(png))
console.log(`Done: ${out} (${(fs.statSync(out).size/1024).toFixed(1)} KB)`)
