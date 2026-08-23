//====================================================
// SCOLEX MOCK TEST PORTAL
// FRONTEND JAVASCRIPT (mocktest.js)
//====================================================

// Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwK--zwUclmQhJd0tLD4uRQQacNLTOXSQ8KjTdDcIkIMTkrWEb_vwzp_fsL9wAMonS3sQ/exec";

let mockQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswers = [];
let markedForReview = [];
let timeInSeconds = 60 * 60; // 60 Minutes
let timerInterval = null;

// Get Test ID from localStorage (defaults to FUND01)
const currentTestId = localStorage.getItem("testId") || "FUND01"; 

// DOM Load Event
document.addEventListener("DOMContentLoaded", () => {
  const title = localStorage.getItem("testTitle") || "Mock Test";
  
  // Display Test Title + Test ID code
  const displayElem = document.getElementById("testTitleDisplay");
  if (displayElem) {
    displayElem.innerText = `${title} (${currentTestId})`;
  }
  
  fetchQuestionsFromSheet();
});

// Fetch questions from Google Apps Script
function fetchQuestionsFromSheet() {
  const questionTextElem = document.getElementById("questionText");
  if (questionTextElem) {
    questionTextElem.innerText = `⏳ Loading questions for ${currentTestId}...`;
  }

  fetch(`${SCRIPT_URL}?action=getQuestions&testId=${currentTestId}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "success" && data.questions && data.questions.length > 0) {
        mockQuestions = data.questions;
        selectedAnswers = new Array(mockQuestions.length).fill(null);
        markedForReview = new Array(mockQuestions.length).fill(false);
        
        const totalQElem = document.getElementById("totalQNum");
        if (totalQElem) totalQElem.innerText = mockQuestions.length;
        
        renderQuestionPalette();
        loadQuestion();
        startTimer();
      } else {
        if (questionTextElem) {
          questionTextElem.innerText = `❌ No questions found for Test ID: ${currentTestId} in Google Sheet!`;
        }
      }
    })
    .catch(error => {
      console.error("Error fetching questions:", error);
      if (questionTextElem) {
        questionTextElem.innerText = "❌ Error loading questions. Please check your network or script URL.";
      }
    });
}

// Load current question details into DOM
function loadQuestion() {
  if (mockQuestions.length === 0) return;

  const q = mockQuestions[currentQuestionIndex];
  
  const currentQElem = document.getElementById("currentQNum");
  if (currentQElem) currentQElem.innerText = currentQuestionIndex + 1;

  const qTextElem = document.getElementById("questionText");
  if (qTextElem) qTextElem.innerText = `${q.qno || (currentQuestionIndex + 1)}. ${q.question}`;
  
  for (let i = 0; i < 4; i++) {
    const optElem = document.getElementById(`opt${i}`);
    if (optElem) optElem.innerText = q.options[i];
  }

  const radioButtons = document.getElementsByName("quizOption");
  const cards = document.querySelectorAll(".option-card");
  
  radioButtons.forEach((radio, idx) => {
    radio.checked = (selectedAnswers[currentQuestionIndex] === idx);
    if (cards[idx]) {
      if (selectedAnswers[currentQuestionIndex] === idx) {
        cards[idx].classList.add("selected");
      } else {
        cards[idx].classList.remove("selected");
      }
    }
  });

  const reviewBtn = document.getElementById("reviewBtn");
  if (reviewBtn) {
    if (markedForReview[currentQuestionIndex]) {
      reviewBtn.innerText = "🔖 Unmark Review";
      reviewBtn.style.background = "#e65100";
    } else {
      reviewBtn.innerText = "🔖 Mark for Review";
      reviewBtn.style.background = "#ff9800";
    }
  }

  const prevBtn = document.getElementById("prevBtn");
  if (prevBtn) prevBtn.disabled = (currentQuestionIndex === 0);
  
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");

  if (currentQuestionIndex === mockQuestions.length - 1) {
    if (nextBtn) nextBtn.style.display = "none";
    if (submitBtn) submitBtn.style.display = "inline-block";
  } else {
    if (nextBtn) nextBtn.style.display = "inline-block";
    if (submitBtn) submitBtn.style.display = "none";
  }

  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    const progressPercent = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }

  updatePaletteUI();
}

// Option Handler
function selectOption(index) {
  selectedAnswers[currentQuestionIndex] = index;
  
  const cards = document.querySelectorAll(".option-card");
  const radioButtons = document.getElementsByName("quizOption");
  
  cards.forEach((card, idx) => {
    if (idx === index) {
      card.classList.add("selected");
      if (radioButtons[idx]) radioButtons[idx].checked = true;
    } else {
      card.classList.remove("selected");
    }
  });

  updatePaletteUI();
}

// Mark/Unmark current question for review
function toggleMarkForReview() {
  markedForReview[currentQuestionIndex] = !markedForReview[currentQuestionIndex];
  loadQuestion();
}

// Render Question Palette grid buttons
function renderQuestionPalette() {
  const grid = document.getElementById("questionGrid");
  if (!grid) return;
  grid.innerHTML = "";

  mockQuestions.forEach((_, idx) => {
    const btn = document.createElement("button");
    btn.className = "palette-btn";
    btn.innerText = idx + 1;
    btn.onclick = () => jumpToQuestion(idx);
    btn.id = `palette-btn-${idx}`;
    grid.appendChild(btn);
  });
}

function jumpToQuestion(index) {
  currentQuestionIndex = index;
  loadQuestion();
}

function updatePaletteUI() {
  mockQuestions.forEach((_, idx) => {
    const btn = document.getElementById(`palette-btn-${idx}`);
    if (!btn) return;

    btn.className = "palette-btn";

    if (selectedAnswers[idx] !== null) {
      btn.classList.add("answered");
    }
    if (markedForReview[idx]) {
      btn.classList.add("marked");
    }
    if (idx === currentQuestionIndex) {
      btn.classList.add("current");
    }
  });
}

function nextQuestion() {
  if (currentQuestionIndex < mockQuestions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeInSeconds--;
    
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;

    const timerElem = document.getElementById("timer");
    if (timerElem) {
      timerElem.innerText = 
        `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }

    if (timeInSeconds <= 0) {
      clearInterval(timerInterval);
      alert("⏰ Time is up! Test is submitting automatically.");
      submitTest();
    }
  }, 1000);
}

//====================================================
// SUBMIT TEST & AUTO-UPLOAD PDF REPORT TO GOOGLE DRIVE
//====================================================
async function submitTest() {
  if (confirm("Are you sure you want to submit the test?")) {
    clearInterval(timerInterval);

    // Disable submit button and indicate loading status
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "⏳ Saving Result & Generating PDF on Drive...";
    }

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    let score = 0;

    // Calculate score & detailed review array
    let detailedReview = mockQuestions.map((q, idx) => {
      const userAns = selectedAnswers[idx];
      const correctAns = q.answer; 
      
      let status = "unattempted";
      if (userAns !== null && userAns !== undefined) {
        if (Number(userAns) === Number(correctAns)) {
          status = "correct";
          correctCount++;
          score += 2; 
        } else {
          status = "incorrect";
          wrongCount++;
        }
      } else {
        unattemptedCount++;
      }

      return {
        question: q.question,
        options: q.options,
        userAnswer: userAns,
        correctAnswer: correctAns,
        status: status 
      };
    });

    // Load student information from local storage
    const rawData = JSON.parse(localStorage.getItem("student") || localStorage.getItem("studentData") || "{}");
    const student = rawData.student || rawData; 

    const testCategoryTitle = localStorage.getItem("selectedTopicTitle") || localStorage.getItem("testCategory") || "Computer Fundamentals";
    const specificTestName = localStorage.getItem("testTitle") || currentTestId;

    const studentName = student.name || student.studentName || "Guest Student";
    const studentId = student.studentId || student.id || "N/A";
    const courseName = student.course || "N/A";

    // Build payload for backend
    const payload = {
      action: "submitTestFull",
      studentName: studentName,
      studentId: studentId,
      mobile: student.mobile || "N/A",
      course: courseName,
      testCategory: testCategoryTitle,
      testName: specificTestName,
      testId: currentTestId,
      total: mockQuestions.length,
      correct: correctCount,
      wrong: wrongCount,
      unattempted: unattemptedCount,
      score: score,
      reviews: detailedReview
    };

    // Save locally for immediate display on result.html
    sessionStorage.setItem("lastTestResult", JSON.stringify(payload));

    try {
      // Send request to Google Apps Script and WAIT for Drive creation
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();
      console.log("Drive Backend Response:", resData);

      if (resData.status !== "success") {
        alert("Google Drive Status Notice: " + resData.message);
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Submission Connection Error: " + err.toString());
    }

    // Redirect ONLY after backend network call completes
    window.location.href = "result.html";
  }
}