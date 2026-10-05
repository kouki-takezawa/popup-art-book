// 見開き1: レオナルド・ダ・ヴィンチ《最後の晩餐》1495〜1498年頃
// 部屋は舞台の書き割りのように奥ほど狭い台形(手前 x:±16 / 奥 x:±9、z:+6〜-14、高さ12)。
// 畳み方: 人物は奥へ、食卓は手前へ倒す。左右の壁は内側へ、奥の壁は手前へ倒れ、天井は奥の壁の上端から
// まっすぐ伸びた形で一緒に倒れる(いちばん上の層。天井の裏に題名を刷る)。窓の外の風景板は奥へ倒す。
{
const tone=(c,k)=>'#'+(k<=1?new THREE.Color(c).multiplyScalar(k):new THREE.Color(c).lerp(new THREE.Color('#fff'),k-1)).getHexString();
const EYE=5.6;   // 目の高さ = イエスの頭。消失点がここに来る
BOOK.add({
no:1,name:'最後の晩餐',seed:14980101,
desc:{
  orig:"Il Cenacolo (L'Ultima Cena)",
  artist:'レオナルド・ダ・ヴィンチ　1495〜1498年頃',
  medium:'壁画　460 × 880 cm　サンタ・マリア・デッレ・グラツィエ修道院（ミラノ）',
  paras:[
    'ミラノ公ルドヴィーコ・スフォルツァの依頼で、修道院の食堂の壁に描かれた。食事をする修道士たちの前に、もう一つの食卓が続いているように見える。',
    '「あなたがたのうちの一人が、わたしを裏切ろうとしている」。イエスがそう告げた直後の瞬間。十二人の弟子は三人ずつの組になり、驚きが波のように左右へ広がる。',
    'フレスコではなく乾いた壁に描いたため、絵は早くから傷んだ。1943年の空襲では食堂が崩れたが、土嚢で守られた壁は残った。',
  ],
  points:['すべての線が、中央のイエスの頭へ集まる','三人ずつ、四つの組 ― 驚きの波','ユダだけが、顔を影に沈めている'],
  foot:'―　右のページで、食堂の奥の部屋が立ち上がります　―',
},
plate:'レオナルド・ダ・ヴィンチ《最後の晩餐》1495〜1498年頃<br>食堂の壁の前、イエスの目の高さから見た構図',
// 右ページの地面: 台形の床と、部屋の外の紙
ground(g,W,H,{X,Z,S}){
  g.save();g.beginPath();g.moveTo(X(-16),Z(6));g.lineTo(X(16),Z(6));g.lineTo(X(9),Z(-14));g.lineTo(X(-9),Z(-14));g.closePath();g.clip();
  g.fillStyle='#5a4a3a';g.fillRect(0,0,W,H);
  brush(g,X(-16),Z(-14),32*S,20*S,['#4e3f31','#66543f','#5f4c3a','#463829','#6d5a45'],2600,30,7,0,{jit:.5});
  g.strokeStyle='rgba(30,20,12,.45)';g.lineWidth=3;
  for(let z=-14;z<=6;z+=1.6){const h=9+7*(z+14)/20;g.beginPath();g.moveTo(X(-h),Z(z));g.lineTo(X(h),Z(z));g.stroke()}
  for(let i=-6;i<=6;i++){g.beginPath();g.moveTo(X(i*9/6),Z(-14));g.lineTo(X(i*16/6),Z(6));g.stroke()}
  g.restore();
  g.fillStyle='#5a4a32';g.textAlign='center';
  g.font='30px '+FONT;g.fillText('最後の晩餐　―　レオナルド・ダ・ヴィンチ　1495〜98年頃　ミラノ',W/2,H-17);
  g.font="italic 28px Georgia,serif";g.fillText("Il Cenacolo  ―  L'Ultima Cena",W/2,38);
},
build(B){
const root=B.root;
const STONE=lam(0xbcb09a,.35),WOOD=lam(0x4a3220,.25),PEWTER=lam(0x9c9a94,.35),BREAD=lam(0xb07a3a,.3);
const paperT=(()=>{const c=cv(512,512);paperBase(c.getContext('2d'),512,512);const t=new THREE.CanvasTexture(c);t.anisotropy=ANISO;return t})();
const PAPER_M=mat(paperT,.3);PAPER_M.side=THREE.FrontSide;
const front=m=>{m.side=THREE.FrontSide;return m};
// 表=絵、裏=紙 の二枚合わせ(+z が表)
function sheet(parent,w,h,m,backM,alphaT){
  const a=plane(w,h,front(m),alphaT);parent.add(a);
  const b=plane(w,h,backM||PAPER_M,alphaT);b.rotation.y=Math.PI;b.position.z=-.03;parent.add(b);return [a,b];
}
// ================= 奥の壁と窓 =================
const WINS=[[-5.6,4.7,2.4,4.9],[0,4.6,4.8,5.1],[5.6,4.7,2.4,4.9]];  // [中心x, 下端y, 幅, 高さ]
const holes=(g)=>{g.globalCompositeOperation='destination-out';for(const [x,y,w,h] of WINS)g.fillRect(x-w/2,y,w,h);g.globalCompositeOperation='source-over'};
const BW_T=tex(18,12,(g,w,h)=>{
  g.fillStyle='#5e554b';g.fillRect(-w/2,0,w,h);
  brush(g,-w/2,0,w,h,['#544b42','#6a6054','#4c443c','#70665a','#5a5046'],1500,.6,.12,Math.PI/2,{jit:.9});
  // 中央の窓の上の弧(光輪のかわり)
  g.strokeStyle='#8a7f70';g.lineWidth=.32;g.beginPath();g.ellipse(0,9.7,3.1,1.25,0,0,Math.PI);g.stroke();
  for(const [x,y,ww,hh] of WINS){g.fillStyle='#a69b87';g.fillRect(x-ww/2-.28,y-.28,ww+.56,hh+.56)}
  holes(g);
  g.strokeStyle='#3a332c';g.lineWidth=.2;g.beginPath();g.moveTo(-w/2,11.7);g.lineTo(w/2,11.7);g.stroke();
  g.strokeStyle=PAPER;g.lineWidth=.14;g.strokeRect(-w/2,0,w,h);
},{center:true});
const BWB_T=tex(18,12,(g,w,h)=>{g.fillStyle='#ece1c4';g.fillRect(-w/2,0,w,h);brush(g,-w/2,0,w,h,['#e3d5b2','#f3ead2'],300,1,.08,0,{alpha:.5,jit:3});holes(g)},{center:true});
const back=B.pop(root,[0,0,-14],[0,1],1.15,1.2,6);
{
  const g=new THREE.Group();g.position.y=6;back.add(g);
  sheet(g,18,12,mat(BW_T,.55,true),mat(BWB_T,.3,true),BW_T);
  for(const [x,y,w,h] of WINS){
    for(const [bw,bh,bx,by] of [[w+.6,.18,x,y-.09],[w+.6,.18,x,y+h+.09],[.18,h,x-w/2-.09,y+h/2],[.18,h,x+w/2+.09,y+h/2]]){
      const b=box(bw,bh,.35,STONE);b.position.set(bx,by,.17);back.add(b);
    }
  }
}
// 窓の外の風景(奥へ倒す)
{
  const lt=tex(22,11,(g,w,h)=>{
    const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#e6e8dc');gr.addColorStop(.45,'#cfdbe0');gr.addColorStop(1,'#93aecb');
    g.fillStyle=gr;g.fillRect(0,0,w,h);brush(g,0,4.5,w,6.5,['#dfe6e4','#b9cddb','#c9d8de'],500,.8,.1,0,{alpha:.5});
    const ridge=(y0,amp,col,cols)=>{g.beginPath();g.moveTo(0,0);g.lineTo(0,y0);for(let x=0;x<=w;x+=.5)g.lineTo(x,y0+Math.sin(x*.7+y0)*amp*.5+Math.sin(x*.23)*amp);g.lineTo(w,0);g.closePath();
      g.save();g.fillStyle=col;g.fill();g.clip();brush(g,0,0,w,y0+amp*2,cols,700,.5,.08,0,{alpha:.6});g.restore()};
    ridge(5.6,.45,'#8fa3b6',['#9aaec0','#7f94a8','#a8b8c6']);
    ridge(4.9,.35,'#7d8f86',['#86998c','#6f8276','#93a494']);
    ridge(4.1,.25,'#6f7d58',['#7a8a5e','#5f6e4a','#8a9866']);
  });
  const pg=B.pop(root,[0,0,-15.3],[0,-1],1.35,1.1,2);
  const m=plane(22,11,mat(lt,.7));m.position.y=5.5;pg.add(m);
}
// ================= 天井(奥の壁の上端に蝶番) =================
const ceilGeo=(()=>{const g=new THREE.PlaneGeometry(1,1,8,16),p=g.attributes.position,uv=g.attributes.uv;
  for(let i=0;i<p.count;i++){const u=uv.getX(i),v=uv.getY(i);p.setXYZ(i,(u-.5)*(18+14*v),20*v,0)}
  g.computeVertexNormals();return g})();
const CEIL_T=tex(26,20,(g,w,h)=>{
  g.fillStyle='#d6cebd';g.fillRect(0,0,w,h);
  const nx=7,ny=10,cw=w/nx,ch=h/ny;
  for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){
    const x=i*cw+.32,y=j*ch+.28,ww=cw-.64,hh=ch-.56;
    g.fillStyle='#8c8372';g.fillRect(x,y,ww,hh);g.fillStyle='#a49a87';g.fillRect(x+.18,y+.18,ww-.36,hh-.36);
    brush(g,x,y,ww,hh,['#9a907e','#b3a994','#857c6c'],18,.5,.06,0,{alpha:.5});
    g.fillStyle='rgba(40,30,20,.35)';g.fillRect(x,y+hh-.14,ww,.14);
  }
  g.strokeStyle='#5f574b';g.lineWidth=.07;for(let i=0;i<=nx;i++){g.beginPath();g.moveTo(i*cw,0);g.lineTo(i*cw,h);g.stroke()}
  g.strokeStyle=PAPER;g.lineWidth=.14;g.strokeRect(0,0,w,h);
});
// 天井の裏 = 畳んだときいちばん上に来る面。裏から見るので上下を反転して刷る
const LID_T=(()=>{
  const W=2048,H=1575,c=cv(W,H),g=c.getContext('2d');
  paperBase(g,W,H);g.translate(0,H);g.scale(1,-1);
  g.strokeStyle='#b08a3a';g.lineWidth=5;g.strokeRect(300,250,W-600,H-500);g.lineWidth=2;g.strokeRect(322,272,W-644,H-544);
  g.textAlign='center';g.fillStyle='#8a6a2a';g.font=`56px ${FONT}`;g.fillText(`第 ${B.no} 話`,W/2,470);
  g.fillStyle='#2b2216';g.font=`170px ${FONT}`;g.fillText('最後の晩餐',W/2,720);
  g.fillStyle='#6a5a3e';g.font="italic 62px Georgia,serif";g.fillText("Il Cenacolo",W/2,840);
  g.fillStyle='#8a6a2a';g.font=`46px ${FONT}`;g.fillText('レオナルド・ダ・ヴィンチ',W/2,960);
  g.fillText('―　タップすると、部屋が立ち上がります　―',W/2,1170);
  for(const x of [W/2-430,W/2+430]){g.strokeStyle='#b08a3a';g.lineWidth=3;g.beginPath();g.arc(x,455,34,0,7);g.stroke();g.fillStyle='#c24a3a';g.beginPath();g.arc(x,455,16,0,7);g.fill()}
  const t=new THREE.CanvasTexture(c);t.anisotropy=ANISO;return t})();
{
  const hinge=new THREE.Group();hinge.position.y=12;back.add(hinge);
  const cm=new THREE.Mesh(ceilGeo,front(mat(CEIL_T,.5)));cm.receiveShadow=true;hinge.add(cm);
  const lm=new THREE.Mesh(ceilGeo,mat(LID_T,.3));lm.material.side=THREE.BackSide;lm.position.z=-.03;lm.receiveShadow=true;hinge.add(lm);
  B.extra(2.4,1.1,e=>hinge.rotation.x=Math.PI/2*clamp(e,0,1));
}
// ================= 左右の壁とタペストリー =================
const TAP=[0,1].map(()=>tex(3.4,6.8,(g,w,h)=>{
  g.fillStyle='#3e1d14';g.fillRect(0,0,w,h);
  brush(g,0,0,w,h,['#4a2418','#35170f','#552a1a'],260,.4,.08,Math.PI/2,{alpha:.7});
  for(let i=0;i<620;i++){g.fillStyle=pick(['#7a3a22','#a8582e','#5a2a1a','#c08048','#2f3f26','#8a6a3a','#9a4a2a']);g.beginPath();g.arc(R()*w,R()*h,.04+R()*.06,0,7);g.fill()}
  g.fillStyle='#6a3a1e';g.fillRect(0,h-.45,w,.45);brush(g,0,h-.45,w,.45,['#8a5a2e','#5a2e16'],60,.2,.04,0);
  g.strokeStyle='#24100a';g.lineWidth=.08;g.strokeRect(.04,.04,w-.08,h-.08);
}));
const LEN=Math.hypot(7,20),ANG=Math.atan2(20,7);
const TAPX=[-7.4,-2.5,2.4,7.3];
function wallTex(dark,frontLeft){
  return tex(LEN,12,(g,w,h)=>{
    const base=dark?'#8d8579':'#d6cfc0';g.fillStyle=base;g.fillRect(-w/2,0,w,h);
    brush(g,-w/2,0,w,h,dark?['#857d71','#958d80','#7b7469']:['#cfc8b8','#dfd8ca','#c8c0b0'],1200,.6,.1,Math.PI/2,{jit:.9,alpha:.6});
    for(let i=0;i<5;i++){const x=-w/2+.75+i*4.9;g.fillStyle=dark?'#a39a8a':'#e6dfd0';g.fillRect(x-.45,0,.9,11.6);
      g.fillStyle=dark?'#776e60':'#b9ae98';g.fillRect(x-.6,1.6,1.2,2.8);g.fillStyle=dark?'#5f574b':'#9a8f7a';g.fillRect(x-.45,1.75,.9,2.5)}
    // 光は左の窓から: 手前ほど明るく
    const gr=g.createLinearGradient(-w/2,0,w/2,0),k=dark?.28:.12;
    gr.addColorStop(frontLeft?0:1,'rgba(255,240,210,'+k+')');gr.addColorStop(frontLeft?1:0,'rgba(20,14,8,'+k+')');g.fillStyle=gr;g.fillRect(-w/2,0,w,h);
    g.fillStyle=dark?'#6a6256':'#a89e8c';g.fillRect(-w/2,11.5,w,.5);
    g.strokeStyle=PAPER;g.lineWidth=.14;g.strokeRect(-w/2,0,w,h);
  },{center:true});
}
for(const s of [-1,1]){
  // 左の壁(s=-1)は影側。壁の内側の面が部屋を向くよう回す
  const pg=B.pop(root,[s*12.5,0,-4],[-s*Math.sin(ANG),Math.cos(ANG)],s<0?1.6:1.75,1.1,s<0?4:5);
  const o=new THREE.Group();o.rotation.y=-s*ANG;pg.add(o);
  const g=new THREE.Group();g.position.y=6;o.add(g);
  const [inner]=sheet(g,LEN,12,mat(wallTex(s<0,s<0),.5));
  if(s<0)inner.castShadow=false;
  TAPX.forEach((x,i)=>{const t=box(3.4,6.8,.08,mat(TAP[(i+(s>0))%2],.45));t.position.set(x,8.05,.05);if(s<0)t.castShadow=false;o.add(t)});
}
// ================= 食卓(手前へ倒す) =================
const TZ=2.9,TL=25,TD=2.2,TH=2.6;
function clothDraw(g,w,h,ends){
  g.fillStyle='#d9d7cd';g.fillRect(0,0,w,h);
  brush(g,0,0,w,h,['#e6e4dc','#cbc9bf','#f0eee6','#c4c2b8'],w*h*30,.5,.05,0,{alpha:.6});
  g.strokeStyle='rgba(120,118,108,.55)';g.lineWidth=.035;
  for(let x=1.56;x<w;x+=1.56){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}
  g.beginPath();g.moveTo(0,h*.5);g.lineTo(w,h*.5);g.stroke();
  if(ends)for(const x0 of [.7,w-2.5]){
    for(let x=x0;x<x0+1.8;x+=.2){g.strokeStyle=x%0.6<.2?'#3e5f92':'#6f8cb8';g.lineWidth=.05;g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}
    g.fillStyle='#3e5f92';for(let y=.15;y<h;y+=.3)for(let x=x0+.1;x<x0+1.8;x+=.4){g.fillRect(x,y,.12,.06)}
  }
}
{
  const pg=B.pop(root,[0,0,TZ],[0,1],2.3,.95,1);
  const topT=tex(TL,TD,(g,w,h)=>clothDraw(g,w,h,false)),hangT=tex(TL,1.5,(g,w,h)=>clothDraw(g,w,h,true)),sideT=tex(TD,1.5,(g,w,h)=>clothDraw(g,w,h,false));
  const CL=lam(0xd4d2c8,.3);
  const top=new THREE.Mesh(new THREE.BoxGeometry(TL,.08,TD),[CL,CL,mat(topT,.5),CL,CL,CL]);top.position.y=TH-.04;pg.add(shadowy(top));
  for(const s of [-1,1]){
    const h=plane(TL,1.5,mat(hangT,.5));h.position.set(0,TH-.75,s*(TD/2+.01));pg.add(h);
    const e=plane(TD,1.5,mat(sideT,.5));e.rotation.y=Math.PI/2;e.position.set(s*(TL/2+.01),TH-.75,0);pg.add(e);
  }
  for(const x of [-11,-4,4,11]){
    for(const z of [-.65,.65]){const l=box(.2,1.15,.2,WOOD);l.position.set(x,.58,z);pg.add(l)}
    const f=box(.24,.18,1.7,WOOD);f.position.set(x,.09,0);pg.add(f);
  }
  // 皿・杯・パン
  const GL=new THREE.MeshLambertMaterial({color:0xdfe8ec,emissive:0x40484c,transparent:true,opacity:.6});
  for(const x of [-10.6,-9,-7.6,-5.4,-3.6,0,2.6,4.2,6.4,8.2,10,11.4]){
    const p=new THREE.Mesh(new THREE.CylinderGeometry(.34,.28,.04,18),PEWTER);p.position.set(x+(R()-.5)*.4,TH+.02,-.35+R()*.3);pg.add(shadowy(p));
    const c=new THREE.Mesh(new THREE.CylinderGeometry(.09,.06,.3,10),GL);c.position.set(x+.55,TH+.15,-.55+R()*.2);pg.add(c);
  }
  for(let i=0;i<28;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.13,10,6),BREAD);b.scale.y=.6;b.position.set(-11.6+R()*23.2,TH+.06,(R()-.5)*1.5);pg.add(shadowy(b))}
}
// ================= 十二人の弟子とイエス =================
function hand(g,x,y,k,sk){
  const e=(f)=>cut(g,f,sk);
  if(k==='open')e(p=>p.ellipse(x,y,.21,.3,0,0,7));
  else if(k==='flat')e(p=>p.ellipse(x,y,.34,.14,0,0,7));
  else if(k==='clasp')e(p=>p.ellipse(x,y,.36,.22,0,0,7));
  else{e(p=>p.arc(x,y,.2,0,7));if(k==='point')e(p=>{p.rect(x-.05,y+.08,.1,.6)})}
}
function apostle(g,o){
  const sk=o.skin||'#d6a77f',skD=tone(sk,.7),tilt=o.tilt||0,sw=(o.sw||1)*1.4,BW=1.6;
  const sy=o.hy-.95,sx=o.hx+Math.sin(tilt)*.55,bx=o.bx??sx;
  const x0=Math.min(sx-sw,bx-BW)-.2,x1=Math.max(sx+sw,bx+BW)+.2;
  cut(g,p=>{p.moveTo(sx-sw,sy);p.quadraticCurveTo(sx,sy+.2,sx+sw,sy);p.lineTo(bx+BW,.15);p.lineTo(bx-BW,.15);p.closePath()},
    o.tunic,[tone(o.tunic,.8),tone(o.tunic,1.15),o.tunic,tone(o.tunic,.62)],300,.4,.09,Math.PI/2+.15,[x0,0,x1-x0,sy+.4]);
  if(o.mantle){const s=o.mside==='L'?-1:1;
    cut(g,p=>{p.moveTo(sx+s*.1,sy+.14);p.lineTo(sx+s*(sw+.06),sy-.02);p.lineTo(bx+s*(BW+.02),.15);p.lineTo(bx-s*.7,.15);p.quadraticCurveTo(sx-s*.2,sy-1.2,sx+s*.1,sy+.14);p.closePath()},
      o.mantle,[tone(o.mantle,.75),tone(o.mantle,1.15),o.mantle,tone(o.mantle,.6)],220,.45,.09,Math.PI/2-s*.5,[x0,0,x1-x0,sy+.4]);
  }
  cut(g,p=>p.rect(sx-.2,sy-.1,.4,.45),skD);
  // 頭(傾ける)
  g.save();g.translate(o.hx,o.hy);g.rotate(tilt);g.scale(1.28,1.28);
  const hc=o.hair,f=o.face==='L'?-1:o.face==='R'?1:0,hcs=[tone(hc,.75),tone(hc,1.2),hc];
  if(o.long)cut(g,p=>{p.moveTo(-.46,.1);p.quadraticCurveTo(-.62,-.5,-.55,-.95);p.lineTo(.55,-.95);p.quadraticCurveTo(.62,-.5,.46,.1);p.ellipse(0,.12,.46,.5,0,0,Math.PI)},hc,hcs,60,.3,.05,Math.PI/2,[-.7,-1,1.4,1.7]);
  else if(!o.bald)cut(g,p=>p.ellipse(0,.12,.46,.54,0,0,7),hc,hcs,50,.12,.06,0,[-.6,-.5,1.2,1.2]);
  cut(g,p=>p.ellipse(f*.05,0,.35,.46,0,0,7),o.dark?tone(sk,.45):sk);
  g.save();g.beginPath();g.ellipse(f*.05,0,.35,.46,0,0,7);g.clip();g.fillStyle=o.dark?'rgba(20,12,8,.55)':'rgba(90,50,30,.35)';g.fillRect(.08+f*.08,-.6,.5,1.2);g.restore();
  if(o.bald)for(const s of [-1,1])cut(g,p=>p.ellipse(s*.34,-.02,.11,.24,0,0,7),hc);
  if(o.beard)cut(g,p=>{p.moveTo(-.34,-.05);p.quadraticCurveTo(-.32,-.72,f*.06,-.82);p.quadraticCurveTo(.32,-.72,.34,-.05);p.lineTo(.18,-.2);p.quadraticCurveTo(f*.05,-.36,-.18,-.2);p.closePath()},o.beard,[tone(o.beard,.75),tone(o.beard,1.2)],30,.15,.04,Math.PI/2,[-.4,-.9,.8,.9]);
  if(!o.bald&&!o.long)cut(g,p=>p.ellipse(0,.4,.36,.15,0,0,7),hc);
  if(o.long)for(const s of [-1,1])cut(g,p=>{p.moveTo(0,.47);p.quadraticCurveTo(s*.42,.42,s*.44,-.35);p.lineTo(s*.32,-.3);p.quadraticCurveTo(s*.3,.28,0,.4);p.closePath()},hc);
  g.strokeStyle=o.dark?'#120c08':'#3a2618';g.lineCap='round';g.lineWidth=.045;
  for(const s of [-1,1]){const ex=f*.12+s*.13;g.beginPath();g.moveTo(ex-.05,.06);g.lineTo(ex+.05,.06+(o.down?-.02:0));g.stroke()}
  g.lineWidth=.035;g.beginPath();g.moveTo(f*.1,.02);g.lineTo(f*.16,-.14);g.lineTo(f*.08,-.15);g.stroke();
  g.beginPath();g.moveTo(f*.08-.08,-.27);g.lineTo(f*.08+.08,-.27);g.stroke();
  g.restore();
  // 腕と手
  g.lineCap='round';g.lineJoin='round';
  for(const a of o.arms){
    const line=(w,c)=>{g.strokeStyle=c;g.lineWidth=w;g.beginPath();a.p.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke()};
    const c=a.c||o.tunic;line(.66,PAPER);line(.54,c);line(.16,tone(c,1.18));
    const [hx,hy]=a.p[a.p.length-1];hand(g,hx,hy,a.h||'open',sk);
    if(a.bag)cut(g,p=>{p.ellipse(hx+.05,hy-.25,.2,.24,0,0,7)},'#6a5a3a',['#7a6a46','#4a3e28'],12,.1,.04,0);
    if(a.knife){g.strokeStyle=PAPER;g.lineWidth=.14;g.beginPath();g.moveTo(hx,hy);g.lineTo(hx-.75,hy-.35);g.stroke();g.strokeStyle='#c8c8d0';g.lineWidth=.09;g.stroke()}
  }
}
const A=(p,h,c,x)=>Object.assign({p,h,c},x);
// 左から: バルトロマイ・小ヤコブ・アンデレ | ユダ・ペテロ・ヨハネ | イエス | トマス・大ヤコブ・フィリポ | マタイ・タダイ・シモン
const PEOPLE=[
  {z:1.5,hx:-10.6,hy:6.4,tilt:-.15,face:'R',hair:'#7a4a26',tunic:'#6f8fb8',mantle:'#5f7a3e',mside:'L',sw:.95,bx:-11,arms:[A([[-11.3,5.3],[-11.7,3.9],[-11.5,2.72]],'flat'),A([[-9.8,5.35],[-9.5,4.1],[-9.8,2.72]],'flat')]},
  {z:.8,hx:-9.2,hy:6,tilt:.05,face:'R',hair:'#a07a42',tunic:'#d99a86',arms:[A([[-8.5,5.1],[-7.6,5.4],[-6.6,5.55]],'open')]},
  {z:1.4,hx:-7.9,hy:6,face:'R',bald:1,hair:'#cfc8b8',beard:'#e8e2d4',tunic:'#c9973a',mantle:'#4f6a3a',mside:'R',arms:[A([[-8.7,5.05],[-9.15,4.2],[-8.95,4.9]],'open'),A([[-7.1,5.05],[-6.7,4.2],[-6.85,4.85]],'open','#4f6a3a')]},
  {z:1.75,hx:-5.65,hy:5.2,tilt:.22,face:'R',dark:1,hair:'#2a2018',beard:'#2a2018',tunic:'#5c7896',mantle:'#3f5a44',mside:'L',sw:.9,bx:-6,arms:[A([[-6.4,4.3],[-6.1,3.4],[-5.4,3.2]],'fist',null,{bag:1}),A([[-5,4.3],[-4.1,3.3],[-3.25,2.85]],'flat')]},
  {z:.9,hx:-4.95,hy:5.95,tilt:-.28,face:'R',hair:'#d8d2c4',beard:'#e4ded0',tunic:'#4a6488',mantle:'#8a7a5a',mside:'L',arms:[A([[-5.4,5],[-6.3,4.4],[-6.85,4.05]],'fist',null,{knife:1}),A([[-4.1,5.05],[-3.8,5.2],[-3.5,5.15]],'open')]},
  {z:1.3,hx:-3.7,hy:5.45,tilt:.45,face:'L',down:1,long:1,hair:'#b8864a',skin:'#e0b896',tunic:'#4f7a96',mantle:'#d77a6a',mside:'R',bx:-3.1,arms:[A([[-4.1,4.5],[-3.7,3.3],[-3.05,2.9]],'clasp','#4f7a96'),A([[-2.7,4.5],[-2.65,3.4],[-2.95,2.95]],'clasp','#d77a6a')]},
  {z:1.2,hx:0,hy:EYE,tilt:.12,face:'F',down:1,long:1,hair:'#5a3a22',beard:'#5a3a22',tunic:'#c24a3a',mantle:'#3d5f9a',mside:'R',sw:1.25,bx:0,arms:[A([[-1.05,4.6],[-1.8,3.6],[-2.2,2.78]],'flat','#c24a3a'),A([[1.05,4.6],[1.7,3.5],[1.95,2.78]],'open','#3d5f9a')]},
  {z:.2,hx:2.35,hy:6.4,tilt:-.1,face:'L',hair:'#4a2e1c',beard:'#4a2e1c',tunic:'#5e6a4a',arms:[A([[1.95,5.5],[1.75,5.9],[1.75,6.2]],'point')]},
  {z:1.4,hx:3.05,hy:5.9,tilt:.1,face:'L',hair:'#7a5232',beard:'#7a5232',tunic:'#a8a660',mantle:'#6f7f4a',mside:'L',arms:[A([[2.25,4.9],[1.6,4.75],[1.15,5.05]],'open'),A([[3.85,4.9],[4.4,4.45],[4.6,4.6]],'open')]},
  {z:.9,hx:4.3,hy:6.6,tilt:.25,face:'L',hair:'#6a4a2a',tunic:'#d98a6a',mantle:'#c46a52',mside:'R',arms:[A([[3.65,5.6],[3.55,4.9],[4.05,5.1]],'clasp'),A([[4.95,5.55],[4.75,4.8],[4.35,5]],'clasp','#c46a52')]},
  {z:1.3,hx:8.1,hy:6.35,tilt:-.15,face:'R',hair:'#8a6236',tunic:'#6a8cc0',bx:8.3,arms:[A([[7.4,5.4],[6.3,5],[5.3,4.9]],'open'),A([[7.7,5.2],[7,4.6],[6.4,4.4]],'open')]},
  {z:.8,hx:9.95,hy:6.25,face:'R',hair:'#a8a090',beard:'#c0b8a8',tunic:'#c98a3a',mantle:'#a8742e',mside:'L',arms:[A([[9.4,5.2],[9.15,4.4],[9.55,4.55]],'open','#a8742e'),A([[10.5,5.2],[10.65,3.6],[10.3,2.85]],'flat')]},
  {z:1.4,hx:11.35,hy:6.25,tilt:.05,face:'L',bald:1,hair:'#b0a898',beard:'#d0c8b8',tunic:'#c8a07a',mantle:'#e8d8c8',mside:'R',sw:1.1,arms:[A([[10.8,5.1],[10.4,4],[10,3.7]],'open'),A([[11.85,5.1],[11.45,3.8],[10.85,3.5]],'open','#e8d8c8')]},
];
PEOPLE.forEach((o,i)=>{
  let x0=o.hx-1.9,x1=o.hx+1.9,top=o.hy+1.1;
  const bx=o.bx??o.hx;x0=Math.min(x0,bx-1.9);x1=Math.max(x1,bx+1.9);
  for(const a of o.arms)for(const [x,y] of a.p){x0=Math.min(x0,x-1);x1=Math.max(x1,x+.5);top=Math.max(top,y+.8)}
  const w=x1-x0,t=tex(w,top,g=>{g.translate(-x0,0);apostle(g,o)},{ppu:150});
  const pg=B.pop(root,[(x0+x1)/2,0,o.z],[0,-1],2.75+i*.05,.8,.4+(i%4)*.3);
  const m=plane(w,top,mat(t,.55,true),t);m.position.y=top/2;pg.add(m);
});
// 部屋の中のあかり(左の窓から差す光のかわり)
const lamp=B.light(new THREE.PointLight(0xfff0d8,0,46,1.2));
const lampAt=new THREE.Object3D();lampAt.position.set(-9,9.5,6);root.add(lampAt);
let lampK=0;B.extra(3.2,1,e=>lampK=clamp(e,0,1));
const tmp=new THREE.Vector3();
return {tick(){lampAt.getWorldPosition(tmp);lamp.position.copy(tmp);lamp.intensity=.75*lampK}};
},
caps:{
  A:'第1話「最後の晩餐」　レオナルド・ダ・ヴィンチ　1495〜1498年頃',
  B:'ミラノの修道院の食堂の壁画。修道士たちの食卓の向こうに、もう一つの部屋が続いているように描かれた。',
  C:'「あなたがたのうちの一人が、わたしを裏切る」。その言葉に、十二人の弟子は三人ずつの組で揺れ動く。',
  D:'天井の線も、壁のタペストリーも、すべてがイエスの頭の一点へ集まっていく。',
  E:'小刀を握って身を乗り出すペテロ。その前で身を引くユダは小さな袋を握り、ただ一人、顔が影に沈む。',
  F:'乾いた壁に描いたため絵は早くから傷み、1999年に、二十年あまりの修復を終えた。',
},
tour:[
  {t0:0,t1:6,f:u=>{const k=easeIO(u);return [V(0,42-8*k,50-8*k),V(0,4,-3)]},cap:'A'},
  {t0:6,t1:14.5,f:u=>{const a=-.95+1.9*easeIO(u);return [V(Math.sin(a)*40,17-4*u,Math.cos(a)*40-4),V(0,5,-4)]},cap:'B'},
  {t0:14.5,t1:22,f:u=>{const k=easeIO(u);return [V(-9+18*k,5.4,11),V(-7+14*k,4.9,0)]},cap:'C'},
  {t0:22,t1:29,f:u=>[V(0,EYE,25-.8*u),V(0,EYE,-14)],cap:'D',frame:true},
  {t0:29,t1:36,f:u=>{const k=easeIO(u);return [V(-6.5+1*k,5.6,12.5-1.5*k),V(-5,4.7,1.2)]},cap:'E'},
  {t0:36,t1:43,f:u=>{const k=easeIO(u);return [V(-5.5+5.5*k,5.6+36.4*k,11+38*k),V(-5+5*k,4.7-.7*k,1.2-4.2*k)]},cap:'F'},
],
tourEnd:43,tourLoop:6,
});
}
