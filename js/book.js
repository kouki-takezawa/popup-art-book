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

// ================= 作品の組み立て(開くときに一度だけ) =================
const spreads=[...Array(N)].map((_,i)=>({work:BOOK.works[i+1]||null,b:null}));
function applyPops(b,pt){
  for(const q of b.pops){
    const k=easeOutBack(clamp((pt-q.delay)/q.dur,0,1));
    // 平らなときは紙の重なり順(layer)の分だけ浮かせる
    const a=Math.max(.004,k)*Math.PI/2,c=Math.cos(a),s=Math.max(.006,Math.sin(a)),lift=q.layer*.09*(1-clamp(k,0,1));
    q.g.matrix.set(1,c*q.dx,0,q.p[0], 0,s,0,q.p[1]+.012+lift, 0,c*q.dz,1,q.p[2], 0,0,0,1);
    q.g.matrixWorldNeedsUpdate=true;
  }
  for(const e of b.extras)e.f(easeOutBack(clamp((pt-e.delay)/e.dur,0,1)));
}
function build(s){
  const sp=spreads[s];if(!sp||!sp.work||sp.b)return sp&&sp.b;
  const w=sp.work;reseed(w.seed||(s+1)*7919);
  leftPage(s).m.material=pageMat(descTex(w,2*s+1));
  rightPage(s).m.material=pageMat(groundTex(w,2*s+2),.42);
  const root=new THREE.Group();rightPage(s).g.add(root);
  const b={root,pops:[],extras:[],lights:[],tick:null};
  const B={no:w.no,root,
    pop(parent,p,dir,delay,dur=1.1,layer=1){const g=new THREE.Group();g.matrixAutoUpdate=false;parent.add(g);b.pops.push({g,p,dx:dir[0],dz:dir[1],delay,dur,layer});return g},
    extra(delay,dur,f){b.extras.push({delay,dur,f})},
    light(l){l.visible=false;scene.add(l);b.lights.push(l);return l}};
  const r=w.build(B)||{};b.tick=r.tick;
  applyPops(b,0);sp.b=b;return b;
}
function showOnly(...idx){
  spreads.forEach((sp,i)=>{if(!sp.b)return;const on=idx.includes(i);sp.b.root.visible=on;for(const l of sp.b.lights)l.visible=on&&i===idx[0]});
}

// ================= カメラ =================
function tourPose(w,t){
  const TOUR=w.tour,BL=1.6;
  if(t>=w.tourEnd)t=w.tourLoop+(t-w.tourLoop)%(w.tourEnd-w.tourLoop);
  let i=TOUR.findIndex(s=>t<s.t1);if(i<0)i=TOUR.length-1;const s=TOUR[i];
  let [p,l]=s.f(clamp((t-s.t0)/(s.t1-s.t0),0,1));
  if(i>0&&t-s.t0<BL){const [pp,pl]=TOUR[i-1].f(1),k=easeIO((t-s.t0)/BL);p=pp.lerp(p,k);l=pl.lerp(l,k)}
  const g=rightPage(active).g;g.updateMatrixWorld(true);
  return {p:g.localToWorld(p),l:g.localToWorld(l),s,u:(t-s.t0)/(s.t1-s.t0)};
}
// 真上から見開き全体
function topPose(){
  const f=Math.tan(baseFov()*Math.PI/360)*2,h=Math.max(DP*1.3/f,(2*WP+3)*1.12/(f*camera.aspect));
  return {p:V(0,h,.6),l:V(0,0,0)};
}

// ================= 状態 =================
// phase: top(真上・畳んだまま) / tour(立ち上がって巡回) / fold(畳んで真上へ) / flip(めくる)
const qs=new URLSearchParams(location.search);
let active=qs.has('spread')?clamp((+qs.get('spread')|0)-1,0,N-1):Math.max(0,spreads.findIndex(sp=>sp.work));
let target=active,phase='top',tau=0,pc=0,flip=null,paused=false,T=0,afterFold=null;
for(let k=0;k<N-1;k++)setLeaf(k,k<active?Math.PI:0);
build(active);showOnly(active);
let camFrom=null,tw=null;
const camLook=V(0,0,0);
{const t=topPose();camera.position.copy(t.p);camLook.copy(t.l);camera.lookAt(camLook)}
const $=id=>document.getElementById(id);
const work=()=>spreads[active].work,built=()=>spreads[active].b;
function updateNav(){
  const w=spreads[target].work;
  $('pg').textContent=`見開き ${target+1} / ${N}　${w?w.name:'白紙'}`;
  $('prev').disabled=target<=0;$('next').disabled=target>=N-1;
  $('title').querySelector('b').textContent=w?w.name:'　';
  $('plate').innerHTML=w&&w.plate||'';
}
function updateUI(){
  $('back').style.display=phase==='tour'?'block':'none';
  $('tap').style.opacity=phase==='top'&&built()?1:0;
}
function tweenTo(pose,dur){tw={fp:camera.position.clone(),fl:camLook.clone(),tp:pose.p,tl:pose.l,t:0,dur}}
function foldThen(next){setCap(null);phase='fold';afterFold=next;tweenTo(topPose(),2);updateUI()}
function startFlip(t0=0){
  const fwd=target>active;flip={k:fwd?active:active-1,to:active+(fwd?1:-1),fwd,t:t0};
  build(flip.to);showOnly(active,flip.to);phase='flip';
}
function request(i){
  if(i<0||i>=N||i===active||(phase!=='top'&&phase!=='tour'))return;
  target=i;updateNav();
  const go=()=>{startFlip();updateUI()};
  if(phase==='tour')foldThen(go);else go();
}
function rise(){if(phase!=='top'||!built())return;phase='tour';tau=0;camFrom={p:camera.position.clone(),l:camLook.clone()};updateUI()}
$('prev').onclick=()=>request(active-1);$('next').onclick=()=>request(active+1);
$('back').onclick=()=>{if(phase==='tour')foldThen(()=>{phase='top';updateUI()})};
addEventListener('keydown',e=>{if(e.key==='ArrowRight')request(active+1);if(e.key==='ArrowLeft')request(active-1)});
$('pause').onclick=e=>{paused=!paused;e.target.textContent=paused?'▶ 再生':'❚❚ 一時停止'};
// 本をタップすると立ち上がる
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),hitP=new THREE.Vector3();
let down=null;
renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
renderer.domElement.addEventListener('pointerup',e=>{
  if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>8||phase!=='top')return;
  ndc.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(ndc,camera);
  if(!ray.ray.intersectPlane(new THREE.Plane(V(0,1,0),-.05),hitP))return;
  if(Math.abs(hitP.x)<=WP&&Math.abs(hitP.z)<=DP/2)rise();
});

const capEl=$('cap');let capNow=null;
function setCap(k){if(k===capNow)return;capNow=k;if(k){capEl.textContent=work().caps[k];capEl.style.opacity=1}else capEl.style.opacity=0}
updateNav();updateUI();
addEventListener('resize',()=>{if(phase==='top'&&!tw){const t=topPose();camera.position.copy(t.p);camLook.copy(t.l)}});

let last=performance.now();
function tick(now){
  let dt=Math.min(.05,(now-last)/1000);last=now;if(paused)dt=0;T+=dt;
  let pose=null,shot=null;
  if(phase==='tour'){
    pc=Math.min(4.6,pc+dt);tau+=dt;
    shot=tourPose(work(),tau);pose=shot;
    if(tau<3){const k=easeIO(tau/3);pose={p:camFrom.p.clone().lerp(pose.p,k),l:camFrom.l.clone().lerp(pose.l,k)}}
  }else if(phase==='fold'){
    pc=Math.max(0,pc-dt*2.2);
    if(pc<=0&&!tw){const f=afterFold;afterFold=null;f&&f()}
  }else if(phase==='flip'){
    // 飛び出す絵本のページは厚紙なので、曲げずにめくる(畳んだ部品も紙と一緒に動く)。何枚も送るときは速く
    flip.t+=dt/(Math.abs(target-active)>1?.9:2.2);const k=easeIO(flip.t);
    setLeaf(flip.k,Math.PI*(flip.fwd?k:1-k));
    if(flip.t>=1){
      setLeaf(flip.k,flip.fwd?Math.PI:0);active=flip.to;
      if(active!==target)startFlip();else{flip=null;phase='top';showOnly(active)}
      updateUI();
    }
  }
  const b=built();
  if(b){applyPops(b,pc+1);b.tick&&b.tick(T,dt)}
  if(tw){tw.t+=dt;const k=easeIO(tw.t/tw.dur);pose={p:tw.fp.clone().lerp(tw.tp,k),l:tw.fl.clone().lerp(tw.tl,k)};if(tw.t>=tw.dur)tw=null}
  if(pose){camera.position.copy(pose.p);camLook.copy(pose.l)}
  // 場面ごとの画角(額縁の場面で絵を画面いっぱいに)。縦長の画面では広めに
  const fovT=phase==='tour'&&shot&&shot.s.fov?shot.s.fov*(camera.aspect<1?1.45:1):baseFov();
  if(Math.abs(camera.fov-fovT)>.01){camera.fov+=(fovT-camera.fov)*(paused?1:Math.min(1,dt*1.6));camera.updateProjectionMatrix()}
  camera.lookAt(camLook);
  if(phase==='tour')setCap(tau>1.5?shot.s.cap||null:null);
  // 真偽値にそろえる(undefined を toggle に渡すと毎フレーム付け外しが反転して、字幕などが上下にぶれる)
  const fr=!!(phase==='tour'&&shot&&shot.s.frame&&shot.u>.12&&shot.u<.94);
  $('frame').style.opacity=fr?1:0;$('plate').style.opacity=fr?1:0;document.body.classList.toggle('framed',fr);
  renderer.render(scene,camera);
  requestAnimationFrame(tick);
}
// 確認用: ?spread=N 見開きN / ?t=秒 ツアーのその時点で停止 / ?pc=秒 立ち上がり途中で真上から / ?flip=0..1 次へめくる途中 / ?view=x,y,z / ?auto=rise|back
if(qs.has('flip')&&active<N-1){target=active+1;updateNav();startFlip(+qs.get('flip'));paused=true;setLeaf(flip.k,Math.PI*easeIO(flip.t))}
if(qs.has('pc')){pc=+qs.get('pc');paused=true}
if(qs.has('view')){const [x,y,z]=qs.get('view').split(',').map(Number);tw={fp:V(x,y,z),fl:V(0,0,-2),tp:V(x,y,z),tl:V(0,0,-2),t:0,dur:1e9}}
if(qs.get('auto')==='rise')setTimeout(rise,300);
if(qs.get('auto')==='back')setTimeout(()=>{rise();setTimeout(()=>$('back').click(),2500)},300);
if(qs.has('t')&&built()){phase='tour';tau=+qs.get('t');pc=4.6;camFrom=topPose();paused=true;updateUI()}
requestAnimationFrame(tick);
