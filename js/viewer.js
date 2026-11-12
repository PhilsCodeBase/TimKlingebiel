/* 3D-Ansicht der Sandsteinskulptur: eigener WebGL2-Renderer, keine externen Bibliotheken */
(function(){
'use strict';
var el=document.getElementById('sk3d');if(!el)return;
/* Maße in cm: HIER die echten Maße der Skulptur eintragen */
var DIM={L:12,W:12,H:8};
var cv=document.createElement('canvas');el.insertBefore(cv,el.firstChild);
var gl=cv.getContext('webgl2',{antialias:true,alpha:true});
if(!gl){el.insertAdjacentHTML('beforeend','<p class="skerr">Die 3D-Ansicht wird von diesem Browser nicht unterstützt.</p>');return}
function h3(x,y,z){var n=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return n-Math.floor(n)}
function lp(a,b,t){return a+(b-a)*t}
function sm(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)}
function vn(x,y,z){var xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi;
xf=xf*xf*(3-2*xf);yf=yf*yf*(3-2*yf);zf=zf*zf*(3-2*zf);
return lp(lp(lp(h3(xi,yi,zi),h3(xi+1,yi,zi),xf),lp(h3(xi,yi+1,zi),h3(xi+1,yi+1,zi),xf),yf),lp(lp(h3(xi,yi,zi+1),h3(xi+1,yi,zi+1),xf),lp(h3(xi,yi+1,zi+1),h3(xi+1,yi+1,zi+1),xf),yf),zf)}
/* Netz: Würfeloberfläche, zu weichem Block mit Mulde verformt */
var N=110,idx={},pos=[],tr=[];
function vid(x,y,z){var k=x+','+y+','+z,v=idx[k];if(v===undefined){v=pos.length/3;idx[k]=v;pos.push(x,y,z)}return v}
var AX=[[0,1,2],[1,2,0],[2,0,1]];
for(var f=0;f<3;f++)for(var s=-1;s<=1;s+=2){var A=AX[f][0],U=AX[f][1],V=AX[f][2],g=[];
for(var i=0;i<=N;i++){g[i]=[];for(var j=0;j<=N;j++){var c=[0,0,0];c[A]=s*N/2;c[U]=i-N/2;c[V]=j-N/2;g[i][j]=vid(c[0],c[1],c[2])}}
for(i=0;i<N;i++)for(j=0;j<N;j++){var p=g[i][j],q=g[i+1][j],r=g[i+1][j+1],t=g[i][j+1];if(s>0)tr.push(p,q,r,p,r,t);else tr.push(p,r,q,p,t,r)}}
var nv=pos.length/3,P=new Float32Array(nv*3),BW=new Float32Array(nv),TRI=new Uint32Array(tr);
var K=38/Math.max(DIM.L,DIM.W),a=DIM.L*K/2,b=DIM.H*K/2,cc=DIM.W*K/2,n=3.6,bx=.4*Math.min(DIM.L,DIM.W)*K,cx=.06*a,cz=-.1*cc,D=.5*DIM.H*K;
for(i=0;i<nv;i++){var x=pos[3*i]/N,y=pos[3*i+1]/N,z=pos[3*i+2]/N,l=Math.sqrt(x*x+y*y+z*z),dx=x/l,dy=y/l,dz=z/l;
var rd=Math.pow(Math.pow(Math.abs(dx)/a,n)+Math.pow(Math.abs(dy)/b,n)+Math.pow(Math.abs(dz)/cc,n),-1/n);
var px=dx*rd,py=dy*rd,pz=dz*rd,tt=py/b,tp=1+.08*tt,an=.1*tt,ca=Math.cos(an),sa=Math.sin(an),qx=px*ca-pz*sa,qz=px*sa+pz*ca;px=qx*tp;pz=qz*tp;
var w=vn(px*.08+3,py*.08,pz*.08)*2-1,m=vn(px*.3,py*.3+7,pz*.3)*2-1,st=vn(px*.9+5,py*.07,pz*.9)*2-1,d=w+.3*m+.22*st;
px+=dx*d;py+=dy*d;pz+=dz*d;
var rr=Math.sqrt((px-cx)*(px-cx)+(pz-cz)*(pz-cz))/bx,wg=Math.exp(-Math.pow(rr,2.4)*2)*sm((tt-.5)/.35);BW[i]=wg;py-=D*wg;
P[3*i]=px;P[3*i+1]=py;P[3*i+2]=pz}
var mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9],k;
for(i=0;i<nv;i++)for(k=0;k<3;k++){mn[k]=Math.min(mn[k],P[3*i+k]);mx[k]=Math.max(mx[k],P[3*i+k])}
var dm=[DIM.L,DIM.H,DIM.W];
for(i=0;i<nv;i++)for(k=0;k<3;k++)P[3*i+k]=(P[3*i+k]-(mn[k]+mx[k])/2)*dm[k]/(mx[k]-mn[k]);
var NR=new Float32Array(nv*3);
for(i=0;i<TRI.length;i+=3){var i0=TRI[i]*3,i1=TRI[i+1]*3,i2=TRI[i+2]*3,
ux=P[i1]-P[i0],uy=P[i1+1]-P[i0+1],uz=P[i1+2]-P[i0+2],vx=P[i2]-P[i0],vy=P[i2+1]-P[i0+1],vz=P[i2+2]-P[i0+2],
nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
[i0,i1,i2].forEach(function(o){NR[o]+=nx;NR[o+1]+=ny;NR[o+2]+=nz})}
for(i=0;i<nv;i++){l=Math.sqrt(NR[3*i]*NR[3*i]+NR[3*i+1]*NR[3*i+1]+NR[3*i+2]*NR[3*i+2])||1;NR[3*i]/=l;NR[3*i+1]/=l;NR[3*i+2]/=l}
var C=new Float32Array(nv*3);
for(i=0;i<nv;i++){var X=P[3*i]*K,Y=P[3*i+1]*K,Z=P[3*i+2]*K,t2=Y/b,
v=vn(X*.1+9,Y*.1,Z*.1),s2=vn(X*.5,Y*.5,Z*.5),fe=0,kk=.97+.04*(v-.5)+.04*(s2-.5),
R=lp(.85*kk,.8,fe*.65),G=lp(.72*kk,.46,fe*.65),B=lp(.54*kk,.25,fe*.65),ao=Math.max(.5,1-.3*sm((-t2-.3)/.7)-.12*BW[i]);
C[3*i]=Math.pow(R,2.2)*ao;C[3*i+1]=Math.pow(G,2.2)*ao;C[3*i+2]=Math.pow(B,2.2)*ao}
/* Shader */
function sh(t,src){var o=gl.createShader(t);gl.shaderSource(o,src);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o}
function prog(v,f){var o=gl.createProgram();gl.attachShader(o,sh(gl.VERTEX_SHADER,v));gl.attachShader(o,sh(gl.FRAGMENT_SHADER,f));gl.linkProgram(o);return o}
var VS=['#version 300 es','layout(location=0) in vec3 aP;layout(location=1) in vec3 aN;layout(location=2) in vec3 aC;uniform mat4 uVP;out vec3 vP,vN,vC;','void main(){vP=aP;vN=aN;vC=aC;gl_Position=uVP*vec4(aP,1.);}'].join('\n');
var FS=['#version 300 es','precision highp float;in vec3 vP,vN,vC;uniform sampler2D uT;uniform vec3 uK;out vec4 o;',
'vec3 tri(vec3 p,vec3 n,float s){vec3 w=pow(abs(n),vec3(4.));w/=w.x+w.y+w.z;return texture(uT,p.zy*s).rgb*w.x+texture(uT,p.xz*s).rgb*w.y+texture(uT,p.xy*s).rgb*w.z;}',
'void main(){vec3 n=normalize(vN);vec3 t1=tri(vP,n,.38),t2=tri(vP,n,.1);',
'vec3 det=mix(vec3(1.),(t1*.88+t2*.12)*2.,.85);float h=dot(t1,vec3(.333))+.6*dot(t2,vec3(.333));',
'vec3 dx=dFdx(vP),dy=dFdy(vP);float hx=dFdx(h),hy=dFdy(h);vec3 r1=cross(dy,n),r2=cross(n,dx);float dt=dot(dx,r1);',
'n=normalize(abs(dt)*n-.12*sign(dt)*(hx*r1+hy*r2));',
'float kd=clamp((dot(n,uK)+.15)/1.15,0.,1.);float fd=clamp(dot(n,normalize(vec3(-.6,.2,-.5)))*.5+.5,0.,1.);',
'vec3 L=vec3(1.,.92,.8)*kd+vec3(.8,.85,.95)*fd*.08+mix(vec3(.12,.09,.07),vec3(.24,.22,.2),n.y*.5+.5);',
'vec3 c=vC*det*L*.92;c=clamp(c*(2.51*c+.03)/(c*(2.43*c+.59)+.14),0.,1.);o=vec4(pow(c,vec3(1./2.2)),1.);}'].join('\n');
var GV=['#version 300 es','layout(location=0) in vec3 aP;uniform mat4 uVP;out vec3 vP;void main(){vP=aP;gl_Position=uVP*vec4(aP,1.);}'].join('\n');
var GF=['#version 300 es','precision highp float;in vec3 vP;uniform vec2 uH;out vec4 o;',
'void main(){vec2 q=(vP.xz-vec2(-.8,-.6))/(uH*1.08);float d=pow(pow(abs(q.x),3.)+pow(abs(q.y),3.),1./3.);',
'float a=.3*(1.-smoothstep(.5,1.5,d))+.38*(1.-smoothstep(.82,1.04,d));o=vec4(0.,0.,0.,a*.9);}'].join('\n');
var pm=prog(VS,FS),pg=prog(GV,GF);
var vao=gl.createVertexArray();gl.bindVertexArray(vao);
function buf(d,loc){var o=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,o);gl.bufferData(gl.ARRAY_BUFFER,d,gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0)}
buf(P,0);buf(NR,1);buf(C,2);var ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,TRI,gl.STATIC_DRAW);
var gv=gl.createVertexArray();gl.bindVertexArray(gv);var gy=-DIM.H/2-.01;buf(new Float32Array([-40,gy,-40,40,gy,-40,-40,gy,40,40,gy,40]),0);
var tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,1,1,0,gl.RGB,gl.UNSIGNED_BYTE,new Uint8Array([128,128,128]));
var im=new Image();im.onload=function(){gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,im);gl.generateMipmap(gl.TEXTURE_2D);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.MIRRORED_REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.MIRRORED_REPEAT)};
im.src=window.SAND_TEX||'img/sand.jpg';
/* Mathe */
function mul(a,b){var o=new Float32Array(16);for(var i=0;i<4;i++)for(var j=0;j<4;j++){var s=0;for(var k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s}return o}
function nm(v){var l=Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);return[v[0]/l,v[1]/l,v[2]/l]}
function cr(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function dt(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
function persp(fv,as,ne,fa){var t=1/Math.tan(fv/2),o=new Float32Array(16);o[0]=t/as;o[5]=t;o[10]=(fa+ne)/(ne-fa);o[9]=-.14;o[11]=-1;o[14]=2*fa*ne/(ne-fa);return o}
function look(e){var z=nm(e),x=nm(cr([0,1,0],z)),y=cr(z,x);return Float32Array.of(x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dt(x,e),-dt(y,e),-dt(z,e),1)}
/* Steuerung: nur drehbar, wenn Finger oder Cursor direkt das Objekt berühren */
var th=.8,ph=1.05,zoom=1,vth=0,auto=true,drag=false,lx=0,ly=0,d0=1,px0=new Uint8Array(4);
function hit(cx,cy){render();var r=cv.getBoundingClientRect();gl.readPixels(Math.floor((cx-r.left)*cv.width/r.width),Math.floor(cv.height-(cy-r.top)*cv.height/r.height),1,1,gl.RGBA,gl.UNSIGNED_BYTE,px0);return px0[3]>200}
function rot(x,y){var dx=x-lx,dy=y-ly;lx=x;ly=y;th-=dx*.008;vth=-dx*.008;ph=Math.max(.25,Math.min(1.5,ph-dy*.006))}
function pd(t){return Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY)||1}
function zm(f){zoom=Math.max(.6,Math.min(1.8,zoom*f))}
el.addEventListener('touchstart',function(e){if(e.target.closest('.ski'))return;var t=e.touches;
if(t.length===1&&hit(t[0].clientX,t[0].clientY)){drag=true;auto=false;lx=t[0].clientX;ly=t[0].clientY;e.preventDefault()}
else if(t.length===2&&(drag||hit(t[0].clientX,t[0].clientY)||hit(t[1].clientX,t[1].clientY))){drag=true;auto=false;d0=pd(t);e.preventDefault()}},{passive:false});
el.addEventListener('touchmove',function(e){if(!drag)return;e.preventDefault();var t=e.touches;
if(t.length===1)rot(t[0].clientX,t[0].clientY);else if(t.length===2){var d=pd(t);zm(d0/d);d0=d}},{passive:false});
function tend(e){if(e.touches.length===0)drag=false;else if(e.touches.length===1){lx=e.touches[0].clientX;ly=e.touches[0].clientY}}
el.addEventListener('touchend',tend);el.addEventListener('touchcancel',tend);
el.addEventListener('mousedown',function(e){if(e.target.closest('.ski'))return;if(hit(e.clientX,e.clientY)){drag=true;auto=false;lx=e.clientX;ly=e.clientY;e.preventDefault()}});
addEventListener('mousemove',function(e){if(drag&&e.buttons===1)rot(e.clientX,e.clientY)});
addEventListener('mouseup',function(){drag=false});
el.addEventListener('wheel',function(e){if(!(e.ctrlKey||e.metaKey))return;e.preventDefault();zm(1+e.deltaY*.01)},{passive:false});
/* Maße */
var A2=DIM.L/2,B2=DIM.H/2,C2=DIM.W/2,o2=.55,tk=.35,seg=[[[-A2,-B2,C2+o2],[A2,-B2,C2+o2]],[[-A2,-B2-tk,C2+o2],[-A2,-B2+tk,C2+o2]],[[A2,-B2-tk,C2+o2],[A2,-B2+tk,C2+o2]],
[[A2+o2,-B2,-C2],[A2+o2,-B2,C2]],[[A2+o2-tk,-B2,-C2],[A2+o2+tk,-B2,-C2]],[[A2+o2-tk,-B2,C2],[A2+o2+tk,-B2,C2]],
[[-A2-o2,-B2,C2+o2],[-A2-o2,B2,C2+o2]],[[-A2-o2-tk,-B2,C2+o2],[-A2-o2+tk,-B2,C2+o2]],[[-A2-o2-tk,B2,C2+o2],[-A2-o2+tk,B2,C2+o2]]];
var NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg'),pa=document.createElementNS(NS,'path');svg.setAttribute('class','skd');pa.setAttribute('fill','none');pa.setAttribute('stroke','#9b2a1c');pa.setAttribute('stroke-width','1.8');pa.setAttribute('stroke-linecap','round');svg.appendChild(pa);svg.style.display='none';el.appendChild(svg);
var labs=[[[0,-B2,C2+o2+.9],'Länge '+DIM.L+' cm'],[[A2+o2+.9,-B2,0],'Breite '+DIM.W+' cm'],[[-A2-o2-.9,0,C2+o2],'Höhe '+DIM.H+' cm']].map(function(q){var d=document.createElement('div');d.className='dl';d.textContent=q[1];d.style.display='none';el.appendChild(d);return{p:q[0],d:d}});
var btn=document.getElementById('skI'),on=false;
function bl(){btn.setAttribute('aria-label',on?I.t('Maße ausblenden','Hide dimensions'):I.t('Maße anzeigen','Show dimensions'))}function labt(){var n=[I.t('Länge','Length'),I.t('Breite','Width'),I.t('Höhe','Height')],v=[DIM.L,DIM.W,DIM.H];labs.forEach(function(l,i){l.d.textContent=n[i]+' '+v[i]+' cm'})}bl();labt();addEventListener('langchange',function(){bl();labt()});
btn.onclick=function(){on=!on;auto=false;btn.setAttribute('aria-pressed',on);bl();svg.style.display=on?'block':'none';labs.forEach(function(l){l.d.style.display=on?'block':'none'})};
/* Zeichnen */
var W=0,H=0,vis=true,VP;
new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(el);
function pr(p){var m=VP,w=m[3]*p[0]+m[7]*p[1]+m[11]*p[2]+m[15];return[((m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12])/w*.5+.5)*W,(1-((m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13])/w*.5+.5))*H]}
function frame(){requestAnimationFrame(frame);if(!vis||!el.clientWidth)return;
if(auto)th+=.0025;else if(!drag){th+=vth;vth*=.94}
render()}
function render(){if(!el.clientWidth)return;
if(el.clientWidth!==W||el.clientHeight!==H){W=el.clientWidth;H=el.clientHeight;var dp=Math.min(window.devicePixelRatio||1,2);cv.width=W*dp;cv.height=H*dp}
var as=W/H,dist=98/K*zoom*1.28*Math.max(1,1.05/as),e=[dist*Math.sin(ph)*Math.sin(th),dist*Math.cos(ph),dist*Math.sin(ph)*Math.cos(th)];
VP=mul(persp(.56,as,1,200),look(e));
gl.viewport(0,0,cv.width,cv.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
gl.useProgram(pg);gl.uniformMatrix4fv(gl.getUniformLocation(pg,'uVP'),false,VP);gl.uniform2f(gl.getUniformLocation(pg,'uH'),A2,C2);
gl.depthMask(false);gl.bindVertexArray(gv);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);gl.depthMask(true);
gl.useProgram(pm);gl.uniformMatrix4fv(gl.getUniformLocation(pm,'uVP'),false,VP);gl.uniform3fv(gl.getUniformLocation(pm,'uK'),nm([.45,.8,.4]));
gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(gl.getUniformLocation(pm,'uT'),0);
gl.bindVertexArray(vao);gl.drawElements(gl.TRIANGLES,TRI.length,gl.UNSIGNED_INT,0);
if(on){var d='';seg.forEach(function(s){var p=pr(s[0]),q=pr(s[1]);d+='M'+p[0].toFixed(1)+' '+p[1].toFixed(1)+'L'+q[0].toFixed(1)+' '+q[1].toFixed(1)});pa.setAttribute('d',d);
labs.forEach(function(l){var p=pr(l.p);l.d.style.left=p[0]+'px';l.d.style.top=p[1]+'px'})}}
frame();
})();
