'use strict';
// 見開き1: ジョルジュ・スーラ《グランド・ジャット島の日曜日の午後》1884〜1886年
// 左に川(セーヌ)、右へ芝の土手。手前は木陰、奥は日なた。人物は横向き・正面向きの切り絵を奥へ何列も並べる。
// 畳み方: 人物・木・舟はそれぞれ倒してもページからはみ出さない側へ倒し、最後に対岸と空の背景板を手前へ倒す(裏に題名)。
{
const SH=['#2f5a2a','#3d6b2e','#24461f','#4a7a34','#355c5a','#2b4a6a','#5a7a2a','#1f3a4a'];
const SUN=['#9fc24a','#c8d860','#7fae3e','#e2e07a','#b7cc52','#f0d878','#8fbf5a','#d8a85a'];
const RIV=['#5f9fd0','#8ab8e0','#3f7fb8','#a9cfe8','#e8e0b0','#4a90c8','#7aa8d8','#f0f0e0'];
const FOL=['#2c5228','#3f6e30','#1e3a28','#55803a','#2a4a5a','#6a8a3a','#1a2e3a'];
const BARK=['#4a3a2a','#6a4a30','#2e2a2a','#5a5040','#3a3a4a'];
// 木の位置 [x, z, 高さ]
const TREES=[[-3.5,7,18],[4.5,-1,20],[10.5,9,19],[11.5,-12,21],[-1,-15,17],[12.5,2,20],[6.5,-21,18],[-5.5,-7,16],[1,18,22]];
const bankX=z=>-16+9*(28-z)/56;   // 川岸の線(手前 x=-16、奥 x=-7)
// 点描で塗る切り絵: 地色で塗り、同系色と補色の点を散らす。縁は紙色
function pc(g,path,base,cols,box,den=300,r=.028){
  g.save();g.beginPath();path(g);g.lineJoin='round';g.strokeStyle=PAPER;g.lineWidth=.05;g.stroke();
  g.fillStyle=base;g.fill();g.clip();dots(g,box[0],box[1],box[2],box[3],cols,box[2]*box[3]*den,r);g.restore();
}
const shade=(c,k)=>'#'+new THREE.Color(c).multiplyScalar(k).getHexString();
const tint=c=>[c,shade(c,.75),shade(c,1.25),shade(c,.55)];
// ---- 人物(f=1 で右向き、-1 で左向き。足元が y=0、背丈はおよそ 1.8) ----
function head(g,x,y,f,o){
  pc(g,p=>p.arc(x,y,.13,0,7),'#d8a882',['#e8b890','#c08a6a','#f0c8a0'],[x-.2,y-.2,.4,.4]);
  if(o.hat==='top')pc(g,p=>{p.rect(x-.17,y+.09,.34,.04);p.rect(x-.11,y+.12,.22,.26)},'#1a1a22',['#2a2a3a','#0a0a12','#3a2a4a'],[x-.2,y,.4,.5]);
  else if(o.hat==='bonnet')pc(g,p=>{p.ellipse(x-f*.02,y+.08,.17,.13,0,0,7);p.ellipse(x+f*.05,y+.17,.16,.05,0,0,7)},o.hc||'#3a2a3a',tint(o.hc||'#3a2a3a'),[x-.25,y-.1,.5,.4]);
  else if(o.hat==='straw')pc(g,p=>{p.ellipse(x,y+.11,.24,.04,0,0,7);p.rect(x-.1,y+.11,.2,.1)},'#e0c070',['#f0d890','#c8a050','#fff0b0'],[x-.3,y,.6,.3]);
  else pc(g,p=>p.arc(x-f*.03,y+.04,.13,Math.PI*.9,Math.PI*2.1),o.hc||'#3a2418',['#4a2e1e','#2a1a10'],[x-.2,y-.1,.4,.3]);
}
function lady(g,x,f,o={}){
  const c=o.col||'#2a2a4a';
  pc(g,p=>{p.moveTo(x+f*.42,0);p.lineTo(x-f*.5,0);p.quadraticCurveTo(x-f*.82,.7,x-f*.42,1.1);p.lineTo(x-f*.12,1.12);p.lineTo(x+f*.14,1.12);p.quadraticCurveTo(x+f*.3,.5,x+f*.42,0);p.closePath()},c,tint(c),[x-1,0,2,1.2]);
  pc(g,p=>{p.moveTo(x-f*.13,1.08);p.lineTo(x+f*.14,1.08);p.lineTo(x+f*.12,1.5);p.lineTo(x-f*.14,1.5);p.closePath()},o.top||c,tint(o.top||c),[x-.3,1,.6,.6]);
  pc(g,p=>p.rect(x-.05,1.48,.1,.1),'#d8a882',['#e8b890'],[x-.1,1.4,.2,.2]);
  head(g,x,1.68,f,{hat:o.hat||'bonnet',hc:o.hc});
  if(o.arm!==false)pc(g,p=>{p.moveTo(x-f*.02,1.46);p.lineTo(x+f*.06,1.46);p.lineTo(x+f*.3,1.1);p.lineTo(x+f*.24,1.06);p.closePath()},o.top||c,tint(o.top||c),[x-.4,1,.8,.6]);
  if(o.parasol){const px=x+f*(o.parasol==='back'?-.15:.05),py=2.25,pr=o.pr||.62;
    pc(g,p=>{p.rect(px-.015,1.1,.03,py-1.1)},'#3a2a20',['#2a1a10'],[px-.1,1,.2,1.4]);
    pc(g,p=>{p.moveTo(px-pr,py-.08);p.quadraticCurveTo(px,py+.42,px+pr,py-.08);p.quadraticCurveTo(px,py+.02,px-pr,py-.08)},o.pcol||'#c84a3a',tint(o.pcol||'#c84a3a'),[px-pr,py-.2,pr*2,.7]);}
  if(o.rod)pc(g,p=>{p.moveTo(x+f*.25,1.08);p.lineTo(x+f*1.9,1.9);p.lineTo(x+f*1.9,1.93);p.lineTo(x+f*.25,1.12);p.closePath()},'#3a2a20',['#2a1a10'],[x-2,1,4,1]);
}
function gent(g,x,f,o={}){
  const c=o.col||'#1e1e2a';
  for(const s of [-1,1])pc(g,p=>{p.moveTo(x+s*.05-.07,0);p.lineTo(x+s*.05+.07,0);p.lineTo(x+s*.04+.07,.85);p.lineTo(x+s*.04-.07,.85);p.closePath()},'#2a2a34',['#3a3a4a','#1a1a24'],[x-.3,0,.6,.9]);
  pc(g,p=>{p.moveTo(x-.2,.62);p.lineTo(x+.18,.62);p.lineTo(x+.17,1.5);p.lineTo(x-.17,1.5);p.closePath()},c,tint(c),[x-.3,.5,.6,1.1]);
  pc(g,p=>p.rect(x-.05,1.48,.1,.09),'#d8a882',['#e8b890'],[x-.1,1.4,.2,.2]);
  head(g,x,1.68,f,{hat:o.hat||'top'});
  if(o.cane)pc(g,p=>{p.moveTo(x+f*.22,1.05);p.lineTo(x+f*.5,0);p.lineTo(x+f*.54,0);p.lineTo(x+f*.26,1.05);p.closePath()},'#3a2a20',['#2a1a10'],[x-.6,0,1.2,1.1]);
  if(o.pipe)pc(g,p=>p.rect(x+f*.1,1.62,f*.14,.03),'#3a2a20',['#2a1a10'],[x-.3,1.5,.6,.2]);
}
function sitter(g,x,f,o={}){
  const c=o.col||'#3a2a4a';
  pc(g,p=>{p.moveTo(x-f*.42,0);p.lineTo(x+f*.72,0);p.quadraticCurveTo(x+f*.45,.35,x+f*.12,.62);p.lineTo(x-f*.18,.62);p.quadraticCurveTo(x-f*.45,.35,x-f*.42,0);p.closePath()},c,tint(c),[x-.9,0,1.8,.7]);
  pc(g,p=>{p.moveTo(x-f*.16,.6);p.lineTo(x+f*.14,.6);p.lineTo(x+f*.12,1.02);p.lineTo(x-f*.14,1.02);p.closePath()},o.top||c,tint(o.top||c),[x-.3,.5,.6,.6]);
  head(g,x,1.2,f,{hat:o.hat||'bonnet',hc:o.hc});
  if(o.parasol){const px=x-f*.1,py=1.75,pr=.55;pc(g,p=>p.rect(px-.015,.8,.03,py-.8),'#3a2a20',['#2a1a10'],[px-.1,.7,.2,1.2]);
    pc(g,p=>{p.moveTo(px-pr,py-.08);p.quadraticCurveTo(px,py+.38,px+pr,py-.08);p.quadraticCurveTo(px,py+.02,px-pr,py-.08)},o.pcol||'#e8a050',tint(o.pcol||'#e8a050'),[px-pr,py-.2,pr*2,.6])}
  if(o.fan)pc(g,p=>{p.moveTo(x+f*.18,.9);p.arc(x+f*.18,.9,.22,f>0?-.6:Math.PI-.6,f>0?.6:Math.PI+.6);p.closePath()},'#e86a4a',['#f08a6a','#c84a3a'],[x-.5,.6,1,.6]);
}
function recliner(g,x,f){
  pc(g,p=>{p.moveTo(x-f*1.1,0);p.lineTo(x+f*.6,0);p.lineTo(x+f*.6,.22);p.quadraticCurveTo(x+f*.2,.3,x-f*.1,.42);p.lineTo(x-f*.95,.25);p.closePath()},'#d8d0b0',['#f0e8c8','#c8b890','#e8d8a0','#a8a8c0'],[x-1.3,0,2.6,.5]);
  pc(g,p=>{p.moveTo(x+f*.3,.3);p.lineTo(x+f*.65,.3);p.lineTo(x+f*.55,.8);p.lineTo(x+f*.25,.78);p.closePath()},'#e8e0c8',['#fff8e0','#d8c8a0','#c8b8a0'],[x-1,.2,2,.7]);
  pc(g,p=>{p.moveTo(x+f*.3,.35);p.lineTo(x+f*.42,.35);p.lineTo(x+f*.45,0);p.lineTo(x+f*.33,0);p.closePath()},'#d8a882',['#e8b890'],[x-1,0,2,.5]);
  head(g,x+f*.45,.95,f,{hat:'straw'});
  pc(g,p=>p.rect(x+f*.55,.9,f*.18,.035),'#3a2a20',['#2a1a10'],[x-1,.8,2,.2]);
}
function child(g,x,f,o={}){
  g.save();g.translate(x,0);g.scale(.66,.66);
  const c=o.col||'#f2f0e8';
  pc(g,p=>{p.moveTo(-.38,.45);p.lineTo(.38,.45);p.lineTo(.18,1.45);p.lineTo(-.18,1.45);p.closePath()},c,['#ffffff','#e8e0c8','#f0e8a0','#c8d0e8'],[-.5,.4,1,1.1]);
  for(const s of [-1,1])pc(g,p=>p.rect(s*.12-.05,0,.1,.48),'#d8a882',['#e8b890'],[-.3,0,.6,.5]);
  pc(g,p=>p.rect(-.05,1.42,.1,.1),'#d8a882',['#e8b890'],[-.1,1.4,.2,.2]);
  head(g,0,1.62,f,{hat:o.hat||'straw'});
  g.restore();
}
function dog(g,x,f,c='#1a1a22'){
  pc(g,p=>{p.ellipse(x,.38,.42,.15,0,0,7);p.ellipse(x+f*.45,.5,.14,.11,0,0,7);p.rect(x-.32,0,.06,.32);p.rect(x+.26,0,.06,.32);p.moveTo(x-f*.4,.42);p.lineTo(x-f*.65,.62);p.lineTo(x-f*.6,.66);p.lineTo(x-f*.38,.48);p.closePath()},c,tint(c),[x-.8,0,1.6,.8]);
}
function monkey(g,x,f){
  pc(g,p=>{p.ellipse(x,.28,.16,.12,0,0,7);p.arc(x+f*.15,.42,.08,0,7);p.rect(x-.12,0,.04,.22);p.rect(x+.08,0,.04,.22)},'#4a3020',['#6a4028','#2a1a10'],[x-.3,0,.6,.6]);
  g.save();g.strokeStyle='#4a3020';g.lineWidth=.04;g.beginPath();g.moveTo(x-f*.15,.25);g.bezierCurveTo(x-f*.45,.1,x-f*.4,.6,x-f*.2,.55);g.stroke();g.restore();
}
function boat(g,o={}){
  pc(g,p=>{p.moveTo(.1,.4);p.lineTo(3.4,.4);p.quadraticCurveTo(3.2,0,2.8,0);p.lineTo(.5,0);p.quadraticCurveTo(.2,.05,.1,.4);p.closePath()},o.hull||'#e8e0d0',['#fff8e8','#c8c0b0','#e8b880'],[0,0,3.5,.5]);
  if(o.sail){pc(g,p=>{p.moveTo(1.6,.45);p.lineTo(1.6,3.4);p.lineTo(3.0,.55);p.closePath()},'#f4f0e4',['#ffffff','#e8e0c0','#f0e8a0','#c8d8e8'],[1.5,.4,1.6,3.1]);
    pc(g,p=>{p.moveTo(1.5,.55);p.lineTo(1.5,2.6);p.lineTo(.6,.6);p.closePath()},'#f4f0e4',['#ffffff','#e8e0c0','#c8d8e8'],[.5,.5,1.1,2.2]);
    pc(g,p=>p.rect(1.53,.4,.05,3.1),'#5a4a3a',['#3a2a1a'],[1.4,.4,.3,3.2]);}
  else for(const x of [1.2,2.2]){pc(g,p=>{p.rect(x-.12,.4,.24,.4);p.arc(x,.95,.11,0,7)},'#e8e0d0',['#fff8e8','#f08a4a','#e8b880'],[x-.2,.4,.4,.7]);
    pc(g,p=>{p.moveTo(x,.6);p.lineTo(x+1,-.1);p.lineTo(x+1.03,-.07);p.lineTo(x+.03,.63);p.closePath()},'#8a6a4a',['#6a4a2a'],[x-.1,-.2,1.3,.9])}
}
BOOK.add({
no:1,name:'グランド・ジャット島の日曜日の午後',seed:18841886,
desc:{
  orig:"Un dimanche après-midi à l'Île de la Grande Jatte",
  artist:'ジョルジュ・スーラ　1884〜1886年',
  medium:'油彩・カンヴァス　207.5 × 308.1 cm　シカゴ美術館（アメリカ）',
  paras:[
    'パリの西、セーヌ川の中州グランド・ジャット島。日曜日の午後、着飾った人びとが川辺の木陰でくつろぐ。スーラは二年近くこの島に通い、数十枚の下絵を重ねてこの大作を仕上げた。',
    '絵の具をパレットで混ぜずに、小さな色の点を並べて描いている。近くで見ると点の集まり、離れて見ると目の中で色が混ざり合う。のちに「点描」と呼ばれる描き方だ。',
    '1886年、最後の印象派展に出品された。人物はみな横顔か正面向きで、時間が止まったように静か。猿を連れた婦人も、日傘も、草の上の犬も、切り絵のように置かれている。',
  ],
  points:['小さな色の点が、目の中で混ざり合う','木陰の暗い緑と、日なたの明るい黄緑','猿を連れた婦人、釣りをする女性、白い服の少女'],
  foot:'―　右のページで、日曜日の川辺が立ち上がります　―',
},
plate:'ジョルジュ・スーラ《グランド・ジャット島の日曜日の午後》1884〜86年<br>木陰の土手から、川と日なたの芝を見た構図',
ground(g,W,H,{X,Z,S}){
  groundClip(g,X,Z,1.2,()=>{
    // 芝: 手前は木陰、奥は日なた
    const gr=g.createLinearGradient(0,Z(28),0,Z(-28));gr.addColorStop(0,'#2f5a2a');gr.addColorStop(.32,'#3f6a2e');gr.addColorStop(.42,'#8fb848');gr.addColorStop(1,'#a8c858');
    g.fillStyle=gr;g.fillRect(0,0,W,H);
    for(let i=0;i<52000;i++){const x=R()*W,y=R()*H,z=y/H*56-28,sun=z<9&&R()>.15;
      g.fillStyle=pick(sun?SUN:SH);g.beginPath();g.arc(x,y,3.2+R()*2.4,0,7);g.fill()}
    // 木の影
    for(const [x,z,h] of TREES){g.fillStyle='rgba(30,60,40,.55)';g.beginPath();g.ellipse(X(x+2.5),Z(z+1.2),4.6*S,2.6*S,.2,0,7);g.fill();
      for(let i=0;i<900;i++){const a=R()*7,r=Math.sqrt(R());g.fillStyle=pick(SH);g.beginPath();g.arc(X(x+2.5+Math.cos(a)*4.4*r),Z(z+1.2+Math.sin(a)*2.4*r),3+R()*2,0,7);g.fill()}}
    // 川
    g.beginPath();g.moveTo(0,0);g.lineTo(X(bankX(-28)),Z(-28.5));g.lineTo(X(bankX(28)),Z(28.5));g.lineTo(0,H);g.closePath();
    g.save();g.fillStyle='#5a98c8';g.fill();g.clip();
    for(let i=0;i<26000;i++){g.fillStyle=pick(RIV);const x=R()*X(-6),y=R()*H;g.fillRect(x,y,9+R()*8,3.2)}
    g.restore();
    g.strokeStyle='rgba(240,230,190,.85)';g.lineWidth=5;g.beginPath();g.moveTo(X(bankX(-28)),Z(-28));g.lineTo(X(bankX(28)),Z(28));g.stroke();
  });
  groundTitle(g,W,H,'グランド・ジャット島の日曜日の午後　―　ジョルジュ・スーラ　1884〜86年　パリ郊外、セーヌ川',"Un dimanche après-midi à l'Île de la Grande Jatte");
},
build(B){
const root=B.root;
// ================= 背景板: 対岸と空 =================
const bd=backdrop(B,{title:'グランド・ジャット島',titleSize:132,orig:"Un dimanche après-midi à l'Île de la Grande Jatte",dot:'#c84a3a',emi:.55,
  edge:(p,W,H)=>{p.moveTo(0,H);p.lineTo(W,H);p.lineTo(W,90);for(let x=W;x>0;x-=64)p.quadraticCurveTo(x-32,40+R()*60,x-64,70+R()*50);p.closePath()},
  draw:(g,W,H)=>{
    const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#c8dce6');gr.addColorStop(.75,'#e8ead0');gr.addColorStop(1,'#f0e8c8');g.fillStyle=gr;g.fillRect(0,0,W,H);
    for(let i=0;i<30000;i++){g.fillStyle=pick(['#d8e4e8','#e8ecd8','#c0d4e4','#f0ecd0','#b0c8dc','#f4e0c0']);g.beginPath();g.arc(R()*W,R()*H,3+R()*2.5,0,7);g.fill()}
    // 対岸(左): 低い木立と家と工場の煙突
    const hz=1080;
    g.fillStyle='#7a9a7a';g.beginPath();g.moveTo(0,hz+40);for(let x=0;x<=W*.55;x+=40)g.lineTo(x,hz-40-Math.sin(x*.02)*25-R()*30);g.lineTo(W*.55,hz+40);g.closePath();g.fill();
    for(let i=0;i<5000;i++){const x=R()*W*.55,y=hz-90+R()*130;g.fillStyle=pick(['#6a8a6a','#8aa88a','#5a7a7a','#9ab08a','#7a8aa0']);g.beginPath();g.arc(x,y,3+R()*2,0,7);g.fill()}
    for(const [x,w,h] of [[260,120,70],[520,80,110],[700,150,60]]){g.fillStyle='#d8c8b0';g.fillRect(x,hz-h,w,h);dots(g,x,hz-h,w,h,['#e8d8c0','#c8b098','#f0e0d0','#b8a8c0'],w*h/30,3)}
    g.fillStyle='#a89888';g.fillRect(900,hz-170,18,170);
    // 水面(遠く)
    g.fillStyle='#8ab8d8';g.fillRect(0,hz+30,W*.7,H-hz-30);
    for(let i=0;i<5000;i++){g.fillStyle=pick(RIV);g.fillRect(R()*W*.7,hz+30+R()*(H-hz-30),10,3)}
    // 島の奥の木立(右)
    for(let i=0;i<16000;i++){const x=W*.45+R()*W*.55,top=hz-180-Math.sin(x*.01)*60,y=top+R()*(H-top);
      g.fillStyle=pick(y>hz+60?SUN:FOL);g.beginPath();g.arc(x,y,3+R()*2.5,0,7);g.fill()}
    // 上の枝葉(左右の上の隅)
    for(const [cx,cy,r] of [[1800,0,420],[1500,40,260],[300,0,300]])for(let i=0;i<9000;i++){const a=R()*7,rr=r*Math.sqrt(R());g.fillStyle=pick(FOL);g.beginPath();g.arc(cx+Math.cos(a)*rr*1.3,cy+Math.sin(a)*rr*.6,3+R()*2.5,0,7);g.fill()}
  }});
// ================= 木 =================
TREES.forEach(([x,z,h],i)=>{
  const pg=B.pop(root,[x,0,z],fdir(z,h),1.5+i*.05,1.1,4+(i%2));
  const t=tex(1.2,h,(g,w,hh)=>pc(g,p=>{p.moveTo(.25,0);p.lineTo(.95,0);p.lineTo(.8,hh);p.lineTo(.4,hh);p.closePath()},'#4a3a2a',BARK,[0,0,w,hh],260,.04),{ppu:60});
  for(let k=0;k<2;k++){const m=plane(1.2,h,mat(t,.45,true),t);m.position.y=h/2;m.rotation.y=k*Math.PI/2;pg.add(m)}
  const cw=7+R()*3,ch=6+R()*2,blobs=[...Array(9)].map(()=>[cw/2+(R()-.5)*cw*.7,ch/2+(R()-.5)*ch*.6,1.4+R()*1.4]);
  const crown=new THREE.Group();crown.position.set(0,h-ch*.85,0);pg.add(crown);
  crossCard(crown,cw,ch,g=>pc(g,p=>{for(const [bx,by,r] of blobs){p.moveTo(bx+r,by);p.arc(bx,by,r,0,7)}},'#2c5228',FOL,[0,0,cw,ch],320,.06),2,.45,{ppu:70});
});
// ================= 人物と犬・猿 =================
const SC=2.1;
function person(x,z,w,h,draw,{sc=SC,ry=0,d=2.6}={}){
  const pg=B.pop(root,[x,0,z],fdir(z,h*sc),d+R()*.5,.8,1+(R()*2|0));
  const t=tex(w,h,draw,{ppu:150});const m=plane(w,h,mat(t,.6,true),t);m.scale.setScalar(sc);m.position.y=h*sc/2;m.rotation.y=ry;pg.add(m);return pg;
}
// 手前右: 猿を連れた婦人とシルクハットの紳士(左向き)
person(8.6,14,3.6,2.95,g=>{lady(g,1.4,-1,{col:'#24243e',top:'#2a2a4a',parasol:'back',pcol:'#3a3a5a',pr:.7,hat:'bonnet',hc:'#3a2a3a'});gent(g,2.4,-1,{col:'#1a1a26',cane:1});monkey(g,.35,-1)},{sc:2.3});
person(4.6,17,1.6,.8,g=>dog(g,.8,-1,'#a86a3a'),{sc:2.3});
// 手前左: 寝そべる男、座る婦人と紳士
person(-9,17.5,2.8,1.3,g=>recliner(g,1.4,1),{sc:2.4});
person(-6.2,15,3.2,2.2,g=>{sitter(g,1,1,{col:'#5a3a5a',fan:1,hat:'bonnet'});gent(g,2.2,1,{col:'#1e1e2a',cane:1})},{sc:2.3,ry:.25});
person(-2,19.5,1.6,.8,g=>dog(g,.8,-1),{sc:2.2});
// 真ん中: 白い服の少女と日傘の母(正面向き)
person(.2,2,2,2.6,g=>{lady(g,.65,1,{col:'#c84a3a',top:'#d86a4a',parasol:1,pcol:'#e8a050',hat:'bonnet',hc:'#3a2a20',arm:false});child(g,1.45,1,{col:'#f6f4ec',hat:'straw'})},{sc:2});
// 川岸: 釣りをする女性、座る人たち
person(-10.5,5,3.6,2.4,g=>lady(g,2.6,-1,{col:'#8a3a4a',top:'#a84a4a',rod:1,hat:'bonnet'}),{sc:2});
person(-4.2,9.5,2.6,2,g=>{sitter(g,.8,-1,{col:'#c8503a',hat:'bonnet',hc:'#c8503a'});sitter(g,1.9,1,{col:'#2a2a4a',parasol:1,pcol:'#e88a5a'})},{sc:2.1});
person(7.5,3,2.8,1.4,g=>{sitter(g,.8,1,{col:'#e8e0d0',hat:'bonnet',hc:'#3a3a5a'});sitter(g,2,-1,{col:'#3a5a8a',hat:'straw'})},{sc:2});
person(-7,-3.5,2,2,g=>sitter(g,1,1,{col:'#4a3a6a',parasol:1,pcol:'#e8c06a'}),{sc:1.9});
// 奥: 駆ける少女、日傘の二人連れ、兵士、トランペット
person(6,-4,1.4,1.4,g=>child(g,.7,1,{col:'#e86a4a',hat:'straw'}),{sc:1.9});
person(-1.5,-9.5,2.6,2.6,g=>{lady(g,.8,1,{col:'#e8a0a0',top:'#f0c0b0',parasol:1,pcol:'#f4f0e0',hat:'bonnet'});gent(g,1.8,-1,{col:'#2a2a3a'})},{sc:1.9});
person(11,-7,1.6,2.6,g=>lady(g,.8,-1,{col:'#3a5a8a',parasol:1,pcol:'#f0a060',hat:'bonnet'}),{sc:1.9});
person(3.5,-13,2,2.1,g=>{gent(g,.6,-1,{col:'#2a3a6a',hat:'straw'});gent(g,1.4,-1,{col:'#2a3a6a',hat:'straw'})},{sc:1.7});
person(9.5,-17,1.4,2,g=>gent(g,.7,-1,{col:'#c8a040',hat:'top'}),{sc:1.7});
person(-4,-19,2.6,2.5,g=>{lady(g,.8,1,{col:'#5a3a6a',parasol:1,pcol:'#e05a3a',hat:'bonnet'});child(g,1.8,1,{col:'#f4f0e8'})},{sc:1.6});
person(1.5,-23,2.4,2.4,g=>{lady(g,.7,1,{col:'#f0e0d0',parasol:1,pcol:'#c84a3a'});gent(g,1.6,1,{col:'#1e1e2a'})},{sc:1.5});
// ================= 舟 =================
function boatPiece(x,z,o,sc,d){
  const h=o.sail?3.5:1.2,pg=B.pop(root,[x,0,z],fdir(z,h*sc),d,.9,2);
  const t=tex(3.5,h,g=>boat(g,o),{ppu:120});const m=plane(3.5,h,mat(t,.6,true),t);m.scale.setScalar(sc);m.position.y=h*sc/2;m.rotation.y=-.35;pg.add(m);
}
boatPiece(-13.5,-5,{hull:'#e8e0d0'},1.6,2.9);
boatPiece(-11.5,-17,{sail:1,hull:'#f0e8e0'},1.5,2.7);
boatPiece(-14.5,-23,{sail:1,hull:'#c8503a'},1.3,2.6);
boatPiece(-15.5,10,{sail:1,hull:'#2a3a6a'},1.6,3);
return {};
},
caps:{
  A:'第1話「グランド・ジャット島の日曜日の午後」　ジョルジュ・スーラ　1884〜1886年',
  B:'パリ郊外、セーヌ川の中州。日曜日になると、パリの人びとが川を渡ってきて、木陰で過ごした。',
  C:'日傘の婦人は、ひもで猿をつないでいる。となりの紳士はシルクハットにステッキ。',
  D:'絵の具を混ぜず、色の点を並べて描いた。離れて見ると、点が目の中で混ざり合って一つの色になる。',
  E:'画面のまん中で、白い服の少女だけが、まっすぐこちらを見ている。',
  F:'スーラは二年近く島に通い、数十枚の下絵や習作を描いてから、この大作に取りかかった。',
},
tour:[
  {t0:0,t1:6,f:u=>{const k=easeIO(u);return [V(0,40-6*k,46-6*k),V(0,3,-4)]},cap:'A'},
  {t0:6,t1:14.5,f:u=>{const a=-.95+1.9*easeIO(u);return [V(Math.sin(a)*44,20-5*u,Math.cos(a)*44-4),V(0,4,-4)]},cap:'B'},
  {t0:14.5,t1:21.5,f:u=>{const k=easeIO(u);return [V(17-6*k,4.2,22-2*k),V(8.6-.6*k,3.6,13.6)]},cap:'C'},
  {t0:21.5,t1:28.5,f:u=>[V(.5,6.2,27-1*u),V(.5,4.4,-14)],cap:'D',frame:true,fov:22},
  {t0:28.5,t1:35.5,f:u=>{const k=easeIO(u);return [V(2.5-2*k,3.2,11-2*k),V(.6,3,2)]},cap:'E'},
  {t0:35.5,t1:42,f:u=>{const k=easeIO(u);return [V(.5,3.2+32*k,9+36*k),V(.5,3-k,2-6*k)]},cap:'F'},
],
tourEnd:42,tourLoop:6,
});
}
