// 見開き7: ゴッホ《夜のカフェテラス》1888
{
const SKY=['#1c3a8c','#23479f','#15306f','#2e5bb5','#3a6cc0','#1b2a66','#2f6f9e'];
const CAFE=['#f7d65a','#e9a822','#fbe58a','#f2c230','#e8b53a','#f0c040'];
const AWN=['#f4b425','#f9d04a','#ef9a1c','#fde27c','#f7c235'];
const DARK=['#1e2b5c','#2a3c78','#33468a','#18214a','#4a3a72','#245066','#2c3a6a'];
const TEAL=['#1d3b52','#2f5f6e','#2a4a72','#3a6a6a','#1a2c4a','#2d5260'];
const LIT=['#f9d36a','#e07a22','#fbe58a','#f2a93b'];
const COB=['#c98fa6','#9fb0d6','#b49fd0','#6f87b8','#d8a37c','#8fae9a','#a8b8e0'];
const COBW=['#e7a86a','#d98f6a','#f0c27c','#c98fa6','#eeb27a'];
const TREE=['#24442e','#3a6b3e','#5b8f4a','#1a3324','#7aa65a','#2c5c5a'];
const FIG=['#1b1f36','#2a2f52','#3c2f45','#22283f'];
const ROOF=['#3b2f5e','#2a2448','#4b3d72','#5a3f5a','#33305a'];
BOOK.add({
no:7,name:'夜のカフェテラス',seed:20250918,
desc:{
  orig:'Terrasse du café le soir',
  artist:'フィンセント・ファン・ゴッホ　1888年9月',
  medium:'油彩・カンヴァス　80.7 × 65.3 cm　クレラー・ミュラー美術館（オランダ）',
  paras:[
    '1888年、ゴッホは南フランスのアルルに移り住んだ。九月のある夜、彼はフォーラム広場に画架を立て、ガス灯に照らされたカフェのテラスを、その場で描いた。',
    '夜を描くのに、黒はほとんど使っていない。妹ヴィルへの手紙には「これは黒を一切使わない夜の絵だ」とある。夜空の深い青と、ガス灯の黄。補色どうしを並べて、光そのものを描こうとした。',
    '星を光の花のように描いたのも、この絵が最初とされる。翌年、彼は《星月夜》を描くことになる。',
  ],
  points:['黄色いテラスと青い夜空 ― 補色の響き合い','石畳に映る、桃色と紫の光','通りの奥へ吸い込まれる遠近法'],
  foot:'―　右のページで、この街が立ち上がります　―',
},
plate:'フィンセント・ファン・ゴッホ《夜のカフェテラス》1888年<br>この場所から見た構図で描かれた',
// 右ページの地面: 石畳の通り
ground(g,W,H,{X,Z,S}){
  const m=1.2,ix0=X(-18+m),ix1=X(18-m),iz0=Z(-28+m),iz1=Z(28-m);
  g.save();g.beginPath();g.rect(ix0,iz0,ix1-ix0,iz1-iz0);g.clip();
  g.fillStyle='#1e2547';g.fillRect(ix0,iz0,ix1-ix0,iz1-iz0);
  brush(g,ix0,iz0,ix1-ix0,iz1-iz0,DARK,3200,40,9,0);
  g.fillStyle='#232848';g.fillRect(X(-6.2),0,X(8.7)-X(-6.2),H);
  const cs=.42;let row=0;
  for(let z=-28;z<28;z+=cs*.82,row++){
    for(let x=-6.2+(row%2)*cs*.5;x<8.7;x+=cs){
      const warmK=x<1.8&&z>-19&&z<5?Math.max(0,1-Math.hypot(x+3.6,z+4)/13):0;
      g.fillStyle=R()<warmK*1.4?pick(COBW):pick(COB);
      g.beginPath();g.ellipse(X(x+(R()-.5)*.08),Z(z+(R()-.5)*.06),cs*.43*S,cs*.33*S,(R()-.5)*.6,0,7);g.fill();
      g.strokeStyle='rgba(255,245,220,.35)';g.lineWidth=2;g.beginPath();g.ellipse(X(x)-2,Z(z)-2,cs*.25*S,cs*.15*S,0,3.4,5.6);g.stroke();
    }
  }
  g.strokeStyle='rgba(246,211,107,.9)';g.lineWidth=5;g.setLineDash([14,10]);g.beginPath();g.arc(X(2.4),Z(9),.9*S,0,7);g.stroke();g.setLineDash([]);
  g.restore();
  g.fillStyle='#5a4a32';g.textAlign='center';
  g.font='30px '+FONT;g.fillText('夜のカフェテラス　―　フィンセント・ファン・ゴッホ　1888年9月　アルル、フォーラム広場',W/2,H-17);
  g.font='italic 28px Georgia,serif';g.fillText('Terrasse du café le soir',W/2,38);
},
build(B){
const root=B.root,popGroup=B.pop,extra={push:e=>B.extra(e.delay,e.dur,e.f)};
const lampL=B.light(new THREE.PointLight(0xffb040,0,19,1.3));
// ================= 建物 =================
function glass(g,x,y,w,h,lit){
  g.fillStyle=lit?'#f2a93b':'#151b3a';g.fillRect(x,y,w,h);
  clipRect(g,x,y,w,h,()=>brush(g,x,y,w,h,lit?LIT:['#1f2a55','#2a3870','#11162e'],w*h*55,.3,.07,Math.PI/2));
  g.strokeStyle='#14182e';g.lineWidth=.08;g.strokeRect(x,y,w,h);
  g.beginPath();g.moveTo(x+w/2,y);g.lineTo(x+w/2,y+h);g.moveTo(x,y+h*.62);g.lineTo(x+w,y+h*.62);g.stroke();
}
function opening(g,x,y,w,h,lit){
  g.fillStyle=lit?'#e0802a':'#141a36';g.fillRect(x,y,w,h);
  clipRect(g,x,y,w,h,()=>brush(g,x,y,w,h,lit?['#f29a3a','#c8641e','#f7c25a','#a8501a']:['#1f2a55','#11162e'],w*h*55,.35,.08,Math.PI/2));
  g.strokeStyle='#3a2410';g.lineWidth=.1;g.strokeRect(x,y,w,h);
}
function layoutHouse(W,H){
  const wins=[],shops=[];const cols=Math.max(1,Math.floor((W-.4)/2.45)),st=W/cols;
  for(let y=3.9;y+1.6<H-.7;y+=2.6)for(let i=0;i<cols;i++)wins.push({x:-W/2+st*(i+.5)-.47,y,w:.94,h:1.55,lit:R()<.42});
  for(let i=0;i<cols;i++)if(R()<.8)shops.push({x:-W/2+st*(i+.5)-.7,y:0,w:1.4,h:2.5,lit:R()<.55});
  return {wins,shops};
}
const SIDE_T=tex(6,12,(g,w,h)=>{g.fillStyle='#1d2a58';g.fillRect(0,0,w,h);brush(g,0,0,w,h,DARK,w*h*70,.5,.1,Math.PI/2,{jit:.8});
  for(const [x,y] of [[1.2,4.2],[3.6,6.8],[1.6,9.2]])glass(g,x,y,.8,1.3,R()<.5);g.strokeStyle=PAPER;g.lineWidth=.14;g.strokeRect(0,0,w,h)});
const SIDE_M=mat(SIDE_T,.38);
const ROOF_T=tex(8,4,(g,w,h)=>{g.fillStyle='#2e2850';g.fillRect(0,0,w,h);
  for(let y=0;y<h;y+=.32)for(let x=(y*3%1)*.4;x<w;x+=.4){g.fillStyle=pick(ROOF);g.beginPath();g.arc(x,y+.3,.2,Math.PI,0,true);g.fill()}
  brush(g,0,0,w,h,['#5a4a7a','#1e1a38'],120,.5,.05,0,{alpha:.5});g.strokeStyle=PAPER;g.lineWidth=.1;g.strokeRect(0,0,w,h)});
const ROOF_M=mat(ROOF_T,.35);
const SHUT_T=tex(.5,1.55,(g,w,h)=>{g.fillStyle='#2d6b4f';g.fillRect(0,0,w,h);g.strokeStyle='#1c4436';g.lineWidth=.04;
  for(let y=.1;y<h;y+=.14){g.beginPath();g.moveTo(.05,y);g.lineTo(w-.05,y);g.stroke()}g.strokeStyle=PAPER;g.lineWidth=.05;g.strokeRect(0,0,w,h)});
const SHUT_M=mat(SHUT_T,.4);
const SILL_M=lam(0xcfc3a0,.35),CORN_M=lam(0x3a4a7a,.3),CHIM_M=lam(0x3a2f4a,.3);
const IRON_T=tex(3.2,.9,(g,w,h)=>{
  g.strokeStyle='#15121c';g.lineWidth=.06;g.strokeRect(.03,.03,w-.06,h-.06);
  for(let x=.2;x<w;x+=.2){g.beginPath();g.moveTo(x,.05);g.lineTo(x,h-.05);g.stroke()}
  for(let x=.3;x<w;x+=.6){g.beginPath();g.arc(x,h*.5,.13,0,7);g.stroke()}});
const IRON_M=mat(IRON_T,.2,true);

function house(parent,o){
  const {W,H,D}=o,g=new THREE.Group();parent.add(g);
  const L=o.layout||layoutHouse(W,H);
  const ft=tex(W,H,(c,w,h)=>(o.paint||paintDark)(c,w,h,L,o),{center:true});
  const front=plane(W,H,mat(ft,o.emi??.42));front.position.set(0,H/2,0);g.add(front);
  for(const s of [-1,1]){const p=plane(D,H,SIDE_M);p.rotation.y=s*Math.PI/2;p.position.set(s*W/2,H/2,-D/2);g.add(p)}
  const back=plane(W,H,SIDE_M);back.rotation.y=Math.PI;back.position.set(0,H/2,-D);g.add(back);
  const ov=.35,rh=o.rh??2.2;
  if(o.roof==='spire'){
    const sp=new THREE.Mesh(new THREE.ConeGeometry(Math.max(W,D)*.74,rh,4,1),ROOF_M);sp.rotation.y=Math.PI/4;sp.position.set(0,H+rh/2,-D/2);g.add(shadowy(sp));
  }else{
    const a=[-W/2-ov,H,ov],b=[W/2+ov,H,ov],c=[W/2+ov,H+rh,-D/2],d=[-W/2-ov,H+rh,-D/2];
    const e=[-W/2-ov,H,-D-ov],f=[W/2+ov,H,-D-ov];
    g.add(shadowy(new THREE.Mesh(quad(d,c,b,a),ROOF_M)),shadowy(new THREE.Mesh(quad(d,c,f,e),ROOF_M)));
    for(const s of [-1,1])g.add(shadowy(new THREE.Mesh(tri([s*W/2,H,0],[s*W/2,H+rh,-D/2],[s*W/2,H,-D]),SIDE_M)));
    for(let i=0;i<(o.chim??2);i++){const ch=box(.55,1.5,.55,CHIM_M);ch.position.set((R()-.5)*W*.8,H+rh*.7,-D*(.3+R()*.4));g.add(ch)}
  }
  const co=box(W+.3,.28,.4,CORN_M);co.position.set(0,H-.14,.2);g.add(co);
  const sb=box(W+.15,.18,.3,CORN_M);sb.position.set(0,3.25,.15);g.add(sb);
  for(const w of L.wins){
    const sill=box(w.w+.3,.1,.32,SILL_M);sill.position.set(w.x+w.w/2,w.y-.05,.16);g.add(sill);
    if(o.noShutter)continue;
    const op=.75+R()*.6;
    for(const s of [-1,1]){
      const hinge=new THREE.Group();hinge.position.set(s<0?w.x:w.x+w.w,w.y+w.h/2,.03);hinge.rotation.y=-s*op;g.add(hinge);
      const sh=plane(w.w*.5,w.h,SHUT_M);sh.position.x=s*w.w*.25;hinge.add(sh);
    }
  }
  for(const s of L.shops){const li=box(s.w+.3,.2,.25,SILL_M);li.position.set(s.x+s.w/2,s.h+.1,.12);g.add(li)}
  if(o.balcony){
    const y=3.8,bw=W*.62;const sl=box(bw,.14,.9,SILL_M);sl.position.set(0,y,.45);g.add(sl);
    const rl=plane(bw,.9,IRON_M,IRON_T);rl.position.set(0,y+.5,.9);g.add(rl);
    for(const s of [-1,1]){const r2=plane(.9,.9,IRON_M,IRON_T);r2.rotation.y=Math.PI/2;r2.position.set(s*bw/2,y+.5,.45);g.add(r2)}
  }
  return g;
}
function paintDark(g,w,h,L,o){
  g.fillStyle=o.base||'#20305f';g.fillRect(-w/2,0,w,h);
  brush(g,-w/2,0,w,h,o.cols||DARK,w*h*70,.5,.1,Math.PI/2+(o.tilt||0),{jit:.8});
  for(const q of L.wins)glass(g,q.x,q.y,q.w,q.h,q.lit);
  for(const q of L.shops)opening(g,q.x,q.y,q.w,q.h,q.lit);
  g.strokeStyle=PAPER;g.lineWidth=.14;g.strokeRect(-w/2,0,w,h);
}

// ---- カフェ(左、正面は +x 向き) ----
let lantern,lampOn=0;
{
  const W=18,H=10,D=5;
  const wins=[];for(let i=0;i<6;i++)for(const y of [5.5,7.8])wins.push({x:-W/2+1.4+i*2.9,y,w:1,h:1.5,lit:R()<.35});
  const shops=[{x:-W/2+1.4,y:0,w:1.4,h:2.8,lit:true}];for(const x of [-4.6,-1,2.6,6.2])shops.push({x,y:.6,w:2.4,h:2.4,lit:true});
  const pg=popGroup(root,[-6.2,0,-10],[1,0],1.75,1.15,3);
  const o=new THREE.Group();o.rotation.y=Math.PI/2;pg.add(o);
  house(o,{W,H,D,emi:.5,chim:2,layout:{wins,shops},paint:(g,w,h,L)=>{
    g.fillStyle='#244a5e';g.fillRect(-w/2,4.6,w,h-4.6);
    clipRect(g,-w/2,4.6,w,h-4.6,()=>brush(g,-w/2,4.6,w,h-4.6,TEAL,2000,.55,.11,Math.PI/2,{jit:.7}));
    g.fillStyle='#f2c230';g.fillRect(-w/2,0,w,4.6);
    clipRect(g,-w/2,0,w,4.6,()=>brush(g,-w/2,0,w,4.6,CAFE,2200,.5,.11,1.25,{jit:.7}));
    for(const q of L.wins)glass(g,q.x,q.y,q.w,q.h,q.lit);for(const q of L.shops)opening(g,q.x,q.y,q.w,q.h,q.lit);
    g.strokeStyle=PAPER;g.lineWidth=.14;g.strokeRect(-w/2,0,w,h);
  }});
  const awn=new THREE.Group();awn.position.set(0,4.75,0);o.add(awn);
  const x0=-W/2-.6,x1=W/2+.2,out=4.8,drop=1.15;
  const at=tex(20,4.8,(g,w,h)=>{g.fillStyle='#f3b324';g.fillRect(0,0,w,h);brush(g,0,0,w,h,AWN,2600,.4,.12,Math.PI/2,{jit:.5});
    g.strokeStyle='rgba(190,110,20,.55)';g.lineWidth=.06;for(let x=.5;x<w;x+=.95){g.beginPath();g.moveTo(x,0);g.lineTo(x+.08,h);g.stroke()}});
  const am=mat(at,.85);
  awn.add(shadowy(new THREE.Mesh(quad([x0,0,0],[x1,0,0],[x1,-drop,out],[x0,-drop,out]),am)));
  const vt=tex(20,.8,(g,w,h)=>{g.fillStyle='#e9a020';g.beginPath();g.moveTo(0,h);g.lineTo(w,h);g.lineTo(w,.35);
    for(let x=w;x>0;x-=.5)g.arc(x-.25,.35,.25,0,Math.PI,false);g.closePath();g.fill();
    g.save();g.clip();brush(g,0,0,w,h,['#f7c235','#d98a1e','#fde27c'],600,.2,.06,Math.PI/2);g.restore();
    g.strokeStyle='#fde9a0';g.lineWidth=.05;g.beginPath();g.moveTo(0,h-.12);g.lineTo(w,h-.12);g.stroke()});
  const vm=mat(vt,.8,true);
  awn.add(shadowy(new THREE.Mesh(quad([x0,-drop,out],[x1,-drop,out],[x1,-drop-.8,out],[x0,-drop-.8,out]),vm),vt,true));
  for(const x of [x0,x1])awn.add(shadowy(new THREE.Mesh(tri([x,0,0],[x,-drop,out],[x,-drop-.8,out]),am)));
  extra.push({delay:2.9,dur:.9,f:e=>awn.rotation.x=1.33*(1-e)});
  lantern=new THREE.Group();lantern.position.set(-5.5,-1.25,2.2);awn.add(lantern);
  const fr=lam(0x2a2018,.2);
  const cap=new THREE.Mesh(new THREE.ConeGeometry(.32,.24,4),fr);cap.position.y=.37;cap.rotation.y=Math.PI/4;lantern.add(cap);
  const gl=new THREE.Mesh(new THREE.CylinderGeometry(.21,.15,.5,4,1,true),new THREE.MeshBasicMaterial({color:0xffe08a,side:THREE.DoubleSide}));gl.rotation.y=Math.PI/4;lantern.add(gl);
  for(const [x,z] of [[.18,0],[-.18,0],[0,.18],[0,-.18]]){const b=new THREE.Mesh(new THREE.BoxGeometry(.03,.5,.03),fr);b.position.set(x,0,z);lantern.add(b)}
  const rod=new THREE.Mesh(new THREE.BoxGeometry(.03,.5,.03),fr);rod.position.y=.72;lantern.add(rod);
  const gc=cv(256,256),gg=gc.getContext('2d'),rg=gg.createRadialGradient(128,128,0,128,128,128);
  rg.addColorStop(0,'rgba(255,240,180,1)');rg.addColorStop(.25,'rgba(255,200,90,.55)');rg.addColorStop(1,'rgba(255,160,40,0)');gg.fillStyle=rg;gg.fillRect(0,0,256,256);
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(gc),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,fog:false}));glow.scale.set(4.5,4.5,1);lantern.add(glow);
  extra.push({delay:3.4,dur:.8,f:e=>{lampOn=clamp(e,0,1.2);glow.material.opacity=clamp(e,0,1)}});
  const tt=tex(4.8,17.5,(g,w,h)=>{g.fillStyle='#e49a3a';g.fillRect(0,0,w,h);brush(g,0,0,w,h,['#f0b85a','#c9742a','#f6cf7c','#e88a3a','#d9a24a'],1400,.5,.12,.1);
    g.strokeStyle='rgba(120,60,20,.5)';g.lineWidth=.03;for(let y=.6;y<h;y+=.6){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}});
  const tp=popGroup(root,[-3.7,0,-10],[0,-1],2.3,.6,0);
  const deck=new THREE.Mesh(new THREE.BoxGeometry(4.8,.22,17.5),[SILL_M,SILL_M,mat(tt,.6),SILL_M,SILL_M,SILL_M]);deck.position.y=.11;tp.add(shadowy(deck));
}
// ---- 右の家並み ----
for(const [zc,W,H,bal,d] of [[-4.5,8,11,false,1.85],[-12.5,8,13.5,true,1.95],[-20.25,7.5,10,false,2.05]]){
  const pg=popGroup(root,[8.7,0,zc],[-1,0],d+.1,1.1,2);
  const o=new THREE.Group();o.rotation.y=-Math.PI/2;pg.add(o);
  house(o,{W,H,D:4.6,balcony:bal,tilt:(R()-.5)*.4,base:pick(['#20305f','#262e66','#1f3560'])});
}
// ---- 左奥・正面奥 ----
{
  const pg=popGroup(root,[-6.2,0,-22],[1,0],1.8,1.1,3);const o=new THREE.Group();o.rotation.y=Math.PI/2;pg.add(o);
  house(o,{W:6,H:11.5,D:4.5});
  const b1=popGroup(root,[-5.5,0,-25],[0,1],1.5,1.1,4);house(b1,{W:9,H:12,D:2,tilt:.3,chim:3});
  const b2=popGroup(root,[1.6,0,-25.3],[0,1],1.55,1.1,4);house(b2,{W:5,H:9.5,D:2,base:'#2a3672'});
  const tw=popGroup(root,[6.2,0,-26],[0,1],1.4,1.2,5);house(tw,{W:3.2,H:14,D:1.6,roof:'spire',rh:4.5,noShutter:true,layout:{wins:[{x:-.4,y:11,w:.8,h:1.4,lit:true},{x:-.4,y:6.5,w:.8,h:1.4,lit:false}],shops:[{x:-.6,y:0,w:1.2,h:2.4,lit:false}]}});
}
// ---- 夜空の背景板と紙の星 ----
function starTex(){
  return tex(2,2,(g)=>{
    g.translate(1,1);
    g.fillStyle='#4f7fc4';g.strokeStyle=PAPER;g.lineWidth=.05;g.beginPath();g.arc(0,0,.92,0,7);g.stroke();g.fill();
    const rings=[[.9,['#7fa9dc','#9fc3e6','#5f8fcf']],[.72,['#b9d6ea','#cfe3f0','#9fc3e6']],[.55,['#e8eeb0','#d8e8c0','#f2f0c0']],[.38,['#f6e27a','#f9ea9a','#efd35a']],[.22,['#fffbe0','#fff3b0']]];
    g.lineCap='round';
    for(const [r,cols] of rings){const n=r*90;
      for(let i=0;i<n;i++){const th=R()*6.283,rr=r*(.6+R()*.4),x=Math.cos(th)*rr,y=Math.sin(th)*rr,l=.08+R()*.1,tg=th+Math.PI/2;
        g.strokeStyle=pick(cols);g.globalAlpha=.85;g.lineWidth=.05+R()*.04;g.beginPath();g.moveTo(x-Math.cos(tg)*l/2,y-Math.sin(tg)*l/2);g.lineTo(x+Math.cos(tg)*l/2,y+Math.sin(tg)*l/2);g.stroke()}}
    g.globalAlpha=1;g.fillStyle='#fffdf0';g.beginPath();g.arc(0,0,.12,0,7);g.fill();
  },{ppu:128});
}
const stars=[];
{
  const RAD=34,CZ=6.2,HH=24,TH=.56;
  const pg=popGroup(root,[0,0,0],[0,1],1.15,1.3,6);
  // 上辺が波打つ切り抜き。表(内側)=夜空、裏=手前に倒したとき上になる面なので題名を刷る
  const edge=new Path2D();edge.moveTo(0,1400);edge.lineTo(2048,1400);edge.lineTo(2048,120);
  for(let x=2048;x>0;x-=128)edge.quadraticCurveTo(x-64,R()*90-20,x-128,60+R()*70);
  edge.closePath();
  const c=cv(2048,1400),g=c.getContext('2d');
  g.save();g.clip(edge);
  const gr=g.createLinearGradient(0,0,0,1400);gr.addColorStop(0,'#0f2366');gr.addColorStop(.7,'#24489f');gr.addColorStop(1,'#2f5fb8');g.fillStyle=gr;g.fillRect(0,0,2048,1400);
  brush(g,0,0,2048,1400,SKY,9000,48,10,(x,y)=>Math.sin(x*.005+y*.002)*.8+Math.cos(y*.01)*.5,{jit:.4,bend:.6});
  g.restore();g.strokeStyle=PAPER;g.lineWidth=10;g.stroke(edge);
  const st=new THREE.CanvasTexture(c);st.anisotropy=ANISO;
  const lc=cv(2048,1400),lg=lc.getContext('2d');
  lg.save();lg.clip(edge);
  lg.fillStyle='#ece1c4';lg.fillRect(0,0,2048,1400);
  brush(lg,0,0,2048,1400,['#e3d5b2','#f3ead2','#e8dbbb'],1800,30,3,0,{alpha:.5,jit:3});
  // 倒れると上下・左右が入れ替わるので、180度回して刷る
  lg.translate(1024,760);lg.rotate(Math.PI);
  lg.strokeStyle='#b08a3a';lg.lineWidth=4;lg.strokeRect(-860,-430,1720,860);lg.lineWidth=1.5;lg.strokeRect(-840,-410,1680,820);
  lg.textAlign='center';lg.fillStyle='#8a6a2a';lg.font=`52px ${FONT}`;lg.fillText(`第 ${B.no} 話`,0,-200);
  lg.fillStyle='#2b2216';lg.font=`150px ${FONT}`;lg.fillText('夜のカフェテラス',0,0);
  lg.fillStyle='#6a5a3e';lg.font='italic 58px Georgia,serif';lg.fillText('Terrasse du café le soir',0,110);
  lg.fillStyle='#8a6a2a';lg.font=`46px ${FONT}`;lg.fillText('―　タップすると、街が立ち上がります　―'.replace('タップ',TAP_WORD),0,280);
  for(const x of [-560,560]){lg.fillStyle='#e9b830';lg.beginPath();lg.arc(x,-215,26,0,7);lg.fill();lg.strokeStyle='#b08a3a';lg.lineWidth=3;lg.beginPath();lg.arc(x,-215,42,0,7);lg.stroke()}
  lg.restore();lg.strokeStyle=PAPER;lg.lineWidth=10;lg.stroke(edge);
  const lt=new THREE.CanvasTexture(lc);lt.anisotropy=ANISO;
  const geo=new THREE.CylinderGeometry(RAD,RAD,HH,48,1,true,Math.PI-TH,TH*2);
  const sky=new THREE.Mesh(geo,mat(st,.62,true));sky.material.side=THREE.BackSide;sky.position.set(0,HH/2,CZ);shadowy(sky,st,true);pg.add(sky);
  const lab=new THREE.Mesh(geo,mat(lt,.3,true));lab.material.side=THREE.FrontSide;lab.position.copy(sky.position);lab.receiveShadow=true;pg.add(lab);
  const tx=[starTex(),starTex(),starTex()];
  const list=[[-1.5,18.5,2.6],[3.2,20.5,2.2],[7.5,17.8,2.4],[-6,21,2],[11,20.5,1.8],[1,23,1.9],[-9.5,18,1.8],[5,15.6,1.5],[13.5,17,1.9],[-12.5,15.5,1.6],[-3.5,15.2,1.4],[9,23,1.6],[-8,23,1.5],[15,22.5,1.4]];
  list.forEach(([x,y,s],i)=>{
    const zb=CZ-Math.sqrt(RAD*RAD-x*x),off=.8+R()*2.2;
    const t=pick(tx),m=plane(s,s,mat(t,.32,true),t);m.position.set(x,y,zb+off);pg.add(m);
    const tab=box(.12,.12,off,SILL_M);tab.position.set(x,y-.2,zb+off/2);pg.add(tab);
    m.userData={ph:R()*6,sp:(R()-.5)*.4};stars.push(m);
    extra.push({delay:2.1+i*.05,dur:.7,f:e=>m.scale.setScalar(Math.max(.001,e))});
  });
}
// ================= テーブル・人物・木 =================
function cardMesh(wu,hu,draw,emi=.5){
  const t=tex(wu,hu,draw);const m=plane(wu,hu,mat(t,emi,true),t);m.position.y=hu/2;return m;
}
function person(g,x,{hat=true,dress=false,coat='#1b1f36',sit=false,apron=false}={}){
  const by=sit?.45:0;
  if(dress)cut(g,g=>{g.moveTo(x-.38,0);g.lineTo(x+.38,0);g.lineTo(x+.14,1.25);g.lineTo(x-.14,1.25);g.closePath()},'#3c2f45',FIG,60,.25,.06,Math.PI/2,[x-.5,0,1,1.4]);
  else if(sit)cut(g,g=>{g.moveTo(x-.12,0);g.lineTo(x+.02,0);g.lineTo(x+.06,.5);g.lineTo(x+.38,.5);g.lineTo(x+.38,.6);g.lineTo(x-.15,.62);g.closePath()},'#141830');
  else cut(g,g=>{g.moveTo(x-.17,0);g.lineTo(x-.04,0);g.lineTo(x,.75);g.lineTo(x+.04,0);g.lineTo(x+.17,0);g.lineTo(x+.15,.85);g.lineTo(x-.15,.85);g.closePath()},'#141830');
  const ty=by+(dress?1.0:.75);
  cut(g,g=>{g.moveTo(x-.2,ty-.05);g.lineTo(x+.2,ty-.05);g.lineTo(x+.15,ty+.55);g.lineTo(x-.15,ty+.55);g.closePath()},coat,FIG,40,.2,.06,Math.PI/2,[x-.3,ty-.1,.6,.7]);
  if(apron)cut(g,g=>{g.rect(x-.15,ty-.35,.3,.6)},'#eee7d4',['#ffffff','#d8d0c0'],30,.15,.05,Math.PI/2,[x-.2,ty-.4,.4,.7]);
  cut(g,g=>{g.arc(x,ty+.68,.12,0,7)},'#e2b48a');
  if(hat)cut(g,g=>{g.rect(x-.2,ty+.76,.4,.05);g.rect(x-.12,ty+.8,.24,.13)},'#11142a');
  if(dress)cut(g,g=>{g.ellipse(x,ty+.82,.2,.07,0,0,7)},'#5a3a4a');
}
function tableDraw(g,x){
  cut(g,g=>{g.rect(x-.04,.08,.08,.6);g.rect(x-.22,0,.44,.08)},'#4a3a26');
  cut(g,g=>{g.ellipse(x,.72,.44,.08,0,0,7)},'#e4dc8a',['#f2ea9a','#cfc46a','#fff5c0'],40,.15,.04,0,[x-.5,.6,1,.3]);
}
function chairDraw(g,x){
  cut(g,g=>{g.moveTo(x-.2,0);g.lineTo(x-.17,.45);g.lineTo(x+.2,.45);g.lineTo(x+.2,.95);g.lineTo(x+.25,.95);g.lineTo(x+.25,0);g.lineTo(x+.2,0);g.lineTo(x+.2,.4);g.lineTo(x-.13,.4);g.lineTo(x-.15,0);g.closePath()},'#6a4a2a');
}
function crossCard(parent,wu,hu,draw,n=2,emi=.5){
  const t=tex(wu,hu,draw);const m0=mat(t,emi,true);
  for(let i=0;i<n;i++){const m=plane(wu,hu,m0,t);m.position.y=hu/2;m.rotation.y=i*Math.PI/n;parent.add(m)}
}
let dl=2.5;
function piece(x,z,y,dir,build){const pg=popGroup(root,[x,y,z],dir,dl,.8);dl+=.05;build(pg);return pg}
function tableSet(pg,who,coat){
  crossCard(pg,1,.85,g=>tableDraw(g,.5));
  for(const [cx,cz,ry] of [[-.6,.1,0],[.6,-.1,Math.PI]]){const c=cardMesh(.6,1,g=>chairDraw(g,.3),.45);c.position.set(cx,0,cz);c.rotation.y=ry+.5;pg.add(c)}
  if(who){const p=cardMesh(.8,2.1,g=>person(g,.4,{sit:true,coat:coat||pick(['#1b1f36','#2a3c78','#3c2f45'])}),.5);p.position.set(-.55,0,.25);p.rotation.y=.6;pg.add(p)}
}
for(const [x,z,who] of [[-4.7,-2.2,1],[-2.5,-4.6,0],[-4.6,-7,1],[-2.6,-9.6,1],[-4.6,-12.2,0],[-2.5,-14.6,1],[-4.4,-17,0]])
  piece(x,z,.22,[0,-1],pg=>tableSet(pg,who));
piece(-1.7,-3.6,.22,[0,-1],pg=>{const p=cardMesh(.8,1.95,g=>person(g,.4,{hat:false,apron:true}),.6);p.rotation.y=.5;pg.add(p)});
piece(3.2,-8.5,0,[0,-1],pg=>pg.add(cardMesh(1.6,2.2,g=>{person(g,.45,{dress:true,hat:false});person(g,1.15,{coat:'#22283f'})},.45)));
piece(.8,-15,0,[0,-1],pg=>pg.add(cardMesh(.8,2,g=>person(g,.4,{coat:'#2a2f52'}),.45)));
piece(6.8,-5,0,[0,-1],pg=>pg.add(cardMesh(.8,2,g=>person(g,.4,{coat:'#3c2f45',hat:false,dress:true}),.45)));
piece(4.8,-21.5,0,[0,-1],pg=>{const m=cardMesh(3.4,2.6,(g)=>{
  cut(g,g=>{g.ellipse(.75,.9,.55,.34,0,0,7);g.rect(.3,0,.09,.7);g.rect(1.05,0,.09,.7);g.moveTo(1.15,1);g.lineTo(1.6,1.6);g.lineTo(1.75,1.45);g.lineTo(1.3,.85);g.closePath()},'#2a1e18',['#3a2a20','#1a120c'],40,.3,.06,0,[0,0,2,2]);
  cut(g,g=>{g.rect(1.6,.5,1.6,1.4);g.arc(2,.42,.4,0,7);g.arc(3,.42,.3,0,7)},'#1a2140',DARK,80,.3,.06,Math.PI/2,[1.5,0,1.8,2]);
  cut(g,g=>{g.arc(1.7,1.55,.14,0,7)},'#f7d65a');},.45);m.rotation.y=.35;pg.add(m)});
dl=3.0;
for(const [x,z] of [[-5.2,1.4],[-3.4,3.4]])piece(x,z,0,[0,1],pg=>tableSet(pg,0));
piece(7.4,4.2,0,[0,1],pg=>{
  const t=tex(5,7.6,(g,w,h)=>{
    cut(g,g=>{g.moveTo(2.2,0);g.lineTo(2.9,0);g.lineTo(2.75,3.2);g.lineTo(2.35,3.2);g.closePath()},'#2a1e18',['#3a2a20','#1a120c'],60,.4,.08,Math.PI/2,[0,0,w,h]);
    const blobs=[[2.5,5.2,1.9],[1.4,4.4,1.2],[3.6,4.5,1.2],[2.1,6.4,1.1],[3.3,6.2,1.0],[1.2,5.6,.9],[4,5.6,.85]];
    cut(g,g=>{for(const [x,y,r] of blobs){g.moveTo(x+r,y);g.arc(x,y,r,0,7)}},'#2c5034',TREE,900,.45,.1,(x,y)=>Math.atan2(y-5,x-2.5)+1.2,[0,0,w,h]);
  });
  const m0=mat(t,.4,true);
  for(let i=0;i<3;i++){const m=plane(5,7.6,m0,t);m.position.set(-.05,3.8,0);m.rotation.y=i*Math.PI/3;pg.add(m)}
});
piece(5.8,2.2,0,[0,1],pg=>pg.add(cardMesh(.8,2,g=>person(g,.4,{coat:'#22283f'}),.45)));
piece(3.6,9.3,0,[0,1],pg=>{const m=cardMesh(1.1,1.95,(g)=>{
  cut(g,g=>{g.moveTo(.2,0);g.lineTo(.27,0);g.lineTo(.6,1.9);g.lineTo(.53,1.9);g.closePath();g.moveTo(.9,0);g.lineTo(.83,0);g.lineTo(.5,1.9);g.lineTo(.57,1.9);g.closePath()},'#6a4a2a');
  cut(g,g=>{g.rect(.15,.95,.8,.9)},'#f1e7cf',null);
  cut(g,g=>{g.rect(.2,1.0,.7,.8)},'#1c3a8c',SKY,40,.12,.04,0,[.2,1,.7,.8]);
  cut(g,g=>{g.moveTo(.2,1);g.lineTo(.45,1);g.lineTo(.45,1.55);g.lineTo(.2,1.7);g.closePath()},'#f2c230',CAFE,20,.1,.04,1.2,[.2,1,.3,.7]);
},.55);m.rotation.y=Math.PI;pg.add(m)});
const tmpV=new THREE.Vector3();
return {liveShadows:true,tick(T){
  for(const s of stars)s.rotation.z=Math.sin(T*.3+s.userData.ph)*.3+T*s.userData.sp*.2;
  lantern.getWorldPosition(tmpV);lampL.position.copy(tmpV);
  lampL.intensity=lampOn*(1.8+.08*Math.sin(T*7)+.05*Math.sin(T*13));
}};
},
caps:{
  A:'第7話「夜のカフェテラス」　フィンセント・ファン・ゴッホ　1888年',
  B:'1888年9月、南フランスのアルル。ゴッホはフォーラム広場のこのカフェを、夜、その場で描いた。',
  C:'黄色いガス灯の光と、夜空の青。黄と青は補色どうしで、並べると互いをいちばん鮮やかに見せる。',
  D:'妹ヴィルへの手紙に、ゴッホは「これは黒を一切使わない夜の絵だ」と書いている。',
  E:'星を白い点ではなく、光の花として描いた。ゴッホが星空を描いた最初の作品とされる。',
  F:'このカフェは今もアルルのフォーラム広場にあり、「カフェ・ヴァン・ゴッホ」として営業している。'
},
// カメラ台本(右ページの座標)。frame:true の場面で額縁と plate を出す
tour:[
  {t0:0,t1:6,f:u=>{const k=easeIO(u);return [V(0,40-6*k,46-6*k),V(0,2,-6)]},cap:'A'},
  {t0:6,t1:14.5,f:u=>{const a=.95-1.9*easeIO(u);return [V(Math.sin(a)*46,24-6*u,Math.cos(a)*46-6),V(0,4,-8)]},cap:'B'},
  {t0:14.5,t1:21.5,f:u=>{const k=easeIO(u);return [V(2.8-.4*k,3.6-2*k,27-18*k),V(-.4-1.1*k,3.6+.9*k,-18)]},cap:'C'},
  {t0:21.5,t1:28.5,f:u=>[V(2.4,1.6,9-.8*u),V(-1.5,4.5,-18)],cap:'D',frame:true},
  {t0:28.5,t1:35.5,f:u=>{const k=easeIO(u);return [V(.5+2.5*k,2+11*k,-1-7*k),V(-4.5+4.5*k,2.6+15*k,-11-16*k)]},cap:'E'},
  {t0:35.5,t1:42,f:u=>{const k=easeIO(u);return [V(3-3*k,13+21*k,-8+48*k),V(0,3-k,-6)]},cap:'F'},
],
tourEnd:42,tourLoop:6,
});
}
