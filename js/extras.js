/* Startanimation, Laufschrift, Galerie mit Vollbild */
(function(){
'use strict';
var root=document.documentElement,V=['impressum','datenschutz','agb'];
var rm=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches);
function go(){root.classList.add('go')}
/* 1) Startbildschirm: Name wird getippt, Scrollen/Tippen blendet zur Website über */
try{
var intro=document.getElementById('intro');
if(intro&&V.indexOf(location.hash.slice(1))<0){
root.classList.add('intro-on','noscroll');
var txt='Tim Klingebiel',el=document.getElementById('typed'),n=0,ready=false,left=false;
var vapour=function(){
var tEl=document.getElementById('typed'),lg=intro.querySelector('.intro-logo'),W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,2),D=Math.max(2,Math.round(2*dpr)),CS=D/dpr,P=[];
function mk(){var k=document.createElement('canvas');k.width=Math.round(W*dpr);k.height=Math.round(H*dpr);return k}
var cv=mk();cv.setAttribute('aria-hidden','true');cv.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;z-index:102;pointer-events:none;filter:blur(.9px)';
var c=cv.getContext('2d'),oc=mk(),x=oc.getContext('2d',{willReadFrequently:true});x.scale(dpr,dpr);
function grab(rc,tc){var x0=Math.max(0,Math.floor((rc.left-6)*dpr)),y0=Math.max(0,Math.floor((rc.top-6)*dpr)),w=Math.min(oc.width-x0,Math.ceil((rc.width+12)*dpr)),h=Math.min(oc.height-y0,Math.ceil((rc.height+12)*dpr));
if(w<1||h<1)return;var d=x.getImageData(x0,y0,w,h).data;
for(var yy=0;yy<h;yy+=D)for(var xx=0;xx<w;xx+=D){var am=0,bi=0;
for(var j=0;j<D&&yy+j<h;j++)for(var i=0;i<D&&xx+i<w;i++){var q=((yy+j)*w+xx+i)*4;if(d[q+3]>am){am=d[q+3];bi=q}}
if(am>30){var px=(x0+xx)/dpr;P.push({x:px,y:(y0+yy)/dpr,dx:x0+xx,dy:y0+yy,al:am/255,col:tc||'rgb('+d[bi]+','+d[bi+1]+','+d[bi+2]+')',
dl:Math.min(1,Math.max(0,(px-rc.left)/Math.max(1,rc.width)))*.9+Math.random()*.2,life:1.7+Math.random()*1.4,vx:22+Math.random()*34,vy:10+Math.random()*28,ph:Math.random()*6.3,on:false})}}}
var r=tEl.getBoundingClientRect(),cs=getComputedStyle(tEl.parentNode),txt=tEl.textContent;
x.font=cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;x.fillStyle='#101010';
var m=x.measureText(txt),asc=m.fontBoundingBoxAscent,tw=m.width||1;
x.save();x.translate(r.left,asc!==undefined?r.top+asc:r.top+r.height*.8);x.scale(r.width/tw,1);x.fillText(txt,0,0);x.restore();
var lr=lg.getBoundingClientRect();x.save();x.beginPath();x.rect(lr.left,lr.top,lr.width,lr.height);x.clip();x.drawImage(lg,lr.left,lr.top,lr.width,lr.height);
x.globalCompositeOperation='source-atop';x.fillStyle='rgba(0,0,0,.42)';x.fillRect(lr.left,lr.top,lr.width,lr.height);x.restore();
grab(r,'#101010');grab(lr,null);
var rem=mk(),rx=rem.getContext('2d');rx.drawImage(oc,0,0);rem.setAttribute('aria-hidden','true');rem.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;z-index:101;pointer-events:none';
document.body.appendChild(rem);document.body.appendChild(cv);intro.classList.add('vap');
var T0=performance.now();
(function f(now){var t=(now-T0)/1000,alive=false;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,cv.width,cv.height);c.setTransform(dpr,0,0,dpr,0,0);
var last='';
for(var i=0;i<P.length;i++){var p=P[i],k=t-p.dl;
if(k<0){alive=true;continue}
if(!p.on){p.on=true;rx.clearRect(p.dx,p.dy,D,D)}
if(k>=p.life)continue;alive=true;
var u=k/p.life,px=p.x+p.vx*k+Math.sin(p.y*.05+k*2.2+p.ph)*14*u,py=p.y-p.vy*k+Math.cos(p.x*.04+k*1.8+p.ph)*9*u,s=CS*(1+u*1.3);
if(p.col!==last){c.fillStyle=p.col;last=p.col}
c.globalAlpha=p.al*Math.pow(1-u,1.4)*.9;c.fillRect(px-s*.15,py-s*.15,s,s)}
c.globalAlpha=1;if(alive)requestAnimationFrame(f);else{[cv,rem].forEach(function(n){if(n.parentNode)n.parentNode.removeChild(n)})}})(performance.now());
};
var leave=function(){if(left||!ready)return;left=true;root.classList.remove('noscroll');go();
var fin=function(){intro.classList.add('out')};
if(rm)fin();else{try{vapour();setTimeout(fin,150)}catch(err){fin()}}
setTimeout(function(){root.classList.remove('intro-on')},1600)};
var type=function(){if(n<=txt.length){el.textContent=txt.slice(0,n++);setTimeout(type,n===1?600:100)}};
if(rm){el.textContent=txt}else type();
setTimeout(function(){ready=true},800);
['wheel','touchstart','pointerdown','keydown'].forEach(function(ev){window.addEventListener(ev,leave,{passive:true})});
}else go()
}catch(e){go()}
/* 2) Laufschrift, reagiert auf die Scrollgeschwindigkeit */
var rows=[].slice.call(document.querySelectorAll('.vrow'));
if(rows.length){
var st=rows.map(function(r){var t=r.firstElementChild;return{t:t,g:t.firstElementChild,dir:+r.getAttribute('data-dir'),x:0,w:1}});
var build=function(){st.forEach(function(s){while(s.t.children.length>1)s.t.removeChild(s.t.lastChild);
s.w=(s.g.offsetWidth+parseFloat(getComputedStyle(s.g).marginRight))||1;
for(var k=1,c=Math.ceil(innerWidth/s.w)+2;k<c;k++)s.t.appendChild(s.g.cloneNode(true))})};
build();addEventListener('resize',build);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(build);
var ly=scrollY,v=0,flip=1,seen=true;
(function tick(){requestAnimationFrame(tick);var y=scrollY;v+=((y-ly)-v)*.12;ly=y;
if(!seen||rm)return;if(Math.abs(v)>.4)flip=v>0?1:-1;
var f=1+Math.min(Math.abs(v)*.35,10);
st.forEach(function(s){s.x=(((s.x+s.dir*flip*.9*f)%s.w)+s.w)%s.w;s.t.style.transform='translate3d('+(-s.x)+'px,0,0)'})})();
}
/* 3) Galerie: Wischen oder Pfeile blättern weiter, Tippen vergrößert, i blendet Angaben ein */
var gal=document.getElementById('malerei');
if(gal){
var SRC=window.WERKE_SRC||[1,2,3,4,5,6,7,8,9,10].map(function(i){return 'img/werke/w'+i+'.jpg'});
/* Hier Titel, Maße (z. B. '50 × 70 cm²') und Entstehungsjahr eintragen */
var AE=['Northern lights over snowy mountains and a dark lake with a cabin','Mountains and clouds above an alpine lake with a canoe under a pink sky','Red-brown mountain above a blue lake with a cabin and a yellow boat','Tall pines on hills against a pink-violet sky and distant mountains','Snow-covered mountains above a blue lake, framed by trees','Whitewater rapids in front of violet mountains and a golden sky','Watercolour: sailboat at sunset under violet clouds','Watercolour: steep coast with orange cliffs by the sea','Watercolour: mountain lake in a green valley','Watercolour: village on a lake with boats in front of mountains'],TE={'Öl':'Oil','Aquarell':'Watercolour'};
var W=[
{alt:'Polarlichter über verschneiten Bergen und einem dunklen See mit Hütte',titel:'Polarlichter',technik:'Öl',masse:'60 × 80 cm²',jahr:'2026'},
{alt:'Berge und Wolken über einem Bergsee mit Kanu unter rosa Himmel',titel:'You and Me in Nature',technik:'Öl',masse:'29 × 39 cm²',jahr:'2025'},
{alt:'Rotbrauner Berg über einem blauen See mit Hütte und gelbem Boot',titel:'Das gelbe Sportboot',technik:'Öl',masse:'60 × 80 cm²',jahr:'2025'},
{alt:'Hohe Kiefern auf Hügeln vor rosa-violettem Himmel und fernen Bergen',titel:'Der geheimnisvolle Wald',technik:'Öl',masse:'60 × 80 cm²',jahr:'2026'},
{alt:'Schneebedeckte Berge über einem blauen See, umrahmt von Bäumen',titel:'Big Mountains',technik:'Öl',masse:'29 × 39 cm²',jahr:'2025'},
{alt:'Wildwasser mit Stromschnellen vor violetten Bergen und goldenem Himmel',titel:'Die Stromschnellen',technik:'Öl',masse:'60 × 80 cm²',jahr:'2026'},
{alt:'Aquarell: Segelboot im Sonnenuntergang unter violetten Wolken',titel:'You and Me sailing into the Sunset',technik:'Aquarell',masse:'19,5 × 28 cm²',jahr:'2022'},
{alt:'Aquarell: Steilküste mit orangen Felsen am Meer',titel:'You and Me am roten Kliff',technik:'Aquarell',masse:'23 × 26 cm²',jahr:'2021'},
{alt:'Aquarell: Bergsee in einem grünen Tal',titel:'You and Me in der saftig grünen Landschaft',technik:'Aquarell',masse:'20 × 27 cm²',jahr:'2023'},
{alt:'Aquarell: Dorf am See mit Booten vor Bergen',titel:'You and Me in Lago di Como',technik:'Aquarell',masse:'37 × 29 cm²',jahr:'2024'}
].map(function(w,i){w.src=SRC[i];w.alt_en=AE[i];return w});
var N=W.length,stage=document.getElementById('stage'),cnt=document.getElementById('gCnt'),cur=0,tgt=0,gv=true,sw=0;
var raw=0,moved=false,drag=false;
function cap(w){var d=document.createElement('div'),b=document.createElement('b'),s=document.createElement('span');d.className='cap';
b.textContent=w.titel||I.t('Titel folgt','Title to follow');s.textContent=[I.t(w.technik,TE[w.technik]||w.technik),w.masse?I.t(w.masse,w.masse.replace(',','.')):I.t('Maße folgen','Dimensions to follow'),w.jahr||I.t('Jahr folgt','Year to follow')].join(' · ');d.appendChild(b);d.appendChild(s);return d}
function ib(){var b=document.createElement('button');b.type='button';b.className='si';b.textContent='i';b.setAttribute('aria-label',I.t('Informationen zum Bild','Image information'));return b}
function idx(){return((Math.round(cur)%N)+N)%N}
/* tgt läuft endlos weiter, damit das Karussell nach dem letzten Bild nahtlos zum ersten springt */
function goTo(i){var d=i-tgt;d-=N*Math.round(d/N);tgt=Math.round(tgt+d)}
var slides=W.map(function(w,i){var s=document.createElement('figure'),im=new Image(),b=ib();s.className='sl';
im.decoding='async';if(i>2&&!window.WERKE_SRC)im.loading='lazy';if(!window.WERKE_SRC){im.srcset=w.src.replace('.jpg','-s.jpg')+' 900w,'+w.src+' 1600w';im.sizes='(max-width:700px) 90vw, 76vw'}im.src=w.src;im.alt=I.t(w.alt,w.alt_en);im.draggable=false;var sh=document.createElement('div');sh.className='sh';s._sh=sh;s.appendChild(im);s.appendChild(sh);s.appendChild(cap(w));s.appendChild(b);
b.tabIndex=-1;b.onclick=function(e){e.stopPropagation();s.classList.toggle('info')};
s.addEventListener('click',function(){if(moved){moved=false;return}if(i===idx())openLb(i);else goTo(i)});stage.appendChild(s);return s});
function layout(){if(!sw)sw=slides[0].offsetWidth;
slides.forEach(function(s,i){var d=i-cur;d-=N*Math.round(d/N);var a=Math.abs(d),sg=d<0?-1:1;
if(a>2.6){s.style.opacity=0;s.style.pointerEvents='none';return}
var x=sg*sw*(.62*Math.min(a,1)+.4*Math.max(a-1,0)),ry=-Math.max(-1.4,Math.min(1.4,d))*16,z=-Math.min(a,2)*140;
s.style.opacity=a<=.15?1:a<=1?1-.5*(a-.15)/.85:Math.max(0,.5-(a-1)*.5);s.style.pointerEvents='auto';s.style.zIndex=100-Math.round(a*10);
s.style.transform='translate(-50%,-50%) translate3d('+x+'px,0,'+z+'px) rotateY('+ry+'deg) scale('+(1-Math.min(a,2.5)*.1)+')';
s._sh.style.opacity=Math.max(0,Math.min(a-.1,1))*.18;var on=a<.5;s.classList.toggle('act',on);if(s._on!==on){s._on=on;var ib=s.querySelector('.si');if(ib){ib.tabIndex=on?0:-1}s.setAttribute('aria-hidden',on?'false':'true')}});
cnt.textContent=(idx()+1)+' / '+N}
addEventListener('resize',function(){sw=0});
new IntersectionObserver(function(e){gv=e[0].isIntersecting},{rootMargin:'300px'}).observe(gal);
var lt=performance.now();
(function loop(now){requestAnimationFrame(loop);var dt=Math.min(.05,(now-lt)/1000||0);lt=now;if(!gv)return;
raw=rm||drag?tgt:raw+(tgt-raw)*(1-Math.exp(-dt*8));if(Math.abs(tgt-raw)<.0005)raw=tgt;cur=raw;layout()})(performance.now());
/* Wischen auf dem Karussell */
var sx0=0,sy0=0,lock=null,t0=0,pid=null;
stage.addEventListener('pointerdown',function(e){if(e.target.closest('.si'))return;sx0=e.clientX;sy0=e.clientY;lock=null;t0=Math.round(tgt);pid=e.pointerId;moved=false});
stage.addEventListener('pointermove',function(e){if(pid!==e.pointerId)return;var dx=e.clientX-sx0,dy=e.clientY-sy0;
if(lock===null&&(Math.abs(dx)>8||Math.abs(dy)>8)){lock=Math.abs(dx)>Math.abs(dy)?'h':'v';if(lock==='h'){drag=true;try{stage.setPointerCapture(e.pointerId)}catch(x){}}}
if(lock!=='h')return;moved=true;tgt=t0-dx/((sw||slides[0].offsetWidth)*.62)});
function endSw(e){if(pid!==e.pointerId)return;pid=null;if(lock!=='h')return;var dx=e.clientX-sx0,cr=Math.round(tgt);lock=null;drag=false;raw=tgt;
tgt=cr!==t0?cr:(dx<-40?t0+1:dx>40?t0-1:t0);setTimeout(function(){moved=false},50)}
/* Waagrechtes Wischen auf dem Trackpad, senkrechtes Scrollen läuft normal weiter */
var wx=0,wt=0;stage.addEventListener('wheel',function(e){if(Math.abs(e.deltaX)<=Math.abs(e.deltaY))return;e.preventDefault();
var now=performance.now();if(now-wt<350){wt=now;return}wx+=e.deltaX;if(Math.abs(wx)>30){goTo(idx()+(wx>0?1:-1));wx=0;wt=now}},{passive:false});
stage.addEventListener('pointerup',endSw);stage.addEventListener('pointercancel',endSw);
document.getElementById('gPrev').onclick=function(){goTo(idx()-1)};
document.getElementById('gNext').onclick=function(){goTo(idx()+1)};
/* Vollbild */
var lb=document.createElement('div'),lbi,lbc,li=0;lb.className='lb';lb.hidden=true;
lb.innerHTML='<img alt=""><button type="button" class="lbx" aria-label="Schließen" data-en-aria-label="Close"><svg viewBox="0 0 24 24" width="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg></button>';
lb.appendChild(ib());document.body.appendChild(lb);lbi=lb.querySelector('img');
function showLb(i){li=(i+N)%N;var w=W[li];lbi.src=w.src;lbi.alt=I.t(w.alt,w.alt_en);if(lbc)lb.removeChild(lbc);lbc=cap(w);lb.appendChild(lbc)}
function openLb(i){showLb(i);lb.classList.remove('info');lb.hidden=false;root.classList.add('noscroll')}
function closeLb(){lb.hidden=true;root.classList.remove('noscroll')}
lb.addEventListener('click',function(e){if(e.target.closest('.si')){lb.classList.toggle('info');return}closeLb()});
addEventListener('keydown',function(e){
if(!lb.hidden){if(e.key==='Escape')closeLb();else if(e.key==='ArrowRight')showLb(li+1);else if(e.key==='ArrowLeft')showLb(li-1);return}
if(gv&&!root.classList.contains('intro-on')){if(e.key==='ArrowRight')goTo(idx()+1);else if(e.key==='ArrowLeft')goTo(idx()-1)}});
}
addEventListener('langchange',function(){slides.forEach(function(s,i){var w=W[i];s.querySelector('img').alt=I.t(w.alt,w.alt_en);s.replaceChild(cap(w),s.querySelector('.cap'));s.querySelector('.si').setAttribute('aria-label',I.t('Informationen zum Bild','Image information'))});lb.querySelector('.lbx').setAttribute('aria-label',I.t('Schließen','Close'));lb.querySelector('.si').setAttribute('aria-label',I.t('Informationen zum Bild','Image information'));if(!lb.hidden)showLb(li)});
lb.querySelector('.lbx').setAttribute('aria-label',I.t('Schließen','Close'));
/* 4) Chili: an der Spitze schwenkbar, Logo: verschiebbar mit Rückfederung */
var ch=document.querySelector('.chili img');
if(ch){var box=ch.parentNode,ang=0,av=0,ta=0,dg=false,l2=performance.now();
var mv=function(e){var r=box.getBoundingClientRect(),a=Math.atan2(-(e.clientX-(r.left+r.width*.53)),e.clientY-(r.top+r.height*.035));ta=Math.max(-.7,Math.min(.7,a*.55))};
ch.addEventListener('pointerdown',function(e){dg=true;ch.setPointerCapture(e.pointerId);mv(e)});
ch.addEventListener('pointermove',function(e){if(dg)mv(e)});
['pointerup','pointercancel'].forEach(function(t){ch.addEventListener(t,function(){dg=false})});
(function t(now){requestAnimationFrame(t);var dt=Math.min(.04,(now-l2)/1000||0);l2=now;
if(!dg){var rest=rm?0:.012*Math.sin(now/1900);av+=(-45*(ang-rest)-2.6*av)*dt;ang+=av*dt}else{ang+=(ta-ang)*Math.min(1,dt*10);av=(ta-ang)*8}
ch.style.transform='rotate('+ang+'rad) scale(1.12,1)'})(performance.now());
}
var lg=document.querySelector('.tk');
if(lg){var X=0,Y=0,VX=0,VY=0,ld=false,sx=0,sy=0,l3=performance.now();
lg.addEventListener('pointerdown',function(e){ld=true;lg.setPointerCapture(e.pointerId);sx=e.clientX-X;sy=e.clientY-Y});
lg.addEventListener('pointermove',function(e){if(ld){var nx=e.clientX-sx,ny=e.clientY-sy;VX=(nx-X)*30;VY=(ny-Y)*30;X=nx;Y=ny}});
['pointerup','pointercancel'].forEach(function(t){lg.addEventListener(t,function(){ld=false})});
(function t(now){requestAnimationFrame(t);var dt=Math.min(.04,(now-l3)/1000||0);l3=now;
if(!ld){VX+=(-60*X-7*VX)*dt;VY+=(-60*Y-7*VY)*dt;X+=VX*dt;Y+=VY*dt}
lg.style.transform='translate3d('+X+'px,'+Y+'px,0) rotate('+(X*.06)+'deg)'})(performance.now());
}
})();
