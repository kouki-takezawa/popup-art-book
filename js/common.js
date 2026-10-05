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
//   tour          [{t0,t1,f:u=>[カメラ位置,注視点],cap,frame}] 右ページの座標で
//   tourEnd, tourLoop  巡回の終わりと、繰り返すときの戻り先(秒)
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
const FONT='"Yu Mincho","Hiragino Mincho ProN","Noto Serif JP",serif';
function wrapText(g,text,x,y,maxW,lh){
  let line='';for(const ch of text){if(g.measureText(line+ch).width>maxW){g.fillText(line,x,y);y+=lh;line=ch}else line+=ch}
  if(line){g.fillText(line,x,y);y+=lh}return y;
}

// ================= three =================
const renderer=new THREE.WebGLRenderer({canvas:document.getElementById('c'),antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(2,devicePixelRatio));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
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

// 紙の地とのど(綴じ目側の影)
function paperBase(g,W,H){
  g.fillStyle='#efe5cb';g.fillRect(0,0,W,H);
  brush(g,0,0,W,H,['#e6d9b8','#f5edd6','#e9dcc0','#e2d2ae'],W*H/700,26,2.5,0,{alpha:.5,jit:3});
}
function gutter(g,W,H,spineLeft){
  const gw=W*.07,gr=spineLeft?g.createLinearGradient(gw,0,0,0):g.createLinearGradient(W-gw,0,W,0);
  gr.addColorStop(0,'rgba(60,40,20,0)');gr.addColorStop(1,'rgba(60,40,20,.4)');g.fillStyle=gr;g.fillRect(spineLeft?0:W-gw,0,gw,H);
}

const BOOK={works:{},add(w){this.works[w.no]=w}};
