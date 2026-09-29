import{E as e,N as t,S as n,U as r,W as i,t as a,x as o}from"../../../assets/pk-dialog-VMQqLW1f-Cj2lP4Ga.js";import{a as s,i as c,n as l,o as u,r as d,s as f,t as p}from"../../../assets/connect-BBqfGgsM.js";import{c as m,d as h,f as g,l as _,s as v,u as y}from"../../../assets/lit-Du1yN0YY.js";import{r as b,t as x}from"../../../assets/pk-button-BrH4u4Qr-COA9h384.js";import{t as S}from"../../../assets/pk-status-BehQARDv-BlLZqkPQ.js";var C=customElements;if(!C.__pkSafeDefine){let e=C.define.bind(C);C.define=(t,n,r)=>{C.get(t)||e(t,n,r)},C.__pkSafeDefine=!0}var w=g`
    @layer pk-component {
        :host {
            display: flex;
            flex-wrap: nowrap;
            align-items: stretch;
            justify-content: space-between;
            box-sizing: border-box;
            width: 100%;
            flex: 1 1 100%;
            min-width: 0;
            min-height: 2.75rem;
        }

        :host .heading {
            display: flex;
            align-items: center;
            gap: var(--pk-connect-status-gap, 15px);
            margin: 0;
            flex: 1 1 auto;
            min-width: 0;
            line-height: 1.125rem;
            padding-block: 0.75rem;
            padding-inline: var(--pk-connect-heading-padding-inline, var(--m, 1rem) var(--s, 0.75rem));
            color: var(--pk-connect-heading-color, var(--gray-600, #515f6c));
        }

        :host .heading:only-child {
            flex: 1 1 100%;
        }

        :host .input {
            display: flex;
            align-items: center;
            flex: 0 0 auto;
            padding-block: var(--pk-connect-input-padding-block, var(--s, 0.75rem));
            padding-inline: var(--pk-connect-input-padding-inline, 10px var(--m, 1rem));
        }

        :host .heading .light {
            color: var(--pk-connect-muted-color, var(--gray-500, #606d7b));
        }

        :host .heading pk-status.pk-connect__status-icon {
            display: block;
            flex-shrink: 0;
            width: 0.75rem;
            height: 0.75rem;
            --pk-status-ring: var(--gray-500);
        }

        :host .heading .warning.with-icon::before {
            margin-inline-end: 7px;
        }
    }
`,T=e=>e===`connected`?`on`:e===`error`?`off`:`disabled`,E=class extends _{constructor(...e){super(...e),this.action=``,this.status=`disconnected`,this.formSelector=`#main-form`,this.sourceId=null,this.idParam=`sourceId`,this.type=``,this.labelConnected=`Connected`,this.labelNotConnected=`Not Connected`,this.labelConnecting=`Connecting…`,this.labelError=`Error`,this.labelConnect=`Connect`,this.labelRefresh=`Refresh`,this.labelSaveToConnect=`Save to connect.`,this.labelErrorHeading=`Connection error`,this.labelGenericError=`Unable to connect to the provider.`,this.labelShowDetails=`Show details`,this.labelHideDetails=`Hide details`,this.labelClose=`Close`,this.isDirty=!1,this.loading=!1,this.showDetails=!1,this.unwatchDirty=null,this.errorDialog=null}static{this.styles=w}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.unwatchDirty=f({formSelector:this.formSelector,host:this,onDirty:()=>{this.isDirty=!0}})}disconnectedCallback(){this.unwatchDirty?.(),this.unwatchDirty=null,this.errorDialog?.remove(),this.errorDialog=null,super.disconnectedCallback()}get labels(){return{connected:this.labelConnected,notConnected:this.labelNotConnected,connecting:this.labelConnecting,error:this.labelError,connect:this.labelConnect,refresh:this.labelRefresh,saveToConnect:this.labelSaveToConnect,errorHeading:this.labelErrorHeading,genericError:this.labelGenericError,showDetails:this.labelShowDetails,hideDetails:this.labelHideDetails}}get fieldHost(){return this.closest(`.pk-connect-field`)}get statusLabel(){switch(this.status){case`connected`:return this.labelConnected;case`error`:return this.labelError;case`connecting`:return this.labelConnecting;default:return this.labelNotConnected}}get statusLabelMuted(){return this.status!==`connected`&&this.status!==`error`}get actionLabel(){return this.status===`connected`?this.labelRefresh:this.labelConnect}setConnectStatus(e){this.status=e,this.dispatchEvent(new CustomEvent(`pk-status-change`,{detail:{status:e},bubbles:!0}))}setModalOpen(e){this.fieldHost?.classList.toggle(`pk-connect-field--modal-open`,e),e||(this.showDetails=!1)}ensureErrorDialog(){if(this.errorDialog)return this.errorDialog;let e=document.createElement(`pk-dialog`);e.className=`pk-connect-dialog`,e.setAttribute(`without-header`,``),e.innerHTML=[`<pk-button slot="trigger" type="button" variant="none" size="none" icon class="pk-connect-dialog__close" data-dialog="close" aria-label="${l(this.labelClose)}">`,`<pk-icon icon="xmark"></pk-icon>`,`</pk-button>`,`<div class="pk-connection-error">`,`<div class="pk-connection-error__stack">`,`<div class="pk-connection-error__icon"><pk-icon icon="triangle-exclamation"></pk-icon></div>`,`<h3 class="pk-connection-error__heading"></h3>`,`<p class="pk-connection-error__message"></p>`,`<div class="pk-connection-error__details hidden">`,`<button type="button" class="pk-connection-error__details-toggle">`,`<pk-icon icon="chevron-right"></pk-icon>`,`<span class="pk-connection-error__details-label">${l(this.labelShowDetails)}</span>`,`</button>`,`<div class="pk-connection-error__trace hidden"></div>`,`</div>`,`</div>`,`</div>`].join(``),document.body.appendChild(e);let t=e.querySelector(`.pk-connection-error__details-toggle`),n=e.querySelector(`.pk-connection-error__trace`),r=e.querySelector(`.pk-connection-error__details-label`);e.querySelector(`.pk-connection-error__details`);let i=e.querySelector(`pk-icon`);return t?.addEventListener(`click`,()=>{this.showDetails=!this.showDetails,n?.classList.toggle(`hidden`,!this.showDetails),i?.classList.toggle(`is-open`,this.showDetails),r&&(r.textContent=this.showDetails?this.labelHideDetails:this.labelShowDetails)}),e.addEventListener(`pk-open-change`,e=>{let t=!!e.detail?.open;this.setModalOpen(t),t||(n?.classList.add(`hidden`),i?.classList.remove(`is-open`),r&&(r.textContent=this.labelShowDetails))}),this.errorDialog=e,e}showErrorModal(e){let t=this.ensureErrorDialog(),n=t.querySelector(`.pk-connection-error__heading`),r=t.querySelector(`.pk-connection-error__message`),i=t.querySelector(`.pk-connection-error__details`),a=t.querySelector(`.pk-connection-error__trace`);n&&(n.textContent=e.heading||this.labelErrorHeading),r&&(r.textContent=e.text||this.labelGenericError);let o=e.traceAsString||e.trace||``;o&&i&&a?(i.classList.remove(`hidden`),a.innerHTML=o,a.classList.add(`hidden`)):i?.classList.add(`hidden`),this.showDetails=!1,t.open=!0,this.setModalOpen(!0)}async handleConnectClick(e){if(e.preventDefault(),this.isDirty||this.loading||!this.action)return;this.loading=!0,this.setConnectStatus(`connecting`),this.setModalOpen(!1);let t=s(this.formSelector,this),n=p(t,{idParam:this.idParam,sourceId:this.sourceId,type:this.type||t.type});try{let e=await c(this.action,n);if(this.loading=!1,e?.data?.success){this.setConnectStatus(`connected`);return}(e?.data?.message||e?.data?.success===!1)&&(this.setConnectStatus(`error`),this.showErrorModal(d(e?.data?.message??null,this.labels)))}catch(e){this.loading=!1,this.setConnectStatus(`error`),this.showErrorModal(d(e,this.labels))}}render(){return this.isDirty?h`
                <div class="heading">
                    <span class="warning with-icon">${this.labelSaveToConnect}</span>
                </div>
            `:h`
            <div class="heading">
                <pk-status
                    status=${T(this.status)}
                    class="pk-connect__status-icon"
                ></pk-status><span class=${this.statusLabelMuted?`light`:y}>${this.statusLabel}</span>
            </div>

            <div class="input ltr">
                <pk-button
                    type="button"
                    size="xs"
                    variant="default"
                    class="pk-connect__action"
                    spinner-size="xs"
                    ?loading=${this.loading}
                    ?disabled=${this.loading||this.isDirty}
                    @click=${this.handleConnectClick}
                >
                    ${this.actionLabel}
                </pk-button>
            </div>
        `}};o([m({reflect:!0})],E.prototype,`action`,void 0),o([m({reflect:!0})],E.prototype,`status`,void 0),o([m({attribute:`form-selector`})],E.prototype,`formSelector`,void 0),o([m({attribute:`source-id`})],E.prototype,`sourceId`,void 0),o([m({attribute:`id-param`})],E.prototype,`idParam`,void 0),o([m()],E.prototype,`type`,void 0),o([m({attribute:`label-connected`})],E.prototype,`labelConnected`,void 0),o([m({attribute:`label-not-connected`})],E.prototype,`labelNotConnected`,void 0),o([m({attribute:`label-connecting`})],E.prototype,`labelConnecting`,void 0),o([m({attribute:`label-error`})],E.prototype,`labelError`,void 0),o([m({attribute:`label-connect`})],E.prototype,`labelConnect`,void 0),o([m({attribute:`label-refresh`})],E.prototype,`labelRefresh`,void 0),o([m({attribute:`label-save-to-connect`})],E.prototype,`labelSaveToConnect`,void 0),o([m({attribute:`label-error-heading`})],E.prototype,`labelErrorHeading`,void 0),o([m({attribute:`label-generic-error`})],E.prototype,`labelGenericError`,void 0),o([m({attribute:`label-show-details`})],E.prototype,`labelShowDetails`,void 0),o([m({attribute:`label-hide-details`})],E.prototype,`labelHideDetails`,void 0),o([m({attribute:`label-close`})],E.prototype,`labelClose`,void 0),o([v()],E.prototype,`isDirty`,void 0),o([v()],E.prototype,`loading`,void 0),o([v()],E.prototype,`showDetails`,void 0),E=o([n(`pk-connect`)],E);var D=class extends _{constructor(...e){super(...e),this.connected=!1,this.connectAction=``,this.disconnectAction=``,this.paramName=``,this.paramValue=``,this.connectRedirect=``,this.disconnectRedirect=``,this.formSelector=`#main-form`,this.skipDirtyWatch=!1,this.labelConnected=`Connected`,this.labelNotConnected=`Not Connected`,this.labelConnect=`Connect`,this.labelDisconnect=`Disconnect`,this.labelSaveToConnect=`Save to connect.`,this.isDirty=!1,this.unwatchDirty=null}static{this.styles=w}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),!this.skipDirtyWatch&&(this.unwatchDirty=f({formSelector:this.formSelector,host:this,onDirty:()=>{this.isDirty=!0}}))}disconnectedCallback(){this.unwatchDirty?.(),this.unwatchDirty=null,super.disconnectedCallback()}submitOAuthAction(e,t){u({formSelector:this.formSelector,host:this,action:e,redirect:t,paramName:this.paramName,paramValue:this.paramValue})}handleConnectClick(e){e.preventDefault(),this.submitOAuthAction(this.connectAction,this.connectRedirect)}handleDisconnectClick(e){e.preventDefault(),this.submitOAuthAction(this.disconnectAction,this.disconnectRedirect)}render(){return this.isDirty?h`
                <div class="heading">
                    <span class="warning with-icon">${this.labelSaveToConnect}</span>
                </div>
            `:this.connected?h`
                <div class="heading">
                    <pk-status status="on" class="pk-connect__status-icon"></pk-status>${this.labelConnected}
                </div>

                <div class="input ltr">
                    <pk-button
                        type="button"
                        size="xs"
                        variant="default"
                        class="pk-connect__action"
                        @click=${this.handleDisconnectClick}
                    >
                        ${this.labelDisconnect}
                    </pk-button>
                </div>
            `:h`
            <div class="heading">
                <pk-status status="disabled" class="pk-connect__status-icon"></pk-status><span class="light">${this.labelNotConnected}</span>
            </div>

            <div class="input ltr">
                <pk-button
                    type="button"
                    size="xs"
                    variant="default"
                    class="pk-connect__action"
                    @click=${this.handleConnectClick}
                >
                    ${this.labelConnect}
                </pk-button>
            </div>
        `}};o([m({type:Boolean,reflect:!0})],D.prototype,`connected`,void 0),o([m({attribute:`connect-action`})],D.prototype,`connectAction`,void 0),o([m({attribute:`disconnect-action`})],D.prototype,`disconnectAction`,void 0),o([m({attribute:`param-name`})],D.prototype,`paramName`,void 0),o([m({attribute:`param-value`})],D.prototype,`paramValue`,void 0),o([m({attribute:`connect-redirect`})],D.prototype,`connectRedirect`,void 0),o([m({attribute:`disconnect-redirect`})],D.prototype,`disconnectRedirect`,void 0),o([m({attribute:`form-selector`})],D.prototype,`formSelector`,void 0),o([m({type:Boolean,attribute:`skip-dirty-watch`})],D.prototype,`skipDirtyWatch`,void 0),o([m({attribute:`label-connected`})],D.prototype,`labelConnected`,void 0),o([m({attribute:`label-not-connected`})],D.prototype,`labelNotConnected`,void 0),o([m({attribute:`label-connect`})],D.prototype,`labelConnect`,void 0),o([m({attribute:`label-disconnect`})],D.prototype,`labelDisconnect`,void 0),o([m({attribute:`label-save-to-connect`})],D.prototype,`labelSaveToConnect`,void 0),o([v()],D.prototype,`isDirty`,void 0),D=o([n(`pk-connect-oauth`)],D);var O=[x,E,D,a,b,S],k=[`pk-icon`,`pk-button`,`pk-connect`,`pk-connect-oauth`,`pk-dialog`,`pk-status`];async function A(){e({chevronRight:t,triangleExclamation:r,xmark:i});for(let e of O)if(typeof e!=`function`)throw Error(`Plugin Kit connect constructor missing from bundle`);await Promise.all(k.map(e=>customElements.whenDefined(e)))}A();
//# sourceMappingURL=metrix-sources.js.map