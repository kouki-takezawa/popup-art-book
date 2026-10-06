// ================= 共通部分 =================
// 作品ファイル(works/NN_名前.js)は BOOK.add({...}) で登録するだけ。組み立ては見開きを開くときに行う。
//
// BOOK.add の中身:
//   no            見開き番号(1〜10)            name   題名(ページ送りに出る)
//   seed          乱数の種(作品ごとに固定)
//   desc          左ページの解説 {orig, artist, medium, paras:[], points:[], foot}
//   plate         額縁の場面で出す題箋(HTML可)
//   ground(g,W,H,{X,Z,S})  右ページの地面を描く。X(x),Z(z) でページ座標→画素、S=1単位の画素数
//   build(B)      飛び出し部品を作る。戻り値 {tick(T,dt)} は開いている間だけ毎フレーム呼ばれる
//       B.root    右ページの座標(1ページ = x:-18..18, z:-28..28, +z が読者側, y が上)
//       B.pop(parent,[x,y,z],[dx,dz],delay,dur,layer)  平行四辺形の折りで立ち上がる群。
//                 [dx,dz] は倒れる向き(ページの内側へ)、layer は畳んだときの紙の重なり順
//       B.extra(delay,dur,f)  立ち上がりに合わせて f(0..1) を呼ぶ(ひさし・星の出など)
//       B.light(l)  作品専用の灯り(開いている間だけ点く)
//       B.no      見開き番号
//   caps          {キー: 字幕}
//   tour          [{t0,t1,f:u=>[カメラ位置,注視点],cap,frame,fov}] 右ページの座標で(fov はその場面だけの画角)
//   tourEnd, tourLoop  巡回の終わりと、繰り返すときの戻り先(秒)
//   tick や extra で位置・向き・大きさを変える部品には userData.live=true を付ける(動かない部品は同じマテリアルどうし1つの形にまとめるので、その対象から外す)
//   build の戻り値に liveShadows:true を付けると、tick で動く部品の影を開いている間も更新する(星や雲など影を落とす部品を動かす作品)
//
// 作品を足すときは、下の BOOK.list にも1行足す(目次とページ送りの題名は、作品ファイルを読む前にここから出す)
let seed=1;function R(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}
function reseed(n){seed=n%2147483647||1}
const pick=a=>a[R()*a.length|0];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const easeOutBack=k=>{const c1=1.4,c3=c1+1;return k<=0?0:k>=1?1:1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2)};
const easeIO=k=>(k=clamp(k,0,1),k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2);
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
function cv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function brush(g,x0,y0,w,h,cols,n,len,wid,ang,o={}){
  g.save();g.lineCap='round';
  const jit=o.jit??.6,bk=o.bend??.3,al=o.alpha??.9;
  for(let i=0;i<n;i++){
    const x=x0+R()*w,y=y0+R()*h;
    const a=(typeof ang==='function'?ang(x,y):ang)+(R()-.5)*jit;
    const l=len*(.6+R()*.8),c=Math.cos(a),s=Math.sin(a),b=(R()-.5)*l*bk;
    g.strokeStyle=pick(cols);g.globalAlpha=al*(.6+R()*.4);g.lineWidth=wid*(.6+R()*.8);
    g.beginPath();g.moveTo(x-c*l/2,y-s*l/2);g.quadraticCurveTo(x-s*b,y+c*b,x+c*l/2,y+s*l/2);g.stroke();
  }
  g.restore();
}
function clipRect(g,x,y,w,h,fn){g.save();g.beginPath();g.rect(x,y,w,h);g.clip();fn();g.restore()}
const PAPER='#f1e7cf';
// 紙の切り抜き: 縁を紙色で縁取り、地色で塗って筆致を重ねる
function cut(g,path,base,cols,n,len,wid,ang,box){
  g.save();g.beginPath();path(g);g.lineJoin='round';g.strokeStyle=PAPER;g.lineWidth=.07;g.stroke();
  g.fillStyle=base;g.fill();
  if(cols){g.clip();const b=box||[-5,-5,10,10];brush(g,b[0],b[1],b[2],b[3],cols,n,len,wid,ang)}
  g.restore();
}
// マウスで操作する端末では「クリック」、それ以外は「タップ」
const TAP_WORD=matchMedia('(hover:hover) and (pointer:fine)').matches?'クリック':'タップ';
const FONT='"Yu Mincho","Hiragino Mincho ProN","Noto Serif JP",serif';
function wrapText(g,text,x,y,maxW,lh){
  let line='';for(const ch of text){if(g.measureText(line+ch).width>maxW){g.fillText(line,x,y);y+=lh;line=ch}else line+=ch}
  if(line){g.fillText(line,x,y);y+=lh}return y;
}

// ================= three =================
const renderer=new THREE.WebGLRenderer({canvas:document.getElementById('c'),antialias:true});
renderer.setPixelRatio(Math.min(2,devicePixelRatio));
// 影は部品が動くときだけ計算し直す(js/book.js で shadowMap.needsUpdate を立てる)
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
const ANISO=renderer.capabilities.getMaxAnisotropy();
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0a090e);
scene.fog=new THREE.Fog(0x0a090e,90,220);
const camera=new THREE.PerspectiveCamera(50,1,.1,600);

// 単位(ページ座標)で描くテクスチャ。y は上向き。center で x の原点を中央に
function tex(wu,hu,draw,{center=false,ppu=120}={}){
  const S=Math.min(ppu,2048/Math.max(wu,hu));
  const c=cv(Math.max(4,Math.ceil(wu*S)),Math.max(4,Math.ceil(hu*S))),g=c.getContext('2d');
  g.save();g.translate(center?c.width/2:0,c.height);g.scale(c.width/wu,-c.height/hu);draw(g,wu,hu);g.restore();
  const t=new THREE.CanvasTexture(c);t.anisotropy=ANISO;return t;
}
function mat(t,emi=.45,alpha=false){
  return new THREE.MeshLambertMaterial({map:t,emissive:new THREE.Color(emi,emi,emi),emissiveMap:t,side:THREE.DoubleSide,alphaTest:alpha?.5:0});
}
function shadowy(m,t,alpha){m.castShadow=true;m.receiveShadow=true;if(alpha&&t)m.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5});return m}
function plane(w,h,material,alphaTex){return shadowy(new THREE.Mesh(new THREE.PlaneGeometry(w,h),material),alphaTex,!!alphaTex)}
function quad(a,b,c,d){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...b,...c,...d],3));g.setAttribute('uv',new THREE.Float32BufferAttribute([0,1,1,1,1,0,0,0],2));g.setIndex([0,3,2,0,2,1]);g.computeVertexNormals();return g}
function tri(a,b,c){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...b,...c],3));g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,.5,1,1,0],2));g.computeVertexNormals();return g}
function box(w,h,d,m){return shadowy(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m))}
const lam=(c,e=.25)=>new THREE.MeshLambertMaterial({color:c,emissive:new THREE.Color(c).multiplyScalar(e)});

// ================= 作品で使い回す部品 =================
// 立つカード(下端が y=0)。draw は単位座標(y 上向き)、x は 0..wu
function cardMesh(wu,hu,draw,emi=.5,o){const t=tex(wu,hu,draw,o);const m=plane(wu,hu,mat(t,emi,true),t);m.position.y=hu/2;return m}
// 十字差し(n 枚を中心で差し込んだカード)。木など、どこから見ても厚みがあるもの
function crossCard(parent,wu,hu,draw,n=2,emi=.5,o){
  const t=tex(wu,hu,draw,o),m0=mat(t,emi,true);
  for(let i=0;i<n;i++){const m=plane(wu,hu,m0,t);m.position.y=hu/2;m.rotation.y=i*Math.PI/n;parent.add(m)}
}
// 点描(スーラなど)
function dots(g,x,y,w,h,cols,n,r){for(let i=0;i<n;i++){g.fillStyle=pick(cols);g.beginPath();g.arc(x+R()*w,y+R()*h,r*(.6+R()*.7),0,7);g.fill()}}
// やわらかな光の玉(加算合成のスプライト)
function glowSprite(rgb='255,200,90',s=4){
  const c=cv(256,256),g=c.getContext('2d'),rg=g.createRadialGradient(128,128,0,128,128,128);
  rg.addColorStop(0,`rgba(${rgb},1)`);rg.addColorStop(.25,`rgba(${rgb},.5)`);rg.addColorStop(1,`rgba(${rgb},0)`);g.fillStyle=rg;g.fillRect(0,0,256,256);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,fog:false}));sp.scale.set(s,s,1);return sp;
}
// 紙の支柱(宙に浮く部品を背景板や地面につなぐ細い紙の帯)
const TAB_M=new THREE.MeshLambertMaterial({color:0xe6dcc0,emissive:0x3a3428});
function tab(parent,a,b,w=.12){
  const A=V(...a),d=V(...b).sub(A),m=new THREE.Mesh(new THREE.BoxGeometry(w,w,d.length()),TAB_M);
  m.position.copy(A.addScaledVector(d,.5));m.quaternion.setFromUnitVectors(V(0,0,1),d.clone().normalize());m.castShadow=true;parent.add(m);return m;
}
// 背景板: 奥に立つ円筒の一部(中心 z=cz、半径 rad、高さ h、左右の開き角 th)。手前に倒して畳む。
//   内側 = 絵 draw(g,W,H)(2048 x 1400 画素、y 下向き、左右はそのまま描けばよい)
//   外側 = 倒すと上に来る面なので題名を180度回して刷る。edge(g,W,H) で上辺の切り抜きを変えられる
//   shadow:false で、手前に浮かせた部品の影を板に落とさない(星や雲)
// 戻り値 {pg, zAt(x)}  zAt は板の内側の面の z
function backdrop(B,o){
  const RAD=o.rad??34,CZ=o.cz??6.2,HH=o.h??24,TH=o.th??.56,W=2048,H=1400;
  const pg=B.pop(B.root,[0,0,0],[0,1],o.delay??1.15,o.dur??1.3,o.layer??6);
  const edge=new Path2D();
  if(o.edge)o.edge(edge,W,H);else{edge.moveTo(0,H);edge.lineTo(W,H);edge.lineTo(W,120);for(let x=W;x>0;x-=128)edge.quadraticCurveTo(x-64,R()*90-20,x-128,60+R()*70);edge.closePath()}
  const c=cv(W,H),g=c.getContext('2d');
  // 円筒の内側から見ると左右が逆になるので、鏡に映して描く
  g.save();g.clip(edge);g.translate(W,0);g.scale(-1,1);o.draw(g,W,H);g.restore();
  g.strokeStyle=PAPER;g.lineWidth=10;g.stroke(edge);
  const st=new THREE.CanvasTexture(c);st.anisotropy=ANISO;
  const lc=cv(W,H),lg=lc.getContext('2d');
  lg.save();lg.clip(edge);lg.fillStyle='#ece1c4';lg.fillRect(0,0,W,H);
  brush(lg,0,0,W,H,['#e3d5b2','#f3ead2','#e8dbbb'],1800,30,3,0,{alpha:.5,jit:3});
  lg.translate(W/2,760);lg.rotate(Math.PI);
  lg.strokeStyle='#b08a3a';lg.lineWidth=4;lg.strokeRect(-860,-430,1720,860);lg.lineWidth=1.5;lg.strokeRect(-840,-410,1680,820);
  lg.textAlign='center';lg.fillStyle='#8a6a2a';lg.font=`52px ${FONT}`;lg.fillText(`第 ${B.no} 話`,0,-200);
  lg.fillStyle='#2b2216';lg.font=`${o.titleSize||150}px ${FONT}`;lg.fillText(o.title,0,0);
  lg.fillStyle='#6a5a3e';lg.font='italic 58px Georgia,serif';lg.fillText(o.orig,0,110);
  lg.fillStyle='#8a6a2a';lg.font=`46px ${FONT}`;lg.fillText((o.sub||'―　タップすると、絵が立ち上がります　―').replace('タップ',TAP_WORD),0,280);
  for(const x of [-560,560]){lg.fillStyle=o.dot||'#e9b830';lg.beginPath();lg.arc(x,-215,26,0,7);lg.fill();lg.strokeStyle='#b08a3a';lg.lineWidth=3;lg.beginPath();lg.arc(x,-215,42,0,7);lg.stroke()}
  lg.restore();lg.strokeStyle=PAPER;lg.lineWidth=10;lg.stroke(edge);
  const lt=new THREE.CanvasTexture(lc);lt.anisotropy=ANISO;
  const geo=new THREE.CylinderGeometry(RAD,RAD,HH,48,1,true,Math.PI-TH,TH*2);
  const sky=new THREE.Mesh(geo,mat(st,o.emi??.62,true));sky.material.side=THREE.BackSide;sky.position.set(0,HH/2,CZ);shadowy(sky,st,true);sky.castShadow=false;if(o.shadow===false)sky.receiveShadow=false;pg.add(sky);
  const lab=new THREE.Mesh(geo,mat(lt,.3,true));lab.material.side=THREE.FrontSide;lab.position.copy(sky.position);lab.receiveShadow=true;pg.add(lab);
  return {pg,zAt:x=>CZ-Math.sqrt(RAD*RAD-x*x),RAD,CZ,HH};
}
// 立ち上がる向き: 高さ h の部品が z に立つとき、畳んでもページからはみ出さない側へ倒す
const fdir=(z,h)=>z-h>=-27.5?[0,-1]:[0,1];
// 地面の内側の枠(ページの縁を少し残して塗る)
function groundClip(g,X,Z,m,fn){g.save();g.beginPath();g.rect(X(-18+m),Z(-28+m),X(18-m)-X(-18+m),Z(28-m)-Z(-28+m));g.clip();fn();g.restore()}
function groundTitle(g,W,H,jp,orig){
  g.fillStyle='#5a4a32';g.textAlign='center';
  g.font='30px '+FONT;g.fillText(jp,W/2,H-17);
  g.font='italic 28px Georgia,serif';g.fillText(orig,W/2,38);
}

// 紙の地とのど(綴じ目側の影)
function paperBase(g,W,H){
  g.fillStyle='#efe5cb';g.fillRect(0,0,W,H);
  brush(g,0,0,W,H,['#e6d9b8','#f5edd6','#e9dcc0','#e2d2ae'],W*H/700,26,2.5,0,{alpha:.5,jit:3});
}
function gutter(g,W,H,spineLeft){
  const gw=W*.07,gr=spineLeft?g.createLinearGradient(gw,0,0,0):g.createLinearGradient(W-gw,0,W,0);
  gr.addColorStop(0,'rgba(60,40,20,0)');gr.addColorStop(1,'rgba(60,40,20,.4)');g.fillStyle=gr;g.fillRect(spineLeft?0:W-gw,0,gw,H);
}

const BOOK={works:{},add(w){this.works[w.no]=w},
  // 見開きの順に、作品ファイル名・題名・画家
  list:[
    {file:'01_grande_jatte',name:'グランド・ジャット島の日曜日の午後',artist:'ジョルジュ・スーラ　1884〜1886年'},
    {file:'02_moulin_galette',name:'ムーラン・ド・ラ・ギャレットの舞踏会',artist:'ピエール＝オーギュスト・ルノワール　1876年'},
    {file:'03_japanese_bridge',name:'睡蓮の池と日本の橋',artist:'クロード・モネ　1899年'},
    {file:'04_birth_of_venus',name:'ヴィーナスの誕生',artist:'サンドロ・ボッティチェリ　1485年頃'},
    {file:'05_babel',name:'バベルの塔',artist:'ピーテル・ブリューゲル（父）　1563年'},
    {file:'06_the_dream',name:'夢',artist:'アンリ・ルソー　1910年'},
    {file:'07_cafe_terrace',name:'夜のカフェテラス',artist:'フィンセント・ファン・ゴッホ　1888年9月'},
    {file:'08_starry_night',name:'星月夜',artist:'フィンセント・ファン・ゴッホ　1889年6月'},
    {file:'09_nighthawks',name:'ナイトホークス',artist:'エドワード・ホッパー　1942年'},
    {file:'10_empire_of_light',name:'光の帝国',artist:'ルネ・マグリット　1954年'},
  ]};
