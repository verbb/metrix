import{N as e,c as t,o as n,s as r,t as i}from"./has-slot-9zjTXvea-ZUAZFMFd.js";import{t as a}from"./Field-B7plyzjj.js";import{d as o}from"./MetrixConfig-ClR-_GNa.js";import{i as s,r as c}from"./focus-C6pY4Ym4-BEazZyvR.js";import{p as l}from"./dndkit-BBakeWil.js";import{c as u,d,f,i as p,o as m,s as h,u as g}from"./lit-CZC2goWk.js";import{n as _}from"./react-vendor-C9pfoLkf.js";import{t as v}from"./pk-form-associated-element-MqaHdIoH-D5etOkKh.js";import{t as y}from"./required-validator-CaRnQk1V-BXQJ6aCw.js";var b=e(l(),1),x=_();function S(){return d`
        <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" viewBox="0 0 640 640">
            <path
                fill="currentColor"
                d="M557.5 192L534.9 214.6L278.9 470.6C266.4 483.1 246.1 483.1 233.6 470.6L105.6 342.6L83 320L128.3 274.7C129.6 276 172.3 318.7 256.3 402.7L489.7 169.3L512.3 146.7L557.6 192z"
            />
        </svg>
    `}function C(){return d`
        <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" viewBox="0 0 640 640">
            <path fill="currentColor" d="M96 352V288H544V352H96z" />
        </svg>
    `}var w=[f`
    @layer pk-component {
        .control {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            position: relative;
            box-sizing: border-box;
            width: var(--pk-checkbox-size);
            height: var(--pk-checkbox-size);
            border: 1px solid var(--pk-checkbox-border-color, #c0cbd9);
            border-radius: var(--pk-radius-sm);
            background: var(--pk-color-white);
            cursor: pointer;
            transition: border-color 0.12s ease, box-shadow 0.12s ease;
        }

        :host([disabled]) .control {
            cursor: not-allowed;
        }

        .input:focus-visible + .control {
            border-color: var(--pk-color-sky-600);
            box-shadow: 0 0 0 1px var(--pk-color-sky-600), 0 0 4px 0 hsl(from var(--pk-color-sky-600) h s l / 0.7);
        }

        :host([invalid]) .control,
        .input[aria-invalid='true'] + .control {
            border-color: var(--pk-color-rose-600);
        }

        :host([invalid]) .input:focus-visible + .control,
        .input[aria-invalid='true']:focus-visible + .control {
            border-color: var(--pk-color-rose-600);
            box-shadow: 0 0 0 1px var(--pk-color-rose-600), 0 0 4px 0 hsl(from var(--pk-color-rose-600) h s l / 0.7);
        }

        .indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--pk-color-gray-900);
        }

        .icon-check,
        .icon-indeterminate {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
        }

        .icon-check svg {
            width: 14px;
            height: 14px;
            transform: translateY(1px) scale(1.2);
        }

        .icon-indeterminate svg {
            width: 12px;
            height: 12px;
        }

        :host([checked]) .icon-check,
        .input:checked + .control .icon-check {
            opacity: 1;
        }

        :host([indeterminate]) .icon-check,
        .input:indeterminate + .control .icon-check {
            opacity: 0;
        }

        :host([indeterminate]) .icon-indeterminate,
        .input:indeterminate + .control .icon-indeterminate {
            opacity: 1;
        }
    }
`,f`
    @layer pk-component {
        :host {
            display: inline-flex;
            vertical-align: middle;
            /* Hit target is the content-sized .root label (Craft checkbox-select), not the host. */
            cursor: default;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        :host([disabled]) {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .root {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: flex-start;
            gap: var(--pk-control-label-gap);
            /* Content-sized like Craft's <label> beside the checkbox — not full-row. */
            width: fit-content;
            max-width: 100%;
            margin: 0;
            min-height: 0;
            cursor: pointer;
            user-select: none;
            position: relative;
        }

        :host([disabled]) .root {
            cursor: not-allowed;
        }

        .root--with-hint {
            align-items: flex-start;
        }

        .input {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
            opacity: 0;
            appearance: none;
        }

        .text {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
            min-width: 0;
        }

        .label {
            line-height: max(1rem, var(--pk-checkbox-size));
            /* Match form-control / Craft body labels (gray-700), not gray-900. */
            color: var(--pk-color-gray-700);
            cursor: pointer;
        }

        :host([disabled]) .label {
            cursor: not-allowed;
        }

        :host(.all-option) .label {
            font-weight: 700;
        }

        .hint {
            margin: 0;
            color: var(--pk-color-gray-500);
            font-size: var(--pk-font-size-sm);
            line-height: var(--pk-line-height);
        }

        .hint:empty {
            display: none;
        }
    }
`],T=class extends v{constructor(...e){super(...e),this.assumeInteractionOn=[`change`],this.hasSlotController=new i(this,`hint`),this.checked=!1,this.indeterminate=!1,this.disabled=!1,this.invalid=!1,this.checkboxValue=`on`,this.defaultChecked=!1,this.ariaLabel=null,this.hint=``,this.withHint=!1,this.hasDefaultSlotContent=!1}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}static{this.styles=w}static get validators(){return[...super.validators,y({validationProperty:`checked`})]}get validationTarget(){return this.input}syncFormValue(){this.setFormValue(this.checked?this.checkboxValue:null,this.checked?`on`:`off`)}resetToDefaultValue(){this.checked=this.defaultChecked,this.indeterminate=!1}restoreFormState(e){this.checked=e===`on`||e===this.checkboxValue}updated(e){if(!this.input){super.updated(e);return}e.has(`checkboxValue`)&&this.syncFormValue(),(e.has(`indeterminate`)||e.has(`checked`))&&(this.input.indeterminate=this.indeterminate,this.input.checked=this.checked),super.updated(e)}defaultSlotChanged(e){let t=e.target;this.hasDefaultSlotContent=t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE)}handleChange(e){let t=e.target;this.checked=t.checked,this.indeterminate=!1,this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{checked:this.checked},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}render(){let e=this.hasDefaultSlotContent,t=!!this.hint||this.hasSlotController.test(`hint`,this.withHint);return d`
            <label
                part="base"
                class=${p({root:!0,"root--with-hint":t})}
            >
                <input
                    part="input"
                    class="input"
                    type="checkbox"
                    .checked=${this.checked}
                    ?disabled=${this.disabled}
                    ?required=${this.required}
                    name=${this.name??g}
                    value=${this.checkboxValue}
                    aria-labelledby=${e?`label`:g}
                    aria-describedby=${t?`hint`:g}
                    aria-label=${e?g:this.ariaLabel??g}
                    aria-invalid=${this.invalid?`true`:g}
                    @change=${this.handleChange}
                />
                <span part="control" class="control">
                    <span part="checked-icon" class="icon-check">${S()}</span>
                    <span part="indeterminate-icon" class="icon-indeterminate">${C()}</span>
                </span>
                ${e||t?d`
                        <span class="text">
                            ${e?d`
                                    <span part="label" class="label" id="label">
                                        <slot @slotchange=${this.defaultSlotChanged}></slot>
                                    </span>
                                `:d`<slot @slotchange=${this.defaultSlotChanged} hidden></slot>`}
                            ${t?d`
                                    <span part="hint" class="hint" id="hint">
                                        <slot name="hint">${this.hint}</slot>
                                    </span>
                                `:g}
                        </span>
                    `:d`<slot @slotchange=${this.defaultSlotChanged} hidden></slot>`}
            </label>
        `}};r([u({type:Boolean,reflect:!0})],T.prototype,`checked`,void 0),r([u({type:Boolean,reflect:!0})],T.prototype,`indeterminate`,void 0),r([u({type:Boolean,reflect:!0})],T.prototype,`disabled`,void 0),r([u({type:Boolean,reflect:!0})],T.prototype,`invalid`,void 0),r([u()],T.prototype,`checkboxValue`,void 0),r([u({attribute:`default-checked`,type:Boolean})],T.prototype,`defaultChecked`,void 0),r([u({attribute:`aria-label`})],T.prototype,`ariaLabel`,void 0),r([u()],T.prototype,`hint`,void 0),r([u({type:Boolean,attribute:`with-hint`})],T.prototype,`withHint`,void 0),r([m(`.input`)],T.prototype,`input`,void 0),r([h()],T.prototype,`hasDefaultSlotContent`,void 0),T=r([t(`pk-checkbox`)],T);var E=f`
    @layer pk-component {
        :host {
            display: block;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-sm);
            line-height: var(--pk-line-height);
        }

        :host([disabled]) {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .options {
            display: flex;
            flex-direction: column;
            gap: var(--pk-checkbox-select-gap, 0);
        }

        .options--horizontal {
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            gap: var(--pk-checkbox-select-gap, 0);
        }

        ::slotted(pk-checkbox),
        pk-checkbox {
            display: block;
        }

        .options--horizontal pk-checkbox.all-option {
            width: 100%;
        }
    }
`,D={fromAttribute(e){if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>!!(e&&typeof e==`object`&&`value`in e)).map(e=>({label:String(e.label??e.value),value:String(e.value)})):[]}catch{return[]}},toAttribute(e){return JSON.stringify(e??[])}},O={fromAttribute(e){if(e==null||e===``)return[];if(e===`*`)return`*`;try{let t=JSON.parse(e);return t===`*`?`*`:Array.isArray(t)?t.map(String):[]}catch{return[]}},toAttribute(e){return e===`*`?`*`:JSON.stringify(e??[])}},k=class extends n{constructor(...e){super(...e),this.options=[],this.value=[],this.showAllOption=!1,this.allLabel=`All`,this.disabled=!1,this.orientation=`vertical`,this.ariaLabel=null,this.optionElements=[],this.allOptionElement=null,this.handleAllChange=e=>{e.stopPropagation(),this.value=e.detail.checked?`*`:[],this.dispatchValueChange()},this.handleItemChange=(e,t)=>{if(t.stopPropagation(),this.isAllSelected)return;let n=t.detail.checked,r=this.selectedValues;this.value=n?[...r,e]:r.filter(t=>t!==e),this.dispatchValueChange()}}static{this.styles=E}connectedCallback(){this.hasAttribute(`role`)||this.setAttribute(`role`,`group`),super.connectedCallback()}updated(e){if(e.has(`options`)||e.has(`showAllOption`)){this.rebuildOptionElements();return}(e.has(`value`)||e.has(`disabled`))&&this.updateOptionStates()}firstUpdated(){this.rebuildOptionElements()}focus(e){this.optionElements.find(e=>!e.disabled)?.focus(e)}get isAllSelected(){return this.value===`*`}get selectedValues(){return this.isAllSelected?this.options.map(e=>e.value):Array.isArray(this.value)?this.value:[]}dispatchValueChange(){let e=this.isAllSelected?`*`:[...this.selectedValues];this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:e},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}rebuildOptionElements(){let e=this.shadowRoot?.querySelector(`.options`);if(e){for(let e of this.optionElements)e.remove();if(this.optionElements=[],this.allOptionElement=null,this.showAllOption){let t=document.createElement(`pk-checkbox`);t.classList.add(`all-option`),t.append(this.allLabel),t.addEventListener(`pk-change`,this.handleAllChange),e.append(t),this.allOptionElement=t,this.optionElements.push(t)}for(let t of this.options){let n=document.createElement(`pk-checkbox`);n.checkboxValue=t.value,n.append(t.label),n.addEventListener(`pk-change`,e=>{this.handleItemChange(t.value,e)}),e.append(n),this.optionElements.push(n)}this.updateOptionStates()}}updateOptionStates(){this.allOptionElement&&(this.allOptionElement.checked=this.isAllSelected,this.allOptionElement.disabled=this.disabled);for(let e of this.options){let t=this.optionElements.find(t=>t!==this.allOptionElement&&t.checkboxValue===e.value);t&&(t.checked=this.isAllSelected||this.selectedValues.includes(e.value),t.disabled=this.disabled||this.isAllSelected)}}render(){return d`
            <div
                part="base"
                class=${p({options:!0,"options--horizontal":this.orientation===`horizontal`})}
            ></div>
        `}};r([u({attribute:`options`,converter:D})],k.prototype,`options`,void 0),r([u({attribute:`value`,converter:O})],k.prototype,`value`,void 0),r([u({type:Boolean,attribute:`show-all-option`})],k.prototype,`showAllOption`,void 0),r([u({attribute:`all-label`})],k.prototype,`allLabel`,void 0),r([u({type:Boolean,reflect:!0})],k.prototype,`disabled`,void 0),r([u({reflect:!0})],k.prototype,`orientation`,void 0),r([u({attribute:`aria-label`})],k.prototype,`ariaLabel`,void 0),r([h()],k.prototype,`optionElements`,void 0),k=r([t(`pk-checkbox-select`)],k);var A=s({tagName:`pk-checkbox-select`,elementClass:k,react:b.default,events:{onPkChange:`pk-change`,onNativeChange:`change`}}),j=(0,b.forwardRef)(function({disabled:e,onChange:t,onPkChange:n,...r},i){let a=(0,b.useCallback)(e=>{if(n?.(e),!t)return;let r=e.detail;r&&`value`in r&&t(r.value)},[t,n]);return(0,x.jsx)(A,{ref:i,...r,...c([`disabled`],{disabled:e}),...t||n?{onPkChange:a}:{}})});j.displayName=`CheckboxSelect`;var M=({form:e,field:t})=>{let{value:n,setValue:r,errors:i}=o(e,t.name);return(0,x.jsx)(a,{name:t.name,label:t.label,instructions:t.instructions,warning:t.warning,required:t.required,errors:i,children:(0,x.jsx)(j,{options:t.options||[],value:n??[],onChange:r,showAllOption:t.showAllOption??!1,allLabel:t.allLabel,disabled:t.disabled})})};export{M as CheckboxSelectField};
//# sourceMappingURL=CheckboxSelectField-CUNDSbg5.js.map