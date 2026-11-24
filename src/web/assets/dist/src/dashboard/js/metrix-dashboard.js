const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["../../../assets/WidgetSettings-BL5w9u-Q.js","../../../assets/rolldown-runtime-XKyaHtl9.js","../../../assets/useWidgetSettingsStore-DFfEQ6hy.js","../../../assets/has-slot-DJv86HKx-BcQ9P2Se.js","../../../assets/lit-DcdfZI5D.js","../../../assets/preload-helper-C5jdQSav.js","../../../assets/dndkit-DTpH6xrR.js","../../../assets/react-vendor-CyP0uUi7.js","../../../assets/pk-button-Dzt2a5Nc-g-PTjhTA.js","../../../assets/icon.styles-KWvfi7RV-C6U-91w2.js","../../../assets/button-group-item.styles-D7tuu-sr-Z5j8GzwZ.js","../../../assets/translate-Bxe4lWga.js","../../../assets/supports-popover-BCqyOPtO-BVBIY4Jg.js","../../../assets/useWidgetSettingsStore-Yh-lqTwb.css","../../../assets/MetrixConfig-DbiOpQJ6.js","../../../assets/forms-Bp9cJWca.js","../../../assets/Field-BzMQLv6d.js","../../../assets/pk-form-associated-element-Doh2K3pG-gVxh4bRb.js","../../../assets/mirror-validator-BkZlEv1Z-BuTMKpbu.js","../../../assets/pk-clear-DHxP_2cm-BHgvcQ98.js","../../../assets/pk-dialog-CwDbc9sJ-DVsjMsgc.js","../../../assets/pk-select-k-9zcdRA-DnPwxidC.js","../../../assets/option-filter-BkKyBg8L-B_Q_uktm.js","../../../assets/pk-state-panel-BjL_ch5N-HJuANg-w.js","../../../assets/Widget-BP3fFCc5.js","../../../assets/useWidgetSettingsForm-CCnqzjtp.js"])))=>i.map(i=>d[i]);
import{r as e}from"../../../assets/rolldown-runtime-XKyaHtl9.js";import{_ as t,a as n,c as r,g as i,i as a,m as o,o as s,p as c,s as l,t as u,y as d}from"../../../assets/useWidgetSettingsStore-DFfEQ6hy.js";import{t as f}from"../../../assets/forms-Bp9cJWca.js";import{V as p,a as m,c as h,d as g,i as _,l as v,n as y,o as b,p as x,s as S,t as C,u as w}from"../../../assets/MetrixConfig-DbiOpQJ6.js";import{c as T,o as E,s as D,t as O}from"../../../assets/has-slot-DJv86HKx-BcQ9P2Se.js";import{a as k,r as A,t as j}from"../../../assets/preload-helper-C5jdQSav.js";import{a as M,c as N,d as P,i as F,l as I,o as L,p as R,r as ee,s as te,t as ne,u as re}from"../../../assets/dndkit-DTpH6xrR.js";import{c as ie,d as z,f as B,l as V,p as H}from"../../../assets/lit-DcdfZI5D.js";import{n as ae}from"../../../assets/react-vendor-CyP0uUi7.js";import{a as oe,c as se,i as ce,l as le,n as U,o as W,r as ue,s as de}from"../../../assets/Widget-BP3fFCc5.js";import"../../../assets/pk-state-panel-BjL_ch5N-HJuANg-w.js";import{t as fe}from"../../../assets/SelectInput-Q_0UMNyn.js";import"../../../assets/pk-input-OJU_0hYY-6_V86ifr.js";import{t as pe}from"../../../assets/WidgetLarge-C0j7Jidd.js";import{t as me}from"../../../assets/WidgetSmall-1IkiFTE4.js";var G=e(R(),1),K=ae(),he=(0,G.lazy)(()=>j(()=>import(`../../../assets/WidgetSettings-BL5w9u-Q.js`).then(e=>({default:e.WidgetSettings})),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]),import.meta.url));function q({open:e,onOpenChange:t}){let n=o(e=>e.newWidget);return(0,K.jsx)(h,{className:`metrix-widget-settings-dialog`,open:e,label:Craft.t(`metrix`,`Add New Widget`),onPkOpenChange:e=>{t(!!e.detail?.open)},children:e?(0,K.jsx)(G.Suspense,{fallback:(0,K.jsx)(`div`,{role:`status`,children:Craft.t(`metrix`,`Loading…`)}),children:(0,K.jsx)(he,{isNew:!0,newWidget:n,onClose:()=>t(!1)})}):null})}function ge({buttonSize:e}){let[t,n]=(0,G.useState)(!1);return o(e=>e.canManageViewLayouts)?(0,K.jsxs)(K.Fragment,{children:[(0,K.jsxs)(i,{type:`button`,variant:`default`,size:e,onClick:()=>n(!0),children:[(0,K.jsx)(d,{slot:`start`,icon:`plus`}),Craft.t(`metrix`,`New widget`)]}),(0,K.jsx)(q,{open:t,onOpenChange:n})]}):null}var J=e=>new URLSearchParams(window.location.search).get(e),_e=(e,t,{replace:n=!1}={})=>{let r=new URLSearchParams(window.location.search);r.set(e,t);let i=`${window.location.pathname}?${r.toString()}${window.location.hash}`;window.history[n?`replaceState`:`pushState`]({},``,i)},ve=(e,t=[])=>t.some(t=>t.value===e)?e:t[0]?.value,ye=()=>(0,K.jsx)(`svg`,{xmlns:`http://www.w3.org/2000/svg`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`3`,className:`size-4`,"aria-hidden":`true`,children:(0,K.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M6 18 18 6M6 6l12 12`})}),be=({widget:e,handleWidthChange:n,handleRemove:r,dragHandleProps:i=null,className:a})=>(0,K.jsxs)(`div`,{className:t(`metrix-layout-settings-row flex items-start gap-2`,a),children:[(0,K.jsx)(`div`,{className:`shrink-0 text-gray-400`,children:e.component?.meta?.icon&&(0,K.jsx)(d,{icon:e.component.meta.icon,className:`size-5`})}),(0,K.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,K.jsxs)(`div`,{className:`text-sm font-medium leading-tight`,children:[e.data.dimensionLabel&&`${e.data.dimensionLabel} - `,e.data.metricLabel]}),(0,K.jsxs)(`div`,{className:`text-xs font-medium text-gray-400`,children:[e.component?.meta?.name||Craft.t(`metrix`,`Widget type unavailable`),` - `,e.data.periodLabel]})]}),(0,K.jsxs)(`div`,{className:`metrix-layout-settings-row__actions`,children:[(0,K.jsx)(m,{value:e.data.width,onChange:n}),(0,K.jsx)(`button`,{type:`button`,className:`metrix-layout-settings-row__btn metrix-layout-settings-row__btn--drag`,title:Craft.t(`metrix`,`Drag to reorder`),"aria-label":Craft.t(`metrix`,`Drag to reorder`),...i,children:(0,K.jsx)(d,{icon:`grip-move`,className:`size-4`})}),(0,K.jsx)(`button`,{type:`button`,className:`metrix-layout-settings-row__btn metrix-layout-settings-row__btn--danger`,title:Craft.t(`metrix`,`Remove Widget`),"aria-label":Craft.t(`metrix`,`Remove Widget`),onClick:r,children:(0,K.jsx)(ye,{})})]})]}),xe=({widget:e,handleWidthChange:n,handleRemove:r})=>{let{attributes:i,listeners:a,setNodeRef:o,transform:s,transition:c,isDragging:l}=ee({id:e.__id}),u={transform:P.Translate.toString(s),transition:c};return(0,K.jsx)(`div`,{ref:o,style:u,className:t(`metrix-layout-settings-sortable`,l&&`metrix-layout-settings-sortable--dragging`),children:(0,K.jsx)(be,{widget:e,handleWidthChange:n,handleRemove:r,dragHandleProps:{...i,...a}})})},Se=()=>{let e=o(e=>e.canManageViewLayouts),t=W(e=>e.widgets),n=W(e=>e.reorderWidgets),r=W(e=>e.updateWidget),a=W(e=>e.removeWidget),[s,c]=(0,G.useState)(!1),l=re(I(te,{activationConstraint:{delay:0,tolerance:5}}),I(L));if(!e)return null;let u=async({active:e,over:r})=>{if(e.id!==r?.id){let i=t.find(t=>t.__id===e.id),a=t.find(e=>e.__id===r?.id);i&&a&&await n(i,a)}},f=(e,t)=>{r(e,{width:t},!1)},p=e=>{window.confirm(Craft.t(`metrix`,`Are you sure you want to delete this widget? This action cannot be undone.`))&&a(e)};return(0,K.jsxs)(de,{open:s,placement:`left-start`,sideOffset:3,flush:!0,withArrow:!0,className:`metrix-layout-settings-popover`,onPkOpenChange:e=>{let t=!!(e.detail?.open??e.target?.open);c(t)},children:[(0,K.jsx)(i,{slot:`trigger`,type:`button`,variant:`default`,className:`metrix-layout-settings-trigger`,title:Craft.t(`metrix`,`Layout settings`),"aria-label":Craft.t(`metrix`,`Layout settings`),children:(0,K.jsx)(d,{icon:`gear`})}),(0,K.jsx)(`div`,{className:`metrix-layout-settings-panel`,children:s?(0,K.jsx)(M,{sensors:l,collisionDetection:N,modifiers:[S,b],onDragEnd:u,children:(0,K.jsx)(ne,{strategy:F,items:t.map(e=>e.__id),children:(0,K.jsx)(`div`,{className:`flex flex-col gap-4`,children:t.map(e=>(0,K.jsx)(xe,{widget:e,handleWidthChange:t=>f(e,t),handleRemove:()=>p(e)},e.__id))})})}):null})]})},Ce=({viewOptions:e,currentView:t,onChangeView:n,periodOptions:r,globalPeriod:i,onGlobalPeriodChange:a,showViewSelect:s,showHeaderActions:c,showGlobalPeriod:l})=>{let u=o(e=>e.canManageViewLayouts),d=le(r);return(0,K.jsxs)(`header`,{className:`flex items-center justify-between mb-4 gap-4`,children:[(0,K.jsxs)(`div`,{className:`flex items-center gap-4 min-w-0`,children:[(0,K.jsx)(`h1`,{className:`font-bold text-lg shrink-0`,title:Craft.t(`metrix`,`Dashboard`),children:Craft.t(`metrix`,`Dashboard`)}),s&&e.length>1&&(0,K.jsx)(fe,{className:`shrink-0`,options:e,value:t,onChange:n}),l&&d.length>0&&(0,K.jsx)(se,{className:`shrink-0`,periodOptions:r,value:i,placeholder:Craft.t(`metrix`,`Date range`),clearable:!0,onChange:a})]}),c&&u&&(0,K.jsxs)(`div`,{className:`flex gap-2 shrink-0`,children:[(0,K.jsx)(ge,{}),(0,K.jsx)(Se,{})]})]})},we=({widgets:e,loading:n})=>(0,K.jsx)(`div`,{className:t(`grid auto-rows-widgets gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`,n?`opacity-10`:``),children:e.map(e=>{let n=y(e.data?.type)??e.component,r=t(`col-span-1`,e.data.width===`2`?`lg:col-span-2`:``,e.data.width===`3`?`lg:col-span-3`:``);return n===null?``:(0,K.jsx)(G.Suspense,{fallback:(0,K.jsx)(`div`,{className:r,"aria-busy":`true`}),children:(0,K.jsx)(n,{widget:e,wrapperClassName:r})},e.__id)})}),Te=({slot:e,variant:t,loading:n,onPresetSelect:r,onNewWidget:a})=>{let s=o(e=>e.presets);return(0,K.jsxs)(ce,{slot:e,placement:`bottom-start`,children:[(0,K.jsx)(i,{slot:`trigger`,type:`button`,withCaret:!0,loading:n,disabled:n,...t?{variant:t}:{},children:Craft.t(`metrix`,`Add widgets`)}),s.length>0?(0,K.jsxs)(K.Fragment,{children:[(0,K.jsx)(ue,{children:Craft.t(`metrix`,`Presets`)}),s.map(e=>(0,K.jsx)(U,{value:e.value,onPkSelect:()=>r(e.value),children:e.label},e.value)),(0,K.jsx)(oe,{})]}):null,(0,K.jsx)(U,{value:`new-widget`,onPkSelect:a,children:Craft.t(`metrix`,`New widget`)})]})},Ee=e=>typeof Craft.getCpUrl==`function`?Craft.getCpUrl(e):Craft.getUrl(e),De=({errorPresets:e})=>{let t=e?.error?f(e.error):null;return t?(0,K.jsxs)(`div`,{className:`mt-6 text-error text-sm text-center w-full max-w-lg mx-auto leading-relaxed`,role:`alert`,children:[(0,K.jsx)(`strong`,{className:`block mb-1`,children:t.heading||Craft.t(`metrix`,`Unable to load preset.`)}),t.text?(0,K.jsx)(`span`,{className:`block text-gray-600`,children:t.text}):null]}):null},Y=({type:e,onPresetSelect:t,onNewWidget:n,loadingPresets:r,errorPresets:a})=>{let s=o(e=>e.canManageViewLayouts),c=o(e=>e.canManageSources);return e===`noSources`?(0,K.jsxs)(w,{heading:Craft.t(`metrix`,`No sources available`),children:[Craft.t(`metrix`,`Add and connect a source to see its data here.`),c?(0,K.jsx)(i,{slot:`actions`,variant:`primary`,href:Ee(`metrix/sources`),children:Craft.t(`metrix`,`Go to sources`)}):null]}):e===`noViewOptions`?(0,K.jsxs)(w,{heading:Craft.t(`metrix`,`No views available`),children:[s?Craft.t(`metrix`,`Configure views to display your widgets.`):Craft.t(`metrix`,`No dashboard views are available to you.`),s?(0,K.jsx)(i,{slot:`actions`,variant:`primary`,href:Ee(`metrix/views`),children:Craft.t(`metrix`,`Configure views`)}):null]}):(0,K.jsxs)(K.Fragment,{children:[(0,K.jsxs)(w,{heading:Craft.t(`metrix`,`No widgets yet`),children:[s?Craft.t(`metrix`,`Start adding widgets to see your data at a glance.`):Craft.t(`metrix`,`No widgets have been added to this view.`),s?(0,K.jsx)(Te,{slot:`actions`,variant:`primary`,loading:r,onPresetSelect:t,onNewWidget:n}):null]}),(0,K.jsx)(De,{errorPresets:a})]})},Oe=H`
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`,ke=H`
    @layer pk-component {
        :host {
            display: block;
            container-type: inline-size;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
            color: var(--pk-color-gray-800);
            --pk-setup-checklist-padding: 1.5rem;
            --pk-setup-checklist-accent: var(--pk-color-gray-800);
            --pk-setup-checklist-done: var(--pk-color-emerald-600);
            --pk-setup-checklist-current-background: var(--pk-color-gray-50);
            --pk-setup-checklist-card-background: var(--pk-color-white);
            --pk-setup-checklist-card-shadow:
                0 0 0 1px color-mix(in srgb, var(--pk-color-gray-900) 10%, transparent),
                0 2px 12px -4px color-mix(in srgb, var(--pk-color-gray-900) 10%, transparent);
            --pk-setup-checklist-aside-width: 15rem;
        }

        .base {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            gap: 1.5rem;
            align-items: start;
        }

        @container (min-width: 48rem) {
            .base[data-aside] {
                grid-template-columns: minmax(0, 2fr) minmax(var(--pk-setup-checklist-aside-width), 1fr);
            }
        }

        .card {
            min-width: 0;
            box-sizing: border-box;
            padding: 1.25rem var(--pk-setup-checklist-padding);
            border-radius: var(--pk-radius-lg);
            background: var(--pk-setup-checklist-card-background);
            box-shadow: var(--pk-setup-checklist-card-shadow);
        }

        /* The last step's row sits flush with the card's bottom edge, so its highlight reaches the corners. */
        .checklist {
            padding-bottom: 0;
            overflow: hidden;
        }

        .header {
            display: flex;
            gap: 0.75rem;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 1rem;
        }

        .header-text {
            min-width: 0;
        }

        .heading {
            margin: 0;
            font-size: 1rem;
            font-weight: 700;
            line-height: 1.375;
        }

        .intro {
            margin-top: 0.25rem;
            color: var(--pk-color-gray-500);
        }

        .intro ::slotted(*) {
            margin: 0;
        }

        .count {
            flex: none;
            padding-top: 0.125rem;
            color: var(--pk-color-gray-500);
            font-size: var(--pk-font-size-sm);
            white-space: nowrap;
        }

        .steps {
            display: block;
            margin-inline: calc(-1 * var(--pk-setup-checklist-padding));
        }

        /* Inside a pane that is already a card, the checklist and aside drop their own cards. The steps still reach past
           the content by the padding, so the current step's highlight runs to the pane's edges. */
        :host([appearance='plain']) .card {
            padding: 0;
            border-radius: 0;
            background: none;
            box-shadow: none;
        }

        :host([appearance='plain']) .checklist {
            overflow: visible;
        }
    }
`,Ae=[Oe,H`
        @layer pk-component {
            :host {
                display: block;
                container-type: inline-size;
                padding-inline: var(--pk-setup-checklist-padding, 1.5rem);
                font-family: var(--pk-font-family);
                font-size: var(--pk-font-size-base);
                line-height: var(--pk-line-height);
                color: var(--pk-color-gray-800);
            }

            :host([current]) {
                background: var(--pk-setup-checklist-current-background, var(--pk-color-gray-50));
            }

            /* The marker and action line up with the heading's first line, so a tall step, such as one holding starter
               cards, keeps its number beside its heading. */
            .base {
                --_heading-line: calc(var(--pk-font-size-base) * var(--pk-line-height));
                display: grid;
                grid-template-columns: 1.5rem minmax(0, 1fr) auto;
                gap: 0.25rem 0.75rem;
                align-items: start;
                padding-block: 0.875rem;
                border-top: 1px solid color-mix(in srgb, var(--pk-color-gray-900) 10%, transparent);
            }

            .marker {
                display: grid;
                place-items: center;
                width: 1.5rem;
                height: 1.5rem;
                border-radius: 50%;
                background: var(--pk-color-gray-100);
                color: var(--pk-color-gray-600);
                margin-top: calc((var(--_heading-line) - 1.5rem) / 2);
                font-size: 0.75rem;
                font-weight: 600;
                font-variant-numeric: tabular-nums;
            }

            .marker svg {
                width: 0.875rem;
                height: 0.875rem;
                fill: none;
                stroke: currentColor;
                stroke-width: 3;
                stroke-linecap: round;
                stroke-linejoin: round;
            }

            :host([current]) .marker {
                background: var(--pk-setup-checklist-accent, var(--pk-color-gray-800));
                color: var(--pk-color-white);
            }

            :host([done]) .marker {
                background: var(--pk-setup-checklist-done, var(--pk-color-emerald-600));
                color: var(--pk-color-white);
            }

            .body {
                min-width: 0;
            }

            .heading {
                font-weight: 600;
            }

            :host([done]) .heading-text {
                color: var(--pk-color-gray-500);
                text-decoration: line-through;
            }

            .description {
                margin-top: 0.125rem;
                color: var(--pk-color-gray-500);
            }

            .description ::slotted(*) {
                margin: 0;
            }

            .snippet {
                margin-top: 0.625rem;
            }

            .snippet pk-input {
                display: block;
            }

            /* Matches a read-only pk-input, with room on the right for the copy button in the corner. */
            .snippet--block {
                position: relative;
            }

            pre {
                box-sizing: border-box;
                margin: 0;
                padding: 0.5rem 2.5rem 0.5rem 0.75rem;
                overflow-x: auto;
                border: 1px solid var(--pk-color-gray-200);
                border-radius: var(--pk-radius-md);
                background: var(--pk-color-white);
                color: var(--pk-color-gray-800);
                font-family: var(--pk-font-family-mono);
                font-size: var(--pk-font-size-mono);
                line-height: 1.5;
                white-space: pre;
            }

            .snippet--block .copy {
                position: absolute;
                top: 0.25rem;
                right: 0.25rem;
            }

            .actions {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: flex-end;
            }

            /* In a narrow card the action drops under the description instead of squeezing it. */
            @container (max-width: 30rem) {
                .base {
                    grid-template-columns: 1.5rem minmax(0, 1fr);
                }

                .actions {
                    grid-column: 2;
                    justify-content: flex-start;
                }
            }
        }
    `],je=B`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>`,X=class extends E{constructor(...e){super(...e),this.hasSlotController=new O(this,`action`,`change`),this.heading=``,this.done=!1,this.snippet=``,this.position=0,this.current=!1,this.headingLevel=3,this.doneLabel=`(done)`,this.copyLabel=`Copy`,this.copiedLabel=`Copied`,this.handleActionSlotChange=()=>{this.dispatchEvent(new Event(`pk-setup-step-update`,{bubbles:!0,composed:!1}))}}static{this.styles=Ae}connectedCallback(){super.connectedCallback(),this.hasAttribute(`role`)||this.setAttribute(`role`,`listitem`)}updated(e){e.has(`current`)&&(this.current?this.setAttribute(`aria-current`,`step`):this.removeAttribute(`aria-current`)),e.has(`done`)&&this.dispatchEvent(new Event(`pk-setup-step-update`,{bubbles:!0,composed:!1}))}renderSnippet(){if(this.done||!this.snippet)return z;let e=e=>B`<pk-copy-button
            slot=${e??z}
            class="copy"
            .value=${this.snippet}
            aria-label=${this.copyLabel}
            copied-label=${this.copiedLabel}
        ></pk-copy-button>`;return this.snippet.includes(`
`)?B`
            <div part="snippet" class="snippet snippet--block">
                <pre aria-label=${this.heading}><code>${this.snippet}</code></pre>
                ${e()}
            </div>
        `:B`
                <div part="snippet" class="snippet">
                    <pk-input readonly mono .value=${this.snippet} aria-label=${this.heading}>${e(`end`)}</pk-input>
                </div>
            `}renderActions(){let e=this.done?`change`:`action`;return this.hasSlotController.test(e)?B`<div part="actions" class="actions"><slot name=${e} @slotchange=${this.handleActionSlotChange}></slot></div>`:z}render(){return B`
            <div part="base" class="base">
                <span part="marker" class="marker" aria-hidden="true">${this.done?je:this.position||z}</span>
                <div part="body" class="body">
                    <div part="heading" class="heading" role="heading" aria-level=${this.headingLevel}>
                        <span class="heading-text">${this.heading}</span>${this.done?B`<span class="sr-only"> ${this.doneLabel}</span>`:z}
                    </div>
                    <div part="description" class="description"><slot></slot></div>
                    ${this.renderSnippet()}
                </div>
                ${this.renderActions()}
            </div>
        `}};D([V()],X.prototype,`heading`,void 0),D([V({type:Boolean,reflect:!0})],X.prototype,`done`,void 0),D([V()],X.prototype,`snippet`,void 0),D([V({type:Number,reflect:!0})],X.prototype,`position`,void 0),D([V({type:Boolean,reflect:!0})],X.prototype,`current`,void 0),D([V({type:Number,attribute:`heading-level`})],X.prototype,`headingLevel`,void 0),D([V({attribute:`done-label`})],X.prototype,`doneLabel`,void 0),D([V({attribute:`copy-label`})],X.prototype,`copyLabel`,void 0),D([V({attribute:`copied-label`})],X.prototype,`copiedLabel`,void 0),X=D([T(`pk-setup-step`)],X);var Z=`data-pk-setup-primary`;function Me(e){let t=`pk-button, .btn, button`;return e.matches(t)?e:e.querySelector(t)}var Q=class extends E{constructor(...e){super(...e),this.hasSlotController=new O(this,`intro`,`aside`),this.headingId=A(`pk-setup-checklist-heading`),this.heading=``,this.headingLevel=2,this.countLabel=`{done} of {total} done`,this.doneLabel=`(done)`,this.copyLabel=`Copy`,this.copiedLabel=`Copied`,this.primaryAction=`current`,this.primaryClass=`submit`,this.appearance=`card`,this.steps=[],this.handleStepUpdate=()=>{this.requestUpdate()}}static{this.styles=ke}get doneCount(){return this.steps.filter(e=>e.done).length}get currentPosition(){return this.steps.findIndex(e=>!e.done)+1}connectedCallback(){super.connectedCallback(),this.addEventListener(`pk-setup-step-update`,this.handleStepUpdate),this.collectSteps()}disconnectedCallback(){this.removeEventListener(`pk-setup-step-update`,this.handleStepUpdate),super.disconnectedCallback()}collectSteps(){this.steps=[...this.children].filter(e=>e instanceof X)}willUpdate(){let e=this.currentPosition,t=Math.min(this.headingLevel+1,6);this.steps.forEach((n,r)=>{n.position=r+1,n.current=r+1===e,n.headingLevel=t,n.doneLabel=this.doneLabel,n.copyLabel=this.copyLabel,n.copiedLabel=this.copiedLabel})}updated(){this.syncPrimaryAction()}syncPrimaryAction(){this.steps.forEach(e=>{let t=this.primaryAction===`current`&&e.current&&!e.done;for(let n of e.querySelectorAll(`:scope > [slot="action"]`)){let e=Me(n);if(!e)continue;let r=e.hasAttribute(Z);if(t&&!r)e.localName===`pk-button`?(e.setAttribute(Z,e.getAttribute(`variant`)??``),e.setAttribute(`variant`,`primary`)):e.classList.contains(this.primaryClass)||(e.setAttribute(Z,``),e.classList.add(this.primaryClass));else if(!t&&r){if(e.localName===`pk-button`){let t=e.getAttribute(Z);t?e.setAttribute(`variant`,t):e.removeAttribute(`variant`)}else e.classList.remove(this.primaryClass);e.removeAttribute(Z)}}})}renderCount(){if(!this.steps.length)return z;let e=this.countLabel.replaceAll(`{done}`,String(this.doneCount)).replaceAll(`{total}`,String(this.steps.length));return B`<span part="count" class="count">${e}</span>`}render(){let e=this.hasSlotController.test(`aside`);return B`
            <div part="base" class="base" ?data-aside=${e}>
                <section part="card" class="card checklist" aria-labelledby=${this.headingId}>
                    <div part="header" class="header">
                        <div class="header-text">
                            <div part="heading" class="heading" id=${this.headingId} role="heading" aria-level=${this.headingLevel}>${this.heading}</div>
                            ${this.hasSlotController.test(`intro`)?B`<div part="intro" class="intro"><slot name="intro"></slot></div>`:z}
                        </div>
                        ${this.renderCount()}
                    </div>
                    <div part="steps" class="steps" role="list" aria-labelledby=${this.headingId}>
                        <slot @slotchange=${this.collectSteps}></slot>
                    </div>
                </section>
                ${e?B`<div part="aside" class="card aside"><slot name="aside"></slot></div>`:z}
            </div>
        `}};D([V()],Q.prototype,`heading`,void 0),D([V({type:Number,attribute:`heading-level`})],Q.prototype,`headingLevel`,void 0),D([V({attribute:`count-label`})],Q.prototype,`countLabel`,void 0),D([V({attribute:`done-label`})],Q.prototype,`doneLabel`,void 0),D([V({attribute:`copy-label`})],Q.prototype,`copyLabel`,void 0),D([V({attribute:`copied-label`})],Q.prototype,`copiedLabel`,void 0),D([V({attribute:`primary-action`,reflect:!0})],Q.prototype,`primaryAction`,void 0),D([V({attribute:`primary-class`})],Q.prototype,`primaryClass`,void 0),D([V({reflect:!0})],Q.prototype,`appearance`,void 0),D([ie()],Q.prototype,`steps`,void 0),Q=D([T(`pk-setup-checklist`)],Q);var Ne=k({tagName:`pk-setup-checklist`,elementClass:Q,react:G.default}),Pe=k({tagName:`pk-setup-step`,elementClass:X,react:G.default,events:{onPkCopy:`pk-copy`,onPkCopyError:`pk-copy-error`}}),Fe=Ne,$=Pe,Ie=e=>typeof Craft.getCpUrl==`function`?Craft.getCpUrl(e):Craft.getUrl(e),Le=({setup:e,loadingPresets:t,onPresetSelect:n,onNewWidget:r})=>{let a=o(e=>e.sources),s=o(e=>e.viewOptions),c=o(e=>e.canManageViewLayouts),{source:l,connect:u,widgets:d}=e,f=c&&a.length>0&&s.length>0,p=c&&s.length===0,m=!l.done&&!e.canManageSources||!u.done&&!e.canConnectSources||!c,h=u.sourceName?Craft.t(`metrix`,`Connect “{name}” so Metrix can read its data.`,{name:u.sourceName}):Craft.t(`metrix`,`Sign in to the service or check its API credentials so Metrix can read its data.`);return(0,K.jsxs)(Fe,{heading:Craft.t(`metrix`,`Build Your Analytics Dashboard`),countLabel:Craft.t(`metrix`,`{done} of {total} done`),doneLabel:Craft.t(`metrix`,`(done)`),children:[(0,K.jsxs)(`span`,{slot:`intro`,children:[Craft.t(`metrix`,`Your widgets will show here. Each step ticks itself off when Metrix sees it done.`),m?` ${Craft.t(`metrix`,`Someone who can manage Metrix sources and dashboard layouts can finish these steps.`)}`:null]}),(0,K.jsxs)($,{heading:Craft.t(`metrix`,`Add a source`),done:l.done,children:[Craft.t(`metrix`,`Choose the analytics service Metrix reads from, such as Google Analytics, Plausible or Fathom.`),l.url?(0,K.jsx)(i,{slot:`action`,href:l.url,children:Craft.t(`metrix`,`New source`)}):null]}),(0,K.jsxs)($,{heading:Craft.t(`metrix`,`Connect your source`),done:u.done,children:[u.done?Craft.t(`metrix`,`Metrix can read data from your source.`):h,u.url?(0,K.jsx)(i,{slot:`action`,href:u.url,children:Craft.t(`metrix`,`Connect source`)}):null]}),(0,K.jsxs)($,{heading:Craft.t(`metrix`,`Add widgets or load a preset`),done:d.done,children:[Craft.t(`metrix`,`Start from a preset dashboard or add widgets one at a time.`),f?(0,K.jsx)(Te,{slot:`action`,loading:t,onPresetSelect:n,onNewWidget:r}):null,p?(0,K.jsx)(i,{slot:`action`,href:Ie(`metrix/views`),children:Craft.t(`metrix`,`Configure views`)}):null]})]})},Re=()=>{let e=W(e=>e.widgets),t=W(e=>e.loadWidgets),n=W(e=>e.clearWidgets),r=o(e=>e.viewOptions),i=o(e=>e.currentView),a=o(e=>e.setCurrentView),s=o(e=>e.globalPeriod),l=o(e=>e.setGlobalPeriod),u=o(e=>e.periodOptions),d=o(e=>e.sources),p=o(e=>e.setup),m=o(e=>e.setSetup),h=o(e=>e.canManageViewLayouts),g=W(e=>e.fetchAllWidgetData),[v,y]=(0,G.useState)(!1),[b,S]=(0,G.useState)(null),[C,w]=(0,G.useState)(!1),[T,E]=(0,G.useState)(null),[D,O]=(0,G.useState)(!1),k=(0,G.useRef)(0);(0,G.useEffect)(()=>{let e=J(`view`);if(r.length>0){let t=ve(e,r);a(t),e!==t&&_e(`view`,t,{replace:!0})}},[r,a]);let A=async e=>{let n=++k.current;w(!0),E(null);try{let{data:r}=await c.post(`apply-preset`,{view:i,preset:e});if(n!==k.current)return;let a=_(r);t(a)}catch(e){if(n!==k.current)return;console.error(`Failed to load preset widgets:`,e),E({message:Craft.t(`metrix`,`Failed to load preset widgets.`),error:e})}finally{n===k.current&&w(!1)}},j=e=>{l(e||null),g()},M=(0,G.useCallback)(async(e,r=!0)=>{let i=++k.current;a(e),l(null),w(!1),E(null),r&&_e(`view`,e),n(),y(!0),S(null);try{let{data:n}=await c.post(`widgets`,{view:e});if(i!==k.current)return;let r=_(n);t(r)}catch(e){if(i!==k.current)return;console.error(`Failed to load widgets:`,e),S({message:Craft.t(`metrix`,`Failed to load widgets.`),error:e})}finally{i===k.current&&y(!1)}},[a,l,n,t]);(0,G.useEffect)(()=>{let e=()=>{let e=ve(J(`view`),r);e&&e!==o.getState().currentView&&M(e,!1)};return window.addEventListener(`popstate`,e),()=>window.removeEventListener(`popstate`,e)},[r,M]);let N=e.length>0,P=r.length>0,F=d.length>0;(0,G.useEffect)(()=>{N&&p&&m(null)},[N,p,m]);let I=!!p&&!N&&(P||h),L=F&&P,R=L&&N;return(0,K.jsxs)(`div`,{className:`mx-auto max-w-screen-xl`,children:[(0,K.jsx)(Ce,{viewOptions:r,currentView:i,onChangeView:M,periodOptions:u,globalPeriod:s,onGlobalPeriodChange:j,showViewSelect:L,showHeaderActions:R,showGlobalPeriod:N}),(()=>{if(I)return(0,K.jsxs)(K.Fragment,{children:[(0,K.jsx)(Le,{setup:p,loadingPresets:C,onPresetSelect:A,onNewWidget:()=>O(!0)}),(0,K.jsx)(De,{errorPresets:T})]});if(!F)return(0,K.jsx)(Y,{type:`noSources`});if(!P)return(0,K.jsx)(Y,{type:`noViewOptions`});if(v)return(0,K.jsx)(`div`,{className:`w-full h-[50vh] flex items-center justify-center`,children:(0,K.jsx)(x,{size:`lg`,centered:!0})});if(b){let e=f(b?.error);return(0,K.jsxs)(`div`,{className:`w-full h-[50vh] flex items-center justify-center text-error text-lg text-center`,children:[(0,K.jsx)(`strong`,{className:`block mb-1`,children:e.heading}),(0,K.jsx)(`small`,{className:`block mb-1`,children:e.text}),(0,K.jsx)(`small`,{className:`block font-mono text-[9px] whitespace-nowrap overflow-auto`,children:e.traceAsArray.map(e=>(0,K.jsx)(`span`,{className:`block`,children:e},e))})]})}return N?(0,K.jsx)(we,{widgets:e,loading:v}):(0,K.jsx)(Y,{type:`noWidgets`,onPresetSelect:A,onNewWidget:()=>O(!0),loadingPresets:C,errorPresets:T})})(),h?(0,K.jsx)(q,{open:D,onOpenChange:O}):null]})};g(),s(`Metrix`),n(`Dashboard`,e=>{let t=a({containerSelector:`.metrix-dashboard`,pluginHandle:`metrix`,styleTexts:[p],missingContainerMessage:`Dashboard container not found: .metrix-dashboard`});if(!t)return;let{mountNode:n,portalContainer:i,targetContainer:s}=t,{loadWidgets:c}=W.getState(),{loadSettings:d}=u.getState(),{setNewWidget:f,setPeriodOptions:m,setViewOptions:h,setPresets:g,setSources:y,setRealtimeInterval:b,setGlobalPeriod:x,setCanManageViewLayouts:S,setCanManageSources:C,setSetup:w}=o.getState(),{widgets:T,widgetSettings:E,realtimeInterval:D,newWidget:O,periodOptions:k,viewOptions:A,presets:j,sources:M,canManageViewLayouts:N,canManageSources:P,setup:F}=e;c(_(T)),d(E),b(D),f(O),m(k),h(A),g(j),y(M),x(null),S(N),C(!!P),w(F??null),r({mountNode:n,portalContainer:i,shadowRootSelectors:t.shadowRootSelectors,children:(0,G.createElement)(v,{surface:`dashboard`},(0,G.createElement)(Re,{widgetStore:W}))}),l(s,`metrix-dashboard--ready`)}),Craft.Metrix.Config=new C,Craft.Metrix.SharedComponents={WidgetLarge:pe,WidgetSmall:me},document.dispatchEvent(new CustomEvent(`onMetrixConfigReady`,{bubbles:!0}));
//# sourceMappingURL=metrix-dashboard.js.map