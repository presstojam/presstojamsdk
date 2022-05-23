import{reactive as t,createApp as e}from"vue";let n={};var r={regSettings:function(t,e=null){e?n[e]=t:n=t},getSettings:function(t){return n[t]},getModelSettings:function(t,e){return n.models&&n.models[t]&&n.models[t][e]?n.models[t][e]:{}}};let s,i={};var o={initSettings(){const t=r.getSettings("client");if(!t.url)throw"No URL defined for client";if(s=t.url,t.custom_headers)for(let e in t.custom_headers)i[e]=t.custom_headers[e]},run(t,e){return s||this.initSettings(),e.mode="cors",e.cache="no-cache",e.credentials="include",e["Content-Type"]="application/json",e.headers=i,fetch(s+t,e).then((t=>{if(t.ok)return t.json();throw t}))},get(t,e){if(e){const n=new URLSearchParams;for(let t in e)Array.isArray(e[t])||"object"==typeof e[t]&&null!==e[t]?n.append(t,JSON.stringify(e[t])):n.append(t,e[t]);-1==t.indexOf("?")?t+="?":t+="&",t+=n.toString()}let n={method:"GET"};return this.run(t,n)},getprimary(t,e){return this.get(t,e)},post(t,e){let n={method:"POST"};return n.body=JSON.stringify(e),this.run(t,n)},put(t,e){let n={method:"PUT"};return n.body=JSON.stringify(e),this.run(t,n)},patch(t,e){let n={method:"PATCH"};return n.body=JSON.stringify(e),this.run(t,n)},delete(t,e){let n={method:"DELETE"};return n.body=JSON.stringify(e),this.run(t,n)}};function a(t,e){void 0===e&&(e={});var n=e.insertAt;if(t&&"undefined"!=typeof document){var r=document.head||document.getElementsByTagName("head")[0],s=document.createElement("style");s.type="text/css","top"===n&&r.firstChild?r.insertBefore(s,r.firstChild):r.appendChild(s),s.styleSheet?s.styleSheet.cssText=t:s.appendChild(document.createTextNode(t))}}a("\n.ptj-error {\r\n  color : red;\n}\r\n");window.onpopstate=function(){h.convertFromURL(),function(){let t=[];h.model?h.hasChange("route")?(t.push(p()),t.push(c())):h.hasChange("model")&&t.push(c()):t.push(p().then((()=>(h.apply(function(){for(let t in l.cats)for(let e of l.cats[t])if(e.default)return e}()),c()))));Promise.all(t).then((()=>{h.model,"get"==h.state||"parent"==h.state?l.component="ptj-repo":"primary"==h.state?l.component="ptj-primary":"login"==h.state&&(l.component="ptj-account-handler")})).catch((t=>console.log(t)))}()};const l=t({cats:{},routes:[],component:"",title:"",name:"",route:{children:[],parent:null,perms:[]}}),h=new class{constructor(){this._route="",this._model="",this._state="",this._key=0,this._to="",this._params={},this._settings={},this._base="/",this._default=!1,this._changes={};Object.keys(this).forEach((t=>{"_"==t[0]&&Object.defineProperty(this,t.substring(1),{get:function(){return this[t]},set:function(e){this._changes[t.substring(1)]=this[t],this[t]=e}})})),this.action_map={post:"-create",put:"-update",delete:"-delete",login:"-login",logout:"-logout",primary:"-primary",parent:"-parent",get:""}}get id(){return this.model+"-"+this.state+"-"+this.to}hasChange(t){return this._changes.hasOwnProperty(t)}reset(){this.route="",this.model="",this.state="",this.key=0,this.to="",this.params={},this.settings={},this._changes={}}resetChanges(){this._changes={}}convertToURL(){let t=this._base+this.route+"/"+this.model+this.action_map[this.state];this.key&&(t+="-"+this.key),this.to&&(t+="-to-"+this.to);let e=[];for(const t in this.params)"Array"==typeof this.params[t]||"Object"==typeof this.params[t]?e.push(t+"="+JSON.stringify(this.params[t])):e.push(t+"="+this.params[t]);return e.length>0&&(t+="?"+e.join("&")),t}convertFromURL(t){t||(t=new URL(window.location.href));let e=t.pathname.replace(this.base,"");if(e=e.replace(/^\/+|\/+$/g,""),!e)return;let n=e.split("/");this.route=n[0],e=n[1];const r=this;t.searchParams.forEach((function(t,e){r.params[e]=t.indexOf(",")>-1?t.split(","):t})),n=e.split("-to-"),n.length>1&&(this.to=n[1],e=n[0]),n=e.split("-");let s=n[n.length-1];if("first"==s?(this.key=s,n.pop()):isNaN(s)||(this.key=s,n.pop()),0==n.length)throw new Error("Can't convert this url string: "+e);this.state="get";for(let t in this.action_map)if(this.action_map[t]=="-"+n[n.length-1]){this.state=t,n.pop();break}this.model=n.join("-")}getAll(){return{route:this.route,model:this.model,state:this.state,key:this.key,to:this.to,params:this.params,base:this.base,default:this.default}}apply(t){for(let e in t)this[e]=t[e]}};function p(t){return l.cats={},l.routes=[],l.route={children:[],parent:null,perms:[]},l.model=null,o.get("/nav/site-map").then((t=>{for(let e in t)for(let n in t[e]){const r={model:n,state:t[e][n].state};t[e][n].default&&(r.default=!0),r.route=n,l.routes.push(r),l.cats[e]||(l.cats[e]=[]),l.cats[e].push(r)}}))}function c(){return o.get("/nav/route-points/"+h.route+"/"+h.model).then((t=>{l.route.children=t.children,l.route.perms=t.perms,l.route.parent=t.parent,l.title=t.title,l.name=t.name,t.dictionary})).catch((t=>console.log(t)))}a("\n.ptj-multiple-select-val[data-v-51b18f4e] {\r\n    display : inline-block;\r\n    border : 1px solid green;\r\n    margin-left : 2px;\r\n    margin-right : 2px;\r\n    padding : 2px;\r\n    background-color : green;\n}\n.ptj-multiple-select-val-remove[data-v-51b18f4e] {\r\n    color : red;\n}\n.ptj-multiple-select-display[data-v-51b18f4e] {\r\n    position :relative;\r\n    background-color : #fff;\r\n    border : 1px solid #cdcdcd;\r\n    min-height : 35px;\n}\r\n\r\n");a("\n.ptj-multiple-select-val[data-v-5b05457d] {\r\n    display : inline-block;\r\n    border : 1px solid green;\r\n    margin-left : 2px;\r\n    margin-right : 2px;\r\n    padding : 2px;\r\n    background-color : green;\n}\n.ptj-multiple-select-val-remove[data-v-5b05457d] {\r\n    color : red;\n}\n.ptj-multiple-select-arrow[data-v-5b05457d] {\r\n    position :absolute;\r\n    right : 2px;\r\n    top : 3px;\n}\n.ptj-multiple-select-display[data-v-5b05457d] {\r\n    position :relative;\r\n    background-color : #fff;\r\n    border : 1px solid #cdcdcd;\r\n    min-height : 35px;\n}\n.ptj-multiple-select-options li[data-v-5b05457d] {\r\n    list-style: none;\r\n    cursor: pointer;\r\n    margin-top : 2px;\r\n    border : 1px solid #cdcdcd;\r\n    background-color : #fff;\n}\n.ptj-multiple-select-options li[data-v-5b05457d]:hover {\r\n    background-color : #f9f9fb;\r\n    transition : background-color .2s ease-out,border .2s ease-out;\n}\r\n"),t({init:!1,login:!1,user:"public"});var d={runApp:function(t,n){r.regSettings(n);const s=e(PTJRoot);return s.mount(t),s}};export{d as default};
//# sourceMappingURL=ptj.esm.js.map
