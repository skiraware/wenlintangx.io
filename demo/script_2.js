// script.js
let quizzes = [];
let currentSetId = null;
let currentIsReview = false;
let currentView = "home";
let pieChart = null;
let stats = {
  totalAnswered: 0,
  sets: {},
  wrongQuestions: [],
};

async function loadQuizzes() {
  try {
    const response = await fetch("questions_2.json");
    quizzes = await response.json();
    renderSets();
    loadStatsFromURL();
    updateProfile();
    showHome();
  } catch (error) {
    console.error("Failed to load quizzes:", error);
  }
}

function renderSets() {
  const setsList = document.querySelector("#sets-list .d-flex");
  setsList.innerHTML = ""; // Clear existing

  quizzes.sets.forEach((set) => {
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-primary");
    btn.textContent = set.id.charAt(0).toUpperCase() + set.id.slice(1);
    btn.onclick = () => loadSet(set.id);
    setsList.appendChild(btn);
  });
}

// NEW: Render "Review Wrong" button ONLY in profile
function renderReviewButton() {
  const profileContainer = document.getElementById("profile-container");
  let reviewBtn = profileContainer.querySelector(".review-wrong-btn");

  if (stats.wrongQuestions.length > 0 && !reviewBtn) {
    reviewBtn = document.createElement("button");
    reviewBtn.className =
      "btn btn-secondary review-wrong-btn mt-3 d-block mx-auto";
    reviewBtn.textContent = "Review Wrong Questions";
    reviewBtn.onclick = () => loadSet("review", true);
    profileContainer.querySelector(".card-body").appendChild(reviewBtn);
  } else if (stats.wrongQuestions.length === 0 && reviewBtn) {
    reviewBtn.remove();
  }
}

function loadSet(setId, isReview = false) {
  currentSetId = setId;
  currentIsReview = isReview;
  currentView = "quiz";
  const set = isReview
    ? generateReviewSet()
    : quizzes.sets.find((s) => s.id === setId);
  if (!set) return;

  document.getElementById("set-title").textContent = isReview
    ? "Review Wrong Questions"
    : set.id.charAt(0).toUpperCase() + set.id.slice(1);

  const form = document.getElementById("quiz-form");
  const submitBtn = document.getElementById("submit-btn");
  const saveBtn = document.getElementById("save-progress-fixed");
  const resultsDiv = document.getElementById("results");

  form.innerHTML = "";
  resultsDiv.innerHTML = "";
  resultsDiv.style.display = "none";
  form.style.display = "none";
  submitBtn.style.cssText = "display: none !important;";

  const setStats = stats.sets[setId] || { answers: {}, submitted: false };
  if (!stats.sets[setId]) {
    stats.sets[setId] = {
      incorrect: 0,
      total: set.questions.length,
      answered: 0, // ← ADD
      submitted: false,
      answers: {},
    };
  }

  if (isReview) {
    showReviewResults(set);
    saveBtn.style.display = "block";
  } else if (setStats.submitted) {
    showResults(set, setStats.answers);
    saveBtn.style.display = "block";
    document.getElementById("submit-btn").style.display = "none"; // ADD THIS
  } else {
    form.style.display = "block";
    set.questions.forEach((q, index) => {
      const div = document.createElement("div");
      div.classList.add("question");
      const questionId = `${setId}-q${index}`;
      div.innerHTML = `
        <p>${index + 1}. ${q.question}</p>
        ${q.options
          .map(
            (opt, i) => `
            <label>
                <input type="radio" name="q${index}" value="${String.fromCharCode(
              65 + i
            )}" ${
              setStats.answers[index] === String.fromCharCode(65 + i)
                ? "checked"
                : ""
            }>
                ${opt}
            </label>
          `
          )
          .join("")}
      `;
      form.appendChild(div);

      const radios = div.querySelectorAll(`input[name="q${index}"]`);
      radios.forEach((radio) => {
        radio.addEventListener("change", (e) => {
          stats.sets[setId].answers[index] = e.target.value;
          updateURLWithStats();
        });
      });
    });
    submitBtn.style.display = "block";
    saveBtn.style.display = "block";
    submitBtn.onclick = (e) => {
      e.preventDefault();
      submitQuiz(set, isReview);
    };
  }

  showQuiz();
  document.getElementById("quiz-container").style.display = "block";
  if (currentIsReview || stats.sets[currentSetId]?.submitted) {
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.style.cssText = "display: none !important;";
  }
}

function generateReviewSet() {
  const reviewQuestions = stats.wrongQuestions
    .map((wq) => {
      const originalSet = quizzes.sets.find((s) => s.id === wq.setId);
      if (originalSet) {
        return originalSet.questions[wq.questionIndex];
      }
      return null;
    })
    .filter((q) => q !== null);
  return { id: "review", questions: reviewQuestions };
}

function submitQuiz(set, isReview) {
  const form = document.getElementById("quiz-form");
  const submitBtn = document.getElementById("submit-btn");
  const setStats = stats.sets[currentSetId];
  let incorrectCount = 0;
  const answers = {};
  let answeredCount = 0;
  set.questions.forEach((q, index) => {
    const selected = form.querySelector(`input[name="q${index}"]:checked`);
    const answer = selected ? selected.value : null;
    answers[index] = answer;
    if (answer !== null) answeredCount++;
    if (answer && answer !== q.correct) incorrectCount++;
  });

  // HIDE SUBMIT BUTTON FIRST
  submitBtn.style.cssText = "display: none !important;";

  // Show results
  showResults(set, answers);

  // Update stats only if not review and not already submitted
  if (!isReview && !setStats.submitted) {
    // Add wrong OR unanswered questions to review list
    set.questions.forEach((q, index) => {
      const userAnswer = answers[index];
      const isAnswered = userAnswer !== null;
      const isCorrect = userAnswer === q.correct;

      if (!isAnswered || (isAnswered && !isCorrect)) {
        const questionId = `${currentSetId}-q${index}`;
        if (!stats.wrongQuestions.some((wq) => wq.questionId === questionId)) {
          stats.wrongQuestions.push({
            setId: currentSetId,
            questionIndex: index,
            questionId,
          });
        }
      }
    });

    stats.sets[currentSetId].answered = answeredCount;
    stats.sets[currentSetId].incorrect = incorrectCount;
    stats.sets[currentSetId].submitted = true;
    stats.sets[currentSetId].answers = answers;
    stats.totalAnswered += answeredCount;

    updateURLWithStats();
    updateProfile();
    renderSets();
  }
  document.getElementById("save-progress-fixed").style.display = "block";
}

/* ---------- FIXED showResults (hides submit button) ---------- */
function showResults(set, answers) {
  console.log(
    "%c[DEBUG] showResults() called",
    "color: cyan; font-weight: bold"
  );
  const resultsDiv = document.getElementById("results");
  const submitBtn = document.getElementById("submit-btn");
  const form = document.getElementById("quiz-form");
  // DEBUG: Check current display
  console.log("submitBtn display BEFORE:", submitBtn.style.display);
  console.log("submitBtn element:", submitBtn);
  submitBtn.style.cssText = "display: none !important;";
  form.style.display = "none";
  console.log("submitBtn display AFTER:", submitBtn.style.display);
  resultsDiv.innerHTML = "";
  set.questions.forEach((q, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === q.correct;
    const status = isCorrect
      ? '<span class="text-success">Correct</span>'
      : '<span class="text-danger">Incorrect</span>';

    const div = document.createElement("div");
    div.className = "mb-4";
    div.innerHTML = `
      <p>${index + 1}. ${q.question}</p>
      <p>Your answer: ${userAnswer || "None"} (${status})</p>
      ${q.options
        .map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          let cls = letter === q.correct ? "option-correct" : "";
          if (letter === userAnswer && !isCorrect) cls = "option-incorrect";
          return `<label class="${cls}"><input type="radio" disabled ${
            letter === userAnswer ? "checked" : ""
          }> ${opt}</label>`;
        })
        .join("")}
      <div class="explanation"><strong>Correct answer:</strong> ${
        q.correct
      }<br>${q.explanation}</div>
      <div class="quote"><strong>Quote:</strong> "${q.quote}"</div>
    `;
    resultsDiv.appendChild(div);
  });

  resultsDiv.style.display = "block";
}
function showReviewResults(set) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  set.questions.forEach((q, index) => {
    const resultDiv = document.createElement("div");
    resultDiv.classList.add("mb-4");
    resultDiv.innerHTML = `
      <p>${index + 1}. ${q.question}</p>
      ${q.options
        .map((opt, i) => {
          const optLetter = String.fromCharCode(65 + i);
          const className = optLetter === q.correct ? "option-correct" : "";
          return `<label class="${className}"><input type="radio" disabled ${
            optLetter === q.correct ? "checked" : ""
          }> ${opt}</label>`;
        })
        .join("")}

      <div class="explanation"><strong>Correct answer:</strong> ${
        q.correct
      }<br>${q.explanation}</div>
      <div class="quote"><strong>Quote:</strong> "${q.quote}"</div>
    `;
    resultsDiv.appendChild(resultDiv);
  });

  resultsDiv.style.display = "block";
}

function saveProgress() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      alert("Progress URL copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

function getStatsFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedStats = urlParams.get("stats");
  if (encodedStats) {
    try {
      const jsonString = atob(encodedStats);
      const loaded = JSON.parse(jsonString);

      // Ensure all set stats have `answered`
      Object.keys(loaded.sets || {}).forEach((setId) => {
        if (!loaded.sets[setId].answered) {
          loaded.sets[setId].answered = 0;
        }
      });

      return loaded;
    } catch (e) {
      console.error("Invalid URL stats:", e);
    }
  }
  return { totalAnswered: 0, sets: {}, wrongQuestions: [] };
}
function loadStatsFromURL() {
  stats = getStatsFromURL();
}

function updateURLWithStats() {
  const jsonString = JSON.stringify(stats);
  const encoded = btoa(jsonString);
  const newUrl = `${window.location.pathname}?stats=${encoded}`;
  history.pushState({}, "", newUrl);
}

function updateProfile() {
  document.getElementById("total-answered").textContent = stats.totalAnswered;

  let totalCorrect = 0;
  let totalAnswered = 0;
  let totalWrong = 0;
  const setsStatsList = document.getElementById("sets-stats");
  setsStatsList.innerHTML = "";

  Object.keys(stats.sets).forEach((setId) => {
    if (setId === "review") return;
    const s = stats.sets[setId];
    if (s.submitted) {
      const correct = s.answered - s.incorrect;
      const wrong = s.incorrect;

      totalCorrect += correct;
      totalAnswered += s.answered;
      totalWrong += wrong;

      const percentage =
        s.answered > 0 ? ((correct / s.answered) * 100).toFixed(0) : 0;
      let colorClass = "";
      if (percentage >= 85) colorClass = "list-group-item-success";
      else if (percentage >= 70) colorClass = "list-group-item-warning";
      else colorClass = "list-group-item-danger";

      const li = document.createElement("li");
      li.classList.add("list-group-item", colorClass);
      li.textContent = `${
        setId.charAt(0).toUpperCase() + setId.slice(1)
      }: ${percentage}% correct (${correct}/${s.answered} answered)`;
      setsStatsList.appendChild(li);
    }
  });

  if (setsStatsList.innerHTML === "") {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.textContent = "No sets completed yet.";
    setsStatsList.appendChild(li);
  }

  let overall = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;
  let grade = "N/A";
  if (totalAnswered > 0) {
    if (overall === 100) grade = "A";
    else if (overall >= 85) grade = "A-";
    else if (overall >= 80) grade = "B+";
    else if (overall >= 75) grade = "B";
    else if (overall >= 70) grade = "B-";
    else if (overall >= 65) grade = "C+";
    else if (overall >= 60) grade = "C";
    else grade = "C-";
  }
  document.getElementById("overall-grade").textContent = grade;

  // Update pie chart
  if (pieChart) pieChart.destroy();
  if (totalAnswered > 0) {
    pieChart = new Chart(document.getElementById("pie-chart"), {
      type: "pie",
      data: {
        labels: ["Correct", "Incorrect"],
        datasets: [
          {
            data: [totalCorrect, totalWrong],
            backgroundColor: ["#28a745", "#dc3545"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } },
      },
    });
  }

  renderReviewButton();
}

function showHome() {
  currentView = "home";
  document.getElementById("sets-list").style.display = "block";
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("profile-container").style.display = "none";
  document.getElementById("save-progress-fixed").style.display = "none";
}

/* ---------- FIXED showProfile ---------- */
function showProfile() {
  log("showProfile start");
  currentView = "profile";

  // hide everything else
  document.getElementById("sets-list").style.display = "none";
  document.getElementById("quiz-container").style.display = "none";

  // SHOW profile
  document.getElementById("profile-container").style.display = "block";

  // hide floating share button (only when not inside a quiz)
  document.getElementById("save-progress-fixed").style.display = "none";

  updateProfile(); // refresh stats + chart + review button
  log("showProfile end");
}
function showQuiz() {
  document.getElementById("sets-list").style.display = "none";
  document.getElementById("profile-container").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
}

window.onpopstate = () => {
  loadStatsFromURL();
  updateProfile();
  renderSets();

  // Only go to home if we are NOT already in a view
  if (currentView === "home") {
    showHome();
  } else if (currentView === "profile") {
    showProfile();
  } else if (currentView === "quiz") {
    // Try to restore quiz if possible
    if (currentSetId) {
      loadSet(currentSetId, currentIsReview);
    } else {
      showHome();
    }
  } else {
    showHome();
  }
};
loadQuizzes();

/* ---------- DEBUG KIT ---------- */
const DEBUG = true; // set to false to silence everything

function log(...args) {
  if (DEBUG) console.log("[QUIZ DEBUG]", ...args);
}

/* Wrap every view function so we see when they fire */
function wrapView(fnName, fn) {
  return function (...args) {
    log(`→ ${fnName}() called`, args);
    const result = fn.apply(this, args);
    log(`← ${fnName}() finished`);
    return result;
  };
}

/* Override style changes for the two buttons we care about */
const origSetDisplay = (el) => el.style.display;
function debugDisplay(el, newVal) {
  const name = el.id || el.className || el.tagName;
  log(`DISPLAY ${name} → "${newVal}"`);
  origSetDisplay(el, newVal);
}

/* Apply overrides */
const submitBtn = document.getElementById("submit-btn");
const saveBtn = document.getElementById("save-progress-fixed");

if (submitBtn)
  submitBtn.style.setProperty = function (p, v) {
    debugDisplay(this, v);
    Element.prototype.style.setProperty.call(this, p, v);
  };
if (saveBtn)
  saveBtn.style.setProperty = function (p, v) {
    debugDisplay(this, v);
    Element.prototype.style.setProperty.call(this, p, v);
  };

/* Wrap the view functions */
showHome = wrapView("showHome", showHome);
showProfile = wrapView("showProfile", showProfile);
showQuiz = wrapView("showQuiz", showQuiz);
showResults = wrapView("showResults", showResults);
loadSet = wrapView("loadSet", loadSet);
submitQuiz = wrapView("submitQuiz", submitQuiz);
/* -------------------------------- */
