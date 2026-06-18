let timerInterval = null;
let remainingSeconds = 0;
let currentQuiz = 0;
let currentQuestion = 0;
let answers = [];

const quizContainer = document.querySelector('.quiz-grid');

function startQuiz(index) {
    clearInterval(timerInterval);
    currentQuiz = index;
    currentQuestion = 0;
    answers = [];

    history.pushState(
        { quizOpen: true, quiz: index },
        "",
        "?quiz=" + index
    );

    renderQuestion();

    const quiz = QUIZZES[index];
    if (quiz.totalTime) {
        startTimer(quiz.totalTime);
    }
}

function startTimer(seconds) {
    clearInterval(timerInterval);
    remainingSeconds = parseInt(seconds) || 0;
    updateTimer();

    timerInterval = setInterval(() => {
        remainingSeconds--;
        updateTimer();

        if (remainingSeconds <= 0) {
            remainingSeconds = 0;
            updateTimer();
            clearInterval(timerInterval);
            showLeadForm(true);
        }
    }, 1000);
}

function updateTimer() {
    const timer = document.getElementById("quizTimer");
    if (!timer) return;

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    timer.innerHTML = `⏱️ ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/* ======================
QUESTION RENDERING
====================== */
function renderQuestion() {
    const quiz = QUIZZES[currentQuiz];
    if (!quiz) return;

    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
    const header = document.querySelector('#headerProgress');

    if (header) {
        header.innerHTML = `
            <div class="quiz-header-row">
                <div id="quizTimer" class="quiz-timer"></div>
                <div class="quiz-progress-text">
                    <span>Question ${currentQuestion + 1}</span>
                    <span>${quiz.questions.length} Total</span>
                </div>
            </div>
            <div class="progress">
                <div class="progress-fill" style="width:${progress}%"></div>
            </div>
        `;
        updateTimer();
    }

    quizContainer.innerHTML = `
        <div class="quiz-layout">
            <div class="question-box">
                <div class="quiz-title">${quiz.title}</div>
                <div class="question-number">Question ${currentQuestion + 1}</div>
                <div class="question-text">${question.q}</div>
                <div class="options-wrap">${renderOptions(question)}</div>
                <div class="quiz-actions">
                    ${currentQuestion > 0 
                        ? `<button class="nav-btn" onclick="prevQuestion()">← Previous</button>` 
                        : `<div></div>`
                    }
                    <button class="skip-btn" onclick="nextQuestion()">Skip →</button>
                </div>
            </div>
        </div>
    `;
}

function renderOptions(question) {
    return question.options.map((option, index) => `
        <button class="option-btn ${answers[currentQuestion] === index ? 'selected' : ''}" onclick="selectAnswer(${index})">
            <div class="option-badge">${["A", "B", "C", "D"][index]}</div>
            <span>${option}</span>
        </button>
    `).join('');
}

/* ======================
ACTIONS & NAVIGATION
====================== */
function selectAnswer(answer) {
    answers[currentQuestion] = answer;
    renderQuestion(); // সিলেকশন হাইলাইট করার জন্য রেন্ডার
    
    setTimeout(() => {
        goNext();
    }, 500);
}

function nextQuestion() {
    goNext();
}

function goNext() {
    const total = QUIZZES[currentQuiz].questions.length;

    if (currentQuestion < total - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        showLeadForm();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

/* ======================
RESULT & SUBMISSION
====================== */
function showLeadForm(timeUp = false) {
    clearInterval(timerInterval);

    quizContainer.innerHTML = `
        <div class="lead-box">
            <div class="lead-icon">🎓</div>
            ${timeUp ? `<h3 style="color:#ff7b00">⏰ Time Up!</h3>` : ""}
            <h1>Get Result & Certificate</h1>
            <p>Complete your information to unlock your score and receive your certificate.</p>
            <input id="name" placeholder="Full Name">
            <input id="email" type="email" placeholder="Email Address">
            <input id="phone" placeholder="Phone Number">
            <button class="result-btn" onclick="submitLead()">See Result →</button>
        </div>
    `;
}

async function submitLead() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !email || !phone) {
        alert('সব তথ্য পূরণ করুন');
        return;
    }

    let score = 0;
    const questions = QUIZZES[currentQuiz].questions;

    questions.forEach((q, index) => {
        if (answers[index] === q.correct) {
            score++;
        }
    });

    const percentage = Math.round((score / questions.length) * 100);
    const payload = {
        name, email, phone,
        quiz: QUIZZES[currentQuiz].title,
        score, total: questions.length, percentage, answers
    };

    try {
        const response = await fetch("/save-quiz/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            let resultHTML = '';
            questions.forEach((q, index) => {
                const userAnswer = answers[index];
                resultHTML += `
                    <div class="result-item">
                        <h4>${index + 1}. ${q.q}</h4>
                        <p>Your Answer: ${userAnswer !== undefined ? q.options[userAnswer] : 'Not Answered'}</p>
                        <p class="correct-answer">✅ Correct Answer: ${q.options[q.correct]}</p>
                        <p class="explanation">💡 ${q.explanation || ''}</p>
                    </div>
                `;
            });

            quizContainer.innerHTML = `
                <div class="lead-box">
                    <h1>🎉 Result</h1>
                    <h2>${score}/${questions.length}</h2>
                    <p>Score: ${percentage}%</p>
                    <button class="result-btn" onclick="toggleAnswers()">📖 View Answers & Explanation</button>
                    <div id="answerSection" style="display:none; margin-top:20px;">
                        ${resultHTML}
                    </div>
                    <a href="${data.download_url}" class="result-btn" style="display:inline-block; margin-top:15px; text-decoration:none;">
                        ⬇ Download Certificate
                    </a>
                </div>
            `;
            
            // ব্যাকগ্রাউন্ডে অটোমেটিক ফাইল ডাউনলোড করানোর নিরাপদ উপায় (পেজ রিডাইরেক্ট না করে)
            const downloadAnchor = document.createElement('a');
            downloadAnchor.href = data.download_url;
            downloadAnchor.download = ''; 
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            document.body.removeChild(downloadAnchor);
        }
    } catch (error) {
        alert("Submit failed");
        console.error(error);
    }
}

function toggleAnswers() {
    const section = document.getElementById('answerSection');
    if (section.style.display === 'none') {
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
    }
}

/* ======================
HISTORY & INITIALIZATION
====================== */
window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    const quiz = params.get("quiz");
    if (quiz === null) {
        location.reload();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const quiz = params.get("quiz");

    if (quiz !== null && QUIZZES[quiz]) {
        currentQuiz = parseInt(quiz);
        renderQuestion();
        if (QUIZZES[currentQuiz].totalTime) {
            startTimer(QUIZZES[currentQuiz].totalTime);
        }
    }
});