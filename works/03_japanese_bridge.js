'use strict';
// 見開き3: クロード・モネ《睡蓮の池と日本の橋》1899年
// ページいっぱいの池。奥寄りに緑の太鼓橋を左右いっぱいに架け、その後ろに茂み・柳・竹を何重にも立てる。
// 睡蓮の葉は水面に帯のように並べ、花だけが少し起き上がる。
// 畳み方: 橋と茂みは奥へ、岸の草は池の内側へ倒し、最後に木立の背景板を手前へ倒す(裏に題名)。
{
const GR=['#3f6a3a','#5a8a4a','#2e5a3a','#7aa05a','#8ab86a','#4a7a6a','#a8c070','#2a4a3a','#c8c870'];
const WAT=['#2f5a52','#3f6a5a','#4a7a6a','#5a8a6a','#2a4a4a','#6a9a7a','#8aa8a0','#a8c0b8','#3a5a6a'];
const PAD=['#4a7a3a','#6a9a4a','#3a6a3a','#8aa85a','#5a8a5a','#a8b860'];
const ZB=-8,L=15.5,HB=4.6;          // 橋の中心 z、半分の長さ、高さ
const archY=x=>HB*(1-Math.pow(x/L,2));
// モネ風: 短い筆触を重ねる
function mp(g,path,base,cols,box,n=110,ang=0,len=.35,wid=.14){
  g.save();g.beginPath();path(g);g.lineJoin='round';g.strokeStyle=PAPER;g.lineWidth=.07;g.stroke();
  g.fillStyle=base;g.fill();g.clip();const [x,y,w,h]=box;brush(g,x,y,w,h,cols,w*h*n,len,wid,ang,{jit:.9,alpha:.85});g.restore();
}
BOOK.add({
no:3,name:'睡蓮の池と日本の橋',seed:18990731,
desc:{
  orig:'Le Bassin aux nymphéas',
  artist:'クロード・モネ　1899年',
  medium:'油彩・カンヴァス　88.3 × 93.1 cm　ナショナル・ギャラリー（ロンドン）ほか',
  paras:[
    'パリの北西の村ジヴェルニー。モネは自宅の庭のそばに土地を買い、小川の水を引いて池をつくった。池には睡蓮を浮かべ、まわりに柳や竹を植え、日本風の太鼓橋を架けた。',
    '浮世絵を集めていたモネは、歌川広重らが描いた橋に心ひかれていたといわれる。ただし日本の橋によくある朱色ではなく、緑色に塗った。',
    '1899年、この橋を正面から見た絵を十点あまり続けて描いた。水面には睡蓮の葉が帯のように浮かび、まわりの緑が映り込んで、画面全体が緑の響きに満たされている。',
  ],
  points:['緑に塗った、日本風の太鼓橋','水面に帯のように浮かぶ睡蓮','柳と竹の緑が、水に映り込む'],
  foot:'―　右のページで、モネの池が立ち上がります　―',
},
plate:'クロード・モネ《睡蓮の池と日本の橋》1899年<br>池のほとりから、橋を正面に見た構図',
ground(g,W,H,{X,Z,S}){
  groundClip(g,X,Z,1.2,()=>{
    g.fillStyle='#355e52';g.fillRect(0,0,W,H);
    // 水面: 映り込みは縦の筆触、光は横の筆触
    brush(g,0,0,W,H,WAT,14000,60,12,Math.PI/2,{jit:.25,alpha:.75});
    brush(g,0,Z(-6),W,Z(28)-Z(-6),['#a8c0b8','#c8d8c8','#8aa8a0'],1800,40,5,0,{jit:.2,alpha:.5});
    // 橋の映り込み(手前側に逆さの弧)
    g.strokeStyle='rgba(30,60,40,.55)';g.lineWidth=.35*S;
    for(const k of [0,1.2]){g.beginPath();for(let x=-L;x<=L;x+=.5){const zz=ZB+2+(HB-archY(x))*.0+archY(x)*.9+k;x===-L?g.moveTo(X(x),Z(zz)):g.lineTo(X(x),Z(zz))}g.stroke()}
    // 奥と左右の岸
    g.fillStyle='#4a6a3a';g.fillRect(0,0,W,Z(-17));brush(g,0,0,W,Z(-17),GR,3000,30,9,0,{jit:3});
    for(const s of [0,1]){const x0=s?X(15.2):0,x1=s?W:X(-15.2);g.fillStyle='#4a6a3a';g.fillRect(x0,0,x1-x0,H);brush(g,x0,0,x1-x0,H,GR,1500,30,8,Math.PI/2,{jit:2})}
    // 水面に描いた睡蓮の葉(立体の葉の下地)
    for(let i=0;i<500;i++){const z=-6+R()*33,x=-14+R()*28;g.fillStyle=pick(PAD);g.beginPath();g.ellipse(X(x),Z(z),(.4+R()*.5)*S,(.25+R()*.25)*S,0,0,7);g.fill()}
  });
  groundTitle(g,W,H,'睡蓮の池と日本の橋　―　クロード・モネ　1899年　ジヴェルニー','Le Bassin aux nymphéas');
},
build(B){
const root=B.root;
// ================= 背景板: 柳と竹の茂み =================
backdrop(B,{title:'睡蓮の池と日本の橋',titleSize:140,orig:'Le Bassin aux nymphéas',dot:'#e8a0b8',emi:.55,
  draw:(g,W,H)=>{
    g.fillStyle='#4a7a4a';g.fillRect(0,0,W,H);
    brush(g,0,0,W,H,GR,16000,46,13,Math.PI/2,{jit:.6,alpha:.85});
    // 竹(右)と柳(左)
    for(let i=0;i<40;i++){const x=W*.62+R()*W*.38;g.strokeStyle=pick(['#6a8a3a','#8aa04a','#4a6a2a']);g.lineWidth=8;g.beginPath();g.moveTo(x,H);g.lineTo(x+(R()-.5)*60,0);g.stroke()}
    for(let i=0;i<500;i++){const x=R()*W*.5,y=R()*H*.4;g.strokeStyle=pick(['#9ab85a','#c8c870','#7a9a4a','#b8c860']);g.lineWidth=5;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+20,y+200,x+10,y+350+R()*300);g.stroke()}
    // 空の切れ端
    for(let i=0;i<120;i++){g.fillStyle=pick(['rgba(220,230,220,.6)','rgba(200,220,230,.5)']);g.beginPath();g.ellipse(R()*W,R()*H*.35,12+R()*20,6+R()*10,0,0,7);g.fill()}
  }});
// ================= 奥の茂み(何重にも) =================
function bushRow(z,h,base,dl,layer,seedTop){
  const w=33,pg=B.pop(root,[0,0,z],fdir(z,h),dl,1.1,layer);
  const tops=[...Array(14)].map((_,i)=>[i*w/13,h*(.6+R()*.4)]);
  const t=tex(w,h,g=>mp(g,p=>{p.moveTo(0,0);p.lineTo(0,tops[0][1]);for(let i=1;i<tops.length;i++){const [x,y]=tops[i],[px,py]=tops[i-1];p.quadraticCurveTo((x+px)/2,Math.max(y,py)+1.2,x,y)}p.lineTo(w,0);p.closePath()},base,GR,[0,0,w,h],60,Math.PI/2,.5,.18),{ppu:60});
  const m=plane(w,h,mat(t,.5,true),t);m.position.y=h/2;pg.add(m);
}
bushRow(-22,13,'#3f6a3a',1.45,5);
bushRow(-17,9,'#5a8a4a',1.6,4);
// 柳(垂れる枝)
function willow(x,z,w,h,dl){
  const pg=B.pop(root,[x,0,z],fdir(z,h),dl,1.1,4);
  const t=tex(w,h,g=>{
    mp(g,p=>{p.rect(w/2-.25,0,.5,h*.7)},'#4a4a3a',['#3a3a2a','#5a5a4a'],[0,0,w,h],40,Math.PI/2);
    g.save();g.lineCap='round';
    for(let i=0;i<260;i++){const x0=w*.15+R()*w*.7,y0=h*(.65+R()*.35),len=h*(.35+R()*.45);
      g.strokeStyle=PAPER;g.lineWidth=.22;g.beginPath();g.moveTo(x0,y0);g.quadraticCurveTo(x0+(R()-.5)*1.5,y0-len*.5,x0+(R()-.5)*2,y0-len);g.stroke();
      g.strokeStyle=pick(['#8ab05a','#a8c060','#6a9a4a','#c8c870','#5a8a4a']);g.lineWidth=.14;g.stroke()}
    g.restore();
  },{ppu:70});
  for(let k=0;k<2;k++){const m=plane(w,h,mat(t,.5,true),t);m.position.y=h/2;m.rotation.y=k*Math.PI/2.4;pg.add(m)}
}
willow(-11,-13,9,15,1.55);
willow(11.5,-19,8,14,1.5);
// 竹の群れ(右)
{
  const pg=B.pop(root,[12.5,0,-12.5],fdir(-12.5,13),1.65,1,4);
  const t=tex(5,13,g=>{for(let i=0;i<9;i++){const x=.3+R()*4.4;mp(g,p=>p.rect(x,0,.14,12.5),'#6a8a3a',['#8aa04a','#4a6a2a'],[x-.1,0,.4,13],20,Math.PI/2);
    for(let y=1.5;y<12.5;y+=1.6+R()){g.save();g.translate(x,y);g.rotate((R()-.5)*1.5);mp(g,p=>p.ellipse(.6,0,.7,.12,0,0,7),'#7a9a4a',['#9ab85a','#5a7a3a'],[-.2,-.2,1.6,.4],30,0);g.restore()}}},{ppu:70});
  for(let k=0;k<2;k++){const m=plane(5,13,mat(t,.5,true),t);m.position.y=6.5;m.rotation.y=k*Math.PI/2;pg.add(m)}
}
// ================= 太鼓橋 =================
{
  const BG=lam(0x5f8f4a,.35),BGL=lam(0x8ab868,.35),pg=B.pop(root,[0,0,ZB],[0,-1],1.95,1.2,3);
  const N=40,DW=2.8,pos=[],idx=[];
  for(let i=0;i<=N;i++){const x=-L+2*L*i/N,y=archY(x);pos.push(x,y,-DW/2,x,y,DW/2)}
  for(let i=0;i<N;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}
  const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));dg.setIndex(idx);dg.computeVertexNormals();
  const deckM=lam(0x6a8a50,.35);deckM.side=THREE.DoubleSide;pg.add(shadowy(new THREE.Mesh(dg,deckM)));
  // 橋桁の側板
  for(const s of [-1,1]){
    const sp=[],si=[];for(let i=0;i<=N;i++){const x=-L+2*L*i/N,y=archY(x);sp.push(x,y,s*DW/2,x,y-.5,s*DW/2)}
    for(let i=0;i<N;i++){const a=i*2;si.push(a,a+1,a+2,a+1,a+3,a+2)}
    const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));sg.setIndex(si);sg.computeVertexNormals();
    const sm=lam(0x4a7a3a,.35);sm.side=THREE.DoubleSide;pg.add(shadowy(new THREE.Mesh(sg,sm)));
    // 手すり: 柱と二本の横木(上の横木は橋の弧より少し強く反る)
    const top=[],mid=[];
    for(let i=0;i<=N;i++){const x=-L+2*L*i/N;top.push(V(x,archY(x)+2.1+.5*(1-Math.pow(x/L,2)),s*(DW/2+.05)));mid.push(V(x,archY(x)+1.05,s*(DW/2+.05)))}
    for(const [pts,r,m] of [[top,.13,BGL],[mid,.08,BG]])pg.add(shadowy(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),60,r,6),m)));
    for(let x=-L+.4;x<=L;x+=2.2){const y=archY(x),h=2.1+.5*(1-Math.pow(x/L,2));const p=box(.16,h,.16,BG);p.position.set(x,y+h/2,s*(DW/2+.05));pg.add(p)}
  }
  // 橋脚
  for(const x of [-9,-4,4,9])for(const s of [-1,1]){const y=archY(x),p=box(.22,y,.22,BG);p.position.set(x,y/2,s*1.1);pg.add(p)}
}
// ================= 岸の草とアイリス =================
for(const s of [-1,1])for(const z of [-4,6,16]){
  const pg=B.pop(root,[s*15.4,0,z],[-s,0],2.4,.9,2);
  const t=tex(10,3.4,g=>{for(let i=0;i<70;i++){const x=R()*10,h=1.5+R()*1.8;mp(g,p=>{p.moveTo(x,0);p.lineTo(x+.12,0);p.quadraticCurveTo(x+.3,h*.6,x+.5*(R()-.3),h);p.closePath()},pick(['#5a8a4a','#7aa05a','#3f6a3a']),GR,[x-.5,0,1.2,h+.2],30,Math.PI/2)}
    for(let i=0;i<10;i++){const x=.5+R()*9,y=2+R()*1.2;mp(g,p=>{p.ellipse(x,y,.22,.14,0,0,7);p.ellipse(x,y-.18,.1,.2,0,0,7)},pick(['#7a6ab8','#9a8ad0','#e8e0f0']),['#b8a8e0','#6a5aa8'],[x-.3,y-.4,.6,.6],40)}},{ppu:80});
  const m=plane(10,3.4,mat(t,.55,true),t);m.position.y=1.7;m.rotation.y=Math.PI/2;pg.add(m);
}
// ================= 睡蓮の葉と花 =================
const padT=tex(2,2,g=>{g.translate(1,1);mp(g,p=>{p.moveTo(0,0);p.arc(0,0,.95,.25,Math.PI*2-.25);p.closePath()},'#5a8a4a',PAD,[-1,-1,2,2],90,0,.3,.1);
  g.strokeStyle='rgba(40,70,40,.6)';g.lineWidth=.03;for(let a=.5;a<6;a+=.6){g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*.9,Math.sin(a)*.9);g.stroke()}},{ppu:64});
const padM=mat(padT,.45,true);
const petal=[new THREE.MeshLambertMaterial({color:0xf8f0f0,emissive:0x887878}),new THREE.MeshLambertMaterial({color:0xf0b0c8,emissive:0x885868}),new THREE.MeshLambertMaterial({color:0xfff4d8,emissive:0x888070})];
let dl=2.6;
for(const [z,n] of [[-4.5,7],[-1,9],[3,8],[7.5,10],[12,8],[16.5,10],[21,9],[25,7]]){
  const pg=B.pop(root,[0,0,z],[0,1],dl,.7,1);dl+=.06;
  for(let i=0;i<n;i++){
    const x=-14+28*(i+R()*.6)/n,r=.6+R()*.7,pad=new THREE.Mesh(new THREE.PlaneGeometry(2*r,2*r),padM);
    pad.rotation.x=-Math.PI/2;pad.rotation.z=R()*6;pad.position.set(x,.06,(R()-.5)*1.8);pad.receiveShadow=true;pg.add(pad);
    if(R()<.45){const f=new THREE.Group();f.position.set(x+(R()-.5)*.5,.1,pad.position.z+(R()-.5)*.4);pg.add(f);
      const pm=pick(petal);
      for(let k=0;k<8;k++){const pe=new THREE.Mesh(new THREE.ConeGeometry(.12,.55,4),pm);const a=k/8*Math.PI*2;pe.position.set(Math.cos(a)*.14,.2,Math.sin(a)*.14);pe.rotation.set(Math.sin(a)*.5,0,-Math.cos(a)*.5);f.add(pe)}
      const c=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),new THREE.MeshLambertMaterial({color:0xf0d040,emissive:0x806010}));c.position.y=.2;f.add(c)}
  }
}
const sun=B.light(new THREE.PointLight(0xf4fff0,0,70,1));
const at=new THREE.Object3D();at.position.set(4,20,16);root.add(at);
let k=0;B.extra(2.5,1,e=>k=clamp(e,0,1));
const tmp=new THREE.Vector3();
return {tick(){at.getWorldPosition(tmp);sun.position.copy(tmp);sun.intensity=.5*k}};
},
caps:{
  A:'第3話「睡蓮の池と日本の橋」　クロード・モネ　1899年',
  B:'ジヴェルニーのモネの庭。小川の水を引いてつくった池に、睡蓮が浮かぶ。',
  C:'池に架かる緑の太鼓橋。浮世絵の橋に心ひかれたモネが、自分の庭に架けた。',
  D:'画面の上のほうに橋、下は一面の水面。睡蓮の葉が、奥へ向かって帯のように重なる。',
  E:'白や桃色の睡蓮の花。モネは晩年まで三十年近く、この池を描きつづけた。',
  F:'モネの家と庭はいまも残っていて、春から秋まで、だれでも訪れることができる。',
},
tour:[
  {t0:0,t1:6,f:u=>{const k=easeIO(u);return [V(0,40-6*k,46-6*k),V(0,2,-4)]},cap:'A'},
  {t0:6,t1:14.5,f:u=>{const a=-.95+1.9*easeIO(u);return [V(Math.sin(a)*42,18-5*u,Math.cos(a)*42-4),V(0,3,-6)]},cap:'B'},
  {t0:14.5,t1:21.5,f:u=>{const k=easeIO(u);return [V(-14+20*k,3+2*k,4-2*k),V(-4+8*k,4,ZB)]},cap:'C'},
  {t0:21.5,t1:28.5,f:u=>[V(0,8.5,26-1*u),V(0,3.4,-12)],cap:'D',frame:true,fov:25},
  {t0:28.5,t1:35.5,f:u=>{const k=easeIO(u);return [V(3-4*k,2.2,17-3*k),V(0,.2,8-3*k)]},cap:'E'},
  {t0:35.5,t1:42,f:u=>{const k=easeIO(u);return [V(-1+1*k,2.2+34*k,14+30*k),V(0,.2+1.8*k,5-9*k)]},cap:'F'},
],
tourEnd:42,tourLoop:6,
});
}
