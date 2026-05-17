// 🎮 IPL Akinator — UI Controller & Game Loop (Gemini Enhanced)

// ── DOM Refs ───────────────────────────────────────────────────
const screens = {
  splash:     document.getElementById('splash-screen'),
  game:       document.getElementById('game-screen'),
  guess:      document.getElementById('guess-screen'),
  result:     document.getElementById('result-screen'),
  correction: document.getElementById('correction-screen'),
  battle:     document.getElementById('battle-screen'),
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
  explanationBox:    document.getElementById('explanation-box'),
  guessReactionBubble: document.getElementById('guess-reaction-bubble'),
  guessPlayerPhoto:  document.getElementById('guess-player-photo'),
  playerPhotoGlow:   document.getElementById('player-photo-glow'),
  correctBtn:        document.getElementById('correct-btn'),
  incorrectBtn:      document.getElementById('incorrect-btn'),
  // Result screen
  resultIcon:        document.getElementById('result-icon'),
  resultTitle:       document.getElementById('result-title'),
  resultSubtitle:    document.getElementById('result-subtitle'),
  detailedPlayerCard: document.getElementById('detailed-player-card'),
  playAgainBtn:      document.getElementById('play-again-btn'),
  // Correction screen
  playerSearch:      document.getElementById('player-search'),
  playerDropdown:    document.getElementById('player-dropdown'),
  submitCorrection:  document.getElementById('submit-correction-btn'),
  skipCorrection:    document.getElementById('skip-correction-btn'),
  // Battle Mode
  battleModeBtn:     document.getElementById('battle-mode-btn'),
  battleClues:       document.getElementById('clues-container'),
  battleInput:       document.getElementById('battle-guess-input'),
  battleDropdown:    document.getElementById('battle-dropdown'),
  submitBattleGuess: document.getElementById('submit-battle-guess'),
  nextClueBtn:       document.getElementById('next-clue-btn'),
  backToHomeBtn:     document.getElementById('back-to-home-btn'),
  // Game branding
  gameBrand:         document.querySelector('.game-brand'),
  offlineNote:       document.getElementById('offline-note'),
};

// ── Game State ─────────────────────────────────────────────────
let engine           = null;
let battleEngine     = null;
let currentQuestion  = null;
let selectedCorrection = null;
let geminiEnabled    = false;
let globalLearnedData = { corrections: [], custom_players: [] };

// ── AI Personalities (Trash Talk) ──────────────────────────────
const AI_REACTIONS = {
  early: [
    "Thinking... let's see what you've got!",
    "Searching my database...",
    "Interesting choice so far...",
    "Starting to build a picture..."
  ],
  confident: [
    "Too easy 😏",
    "I think I already know who it is!",
    "You're making this too simple for me.",
    "Almost there... I can see the player now."
  ],
  difficult: [
    "Hmm... you're trying to trick me 🤔",
    "A tough one! Let me think harder...",
    "Nice choice, tough player to narrow down.",
    "You're good at this! But I'm better..."
  ],
  default: [
    "Analyzing possibilities...",
    "Crunching the numbers...",
    "Consulting the cricket gods...",
    "Evaluating the evidence..."
  ]
};

function getAIReaction() {
  if (!engine) return AI_REACTIONS.default[0];
  const state = engine.getState();
  
  // High confidence (> 50%)
  if (state.confidence > 50) {
    return AI_REACTIONS.confident[Math.floor(Math.random() * AI_REACTIONS.confident.length)];
  }
  
  // Late game and low confidence
  if (state.questionsAsked > 7 && state.confidence < 30) {
    return AI_REACTIONS.difficult[Math.floor(Math.random() * AI_REACTIONS.difficult.length)];
  }
  
  // Early game
  if (state.questionsAsked < 3) {
    return AI_REACTIONS.early[Math.floor(Math.random() * AI_REACTIONS.early.length)];
  }
  
  return AI_REACTIONS.default[Math.floor(Math.random() * AI_REACTIONS.default.length)];
}

function getPlayerImage(player) {
  // Using a search-based thumbnail service for IPL players
  return `https://tse1.mm.bing.net/th?q=${encodeURIComponent(player.name + ' IPL profile')}&w=300&h=300&c=7&rs=1&p=0&dpr=1&pid=1.7`;
}

const GUESS_REACTIONS = {
  high: [
    "Too easy 😏",
    "I've got you! 🏏",
    "Piece of cake!",
    "Victory is mine!"
  ],
  medium: [
    "I'm pretty sure it's...",
    "The data points to...",
    "This must be your player!"
  ],
  low: [
    "Hmm... you're trying to trick me 🤔",
    "A tough one, but I'll go with...",
    "Is it this player? Maybe..."
  ]
};

const SPLASH_PHRASES = [
  "Think you can beat me? 😏",
  "I've got 40+ players in my head... 🧠",
  "Ready to lose? I'm unbeatable! 🏆",
  "Pick a tough one! I dare you. 🦁",
  "The AI mind is ready for your challenge. ⚡",
  "Is it Virat? Dhoni? Rohit? I'll find out! 🏏",
  "Your thoughts are my playground... 🔮"
];

function initSplashReactions() {
  const bubble = document.getElementById('splash-bubble');
  if (!bubble) return;
  
  let index = 0;
  setInterval(() => {
    bubble.style.opacity = '0';
    setTimeout(() => {
      index = (index + 1) % SPLASH_PHRASES.length;
      bubble.textContent = SPLASH_PHRASES[index];
      bubble.style.opacity = '1';
    }, 500);
  }, 6000);
}

// ── Auto-Load Key from config.js (silent) ─────────────────────
(function autoLoadConfig() {
  initSplashReactions();
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
  loadLearnedData();
})();

async function loadLearnedData() {
  try {
    const res = await fetch('learned_data.json');
    if (res.ok) {
      const data = await res.json();
      globalLearnedData.corrections = data.corrections || [];
      globalLearnedData.custom_players = data.custom_players || [];
    }
  } catch (e) {
    console.log("No learned_data.json found or failed to load. Starting fresh.");
  }

  // Merge with local storage
  const localCorrections = JSON.parse(localStorage.getItem('akinator_corrections') || '[]');
  // Avoid duplicates by timestamp
  const existingTimestamps = new Set(globalLearnedData.corrections.map(c => c.timestamp));
  localCorrections.forEach(lc => {
    if (!existingTimestamps.has(lc.timestamp)) {
      globalLearnedData.corrections.push(lc);
    }
  });
}

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

  engine = new AkinatorEngine(PLAYERS, QUESTIONS, globalLearnedData);
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

  const probEl = document.getElementById('current-prob');
  if (probEl) {
    probEl.textContent = state.confidence;
  }

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
    
    // Choose a reaction
    const reaction = getAIReaction();
    els.aiStatus.textContent = reaction;
    
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
  els.guessPlayerName.textContent  = player.name;
  els.guessPlayerMeta.textContent  = `${player.role} · ${player.country}`;
  els.guessPlayerTags.innerHTML    = buildTags(player);
  els.confidencePct.textContent    = confidence + '%';
  els.confidenceFill.style.width   = '0%';

  // Set Photo
  els.guessPlayerPhoto.src = getPlayerImage(player);
  els.guessPlayerPhoto.style.display = 'block';
  els.playerEmoji.style.display = 'none';
  
  // Set Dynamic Glow Color
  if (player.teamColor) {
    els.playerPhotoGlow.style.background = player.teamColor;
  } else {
    els.playerPhotoGlow.style.background = 'var(--gold)';
  }

  // Set Guess Reaction
  let reactionPool;
  if (confidence > 80) reactionPool = GUESS_REACTIONS.high;
  else if (confidence > 40) reactionPool = GUESS_REACTIONS.medium;
  else reactionPool = GUESS_REACTIONS.low;
  
  els.guessReactionBubble.textContent = reactionPool[Math.floor(Math.random() * reactionPool.length)];

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

  // Populate AI Reasoning
  const evidence = engine.getEvidence(player);
  if (evidence.length > 0) {
    els.explanationBox.innerHTML = evidence.slice(0, 4).map(e => `
      <div class="explanation-item">
        <span class="${e.userAnswer === 'yes' ? 'check' : 'cross'}">
          ${e.userAnswer === 'yes' ? '✔' : '✖'}
        </span>
        <span>You said ${e.userAnswer.toUpperCase()}: ${e.text}</span>
      </div>
    `).join('');
    document.getElementById('explanation-container').style.display = 'block';
  } else {
    document.getElementById('explanation-container').style.display = 'none';
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
  
  // Add real stats tags from dataset
  const rs = (typeof PLAYER_REAL_STATS !== 'undefined') ? PLAYER_REAL_STATS[player.id] : null;
  if (rs) {
    if (rs.totalRuns > 1000)
      html += `<span class="tag" style="background:rgba(76,175,80,0.15);color:#4CAF50;border:1px solid rgba(76,175,80,0.4);">🏏 ${rs.totalRuns.toLocaleString()} runs</span>`;
    if (rs.totalWickets > 50)
      html += `<span class="tag" style="background:rgba(244,67,54,0.15);color:#F44336;border:1px solid rgba(244,67,54,0.4);">🎳 ${rs.totalWickets} wickets</span>`;
  }
  return html;
}

// ── Result Screen ──────────────────────────────────────────────
function showResult(correct) {
  if (correct) {
    els.resultIcon.textContent     = '🎉';
    els.resultTitle.textContent    = 'Got it! 🏏';
    els.resultSubtitle.textContent = `Guessed in ${engine.questionCount} question${engine.questionCount !== 1 ? 's' : ''}! The AI mind is unstoppable. 😎`;
    
    // Show detailed card for correct guess
    const state = engine.getState();
    if (state.topPlayer) {
      els.detailedPlayerCard.innerHTML = buildDetailedPlayerCard(state.topPlayer);
      els.detailedPlayerCard.style.display = 'block';
    }
  } else {
    els.resultIcon.textContent     = '😅';
    els.resultTitle.textContent    = 'Stumped me!';
    els.resultSubtitle.textContent = 'You outsmarted the AI this time! I\'ll learn from this. 📚';
    els.detailedPlayerCard.style.display = 'none';
  }
  showScreen('result');
}

function buildDetailedPlayerCard(player) {
  const teamsStr = player.teams.join(', ');
  const fact = generateFunFact(player);
  const photoUrl = getPlayerImage(player);
  const accentColor = player.teamColor || '#F4D03F';
  
  // Get real stats from dataset
  const rs = (typeof PLAYER_REAL_STATS !== 'undefined') ? PLAYER_REAL_STATS[player.id] : null;
  
  let statsHTML = '';
  if (rs) {
    statsHTML = `
      <div class="stat-grid" style="grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px;">
        <div class="stat-item"><span class="stat-label">Runs</span><span class="stat-value" style="color:${accentColor}">${rs.totalRuns.toLocaleString()}</span></div>
        <div class="stat-item"><span class="stat-label">Avg</span><span class="stat-value">${rs.battingAvg}</span></div>
        <div class="stat-item"><span class="stat-label">SR</span><span class="stat-value">${rs.battingSR}</span></div>
        <div class="stat-item"><span class="stat-label">Wickets</span><span class="stat-value" style="color:${accentColor}">${rs.totalWickets}</span></div>
        <div class="stat-item"><span class="stat-label">6s</span><span class="stat-value">${rs.sixes}</span></div>
        <div class="stat-item"><span class="stat-label">HS</span><span class="stat-value">${rs.highScore}${rs.hundreds > 0 ? '*' : ''}</span></div>
        <div class="stat-item"><span class="stat-label">50s / 100s</span><span class="stat-value">${rs.fifties} / ${rs.hundreds}</span></div>
        <div class="stat-item"><span class="stat-label">PoM</span><span class="stat-value">${rs.playerOfMatch}</span></div>
        <div class="stat-item"><span class="stat-label">Seasons</span><span class="stat-value">${rs.seasonsPlayed}</span></div>
      </div>`;
  }
  
  return `
    <div class="glass-card detailed-card" style="border-top: 5px solid ${accentColor}">
      <div class="player-photo-wrap" style="width: 100px; height: 100px; margin-bottom: 15px;">
        <div class="player-photo-glow" style="background: ${accentColor}; opacity: 0.4;"></div>
        <img src="${photoUrl}" class="player-photo" style="border: 2px solid ${accentColor}">
      </div>
      
      <h3 style="color: ${accentColor}">${player.name}</h3>
      <span class="player-subtitle">${player.role} from ${player.country}</span>
      
      <div class="stat-grid">
        <div class="stat-item">
          <span class="stat-label">Teams Played</span>
          <span class="stat-value">${teamsStr}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">IPL Titles</span>
          <span class="stat-value">${player.titles > 0 ? player.titles + 'x Winner' : 'None yet'}</span>
        </div>
      </div>

      ${rs ? '<h4 style="color:var(--text-muted); margin: 16px 0 4px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">📊 Real IPL Stats (2008-2025)</h4>' : ''}
      ${statsHTML}
      
      <div class="fun-fact-box" style="border-left-color: ${accentColor}">
        <span class="fun-fact-label" style="color: ${accentColor}">Did you know? 💡</span>
        <p class="fun-fact-text">${fact}</p>
      </div>
    </div>
  `;
}

function generateFunFact(p) {
  if (p.id === 'ms_dhoni') return "He is the only captain to win all three major ICC trophies and has finished more IPL games than anyone else!";
  if (p.id === 'virat_kohli') return "He holds the record for most runs in a single IPL season (973 runs in 2016)!";
  if (p.id === 'rohit_sharma') return "He has won 6 IPL titles in total (5 as MI captain and 1 as a player for Deccan Chargers).";
  
  if (p.isYoung) return "This player is one of the brightest rising stars in modern IPL cricket!";
  if (p.titles >= 3) return "This player is considered 'IPL Royalty' with multiple championship rings!";
  if (p.country === 'Overseas') return "A true globe-trotter, bringing international flair to the IPL stadium!";
  if (p.isCaptain) return "A proven leader who has shouldered the responsibility of an entire franchise.";
  
  return `${p.name} is a key asset for ${p.teams[p.teams.length-1]}, known for their consistent impact in the league.`;
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
  els.playAgainBtn.addEventListener('click', () => {
    initGame();
  });
  
  // Battle Mode Listeners
  els.battleModeBtn.addEventListener('click', initBattleMode);
  
  const exportBtn = document.getElementById('export-brain-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(globalLearnedData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", "learned_data.json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      alert("Brain data exported! Replace your learned_data.json file with this new one.");
    });
  }
  els.nextClueBtn.addEventListener('click', revealNextClue);
  els.backToHomeBtn.addEventListener('click', () => showScreen('splash'));
  els.submitBattleGuess.addEventListener('click', submitBattleGuess);
  
  els.battleInput.addEventListener('input', (e) => {
    updateBattleDropdown(e.target.value);
  });

// Close dropdown on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.player-search-wrap')) {
    els.playerDropdown.classList.remove('open');
  }
});

// ── Translations ───────────────────────────────────────────────
const UI_TRANSLATIONS = {
  en: {
    splashTitle: "Ready to be amazed?",
    splashSub: "Think of any <span>IPL cricket player</span>.<br/>I'll read your mind using the power of AI. 🧠",
    startBtn: "<span>🚀</span> Think of a Player",
    battleBtn: "<span>⚔️</span> Battle Mode",
    yes: "<span class=\"btn-icon\">✅</span> Yes",
    no: "<span class=\"btn-icon\">❌</span> No",
    maybe: "<span class=\"btn-icon\">🤔</span> Maybe",
    idk: "<span class=\"btn-icon\">🤷</span> Don't Know",
    restartBtn: "↩ Start Over",
    guessLabel: "🎯 I think you're thinking of…",
    correctBtn: "🎉 Yes, correct!",
    incorrectBtn: "❌ Nope, wrong!",
    playAgainBtn: "🔄 Play Again",
    battleInput: "Type player name...",
    submitBattle: "🎯 Submit Guess",
    nextClue: "💡 Give me a Clue",
    quit: "🏠 Quit"
  },
  hi: {
    splashTitle: "क्या आप हैरान होने के लिए तैयार हैं?",
    splashSub: "किसी भी <span>IPL खिलाड़ी</span> के बारे में सोचें।<br/>मैं AI की मदद से आपका दिमाग पढ़ लूंगा। 🧠",
    startBtn: "<span>🚀</span> खिलाड़ी सोचें",
    battleBtn: "<span>⚔️</span> बैटल मोड",
    yes: "<span class=\"btn-icon\">✅</span> हाँ",
    no: "<span class=\"btn-icon\">❌</span> नहीं",
    maybe: "<span class=\"btn-icon\">🤔</span> शायद",
    idk: "<span class=\"btn-icon\">🤷</span> पता नहीं",
    restartBtn: "↩ फिर से शुरू करें",
    guessLabel: "🎯 मुझे लगता है कि आप सोच रहे हैं…",
    correctBtn: "🎉 हाँ, सही है!",
    incorrectBtn: "❌ नहीं, गलत है!",
    playAgainBtn: "🔄 फिर से खेलें",
    battleInput: "खिलाड़ी का नाम लिखें...",
    submitBattle: "🎯 उत्तर दें",
    nextClue: "💡 सुराग दें",
    quit: "🏠 बाहर निकलें"
  },
  ta: {
    splashTitle: "ஆச்சரியப்பட தயாராக உள்ளீர்களா?",
    splashSub: "ஏதேனும் <span>IPL கிரிக்கெட் வீரரை</span> நினைத்துக் கொள்ளுங்கள்.<br/>AI மூலம் உங்கள் மனதை படிப்பேன். 🧠",
    startBtn: "<span>🚀</span> வீரரை நினைக்கவும்",
    battleBtn: "<span>⚔️</span> போர் முறை",
    yes: "<span class=\"btn-icon\">✅</span> ஆம்",
    no: "<span class=\"btn-icon\">❌</span> இல்லை",
    maybe: "<span class=\"btn-icon\">🤔</span> இருக்கலாம்",
    idk: "<span class=\"btn-icon\">🤷</span> தெரியாது",
    restartBtn: "↩ மீண்டும் தொடங்கு",
    guessLabel: "🎯 நீங்கள் இதைத்தான் நினைத்தீர்கள்…",
    correctBtn: "🎉 ஆம், சரி!",
    incorrectBtn: "❌ இல்லை, தவறு!",
    playAgainBtn: "🔄 மீண்டும் விளையாடு",
    battleInput: "வீரரின் பெயரை தட்டச்சு செய்க...",
    submitBattle: "🎯 சமர்ப்பி",
    nextClue: "💡 ஒரு குறிப்பு கொடுங்கள்",
    quit: "🏠 வெளியேறு"
  }
};

function updateLanguage(lang) {
  if (typeof setGeminiLang === 'function') setGeminiLang(lang);
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];
  
  const safeHtml = (selector, html) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  };

  safeHtml('.splash-title', t.splashTitle);
  safeHtml('.splash-subtitle', t.splashSub);
  safeHtml('#start-btn', t.startBtn);
  safeHtml('#battle-mode-btn', t.battleBtn);
  
  safeHtml('#btn-yes', t.yes);
  safeHtml('#btn-no', t.no);
  safeHtml('#btn-maybe', t.maybe);
  safeHtml('#btn-idk', t.idk);
  
  safeHtml('#restart-mid-btn', t.restartBtn);
  safeHtml('.guess-label', t.guessLabel);
  safeHtml('#correct-btn', t.correctBtn);
  safeHtml('#incorrect-btn', t.incorrectBtn);
  safeHtml('#play-again-btn', t.playAgainBtn);

  // Battle mode specific
  const battleInput = document.getElementById('battle-guess-input');
  if (battleInput) battleInput.placeholder = t.battleInput;
  safeHtml('#submit-battle-guess', t.submitBattle);
  safeHtml('#next-clue-btn', t.nextClue);
  safeHtml('#back-to-home-btn', t.quit);
}

const langSelect = document.getElementById('lang-select');
if (langSelect) {
  langSelect.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
  });
}

// ── Battle Mode ────────────────────────────────────────────────
function initBattleMode() {
  battleEngine = new BattleEngine(PLAYERS);
  els.battleInput.value = '';
  els.battleDropdown.style.display = 'none';
  renderClues();
  showScreen('battle');
}

function renderClues() {
  const revealed = battleEngine.getRevealedClues();
  els.battleClues.innerHTML = revealed.map(clue => `
    <div class="clue-item">${clue}</div>
  `).join('');
  
  // Auto scroll to bottom
  els.battleClues.scrollTop = els.battleClues.scrollHeight;
  
  // Disable next clue button if no more clues
  els.nextClueBtn.disabled = battleEngine.revealedClueCount >= battleEngine.clues.length;
}

function revealNextClue() {
  if (battleEngine.revealNextClue()) {
    renderClues();
  }
}

function submitBattleGuess() {
  const guess = els.battleInput.value;
  if (!guess) return;
  
  const correct = battleEngine.checkGuess(guess);
  if (correct) {
    showResult(true);
    // Overwrite some text for battle win
    els.resultTitle.textContent = "Victory! ⚔️";
    els.resultSubtitle.textContent = `You correctly guessed ${battleEngine.targetPlayer.name}! The AI was no match for you.`;
  } else {
    // Small shake animation or red glow? For now just alert or status
    els.battleInput.style.borderColor = '#ff5252';
    setTimeout(() => els.battleInput.style.borderColor = '', 1000);
    
    // Maybe show a "Wrong" status temporarily
    const originalText = els.submitBattleGuess.textContent;
    els.submitBattleGuess.textContent = "❌ Wrong Guess! Try again";
    els.submitBattleGuess.style.background = "#ff5252";
    
    setTimeout(() => {
      els.submitBattleGuess.textContent = originalText;
      els.submitBattleGuess.style.background = "";
    }, 2000);
  }
}

function updateBattleDropdown(query) {
  if (!query || query.length < 2) {
    els.battleDropdown.style.display = 'none';
    return;
  }
  
  const matches = PLAYERS.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  if (matches.length > 0) {
    els.battleDropdown.innerHTML = matches.map(p => `
      <div class="dropdown-item" data-id="${p.id}">${p.name}</div>
    `).join('');
    els.battleDropdown.style.display = 'block';
    
    // Click to select
    els.battleDropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        els.battleInput.value = item.textContent;
        els.battleDropdown.style.display = 'none';
      });
    });
  } else {
    els.battleDropdown.style.display = 'none';
  }
}

// ── Utility ───────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
