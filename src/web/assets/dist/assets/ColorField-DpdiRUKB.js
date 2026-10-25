import{N as e,c as t,s as n}from"./has-slot-DJv86HKx-C2QcI5Rp.js";import{t as r}from"./Field-CjuuORzv.js";import{d as i}from"./MetrixConfig-C5oRRAI2.js";import{i as a,r as o}from"./focus-DcVUPVqn-CYsLTXP_.js";import{p as s}from"./dndkit-D6rXdb0q.js";import{a as c,c as l,d as u,f as d,o as f,s as p,u as m}from"./lit-BA61WClV.js";import{n as h}from"./react-vendor-tG58KZVC.js";import{t as g}from"./pk-form-associated-element-Doh2K3pG-DVSKkf3b.js";import{t as _}from"./mirror-validator-BkZlEv1Z-BuTMKpbu.js";import{t as v}from"./required-validator-I58oJGZ3-Do2Ml_-w.js";var y=e(s(),1),b=h(),x=d`
    @layer pk-component {
        :host {
            --pk-color-input-font-size: var(--pk-control-font-default);
            display: inline-block;
            position: relative;
            /* Former lg min-width — default now matches input default chrome. */
            min-width: 6.75rem;
            font-family: var(--pk-font-family);
            vertical-align: middle;
        }

        :host([size='xxs']) {
            --pk-color-input-font-size: var(--pk-control-font-xxs);
            min-width: 5.5rem;
        }

        :host([size='xs']) {
            --pk-color-input-font-size: var(--pk-control-font-xs);
            min-width: 5.5rem;
        }

        :host([size='sm']) {
            --pk-color-input-font-size: var(--pk-control-font-sm);
            min-width: 6.125rem;
        }

        :host([size='lg']),
        :host([size='xl']) {
            --pk-color-input-font-size: var(--pk-control-font-xl);
            min-width: 7.375rem;
        }

        :host([size='lg']) {
            --pk-color-input-font-size: var(--pk-control-font-lg);
        }

        :host([fit-cell]) {
            display: block;
            width: 100%;
            min-width: 0;
            max-width: 100%;
            height: 100%;
        }

        :host([fit-cell]) .root {
            display: block;
            width: 100%;
            height: 100%;
        }

        .root {
            position: relative;
            display: inline-block;
            width: 100%;
        }

        .swatch {
            position: absolute;
            top: 50%;
            left: 0.5rem;
            z-index: 2;
            width: 1.25rem;
            height: 1.25rem;
            transform: translateY(-50%);
            border-radius: var(--pk-radius-sm);
        }

        :host([size='xxs']) .swatch {
            left: 0.375rem;
            width: 1rem;
            height: 1rem;
        }

        :host([size='xs']) .swatch {
            left: 0.375rem;
            width: 1rem;
            height: 1rem;
        }

        :host([size='sm']) .swatch {
            left: 0.375rem;
            width: 1.25rem;
            height: 1.25rem;
        }

        :host([size='lg']) .swatch,
        :host([size='xl']) .swatch {
            left: 0.5rem;
            width: 1.5rem;
            height: 1.5rem;
        }

        :host([fit-cell]) .swatch {
            left: 0.5rem;
            width: 1rem;
            height: 1rem;
        }

        .swatch-preview {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.15);
        }

        .swatch-preview.is-transparent {
            background-color: #fff;
            background-image:
                linear-gradient(45deg, #d1d5db 25%, transparent 25%),
                linear-gradient(-45deg, #d1d5db 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #d1d5db 75%),
                linear-gradient(-45deg, transparent 75%, #d1d5db 75%);
            background-size: 8px 8px;
            background-position: 0 0, 0 4px, 4px -4px, -4px 0;
        }

        .swatch-picker {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            border: 0;
            opacity: 0;
            cursor: pointer;
            appearance: none;
        }

        .swatch-picker:disabled {
            cursor: not-allowed;
        }

        .hash {
            position: absolute;
            top: 50%;
            left: 2.125rem;
            z-index: 1;
            transform: translateY(-50%);
            color: var(--pk-color-gray-300);
            font-family: var(--pk-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
            font-size: var(--pk-color-input-font-size);
            line-height: var(--pk-line-height-mono, 1.5);
            pointer-events: none;
            user-select: none;
        }

        :host([size='xxs']) .hash {
            left: 1.625rem;
        }

        :host([size='xs']) .hash {
            left: 1.625rem;
        }

        :host([size='sm']) .hash {
            left: 2rem;
        }

        :host([size='lg']) .hash,
        :host([size='xl']) .hash {
            left: 2.5rem;
        }

        :host([fit-cell]) .hash {
            left: 1.75rem;
        }

        .hex-input {
            display: block;
            width: 100%;
            /* Former lg — matches pk-input default chrome (~34px). */
            height: var(--pk-control-height-default);
            margin: 0;
            padding-inline: 3rem 0.75rem;
            border: var(--pk-input-border);
            border-radius: var(--pk-input-border-radius);
            background: var(--pk-input-bg);
            color: var(--pk-color-gray-700);
            font-family: var(--pk-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
            font-size: var(--pk-color-input-font-size);
            line-height: var(--pk-line-height-mono, 1.5);
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.12s ease, box-shadow 0.12s ease;
        }

        :host([size='xxs']) .hex-input {
            height: var(--pk-control-height-xxs);
            padding-inline: 2.25rem 0.625rem;
        }

        :host([size='xs']) .hex-input {
            height: var(--pk-control-height-xs);
            padding-inline: 2.25rem 0.625rem;
        }

        :host([size='sm']) .hex-input {
            height: var(--pk-control-height-sm);
            padding-inline: 2.75rem 0.75rem;
        }

        :host([size='lg']) .hex-input {
            height: var(--pk-control-height-lg);
            padding-inline: 3.25rem 0.875rem;
        }

        :host([size='xl']) .hex-input {
            height: var(--pk-control-height-xl);
            padding-inline: 3.25rem 0.875rem;
        }

        :host([fit-cell]) .hex-input {
            width: 100%;
            max-width: 100%;
            height: 100%;
            padding-inline: 2.25rem 0.5rem;
            border: 0;
            border-radius: 0;
            background: transparent;
        }

        .hex-input:focus,
        .hex-input:focus-visible {
            border-color: var(--pk-color-sky-600);
            box-shadow: var(--pk-input-focus-shadow);
        }

        :host([invalid]) .hex-input:focus,
        :host([invalid]) .hex-input:focus-visible {
            border-color: var(--pk-color-rose-600);
            box-shadow: var(--pk-input-invalid-focus-shadow);
        }

        :host([fit-cell]:not([invalid])) .hex-input:focus,
        :host([fit-cell]:not([invalid])) .hex-input:focus-visible {
            box-shadow: inset 0 0 0 1px var(--pk-color-gray-200);
        }

        :host([fit-cell][invalid]) .hex-input,
        :host([fit-cell][invalid]) .hex-input:focus,
        :host([fit-cell][invalid]) .hex-input:focus-visible {
            box-shadow: inset 0 0 0 1px var(--pk-color-rose-600);
        }

        .hex-input:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        :host([invalid]) .hex-input {
            border-color: var(--pk-color-rose-600);
        }

        :host([disabled]) .swatch {
            opacity: 0.5;
        }
    }
`,S=`#000000`;function C(e){return String(e||``).replace(/^#/,``).replace(/[^0-9a-fA-F]/g,``).slice(0,6).toLowerCase()}function w(e){return e.length===3||e.length===6}function T(e){return e.length===3?e.split(``).map(e=>`${e}${e}`).join(``):e}function E(e){return e.length===6?`#${e}`:e.length===3?`#${T(e)}`:S}var D=class extends g{constructor(...e){super(...e),this.assumeInteractionOn=[`blur`,`input`],this.size=`default`,this.fitCell=!1,this.readonly=!1,this.invalid=!1,this.value=``,this.defaultValue=``,this.ariaLabel=null,this.hexValue=``}static{this.styles=x}static get validators(){return[...super.validators,_(),v()]}connectedCallback(){super.connectedCallback(),this.syncHexFromValue()}willUpdate(e){e.has(`value`)&&this.syncHexFromValue(),super.willUpdate(e)}syncHexFromValue(){this.hexValue=C(this.value)}get validationTarget(){return this.input}syncFormValue(){let e=this.hexValue?`#${this.hexValue}`:``;this.setFormValue(e,e)}resetToDefaultValue(){this.value=this.defaultValue,this.hexValue=C(this.defaultValue)}restoreFormState(e){typeof e==`string`&&(this.value=e,this.hexValue=C(e))}emitChange(){let e=this.hexValue?`#${this.hexValue}`:``;this.value=e,this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:e},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}handleHexInput(e){if(this.disabled||this.readonly)return;let t=C(e.target.value);this.hexValue=t,this.emitChange()}handlePickerChange(e){if(this.disabled||this.readonly)return;let t=C(e.target.value);this.hexValue=t,this.emitChange()}render(){let e=E(this.hexValue),t=!w(this.hexValue);return u`
            <div class="root">
                <div part="swatch" class="swatch">
                    <div
                        class=${c({"swatch-preview":!0,"is-transparent":t})}
                        style=${t?m:`background-color: ${e}`}
                    ></div>
                    <input
                        part="picker"
                        class="swatch-picker"
                        type="color"
                        .value=${e}
                        ?disabled=${this.disabled||this.readonly}
                        aria-label="Color picker"
                        @input=${this.handlePickerChange}
                    />
                </div>
                <span class="hash" aria-hidden="true">#</span>
                <input
                    part="input"
                    class="hex-input"
                    type="text"
                    inputmode="text"
                    autocomplete="off"
                    maxlength="6"
                    .value=${this.hexValue}
                    ?disabled=${this.disabled}
                    ?readonly=${this.readonly}
                    ?required=${this.required}
                    aria-label=${this.ariaLabel??m}
                    aria-invalid=${this.invalid?`true`:m}
                    @input=${this.handleHexInput}
                />
            </div>
        `}};n([l({reflect:!0})],D.prototype,`size`,void 0),n([l({type:Boolean,reflect:!0,attribute:`fit-cell`})],D.prototype,`fitCell`,void 0),n([l({type:Boolean,reflect:!0})],D.prototype,`readonly`,void 0),n([l({type:Boolean,reflect:!0})],D.prototype,`invalid`,void 0),n([l()],D.prototype,`value`,void 0),n([l({attribute:`default-value`})],D.prototype,`defaultValue`,void 0),n([l({attribute:`aria-label`})],D.prototype,`ariaLabel`,void 0),n([f(`.hex-input`)],D.prototype,`input`,void 0),n([p()],D.prototype,`hexValue`,void 0),D=n([t(`pk-color-input`)],D);var O=a({tagName:`pk-color-input`,elementClass:D,react:y.default,events:{onPkChange:`pk-change`,onInput:`input`,onNativeChange:`change`,onBlur:`blur`}}),k=(0,y.forwardRef)(function({disabled:e,readonly:t,readOnly:n,invalid:r,isInvalid:i,onChange:a,onValueChange:s,onPkChange:c,...l},u){let d=!!(r??i),f=!!(t??n),p=a??s,m=(0,y.useCallback)(e=>{if(c?.(e),!p)return;let t=e.detail;t&&`value`in t&&p(t.value??``)},[c,p]);return(0,b.jsx)(O,{ref:u,...l,...o([`disabled`,`readonly`,`invalid`],{disabled:e,readonly:f,invalid:d}),...p||c?{onPkChange:m}:{}})});k.displayName=`ColorInput`;var A=({form:e,field:t})=>{let{value:n,setValue:a,setTouched:o,errors:s,isInvalid:c}=i(e,t.name);return(0,b.jsx)(r,{name:t.name,label:t.label,instructions:t.instructions,warning:t.warning,required:t.required,errors:s,children:(0,b.jsx)(k,{value:String(n||``),onPkChange:e=>{a(e.detail?.value??``),o()},disabled:t.disabled,invalid:c})})};export{A as ColorField};
//# sourceMappingURL=ColorField-DpdiRUKB.js.map