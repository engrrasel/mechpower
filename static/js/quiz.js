let currentQuiz=0;
let currentQuestion=0;
let answers=[];

const quizContainer=
document.querySelector(
'.quiz-grid'
);



function startQuiz(index){

currentQuiz=index;

currentQuestion=0;

answers=[];


history.pushState(
{
quizOpen:true,
quiz:index
},
"",
"?quiz="+index
);


renderQuestion();

}



/* ======================
QUESTION
====================== */

function renderQuestion(){

const quiz=
QUIZZES[currentQuiz];

if(!quiz) return;


const question=
quiz.questions[currentQuestion];


const progress=
(
(currentQuestion+1)
/
quiz.questions.length
)*100;


/* header progress update */

const header=
document.querySelector(
'#headerProgress'
);

if(header){

header.innerHTML=`

<div class="quiz-progress-text">

<span>

Question
${currentQuestion+1}

</span>

<span>

${quiz.questions.length}
Total

</span>

</div>


<div class="progress">

<div
class="progress-fill"

style="
width:${progress}%">

</div>

</div>

`;

}



/* quiz render */

quizContainer.innerHTML=`

<div class="quiz-layout">

<div class="question-box">


<div class="quiz-title">

${quiz.title}

</div>


<div class="question-number">

Question
${currentQuestion+1}

</div>


<div class="question-text">

${question.q}

</div>


<div class="options-wrap">

${renderOptions(question)}

</div>


<div class="quiz-actions">

${
currentQuestion>0

?

`
<button
class="nav-btn"
onclick="prevQuestion()">

← Previous

</button>
`

:

`<div></div>`

}


<button
class="skip-btn"
onclick="nextQuestion()">

Skip →

</button>

</div>

</div>

</div>

`;

}




/* ======================
OPTIONS
====================== */

function renderOptions(question){

return question.options
.map(
(option,index)=>`

<button

class="
option-btn
${answers[currentQuestion]===index
?
'selected'
:
''
}
"

onclick="
selectAnswer(
${index}
)
">

<div
class="
option-badge">

${["A","B","C","D"][index]}

</div>

<span>

${option}

</span>

</button>

`
)
.join('');

}



/* ======================
SELECT
====================== */

function selectAnswer(answer){

answers[currentQuestion]=
answer;


/* re-render for highlight */

renderQuestion();


/* delay then next */

setTimeout(()=>{

goNext();

},500);

}



/* ======================
NEXT
====================== */

function nextQuestion(){

goNext();

}



function goNext(){

const total=
QUIZZES[currentQuiz]
.questions.length;


if(
currentQuestion<
total-1
){

currentQuestion++;

renderQuestion();

}
else{

showLeadForm();

}

}



/* ======================
PREV
====================== */

function prevQuestion(){

if(
currentQuestion>0
){

currentQuestion--;

renderQuestion();

}

}



/* ======================
RESULT
====================== */

function showLeadForm(){

quizContainer.innerHTML=`

<div class="lead-box">

<div class="lead-icon">
🎓
</div>

<h1>

Get Result & Certificate

</h1>

<p>

Complete your information to unlock your score and receive your certificate.

</p>


<input
id="name"
placeholder="Full Name">


<input
id="email"
type="email"
placeholder="Email Address">


<input
id="phone"
placeholder="Phone Number">


<button
class="result-btn"
onclick="submitLead()">

See Result →

</button>

</div>

`;

}




async function submitLead(){

const name=
document
.getElementById(
'name'
)
.value
.trim();

const email=
document
.getElementById(
'email'
)
.value
.trim();

const phone=
document
.getElementById(
'phone'
)
.value
.trim();


if(
!name||
!email||
!phone
){

alert(
'সব তথ্য পূরণ করুন'
);

return;

}


let score=0;


const questions=
QUIZZES[currentQuiz]
.questions;


questions.forEach(
(q,index)=>{

if(
answers[index]
===
q.correct
){

score++;

}

});


const percentage=
Math.round(
(score/questions.length)
*100
);


const payload={

name:name,

email:email,

phone:phone,

quiz:
QUIZZES[currentQuiz]
.title,

score:score,

total:
questions.length,

percentage:
percentage,

answers:
answers

};


try{

const response=
await fetch(

"/save-quiz/",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:
JSON.stringify(
payload)

}

);


const data=
await response.json();


if(data.success){

quizContainer.innerHTML=`

<div class="lead-box">

<h1>
🎉 Result
</h1>

<h2>
${score}/${questions.length}
</h2>

<p>
Score:
${percentage}%
</p>

<a
href="${data.download_url}"
class="result-btn"
style="
display:inline-block;
margin-top:20px;
text-decoration:none;
"
>

⬇ Download Certificate

</a>

</div>

`;


setTimeout(()=>{

window.location.href=
data.download_url;

},1500);

}

}catch(error){

alert(
"Submit failed"
);

console.log(error);

}

}




/* ======================
BACK BUTTON
====================== */

window.addEventListener(
'popstate',
()=>{

const params=
new URLSearchParams(
window.location.search
);

const quiz=
params.get(
"quiz"
);


if(
quiz===null
){

location.reload();

}

}
);




/* ======================
PAGE LOAD
====================== */

document.addEventListener(
'DOMContentLoaded',
()=>{

const params=
new URLSearchParams(
window.location.search
);

const quiz=
params.get(
"quiz"
);


if(
quiz!==null &&
QUIZZES[quiz]
){

currentQuiz=
parseInt(
quiz
);

renderQuestion();

}

});