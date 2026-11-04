document.documentElement.classList.add('js');
var K='cookieChoice',mem=null,cb=document.getElementById('cb'),sts=document.querySelectorAll('[data-cbst]');
function get(){try{return localStorage.getItem(K)||mem}catch(e){return mem}}
function put(v){mem=v;try{v?localStorage.setItem(K,v):localStorage.removeItem(K)}catch(e){}}
function show(){var c=get();cb.hidden=!!c;var x=c?I.t('Aktuelle Auswahl: ','Current choice: ')+(c==='alle akzeptiert'?I.t('alle akzeptiert','accept all'):I.t('nur notwendige','necessary only'))+'.':I.t('Noch keine Auswahl getroffen.','No choice made yet.');for(var i=0;i<sts.length;i++)sts[i].textContent=x}
document.getElementById('cbA').onclick=function(){put('alle akzeptiert');show()};
document.getElementById('cbR').onclick=function(){put('nur notwendige');show()};
[].forEach.call(document.querySelectorAll('[data-cbrev]'),function(b){b.onclick=function(){put(null);show()}});
var V=['impressum','datenschutz','agb'],LT={impressum:['Impressum','Legal Notice'],datenschutz:['Datenschutz','Privacy Policy'],agb:['AGB','Terms and Conditions']},rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
function ttl(v){window.__routeTitle=!!v;document.title=v?I.t(LT[v][0],LT[v][1])+' – Tim Klingebiel':I.title[I.lang]}
function route(){var h=location.hash.slice(1),v=V.indexOf(h)>-1?h:'';document.body.classList.toggle('l',!!v);
var a=document.querySelectorAll('.legal');for(var i=0;i<a.length;i++)a[i].classList.toggle('on',a[i].id===v);
ttl(v);if(v||h==='start')window.scrollTo({top:0,behavior:'instant'})}
function go(){if(document.startViewTransition&&!rm){document.startViewTransition(route)}else route()}
var tels=[].slice.call(document.querySelectorAll('.tel'));
function tp(b,o){var p=b.nextElementSibling;p.hidden=!o;b.setAttribute('aria-expanded',o)}
tels.forEach(function(b){b.onclick=function(e){e.stopPropagation();tp(b,b.nextElementSibling.hidden)}});
document.addEventListener('click',function(e){tels.forEach(function(b){if(!b.nextElementSibling.contains(e.target))tp(b,false)})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')tels.forEach(function(b){tp(b,false)})});
window.addEventListener('hashchange',go);route();show();window.addEventListener('langchange',function(){show();ttl(V.indexOf(location.hash.slice(1))>-1?location.hash.slice(1):'')});
var so=document.querySelectorAll('.sr');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});so.forEach(function(e){io.observe(e)})}else so.forEach(function(e){e.classList.add('in')});
