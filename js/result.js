window.onload = function() {
  const resultDataString = sessionStorage.getItem("lastTestResult");

  if (resultDataString) {
    const resultData = JSON.parse(resultDataString);

    // Populate student and test metadata fields including Test ID
    document.getElementById("resStudentName").innerText = resultData.studentName || "N/A";
    document.getElementById("resStudentId").innerText = resultData.studentId || "N/A";
    document.getElementById("resCourse").innerText = resultData.course || "N/A";
    document.getElementById("resTestCategory").innerText = resultData.testCategory || "Computer Fundamentals";
    document.getElementById("resTestName").innerText = resultData.testName || "Mock Test";
    document.getElementById("resTestIdCode").innerText = resultData.testId || localStorage.getItem("testId") || "FUND01";

    document.getElementById("message").innerText = "🎉 Congratulations! Test Completed.";
    document.getElementById("total").innerText = resultData.total;
    document.getElementById("correct").innerText = resultData.correct;
    document.getElementById("score").innerText = resultData.score + " Marks";

    if (resultData.reviews && resultData.reviews.length > 0) {
      let reviewHtml = "";
      
      resultData.reviews.forEach((item, index) => {
        let statusClass = item.status; 
        
        let optionsHtml = "";
        item.options.forEach((optText, optIndex) => {
          let optStyle = "";
          let indicator = "";
          
          let isCorrect = (optIndex === Number(item.correctAnswer));
          let isUserChoice = (
            item.userAnswer !== null && 
            item.userAnswer !== undefined && 
            item.userAnswer !== "" && 
            optIndex === Number(item.userAnswer)
          );
          
          if (isCorrect) {
            optStyle = "color: #2f855a; background: #e6fffa;";
            indicator = " ✅ (Correct Answer)";
          }
          if (isUserChoice) {
            optStyle = "color: #c53030; background: #fff5f5;";
            indicator = " 👤 (Your Answer)";
          }
          if (isCorrect && isUserChoice) {
            optStyle = "color: #22543d; background: #c6f6d5; font-weight: bold;";
            indicator = " ✅ (Your Answer & Correct)";
          }

          optionsHtml += `<div class="opt-item" style="${optStyle}">${optIndex + 1}. ${optText}${indicator}</div>`;
        });

        let statusText = item.status.toUpperCase();

        reviewHtml += `
          <div class="review-card ${statusClass}">
            <div class="q-title">Q${index + 1}: ${item.question} <span style="float: right; font-size: 12px;">[${statusText}]</span></div>
            <div class="options-review-grid">
              ${optionsHtml}
            </div>
          </div>
        `;
      });

      document.getElementById("reviewListContainer").innerHTML = reviewHtml;
    }
  } else {
    document.getElementById("message").innerText = "No recent test result found!";
    document.getElementById("total").innerText = "0";
    document.getElementById("correct").innerText = "0";
    document.getElementById("score").innerText = "0 Marks";
    document.getElementById("reviewToggleBtn").style.display = "none";
  }
};

function toggleReview() {
  const reviewSection = document.getElementById("reviewSection");
  const toggleBtn = document.getElementById("reviewToggleBtn");
  
  if (reviewSection.style.display === "none" || reviewSection.style.display === "") {
    reviewSection.style.display = "block";
    toggleBtn.innerText = "🔼 Hide Review";
  } else {
    reviewSection.style.display = "none";
    toggleBtn.innerText = "🔍 Review Answers";
  }
}

function downloadPDF() {
  const reviewSection = document.getElementById("reviewSection");
  const wasHidden = reviewSection.style.display === "none" || reviewSection.style.display === "";
  
  if (wasHidden) {
    reviewSection.style.display = "block";
  }

  window.print();

  if (wasHidden) {
    reviewSection.style.display = "none";
  }
}