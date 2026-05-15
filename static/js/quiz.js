let currentQuiz = 0;
let currentQuestion = 0;
let answers = [];

const quizContainer =
document.querySelector('.quiz-grid');


function startQuiz(index){

    currentQuiz = index;
    currentQuestion = 0;
    answers = [];

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



/* =======================
   QUESTION RENDER
======================= */

function renderQuestion(){

    const quiz =
    QUIZZES[currentQuiz];

    if(!quiz) return;

    const question =
    quiz.questions[currentQuestion];

    const progress =
    (
    (currentQuestion+1)
    /
    quiz.questions.length
    )*100;


quizContainer.innerHTML = `

<div class="quiz-layout">

    <div class="quiz-top">

        <div class="quiz-progress-wrap">

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

        </div>

    </div>



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



/* =======================
   OPTIONS
======================= */

function renderOptions(question){

return question.options
.map((option,index)=>`

<button

class="
option-btn
${answers[currentQuestion]===index?'selected':''}
"

onclick="
selectAnswer(
${index}
)
">

<div class="option-badge">

${["A","B","C","D"][index]}

</div>

<span>

${option}

</span>

</button>

`)
.join('');

}



/* =======================
   ANSWER
======================= */

function selectAnswer(answer){

answers[currentQuestion]=answer;

goNext();

}



/* =======================
   NAVIGATION
======================= */

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



function prevQuestion(){

if(
currentQuestion>0
){

currentQuestion--;

renderQuestion();

}

}



/* =======================
   RESULT
======================= */

function showLeadForm(){

quizContainer.innerHTML=`

<div class="lead-box">

<h1>

🎓 Get Result & Certificate

</h1>

<p>

Complete your information
to unlock your score
and receive certificate

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
onclick="submitLead()">

See Result →

</button>

</div>

`;

}



function submitLead(){

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


alert(
'ধন্যবাদ 🎉'

);

}



/* =======================
   BACK BUTTON
======================= */

window.addEventListener(
'popstate',
()=>{

const params=
new URLSearchParams(
window.location.search
);

const quiz=
params.get("quiz");


if(
quiz===null
){

location.reload();

}

}
);




/* =======================
   RELOAD
======================= */

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