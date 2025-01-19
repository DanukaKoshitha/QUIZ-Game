let sec = 0;
let qNumber = 1;
let interval = undefined;
let nextQuestionIndex = 0;
let data = [];
let correct_answer = null;
let selected_answer = 0;
let correctAnswer_count = 0;

let textArea = document.getElementById("text-Area");
let NoOfQuestions = 0;

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

////////////////////////  Set Data for Dropdowns  ///////////////////////
const options = [
  { value: "music", text: "Music" },
  { value: "sport_and_leisure", text: "Sport and Leisure" },
  { value: "film_and_tv", text: "Film and TV" },
  { value: "arts_and_literature", text: "Arts and Literature" },
  { value: "geography", text: "Geography" },
  { value: "history", text: "History" },
  { value: "science", text: "Science" },
  { value: "society_and_culture", text: "Society and Culture" },
  { value: "food_and_drink", text: "Food and Drink" },
  { value: "general_knowledge", text: "General Knowledge" },
];

const dropdown = document.getElementById("dropdown");

options.forEach((option) => {
  const newOption = document.createElement("option");
  newOption.value = option.value;
  newOption.textContent = option.text;
  dropdown.appendChild(newOption);
});

const option1 = [
  { value: "easy", text: "Easy" },
  { value: "medium", text: "Medium" },
  { value: "hard", text: "Hard" },
];

let dropdownDifficle = document.getElementById("dropdown1");

option1.forEach((option) => {
  const newOptionDiffecle = document.createElement("option");
  newOptionDiffecle.value = option.value;
  newOptionDiffecle.textContent = option.text;
  dropdownDifficle.appendChild(newOptionDiffecle);
});

//////////////////////////////////////////////////////////////

const displayQize = () => {
  sec = 0; 
  interval = setInterval(() => {
    if (sec < 10) {
      $("#timer").val("00:0" + sec);
    } else {
      $("#timer").val("00:" + sec);
    }
    sec++;

    if (sec == 21) {
      veryfiyNumber("skipped");
      sec = 0;
    }
  }, 1000);
};

const displayNextQuestion = () => {
  if (nextQuestionIndex >= data.length) {
    endQuiz();
    console.log(correctAnswer_count);
    
    return;
  }

  let Load_question = data[nextQuestionIndex];

  textArea.innerHTML = Load_question.question.text;

  let answers = Load_question.incorrectAnswers;
  correct_answer = Load_question.correctAnswer;
  console.log("Correct answer: ", correct_answer);

 

  answers.push(correct_answer);
  shuffle(answers);

  // console.log("correct answer index from answers array : "+answers.indexOf(correct_answer));

  // let correctAnswer_Index = answers.indexOf(correct_answer);
  
  // if(selected_answer == (correctAnswer_Index+1)){
  //   correctAnswer_count++;
  //   console.log("correct ===== "+correctAnswer_count);
    
  // }

  answers.forEach((ans, index) => {
    let current_answer = document.getElementById(`answer_${index + 1}`);
    current_answer.innerHTML = ans;
  });

  nextQuestionIndex++;
};

const veryfiyNumber = (action = "answered") => {
  if (qNumber < NoOfQuestions) {
    qNumber++;
    $("#Q-number").val(qNumber + "/" + NoOfQuestions);
  }

  clearInterval(interval);

  const currentGameResults =
    JSON.parse(localStorage.getItem("currentGameResults")) || [];

  if (action === "answered") {
    const selectedOption = document.querySelector(
      'input[name="answer"]:checked'
    );

    if (selectedOption) {
      selected_answer = parseInt(selectedOption.value);
      console.log("Selected Answer Index: ", selected_answer);

      const currentQuestion = data[nextQuestionIndex - 1]; 
      const correctAnswerIndex = getCorrectAnswerIndex(currentQuestion);

      const isCorrect = selected_answer === correctAnswerIndex + 1;
      if (isCorrect) {
        correctAnswer_count++;
        console.log("Correct Answer! Total: ", correctAnswer_count);
      } else {
        console.log("Wrong Answer!");
      }

      currentGameResults.push({
        question: currentQuestion.question.text,
        options: [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer],
        correctAnswer: currentQuestion.correctAnswer,
        selectedAnswer:
          currentQuestion.incorrectAnswers[selected_answer - 1] ||
          currentQuestion.correctAnswer,
        isCorrect,
      });
    } else {
      console.log("No answer selected. Question skipped.");
      currentGameResults.push({
        question: data[nextQuestionIndex - 1].question.text,
        options: [
          ...data[nextQuestionIndex - 1].incorrectAnswers,
          data[nextQuestionIndex - 1].correctAnswer,
        ],
        correctAnswer: data[nextQuestionIndex - 1].correctAnswer,
        selectedAnswer: null,
        isCorrect: false,
      });
    }
  }

  localStorage.setItem("currentGameResults", JSON.stringify(currentGameResults));

  document.querySelectorAll('input[name="answer"]').forEach((input) => {
    input.checked = false;
  });

  displayNextQuestion();
  displayQize(); 
};


const getCorrectAnswerIndex = (question) => {
  const answers = [...question.incorrectAnswers, question.correctAnswer];
  return answers.indexOf(question.correctAnswer);
};


const endQuiz = () => {
  clearInterval(interval);
  alert("Quiz Completed! Thank you for playing.");
  $("#btnStart").prop("disabled", false);
  document.getElementById("next").disabled = true;
  document.getElementById("skip").disabled = true;

  textArea.innerHTML = "Quiz Completed! Play again.";
  $("#Q-number").val("0/0");
  $("#timer").val("00:00");

  document.getElementById("answer_1").innerHTML="Answer 1"
  document.getElementById("answer_2").innerHTML="Answer 2"
  document.getElementById("answer_3").innerHTML="Answer 3"
  document.getElementById("answer_4").innerHTML="Answer 4"

  const currentGameResults = JSON.parse(localStorage.getItem("currentGameResults")) || [];

  const allGameResults = JSON.parse(localStorage.getItem("allGameResults")) || [];
  allGameResults.push(currentGameResults);

  localStorage.setItem("allGameResults", JSON.stringify(allGameResults));

  localStorage.removeItem("currentGameResults");

};


const start = () => {
  sec = 0;
  qNumber = 1;
  nextQuestionIndex = 0;
  data = [];
  clearInterval(interval);

  $("#btnStart").prop("disabled", true);
  $("#Q-number").val("1/" + document.getElementById("noofQus").value);
  $("#timer").val("00:00");
  textArea.innerHTML = "";

  const selectCategory = dropdown.value;
  const selectedDefficleText = dropdownDifficle.value;
  NoOfQuestions = document.getElementById("noofQus").value;

  if (!selectCategory || !selectedDefficleText || !NoOfQuestions) {
    alert("Please make sure all fields are filled!");
    return;
  }

  document.getElementById("next").disabled = false;
  document.getElementById("skip").disabled = false;

  fetch(
    `https://the-trivia-api.com/v2/questions?difficulties=${selectedDefficleText}&categories=${selectCategory}&limit=${NoOfQuestions}`
  )
    .then((res) => {
      return res.json();
    })
    .then((fetchedData) => {
      data = fetchedData;
      displayNextQuestion();
      displayQize();
    })
};

document.getElementById("next").addEventListener("click", () => {
  veryfiyNumber("answered");
});

document.getElementById("skip").addEventListener("click", () => {
  veryfiyNumber("skipped");
});

