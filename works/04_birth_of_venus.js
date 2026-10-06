'use strict';
// 見開き4: サンドロ・ボッティチェリ《ヴィーナスの誕生》1485年頃
// 海の上にホタテ貝(立体)とヴィーナス。左の宙に風の神ゼフュロスとニンフ(紙の支柱で浮かせる)、舞うバラ。
// 右の岸に季節の女神ホーラとオレンジの林。
// 畳み方: 貝と人物は倒してもはみ出さない側へ、林は岸から海の側へ倒し、最後に空と水平線の背景板を手前へ倒す(裏に題名)。
{
const SEA=['#9ac0b0','#a8ccbc','#8ab4a8','#b8d4c4','#7aa89c','#c4dccc'];
const SKIN='#e8c4a8',SKD=['#f0d0b8','#dcb498','#e4bea4','#d4a890'];
const GOLD='#d8a84a',GOLDS=['#e8c060','#c8903a','#f0d070','#b8803a'];
// ボッティチェリ風: なめらかな地に細い線
function bp(g,path,base,cols,box,n=30,ang=Math.PI/2){
  g.save();g.beginPath();path(g);g.lineJoin='round';g.strokeStyle=PAPER;g.lineWidth=.05;g.stroke();
  g.fillStyle=base;g.fill();g.clip();if(cols){const [x,y,w,h]=box;brush(g,x,y,w,h,cols,w*h*n,.5,.025,ang,{jit:.25,alpha:.6})}g.restore();
}
function hairLines(g,pts,cols,n=26,w=.05){
  g.save();g.lineCap='round';
  for(let i=0;i<n;i++){const o=(i/n-.5)*.5;g.strokeStyle=pick(cols);g.lineWidth=w;g.beginPath();pts.forEach(([x,y],k)=>{const xx=x+o*(1+k*.25),yy=y+Math.sin(k+i)*.04;k?g.lineTo(xx,yy):g.moveTo(xx,yy)});g.stroke()}
  g.restore();
}
// ヴィーナス(高さおよそ 5.2、足元 y=0、中心 x=1.2)。長い金の髪が体の前を覆う
function venus(g){
  const x=1.2;
  bp(g,p=>{p.moveTo(x-.2,0);p.lineTo(x+.05,0);p.quadraticCurveTo(x+.1,1.3,x+.32,2.5);p.quadraticCurveTo(x+.45,3.2,x+.38,3.8);p.lineTo(x-.42,3.8);p.quadraticCurveTo(x-.55,3.0,x-.3,2.4);p.quadraticCurveTo(x-.2,1.2,x-.2,0);p.closePath()},SKIN,SKD,[x-1,0,2,4]);
  bp(g,p=>{p.moveTo(x+.05,0);p.lineTo(x+.3,0);p.quadraticCurveTo(x+.35,1.2,x+.32,2.5);p.lineTo(x+.1,2.4);p.closePath()},'#ecd2be',SKD,[x-1,0,2,3]);
  bp(g,p=>{p.rect(x-.12,3.75,.24,.4)},SKIN,SKD,[x-.3,3.7,.6,.5]);
  // 頭(少し傾ける)
  g.save();g.translate(x+.05,4.5);g.rotate(.18);
  bp(g,p=>p.ellipse(0,0,.3,.38,0,0,7),SKIN,SKD,[-.4,-.5,.8,1]);
  g.strokeStyle='#8a5a3a';g.lineWidth=.025;for(const s of [-1,1]){g.beginPath();g.arc(s*.11,.04,.05,Math.PI*.15,Math.PI*.85);g.stroke()}
  g.beginPath();g.moveTo(0,.02);g.lineTo(.03,-.1);g.stroke();g.strokeStyle='#c86a6a';g.beginPath();g.moveTo(-.06,-.19);g.quadraticCurveTo(0,-.21,.06,-.19);g.stroke();
  g.restore();
  // 髪: 頭の上から右へなびき、左肩から体の前を通って下へ流れる
  bp(g,p=>{p.moveTo(x-.3,4.75);p.quadraticCurveTo(x+.1,5.15,x+.5,4.85);p.quadraticCurveTo(x+1.4,4.6,x+1.7,3.6);p.quadraticCurveTo(x+1.2,4.1,x+.38,4.2);p.quadraticCurveTo(x+.25,4.6,x-.05,4.7);p.closePath()},GOLD,GOLDS,[x-.5,3.5,2.4,1.8]);
  bp(g,p=>{p.moveTo(x-.32,4.6);p.quadraticCurveTo(x-.6,3.8,x-.4,3.0);p.quadraticCurveTo(x-.1,2.2,x+.15,1.55);p.quadraticCurveTo(x+.3,1.3,x+.2,1.15);p.quadraticCurveTo(x-.05,1.5,x-.25,2.1);p.quadraticCurveTo(x-.55,2.8,x-.62,3.6);p.quadraticCurveTo(x-.6,4.3,x-.32,4.6);p.closePath()},GOLD,GOLDS,[x-.8,1,1.3,3.7]);
  hairLines(g,[[x+.1,4.95],[x+.8,4.7],[x+1.4,4.2],[x+1.7,3.65]],['#c8903a','#e0b050'],12,.035);
  hairLines(g,[[x-.35,4.5],[x-.55,3.7],[x-.3,2.8],[x,2],[x+.18,1.3]],['#c8903a','#e0b050'],10,.03);
  // 腕: 右手は胸もと、左手は髪を押さえる
  bp(g,p=>{p.moveTo(x+.3,3.75);p.quadraticCurveTo(x+.55,3.3,x+.35,3.0);p.lineTo(x-.15,3.25);p.lineTo(x-.1,3.38);p.lineTo(x+.25,3.2);p.quadraticCurveTo(x+.35,3.4,x+.18,3.7);p.closePath()},SKIN,SKD,[x-.3,2.9,1,1]);
  bp(g,p=>{p.moveTo(x-.38,3.7);p.quadraticCurveTo(x-.7,2.8,x-.2,1.9);p.lineTo(x-.05,1.95);p.quadraticCurveTo(x-.5,2.8,x-.24,3.6);p.closePath()},SKIN,SKD,[x-.8,1.8,1,2]);
}
function zephyr(g){
  // 抱き合って飛ぶ二人。ゼフュロス(青緑の衣と大きな翼)が頬をふくらませて風を吹き、ニンフがしがみつく
  const limb=(x0,y0,x1,y1,w0,w1,c)=>{const a=Math.atan2(y1-y0,x1-x0),nx=-Math.sin(a),ny=Math.cos(a);
    bp(g,p=>{p.moveTo(x0+nx*w0,y0+ny*w0);p.lineTo(x1+nx*w1,y1+ny*w1);p.lineTo(x1-nx*w1,y1-ny*w1);p.lineTo(x0-nx*w0,y0-ny*w0);p.closePath()},c,SKD,[Math.min(x0,x1)-.5,Math.min(y0,y1)-.5,Math.abs(x1-x0)+1,Math.abs(y1-y0)+1])};
  // 翼(羽根の線つき)
  for(const [tx,ty,c] of [[1.0,5.3,'#8a7a68'],[2.1,5.5,'#a89a86']]){
    bp(g,p=>{p.moveTo(2.9,3.5);p.bezierCurveTo(2.4,4.6,tx+.3,ty,tx,ty);p.bezierCurveTo(tx+.6,ty-.9,2.3,3.8,2.5,3.2);p.closePath()},c,['#b8a890','#6a5a4a',c],[tx-.2,3,3.2-tx+.4,ty-2.9],50,1.1);
  }
  // ニンフ(奥): 脚は左下へ流れる
  limb(2.6,2.5,1.5,1.4,.2,.11,'#ecd0c0');limb(2.4,2.35,1.2,1.0,.18,.1,'#e8c8b8');
  bp(g,p=>p.ellipse(2.85,2.75,.62,.3,-.75,0,7),'#ecd0c0',SKD,[2.1,2.2,1.5,1.2]);
  bp(g,p=>p.ellipse(3.45,3.2,.26,.29,0,0,7),'#f0d4c4',SKD,[3.1,2.8,.7,.8]);
  bp(g,p=>{p.moveTo(3.2,3.35);p.quadraticCurveTo(3.5,3.6,3.75,3.3);p.quadraticCurveTo(3.9,2.8,3.6,2.5);p.quadraticCurveTo(3.7,3.0,3.2,3.35)},GOLD,GOLDS,[3.1,2.4,.9,1.3]);
  // ゼフュロス(手前)
  limb(2.4,3.0,1.0,2.0,.23,.12,SKIN);limb(2.2,2.8,.7,1.7,.21,.11,SKIN);
  bp(g,p=>p.ellipse(2.75,3.3,.7,.33,-.55,0,7),SKIN,SKD,[1.9,2.8,1.7,1.2]);
  bp(g,p=>p.ellipse(3.35,3.82,.3,.32,0,0,7),SKIN,SKD,[3,3.4,.7,.8]);
  g.fillStyle='rgba(220,120,110,.6)';g.beginPath();g.arc(3.5,3.76,.1,0,7);g.fill();
  bp(g,p=>{p.moveTo(3.05,3.95);p.quadraticCurveTo(3.35,4.35,3.65,3.98);p.quadraticCurveTo(3.4,4.1,3.05,3.95)},'#6a4a2a',null);
  // 衣が二人を巻いてなびく
  bp(g,p=>{p.moveTo(3.1,3.1);p.quadraticCurveTo(2.2,2.3,1.2,2.6);p.quadraticCurveTo(.5,2.8,.2,2.2);p.quadraticCurveTo(.9,2.3,1.4,2.05);p.quadraticCurveTo(2.4,1.8,3.2,2.8);p.closePath()},'#6a9a90',['#7aaaa0','#4a7a70','#9ac0b8'],[0,1.7,3.4,1.6],50,.3);
  // 吹く風
  g.save();g.strokeStyle='rgba(250,250,240,.9)';g.lineWidth=.05;g.lineCap='round';
  for(let i=0;i<5;i++){g.beginPath();g.moveTo(3.68,3.8-i*.07);g.quadraticCurveTo(4.4,3.55-i*.1,5.3,3.0-i*.14);g.stroke()}g.restore();
}
function hora(g){
  const x=1.2;
  bp(g,p=>{p.moveTo(x-.55,0);p.lineTo(x+.6,0);p.quadraticCurveTo(x+.35,1.6,x+.25,3.4);p.lineTo(x-.25,3.4);p.quadraticCurveTo(x-.4,1.6,x-.55,0);p.closePath()},'#f4f0e4',['#ffffff','#e8e4d4','#d8d8c8'],[x-.7,0,1.4,3.5],40);
  for(let i=0;i<34;i++){const fx=x-.4+R()*.8,fy=.3+R()*3;g.fillStyle=pick(['#4a6ab8','#6a8ad0','#3a5aa8']);g.beginPath();g.arc(fx,fy,.05,0,7);g.fill()}
  bp(g,p=>{p.moveTo(x-.3,3.3);p.lineTo(x+.3,3.3);p.lineTo(x+.25,3.95);p.lineTo(x-.25,3.95);p.closePath()},'#f4f0e4',['#ffffff','#e8e4d4'],[x-.4,3.2,.8,.8]);
  // 花の帯と首飾り
  g.fillStyle='#5a8a4a';g.fillRect(x-.3,3.25,.6,.06);for(let i=0;i<6;i++){g.fillStyle='#e8a0b0';g.beginPath();g.arc(x-.25+i*.1,3.28,.04,0,7);g.fill()}
  bp(g,p=>p.rect(x-.08,3.9,.16,.25),SKIN,SKD,[x-.2,3.8,.4,.4]);
  bp(g,p=>p.ellipse(x,4.4,.24,.3,0,0,7),SKIN,SKD,[x-.3,4,.6,.7]);
  bp(g,p=>{p.moveTo(x-.26,4.45);p.quadraticCurveTo(x,4.85,x+.26,4.45);p.quadraticCurveTo(x+.5,4.0,x+.55,3.4);p.quadraticCurveTo(x+.3,3.9,x+.2,4.6);p.quadraticCurveTo(x,4.65,x-.26,4.45)},GOLD,GOLDS,[x-.3,3.4,.9,1.5]);
  // 腕を左へ伸ばして衣を差し出す
  bp(g,p=>{p.moveTo(x-.25,3.8);p.lineTo(x-1.1,3.5);p.lineTo(x-1.1,3.38);p.lineTo(x-.25,3.6);p.closePath()},SKIN,SKD,[x-1.2,3.3,1,.6]);
}
function cloak(g){
  bp(g,p=>{p.moveTo(2.6,3.6);p.quadraticCurveTo(1.4,3.9,.2,3.0);p.quadraticCurveTo(.5,1.8,.2,.4);p.quadraticCurveTo(1.3,.7,2.2,.2);p.quadraticCurveTo(2.0,1.8,2.6,3.6);p.closePath()},'#c8506a',['#d86a80','#a83a58','#e88aa0'],[0,0,2.8,4],50,.4);
  for(let i=0;i<30;i++){const fx=.5+R()*1.8,fy=.5+R()*2.8;g.fillStyle='#fff8e8';for(let k=0;k<5;k++){const a=k*1.26;g.beginPath();g.arc(fx+Math.cos(a)*.06,fy+Math.sin(a)*.06,.04,0,7);g.fill()}g.fillStyle='#f0c040';g.beginPath();g.arc(fx,fy,.03,0,7);g.fill()}
}
function rose(g){
  g.translate(.5,.5);
  bp(g,p=>{for(let k=0;k<5;k++){const a=k*1.2566+.3;p.moveTo(0,0);p.arc(Math.cos(a)*.22,Math.sin(a)*.22,.2,0,7)}},'#f0b8c0',['#f8d0d8','#e8a0b0','#ffffff'],[-.5,-.5,1,1],60,0);
  g.fillStyle='#e8c060';g.beginPath();g.arc(0,0,.07,0,7);g.fill();
}
BOOK.add({
no:4,name:'ヴィーナスの誕生',seed:14850101,
desc:{
  orig:'Nascita di Venere',
  artist:'サンドロ・ボッティチェリ　1485年頃',
  medium:'テンペラ・カンヴァス　172.5 × 278.9 cm　ウフィツィ美術館（フィレンツェ）',
  paras:[
    '海の泡から生まれた愛と美の女神ヴィーナスが、大きなホタテ貝に乗って、キプロス島の岸へ流れ着く。ギリシャ神話の一場面を、等身大に近い大きさで描いた。',
    '左では西風の神ゼフュロスがニンフを抱えて風を吹きかけ、バラの花が舞う。右の岸では季節の女神ホーラが、花模様の衣を広げて女神を迎える。',
    'フィレンツェのメディチ家のまわりで描かれたと考えられている。キリスト教の主題が中心だった時代に、神話の女神をこれほど大きく描いた絵は珍しく、ルネサンスを代表する一枚になった。',
  ],
  points:['貝の上に立つヴィーナス ― 風になびく金の髪','風を吹くゼフュロスと、舞い散るバラ','花の衣を広げて迎える季節の女神'],
  foot:'―　右のページで、海と女神が立ち上がります　―',
},
plate:'サンドロ・ボッティチェリ《ヴィーナスの誕生》1485年頃<br>海の上、貝と同じ高さから見た構図',
ground(g,W,H,{X,Z,S}){
  groundClip(g,X,Z,1.2,()=>{
    g.fillStyle='#9ec4b4';g.fillRect(0,0,W,H);
    brush(g,0,0,W,H,SEA,5000,50,7,0,{jit:.15,alpha:.6});
    // さざ波の V 字
    g.strokeStyle='rgba(250,252,244,.85)';g.lineWidth=3;
    for(let i=0;i<900;i++){const x=R()*W,y=R()*H,s=(.25+R()*.3)*S;g.beginPath();g.moveTo(x-s,y-s*.35);g.lineTo(x,y);g.lineTo(x+s,y-s*.35);g.stroke()}
    // 右の岸
    g.beginPath();g.moveTo(W,0);g.lineTo(X(11.5),0);g.quadraticCurveTo(X(10),Z(0),X(8.2),H);g.lineTo(W,H);g.closePath();
    g.save();g.fillStyle='#8a9a5a';g.fill();g.clip();brush(g,X(7),0,W-X(7),H,['#7a8a4a','#9aa86a','#6a7a3a','#a8b070','#5a6a3a'],2500,30,8,Math.PI/2,{jit:2});g.restore();
    g.strokeStyle='rgba(250,250,240,.9)';g.lineWidth=6;g.beginPath();g.moveTo(X(11.5),0);g.quadraticCurveTo(X(10),Z(0),X(8.2),H);g.stroke();
  });
  groundTitle(g,W,H,'ヴィーナスの誕生　―　サンドロ・ボッティチェリ　1485年頃　フィレンツェ','Nascita di Venere');
},
build(B){
const root=B.root;
// ================= 背景板: 空と水平線、左の遠い岸 =================
backdrop(B,{title:'ヴィーナスの誕生',orig:'Nascita di Venere',dot:'#f0b8c0',emi:.4,
  edge:(p,W,H)=>{p.moveTo(0,H);p.lineTo(W,H);p.lineTo(W,80);p.lineTo(0,80);p.closePath()},
  draw:(g,W,H)=>{
    const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#7aa8a4');gr.addColorStop(.7,'#a8c4b8');gr.addColorStop(1,'#c0d4c4');g.fillStyle=gr;g.fillRect(0,0,W,H);
    brush(g,0,0,W,H*.8,['#8ab4ac','#9cc0b4','#b8d0c4'],2500,60,6,0,{jit:.1,alpha:.4});
    const hz=1110;
    g.fillStyle='#8ab0a4';g.fillRect(0,hz,W,H-hz);brush(g,0,hz,W,H-hz,SEA,1500,40,5,0,{jit:.1});
    g.strokeStyle='rgba(250,252,244,.8)';g.lineWidth=3;for(let i=0;i<220;i++){const x=R()*W,y=hz+20+R()*(H-hz),s=8+R()*10;g.beginPath();g.moveTo(x-s,y-4);g.lineTo(x,y);g.lineTo(x+s,y-4);g.stroke()}
    // 左の遠い岬
    g.fillStyle='#6a8a6a';g.beginPath();g.moveTo(0,hz+6);g.lineTo(0,hz-50);g.quadraticCurveTo(120,hz-70,260,hz-25);g.quadraticCurveTo(380,hz-5,460,hz+6);g.closePath();g.fill();
    // 右の林(背景の分)
    g.fillStyle='#3a5a3a';g.fillRect(W*.8,0,W*.2,hz);brush(g,W*.8,0,W*.2,hz,['#2a4a2a','#4a6a3a','#1e3a24'],1200,40,10,0,{jit:3});
    for(let i=0;i<120;i++){g.fillStyle='#f8f4e8';g.beginPath();g.arc(W*.8+R()*W*.2,R()*hz*.8,4,0,7);g.fill()}
    for(const x of [W*.82,W*.89,W*.96]){g.fillStyle='#5a4a3a';g.fillRect(x,0,16,hz+40)}
  }});
// ================= ホタテ貝(立体)とヴィーナス =================
{
  const pg=B.pop(root,[-1,0,4.5],[0,-1],2.2,1.1,2);
  const NU=14,NV=60,pos=[],col=[],idx=[],c=new THREE.Color();
  for(let i=0;i<=NU;i++)for(let j=0;j<=NV;j++){
    const u=i/NU,v=j/NV,a=(v-.5)*2.6,r=u*3.6,rib=Math.abs(Math.sin(v*Math.PI*16));
    pos.push(Math.sin(a)*r,.15+r*r*.055+rib*.13*u,-Math.cos(a)*r+.6);
    c.setRGB(.96-.12*(1-rib),.86-.1*(1-rib)+.04*u,.78-.08*(1-rib));col.push(c.r,c.g,c.b);
  }
  for(let i=0;i<NU;i++)for(let j=0;j<NV;j++){const a=i*(NV+1)+j,b=a+NV+1;idx.push(a,b,a+1,b,b+1,a+1)}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));sg.setAttribute('color',new THREE.Float32BufferAttribute(col,3));sg.setIndex(idx);sg.computeVertexNormals();
  const shell=new THREE.Mesh(sg,new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide,emissive:0x1a1410}));pg.add(shadowy(shell));
  // 蝶番の耳
  const ear=box(1.4,.2,.5,new THREE.MeshLambertMaterial({color:0xe8cfc0,emissive:0x3a3028}));ear.position.set(0,.18,.75);pg.add(ear);
  const t=tex(3.4,5.4,g=>venus(g),{ppu:170});
  const m=plane(3.4,5.4,mat(t,.42,true),t);m.scale.setScalar(1.25);m.position.set(.2,.35+5.4*1.25/2,-.6);m.rotation.y=-.12;pg.add(m);
}
// ================= ゼフュロスとニンフ(紙の支柱で宙に) =================
{
  const pg=B.pop(root,[-7,0,2.5],[0,-1],1.9,1.1,3);
  const t=tex(5.4,5.6,g=>zephyr(g),{ppu:150});
  const m=plane(5.4,5.6,mat(t,.45,true),t);m.scale.setScalar(1.2);m.position.set(0,7.2,0);m.rotation.y=.2;pg.add(m);
  tab(pg,[0,0,0],[0,4,0],.1);
}
// 舞うバラ
const roses=[];
{
  const rt=tex(1,1,g=>rose(g),{ppu:128}),rm=mat(rt,.6,true);
  [[-3.6,8.2,3.5],[-3,6.4,5],[-2.6,9.4,2.2],[-4.4,10.6,4.2],[-4.8,5.8,4.6],[-2,10.8,3.6],[-1.8,7.6,6]].forEach(([x,y,z],i)=>{
    const pg=B.pop(root,[x,0,z],[0,-1],2.5+i*.05,.8,1);
    const r=plane(.9,.9,rm,rt);r.position.y=y;r.rotation.set(R()*.8,R()*3,R()*3);pg.add(r);
    tab(pg,[0,0,0],[0,y-.3,0],.05);roses.push({r,ph:R()*6});
  });
}
// ================= 岸: ホーラと衣、オレンジの林 =================
{
  const pg=B.pop(root,[7.6,0,4.5],[0,-1],2.35,1,2);
  const t=tex(2.4,5,g=>hora(g),{ppu:160});const m=plane(2.4,5,mat(t,.45,true),t);m.scale.setScalar(1.3);m.position.set(0,5*1.3/2,0);m.rotation.y=-.35;pg.add(m);
  const ct=tex(2.8,4,g=>cloak(g),{ppu:140});const c=plane(2.8,4,mat(ct,.45,true),ct);c.scale.setScalar(1.3);c.position.set(-2.2,4*1.3/2+.6,.6);c.rotation.y=-.75;pg.add(c);
}
for(const [x,z,h] of [[13.5,-6,14],[15.8,-1,15],[13,-16,14],[16,-12,15],[14.5,6,13]]){
  const pg=B.pop(root,[x,0,z],[-1,0],1.6+R()*.2,1.1,4);
  const t=tex(1,h,(g,w,hh)=>bp(g,p=>p.rect(.35,0,.3,hh),'#5a4a3a',['#4a3a2a','#6a5a4a'],[0,0,w,hh]),{ppu:50});
  const tr=plane(1,h,mat(t,.5,true),t);tr.position.y=h/2;tr.rotation.y=Math.PI/2;pg.add(tr);
  const cw=6.5,ch=5,bl=[...Array(8)].map(()=>[cw/2+(R()-.5)*cw*.7,ch/2+(R()-.5)*ch*.5,1.1+R()*.9]);
  const ct=tex(cw,ch,g=>{bp(g,p=>{for(const [bx,by,r] of bl){p.moveTo(bx+r,by);p.arc(bx,by,r,0,7)}},'#2e4a2e',['#3a5a3a','#1e3a24','#4a6a3a'],[0,0,cw,ch],60,0);
    for(let i=0;i<60;i++){g.fillStyle=R()<.7?'#f8f4e8':'#f0a040';g.beginPath();g.arc(.5+R()*(cw-1),.5+R()*(ch-1),.07,0,7);g.fill()}},{ppu:70});
  const cr=plane(cw,ch,mat(ct,.5,true),ct);cr.position.y=h-ch/2;cr.rotation.y=Math.PI/2;pg.add(cr);
}
const sun=B.light(new THREE.PointLight(0xfff8ec,0,70,1));
const at=new THREE.Object3D();at.position.set(-8,22,16);root.add(at);
let k=0;B.extra(2.5,1,e=>k=clamp(e,0,1));
const tmp=new THREE.Vector3();
return {liveShadows:true,tick(T){
  at.getWorldPosition(tmp);sun.position.copy(tmp);sun.intensity=.2*k;
  for(const q of roses)q.r.rotation.z=q.ph+Math.sin(T*.6+q.ph)*.5;
}};
},
caps:{
  A:'第4話「ヴィーナスの誕生」　サンドロ・ボッティチェリ　1485年頃',
  B:'海の泡から生まれた女神ヴィーナスが、ホタテ貝に乗って岸へ流れ着く。',
  C:'西風の神ゼフュロスが、頬をふくらませて風を送る。まわりに舞うのはバラの花。',
  D:'女神は片足に重心をかけ、少し体をひねって立つ。古代の彫刻にならった立ち姿だ。',
  E:'岸では季節の女神ホーラが、花模様の衣を広げて待っている。',
  F:'いまはフィレンツェのウフィツィ美術館にあり、世界中から人が見に訪れる。',
},
tour:[
  {t0:0,t1:6,f:u=>{const k=easeIO(u);return [V(0,40-6*k,46-6*k),V(0,3,-4)]},cap:'A'},
  {t0:6,t1:14.5,f:u=>{const a=-.95+1.9*easeIO(u);return [V(Math.sin(a)*42,18-5*u,Math.cos(a)*42-4),V(0,5,-2)]},cap:'B'},
  {t0:14.5,t1:21.5,f:u=>{const k=easeIO(u);return [V(-15+5*k,8,16-3*k),V(-5+2*k,8.2,3)]},cap:'C'},
  {t0:21.5,t1:28.5,f:u=>[V(0,6.2,29-1*u),V(0,5.6,-12)],cap:'D',frame:true,fov:25},
  {t0:28.5,t1:35.5,f:u=>{const k=easeIO(u);return [V(3+5*k,4.5,16-2*k),V(7,4,3)]},cap:'E'},
  {t0:35.5,t1:42,f:u=>{const k=easeIO(u);return [V(8-8*k,4.5+30*k,14+30*k),V(7-7*k,4-k,3-6*k)]},cap:'F'},
],
tourEnd:42,tourLoop:6,
});
}
