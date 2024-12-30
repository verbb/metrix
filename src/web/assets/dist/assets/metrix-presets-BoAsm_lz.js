import{j as e,f as w,h as A,i as F,k,B as S,D as _,a as B,b as W,c as O,X as $,d as T,e as I}from"./Button-FL204d0O.js";import{r as f}from"./react-DJpHYEPN.js";import{y as D,q as b,z as q,c as Z,r as K,h as G,i as H,F as J,A as U,B as L,s as V,v as X}from"./MetrixConfig-BmmY9V7S.js";import{u as Q,a as N,D as Y,c as ee,S as te,v as ne,b as se,C as re,K as ae,P as ie,d as ce}from"./dndkit-CA2JRGlN.js";import"./chartjs-BzvTYjqM.js";const E=D(n=>({newWidget:{},setNewWidget:s=>n({newWidget:s})})),z=D((n,s)=>({metrics:{},dimensions:{},metricsLoaded:{},dimensionsLoaded:{},settings:{},loadSettings:t=>{const a=t.reduce((i,c)=>(i[c.type]=c.schema,i),{});n({settings:a})},getSettingsByType:(t,a)=>{const i=s().settings[t];return i?i.map(c=>c.name==="metric"?{...c,async:!0,fetchOptions:()=>s().fetchMetrics(a)}:c.name==="dimension"?{...c,async:!0,fetchOptions:()=>s().fetchDimensions(a)}:c):[]},fetchMetrics:async t=>{if(s().metricsLoaded[t])return s().metrics[t]||[];const{data:a}=await b.get("property-options",{property:"metrics",source:t});return n(i=>({metrics:{...i.metrics,[t]:a},metricsLoaded:{...i.metricsLoaded,[t]:!0}})),a},fetchDimensions:async t=>{if(s().dimensionsLoaded[t])return s().dimensions[t]||[];const{data:a}=await b.get("property-options",{property:"dimensions",source:t});return n(i=>({dimensions:{...i.dimensions,[t]:a},dimensionsLoaded:{...i.dimensionsLoaded,[t]:!0}})),a}}));function M({widget:n={},onClose:s,onSave:t,isNew:a=!1,newWidget:i}){const c=f.useRef(null),{getSettingsByType:h}=z(),v=a?i:n.data,[u,g]=f.useState(v),[j,y]=f.useState([]);f.useEffect(()=>{const l=h(u.type,u.source);y(l)},[u.type,u.source,h]);const r=(l,d,le)=>{g(R=>{const C={...R,[d.name]:l};if(d.name==="source"&&(C.metric="",C.dimension=""),d.name==="type"&&(C.component=h(l).component,C.dimension=""),["metric","dimension","period"].includes(d.name)){const p=(d.defaultOptions||d.options||[]).find(P=>P.value===l);d.name==="metric"&&(C.metricLabel=(p==null?void 0:p.label)||""),d.name==="dimension"&&(C.dimensionLabel=(p==null?void 0:p.label)||""),d.name==="period"&&(C.periodLabel=(p==null?void 0:p.label)||"")}return C})},o=l=>{const d={...n,data:{...u,...l}};t&&t(d),s&&s()},x=()=>{c.current&&c.current.dispatchEvent(new Event("submit",{cancelable:!0,bubbles:!0}))},m=()=>{s&&s()};return e.jsxs(e.Fragment,{children:[e.jsxs(w,{children:[e.jsx(A,{children:a?Craft.t("metrix","Add New Widget"):Craft.t("metrix","Widget Settings")}),e.jsx(F,{className:"mc-sr-only",children:a?Craft.t("metrix","Create a new widget."):Craft.t("metrix","Modify widget settings.")})]}),e.jsx("div",{className:"mc-p-4 mc-space-y-4 mc-min-h-[250px] mc-max-h-[65vh] mc-overflow-auto",children:j.length?e.jsx(q,{ref:c,schema:j,data:u,onSubmit:o,onFieldChange:r}):""}),e.jsx(k,{children:e.jsxs("div",{className:"mc-flex mc-justify-end mc-gap-2",children:[e.jsx(S,{variant:"secondary",onClick:m,children:Craft.t("metrix","Cancel")}),e.jsx(S,{variant:"primary",type:"submit",onClick:x,children:a?Craft.t("metrix","Create"):Craft.t("metrix","Save")})]})})]})}function oe({onAdd:n}){const[s,t]=f.useState(!1),a=E(c=>c.newWidget),i=c=>{n(c),t(!1)};return e.jsxs(_,{open:s,onOpenChange:t,children:[e.jsx(B,{asChild:!0,children:e.jsxs(S,{variant:"dashed",type:"button",className:"mc-py-2",children:[e.jsx(Z,{strokeWidth:"4"})," ",Craft.t("metrix","New widget")]})}),e.jsx(W,{children:e.jsx(M,{isNew:!0,newWidget:a,onClose:()=>t(!1),onSave:i})})]})}const de=({widget:n,handleWidthChange:s,handleRemove:t,handleEdit:a})=>{const{attributes:i,listeners:c,setNodeRef:h,transform:v,transition:u}=se({id:n.__id}),g={transform:re.Transform.toString(v),transition:u};function j(m){return m.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/([0-9])([a-zA-Z])/g,"$1 $2").replace(/([a-zA-Z])([0-9])/g,"$1 $2").split(/[\s-_\\]+/).map(l=>l.charAt(0).toUpperCase()+l.slice(1).toLowerCase()).join(" ")}function y(m){const l=m.split("\\").pop();return j(l)}const r=()=>n.data.dimensionLabel?n.data.dimensionLabel:j(n.data.dimension),o=()=>n.data.metricLabel?n.data.metricLabel:j(n.data.metric),x=()=>n.data.periodLabel?n.data.periodLabel:y(n.data.period);return e.jsxs("div",{ref:h,style:g,className:O("mc-flex mc-items-start mc-gap-2"),children:[e.jsx("div",{className:"mc-text-slate-400",children:e.jsx(n.component.meta.icon,{className:"mc-size-5"})}),e.jsxs("div",{className:"mc-flex-1",children:[e.jsxs("div",{className:"mc-text-sm mc-font-medium mc-leading-tight",children:[n.data.dimension&&`${r()} - `,o()]}),e.jsxs("div",{className:"mc-text-xs mc-text-slate-400 mc-font-medium",children:[n.component.meta.name,n.data.period&&` - ${x()}`]})]}),e.jsx("div",{className:"mc-pt-0.5",children:e.jsx(H,{value:n.data.width,onChange:m=>s(m)})}),e.jsx("div",{...i,...c,className:"mc-pt-0.5",children:e.jsx(S,{variant:"clear",size:"icon",className:"mc-p-0 mc-text-slate-500 hover:mc-text-blue-500 mc-cursor-move",type:"button",title:"Settings","aria-label":"Settings",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 448 512",fill:"currentColor",children:e.jsx("path",{d:"M71.3 295.6c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2s-57.4 21.9-79.2 0zM184.4 182.5c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2-57.3 21.8-79.2 0zm0 147c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.9-21.8-21.9-57.3 0-79.2zM297.5 216.4c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.8-21.9-21.8-57.3 0-79.2z"})})})}),e.jsx("div",{className:"mc-pt-0.5",children:e.jsx(S,{variant:"clear",size:"icon",className:"mc-p-0 mc-text-slate-500 hover:mc-text-blue-500",type:"button",title:Craft.t("metrix","Edit Widget"),"aria-label":Craft.t("metrix","Edit Widget"),onClick:()=>a(),children:e.jsx(J,{className:"mc-size-4"})})}),e.jsx("div",{className:"mc-pt-0.5",children:e.jsx(S,{variant:"clear",size:"icon",className:"mc-p-0 mc-text-slate-500 hover:mc-text-red-500",type:"button",title:Craft.t("metrix","Remove Widget"),"aria-label":Craft.t("metrix","Remove Widget"),onClick:()=>t(),children:e.jsx($,{className:"mc-size-4",strokeWidth:"3"})})})]})},me=({widgets:n})=>{const[s,t]=f.useState(n),[a,i]=f.useState(null),c=Q(N(ie,{activationConstraint:{delay:0,tolerance:5}}),N(ae)),h=({active:r,over:o})=>{if(r.id!==o.id){const x=s.findIndex(d=>d.__id===r.id),m=s.findIndex(d=>d.__id===o.id),l=ce(s,x,m);t(l)}},v=(r,o)=>{t(x=>x.map(m=>m.__id===r.__id?{...m,data:{...m.data,width:o}}:m))},u=r=>{t(o=>o.filter(x=>x.__id!==r.__id))},g=r=>{i(r)},j=r=>{t(o=>[...o,U(r.data,{__id:L()})])},y=r=>{t(o=>o.map(x=>x.__id===r.__id?r:x)),i(null)};return f.useEffect(()=>{const r=document.querySelector(".metrix-presets-store");r&&(r.value=JSON.stringify(s.map(o=>o.data)))},[s]),e.jsxs("div",{children:[e.jsx("div",{className:"mc-mb-4",children:e.jsx(Y,{sensors:c,collisionDetection:ee,modifiers:[K,G],onDragEnd:h,children:e.jsx(te,{strategy:ne,items:s.map(r=>r.__id),children:e.jsx("div",{className:"mc-flex mc-flex-col mc-gap-4",children:s.map(r=>e.jsx(de,{widget:r,handleEdit:()=>g(r),handleWidthChange:o=>v(r,o),handleRemove:()=>u(r)},r.__id))})})})}),e.jsx(oe,{onAdd:j}),a&&e.jsx(_,{open:!!a,onOpenChange:()=>i(null),children:e.jsx(W,{children:e.jsx(M,{widget:a,onClose:()=>i(null),onSave:y})})})]})};typeof Craft.Metrix>"u"&&(Craft.Metrix={});Craft.Metrix.Presets=Garnish.Base.extend({init(n){T();const s=document.querySelector(".metrix-presets"),t=I(s),{loadSettings:a}=z.getState(),{setNewWidget:i}=E.getState(),{widgets:c,widgetSettings:h,newWidget:v,hasSource:u}=n;u&&(a(h),i(v),t.render(f.createElement(me,{widgets:V(c).map(g=>(g.__id=L(),g))})))}});Craft.Metrix.Config=new X;document.dispatchEvent(new CustomEvent("onMetrixConfigReady",{bubbles:!0}));
//# sourceMappingURL=metrix-presets-BoAsm_lz.js.map