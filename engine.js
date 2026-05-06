// 🧠 IPL Akinator — Bayesian Decision Engine

class AkinatorEngine {
  constructor(players, questions) {
    this.allPlayers = players;
    this.allQuestions = questions;
    this.reset();
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
    this.confidenceThreshold = 0.72;
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
      if (question.check(p)) {
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
    const hYes = this._subsetEntropy(active.filter(p => question.check(p)));
    const hNo  = this._subsetEntropy(active.filter(p => !question.check(p)));
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
      const yesCount = active.filter(p => q.check(p)).length;
      return yesCount > 0 && yesCount < active.length;
    });

    const pool = useful.length > 0 ? useful : unanswered;

    // Score all questions by information gain, highest first
    const scored = pool
      .map(q => ({ q, gain: this.informationGain(q) }))
      .sort((a, b) => b.gain - a.gain);

    const isEarlyGame = this.activePlayers.length > 10;

    if (isEarlyGame) {
      // Pick randomly from the top 3 to vary the opening questions each game
      const topN = scored.slice(0, Math.min(3, scored.length));
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
      const matches = question.check(player);

      switch (answer) {
        case "yes":
          // Hard eliminate non-matching players
          if (!matches) this.weights[player.id] = 0;
          break;

        case "no":
          // Hard eliminate matching players
          if (matches) this.weights[player.id] = 0;
          break;

        case "maybe":
          // Soft penalty: matching gets slight boost, non-matching slight penalty
          if (!matches) {
            this.weights[player.id] *= 0.6;
          } else {
            this.weights[player.id] *= 1.2;
          }
          break;

        case "idk":
          // No update — skip question
          break;
      }
    });
  }

  // ── Check if engine should guess now ──────────────────────────
  shouldGuess() {
    const top = this.getTopCandidate();
    if (!top) return false;

    if (top.prob >= this.confidenceThreshold) return true;
    if (this.questionCount >= this.maxQuestions) return true;
    if (this.activePlayers.length === 1) return true;

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
}
