'use strict';
// 見開き2: ピエール＝オーギュスト・ルノワール《ムーラン・ド・ラ・ギャレットの舞踏会》1876年
// 手前にベンチの娘たちと友人のテーブル、まん中に踊る男女、奥に木立とガス灯と人だかり。木漏れ日は切り絵に描き込む。
// 畳み方: 人物とテーブルは倒してもはみ出さない側へ、木とガス灯は奥へ、最後に木立の背景板を手前へ倒す(裏に題名)。
{
const EARTH=['#a8988a','#988ca0','#b8a488','#8a80a0','#c0aa88','#7a7090'];
const LEAF=['#4a7a5a','#6a9a6a','#3a6a6a','#8ab07a','#2f5a5a','#a8c88a','#5a8aa0'];
const NAVY=['#1e2a4a','#2a3a6a','#33467a','#18223a','#4a5a8a'];
const PINK=['#e8a0a8','#f0b8b8','#d88898','#f8d0c8','#e890a0'];
const SPOT='rgba(255,246,214,.6)',SHADE='rgba(90,110,190,.32)';
// ルノワール風の切り絵: やわらかな短い筆致に、木漏れ日のまだらを重ねる
function rp(g,path,base,cols,box,dap=1){
  g.save();g.beginPath();path(g);g.lineJoin='round';g.strokeStyle=PAPER;g.lineWidth=.045;g.stroke();
  g.fillStyle=base;g.fill();g.clip();
  const [x,y,w,h]=box;brush(g,x,y,w,h,cols,w*h*90,.12,.05,0,{jit:6,alpha:.7});
  for(let i=0;i<w*h*7*dap;i++){g.fillStyle=R()<.65?SPOT:SHADE;g.beginPath();g.ellipse(x+R()*w,y+R()*h,.05+R()*.09,.04+R()*.07,R()*3,0,7);g.fill()}
  g.restore();
}
const C=(c,k)=>'#'+new THREE.Color(c).multiplyScalar(k).getHexString();
const fam=c=>[c,C(c,.8),C(c,1.18),C(c,.65)];
function face(g,x,y,o={}){
  rp(g,p=>p.ellipse(x,y,.12,.15,0,0,7),'#f0c8a8',['#f8d8b8','#e8b090','#f0a0a0'],[x-.2,y-.2,.4,.4],.4);
  const hc=o.hair||'#5a3a22';
  rp(g,p=>{p.ellipse(x,y+.08,.14,.1,0,0,Math.PI);if(o.bun)p.arc(x-.08,y+.12,.08,0,7)},hc,fam(hc),[x-.25,y,.5,.3],.3);
  g.fillStyle='#3a2a20';for(const s of [-1,1]){g.beginPath();g.arc(x+s*.05,y+.01,.012,0,7);g.fill()}
  g.fillStyle='#d86a6a';g.beginPath();g.ellipse(x,y-.07,.03,.012,0,0,7);g.fill();
  if(o.hat==='boater')rp(g,p=>{p.ellipse(x,y+.13,.22,.045,0,0,7);p.rect(x-.12,y+.13,.24,.09)},'#e8d090',['#f0e0a8','#c8a860','#fff4c8'],[x-.3,y,.6,.3],.3);
  else if(o.hat==='bowler')rp(g,p=>{p.ellipse(x,y+.12,.19,.04,0,0,7);p.ellipse(x,y+.17,.12,.09,0,Math.PI,0,true)},'#1a1a26',['#2a2a3a','#101018'],[x-.3,y,.6,.3],.3);
  else if(o.hat==='bonnet')rp(g,p=>{p.ellipse(x+.02,y+.14,.15,.08,-.2,0,7)},o.hc||'#2a2a3a',fam(o.hc||'#2a2a3a'),[x-.2,y,.4,.3],.2);
}
// 立つ女(ドレス) o.dress, o.stripe, o.arms:'down'|'dance'
function woman(g,x,o={}){
  const d=o.dress||'#e8a0a8';
  const skirt=p=>{p.moveTo(x-.17,1.02);p.quadraticCurveTo(x-.32,.5,x-.52,0);p.lineTo(x+.5,0);p.quadraticCurveTo(x+.3,.5,x+.17,1.02);p.closePath()};
  rp(g,skirt,d,fam(d),[x-.6,0,1.2,1.1]);
  if(o.stripe){g.save();g.beginPath();skirt(g);g.clip();g.fillStyle=o.stripe;for(let s=-.6;s<.6;s+=.1){g.beginPath();g.moveTo(x+s*.4,1.05);g.lineTo(x+s,0);g.lineTo(x+s+.04,0);g.lineTo(x+s*.4+.02,1.05);g.closePath();g.fill()}g.restore()}
  const top=o.top||d;
  rp(g,p=>{p.moveTo(x-.17,1.0);p.lineTo(x+.17,1.0);p.lineTo(x+.2,1.44);p.lineTo(x-.2,1.44);p.closePath()},top,fam(top),[x-.3,.9,.6,.6]);
  if(o.stripe){g.save();g.beginPath();g.rect(x-.2,1,.4,.44);g.clip();g.fillStyle=o.stripe;for(let s=-.2;s<.2;s+=.08)g.fillRect(x+s,1,.025,.44);g.restore()}
  rp(g,p=>p.rect(x-.045,1.42,.09,.1),'#f0c8a8',['#f8d8b8'],[x-.1,1.4,.2,.2],.2);
  face(g,x,1.64,{hair:o.hair||'#6a4228',bun:true,hat:o.hat,hc:o.hc});
  if(o.arms!=='dance')for(const s of [-1,1])rp(g,p=>{p.moveTo(x+s*.17,1.42);p.lineTo(x+s*.23,1.38);p.lineTo(x+s*.25,.95);p.lineTo(x+s*.18,.95);p.closePath()},top,fam(top),[x-.4,.9,.8,.6],.5);
}
function man(g,x,o={}){
  const j=o.jacket||'#1e2a4a';
  for(const s of [-1,1])rp(g,p=>p.rect(x+s*.09-.07,0,.14,.88),o.trou||'#2a2a3a',['#3a3a4a','#1a1a24','#4a4a5a'],[x-.3,0,.6,.9],.6);
  rp(g,p=>{p.moveTo(x-.22,.8);p.lineTo(x+.22,.8);p.lineTo(x+.24,1.5);p.lineTo(x-.24,1.5);p.closePath()},j,fam(j),[x-.3,.7,.6,.85]);
  rp(g,p=>{p.moveTo(x-.05,1.5);p.lineTo(x+.05,1.5);p.lineTo(x,1.25);p.closePath()},'#f4f0e8',['#ffffff'],[x-.1,1.2,.2,.3],0);
  rp(g,p=>p.rect(x-.05,1.48,.1,.1),'#e8b898',['#f0c8a8'],[x-.1,1.4,.2,.2],.2);
  face(g,x,1.7,{hair:o.hair||'#3a2418',hat:o.hat||'boater'});
  if(o.beard){g.fillStyle=o.beard;g.beginPath();g.ellipse(x,1.6,.1,.07,0,0,Math.PI);g.fill()}
  if(!o.hug)for(const s of [-1,1])rp(g,p=>{p.moveTo(x+s*.22,1.48);p.lineTo(x+s*.29,1.42);p.lineTo(x+s*.3,.9);p.lineTo(x+s*.22,.9);p.closePath()},j,fam(j),[x-.4,.85,.8,.7],.5);
}
function couple(g,x,o){
  man(g,x+.22,{jacket:o.jacket,hat:o.hat||'boater',hug:true,beard:o.beard});
  woman(g,x-.12,{dress:o.dress,stripe:o.stripe,arms:'dance',hat:o.whats});
  // 男の腕が女の背中へ、女の手が男の肩へ
  rp(g,p=>{p.moveTo(x+.05,1.42);p.quadraticCurveTo(x-.2,1.25,x-.3,1.1);p.lineTo(x-.22,1.04);p.quadraticCurveTo(x-.1,1.2,x+.12,1.32);p.closePath()},o.jacket||'#1e2a4a',fam(o.jacket||'#1e2a4a'),[x-.4,1,.6,.5],.5);
  rp(g,p=>{p.moveTo(x-.05,1.4);p.quadraticCurveTo(x+.18,1.5,x+.34,1.46);p.lineTo(x+.34,1.4);p.quadraticCurveTo(x+.15,1.42,x-.02,1.32);p.closePath()},o.dress,fam(o.dress),[x-.1,1.3,.5,.3],.4);
}
function seatedGirl(g,x,o){
  const d=o.dress;
  rp(g,p=>{p.moveTo(x-.2,.5);p.lineTo(x+.45,.5);p.lineTo(x+.55,0);p.lineTo(x-.25,0);p.closePath()},d,fam(d),[x-.4,0,1,.6]);
  if(o.stripe){g.save();g.beginPath();g.rect(x-.25,0,.8,1.1);g.clip();g.fillStyle=o.stripe;for(let s=-.3;s<.6;s+=.09)g.fillRect(x+s,0,.03,1.05);g.restore()}
  rp(g,p=>{p.moveTo(x-.18,.45);p.lineTo(x+.18,.45);p.lineTo(x+.2,1.0);p.lineTo(x-.2,1.0);p.closePath()},d,fam(d),[x-.3,.4,.6,.7]);
  if(o.stripe){g.save();g.beginPath();g.rect(x-.2,.45,.4,.55);g.clip();g.fillStyle=o.stripe;for(let s=-.2;s<.2;s+=.08)g.fillRect(x+s,.45,.025,.55);g.restore()}
  rp(g,p=>p.rect(x-.045,.98,.09,.1),'#f0c8a8',['#f8d8b8'],[x-.1,.9,.2,.2],.2);
  face(g,x,1.2,{hair:'#7a4a28',bun:true});
}
function crowd(g,w,h,n){
  for(let i=0;i<n;i++){
    const x=.3+R()*(w-.6),f=R(),col=f<.45?pick(NAVY):pick(['#e8a0a8','#f4e8d8','#a8c0e0','#e0c080','#c86a6a','#8ab0c8']);
    if(f<.45)man(g,x,{jacket:col,hat:pick(['boater','bowler','boater'])});else woman(g,x,{dress:col,hat:R()<.5?'bonnet':undefined});
  }
}
BOOK.add({
no:2,name:'ムーラン・ド・ラ・ギャレットの舞踏会',seed:18760607,
desc:{
  orig:'Bal du moulin de la Galette',
  artist:'ピエール＝オーギュスト・ルノワール　1876年',
  medium:'油彩・カンヴァス　131 × 175 cm　オルセー美術館（パリ）',
  paras:[
    'パリの北、モンマルトルの丘。風車のそばの「ムーラン・ド・ラ・ギャレット」は、日曜の午後になると、近くに住む若者や職人たちが集まって踊る、野外のダンスホールだった。',
    'ルノワールは近くにアトリエを借り、大きなカンヴァスを友人たちと毎日ここへ運んで描いたという。モデルになったのは、画家の友人たちや、この界隈の娘たちだ。',
    '木の葉のすき間からこぼれる光が、服や顔や地面にまだらに落ちる。輪郭をくっきり描かず、光と色のかたまりで、にぎわいと空気そのものを描いた。1877年の第3回印象派展に出品された。',
  ],
  points:['木漏れ日が、服と地面にまだらに落ちる','頭上に並ぶ、白い丸いガス灯','手前のテーブルで語らう友人たち'],
  foot:'―　右のページで、日曜日のダンスホールが立ち上がります　―',
},
plate:'ピエール＝オーギュスト・ルノワール《ムーラン・ド・ラ・ギャレットの舞踏会》1876年<br>テーブルのそばから、踊る人びとを見た構図',
ground(g,W,H,{X,Z,S}){
  groundClip(g,X,Z,1.2,()=>{
    g.fillStyle='#9e8f86';g.fillRect(0,0,W,H);
    brush(g,0,0,W,H,EARTH,9000,40,10,0,{jit:6,alpha:.7});
    // 木漏れ日と葉の影
    for(let i=0;i<900;i++){g.fillStyle=R()<.5?'rgba(255,240,200,.45)':'rgba(70,80,160,.35)';g.beginPath();g.ellipse(R()*W,R()*H,(.3+R()*.8)*S,(.2+R()*.5)*S,R()*3,0,7);g.fill()}
  });
  groundTitle(g,W,H,'ムーラン・ド・ラ・ギャレットの舞踏会　―　ピエール＝オーギュスト・ルノワール　1876年　パリ、モンマルトル','Bal du moulin de la Galette');
},
build(B){
const root=B.root;
// ================= 背景板: 木立と人だかり =================
backdrop(B,{title:'ムーラン・ド・ラ・ギャレット',titleSize:118,orig:'Bal du moulin de la Galette',dot:'#e8a0a8',emi:.45,
  draw:(g,W,H)=>{
    const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#6a9a7a');gr.addColorStop(.6,'#8ab0a0');gr.addColorStop(1,'#c8b8b0');g.fillStyle=gr;g.fillRect(0,0,W,H);
    brush(g,0,0,W,H*.8,LEAF,9000,40,14,0,{jit:6,alpha:.75});
    for(let i=0;i<700;i++){g.fillStyle=R()<.6?'rgba(255,248,220,.55)':'rgba(50,80,120,.35)';g.beginPath();g.ellipse(R()*W,R()*H*.85,10+R()*30,8+R()*20,R()*3,0,7);g.fill()}
    // 細い幹
    for(const x of [140,420,760,1150,1500,1880]){g.fillStyle='#5a5a6a';g.fillRect(x,0,14,H);brush(g,x,0,14,H,['#4a4a5a','#7a7080'],80,30,4,Math.PI/2)}
    // 遠くの人だかり
    g.save();g.translate(0,H);g.scale(105,-105);crowd(g,W/105,3,60);g.restore();
    // 奥の灯り
    for(let i=0;i<14;i++){const x=80+i*145,y=300+Math.sin(i)*60;g.fillStyle='rgba(255,252,236,.95)';g.beginPath();g.arc(x,y,17,0,7);g.fill()}
  }});
// ================= 木 =================
for(const [x,z,h] of [[-12.8,-12,19],[-8,-17,20],[3,-19,21],[10,-15,19],[12.8,-6,18],[-12.8,2,18]]){
  const pg=B.pop(root,[x,0,z],fdir(z,h),1.5,1.1,4);
  const t=tex(1,h,(g,w,hh)=>rp(g,p=>p.rect(.3,0,.4,hh),'#5a5a6a',['#4a4a5a','#7a7a8a','#3a3a4a','#8a8070'],[0,0,w,hh],.3),{ppu:50});
  for(let k=0;k<2;k++){const m=plane(1,h,mat(t,.5,true),t);m.position.y=h/2;m.rotation.y=k*Math.PI/2;pg.add(m)}
  const cw=9,ch=6,bl=[...Array(10)].map(()=>[cw/2+(R()-.5)*cw*.75,ch/2+(R()-.5)*ch*.6,1.2+R()*1.3]);
  const cr=new THREE.Group();cr.position.y=h-ch;pg.add(cr);
  crossCard(cr,cw,ch,g=>rp(g,p=>{for(const [bx,by,r] of bl){p.moveTo(bx+r,by);p.arc(bx,by,r,0,7)}},'#4a7a5a',LEAF,[0,0,cw,ch],1.4),2,.38,{ppu:70});
}
// ================= ガス灯(白い丸い灯りの房) =================
const GLOBE=new THREE.MeshLambertMaterial({color:0xfffaf0,emissive:0xd8d4c8});
const POST=lam(0x2a3a3a,.3);
for(const [x,z] of [[-6,-9],[7,-4],[-12,-2],[1.5,-14]]){
  const h=10.5,pg=B.pop(root,[x,0,z],fdir(z,h),1.85,1,3);
  const post=new THREE.Mesh(new THREE.CylinderGeometry(.1,.14,h,8),POST);post.position.y=h/2;pg.add(shadowy(post));
  const arm=box(3.2,.1,.1,POST);arm.position.y=h-.6;pg.add(arm);
  for(const [gx,gy] of [[-1.5,h-.95],[-.75,h-.25],[0,h+.3],[.75,h-.25],[1.5,h-.95]]){
    const s=new THREE.Mesh(new THREE.SphereGeometry(.36,16,10),GLOBE);s.position.set(gx,gy,0);pg.add(s);
    if(gy<h-.5){const r=box(.04,.5,.04,POST);r.position.set(gx,gy+.45,0);pg.add(r)}
  }
}
// ================= 人物 =================
const SC=1.9;
let dl=2.4;
function card(x,z,w,h,draw,{sc=SC,ry=0}={}){
  const pg=B.pop(root,[x,0,z],fdir(z,h*sc),dl,.8,1+(R()*2|0));dl+=.04;
  const t=tex(w,h,draw,{ppu:150});const m=plane(w,h,mat(t,.4,true),t);m.scale.setScalar(sc);m.position.y=h*sc/2;m.rotation.y=ry;pg.add(m);return pg;
}
// 奥の人だかり
for(const [x,z] of [[-10,-21],[-2,-23],[7,-22],[13,-19],[-14,-17],[-6,-18],[2,-19.5],[10,-13],[-15,-11],[-1,-16]])card(x,z,5,2,g=>crowd(g,5,2,7),{sc:1.6,ry:(R()-.5)*.3});
// 踊る男女
card(-7.5,1.5,1.3,1.95,g=>couple(g,.6,{dress:'#f0b0b8',jacket:'#1e2a4a',hat:'boater'}),{sc:2.1,ry:.15});
card(1.5,-3,1.3,1.95,g=>couple(g,.6,{dress:'#e8e0f0',jacket:'#2a3a6a',hat:'bowler',beard:'#3a2418'}),{ry:-.2});
card(-12.5,-7,1.3,1.95,g=>couple(g,.6,{dress:'#d8604a',jacket:'#1a2440'}),{ry:.3});
card(8.5,-9,1.3,1.95,g=>couple(g,.6,{dress:'#a8c0e8',jacket:'#2a2a3a',hat:'bowler'}),{ry:-.3});
card(-3.5,-11,1.3,1.95,g=>couple(g,.6,{dress:'#f4e8d0',jacket:'#33467a',whats:'bonnet'}),{ry:.1});
card(12.5,-1,1.3,1.95,g=>couple(g,.6,{dress:'#e890a0',jacket:'#1e2a4a'}),{ry:-.4});
card(-9,-15,1.3,1.95,g=>couple(g,.6,{dress:'#f8d0c8',jacket:'#2a3a6a'}),{sc:1.7});
card(5,-16,1.3,1.95,g=>couple(g,.6,{dress:'#c8d8a0',jacket:'#1e2a4a',hat:'bowler'}),{sc:1.7});
// 立ち話の人たち
card(-14,8,2.4,1.95,g=>{man(g,.6,{jacket:'#2a3a6a',hat:'bowler'});woman(g,1.6,{dress:'#e0c080',hat:'bonnet',hc:'#c84a3a'})},{ry:.4});
card(13.5,7,1.4,1.95,g=>man(g,.7,{jacket:'#1e2a4a',hat:'boater'}),{ry:-.5});
// ================= 手前: ベンチの娘たち =================
const WOOD=lam(0x3a5a4a,.3),TBL=lam(0x6a5a40,.3),GLS=new THREE.MeshLambertMaterial({color:0xe8f0f0,emissive:0x506060,transparent:true,opacity:.55});
{
  const pg=B.pop(root,[-3.5,0,13],[0,-1],2.95,.8,1);
  const seat=box(5,.12,1,WOOD);seat.position.y=.95;pg.add(seat);
  for(const sx of [-2.2,2.2])for(const sz of [-.4,.4]){const l=box(.12,.95,.12,WOOD);l.position.set(sx,.47,sz);pg.add(l)}
  const back=box(5,.9,.08,WOOD);back.position.set(0,1.9,-.5);pg.add(back);
  // 縞のドレスの娘(エステル)と、肩ごしにのぞき込む娘
  const t=tex(1.2,1.4,g=>seatedGirl(g,.5,{dress:'#e8a8b8',stripe:'rgba(70,90,170,.75)'}),{ppu:150});
  const m=plane(1.2,1.4,mat(t,.42,true),t);m.scale.setScalar(SC);m.position.set(-.4,.95+1.4*SC/2,0);m.rotation.y=.25;pg.add(m);
  const t2=tex(1.2,1.95,g=>woman(g,.6,{dress:'#2a3a6a',top:'#e8b0b8',hat:'bonnet',hc:'#1a1a2a'}),{ppu:150});
  const m2=plane(1.2,1.95,mat(t2,.42,true),t2);m2.scale.setScalar(SC);m2.position.set(.9,1.95*SC/2,-.85);m2.rotation.y=-.2;pg.add(m2);
}
card(-8,15.5,1.2,1.95,g=>man(g,.6,{jacket:'#1e2a4a',hat:'boater'}),{ry:.6});
// ================= 手前右: 友人たちのテーブル =================
{
  const pg=B.pop(root,[6.5,0,12],[0,-1],3.05,.8,1);
  const top=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,.1,28),TBL);top.position.y=2.2;pg.add(shadowy(top));
  const leg=new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,2.2,8),POST);leg.position.y=1.1;pg.add(leg);
  for(const [x,z] of [[-.6,.3],[.4,.6],[.2,-.5],[.9,0]]){const gl=new THREE.Mesh(new THREE.CylinderGeometry(.13,.09,.42,12),GLS);gl.position.set(x,2.46,z);pg.add(gl)}
  const bt=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,.8,12),lam(0x2a4a3a,.3));bt.position.set(-.2,2.65,-.2);pg.add(bt);
}
card(8.8,14,1.6,1.95,g=>{
  // 椅子に後ろ向きに座る男(麦わら帽)
  rp(g,p=>{p.rect(.25,0,.08,.9);p.rect(1.05,0,.08,.9);p.rect(.2,.85,1,.1);p.rect(.25,.9,.08,.7);p.rect(1.05,.9,.08,.7);p.rect(.25,1.4,.9,.1)},'#3a5a4a',['#4a6a5a','#2a4a3a'],[0,0,1.4,1.6],.3);
  man(g,.7,{jacket:'#33467a',hat:'boater'});
},{ry:-.35,sc:2});
card(4,14.8,1.2,1.95,g=>man(g,.6,{jacket:'#1e2a4a',hat:'boater',beard:'#4a2a18'}),{ry:.3,sc:2});
card(6.8,9.5,1.4,1.95,g=>woman(g,.7,{dress:'#2a3a6a',top:'#e8a0a8',hat:'bonnet',hc:'#3a2a3a'}),{ry:0,sc:2});
// 木漏れ日のかわりの灯り(やわらかな昼の光)
const sun=B.light(new THREE.PointLight(0xfff4dc,0,70,1));
const at=new THREE.Object3D();at.position.set(-6,22,14);root.add(at);
let k=0;B.extra(2.5,1,e=>k=clamp(e,0,1));
const tmp=new THREE.Vector3();
return {tick(){at.getWorldPosition(tmp);sun.position.copy(tmp);sun.intensity=0*k}};
},
caps:{
  A:'第2話「ムーラン・ド・ラ・ギャレットの舞踏会」　ピエール＝オーギュスト・ルノワール　1876年',
  B:'モンマルトルの丘の上のダンスホール。日曜の午後、近所の若者たちが集まって踊った。',
  C:'手前のテーブルには画家の友人たち。グラスを前に、おしゃべりが続く。',
  D:'木の葉のすき間からこぼれた光が、服や地面に明るいまだらを落としている。',
  E:'踊る人びとの頭上に、白く丸いガス灯の房。夜になると、ここに灯りがともった。',
  F:'この絵は画家仲間のカイユボットが買い、彼の遺言で国のものになった。いまはオルセー美術館にある。',
},
tour:[
  {t0:0,t1:6,f:u=>{const k=easeIO(u);return [V(0,40-6*k,46-6*k),V(0,3,-4)]},cap:'A'},
  {t0:6,t1:14.5,f:u=>{const a=.95-1.9*easeIO(u);return [V(Math.sin(a)*42,19-5*u,Math.cos(a)*42-4),V(0,4,-5)]},cap:'B'},
  {t0:14.5,t1:21.5,f:u=>{const k=easeIO(u);return [V(13-3*k,4.4,22-3*k),V(6.5,2.8,12.5)]},cap:'C'},
  {t0:21.5,t1:28.5,f:u=>[V(1,5.8,27-1*u),V(-1,4.2,-12)],cap:'D',frame:true,fov:23},
  {t0:28.5,t1:35.5,f:u=>{const k=easeIO(u);return [V(-1-3*k,3+2*k,6-4*k),V(-5+2*k,9.5,-9+3*k)]},cap:'E'},
  {t0:35.5,t1:42,f:u=>{const k=easeIO(u);return [V(-4+4*k,5+30*k,2+40*k),V(-3+3*k,6-3*k,-6+2*k)]},cap:'F'},
],
tourEnd:42,tourLoop:6,
});
}
