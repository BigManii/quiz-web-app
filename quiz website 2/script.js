let questions = [
    {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: 2,
        hints: ["It's a gas giant.", "This planet has a large red spot.", "It's closer to the sun than Saturn."]
    },
    {
        question: "Which element does 'O' represent on the periodic table?",
        options: ["Osmium", "Oxygen", "Ozone", "Olive"],
        answer: 1,
        hints: ["This element is essential for life.", "It's what you breathe.", "It makes up almost 21% of the air."]
    },
    {
        question: "What is the capital of Japan?",
        options: ["Kyoto", "Osaka", "Tokyo", "Nagoya"],
        answer: 2,
        hints: ["This city hosted the 2020 Olympics.", "It's not the old capital Kyoto.", "It's the most populous city in Japan."]
    },
    {
        question: "Who wrote 'To Kill a Mockingbird'?",
        options: ["Harper Lee", "Ernest Hemingway", "F. Scott Fitzgerald", "George Orwell"],
        answer: 0,
        hints: ["The author's last name is a type of bird.", "The book is set in the American South.", "It was the only novel she published in her lifetime."]
    },
    {
        question: "What is the square root of 64?",
        options: ["6", "7", "8", "9"],
        answer: 2,
        hints: ["The answer is an even number.", "It's greater than 6 but less than 10.", "The number multiplied by itself equals 64."]
    }
];

let players = [];
let currentPlayer = 0;
let currentQuestion = 0;
let playerAnswers = [];
let questionTimer;
let countdownTimer;
const QUESTION_TIME_LIMIT = 10000; // 10 seconds for each question
let timeLeft = 10;

function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

function startQuiz() {
    const numberOfPlayers = prompt("How many players are joining?");

    for (let i = 1; i <= numberOfPlayers; i++) {
        players.push({
            name: `Player ${i}`,
            score: 0,
            missedQuestions: []
        });
    }

    shuffleQuestions();
    currentQuestion = 0;
    currentPlayer = 0;
    document.getElementById("start-btn").style.display = "none";
    document.getElementById("quiz-box").style.display = "block";
    document.getElementById("total-questions").textContent = questions.length;
    loadQuestion();
}

function loadQuestion() {
    clearTimeout(questionTimer);
    clearInterval(countdownTimer);
    
    let question = questions[currentQuestion];
    document.getElementById("question").textContent = question.question;
    let optionButtons = document.querySelectorAll(".option-btn");
    optionButtons.forEach((button, index) => {
        button.textContent = question.options[index];
    });
    document.getElementById("current-question").textContent = currentQuestion + 1;
    
    document.getElementById("hint-box").textContent = ""; // Reset hint box
    document.getElementById("hint-btn").style.display = "block"; // Show hint button
    
    // Reset timer
    timeLeft = 10;
    document.getElementById("time-left").textContent = timeLeft;

    countdownTimer = setInterval(() => {
        timeLeft--;
        document.getElementById("time-left").textContent = timeLeft;
        if (timeLeft === 0) {
            nextQuestion();
        }
    }, 1000);

    questionTimer = setTimeout(() => {
        nextQuestion();
    }, QUESTION_TIME_LIMIT);
}

function showHint() {
    let hints = questions[currentQuestion].hints;
    let randomHintIndex = Math.floor(Math.random() * hints.length);
    let hint = hints[randomHintIndex];
    document.getElementById("hint-box").textContent = "Hint: " + hint;
    document.getElementById("hint-btn").style.display = "none"; // Disable hint button after showing hint
}

function checkAnswer(selectedOption) {
    clearTimeout(questionTimer);
    clearInterval(countdownTimer);

    let correctAnswer = questions[currentQuestion].answer;
    let player = players[currentPlayer];

    if (selectedOption === correctAnswer) {
        player.score++;
    } else {
        player.missedQuestions.push({
            question: questions[currentQuestion].question,
            correctAnswer: questions[currentQuestion].options[correctAnswer]
        });
    }

    nextQuestion();
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        switchPlayers();
    }
}

function switchPlayers() {
    currentPlayer++;

    if (currentPlayer < players.length) {
        currentQuestion = 0;
        alert(`${players[currentPlayer - 1].name} is done! Now it's ${players[currentPlayer].name}'s turn.`);
        loadQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    let resultHTML = '<h2>Quiz Finished!</h2>';
    players.forEach(player => {
        resultHTML += `<p>${player.name}'s Score: ${player.score} out of ${questions.length}</p>`;
        if (player.missedQuestions.length > 0) {
            resultHTML += `<p>${player.name} missed the following questions:</p>`;
            player.missedQuestions.forEach(missed => {
                resultHTML += `<p>Question: ${missed.question}<br>Correct Answer: ${missed.correctAnswer}</p>`;
            });
        }
    });

    document.getElementById("quiz-box").innerHTML = resultHTML + `<button onclick="location.reload()">Restart Quiz</button>`;
}
