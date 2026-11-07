const QUESTIONS_URL = "./questions.json";

const screens = {
  start: document.querySelector("#start-screen"),
  quiz: document.querySelector("#quiz-screen"),
  result: document.querySelector("#result-screen"),
};

const elements = {
  categorySelect: document.querySelector("#category-select"),
  startButton: document.querySelector("#start-button"),
  loadingMessage: document.querySelector("#loading-message"),
  loadError: document.querySelector("#load-error"),
  backButton: document.querySelector("#back-button"),
  questionCounter: document.querySelector("#question-counter"),
  progressTrack: document.querySelector("#progress-track"),
  progressFill: document.querySelector("#progress-fill"),
  questionCategory: document.querySelector("#question-category"),
  questionTitle: document.querySelector("#question-title"),
  answerList: document.querySelector("#answer-list"),
  feedbackPanel: document.querySelector("#feedback-panel"),
  feedbackIcon: document.querySelector("#feedback-icon"),
  feedbackTitle: document.querySelector("#feedback-title"),
  feedbackText: document.querySelector("#feedback-text"),
  nextButton: document.querySelector("#next-button"),
  scoreSoFar: document.querySelector("#score-so-far"),
  resultTitle: document.querySelector("#result-title"),
  resultMessage: document.querySelector("#result-message"),
  finalScore: document.querySelector("#final-score"),
  scorePercentage: document.querySelector("#score-percentage"),
  passportReward: document.querySelector("#passport-reward"),
  replayButton: document.querySelector("#replay-button"),
  homeButton: document.querySelector("#home-button"),
};

let allQuestions = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;

function showScreen(screenName) {
  Object.entries(screens).forEach(([name, screen]) => {
    screen.hidden = name !== screenName;
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function validateQuestions(data) {
  if (!Array.isArray(data)) {
    throw new Error("O arquivo questions.json precisa conter uma lista de perguntas.");
  }

  if (data.length === 0) {
    throw new Error("O arquivo questions.json ainda está vazio. Adicione as perguntas para liberar o quiz.");
  }

  data.forEach((question, index) => {
    const questionNumber = index + 1;
    const isValid =
      question &&
      typeof question.category === "string" && question.category.trim() &&
      typeof question.question === "string" && question.question.trim() &&
      Array.isArray(question.options) && question.options.length >= 2 &&
      question.options.every((option) => typeof option === "string" && option.trim()) &&
      Number.isInteger(question.correctAnswer) &&
      question.correctAnswer >= 0 &&
      question.correctAnswer < question.options.length;

    if (!isValid) {
      throw new Error(
        `A pergunta ${questionNumber} está incompleta ou fora do formato esperado. Confira o modelo no README.md.`
      );
    }
  });

  return data;
}

async function loadQuestions() {
  elements.startButton.disabled = true;
  elements.categorySelect.disabled = true;
  elements.loadingMessage.textContent = "Preparando seu passaporte...";
  elements.loadError.hidden = true;

  try {
    const response = await fetch(QUESTIONS_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Não foi possível encontrar questions.json. Confira se o arquivo está na mesma pasta de index.html.");
    }

    const data = await response.json();
    allQuestions = validateQuestions(data);
    populateCategories();

    elements.categorySelect.disabled = false;
    elements.startButton.disabled = false;
    elements.loadingMessage.textContent = `${allQuestions.length} pergunta(s) prontinha(s) para a aventura!`;
  } catch (error) {
    elements.loadingMessage.textContent = "Seu passaporte ainda está sendo preparado.";
    elements.loadError.textContent = error.message;
    elements.loadError.hidden = false;
  }
}

function populateCategories() {
  const categories = [...new Set(allQuestions.map((question) => question.category.trim()))]
    .sort((first, second) => first.localeCompare(second, "pt-BR"));

  elements.categorySelect.replaceChildren();
  elements.categorySelect.add(new Option("Todas as áreas", "all"));

  categories.forEach((category) => {
    elements.categorySelect.add(new Option(category, category));
  });
}

function startQuiz() {
  const selectedCategory = elements.categorySelect.value;
  const filteredQuestions = selectedCategory === "all"
    ? allQuestions
    : allQuestions.filter((question) => question.category === selectedCategory);

  if (filteredQuestions.length === 0) {
    elements.loadError.textContent = "Não há perguntas cadastradas nessa categoria.";
    elements.loadError.hidden = false;
    return;
  }

  quizQuestions = shuffle(filteredQuestions);
  currentQuestionIndex = 0;
  score = 0;
  hasAnswered = false;
  elements.passportReward.hidden = true;

  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  const progress = (currentQuestionIndex / quizQuestions.length) * 100;

  hasAnswered = false;
  elements.questionCounter.textContent = `PERGUNTA ${currentQuestionIndex + 1} DE ${quizQuestions.length}`;
  elements.progressTrack.setAttribute("aria-valuenow", String(Math.round(progress)));
  elements.progressFill.style.width = `${progress}%`;
  elements.questionCategory.textContent = question.category;
  elements.questionTitle.textContent = question.question;
  elements.answerList.replaceChildren();
  elements.feedbackPanel.hidden = true;
  elements.feedbackPanel.classList.remove("is-correct", "is-wrong");
  elements.nextButton.disabled = true;
  elements.nextButton.innerHTML = currentQuestionIndex === quizQuestions.length - 1
    ? 'Ver resultado <span aria-hidden="true">→</span>'
    : 'Próxima pergunta <span aria-hidden="true">→</span>';
  elements.scoreSoFar.textContent = `✦ ${score} ${score === 1 ? "ponto" : "pontos"}`;

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    const letter = document.createElement("span");
    const label = document.createElement("span");

    button.type = "button";
    button.className = "answer-option";
    letter.className = "answer-letter";
    letter.setAttribute("aria-hidden", "true");
    letter.textContent = String.fromCharCode(65 + index);
    label.textContent = option;

    button.append(letter, label);
    button.addEventListener("click", () => selectAnswer(index));
    elements.answerList.append(button);
  });

  elements.questionTitle.focus({ preventScroll: true });
}

function selectAnswer(selectedIndex) {
  if (hasAnswered) return;
  hasAnswered = true;

  const question = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedIndex === question.correctAnswer;
  const answerButtons = [...elements.answerList.querySelectorAll("button")];

  if (isCorrect) score += 1;

  answerButtons.forEach((button, index) => {
    button.disabled = true;

    if (index === question.correctAnswer) {
      button.classList.add("is-correct");
      button.setAttribute("aria-label", `${button.textContent}. Resposta correta.`);
    } else if (index === selectedIndex) {
      button.classList.add("is-wrong");
      button.setAttribute("aria-label", `${button.textContent}. Resposta incorreta.`);
    } else {
      button.classList.add("is-muted");
    }
  });

  elements.feedbackPanel.hidden = false;
  elements.feedbackPanel.classList.toggle("is-correct", isCorrect);
  elements.feedbackPanel.classList.toggle("is-wrong", !isCorrect);
  elements.feedbackIcon.textContent = isCorrect ? "✓" : "✕";
  elements.feedbackTitle.textContent = isCorrect ? "Muito bem! Você acertou!" : "Boa tentativa!";

  const correctOption = question.options[question.correctAnswer];
  const explanation = question.explanation?.trim();
  elements.feedbackText.textContent = isCorrect
    ? (explanation || "Resposta correta! Vamos continuar aprendendo.")
    : `A resposta certa é: ${correctOption}.${explanation ? ` ${explanation}` : ""}`;

  elements.scoreSoFar.textContent = `✦ ${score} ${score === 1 ? "ponto" : "pontos"}`;
  elements.nextButton.disabled = false;
}

function goToNextQuestion() {
  if (!hasAnswered) return;

  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex += 1;
    renderQuestion();
    return;
  }

  showResults();
}

function showResults() {
  const total = quizQuestions.length;
  const percentage = Math.round((score / total) * 100);
  const perfectScore = score === total;

  elements.finalScore.textContent = `${score}/${total}`;
  elements.scorePercentage.textContent = `${percentage}% de acertos`;
  elements.passportReward.hidden = !perfectScore;

  if (perfectScore) {
    elements.resultTitle.textContent = "Expedição perfeita!";
    elements.resultMessage.textContent = "Você acertou todas as perguntas! O Passaporte do Explorador do Sul é sua recompensa.";
  } else if (percentage >= 70) {
    elements.resultTitle.textContent = "Que grande descoberta!";
    elements.resultMessage.textContent = "Você mandou muito bem. Continue explorando e aprendendo!";
  } else if (percentage >= 40) {
    elements.resultTitle.textContent = "Bom trabalho, explorador!";
    elements.resultMessage.textContent = "Você já descobriu bastante coisa. Que tal tentar mais uma vez?";
  } else {
    elements.resultTitle.textContent = "Toda jornada começa assim!";
    elements.resultMessage.textContent = "O importante é continuar curioso. Cada tentativa ensina algo novo!";
  }

  elements.progressTrack.setAttribute("aria-valuenow", "100");
  elements.progressFill.style.width = "100%";
  showScreen("result");
  elements.resultTitle.focus({ preventScroll: true });
}

function returnToStart() {
  showScreen("start");
  elements.startButton.focus({ preventScroll: true });
}

elements.startButton.addEventListener("click", startQuiz);
elements.nextButton.addEventListener("click", goToNextQuestion);
elements.backButton.addEventListener("click", returnToStart);
elements.replayButton.addEventListener("click", startQuiz);
elements.homeButton.addEventListener("click", returnToStart);

loadQuestions();
