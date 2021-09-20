(function(C,h,y,f,g){"use strict";var R=Object.defineProperty,b=Object.getOwnPropertySymbols,_=Object.prototype.hasOwnProperty,P=Object.prototype.propertyIsEnumerable,v=(l,e,t)=>e in l?R(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t,E=(l,e)=>{for(var t in e||(e={}))_.call(e,t)&&v(l,t,e[t]);if(b)for(var t of b(e))P.call(e,t)&&v(l,t,e[t]);return l};typeof require!="undefined"&&require;const u=["message-2qnXI6","container-2Pjhx-","containerDefault--pIXnN","labelContainer-1BLJti","item-PXvHYJ","channel-2QD9_O","content-1x5b-n","listRow-hutiT_","resultFocused-3aIoYe","item-2J2GlB","actionButton-VzECiy","autocompleteRowVertical-q1K4ky"];let o={},d=[];var L=l=>({onLoad(){this.mouseEventBind=this.mouseEventBind.bind(this),o=this,o.userCache={},o.store=l.persist.store,document.body.addEventListener("mousemove",this.mouseEventBind("mouse")),document.body.addEventListener("mousedown",this.mouseEventBind("click"));const e=f.webpack.findByDisplayName("PeopleListItem");o.getPrimaryColorForAvatar=f.webpack.findByProps("getPrimaryColorForAvatar"),o.UserPopoutAvatar=f.webpack.findByProps("UserPopoutAvatar"),d.push(y.after("render",e.prototype,this.friendRowPatch))},onUnload(){document.body.removeEventListener("mousemove",this.mouseEventBind("mouse")),document.body.removeEventListener("mousedown",this.mouseEventBind("click"));for(let e=0;e<d.length;e++)d[e]();d.length=0},mouseEventBind(e){return function(t){t=t||window.event;let r=t.target||t.srcElement,a=!1;for(let n=0;n<u.length;n++)if(r.classList.contains(u[n])){a=!0;break}for(let n=0;n<4&&!a;n++)if(r.parentElement!=null){r=r.parentElement;for(let c=0;c<u.length&&!a;c++)r.classList.contains(u[c])&&(a=!0)}if(a){const n=r.getBoundingClientRect();let c=t.clientX-n.left,p=t.clientY-n.top;c-=n.width/2,p-=n.height/2,r.style.setProperty(`--${e}X`,`${c}px`),r.style.setProperty(`--${e}Y`,`${p}px`)}}},getCssVar(e){const r=getComputedStyle(document.documentElement).getPropertyValue(`--${e}`).trim().toLowerCase();return r=="1"||r=="true"},friendRowPatch(e,t){var r;try{const a=t.props.children(),n=(r=h.findInReactTree(a,s=>s&&s.user))==null?void 0:r.user,c=o.fetchUser(n.id);if(o.getCssVar("open-profile-via-pfp-friends")){const s=h.findInReactTree(a,m=>m&&m.type&&m.type.displayName&&m.type.displayName==="UserInfo")}let i=null;n.accentColor?(i=n.accentColor,o.cacheUser(n)):c.accentColor?i=c.accentColor:(o.getPrimaryColorForAvatar.getPrimaryColorForAvatar(n.getAvatarURL()).then(s=>o.cacheUser(n,{accentColorGenerated:s})),i=c.autoAccent),i=o._numberToRgba(i);const w=g.React.cloneElement(a.props.children,{role:"listitem","data-list-item-id":`people-list___${n.id}`,tabindex:-1,"data-user-id":n.id,"data-banner-url":c.bannerURL,"data-accent-color":i,style:E({"--user-banner":c.bannerURL?`url("${c.bannerURL}")`:null,"--user-accent-color":i},a.props.children.props.style)});return t.props.children=function(){return w},t}catch(a){return C.log(`[FATAL]: ${a}`),t}},_numberToRgba(e,t=1){const{r,g:a,b:n}=o._numberToRgb(e);return t===1?`rgb(${r}, ${a}, ${n})`:`rgba(${r}, ${a}, ${n}, ${t})`},_numberToRgb(e){const t=(e&16711680)>>>16,r=(e&65280)>>>8,a=e&255;return{r:t,g:r,b:a}},_rgbToNumber(e){return((e[0]<<8)+e[1]<<8)+e[2]},cacheUser(e,t){let r=null,a=!1,n=null;(t==null?void 0:t.accentColorGenerated)&&(n=o._rgbToNumber(t.accentColorGenerated)),o.userCache[e.id]?r=o.userCache[e.id]:(r=o.store[userId],Object.keys(r).length==0&&(r={bannerURL:null,accentColor:null,autoAccent:null})),!(e.bannerURL==null&&e.accentColor==null)&&e.bannerURL!=r.bannerURL&&(r.bannerURL=e.bannerURL,a=!0),e.accentColor&&e.accentColor!=r.accentColor&&(r.accentColor=e.accentColor,a=!0),(t==null?void 0:t.accentColorGenerated)&&n!=r.autoAccent&&(r.autoAccent=n,a=!0),a&&(o.store[e.id]=r,o.userCache[e.id]=r,console.log("[Hyblocker's Theme Helper]",`Cached user "${e.username}#${e.discriminator}"!`))},fetchUser(e){return o.userCache[e]||(o.userCache[e]=o.store[e],Object.keys(o.userCache[e]).length==0&&(o.userCache[e]={bannerURL:null,accentColor:null,autoAccent:null})),o.userCache[e]}});return L})(cumcord.utils.logger,cumcord.utils,cumcord.patcher,cumcord.modules,cumcord.modules.common);
