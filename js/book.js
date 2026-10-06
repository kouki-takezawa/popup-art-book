// ================= 本の骨組み =================
// 見開き N 枚 = 固定の左ページ(見開き1の左) + めくれる紙 N-1 枚 + 固定の右ページ(見開きNの右)。
// めくれる紙 k の表 = 見開き k の右ページ、裏 = 見開き k+1 の左ページ(k は 0 始まり)。
const N=10;
const baseFov=()=>camera.aspect<1?70:50;
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.fov=baseFov();camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

scene.add(new THREE.AmbientLight(0x8090c0,.38));
const key=new THREE.SpotLight(0xfff0dd,1.05,0,.7,.6,0);
key.position.set(-22,52,40);key.target.position.set(0,0,-4);
key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.near=20;key.shadow.camera.far=140;key.shadow.bias=-.0004;
scene.add(key,key.target);
const rim=new THREE.DirectionalLight(0x6a80d0,.35);rim.position.set(20,20,-30);scene.add(rim);

// ページ座標: 1ページ = 幅36 x 奥行56 (x:-18..18, z:-28..28)。手前(+z)が読者側。
const PS=.7,PFW=36,PFD=56,WP=PFW*PS,DP=PFD*PS;
function pageMat(t,e=.2){const m=mat(t,e);m.side=THREE.FrontSide;return m}
function blankTex(spineLeft){
  const W=900,H=1400,c=cv(W,H),g=c.getContext('2d');
  paperBase(g,W,H);gutter(g,W,H,spineLeft);
  const t=new THREE.CanvasTexture(c);t.anisotropy=ANISO;return t;
}
const BLANK_L=pageMat(blankTex(false)),BLANK_R=pageMat(blankTex(true));
const PAGE_GEO=new THREE.PlaneGeometry(PFW,PFD).rotateX(-Math.PI/2);
function pageGroup(parent,x,y,flip){
  const g=new THREE.Group();g.position.set(x,y,0);g.scale.setScalar(PS);if(flip)g.rotation.z=Math.PI;parent.add(g);
  const m=new THREE.Mesh(PAGE_GEO,flip||x<0?BLANK_L:BLANK_R);m.receiveShadow=true;m.castShadow=!!flip||parent!==scene;g.add(m);
  return {g,m};
}
const staticL=pageGroup(scene,-WP/2,0),staticR=pageGroup(scene,WP/2,0);
// めくれる紙は厚紙なので曲げずに背(z軸)まわりに回す。重なり順の分だけ高さをずらす
const LEAF_Y=.03,LEAF_D=.012;
const leaves=[];
for(let k=0;k<N-1;k++){
  const g=new THREE.Group();scene.add(g);
  leaves.push({g,front:pageGroup(g,WP/2,.001),back:pageGroup(g,WP/2,-.001,true)});
}
function setLeaf(k,th){
  const L=leaves[k];L.g.rotation.z=th;
  L.g.position.y=LEAF_Y+((N-2-k)+(2*k-(N-2))*th/Math.PI)*LEAF_D;
}
const rightPage=s=>s<N-1?leaves[s].front:staticR;
const leftPage=s=>s>0?leaves[s-1].back:staticL;
{
  // 小口と表紙と机
  const c=cv(512,32),g=c.getContext('2d');g.fillStyle='#e9dfc4';g.fillRect(0,0,512,32);
  for(let y=0;y<32;y+=2){g.fillStyle=y%4?'#d9ccaa':'#f3ead3';g.fillRect(0,y,512,1)}
  const et=new THREE.CanvasTexture(c);et.wrapS=THREE.RepeatWrapping;et.repeat.set(8,1);
  const sm=new THREE.MeshLambertMaterial({map:et,emissive:0x3a3428});
  for(const s of [-1,1]){
    const blk=new THREE.Mesh(new THREE.BoxGeometry(WP+.1,.8,DP+.1),sm);blk.position.set(s*WP/2,-.41,0);blk.receiveShadow=blk.castShadow=true;scene.add(blk);
    const cov=new THREE.Mesh(new THREE.BoxGeometry(WP+.7,.28,DP+.9),lam(0x5a1c1c,.3));cov.position.set(s*(WP/2+.3),-.95,0);cov.castShadow=cov.receiveShadow=true;scene.add(cov);
  }
  const sp=new THREE.Mesh(new THREE.CylinderGeometry(.75,.75,DP+.9,16),lam(0x4a1616,.3));sp.rotation.x=Math.PI/2;sp.position.y=-.95;scene.add(sp);
  const dt=tex(30,30,(g,w,h)=>{g.fillStyle='#24160d';g.fillRect(0,0,w,h);brush(g,0,0,w,h,['#2e1c10','#3a2416','#1c1109','#45301e'],3500,3,.12,0,{jit:.08,bend:.05})},{ppu:40});
  dt.wrapS=dt.wrapT=THREE.RepeatWrapping;dt.repeat.set(5,5);
  const desk=new THREE.Mesh(new THREE.PlaneGeometry(300,300),new THREE.MeshLambertMaterial({map:dt,emissive:0x0c0805}));
  desk.rotation.x=-Math.PI/2;desk.position.y=-1.1;desk.receiveShadow=true;scene.add(desk);
}

// ================= 左ページ(解説)と右ページ(地面) =================
function descTex(w,num){
  const d=w.desc,S=30,W=PFW*S,H=PFD*S,c=cv(W,H),g=c.getContext('2d');
  paperBase(g,W,H);gutter(g,W,H,false);
  const L=4*S,MW=W-8*S;let y=5.5*S;
  g.textAlign='left';
  g.fillStyle='#8a6a2a';g.font=`${1.0*S}px ${FONT}`;g.fillText(`第 ${w.no} 話`,L,y);y+=3.2*S;
  g.fillStyle='#2b2216';g.font=`${2.6*S}px ${FONT}`;g.fillText(w.name,L,y);y+=1.9*S;
  g.fillStyle='#6a5a3e';g.font=`italic ${1.0*S}px Georgia,serif`;g.fillText(d.orig,L,y);y+=2.2*S;
  g.strokeStyle='#b8a47a';g.lineWidth=.06*S;g.beginPath();g.moveTo(L,y);g.lineTo(W-L,y);g.stroke();y+=2*S;
  g.fillStyle='#3a2e1e';g.font=`${1.05*S}px ${FONT}`;g.fillText(d.artist,L,y);y+=1.6*S;
  g.fillStyle='#6a5a3e';g.font=`${.82*S}px ${FONT}`;g.fillText(d.medium,L,y);y+=2.8*S;
  g.fillStyle='#3a2e1e';g.font=`${.95*S}px ${FONT}`;
  for(const t of d.paras){y=wrapText(g,'　'+t,L,y,MW,1.75*S);y+=1.1*S}
  if(d.points){
    y+=1.2*S;g.fillStyle='#8a6a2a';g.font=`${.95*S}px ${FONT}`;g.fillText('見どころ',L,y);y+=1.9*S;
    g.font=`${.9*S}px ${FONT}`;
    for(const t of d.points){g.fillStyle='#c9a24a';g.beginPath();g.arc(L+.3*S,y-.32*S,.18*S,0,7);g.fill();g.fillStyle='#3a2e1e';g.fillText(t,L+1*S,y);y+=1.7*S}
  }
  g.textAlign='center';g.fillStyle='#8a6a2a';g.font=`${.8*S}px ${FONT}`;g.fillText(d.foot||'―　右のページが立ち上がります　―',W/2,H-4*S);
  g.fillStyle='#8a7a5a';g.font=`${.75*S}px serif`;g.fillText(String(num),2*S,H-.9*S);
  const t=new THREE.CanvasTexture(c);t.anisotropy=ANISO;return t;
}
function groundTex(w,num){
  const W=1536,H=2389,c=cv(W,H),g=c.getContext('2d');
  paperBase(g,W,H);
  g.save();w.ground(g,W,H,{X:x=>(x+18)/36*W,Z:z=>(z+28)/56*H,S:W/36});g.restore();
  gutter(g,W,H,true);
  g.fillStyle='#5a4a32';g.textAlign='center';g.font='26px serif';g.fillText(String(num),W-60,H-17);
  const t=new THREE.CanvasTexture(c);t.anisotropy=ANISO;return t;
}

// ================= 作品の読み込み(必要になってから script を足す) =================
const spreads=[...Array(N)].map((_,i)=>({get work(){return BOOK.works[i+1]||null},meta:BOOK.list[i]||null,b:null}));
const loadingP={};
function loadWork(i){
  const e=BOOK.list[i];
  if(!e||BOOK.works[i+1])return Promise.resolve();
  return loadingP[i]||(loadingP[i]=new Promise((ok,ng)=>{
    const sc=document.createElement('script');sc.src=`works/${e.file}.js`;
    sc.onload=ok;sc.onerror=()=>{delete loadingP[i];sc.remove();ng(new Error('作品を読み込めませんでした: '+e.file))};
    document.head.appendChild(sc);
  }));
}

// ================= 作品の組み立て =================
// テクスチャを GPU へ送り終えたら、元の canvas は 1x1 に縮めてメモリを返す(先に組み立てた見開きは空き時間に少しずつ送る)。
// 開いている見開きと前後1つだけを残し、それより離れたものは捨てる(また開くときは組み立て直す。乱数の種が同じなので同じものができる)
// 動きを減らす設定(OS の prefers-reduced-motion)。カメラは場面ごとに止めて、めくりや立ち上がりも短く
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)');
const popEase=k=>REDUCED.matches?easeIO(k):easeOutBack(k);
function applyPops(b,pt){
  for(const q of b.pops){
    const k=popEase(clamp((pt-q.delay)/q.dur,0,1));
    // 平らなときは紙の重なり順(layer)の分だけ浮かせる
    const a=Math.max(.004,k)*Math.PI/2,c=Math.cos(a),s=Math.max(.006,Math.sin(a)),lift=q.layer*.09*(1-clamp(k,0,1));
    q.g.matrix.set(1,c*q.dx,0,q.p[0], 0,s,0,q.p[1]+.012+lift, 0,c*q.dz,1,q.p[2], 0,0,0,1);
    q.g.matrixWorldNeedsUpdate=true;
  }
  for(const e of b.extras)e.f(popEase(clamp((pt-e.delay)/e.dur,0,1)));
}
function build(s){
  const sp=spreads[s];if(!sp||!sp.work||sp.b)return sp&&sp.b;
  const w=sp.work;reseed(w.seed||(s+1)*7919);
  leftPage(s).m.material=pageMat(descTex(w,2*s+1));
  rightPage(s).m.material=pageMat(groundTex(w,2*s+2),.42);
  const root=new THREE.Group();root.visible=false;rightPage(s).g.add(root);
  const b={root,pops:[],extras:[],lights:[],tick:null,live:false,res:null};
  const B={no:w.no,root,
    pop(parent,p,dir,delay,dur=1.1,layer=1){const g=new THREE.Group();g.matrixAutoUpdate=false;parent.add(g);b.pops.push({g,p,dx:dir[0],dz:dir[1],delay,dur,layer});return g},
    extra(delay,dur,f){b.extras.push({delay,dur,f})},
    light(l){l.visible=false;scene.add(l);b.lights.push(l);return l}};
  const r=w.build(B)||{};b.tick=r.tick;b.live=!!r.liveShadows;
  applyPops(b,0);b.res=collect(b,s);track(b.res.texs);sp.b=b;return b;
}
// 見開きどうしで使い回している物は捨てない
const SHARED=new Set([PAGE_GEO,BLANK_L,BLANK_R,BLANK_L.map,BLANK_R.map,TAB_M]);
function collect(b,s){
  const geos=new Set(),mats=new Set(),texs=new Set();
  b.root.traverse(o=>{
    if(o.geometry&&!o.isSprite)geos.add(o.geometry);   // Sprite の geometry は three の共有物
    for(const m of [].concat(o.material||[]))mats.add(m);
    if(o.customDepthMaterial)mats.add(o.customDepthMaterial);
  });
  mats.add(leftPage(s).m.material);mats.add(rightPage(s).m.material);
  for(const m of mats)for(const k of ['map','emissiveMap','alphaMap'])if(m[k])texs.add(m[k]);
  for(const x of SHARED){geos.delete(x);mats.delete(x);texs.delete(x)}
  return {geos,mats,texs};
}
// canvas -> まだ GPU へ送っていないテクスチャ。同じ canvas を使うテクスチャが全部送られてから縮める
const unsent=new Map();
function track(texs){for(const t of texs){const c=t.image;if(!c||!(c.width>1))continue;if(!unsent.has(c))unsent.set(c,new Set());unsent.get(c).add(t)}}
const sentOK=t=>renderer.properties.get(t).__version===t.version;
function sweep(){for(const [c,ts] of unsent){for(const t of ts)if(sentOK(t))ts.delete(t);if(!ts.size){c.width=c.height=1;unsent.delete(c)}}}
// 少なくとも1枚は送り、時間切れ(late())になったら false を返す
function uploadSome(late){
  let n=0;
  for(const ts of unsent.values())for(const t of ts){if(n++&&late())return false;if(!sentOK(t))renderer.initTexture(t)}
  sweep();return true;
}
function dispose(s){
  const sp=spreads[s],b=sp.b;if(!b)return;
  b.root.parent.remove(b.root);
  for(const l of b.lights){scene.remove(l);l.dispose&&l.dispose()}
  for(const g of b.res.geos)g.dispose();
  for(const m of b.res.mats)m.dispose();
  for(const t of b.res.texs){t.dispose();const ts=unsent.get(t.image);if(ts){ts.delete(t);if(!ts.size)unsent.delete(t.image)}}
  leftPage(s).m.material=BLANK_L;rightPage(s).m.material=BLANK_R;
  sp.b=null;
}
function trim(){spreads.forEach((sp,i)=>{if(sp.b&&Math.abs(i-active)>1&&i!==target)dispose(i)})}
function showOnly(...idx){
  spreads.forEach((sp,i)=>{if(!sp.b)return;const on=idx.includes(i);sp.b.root.visible=on;for(const l of sp.b.lights)l.visible=on&&i===idx[0]});
  renderer.shadowMap.needsUpdate=true;invalidate();lastPc=-1;   // 開いている見開きが変わったら部品の形を当て直す
}
// 描画は画面が変わるときだけ(真上で待っているときや一時停止中は描かない)
let needRender=true;
function invalidate(){needRender=true}

// ================= カメラ =================
// noBL: 場面送りで飛んできた場面は、前の場面の終わりからつなぐ補間をしない(カメラの補間は別にかける)
let noBL=-1;
const tourTime=(w,t)=>t>=w.tourEnd?w.tourLoop+(t-w.tourLoop)%(w.tourEnd-w.tourLoop):t;
function tourPose(w,t){
  const TOUR=w.tour,rm=REDUCED.matches,BL=rm?.5:1.6;
  t=tourTime(w,t);
  let i=TOUR.findIndex(s=>t<s.t1);if(i<0)i=TOUR.length-1;const s=TOUR[i];
  if(i!==noBL)noBL=-1;
  // 動きを減らす設定では、場面の中ほどの構図で止める
  const uu=u=>rm?.5:u;
  let [p,l]=s.f(uu(clamp((t-s.t0)/(s.t1-s.t0),0,1)));
  if(i>0&&i!==noBL&&t-s.t0<BL){const [pp,pl]=TOUR[i-1].f(uu(1)),k=easeIO((t-s.t0)/BL);p=pp.lerp(p,k);l=pl.lerp(l,k)}
  const g=rightPage(active).g;g.updateMatrixWorld(true);
  return {p:g.localToWorld(p),l:g.localToWorld(l),s,i,u:(t-s.t0)/(s.t1-s.t0)};
}
// 真上から見開き全体
function topPose(){
  const f=Math.tan(baseFov()*Math.PI/360)*2,h=Math.max(DP*1.42/f,(2*WP+3)*1.12/(f*camera.aspect));
  return {p:V(0,h,.6),l:V(0,0,0)};
}

// ================= 状態 =================
// phase: top(真上・畳んだまま) / tour(立ち上がって巡回) / fold(畳んで真上へ) / flip(めくる)
const qs=new URLSearchParams(location.search);
let active=qs.has('spread')?clamp((+qs.get('spread')|0)-1,0,N-1):0;
let target=active,phase='top',tau=0,pc=0,flip=null,paused=false,T=0,afterFold=null,looped=false;
for(let k=0;k<N-1;k++)setLeaf(k,k<active?Math.PI:0);
let blend=null,tw=null;
const camLook=V(0,0,0);
{const t=topPose();camera.position.copy(t.p);camLook.copy(t.l);camera.lookAt(camLook)}
const $=id=>document.getElementById(id);
const work=()=>spreads[active].work,built=()=>spreads[active].b;
function updateNav(){
  const m=spreads[target].meta;
  $('pg').textContent=`見開き ${target+1} / ${N}　${m?m.name:'白紙'}`;
  $('prev').disabled=target<=0;$('next').disabled=target>=N-1;
  $('title').querySelector('b').textContent=m?m.name:'　';
  $('info').disabled=!m;
}
function updateUI(){
  $('back').style.display=phase==='tour'?'flex':'none';
  $('tap').classList.toggle('on',phase==='top'&&!!built());
  $('prog').classList.toggle('on',phase==='tour');
  $('nextw').classList.toggle('on',phase==='tour'&&looped);
  $('nextw').firstChild.textContent=active>=N-1?'目次を見る':'次の作品へ';
}
function tweenTo(pose,dur){tw={fp:camera.position.clone(),fl:camLook.clone(),tp:pose.p,tl:pose.l,t:0,dur}}
// 作品の切り替えは、畳む 1.2秒 + めくる 1.5秒(動きを減らす設定では 0.6秒 + 0.5秒)
const FOLD_T=()=>REDUCED.matches?.6:1.2,FLIP_T=()=>REDUCED.matches?.5:1.5;
function foldThen(next){setCap(null);phase='fold';afterFold=next;orbit.yaw=orbit.pitch=0;tweenTo(topPose(),FOLD_T());updateUI()}
// 何枚も送るとき、途中の見開きは組み立てずに白紙のままめくる(組み立て済みなら中身ごと)
function startFlip(t0=0){
  const fwd=target>active;flip={k:fwd?active:active-1,to:active+(fwd?1:-1),fwd,t:t0};
  showOnly(active,flip.to);phase='flip';
}
// めくる先は、読み込んで組み立ててからめくり始める(phase=wait の間は操作を受けない)
function request(i){
  if(i<0||i>=N||i===active||(phase!=='top'&&phase!=='tour'))return;
  target=i;updateNav();idleTok++;
  const go=()=>{
    phase='wait';updateUI();
    loadWork(i).then(()=>{build(i);startFlip();updateUI()}).catch(err=>{
      console.error(err);target=active;updateNav();phase='top';updateUI();
    });
  };
  if(phase==='tour')foldThen(go);else go();
}
// 真上で止まっている間に、前後の見開きを先に読み込んで組み立てておく
// idle(f): f(late) を空き時間に呼ぶ。late() は持ち時間を使い切ったら true
const idle=window.requestIdleCallback?f=>requestIdleCallback(d=>f(()=>d.timeRemaining()<4),{timeout:1500})
  :f=>setTimeout(()=>{const t=performance.now();f(()=>performance.now()-t>8)},300);
let idleTok=0;
function prebuild(){
  const tok=++idleTok,todo=[active+1,active-1].filter(i=>i>=0&&i<N);
  const still=()=>tok===idleTok&&phase==='top'&&!tw;
  const step=()=>{
    if(!still())return;
    const i=todo.shift();if(i===undefined)return;
    if(spreads[i].b){idle(step);return}
    const pump=late=>{if(!still())return;idle(uploadSome(late)?step:pump)};
    loadWork(i).then(()=>idle(()=>{if(!still())return;build(i);idle(pump)})).catch(err=>console.error(err));
  };
  idle(step);
}
function blendFrom(dur){blend=paused?null:{p:camera.position.clone(),l:camLook.clone(),t:0,dur}}
function rise(){if(phase!=='top'||!built())return;idleTok++;setPaused(false);$('plate').innerHTML=work().plate||'';phase='tour';tau=0;looped=false;noBL=-1;blendFrom(REDUCED.matches?.8:3);makeProg();fitCap();updateUI()}
// 字幕を読み切れるように、場面ごとに進む速さを落とす(1秒に8文字 + 余裕1.5秒。最初の場面は字幕が1.5秒遅れて出る)
const CPS=8;
function sceneRate(w,i){
  const s=w.tour[i],k=s&&s.cap&&w.caps[s.cap];if(!k)return 1;
  const need=[...k].length/CPS+1.5+(i===0?1.5:0);return Math.min(1,(s.t1-s.t0)/need);
}
// 場面送り(ツアー中の前後の場面、点を押した場面へ)
function curScene(){const w=work(),t=tourTime(w,tau);const i=w.tour.findIndex(s=>t<s.t1);return i<0?w.tour.length-1:i}
function gotoScene(i){
  if(phase!=='tour')return;const w=work();i=clamp(i,0,w.tour.length-1);
  blendFrom(REDUCED.matches?.4:1.2);tau=w.tour[i].t0;noBL=i;
}
$('sprev').onclick=()=>gotoScene(curScene()-1);$('snext').onclick=()=>gotoScene(curScene()+1);
$('dots').onclick=e=>{const b=e.target.closest('button');if(b)gotoScene(+b.dataset.i)};
$('nextw').onclick=()=>{if(active>=N-1)$('toc').click();else request(active+1)};
$('tap').onclick=rise;$('tap').textContent=`本を${TAP_WORD}すると、絵が立ち上がります`;
$('prev').onclick=()=>request(active-1);$('next').onclick=()=>request(active+1);
$('back').onclick=()=>{if(phase==='tour')foldThen(()=>{phase='top';updateUI();prebuild()})};
addEventListener('keydown',e=>{
  if(document.querySelector('dialog[open]'))return;
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
    const d=e.key==='ArrowRight'?1:-1;
    if(e.shiftKey&&phase==='tour')gotoScene(curScene()+d);else request(active+d);
  }
  // スペース: ツアー中は一時停止・再開、真上では立ち上げる(ボタンにフォーカスがあるときはボタンに任せる)
  if(e.key===' '&&!(e.target instanceof HTMLButtonElement)){e.preventDefault();if(phase==='tour')setPaused(!paused);else rise()}
});
function setPaused(v){
  paused=v;const b=$('pause'),l=v?'再生':'一時停止';
  b.classList.toggle('paused',v);b.setAttribute('aria-label',l);b.querySelector('.lb').textContent=l;
}
$('pause').onclick=()=>setPaused(!paused);
// 解説と目次のパネル(開いている間はツアーを止める)
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let pausedByDlg=false;
function openDlg(d){if(!paused&&phase==='tour'){setPaused(true);pausedByDlg=true}d.showModal()}
for(const d of document.querySelectorAll('dialog')){
  d.querySelector('.x').onclick=()=>d.close();
  d.addEventListener('click',e=>{if(e.target===d)d.close()});
  d.addEventListener('close',()=>{if(pausedByDlg){pausedByDlg=false;setPaused(false)}});
}
$('info').onclick=()=>{
  const w=spreads[target].work;
  if(!w){if(spreads[target].meta)loadWork(target).then(()=>$('info').click(),err=>console.error(err));return}
  const d=w.desc;
  $('sheet-b').innerHTML=`<div class="no">第 ${w.no} 話</div><h2 id="sheet-h">${esc(w.name)}</h2><div class="orig">${esc(d.orig)}</div>`+
    `<div class="meta">${esc(d.artist)}<small>${esc(d.medium)}</small></div>${d.paras.map(t=>`<p>${esc(t)}</p>`).join('')}`+
    (d.points?`<h3>見どころ</h3><ul>${d.points.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:'');
  openDlg($('sheet'));
};
$('toclist').innerHTML=spreads.map((sp,i)=>{
  const m=sp.meta;
  return `<li><button data-i="${i}"><img src="thumbs/${String(i+1).padStart(2,'0')}.jpg" alt="" loading="lazy" width="400" height="206">`+
    `<span>${i+1}. ${m?esc(m.name):'白紙'}<small>${m?esc(m.artist):''}</small></span></button></li>`;
}).join('');
$('toc').onclick=()=>{
  $('toclist').querySelectorAll('button').forEach((b,i)=>i===target?b.setAttribute('aria-current','true'):b.removeAttribute('aria-current'));
  openDlg($('tocd'));
};
$('toclist').onclick=e=>{const b=e.target.closest('button');if(!b)return;$('tocd').close();request(+b.dataset.i)};
// 画面の操作
//   真上: タップ(どこでも)で立ち上げる / 横にスワイプでページをめくる
//   ツアー中: タップで一時停止・再開 / ドラッグで視点を少し回す(その間ツアーは止まり、離すと戻る)
const orbit={yaw:0,pitch:0,drag:false};
let down=null;
const cvs=renderer.domElement;
cvs.addEventListener('pointerdown',e=>{if(down)return;down={id:e.pointerId,x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY,moved:false};cvs.setPointerCapture(e.pointerId)});
cvs.addEventListener('pointermove',e=>{
  if(!down||e.pointerId!==down.id)return;
  if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>8)down.moved=true;
  if(down.moved&&phase==='tour'){
    orbit.drag=true;
    orbit.yaw=clamp(orbit.yaw-(e.clientX-down.lx)*.005,-.6,.6);
    orbit.pitch=clamp(orbit.pitch+(e.clientY-down.ly)*.004,-.3,.3);
  }
  down.lx=e.clientX;down.ly=e.clientY;
});
function endPointer(e,cancel){
  if(!down||e.pointerId!==down.id)return;
  const dx=e.clientX-down.x,dy=e.clientY-down.y,moved=down.moved;down=null;orbit.drag=false;
  if(cancel)return;
  if(!moved){if(phase==='top')rise();else if(phase==='tour')setPaused(!paused);return}
  if(phase==='top'&&Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)request(active+(dx<0?1:-1));
}
cvs.addEventListener('pointerup',e=>endPointer(e,false));
cvs.addEventListener('pointercancel',e=>endPointer(e,true));
// ドラッグの分だけ、注視点のまわりにカメラを回す(上下は机にもぐらず真上を越えない範囲で)
const _off=new THREE.Vector3(),_axis=new THREE.Vector3(),_up=new THREE.Vector3(0,1,0);
function applyOrbit(){
  if(!orbit.yaw&&!orbit.pitch)return;
  _off.subVectors(camera.position,camLook).applyAxisAngle(_up,orbit.yaw);
  _axis.crossVectors(_off,_up).normalize();
  const el=Math.asin(clamp(_off.y/_off.length(),-1,1)),p=clamp(orbit.pitch,Math.min(0,.05-el),Math.max(0,1.45-el));
  _off.applyAxisAngle(_axis,p);camera.position.copy(camLook).add(_off);
}

const capEl=$('cap');let capNow=null;
function setCap(k){if(k===capNow)return;capNow=k;if(k){capEl.textContent=work().caps[k];capEl.style.opacity=1}else capEl.style.opacity=0}
capEl.onclick=()=>{if(phase==='tour')setPaused(!paused)};
// 字幕の高さをその作品でいちばん長い字幕に合わせる(描画の前に測って戻すので、ちらつかない)
function fitCap(){
  const w=work();if(!w)return;const keep=capEl.textContent;let h=0;capEl.style.minHeight='0';
  for(const k in w.caps){capEl.textContent=w.caps[k];h=Math.max(h,capEl.offsetHeight)}
  capEl.textContent=keep;capEl.style.minHeight=h+'px';
}
// ツアーの進み具合(場面ごとの点)
const dotsEl=$('dots');let progN=-1;
function makeProg(){const n=work().tour.length;dotsEl.innerHTML=work().tour.map((_,i)=>`<button data-i="${i}" aria-label="場面 ${i+1} / ${n}"></button>`).join('');progN=-1}
function setProg(i){
  if(i===progN)return;progN=i;
  [...dotsEl.children].forEach((d,j)=>{d.className=j<i?'done':j===i?'on':'';j===i?d.setAttribute('aria-current','step'):d.removeAttribute('aria-current')});
  $('sprev').disabled=i<=0;$('snext').disabled=i>=work().tour.length-1;
}
updateNav();updateUI();
addEventListener('resize',()=>{fitCap();invalidate();if(phase==='top'&&!tw){const t=topPose();camera.position.copy(t.p);camLook.copy(t.l)}});
// 端末の性能に合わせてピクセル比を下げる(続けて描いている間の平均フレーム時間で判断。?pr=数値 で固定)
const PR_MAX=Math.min(2,devicePixelRatio),PR_MIN=Math.min(PR_MAX,.75);
let pr=qs.has('pr')?+qs.get('pr'):PR_MAX,prCap=PR_MAX;const prFixed=qs.has('pr'),perf={t:0,n:0,good:0};
renderer.setPixelRatio(pr);
function adaptPR(raw){
  if(prFixed)return;
  if(raw>.25){perf.t=perf.n=0;return}   // 組み立てやタブの切り替えで空いた時間は数えない
  perf.t+=raw;perf.n++;if(perf.t<2)return;
  const avg=perf.t/perf.n;perf.t=perf.n=0;
  if(avg>1/40&&pr>PR_MIN){prCap=pr-.25;pr=Math.max(PR_MIN,pr-.25);perf.good=0;renderer.setPixelRatio(pr)}
  else if(avg<1/55&&pr<prCap){if(++perf.good>=3){pr=Math.min(prCap,pr+.25);perf.good=0;renderer.setPixelRatio(pr)}}
  else perf.good=0;
}

let last=performance.now(),drewLast=false,frame=0,lastPc=-1,frLast=null;
const _bp=new THREE.Vector3(),_bl=new THREE.Vector3(),_pose={p:_bp,l:_bl};
function tick(now){
  const raw=(now-last)/1000,rdt=Math.min(.05,raw);last=now;frame++;
  let dt=paused?0:rdt;T+=dt;
  let pose=null,shot=null;
  if(phase==='tour'){
    const w=work();
    pc=Math.min(4.6,pc+dt*(REDUCED.matches?2:1));
    // ドラッグ中はツアーの時間を止める
    if(!orbit.drag)tau+=dt*sceneRate(w,curScene());
    if(!looped&&tau>=w.tourEnd){looped=true;updateUI()}
    shot=tourPose(w,tau);pose=shot;
    if(blend){blend.t+=dt;const k=easeIO(blend.t/blend.dur);_bp.copy(blend.p).lerp(pose.p,k);_bl.copy(blend.l).lerp(pose.l,k);pose=_pose;if(blend.t>=blend.dur)blend=null}
  }else if(phase==='fold'){
    pc=Math.max(0,pc-dt*4.6/FOLD_T());
    if(pc<=0&&!tw){const f=afterFold;afterFold=null;f&&f()}
  }else if(phase==='flip'){
    // 飛び出す絵本のページは厚紙なので、曲げずにめくる(畳んだ部品も紙と一緒に動く)。何枚も送るときは速く
    flip.t+=dt/(Math.abs(target-active)>1?Math.min(.9,FLIP_T()):FLIP_T());const k=easeIO(flip.t);
    setLeaf(flip.k,Math.PI*(flip.fwd?k:1-k));
    if(flip.t>=1){
      setLeaf(flip.k,flip.fwd?Math.PI:0);active=flip.to;
      if(active!==target)startFlip();else{flip=null;phase='top';showOnly(active);trim();prCap=PR_MAX;prebuild();history.replaceState(null,'','?spread='+(active+1)+location.hash)}
      updateUI();
    }
  }
  // 手を離したら視点のずれを戻す(一時停止中でも戻す)
  if(!orbit.drag&&(orbit.yaw||orbit.pitch)){const k=Math.exp(-rdt*4);orbit.yaw*=k;orbit.pitch*=k;if(Math.abs(orbit.yaw)+Math.abs(orbit.pitch)<1e-3)orbit.yaw=orbit.pitch=0}
  const b=built();
  // 影: 部品が立ち上がる・畳む・めくるときは毎フレーム、影を落とす部品が tick で動く作品は4フレームに1回、それ以外は計算し直さない
  const pcMoved=pc!==lastPc;lastPc=pc;
  if(b){if(pcMoved)applyPops(b,pc+1);b.tick&&b.tick(T,dt)}
  if(pcMoved||phase==='flip'||(b&&b.live&&dt>0&&frame%4===0))renderer.shadowMap.needsUpdate=true;
  const twOn=!!tw;
  if(tw){tw.t+=dt;const k=easeIO(tw.t/tw.dur);_bp.copy(tw.fp).lerp(tw.tp,k);_bl.copy(tw.fl).lerp(tw.tl,k);pose=_pose;if(tw.t>=tw.dur)tw=null}
  if(pose){camera.position.copy(pose.p);camLook.copy(pose.l)}
  if(phase==='tour')applyOrbit();
  // 場面ごとの画角(額縁の場面で絵を画面いっぱいに)。縦長の画面では広めに
  const fovT=phase==='tour'&&shot&&shot.s.fov?shot.s.fov*(camera.aspect<1?1.45:1):baseFov();
  const fovMoved=Math.abs(camera.fov-fovT)>.01;
  if(fovMoved){camera.fov+=(fovT-camera.fov)*(paused?1:Math.min(1,dt*1.6));camera.updateProjectionMatrix()}
  camera.lookAt(camLook);
  if(phase==='tour'){setCap(tau>1.5?shot.s.cap||null:null);setProg(shot.i)}
  // 真偽値にそろえる(undefined を toggle に渡すと毎フレーム付け外しが反転して、字幕などが上下にぶれる)
  const fr=!!(phase==='tour'&&shot&&shot.s.frame&&shot.u>.12&&shot.u<.94);
  if(fr!==frLast){frLast=fr;$('frame').style.opacity=fr?1:0;$('plate').style.opacity=fr?1:0;document.body.classList.toggle('framed',fr)}
  const moving=(phase==='tour'&&!paused)||phase==='fold'||phase==='flip'||twOn||pcMoved||fovMoved||orbit.drag||!!(orbit.yaw||orbit.pitch);
  if(moving||needRender){
    // 動いたフレームのあとにもう1枚描く(tick が灯りの位置などを1フレーム遅れで追うため)
    renderer.render(scene,camera);needRender=moving;
    if(unsent.size)sweep();
    if(drewLast)adaptPR(raw);drewLast=true;
  }else drewLast=false;
  requestAnimationFrame(tick);
}
// 最初の見開きは読み込み中の表示を一度描かせてから組み立てる(組み立ての間、画面が真っ暗にならないように)
async function boot(){
  try{await loadWork(active)}catch(err){console.error(err);$('loading').querySelector('span').textContent='読み込めませんでした。ページを再読み込みしてください';return}
  build(active);showOnly(active);updateUI();
  // 確認用: ?spread=N 見開きN / ?t=秒 ツアーのその時点で停止 / ?pc=秒 立ち上がり途中で真上から / ?flip=0..1 次へめくる途中 / ?view=x,y,z / ?auto=rise|back
  if(qs.has('flip')&&active<N-1){target=active+1;updateNav();await loadWork(target);build(target);startFlip(+qs.get('flip'));setPaused(true);setLeaf(flip.k,Math.PI*easeIO(flip.t))}
  if(qs.has('pc')){pc=+qs.get('pc');setPaused(true)}
  if(qs.has('view')){const [x,y,z]=qs.get('view').split(',').map(Number);tw={fp:V(x,y,z),fl:V(0,0,-2),tp:V(x,y,z),tl:V(0,0,-2),t:0,dur:1e9}}
  if(qs.get('auto')==='rise')setTimeout(rise,300);
  if(qs.get('auto')==='back')setTimeout(()=>{rise();setTimeout(()=>$('back').click(),2500)},300);
  if(qs.has('t')&&built()){$('plate').innerHTML=work().plate||'';phase='tour';tau=+qs.get('t');pc=4.6;blend=null;looped=tau>=work().tourEnd;setPaused(true);makeProg();fitCap();updateUI()}
  last=performance.now();requestAnimationFrame(tick);
  requestAnimationFrame(()=>$('loading').classList.add('done'));
  if(phase==='top')prebuild();
}
requestAnimationFrame(()=>setTimeout(boot,30));
