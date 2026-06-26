AOS.init({duration:800,once:true,offset:80});

// ── HEADER SCROLL ──
window.addEventListener('scroll',()=>document.getElementById('hdr').classList.toggle('scrolled',scrollY>60));

// ── MOBILE NAV ──
const ham=document.getElementById('ham'),mn=document.getElementById('mob-nav');
ham.addEventListener('click',()=>{ham.classList.toggle('open');mn.classList.toggle('open')});
function closeNav(){ham.classList.remove('open');mn.classList.remove('open')}

// ── HERO SLIDER ──
let cs=0;const sls=document.querySelectorAll('.slide'),dts=document.querySelectorAll('.hdot');let st;
function goSlide(i){
  sls[cs].classList.remove('active');dts[cs].classList.remove('active');
  cs=(i+sls.length)%sls.length;
  sls[cs].classList.add('active');dts[cs].classList.add('active');
}
function nxtSl(){goSlide(cs+1)}
function prvSl(){goSlide(cs-1)}
function startS(){st=setInterval(nxtSl,6000)}
function stopS(){clearInterval(st)}
if(sls.length>0){
  dts.forEach((d,i)=>d.addEventListener('click',()=>{goSlide(i);stopS();startS()}));
  document.querySelector('.h-arrow.prev')?.addEventListener('click',()=>{prvSl();stopS();startS()});
  document.querySelector('.h-arrow.nxt')?.addEventListener('click',()=>{nxtSl();stopS();startS()});
  startS();
}

// ── PARTICLES ──
const ptc=document.getElementById('ptc');
if(ptc){
  for(let i=0;i<25;i++){
    const p=document.createElement('div');p.className='pt';
    p.style.left=Math.random()*100+'vw';p.style.width=p.style.height=Math.random()*4+2+'px';
    p.style.animationDuration=Math.random()*8+4+'s';p.style.animationDelay=Math.random()*-12+'s';
    ptc.appendChild(p);
  }
}

// ── REVEAL ──
const rev=()=>{
  document.querySelectorAll('.reveal').forEach(el=>{
    if(el.getBoundingClientRect().top<window.innerHeight-50)el.classList.add('visible');
  });
};
window.addEventListener('scroll',rev);window.addEventListener('load',rev);

// ── TECH TABS ──
function openT(e,tId){
  document.querySelectorAll('.t-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.t-panel').forEach(p=>p.classList.remove('active'));
  e.currentTarget.classList.add('active');document.getElementById(tId).classList.add('active');
}

// ── VOLTMATRIX SIMULATOR ──
const cp=document.getElementById('cap'),stype=document.getElementById('sol-type'),eff=document.getElementById('eff');
const genE=document.getElementById('gen-val'),roiE=document.getElementById('roi-val'),co2E=document.getElementById('co2-val');
const barG=document.getElementById('bar-gen'),barR=document.getElementById('bar-roi');
function sim(){
  if(!cp)return;
  const c=parseFloat(cp.value),t=stype.value,e=parseFloat(eff.value)/100;
  let f=1.2;if(t==='cnd')f=1.05;if(t==='hyb')f=1.15;
  const g=Math.round(c*4.2*365*e*f);
  const cost=c*85000;const r=Math.min(25,Math.max(3,parseFloat((cost/(g*12)).toFixed(1))));
  const co=parseFloat((g*0.0006).toFixed(1));
  genE.textContent=g.toLocaleString()+' kWh';roiE.textContent=r+' Years';co2E.textContent=co+' Tons';
  barG.style.width=Math.min(100,(g/150000)*100)+'%';barR.style.width=((25-r)/22)*100+'%';
}
if(cp){['input','change'].forEach(ev=>[cp,stype,eff].forEach(el=>el.addEventListener(ev,sim)));sim();}

// ── FAQ ──
function togF(btn){
  const it=btn.parentElement;const op=it.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
  if(!op)it.classList.add('open');
}

// ── SKILL TEST QUIZ ──
const L=['A','B','C','D'];
const Q=[
  {q:"Which factor is most critical when designing an industrial rooftop solar EPC system in Bangladesh?",o:["Grid tariff rates only","Roof structural integrity & dead load","Color of the solar panels","Type of local inverter brand"],a:1,e:"Industrial roofs must support substantial dead loads from PV modules, structures, and wind force. Ensuring structural integrity prevents catastrophic failures."},
  {q:"What is the primary technical function of a Net Metering system in a B2B solar factory layout?",o:["To block grid electricity from entering the factory","To export surplus solar energy to the utility grid and offset consumption costs","To store power in lead-acid backup systems","To clean harmonized frequencies automatically"],a:1,e:"Net Metering allows industrial consumers to export excess solar power to the national grid during low-demand periods (like Fridays), earning credits to reduce electricity bills."},
  {q:"In emergency parts supply logistics, what does 'downtime mitigation cost' calculate?",o:["The shipping price of heavy cargo components","The loss of factory production output per hour versus rapid sourcing cost","The customs clearance percentage fee in Dhaka","The standard warehouse inventory depreciation rate"],a:1,e:"Mitigation cost weighs the huge financial loss of an idle factory line against the premium cost of express international sourcing to resume operations immediately."}
];
let qi=0,sc=0,ans=[];
function startQ(idx){
  qi=idx;sc=0;ans=new Array(Q.length).fill(null);
  document.getElementById('quiz-intro-screen').style.display='none';
  document.getElementById('quiz-result-screen').style.display='none';
  document.getElementById('quiz-active-screen').style.display='block';
  showQ();
}
function showQ(){
  const item=Q[qi];document.getElementById('q-title').textContent=`Question ${qi+1} of ${Q.length}`;
  document.getElementById('q-txt').textContent=item.q;
  const ob=document.getElementById('q-opts');ob.innerHTML='';
  item.o.forEach((o,i)=>{
    const b=document.createElement('button');b.className='qtc';
    b.innerHTML=`<span class=\"qtc-prefix\">${L[i]}</span><span class=\"qtc-text\">${o}</span>`;
    b.onclick=()=>selO(i);ob.appendChild(b);
  });
  document.getElementById('q-prog').style.width=((qi+1)/Q.length)*100+'%';
}
function selO(idx){
  ans[qi]=idx;if(idx===Q[qi].a)sc++;
  if(qi<Q.length-1){qi++;showQ()}else{showR()}
}
function showR(){
  document.getElementById('res-score').textContent=`${sc} / ${Q.length}`;
  const pct=Math.round((sc/Q.length)*100);document.getElementById('res-pct').textContent=pct+'%';
  const rw=document.getElementById('res-wrong-wrap');rw.innerHTML='';
  Q.forEach((item,idx)=>{
    const ua=ans[idx];const ic=ua===item.a;
    const d=document.createElement('div');d.className='ri-item';
    d.innerHTML=`<div class=\"ri-q\">${idx+1}. ${item.q}</div><div class=\"ri-ans ${ic?'ra-right':'ra-wrong'}\">Your answer: ${ua!==null?L[ua]+'. '+item.o[ua]:'Not answered'}</div>${!ic?`<div class=\"ri-ans ra-correct-show\">✓ Correct: ${L[item.a]}. ${item.o[item.a]}</div>`:''}<div class=\"ri-exp\"><strong>Explanation:</strong> ${item.e}</div>`;
    rw.appendChild(d);
  });
  document.getElementById('btn-retry').onclick=()=>startQ(0);
  document.getElementById('cert-email').value='';document.getElementById('cert-phone').value='';
  const bc=document.getElementById('btn-cert');bc.disabled=false;bc.textContent='📨  Email My Score Certificate Now';
  document.getElementById('cert-sent').style.display='none';
  document.getElementById('quiz-active-screen').style.display='none';
  document.getElementById('quiz-result-screen').style.display='block';
  document.getElementById('skilltest').scrollIntoView({behavior:'smooth',block:'start'});
}
function sendCert(){
  const em=document.getElementById('cert-email').value.trim();
  const ph=document.getElementById('cert-phone').value.trim();
  if(!em||!ph){alert('Please enter both Email and Phone / WhatsApp number.');return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){alert('Please enter a valid email address.');return}
  const bc=document.getElementById('btn-cert');bc.disabled=true;bc.textContent='⏳  Sending...';
  setTimeout(()=>{bc.textContent='✓ Certificate Dispatched!';document.getElementById('cert-sent').style.display='block'},2000);
}