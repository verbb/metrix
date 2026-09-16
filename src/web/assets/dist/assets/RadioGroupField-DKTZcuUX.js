import{S as e,b as t,q as n,x as r}from"./pk-dialog-VMQqLW1f-D2xp5wM2.js";import{n as i,t as a}from"./Field-BPmHFINy.js";import{d as o}from"./MetrixConfig-CTtdwBGD.js";import{a as s,i as c,r as l}from"./focus-aa5dlv8k-Blvp5c6v.js";import{p as u}from"./dndkit-BjxKhXRv.js";import{a as d,c as f,d as p,f as m,o as h,s as g,u as _}from"./lit-Du1yN0YY.js";import{n as v}from"./react-vendor-DIdIewtR.js";import{i as y}from"./dist-BQV6gLiX.js";import{t as b}from"./pk-form-associated-element-CCQALRGB-CZ2_MT2V.js";import{t as x}from"./required-validator-CEg8dvjS-BXQJ6aCw.js";import{n as S,t as C}from"./field-labels-CmuAW8Cl-qJ92s-2-.js";import{n as w}from"./pk-change-BMLA71i0.js";var T=n(u(),1),E=v(),D=m`
    @layer pk-component {
        :host {
            display: inline-flex;
            vertical-align: middle;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        :host([disabled]) {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .item {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            position: relative;
            margin: 0;
        }

        :host([disabled]) .item {
            cursor: not-allowed;
        }

        .item--with-label {
            gap: 0.5rem;
        }

        .control {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1rem;
            height: 1rem;
            border: 1px solid var(--pk-color-slate-400);
            border-radius: 9999px;
            background: var(--pk-color-white);
            transition: border-color 0.12s ease, box-shadow 0.12s ease;
        }

        .item:focus-visible .control,
        :host([data-focus-visible]) .control {
            border-color: var(--pk-color-sky-600);
            box-shadow: 0 0 0 1px var(--pk-color-sky-600), 0 0 4px 0 hsl(from var(--pk-color-sky-600) h s l / 0.7);
        }

        :host([invalid]) .control {
            border-color: var(--pk-color-rose-600);
        }

        :host([invalid]:focus-visible) .control,
        :host([invalid][data-focus-visible]) .control {
            box-shadow: 0 0 0 1px var(--pk-color-rose-600), 0 0 4px 0 hsl(from var(--pk-color-rose-600) h s l / 0.7);
        }

        :host([checked]) .control {
            background: var(--pk-color-gray-50);
            color: #1f2933;
        }

        .indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: currentcolor;
        }

        .indicator-dot {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 9999px;
            background: currentcolor;
            transition: opacity 0.12s ease, transform 0.12s ease;
        }

        :host(:not([checked])) .indicator-dot {
            opacity: 0;
            transform: scale(0);
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

        .label {
            line-height: var(--pk-line-height);
            /* Match checkbox / form-control labels (gray-700). */
            color: var(--pk-color-gray-700);
        }

        .label.is-empty {
            display: none;
        }
    }
`,O=class extends t{constructor(...e){super(...e),this.value=``,this.checked=!1,this.disabled=!1,this.invalid=!1,this.required=!1,this.tabIndex=-1,this.ariaLabel=null,this.forceDisabled=!1,this.hasDefaultSlotContent=!1}static{this.styles=D}updated(e){this.input&&e.has(`checked`)&&(this.input.checked=this.checked),this.input&&e.has(`tabIndex`)&&(this.input.tabIndex=this.tabIndex)}focusControl(e){this.input.focus(e)}defaultSlotChanged(e){let t=e.target;this.hasDefaultSlotContent=t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE)}handleChange(e){e.stopPropagation();let t=e.target;this.disabled||this.forceDisabled||!t.checked||this.dispatchEvent(new CustomEvent(`pk-radio-select`,{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){let e=this.disabled||this.forceDisabled;return p`
            <label
                part="base"
                class=${d({item:!0,"pk-radio-group__item":!0,"item--with-label":this.hasDefaultSlotContent})}
                data-state=${this.checked?`checked`:_}
                ?data-disabled=${e}
                aria-disabled=${e?`true`:_}
            >
                <span part="control" class="control pk-radio-group__control">
                    <span part="indicator" class="indicator pk-radio-group__indicator">
                        <span class="indicator-dot pk-radio-group__indicator-dot"></span>
                    </span>
                </span>
                <input
                    part="input"
                    class="input"
                    type="radio"
                    .checked=${this.checked}
                    ?disabled=${e}
                    ?required=${this.required}
                    value=${this.value}
                    tabindex=${this.tabIndex}
                    aria-label=${this.ariaLabel??_}
                    aria-invalid=${this.invalid?`true`:_}
                    aria-checked=${this.checked?`true`:`false`}
                    @change=${this.handleChange}
                />
                <span
                    class=${d({label:!0,"is-empty":!this.hasDefaultSlotContent})}
                >
                    <slot @slotchange=${this.defaultSlotChanged}></slot>
                </span>
            </label>
        `}};r([f()],O.prototype,`value`,void 0),r([f({type:Boolean,reflect:!0})],O.prototype,`checked`,void 0),r([f({type:Boolean,reflect:!0})],O.prototype,`disabled`,void 0),r([f({type:Boolean,reflect:!0})],O.prototype,`invalid`,void 0),r([f({type:Boolean,reflect:!0})],O.prototype,`required`,void 0),r([f({type:Number})],O.prototype,`tabIndex`,void 0),r([f({attribute:`aria-label`})],O.prototype,`ariaLabel`,void 0),r([f({type:Boolean,attribute:!1})],O.prototype,`forceDisabled`,void 0),r([h(`.input`)],O.prototype,`input`,void 0),r([g()],O.prototype,`hasDefaultSlotContent`,void 0),O=r([e(`pk-radio`)],O);var k=m`
    @layer pk-component {
        :host {
            display: block;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        .group {
            display: grid;
            gap: 0.375rem;
        }

        .group--horizontal {
            grid-auto-flow: column;
            grid-auto-columns: max-content;
            align-items: center;
        }
    }
`,A=class extends b{constructor(...e){super(...e),this.assumeInteractionOn=[`change`],this.hasSlotController=new l(this,`instructions`,`hint`,`label`),this._value=null,this.defaultValue=``,this.orientation=`vertical`,this.invalid=!1,this.label=``,this.instructions=``,this.ariaLabel=null,this.items=[],this.syncItems=()=>{this.items=this.getAllRadios(),this.applySelection()},this.handleRadioClick=e=>{let t=e.target.closest(`pk-radio`);if(!t||t.disabled||t.forceDisabled||this.disabled)return;let n=this.value;this.value=t.value,this.applySelection(),this.value!==n&&this.emitValueChange()},this.handleKeyDown=e=>{if(![`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,` `,`Home`,`End`].includes(e.key)||this.disabled)return;let t=this.getEnabledItems();if(t.length===0)return;e.preventDefault();let n=this.value,r=t.find(e=>e.checked)??t[0],i=t.indexOf(r);if(e.key!==` `){if(e.key===`Home`)i=0;else if(e.key===`End`)i=t.length-1;else{let n=[`ArrowUp`,`ArrowLeft`].includes(e.key)?-1:1;i+=n,i<0&&(i=t.length-1),i>=t.length&&(i=0)}}this.value=t[i].value,this.applySelection(),t[i].focusControl(),this.value!==n&&this.emitValueChange()}}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}static{this.styles=[i,k]}static get validators(){return[...super.validators,x()]}get value(){return this.valueHasChanged?this._value??``:this._value??this.defaultValue??``}set value(e){this._value=e==null?null:String(e),this.valueHasChanged=!0}syncFormValue(){this.setFormValue(this.value||null)}resetToDefaultValue(){this._value=null,this.applySelection()}restoreFormState(e){typeof e==`string`&&(this.value=e,this.applySelection())}get validationTarget(){return this.getAllRadios().find(e=>!e.disabled)??this.getAllRadios()[0]}connectedCallback(){this.instructions=S(this,this.instructions),super.connectedCallback(),this.addEventListener(`keydown`,this.handleKeyDown),this.addEventListener(`click`,this.handleRadioClick)}disconnectedCallback(){this.removeEventListener(`keydown`,this.handleKeyDown),this.removeEventListener(`click`,this.handleRadioClick),super.disconnectedCallback()}updated(e){(e.has(`value`)||e.has(`disabled`)||e.has(`invalid`)||e.has(`name`))&&this.applySelection(),super.updated(e)}formResetCallback(){this._value=null,super.formResetCallback(),this.applySelection()}focus(e){if(this.disabled)return;let t=this.getEnabledItems();(t.find(e=>e.checked)??t[0])?.focusControl(e)}getAllRadios(){return[...this.querySelectorAll(`pk-radio`)]}getEnabledItems(){return this.items.filter(e=>!e.disabled&&!this.disabled)}applySelection(){let e=this.getAllRadios();this.items=e;let t=this.getEnabledItems(),n=t.find(e=>e.value===this.value);for(let t of e){let e=t.value===this.value,n=t.hasAttribute(`disabled`)||t.disabled&&!t.forceDisabled;t.checked=e,t.disabled=this.disabled||n,t.invalid=this.invalid,t.required=this.required,t.forceDisabled=this.disabled}if(this.disabled){for(let t of e)t.tabIndex=-1;return}if(n)for(let e of t)e.tabIndex=e.checked?0:-1;else t.length>0&&t.forEach((e,t)=>{e.tabIndex=t===0?0:-1});for(let t of e.filter(e=>e.disabled))t.tabIndex=-1}emitValueChange(){this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:this.value},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}render(){let e=this.hasSlotController.test(`label`),t=C((e,t)=>this.hasSlotController.test(e,t),this.instructions),n=!!this.label||e;return p`
            <div part="form-control" class="form-control">
                ${n?p`
                        <div part="label" class="form-control__label" id="label">
                            <slot name="label">${this.label}</slot>
                        </div>
                    `:_}

                ${t?p`
                        <div part="instructions" class="form-control__instructions" id="instructions">
                            <slot name="instructions">${this.instructions}</slot>
                            <slot name="hint"></slot>
                        </div>
                    `:_}

                <div
                    part="radios"
                    class=${d({group:!0,"pk-radio-group":!0,"group--horizontal":this.orientation===`horizontal`,"pk-radio-group--horizontal":this.orientation===`horizontal`})}
                    role="radiogroup"
                    aria-labelledby=${n?`label`:_}
                    aria-label=${n?_:this.ariaLabel??_}
                    aria-describedby=${t?`instructions`:_}
                    aria-invalid=${this.invalid?`true`:_}
                    aria-required=${this.required?`true`:_}
                >
                    <slot @slotchange=${this.syncItems}></slot>
                </div>
            </div>
        `}};r([f({attribute:`value`,reflect:!0})],A.prototype,`defaultValue`,void 0),r([f({reflect:!0})],A.prototype,`orientation`,void 0),r([f({type:Boolean,reflect:!0})],A.prototype,`invalid`,void 0),r([f()],A.prototype,`label`,void 0),r([f()],A.prototype,`instructions`,void 0),r([f({attribute:`aria-label`})],A.prototype,`ariaLabel`,void 0),r([h(`slot:not([name])`)],A.prototype,`defaultSlot`,void 0),r([g()],A.prototype,`items`,void 0),A=r([e(`pk-radio-group`)],A);var j=s({tagName:`pk-radio-group`,elementClass:A,react:T.default,events:{onPkChange:`pk-change`,onInput:`input`,onChange:`change`}}),M=s({tagName:`pk-radio`,elementClass:O,react:T.default,events:{onPkRadioSelect:`pk-radio-select`}}),N=(0,T.forwardRef)(function(e,t){let{disabled:n,invalid:r,required:i,...a}=e;return(0,E.jsx)(j,{ref:t,...a,...c([`disabled`,`invalid`,`required`],{disabled:n,invalid:r,required:i})})});N.displayName=`RadioGroup`;var P=(0,T.forwardRef)(function(e,t){let{disabled:n,invalid:r,required:i,checked:a,...o}=e;return(0,E.jsx)(M,{ref:t,...o,...c([`disabled`,`invalid`,`required`,`checked`],{disabled:n,invalid:r,required:i,checked:a})})});P.displayName=`Radio`;var F=e=>e==null?``:String(e);function I({options:e,value:t,onChange:n,onPkChange:r,...i}){let a=t=>{if(r?.(t),!n)return;let i=w(t),a=e.find(e=>F(e.value)===i);n(a?a.value:i)};return(0,E.jsx)(N,{...i,value:F(t),onPkChange:a,children:e.map(e=>(0,E.jsx)(P,{value:F(e.value),disabled:e.disabled,children:e.label},F(e.value)))})}var L=({form:e,field:t})=>{let{value:n,setValue:r,setTouched:i,errors:s}=o(e,t.name),c=(0,T.useSyncExternalStore)(e.store.subscribe.bind(e.store),()=>e.store.state.values,()=>e.store.state.values),l=(0,T.useMemo)(()=>{let n=typeof t._scopePath==`string`?t._scopePath:``,r=n?e?.getFieldValue?.(n):null,i=r&&typeof r==`object`?r:{},a=t._data&&typeof t._data==`object`?t._data:{};return{...c||{},...i,...a}},[t,e,c]),u=(0,T.useMemo)(()=>(Array.isArray(t.options)?t.options:[]).filter(e=>!e?.if||y(e.if,l)),[l,t.options]);return(0,T.useEffect)(()=>{if(n==null||n===``||u.some(e=>String(e?.value)===String(n)))return;let e=u.find(e=>e?.value!==void 0&&e?.disabled!==!0);r(e?e.value:``)},[u,r,n]),(0,E.jsx)(a,{name:t.name,label:t.label,instructions:t.instructions,warning:t.warning,required:t.required,errors:s,children:(0,E.jsx)(I,{name:t.name,value:n,options:u.map(e=>({value:e.value,label:e.label,disabled:e.disabled})),onChange:e=>{r(e),i()},disabled:t.disabled,"aria-label":t.label})})};export{L as RadioGroupField};
//# sourceMappingURL=RadioGroupField-DKTZcuUX.js.map