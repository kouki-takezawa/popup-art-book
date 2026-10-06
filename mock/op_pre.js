'use strict';
// OP のモック(?op=1 / ?op=2)。js/book.js より前に読む。
// 案2: 表紙の次に「扉」の見開きを差し込む(モックでは見開きの数を10のままにするため、最後の作品を外す)
const OP=(new URLSearchParams(location.search).get('op')||'')|0;
if(OP===2){
  BOOK.list.unshift({file:'../mock/title',name:'扉　名画の飛び出す絵本',artist:'ようこそ'});
  BOOK.list.pop();
  // 作品は w.no の見開きに入るので、扉(title)を1番目、ほかを1つずつ後ろへずらす
  BOOK.add=function(w){this.works[w.title?1:w.no+1]=w};
}
if(OP)document.documentElement.classList.add('op');
