// ================= 本の骨組み =================
// 見開き N 枚。めくれる物(turnables)は N+1 個: 0 = 表紙、1..N-1 = 台紙(厚紙)、N = 裏表紙。
// それぞれ、右にあるとき上を向く面を「表」、下を向く面を「裏」と呼ぶ。見開き s の左ページ = turnables[s] の裏、右ページ = turnables[s+1] の表。
// 位置 pos: -1 = 閉じた本(表紙が上)、0..N-1 = 見開き、N = 閉じた本(裏表紙が上)。pos のとき turnables[0..pos] が左にある。
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
// 寸法(1 ≒ 1cm): 机の高さ、台紙と表紙の厚さ、表紙のはみ出し(チリ)、台紙の根元の蝶番の幅、台紙の板の幅、板の内側の端の位置
const DESK=-1.1,TL=.15,TC=.3,SQ=.4,HZ=1.0,HZP=HZ/PS,WB=WP-HZ,XIN=HZ+.2;
const TH=[...Array(N+1)].map((_,j)=>j===0||j===N?TC:TL);
const TOTAL=TH.reduce((a,b)=>a+b,0);
const CUM=TH.map((t,j)=>TH.slice(0,j).reduce((a,b)=>a+b,0)+t/2);   // 下(表紙側)から数えた、その板の中心までの厚さ
function pageMat(t,e=.2){const m=mat(t,e);m.side=THREE.FrontSide;m.polygonOffset=true;m.polygonOffsetFactor=m.polygonOffsetUnits=-1;return m}
function blankTex(spineLeft){
  const W=900,H=1400,c=cv(W,H),g=c.getContext('2d');
  paperBase(g,W,H);gutter(g,W,H,spineLeft);
  const t=new THREE.CanvasTexture(c);t.anisotropy=ANISO;return t;
}
const BLANK_L=pageMat(blankTex(false)),BLANK_R=pageMat(blankTex(true));
// ページの面は板の部分だけ(のど側の HZ は蝶番の帯が受け持つ)。u はページ全体に対する位置のまま
function pagePlane(x0,x1){
  const g=new THREE.PlaneGeometry(x1-x0,PFD).translate((x0+x1)/2,0,0),p=g.attributes.position,uv=g.attributes.uv;
  for(let i=0;i<p.count;i++)uv.setX(i,(p.getX(i)+18)/36);
  return g.rotateX(-Math.PI/2);
}
const FRONT_GEO=pagePlane(-18+HZP,18),BACK_GEO=pagePlane(-18,18-HZP);
// 小口(紙の層と貼り合わせの線)・紙・布
const EDGE_M=(()=>{
  const c=cv(64,32),g=c.getContext('2d');g.fillStyle='#ece2c8';g.fillRect(0,0,64,32);
  g.fillStyle='#d8caa6';g.fillRect(0,0,64,3);g.fillRect(0,29,64,3);g.fillStyle='#b9a77f';g.fillRect(0,15,64,2);
  const t=new THREE.CanvasTexture(c);t.wrapS=THREE.RepeatWrapping;t.repeat.set(6,1);
  return new THREE.MeshLambertMaterial({map:t,emissive:0x3a3428});
})();
const PAPER_M=lam(0xefe5cb,.3);
function clothBase(g,W,H){
  g.fillStyle='#5a1c1c';g.fillRect(0,0,W,H);
  brush(g,0,0,W,H,['#6a2424','#4a1414','#622020','#3e1010'],W*H/500,7,1.3,0,{jit:.1,alpha:.35});
  brush(g,0,0,W,H,['#6a2424','#4a1414','#3e1010'],W*H/900,7,1.3,Math.PI/2,{jit:.1,alpha:.25});
}
const CLOTH_M=(()=>{
  const t=tex(8,8,(g,w,h)=>{g.save();g.scale(w/256,h/256);clothBase(g,256,256);g.restore()},{ppu:32});
  t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(4,4);
  return new THREE.MeshLambertMaterial({map:t,emissive:0x140606});
})();
// 背: 布に、天と地の近くの金の帯
const SPINE_M=(()=>{
  const W=128,H=1024,c=cv(W,H),g=c.getContext('2d');clothBase(g,W,H);
  g.fillStyle='#c9a24a';for(const y of [52,66,H-70,H-56])g.fillRect(0,y,W,5);
  const t=new THREE.CanvasTexture(c);return new THREE.MeshLambertMaterial({map:t,emissive:0x140606});
})();
// 表紙と裏表紙(布張り、金の箔押し。表紙には作品の小さな絵をはめ込む)
const CW=WB+SQ,CD=DP+2*SQ;
function coverMat(back){
  const W=1230,H=Math.round(1230*CD/CW),c=cv(W,H),g=c.getContext('2d');
  clothBase(g,W,H);
  const GOLD='#d4ad55',gold=(txt,x,y,font)=>{g.font=font;g.fillStyle='rgba(20,4,4,.55)';g.fillText(txt,x+2,y+3);g.fillStyle=GOLD;g.fillText(txt,x,y)};
  g.strokeStyle=GOLD;g.lineWidth=6;g.strokeRect(56,56,W-112,H-112);g.lineWidth=2;g.strokeRect(78,78,W-156,H-156);
  for(const [x,y] of [[78,78],[W-78,78],[78,H-78],[W-78,H-78]]){g.save();g.translate(x,y);g.rotate(Math.PI/4);g.fillStyle=GOLD;g.fillRect(-12,-12,24,24);g.restore()}
  g.textAlign='center';
  const t=new THREE.CanvasTexture(c);t.anisotropy=ANISO;
  if(back){
    gold('おしまい',W/2,H*.47,`86px ${FONT}`);
    g.fillStyle=GOLD;g.fillRect(W/2-140,H*.47+50,280,2);
    gold('名画の飛び出す絵本',W/2,H-150,`40px ${FONT}`);
  }else{
    gold('名画の',W/2,310,`92px ${FONT}`);
    gold('飛び出す絵本',W/2,470,`150px ${FONT}`);
    const ix=W/2-400,iy=600;g.fillStyle='#2a1a10';g.fillRect(ix-14,iy-14,828,440);g.strokeStyle=GOLD;g.lineWidth=5;g.strokeRect(ix-14,iy-14,828,440);
    gold('西洋の名画　十の見開き',W/2,1200,`58px ${FONT}`);
    gold('A Pop-up Book of Masterpieces',W/2,1290,'italic 44px Georgia,serif');
    g.strokeStyle=GOLD;g.lineWidth=3;g.beginPath();g.arc(W/2,H-260,46,0,7);g.stroke();g.beginPath();g.arc(W/2,H-260,30,0,7);g.stroke();
    // はめ込む絵(目次のサムネイルを使う。読めたら描き足す)
    const im=new Image();im.onload=()=>{g.drawImage(im,ix,iy,800,412);t.needsUpdate=true;invalidate()};im.src='thumbs/08.jpg';
  }
  return new THREE.MeshLambertMaterial({map:t,emissive:new THREE.Color(.12,.1,.1),emissiveMap:t,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
}

// ---------- 曲がる帯(台紙の根元の蝶番と、背)。中心線の点と法線から、厚みのある帯を作る ----------
// 1点あたり 8頂点: 上面(手前・奥)、下面(手前・奥)、手前の端(上・下)、奥の端(上・下)。グループ 0=上面 1=下面 2=端
function makeRibbon(n,depth,uTop,uBot){
  const V=(n+1)*8,g=new THREE.BufferGeometry();
  const pos=new Float32Array(V*3),nor=new Float32Array(V*3),uv=new Float32Array(V*2);
  for(let i=0;i<=n;i++){
    const f=i/n,b=i*8,ut=uTop[0]+(uTop[1]-uTop[0])*f,ub=uBot[0]+(uBot[1]-uBot[0])*f;
    uv.set([ut,0,ut,1,ub,0,ub,1,f,1,f,0,f,1,f,0],b*2);
  }
  const top=[],bot=[],cap=[];
  for(let i=0;i<n;i++){
    const a=i*8,c=a+8;
    top.push(a,c,a+1,c,c+1,a+1);
    bot.push(a+2,a+3,c+2,c+2,a+3,c+3);
    cap.push(a+4,a+5,c+4,c+4,a+5,c+5, a+6,c+6,a+7,c+6,c+7,a+7);
  }
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('normal',new THREE.BufferAttribute(nor,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  g.setIndex([...top,...bot,...cap]);g.addGroup(0,top.length,0);g.addGroup(top.length,bot.length,1);g.addGroup(top.length+bot.length,cap.length,2);
  g.userData={n,depth};return g;
}
function setRibbon(g,pts,th){
  const {n,depth}=g.userData,p=g.attributes.position.array,q=g.attributes.normal.array,h=th/2,z=depth/2;
  for(let i=0;i<=n;i++){
    const a=pts[Math.max(0,i-1)],c=pts[Math.min(n,i+1)];let tx=c[0]-a[0],ty=c[1]-a[1];const l=Math.hypot(tx,ty)||1;
    const nx=-ty/l,ny=tx/l,[x,y]=pts[i],xt=x+nx*h,yt=y+ny*h,xb=x-nx*h,yb=y-ny*h,b=i*24;
    p.set([xt,yt,z, xt,yt,-z, xb,yb,z, xb,yb,-z, xt,yt,z, xb,yb,z, xt,yt,-z, xb,yb,-z],b);
    q.set([nx,ny,0, nx,ny,0, -nx,-ny,0, -nx,-ny,0, 0,0,1, 0,0,1, 0,0,-1, 0,0,-1],b);
  }
  g.attributes.position.needsUpdate=g.attributes.normal.needsUpdate=true;
}
const bez=(a,p1,p2,b,n,out,skip0)=>{for(let i=skip0?1:0;i<=n;i++){const t=i/n,u=1-t,k0=u*u*u,k1=3*u*u*t,k2=3*u*t*t,k3=t*t*t;out.push([k0*a[0]+k1*p1[0]+k2*p2[0]+k3*b[0],k0*a[1]+k1*p1[1]+k2*p2[1]+k3*b[1]])}return out};

// ---------- めくれる物を作る ----------
function pageGroup(T,cx,y,flip,blank){
  const g=new THREE.Group();g.position.set(cx,y,0);g.scale.setScalar(PS);if(flip)g.rotation.z=Math.PI;T.g.add(g);
  const m=new THREE.Mesh(flip?BACK_GEO:FRONT_GEO,blank);m.receiveShadow=true;g.add(m);
  return {g,m,T,side:flip?1:0};
}
// ページの絵を替える(蝶番の帯にも同じ絵の、のど側の端が載る)
function setPageMat(pg,m){pg.m.material=m;if(pg.T.hinge)pg.T.hinge.material[pg.side]=m}
const turnables=[];
for(let j=0;j<=N;j++){
  const t=TH[j],cover=j===0||j===N,g=new THREE.Group();scene.add(g);
  const T={j,t,g,phi:0,alpha:0,vel:0,front:null,back:null,hinge:null,K:cover?170:260};
  const bw=cover?CW:WB,bd=cover?CD:DP;
  const box=new THREE.Mesh(new THREE.BoxGeometry(bw,t,bd),cover?CLOTH_M:[EDGE_M,EDGE_M,PAPER_M,PAPER_M,EDGE_M,EDGE_M]);
  box.position.x=bw/2;box.castShadow=box.receiveShadow=true;g.add(box);
  const off=t/2+.003,cx=WP/2-HZ;
  if(j>0)T.front=pageGroup(T,cx,off,false,BLANK_R);   // 右ページ(見開き j-1)
  if(j<N)T.back=pageGroup(T,cx,-off,true,BLANK_L);    // 左ページ(見開き j)
  if(cover){
    const geo=new THREE.PlaneGeometry(bw,bd);
    if(j===0)geo.rotateX(-Math.PI/2).translate(bw/2,off,0);else geo.rotateX(Math.PI/2).rotateY(Math.PI).translate(bw/2,-off,0);
    const m=new THREE.Mesh(geo,coverMat(j===N));m.receiveShadow=true;g.add(m);
  }else{
    T.hinge=new THREE.Mesh(makeRibbon(8,DP,[0,HZP/36],[1,1-HZP/36]),[BLANK_R,BLANK_L,EDGE_M]);
    T.hinge.castShadow=T.hinge.receiveShadow=true;T.hinge.frustumCulled=false;scene.add(T.hinge);
  }
  turnables.push(T);
}
const SPINE_N=24,spine=new THREE.Mesh(makeRibbon(SPINE_N,CD,[0,1],[0,1]),[SPINE_M,SPINE_M,CLOTH_M]);
spine.castShadow=spine.receiveShadow=true;spine.frustumCulled=false;scene.add(spine);
const rightPage=s=>turnables[s+1].front;
const leftPage=s=>turnables[s].back;

// ---------- 置き方 ----------
// 背は、板が並ぶ順に付け根が並ぶ楕円の弧(外へ RO だけふくらむ)。開いている所に合わせて弧の向きが回る(閉じると側面、真ん中を開くと下)。
// 板の内側の端は、右に置いたとき (XIN, 右の束での高さ)、左では (-XIN, 左の束での高さ)。めくる間は付け根のまわりを上を通って回る。
// 板の向き(alpha)はばねで目標(phi)を追うので、持ち上げでは根元の帯が先に曲がり、着地で少し跳ねる。
const RW=TOTAL/2,RO=.35;
function layout(){
  let gap=0;for(const T of turnables)gap+=T.t*T.phi/Math.PI;
  const w=Math.PI*(1+gap/TOTAL),nx=Math.cos(w),ny=Math.sin(w),tx=-ny,ty=nx,cy=DESK+RO+(RW-RO)*Math.abs(nx);
  const at=u=>[RO*Math.cos(u)*nx+RW*Math.sin(u)*tx,cy+RO*Math.cos(u)*ny+RW*Math.sin(u)*ty];
  const tan=u=>{const dx=-RO*Math.sin(u)*nx+RW*Math.cos(u)*tx,dy=-RO*Math.sin(u)*ny+RW*Math.cos(u)*ty,l=Math.hypot(dx,dy)||1;return [dx/l,dy/l]};
  const uOf=j=>(CUM[j]/TOTAL-.5)*Math.PI;
  for(const T of turnables){
    const j=T.j,u=uOf(j),A=at(u);
    const vR=[XIN-A[0],DESK+TOTAL-CUM[j]-A[1]],vL=[-XIN-A[0],DESK+CUM[j]-A[1]];
    const aR=Math.atan2(vR[1],vR[0]);let aL=Math.atan2(vL[1],vL[0]);if(aL<aR)aL+=2*Math.PI;
    const k=T.phi/Math.PI,be=aR+(aL-aR)*k,L=Math.hypot(vR[0],vR[1])*(1-k)+Math.hypot(vL[0],vL[1])*k;
    const B=[A[0]+L*Math.cos(be),A[1]+L*Math.sin(be)];
    T.g.position.set(B[0],B[1],0);T.g.rotation.z=T.alpha;T.A=A;T.B=B;T.u=u;
    if(T.hinge){
      // 付け根では背の内側と弦の間の向きに出て、板の向きで板につながる
      const ch=[B[0]-A[0],B[1]-A[1]],cl=Math.hypot(ch[0],ch[1])||1,ix=-(A[0]),iy=cy-A[1],il=Math.hypot(ix,iy)||1;
      let dx=ix/il+ch[0]/cl,dy=iy/il+ch[1]/cl;const dl=Math.hypot(dx,dy)||1;dx/=dl;dy/=dl;
      const ca=Math.cos(T.alpha),sa=Math.sin(T.alpha);
      setRibbon(T.hinge.geometry,bez(A,[A[0]+dx*cl*.4,A[1]+dy*cl*.4],[B[0]-ca*cl*.4,B[1]-sa*cl*.4],B,8,[]),T.t);
    }
  }
  // 背: 表紙の内側の端 → 背の弧 → 裏表紙の内側の端
  const F=turnables[0],K=turnables[N],pts=[];
  const fa=[Math.cos(F.alpha),Math.sin(F.alpha)],ka=[Math.cos(K.alpha),Math.sin(K.alpha)],t0=tan(F.u),t1=tan(K.u);
  const l0=Math.hypot(F.A[0]-F.B[0],F.A[1]-F.B[1]),l1=Math.hypot(K.A[0]-K.B[0],K.A[1]-K.B[1]);
  bez(F.B,[F.B[0]-fa[0]*l0*.4,F.B[1]-fa[1]*l0*.4],[F.A[0]-t0[0]*l0*.4,F.A[1]-t0[1]*l0*.4],F.A,6,pts);
  for(let i=1;i<=12;i++)pts.push(at(F.u+(K.u-F.u)*i/12));
  bez(K.A,[K.A[0]+t1[0]*l1*.4,K.A[1]+t1[1]*l1*.4],[K.B[0]-ka[0]*l1*.4,K.B[1]-ka[1]*l1*.4],K.B,6,pts,true);
  setRibbon(spine.geometry,pts,.12);
}
// ばね(1/120秒きざみ)。束より先へは行かず、当たると少し跳ね返る
function stepSprings(dt){
  let moved=false;
  for(const T of turnables){
    if(Math.abs(T.alpha-T.phi)<1e-4&&Math.abs(T.vel)<1e-3){if(T.alpha!==T.phi||T.vel){T.alpha=T.phi;T.vel=0;moved=true}continue}
    if(dt<=0){moved=true;continue}
    const rm=REDUCED.matches,C=2*(rm?1:.5)*Math.sqrt(T.K),bounce=rm?0:.3;
    for(let s=Math.ceil(dt*120),h=dt/s;s>0;s--){
      T.vel+=(T.K*(T.phi-T.alpha)-C*T.vel)*h;T.alpha+=T.vel*h;
      if(T.alpha<0){T.alpha=0;T.vel=-T.vel*bounce}else if(T.alpha>Math.PI){T.alpha=Math.PI;T.vel=-T.vel*bounce}
    }
    moved=true;
  }
  return moved;
}
function placeAt(pos){for(const T of turnables){T.phi=T.alpha=T.j<=pos?Math.PI:0;T.vel=0}layout()}
{
  // 机
  const dt=tex(30,30,(g,w,h)=>{g.fillStyle='#24160d';g.fillRect(0,0,w,h);brush(g,0,0,w,h,['#2e1c10','#3a2416','#1c1109','#45301e'],3500,3,.12,0,{jit:.08,bend:.05})},{ppu:40});
  dt.wrapS=dt.wrapT=THREE.RepeatWrapping;dt.repeat.set(5,5);
  const desk=new THREE.Mesh(new THREE.PlaneGeometry(300,300),new THREE.MeshLambertMaterial({map:dt,emissive:0x0c0805}));
  desk.rotation.x=-Math.PI/2;desk.position.y=DESK;desk.receiveShadow=true;scene.add(desk);
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
    const fail=()=>{delete loadingP[i];sc.remove();ng(new Error('作品を読み込めませんでした: '+e.file))};
    // 途中で切れたり中で例外が出たりしても onload は来るので、登録されたかで確かめる
    sc.onload=()=>BOOK.works[i+1]?ok():fail();sc.onerror=fail;
    document.head.appendChild(sc);
  }));
}

// ================= 飛び出し(ページの開き具合に合わせて立ち上がる) =================
// 群ごとに「高さ / のどからの距離」の最大(r)を求めておき、相手のページ(開き角 open)に当たらない角度まで立てる。
// 閉じるときはすぐに畳み、開くときは少し遅れて(1秒に POP_RATE ラジアンまで)立ち上がる。extra は大きく開いてから動く。
// 動きを減らす設定(OS の prefers-reduced-motion)。カメラは場面ごとに止めて、めくりも短く
const REDUCED=matchMedia('(prefers-reduced-motion: reduce)');
const popEase=k=>REDUCED.matches?easeIO(k):easeOutBack(k);
const POP_RATE=5,HALF=Math.PI/2;
function popAngle(q,open){
  if(open>=HALF-1e-6||q.r<=0)return HALF;
  return Math.asin(Math.min(1,.9*Math.tan(Math.max(0,open))/q.r));
}
function setPop(q){
  const a=Math.max(.004,q.a),c=Math.cos(a),s=Math.max(.006,Math.sin(a)),lift=q.layer*.03*(1-a/HALF);
  q.g.matrix.set(1,c*q.dx,0,q.p[0], 0,s,0,q.p[1]+.012+lift, 0,c*q.dz,1,q.p[2], 0,0,0,1);
  q.g.matrixWorldNeedsUpdate=true;
}
function applyOpen(b,open,dt){
  if(open===b.open&&b.settled)return false;
  b.open=open;let settled=true,ch=false;
  for(const q of b.pops){
    const tgt=popAngle(q,open);let a=q.a;
    if(a===undefined||tgt<a||dt===Infinity)a=tgt;
    else if(tgt>a){a=Math.min(tgt,a+POP_RATE*dt);if(a<tgt)settled=false}
    if(a!==q.a){q.a=a;setPop(q);ch=true}
  }
  const x=clamp((open/Math.PI-.5)/.5,0,1),pe=1+4.6*x*x*(3-2*x);
  if(pe!==b.pe){b.pe=pe;ch=true;for(const e of b.extras)e.f(popEase(clamp((pe-e.delay)/e.dur,0,1)))}
  b.settled=settled;return ch;
}
const openOf=s=>clamp(turnables[s].alpha-turnables[s+1].alpha,0,Math.PI);
let debugOpen=null;   // 確認用 ?open=度
function updatePops(dt){
  let ch=false;
  for(let s=0;s<N;s++){const b=spreads[s].b;if(b&&b.root.visible&&applyOpen(b,s===active&&debugOpen!==null?debugOpen:openOf(s),dt))ch=true}
  return ch;
}
function popReach(b){
  for(const q of b.pops){q.a=HALF;setPop(q)}
  b.root.updateMatrixWorld(true);
  const inv=new THREE.Matrix4().copy(b.root.matrixWorld).invert(),M=new THREE.Matrix4(),v=new THREE.Vector3();
  for(const q of b.pops){
    let r=0;
    q.g.traverse(o=>{
      if(!o.isMesh)return;const g=o.geometry;if(!g.boundingBox)g.computeBoundingBox();
      M.multiplyMatrices(inv,o.matrixWorld);const {min,max}=g.boundingBox;
      for(let i=0;i<8;i++){
        v.set(i&1?max.x:min.x,i&2?max.y:min.y,i&4?max.z:min.z).applyMatrix4(M);
        if(v.y>0)r=Math.max(r,v.y/Math.max(1,v.x+18-HZP));   // のど側の折り目(板の内側の端)からの距離
      }
    });
    q.r=r;
  }
}

// ================= 作品の組み立て =================
// テクスチャを GPU へ送り終えたら、元の canvas は 1x1 に縮めてメモリを返す(先に組み立てた見開きは空き時間に少しずつ送る)。
// 開いている見開きと前後1つだけを残し、それより離れたものは捨てる(また開くときは組み立て直す。乱数の種が同じなので同じものができる)
function build(s){
  const sp=spreads[s];if(!sp||!sp.work||sp.b)return sp&&sp.b;
  const w=sp.work;reseed(w.seed||(s+1)*7919);
  setPageMat(leftPage(s),pageMat(descTex(w,2*s+1)));
  setPageMat(rightPage(s),pageMat(groundTex(w,2*s+2),.42));
  const root=new THREE.Group();root.visible=false;rightPage(s).g.add(root);
  const b={root,pops:[],extras:[],lights:[],tick:null,live:false,res:null,open:NaN,pe:NaN,settled:false};
  const B={no:w.no,root,
    pop(parent,p,dir,delay,dur=1.1,layer=1){const g=new THREE.Group();g.matrixAutoUpdate=false;parent.add(g);b.pops.push({g,p,dx:dir[0],dz:dir[1],delay,dur,layer});return g},
    extra(delay,dur,f){b.extras.push({delay,dur,f})},
    light(l){l.visible=false;scene.add(l);b.lights.push(l);return l}};
  const r=w.build(B)||{};b.tick=r.tick;b.live=!!r.liveShadows;
  popReach(b);
  mergeStatic(b);
  for(const q of b.pops)q.a=undefined;applyOpen(b,0,Infinity);b.open=NaN;
  b.res=collect(b,s);track(b.res.texs);sp.b=b;return b;
}
// ================= 描画命令を減らす =================
// 動かない部品を、同じ立ち上がりの群(B.pop)の中で、同じマテリアルどうし1つの形にまとめる。
// 動く物 = 自分か祖先に userData.live があるもの、または試しに開き具合・extra・tick を動かして位置・向き・大きさが変わったもの
function liveSet(b){
  const objs=[];b.root.traverse(o=>objs.push(o));
  const snap=()=>objs.map(o=>[...o.position.toArray(),...o.quaternion.toArray(),...o.scale.toArray()].join());
  // 途中で動いて最後に元へ戻る部品(大きさ 0→1 など)も拾えるように、試すたびに比べる
  const before=snap(),live=new Set();
  const cmp=()=>snap().forEach((v,i)=>{if(v!==before[i])live.add(objs[i])});
  for(const o of [0,.4,.8,1.2,1.5,1.8,2.2,2.6,Math.PI]){b.settled=false;applyOpen(b,o,Infinity);cmp()}
  if(b.tick){b.root.updateMatrixWorld(true);for(const T of [0,1.3,7.7,31]){b.tick(T,.016);cmp()}}
  for(const o of objs)if(o.userData.live)live.add(o);
  return live;
}
function mergeStatic(b){
  const live=liveSet(b),domains=new Set([b.root,...b.pops.map(q=>q.g)]),groups=new Map();
  const plainOBR=THREE.Object3D.prototype.onBeforeRender;
  b.root.traverse(o=>{
    if(!o.isMesh||o.isInstancedMesh||o.isSkinnedMesh||o.children.length||!o.visible||Array.isArray(o.material)||o.material.transparent||o.onBeforeRender!==plainOBR)return;
    const g=o.geometry,at=g.attributes;
    if(!at.position||g.drawRange.start!==0||g.drawRange.count!==Infinity||Object.keys(g.morphAttributes).length)return;
    if(Object.values(at).some(a=>a.isInterleavedBufferAttribute||!(a.array instanceof Float32Array)))return;
    // 群までたどる。途中に動く物があれば外す
    let dom=null;
    for(let p=o;p;p=p.parent){if(live.has(p))return;if(p!==o&&domains.has(p)){dom=p;break}}
    if(!dom)return;
    const dm=o.customDepthMaterial;
    const key=[o.material.uuid,o.castShadow,o.receiveShadow,o.renderOrder,o.frustumCulled,Object.keys(at).sort().join(),dm?`${dm.map&&dm.map.uuid}:${dm.alphaTest}`:'-'].join('|');
    if(!groups.has(dom))groups.set(dom,new Map());
    const m=groups.get(dom);if(!m.has(key))m.set(key,[]);m.get(key).push(o);
  });
  for(const [dom,m] of groups)for(const list of m.values()){
    if(list.length<2)continue;
    const src=list[0],mesh=new THREE.Mesh(mergeGeos(list,dom),src.material);
    mesh.castShadow=src.castShadow;mesh.receiveShadow=src.receiveShadow;mesh.renderOrder=src.renderOrder;mesh.frustumCulled=src.frustumCulled;
    if(src.customDepthMaterial)mesh.customDepthMaterial=src.customDepthMaterial;
    for(const o of list)o.parent.remove(o);
    dom.add(mesh);
  }
}
// 群から見た位置に直して1つの BufferGeometry にする(鏡に映した部品は三角形の向きを裏返す)
function mergeGeos(list,dom){
  const names=Object.keys(list[0].geometry.attributes);
  let nv=0,ni=0;
  for(const o of list){const g=o.geometry,c=g.attributes.position.count;nv+=c;ni+=g.index?g.index.count:c}
  const out={};for(const n of names){const a=list[0].geometry.attributes[n];out[n]=new THREE.BufferAttribute(new Float32Array(nv*a.itemSize),a.itemSize,a.normalized)}
  const idx=new (nv>65535?Uint32Array:Uint16Array)(ni);
  const M=new THREE.Matrix4(),NM=new THREE.Matrix3(),v=new THREE.Vector3();
  let vo=0,io=0;
  for(const o of list){
    M.identity();for(let p=o;p!==dom;p=p.parent){if(p.matrixAutoUpdate)p.updateMatrix();M.premultiply(p.matrix)}
    NM.getNormalMatrix(M);const flip=M.determinant()<0,g=o.geometry,cnt=g.attributes.position.count;
    for(const n of names){
      const a=g.attributes[n],d=out[n],s=a.itemSize;
      for(let i=0;i<cnt;i++){
        if(n==='position'){v.fromBufferAttribute(a,i).applyMatrix4(M);d.setXYZ(vo+i,v.x,v.y,v.z)}
        else if(n==='normal'){v.fromBufferAttribute(a,i).applyMatrix3(NM).normalize();d.setXYZ(vo+i,v.x,v.y,v.z)}
        else for(let k=0;k<s;k++)d.array[(vo+i)*s+k]=a.array[i*s+k];
      }
    }
    const src=g.index&&g.index.array,n=src?src.length:cnt;
    for(let i=0;i+2<n;i+=3){
      const a0=src?src[i]:i,a1=src?src[i+1]:i+1,a2=src?src[i+2]:i+2;
      idx[io++]=vo+a0;if(flip){idx[io++]=vo+a2;idx[io++]=vo+a1}else{idx[io++]=vo+a1;idx[io++]=vo+a2}
    }
    vo+=cnt;
  }
  const geo=new THREE.BufferGeometry();
  for(const n of names)geo.setAttribute(n,out[n]);
  geo.setIndex(new THREE.BufferAttribute(io<idx.length?idx.slice(0,io):idx,1));geo.computeBoundingSphere();
  return geo;
}
// 見開きどうしで使い回している物は捨てない
const SHARED=new Set([FRONT_GEO,BACK_GEO,BLANK_L,BLANK_R,BLANK_L.map,BLANK_R.map,TAB_M]);
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
  setPageMat(leftPage(s),BLANK_L);setPageMat(rightPage(s),BLANK_R);
  sp.b=null;
}
function trim(){spreads.forEach((sp,i)=>{if(sp.b&&Math.abs(i-active)>1&&i!==target)dispose(i)})}
function showOnly(...idx){
  spreads.forEach((sp,i)=>{
    if(!sp.b)return;const on=idx.includes(i);
    if(on&&!sp.b.root.visible){sp.b.open=NaN;sp.b.settled=false}   // 見え始めたら開き具合を当て直す
    sp.b.root.visible=on;
    const first=idx.find(k=>spreads[k]&&spreads[k].b);
    for(const l of sp.b.lights)l.visible=on&&i===first;
  });
  renderer.shadowMap.needsUpdate=true;invalidate();
}
// 描画は画面が変わるときだけ(全体を見て待っているときや一時停止中は描かない)
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
// 本全体を見る視点: 真上から少し手前に倒す(厚みや段差、立ち上がった部品が見えるように)。閉じた本のときは本の位置に合わせる
const ELEV=62*Math.PI/180;
function topPose(p=active){
  const closed=p<0||p>=N,half=XIN+CW,cx=closed?(p<0?1:-1)*half/2:0;
  const tanV=Math.tan(baseFov()*Math.PI/360);
  const needV=CD*Math.sin(ELEV)+(closed?3:12)*Math.cos(ELEV);
  const needH=(closed?half/2:half)+1.5;
  const dist=Math.max(needV*.8/tanV,needH*1.1/(tanV*camera.aspect));
  const L=V(cx,closed?0:1.5,closed?1.5:0);
  return {p:V(cx,L.y+Math.sin(ELEV)*dist,L.z+Math.cos(ELEV)*dist),l:L};
}

// ================= 状態 =================
// phase: top(全体を見ている) / tour(巡回) / move(全体の視点へ戻る) / turn(めくる) / wait(読み込み待ち)
const qs=new URLSearchParams(location.search);
let active=qs.has('spread')?clamp((+qs.get('spread')|0)-1,0,N-1):-1;
let target=active,phase='top',tau=0,turnQ=null,paused=false,T=0,afterMove=null,looped=false,settling=false;
placeAt(active);
let blend=null,tw=null;
const camLook=V(0,0,0);
{const t=topPose();camera.position.copy(t.p);camLook.copy(t.l);camera.lookAt(camLook)}
const $=id=>document.getElementById(id);
const isSpread=p=>p>=0&&p<N;
const work=()=>isSpread(active)?spreads[active].work:null,built=()=>isSpread(active)?spreads[active].b:null;
function updateNav(){
  const m=isSpread(target)&&spreads[target].meta;
  $('pg').textContent=target<0?'表紙':target>=N?'裏表紙':`見開き ${target+1} / ${N}　${m?m.name:'白紙'}`;
  $('prev').disabled=target<=-1;$('next').disabled=target>=N;
  $('title').querySelector('b').textContent=m?m.name:'　';
  $('info').disabled=!m;
}
function updateUI(){
  $('back').style.display=phase==='tour'?'flex':'none';
  $('tap').classList.toggle('on',phase==='top'&&(!isSpread(active)||!!built()));
  $('tap').textContent=active<0?`表紙を${TAP_WORD}すると、本が開きます`:active>=N?`おしまい　${TAP_WORD}すると、もう一度開きます`:`${TAP_WORD}すると、近くで見てまわります`;
  $('prog').classList.toggle('on',phase==='tour');
  $('nextw').classList.toggle('on',phase==='tour'&&looped);
  $('nextw').firstChild.textContent=active>=N-1?'本を閉じる':'次の作品へ';
}
function tweenTo(pose,dur){tw={fp:camera.position.clone(),fl:camLook.clone(),tp:pose.p,tl:pose.l,t:0,dur}}
function moveThen(next){setCap(null);setPaused(false);phase='move';afterMove=next;orbit.yaw=orbit.pitch=0;tweenTo(topPose(),REDUCED.matches?.5:1.1);updateUI()}
// 1枚ずつめくる。台紙 1.5秒、表紙 1.9秒、何枚も送るときは速く(動きを減らす設定では 0.5秒)
function startTurn(t0=0){
  const fwd=target>active,j=fwd?active+1:active,to=active+(fwd?1:-1),cover=j===0||j===N;
  const dur=REDUCED.matches?.5:Math.abs(target-active)>1?(cover?1:.8):(cover?1.9:1.5);
  turnQ={j,from:fwd?0:Math.PI,to:fwd?Math.PI:0,pos:to,t:t0,dur};settling=false;
  showOnly(active,to);phase='turn';
  // 表紙を開け閉めするときは、カメラも本の位置へ動かす
  const tp=topPose(to);if(!qs.has('view')&&tp.p.distanceTo(camera.position)>.5)tweenTo(tp,dur);
}
function turnStep(dt){
  const q=turnQ;q.t=Math.min(1,q.t+dt/q.dur);
  turnables[q.j].phi=q.from+(q.to-q.from)*easeIO(q.t);
  if(q.t<1)return;
  active=q.pos;turnQ=null;
  if(active!==target){startTurn();return}
  phase='top';settling=true;   // 後片付けは tick で、板のばねと部品が落ち着いてから(settle)
  history.replaceState(null,'',(isSpread(active)?'?spread='+(active+1):location.pathname)+location.hash);
  updateUI();
}
function settle(){settling=false;showOnly(active);trim();prCap=PR_MAX;prebuild()}
// めくる先は、読み込んで組み立ててからめくり始める(phase=wait の間は操作を受けない)
function request(i){
  if(i<-1||i>N||i===active||(phase!=='top'&&phase!=='tour'))return;
  target=i;updateNav();idleTok++;
  const go=()=>{
    phase='wait';updateUI();
    const need=isSpread(i)?loadWork(i).then(()=>build(i)):Promise.resolve();
    need.then(()=>{startTurn();updateUI()}).catch(err=>{
      console.error(err);target=active;updateNav();phase='top';updateUI();prebuild();
    });
  };
  if(phase==='tour')moveThen(go);else go();
}
// 全体を見て止まっている間に、前後の見開きを先に読み込んで組み立てておく
// idle(f): f(late) を空き時間に呼ぶ。late() は持ち時間を使い切ったら true
const idle=window.requestIdleCallback?f=>requestIdleCallback(d=>f(()=>d.timeRemaining()<4),{timeout:1500})
  :f=>setTimeout(()=>{const t=performance.now();f(()=>performance.now()-t>8)},300);
let idleTok=0;
function prebuild(){
  const tok=++idleTok,todo=[active+1,active-1].filter(isSpread);
  const still=()=>tok===idleTok&&phase==='top'&&!tw&&!settling;
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
function startTour(){if(phase!=='top'||!built())return;idleTok++;setPaused(false);$('plate').innerHTML=work().plate||'';phase='tour';tau=0;looped=false;noBL=-1;blendFrom(REDUCED.matches?.8:3);makeProg();fitCap();updateUI()}
// 全体を見ているときのタップ: 見開きならツアー、閉じた本なら開く
function tapAction(){if(phase!=='top')return;if(active<0)request(0);else if(active>=N)request(N-1);else startTour()}
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
  blendFrom(REDUCED.matches?.4:1.2);tau=w.tour[i].t0;noBL=i;invalidate();
}
$('sprev').onclick=()=>{if(phase==='tour')gotoScene(curScene()-1)};$('snext').onclick=()=>{if(phase==='tour')gotoScene(curScene()+1)};
$('dots').onclick=e=>{const b=e.target.closest('button');if(b)gotoScene(+b.dataset.i)};
$('nextw').onclick=()=>request(active+1);
$('tap').onclick=tapAction;
$('prev').onclick=()=>request(active-1);$('next').onclick=()=>request(active+1);
$('back').onclick=()=>{if(phase==='tour')moveThen(()=>{phase='top';updateUI();prebuild()})};
addEventListener('keydown',e=>{
  if(document.querySelector('dialog[open]'))return;
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
    const d=e.key==='ArrowRight'?1:-1;
    if(e.shiftKey&&phase==='tour')gotoScene(curScene()+d);else request(active+d);
  }
  // スペース: ツアー中は一時停止・再開、全体を見ているときはタップと同じ(ボタンにフォーカスがあるときはボタンに任せる)
  if(e.key===' '&&!(e.target instanceof HTMLButtonElement)){e.preventDefault();if(e.repeat)return;if(phase==='tour')setPaused(!paused);else tapAction()}
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
function openSheet(retry){
  if(!isSpread(target))return;
  const w=spreads[target].work;
  if(!w){if(retry&&spreads[target].meta)loadWork(target).then(()=>openSheet(false),err=>console.error(err));return}
  if($('sheet').open)return;
  const d=w.desc;
  $('sheet-b').innerHTML=`<div class="no">第 ${w.no} 話</div><h2 id="sheet-h">${esc(w.name)}</h2><div class="orig">${esc(d.orig)}</div>`+
    `<div class="meta">${esc(d.artist)}<small>${esc(d.medium)}</small></div>${d.paras.map(t=>`<p>${esc(t)}</p>`).join('')}`+
    (d.points?`<h3>見どころ</h3><ul>${d.points.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:'');
  openDlg($('sheet'));
}
$('info').onclick=()=>openSheet(true);
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
//   全体を見ているとき: タップ(どこでも)で、見開きならツアー、閉じた本なら開く / 横にスワイプでページをめくる
//   ツアー中: タップで一時停止・再開 / ドラッグで視点を少し回す(その間ツアーは止まり、離すと戻る)
const orbit={yaw:0,pitch:0,drag:false};
let down=null;
const cvs=renderer.domElement;
// テクスチャの元の canvas は捨ててあるので、WebGL のコンテキストが失われて戻ったときは読み込み直す
cvs.addEventListener('webglcontextrestored',()=>location.reload());
cvs.addEventListener('pointerdown',e=>{if(down||e.button!==0)return;down={id:e.pointerId,x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY,moved:false};cvs.setPointerCapture(e.pointerId)});
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
  if(!moved){if(phase==='top')tapAction();else if(phase==='tour')setPaused(!paused);return}
  if(phase==='top'&&Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)request(active+(dx<0?1:-1));
}
cvs.addEventListener('pointerup',e=>endPointer(e,false));
cvs.addEventListener('pointercancel',e=>endPointer(e,true));
cvs.addEventListener('lostpointercapture',e=>endPointer(e,true));
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
function setCap(k){
  if(k===capNow)return;capNow=k;
  if(k){capEl.textContent=work().caps[k];capEl.style.opacity=1}else capEl.style.opacity=0;
  capEl.style.pointerEvents=k?'auto':'none';
}
capEl.onclick=()=>{if(phase==='tour')setPaused(!paused)};
// 字幕の高さをその作品でいちばん長い字幕に合わせる(見えない複製で測る)
const capM=capEl.cloneNode();capM.id='capm';capM.removeAttribute('aria-live');capM.setAttribute('aria-hidden','true');capEl.parentNode.appendChild(capM);
function fitCap(){
  const w=work();if(!w)return;let h=0;
  for(const k in w.caps){capM.textContent=w.caps[k];h=Math.max(h,capM.offsetHeight)}
  capEl.style.minHeight=h+'px';
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
const prQ=+qs.get('pr'),prFixed=qs.has('pr')&&Number.isFinite(prQ),perf={t:0,n:0,good:0};
let pr=prFixed?clamp(prQ,.5,3):PR_MAX,prCap=PR_MAX;
renderer.setPixelRatio(pr);
function adaptPR(raw){
  if(prFixed)return;
  if(raw>.25){perf.t=perf.n=0;return}   // 組み立てやタブの切り替えで空いた時間は数えない
  perf.t+=raw;perf.n++;if(perf.t<2)return;
  const avg=perf.t/perf.n;perf.t=perf.n=0;
  // 比率を変えると canvas が消えるので、次のフレームで必ず描き直す
  if(avg>1/40&&pr>PR_MIN){prCap=pr-.25;pr=Math.max(PR_MIN,pr-.25);perf.good=0;renderer.setPixelRatio(pr);invalidate()}
  else if(avg<1/55&&pr<prCap){if(++perf.good>=3){pr=Math.min(prCap,pr+.25);perf.good=0;renderer.setPixelRatio(pr);invalidate()}}
  else perf.good=0;
}

let freeze=false;   // 確認用 ?flip でめくり途中に止める
const SLOW=Math.max(1,+qs.get('slow')||1);   // 確認用 ?slow=倍率 でめくりをゆっくり
let last=performance.now(),drewLast=false,frame=0,frLast=null;
const _bp=new THREE.Vector3(),_bl=new THREE.Vector3(),_pose={p:_bp,l:_bl};
function tick(now){
  const raw=(now-last)/1000,rdt=Math.min(.05,raw);last=now;frame++;
  let dt=paused?0:rdt;T+=dt;
  const mdt=freeze?0:rdt/SLOW;   // めくり・カメラの移動用(一時停止では止めない)
  let pose=null,shot=null;
  if(phase==='tour'){
    const w=work();
    // ドラッグ中はツアーの時間を止める
    if(!orbit.drag)tau+=dt*sceneRate(w,curScene());
    if(!looped&&tau>=w.tourEnd){looped=true;updateUI()}
    shot=tourPose(w,tau);pose=shot;
    if(blend){blend.t+=dt;const k=easeIO(blend.t/blend.dur);_bp.copy(blend.p).lerp(pose.p,k);_bl.copy(blend.l).lerp(pose.l,k);pose=_pose;if(blend.t>=blend.dur)blend=null}
  }else if(phase==='move'){
    if(!tw){const f=afterMove;afterMove=null;f&&f()}
  }else if(phase==='turn'){
    turnStep(mdt);
  }
  // 手を離したら視点のずれを戻す(一時停止中でも戻す)
  if(!orbit.drag&&(orbit.yaw||orbit.pitch)){const k=Math.exp(-rdt*4);orbit.yaw*=k;orbit.pitch*=k;if(Math.abs(orbit.yaw)+Math.abs(orbit.pitch)<1e-3)orbit.yaw=orbit.pitch=0}
  // 本: めくっている間とばねが落ち着くまで置き直す。飛び出しは開き具合が変わった見開きだけ当て直す
  const bookMoved=stepSprings(mdt)||phase==='turn';
  if(bookMoved)layout();
  const popsMoved=updatePops(mdt);
  if(settling&&phase==='top'&&!bookMoved&&!popsMoved)settle();
  const b=built();
  if(b&&b.tick)b.tick(T,dt);
  // 影: 本や部品が動くときは毎フレーム、影を落とす部品が tick で動く作品は4フレームに1回、それ以外は計算し直さない
  if(bookMoved||popsMoved||(b&&b.live&&dt>0&&frame%4===0))renderer.shadowMap.needsUpdate=true;
  const twOn=!!tw;
  if(tw){tw.t+=mdt;const k=easeIO(tw.t/tw.dur);_bp.copy(tw.fp).lerp(tw.tp,k);_bl.copy(tw.fl).lerp(tw.tl,k);pose=_pose;if(tw.t>=tw.dur)tw=null}
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
  const moving=(phase==='tour'&&!paused)||phase==='move'||phase==='turn'||twOn||bookMoved||popsMoved||fovMoved||orbit.drag||!!(orbit.yaw||orbit.pitch);
  if(moving||needRender){
    // 動いたフレームのあとにもう1枚描く(tick が灯りの位置などを1フレーム遅れで追うため)
    renderer.render(scene,camera);needRender=moving;
    if(unsent.size)sweep();
    if(drewLast)adaptPR(raw);drewLast=true;
  }else drewLast=false;
  requestAnimationFrame(tick);
}
// 最初の見開きは読み込み中の表示を一度描かせてから組み立てる(組み立ての間、画面が真っ暗にならないように)
// 閉じた本から始めるときも、表紙を開いてすぐ立ち上がるように見開き1を組み立てておく
async function boot(){
  const first=clamp(active,0,N-1);
  let ok=true;
  try{await loadWork(first)}catch(err){console.error(err);ok=false;if(isSpread(active)){$('loading').querySelector('span').textContent='読み込めませんでした。ページを再読み込みしてください';return}}
  if(ok)build(first);if(isSpread(active))showOnly(active);updateUI();
  // 確認用: ?spread=N 見開きN / ?t=秒 ツアーのその時点で停止 / ?open=度 開き具合 / ?flip=0..1 次へめくる途中 / ?slow=倍率 / ?view=x,y,z(カメラを固定) / ?auto=tour|back
  if(qs.has('flip')&&active<N){
    target=active+1;updateNav();if(isSpread(target)){await loadWork(target);build(target)}
    startTurn(clamp(+qs.get('flip')||0,0,.999));freeze=true;turnStep(0);const J=turnables[turnQ.j];J.alpha=J.phi;layout();
  }
  if(qs.has('open'))debugOpen=clamp(+qs.get('open'),0,180)*Math.PI/180;
  if(qs.has('view')){const [x,y,z]=qs.get('view').split(',').map(Number);tw={fp:V(x,y,z),fl:V(0,0,-2),tp:V(x,y,z),tl:V(0,0,-2),t:0,dur:1e9}}
  if(qs.get('auto')==='tour')setTimeout(startTour,300);
  if(qs.get('auto')==='back')setTimeout(()=>{startTour();setTimeout(()=>$('back').click(),2500)},300);
  if(qs.has('t')&&built()){$('plate').innerHTML=work().plate||'';phase='tour';tau=+qs.get('t');blend=null;looped=tau>=work().tourEnd;setPaused(true);makeProg();fitCap();updateUI()}
  updatePops(Infinity);renderer.shadowMap.needsUpdate=true;   // 閉じた本から始めると影を作る合図が出ないので、ここで一度作る
  last=performance.now();requestAnimationFrame(tick);
  requestAnimationFrame(()=>{$('loading').classList.add('done');setTimeout(()=>{$('loading').hidden=true},900)});
  if(phase==='top')prebuild();
}
requestAnimationFrame(()=>setTimeout(boot,30));
