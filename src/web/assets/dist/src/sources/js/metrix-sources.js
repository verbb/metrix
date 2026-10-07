import{A as e,c as t,f as n,s as r}from"../../../assets/has-slot-9zjTXvea-ZUAZFMFd.js";import{a as i,i as a,n as o,o as s,r as c,s as l,t as u}from"../../../assets/connect-BBqfGgsM.js";import{c as d,d as f,f as p,l as m,s as h,u as g}from"../../../assets/lit-CZC2goWk.js";import{r as _,t as v}from"../../../assets/pk-button-DCtNLEPr-um3uC17C.js";import{r as y,t as b}from"../../../assets/pk-dialog-CFU850OH-nQdAvPCj.js";import{t as x}from"../../../assets/pk-status-CYcadu0Q-C_fcSuZj.js";var S=customElements;if(!S.__pkSafeDefine){let e=S.define.bind(S);S.define=(t,n,r)=>{S.get(t)||e(t,n,r)},S.__pkSafeDefine=!0}var C=p`
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
`,w=e=>e===`connected`?`on`:e===`error`?`off`:`disabled`,T=class extends m{constructor(...e){super(...e),this.action=``,this.status=`disconnected`,this.formSelector=`#main-form`,this.sourceId=null,this.idParam=`sourceId`,this.type=``,this.labelConnected=`Connected`,this.labelNotConnected=`Not Connected`,this.labelConnecting=`Connecting…`,this.labelError=`Error`,this.labelConnect=`Connect`,this.labelRefresh=`Refresh`,this.labelSaveToConnect=`Save to connect.`,this.labelErrorHeading=`Connection error`,this.labelGenericError=`Unable to connect to the provider.`,this.labelShowDetails=`Show details`,this.labelHideDetails=`Hide details`,this.labelClose=`Close`,this.isDirty=!1,this.loading=!1,this.unwatchDirty=null,this.errorDialog=null}static{this.styles=C}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.unwatchDirty=l({formSelector:this.formSelector,host:this,onDirty:()=>{this.isDirty=!0}})}disconnectedCallback(){this.unwatchDirty?.(),this.unwatchDirty=null,this.errorDialog?.remove(),this.errorDialog=null,super.disconnectedCallback()}get labels(){return{connected:this.labelConnected,notConnected:this.labelNotConnected,connecting:this.labelConnecting,error:this.labelError,connect:this.labelConnect,refresh:this.labelRefresh,saveToConnect:this.labelSaveToConnect,errorHeading:this.labelErrorHeading,genericError:this.labelGenericError,showDetails:this.labelShowDetails,hideDetails:this.labelHideDetails}}get fieldHost(){return this.closest(`.pk-connect-field`)}get statusLabel(){switch(this.status){case`connected`:return this.labelConnected;case`error`:return this.labelError;case`connecting`:return this.labelConnecting;default:return this.labelNotConnected}}get statusLabelMuted(){return this.status!==`connected`&&this.status!==`error`}get actionLabel(){return this.status===`connected`?this.labelRefresh:this.labelConnect}setConnectStatus(e){this.status=e,this.dispatchEvent(new CustomEvent(`pk-status-change`,{detail:{status:e},bubbles:!0}))}setModalOpen(e){this.fieldHost?.classList.toggle(`pk-connect-field--modal-open`,e)}ensureErrorDialog(){if(this.errorDialog)return this.errorDialog;let e=document.createElement(`pk-dialog`);return e.className=`pk-connect-dialog`,e.setAttribute(`without-header`,``),e.innerHTML=[`<pk-button slot="trigger" type="button" variant="none" size="none" icon class="pk-connect-dialog__close" data-dialog="close" aria-label="${o(this.labelClose)}">`,`<pk-icon icon="xmark"></pk-icon>`,`</pk-button>`,`<div class="pk-connect-dialog__content">`,`<pk-state-panel class="pk-connect-dialog__state" variant="error" size="lg" announce="assertive">`,`<span class="pk-connect-dialog__message"></span>`,`</pk-state-panel>`,`</div>`].join(``),document.body.appendChild(e),e.addEventListener(`pk-open-change`,e=>{let t=!!e.detail?.open;this.setModalOpen(t)}),this.errorDialog=e,e}showErrorModal(e){let t=this.ensureErrorDialog(),n=t.querySelector(`pk-state-panel`),r=t.querySelector(`.pk-connect-dialog__message`);r&&(r.textContent=e.text||this.labelGenericError);let i=e.traceAsArray.length>0?e.traceAsArray.join(`
`):(e.traceAsString||e.trace||``).replace(/<br\s*\/?>/gi,`
`);if(t.querySelector(`[slot="details"]`)?.remove(),n&&(n.heading=e.heading||this.labelErrorHeading,n.detailsLabel=this.labelShowDetails,n.detailsOpen=!1,n.copyable=!!i,i)){let e=document.createElement(`pre`);e.slot=`details`,e.textContent=i,n.appendChild(e)}t.open=!0,this.setModalOpen(!0)}async handleConnectClick(e){if(e.preventDefault(),this.isDirty||this.loading||!this.action)return;this.loading=!0,this.setConnectStatus(`connecting`),this.setModalOpen(!1);let t=i(this.formSelector,this),n=u(t,{idParam:this.idParam,sourceId:this.sourceId,type:this.type||t.type});try{let e=await a(this.action,n);if(this.loading=!1,e?.data?.success){this.setConnectStatus(`connected`);return}(e?.data?.message||e?.data?.success===!1)&&(this.setConnectStatus(`error`),this.showErrorModal(c(e?.data?.message??null,this.labels)))}catch(e){this.loading=!1,this.setConnectStatus(`error`),this.showErrorModal(c(e,this.labels))}}render(){return this.isDirty?f`
                <div class="heading">
                    <span class="warning with-icon">${this.labelSaveToConnect}</span>
                </div>
            `:f`
            <div class="heading">
                <pk-status
                    status=${w(this.status)}
                    class="pk-connect__status-icon"
                ></pk-status><span class=${this.statusLabelMuted?`light`:g}>${this.statusLabel}</span>
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
        `}};r([d({reflect:!0})],T.prototype,`action`,void 0),r([d({reflect:!0})],T.prototype,`status`,void 0),r([d({attribute:`form-selector`})],T.prototype,`formSelector`,void 0),r([d({attribute:`source-id`})],T.prototype,`sourceId`,void 0),r([d({attribute:`id-param`})],T.prototype,`idParam`,void 0),r([d()],T.prototype,`type`,void 0),r([d({attribute:`label-connected`})],T.prototype,`labelConnected`,void 0),r([d({attribute:`label-not-connected`})],T.prototype,`labelNotConnected`,void 0),r([d({attribute:`label-connecting`})],T.prototype,`labelConnecting`,void 0),r([d({attribute:`label-error`})],T.prototype,`labelError`,void 0),r([d({attribute:`label-connect`})],T.prototype,`labelConnect`,void 0),r([d({attribute:`label-refresh`})],T.prototype,`labelRefresh`,void 0),r([d({attribute:`label-save-to-connect`})],T.prototype,`labelSaveToConnect`,void 0),r([d({attribute:`label-error-heading`})],T.prototype,`labelErrorHeading`,void 0),r([d({attribute:`label-generic-error`})],T.prototype,`labelGenericError`,void 0),r([d({attribute:`label-show-details`})],T.prototype,`labelShowDetails`,void 0),r([d({attribute:`label-hide-details`})],T.prototype,`labelHideDetails`,void 0),r([d({attribute:`label-close`})],T.prototype,`labelClose`,void 0),r([h()],T.prototype,`isDirty`,void 0),r([h()],T.prototype,`loading`,void 0),T=r([t(`pk-connect`)],T);var E=class extends m{constructor(...e){super(...e),this.connected=!1,this.connectAction=``,this.disconnectAction=``,this.paramName=``,this.paramValue=``,this.connectRedirect=``,this.disconnectRedirect=``,this.formSelector=`#main-form`,this.skipDirtyWatch=!1,this.labelConnected=`Connected`,this.labelNotConnected=`Not Connected`,this.labelConnect=`Connect`,this.labelDisconnect=`Disconnect`,this.labelSaveToConnect=`Save to connect.`,this.isDirty=!1,this.unwatchDirty=null}static{this.styles=C}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),!this.skipDirtyWatch&&(this.unwatchDirty=l({formSelector:this.formSelector,host:this,onDirty:()=>{this.isDirty=!0}}))}disconnectedCallback(){this.unwatchDirty?.(),this.unwatchDirty=null,super.disconnectedCallback()}submitOAuthAction(e,t){s({formSelector:this.formSelector,host:this,action:e,redirect:t,paramName:this.paramName,paramValue:this.paramValue})}handleConnectClick(e){e.preventDefault(),this.submitOAuthAction(this.connectAction,this.connectRedirect)}handleDisconnectClick(e){e.preventDefault(),this.submitOAuthAction(this.disconnectAction,this.disconnectRedirect)}render(){return this.isDirty?f`
                <div class="heading">
                    <span class="warning with-icon">${this.labelSaveToConnect}</span>
                </div>
            `:this.connected?f`
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
            `:f`
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
        `}};r([d({type:Boolean,reflect:!0})],E.prototype,`connected`,void 0),r([d({attribute:`connect-action`})],E.prototype,`connectAction`,void 0),r([d({attribute:`disconnect-action`})],E.prototype,`disconnectAction`,void 0),r([d({attribute:`param-name`})],E.prototype,`paramName`,void 0),r([d({attribute:`param-value`})],E.prototype,`paramValue`,void 0),r([d({attribute:`connect-redirect`})],E.prototype,`connectRedirect`,void 0),r([d({attribute:`disconnect-redirect`})],E.prototype,`disconnectRedirect`,void 0),r([d({attribute:`form-selector`})],E.prototype,`formSelector`,void 0),r([d({type:Boolean,attribute:`skip-dirty-watch`})],E.prototype,`skipDirtyWatch`,void 0),r([d({attribute:`label-connected`})],E.prototype,`labelConnected`,void 0),r([d({attribute:`label-not-connected`})],E.prototype,`labelNotConnected`,void 0),r([d({attribute:`label-connect`})],E.prototype,`labelConnect`,void 0),r([d({attribute:`label-disconnect`})],E.prototype,`labelDisconnect`,void 0),r([d({attribute:`label-save-to-connect`})],E.prototype,`labelSaveToConnect`,void 0),r([h()],E.prototype,`isDirty`,void 0),E=r([t(`pk-connect-oauth`)],E);var D=[v,T,E,b,_,y,x],O=[`pk-icon`,`pk-button`,`pk-connect`,`pk-connect-oauth`,`pk-dialog`,`pk-state-panel`,`pk-status`];async function k(){n({xmark:e});for(let e of D)if(typeof e!=`function`)throw Error(`Plugin Kit connect constructor missing from bundle`);await Promise.all(O.map(e=>customElements.whenDefined(e)))}k();
//# sourceMappingURL=metrix-sources.js.map