'use strict';
// OP のモック本体。js/book.js のあとに読む(book.js の変数・関数をそのまま使う)。
//   ?op=1  机の上の一冊: 暗い書斎でランプが灯り、カメラが本に寄って、表紙の金箔に光が走る
//   ?op=2  扉で飛び出す: 表紙がひとりでに開き、扉の見開きでタイトルと額縁が立ち上がり、見開き1へめくれる
// どちらも毎回流れ、終わるまで操作を受けない(タップで飛ばせない)。音はなし。
if(OP){
  // 操作を止める: 画面を覆う透明な板と、キー入力の横取り。UI は OP の間は隠す
  const css=document.createElement('style');
  css.textContent=`html.op body>*:not(canvas):not(#loading):not(#opblock){opacity:0!important;pointer-events:none!important}
body>*{transition:opacity .9s}
#opblock{position:fixed;inset:0;z-index:9}`;
  document.head.appendChild(css);
  const block=document.createElement('div');block.id='opblock';document.body.appendChild(block);
  const keyBlock=e=>{e.stopImmediatePropagation();e.preventDefault()};
  addEventListener('keydown',keyBlock,true);
  phase='op';   // tapAction / request は phase が top でないと動かない。boot も先読みをしない
  const ease=k=>easeIO(clamp(k,0,1)),seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
  let t0=null,done=false;
  // ?only(OP だけ見る): 終わっても UI は出さず、操作も止めたまま。mock/index.html に終わったことを知らせる
  const ONLY=qs.has('only');
  function finish(){
    done=true;
    if(ONLY){parent.postMessage('op-done','*');return}
    phase='top';
    block.remove();removeEventListener('keydown',keyBlock,true);
    document.documentElement.classList.remove('op');
    updateNav();updateUI();prebuild();invalidate();
  }

  if(OP===1){
    // ---- 案1: 机の上の一冊 ----
    const amb=scene.children.find(o=>o.isAmbientLight);
    const KEY=key.intensity,RIM=rim.intensity,AMB=amb.intensity,KEYC=key.color.clone(),WARM=new THREE.Color(0xffb070);
    key.intensity=rim.intensity=0;amb.intensity=.03;
    // 自分で光る分(emissive)も暗くして、ランプが点くまでは本がほとんど見えないように
    const ems=new Map();scene.traverse(o=>{for(const m of [].concat(o.material||[]))if(m.emissive&&!ems.has(m))ems.set(m,m.emissive.clone())});
    const setEm=f=>{for(const [m,c] of ems)m.emissive.copy(c).multiplyScalar(f)};
    // カメラ: 低く遠く、少し横から → いつもの全体の視点へ
    const end=topPose(-1),L=end.l.clone(),off=end.p.clone().sub(L);
    const start=L.clone().add(off.clone().multiplyScalar(1.7).applyAxisAngle(new THREE.Vector3(1,0,0),.55).applyAxisAngle(new THREE.Vector3(0,1,0),-.45));
    camera.position.copy(start);camLook.copy(L);
    // 金箔の光: 表紙の金の部分だけを覆う板に、斜めの光の帯を流す(加算合成)
    const W=1230,H=Math.round(1230*CD/CW),c=cv(W,H),g=c.getContext('2d');
    g.fillStyle=g.strokeStyle='#fff';g.textAlign='center';
    g.lineWidth=6;g.strokeRect(56,56,W-112,H-112);g.lineWidth=2;g.strokeRect(78,78,W-156,H-156);
    for(const [x,y] of [[78,78],[W-78,78],[78,H-78],[W-78,H-78]]){g.save();g.translate(x,y);g.rotate(Math.PI/4);g.fillRect(-12,-12,24,24);g.restore()}
    const tx=(s,y,f)=>{g.font=f;g.fillText(s,W/2,y)};
    tx('名画の',310,`92px ${FONT}`);tx('飛び出す絵本',470,`150px ${FONT}`);
    g.lineWidth=5;g.strokeRect(W/2-414,586,828,440);
    tx('西洋の名画　十の見開き',1200,`58px ${FONT}`);tx('A Pop-up Book of Masterpieces',1290,'italic 44px Georgia,serif');
    g.lineWidth=3;g.beginPath();g.arc(W/2,H-260,46,0,7);g.stroke();g.beginPath();g.arc(W/2,H-260,30,0,7);g.stroke();
    const glintM=new THREE.ShaderMaterial({
      uniforms:{map:{value:new THREE.CanvasTexture(c)},p:{value:-1},k:{value:0}},
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'uniform sampler2D map;uniform float p,k;varying vec2 vUv;void main(){float a=texture2D(map,vUv).a;float d=vUv.x*.5+(1.-vUv.y)-p;float b=exp(-d*d*160.)+.25*exp(-d*d*12.);gl_FragColor=vec4(vec3(1.,.86,.55)*a*b*k,1.);}',
      blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
    const glint=new THREE.Mesh(new THREE.PlaneGeometry(CW,CD).rotateX(-Math.PI/2).translate(CW/2,TC/2+.006,0),glintM);
    turnables[0].g.add(glint);
    // ランプの点き方: 2回またたいてから、暖かい色で灯り、いつもの色へ
    const flick=t=>t<.9?0:t<1.0?.55:t<1.12?.05:t<1.22?.8:t<1.32?.25:Math.min(1,.7+.3*seg(t,1.32,2.6));
    function step(t){
      const f=flick(t);key.intensity=KEY*f;key.color.copy(WARM).lerp(KEYC,seg(t,1.3,3.2));
      amb.intensity=.03+(AMB-.03)*ease(seg(t,1.1,3.4));setEm(.06+.94*ease(seg(t,1.1,3.4)));rim.intensity=RIM*ease(seg(t,1.8,3.6));
      const k=ease(seg(t,0,4.4));camera.position.lerpVectors(start,end.p,k);camLook.copy(L);
      glintM.uniforms.p.value=-.3+2.2*ease(seg(t,3.4,5.1));glintM.uniforms.k.value=t>3.3&&t<5.2?2.4:0;
      if(t>=5.4){glint.visible=false;key.intensity=KEY;key.color.copy(KEYC);amb.intensity=AMB;rim.intensity=RIM;setEm(1);camera.position.copy(end.p);finish()}
    }
    step(0);
    const loop=now=>{
      if(done)return;
      if(t0===null&&$('loading').classList.contains('done'))t0=now;
      if(t0!==null)step(qs.has('opt')?+qs.get('opt'):(now-t0)/1000);   // 確認用 ?opt=秒 でその時点に止める
      invalidate();requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  if(OP===2){
    // ---- 案2: 扉で飛び出す ----
    // 扉の左(表紙の見返し)は「はじめに」。descTex を扉のときだけ差し替える
    const descTex0=descTex;
    descTex=function(w,num){
      if(!w.title)return descTex0(w,num);
      const S=30,W=PFW*S,H=PFD*S,c=cv(W,H),g=c.getContext('2d');
      paperBase(g,W,H);gutter(g,W,H,false);
      g.textAlign='center';g.fillStyle='#8a6a2a';g.font=`${1.1*S}px ${FONT}`;g.fillText('は じ め に',W/2,14*S);
      g.strokeStyle='#b8a47a';g.lineWidth=.06*S;g.beginPath();g.moveTo(W/2-5*S,15.6*S);g.lineTo(W/2+5*S,15.6*S);g.stroke();
      g.fillStyle='#3a2e1e';g.font=`${1.1*S}px ${FONT}`;
      ['この本には、西洋の名画が十枚、','紙の立体になって綴じられています。','','ページをめくり、絵を'+TAP_WORD+'すると、','絵が立ち上がり、','近くをめぐって案内します。','','どうぞ、ごゆっくり。'].forEach((s,i)=>g.fillText(s,W/2,(20+i*2.1)*S));
      g.fillStyle='#c9a24a';for(const x of [-2,0,2]){g.beginPath();g.arc(W/2+x*S,40*S,.22*S,0,7);g.fill()}
      const t=new THREE.CanvasTexture(c);t.anisotropy=ANISO;return t;
    };
    // 目次のサムネイルを1つずらす(扉にはサムネイルがない)
    $('toclist').querySelectorAll('img').forEach((im,i)=>{if(i===0)im.style.visibility='hidden';else im.src=`thumbs/${String(i).padStart(2,'0')}.jpg`});
    const pagePose=(p,l)=>{const g=rightPage(0).g;g.updateMatrixWorld(true);return {p:g.localToWorld(p),l:g.localToWorld(l)}};
    let stage=0,ts=0;
    const loop=now=>{
      if(done)return;
      const t=now/1000;
      if(stage===0&&$('loading').classList.contains('done')){
        stage=1;ts=t;
        // 見開き1(グランド・ジャット)は、読み込み画面が消えている間に組み立てておく
        loadWork(1).then(()=>build(1)).catch(err=>console.error(err));
      }else if(stage===1&&t-ts>.9){stage=2;phase='top';request(0)}   // 表紙がひとりでに開く
      else if(stage===2&&phase==='top'&&active===0){
        stage=3;ts=t;phase='op';const b=spreads[0].b;if(b)b.pt=PT0+1e-3;   // 立ち上がり始める(続きは risePops が進める)
        // カメラは扉の正面へ回り込む(上からだと立った部品が見えにくい)
        tweenTo(pagePose(V(-4,15,42),V(0,7.5,-10)),REDUCED.matches?.5:2.2);
      }else if(stage===3&&t-ts>2.2&&!tw){stage=3.5;tweenTo(pagePose(V(3,13,38),V(0,8,-10)),2.6)}   // 少しだけ横へ流す
      else if(stage===3.5&&t-ts>5.0){stage=4;phase='top';request(1)}   // 見開き1へめくる(カメラは全体の視点へ戻る)
      else if(stage===4&&phase==='top'&&active===1){finish();return}
      invalidate();requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
