'use strict';
// 見開き10: ルネ・マグリット《光の帝国》1954年(ブリュッセル)
// 上は昼の青空(背景板と、紙の支柱で浮かせた白い雲)、下は夜。木立に囲まれた家と、その前の街灯ひとつ。
// 昼の空の板が先に起き上がり、つづいて夜の家と木立が立つ。最後の見開きなので、空の板の裏に「おしまい」を添える。
{
const NIGHT=['#14181c','#1a2024','#0e1214','#20282a','#181c20'];
const TREE=['#0c1010','#141a18','#1a201c','#0a0c0c','#20261e'];
BOOK.add({
no:10,name:'光の帝国',seed:19540101,
desc:{
  orig:"L'Empire des lumières",
  artist:'ルネ・マグリット　1954年',
  medium:'油彩・カンヴァス　146 × 114 cm　ベルギー王立美術館（ブリュッセル）',
  paras:[
    '下半分は夜。木立に囲まれた家の前で街灯がひとつ灯り、窓にも明かりがともる。ところが上半分の空は、白い雲の浮かぶ、昼間の明るい青空だ。',
    '夜の景色と昼の空。ふつうは一枚の絵に並ばないものを、マグリットはごく当たり前のように、静かに描いた。不思議なのに、どこかで見たことがあるような気がしてくる。',
    'マグリットはこの主題が気に入り、1949年ごろから何度も描いて、油彩だけで十数点が残る。夜と昼が呼び起こすこの驚きを、「私は詩と呼ぶ」と彼は語っている。',
  ],
  points:['夜の家と街灯、昼の青空','窓にともる、あたたかな明かり','空に黒く浮かぶ木立のシルエット'],
  foot:'―　右のページで、夜と昼が同時に立ち上がります　―',
},
plate:"ルネ・マグリット《光の帝国》1954年<br>夜の通りから、家と昼の空を見上げた構図",
ground(g,W,H,{X,Z,S}){
  groundClip(g,X,Z,1.2,()=>{
    g.fillStyle='#141a1c';g.fillRect(0,0,W,H);brush(g,0,0,W,H,NIGHT,2500,40,8,0,{jit:.2,alpha:.6});
    // 家の前の道と、街灯の光の輪
    g.fillStyle='#262c2c';g.fillRect(0,Z(-2),W,Z(6)-Z(-2));
    const rg=g.createRadialGradient(X(-3),Z(-1),0,X(-3),Z(-1),9*S);rg.addColorStop(0,'rgba(255,220,150,.55)');rg.addColorStop(1,'rgba(255,220,150,0)');g.fillStyle=rg;g.fillRect(0,0,W,H);
    // 手前の水面(街灯の光が細長く映る)
    g.fillStyle='#0e1418';g.beginPath();g.ellipse(X(1),Z(16),13*S,7*S,0,0,7);g.fill();
    g.fillStyle='rgba(255,220,150,.5)';g.fillRect(X(-3.4),Z(10),.8*S,8*S);
    brush(g,X(-12),Z(10),24*S,12*S,['#1a2428','#0a1014','#24343a'],600,30,3,0,{jit:.1,alpha:.5});
  });
  groundTitle(g,W,H,'光の帝国　―　ルネ・マグリット　1954年　ブリュッセル',"L'Empire des lumières");
},
build(B){
const root=B.root;
// ================= 昼の空(背景板)と雲 =================
const bd=backdrop(B,{title:'光の帝国',titleSize:170,orig:"L'Empire des lumières",dot:'#6a9ad8',emi:.9,delay:1.0,shadow:false,
  sub:'―　タップすると、夜と昼が立ち上がります　―',
  edge:(p,W,H)=>{p.moveTo(0,H);p.lineTo(W,H);p.lineTo(W,70);p.lineTo(0,70);p.closePath()},
  draw:(g,W,H)=>{
    const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#4a86c8');gr.addColorStop(.6,'#8ab8e0');gr.addColorStop(1,'#c8dcec');g.fillStyle=gr;g.fillRect(0,0,W,H);
    for(const [x,y,s] of [[300,260,1],[900,180,1.3],[1500,300,1.1],[1200,560,.8],[500,620,.7],[1800,640,.6]])for(let k=0;k<9;k++){
      const cx=x+(R()-.5)*240*s,cy=y+(R()-.5)*50*s,r=(50+R()*60)*s,rg=g.createRadialGradient(cx,cy-r*.3,0,cx,cy,r);
      rg.addColorStop(0,'rgba(255,255,255,.95)');rg.addColorStop(.7,'rgba(240,244,248,.8)');rg.addColorStop(1,'rgba(220,230,240,0)');g.fillStyle=rg;g.beginPath();g.arc(cx,cy,r,0,7);g.fill()}
    // 地平の木立の影(夜の側)
    g.fillStyle='#0c1010';g.beginPath();g.moveTo(0,H);for(let x=0;x<=W;x+=40)g.lineTo(x,H-140-Math.sin(x*.01)*50-R()*40);g.lineTo(W,H);g.closePath();g.fill();
  }});
const cloudT=[0,1,2].map(()=>tex(8,3.4,g=>{
  const bl=[...Array(11)].map(()=>[1.2+R()*5.6,1+R()*1.4,.7+R()*.8]);
  g.fillStyle=PAPER;for(const [x,y,r] of bl){g.beginPath();g.arc(x,y,r+.08,0,7);g.fill()}
  for(const [x,y,r] of bl){const rg=g.createRadialGradient(x,y+r*.3,0,x,y,r);rg.addColorStop(0,'#ffffff');rg.addColorStop(1,'#d8e2ec');g.fillStyle=rg;g.beginPath();g.arc(x,y,r,0,7);g.fill()}
},{ppu:60}));
const clouds=[];
[[-11,19,1.1],[-2,21.5,1.3],[8,19.5,1],[13,22,.8],[-7,15.5,.8],[4,15.2,.7]].forEach(([x,y,s],i)=>{
  const zb=bd.zAt(x),off=1.5+R()*2.5,t=cloudT[i%3],m=plane(8,3.4,mat(t,.9,true),t);m.scale.setScalar(s);m.position.set(x,y,zb+off);bd.pg.add(m);
  tab(bd.pg,[x,y-.4,zb],[x,y-.4,zb+off],.1);clouds.push({m,x,ph:R()*6});
  B.extra(1.9+i*.05,.7,e=>m.scale.setScalar(Math.max(.001,e)*s));
});
// ================= 木立(夜の黒いシルエット) =================
function tree(x,z,w,h,dl,layer){
  const pg=B.pop(root,[x,0,z],fdir(z,h),dl,1.1,layer);
  const bl=[...Array(13)].map(()=>[w/2+(R()-.5)*w*.75,h*(.45+R()*.5),w*(.14+R()*.12)]);
  const t=tex(w,h,g=>cut(g,p=>{p.rect(w/2-.25,0,.5,h*.6);for(const [bx,by,r] of bl){p.moveTo(bx+r,by);p.arc(bx,by,r,0,7)}},'#0e1412',TREE,900,.3,.1,0,[0,0,w,h]),{ppu:60});
  for(let k=0;k<2;k++){const m=plane(w,h,mat(t,.15,true),t);m.position.y=h/2;m.rotation.y=k*Math.PI/2;pg.add(m)}
}
tree(10.5,-11,10,21,2.0,4);tree(-11,-13,9,16,2.05,4);tree(-3,-18,12,15,1.9,4);tree(5,-19,10,13,1.95,4);tree(-14.5,-4,6,11,2.1,3);
// ================= 家 =================
const lampAt=new THREE.Object3D();
let wl;
{
  const W=11,H=9,D=5,pg=B.pop(root,[1.5,0,-8],[0,-1],2.2,1.1,3);
  const wins=[];for(const y of [.6,3.6,6.4])for(const x of [-3.6,0,3.6])if(!(y<1&&x===0))wins.push([x,y,y>6&&x!==0]);
  const ft=tex(W,H,(g,w,h)=>{g.fillStyle='#8a8a84';g.fillRect(-w/2,0,w,h);brush(g,-w/2,0,w,h,['#929288','#7e7e78','#9a9890'],400,.6,.05,Math.PI/2,{jit:.2,alpha:.5});
    for(const [x,y,l] of wins){g.fillStyle=l?'#f8c860':'#1a1e20';g.fillRect(x-.65,y,1.3,2);if(l){g.fillStyle='rgba(255,240,200,.6)';g.fillRect(x-.55,y+.1,.5,1.8)}
      g.strokeStyle='#e8e4d8';g.lineWidth=.1;g.strokeRect(x-.65,y,1.3,2);g.beginPath();g.moveTo(x,y);g.lineTo(x,y+2);g.stroke();
      if(!l){g.fillStyle='#3a3e3a';g.fillRect(x-1.05,y,.38,2);g.fillRect(x+.67,y,.38,2)}}
    g.fillStyle='#2a201a';g.fillRect(-.6,0,1.2,2.4);g.strokeStyle='#e8e4d8';g.lineWidth=.1;g.strokeRect(-.6,0,1.2,2.4);
    g.strokeStyle=PAPER;g.lineWidth=.14;g.strokeRect(-w/2,0,w,h)},{center:true,ppu:90});
  const SIDE=lam(0x5a5a56,.2);
  const fr=plane(W,H,mat(ft,.25));fr.position.set(0,H/2,0);pg.add(fr);
  for(const s of [-1,1]){const p=plane(D,H,SIDE);p.rotation.y=s*Math.PI/2;p.position.set(s*W/2,H/2,-D/2);pg.add(p)}
  const roof=new THREE.Mesh(new THREE.CylinderGeometry(0,1,1,4,1).rotateY(Math.PI/4),lam(0x2a2a2e,.2));roof.scale.set(W*.75,2.2,D*.75);roof.position.set(0,H+1.1,-D/2);pg.add(shadowy(roof));
  const cor=box(W+.3,.25,.4,lam(0xb8b4a8,.3));cor.position.set(0,H,.15);pg.add(cor);
  for(const [x,y] of wins){const s=box(1.6,.12,.3,lam(0xb8b4a8,.3));s.position.set(x,y-.06,.15);pg.add(s)}
  // 窓の明かり
  wl=B.light(new THREE.PointLight(0xffc870,0,10,1.5));wl.userData.at=new THREE.Object3D();wl.userData.at.position.set(3.6,7.4,1.5);pg.add(wl.userData.at);
}
// ================= 街灯 =================
let glow,lampK=0;
{
  const pg=B.pop(root,[-3,0,-2],[0,-1],2.6,.8,2),IRON=lam(0x1a1a1a,.2);
  const post=new THREE.Mesh(new THREE.CylinderGeometry(.12,.2,7,10),IRON);post.position.y=3.5;pg.add(shadowy(post));
  const cap=new THREE.Mesh(new THREE.ConeGeometry(.55,.5,4),IRON);cap.rotation.y=Math.PI/4;cap.position.y=8.05;pg.add(cap);
  const gl=new THREE.Mesh(new THREE.CylinderGeometry(.42,.28,.9,4,1,true),new THREE.MeshBasicMaterial({color:0xffe6a0,side:THREE.DoubleSide}));gl.rotation.y=Math.PI/4;gl.position.y=7.4;pg.add(gl);
  glow=glowSprite('255,220,140',5);glow.position.y=7.4;pg.add(glow);glow.material.opacity=0;
  lampAt.position.y=7.2;pg.add(lampAt);
  B.extra(3.3,.8,e=>{lampK=clamp(e,0,1);glow.material.opacity=lampK});
}
const lamp=B.light(new THREE.PointLight(0xffd090,0,26,1.2));
const tmp=new THREE.Vector3();
return {liveShadows:true,tick(T){
  lampAt.getWorldPosition(tmp);lamp.position.copy(tmp);lamp.intensity=lampK*(1.9+.04*Math.sin(T*9));
  wl.userData.at.getWorldPosition(tmp);wl.position.copy(tmp);wl.intensity=lampK*1.2;
  for(const c of clouds)c.m.position.x=c.x+Math.sin(T*.08+c.ph)*.5;
}};
},
caps:{
  A:'第10話「光の帝国」　ルネ・マグリット　1954年',
  B:'下は夜、上は昼。ありえない組み合わせなのに、絵はとても静かだ。',
  C:'家の前に街灯がひとつ。二階の窓にも明かりがともっている。',
  D:'見上げると、白い雲の浮かぶ昼の青空。マグリットは、この不思議が呼び起こす力を「詩」と呼んだ。',
  E:'黒い木立が、夜と昼の境目に立っている。',
  F:'マグリットはこの主題を気に入り、何度も描いた。名画の飛び出す絵本は、ここでおしまい。',
},
tour:[
  {t0:0,t1:6,f:u=>{const k=easeIO(u);return [V(0,40-6*k,46-6*k),V(0,4,-6)]},cap:'A'},
  {t0:6,t1:14.5,f:u=>{const a=-.95+1.9*easeIO(u);return [V(Math.sin(a)*40,16-4*u,Math.cos(a)*40-4),V(0,6,-8)]},cap:'B'},
  {t0:14.5,t1:21.5,f:u=>{const k=easeIO(u);return [V(4-6*k,3,14-4*k),V(-1,4.5+1.5*k,-6)]},cap:'C'},
  {t0:21.5,t1:28.5,f:u=>[V(-.5,3.6,33-1*u),V(.5,10.5,-14)],cap:'D',frame:true,fov:31},
  {t0:28.5,t1:35.5,f:u=>{const k=easeIO(u);return [V(14-6*k,5+4*k,8),V(8,12+3*k,-14)]},cap:'E'},
  {t0:35.5,t1:42,f:u=>{const k=easeIO(u);return [V(8-8*k,9+27*k,8+36*k),V(8-8*k,15-11*k,-14+8*k)]},cap:'F'},
],
tourEnd:42,tourLoop:6,
});
}
