'use strict';
// 見開き5: ピーテル・ブリューゲル(父)《バベルの塔》1563年(ウィーン)
// 塔は8段。段ごとに一つ下の段の上に入れ子で立ち上がるので、下から順にせり上がる(畳むと手前へ順に寝る)。
// まわりに町(小さな家の箱)、右手前に港と船、左手前に王の一行。最後に空と遠景の背景板を手前へ倒す(裏に題名)。
{
const TZ=-8,TX=-1.5;
const FIELD=['#8a9a5a','#a8a868','#6a7a4a','#b8a870','#7a8a5a','#9a8a5a'];
const SEA=['#5a8a8a','#6a9a98','#4a7a7a','#7aa8a0','#8ab0a8'];
function arches(g,w,h,o){
  // 一枚の柄: 石の壁に二つのアーチ、上に軒
  g.fillStyle=o.wall;g.fillRect(0,0,w,h);brush(g,0,0,w,h,o.cols,w*h*90,.25,.04,0,{jit:.3,alpha:.7});
  for(let y=.25;y<h;y+=.25){g.strokeStyle='rgba(60,40,20,.18)';g.lineWidth=.015;g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
  for(const cx of [w*.25,w*.75]){
    const aw=w*.32,ah=h*.62;
    g.fillStyle=o.rim;g.beginPath();g.moveTo(cx-aw/2-.06,0);g.lineTo(cx-aw/2-.06,ah-aw/2);g.arc(cx,ah-aw/2,aw/2+.06,Math.PI,0,true);g.lineTo(cx+aw/2+.06,0);g.closePath();g.fill();
    g.fillStyle=o.hole;g.beginPath();g.moveTo(cx-aw/2,0);g.lineTo(cx-aw/2,ah-aw/2);g.arc(cx,ah-aw/2,aw/2,Math.PI,0,true);g.lineTo(cx+aw/2,0);g.closePath();g.fill();
    g.fillStyle='rgba(255,230,180,.25)';g.fillRect(cx-aw/2,0,aw*.25,ah-aw/2);
    // 上の小窓
    g.fillStyle=o.hole;g.fillRect(cx-.07,h*.74,.14,.2);
  }
  g.fillStyle=o.rim;g.fillRect(0,h-.18,w,.18);g.fillStyle='rgba(40,25,10,.35)';g.fillRect(0,h-.24,w,.06);
}
const TONE=[
  {wall:'#a89070',cols:['#9a8262','#b8a080','#8a7258','#c0a888'],rim:'#c8b490',hole:'#3a2a20'},
  {wall:'#b09070',cols:['#a08060','#c0a080','#987858'],rim:'#d0b890',hole:'#3a2620'},
  {wall:'#b8906a',cols:['#a8805a','#c8a078','#b07a58'],rim:'#d8bc94',hole:'#3a2418'},
  {wall:'#c08a62',cols:['#b07a52','#d09a70','#a86a48'],rim:'#e0c098',hole:'#3a2218'},
];
BOOK.add({
no:5,name:'バベルの塔',seed:15630101,
desc:{
  orig:'De toren van Babel',
  artist:'ピーテル・ブリューゲル（父）　1563年',
  medium:'油彩・板　114 × 155 cm　ウィーン美術史美術館（オーストリア）',
  paras:[
    '旧約聖書の「創世記」。人びとは天に届く塔を建てようとした。神はその思い上がりを戒めて人びとの言葉をばらばらにし、塔は完成しなかった。',
    'ブリューゲルは、若いころローマで見たコロッセオを思わせるアーチの重なりで塔を描いた。塔の芯には岩山が残り、そのまわりに石を積み上げていく途中の姿だ。',
    '画面には、石を運ぶ人、クレーン、港に着く船まで、数えきれないほどの人びとが細かく描き込まれている。左下には、工事を見に来たニムロデ王の一行がいる。',
  ],
  points:['雲に届きそうな、何段も重なるアーチ','港の船、クレーン、働く小さな人びと','左下で工事を見に来た王の一行'],
  foot:'―　右のページで、塔が一段ずつせり上がります　―',
},
plate:'ピーテル・ブリューゲル（父）《バベルの塔》1563年<br>高い丘の上から、塔と町を見下ろした構図',
ground(g,W,H,{X,Z,S}){
  groundClip(g,X,Z,1.2,()=>{
    g.fillStyle='#8a9a5a';g.fillRect(0,0,W,H);
    // 畑のつぎはぎ
    for(let i=0;i<260;i++){g.save();g.translate(R()*W,R()*H);g.rotate((R()-.5)*.8);g.fillStyle=pick(FIELD);g.fillRect(-1.5*S,-1*S,(1+R()*3)*S,(.8+R()*2)*S);g.restore()}
    brush(g,0,0,W,H,FIELD,3000,24,5,0,{jit:3,alpha:.5});
    // 町の地面(塔のまわり)
    g.fillStyle='rgba(150,120,90,.85)';g.beginPath();g.ellipse(X(TX-2),Z(TZ+6),15*S,17*S,0,0,7);g.fill();
    // 道
    g.strokeStyle='#c8b48a';g.lineWidth=.6*S;g.beginPath();g.moveTo(X(-18),Z(24));g.quadraticCurveTo(X(-8),Z(12),X(TX),Z(TZ+9));g.stroke();
    // 右手前の港
    g.beginPath();g.moveTo(W,Z(-6));g.quadraticCurveTo(X(10),Z(0),X(9),Z(28));g.lineTo(W,H);g.closePath();
    g.save();g.fillStyle='#5a8a8a';g.fill();g.clip();brush(g,X(8),Z(-6),W,H,SEA,2500,40,5,0,{jit:.2});g.restore();
    g.strokeStyle='#d8c8a0';g.lineWidth=.3*S;g.beginPath();g.moveTo(W,Z(-6));g.quadraticCurveTo(X(10),Z(0),X(9),Z(28));g.stroke();
  });
  groundTitle(g,W,H,'バベルの塔　―　ピーテル・ブリューゲル（父）　1563年　ウィーン美術史美術館','De toren van Babel');
},
build(B){
const root=B.root;
// ================= 背景板: 空・雲・遠景 =================
backdrop(B,{title:'バベルの塔',orig:'De toren van Babel',dot:'#c08a62',emi:.42,
  draw:(g,W,H)=>{
    const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#7aa0c0');gr.addColorStop(.55,'#c8d8dc');gr.addColorStop(1,'#d8dcc8');g.fillStyle=gr;g.fillRect(0,0,W,H);
    for(let i=0;i<40;i++){const x=R()*W,y=60+R()*500,r=60+R()*120;g.fillStyle='rgba(250,250,245,.55)';for(let k=0;k<6;k++){g.beginPath();g.ellipse(x+(R()-.5)*r*2,y+(R()-.5)*r*.4,r*.7,r*.3,0,0,7);g.fill()}}
    const hz=820;
    // 遠い野と町(左)、海(右)
    g.fillStyle='#8aa098';g.fillRect(0,hz,W,H-hz);
    for(let i=0;i<500;i++){g.fillStyle=pick(['#7a9a80','#9aa888','#a8b090','#6a8a7a','#b8b898']);g.fillRect(R()*W*.6,hz+R()*(H-hz),20+R()*60,6+R()*10)}
    g.fillStyle='#6a9a98';g.fillRect(W*.6,hz,W*.4,H-hz);brush(g,W*.6,hz,W*.4,H-hz,SEA,800,30,4,0,{jit:.1});
    for(let i=0;i<60;i++){const x=150+R()*W*.45,y=hz+40+R()*200;g.fillStyle='#c8a888';g.fillRect(x,y,10,8);g.fillStyle='#a85a3a';g.fillRect(x-1,y-4,12,4)}
    g.fillStyle='#8a9aa8';g.beginPath();g.moveTo(0,hz+2);for(let x=0;x<=W*.6;x+=60)g.lineTo(x,hz-20-Math.sin(x*.01)*20-R()*10);g.lineTo(W*.6,hz+2);g.closePath();g.fill();
  }});
// ================= 塔 =================
const tiles=TONE.map(o=>{const t=tex(2,2.6,(g,w,h)=>arches(g,w,h,o),{ppu:90});t.wrapS=THREE.RepeatWrapping;return t});
const TERR=lam(0xc8b090,.35),ROCK=lam(0x8a6e4e,.3),WOODM=lam(0x5a3a22,.3);
let parent=root,r=9.2;const H=2.55;
const tiers=[];
for(let i=0;i<8;i++){
  const p=i===0?[TX,0,TZ]:[-.12,H,.05];
  const pg=B.pop(parent,p,[0,1],1.55+i*.2,.75,1.5+i*.2);
  const t=tiles[Math.min(3,i>>1)].clone();t.needsUpdate=true;
  const last=i===7,th=last?4.4:Math.PI*2,rt=r-.32;
  t.repeat.set(Math.round(2*Math.PI*r/2*(th/(Math.PI*2))),1);
  const cyl=new THREE.Mesh(new THREE.CylinderGeometry(rt,r,H,72,1,true,last?1.2:0,th),mat(t,.42));cyl.position.y=H/2;pg.add(shadowy(cyl));
  if(!last){const ring=new THREE.Mesh(new THREE.RingGeometry(rt-1.1,rt+.05,72).rotateX(-Math.PI/2),TERR);ring.position.y=H+.02;ring.receiveShadow=true;pg.add(ring)}
  else{
    // てっぺん: 工事中。足場と、内側の赤いれんが
    const inner=new THREE.Mesh(new THREE.CylinderGeometry(rt-.5,r-.5,H*.7,40,1,true),mat(tiles[3],.4));inner.position.y=H*.35;pg.add(inner);
    for(let k=0;k<7;k++){const a=1.2+k*.6,sx=Math.sin(a)*(r+.3),sz=Math.cos(a)*(r+.3);
      const pole=box(.08,3.2,.08,WOODM);pole.position.set(sx,H+1.2,sz);pg.add(pole)}
    const beam=box(r*1.7,.08,.08,WOODM);beam.position.set(.3,H+2.6,-1);beam.rotation.y=.5;pg.add(beam);
  }
  // 段の上の小屋とクレーンの車輪
  if(!last&&i%2===1)for(let k=0;k<3;k++){const a=R()*6.28,rr=rt-.55;
    const wh=new THREE.Mesh(new THREE.TorusGeometry(.45,.07,6,16),WOODM);wh.position.set(Math.sin(a)*rr,H+.5,Math.cos(a)*rr);wh.rotation.y=a;pg.add(wh);
    const hut=box(.6,.5,.5,TERR);hut.position.set(Math.sin(a+.3)*rr,H+.25,Math.cos(a+.3)*rr);pg.add(hut)}
  tiers.push(pg);parent=pg;r-=1.02;
}
// 塔の芯の岩山(左下に顔を出す)
{
  const rk=new THREE.Mesh(new THREE.DodecahedronGeometry(3,1),ROCK);
  const p=rk.geometry.attributes.position;for(let i=0;i<p.count;i++)p.setXYZ(i,p.getX(i)*(1+R()*.25),p.getY(i)*(1+R()*.25),p.getZ(i)*(1+R()*.25));rk.geometry.computeVertexNormals();
  rk.position.set(-5.6,1.6,5.4);rk.scale.set(.75,1,.5);tiers[0].add(shadowy(rk));
  const rk2=rk.clone();rk2.position.set(-3.9,1.4,6.3);rk2.scale.set(.5,.7,.35);tiers[1].add(rk2);
}
// ================= 町 =================
const WALLS=[0xd8c8a8,0xc8b490,0xe0d0b0,0xb8a080].map(c=>lam(c,.35)),ROOFS=[0xa84a32,0x8a3a2a,0xb85a3a,0x6a4a3a].map(c=>lam(c,.3));
const HB=new THREE.BoxGeometry(1,1,1),HR=new THREE.ConeGeometry(.75,1,4).rotateY(Math.PI/4);
function town(cx,cz,w,d,n,dl,ry0=0){
  const pg=B.pop(root,[cx,0,cz],[0,1],dl,.7,1);
  for(let i=0;i<n;i++){
    const x=(R()-.5)*w,z=(R()-.5)*d,hw=.7+R()*.7,hh=.6+R()*.9,hd=.7+R()*.6;
    const h=new THREE.Mesh(HB,pick(WALLS));h.scale.set(hw,hh,hd);h.position.set(x,hh/2,z);h.rotation.y=ry0+(R()-.5)*.5;pg.add(shadowy(h));
    const rf=new THREE.Mesh(HR,pick(ROOFS));rf.scale.set(hw,.6+R()*.4,hd);rf.position.set(x,hh+rf.scale.y/2,z);rf.rotation.y=h.rotation.y;pg.add(shadowy(rf));
  }
  return pg;
}
town(-10,5,8,7,30,2.5);town(-3,8,8,5,28,2.55);town(4.5,4,6,6,22,2.6);
town(-14,-6,5,10,22,2.45);town(-13,-18,6,6,16,2.4);town(8.5,-8,4,7,14,2.5);
town(-6,15,7,5,16,2.7);town(3,13,6,4,14,2.75);
// 小さな教会の塔
{const pg=B.pop(root,[-9,0,9],[0,1],2.8,.7,1);const t=box(1,4,1,WALLS[0]);t.position.y=2;pg.add(t);const sp=new THREE.Mesh(new THREE.ConeGeometry(.8,2,4).rotateY(Math.PI/4),ROOFS[3]);sp.position.y=5;pg.add(sp)}
// ================= 港と船 =================
function ship(g,o){
  cut(g,p=>{p.moveTo(.2,.9);p.lineTo(3.8,.9);p.quadraticCurveTo(3.6,0,3,0);p.lineTo(.9,0);p.quadraticCurveTo(.3,.2,.2,.9);p.closePath()},'#5a3a22',['#6a4a2a','#4a2a18'],60,.3,.06,0,[0,0,4,1]);
  for(const [mx,mh] of [[1.4,3.4],[2.5,4.2],[3.3,2.6]]){
    cut(g,p=>p.rect(mx-.04,.9,.08,mh),'#3a2a1a');
    if(o.sails)cut(g,p=>{p.moveTo(mx-.6,.9+mh*.45);p.quadraticCurveTo(mx,.9+mh*.5,mx+.6,.9+mh*.45);p.lineTo(mx+.55,.9+mh*.9);p.quadraticCurveTo(mx,.9+mh*.95,mx-.55,.9+mh*.9);p.closePath()},'#e8e0cc',['#f4f0e0','#d0c8b0'],40,.2,.04,Math.PI/2,[mx-.7,.9,1.4,mh]);
  }
}
for(const [x,z,s,sails] of [[13,4,1.4,true],[15.5,12,1.2,false],[11.5,16,1.3,true],[14,-2,1,false],[16,20,1.1,true]]){
  const pg=B.pop(root,[x,0,z],[0,-1],2.2+R()*.3,.8,2);
  const t=tex(4,5.2,g=>ship(g,{sails}),{ppu:110});const m=plane(4,5.2,mat(t,.55,true),t);m.scale.setScalar(s);m.position.y=5.2*s/2;m.rotation.y=-.4+R()*.3;pg.add(m);
}
// 港のクレーン(踏み車)
{const pg=B.pop(root,[9.8,0,8],[0,-1],2.4,.8,2);const tw=box(1.2,3,1.2,WOODM);tw.position.y=1.5;pg.add(tw);const jib=box(.12,.12,4,WOODM);jib.position.set(0,3.2,1.5);jib.rotation.x=-.4;pg.add(jib);
  const wh=new THREE.Mesh(new THREE.TorusGeometry(.8,.1,6,18),WOODM);wh.position.set(.8,1.2,0);wh.rotation.y=Math.PI/2;pg.add(wh)}
// ================= 左手前: ニムロデ王の一行と石材 =================
function figure(g,x,o){
  const c=o.col;
  if(o.kneel)cut(g,p=>{p.moveTo(x-.3,0);p.lineTo(x+.35,0);p.lineTo(x+.25,.45);p.lineTo(x+.05,.9);p.lineTo(x-.2,.85);p.closePath()},c,[c,'#3a2a1a'],40,.2,.05,Math.PI/2,[x-.4,0,.8,1]);
  else cut(g,p=>{p.moveTo(x-.3,0);p.lineTo(x+.3,0);p.lineTo(x+.18,1.25);p.lineTo(x-.18,1.25);p.closePath()},c,[c,'#3a2a1a'],40,.2,.05,Math.PI/2,[x-.4,0,.8,1.3]);
  const hy=o.kneel?1.02:1.42;
  cut(g,p=>p.arc(x,hy,.14,0,7),'#e0b090');
  if(o.crown)cut(g,p=>{p.moveTo(x-.13,hy+.1);p.lineTo(x-.13,hy+.28);p.lineTo(x-.06,hy+.2);p.lineTo(x,hy+.3);p.lineTo(x+.06,hy+.2);p.lineTo(x+.13,hy+.28);p.lineTo(x+.13,hy+.1);p.closePath()},'#e8c040');
  else if(o.hat)cut(g,p=>{p.ellipse(x,hy+.1,.18,.07,0,0,7)},o.hat);
}
{
  const pg=B.pop(root,[-11,0,19],[0,-1],2.9,.8,1);
  const t=tex(5,1.8,g=>{figure(g,.6,{col:'#7a2a2a',hat:'#2a2a2a'});figure(g,1.2,{col:'#3a4a6a',hat:'#2a2a2a'});figure(g,1.9,{col:'#c8a040',crown:true});figure(g,2.6,{col:'#5a5a6a',hat:'#2a2a2a'});figure(g,3.4,{col:'#8a6a4a',kneel:true});figure(g,4.2,{col:'#6a5a4a',kneel:true})},{ppu:150});
  const m=plane(5,1.8,mat(t,.55,true),t);m.scale.setScalar(1.6);m.position.y=1.8*1.6/2;m.rotation.y=.3;pg.add(m);
  const ST=lam(0xd8ccb0,.35);
  for(let i=0;i<9;i++){const b=box(.8+R()*.6,.5,.6,ST);b.position.set(-1+R()*6,.25+(i>5?.5:0),1.2+R()*1.2);b.rotation.y=R();pg.add(b)}
}
const sun=B.light(new THREE.PointLight(0xfff4e0,0,80,1));
const at=new THREE.Object3D();at.position.set(-16,26,10);root.add(at);
let k=0;B.extra(2.5,1,e=>k=clamp(e,0,1));
const tmp=new THREE.Vector3();
return {tick(){at.getWorldPosition(tmp);sun.position.copy(tmp);sun.intensity=.6*k}};
},
caps:{
  A:'第5話「バベルの塔」　ピーテル・ブリューゲル（父）　1563年',
  B:'天まで届く塔を建てようとした人びと。旧約聖書の「創世記」に出てくる物語。',
  C:'塔の芯には岩山が残り、そのまわりに石を積んでいく。アーチの重なりは、ローマのコロッセオを思わせる。',
  D:'てっぺんは雲に届きそうだが、まだ工事の途中。神は人びとの言葉をばらばらにし、塔は完成しなかった。',
  E:'左手前には、工事を見に来たニムロデ王の一行。石工たちがひざまずいて迎えている。',
  F:'ブリューゲルはこの塔をもう一枚、小さく描いている。そちらはロッテルダムの美術館にあり、日本にも来たことがある。',
},
tour:[
  {t0:0,t1:6,f:u=>{const k=easeIO(u);return [V(0,44-6*k,48-6*k),V(-1,6,-6)]},cap:'A'},
  {t0:6,t1:14.5,f:u=>{const a=-.95+1.9*easeIO(u);return [V(Math.sin(a)*44+TX,22-4*u,Math.cos(a)*44+TZ),V(TX,9,TZ)]},cap:'B'},
  {t0:14.5,t1:21.5,f:u=>{const k=easeIO(u);return [V(-20+6*k,5+5*k,10+2*k),V(-6,4+4*k,TZ+4)]},cap:'C'},
  {t0:21.5,t1:28.5,f:u=>[V(-3,19,46-1*u),V(-1.5,11.5,-8)],cap:'D',frame:true,fov:30},
  {t0:28.5,t1:35.5,f:u=>{const k=easeIO(u);return [V(-6-2*k,4.2-1*k,27-1*k),V(-10.5,1.8,19)]},cap:'E'},
  {t0:35.5,t1:42,f:u=>{const k=easeIO(u);return [V(-8+8*k,3.2+36*k,26+20*k),V(-10.5+9*k,1.8+4*k,19-25*k)]},cap:'F'},
],
tourEnd:42,tourLoop:6,
});
}
