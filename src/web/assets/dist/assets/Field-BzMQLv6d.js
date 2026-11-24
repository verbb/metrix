const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./markdown-f6D2S5dO.js","./rolldown-runtime-XKyaHtl9.js"])))=>i.map(i=>d[i]);
import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{c as t,i as n,n as r,o as i,r as a,s as o,t as s}from"./has-slot-DJv86HKx-BcQ9P2Se.js";import{a as c,i as l,r as u,t as d}from"./preload-helper-C5jdQSav.js";import{p as f}from"./dndkit-DTpH6xrR.js";import{a as p,d as m,f as h,i as g,l as _,o as v,p as y,s as b}from"./lit-DcdfZI5D.js";import{n as x}from"./react-vendor-CyP0uUi7.js";var S=e(f(),1),C=x(),w=y`
    @layer pk-component {
        .form-control {
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
            width: 100%;
        }

        .form-control__header {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
            min-width: 0;
        }

        .form-control__label {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            margin: 0;
            color: var(--pk-color-gray-700);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            font-weight: 700;
            line-height: var(--pk-line-height);
        }

        .form-control__instructions,
        .form-control__hint {
            margin: 0;
            color: var(--pk-color-gray-500);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        .form-control__instructions:empty,
        .form-control__hint:empty {
            display: none;
        }

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

        .form-control__input {
            display: flex;
            align-items: stretch;
            position: relative;
            width: 100%;
        }

        .form-control__start,
        .form-control__end {
            display: inline-flex;
            align-items: center;
            flex-shrink: 0;
        }

        .form-control__start {
            margin-inline-end: 6px;
        }

        .form-control__end {
            margin-inline-start: 6px;
        }

        .icon-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 0;
            border: 0;
            background: transparent;
            color: var(--pk-color-gray-500);
            cursor: pointer;
            line-height: 0;
        }

        .icon-button:focus-visible {
            outline: none;
            box-shadow: var(--pk-shadow-focus);
            border-radius: var(--pk-radius-sm);
        }

        .icon-button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
    }
`,T=y`
    @layer pk-component {
        .pk-inline-markdown a {
            color: var(--pk-color-blue-500);
            text-decoration: none;
        }

        .pk-inline-markdown a:hover {
            text-decoration: underline;
        }

        /* Craft p code — gray chip; tip/warning/error override bg/border on pk-field. */
        .pk-inline-markdown code {
            /* Craft --border-hairline ≈ gray-800 @ 10%. */
            border: 1px solid color-mix(in srgb, var(--pk-color-gray-800) 10%, transparent);
            border-radius: var(--pk-radius-sm);
            background: var(--pk-color-gray-100);
            padding-block: 0.0625em;
            padding-inline: 0.25em;
            font-family: var(--pk-font-family-mono, ui-monospace, monospace);
            /* v1 field help/errors used [&_code]:text-[0.85em] — tighter than --pk-font-size-mono (0.9em). */
            font-size: var(--pk-inline-markdown-code-font-size, 0.85em);
            line-height: var(--pk-line-height-mono, 1.5);
            /* Inherit tip/warning/error/instructions text color (Craft parity). */
            color: inherit;
        }
    }
`;function E({control:e,labelId:t,instructionsId:n,errorsId:r,warningId:i,tipId:a,controlId:o,hasLabel:s,hasInstructions:c,hasErrors:l,hasWarning:u,hasTip:d,hasRequired:f=!1,invalid:p=!1}){e.id||=o,s?e.setAttribute(`aria-labelledby`,t):e.removeAttribute(`aria-labelledby`);let m=[c?n:``,l?r:``,u?i:``,d?a:``].filter(Boolean);m.length>0?e.setAttribute(`aria-describedby`,m.join(` `)):e.removeAttribute(`aria-describedby`),f?e.setAttribute(`aria-required`,`true`):e.removeAttribute(`aria-required`);let h=!!(p||l);h?(e.setAttribute(`aria-invalid`,`true`),e.setAttribute(`aria-errormessage`,r)):(e.removeAttribute(`aria-invalid`),e.removeAttribute(`aria-errormessage`)),D(e,h)}function D(e,t){`invalid`in e?e.invalid=t:e.toggleAttribute(`invalid`,t)}var O,k,A=()=>k??=d(()=>import(`./markdown-f6D2S5dO.js`).then(e=>O=e.renderInlineMarkdown),__vite__mapDeps([0,1]),import.meta.url),j=e=>e?p(e):m;function M(e){return e?O?j(O(e)):g(A().then(t=>j(t(e))),e):m}var N=y`
    @layer pk-component {
        :host {
            display: block;
            width: 100%;
        }

        .form-control__control {
            display: block;
            position: relative;
            width: 100%;
        }

        .form-control__header--with-end {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: 0.75rem;
        }

        .form-control__header-main {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
            min-width: 0;
            flex: 1 1 auto;
        }

        .form-control__header-end {
            flex-shrink: 0;
        }

        .form-control__required {
            display: inline-flex;
            align-items: center;
            color: var(--pk-color-rose-600);
            line-height: 0;
        }

        .form-control__required svg {
            display: block;
            width: 10px;
            height: 10px;
        }

        .form-control__translatable {
            display: inline-flex;
            align-items: center;
            color: var(--pk-color-gray-550);
            line-height: 0;
        }

        .form-control__translatable svg {
            display: block;
            width: 1rem;
            height: 1rem;
            fill: currentColor;
        }

        .form-control__errors {
            margin: 0;
            padding-inline-start: 20px;
            color: var(--pk-color-error);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
            list-style: square;
        }

        .form-control__errors:empty {
            display: none;
        }

        .form-control__warning {
            display: flex;
            align-items: flex-start;
            gap: 0.25rem;
            min-width: 0;
            margin: 0;
            color: var(--pk-color-warning);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        .form-control__warning:empty {
            display: none;
        }

        .form-control__warning-icon {
            display: inline-flex;
            flex-shrink: 0;
            margin-top: 0.3em;
            width: 0.75rem;
            height: 0.75rem;
            line-height: 0;
        }

        .form-control__warning-text {
            min-width: 0;
            margin: 0;
        }

        .form-control__warning-icon svg {
            display: block;
            width: 100%;
            height: 100%;
        }

        /* Craft .warning code — amber chip matching warning text. */
        .form-control__warning .pk-inline-markdown code {
            background-color: var(--pk-color-amber-100);
            border-color: var(--pk-color-amber-300);
        }

        .form-control__tip {
            display: flex;
            align-items: flex-start;
            gap: 0.25rem;
            min-width: 0;
            margin: 0;
            color: var(--pk-color-sky-700);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        .form-control__tip:empty {
            display: none;
        }

        .form-control__tip-icon {
            display: inline-flex;
            flex-shrink: 0;
            margin-top: 0.3em;
            width: 0.75rem;
            height: 0.75rem;
            line-height: 0;
        }

        .form-control__tip-text {
            min-width: 0;
            margin: 0;
        }

        .form-control__tip-icon svg {
            display: block;
            width: 100%;
            height: 100%;
        }

        .form-control__tip-text a {
            text-decoration: underline;
        }

        /* Craft .tip code — sky/notice chip matching tip text. */
        .form-control__tip .pk-inline-markdown code {
            background-color: var(--pk-color-sky-100);
            border-color: var(--pk-color-sky-300);
        }

        /* Craft --bg-error / --border-error pattern for field errors. */
        .form-control__errors.pk-inline-markdown code {
            background-color: var(--pk-color-red-100);
            border-color: var(--pk-color-red-300);
        }
    }
`,P=class extends i{constructor(...e){super(...e),this.hasSlotController=new s(this,`label`,`instructions`,`hint`,`header-end`,`warning`,`tip`,`errors`),this.baseId=u(`pk-field`),this.label=``,this.instructions=``,this.required=!1,this.translatable=!1,this.warning=``,this.tip=``,this.errors=[],this.for=``,this.onLabelClick=e=>{let t=e.target;t instanceof Element&&(t.closest(`button, a, input, select, textarea, [role="button"], [role="link"]`)||this.focusControl())},this.onControlSlotChange=()=>{this.syncControlAria(),this.requestUpdate()}}static{this.styles=[w,T,N]}connectedCallback(){super.connectedCallback();let e=this.getAttribute(`hint`);e&&!this.instructions&&(this.instructions=e)}updated(e){super.updated(e),(e.has(`label`)||e.has(`instructions`)||e.has(`errors`)||e.has(`warning`)||e.has(`tip`)||e.has(`required`)||e.has(`for`))&&this.syncControlAria()}get labelId(){return`${this.baseId}-label`}get instructionsId(){return`${this.baseId}-instructions`}get errorsId(){return`${this.baseId}-errors`}get warningId(){return`${this.baseId}-warning`}get tipId(){return`${this.baseId}-tip`}get controlId(){return this.for||`${this.baseId}-control`}hasLabel(){return!!this.label||this.hasSlotController.test(`label`)}hasInstructions(){return!!this.instructions||this.hasSlotController.test(`instructions`)||this.hasSlotController.test(`hint`)}hasHeaderEnd(){return this.hasSlotController.test(`header-end`)}hasErrors(){return this.errors.length>0||this.hasSlotController.test(`errors`)}hasWarning(){return!!this.warning||this.hasSlotController.test(`warning`)}hasTip(){return!!this.tip||this.hasSlotController.test(`tip`)}getControlElement(){let[e]=this.controlSlot?.assignedElements({flatten:!0})??[];return e instanceof HTMLElement?e:this.for?this.getRootNode().getElementById(this.for):null}focusControl(){let e=this.getControlElement();e&&typeof e.focus==`function`&&e.focus()}syncControlAria(){let e=this.getControlElement();e&&E({control:e,labelId:this.labelId,instructionsId:this.instructionsId,errorsId:this.errorsId,warningId:this.warningId,tipId:this.tipId,controlId:this.controlId,hasLabel:this.hasLabel(),hasInstructions:this.hasInstructions(),hasErrors:this.hasErrors(),hasWarning:this.hasWarning(),hasTip:this.hasTip(),hasRequired:this.required,invalid:this.hasErrors()})}render(){let e=this.hasLabel(),t=this.hasInstructions(),i=this.hasHeaderEnd(),o=this.hasErrors(),s=this.hasWarning(),c=this.hasTip(),l=this.for||(e?this.controlId:m);return h`
            <div part="form-control" class="form-control">
                ${e||t||i?h`
                        <div
                            part="header"
                            class=${v({"form-control__header":!0,"form-control__header--with-end":i})}
                        >
                            <div class="form-control__header-main">
                                ${e?h`
                                        <label
                                            part="label"
                                            class="form-control__label"
                                            id=${this.labelId}
                                            for=${l}
                                            data-error=${o?`true`:m}
                                            @click=${this.onLabelClick}
                                        >
                                            <slot name="label">${this.label}</slot>
                                            ${this.required?h`
                                                    <span class="sr-only">Required</span>
                                                    <span class="form-control__required" aria-hidden="true">
                                                        ${n(a.asterisk)}
                                                    </span>
                                                `:m}
                                            ${this.translatable?h`
                                                    <span class="form-control__translatable">
                                                        ${r()}
                                                        <span class="sr-only">Translatable</span>
                                                    </span>
                                                `:m}
                                        </label>
                                    `:m}

                                ${t?h`
                                        <p
                                            part="instructions"
                                            class="form-control__instructions pk-inline-markdown"
                                            id=${this.instructionsId}
                                        >
                                            <slot name="instructions">${M(this.instructions)}</slot>
                                            <slot name="hint"></slot>
                                        </p>
                                    `:m}
                            </div>

                            ${i?h`
                                    <div part="header-end" class="form-control__header-end">
                                        <slot name="header-end"></slot>
                                    </div>
                                `:h`<slot name="header-end" hidden></slot>`}
                        </div>
                    `:m}

                <div part="control" class="form-control__control">
                    <slot @slotchange=${this.onControlSlotChange}></slot>
                </div>

                ${o?h`
                        <ul part="errors" class="form-control__errors pk-inline-markdown" id=${this.errorsId}>
                            ${this.errors.map(e=>h`<li>${M(e)}</li>`)}
                            <slot name="errors"></slot>
                        </ul>
                    `:m}

                ${s?h`
                        <div part="warning" class="form-control__warning" id=${this.warningId}>
                            <span class="form-control__warning-icon" aria-hidden="true">
                                ${n(a.triangleExclamation)}
                            </span>
                            <p class="form-control__warning-text pk-inline-markdown">
                                <slot name="warning">${M(this.warning)}</slot>
                            </p>
                        </div>
                    `:m}

                ${c?h`
                        <div part="tip" class="form-control__tip" id=${this.tipId}>
                            <span class="form-control__tip-icon" aria-hidden="true">
                                ${n(a.lightbulb)}
                            </span>
                            <p class="form-control__tip-text pk-inline-markdown">
                                <span class="sr-only">Tip: </span>
                                <slot name="tip">${M(this.tip)}</slot>
                            </p>
                        </div>
                    `:m}
            </div>
        `}};o([_()],P.prototype,`label`,void 0),o([_()],P.prototype,`instructions`,void 0),o([_({type:Boolean,reflect:!0})],P.prototype,`required`,void 0),o([_({type:Boolean,reflect:!0})],P.prototype,`translatable`,void 0),o([_()],P.prototype,`warning`,void 0),o([_()],P.prototype,`tip`,void 0),o([_({attribute:!1})],P.prototype,`errors`,void 0),o([_({reflect:!0})],P.prototype,`for`,void 0),o([b(`slot:not([name])`)],P.prototype,`controlSlot`,void 0),P=o([t(`pk-field`)],P);var F=c({tagName:`pk-field`,elementClass:P,react:S.default}),I=(0,S.forwardRef)(function(e,t){let{required:n,translatable:r,headerEnd:i,children:a,...o}=e;return(0,C.jsxs)(F,{ref:t,...o,...l([`required`,`translatable`],{required:n,translatable:r}),children:[i?(0,C.jsx)(`div`,{slot:`header-end`,children:i}):null,a]})});I.displayName=`Field`;var L=({name:e,label:t,instructions:n,warning:r,tip:i,required:a,translatable:o,errors:s=[],headerEnd:c,className:l,style:u,children:d})=>(0,C.jsxs)(I,{className:l,label:t,instructions:n,warning:r,tip:i,required:a,translatable:o,errors:s,"data-name":e,style:u,children:[c?(0,C.jsx)(`div`,{slot:`header-end`,children:c}):null,d]});export{w as n,L as t};
//# sourceMappingURL=Field-BzMQLv6d.js.map