// Google Apps Script Web App URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyn1cQq2-qhqKvwgfkDa4FxM0Wq9VCY_KWxIcyFqgiDEdiar2GQI0TLxIX_xFbwu0jJ/exec";

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
  
  // Display Test Title + Test ID code (e.g., "Fundamental Test 1 [FUND01]")
  const displayElem = document.getElementById("testTitleDisplay");
  if (displayElem) {
    displayElem.innerText = `${title} (${currentTestId})`;
  }
  
  fetchQuestionsFromSheet();
});

// Fetch questions from Apps Script
function fetchQuestionsFromSheet() {
  const questionTextElem = document.getElementById("questionText");
  questionTextElem.innerText = `⏳ Loading questions for ${currentTestId}...`;

  fetch(`${SCRIPT_URL}?action=getQuestions&testId=${currentTestId}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "success" && data.questions && data.questions.length > 0) {
        mockQuestions = data.questions;
        selectedAnswers = new Array(mockQuestions.length).fill(null);
        markedForReview = new Array(mockQuestions.length).fill(false);
        
        document.getElementById("totalQNum").innerText = mockQuestions.length;
        
        renderQuestionPalette();
        loadQuestion();
        startTimer();
      } else {
        questionTextElem.innerText = `❌ No questions found for Test ID: ${currentTestId} in Google Sheet!`;
      }
    })
    .catch(error => {
      console.error("Error fetching questions:", error);
      questionTextElem.innerText = "❌ Error loading questions. Please check your network or script URL.";
    });
}

// Load current question details
function loadQuestion() {
  if (mockQuestions.length === 0) return;

  const q = mockQuestions[currentQuestionIndex];
  
  document.getElementById("currentQNum").innerText = currentQuestionIndex + 1;
  document.getElementById("questionText").innerText = `${q.qno || (currentQuestionIndex + 1)}. ${q.question}`;
  
  for (let i = 0; i < 4; i++) {
    document.getElementById(`opt${i}`).innerText = q.options[i];
  }

  const radioButtons = document.getElementsByName("quizOption");
  const cards = document.querySelectorAll(".option-card");
  
  radioButtons.forEach((radio, idx) => {
    radio.checked = (selectedAnswers[currentQuestionIndex] === idx);
    if (selectedAnswers[currentQuestionIndex] === idx) {
      cards[idx].classList.add("selected");
    } else {
      cards[idx].classList.remove("selected");
    }
  });

  const reviewBtn = document.getElementById("reviewBtn");
  if (markedForReview[currentQuestionIndex]) {
    reviewBtn.innerText = "🔖 Unmark Review";
    reviewBtn.style.background = "#e65100";
  } else {
    reviewBtn.innerText = "🔖 Mark for Review";
    reviewBtn.style.background = "#ff9800";
  }

  document.getElementById("prevBtn").disabled = (currentQuestionIndex === 0);
  
  if (currentQuestionIndex === mockQuestions.length - 1) {
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("submitBtn").style.display = "inline-block";
  } else {
    document.getElementById("nextBtn").style.display = "inline-block";
    document.getElementById("submitBtn").style.display = "none";
  }

  const progressPercent = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;
  document.getElementById("progressBar").style.width = `${progressPercent}%`;

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
      radioButtons[idx].checked = true;
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

    document.getElementById("timer").innerText = 
      `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

    if (timeInSeconds <= 0) {
      clearInterval(timerInterval);
      alert("⏰ Time is up! Test is submitting automatically.");
      submitTest();
    }
  }, 1000);
}

// Submit Test & Send Payload + Auto-Store PDF to Google Drive
function submitTest() {
  if (confirm("Are you sure you want to submit the test?")) {
    clearInterval(timerInterval);

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    let score = 0;

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

    const rawData = JSON.parse(localStorage.getItem("student") || localStorage.getItem("studentData") || "{}");
    const student = rawData.student || rawData; 

    const testCategoryTitle = localStorage.getItem("selectedTopicTitle") || localStorage.getItem("testCategory") || "Computer Fundamentals";
    const specificTestName = localStorage.getItem("testTitle") || currentTestId;

    const studentName = student.name || student.studentName || "Guest Student";
    const studentId = student.studentId || student.id || "N/A";
    const courseName = student.course || "N/A";

    const payload = {
      action: "saveResult",
      studentName: studentName,
      mobile: student.mobile || "N/A",
      course: courseName,
      testId: currentTestId,
      total: mockQuestions.length,
      correct: correctCount,
      wrong: wrongCount,
      unattempted: unattemptedCount,
      score: score
    };

    let reviewBodyHtml = "";
    detailedReview.forEach((item, idx) => {
      reviewBodyHtml += `<div style="margin-bottom: 10px; padding: 8px; border: 1px solid #ccc;">` +
        `<b>Q${idx + 1}: ${item.question}</b> [Status: ${item.status.toUpperCase()}]<br>` +
        `<span>Your Answer Index: ${item.userAnswer !== null ? item.userAnswer : 'None'} | Correct Answer: ${item.correctAnswer}</span>` +
        `</div>`;
    });

    const pdfPayload = {
      action: "savePdfReport",
      studentName: studentName,
      studentId: studentId,
      course: courseName,
      testCategory: testCategoryTitle,
      testName: specificTestName,
      testId: currentTestId,
      score: score,
      correct: correctCount,
      wrong: wrongCount,
      unattempted: unattemptedCount,
      reviewHtmlBody: reviewBodyHtml
    };

    const resultData = {
      total: mockQuestions.length,
      correct: correctCount,
      wrong: wrongCount,
      unattempted: unattemptedCount,
      score: score,
      testCategory: testCategoryTitle,
      testName: specificTestName,
      testId: currentTestId,
      studentName: studentName,
      studentId: studentId,
      course: courseName,
      reviews: detailedReview
    };
    sessionStorage.setItem("lastTestResult", JSON.stringify(resultData));

    fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).catch(err => console.error("Error saving result:", err));

    fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(pdfPayload)
    }).catch(err => console.error("Error auto-saving PDF to Drive:", err));

    window.location.href = "result.html";
  }
}