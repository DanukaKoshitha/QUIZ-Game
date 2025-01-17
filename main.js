let sec = 0;
let qNumber = 1;
let interval = undefined;

let correct_answer = null;

$("#Q-number").val("1/5");
$("#timer").val("00:00");

const displayQize = () => {
  interval = setInterval(() => {
    if (sec < 10) {
      $("#timer").val("00:0" + sec);
    } else {
      $("#timer").val("00:" + sec);
    }
    sec++;

    if (sec == 11) {
      veryfiyNumber("skipped");
      $("#btnStart").prop("disabled", false);
      sec = 0;
      displayQize();
    }
  }, 1000);
};

const veryfiyNumber = (state) => {
  qNumber++;
  $("#Q-number").val(qNumber + "/5");
  clearInterval(interval);

  const selectedOption = document.querySelector('input[name="answer"]:checked');

  if (selectedOption) {
    alert("Selected Answer: " + selectedOption.value);

    let selected_answer = document.getElementById(
      `answer_${selectedOption.value}`
    );

    if (correct_answer === selected_answer.innerHTML) {
      alert("Your answer is correct!");
    } else {
      alert("Wrong");
    }



  } else {
    alert("No answer selected");
  }
};

const start = () => {
  $("#btnStart").prop("disabled", true);
  displayQize();
};

///////////////////////////////////////////////////////////////

let textArea = document.getElementById("text-Area");

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

////////////////////////  set data for dropdown  ///////////////////////

const options = [
  { value: 'music', text: 'Music' },
  { value: 'sport_and_leisure', text: 'Sport and Leisure' },
  { value: 'film_and_tv', text: 'Film and TV' },
  { value: 'arts_and_literature', text: 'Arts and Literature' },
  { value: 'geography', text: 'Geography' },
  { value: 'history', text: 'History' },
  { value: 'science', text: 'Science' },
  { value: 'society_and_culture', text: 'Society and Culture' },
  { value: 'food_and_drink', text: 'Food and Drink' },
  { value: 'general_knowledge', text: 'General Knowledge' }
];

const dropdown = document.getElementById('dropdown');

options.forEach(option => {
  const newOption = document.createElement('option');
  newOption.value = option.value; 
  newOption.textContent = option.text; 
  dropdown.appendChild(newOption); 
});

let selectCategory = dropdown.options[dropdown.selectedIndex].text;

///////////////////////  set difficulty  //////////////////////

const option1 = [
  {value:'easy',text:'Easy'},
  {value:'medium',text:'Medium'},
  {value:'hard',text:'Hard'}
];

let dropdownDifficle = document.getElementById("dropdown1");

option1.forEach(option => {
  const newOptionDiffecle = document.createElement('option');
  newOptionDiffecle.value = option.value;
  newOptionDiffecle.textContent = option.text;
  dropdownDifficle.appendChild(newOptionDiffecle);
});

let selectedDefficleText = dropdownDifficle.options[dropdownDifficle.selectedIndex].text;

//////////////////////////////////////////////////////////////

dropdownDifficle.addEventListener('change', () => {
fetch(`https://the-trivia-api.com/v2/questions?difficulties=${selectCategory}&categories=${selectedDefficleText}&limit=20`)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);

    let first_question = data[0];

    // LOAD QUESTION
    textArea.innerHTML = first_question.question.text;

    // LOAD ANSWERS
    let answers = first_question.incorrectAnswers; // this is an array

    correct_answer = first_question.correctAnswer;
    console.log("Correct answer: ", correct_answer);
    

    answers.push(correct_answer);

    shuffle(answers);

    answers.forEach((ans, index) => {
      let current_answer = document.getElementById(`answer_${index + 1}`);

      current_answer.innerHTML = ans;

    });
  });

});
