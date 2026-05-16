/* ==========================
   MOBILE MENU
========================== */

const menuBtn = document.getElementById("menuToggle");
const mobileNav = document.querySelector(".nav-links");

if(menuBtn && mobileNav){

menuBtn.onclick = ()=>{

mobileNav.classList.toggle("show");

};

}


/* ==========================
   CUSTOM CURSOR
========================== */

const cur =
document.getElementById('cur');

const cur2 =
document.getElementById('cur2');


if(cur && cur2){

document.addEventListener(
'mousemove',
e=>{

cur.style.opacity='1';
cur2.style.opacity='1';

cur.style.left=
e.clientX+'px';

cur.style.top=
e.clientY+'px';


setTimeout(()=>{

cur2.style.left=
e.clientX+'px';

cur2.style.top=
e.clientY+'px';

},80);

}
);


document.addEventListener(
'mouseover',
e=>{

const target=
e.target.closest(

'a,button,.svc-card,.why-item,.sector-card,.blog-card,.quiz-card,.option-btn,.nav-btn,.skip-btn'

);

if(target){

cur.style.width='20px';
cur.style.height='20px';

}

}
);


document.addEventListener(
'mouseout',
e=>{

const target=
e.target.closest(

'a,button,.svc-card,.why-item,.sector-card,.blog-card,.quiz-card,.option-btn,.nav-btn,.skip-btn'

);

if(target){

cur.style.width='12px';
cur.style.height='12px';

}

}
);

}


/* ==========================
   REVEAL FIX
========================== */

function initReveal(){

const reveals=
document.querySelectorAll('.reveal');

reveals.forEach(el=>{

el.classList.add('visible');

});

}

document.addEventListener(
'DOMContentLoaded',
initReveal
);

window.addEventListener(
'load',
initReveal
);


/* ==========================
   SMOOTH HASH SCROLL
========================== */

document
.querySelectorAll('a[href^="#"]')
.forEach(anchor=>{

anchor.addEventListener(
'click',
function(e){

const target=
document.querySelector(
this.getAttribute('href')
);

if(target){

e.preventDefault();

target.scrollIntoView({

behavior:'smooth'

});


if(mobileNav){

mobileNav.classList.remove(
'show'
);

}

}

});

});


/* ==========================
   ACTIVE NAV
========================== */

const sections=
document.querySelectorAll(
'section[id]'
);

const activeLinks=
document.querySelectorAll(
'.nav-links a'
);


window.addEventListener(
'scroll',
()=>{

let current='';

sections.forEach(
section=>{

const top=
section.offsetTop-150;

if(pageYOffset>=top){

current=
section.getAttribute('id');

}

});

activeLinks.forEach(
link=>{

link.classList.remove(
'active'
);

if(

link.getAttribute('href')
==='#'+current

){

link.classList.add(
'active'
);

}

});

});