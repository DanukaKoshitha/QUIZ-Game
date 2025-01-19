const resultsContainer = document.getElementById("results");
const summaryContainer = document.getElementById("summary");
const allGameResults = JSON.parse(localStorage.getItem("allGameResults")) || [];
const lastGameResults = allGameResults[allGameResults.length - 1] || [];

if (lastGameResults.length === 0) {
  resultsContainer.innerHTML = "<p>No results found for the last game.</p>";
} else {
  let correctCount = 0;
  lastGameResults.forEach((result, index) => {
    const isCorrect = result.isCorrect;
    if (isCorrect) correctCount++;
    
    const uniqueOptions = new Set(result.options);
    
    const resultHTML = `
      <div class="question-box">
        <h3>Question ${index + 1}: ${result.question}</h3>
        <ul class="answer-list">
          ${Array.from(uniqueOptions)
            .map((option) => {
              const className = option === result.selectedAnswer ? 
                (isCorrect ? "correct" : "incorrect") : "";
              return `<li class="${className}">${option}</li>`;
            })
            .join("")}
        </ul>
        <p>${isCorrect ? "✔️ Correct" : "❌ Incorrect"}</p>
        <strong>Correct Answer:</strong> ${result.correctAnswer}
      </div>
    `;
    resultsContainer.innerHTML += resultHTML;
  });

  const totalQuestions = lastGameResults.length;
  summaryContainer.innerHTML = `You got <span>${correctCount}</span> out of <span>${totalQuestions}</span> questions correct!`;
}

function startNewGame() {
  window.location.href = "http://127.0.0.1:5500/startGame.html";
}

function goHome() {
  window.location.href = "index.html";
}