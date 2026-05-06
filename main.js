// 🎮 IPL Akinator — UI Controller & Game Loop (Gemini Enhanced)

// ── DOM Refs ───────────────────────────────────────────────────
const screens = {
  splash:     document.getElementById('splash-screen'),
  game:       document.getElementById('game-screen'),
  guess:      document.getElementById('guess-screen'),
  result:     document.getElementById('result-screen'),
  correction: document.getElementById('correction-screen'),
};

const els = {
  startBtn:          document.getElementById('start-btn'),
  qNum:              document.getElementById('q-num'),
  qMax:              document.getElementById('q-max'),
  progressFill:      document.getElementById('progress-fill'),
  progressBar:       document.querySelector('[role="progressbar"]'),
  candidateCount:    document.getElementById('candidate-count'),
  aiAvatar:          document.getElementById('ai-avatar'),
  aiStatus:          document.getElementById('ai-status'),
  questionText:      document.getElementById('question-text'),
  questionCard:      document.getElementById('question-card'),
  answerBtns:        document.querySelectorAll('.answer-btn'),
  restartMidBtn:     document.getElementById('restart-mid-btn'),
  // Guess screen
  playerEmoji:       document.getElementById('player-emoji'),
  guessPlayerName:   document.getElementById('guess-player-name'),
  guessPlayerMeta:   document.getElementById('guess-player-meta'),
  guessPlayerTags:   document.getElementById('guess-player-tags'),
  confidencePct:     document.getElementById('confidence-pct'),
  confidenceFill:    document.getElementById('confidence-fill'),
  correctBtn:        document.getElementById('correct-btn'),
  incorrectBtn:      document.getElementById('incorrect-btn'),
  // Result screen
  resultIcon:        document.getElementById('result-icon'),
  resultTitle:       document.getElementById('result-title'),
  resultSubtitle:    document.getElementById('result-subtitle'),
  playAgainBtn:      document.getElementById('play-again-btn'),
  // Correction screen
  playerSearch:      document.getElementById('player-search'),
  playerDropdown:    document.getElementById('player-dropdown'),
  submitCorrection:  document.getElementById('submit-correction-btn'),
  skipCorrection:    document.getElementById('skip-correction-btn'),
  // Game branding
  gameBrand:         document.querySelector('.game-brand'),
  offlineNote:       document.getElementById('offline-note'),
};

// ── Game State ─────────────────────────────────────────────────
let engine           = null;
let currentQuestion  = null;
let selectedCorrection = null;
let geminiEnabled    = false;

// ── Auto-Load Key from config.js (silent) ─────────────────────
(function autoLoadConfig() {
  try {
    const key = (typeof CONFIG !== 'undefined') && CONFIG.GEMINI_API_KEY;
    if (key && key !== 'YOUR_GEMINI_API_KEY_HERE' && key.length > 10) {
      setGeminiKey(key);
      geminiEnabled = true;
      console.log('%c✅ Gemini AI active', 'color: #4ADE80; font-weight: bold;');
    } else {
      console.log('%c⚠️ No valid Gemini key in config.js — running in offline mode', 'color: #F59E0B;');
    }
  } catch (e) {
    // CONFIG not defined — silent fallback to offline mode
  }
})();

// ── Screen Management ──────────────────────────────────────────
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}



// ── Init Game ──────────────────────────────────────────────────
function initGame() {
  // Load any players added by Gemini in previous sessions
  const customPlayers = JSON.parse(localStorage.getItem('akinator_custom_players') || '[]');
  customPlayers.forEach(cp => {
    // Prevent duplicates
    if (!PLAYERS.find(p => p.id === cp.id)) {
      PLAYERS.push(cp);
    }
  });

  engine = new AkinatorEngine(PLAYERS, QUESTIONS);
  updateUI();
  showScreen('game');

  // Show AI badge in header if Gemini is active
  if (geminiEnabled && els.gameBrand) {
    els.gameBrand.innerHTML = '🏏 IPL AKINATOR <span class="ai-mode-badge">🤖 AI</span>';
  }

  setTimeout(() => loadNextQuestion(), 600);
}

// ── Update header UI ───────────────────────────────────────────
function updateUI() {
  const state = engine.getState();
  const asked = state.questionsAsked;
  const max   = state.maxQuestions;

  els.qNum.textContent           = asked + 1;
  els.qMax.textContent           = max;
  els.candidateCount.textContent = state.activeCandidates;

  const pct = Math.round((asked / max) * 100);
  els.progressFill.style.width = pct + '%';
  els.progressBar.setAttribute('aria-valuenow', asked);
}

// ── Load Next Question ─────────────────────────────────────────
async function loadNextQuestion() {
  const state = engine.getState();

  if (state.shouldGuess) {
    await showGuessScreen(state.topPlayer, state.confidence);
    return;
  }

  currentQuestion = engine.getNextQuestion();
  if (!currentQuestion) {
    await showGuessScreen(state.topPlayer, state.confidence);
    return;
  }

  // Show thinking animation
  setThinking(true);

  // If Gemini enabled, fetch AI thinking status AND rephrase question in parallel
  let aiStatus = null;
  let aiQuestion = null;

  if (geminiEnabled) {
    try {
      [aiStatus, aiQuestion] = await Promise.all([
        generateThinkingMessage(state.questionsAsked, state.activeCandidates),
        phraseQuestion(currentQuestion.text, state.questionsAsked + 1, state.activeCandidates)
      ]);
    } catch (_) { /* fallback silently */ }
  }

  // Update thinking status if AI gave one
  if (aiStatus) {
    els.aiStatus.textContent = aiStatus + '…';
  }

  // Small dramatic pause
  await sleep(geminiEnabled ? 1200 : 900);

  setThinking(false);
  displayQuestion(currentQuestion, aiQuestion);
  updateUI();
}

// ── Display a Question ─────────────────────────────────────────
function displayQuestion(question, aiPhrasedText = null) {
  const card = els.questionCard;
  card.classList.remove('question-card');
  void card.offsetWidth; // force reflow to re-trigger animation
  card.classList.add('question-card');

  // Use AI-phrased version if available, fallback to raw
  els.questionText.textContent = aiPhrasedText || question.text;

  els.answerBtns.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('selected');
  });
}

// ── Thinking State ─────────────────────────────────────────────
function setThinking(on) {
  if (on) {
    els.aiAvatar.classList.add('thinking');
    els.aiStatus.textContent = geminiEnabled
      ? 'Consulting Gemini AI…'
      : 'Analyzing possibilities…';
    els.questionText.innerHTML = `
      <span class="thinking-dots">
        <span></span><span></span><span></span>
      </span>`;
    els.answerBtns.forEach(b => b.disabled = true);
  } else {
    els.aiAvatar.classList.remove('thinking');
    els.aiStatus.textContent = 'Ready for your answer';
  }
}

// ── Handle Answer ──────────────────────────────────────────────
function handleAnswer(answer) {
  if (!currentQuestion) return;

  els.answerBtns.forEach(btn => {
    btn.classList.remove('selected');
    if (btn.dataset.answer === answer) btn.classList.add('selected');
    btn.disabled = true;
  });

  // Trigger avatar animation based on answer
  els.aiAvatar.classList.remove('anim-yes', 'anim-no', 'anim-maybe', 'anim-idk');
  void els.aiAvatar.offsetWidth; // force reflow to restart animation
  els.aiAvatar.classList.add(`anim-${answer}`);

  engine.processAnswer(currentQuestion.id, answer);
  setTimeout(() => loadNextQuestion(), 500);
}

// ── Guess Screen ───────────────────────────────────────────────
async function showGuessScreen(player, confidence) {
  if (!player) {
    initCorrectionScreen();
    return;
  }

  // Base card population
  els.playerEmoji.textContent      = player.emoji;
  els.guessPlayerName.textContent  = player.name;
  els.guessPlayerMeta.textContent  = `${player.role} · ${player.country}`;
  els.guessPlayerTags.innerHTML    = buildTags(player);
  els.confidencePct.textContent    = confidence + '%';
  els.confidenceFill.style.width   = '0%';

  // If Gemini enabled, fetch a dramatic reveal message
  if (geminiEnabled) {
    // Show screen first with a "thinking" placeholder
    const guessLabel = document.querySelector('.guess-label');
    if (guessLabel) guessLabel.textContent = '🤖 AI is revealing…';

    showScreen('guess');
    setTimeout(() => { els.confidenceFill.style.width = confidence + '%'; }, 400);

    const revealMsg = await generateRevealMessage(player.name, engine.questionCount, confidence);
    if (revealMsg && guessLabel) {
      guessLabel.textContent = `🎯 ${revealMsg}`;
    } else if (guessLabel) {
      guessLabel.textContent = '🎯 I think you\'re thinking of…';
    }
  } else {
    showScreen('guess');
    setTimeout(() => { els.confidenceFill.style.width = confidence + '%'; }, 400);
  }
}

function buildTags(player) {
  let html = '';
  html += `<span class="tag tag-role">${player.role}</span>`;
  html += `<span class="tag tag-country">${player.country}</span>`;
  if (player.teams.length)
    html += `<span class="tag tag-team">${player.teams[player.teams.length - 1]}</span>`;
  
  if (player.teams.includes("RCB")) {
    html += `<span class="tag tag-title" style="background: rgba(244, 208, 63, 0.15); color: #F4D03F; border: 1px solid rgba(244, 208, 63, 0.5);">🏆 2025 Champions</span>`;
  } else if (player.titles > 0) {
    html += `<span class="tag tag-title">🏆 ${player.titles} Title${player.titles > 1 ? 's' : ''}</span>`;
  }
  if (player.isCaptain)
    html += `<span class="tag tag-role">Captain</span>`;
  return html;
}

// ── Result Screen ──────────────────────────────────────────────
function showResult(correct) {
  if (correct) {
    els.resultIcon.textContent     = '🎉';
    els.resultTitle.textContent    = 'Got it! 🏏';
    els.resultSubtitle.textContent = `Guessed in ${engine.questionCount} question${engine.questionCount !== 1 ? 's' : ''}! The AI mind is unstoppable. 😎`;
  } else {
    els.resultIcon.textContent     = '😅';
    els.resultTitle.textContent    = 'Stumped me!';
    els.resultSubtitle.textContent = 'You outsmarted the AI this time! I\'ll learn from this. 📚';
  }
  showScreen('result');
}

// ── Correction Screen ──────────────────────────────────────────
function initCorrectionScreen() {
  selectedCorrection = null;
  els.playerSearch.value = '';
  els.playerDropdown.classList.remove('open');
  els.playerDropdown.innerHTML = '';
  els.submitCorrection.disabled = true;
  showScreen('correction');
}

function filterPlayers(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PLAYERS.filter(p => p.name.toLowerCase().includes(q));
}

els.playerSearch.addEventListener('input', () => {
  const query = els.playerSearch.value;
  const results = filterPlayers(query);
  
  if (!results.length) {
    if (geminiEnabled && query.trim().length > 3) {
      els.playerDropdown.innerHTML = `
        <div class="dropdown-item gemini-add-btn" data-query="${query.trim()}">
          <span>🤖</span>
          <span>Ask AI to add "<b>${query.trim()}</b>"</span>
        </div>
      `;
      els.playerDropdown.classList.add('open');
    } else {
      els.playerDropdown.classList.remove('open');
    }
    return;
  }
  
  els.playerDropdown.innerHTML = results.map(p => `
    <div class="dropdown-item" data-id="${p.id}">
      <span>${p.emoji}</span>
      <span>${p.name}</span>
    </div>
  `).join('');
  els.playerDropdown.classList.add('open');
});

els.playerDropdown.addEventListener('click', async e => {
  const item = e.target.closest('.dropdown-item');
  if (!item) return;
  
  // Handle Gemini add button
  if (item.classList.contains('gemini-add-btn')) {
    const query = item.dataset.query;
    item.innerHTML = '<span>⏳</span><span>AI is researching...</span>';
    item.style.pointerEvents = 'none';
    
    const newPlayer = await fetchPlayerFromGemini(query);
    if (newPlayer && newPlayer.id && newPlayer.name) {
      PLAYERS.push(newPlayer); // Add to current session
      
      // Save to localStorage for future sessions
      const customPlayers = JSON.parse(localStorage.getItem('akinator_custom_players') || '[]');
      customPlayers.push(newPlayer);
      localStorage.setItem('akinator_custom_players', JSON.stringify(customPlayers));
      
      // Select the new player
      selectedCorrection = newPlayer.id;
      els.playerSearch.value = newPlayer.name;
      els.playerDropdown.classList.remove('open');
      els.submitCorrection.disabled = false;
      
      // Let engine know about the new player
      if (engine) engine.allPlayers.push(newPlayer);
    } else {
      item.innerHTML = '<span>❌</span><span>Failed to find player</span>';
      setTimeout(() => els.playerDropdown.classList.remove('open'), 2000);
    }
    return;
  }

  // Handle normal selection
  selectedCorrection = item.dataset.id;
  const player = PLAYERS.find(p => p.id === selectedCorrection);
  if (player) {
    els.playerSearch.value = player.name;
    els.playerDropdown.classList.remove('open');
    els.submitCorrection.disabled = false;
  }
});

els.submitCorrection.addEventListener('click', () => {
  if (selectedCorrection && engine) engine.recordCorrection(selectedCorrection);
  showResult(false);
});

els.skipCorrection.addEventListener('click', () => showResult(false));

// ── Event Listeners ────────────────────────────────────────────
els.startBtn.addEventListener('click', initGame);

els.answerBtns.forEach(btn => {
  btn.addEventListener('click', () => handleAnswer(btn.dataset.answer));
});

els.restartMidBtn.addEventListener('click', () => showScreen('splash'));
els.correctBtn.addEventListener('click', () => showResult(true));
els.incorrectBtn.addEventListener('click', () => initCorrectionScreen());
els.playAgainBtn.addEventListener('click', () => showScreen('splash'));

// Close dropdown on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.player-search-wrap')) {
    els.playerDropdown.classList.remove('open');
  }
});

// ── Utility ───────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
