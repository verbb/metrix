const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./WidgetSettings-DN1xptV1.js","./pk-dialog-VMQqLW1f-Cj2lP4Ga.js","./lit-Du1yN0YY.js","./useWidgetSettingsStore-BWOx4kAW.js","./focus-aa5dlv8k-Blvp5c6v.js","./dndkit-VWrr40Ac.js","./react-vendor-B27ue3us.js","./pk-button-BrH4u4Qr-COA9h384.js","./dist-BQV6gLiX.js","./supports-popover-CUBsbHpS-BVBIY4Jg.js","./useWidgetSettingsStore-lzrolfWZ.css","./MetrixConfig-BfBLU7Bc.js","./forms-Bp9cJWca.js","./Field-DxmLpF8U.js","./pk-form-associated-element-CCQALRGB-BkQRbyq4.js","./mirror-validator-DCjNYrrx-BuTMKpbu.js","./pk-clear--mPWZP7H-BHgvcQ98.js","./pk-select-CdQdhnZN-CtCJttna.js","./option-filter-BQqr8Z21-zUXmRPGn.js","./useWidgetSettingsForm-D2iHY0pp.js"])))=>i.map(i=>d[i]);
import{A as e,N as t,S as n,_ as r,a as i,b as a,c as o,f as s,l as c,m as l,n as u,p as d,q as f,s as p,u as m,x as h,y as g}from"./pk-dialog-VMQqLW1f-Cj2lP4Ga.js";import{_,b as ee,g as v,h as y,m as b,n as x,p as S,t as te,v as C,x as ne,y as re}from"./useWidgetSettingsStore-BWOx4kAW.js";import{t as ie}from"./forms-Bp9cJWca.js";import{a as ae,c as oe,f as se,g as ce,m as le}from"./MetrixConfig-BfBLU7Bc.js";import{a as w,i as ue,n as de,r as fe}from"./focus-aa5dlv8k-Blvp5c6v.js";import{n as pe,p as me}from"./dndkit-VWrr40Ac.js";import{a as he,c as T,d as E,f as D,i as ge,o as O,r as _e,s as k,u as A}from"./lit-Du1yN0YY.js";import{n as ve}from"./react-vendor-B27ue3us.js";import"./pk-button-BrH4u4Qr-COA9h384.js";import{d as j,f as M,i as N,o as ye,p as P}from"./pk-select-CdQdhnZN-CtCJttna.js";var F=f(me(),1);function*I(e=document.activeElement){e!=null&&(yield e,`shadowRoot`in e&&e.shadowRoot&&e.shadowRoot.mode!==`closed`&&(yield*I(e.shadowRoot.activeElement)))}var L=ve();function R(e){return e?(Array.isArray(e)?e:Object.values(e)).filter(e=>Array.isArray(e)&&e.length>0):[]}function z(e){return e==null?``:String(e)}function be({periodOptions:e,value:t,onChange:n,className:r,size:i,placeholder:a,clearable:o=!1}){let s=(0,F.useMemo)(()=>R(e),[e]);return s.length===0?null:(0,L.jsx)(ce,{className:r,value:t?z(t):``,placeholder:a,clearable:o,size:i,onPkChange:e=>{let t=e.detail?.value;if(t==null||t===``){n(null);return}let r=s.flat().find(e=>z(e.value)===z(t));r&&n(r.value)},onPkClear:()=>n(null),children:s.map((e,t)=>(0,L.jsxs)(F.Fragment,{children:[t>0?(0,L.jsx)(ne,{}):null,e.map(e=>(0,L.jsx)(le,{value:z(e.value),disabled:e.disabled,children:e.label},z(e.value)))]},`period-group-${t}`))})}var xe=[i(),N,D`
        @layer pk-component {
            :host {
                /* Flex column parents stretch cross-axis size — pin to content.
                   (inline-block + align-self; same class of fix as dialog / dropdown.) */
                display: inline-block;
                max-width: 100%;
                align-self: flex-start;
                flex: none;
                vertical-align: middle;
            }

            :host([data-pk-group-orientation]) {
                display: inline-flex;
                vertical-align: middle;
                flex: 0 0 auto;
                align-self: auto;
            }

            :host([data-pk-group-orientation]) ::slotted([slot='trigger']) {
                --pk-bg-start-start-radius: inherit;
                --pk-bg-start-end-radius: inherit;
                --pk-bg-end-start-radius: inherit;
                --pk-bg-end-end-radius: inherit;
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]) {
                margin-inline-start: var(--pk-bg-horizontal-indent, 0);
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-join]) {
                margin-block-start: var(--pk-bg-vertical-indent, 0);
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:has([slot='trigger'][variant='outline'], [slot='trigger'][variant='dashed'])) {
                margin-inline-start: var(--pk-bg-horizontal-indent-outlined, 0);
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-join]:has([slot='trigger'][variant='outline'], [slot='trigger'][variant='dashed'])) {
                margin-block-start: var(--pk-bg-vertical-indent-outlined, 0);
            }

            /* Match pk-popup's arrow fill to the panel surface when with-arrow is on. */
            :host([with-arrow]) {
                --pk-popup-arrow-color: var(--pk-color-white);
                --pk-popup-arrow-size: 8px;
            }

            .panel {
                box-sizing: border-box;
                width: 18rem;
                padding: 1rem;
                border-radius: var(--pk-radius-md);
                background: var(--pk-color-white);
                box-shadow: var(--pk-shadow-popover);
                /* Craft CP body text (~gray-700), not gray-900. */
                color: var(--pk-color-gray-700);
            }

            /* Flush panels for command/menu chrome that owns its own inset (variable picker, etc.).
               Match kit v1 PopoverContent min-w 260px / max-w 360px: without min-width,
               width max-content shrinks to short labels and looks narrower than the old picker. */
            :host([flush]) .panel {
                width: max-content;
                min-width: var(--pk-popover-flush-min-width, 16.25rem);
                max-width: min(var(--pk-popover-flush-max-width, 22.5rem), 100vw - 1rem);
                padding: 0;
            }

            .panel[hidden] {
                display: none !important;
            }
        }
    `],B=class extends a{constructor(...e){super(...e),this.open=!1,this.placement=`bottom`,this.sideOffset=4,this.flush=!1,this.withArrow=!1,this.for=``,this.anchor=null,this.triggerElement=null,this.closing=!1,this.panelAnimated=!1,this.triggerId=de(`pk-popover-trigger`),this.dismissRegistered=!1,this.syncingOpenSideEffects=!1,this.exitAnimationPromise=null,this.handleToggleClick=e=>{e.preventDefault(),e.stopPropagation(),!this.closing&&(this.open=!this.open)},this.onDocumentPointerDown=e=>{this.isPointerInside(e)||this.closing||this.closePopover(`light-dismiss`)},this.onDocumentKeyDown=e=>{e.key===`Escape`&&s(this)&&!this.closing&&(e.preventDefault(),e.stopPropagation(),this.closePopover(`escape`))}}static{this.styles=xe}get panelElement(){return this.popupElement?.getContentElement()??null}disconnectedCallback(){this.closePopover(`api`,!0),super.disconnectedCallback()}willUpdate(e){e.has(`open`)&&this.open===!1&&e.get(`open`)===!0&&!this.syncingOpenSideEffects&&!this.closing&&(this.closing=!0,this.panelAnimated=!1)}async updated(e){if(super.updated(e),!e.has(`open`)||this.syncingOpenSideEffects)return;let t=e.get(`open`);t!==this.open&&(t!==void 0||this.open!==!1)&&(this.open?await this.openPopover():await this.closePopover(`api`))}onTriggerSlotChange(e){let[t]=e.target.assignedElements({flatten:!0});this.unbindTrigger(this.triggerElement),this.triggerElement=t??null,this.bindTrigger(this.triggerElement)}bindTrigger(e){e&&(e.id||=this.triggerId,e.setAttribute(`aria-haspopup`,`dialog`),e.addEventListener(`click`,this.handleToggleClick),this.syncExpanded())}unbindTrigger(e){e?.removeEventListener(`click`,this.handleToggleClick)}async openPopover(){if(!this.getAnchor())return;if(this.exitAnimationPromise&&await this.exitAnimationPromise,this.dismissRegistered&&this.open){this.panelElement&&(this.panelElement.hidden=!1),this.syncExpanded();return}if(!this.dispatchEvent(new m)){this.syncingOpenSideEffects=!0,this.open=!1,this.syncingOpenSideEffects=!1;return}this.syncingOpenSideEffects=!0,this.open=!0,this.syncingOpenSideEffects=!1,this.closing=!1,this.panelAnimated=!1,this.panelElement&&(this.panelElement.hidden=!1,M(this.panelElement,this.placement)),this.syncExpanded(),this.registerDismissHandlers(),await this.updateComplete;let e=await P(this.popupElement,this.placement);this.panelElement&&M(this.panelElement,e),this.panelAnimated=!0,this.dispatchEvent(new o),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!0},bubbles:!0,composed:!0}))}async closePopover(e=`unknown`,t=!1){if(this.exitAnimationPromise)return this.exitAnimationPromise;if(!this.dismissRegistered&&!this.closing&&!this.open)return;let n=new c(e);if(!this.dispatchEvent(n)){this.syncingOpenSideEffects=!0,this.open=!0,this.syncingOpenSideEffects=!1,this.closing=!1,this.panelAnimated=!0;return}this.unregisterDismissHandlers(),this.closing=!0,this.panelAnimated=!1,this.open&&(this.syncingOpenSideEffects=!0,this.open=!1,this.syncingOpenSideEffects=!1);let r=async()=>{t||(await this.updateComplete,await this.waitForExitAnimation()),this.closing=!1,this.panelAnimated=!1,this.panelElement&&(this.panelElement.hidden=!0,this.panelElement.removeAttribute(`data-side`)),this.syncExpanded(),this.dispatchEvent(new p),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!1},bubbles:!0,composed:!0}))};return this.exitAnimationPromise=r().finally(()=>{this.exitAnimationPromise=null}),this.exitAnimationPromise}waitForExitAnimation(){let e=this.panelElement;return e?new Promise(t=>{let n=!1,r=()=>{n||(n=!0,e.removeEventListener(`animationend`,i),window.clearTimeout(a),e.classList.remove(`closing`),t())},i=t=>{t.target===e&&t.animationName.startsWith(`pk-popup-content-out`)&&r()};e.classList.add(`closing`),e.addEventListener(`animationend`,i);let a=window.setTimeout(r,150)}):Promise.resolve()}getAnchor(){return this.anchor?this.anchor:this.for?j(this,this.for):this.triggerElement?this.triggerElement:null}registerDismissHandlers(){this.dismissRegistered||(d(this),this.dismissRegistered=!0,document.addEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.addEventListener(`keydown`,this.onDocumentKeyDown,!0))}unregisterDismissHandlers(){this.dismissRegistered&&=(l(this),!1),document.removeEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.onDocumentKeyDown,!0)}isPointerInside(e){return ye(e,{host:this,anchor:this.getAnchorElement(),panel:this.panelElement})}getAnchorElement(){return this.anchor instanceof HTMLElement?this.anchor:this.triggerElement?this.triggerElement:this.for?j(this,this.for):null}syncExpanded(){this.triggerElement?.setAttribute(`aria-expanded`,this.open?`true`:`false`)}render(){let e=this.getAnchor();return E`
            <slot name="trigger" @slotchange=${this.onTriggerSlotChange}></slot>
            <pk-popup
                .active=${this.open||this.closing}
                .anchor=${e??``}
                .placement=${this.placement}
                .distance=${this.sideOffset}
                .arrow=${this.withArrow}
                flip
                shift
            >
                <div
                    part="panel"
                    class=${he({panel:!0,"pk-popup-content":!0,closing:this.closing})}
                    ?hidden=${!this.open&&!this.closing}
                    data-open=${this.panelAnimated&&!this.closing?``:A}
                    tabindex=${this.open?`-1`:A}
                >
                    <slot></slot>
                </div>
            </pk-popup>
        `}};h([T({type:Boolean,reflect:!0})],B.prototype,`open`,void 0),h([T({reflect:!0})],B.prototype,`placement`,void 0),h([T({attribute:`side-offset`,type:Number})],B.prototype,`sideOffset`,void 0),h([T({type:Boolean,reflect:!0})],B.prototype,`flush`,void 0),h([T({attribute:`with-arrow`,type:Boolean,reflect:!0})],B.prototype,`withArrow`,void 0),h([T({reflect:!0})],B.prototype,`for`,void 0),h([T({attribute:!1})],B.prototype,`anchor`,void 0),h([O(`pk-popup`)],B.prototype,`popupElement`,void 0),h([k()],B.prototype,`triggerElement`,void 0),h([k()],B.prototype,`closing`,void 0),h([k()],B.prototype,`panelAnimated`,void 0),B=h([n(`pk-popover`)],B);var Se=w({tagName:`pk-popover`,elementClass:B,react:F.default,events:{onPkShow:`pk-show`,onPkAfterShow:`pk-after-show`,onPkHide:`pk-hide`,onPkAfterHide:`pk-after-hide`,onPkOpenChange:`pk-open-change`}}),V=e=>{if(e)return t=>{re(t)&&e(t)}},H=F.forwardRef(function(e,t){let{open:n,flush:r,withArrow:i,onPkShow:a,onPkAfterShow:o,onPkHide:s,onPkAfterHide:c,onPkOpenChange:l,...u}=e;return(0,L.jsx)(Se,{ref:t,...u,...n===void 0?{}:{open:n},...ue([`flush`,`withArrow`],{flush:r,withArrow:i}),...a?{onPkShow:V(a)}:{},...o?{onPkAfterShow:V(o)}:{},...s?{onPkHide:V(s)}:{},...c?{onPkAfterHide:V(c)}:{},...l?{onPkOpenChange:V(l)}:{}})});H.displayName=`Popover`;function Ce(e,t=5){let n=e?.response?.data;if(!n)return[];let r=[];n.file&&n.line&&r.push(`${n.file}:${n.line}`);let i=Array.isArray(n.trace)?n.trace:[];for(let e=0;e<Math.min(t,i.length);e++){let t=i[e];t?.file&&t?.line&&r.push(`${t.file}:${t.line}`)}return[...new Set(r)]}function we(e){let t=ie(e),n=Ce(e);return{...t,traceAsArray:n,trace:n.join(`
`),traceAsString:n.join(`
`)}}function Te(e){let t=e?.response?.data?.message||ie(e)?.text||``;return typeof t==`string`&&t.includes(`needs to be reconnected`)?t:Craft.t(`metrix`,`Failed to fetch widget data. Please try again.`)}function Ee(e){let{inheritPeriod:t,period:n}=e?.data||{};return t==null?n==null:!!t}function De(e,{refresh:t=!1}={}){let{globalPeriod:n}=b.getState(),r={id:e.data.id};return t&&(r.refresh=!0),n&&Ee(e)&&(r.globalPeriod=n),r}var U=y((e,t)=>{let n=new Map,r=new Map;return{widgets:[],collectionGeneration:0,fetchGeneration:0,loadWidgets:n=>{let r=n.map(e=>({...e,__id:x(),loading:!!e.data?.id,waitForData:!!e.data?.id}));e({widgets:r,collectionGeneration:t().collectionGeneration+1}),r.some(e=>e.data?.id)&&t().fetchAllWidgetData()},fetchAllWidgetData:async({refresh:n=!1}={})=>{let r=t().widgets.filter(e=>e.data?.id);r.length&&(e({fetchGeneration:t().fetchGeneration+1}),await Promise.allSettled(r.map(e=>t().fetchWidgetData(e.__id,{refresh:n}))))},fetchBatchWidgetData:async(e=!1)=>t().fetchAllWidgetData({refresh:e}),addWidget:t=>{let n={...t,__id:x()};e(e=>({widgets:[...e.widgets,n]}))},updateWidget:async(e,n,i=!0)=>{let a=t().widgets.find(t=>t.__id===e.__id);if(!a)return;let o=r.get(a.data.id);o||(o={promise:Promise.resolve(),requestId:0,savedData:a.data,fetchData:!1},r.set(a.data.id,o));let s=++o.requestId;o.fetchData||=i;let c=()=>o.requestId===s&&t().widgets.some(e=>e.__id===a.__id);t().updateWidgetState(a,{data:{...a.data,...n},loading:o.fetchData,error:null,...o.fetchData&&{waitForData:!0,requestId:null}});let l=o.promise.then(async()=>{try{let e=await S.post(`save-widget`,{id:a.data.id,widget:n});if(o.savedData={...o.savedData,...e.data},!c())return;t().updateWidgetState(a,{data:o.savedData,loading:!1,waitForData:!1}),o.fetchData&&t().fetchWidgetData(a.__id)}catch(e){if(!c())return;console.error(`Error updating widget:`,e),t().updateWidgetState(a,{data:o.savedData,loading:!1,waitForData:!1,error:{message:Craft.t(`metrix`,`Failed to update widget. Please try again.`),error:e}})}});o.promise=l,await l,o.promise===l&&r.delete(a.data.id)},removeWidget:async n=>{t().updateWidgetState(n,{loading:!0,error:null});try{await S.post(`delete-widget`,{id:n.data.id}),e(e=>({widgets:e.widgets.filter(e=>e.__id!==n.__id)}))}catch(e){console.error(`Error deleting widget:`,e),t().updateWidgetState(n,{loading:!1,error:{message:Craft.t(`metrix`,`Failed to delete widget. Please try again.`),error:e}})}},duplicateWidget:async n=>{let r=x(),i={...n,__id:r,data:{...n.data,id:null},loading:!0,waitForData:!0};e(e=>({widgets:[...e.widgets,i]}));try{let e=await S.post(`duplicate-widget`,{id:n.data.id});t().updateWidgetState(i,{data:{...i.data,...e.data},waitForData:!1}),await t().fetchWidgetData(r)}catch(n){if(console.error(`Error duplicating widget:`,n),!t().widgets.some(e=>e.__id===r))return;e(e=>({widgets:e.widgets.filter(e=>e.__id!==r)})),Craft.cp.displayError(Craft.t(`metrix`,`Failed to duplicate widget. Please try again.`))}},fetchWidgetData:async(e,{refresh:n=!1}={})=>{let r=t().widgets.find(t=>t.__id===e);if(!r){console.error(`Widget with id ${e} not found.`);return}let i=t().fetchGeneration,a=x(),o=()=>t().fetchGeneration===i&&t().widgets.find(t=>t.__id===e)?.requestId===a;t().updateWidgetState(r,{requestId:a,loading:!0,waitForData:!0,error:null});try{let e=De(r,{refresh:n}),i=n?await S.post(`widget-data`,e):await S.get(`widget-data`,e);if(!o())return;t().updateWidgetState(r,{chartData:i.data,loading:!1,waitForData:!1})}catch(e){if(!o())return;t().updateWidgetState(r,{loading:!1,waitForData:!1,error:{message:Te(e),error:e}})}},reorderWidgets:async(r,i)=>{let{widgets:a,collectionGeneration:o}=t(),s=b.getState().currentView,c=a.findIndex(e=>e.__id===r.__id),l=a.findIndex(e=>e.__id===i.__id);if(c===-1||l===-1){console.error(`Widget not found in the current list.`);return}let u=pe(a,c,l);e({widgets:u});let d=n.get(s);d||(d={promise:Promise.resolve(),requestId:0,savedIds:a.map(e=>e.data.id)},n.set(s,d));let f=++d.requestId,p=u.map(e=>e.data.id).filter(Boolean),m=d.promise.then(async()=>{try{await S.post(`save-widget-order`,{ids:p}),d.savedIds=p}catch(n){if(f!==d.requestId||o!==t().collectionGeneration)return;console.error(`Error saving widget order:`,n);let r=new Map(d.savedIds.map((e,t)=>[e,t]));e(e=>({widgets:[...e.widgets].sort((e,t)=>(r.get(e.data.id)??1/0)-(r.get(t.data.id)??1/0))})),Craft.cp?.displayError?.(Craft.t(`metrix`,`Failed to save widget order. Please try again.`))}});d.promise=m,await m,d.promise===m&&n.delete(s)},refreshWidgetData:async e=>t().fetchWidgetData(e,{refresh:!0}),updateWidgetState:(t,n)=>{e(e=>({widgets:e.widgets.map(e=>e.__id===t.__id?{...e,...n}:e)}))},clearWidgets:()=>{e({widgets:[],collectionGeneration:t().collectionGeneration+1})}}}),W={default:D`
        --pk-dropdown-item-padding-block: 8px;
        --pk-dropdown-item-padding-inline: 12px;
        --pk-dropdown-item-gap: 0.625rem;
        --pk-dropdown-item-font-size: var(--pk-font-size-base);
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 12px;
        --pk-dropdown-label-padding-inline: 12px;
        --pk-dropdown-label-font-size: 13px;
        --pk-dropdown-details-font-size: var(--pk-font-size-sm);
    `,xs:D`
        --pk-dropdown-item-padding-block: 3px;
        --pk-dropdown-item-padding-inline: 8px;
        --pk-dropdown-item-gap: 0.375rem;
        --pk-dropdown-item-font-size: 12px;
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 10px;
        --pk-dropdown-label-padding-inline: 8px;
        --pk-dropdown-label-font-size: 11px;
        --pk-dropdown-details-font-size: 11px;
    `,sm:D`
        --pk-dropdown-item-padding-block: 4px;
        --pk-dropdown-item-padding-inline: 10px;
        --pk-dropdown-item-gap: 0.4375rem;
        --pk-dropdown-item-font-size: 13px;
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 12px;
        --pk-dropdown-label-padding-inline: 10px;
        --pk-dropdown-label-font-size: 11px;
        --pk-dropdown-details-font-size: 12px;
    `,lg:D`
        --pk-dropdown-item-padding-block: 10px;
        --pk-dropdown-item-padding-inline: 14px;
        --pk-dropdown-item-gap: 0.75rem;
        --pk-dropdown-item-font-size: 16px;
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 14px;
        --pk-dropdown-label-padding-inline: 14px;
        --pk-dropdown-label-font-size: 14px;
        --pk-dropdown-details-font-size: var(--pk-font-size-sm);
    `,xl:D`
        --pk-dropdown-item-padding-block: 12px;
        --pk-dropdown-item-padding-inline: 16px;
        --pk-dropdown-item-gap: 0.75rem;
        --pk-dropdown-item-font-size: 18px;
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 16px;
        --pk-dropdown-label-padding-inline: 16px;
        --pk-dropdown-label-font-size: 15px;
        --pk-dropdown-details-font-size: var(--pk-font-size-base);
    `},Oe=D`
    @layer pk-component {
        :host {
            ${W.default}
        }

        :host([size='xs']) {
            ${W.xs}
        }

        :host([size='sm']) {
            ${W.sm}
        }

        :host([size='lg']) {
            ${W.lg}
        }

        :host([size='xl']) {
            ${W.xl}
        }
    }
`,G=D`
    @layer pk-component {
        .panel[data-size='default'],
        .submenu-panel[data-size='default'] {
            ${W.default}
        }

        .panel[data-size='xs'],
        .submenu-panel[data-size='xs'] {
            ${W.xs}
        }

        .panel[data-size='sm'],
        .submenu-panel[data-size='sm'] {
            ${W.sm}
        }

        .panel[data-size='lg'],
        .submenu-panel[data-size='lg'] {
            ${W.lg}
        }

        .panel[data-size='xl'],
        .submenu-panel[data-size='xl'] {
            ${W.xl}
        }
    }
`;D`
    ${Oe}
    ${G}
`;var ke=[N,G,D`
    @layer pk-component {
        :host {
            display: block;
            position: relative;
            /*
             * Slotted label text inherits from this host (light DOM), not from
             * shadow .item — pin size-token metrics so Craft CP / Tailwind /
             * bare hosts all get the same item rhythm.
             */
            font-size: var(--pk-dropdown-item-font-size, var(--pk-font-size-base));
            line-height: var(--pk-dropdown-item-line-height, 1.5);
            color: var(--text-color, var(--pk-color-gray-700));
        }

        .item {
            display: flex;
            align-items: center;
            gap: var(--pk-dropdown-item-gap, 0.625rem);
            width: 100%;
            margin: 0;
            padding: var(--pk-dropdown-item-padding-block, 8px) var(--pk-dropdown-item-padding-inline, 12px);
            border: 0;
            background: transparent;
            color: inherit;
            font: inherit;
            font-size: var(--pk-dropdown-item-font-size, var(--pk-font-size-base));
            /* Explicit — do not let font:inherit re-leak page line-height. */
            line-height: var(--pk-dropdown-item-line-height, 1.5);
            font-weight: normal;
            text-align: left;
            white-space: nowrap;
            cursor: default;
            user-select: none;
            outline: none;
            box-sizing: border-box;
        }

        .item:hover:not([disabled]):not([aria-disabled='true']),
        :host([data-highlighted]) .item,
        :host([submenu-open]) .item {
            background: var(--pk-color-slate-100);
        }

        .item:focus-visible {
            background: var(--pk-color-slate-100);
        }

        .item[aria-disabled='true'] {
            pointer-events: none;
            opacity: 0.5;
        }

        .label {
            flex: 1 1 auto;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .prefix {
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            width: var(--pk-dropdown-item-icon-size, 12px);
            height: var(--pk-dropdown-item-icon-size, 12px);
            line-height: 0;
        }

        .prefix--empty {
            display: none;
        }

        .prefix ::slotted(*) {
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            width: var(--pk-dropdown-item-icon-size, 12px);
            height: var(--pk-dropdown-item-icon-size, 12px);
            /* Kill pk-icon text-baseline nudge inside the padded flex row. */
            vertical-align: 0;
        }

        .prefix ::slotted(svg),
        .prefix ::slotted(*) svg,
        .prefix ::slotted(.pk-dropdown-item__prefix-icon) {
            display: block;
            width: var(--pk-dropdown-item-icon-size, 12px) !important;
            height: var(--pk-dropdown-item-icon-size, 12px) !important;
            max-width: var(--pk-dropdown-item-icon-size, 12px);
            max-height: var(--pk-dropdown-item-icon-size, 12px);
            flex-shrink: 0;
            pointer-events: none;
        }

        .details {
            margin-left: auto;
            color: var(--pk-color-gray-500);
            font-size: var(--pk-dropdown-details-font-size, var(--pk-font-size-sm));
            letter-spacing: 0.04em;
        }

        .details:empty {
            display: none;
        }

        .check {
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            width: 12px;
            height: 12px;
            color: var(--pk-color-gray-700);
        }

        .check svg {
            display: block;
            width: 12px;
            height: 12px;
            flex-shrink: 0;
            pointer-events: none;
        }

        .submenu-icon {
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            width: 1rem;
            color: var(--pk-color-gray-700);
        }

        .submenu-icon svg {
            display: block;
            width: 1em;
            height: 1em;
            flex-shrink: 0;
            pointer-events: none;
        }

        .check {
            opacity: 0;
        }

        :host([checked]) .check {
            opacity: 1;
        }

        :host([type='checkbox']) .check,
        :host([type='radio']) .check {
            margin-left: auto;
        }

        :host([type='checkbox'][checked]) .check,
        :host([type='radio'][checked]) .check {
            opacity: 1;
        }

        .submenu-icon:empty {
            display: none;
        }

        :host([destructive]) .item {
            color: var(--pk-color-error);
        }

        :host([destructive]) .item:hover:not([disabled]):not([aria-disabled='true']),
        :host([destructive]) .item:focus-visible {
            color: var(--pk-color-error);
        }

        .submenu-panel {
            width: max-content;
            min-width: 8rem;
            max-height: var(--pk-popup-available-height, calc(100dvh - 20px));
            overflow: auto;
            overscroll-behavior: contain;
            padding: 4px 0;
            border-radius: var(--pk-radius-md);
            background: var(--pk-color-white);
            box-shadow: var(--pk-shadow-popup);
            /* Match root menu panel — Craft body text, not gray-900. */
            color: var(--text-color, var(--pk-color-gray-700));
        }

        .submenu-panel ::slotted(pk-dropdown-item),
        .submenu-panel ::slotted(pk-dropdown-separator),
        .submenu-panel ::slotted(pk-dropdown-label) {
            display: block;
        }

        .submenu-panel[hidden] {
            display: none !important;
        }
    }
`],K,Ae=g(e),je=g(t),q=class extends a{static{K=this}constructor(...e){super(...e),this.value=``,this.type=`normal`,this.radioGroup=``,this.disabled=!1,this.destructive=!1,this.checked=!1,this.submenuOpen=!1,this.active=!1,this.submenuAnimated=!1,this.hasSlotController=new fe(this,`submenu`,`details`,`start`,`prefix`),this.handleMouseEnter=()=>{this.hasSubmenu()&&!this.disabled&&(this.notifyParentOfOpening(),this.submenuOpen=!0)},this.handleHostClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}}static{this.styles=ke}connectedCallback(){super.connectedCallback(),this.syncRole(),this.syncSubmenuAria(),this.addEventListener(`click`,this.handleHostClick),this.addEventListener(`mouseenter`,this.handleMouseEnter)}disconnectedCallback(){this.removeEventListener(`click`,this.handleHostClick),this.removeEventListener(`mouseenter`,this.handleMouseEnter),this.closeSubmenu(),super.disconnectedCallback()}updated(e){(e.has(`type`)||e.has(`checked`))&&this.syncRole(),(e.has(`submenuOpen`)||e.size===0)&&this.syncSubmenuAria(),e.has(`submenuOpen`)&&(this.submenuOpen?this.ensureSubmenuSurface():this.submenuAnimated=!1)}hasSubmenu(){return this.hasSlotController.test(`submenu`)}syncSubmenuAria(){let e=this.hasSubmenu();e?this.setAttribute(`aria-haspopup`,`menu`):this.removeAttribute(`aria-haspopup`),this.setAttribute(`aria-expanded`,e&&this.submenuOpen?`true`:`false`)}focusControl(){this.shadowRoot?.querySelector(`.item`)?.focus({preventScroll:!0})}focus(e){let t=this.shadowRoot?.querySelector(`.item`);if(t){t.focus(e);return}super.focus(e)}get submenuElement(){return this.submenuPanelElement??null}closeSubmenu(){this.submenuAnimated=!1,this.submenuOpen=!1}openSubmenu(){this.hasSubmenu()&&!this.disabled&&this.isConnected&&(this.notifyParentOfOpening(),this.submenuOpen=!0)}notifyParentOfOpening(){this.dispatchEvent(new CustomEvent(`pk-submenu-open`,{bubbles:!0,composed:!0,detail:{item:this}}));let e=this.parentElement;if(e)for(let t of e.children)t!==this&&t instanceof K&&t.getAttribute(`slot`)===this.getAttribute(`slot`)&&t.submenuOpen&&(t.submenuOpen=!1)}ensureSubmenuSurface(){this.hasSubmenu()&&!this.disabled&&(this.submenuAnimated=!0,this.updateComplete.then(()=>{this.submenuOpen&&this.submenuPanelElement&&(this.submenuPanelElement.hidden=!1,M(this.submenuPanelElement,`right-start`),P(this.submenuPopupElement,`right-start`).then(e=>{M(this.submenuPanelElement,e)}))}))}syncRole(){if(this.type===`checkbox`){this.setAttribute(`role`,`menuitemcheckbox`),this.setAttribute(`aria-checked`,this.checked?`true`:`false`);return}if(this.type===`radio`){this.setAttribute(`role`,`menuitemradio`),this.setAttribute(`aria-checked`,this.checked?`true`:`false`);return}this.setAttribute(`role`,`menuitem`),this.removeAttribute(`aria-checked`)}handleClick(e){if(this.disabled){e.preventDefault(),e.stopImmediatePropagation();return}this.hasSubmenu()&&(e.preventDefault(),this.openSubmenu())}render(){let e=this.hasSubmenu(),t=this.type===`checkbox`||this.type===`radio`,n=this.hasSlotController.test(`start`)||this.hasSlotController.test(`prefix`);return E`
            <button
                part="item"
                type="button"
                class="item"
                ?disabled=${this.disabled}
                aria-disabled=${this.disabled?`true`:A}
                @click=${this.handleClick}
            >
                <span
                    part="prefix"
                    class=${n?`prefix`:`prefix prefix--empty`}
                >
                    <slot name="start"></slot>
                    <slot name="prefix"></slot>
                </span>
                <span part="label" class="label"><slot></slot></span>
                <span class="details"><slot name="details"></slot></span>
                ${t?E`<span part="check" class="check" aria-hidden="true">${_e(Ae)}</span>`:A}
                ${e?E`<span class="submenu-icon" aria-hidden="true">${_e(je)}</span>`:A}
            </button>
            ${e?E`
                <pk-popup
                    .active=${this.submenuOpen}
                    .anchor=${this}
                    placement="right-start"
                    .distance=${0}
                    .skidding=${-4}
                    flip
                    shift
                    auto-size="vertical"
                    .autoSizePadding=${10}
                    hover-bridge
                    style="--pk-popup-z-index: 1001"
                >
                    <div
                        part="submenu"
                        class="submenu-panel pk-popup-content"
                        role="menu"
                        data-size=${Me(this)}
                        ?hidden=${!this.submenuOpen}
                        data-open=${this.submenuAnimated?``:A}
                        aria-orientation="vertical"
                    >
                        <slot name="submenu"></slot>
                    </div>
                </pk-popup>
            `:A}
        `}};h([T()],q.prototype,`value`,void 0),h([T({reflect:!0})],q.prototype,`type`,void 0),h([T({attribute:`radio-group`})],q.prototype,`radioGroup`,void 0),h([T({type:Boolean,reflect:!0})],q.prototype,`disabled`,void 0),h([T({type:Boolean,reflect:!0})],q.prototype,`destructive`,void 0),h([T({type:Boolean,reflect:!0})],q.prototype,`checked`,void 0),h([T({attribute:`submenu-open`,type:Boolean,reflect:!0})],q.prototype,`submenuOpen`,void 0),h([T({type:Boolean})],q.prototype,`active`,void 0),h([k()],q.prototype,`submenuAnimated`,void 0),h([O(`.submenu-panel`)],q.prototype,`submenuPanelElement`,void 0),h([O(`pk-popup`)],q.prototype,`submenuPopupElement`,void 0),q=K=h([n(`pk-dropdown-item`)],q);function Me(e){let t=e.parentElement?.getAttribute(`data-size`);if(t===`xs`||t===`sm`||t==="default"||t===`lg`||t===`xl`)return t;let n=e.closest(`pk-dropdown-menu`)?.getAttribute(`size`);return n===`xs`||n===`sm`||n===`lg`||n===`xl`?n:`default`}var Ne=D`
    @layer pk-component {
        :host {
            display: block;
            /*
             * Slotted label copy inherits through the flat tree from this host
             * when page metrics would otherwise leak via font:inherit chains.
             */
            font-size: var(--pk-dropdown-label-font-size, 13px);
            line-height: 1.3;
            color: var(--pk-color-slate-700, rgba(96, 125, 159, 0.7));
        }

        /* Match v1 DropdownMenuLabel — text-slate-700, regular weight (not medium). */
        .label {
            margin: 0;
            padding-block-start: 6px;
            padding-block-end: 4px;
            padding-inline: var(--pk-dropdown-label-padding-inline, 12px);
            color: inherit;
            font: inherit;
            font-weight: 400;
            user-select: none;
            pointer-events: none;
        }
    }
`,J=class extends a{static{this.styles=Ne}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`presentation`)}render(){return E`
            <div part="label" class="label">
                <slot></slot>
            </div>
        `}};J=h([n(`pk-dropdown-label`)],J);var Pe=[i(),Oe,G,D`
        @layer pk-component {
            /* Standalone: keep a real box so the trigger is not a flex-stretched
               child of the page (display:contents flattened pk-button to full card width).
               Button groups override below — same as legacy + React MenuButton inline-flex wrap. */
            :host {
                display: inline-block;
                position: relative;
                width: fit-content;
                max-width: 100%;
                align-self: flex-start;
                vertical-align: middle;
            }

            :host([data-pk-group-orientation]) {
                display: inline-flex;
                vertical-align: middle;
                flex: 0 0 auto;
                width: auto;
                max-width: none;
                align-self: auto;
            }

            /* Belt-and-suspenders if a parent still flattens layout onto the trigger. */
            ::slotted([slot='trigger']) {
                width: fit-content;
                max-width: 100%;
                flex: 0 0 auto;
                align-self: flex-start;
            }

            :host([data-pk-group-orientation]) ::slotted([slot='trigger']) {
                --pk-bg-start-start-radius: inherit;
                --pk-bg-start-end-radius: inherit;
                --pk-bg-end-start-radius: inherit;
                --pk-bg-end-end-radius: inherit;
                align-self: auto;
                max-width: none;
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]) {
                margin-inline-start: var(--pk-bg-horizontal-indent, 0);
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-join]) {
                margin-block-start: var(--pk-bg-vertical-indent, 0);
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:has([slot='trigger'][variant='outline'], [slot='trigger'][variant='dashed'])) {
                margin-inline-start: var(--pk-bg-horizontal-indent-outlined, 0);
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-join]:has([slot='trigger'][variant='outline'], [slot='trigger'][variant='dashed'])) {
                margin-block-start: var(--pk-bg-vertical-indent-outlined, 0);
            }

            /* Menu panel — hug content; do not stretch to trigger/anchor width. */
            .panel {
                display: flex;
                flex-direction: column;
                width: max-content;
                min-width: 8rem;
                max-height: var(--pk-popup-available-height, calc(100dvh - 20px));
                margin: 0;
                overflow: auto;
                overscroll-behavior: contain;
                padding: 4px 0;
                border: 0;
                border-radius: var(--pk-radius-md);
                background: var(--pk-color-white);
                box-shadow: var(--pk-shadow-popup);
                /* v1 DropdownMenuItem had no face color — inherited Craft body
                 * (--text-color ≈ gray-700). Do not force gray-900 (too dark). */
                color: var(--text-color, var(--pk-color-gray-700));
                outline: none;
                text-align: start;
                user-select: none;
                /* Match v1 Base UI: popup writes --pk-transform-origin from the
                 * anchor center on the connecting edge (e.g. top-right for
                 * bottom-end). Keyword edge centers made end-aligned menus
                 * scale from the middle of the panel. */
                transform-origin: var(--pk-transform-origin, top);
            }

            .panel.show {
                animation: pk-dropdown-menu-show 100ms ease;
            }

            .panel.hide {
                animation: pk-dropdown-menu-show 100ms ease reverse;
            }

            .panel[hidden] {
                display: none !important;
            }

            ::slotted(pk-dropdown-item),
            ::slotted(pk-dropdown-separator),
            ::slotted(pk-dropdown-label),
            .panel > pk-dropdown-item,
            .panel > pk-dropdown-separator,
            .panel > pk-dropdown-label {
                display: block;
            }

            ::slotted([data-menu-item]) {
                display: flex;
                align-items: center;
                gap: 0.625rem;
                width: 100%;
                margin: 0;
                padding: 8px 12px;
                border: 0;
                background: transparent;
                color: inherit;
                font: inherit;
                font-size: var(--pk-font-size-base);
                text-align: left;
                white-space: nowrap;
                cursor: default;
                user-select: none;
                outline: none;
                box-sizing: border-box;
            }

            ::slotted([data-menu-item]:hover:not([disabled])) {
                background: var(--pk-color-slate-100);
            }

            ::slotted([data-menu-item]:focus-visible) {
                background: var(--pk-color-slate-100);
            }

            ::slotted([data-menu-item][disabled]) {
                pointer-events: none;
                opacity: 0.5;
            }

            ::slotted(pk-dropdown-item[destructive]),
            ::slotted([data-destructive]) {
                color: var(--pk-color-error);
            }

            ::slotted([data-menu-separator]) {
                display: block;
                height: 1px;
                margin: 4px 0;
                background: var(--pk-color-slate-200);
                border: 0;
                padding: 0;
            }
        }

        /* Outside @layer so constructed stylesheets resolve the name reliably. */
        @keyframes pk-dropdown-menu-show {
            from {
                scale: 0.9;
                opacity: 0;
            }

            to {
                scale: 1;
                opacity: 1;
            }
        }
    `],Y=new Set,X=class extends a{constructor(...e){super(...e),this.open=!1,this.size=`default`,this.placement=`bottom-start`,this.sideOffset=4,this.distance=4,this.skidding=0,this.for=``,this.userTypedQuery=``,this.userTypedTimeout=0,this.openSubmenuStack=[],this.openedByKeyboard=!1,this.triggerElement=null,this.handleMenuClick=e=>{let t=this.resolveMenuItem(e);if(t&&!t.disabled){if(t.hasSubmenu()){t.submenuOpen||(this.closeSiblingSubmenus(t),this.addToSubmenuStack(t),t.openSubmenu()),e.stopPropagation();return}this.makeSelection(t)}},this.handleSubmenuOpening=e=>{let t=e.detail?.item;t instanceof q&&(this.closeSiblingSubmenus(t),this.addToSubmenuStack(t))},this.handleGlobalMouseMove=e=>{let t=this.getCurrentSubmenuItem();if(!t?.submenuOpen||!t.submenuElement)return;let n=t.submenuElement,r=e.composedPath(),i=t.matches(`:hover`),a=!!n.matches(`:hover`),o=i||r.some(e=>e===t),s=a||r.some(e=>e instanceof HTMLElement&&e.closest(`[part="submenu"]`)===n);!o&&!s&&window.setTimeout(()=>{!i&&!a&&(t.submenuOpen=!1)},100)},this.handleTriggerClick=e=>{let t=this.getTrigger();t&&e.composedPath().includes(t)&&(e.preventDefault(),e.stopPropagation(),this.openedByKeyboard=!1,this.open=!this.open)},this.handleExternalTriggerClick=e=>{e.preventDefault(),e.stopPropagation(),this.openedByKeyboard=!1,this.open=!this.open},this.handleTriggerKeyDown=e=>{let t=this.getTrigger();t&&e.composedPath().includes(t)&&(this.open||(e.key===`ArrowDown`||e.key===`ArrowUp`)&&(e.preventDefault(),e.stopPropagation(),this.openedByKeyboard=!0,this.open=!0))},this.handleDocumentKeyDown=e=>{let t=this.isRtl();if(e.key===`Escape`&&this.open&&s(this)){e.preventDefault(),e.stopPropagation(),this.open=!1,this.getTrigger()?.focus({preventScroll:!0});return}if(!this.open)return;let n=[...I()].find(e=>e.localName===`pk-dropdown-item`),r=n?.localName===`pk-dropdown-item`,i=this.getCurrentSubmenuItem(),a=!!i,o,c,l;a&&i?(o=this.getSubmenuItems(i),c=o.find(e=>e.active||e===n),l=c?o.indexOf(c):-1):(o=this.getItems(),c=o.find(e=>e.active||e===n),l=c?o.indexOf(c):-1);let u;if(e.key===`ArrowUp`&&(e.preventDefault(),e.stopPropagation(),u=l>0?o[l-1]:o[o.length-1]),e.key===`ArrowDown`&&(e.preventDefault(),e.stopPropagation(),u=l!==-1&&l<o.length-1?o[l+1]:o[0]),e.key===(t?`ArrowLeft`:`ArrowRight`)&&r&&c&&c.hasSubmenu()){e.preventDefault(),e.stopPropagation(),this.closeSiblingSubmenus(c),c.openSubmenu(),this.addToSubmenuStack(c),window.setTimeout(()=>{let e=this.getSubmenuItems(c);e.length>0&&this.setActiveItem(e,e[0])},0);return}if(e.key===(t?`ArrowRight`:`ArrowLeft`)&&a){e.preventDefault(),e.stopPropagation();let t=this.removeFromSubmenuStack();t&&(t.submenuOpen=!1,window.setTimeout(()=>{t.focus({preventScroll:!0}),t.active=!0,(t.slot===`submenu`&&t.parentElement instanceof q?this.getSubmenuItems(t.parentElement):this.getItems()).forEach(e=>{e!==t&&(e.active=!1)})},0));return}if((e.key===`Home`||e.key===`End`)&&(e.preventDefault(),e.stopPropagation(),u=e.key===`Home`?o[0]:o[o.length-1]),e.key===`Tab`){this.open=!1;return}if(e.key.length===1&&!(e.metaKey||e.ctrlKey||e.altKey)&&(e.key!==` `||this.userTypedQuery!==``)){window.clearTimeout(this.userTypedTimeout),this.userTypedTimeout=window.setTimeout(()=>{this.userTypedQuery=``},1e3),this.userTypedQuery+=e.key;let t=this.userTypedQuery.trim().toLowerCase();u=o.find(e=>(e.textContent||``).trim().toLowerCase().startsWith(t))}if(u){e.preventDefault(),e.stopPropagation(),this.setActiveItem(o,u);return}(e.key===`Enter`||e.key===` `&&this.userTypedQuery===``)&&r&&c&&(e.preventDefault(),e.stopPropagation(),c.hasSubmenu()?(this.closeSiblingSubmenus(c),c.openSubmenu(),this.addToSubmenuStack(c),window.setTimeout(()=>{let e=this.getSubmenuItems(c);e.length>0&&this.setActiveItem(e,e[0])},0)):this.makeSelection(c))},this.handleDocumentPointerDown=e=>{let t=e.composedPath(),n=this.getTrigger();t.some(e=>e===this||e===n)||(this.open=!1)}}static{this.styles=Pe}get panelElement(){return this.menuElement??null}get popup(){return this.popupElement??null}connectedCallback(){super.connectedCallback(),this.addEventListener(`click`,this.handleTriggerClick,!0),this.addEventListener(`keydown`,this.handleTriggerKeyDown)}firstUpdated(){let e=()=>{if(this.for){this.resolveExternalTrigger();return}this.syncSlottedTrigger()};queueMicrotask(e),requestAnimationFrame(e)}disconnectedCallback(){window.clearTimeout(this.userTypedTimeout),this.removeEventListener(`click`,this.handleTriggerClick,!0),this.removeEventListener(`keydown`,this.handleTriggerKeyDown),this.unbindTrigger(this.triggerElement),this.triggerElement=null,this.closeAllSubmenus(),this.popupElement&&(this.popupElement.active=!1),this.menuElement?.classList.remove(`show`,`hide`),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove),l(this),Y.delete(this),super.disconnectedCallback()}async updated(e){if(super.updated(e),e.has(`for`)&&this.resolveExternalTrigger(),e.has(`open`)&&this.syncTriggerExpanded(),!e.has(`open`))return;let t=e.get(`open`);t!==this.open&&(t!==void 0||this.open!==!1)&&(this.open?await this.showMenu():(this.closeAllSubmenus(),await this.hideMenu(`unknown`)))}getItems(e=!1){let t=(this.defaultSlot?.assignedElements({flatten:!0})??[]).filter(e=>e.localName===`pk-dropdown-item`);return e?t:t.filter(e=>!e.disabled)}getSubmenuItems(e,t=!1){let n=((e.shadowRoot?.querySelector(`slot[name="submenu"]`))?.assignedElements({flatten:!0})??[...e.children].filter(e=>e.getAttribute(`slot`)===`submenu`)).filter(e=>e.localName===`pk-dropdown-item`);return t?n:n.filter(e=>!e.disabled)}getTrigger(){return this.for?j(this,this.for)??this.triggerElement:this.querySelector(`[slot="trigger"]`)??this.triggerElement}getAnchor(){return this.getTrigger()??``}resolveExternalTrigger(){this.unbindTrigger(this.triggerElement),this.triggerElement=this.for?j(this,this.for):null,this.bindTrigger(this.triggerElement),this.requestUpdate()}onTriggerSlotChange(e){if(this.for)return;let[t]=e.target.assignedElements({flatten:!0});this.unbindTrigger(this.triggerElement),this.triggerElement=t??null,this.bindTrigger(this.triggerElement),this.requestUpdate()}syncSlottedTrigger(){let e=this.renderRoot.querySelector(`slot[name="trigger"]`);e&&this.onTriggerSlotChange({target:e})}bindTrigger(e){e&&(e.setAttribute(`aria-haspopup`,`menu`),this.for&&(e.addEventListener(`click`,this.handleExternalTriggerClick),e.addEventListener(`keydown`,this.handleTriggerKeyDown)),this.syncTriggerExpanded())}unbindTrigger(e){e?.removeEventListener(`click`,this.handleExternalTriggerClick),e?.removeEventListener(`keydown`,this.handleTriggerKeyDown)}syncTriggerExpanded(){this.getTrigger()?.setAttribute(`aria-expanded`,this.open?`true`:`false`)}closeAfterSelect(e=`api`){this.open=!1}makeSelection(e){let t=this.getTrigger();if(e.disabled)return;e.type===`checkbox`&&(e.checked=!e.checked),e.type===`radio`&&!e.checked&&(e.checked=!0);let n={value:e.value,type:e.type,checked:e.checked,radioGroup:e.radioGroup};e.dispatchEvent(new CustomEvent(`pk-select`,{detail:n,bubbles:!1,composed:!1,cancelable:!0}));let r=new CustomEvent(`pk-select`,{detail:n,bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(r),r.defaultPrevented||(this.open=!1,t?.focus({preventScroll:!0}))}resolveMenuItem(e){let t=e.target;if(t instanceof q)return t;if(t instanceof Element){let e=t.closest(`pk-dropdown-item`);if(e instanceof q)return e}return e.composedPath().find(e=>e instanceof q)??null}whenClosed(){return this.open?new Promise(e=>{this.addEventListener(`pk-after-hide`,()=>{this.popupElement.stop().then(()=>e())},{once:!0})}):this.popupElement?.active?this.popupElement.stop():Promise.resolve()}forceDismissCleanup(){this.open=!1,this.popupElement.active=!1,this.menuElement?.classList.remove(`show`,`hide`),this.closeAllSubmenus(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove),l(this),Y.delete(this)}isRtl(){return getComputedStyle(this).direction===`rtl`}addToSubmenuStack(e){let t=this.openSubmenuStack.indexOf(e);t===-1?this.openSubmenuStack.push(e):this.openSubmenuStack=this.openSubmenuStack.slice(0,t+1)}removeFromSubmenuStack(){return this.openSubmenuStack.pop()}getCurrentSubmenuItem(){return this.openSubmenuStack.length>0?this.openSubmenuStack[this.openSubmenuStack.length-1]:void 0}closeAllSubmenus(){this.getItems(!0).forEach(e=>{e.submenuOpen=!1,e.active=!1}),this.openSubmenuStack=[]}closeSiblingSubmenus(e){let t=e.closest(`pk-dropdown-item:not([slot="submenu"])`);(t instanceof q?this.getSubmenuItems(t,!0):this.getItems(!0)).forEach(t=>{t!==e&&t.submenuOpen&&(t.submenuOpen=!1)}),this.openSubmenuStack.includes(e)||this.openSubmenuStack.push(e)}setActiveItem(e,t){e.forEach(e=>{e.active=e===t,e===t?e.setAttribute(`data-highlighted`,``):e.removeAttribute(`data-highlighted`)}),t.focus({preventScroll:!0}),t.scrollIntoView({block:`nearest`})}async showMenu(){if(!this.popupElement||!this.menuElement)return;this.for&&!this.triggerElement?.isConnected&&this.resolveExternalTrigger();let e=new m;if(!this.dispatchEvent(e)){this.open=!1;return}if(this.popupElement.active&&(this.popupElement.active=!1,this.menuElement.classList.remove(`show`,`hide`),await this.updateComplete),Y.forEach(e=>{e!==this&&(e.open=!1)}),this.popupElement.active=!0,this.open=!0,Y.add(this),d(this),document.addEventListener(`keydown`,this.handleDocumentKeyDown),document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.addEventListener(`mousemove`,this.handleGlobalMouseMove),await this.updateComplete,await P(this.popupElement,this.placement,100,{requireEvent:!0}),!this.open){this.popupElement.active=!1,Y.delete(this),l(this),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove);return}this.menuElement.classList.remove(`hide`),await u(this.menuElement,`show`);let t=this.getItems();t.length>0&&(this.openedByKeyboard?this.setActiveItem(t,t[0]):(t.forEach(e=>{e.active=!1,e.removeAttribute(`data-highlighted`)}),this.menuElement.focus({preventScroll:!0}))),this.openedByKeyboard=!1,this.dispatchEvent(new o),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!0},bubbles:!0,composed:!0}))}async hideMenu(e){if(!this.popupElement||!this.menuElement)return;let t=new c(e);if(!this.dispatchEvent(t)){this.open=!0;return}this.open=!1,Y.delete(this),l(this),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove),this.userTypedQuery=``,window.clearTimeout(this.userTypedTimeout),this.getItems(!0).forEach(e=>{e.active=!1,e.removeAttribute(`data-highlighted`)}),this.menuElement.classList.remove(`show`),await u(this.menuElement,`hide`),this.popupElement.active=!1,this.dispatchEvent(new p),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!1},bubbles:!0,composed:!0}))}render(){let e=this.hasUpdated?this.popupElement?.active:this.open;return E`
            <pk-popup
                .anchor=${this.for?this.getAnchor():``}
                placement=${this.placement}
                .distance=${this.distance||this.sideOffset}
                .skidding=${this.skidding}
                ?active=${e}
                flip
                shift
                .shiftPadding=${10}
                auto-size="vertical"
                .autoSizePadding=${10}
            >
                <slot
                    name="trigger"
                    slot="anchor"
                    @slotchange=${this.onTriggerSlotChange}
                ></slot>

                <div
                    id="menu"
                    part="panel"
                    class="panel"
                    role="menu"
                    tabindex="-1"
                    aria-orientation="vertical"
                    data-size=${this.size}
                    @click=${this.handleMenuClick}
                    @pk-submenu-open=${this.handleSubmenuOpening}
                >
                    <slot></slot>
                </div>
            </pk-popup>
        `}};h([T({type:Boolean,reflect:!0})],X.prototype,`open`,void 0),h([T({reflect:!0})],X.prototype,`size`,void 0),h([T({reflect:!0})],X.prototype,`placement`,void 0),h([T({attribute:`side-offset`,type:Number})],X.prototype,`sideOffset`,void 0),h([T({type:Number})],X.prototype,`distance`,void 0),h([T({type:Number})],X.prototype,`skidding`,void 0),h([T({reflect:!0})],X.prototype,`for`,void 0),h([O(`slot:not([name])`)],X.prototype,`defaultSlot`,void 0),h([O(`#menu`)],X.prototype,`menuElement`,void 0),h([O(`pk-popup`)],X.prototype,`popupElement`,void 0),X=h([n(`pk-dropdown-menu`)],X);var Z=class extends a{static{this.styles=D`
        @layer pk-component {
            :host {
                display: block;
            }

            hr {
                display: block;
                height: 1px;
                margin: 4px 0;
                border: 0;
                padding: 0;
                background: var(--pk-color-slate-200);
            }
        }
    `}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`separator`)}render(){return E`<hr part="base" />`}};Z=h([n(`pk-dropdown-separator`)],Z);var Fe=w({tagName:`pk-dropdown-menu`,elementClass:X,react:F.default,events:{onPkSelect:`pk-select`,onPkShow:`pk-show`,onPkAfterShow:`pk-after-show`,onPkHide:`pk-hide`,onPkAfterHide:`pk-after-hide`,onPkOpenChange:`pk-open-change`}}),Ie=w({tagName:`pk-dropdown-item`,elementClass:q,react:F.default,events:{onPkSelect:`pk-select`,onPkSubmenuOpen:`pk-submenu-open`}});w({tagName:`pk-dropdown-label`,elementClass:J,react:F.default});var Le=w({tagName:`pk-dropdown-separator`,elementClass:Z,react:F.default}),Re=Fe,Q=Ie,ze=Le;function Be({className:e,show:t,children:n}){return(0,L.jsx)(`div`,{className:C(`h-full`,t?`fade-enter-active`:`fade-enter`,e),children:t?n:null})}var Ve=(0,F.lazy)(()=>_(()=>import(`./WidgetSettings-DN1xptV1.js`).then(e=>({default:e.WidgetSettings})),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]),import.meta.url));function He(e,t){if(!e?.fetchedAt)return null;let n=Math.max(0,Math.floor(t/1e3)-Number(e.fetchedAt)),r;if(n<45)r=Craft.t(`metrix`,`just now`);else if(n<3600){let e=Math.max(1,Math.round(n/60));r=Craft.t(`metrix`,`{n,plural,=1{# min ago} other{# mins ago}}`,{n:e})}else if(n<86400){let e=Math.max(1,Math.round(n/3600));r=Craft.t(`metrix`,`{n,plural,=1{# hour ago} other{# hours ago}}`,{n:e})}else{let e=Math.max(1,Math.round(n/86400));r=Craft.t(`metrix`,`{n,plural,=1{# day ago} other{# days ago}}`,{n:e})}return Craft.t(`metrix`,`Updated {age}`,{age:r})}function Ue({widget:e}){let t=U(e=>e.duplicateWidget),n=U(e=>e.updateWidget),r=U(e=>e.removeWidget),i=U(e=>e.refreshWidgetData),a=b(e=>e.periodOptions),o=b(e=>e.globalPeriod),s=te(e=>e.getSettingsByType),[c,l]=(0,F.useState)(!1),[u,d]=(0,F.useState)(!1),[f,p]=(0,F.useState)(!1),[m,h]=(0,F.useState)(Date.now),g=e.chartData?._meta?.fetchedAt;(0,F.useEffect)(()=>{if(!g)return;let e=setInterval(()=>h(Date.now()),3e4);return()=>clearInterval(e)},[g]);let _=s(e.data.type,e.data.source)?.some(e=>e.name===`period`),y=Ee(e),x=y&&o?o:e.data.period,S=e.data.displayTitle||(e.data.dimensionLabel?`${e.data.dimensionLabel} - ${e.data.metricLabel}`:e.data.metricLabel),C=He(e.chartData?._meta,m);return(0,L.jsxs)(`div`,{className:`flex flex-row items-start relative z-[10] gap-2`,children:[(0,L.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,L.jsx)(`div`,{className:`font-bold text-gray-600 truncate`,children:S}),e.data.subtitle?(0,L.jsx)(`div`,{className:`text-xs text-gray-500 truncate mt-0.5`,children:e.data.subtitle}):null,C?(0,L.jsx)(`div`,{className:`text-[11px] text-gray-400 truncate mt-0.5`,title:C,children:C}):null]}),(0,L.jsxs)(`div`,{className:`flex flex-row items-center flex-shrink-0 gap-1 metrix-widget-header-controls`,children:[_&&(0,L.jsx)(be,{className:`metrix-widget-period-select`,periodOptions:a,value:x,size:`xs`,onChange:t=>{t&&n(e,{period:t,inheritPeriod:!1})}}),(0,L.jsxs)(Re,{className:`metrix-widget-header-menu`,open:c,placement:`bottom-end`,onPkOpenChange:e=>{l(!!(e.detail?.open??e.target?.open))},children:[(0,L.jsx)(v,{slot:`trigger`,type:`button`,variant:`default`,size:`xs`,className:`metrix-widget-menu-trigger`,"aria-label":Craft.t(`metrix`,`Widget actions`),children:(0,L.jsx)(ee,{icon:`ellipsis-vertical`})}),(0,L.jsx)(Q,{value:`settings`,onPkSelect:()=>{setTimeout(()=>{d(!0)},100)},children:Craft.t(`metrix`,`Settings`)}),(0,L.jsx)(Q,{value:`refresh`,disabled:f||e.loading,onPkSelect:async()=>{p(!0);try{await i(e.__id)}finally{p(!1),l(!1)}},children:f?Craft.t(`metrix`,`Refreshing…`):Craft.t(`metrix`,`Refresh`)}),_&&o&&!y?(0,L.jsx)(Q,{value:`use-dashboard-period`,onPkSelect:()=>{n(e,{inheritPeriod:!0}),l(!1)},children:Craft.t(`metrix`,`Use dashboard date range`)}):null,(0,L.jsx)(Q,{value:`duplicate`,onPkSelect:()=>{t(e)},children:Craft.t(`metrix`,`Duplicate`)}),(0,L.jsxs)(`div`,{className:`metrix-widget-menu-width-row`,children:[(0,L.jsx)(`span`,{className:`metrix-widget-menu-width-row__label`,children:Craft.t(`metrix`,`Column Size`)}),(0,L.jsx)(ae,{value:e.data.width,onChange:t=>{n(e,{width:t},!1),l(!1)}})]}),(0,L.jsx)(ze,{}),(0,L.jsx)(Q,{value:`delete`,destructive:!0,onPkSelect:()=>{window.confirm(Craft.t(`metrix`,`Are you sure you want to delete this widget? This action cannot be undone.`))&&r(e)},children:Craft.t(`metrix`,`Delete`)})]}),(0,L.jsx)(oe,{className:`metrix-widget-settings-dialog`,open:u,label:Craft.t(`metrix`,`Widget Settings`),onPkOpenChange:e=>{d(!!e.detail?.open)},children:u?(0,L.jsx)(F.Suspense,{fallback:(0,L.jsx)(`div`,{role:`status`,children:Craft.t(`metrix`,`Loading…`)}),children:(0,L.jsx)(Ve,{widget:e,onClose:()=>d(!1)})}):null})]})]})}function We({className:e}){return(0,L.jsx)(`div`,{className:C(`pointer-events-none`,`flex-1 absolute inset-0 w-full h-full flex flex-col justify-center`,e),children:(0,L.jsx)(se,{size:`md`,centered:!0})})}var Ge=class extends Event{constructor(e){super(`pk-copy`,{bubbles:!0,cancelable:!1,composed:!0}),this.detail={value:e}}},Ke=class extends Event{constructor(){super(`pk-copy-error`,{bubbles:!0,cancelable:!1,composed:!0})}};async function qe(e){await navigator.clipboard.writeText(e)}function Je(e,t,n){if(!t)return n||null;let r=t.includes(`.`),i=t.includes(`[`)&&t.includes(`]`),a=t,o=``;r?[a,o]=t.trim().split(`.`):i&&([a,o]=t.trim().replace(/\]$/,``).split(`[`));let s=`getElementById`in e?e.getElementById(a):null;if(!s)return null;if(i)return s.getAttribute(o)??``;if(r){let e=s[o];return e==null?``:String(e)}return s.textContent??``}var Ye=D`
    @layer pk-component {
        :host {
            display: inline-block;
        }

        /* Match React CopyButton size="icon" — square, no horizontal padding. */
        pk-button::part(base) {
            padding-inline: 0;
            width: var(--pk-btn-height-default);
            min-width: var(--pk-btn-height-default);
        }

        /*
         * In-control trailing action (slot=end on pk-input, etc.): same family as
         * combobox expand/clear and image-browser clear — flex-reserved hit box
         * flush to the field edge, glyph sized via --pk-input-decoration-size.
         */
        :host([slot='end']) {
            display: inline-flex;
            align-self: stretch;
            height: auto;
            /* size=none buttons resolve --pk-btn-icon-size: 1em against this. */
            font-size: var(--pk-input-decoration-size, 0.75rem);
        }

        :host([slot='end']) pk-button {
            display: flex;
            height: 100%;
        }

        :host([slot='end']) pk-button::part(base) {
            box-sizing: border-box;
            width: calc(
                var(--pk-input-decoration-size, 0.75rem) + var(--pk-input-padding-inline, 8px)
            );
            min-width: calc(
                var(--pk-input-decoration-size, 0.75rem) + var(--pk-input-padding-inline, 8px)
            );
            height: 100%;
            min-height: 100%;
            padding: 0;
            border-width: 0;
            border-radius: 0;
            background: transparent;
            color: var(--pk-color-gray-600);
        }

        :host([slot='end']) pk-button::part(base):hover:not(:disabled) {
            color: var(--pk-color-gray-800);
        }
    }
`,Xe=g(r.check).replace(`<svg`,`<svg slot="start" part="success-icon"`),Ze=2e3,$=class extends a{constructor(...e){super(...e),this.value=``,this.from=``,this.disabled=!1,this.variant=`transparent`,this.copied=!1,this.resetCopied=()=>{this.copied=!1}}static{this.styles=Ye}disconnectedCallback(){window.clearTimeout(this.resetTimer),super.disconnectedCallback()}scheduleReset(){window.clearTimeout(this.resetTimer),this.resetTimer=window.setTimeout(this.resetCopied,Ze)}async handleCopy(){if(this.disabled)return;let e=Je(this.getRootNode(),this.from,this.value);if(e==null||e===``){this.dispatchEvent(new Ke);return}try{await qe(e),this.copied=!0,this.scheduleReset(),this.dispatchEvent(new Ge(e))}catch{this.dispatchEvent(new Ke)}}render(){let e=this.getAttribute(`slot`)===`end`;return E`
            <pk-button
                part="button"
                variant=${e?`none`:this.variant}
                size=${e?`none`:`default`}
                ?icon=${e}
                aria-label="Copy"
                ?disabled=${this.disabled}
                @click=${this.handleCopy}
            >
                ${this.copied?ge(Xe):E`<slot name="icon" slot="start"></slot>`}
            </pk-button>
        `}};h([T()],$.prototype,`value`,void 0),h([T()],$.prototype,`from`,void 0),h([T({type:Boolean,reflect:!0})],$.prototype,`disabled`,void 0),h([T({reflect:!0})],$.prototype,`variant`,void 0),h([k()],$.prototype,`copied`,void 0),$=h([n(`pk-copy-button`)],$);var Qe=w({tagName:`pk-copy-button`,elementClass:$,react:F.default,events:{onPkCopy:`pk-copy`,onPkCopyError:`pk-copy-error`}}),$e=()=>(0,L.jsxs)(`svg`,{xmlns:`http://www.w3.org/2000/svg`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,className:`size-4`,"aria-hidden":`true`,children:[(0,L.jsx)(`rect`,{width:`8`,height:`4`,x:`8`,y:`2`,rx:`1`,ry:`1`}),(0,L.jsx)(`path`,{d:`M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`})]});function et({error:e,className:t}){let n=e?.error?we(e.error):null,r=n?.traceAsArray??[],i=e?.message||Craft.t(`metrix`,`Failed to fetch widget data. Please try again.`),a=[n?.text,r.length?r.join(`
`):``].filter(Boolean).join(`

`),o=n?[n.heading,a].filter(Boolean).join(`

`):``;return(0,L.jsxs)(`div`,{className:C(`flex-1 absolute z-[1] pt-10 px-4 inset-0 w-full h-full flex flex-col justify-center`,t),children:[(0,L.jsx)(`div`,{className:`text-center text-error`,children:i}),n&&a&&(0,L.jsx)(`div`,{className:`text-center`,children:(0,L.jsxs)(H,{placement:`bottom`,flush:!0,className:`metrix-widget-error-popover z-[100]`,children:[(0,L.jsx)(v,{slot:`trigger`,type:`button`,variant:`outline`,size:`xs`,className:`mt-2 text-[11px] px-2 py-0.5`,children:Craft.t(`metrix`,`Details`)}),(0,L.jsxs)(`div`,{className:`metrix-widget-error-details`,children:[(0,L.jsx)(Qe,{value:o,variant:`transparent`,className:`metrix-widget-error-copy`,children:(0,L.jsx)(`span`,{slot:`icon`,children:(0,L.jsx)($e,{})})}),n.heading&&(0,L.jsx)(`strong`,{className:`block mb-2 text-left`,children:n.heading}),(0,L.jsx)(`pre`,{className:`metrix-widget-error-pre`,children:a})]})]})})]})}function tt({error:e,className:t}){return(0,L.jsx)(`div`,{className:C(`pointer-events-none`,`flex-1 absolute inset-0 w-full h-full flex flex-col justify-center`,t),children:(0,L.jsx)(`div`,{className:`mx-auto text-gray-550`,children:Craft.t(`metrix`,`No data available.`)})})}function nt({widget:e,afterFetchData:t,renderContent:n,className:r}){let{realtimeInterval:i}=b(),{fetchWidgetData:a}=U(),{__id:o,loading:s,error:c,data:l,waitForData:u,chartData:d}=e;return(0,F.useEffect)(()=>{u||d||c||!l.id||a(o).then(e=>{t&&t(e)})},[o,l.id,l.type,u,d,c,a,t]),(0,F.useEffect)(()=>{if(l.type!==`verbb\\metrix\\widgets\\Realtime`||c||u)return;let e=setInterval(()=>{a(o).then(e=>{t&&t(e)})},i);return()=>clearInterval(e)},[o,l.period,u,a,t,i,c]),(0,L.jsxs)(`div`,{className:C(`pane group flex h-full flex-col`,r),children:[(0,L.jsx)(Ue,{widget:e}),(0,L.jsxs)(`div`,{className:`relative flex min-h-0 flex-1 flex-col`,children:[s&&(0,L.jsx)(We,{}),c&&(0,L.jsx)(et,{error:c}),(0,L.jsx)(Be,{className:`flex min-h-0 flex-1 flex-col`,show:!s&&!c,children:d?.rows?.length?(0,L.jsx)(`div`,{className:`flex min-h-0 flex-1 flex-col`,children:n(d)},l.type):(0,L.jsx)(tt,{})})]})]})}export{H as a,U as i,Q as n,be as o,Re as r,R as s,nt as t};
//# sourceMappingURL=Widget-DhN8RWqi.js.map