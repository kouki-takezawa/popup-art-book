'use strict';
// 見開き9: エドワード・ホッパー《ナイトホークス》1942年
// 手前は夜の通り。まん中にくさび形のガラス張りの食堂(左の角は丸い)。中にカウンター・丸椅子・コーヒー沸かし・四人。
// 奥の通りの向かいに、閉まった店と緑の日よけの窓が並ぶ建物の正面。
// 畳み方: 食堂と向かいの建物は奥へ倒し、最後に夜空の背景板を手前へ倒す(裏に題名)。
{
// 食堂の平面(x,z)。前面のガラスは z=0、左の角は半径2で丸め、左の壁は奥へ斜めに下がる
const RC=2,CX=-10.5,DZ=-6;
const PLAN=(()=>{const p=[[7,0],[CX,0]];const a0=Math.PI/2,a1=Math.atan2(-1,-1.2)+Math.PI*2;
  for(let i=1;i<=10;i++){const a=a0+(a1-a0)*i/10;p.push([CX+RC*Math.cos(a),-RC+RC*Math.sin(a)])}
  const e=p[p.length-1],d=[.64,-.77],t=(e[1]-DZ)/.77;p.push([e[0]+d[0]*t,DZ]);return p})();
const BACK_L=PLAN[PLAN.length-1][0];
function band(pts,y0,y1,m,out=0){
  const pos=[],idx=[];
  pts.forEach(([x,z],i)=>{pos.push(x,y0,z+out,x,y1,z+out)});
  for(let i=0;i<pts.length-1;i++){const a=i*2;idx.push(a,a+2,a+1,a+1,a+2,a+3)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  const uv=[];let L=0;pts.forEach((p,i)=>{if(i)L+=Math.hypot(p[0]-pts[i-1][0],p[1]-pts[i-1][1]);uv.push(L,0,L,1)});
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv.map((v,i)=>i%2?v:v/L),2));
  g.setIndex(idx);g.computeVertexNormals();return new THREE.Mesh(g,m);
}
function poly(pts,y,m){const s=new THREE.Shape();pts.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();
  const g=new THREE.ShapeGeometry(s).rotateX(-Math.PI/2);const me=new THREE.Mesh(g,m);me.position.y=y;return me}
const FLAT=(g,path,col)=>{g.save();g.beginPath();path(g);g.fillStyle=col;g.fill();g.restore()};
function hopperFig(g,kind){
  if(kind==='back'){ // 背を向けた男
    FLAT(g,p=>{p.moveTo(.3,.0);p.lineTo(1.3,0);p.lineTo(1.25,1.2);p.quadraticCurveTo(.8,1.45,.35,1.2);p.closePath()},'#4a5058');
    FLAT(g,p=>{p.moveTo(.35,1.15);p.quadraticCurveTo(.8,1.5,1.25,1.15);p.lineTo(1.2,.6);p.lineTo(.4,.6);p.closePath()},'#5a6068');
    FLAT(g,p=>p.ellipse(.8,1.55,.17,.2,0,0,7),'#c89a7a');
    FLAT(g,p=>{p.ellipse(.8,1.7,.32,.06,0,0,7);p.ellipse(.8,1.78,.19,.12,0,Math.PI,0,true)},'#3a3a40');
  }else if(kind==='man'){
    FLAT(g,p=>{p.moveTo(.35,0);p.lineTo(1.25,0);p.lineTo(1.2,1.25);p.lineTo(.4,1.25);p.closePath()},'#2a3448');
    FLAT(g,p=>{p.moveTo(.7,1.25);p.lineTo(.9,1.25);p.lineTo(.8,.85);p.closePath()},'#e8e4d8');
    FLAT(g,p=>p.ellipse(.82,1.55,.16,.2,0,0,7),'#d0a080');
    FLAT(g,p=>{p.ellipse(.82,1.71,.3,.06,0,0,7);p.ellipse(.82,1.79,.18,.12,0,Math.PI,0,true)},'#2a3040');
    FLAT(g,p=>{p.moveTo(.3,.95);p.lineTo(.05,.75);p.lineTo(.12,.68);p.lineTo(.4,.85);p.closePath()},'#2a3448');
    FLAT(g,p=>p.rect(.0,.74,.1,.025),'#f0f0e8');
  }else if(kind==='woman'){
    FLAT(g,p=>{p.moveTo(.4,0);p.lineTo(1.2,0);p.lineTo(1.1,1.2);p.lineTo(.5,1.2);p.closePath()},'#c8282a');
    FLAT(g,p=>{p.moveTo(.5,1.15);p.lineTo(1.1,1.15);p.lineTo(1.1,1.0);p.lineTo(.5,1.0);p.closePath()},'#a81e22');
    FLAT(g,p=>p.rect(.74,1.18,.12,.12),'#e8b898');
    FLAT(g,p=>p.ellipse(.8,1.47,.15,.19,0,0,7),'#ecc0a0');
    FLAT(g,p=>{p.ellipse(.84,1.55,.2,.16,0,0,7);p.ellipse(.95,1.42,.1,.17,0,0,7)},'#c8582a');
    FLAT(g,p=>{p.moveTo(.5,.95);p.lineTo(.25,.75);p.lineTo(.3,.68);p.lineTo(.56,.85);p.closePath()},'#ecc0a0');
    FLAT(g,p=>p.rect(.18,.74,.12,.06),'#e8d8a0');
  }else{ // 白い服の店員(身をかがめる)
    FLAT(g,p=>{p.moveTo(.4,0);p.lineTo(1.1,0);p.lineTo(1.05,1.0);p.quadraticCurveTo(.7,1.3,.35,1.0);p.closePath()},'#f2f0e8');
    FLAT(g,p=>{p.moveTo(.4,1.0);p.lineTo(.0,.85);p.lineTo(.05,.75);p.lineTo(.45,.85);p.closePath()},'#f2f0e8');
    FLAT(g,p=>p.ellipse(.55,1.32,.16,.19,0,0,7),'#e0b090');
    FLAT(g,p=>{p.moveTo(.38,1.42);p.lineTo(.72,1.42);p.lineTo(.7,1.56);p.lineTo(.4,1.56);p.closePath()},'#fafaf4');
    FLAT(g,p=>p.ellipse(.62,1.36,.12,.16,0,0,7),'#a8603a');
  }
}
BOOK.add({
no:9,name:'ナイトホークス',seed:19420121,
desc:{
  orig:'Nighthawks',
  artist:'エドワード・ホッパー　1942年',
  medium:'油彩・カンヴァス　84.1 × 152.4 cm　シカゴ美術館（アメリカ）',
  paras:[
    '夜更けのニューヨークの街角。ガラス張りの小さな食堂だけが、明るい光に満たされている。カウンターには帽子の男と赤い服の女、背を向けた男がひとり。白い服の店員が身をかがめる。',
    'ホッパーは「グリニッジ・アベニューの、二本の通りが交わる角にあった店から思いついた」と語っている。ただし、場面はかなり単純にし、店を大きくしたという。',
    'よく見ると、食堂には外へ出る扉が描かれていない。大都市の真ん中で、ガラス一枚をへだてて人びとが静かに隔てられている。完成した1942年のうちに、シカゴ美術館が買い取った。',
  ],
  points:['夜の街角に浮かぶ、ガラス張りの食堂','店の上の「PHILLIES」の看板','扉のない店と、ひとけのない通り'],
  foot:'―　右のページで、夜の街角が立ち上がります　―',
},
plate:'エドワード・ホッパー《ナイトホークス》1942年<br>通りの向かいの歩道から、食堂を見た構図',
ground(g,W,H,{X,Z,S}){
  groundClip(g,X,Z,1.2,()=>{
    g.fillStyle='#232b29';g.fillRect(0,0,W,H);brush(g,0,0,W,H,['#2a3330','#1e2624','#30393a','#262e2e'],3000,40,8,0,{jit:.3,alpha:.6});
    // 食堂のまわりの歩道
    g.fillStyle='#4a524a';g.beginPath();PLAN.forEach(([x,z],i)=>{const ox=x<CX?x-2.6:x,oz=z>-.1?z+2.6:z;i?g.lineTo(X(ox),Z(oz)):g.moveTo(X(ox+2.6),Z(oz))});g.lineTo(X(BACK_L-2.8),Z(DZ));g.lineTo(X(9.5),Z(DZ));g.lineTo(X(9.5),Z(2.6));g.closePath();g.fill();
    // 店の光が歩道と通りにこぼれる
    const lg=g.createLinearGradient(0,Z(0),0,Z(12));lg.addColorStop(0,'rgba(240,250,200,.85)');lg.addColorStop(.3,'rgba(200,220,160,.45)');lg.addColorStop(1,'rgba(200,220,160,0)');
    g.fillStyle=lg;g.beginPath();g.moveTo(X(-11),Z(0));g.lineTo(X(7),Z(0));g.lineTo(X(12),Z(12));g.lineTo(X(-15),Z(12));g.closePath();g.fill();
    g.strokeStyle='#6a706a';g.lineWidth=.12*S;g.beginPath();g.moveTo(X(-18),Z(2.6));g.lineTo(X(9.5),Z(2.6));g.stroke();
    // 向かいの歩道
    g.fillStyle='#3a4240';g.fillRect(X(-18),Z(-14),36*S,3*S);
  });
  groundTitle(g,W,H,'ナイトホークス　―　エドワード・ホッパー　1942年　シカゴ美術館','Nighthawks');
},
build(B){
const root=B.root;
// ================= 背景板: 夜の空と屋根の影 =================
backdrop(B,{title:'ナイトホークス',titleSize:150,orig:'Nighthawks',dot:'#c8282a',emi:.5,
  edge:(p,W,H)=>{p.moveTo(0,H);p.lineTo(W,H);p.lineTo(W,120);p.lineTo(W*.7,120);p.lineTo(W*.7,60);p.lineTo(W*.35,60);p.lineTo(W*.35,140);p.lineTo(0,140);p.closePath()},
  draw:(g,W,H)=>{
    g.fillStyle='#16201e';g.fillRect(0,0,W,H);brush(g,0,0,W,H,['#1a2624','#121a18','#20302c'],2500,60,10,Math.PI/2,{jit:.2});
    for(let i=0;i<5;i++){const x=i*420;g.fillStyle='#0e1614';g.fillRect(x,H*.1+i%2*80,360,H)}
    for(let i=0;i<30;i++){g.fillStyle=R()<.2?'#6a6a40':'#1e2a28';g.fillRect(R()*W,H*.2+R()*H*.6,40,60)}
  }});
// ================= 向かいの建物 =================
{
  const W=36,H=13,pg=B.pop(root,[0,0,-14],[0,-1],1.5,1.1,4);
  const t=tex(W,H,(g,w,h)=>{
    g.fillStyle='#5a3424';g.fillRect(0,0,w,h);brush(g,0,0,w,h,['#62382a','#4e2c1e','#6a4030','#5a3a2a'],2200,.5,.1,0,{jit:.2});
    // 1階: 閉まった店。大きな暗いショーウインドー
    g.fillStyle='#24342e';g.fillRect(0,0,w,4.6);
    for(let x=1;x<w-2;x+=5.5){g.fillStyle='#0e1614';g.fillRect(x,.6,4.6,3.4);g.fillStyle='rgba(200,220,170,.18)';g.fillRect(x+.3,.9,1.4,2.8);
      g.strokeStyle='#3a5a4a';g.lineWidth=.12;g.strokeRect(x,.6,4.6,3.4)}
    g.fillStyle='#8a8a7a';g.fillRect(12.4,1.2,1,.7);g.fillRect(12.6,1.9,.6,.3);
    // 2階以上: 緑の日よけを半分下ろした窓
    for(const y of [5.6,9.2])for(let x=1.2;x<w-1;x+=3.4){g.fillStyle='#1a1e18';g.fillRect(x,y,1.8,2.5);g.fillStyle='#4a7a5a';g.fillRect(x,y+2.5-(.8+R()*1.2),1.8,.8+R()*1.2);
      g.fillStyle='#8a5a40';g.fillRect(x-.15,y-.15,2.1,.15);g.strokeStyle='#d8c8a8';g.lineWidth=.06;g.strokeRect(x,y,1.8,2.5)}
    g.strokeStyle=PAPER;g.lineWidth=.14;g.strokeRect(0,0,w,h);
  },{ppu:56});
  const m=plane(W,H,mat(t,.32),null);m.position.y=H/2;pg.add(m);
  const SILL=lam(0x8a5a40,.3);for(let x=-16.8;x<17;x+=3.4)for(const y of [5.5,9.1]){const s=box(2.1,.15,.35,SILL);s.position.set(x+.9,y,.17);pg.add(s)}
}
// ================= 食堂 =================
const lit=new THREE.Object3D();
{
  const pg=B.pop(root,[0,0,0],[0,-1],1.75,1.1,3);
  const TEAL=lam(0x2f5a4e,.3),WOODB=lam(0x7a4a2a,.35),CREAM=new THREE.MeshLambertMaterial({color:0xf0e8b8,emissive:0x8a8460});
  const GLASS=new THREE.MeshLambertMaterial({color:0xdfffe0,emissive:0x506a50,transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide});
  const INNER=new THREE.MeshLambertMaterial({color:0xf4f0c0,emissive:0xb8b488,side:THREE.DoubleSide});
  const base=band(PLAN,0,1.25,lam(0x7a3a24,.3));base.material.side=THREE.DoubleSide;pg.add(shadowy(base));
  const sill=band(PLAN,1.25,1.4,TEAL,.08);sill.material.side=THREE.DoubleSide;pg.add(sill);
  pg.add(band(PLAN,1.4,4.6,GLASS));
  const fas=band(PLAN,4.6,5.7,TEAL,.04);fas.material.side=THREE.DoubleSide;pg.add(shadowy(fas));
  // 窓の縦桟
  for(let i=0;i<PLAN.length;i+=(i<2?1:3)){const [x,z]=PLAN[i];const b=box(.1,3.2,.1,TEAL);b.position.set(x,3,z);pg.add(b)}
  for(let x=-8;x<7;x+=3.4){const b=box(.1,3.2,.1,TEAL);b.position.set(x,3,0);pg.add(b)}
  // 屋根と床と奥の壁
  const roof=poly([...PLAN,[7,DZ]],5.7,lam(0x24302c,.25));roof.material.side=THREE.DoubleSide;pg.add(shadowy(roof));
  const ceil=poly([...PLAN,[7,DZ]],5.68,INNER);pg.add(ceil);
  const floor=poly([...PLAN,[7,DZ]],.05,new THREE.MeshLambertMaterial({color:0xc8b880,emissive:0x7a7050}));pg.add(floor);
  const bw=plane(7-BACK_L,5.7,INNER);bw.position.set((7+BACK_L)/2,2.85,DZ);pg.add(bw);
  const door=plane(1.6,3.6,lam(0x8a6a3a,.4));door.position.set(4.6,1.8,DZ+.02);pg.add(door);
  const rw=plane(6,5.7,lam(0x6a3a24,.3));rw.rotation.y=Math.PI/2;rw.position.set(7,2.85,-3);pg.add(rw);
  // カウンター(前面に沿って曲がる)
  const ctop=box(14.6,.12,1,WOODB);ctop.position.set(-2.3,1.9,-2.4);pg.add(ctop);
  const cfront=box(14.6,1.85,.12,lam(0x5a2a1a,.35));cfront.position.set(-2.3,.93,-1.95);pg.add(cfront);
  const cdiag=box(4,.12,1,WOODB);cdiag.position.set(-11.1,1.9,-4.2);cdiag.rotation.y=-.88;pg.add(cdiag);
  // 丸椅子
  const STL=lam(0x9a9a9a,.4),SEAT=lam(0x2a4a3a,.35);
  for(let x=-8.6;x<4.6;x+=1.35){const s=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,1.1,6),STL);s.position.set(x,.55,-1.2);pg.add(s);
    const c=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.14,14),SEAT);c.position.set(x,1.15,-1.2);pg.add(c)}
  // コーヒー沸かし(右奥)
  const URN=new THREE.MeshLambertMaterial({color:0xd8dcd8,emissive:0x707470});
  for(const x of [5.2,6.2]){const u=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,2,16),URN);u.position.set(x,2.9,-3.6);pg.add(shadowy(u));
    const cap=new THREE.Mesh(new THREE.SphereGeometry(.42,14,8,0,Math.PI*2,0,Math.PI/2),URN);cap.position.set(x,3.9,-3.6);pg.add(cap)}
  // 人物
  for(const [kind,x,z,s] of [['back',-6.3,-1.3,1.55],['man',.6,-1.35,1.6],['woman',2,-1.35,1.55],['clerk',-.4,-3.7,1.75]]){
    const t=tex(1.5,2,g=>hopperFig(g,kind),{ppu:150});const m=plane(1.5,2,mat(t,.75,true),t);m.scale.setScalar(s);m.position.set(x,(kind==='clerk'?.3:.62)+s,z);pg.add(m);
  }
  // 看板 PHILLIES
  const st=tex(11,1.5,(g,w,h)=>{g.fillStyle='#e8dcb8';g.fillRect(0,0,w,h);g.strokeStyle='#3a3a30';g.lineWidth=.06;g.strokeRect(.05,.05,w-.1,h-.1);
    g.save();g.scale(1,-1);g.fillStyle='#2a2a24';g.font=`bold .95px Georgia,serif`;g.textAlign='left';g.fillText('PHILLIES',3.2,-.38);g.restore();
    g.fillStyle='#8a5a2a';g.beginPath();g.ellipse(1.6,.75,1.2,.28,0,0,7);g.fill();g.fillStyle='#c84a2a';g.fillRect(1.9,.5,.3,.5);
    g.save();g.scale(1,-1);g.fillStyle='#2a2a24';g.font=`.42px Georgia,serif`;g.fillText('Only',9.1,-.82);g.font=`bold .6px Georgia,serif`;g.fillText('5¢',9.15,-.25);g.restore()},{ppu:100});
  const sign=plane(11,1.5,mat(st,.4));sign.position.set(.6,6.45,.05);pg.add(sign);
  const sb=box(11.2,.1,.2,TEAL);sb.position.set(.6,5.7,0);pg.add(sb);
  lit.position.set(-2,4.6,-2.5);pg.add(lit);
}
const lamp=B.light(new THREE.PointLight(0xf0ffd0,0,34,1.2));
let on=0;B.extra(3.2,.6,e=>on=clamp(e,0,1));
const tmp=new THREE.Vector3();
return {tick(T){lit.getWorldPosition(tmp);lamp.position.copy(tmp);lamp.intensity=on*(2.1+.03*Math.sin(T*40))}};
},
caps:{
  A:'第9話「ナイトホークス」　エドワード・ホッパー　1942年',
  B:'夜更けのニューヨーク。通りにはだれもいない。ガラス張りの食堂だけが明るい。',
  C:'店の上には葉巻の看板「PHILLIES」。一本5セントと書いてある。',
  D:'カウンターの四人は、言葉を交わしていないように見える。題の「ナイトホークス」は、夜ふかしをする人のこと。',
  E:'向かいの店は閉まっていて、暗いショーウインドーに、食堂の光がかすかに映る。',
  F:'ホッパーは、この食堂に出入りの扉を描かなかった。ガラス一枚で、内と外が分けられている。',
},
tour:[
  {t0:0,t1:6,f:u=>{const k=easeIO(u);return [V(0,40-6*k,46-6*k),V(0,2,-4)]},cap:'A'},
  {t0:6,t1:14.5,f:u=>{const a=.95-1.9*easeIO(u);return [V(Math.sin(a)*40,16-4*u,Math.cos(a)*40-4),V(-2,3,-4)]},cap:'B'},
  {t0:14.5,t1:21.5,f:u=>{const k=easeIO(u);return [V(8-4*k,5+3*k,14-4*k),V(.6,6.4,0)]},cap:'C'},
  {t0:21.5,t1:28.5,f:u=>[V(6,3.6,30-1*u),V(-2.5,3.9,-5)],cap:'D',frame:true,fov:25},
  {t0:28.5,t1:35.5,f:u=>{const k=easeIO(u);return [V(-14+8*k,3,2),V(-4+6*k,2.5,-14)]},cap:'E'},
  {t0:35.5,t1:42,f:u=>{const k=easeIO(u);return [V(-6+6*k,3+32*k,2+42*k),V(2-2*k,2.5+.5*k,-14+10*k)]},cap:'F'},
],
tourEnd:42,tourLoop:6,
});
}
