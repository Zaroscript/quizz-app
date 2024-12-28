// Select elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-btn");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

//Set options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let qObject = JSON.parse(this.responseText);
      let qCount = qObject.length;

      //Create bullets and set questions count
      createBullets(qCount);

      // Add question data
      addQuestionData(qObject[currentIndex], qCount);

      // Click on submit
      submitBtn.onclick = () => {
        // Get right answer
        let rightAnswer = qObject[currentIndex].right_answer;

        // Icrease index
        currentIndex++;

        // Check the answer
        checkAnswer(rightAnswer, qCount);

        // Remove previous question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add question data
        addQuestionData(qObject[currentIndex], qCount);

        // Handle bullets classes
        handleBullets();

        // Timer function
        clearInterval(countDownInterval);
        countDown(5, qCount);

        // Show results
        showResults(qCount);
      };

      // Timer function
      countDown(5, qCount);
    }
  };

  myRequest.open("Get", "html-questions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  // Craete bullets
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    if (i === 0) {
      theBullet.className = "on";
    }

    bulletsSpanContainer.append(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create h2 question title
    let qTitle = document.createElement("h2");
    qTitle.appendChild(document.createTextNode(obj.title));
    quizArea.append(qTitle);

    // Create the answers
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }

      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      theLabel.appendChild(document.createTextNode(obj[`answer_${i}`]));

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answersArea.append(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === choosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpansArray = Array.from(
    document.querySelectorAll(".bullets .spans span")
  );

  bulletsSpansArray.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitBtn.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers > count) {
      theResults = `<span class="good">Good</span>, You got ${rightAnswers} on ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, You got ${rightAnswers} on ${count}`;
    } else {
      theResults = `<span class="bad">Bad</span>, You got ${rightAnswers} on ${count}`;
    }

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, second;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      second = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      second = second < 10 ? `0${second}` : second;

      countdownElement.innerHTML = `${minutes} : ${second}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
