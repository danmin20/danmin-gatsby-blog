(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4310,4853],{89103:function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.useCopyToClipboard=void 0;var o=n(r(36012)),a=r(27378),u=r(99498);t.useCopyToClipboard=function(){var e=(0,u.useMountedState)(),t=(0,a.useState)({value:void 0,error:void 0,noUserInteraction:!0}),r=t[0],n=t[1];return[r,(0,a.useCallback)((function(t){if(e()){var r=!1,a="";try{if("string"!==typeof t&&"number"!==typeof t){var u=new Error("Cannot copy typeof ".concat(typeof t," to clipboard, must be a string"));return void n({value:t,error:u,noUserInteraction:!0})}if(""===t){u=new Error("Cannot copy empty string to clipboard.");return void n({value:t,error:u,noUserInteraction:!0})}a=t.toString(),r=(0,o.default)(a),n({value:a,error:void 0,noUserInteraction:r})}catch(u){u instanceof Error&&n({value:a,error:u,noUserInteraction:r})}}}),[])]}},57334:function(e,t,r){"use strict";t.m=void 0;var n=r(89103);Object.defineProperty(t,"m",{enumerable:!0,get:function(){return n.useCopyToClipboard}})},99498:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(27902);Object.defineProperty(t,"useMountedState",{enumerable:!0,get:function(){return n.useMountedState}})},27902:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.useMountedState=void 0;var n=r(27378);t.useMountedState=function(){var e=n.useRef(!1),t=n.useCallback((function(){return e.current}),[]);return n.useEffect((function(){return e.current=!0,function(){e.current=!1}})),t}},36012:function(e,t,r){"use strict";var n=r(93185),o={"text/plain":"Text","text/html":"Url",default:"Text"};e.exports=function(e,t){var r,a,u,i,c,l,f=!1;t||(t={}),r=t.debug||!1;try{if(u=n(),i=document.createRange(),c=document.getSelection(),(l=document.createElement("span")).textContent=e,l.style.all="unset",l.style.position="fixed",l.style.top=0,l.style.clip="rect(0, 0, 0, 0)",l.style.whiteSpace="pre",l.style.webkitUserSelect="text",l.style.MozUserSelect="text",l.style.msUserSelect="text",l.style.userSelect="text",l.addEventListener("copy",(function(n){if(n.stopPropagation(),t.format)if(n.preventDefault(),"undefined"===typeof n.clipboardData){r&&console.warn("unable to use e.clipboardData"),r&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var a=o[t.format]||o.default;window.clipboardData.setData(a,e)}else n.clipboardData.clearData(),n.clipboardData.setData(t.format,e);t.onCopy&&(n.preventDefault(),t.onCopy(n.clipboardData))})),document.body.appendChild(l),i.selectNodeContents(l),c.addRange(i),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");f=!0}catch(s){r&&console.error("unable to copy using execCommand: ",s),r&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(t.format||"text",e),t.onCopy&&t.onCopy(window.clipboardData),f=!0}catch(s){r&&console.error("unable to copy using clipboardData: ",s),r&&console.error("falling back to prompt"),a=function(e){var t=(/mac os x/i.test(navigator.userAgent)?"\u2318":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}("message"in t?t.message:"Copy to clipboard: #{key}, Enter"),window.prompt(a,e)}}finally{c&&("function"==typeof c.removeRange?c.removeRange(i):c.removeAllRanges()),l&&document.body.removeChild(l),u()}return f}},88342:function(e){e.exports=function(e,t){for(var r=-1,n=null==e?0:e.length;++r<n;)if(!t(e[r],r,e))return!1;return!0}},86835:function(e,t,r){var n=r(52033);e.exports=function(e,t){var r=!0;return n(e,(function(e,n,o){return r=!!t(e,n,o)})),r}},17646:function(e){e.exports=function(e){return function(t){return null==e?void 0:e[t]}}},39356:function(e,t,r){var n=r(17646)({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"});e.exports=n},47479:function(e,t,r){var n=r(88342),o=r(86835),a=r(89278),u=r(19785),i=r(57535);e.exports=function(e,t,r){var c=u(e)?n:o;return r&&i(e,t,r)&&(t=void 0),c(e,a(t,3))}},39540:function(e,t,r){var n=r(65567),o=r(39356),a=/&(?:amp|lt|gt|quot|#39);/g,u=RegExp(a.source);e.exports=function(e){return(e=n(e))&&u.test(e)?e.replace(a,o):e}},11453:function(e,t,r){"use strict";function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,a=[],u=!0,i=!1;try{for(r=r.call(e);!(u=(n=r.next()).done)&&(a.push(n.value),!t||a.length!==t);u=!0);}catch(c){i=!0,o=c}finally{try{u||null==r.return||r.return()}finally{if(i)throw o}}return a}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return n(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}t.default=void 0;var a,u=(a=r(27378))&&a.__esModule?a:{default:a},i=r(30194),c=r(15817),l=r(41842);var f={};function s(e,t,r,n){if(e&&i.isLocalURL(t)){e.prefetch(t,r,n).catch((function(e){0}));var o=n&&"undefined"!==typeof n.locale?n.locale:e&&e.locale;f[t+"%"+r+(o?"%"+o:"")]=!0}}var p=function(e){var t,r=!1!==e.prefetch,n=c.useRouter(),a=u.default.useMemo((function(){var t=o(i.resolveHref(n,e.href,!0),2),r=t[0],a=t[1];return{href:r,as:e.as?i.resolveHref(n,e.as):a||r}}),[n,e.href,e.as]),p=a.href,d=a.as,v=e.children,y=e.replace,m=e.shallow,b=e.scroll,g=e.locale;"string"===typeof v&&(v=u.default.createElement("a",null,v));var h=(t=u.default.Children.only(v))&&"object"===typeof t&&t.ref,C=o(l.useIntersection({rootMargin:"200px"}),2),w=C[0],E=C[1],x=u.default.useCallback((function(e){w(e),h&&("function"===typeof h?h(e):"object"===typeof h&&(h.current=e))}),[h,w]);u.default.useEffect((function(){var e=E&&r&&i.isLocalURL(p),t="undefined"!==typeof g?g:n&&n.locale,o=f[p+"%"+d+(t?"%"+t:"")];e&&!o&&s(n,p,d,{locale:t})}),[d,p,E,g,r,n]);var S={ref:x,onClick:function(e){t.props&&"function"===typeof t.props.onClick&&t.props.onClick(e),e.defaultPrevented||function(e,t,r,n,o,a,u,c){("A"!==e.currentTarget.nodeName.toUpperCase()||!function(e){var t=e.currentTarget.target;return t&&"_self"!==t||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)&&i.isLocalURL(r))&&(e.preventDefault(),t[o?"replace":"push"](r,n,{shallow:a,locale:c,scroll:u}))}(e,n,p,d,y,m,b,g)},onMouseEnter:function(e){t.props&&"function"===typeof t.props.onMouseEnter&&t.props.onMouseEnter(e),i.isLocalURL(p)&&s(n,p,d,{priority:!0})}};if(e.passHref||"a"===t.type&&!("href"in t.props)){var M="undefined"!==typeof g?g:n&&n.locale,I=n&&n.isLocaleDomain&&i.getDomainLocale(d,M,n&&n.locales,n&&n.domainLocales);S.href=I||i.addBasePath(i.addLocale(d,M,n&&n.defaultLocale))}return u.default.cloneElement(t,S)};t.default=p},41842:function(e,t,r){"use strict";function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,a=[],u=!0,i=!1;try{for(r=r.call(e);!(u=(n=r.next()).done)&&(a.push(n.value),!t||a.length!==t);u=!0);}catch(c){i=!0,o=c}finally{try{u||null==r.return||r.return()}finally{if(i)throw o}}return a}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(r);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return n(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}Object.defineProperty(t,"__esModule",{value:!0}),t.useIntersection=function(e){var t=e.rootRef,r=e.rootMargin,n=e.disabled||!i,f=a.useRef(),s=o(a.useState(!1),2),p=s[0],d=s[1],v=o(a.useState(t?t.current:null),2),y=v[0],m=v[1],b=a.useCallback((function(e){f.current&&(f.current(),f.current=void 0),n||p||e&&e.tagName&&(f.current=function(e,t,r){var n=function(e){var t,r={root:e.root||null,margin:e.rootMargin||""},n=l.find((function(e){return e.root===r.root&&e.margin===r.margin}));n?t=c.get(n):(t=c.get(r),l.push(r));if(t)return t;var o=new Map,a=new IntersectionObserver((function(e){e.forEach((function(e){var t=o.get(e.target),r=e.isIntersecting||e.intersectionRatio>0;t&&r&&t(r)}))}),e);return c.set(r,t={id:r,observer:a,elements:o}),t}(r),o=n.id,a=n.observer,u=n.elements;return u.set(e,t),a.observe(e),function(){if(u.delete(e),a.unobserve(e),0===u.size){a.disconnect(),c.delete(o);var t=l.findIndex((function(e){return e.root===o.root&&e.margin===o.margin}));t>-1&&l.splice(t,1)}}}(e,(function(e){return e&&d(e)}),{root:y,rootMargin:r}))}),[n,y,r,p]);return a.useEffect((function(){if(!i&&!p){var e=u.requestIdleCallback((function(){return d(!0)}));return function(){return u.cancelIdleCallback(e)}}}),[p]),a.useEffect((function(){t&&m(t.current)}),[t]),[b,p]};var a=r(27378),u=r(72878),i="undefined"!==typeof IntersectionObserver;var c=new Map,l=[]},79894:function(e,t,r){e.exports=r(11453)},93185:function(e){e.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,r=[],n=0;n<e.rangeCount;n++)r.push(e.getRangeAt(n));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||r.forEach((function(t){e.addRange(t)})),t&&t.focus()}}}}]);