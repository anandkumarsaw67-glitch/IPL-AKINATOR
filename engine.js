// 🧠 IPL Akinator — Bayesian Decision Engine

class AkinatorEngine {
  constructor(players, questions, learnedData = { corrections: [] }) {
    this.allPlayers = players;
    // Merge stat-based questions from real dataset if available
    this.allQuestions = typeof STAT_QUESTIONS !== 'undefined'
      ? [...questions, ...STAT_QUESTIONS]
      : questions;
    this.learnedData = learnedData;
    this._compileOverrides();
    this.reset();
  }

  // Compile corrections into an override map: { playerId: { questionId: { yes: count, no: count } } }
  _compileOverrides() {
    this.overrides = {};
    const corrections = this.learnedData.corrections || [];
    
    corrections.forEach(c => {
      const pId = c.correctPlayer;
      if (!this.overrides[pId]) this.overrides[pId] = {};
      
      c.history.forEach(h => {
        if (h.answer === 'yes' || h.answer === 'no') {
          if (!this.overrides[pId][h.qid]) this.overrides[pId][h.qid] = { yes: 0, no: 0 };
          this.overrides[pId][h.qid][h.answer]++;
        }
      });
    });
  }

  // Check if a player matches a question, consulting learned overrides first
  checkMatch(question, player) {
    // If we have learned data for this player and question
    if (this.overrides[player.id] && this.overrides[player.id][question.id]) {
      const stats = this.overrides[player.id][question.id];
      // If there's a strong consensus (e.g., more 'yes' corrections than 'no')
      if (stats.yes > stats.no) return true;
      if (stats.no > stats.yes) return false;
    }
    // Fallback to default hardcoded rule
    return question.check(player);
  }

  reset() {
    // Each player starts with equal weight (probability)
    this.weights = {};
    this.allPlayers.forEach(p => {
      this.weights[p.id] = 1.0;
    });
    this.askedQuestions = new Set();
    this.questionCount = 0;
    this.maxQuestions = 10;
    this.confidenceThreshold = 0.9;
    this.confidenceMargin = 0.25;
    this.minQuestionsBeforeGuess = 3;
    this.history = []; // { question, answer } log
  }

  // ── Active candidates with positive weight ─────────────────────
  get activePlayers() {
    return this.allPlayers.filter(p => this.weights[p.id] > 0.001);
  }

  // ── Total weight sum ───────────────────────────────────────────
  get totalWeight() {
    return this.activePlayers.reduce((s, p) => s + this.weights[p.id], 0);
  }

  // ── Probability of a single player ────────────────────────────
  probability(player) {
    const total = this.totalWeight;
    if (total === 0) return 0;
    return this.weights[player.id] / total;
  }

  // ── Sorted candidates by probability ──────────────────────────
  getRankedPlayers() {
    return [...this.activePlayers]
      .map(p => ({ player: p, prob: this.probability(p) }))
      .sort((a, b) => b.prob - a.prob);
  }

  // ── Top candidate + confidence ─────────────────────────────────
  getTopCandidate() {
    const ranked = this.getRankedPlayers();
    if (ranked.length === 0) return null;
    return ranked[0];
  }

  // ── Entropy of current distribution ───────────────────────────
  // H = -sum(p * log2(p))  — lower = more certain
  getEntropy() {
    return this.activePlayers.reduce((h, p) => {
      const prob = this.probability(p);
      if (prob <= 0) return h;
      return h - prob * Math.log2(prob);
    }, 0);
  }

  // ── Information Gain for a question ───────────────────────────
  informationGain(question) {
    const active = this.activePlayers;
    if (active.length === 0) return 0;

    let yesWeight = 0, noWeight = 0;
    active.forEach(p => {
      if (this.checkMatch(question, p)) {
        yesWeight += this.weights[p.id];
      } else {
        noWeight += this.weights[p.id];
      }
    });

    const total = yesWeight + noWeight;
    if (total === 0) return 0;

    const pYes = yesWeight / total;
    const pNo  = noWeight  / total;

    const hBefore = this.getEntropy();
    const hYes = this._subsetEntropy(active.filter(p => this.checkMatch(question, p)));
    const hNo  = this._subsetEntropy(active.filter(p => !this.checkMatch(question, p)));
    const hAfter = pYes * hYes + pNo * hNo;

    return hBefore - hAfter;
  }

  _subsetEntropy(subset) {
    const total = subset.reduce((s, p) => s + this.weights[p.id], 0);
    if (total === 0) return 0;
    return subset.reduce((h, p) => {
      const prob = this.weights[p.id] / total;
      if (prob <= 0) return h;
      return h - prob * Math.log2(prob);
    }, 0);
  }

  _normalizeWeights() {
    const total = Object.values(this.weights).reduce((sum, w) => sum + w, 0);
    if (total <= 0) return;
    Object.keys(this.weights).forEach(id => {
      this.weights[id] = this.weights[id] / total;
    });
  }

  // ── Select the best next question ─────────────────────────────
  // Early game (>10 players): random pick from TOP 3 — adds variety
  // Late game (≤10 players) : always pick single best — precision matters
  getNextQuestion() {
    const unanswered = this.allQuestions.filter(
      q => !this.askedQuestions.has(q.id)
    );
    if (unanswered.length === 0) return null;

    // Filter out useless questions (0% or 100% split on remaining players)
    const useful = unanswered.filter(q => {
      const active = this.activePlayers;
      const yesCount = active.filter(p => this.checkMatch(q, p)).length;
      return yesCount > 0 && yesCount < active.length;
    });

    const pool = useful.length > 0 ? useful : unanswered;

    // Score all questions by information gain, highest first
    const scored = pool
      .map(q => ({ q, gain: this.informationGain(q) }))
      .sort((a, b) => b.gain - a.gain);

    const isEarlyGame = this.activePlayers.length > 20;

    if (isEarlyGame) {
      // Pick randomly from the top 2 to vary the opening questions slightly
      const topN = scored.slice(0, Math.min(2, scored.length));
      return topN[Math.floor(Math.random() * topN.length)].q;
    } else {
      // Pick strictly the best question to close in on the answer
      return scored[0].q;
    }
  }

  // ── Process user answer & update weights ───────────────────────
  // answer: "yes" | "no" | "maybe" | "idk"
  processAnswer(questionId, answer) {
    const question = this.allQuestions.find(q => q.id === questionId);
    if (!question) return;

    this.askedQuestions.add(questionId);
    this.questionCount++;
    this.history.push({ question, answer });

    this.activePlayers.forEach(player => {
      const matches = this.checkMatch(question, player);

      switch (answer) {
        case "yes":
          if (!matches) this.weights[player.id] *= 0.01;
          else this.weights[player.id] *= 3.0;
          break;

        case "no":
          if (matches) this.weights[player.id] *= 0.01;
          else this.weights[player.id] *= 3.0;
          break;

        case "maybe":
          if (!matches) {
            this.weights[player.id] *= 0.85;
          } else {
            this.weights[player.id] *= 1.15;
          }
          break;

        case "idk":
          break;
      }
    });

    this._normalizeWeights();
  }

  // ── Check if engine should guess now ──────────────────────────
  shouldGuess() {
    const ranked = this.getRankedPlayers();
    if (ranked.length === 0) return false;

    const top = ranked[0];
    const second = ranked[1] || { prob: 0 };
    const margin = top.prob - second.prob;
    const strongConfidence = top.prob >= this.confidenceThreshold && margin >= this.confidenceMargin;
    const safeConfidence = this.questionCount >= this.minQuestionsBeforeGuess && top.prob >= 0.8 && margin >= 0.2;

    if (this.activePlayers.length === 1) return true;
    if (strongConfidence) return true;
    if (safeConfidence) return true;

    // Force guess only when we run out of questions
    if (this.questionCount >= this.maxQuestions) {
      return true;
    }

    return false;
  }

  // ── Game state ─────────────────────────────────────────────────
  getState() {
    const top = this.getTopCandidate();
    const active = this.activePlayers;
    return {
      questionsAsked: this.questionCount,
      maxQuestions: this.maxQuestions,
      activeCandidates: active.length,
      topPlayer: top ? top.player : null,
      confidence: top ? Math.round(top.prob * 100) : 0,
      shouldGuess: this.shouldGuess(),
      ranked: this.getRankedPlayers().slice(0, 5)
    };
  }

  // ── Record a correction (learning) ────────────────────────────
  recordCorrection(correctPlayerId) {
    const corrections = JSON.parse(
      localStorage.getItem("akinator_corrections") || "[]"
    );
    corrections.push({
      timestamp: Date.now(),
      history: this.history.map(h => ({ qid: h.question.id, answer: h.answer })),
      correctPlayer: correctPlayerId
    });
    localStorage.setItem("akinator_corrections", JSON.stringify(corrections));
  }

  // ── Get matching evidence for a player ───────────────────────
  getEvidence(player) {
    if (!player) return [];
    
    return this.history
      .filter(h => h.answer === "yes" || h.answer === "no")
      .map(h => {
        const matches = this.checkMatch(h.question, player);
        const userSaidYes = h.answer === "yes";
        
        // Evidence is valid if user's answer matches the player attribute
        if (userSaidYes === matches) {
          return {
            text: h.question.text,
            match: true,
            userAnswer: h.answer
          };
        }
        return null;
      })
      .filter(e => e !== null);
  }
}
