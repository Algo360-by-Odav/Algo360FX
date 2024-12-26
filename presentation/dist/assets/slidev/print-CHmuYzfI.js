import{d as _,$ as u,y as f,b as i,e,x as a,F as h,Z as g,o as r,a0 as v,l as x,g as b}from"../modules/vue-CBjp1WJB.js";import{u as N,j as y,c as d,b as k}from"../index-6RRo9Qac.js";import{N as D}from"./NoteDisplay-DexFB2Qp.js";import"../modules/shiki-B_6TdmJp.js";const S=_({__name:"print",setup(m,{expose:n}){n();const{slides:l,total:o}=N();u(`
@page {
  size: A4;
  margin-top: 1.5cm;
  margin-bottom: 1cm;
}
* {
  -webkit-print-color-adjust: exact;
}
html,
html body,
html #app,
html #page-root {
  height: auto;
  overflow: auto !important;
}
`),y({title:`Notes - ${d.title}`});const p=f(()=>l.value.map(t=>{var s;return(s=t.meta)==null?void 0:s.slide}).filter(t=>t!==void 0&&t.noteHTML!=="")),c={slides:l,total:o,slidesWithNote:p,get configs(){return d},NoteDisplay:D};return Object.defineProperty(c,"__isScriptSetup",{enumerable:!1,value:!0}),c}}),V={id:"page-root"},w={class:"m-4"},F={class:"mb-10"},L={class:"text-4xl font-bold mt-2"},T={class:"opacity-50"},j={class:"text-lg"},B={class:"font-bold flex gap-2"},C={class:"opacity-50"},H={key:0,class:"border-main mb-8"};function M(m,n,l,o,p,c){return r(),i("div",V,[e("div",w,[e("div",F,[e("h1",L,a(o.configs.title),1),e("div",T,a(new Date().toLocaleString()),1)]),(r(!0),i(h,null,g(o.slidesWithNote,(t,s)=>(r(),i("div",{key:s,class:"flex flex-col gap-4 break-inside-avoid-page"},[e("div",null,[e("h2",j,[e("div",B,[e("div",C,a(t==null?void 0:t.no)+"/"+a(o.total),1),v(" "+a(t==null?void 0:t.title)+" ",1),n[0]||(n[0]=e("div",{class:"flex-auto"},null,-1))])]),x(o.NoteDisplay,{"note-html":t.noteHTML,class:"max-w-full"},null,8,["note-html"])]),s<o.slidesWithNote.length-1?(r(),i("hr",H)):b("v-if",!0)]))),128))])])}const O=k(S,[["render",M],["__file","C:/Users/FVMY/Desktop/Algo360FX/presentation/node_modules/@slidev/client/pages/presenter/print.vue"]]);export{O as default};
