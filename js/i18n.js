/* Sprache (DE/EN): Browsersprache, Wahl wird nur nach Klick gespeichert */
(function(){
var d=document,R=d.documentElement,L='de';
function stored(){try{var s=localStorage.getItem('lang');return s==='de'||s==='en'?s:null}catch(e){return null}}
function save(v){try{localStorage.setItem('lang',v)}catch(e){}}
var s=stored();
if(s)L=s;else{var n=(navigator.languages&&navigator.languages[0])||navigator.language||'de';L=/^de/i.test(n)?'de':'en'}
var TT={de:'Tim Klingebiel – Maler & Bildhauer',en:'Tim Klingebiel – Painter & Sculptor'};
var DS={de:'Tim Klingebiel – Maler und Bildhauer aus Oldenburg und Gifhorn. Landschaftsmalerei in Öl und Aquarell, Skulpturen aus Sandstein.',en:'Tim Klingebiel – painter and sculptor from Oldenburg and Gifhorn, Germany. Landscape paintings in oil and watercolour, sandstone sculptures.'};
var I=window.I={lang:L,t:function(de,en){return L==='en'?en:de},title:TT,set:set};
R.lang=L;
function attrs(){var a=d.querySelectorAll('*');for(var i=0;i<a.length;i++){var e=a[i],at=e.attributes;for(var j=at.length-1;j>=0;j--){var nm=at[j].name;if(nm.indexOf('data-en-')===0){var k=nm.slice(8),dk='data-de-'+k;if(!e.hasAttribute(dk))e.setAttribute(dk,e.getAttribute(k)||'');e.setAttribute(k,e.getAttribute(L==='en'?nm:dk))}}}}
function meta(){var m=d.querySelector('meta[name=description]');if(m)m.content=DS[L];var o=d.querySelector('meta[property="og:description"]');if(o)o.content=L==='en'?'Landscape paintings in oil and watercolour, sandstone sculptures. Oldenburg and Gifhorn.':'Landschaftsmalerei in Öl und Aquarell, Skulpturen aus Sandstein. Oldenburg und Gifhorn.';var t=d.querySelector('meta[property="og:title"]');if(t)t.content=TT[L];var l=d.querySelector('meta[property="og:locale"]');if(l)l.content=L==='en'?'en_US':'de_DE'}
function btns(){var b=d.querySelectorAll('.lang button');for(var i=0;i<b.length;i++)b[i].setAttribute('aria-pressed',b[i].getAttribute('data-set')===L)}
function apply(){R.lang=L;I.lang=L;attrs();meta();btns();if(!window.__routeTitle)d.title=TT[L]}
function set(v,user){if(v!==L){L=v;if(user)save(v);apply();window.dispatchEvent(new Event('langchange'));window.dispatchEvent(new Event('resize'))}}
function ready(){apply();var b=d.querySelectorAll('.lang button');for(var i=0;i<b.length;i++)b[i].onclick=function(){set(this.getAttribute('data-set'),true)}}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',ready);else ready();
})();
