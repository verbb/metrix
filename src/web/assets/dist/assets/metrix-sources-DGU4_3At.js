import{j as e,c as b,D as p,b as S,h as E,i as N,g as y,d as k,e as v}from"./Button-CTzKo-ja.js";import{r as s}from"./react-DJpHYEPN.js";const w=({connected:c})=>{const[n,a]=s.useState(""),[f,l]=s.useState("disabled mc-border"),[x,i]=s.useState(!1),[o,m]=s.useState(null),[h,d]=s.useState(!1);s.useEffect(()=>{a(c?Craft.t("metrix","Connected"):Craft.t("metrix","Not connected"))},[c]);const g=()=>{const t=document.getElementById("main-form")||document.getElementById("main");return t?t.querySelectorAll("input, select, textarea"):[]},C=()=>{const t={};return g().forEach(r=>{const u=r.getAttribute("name");u&&(t[u]=r.value)}),t},j=async()=>{i(!1),m(null),d(!0),a(Craft.t("metrix","Connecting..."));const t=C();try{const r=await Craft.sendActionRequest("POST","metrix/sources/check-connection",{data:t});if(r.data.message)throw new Error(r.data);a(Craft.t("metrix","Connected")),l("on")}catch(r){i(!0),m(y(r)),a(Craft.t("metrix","Error")),l("off")}finally{d(!1)}};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"heading",children:[e.jsx("span",{className:b("status",f)}),e.jsx("span",{children:n})]}),e.jsx("div",{className:"input ltr",children:e.jsx("button",{className:"btn small",title:Craft.t("metrix","Refresh"),onClick:j,disabled:h,style:{backgroundColor:"var(--ui-control-bg-color)"},children:Craft.t("metrix","Refresh")})}),e.jsx(p,{open:x,onOpenChange:i,children:e.jsxs(S,{children:[e.jsx(E,{className:"mc-sr-only",children:Craft.t("metrix","Source Error")}),e.jsx(N,{className:"mc-sr-only",children:Craft.t("metrix","Source Error")}),o&&e.jsxs("div",{className:"mc-text-center mc-p-8 mc-text-red-500 mc-break-words mc-w-full",children:[e.jsx("strong",{className:"mc-block mc-mb-1",children:o.heading}),e.jsx("div",{className:"mc-block mc-mb-2",children:o.text}),e.jsx("small",{className:"mc-block mc-font-mono mc-text mc-overflow-auto",children:o.trace.map(t=>e.jsx("span",{className:"mc-block",children:t},t))})]})]})})]})};typeof Craft.Metrix>"u"&&(Craft.Metrix={});Craft.Metrix.SourceConnect=Garnish.Base.extend({init(c){k();const n=document.querySelector(".metrix-integration-connect");n&&v(n).render(s.createElement(w,{connected:!1}))}});
//# sourceMappingURL=metrix-sources-DGU4_3At.js.map
