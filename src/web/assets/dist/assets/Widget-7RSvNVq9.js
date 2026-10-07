const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./WidgetSettings-YTcYhs1j.js","./has-slot-9zjTXvea-ZUAZFMFd.js","./lit-CZC2goWk.js","./useWidgetSettingsStore-q6R43e8s.js","./focus-C6pY4Ym4-BEazZyvR.js","./dndkit-BBakeWil.js","./react-vendor-C9pfoLkf.js","./pk-button-DCtNLEPr-um3uC17C.js","./icon.styles-pNyUmVtP-DEztoZrJ.js","./button-group-item.styles-G05d0DNI-Cpbf4iKz.js","./dist-BQV6gLiX.js","./supports-popover-6lNVStLh-BVBIY4Jg.js","./useWidgetSettingsStore-DNebMgsC.css","./MetrixConfig-ClR-_GNa.js","./forms-Bp9cJWca.js","./Field-B7plyzjj.js","./pk-form-associated-element-MqaHdIoH-D5etOkKh.js","./mirror-validator-Cszpqlxk-BuTMKpbu.js","./overlay-lifecycle-CAoT0LE8-CBN5bZNu.js","./pk-clear-LzxwxEX7-BHgvcQ98.js","./pk-select-UUH7FE4H-Ch4-Ctl5.js","./option-filter-Cj5SvyzI-C-Fjcdab.js","./pk-dialog-CFU850OH-nQdAvPCj.js","./useWidgetSettingsForm-u2sowLR0.js"])))=>i.map(i=>d[i]);
import{N as e,a as t,c as n,g as r,o as i,s as a,t as o,y as s}from"./has-slot-9zjTXvea-ZUAZFMFd.js";import{_ as c,b as l,g as u,h as d,m as f,n as p,p as m,t as h,v as g,x as _,y as v}from"./useWidgetSettingsStore-q6R43e8s.js";import{t as y}from"./forms-Bp9cJWca.js";import{a as ee,c as te,f as ne,g as b,m as x}from"./MetrixConfig-ClR-_GNa.js";import{i as S,n as re,r as C}from"./focus-C6pY4Ym4-BEazZyvR.js";import{n as w,p as ie}from"./dndkit-BBakeWil.js";import{c as T,d as E,f as D,i as ae,o as O,r as k,s as A,u as j}from"./lit-CZC2goWk.js";import{n as oe}from"./react-vendor-C9pfoLkf.js";import{c as se,i as ce,l as le,n as ue,r as de,t as fe,u as M}from"./overlay-lifecycle-CAoT0LE8-CBN5bZNu.js";import{d as N,f as P,i as F,o as pe,p as I}from"./pk-select-UUH7FE4H-Ch4-Ctl5.js";import{r as me}from"./button-group-item.styles-G05d0DNI-Cpbf4iKz.js";import{i as he,n as L}from"./pk-dialog-CFU850OH-nQdAvPCj.js";var R=e(ie(),1);function*ge(e=document.activeElement){e!=null&&(yield e,`shadowRoot`in e&&e.shadowRoot&&e.shadowRoot.mode!==`closed`&&(yield*ge(e.shadowRoot.activeElement)))}var z=oe();function _e(e){return e?(Array.isArray(e)?e:Object.values(e)).filter(e=>Array.isArray(e)&&e.length>0):[]}function B(e){return e==null?``:String(e)}function ve({periodOptions:e,value:t,onChange:n,className:r,size:i,placeholder:a,clearable:o=!1}){let s=(0,R.useMemo)(()=>_e(e),[e]);return s.length===0?null:(0,z.jsx)(b,{className:r,value:t?B(t):``,placeholder:a,clearable:o,size:i,onPkChange:e=>{let t=e.detail?.value;if(t==null||t===``){n(null);return}let r=s.flat().find(e=>B(e.value)===B(t));r&&n(r.value)},onPkClear:()=>n(null),children:s.map((e,t)=>(0,z.jsxs)(R.Fragment,{children:[t>0?(0,z.jsx)(_,{}):null,e.map(e=>(0,z.jsx)(x,{value:B(e.value),disabled:e.disabled,children:e.label},B(e.value)))]},`period-group-${t}`))})}var ye=[me(),F,D`
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
    `],V=class extends i{constructor(...e){super(...e),this.open=!1,this.placement=`bottom`,this.sideOffset=4,this.flush=!1,this.withArrow=!1,this.for=``,this.anchor=null,this.triggerElement=null,this.closing=!1,this.panelAnimated=!1,this.triggerId=re(`pk-popover-trigger`),this.dismissRegistered=!1,this.syncingOpenSideEffects=!1,this.exitAnimationPromise=null,this.handleToggleClick=e=>{e.preventDefault(),e.stopPropagation(),!this.closing&&(this.open=!this.open)},this.onDocumentPointerDown=e=>{this.isPointerInside(e)||this.closing||this.closePopover(`light-dismiss`)},this.onDocumentKeyDown=e=>{e.key===`Escape`&&se(this)&&!this.closing&&(e.preventDefault(),e.stopPropagation(),this.closePopover(`escape`))}}static{this.styles=ye}get panelElement(){return this.popupElement?.getContentElement()??null}disconnectedCallback(){this.closePopover(`api`,!0),super.disconnectedCallback()}willUpdate(e){e.has(`open`)&&this.open===!1&&e.get(`open`)===!0&&!this.syncingOpenSideEffects&&!this.closing&&(this.closing=!0,this.panelAnimated=!1)}async updated(e){if(super.updated(e),!e.has(`open`)||this.syncingOpenSideEffects)return;let t=e.get(`open`);t!==this.open&&(t!==void 0||this.open!==!1)&&(this.open?await this.openPopover():await this.closePopover(`api`))}onTriggerSlotChange(e){let[t]=e.target.assignedElements({flatten:!0});this.unbindTrigger(this.triggerElement),this.triggerElement=t??null,this.bindTrigger(this.triggerElement)}bindTrigger(e){e&&(e.id||=this.triggerId,e.setAttribute(`aria-haspopup`,`dialog`),e.addEventListener(`click`,this.handleToggleClick),this.syncExpanded())}unbindTrigger(e){e?.removeEventListener(`click`,this.handleToggleClick)}async openPopover(){if(!this.getAnchor())return;if(this.exitAnimationPromise&&await this.exitAnimationPromise,this.dismissRegistered&&this.open){this.panelElement&&(this.panelElement.hidden=!1),this.syncExpanded();return}if(!this.dispatchEvent(new ce)){this.syncingOpenSideEffects=!0,this.open=!1,this.syncingOpenSideEffects=!1;return}this.syncingOpenSideEffects=!0,this.open=!0,this.syncingOpenSideEffects=!1,this.closing=!1,this.panelAnimated=!1,this.panelElement&&(this.panelElement.hidden=!1,P(this.panelElement,this.placement)),this.syncExpanded(),this.registerDismissHandlers(),await this.updateComplete;let e=await I(this.popupElement,this.placement);this.panelElement&&P(this.panelElement,e),this.panelAnimated=!0,this.dispatchEvent(new ue),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!0},bubbles:!0,composed:!0}))}async closePopover(e=`unknown`,t=!1){if(this.exitAnimationPromise)return this.exitAnimationPromise;if(!this.dismissRegistered&&!this.closing&&!this.open)return;let n=new de(e);if(!this.dispatchEvent(n)){this.syncingOpenSideEffects=!0,this.open=!0,this.syncingOpenSideEffects=!1,this.closing=!1,this.panelAnimated=!0;return}this.unregisterDismissHandlers(),this.closing=!0,this.panelAnimated=!1,this.open&&(this.syncingOpenSideEffects=!0,this.open=!1,this.syncingOpenSideEffects=!1);let r=async()=>{t||(await this.updateComplete,await this.waitForExitAnimation()),this.closing=!1,this.panelAnimated=!1,this.panelElement&&(this.panelElement.hidden=!0,this.panelElement.removeAttribute(`data-side`)),this.syncExpanded(),this.dispatchEvent(new fe),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!1},bubbles:!0,composed:!0}))};return this.exitAnimationPromise=r().finally(()=>{this.exitAnimationPromise=null}),this.exitAnimationPromise}waitForExitAnimation(){let e=this.panelElement;return e?new Promise(t=>{let n=!1,r=()=>{n||(n=!0,e.removeEventListener(`animationend`,i),window.clearTimeout(a),e.classList.remove(`closing`),t())},i=t=>{t.target===e&&t.animationName.startsWith(`pk-popup-content-out`)&&r()};e.classList.add(`closing`),e.addEventListener(`animationend`,i);let a=window.setTimeout(r,150)}):Promise.resolve()}getAnchor(){return this.anchor?this.anchor:this.for?N(this,this.for):this.triggerElement?this.triggerElement:null}registerDismissHandlers(){this.dismissRegistered||(le(this),this.dismissRegistered=!0,document.addEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.addEventListener(`keydown`,this.onDocumentKeyDown,!0))}unregisterDismissHandlers(){this.dismissRegistered&&=(M(this),!1),document.removeEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.onDocumentKeyDown,!0)}isPointerInside(e){return pe(e,{host:this,anchor:this.getAnchorElement(),panel:this.panelElement})}getAnchorElement(){return this.anchor instanceof HTMLElement?this.anchor:this.triggerElement?this.triggerElement:this.for?N(this,this.for):null}syncExpanded(){this.triggerElement?.setAttribute(`aria-expanded`,this.open?`true`:`false`)}render(){let e=this.getAnchor();return E`
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
                    class=${ae({panel:!0,"pk-popup-content":!0,closing:this.closing})}
                    ?hidden=${!this.open&&!this.closing}
                    data-open=${this.panelAnimated&&!this.closing?``:j}
                    tabindex=${this.open?`-1`:j}
                >
                    <slot></slot>
                </div>
            </pk-popup>
        `}};a([T({type:Boolean,reflect:!0})],V.prototype,`open`,void 0),a([T({reflect:!0})],V.prototype,`placement`,void 0),a([T({attribute:`side-offset`,type:Number})],V.prototype,`sideOffset`,void 0),a([T({type:Boolean,reflect:!0})],V.prototype,`flush`,void 0),a([T({attribute:`with-arrow`,type:Boolean,reflect:!0})],V.prototype,`withArrow`,void 0),a([T({reflect:!0})],V.prototype,`for`,void 0),a([T({attribute:!1})],V.prototype,`anchor`,void 0),a([O(`pk-popup`)],V.prototype,`popupElement`,void 0),a([A()],V.prototype,`triggerElement`,void 0),a([A()],V.prototype,`closing`,void 0),a([A()],V.prototype,`panelAnimated`,void 0),V=a([n(`pk-popover`)],V);var be=S({tagName:`pk-popover`,elementClass:V,react:R.default,events:{onPkShow:`pk-show`,onPkAfterShow:`pk-after-show`,onPkHide:`pk-hide`,onPkAfterHide:`pk-after-hide`,onPkOpenChange:`pk-open-change`}}),H=e=>{if(e)return t=>{v(t)&&e(t)}},U=R.forwardRef(function(e,t){let{open:n,flush:r,withArrow:i,onPkShow:a,onPkAfterShow:o,onPkHide:s,onPkAfterHide:c,onPkOpenChange:l,...u}=e;return(0,z.jsx)(be,{ref:t,...u,...n===void 0?{}:{open:n},...C([`flush`,`withArrow`],{flush:r,withArrow:i}),...a?{onPkShow:H(a)}:{},...o?{onPkAfterShow:H(o)}:{},...s?{onPkHide:H(s)}:{},...c?{onPkAfterHide:H(c)}:{},...l?{onPkOpenChange:H(l)}:{}})});U.displayName=`Popover`;function xe(e,t=5){let n=e?.response?.data;if(!n)return[];let r=[];n.file&&n.line&&r.push(`${n.file}:${n.line}`);let i=Array.isArray(n.trace)?n.trace:[];for(let e=0;e<Math.min(t,i.length);e++){let t=i[e];t?.file&&t?.line&&r.push(`${t.file}:${t.line}`)}return[...new Set(r)]}function Se(e){let t=y(e),n=xe(e);return{...t,traceAsArray:n,trace:n.join(`
`),traceAsString:n.join(`
`)}}function Ce(e){let t=e?.response?.data?.message||y(e)?.text||``;return typeof t==`string`&&t.includes(`needs to be reconnected`)?t:Craft.t(`metrix`,`Failed to fetch widget data. Please try again.`)}function we(e){let{inheritPeriod:t,period:n}=e?.data||{};return t==null?n==null:!!t}function Te(e,{refresh:t=!1}={}){let{globalPeriod:n}=f.getState(),r={id:e.data.id};return t&&(r.refresh=!0),n&&we(e)&&(r.globalPeriod=n),r}var W=d((e,t)=>{let n=new Map,r=new Map;return{widgets:[],collectionGeneration:0,fetchGeneration:0,loadWidgets:n=>{let r=n.map(e=>({...e,__id:p(),loading:!!e.data?.id,waitForData:!!e.data?.id}));e({widgets:r,collectionGeneration:t().collectionGeneration+1}),r.some(e=>e.data?.id)&&t().fetchAllWidgetData()},fetchAllWidgetData:async({refresh:n=!1}={})=>{let r=t().widgets.filter(e=>e.data?.id);r.length&&(e({fetchGeneration:t().fetchGeneration+1}),await Promise.allSettled(r.map(e=>t().fetchWidgetData(e.__id,{refresh:n}))))},fetchBatchWidgetData:async(e=!1)=>t().fetchAllWidgetData({refresh:e}),addWidget:t=>{let n={...t,__id:p()};e(e=>({widgets:[...e.widgets,n]}))},updateWidget:async(e,n,i=!0)=>{let a=t().widgets.find(t=>t.__id===e.__id);if(!a)return;let o=r.get(a.data.id);o||(o={promise:Promise.resolve(),requestId:0,savedData:a.data,fetchData:!1},r.set(a.data.id,o));let s=++o.requestId;o.fetchData||=i;let c=()=>o.requestId===s&&t().widgets.some(e=>e.__id===a.__id);t().updateWidgetState(a,{data:{...a.data,...n},loading:o.fetchData,error:null,...o.fetchData&&{waitForData:!0,requestId:null}});let l=o.promise.then(async()=>{try{let e=await m.post(`save-widget`,{id:a.data.id,widget:n});if(o.savedData={...o.savedData,...e.data},!c())return;t().updateWidgetState(a,{data:o.savedData,loading:!1,waitForData:!1}),o.fetchData&&t().fetchWidgetData(a.__id)}catch(e){if(!c())return;console.error(`Error updating widget:`,e),t().updateWidgetState(a,{data:o.savedData,loading:!1,waitForData:!1,error:{message:Craft.t(`metrix`,`Failed to update widget. Please try again.`),error:e}})}});o.promise=l,await l,o.promise===l&&r.delete(a.data.id)},removeWidget:async n=>{t().updateWidgetState(n,{loading:!0,error:null});try{await m.post(`delete-widget`,{id:n.data.id}),e(e=>({widgets:e.widgets.filter(e=>e.__id!==n.__id)}))}catch(e){console.error(`Error deleting widget:`,e),t().updateWidgetState(n,{loading:!1,error:{message:Craft.t(`metrix`,`Failed to delete widget. Please try again.`),error:e}})}},duplicateWidget:async n=>{let r=p(),i={...n,__id:r,data:{...n.data,id:null},loading:!0,waitForData:!0};e(e=>({widgets:[...e.widgets,i]}));try{let e=await m.post(`duplicate-widget`,{id:n.data.id});t().updateWidgetState(i,{data:{...i.data,...e.data},waitForData:!1}),await t().fetchWidgetData(r)}catch(n){if(console.error(`Error duplicating widget:`,n),!t().widgets.some(e=>e.__id===r))return;e(e=>({widgets:e.widgets.filter(e=>e.__id!==r)})),Craft.cp.displayError(Craft.t(`metrix`,`Failed to duplicate widget. Please try again.`))}},fetchWidgetData:async(e,{refresh:n=!1}={})=>{let r=t().widgets.find(t=>t.__id===e);if(!r){console.error(`Widget with id ${e} not found.`);return}let i=t().fetchGeneration,a=p(),o=()=>t().fetchGeneration===i&&t().widgets.find(t=>t.__id===e)?.requestId===a;t().updateWidgetState(r,{requestId:a,loading:!0,waitForData:!0,error:null});try{let e=Te(r,{refresh:n}),i=n?await m.post(`widget-data`,e):await m.get(`widget-data`,e);if(!o())return;t().updateWidgetState(r,{chartData:i.data,loading:!1,waitForData:!1})}catch(e){if(!o())return;t().updateWidgetState(r,{loading:!1,waitForData:!1,error:{message:Ce(e),error:e}})}},reorderWidgets:async(r,i)=>{let{widgets:a,collectionGeneration:o}=t(),s=f.getState().currentView,c=a.findIndex(e=>e.__id===r.__id),l=a.findIndex(e=>e.__id===i.__id);if(c===-1||l===-1){console.error(`Widget not found in the current list.`);return}let u=w(a,c,l);e({widgets:u});let d=n.get(s);d||(d={promise:Promise.resolve(),requestId:0,savedIds:a.map(e=>e.data.id)},n.set(s,d));let p=++d.requestId,h=u.map(e=>e.data.id).filter(Boolean),g=d.promise.then(async()=>{try{await m.post(`save-widget-order`,{ids:h}),d.savedIds=h}catch(n){if(p!==d.requestId||o!==t().collectionGeneration)return;console.error(`Error saving widget order:`,n);let r=new Map(d.savedIds.map((e,t)=>[e,t]));e(e=>({widgets:[...e.widgets].sort((e,t)=>(r.get(e.data.id)??1/0)-(r.get(t.data.id)??1/0))})),Craft.cp?.displayError?.(Craft.t(`metrix`,`Failed to save widget order. Please try again.`))}});d.promise=g,await g,d.promise===g&&n.delete(s)},refreshWidgetData:async e=>t().fetchWidgetData(e,{refresh:!0}),updateWidgetState:(t,n)=>{e(e=>({widgets:e.widgets.map(e=>e.__id===t.__id?{...e,...n}:e)}))},clearWidgets:()=>{e({widgets:[],collectionGeneration:t().collectionGeneration+1})}}}),G={default:D`
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
    `},Ee=D`
    @layer pk-component {
        :host {
            ${G.default}
        }

        :host([size='xs']) {
            ${G.xs}
        }

        :host([size='sm']) {
            ${G.sm}
        }

        :host([size='lg']) {
            ${G.lg}
        }

        :host([size='xl']) {
            ${G.xl}
        }
    }
`,K=D`
    @layer pk-component {
        .panel[data-size='default'],
        .submenu-panel[data-size='default'] {
            ${G.default}
        }

        .panel[data-size='xs'],
        .submenu-panel[data-size='xs'] {
            ${G.xs}
        }

        .panel[data-size='sm'],
        .submenu-panel[data-size='sm'] {
            ${G.sm}
        }

        .panel[data-size='lg'],
        .submenu-panel[data-size='lg'] {
            ${G.lg}
        }

        .panel[data-size='xl'],
        .submenu-panel[data-size='xl'] {
            ${G.xl}
        }
    }
`;D`
    ${Ee}
    ${K}
`;var De=[F,K,D`
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
`],q,Oe=t(r),ke=t(s),J=class extends i{static{q=this}constructor(...e){super(...e),this.value=``,this.type=`normal`,this.radioGroup=``,this.disabled=!1,this.destructive=!1,this.checked=!1,this.submenuOpen=!1,this.active=!1,this.submenuAnimated=!1,this.hasSlotController=new o(this,`submenu`,`details`,`start`,`prefix`),this.handleMouseEnter=()=>{this.hasSubmenu()&&!this.disabled&&(this.notifyParentOfOpening(),this.submenuOpen=!0)},this.handleHostClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}}static{this.styles=De}connectedCallback(){super.connectedCallback(),this.syncRole(),this.syncSubmenuAria(),this.addEventListener(`click`,this.handleHostClick),this.addEventListener(`mouseenter`,this.handleMouseEnter)}disconnectedCallback(){this.removeEventListener(`click`,this.handleHostClick),this.removeEventListener(`mouseenter`,this.handleMouseEnter),this.closeSubmenu(),super.disconnectedCallback()}updated(e){(e.has(`type`)||e.has(`checked`))&&this.syncRole(),(e.has(`submenuOpen`)||e.size===0)&&this.syncSubmenuAria(),e.has(`submenuOpen`)&&(this.submenuOpen?this.ensureSubmenuSurface():this.submenuAnimated=!1)}hasSubmenu(){return this.hasSlotController.test(`submenu`)}syncSubmenuAria(){let e=this.hasSubmenu();e?this.setAttribute(`aria-haspopup`,`menu`):this.removeAttribute(`aria-haspopup`),this.setAttribute(`aria-expanded`,e&&this.submenuOpen?`true`:`false`)}focusControl(){this.shadowRoot?.querySelector(`.item`)?.focus({preventScroll:!0})}focus(e){let t=this.shadowRoot?.querySelector(`.item`);if(t){t.focus(e);return}super.focus(e)}get submenuElement(){return this.submenuPanelElement??null}closeSubmenu(){this.submenuAnimated=!1,this.submenuOpen=!1}openSubmenu(){this.hasSubmenu()&&!this.disabled&&this.isConnected&&(this.notifyParentOfOpening(),this.submenuOpen=!0)}notifyParentOfOpening(){this.dispatchEvent(new CustomEvent(`pk-submenu-open`,{bubbles:!0,composed:!0,detail:{item:this}}));let e=this.parentElement;if(e)for(let t of e.children)t!==this&&t instanceof q&&t.getAttribute(`slot`)===this.getAttribute(`slot`)&&t.submenuOpen&&(t.submenuOpen=!1)}ensureSubmenuSurface(){this.hasSubmenu()&&!this.disabled&&(this.submenuAnimated=!0,this.updateComplete.then(()=>{this.submenuOpen&&this.submenuPanelElement&&(this.submenuPanelElement.hidden=!1,P(this.submenuPanelElement,`right-start`),I(this.submenuPopupElement,`right-start`).then(e=>{P(this.submenuPanelElement,e)}))}))}syncRole(){if(this.type===`checkbox`){this.setAttribute(`role`,`menuitemcheckbox`),this.setAttribute(`aria-checked`,this.checked?`true`:`false`);return}if(this.type===`radio`){this.setAttribute(`role`,`menuitemradio`),this.setAttribute(`aria-checked`,this.checked?`true`:`false`);return}this.setAttribute(`role`,`menuitem`),this.removeAttribute(`aria-checked`)}handleClick(e){if(this.disabled){e.preventDefault(),e.stopImmediatePropagation();return}this.hasSubmenu()&&(e.preventDefault(),this.openSubmenu())}render(){let e=this.hasSubmenu(),t=this.type===`checkbox`||this.type===`radio`,n=this.hasSlotController.test(`start`)||this.hasSlotController.test(`prefix`);return E`
            <button
                part="item"
                type="button"
                class="item"
                ?disabled=${this.disabled}
                aria-disabled=${this.disabled?`true`:j}
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
                ${t?E`<span part="check" class="check" aria-hidden="true">${k(Oe)}</span>`:j}
                ${e?E`<span class="submenu-icon" aria-hidden="true">${k(ke)}</span>`:j}
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
                        data-size=${Ae(this)}
                        ?hidden=${!this.submenuOpen}
                        data-open=${this.submenuAnimated?``:j}
                        aria-orientation="vertical"
                    >
                        <slot name="submenu"></slot>
                    </div>
                </pk-popup>
            `:j}
        `}};a([T()],J.prototype,`value`,void 0),a([T({reflect:!0})],J.prototype,`type`,void 0),a([T({attribute:`radio-group`})],J.prototype,`radioGroup`,void 0),a([T({type:Boolean,reflect:!0})],J.prototype,`disabled`,void 0),a([T({type:Boolean,reflect:!0})],J.prototype,`destructive`,void 0),a([T({type:Boolean,reflect:!0})],J.prototype,`checked`,void 0),a([T({attribute:`submenu-open`,type:Boolean,reflect:!0})],J.prototype,`submenuOpen`,void 0),a([T({type:Boolean})],J.prototype,`active`,void 0),a([A()],J.prototype,`submenuAnimated`,void 0),a([O(`.submenu-panel`)],J.prototype,`submenuPanelElement`,void 0),a([O(`pk-popup`)],J.prototype,`submenuPopupElement`,void 0),J=q=a([n(`pk-dropdown-item`)],J);function Ae(e){let t=e.parentElement?.getAttribute(`data-size`);if(t===`xs`||t===`sm`||t==="default"||t===`lg`||t===`xl`)return t;let n=e.closest(`pk-dropdown-menu`)?.getAttribute(`size`);return n===`xs`||n===`sm`||n===`lg`||n===`xl`?n:`default`}var je=D`
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
`,Y=class extends i{static{this.styles=je}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`presentation`)}render(){return E`
            <div part="label" class="label">
                <slot></slot>
            </div>
        `}};Y=a([n(`pk-dropdown-label`)],Y);var Me=[me(),Ee,K,D`
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
    `],X=new Set,Z=class extends i{constructor(...e){super(...e),this.open=!1,this.size=`default`,this.placement=`bottom-start`,this.sideOffset=4,this.distance=4,this.skidding=0,this.for=``,this.userTypedQuery=``,this.userTypedTimeout=0,this.openSubmenuStack=[],this.openedByKeyboard=!1,this.triggerElement=null,this.handleMenuClick=e=>{let t=this.resolveMenuItem(e);if(t&&!t.disabled){if(t.hasSubmenu()){t.submenuOpen||(this.closeSiblingSubmenus(t),this.addToSubmenuStack(t),t.openSubmenu()),e.stopPropagation();return}this.makeSelection(t)}},this.handleSubmenuOpening=e=>{let t=e.detail?.item;t instanceof J&&(this.closeSiblingSubmenus(t),this.addToSubmenuStack(t))},this.handleGlobalMouseMove=e=>{let t=this.getCurrentSubmenuItem();if(!t?.submenuOpen||!t.submenuElement)return;let n=t.submenuElement,r=e.composedPath(),i=t.matches(`:hover`),a=!!n.matches(`:hover`),o=i||r.some(e=>e===t),s=a||r.some(e=>e instanceof HTMLElement&&e.closest(`[part="submenu"]`)===n);!o&&!s&&window.setTimeout(()=>{!i&&!a&&(t.submenuOpen=!1)},100)},this.handleTriggerClick=e=>{let t=this.getTrigger();t&&e.composedPath().includes(t)&&(e.preventDefault(),e.stopPropagation(),this.openedByKeyboard=!1,this.open=!this.open)},this.handleExternalTriggerClick=e=>{e.preventDefault(),e.stopPropagation(),this.openedByKeyboard=!1,this.open=!this.open},this.handleTriggerKeyDown=e=>{let t=this.getTrigger();t&&e.composedPath().includes(t)&&(this.open||(e.key===`ArrowDown`||e.key===`ArrowUp`)&&(e.preventDefault(),e.stopPropagation(),this.openedByKeyboard=!0,this.open=!0))},this.handleDocumentKeyDown=e=>{let t=this.isRtl();if(e.key===`Escape`&&this.open&&se(this)){e.preventDefault(),e.stopPropagation(),this.open=!1,this.getTrigger()?.focus({preventScroll:!0});return}if(!this.open)return;let n=[...ge()].find(e=>e.localName===`pk-dropdown-item`),r=n?.localName===`pk-dropdown-item`,i=this.getCurrentSubmenuItem(),a=!!i,o,s,c;a&&i?(o=this.getSubmenuItems(i),s=o.find(e=>e.active||e===n),c=s?o.indexOf(s):-1):(o=this.getItems(),s=o.find(e=>e.active||e===n),c=s?o.indexOf(s):-1);let l;if(e.key===`ArrowUp`&&(e.preventDefault(),e.stopPropagation(),l=c>0?o[c-1]:o[o.length-1]),e.key===`ArrowDown`&&(e.preventDefault(),e.stopPropagation(),l=c!==-1&&c<o.length-1?o[c+1]:o[0]),e.key===(t?`ArrowLeft`:`ArrowRight`)&&r&&s&&s.hasSubmenu()){e.preventDefault(),e.stopPropagation(),this.closeSiblingSubmenus(s),s.openSubmenu(),this.addToSubmenuStack(s),window.setTimeout(()=>{let e=this.getSubmenuItems(s);e.length>0&&this.setActiveItem(e,e[0])},0);return}if(e.key===(t?`ArrowRight`:`ArrowLeft`)&&a){e.preventDefault(),e.stopPropagation();let t=this.removeFromSubmenuStack();t&&(t.submenuOpen=!1,window.setTimeout(()=>{t.focus({preventScroll:!0}),t.active=!0,(t.slot===`submenu`&&t.parentElement instanceof J?this.getSubmenuItems(t.parentElement):this.getItems()).forEach(e=>{e!==t&&(e.active=!1)})},0));return}if((e.key===`Home`||e.key===`End`)&&(e.preventDefault(),e.stopPropagation(),l=e.key===`Home`?o[0]:o[o.length-1]),e.key===`Tab`){this.open=!1;return}if(e.key.length===1&&!(e.metaKey||e.ctrlKey||e.altKey)&&(e.key!==` `||this.userTypedQuery!==``)){window.clearTimeout(this.userTypedTimeout),this.userTypedTimeout=window.setTimeout(()=>{this.userTypedQuery=``},1e3),this.userTypedQuery+=e.key;let t=this.userTypedQuery.trim().toLowerCase();l=o.find(e=>(e.textContent||``).trim().toLowerCase().startsWith(t))}if(l){e.preventDefault(),e.stopPropagation(),this.setActiveItem(o,l);return}(e.key===`Enter`||e.key===` `&&this.userTypedQuery===``)&&r&&s&&(e.preventDefault(),e.stopPropagation(),s.hasSubmenu()?(this.closeSiblingSubmenus(s),s.openSubmenu(),this.addToSubmenuStack(s),window.setTimeout(()=>{let e=this.getSubmenuItems(s);e.length>0&&this.setActiveItem(e,e[0])},0)):this.makeSelection(s))},this.handleDocumentPointerDown=e=>{let t=e.composedPath(),n=this.getTrigger();t.some(e=>e===this||e===n)||(this.open=!1)}}static{this.styles=Me}get panelElement(){return this.menuElement??null}get popup(){return this.popupElement??null}connectedCallback(){super.connectedCallback(),this.addEventListener(`click`,this.handleTriggerClick,!0),this.addEventListener(`keydown`,this.handleTriggerKeyDown)}firstUpdated(){let e=()=>{if(this.for){this.resolveExternalTrigger();return}this.syncSlottedTrigger()};queueMicrotask(e),requestAnimationFrame(e)}disconnectedCallback(){window.clearTimeout(this.userTypedTimeout),this.removeEventListener(`click`,this.handleTriggerClick,!0),this.removeEventListener(`keydown`,this.handleTriggerKeyDown),this.unbindTrigger(this.triggerElement),this.triggerElement=null,this.closeAllSubmenus(),this.popupElement&&(this.popupElement.active=!1),this.menuElement?.classList.remove(`show`,`hide`),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove),M(this),X.delete(this),super.disconnectedCallback()}async updated(e){if(super.updated(e),e.has(`for`)&&this.resolveExternalTrigger(),e.has(`open`)&&this.syncTriggerExpanded(),!e.has(`open`))return;let t=e.get(`open`);t!==this.open&&(t!==void 0||this.open!==!1)&&(this.open?await this.showMenu():(this.closeAllSubmenus(),await this.hideMenu(`unknown`)))}getItems(e=!1){let t=(this.defaultSlot?.assignedElements({flatten:!0})??[]).filter(e=>e.localName===`pk-dropdown-item`);return e?t:t.filter(e=>!e.disabled)}getSubmenuItems(e,t=!1){let n=((e.shadowRoot?.querySelector(`slot[name="submenu"]`))?.assignedElements({flatten:!0})??[...e.children].filter(e=>e.getAttribute(`slot`)===`submenu`)).filter(e=>e.localName===`pk-dropdown-item`);return t?n:n.filter(e=>!e.disabled)}getTrigger(){return this.for?N(this,this.for)??this.triggerElement:this.querySelector(`[slot="trigger"]`)??this.triggerElement}getAnchor(){return this.getTrigger()??``}resolveExternalTrigger(){this.unbindTrigger(this.triggerElement),this.triggerElement=this.for?N(this,this.for):null,this.bindTrigger(this.triggerElement),this.requestUpdate()}onTriggerSlotChange(e){if(this.for)return;let[t]=e.target.assignedElements({flatten:!0});this.unbindTrigger(this.triggerElement),this.triggerElement=t??null,this.bindTrigger(this.triggerElement),this.requestUpdate()}syncSlottedTrigger(){let e=this.renderRoot.querySelector(`slot[name="trigger"]`);e&&this.onTriggerSlotChange({target:e})}bindTrigger(e){e&&(e.setAttribute(`aria-haspopup`,`menu`),this.for&&(e.addEventListener(`click`,this.handleExternalTriggerClick),e.addEventListener(`keydown`,this.handleTriggerKeyDown)),this.syncTriggerExpanded())}unbindTrigger(e){e?.removeEventListener(`click`,this.handleExternalTriggerClick),e?.removeEventListener(`keydown`,this.handleTriggerKeyDown)}syncTriggerExpanded(){this.getTrigger()?.setAttribute(`aria-expanded`,this.open?`true`:`false`)}closeAfterSelect(e=`api`){this.open=!1}makeSelection(e){let t=this.getTrigger();if(e.disabled)return;e.type===`checkbox`&&(e.checked=!e.checked),e.type===`radio`&&!e.checked&&(e.checked=!0);let n={value:e.value,type:e.type,checked:e.checked,radioGroup:e.radioGroup};e.dispatchEvent(new CustomEvent(`pk-select`,{detail:n,bubbles:!1,composed:!1,cancelable:!0}));let r=new CustomEvent(`pk-select`,{detail:n,bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(r),r.defaultPrevented||(this.open=!1,t?.focus({preventScroll:!0}))}resolveMenuItem(e){let t=e.target;if(t instanceof J)return t;if(t instanceof Element){let e=t.closest(`pk-dropdown-item`);if(e instanceof J)return e}return e.composedPath().find(e=>e instanceof J)??null}whenClosed(){return this.open?new Promise(e=>{this.addEventListener(`pk-after-hide`,()=>{this.popupElement.stop().then(()=>e())},{once:!0})}):this.popupElement?.active?this.popupElement.stop():Promise.resolve()}forceDismissCleanup(){this.open=!1,this.popupElement.active=!1,this.menuElement?.classList.remove(`show`,`hide`),this.closeAllSubmenus(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove),M(this),X.delete(this)}isRtl(){return getComputedStyle(this).direction===`rtl`}addToSubmenuStack(e){let t=this.openSubmenuStack.indexOf(e);t===-1?this.openSubmenuStack.push(e):this.openSubmenuStack=this.openSubmenuStack.slice(0,t+1)}removeFromSubmenuStack(){return this.openSubmenuStack.pop()}getCurrentSubmenuItem(){return this.openSubmenuStack.length>0?this.openSubmenuStack[this.openSubmenuStack.length-1]:void 0}closeAllSubmenus(){this.getItems(!0).forEach(e=>{e.submenuOpen=!1,e.active=!1}),this.openSubmenuStack=[]}closeSiblingSubmenus(e){let t=e.closest(`pk-dropdown-item:not([slot="submenu"])`);(t instanceof J?this.getSubmenuItems(t,!0):this.getItems(!0)).forEach(t=>{t!==e&&t.submenuOpen&&(t.submenuOpen=!1)}),this.openSubmenuStack.includes(e)||this.openSubmenuStack.push(e)}setActiveItem(e,t){e.forEach(e=>{e.active=e===t,e===t?e.setAttribute(`data-highlighted`,``):e.removeAttribute(`data-highlighted`)}),t.focus({preventScroll:!0}),t.scrollIntoView({block:`nearest`})}async showMenu(){if(!this.popupElement||!this.menuElement)return;this.for&&!this.triggerElement?.isConnected&&this.resolveExternalTrigger();let e=new ce;if(!this.dispatchEvent(e)){this.open=!1;return}if(this.popupElement.active&&(this.popupElement.active=!1,this.menuElement.classList.remove(`show`,`hide`),await this.updateComplete),X.forEach(e=>{e!==this&&(e.open=!1)}),this.popupElement.active=!0,this.open=!0,X.add(this),le(this),document.addEventListener(`keydown`,this.handleDocumentKeyDown),document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.addEventListener(`mousemove`,this.handleGlobalMouseMove),await this.updateComplete,await I(this.popupElement,this.placement,100,{requireEvent:!0}),!this.open){this.popupElement.active=!1,X.delete(this),M(this),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove);return}this.menuElement.classList.remove(`hide`),await L(this.menuElement,`show`);let t=this.getItems();t.length>0&&(this.openedByKeyboard?this.setActiveItem(t,t[0]):(t.forEach(e=>{e.active=!1,e.removeAttribute(`data-highlighted`)}),this.menuElement.focus({preventScroll:!0}))),this.openedByKeyboard=!1,this.dispatchEvent(new ue),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!0},bubbles:!0,composed:!0}))}async hideMenu(e){if(!this.popupElement||!this.menuElement)return;let t=new de(e);if(!this.dispatchEvent(t)){this.open=!0;return}this.open=!1,X.delete(this),M(this),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove),this.userTypedQuery=``,window.clearTimeout(this.userTypedTimeout),this.getItems(!0).forEach(e=>{e.active=!1,e.removeAttribute(`data-highlighted`)}),this.menuElement.classList.remove(`show`),await L(this.menuElement,`hide`),this.popupElement.active=!1,this.dispatchEvent(new fe),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!1},bubbles:!0,composed:!0}))}render(){let e=this.hasUpdated?this.popupElement?.active:this.open;return E`
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
        `}};a([T({type:Boolean,reflect:!0})],Z.prototype,`open`,void 0),a([T({reflect:!0})],Z.prototype,`size`,void 0),a([T({reflect:!0})],Z.prototype,`placement`,void 0),a([T({attribute:`side-offset`,type:Number})],Z.prototype,`sideOffset`,void 0),a([T({type:Number})],Z.prototype,`distance`,void 0),a([T({type:Number})],Z.prototype,`skidding`,void 0),a([T({reflect:!0})],Z.prototype,`for`,void 0),a([O(`slot:not([name])`)],Z.prototype,`defaultSlot`,void 0),a([O(`#menu`)],Z.prototype,`menuElement`,void 0),a([O(`pk-popup`)],Z.prototype,`popupElement`,void 0),Z=a([n(`pk-dropdown-menu`)],Z);var Q=class extends i{static{this.styles=D`
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
    `}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`separator`)}render(){return E`<hr part="base" />`}};Q=a([n(`pk-dropdown-separator`)],Q);var Ne=S({tagName:`pk-dropdown-menu`,elementClass:Z,react:R.default,events:{onPkSelect:`pk-select`,onPkShow:`pk-show`,onPkAfterShow:`pk-after-show`,onPkHide:`pk-hide`,onPkAfterHide:`pk-after-hide`,onPkOpenChange:`pk-open-change`}}),Pe=S({tagName:`pk-dropdown-item`,elementClass:J,react:R.default,events:{onPkSelect:`pk-select`,onPkSubmenuOpen:`pk-submenu-open`}});S({tagName:`pk-dropdown-label`,elementClass:Y,react:R.default});var Fe=S({tagName:`pk-dropdown-separator`,elementClass:Q,react:R.default}),Ie=Ne,$=Pe,Le=Fe;function Re({className:e,show:t,children:n}){return(0,z.jsx)(`div`,{className:g(`h-full`,t?`fade-enter-active`:`fade-enter`,e),children:t?n:null})}var ze=(0,R.lazy)(()=>c(()=>import(`./WidgetSettings-YTcYhs1j.js`).then(e=>({default:e.WidgetSettings})),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]),import.meta.url));function Be(e,t){if(!e?.fetchedAt)return null;let n=Math.max(0,Math.floor(t/1e3)-Number(e.fetchedAt)),r;if(n<45)r=Craft.t(`metrix`,`just now`);else if(n<3600){let e=Math.max(1,Math.round(n/60));r=Craft.t(`metrix`,`{n,plural,=1{# min ago} other{# mins ago}}`,{n:e})}else if(n<86400){let e=Math.max(1,Math.round(n/3600));r=Craft.t(`metrix`,`{n,plural,=1{# hour ago} other{# hours ago}}`,{n:e})}else{let e=Math.max(1,Math.round(n/86400));r=Craft.t(`metrix`,`{n,plural,=1{# day ago} other{# days ago}}`,{n:e})}return Craft.t(`metrix`,`Updated {age}`,{age:r})}function Ve({widget:e}){let t=W(e=>e.duplicateWidget),n=W(e=>e.updateWidget),r=W(e=>e.removeWidget),i=W(e=>e.refreshWidgetData),a=f(e=>e.periodOptions),o=f(e=>e.globalPeriod),s=f(e=>e.canManageViewLayouts),c=h(e=>e.getSettingsByType),[d,p]=(0,R.useState)(!1),[m,g]=(0,R.useState)(!1),[_,v]=(0,R.useState)(!1),[y,ne]=(0,R.useState)(Date.now),b=e.chartData?._meta?.fetchedAt;(0,R.useEffect)(()=>{if(!b)return;let e=setInterval(()=>ne(Date.now()),3e4);return()=>clearInterval(e)},[b]);let x=c(e.data.type,e.data.source)?.some(e=>e.name===`period`),S=we(e),re=S&&o?o:e.data.period,C=e.data.displayTitle||(e.data.dimensionLabel?`${e.data.dimensionLabel} - ${e.data.metricLabel}`:e.data.metricLabel),w=Be(e.chartData?._meta,y);return(0,z.jsxs)(`div`,{className:`flex flex-row items-start relative z-[10] gap-2`,children:[(0,z.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,z.jsx)(`div`,{className:`font-bold text-gray-600 truncate`,children:C}),e.data.subtitle?(0,z.jsx)(`div`,{className:`text-xs text-gray-500 truncate mt-0.5`,children:e.data.subtitle}):null,w?(0,z.jsx)(`div`,{className:`text-[11px] text-gray-400 truncate mt-0.5`,title:w,children:w}):null]}),(0,z.jsxs)(`div`,{className:`flex flex-row items-center flex-shrink-0 gap-1 metrix-widget-header-controls`,children:[s&&x&&(0,z.jsx)(ve,{className:`metrix-widget-period-select`,periodOptions:a,value:re,size:`xs`,onChange:t=>{t&&n(e,{period:t,inheritPeriod:!1})}}),(0,z.jsxs)(Ie,{className:`metrix-widget-header-menu`,open:d,placement:`bottom-end`,onPkOpenChange:e=>{p(!!(e.detail?.open??e.target?.open))},children:[(0,z.jsx)(u,{slot:`trigger`,type:`button`,variant:`default`,size:`xs`,className:`metrix-widget-menu-trigger`,"aria-label":Craft.t(`metrix`,`Widget actions`),children:(0,z.jsx)(l,{icon:`ellipsis-vertical`})}),s?(0,z.jsx)($,{value:`settings`,onPkSelect:()=>{setTimeout(()=>{g(!0)},100)},children:Craft.t(`metrix`,`Settings`)}):null,(0,z.jsx)($,{value:`refresh`,disabled:_||e.loading,onPkSelect:async()=>{v(!0);try{await i(e.__id)}finally{v(!1),p(!1)}},children:_?Craft.t(`metrix`,`Refreshing…`):Craft.t(`metrix`,`Refresh`)}),s&&x&&o&&!S?(0,z.jsx)($,{value:`use-dashboard-period`,onPkSelect:()=>{n(e,{inheritPeriod:!0}),p(!1)},children:Craft.t(`metrix`,`Use dashboard date range`)}):null,s?(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)($,{value:`duplicate`,onPkSelect:()=>{t(e)},children:Craft.t(`metrix`,`Duplicate`)}),(0,z.jsxs)(`div`,{className:`metrix-widget-menu-width-row`,children:[(0,z.jsx)(`span`,{className:`metrix-widget-menu-width-row__label`,children:Craft.t(`metrix`,`Column Size`)}),(0,z.jsx)(ee,{value:e.data.width,onChange:t=>{n(e,{width:t},!1),p(!1)}})]}),(0,z.jsx)(Le,{}),(0,z.jsx)($,{value:`delete`,destructive:!0,onPkSelect:()=>{window.confirm(Craft.t(`metrix`,`Are you sure you want to delete this widget? This action cannot be undone.`))&&r(e)},children:Craft.t(`metrix`,`Delete`)})]}):null]}),s?(0,z.jsx)(te,{className:`metrix-widget-settings-dialog`,open:m,label:Craft.t(`metrix`,`Widget Settings`),onPkOpenChange:e=>{g(!!e.detail?.open)},children:m?(0,z.jsx)(R.Suspense,{fallback:(0,z.jsx)(`div`,{role:`status`,children:Craft.t(`metrix`,`Loading…`)}),children:(0,z.jsx)(ze,{widget:e,onClose:()=>g(!1)})}):null}):null]})]})}function He({className:e}){return(0,z.jsx)(`div`,{className:g(`pointer-events-none`,`flex-1 absolute inset-0 w-full h-full flex flex-col justify-center`,e),children:(0,z.jsx)(ne,{size:`md`,centered:!0})})}var Ue=S({tagName:`pk-copy-button`,elementClass:he,react:R.default,events:{onPkCopy:`pk-copy`,onPkCopyError:`pk-copy-error`}}),We=()=>(0,z.jsxs)(`svg`,{xmlns:`http://www.w3.org/2000/svg`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,className:`size-4`,"aria-hidden":`true`,children:[(0,z.jsx)(`rect`,{width:`8`,height:`4`,x:`8`,y:`2`,rx:`1`,ry:`1`}),(0,z.jsx)(`path`,{d:`M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`})]});function Ge({error:e,className:t}){let n=e?.error?Se(e.error):null,r=n?.traceAsArray??[],i=e?.message||Craft.t(`metrix`,`Failed to fetch widget data. Please try again.`),a=[n?.text,r.length?r.join(`
`):``].filter(Boolean).join(`

`),o=n?[n.heading,a].filter(Boolean).join(`

`):``;return(0,z.jsxs)(`div`,{className:g(`flex-1 absolute z-[1] pt-10 px-4 inset-0 w-full h-full flex flex-col justify-center`,t),children:[(0,z.jsx)(`div`,{className:`text-center text-error`,children:i}),n&&a&&(0,z.jsx)(`div`,{className:`text-center`,children:(0,z.jsxs)(U,{placement:`bottom`,flush:!0,className:`metrix-widget-error-popover z-[100]`,children:[(0,z.jsx)(u,{slot:`trigger`,type:`button`,variant:`outline`,size:`xs`,className:`mt-2 text-[11px] px-2 py-0.5`,children:Craft.t(`metrix`,`Details`)}),(0,z.jsxs)(`div`,{className:`metrix-widget-error-details`,children:[(0,z.jsx)(Ue,{value:o,variant:`transparent`,className:`metrix-widget-error-copy`,children:(0,z.jsx)(`span`,{slot:`icon`,children:(0,z.jsx)(We,{})})}),n.heading&&(0,z.jsx)(`strong`,{className:`block mb-2 text-left`,children:n.heading}),(0,z.jsx)(`pre`,{className:`metrix-widget-error-pre`,children:a})]})]})})]})}function Ke({error:e,className:t}){return(0,z.jsx)(`div`,{className:g(`pointer-events-none`,`flex-1 absolute inset-0 w-full h-full flex flex-col justify-center`,t),children:(0,z.jsx)(`div`,{className:`mx-auto text-gray-550`,children:Craft.t(`metrix`,`No data available.`)})})}function qe({widget:e,afterFetchData:t,renderContent:n,className:r}){let{realtimeInterval:i}=f(),{fetchWidgetData:a}=W(),{__id:o,loading:s,error:c,data:l,waitForData:u,chartData:d}=e;return(0,R.useEffect)(()=>{u||d||c||!l.id||a(o).then(e=>{t&&t(e)})},[o,l.id,l.type,u,d,c,a,t]),(0,R.useEffect)(()=>{if(l.type!==`verbb\\metrix\\widgets\\Realtime`||c||u)return;let e=setInterval(()=>{a(o).then(e=>{t&&t(e)})},i);return()=>clearInterval(e)},[o,l.period,u,a,t,i,c]),(0,z.jsxs)(`div`,{className:g(`pane group flex h-full flex-col`,r),children:[(0,z.jsx)(Ve,{widget:e}),(0,z.jsxs)(`div`,{className:`relative flex min-h-0 flex-1 flex-col`,children:[s&&(0,z.jsx)(He,{}),c&&(0,z.jsx)(Ge,{error:c}),(0,z.jsx)(Re,{className:`flex min-h-0 flex-1 flex-col`,show:!s&&!c,children:d?.rows?.length?(0,z.jsx)(`div`,{className:`flex min-h-0 flex-1 flex-col`,children:n(d)},l.type):(0,z.jsx)(Ke,{})})]})]})}export{U as a,W as i,$ as n,ve as o,Ie as r,_e as s,qe as t};
//# sourceMappingURL=Widget-7RSvNVq9.js.map