'use strict';
// 見開き8: フィンセント・ファン・ゴッホ《星月夜》1889年6月
// 奥にうねる夜空の背景板。その手前に紙の支柱で星・三日月・渦を浮かせる。山並みを二枚、眠る村と教会の尖塔、
// 左手前に炎のような糸杉。
// 畳み方: 糸杉は奥へ、村と山は倒してもはみ出さない側へ、最後に夜空の背景板を手前へ倒す(裏に題名)。
{
const SKY=['#1a3a8a','#2a52a8','#3a6ac0','#14306f','#4a7ac8','#6a9ad8','#1e4090','#2f6f9e','#8ab0d8'];
const SWIRL=['#8ab8e0','#c8e0f0','#a8c8e8','#f0f0c8','#6a9ad0','#e8e8b0'];
const HILL=['#1e2a5a','#2a3a7a','#3a4a8a','#16204a','#4a5a9a','#2a4a7a'];
const CYP=['#1a2a1a','#2a3a22','#3a4a2a','#4a5a2a','#1e2e2e','#5a4a2a','#2a3a3a'];
const FIELD=['#2a4a3a','#3a5a4a','#1e3a3a','#4a6a4a','#2a3a5a','#5a7a4a'];
// 夜空の流れ: いくつかの渦と、左から右へうねる流れ
const VORT=[[.47,.3,1],[.62,.42,-.6],[.3,.42,.5],[.78,.18,.6]];
function flow(x,y,W,H){
  let vx=1,vy=Math.sin(x/W*9)*.35;
  for(const [cx,cy,s] of VORT){const dx=x-cx*W,dy=y-cy*H*1.2,d2=dx*dx+dy*dy+1e3,k=s*90000/d2;vx+=-dy*k/120;vy+=dx*k/120}
  return Math.atan2(vy,vx);
}
function starTex(r1,warm){
  return tex(2,2,g=>{
    g.translate(1,1);g.lineCap='round';
    const rings=warm?[[.95,['#f0a040','#e8c060','#f8d870']],[.7,['#f8e080','#fff0a0']],[.4,['#fff8c0','#ffffff']]]:
      [[.95,['#5a8ad0','#7aa8e0','#4a7ac8']],[.75,['#a8d0e8','#c8e0f0','#90b8e0']],[.55,['#e8f0c0','#d8e8b0','#f8f0c8']],[.35,['#f8e880','#fff0a0','#f0d860']],[.18,['#ffffff','#fffbe0']]];
    g.fillStyle=warm?'#e8a040':'#3a6ac0';g.strokeStyle=PAPER;g.lineWidth=.05;g.beginPath();g.arc(0,0,.96,0,7);g.stroke();g.fill();
    for(const [r,cols] of rings)for(let i=0;i<r*100;i++){const th=R()*6.283,rr=r*(.55+R()*.45),x=Math.cos(th)*rr,y=Math.sin(th)*rr,l=.08+R()*.1,tg=th+Math.PI/2;
      g.strokeStyle=pick(cols);g.lineWidth=.05+R()*.04;g.beginPath();g.moveTo(x-Math.cos(tg)*l/2,y-Math.sin(tg)*l/2);g.lineTo(x+Math.cos(tg)*l/2,y+Math.sin(tg)*l/2);g.stroke()}
  },{ppu:128});
}
BOOK.add({
no:8,name:'星月夜',seed:18890618,
desc:{
  orig:'De sterrennacht',
  artist:'フィンセント・ファン・ゴッホ　1889年6月',
  medium:'油彩・カンヴァス　73.7 × 92.1 cm　ニューヨーク近代美術館（MoMA）',
  paras:[
    '1889年5月、ゴッホは南フランスのサン＝レミにある療養院に入った。この絵は、東向きの部屋の窓から見た夜明け前の景色をもとに、昼間アトリエで描かれた。',
    '空には大きな渦がうねり、十一の星と三日月が光の輪をまとって輝く。左手前の糸杉は炎のように天へ伸び、地上と空をつないでいる。',
    '窓から見えたのは麦畑と山並みで、村と教会の尖塔はゴッホが付け加えたものとされる。尖塔の姿は、故郷オランダの教会を思わせる。ゴッホ自身は、のちの手紙でこの絵を失敗だったと書いている。',
  ],
  points:['うねる渦と、光の輪をまとう星','炎のように天へのびる糸杉','眠る村と、教会の尖塔'],
  foot:'―　右のページで、星の夜が立ち上がります　―',
},
plate:'フィンセント・ファン・ゴッホ《星月夜》1889年6月<br>療養院の窓の高さから、村と夜空を見た構図',
ground(g,W,H,{X,Z,S}){
  groundClip(g,X,Z,1.2,()=>{
    g.fillStyle='#24403a';g.fillRect(0,0,W,H);
    brush(g,0,0,W,H,FIELD,9000,40,9,(x,y)=>Math.sin(x*.004+y*.003)*.8,{jit:.4,bend:.5});
    // 村の地面
    g.fillStyle='rgba(30,40,80,.55)';g.beginPath();g.ellipse(X(4),Z(-4),14*S,9*S,0,0,7);g.fill();
  });
  groundTitle(g,W,H,'星月夜　―　フィンセント・ファン・ゴッホ　1889年6月　サン＝レミ＝ド＝プロヴァンス','De sterrennacht');
},
build(B){
const root=B.root;
// ================= 背景板: うねる夜空 =================
const bd=backdrop(B,{title:'星月夜',titleSize:170,orig:'De sterrennacht',dot:'#f0d860',emi:.5,shadow:false,
  draw:(g,W,H)=>{
    const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#14306f');gr.addColorStop(.75,'#2a52a8');gr.addColorStop(1,'#5a8ac8');g.fillStyle=gr;g.fillRect(0,0,W,H);
    brush(g,0,0,W,H,SKY,16000,42,10,(x,y)=>flow(x,y,W,H),{jit:.25,bend:.4});
    brush(g,W*.2,H*.18,W*.6,H*.4,SWIRL,1800,38,7,(x,y)=>flow(x,y,W,H),{jit:.2,bend:.4});
    // 地平線近くの明るみ
    const lg=g.createLinearGradient(0,H*.8,0,H);lg.addColorStop(0,'rgba(200,220,240,0)');lg.addColorStop(1,'rgba(200,220,240,.45)');g.fillStyle=lg;g.fillRect(0,H*.8,W,H*.2);
  }});
// ---- 浮かぶ星・三日月・渦(背景板の手前に紙の支柱で) ----
const stars=[];
{
  const tx=[starTex(1),starTex(1),starTex(1)],moonT=tex(2,2,g=>{g.translate(1,1);
    g.fillStyle='#e89a30';g.strokeStyle=PAPER;g.lineWidth=.05;g.beginPath();g.arc(0,0,.96,0,7);g.stroke();g.fill();
    brush(g,-1,-1,2,2,['#f0b040','#f8d060','#e88a2a'],260,.18,.06,(x,y)=>Math.atan2(y,x)+Math.PI/2);
    g.fillStyle='#fff070';g.beginPath();g.arc(0,0,.5,-1.2,1.9);g.arc(-.18,.08,.42,1.9,-1.2,true);g.fill()},{ppu:128});
  const list=[[-13,20.5,2.6],[-8,22.5,2.2],[-2,21.5,2.4],[3,22.8,1.8],[8.5,20,2],[-15.5,15.2,2.4],[-6,16.5,1.8],[11,16,1.9],[-10.5,13.4,3.2],[1,15,1.6],[6,13,1.5]];
  list.forEach(([x,y,s],i)=>{
    const pg=bd.pg,zb=bd.zAt(x),off=1+R()*2,t=pick(tx),m=plane(s,s,mat(t,.55,true),t);m.position.set(x,y,zb+off);pg.add(m);
    tab(pg,[x,y-.3,zb],[x,y-.3,zb+off],.1);m.userData={ph:R()*6};stars.push(m);
    B.extra(2.0+i*.05,.7,e=>m.scale.setScalar(Math.max(.001,e)));
  });
  const mx=13.5,my=20.5,mz=bd.zAt(mx)+2.2,moon=plane(3.6,3.6,mat(moonT,.65,true),moonT);moon.position.set(mx,my,mz);bd.pg.add(moon);tab(bd.pg,[mx,my-.3,bd.zAt(mx)],[mx,my-.3,mz],.12);
  B.extra(2.4,.8,e=>moon.scale.setScalar(Math.max(.001,e)));
  // 渦: 渦巻きの帯を切り抜いて二つ浮かせる
  const sw=tex(8,8,g=>{g.translate(4,4);g.lineCap='round';
    for(const [w,c] of [[.62,PAPER],[.5,'#a8c8e8'],[.3,'#e8f0c8'],[.12,'#ffffff']]){g.strokeStyle=c;g.lineWidth=w;g.beginPath();for(let a=0;a<14;a+=.05){const r=.25+a*.26;const x=Math.cos(a)*r,y=Math.sin(a)*r*.62;a?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
    brush(g,-4,-4,8,8,SWIRL,500,.3,.06,(x,y)=>Math.atan2(y,x)+Math.PI/2,{alpha:.5})},{ppu:100});
  for(const [x,y,s,o] of [[-1.5,18,9,2.6],[4.5,16,5,3.4]]){const z=bd.zAt(x)+o,m=plane(s,s,mat(sw,.62,true),sw);m.position.set(x,y,z);bd.pg.add(m);tab(bd.pg,[x,y,bd.zAt(x)],[x,y,z],.12);stars.push(m);m.userData={ph:R()*6,swirl:1}}
}
// ================= 山並み =================
function hill(z,h,base,dl,layer){
  const w=34,pg=B.pop(root,[0,0,z],fdir(z,h),dl,1.1,layer),pts=[...Array(18)].map((_,i)=>[i*w/17,h*(.45+.4*Math.sin(i*.6+z)+.15*R())]);
  const t=tex(w,h,g=>cut(g,p=>{p.moveTo(0,0);pts.forEach(([x,y])=>p.lineTo(x,y));p.lineTo(w,0);p.closePath()},base,HILL,1800,.5,.12,(x,y)=>Math.sin(x*.4)*.5,[0,0,w,h]),{ppu:60});
  const m=plane(w,h,mat(t,.5,true),t);m.position.y=h/2;pg.add(m);
}
hill(-21,8,'#2a3a7a',1.5,5);hill(-17,5.5,'#1e2a5a',1.6,4);
// ================= 村 =================
const roofM=[0x2a2a5a,0x3a3a6a,0x4a3a5a,0x1e2a4a].map(c=>lam(c,.3));
function houseTex(lit){return tex(2,1.4,(g,w,h)=>{g.fillStyle='#2a3a7a';g.fillRect(0,0,w,h);brush(g,0,0,w,h,HILL,80,.3,.06,Math.PI/2);
  for(const x of [.4,1.4]){g.fillStyle=lit&&R()<.7?'#f8d050':'#1a2448';g.fillRect(x,.45,.3,.38)}g.strokeStyle=PAPER;g.lineWidth=.05;g.strokeRect(0,0,w,h)},{ppu:60})}
const HT=[houseTex(true),houseTex(true),houseTex(false)].map(t=>mat(t,.5));
function village(cx,cz,w,d,n,dl){
  const pg=B.pop(root,[cx,0,cz],[0,-1],dl,.8,2);
  for(let i=0;i<n;i++){
    const x=(R()-.5)*w,z=(R()-.5)*d,hw=1.4+R()*1.2,hh=1+R()*1,hd=1.2+R()*.8,m=pick(HT);
    const h=new THREE.Mesh(new THREE.BoxGeometry(hw,hh,hd),[m,m,lam(0x1e2a5a,.3),m,m,m]);h.position.set(x,hh/2,z);h.rotation.y=(R()-.5)*.3;pg.add(shadowy(h));
    const r=new THREE.Mesh(new THREE.ConeGeometry(Math.max(hw,hd)*.75,.8,4).rotateY(Math.PI/4),pick(roofM));r.scale.set(hw/Math.max(hw,hd),1,hd/Math.max(hw,hd));r.position.set(x,hh+.4,z);r.rotation.y=h.rotation.y;pg.add(shadowy(r));
  }
}
village(-2,-8,10,5,16,2.3);village(8,-6,9,6,15,2.35);village(4,0,10,5,14,2.45);village(-6,-2,6,4,8,2.5);
// 村の木
for(const [x,z,h] of [[-8,-12,4],[1,-11,3.5],[12,-11,4],[13.5,-1,3.5],[-3,3,3],[9,4,3.4],[15,5,4]]){
  const pg=B.pop(root,[x,0,z],[0,-1],2.4,.7,2);
  crossCard(pg,2.4,h,(g,w,hh)=>cut(g,p=>{p.ellipse(w/2,hh*.6,w*.45,hh*.42,0,0,7);p.rect(w/2-.1,0,.2,hh*.3)},'#1e3a3a',['#2a4a3a','#14302a','#3a5a4a'],140,.3,.08,(xx,yy)=>Math.atan2(yy-hh*.6,xx-w/2)+1.4,[0,0,w,hh]),2,.45);
}
// 教会と尖塔
{
  const pg=B.pop(root,[2.5,0,-4.5],[0,-1],2.2,.9,3),WM=mat(houseTex(false),.5),RM=roofM[1];
  const nave=box(2.2,2,4.5,WM);nave.position.y=1;pg.add(nave);
  const nr=new THREE.Mesh(new THREE.CylinderGeometry(0,1.6,1.2,4,1).rotateY(Math.PI/4),RM);nr.scale.set(1,1,2);nr.position.set(0,2.6,0);pg.add(shadowy(nr));
  const tw=box(1.2,4,1.2,WM);tw.position.set(0,2,2.6);pg.add(tw);
  const sp=new THREE.Mesh(new THREE.ConeGeometry(.75,5.8,4).rotateY(Math.PI/4),RM);sp.position.set(0,6.9,2.6);pg.add(shadowy(sp));
}
// ================= 糸杉 =================
{
  const h=25,w=6.5,pg=B.pop(root,[-11.5,0,10],[0,-1],1.85,1.2,4);
  const lobes=[...Array(16)].map((_,i)=>{const t=i/15;return [w/2+Math.sin(i*1.9)*w*.18*(1-t*.6),t*h,w*.42*(1-t*.82)+.2]});
  const t=tex(w,h,g=>{
    g.save();g.beginPath();for(const [x,y,r] of lobes){g.moveTo(x+r,y);g.ellipse(x,y,r,r*2.2,0,0,7)}
    g.moveTo(w/2,h);g.lineTo(w/2+.6,h*.7);g.lineTo(w/2-.6,h*.7);g.closePath();
    g.strokeStyle=PAPER;g.lineWidth=.12;g.stroke();g.fillStyle='#1e2a1e';g.fill();g.clip();
    brush(g,0,0,w,h,CYP,2600,.9,.16,(x,y)=>Math.PI/2+Math.sin(y*.5+x)*.6,{jit:.3,bend:.8});g.restore();
  },{ppu:60});
  for(let k=0;k<3;k++){const m=plane(w,h,mat(t,.45,true),t);m.position.y=h/2;m.rotation.y=k*Math.PI/3;pg.add(m)}
}
// 星あかり
const glow=B.light(new THREE.PointLight(0xc8d8ff,0,80,1));
const at=new THREE.Object3D();at.position.set(2,24,4);root.add(at);
let k=0;B.extra(2.5,1,e=>k=clamp(e,0,1));
const tmp=new THREE.Vector3();
return {liveShadows:true,tick(T){
  at.getWorldPosition(tmp);glow.position.copy(tmp);glow.intensity=.45*k;
  for(const s of stars)s.rotation.z=s.userData.swirl?-T*.12+s.userData.ph:Math.sin(T*.4+s.userData.ph)*.3;
}};
},
caps:{
  A:'第8話「星月夜」　フィンセント・ファン・ゴッホ　1889年',
  B:'サン＝レミの療養院の窓から見た、夜明け前の景色。ゴッホはこの窓からの眺めを何度も描いた。',
  C:'左手前の糸杉。炎のようにねじれながら、地上から夜空へのびていく。',
  D:'空には大きな渦。十一の星と三日月が、光の輪をまとって燃えている。',
  E:'眠る村の家々に、ぽつぽつと灯り。教会の尖塔だけが、山並みより高く空へ突き出す。',
  F:'前の年には《夜のカフェテラス》で星空を描いた。この絵では、星空そのものが主役になった。',
},
tour:[
  {t0:0,t1:6,f:u=>{const k=easeIO(u);return [V(0,40-6*k,46-6*k),V(0,4,-6)]},cap:'A'},
  {t0:6,t1:14.5,f:u=>{const a=.95-1.9*easeIO(u);return [V(Math.sin(a)*42,18-4*u,Math.cos(a)*42-4),V(0,7,-8)]},cap:'B'},
  {t0:14.5,t1:21.5,f:u=>{const k=easeIO(u);return [V(-4-1*k,2+12*k,22-4*k),V(-11.5,4+14*k,10)]},cap:'C'},
  {t0:21.5,t1:28.5,f:u=>[V(1,7,30-1*u),V(-1,7.2,-14)],cap:'D',frame:true,fov:30},
  {t0:28.5,t1:35.5,f:u=>{const k=easeIO(u);return [V(8-4*k,4,12-2*k),V(3,3+1*k,-5)]},cap:'E'},
  {t0:35.5,t1:42,f:u=>{const k=easeIO(u);return [V(4-4*k,4+32*k,10+34*k),V(3-3*k,4,-5)]},cap:'F'},
],
tourEnd:42,tourLoop:6,
});
}
