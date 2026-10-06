'use strict';
// OP(js/book.js のあとに読む。book.js の変数・関数をそのまま使う)
// 閉じた本から始めるとき(URL に ?spread が無いとき)は毎回流れる: 表紙がひとりでに開き、扉の見開きで紙の劇場が立ち上がり、
// カメラが正面へ回り込んで少し横へ流れ、見開き1へめくれる。終わるまで操作を受けない(飛ばせない)。音はなし。
// 確認用: ?noop で OP を飛ばす
if(active<0&&!qs.has('noop')&&!qs.has('flip')){
  // 操作を止める: 画面を覆う透明な板と、キー入力の横取り。UI は OP の間は隠す(index.html の html.op)
  document.documentElement.classList.add('op');
  const block=document.createElement('div');block.id='opblock';document.body.appendChild(block);
  const keyBlock=e=>{e.stopImmediatePropagation();e.preventDefault()};
  addEventListener('keydown',keyBlock,true);
  phase='op';syncURL=false;   // tapAction / request は phase が top でないと動かない。boot も先読みをしない
  function finish(){
    phase='top';syncURL=true;
    block.remove();removeEventListener('keydown',keyBlock,true);
    document.documentElement.classList.remove('op');
    updateNav();updateUI();prebuild();invalidate();
  }
  const pagePose=(p,l)=>{const g=rightPage(0).g;g.updateMatrixWorld(true);return {p:g.localToWorld(p),l:g.localToWorld(l)}};
  let stage=0,ts=0;
  const loop=now=>{
    const t=now/1000;
    if(stage===0&&$('loading').classList.contains('done')){
      stage=1;ts=t;
      // 見開き1は、読み込み画面が消えている間に組み立てておく
      loadWork(1).then(()=>build(1)).catch(err=>console.error(err));
    }else if(stage===1&&t-ts>.9){stage=2;phase='top';request(0)}   // 表紙がひとりでに開く
    else if(stage===2&&phase==='top'&&active===0){
      stage=3;ts=t;phase='op';const b=spreads[0].b;if(b)b.pt=PT0+1e-3;   // 立ち上がり始める(続きは risePops が進める)
      // カメラは扉の正面へ回り込む(上からだと立った部品が見えにくい)
      tweenTo(pagePose(V(-4,15,42),V(0,7.5,-10)),REDUCED.matches?.5:2.2);
    }else if(stage===3&&t-ts>2.2&&!tw){stage=3.5;tweenTo(pagePose(V(3,13,38),V(0,8,-10)),2.6)}   // 少しだけ横へ流す
    else if(stage===3.5&&t-ts>5.0){stage=4;phase='top';request(1)}   // 見開き1へめくる(カメラは全体の視点へ戻る)
    else if(stage===4&&phase==='top'&&active===1){finish();return}
    // 読み込みに失敗してめくれなかったとき(request が元に戻す)は、そこで操作を返す
    else if((stage===2&&phase==='top'&&active<0&&target<0)||(stage===4&&phase==='top'&&active===0&&target===0)){finish();return}
    invalidate();requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
