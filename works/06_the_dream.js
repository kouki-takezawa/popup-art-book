'use strict';
// 見開き6: アンリ・ルソー《夢》1910年
// 左手前に赤いソファと横たわる女性。奥へ向かって大きな葉の切り絵を何列も立て、そのすき間にライオン・笛吹き・蛇・象・鳥を隠す。
// 畳み方: 葉の列と動物は倒してもはみ出さない側へ、最後に月夜の背景板を手前へ倒す(裏に題名)。
{
const GREENS=['#1e4a2a','#2f6a32','#4a8a3a','#6aa04a','#8ab85a','#2a5a4a','#3a7a5a','#a8c870','#1a3a2a','#5a9a6a','#c0d080'];
const leafCol=()=>pick(GREENS);
const lighten=(c,k)=>'#'+new THREE.Color(c).lerp(new THREE.Color('#e8f0c0'),k).getHexString();
// ルソー風: くっきりした平らな面に、明るい葉脈
function leaf(g,x,y,len,wid,ang,col,o={}){
  g.save();g.translate(x,y);g.rotate(ang);
  const sh=p=>{p.moveTo(0,0);p.quadraticCurveTo(len*.35,wid,len,0);p.quadraticCurveTo(len*.35,-wid,0,0);p.closePath()};
  g.beginPath();sh(g);g.strokeStyle=PAPER;g.lineWidth=.06;g.stroke();g.fillStyle=col;g.fill();
  g.save();g.clip();g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,-wid,len,wid);g.restore();
  g.strokeStyle=lighten(col,.45);g.lineWidth=Math.max(.02,wid*.06);g.beginPath();g.moveTo(0,0);g.lineTo(len*.95,0);g.stroke();
  if(o.veins!==false){g.lineWidth=Math.max(.012,wid*.03);for(let t=.15;t<.9;t+=.11){const w=wid*Math.sin(t*Math.PI)*.8;for(const s of [-1,1]){g.beginPath();g.moveTo(len*t,0);g.lineTo(len*(t+.1),s*w);g.stroke()}}}
  g.restore();
}
function spikes(g,x,n,h,col){for(let i=0;i<n;i++){const a=Math.PI/2+(i/(n-1)-.5)*1.4;leaf(g,x,0,h*(.7+R()*.4),h*.05,a,col,{veins:false})}}
function fan(g,x,y,r,col){for(let i=0;i<14;i++){const a=Math.PI*(.1+.8*i/13);leaf(g,x,y,r*(.8+R()*.3),r*.08,a,col,{veins:false})}}
function lotus(g,x,y,s,col){
  g.save();g.translate(x,y);g.scale(s,s);
  g.strokeStyle='#2a5a3a';g.lineWidth=.08;g.beginPath();g.moveTo(0,0);g.lineTo(0,-3);g.stroke();
  for(const [a,l] of [[-.9,1],[-.45,1.15],[0,1.25],[.45,1.15],[.9,1]]){g.save();g.rotate(a);g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(.32,l*.6,0,l);g.quadraticCurveTo(-.32,l*.6,0,0);g.strokeStyle=PAPER;g.lineWidth=.05;g.stroke();g.fillStyle=col;g.fill();
    g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=.025;g.beginPath();g.moveTo(0,.1);g.lineTo(0,l*.85);g.stroke();g.restore()}
  g.restore();
}
// 植物のかたまり一枚(下端 y=0)
function plantCard(g,w,h,kind){
  if(kind==='broad'){for(let i=0;i<9;i++){const x=w*(.15+R()*.7),c=leafCol(),ang=Math.PI/2+(R()-.5)*1.8;g.strokeStyle='#2a4a2a';g.lineWidth=.06;g.beginPath();g.moveTo(x,0);g.lineTo(x+Math.cos(ang)*h*.3,Math.sin(ang)*h*.3);g.stroke();leaf(g,x+Math.cos(ang)*h*.3,Math.sin(ang)*h*.3,h*(.45+R()*.3),h*(.12+R()*.08),ang+(R()-.5)*.5,c)}}
  else if(kind==='spike'){for(let i=0;i<3;i++)spikes(g,w*(.25+i*.25),9,h*.95,leafCol())}
  else if(kind==='palm'){g.strokeStyle='#4a3a2a';g.lineWidth=.25;g.beginPath();g.moveTo(w/2,0);g.quadraticCurveTo(w/2+.5,h*.4,w/2,h*.62);g.stroke();fan(g,w/2,h*.6,h*.42,leafCol());fan(g,w/2,h*.6,h*.32,leafCol())}
  else if(kind==='lotus'){for(let i=0;i<5;i++)leaf(g,w*(.1+R()*.8),0,h*.5,h*.1,Math.PI/2+(R()-.5)*1.4,leafCol());
    for(let i=0;i<3;i++)lotus(g,w*(.2+i*.3),h*(.55+R()*.3),h*.22,pick(['#e8a0b8','#a8b8e8','#f4f0f0','#c8a0d8','#f0c8d0']))}
  else if(kind==='orange'){g.strokeStyle='#4a3a2a';g.lineWidth=.22;g.beginPath();g.moveTo(w/2,0);g.lineTo(w/2,h*.6);g.stroke();
    for(let i=0;i<40;i++)leaf(g,w/2+(R()-.5)*w*.6,h*(.45+R()*.45),h*.14,h*.04,R()*6.28,leafCol(),{veins:false});
    for(let i=0;i<9;i++){g.fillStyle='#f08a2a';g.beginPath();g.arc(w/2+(R()-.5)*w*.55,h*(.5+R()*.4),h*.03,0,7);g.fill()}}
}
function lion(g){
  cut(g,p=>{p.ellipse(1.6,.9,1.3,.6,0,0,7)},'#c8903a',['#d8a04a','#b07a2a','#e0b060'],120,.25,.05,0,[0,0,3.4,2.4]);
  cut(g,p=>{p.arc(.9,1.35,.75,0,7)},'#8a5a2a',['#a06a30','#6a4020','#b07a3a'],150,.3,.06,(x,y)=>Math.atan2(y-1.35,x-.9),[0,0,2,2.4]);
  cut(g,p=>{p.ellipse(.9,1.3,.42,.46,0,0,7)},'#d8a050',['#e8b060','#c08a3a'],60,.15,.04,0,[.4,.8,1,1]);
  g.fillStyle='#2a1a10';for(const s of [-1,1]){g.beginPath();g.ellipse(.9+s*.17,1.42,.07,.05,0,0,7);g.fill()}
  g.fillStyle='#f0e0a0';for(const s of [-1,1]){g.beginPath();g.arc(.9+s*.17,1.42,.025,0,7);g.fill()}
  g.fillStyle='#4a2a1a';g.beginPath();g.moveTo(.82,1.2);g.lineTo(.98,1.2);g.lineTo(.9,1.1);g.closePath();g.fill();
}
function charmer(g){
  cut(g,p=>{p.moveTo(.5,0);p.lineTo(1.5,0);p.lineTo(1.3,1.6);p.lineTo(.7,1.6);p.closePath()},'#d8a050',null);
  g.save();g.beginPath();g.moveTo(.5,0);g.lineTo(1.5,0);g.lineTo(1.3,1.6);g.lineTo(.7,1.6);g.closePath();g.clip();
  for(let y=.1;y<1.6;y+=.22){g.fillStyle=pick(['#c84a3a','#3a5aa8','#e8d070']);g.fillRect(0,y,2,.1)}g.restore();
  cut(g,p=>{p.moveTo(.7,1.55);p.lineTo(1.3,1.55);p.lineTo(1.25,2.6);p.lineTo(.75,2.6);p.closePath()},'#1a1a22',['#2a2a3a','#0a0a12'],40,.2,.04,Math.PI/2,[.6,1.5,.8,1.2]);
  cut(g,p=>p.arc(1,2.85,.25,0,7),'#1a1a22');
  g.fillStyle='#f0f0d0';for(const s of [-1,1]){g.beginPath();g.arc(1+s*.09,2.88,.035,0,7);g.fill()}
  cut(g,p=>{p.moveTo(1.15,2.7);p.lineTo(2.1,2.45);p.lineTo(2.12,2.5);p.lineTo(1.16,2.76);p.closePath()},'#d8b860');
  cut(g,p=>{p.moveTo(.8,2.4);p.lineTo(1.6,2.55);p.lineTo(1.6,2.45);p.lineTo(.8,2.28);p.closePath()},'#1a1a22');
}
function snake(g){
  g.save();g.lineCap='round';
  const path=p=>{p.moveTo(.3,3.4);p.bezierCurveTo(1.6,3.2,.2,2.2,1.2,1.8);p.bezierCurveTo(2.2,1.4,.6,.8,1.6,.4);p.lineTo(2.4,.3)};
  g.strokeStyle=PAPER;g.lineWidth=.32;g.beginPath();path(g);g.stroke();
  g.strokeStyle='#d88a8a';g.lineWidth=.24;g.beginPath();path(g);g.stroke();
  g.strokeStyle='#a85a6a';g.lineWidth=.08;g.setLineDash([.1,.12]);g.beginPath();path(g);g.stroke();g.restore();
  cut(g,p=>p.ellipse(.3,3.42,.2,.13,0,0,7),'#c87a7a');
}
function elephant(g){
  cut(g,p=>{p.ellipse(1.8,1.6,1.5,1,0,0,7);p.ellipse(.6,1.9,.65,.7,0,0,7);p.rect(.9,0,.5,1);p.rect(2.3,0,.5,1);p.moveTo(.2,1.7);p.quadraticCurveTo(-.1,.8,.25,.2);p.lineTo(.45,.25);p.quadraticCurveTo(.15,.9,.45,1.6);p.closePath()},'#8a8a8a',['#9a9a9a','#7a7a7a','#a8a8a0'],100,.3,.05,0,[0,0,3.4,2.8]);
  cut(g,p=>p.ellipse(.95,2,.45,.6,0,0,7),'#9a9a96');g.fillStyle='#1a1a1a';g.beginPath();g.arc(.55,2.05,.05,0,7);g.fill();
  g.fillStyle='#f4f0e0';g.beginPath();g.moveTo(.35,1.45);g.quadraticCurveTo(.1,1.2,.2,1.0);g.lineTo(.3,1.05);g.closePath();g.fill();
}
function bird(g){
  cut(g,p=>{p.ellipse(.6,.5,.4,.25,-.2,0,7);p.arc(.95,.7,.15,0,7);p.moveTo(.3,.45);p.lineTo(-.4,.1);p.lineTo(-.35,.3);p.closePath()},'#e8803a',['#f0a050','#c8602a'],50,.15,.04,0,[-.5,0,1.7,1]);
  g.fillStyle='#2a2a2a';g.beginPath();g.moveTo(1.08,.72);g.lineTo(1.3,.66);g.lineTo(1.08,.65);g.closePath();g.fill();
}
function woman(g){
  // ソファに横たわり、右手をのばして指さす(髪は長い黒髪)
  const SK='#e8c0a0',SKD=['#f0c8a8','#d8a888','#e8b898'];
  cut(g,p=>{p.moveTo(.4,.2);p.quadraticCurveTo(1.6,.05,3.6,.15);p.quadraticCurveTo(4.1,.25,4.2,.45);p.quadraticCurveTo(3,.55,1.6,.75);p.quadraticCurveTo(.9,1.0,.6,1.6);p.lineTo(.2,1.5);p.quadraticCurveTo(.1,.7,.4,.2);p.closePath()},SK,SKD,120,.3,.04,0,[0,0,4.4,2]);
  cut(g,p=>{p.moveTo(.55,1.5);p.quadraticCurveTo(1.2,1.65,1.9,1.55);p.quadraticCurveTo(2.6,1.5,3.1,1.62);p.lineTo(3.12,1.5);p.quadraticCurveTo(2.5,1.36,1.9,1.4);p.quadraticCurveTo(1.2,1.42,.8,1.32);p.closePath()},SK,SKD,40,.2,.03,0,[.4,1.2,2.8,.6]);
  cut(g,p=>p.ellipse(.42,1.95,.28,.33,0,0,7),SK,SKD,30,.1,.03,0,[0,1.5,.9,.9]);
  cut(g,p=>{p.moveTo(.2,2.15);p.quadraticCurveTo(.4,2.4,.68,2.1);p.quadraticCurveTo(.5,1.6,.2,1.05);p.quadraticCurveTo(.05,1.6,.2,2.15);p.closePath()},'#1a120c',['#2a1a12','#0a0604'],40,.2,.03,Math.PI/2,[0,1,.8,1.5]);
  g.fillStyle='#3a2418';g.beginPath();g.arc(.52,1.98,.03,0,7);g.fill();
}
BOOK.add({
no:6,name:'夢',seed:19100318,
desc:{
  orig:'Le Rêve',
  artist:'アンリ・ルソー　1910年',
  medium:'油彩・カンヴァス　204.5 × 298.5 cm　ニューヨーク近代美術館（MoMA）',
  paras:[
    '赤いソファに横たわる女性が、手をのばして、うっそうとしたジャングルを指さす。葉の陰からはライオンがのぞき、月の光の下で笛吹きが笛を鳴らし、蛇がうねる。',
    'ルソーはパリ市の税関で働きながら絵を描いた、独学の画家だった。一度もフランスを出たことがなく、ジャングルの植物はパリの植物園の温室で、動物は動物園や図鑑で見て描いたといわれる。',
    '1910年のアンデパンダン展に出品された、彼の最後の大作。ソファで眠る女性が、ジャングルの夢を見ている ― ルソーは絵に添えた詩でそう説明している。同じ年、ルソーは世を去った。',
  ],
  points:['何重にも重なる、大きな葉のジャングル','葉の陰からのぞく二頭のライオン','月の下で笛を吹く人と、うねる蛇'],
  foot:'―　右のページで、夢のジャングルが立ち上がります　―',
},
plate:'アンリ・ルソー《夢》1910年<br>ソファのそばから、夢のジャングルを見た構図',
ground(g,W,H,{X,Z,S}){
  groundClip(g,X,Z,1.2,()=>{
    g.fillStyle='#24482c';g.fillRect(0,0,W,H);
    for(let i=0;i<1600;i++){g.save();g.translate(R()*W,R()*H);g.scale(S,S);leaf(g,0,0,.6+R()*1.2,.12+R()*.15,R()*6.28,leafCol(),{veins:false});g.restore()}
  });
  groundTitle(g,W,H,'夢　―　アンリ・ルソー　1910年　ニューヨーク近代美術館','Le Rêve');
},
build(B){
const root=B.root;
// ================= 背景板: 月夜のジャングル =================
backdrop(B,{title:'夢',titleSize:190,orig:'Le Rêve',dot:'#c83a3a',emi:.55,
  draw:(g,W,H)=>{
    const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#5a7a9a');gr.addColorStop(.4,'#9ab0b8');gr.addColorStop(1,'#a8b8a8');g.fillStyle=gr;g.fillRect(0,0,W,H);
    // 満月
    g.fillStyle='rgba(255,255,240,.35)';g.beginPath();g.arc(W*.38,210,110,0,7);g.fill();
    g.fillStyle='#fbfbf0';g.beginPath();g.arc(W*.38,210,70,0,7);g.fill();
    g.save();g.scale(60,60);
    for(let i=0;i<70;i++){const x=R()*W/60,y=H/60;g.save();g.translate(x,y);g.scale(1,-1);
      const kind=pick(['broad','spike','palm','broad']);plantCard(g,4,10+R()*8,kind);g.restore()}
    g.restore();
  }});
// ================= 葉の列(奥から手前へ) =================
let dl=1.4;
function plant(x,z,w,h,kind,{ry=0,layer=3}={}){
  const pg=B.pop(root,[x,0,z],fdir(z,h),dl,.9,layer);dl+=.025;
  const t=tex(w,h,(g,ww,hh)=>plantCard(g,ww,hh,kind),{ppu:90});
  const m=plane(w,h,mat(t,.52,true),t);m.position.y=h/2;m.rotation.y=ry;pg.add(m);
  if(kind==='palm'||kind==='orange'){const m2=plane(w,h,m.material,t);m2.position.y=h/2;m2.rotation.y=ry+Math.PI/2;pg.add(m2)}
  return pg;
}
const ROWS=[[-23,14,5],[-18,12,5],[-13,10,4],[-8,8,4],[-3,6,4],[2,5,3],[7,4,3]];
for(const [z,h,n] of ROWS){
  for(let i=0;i<n;i++){const x=-15+30*(i+.2+R()*.6)/n;plant(x,z+(R()-.5)*2,5+R()*3,h*(.7+R()*.5),pick(['broad','spike','broad','palm','lotus']),{ry:(R()-.5)*.5,layer:z<-10?4:3})}
}
plant(11.5,-12,7,14,'orange',{layer:4});plant(-13,-20,7,13,'orange',{layer:4});
// 手前の大きな花と葉
plant(4,14,6,5,'lotus',{layer:2});plant(10,17,6,6,'lotus',{layer:2});plant(15,12,5,7,'spike',{layer:2});plant(-2.5,19,5,4,'broad',{layer:2});
// ================= 動物と笛吹き =================
function animal(x,z,y,w,h,draw,sc,{ry=0,layer=2}={}){
  const pg=B.pop(root,[x,0,z],fdir(z,(y+h)*sc),dl,.8,layer);dl+=.03;
  const t=tex(w,h,draw,{ppu:150});const m=plane(w,h,mat(t,.58,true),t);m.scale.setScalar(sc);m.position.y=y+h*sc/2;m.rotation.y=ry;pg.add(m);
  if(y>0)tab(pg,[0,0,0],[0,y,0],.1);
  return pg;
}
animal(-1.5,4.5,0,3.4,2.4,lion,1.6,{ry:.1});
animal(3.4,3.8,0,3.4,2.4,g=>{g.translate(3.4,0);g.scale(-1,1);lion(g)},1.4,{ry:-.2});
animal(1,-6,0,2.4,3.2,charmer,1.9);
animal(6.5,-2,1.2,2.6,3.6,snake,1.4);
animal(-10.5,-15,0,3.4,2.8,elephant,1.8,{ry:.2});
animal(-4.5,-10,6.5,1.6,1,bird,1.5,{ry:.3});
animal(8,-15,8,1.6,1,g=>{g.translate(1.6,0);g.scale(-1,1);bird(g)},1.4);
// ================= ソファと女性 =================
{
  const pg=B.pop(root,[-9.5,0,12],[0,-1],2.6,.9,1);
  const VEL=lam(0xb02a2a,.35),VELD=lam(0x7a1a1a,.3),LEG=lam(0x4a2a18,.3);
  const seat=box(7,1.2,2.6,VEL);seat.position.y=1.3;pg.add(seat);
  const base=box(7.2,.3,2.8,VELD);base.position.y=.6;pg.add(base);
  for(const x of [-3.3,3.3])for(const z of [-1.1,1.1]){const l=box(.3,.5,.3,LEG);l.position.set(x,.25,z);pg.add(l)}
  // 左の高い肘掛けと、くるりと巻いた縁
  const arm=box(1,2.6,2.6,VEL);arm.position.set(-3.1,2.4,0);pg.add(arm);
  const roll=new THREE.Mesh(new THREE.CylinderGeometry(.75,.75,2.8,20),VELD);roll.rotation.x=Math.PI/2;roll.position.set(-3.1,3.7,0);pg.add(shadowy(roll));
  const back=box(5,1.4,.5,VEL);back.position.set(-.8,2.4,-1.1);pg.add(back);
  const t=tex(4.4,2.6,g=>woman(g),{ppu:170});const m=plane(4.4,2.6,mat(t,.6,true),t);m.scale.setScalar(1.5);m.position.set(-.2,1.9+2.6*1.5/2,.3);pg.add(m);
}
const moon=B.light(new THREE.PointLight(0xe8f0ff,0,70,1));
const at=new THREE.Object3D();at.position.set(-4,22,10);root.add(at);
let k=0;B.extra(2.5,1,e=>k=clamp(e,0,1));
const tmp=new THREE.Vector3();
return {tick(){at.getWorldPosition(tmp);moon.position.copy(tmp);moon.intensity=.45*k}};
},
caps:{
  A:'第6話「夢」　アンリ・ルソー　1910年',
  B:'ソファで眠る女性が見ている、ジャングルの夢。ルソーは絵に添えた詩で、そう説明している。',
  C:'大きな葉が、何重にも重なり合う。ルソーはパリの植物園の温室に通って、植物を写した。',
  D:'葉の陰からライオンがこちらをのぞく。奥では笛吹きが笛を鳴らし、蛇がうねる。',
  E:'空には白い満月。鳥や象も、ジャングルのどこかに隠れている。',
  F:'ルソーは税関で働きながら絵を描いた、独学の画家だった。この絵を描いた年に世を去った。',
},
tour:[
  {t0:0,t1:6,f:u=>{const k=easeIO(u);return [V(0,40-6*k,46-6*k),V(0,3,-4)]},cap:'A'},
  {t0:6,t1:14.5,f:u=>{const a=.95-1.9*easeIO(u);return [V(Math.sin(a)*42,18-5*u,Math.cos(a)*42-4),V(0,4,-5)]},cap:'B'},
  {t0:14.5,t1:21.5,f:u=>{const k=easeIO(u);return [V(9-10*k,3.5,20-6*k),V(0,3.5,0)]},cap:'C'},
  {t0:21.5,t1:28.5,f:u=>[V(-1,5.5,27-1*u),V(-1,4.6,-12)],cap:'D',frame:true,fov:22},
  {t0:28.5,t1:35.5,f:u=>{const k=easeIO(u);return [V(2,3+3*k,8-2*k),V(-3-4*k,6+6*k,-12)]},cap:'E'},
  {t0:35.5,t1:42,f:u=>{const k=easeIO(u);return [V(2-2*k,6+30*k,6+38*k),V(-7+7*k,12-9*k,-12+8*k)]},cap:'F'},
],
tourEnd:42,tourLoop:6,
});
}
