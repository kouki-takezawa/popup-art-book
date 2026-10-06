'use strict';
// 扉の見開き(表紙の次)。左ページは「はじめに」、右ページは紙の劇場。OP(js/opening.js)で表紙がひとりでに開いて立ち上がる。
// 幕(背景)→ 額縁の舞台口 → イーゼルの名画3枚 → 題名の帯 → パレットと絵筆、の順に立ち上がる。
{
const RED=['#8a1c22','#6e141a','#9c262c','#5a0e14'];
// 画素で描くカード(下端が y=0)。draw(g,W,H,P) は y 下向き、P = 1単位の画素数
function pcard(wu,hu,ppu,draw,emi=.5){
  const c=cv(Math.round(wu*ppu),Math.round(hu*ppu)),g=c.getContext('2d');draw(g,c.width,c.height,ppu);
  const t=new THREE.CanvasTexture(c);t.anisotropy=ANISO;const m=plane(wu,hu,mat(t,emi,true),t);m.position.y=hu/2;return m;
}
// 裏(畳むと上に来る面)を紙にする
function paperBack(m,wu,hu){
  const t=tex(wu,hu,(g,w,h)=>{g.fillStyle='#ece1c4';g.fillRect(0,0,w,h)},{ppu:8}),b=plane(wu,hu,mat(t,.3));
  m.material.side=THREE.FrontSide;b.material.side=THREE.FrontSide;b.rotation.y=Math.PI;b.position.copy(m.position);b.position.z-=.01;return b;
}
function goldText(g,s,x,y,font,fill='#7a1e1e'){
  g.font=font;g.lineJoin='round';g.lineWidth=Math.max(4,parseFloat(font)*.12);g.strokeStyle='#d4ad55';g.strokeText(s,x,y);g.fillStyle=fill;g.fillText(s,x,y);
}
BOOK.add({
no:0,title:true,name:'扉　名画の飛び出す絵本',seed:20261006,
desc:{orig:'',artist:'',medium:'',paras:[]},
left(g,W,H,S){
  g.textAlign='center';g.fillStyle='#8a6a2a';g.font=`${1.1*S}px ${FONT}`;g.fillText('は じ め に',W/2,14*S);
  g.strokeStyle='#b8a47a';g.lineWidth=.06*S;g.beginPath();g.moveTo(W/2-5*S,15.6*S);g.lineTo(W/2+5*S,15.6*S);g.stroke();
  g.fillStyle='#3a2e1e';g.font=`${1.1*S}px ${FONT}`;
  ['この本には、西洋の名画が十枚、','紙の立体になって綴じられています。','','ページをめくり、絵を'+TAP_WORD+'すると、','絵が立ち上がり、','近くをめぐって案内します。','','どうぞ、ごゆっくり。'].forEach((s,i)=>g.fillText(s,W/2,(20+i*2.1)*S));
  g.fillStyle='#c9a24a';for(const x of [-2,0,2]){g.beginPath();g.arc(W/2+x*S,40*S,.22*S,0,7);g.fill()}
},
ground(g,W,H,{X,Z,S}){
  groundClip(g,X,Z,1.2,()=>{
    // 奥は舞台の床板、手前は赤い絨毯
    g.fillStyle='#6a4426';g.fillRect(0,0,W,Z(4));
    for(let z=-28;z<4;z+=2.2){g.fillStyle='rgba(30,16,6,.45)';g.fillRect(0,Z(z),W,.12*S)}
    brush(g,0,0,W,Z(4),['#7a5030','#5a381e','#86603a'],900,40,3,0,{jit:.05,alpha:.35});
    g.fillStyle='#3a1a10';g.fillRect(0,Z(4),W,.5*S);
    g.fillStyle='#6e141a';g.fillRect(0,Z(4.5),W,H-Z(4.5));brush(g,0,Z(4.5),W,H-Z(4.5),RED,900,30,4,Math.PI/2,{jit:.1,alpha:.4});
    g.strokeStyle='#c9a24a';g.lineWidth=.15*S;g.strokeRect(X(-15),Z(7),X(15)-X(-15),Z(25)-Z(7));
  });
  g.fillStyle='#d4ad55';g.textAlign='center';g.font='italic 30px Georgia,serif';g.fillText('A Pop-up Book of Masterpieces',W/2,H-60);
},
build(B){
const root=B.root;
// ---------- 幕 ----------
const cur=B.pop(root,[0,0,-22],[0,1],1.0,1.2,6);
const curtain=pcard(34,21,50,(g,W,H,P)=>{
  // 奥の暗い舞台と、真ん中のスポットライト
  g.fillStyle='#140e18';g.fillRect(0,0,W,H);
  const rg=g.createRadialGradient(W/2,H*.8,0,W/2,H*.8,W*.35);rg.addColorStop(0,'rgba(255,230,170,.55)');rg.addColorStop(1,'rgba(255,230,170,0)');g.fillStyle=rg;g.fillRect(0,0,W,H);
  // 左右に寄せた幕(ひだ)
  const drape=(x0,x1,dir)=>{
    for(let i=0;i<9;i++){
      const a=x0+(x1-x0)*i/9,b=x0+(x1-x0)*(i+1)/9,gr=g.createLinearGradient(a,0,b,0);
      gr.addColorStop(0,'#5a0e14');gr.addColorStop(.5,'#a8282e');gr.addColorStop(1,'#5a0e14');g.fillStyle=gr;
      g.beginPath();g.moveTo(a,0);g.lineTo(b,0);g.quadraticCurveTo(b+dir*P*1.2*(i/9),H*.55,b+dir*(i/9)*P*2.6,H);g.lineTo(a+dir*(i/9)*P*2.6,H);g.quadraticCurveTo(a+dir*P*1.2*(i/9),H*.55,a,0);g.fill();
    }
    g.fillStyle='#d4ad55';g.fillRect(dir>0?x1-P*1.4:x0,H*.55,P*1.4,P*.6);   // 留め紐
  };
  drape(0,W*.3,1);drape(W,W*.7,-1);
  // 上の飾り幕と金の房
  g.fillStyle='#7e1a20';g.beginPath();g.moveTo(0,0);g.lineTo(W,0);g.lineTo(W,P*3);
  for(let x=W;x>0;x-=W/8)g.quadraticCurveTo(x-W/16,P*5.2,x-W/8,P*3);g.closePath();g.fill();
  g.strokeStyle='#d4ad55';g.lineWidth=P*.35;g.beginPath();g.moveTo(0,P*3);for(let x=W;x>0;x-=W/8)g.quadraticCurveTo(x-W/16,P*5.2,x-W/8,P*3);g.stroke();
  g.strokeStyle=PAPER;g.lineWidth=8;g.strokeRect(0,0,W,H);
},.55);
cur.add(curtain);cur.add(paperBack(curtain,34,21));
// ---------- 額縁の舞台口(真ん中を切り抜く) ----------
const arch=B.pop(root,[0,0,-19],[0,1],1.25,1.2,5);
const archM=pcard(36,22,50,(g,W,H,P)=>{
  const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#e2c070');gr.addColorStop(.5,'#b88a34');gr.addColorStop(1,'#d4ad55');g.fillStyle=gr;g.fillRect(0,0,W,H);
  brush(g,0,0,W,H,['#f0d690','#a07828','#c9a24a'],1400,P*1.2,P*.12,0,{jit:3,alpha:.4});
  // 開口部(アーチ)を切り抜く
  g.globalCompositeOperation='destination-out';g.beginPath();g.moveTo(P*3,H);g.lineTo(P*3,P*8);g.quadraticCurveTo(P*3,P*3.2,W/2,P*3.2);g.quadraticCurveTo(W-P*3,P*3.2,W-P*3,P*8);g.lineTo(W-P*3,H);g.closePath();g.fill();
  g.globalCompositeOperation='source-over';
  g.strokeStyle='#6a4a14';g.lineWidth=P*.25;g.beginPath();g.moveTo(P*3,H);g.lineTo(P*3,P*8);g.quadraticCurveTo(P*3,P*3.2,W/2,P*3.2);g.quadraticCurveTo(W-P*3,P*3.2,W-P*3,P*8);g.lineTo(W-P*3,H);g.stroke();
  // 上の飾り板
  g.fillStyle='#f3ead2';g.beginPath();g.roundRect(W/2-P*7,P*.6,P*14,P*2.2,P*.5);g.fill();g.strokeStyle='#8a6a2a';g.lineWidth=P*.12;g.stroke();
  g.fillStyle='#6a4a14';g.textAlign='center';g.font=`italic ${P*1.15}px Georgia,serif`;g.fillText('Theatrum Pictorum',W/2,P*2.1);
  g.strokeStyle=PAPER;g.lineWidth=8;g.strokeRect(0,0,W,H);
},.5);
arch.add(archM);arch.add(paperBack(archM,36,22));
// ---------- イーゼルの名画3枚(絵は目次のサムネイル) ----------
const loader=new THREE.TextureLoader();
[[-11,'01',1.6,.9],[0,'08',1.75,1.1],[11,'04',1.9,.9]].forEach(([x,img,delay,s])=>{
  const p=B.pop(root,[x,0,-13],[0,1],delay,1.1,4),fw=9*s,fh=5.4*s,hu=13.5*s;
  const ea=pcard(fw+1,hu,60,(g,W,H,P)=>{
    const x0=P*.5,y0=P*.6,w=W-P,h=fh*P;   // 額縁(画素、上から)
    // イーゼルの脚と受け棚
    g.strokeStyle='#5a3a1e';g.lineCap='round';g.lineWidth=P*.35;
    g.beginPath();g.moveTo(W/2,P*.3);g.lineTo(P*1.2,H);g.moveTo(W/2,P*.3);g.lineTo(W-P*1.2,H);g.moveTo(W/2,y0+h);g.lineTo(W/2,H);g.stroke();
    g.fillStyle='#6a4626';g.fillRect(P*.6,y0+h,W-P*1.2,P*.45);
    const gr=g.createLinearGradient(x0,y0,x0+w,y0+h);gr.addColorStop(0,'#f0d080');gr.addColorStop(.5,'#b08030');gr.addColorStop(1,'#e2c070');
    g.fillStyle=gr;g.fillRect(x0,y0,w,h);g.fillStyle='#1a1410';g.fillRect(x0+P*.55,y0+P*.55,w-P*1.1,h-P*1.1);
    g.strokeStyle=PAPER;g.lineWidth=5;g.strokeRect(x0,y0,w,h);
  },.5);
  p.add(ea);
  const t=loader.load(`thumbs/${img}.jpg`,()=>invalidate());t.anisotropy=ANISO;
  const pic=plane(fw-1.1,fh-1.1,mat(t,.5));pic.position.set(0,hu-.6-fh/2,.03);p.add(pic);
});
// ---------- 題名の帯 ----------
const ban=B.pop(root,[0,0,-2],[0,1],2.2,1.1,3);
const banner=pcard(30,7.5,60,(g,W,H,P)=>{
  // 両端が折り返したリボン
  g.fillStyle='#b8a070';
  for(const d of [-1,1]){const x=d<0?P*.2:W-P*.2;g.beginPath();g.moveTo(x,P*2.4);g.lineTo(x+d*-P*3.6,P*2.4);g.lineTo(x+d*-P*3.6,H-P*.3);g.lineTo(x,H-P*.3);g.lineTo(x+d*-P*1.4,(P*2.4+H)/2);g.closePath();g.fill()}
  g.fillStyle='#f3ead2';g.fillRect(P*2.6,P*1.4,W-P*5.2,H-P*2.8);
  g.strokeStyle='#c9a24a';g.lineWidth=P*.18;g.strokeRect(P*3,P*1.8,W-P*6,H-P*3.6);
  g.textAlign='center';
  goldText(g,'名画の',W/2,P*3.2,`${P*1.4}px ${FONT}`,'#6a4a1a');
  goldText(g,'飛び出す絵本',W/2,P*5.6,`${P*2.6}px ${FONT}`);
  g.strokeStyle=PAPER;g.lineWidth=5;g.strokeRect(P*2.6,P*1.4,W-P*5.2,H-P*2.8);
},.55);
ban.add(banner);ban.add(paperBack(banner,30,7.5));
// ---------- パレットと絵筆 ----------
const pal=B.pop(root,[-12,0,15],[0,-1],2.6,1,2);
pal.add(pcard(8,5.6,60,(g,W,H,P)=>{
  g.fillStyle='#c8945a';g.beginPath();g.ellipse(W/2,H/2,W*.47,H*.45,-.15,0,7);g.fill();
  g.globalCompositeOperation='destination-out';g.beginPath();g.ellipse(W*.32,H*.62,P*.6,P*.45,0,0,7);g.fill();g.globalCompositeOperation='source-over';
  [['#2a5aa8',.5,.25],['#e8c030',.68,.3],['#c02828',.8,.5],['#2a8a4a',.66,.72],['#f4f0e4',.45,.8],['#6a3a9a',.3,.3]].forEach(([c,x,y])=>{g.fillStyle=c;g.beginPath();g.arc(W*x,H*y,P*.55,0,7);g.fill()});
  g.strokeStyle=PAPER;g.lineWidth=5;g.beginPath();g.ellipse(W/2,H/2,W*.47,H*.45,-.15,0,7);g.stroke();
}));
const jar=B.pop(root,[12,0,15],[0,-1],2.75,1,2);
jar.add(pcard(5,8,60,(g,W,H,P)=>{
  [['#c02828',-.9,-.18],['#2a5aa8',0,0],['#e8c030',.9,.18]].forEach(([c,dx,a])=>{
    g.save();g.translate(W/2+dx*P,H-P*3);g.rotate(a);g.fillStyle='#8a5a30';g.fillRect(-P*.18,-P*4.6,P*.36,P*4.6);
    g.fillStyle='#c0c0c8';g.fillRect(-P*.24,-P*5.2,P*.48,P*.7);g.fillStyle=c;g.beginPath();g.ellipse(0,-P*5.7,P*.3,P*.7,0,0,7);g.fill();g.restore();
  });
  g.fillStyle='#4a6a7a';g.fillRect(P*1,H-P*3.2,W-P*2,P*3.2);g.fillStyle='rgba(255,255,255,.25)';g.fillRect(P*1.4,H-P*3,P*.4,P*2.6);
  g.strokeStyle=PAPER;g.lineWidth=5;g.strokeRect(P*1,H-P*3.2,W-P*2,P*3.2);
}));
},
caps:{A:'名画の飛び出す絵本へ、ようこそ。'},
tour:[{t0:0,t1:8,f:u=>{const k=easeIO(u);return [V(-6+12*k,14,42),V(0,8,-10)]},cap:'A'}],
tourEnd:8,tourLoop:0,
});
}
