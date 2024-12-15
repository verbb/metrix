import{c as M,a as w}from"./index-BTZOmhJi.js";import{r as f}from"./react-DX0GdSc1.js";import{G as _,y as b,j as e,H as F,I as O,J as k,K as B,N as I,B as v,D as W,c as T,d as $,e as D,r as K,k as Z,l as q,F as G,X as H,O as J,Q as L,A as Q,z as U}from"./modifiers.esm-DnPtLELT.js";import{u as V,a as N,D as X,c as Y,S as ee,v as te,b as ne,C as se,K as re,P as ae,d as ie}from"./dndkit-i3D0kdOW.js";import"./chartjs-BzvTYjqM.js";const E=_(n=>({newWidget:{},setNewWidget:s=>n({newWidget:s})})),z=_((n,s)=>({metrics:{},dimensions:{},metricsLoaded:{},dimensionsLoaded:{},settings:{},loadSettings:t=>{const a=t.reduce((i,c)=>(i[c.type]=c.schema,i),{});n({settings:a})},getSettingsByType:(t,a)=>{const i=s().settings[t];return i?i.map(c=>c.name==="metric"?{...c,async:!0,fetchOptions:()=>s().fetchMetrics(a)}:c.name==="dimension"?{...c,async:!0,fetchOptions:()=>s().fetchDimensions(a)}:c):[]},fetchMetrics:async t=>{if(s().metricsLoaded[t])return s().metrics[t]||[];const{data:a}=await b.get("property-options",{property:"metrics",source:t});return n(i=>({metrics:{...i.metrics,[t]:a},metricsLoaded:{...i.metricsLoaded,[t]:!0}})),a},fetchDimensions:async t=>{if(s().dimensionsLoaded[t])return s().dimensions[t]||[];const{data:a}=await b.get("property-options",{property:"dimensions",source:t});return n(i=>({dimensions:{...i.dimensions,[t]:a},dimensionsLoaded:{...i.dimensionsLoaded,[t]:!0}})),a}}));function P({widget:n={},onClose:s,onSave:t,isNew:a=!1,newWidget:i}){const c=f.useRef(null),{getSettingsByType:h}=z(),S=a?i:n.data,[u,C]=f.useState(S),[g,y]=f.useState([]);f.useEffect(()=>{const l=h(u.type,u.source);y(l)},[u.type,u.source,h]);const r=(l,d,me)=>{C(R=>{const j={...R,[d.name]:l};if(d.name==="source"&&(j.metric="",j.dimension=""),d.name==="type"&&(j.component=h(l).component,j.dimension=""),["metric","dimension","period"].includes(d.name)){const p=(d.defaultOptions||d.options||[]).find(A=>A.value===l);d.name==="metric"&&(j.metricLabel=(p==null?void 0:p.label)||""),d.name==="dimension"&&(j.dimensionLabel=(p==null?void 0:p.label)||""),d.name==="period"&&(j.periodLabel=(p==null?void 0:p.label)||"")}return j})},o=l=>{const d={...n,data:{...u,...l}};t&&t(d),s&&s()},x=()=>{c.current&&c.current.dispatchEvent(new Event("submit",{cancelable:!0,bubbles:!0}))},m=()=>{s&&s()};return e.jsxs(e.Fragment,{children:[e.jsxs(F,{children:[e.jsx(O,{children:a?Craft.t("metrix","Add New Widget"):Craft.t("metrix","Widget Settings")}),e.jsx(k,{className:"mc-sr-only",children:a?Craft.t("metrix","Create a new widget."):Craft.t("metrix","Modify widget settings.")})]}),e.jsx("div",{className:"mc-p-4 mc-space-y-4 mc-min-h-[250px] mc-max-h-[65vh] mc-overflow-auto",children:g.length?e.jsx(B,{ref:c,schema:g,data:u,onSubmit:o,onFieldChange:r}):""}),e.jsx(I,{children:e.jsxs("div",{className:"mc-flex mc-justify-end mc-gap-2",children:[e.jsx(v,{variant:"secondary",onClick:m,children:Craft.t("metrix","Cancel")}),e.jsx(v,{variant:"primary",type:"submit",onClick:x,children:a?Craft.t("metrix","Create"):Craft.t("metrix","Save")})]})})]})}function ce({onAdd:n}){const[s,t]=f.useState(!1),a=E(c=>c.newWidget),i=c=>{n(c),t(!1)};return e.jsxs(W,{open:s,onOpenChange:t,children:[e.jsx(T,{asChild:!0,children:e.jsxs(v,{variant:"dashed",type:"button",className:"mc-py-2",children:[e.jsx($,{strokeWidth:"4"})," ",Craft.t("metrix","New widget")]})}),e.jsx(D,{children:e.jsx(P,{isNew:!0,newWidget:a,onClose:()=>t(!1),onSave:i})})]})}const oe=({widget:n,handleWidthChange:s,handleRemove:t,handleEdit:a})=>{const{attributes:i,listeners:c,setNodeRef:h,transform:S,transition:u}=ne({id:n.__id}),C={transform:se.Transform.toString(S),transition:u};function g(m){return m.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/([0-9])([a-zA-Z])/g,"$1 $2").replace(/([a-zA-Z])([0-9])/g,"$1 $2").split(/[\s-_\\]+/).map(l=>l.charAt(0).toUpperCase()+l.slice(1).toLowerCase()).join(" ")}function y(m){const l=m.split("\\").pop();return g(l)}const r=()=>n.data.dimensionLabel?n.data.dimensionLabel:g(n.data.dimension),o=()=>n.data.metricLabel?n.data.metricLabel:g(n.data.metric),x=()=>n.data.periodLabel?n.data.periodLabel:y(n.data.period);return e.jsxs("div",{ref:h,style:C,className:M("mc-flex mc-items-start mc-gap-2"),children:[e.jsx("div",{className:"mc-text-slate-400",children:e.jsx(n.component.meta.icon,{className:"mc-size-5"})}),e.jsxs("div",{className:"mc-flex-1",children:[e.jsxs("div",{className:"mc-text-sm mc-font-medium mc-leading-tight",children:[n.data.dimension&&`${r()} - `,o()]}),e.jsxs("div",{className:"mc-text-xs mc-text-slate-400 mc-font-medium",children:[n.component.meta.name," - ",x()]})]}),e.jsx("div",{className:"mc-pt-0.5",children:e.jsx(q,{value:n.data.width,onChange:m=>s(m)})}),e.jsx("div",{...i,...c,className:"mc-pt-0.5",children:e.jsx(v,{variant:"clear",size:"icon",className:"mc-p-0 mc-text-slate-500 hover:mc-text-blue-500 mc-cursor-move",type:"button",title:"Settings","aria-label":"Settings",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 448 512",fill:"currentColor",children:e.jsx("path",{d:"M71.3 295.6c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2s-57.4 21.9-79.2 0zM184.4 182.5c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2-57.3 21.8-79.2 0zm0 147c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.9-21.8-21.9-57.3 0-79.2zM297.5 216.4c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.8-21.9-21.8-57.3 0-79.2z"})})})}),e.jsx("div",{className:"mc-pt-0.5",children:e.jsx(v,{variant:"clear",size:"icon",className:"mc-p-0 mc-text-slate-500 hover:mc-text-blue-500",type:"button",title:Craft.t("metrix","Edit Widget"),"aria-label":Craft.t("metrix","Edit Widget"),onClick:()=>a(),children:e.jsx(G,{className:"mc-size-4"})})}),e.jsx("div",{className:"mc-pt-0.5",children:e.jsx(v,{variant:"clear",size:"icon",className:"mc-p-0 mc-text-slate-500 hover:mc-text-red-500",type:"button",title:Craft.t("metrix","Remove Widget"),"aria-label":Craft.t("metrix","Remove Widget"),onClick:()=>t(),children:e.jsx(H,{className:"mc-size-4",strokeWidth:"3"})})})]})},de=({widgets:n})=>{const[s,t]=f.useState(n),[a,i]=f.useState(null),c=V(N(ae,{activationConstraint:{delay:0,tolerance:5}}),N(re)),h=({active:r,over:o})=>{if(r.id!==o.id){const x=s.findIndex(d=>d.__id===r.id),m=s.findIndex(d=>d.__id===o.id),l=ie(s,x,m);t(l)}},S=(r,o)=>{t(x=>x.map(m=>m.__id===r.__id?{...m,data:{...m.data,width:o}}:m))},u=r=>{t(o=>o.filter(x=>x.__id!==r.__id))},C=r=>{i(r)},g=r=>{t(o=>[...o,J(r.data,{__id:L()})])},y=r=>{t(o=>o.map(x=>x.__id===r.__id?r:x)),i(null)};return f.useEffect(()=>{const r=document.querySelector(".metrix-presets-store");r&&(r.value=JSON.stringify(s.map(o=>o.data)))},[s]),e.jsxs("div",{children:[e.jsx("div",{className:"mc-mb-4",children:e.jsx(X,{sensors:c,collisionDetection:Y,modifiers:[K,Z],onDragEnd:h,children:e.jsx(ee,{strategy:te,items:s.map(r=>r.__id),children:e.jsx("div",{className:"mc-flex mc-flex-col mc-gap-4",children:s.map(r=>e.jsx(oe,{widget:r,handleEdit:()=>C(r),handleWidthChange:o=>S(r,o),handleRemove:()=>u(r)},r.__id))})})})}),e.jsx(ce,{onAdd:g}),a&&e.jsx(W,{open:!!a,onOpenChange:()=>i(null),children:e.jsx(D,{children:e.jsx(P,{widget:a,onClose:()=>i(null),onSave:y})})})]})};typeof Craft.Metrix>"u"&&(Craft.Metrix={});Craft.Metrix.Presets=Garnish.Base.extend({init(n){w();const s=document.querySelector(".metrix-presets"),t=Q(s),{loadSettings:a}=z.getState(),{setNewWidget:i}=E.getState(),{widgets:c,widgetSettings:h,newWidget:S}=n;a(h),i(S),t.render(f.createElement(de,{widgets:U(c).map(u=>(u.__id=L(),u))}))}});
//# sourceMappingURL=metrix-presets-B9-youDL.js.map
