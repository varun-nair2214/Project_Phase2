var questions = [
  {
    category: "Programming",
    text: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyper Transfer Markup Logic", "Home Tool Makeup Language"],
    correct: 0
  },
  {
    category: "Data Structures",
    text: "Which data structure uses LIFO (Last In, First Out) order?",
    options: ["Queue", "Array", "Stack", "Linked List"],
    correct: 2
  },
  {
    category: "Computer Science",
    text: "What is the time complexity of Binary Search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    correct: 2
  },
  {
    category: "Programming",
    text: "Which keyword is used to define a function in Python?",
    options: ["function", "def", "func", "define"],
    correct: 1
  },
  {
    category: "Networking",
    text: "What does HTTP stand for?",
    options: ["Hyper Text Transfer Protocol", "High Text Transport Protocol", "Hyper Transfer Text Protocol", "Home Text Transfer Protocol"],
    correct: 0
  },
  {
    category: "Aptitude",
    text: "A train travels 120 km in 2 hours. What is its speed?",
    options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
    correct: 1
  },
  {
    category: "Database",
    text: "Which SQL command is used to retrieve data from a database?",
    options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
    correct: 2
  },
  {
    category: "Programming",
    text: "In JavaScript, which method adds an element at the END of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correct: 0
  },
  {
    category: "Computer Science",
    text: "What is the full form of CPU?",
    options: ["Central Processing Unit", "Core Processor Unit", "Central Program Utility", "Computed Processing Unit"],
    correct: 0
  },
  {
    category: "Operating Systems",
    text: "Which of the following is NOT an operating system?",
    options: ["Linux", "Windows", "Oracle", "macOS"],
    correct: 2
  },
  {
    category: "Aptitude",
    text: "What is the next number in: 2, 4, 8, 16, ?",
    options: ["24", "30", "32", "36"],
    correct: 2
  },
  {
    category: "Programming",
    text: "What symbol is used for single-line comments in JavaScript?",
    options: ["#", "//", "/* */", "--"],
    correct: 1
  }
];



var currentIndex = 0;   
var score        = 0;  
var wrong        = 0;   
var skipped      = 0;   
var answered     = false; 
var timerInterval = null; 
var timeLeft     = 0;   
var activeQuestions = []; 
var isCustom     = false; 
var TIMER_SECS   = 15;  

// For builder
var builderList = []; // array of question objects being built


// ── SCREEN SWITCHING ──────────────────────────
// Simple function to show one screen and hide all others
function showScreen(id) {
  var screens = document.querySelectorAll(".screen");
  for (var i = 0; i < screens.length; i++) {
    screens[i].classList.remove("active");
  }
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}


// ── TOAST NOTIFICATION ────────────────────────
// Shows a small message at the bottom of the screen
function showToast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function() {
    t.classList.remove("show");
  }, 2200);
}


// ── HOME SCREEN BUTTONS ───────────────────────
document.getElementById("goCreate").addEventListener("click", function() {
  showScreen("createScreen");
  if (builderList.length === 0) addBuilderQuestion();
  renderBuilder();
});

document.getElementById("goPlay").addEventListener("click", function() {
  isCustom = false;
  // Shuffle the predefined questions
  var shuffled = questions.slice().sort(function() { return Math.random() - 0.5; });
  startQuiz(shuffled);
});

document.getElementById("backFromCreate").addEventListener("click", function() {
  showScreen("homeScreen");
});

document.getElementById("backFromQuiz").addEventListener("click", function() {
  stopTimer();
  showScreen("homeScreen");
});

document.getElementById("homeFromResult").addEventListener("click", function() {
  showScreen("homeScreen");
});


// =============================================
// CREATE QUIZ — Builder Logic
// =============================================

// Add a blank question object to the builder list
function addBuilderQuestion() {
  builderList.push({
    text: "",
    options: ["", "", "", ""],
    correct: 0
  });
}

// Remove a question from the builder list by index
function removeBuilderQuestion(index) {
  if (builderList.length <= 1) {
    showToast("⚠️ Need at least 1 question!");
    return;
  }
  builderList.splice(index, 1);
  renderBuilder();
}

// Draw all the builder cards on screen
function renderBuilder() {
  var container = document.getElementById("questionBuilderList");
  container.innerHTML = ""; // clear old cards

  var letters = ["A", "B", "C", "D"];

  for (var i = 0; i < builderList.length; i++) {
    var q = builderList[i];

    // Build the 4 option input rows
    var optionHTML = "";
    for (var j = 0; j < 4; j++) {
      optionHTML +=
        '<div class="option-row">' +
          '<span class="opt-label">' + letters[j] + '</span>' +
          '<input class="builder-input" style="margin-bottom:0" type="text" ' +
            'placeholder="Option ' + letters[j] + '" ' +
            'data-qi="' + i + '" data-oi="' + j + '" ' +
            'value="' + escapeHtml(q.options[j]) + '">' +
        '</div>';
    }

    // Build correct-answer dropdown
    var correctHTML = "";
    for (var k = 0; k < 4; k++) {
      correctHTML += '<option value="' + k + '" ' + (q.correct === k ? "selected" : "") + '>Option ' + letters[k] + '</option>';
    }

    // Create the card element
    var card = document.createElement("div");
    card.className = "builder-card";
    card.innerHTML =
      '<div class="builder-card-header">' +
        '<span>Question ' + (i + 1) + '</span>' +
        '<button class="btn-remove" data-index="' + i + '">✕ Remove</button>' +
      '</div>' +
      '<input class="builder-input" type="text" placeholder="Type your question here…" ' +
        'data-qi="' + i + '" data-field="text" value="' + escapeHtml(q.text) + '">' +
      '<div class="options-grid-2col">' + optionHTML + '</div>' +
      '<label class="correct-label">✅ Correct Answer:</label>' +
      '<select class="correct-select" data-qi="' + i + '">' + correctHTML + '</select>';

    container.appendChild(card);
  }

  // Attach events to the new inputs
  attachBuilderEvents();
}

// Listen to changes inside the builder cards
function attachBuilderEvents() {

  // Question text inputs
  var textInputs = document.querySelectorAll(".builder-input[data-field='text']");
  textInputs.forEach(function(input) {
    input.addEventListener("input", function() {
      builderList[parseInt(this.dataset.qi)].text = this.value;
    });
  });

  // Option inputs
  var optionInputs = document.querySelectorAll(".builder-input[data-oi]");
  optionInputs.forEach(function(input) {
    input.addEventListener("input", function() {
      builderList[parseInt(this.dataset.qi)].options[parseInt(this.dataset.oi)] = this.value;
    });
  });

  // Correct answer dropdowns
  var selects = document.querySelectorAll(".correct-select");
  selects.forEach(function(sel) {
    sel.addEventListener("change", function() {
      builderList[parseInt(this.dataset.qi)].correct = parseInt(this.value);
    });
  });

  // Remove buttons
  var removeBtns = document.querySelectorAll(".btn-remove");
  removeBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      removeBuilderQuestion(parseInt(this.dataset.index));
    });
  });
}

// "Add Question" button
document.getElementById("addQuestionBtn").addEventListener("click", function() {
  // Save current values from DOM first
  syncBuilder();
  addBuilderQuestion();
  renderBuilder();
});

// "Start Quiz" button — validates and starts the custom quiz
document.getElementById("startCustomQuizBtn").addEventListener("click", function() {
  syncBuilder();

  // Validate: check every question and option is filled
  for (var i = 0; i < builderList.length; i++) {
    if (!builderList[i].text.trim()) {
      showToast("⚠️ Question " + (i + 1) + " is empty!");
      return;
    }
    for (var j = 0; j < 4; j++) {
      if (!builderList[i].options[j].trim()) {
        showToast("⚠️ Q" + (i + 1) + ": Option " + ["A","B","C","D"][j] + " is empty!");
        return;
      }
    }
  }

  // Convert builder list to quiz format
  var quizQs = builderList.map(function(bq) {
    return {
      category: "Custom",
      text: bq.text,
      options: bq.options.slice(),
      correct: bq.correct
    };
  });

  isCustom = true;
  startQuiz(quizQs);
});

// Read all current DOM input values back into builderList
function syncBuilder() {
  var textInputs = document.querySelectorAll(".builder-input[data-field='text']");
  textInputs.forEach(function(input) {
    builderList[parseInt(input.dataset.qi)].text = input.value;
  });

  var optInputs = document.querySelectorAll(".builder-input[data-oi]");
  optInputs.forEach(function(input) {
    builderList[parseInt(input.dataset.qi)].options[parseInt(input.dataset.oi)] = input.value;
  });

  var selects = document.querySelectorAll(".correct-select");
  selects.forEach(function(sel) {
    builderList[parseInt(sel.dataset.qi)].correct = parseInt(sel.value);
  });
}



// Start a quiz with the given array of questions
function startQuiz(qs) {
  activeQuestions = qs;
  currentIndex    = 0;
  score           = 0;
  wrong           = 0;
  skipped         = 0;

  showScreen("quizScreen");
  loadQuestion();
}

// Load and display the current question
function loadQuestion() {
  var q     = activeQuestions[currentIndex];
  var total = activeQuestions.length;
  answered  = false;

  // Update counter text
  document.getElementById("questionCounter").textContent = "Q " + (currentIndex + 1) + " / " + total;

  // Update progress bar (based on questions completed so far)
  var pct = (currentIndex / total) * 100;
  document.getElementById("progressFill").style.width = pct + "%";

  // Show category and question text
  document.getElementById("questionCategory").textContent = q.category || "General";
  document.getElementById("questionText").textContent     = q.text;

  // Build option buttons
  var grid    = document.getElementById("optionsGrid");
  var letters = ["A", "B", "C", "D"];
  grid.innerHTML = "";

  for (var i = 0; i < q.options.length; i++) {
    var btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = '<span class="opt-letter">' + letters[i] + '</span>' + escapeHtml(q.options[i]);
    btn.dataset.index = i;
    btn.addEventListener("click", handleAnswer);
    grid.appendChild(btn);
  }

  // Hide the Next button until answer is chosen
  document.getElementById("nextBtn").style.display = "none";

  // Start countdown timer
  startTimer();
}

// Called when the user clicks an option button
function handleAnswer(event) {
  if (answered) return; // ignore if already answered
  answered = true;
  stopTimer();

  var selected = parseInt(event.currentTarget.dataset.index);
  var correct  = activeQuestions[currentIndex].correct;
  var buttons  = document.querySelectorAll(".option-btn");

  // Disable all buttons so user can't click again
  buttons.forEach(function(b) { b.disabled = true; });

  // Highlight the correct answer in green
  buttons[correct].classList.add("correct");

  if (selected === correct) {
    score++;
    showToast("✅ Correct!");
  } else {
    // Highlight the user's wrong pick in red
    buttons[selected].classList.add("wrong");
    wrong++;
    showToast("❌ Wrong! Correct answer highlighted.");
  }

  // Show the Next / Finish button
  showNextBtn();
}

// Show the next/finish button with the right label
function showNextBtn() {
  var btn    = document.getElementById("nextBtn");
  var isLast = currentIndex === activeQuestions.length - 1;
  btn.textContent = isLast ? "🏁 See Results" : "Next Question →";
  btn.style.display = "inline-block";
}

// Next button click — go to next question or show result
document.getElementById("nextBtn").addEventListener("click", function() {
  currentIndex++;
  if (currentIndex >= activeQuestions.length) {
    showResult();
  } else {
    loadQuestion();
  }
});



function startTimer() {
  timeLeft = TIMER_SECS;
  updateTimerUI();

  timerInterval = setInterval(function() {
    timeLeft--;
    updateTimerUI();

    if (timeLeft <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerUI() {
  var display = document.getElementById("timerDisplay");
  var box     = display.parentElement; 
  display.textContent = timeLeft;

  box.classList.remove("warning", "danger");
  if (timeLeft <= 5)      box.classList.add("danger");
  else if (timeLeft <= 9) box.classList.add("warning");
}

// Called when timer hits 0 — reveal answer, mark as skipped
function handleTimeout() {
  if (answered) return;
  answered = true;
  skipped++;

  var correct = activeQuestions[currentIndex].correct;
  var buttons = document.querySelectorAll(".option-btn");
  buttons.forEach(function(b) { b.disabled = true; });
  buttons[correct].classList.add("correct");

  showToast("⏱ Time's up!");
  showNextBtn();
}



function showResult() {
  stopTimer();

  var total = activeQuestions.length;
  var pct   = Math.round((score / total) * 100);

  // Pick emoji and title based on score percentage
  var emoji, title;
  if (pct >= 80)      { emoji = "🏆"; title = "Excellent!"; }
  else if (pct >= 60) { emoji = "🎉"; title = "Good Job!"; }
  else if (pct >= 40) { emoji = "😊"; title = "Keep Trying!"; }
  else                { emoji = "💪"; title = "Don't Give Up!"; }

  document.getElementById("resultEmoji").textContent  = emoji;
  document.getElementById("resultTitle").textContent  = title;
  document.getElementById("scoreValue").textContent   = score;
  document.getElementById("scoreTotal").textContent   = "/ " + total;
  document.getElementById("scorePercent").textContent = pct + "%";
  document.getElementById("statCorrect").textContent  = score;
  document.getElementById("statWrong").textContent    = wrong;
  document.getElementById("statSkipped").textContent  = skipped;

  showScreen("resultScreen");

  // Animate the result progress bar
  setTimeout(function() {
    document.getElementById("resultBarFill").style.width = pct + "%";
  }, 200);
}

// Restart button — shuffle the same questions and play again
document.getElementById("restartBtn").addEventListener("click", function() {
  var shuffled = activeQuestions.slice().sort(function() { return Math.random() - 0.5; });
  startQuiz(shuffled);
});



function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Keyboard shortcuts: A/B/C/D to pick answer, Enter to go next
document.addEventListener("keydown", function(e) {
  var quizActive = document.getElementById("quizScreen").classList.contains("active");
  if (!quizActive) return;

  var key    = e.key.toLowerCase();
  var keyMap = { a: 0, b: 1, c: 2, d: 3 };

  if (keyMap.hasOwnProperty(key) && !answered) {
    var buttons = document.querySelectorAll(".option-btn");
    if (buttons[keyMap[key]]) buttons[keyMap[key]].click();
  }

  if (e.key === "Enter" && answered) {
    document.getElementById("nextBtn").click();
  }
});

// Start on home screen
showScreen("homeScreen");
