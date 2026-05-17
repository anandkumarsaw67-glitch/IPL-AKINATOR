const fs = require('fs');
const path = '.';
const engineCode = fs.readFileSync(path + '/engine.js', 'utf8');
const playersCode = fs.readFileSync(path + '/players.js', 'utf8');
const questionsCode = fs.readFileSync(path + '/questions.js', 'utf8');
const vm = require('vm');
const sandbox = { console, PLAYERS: [], QUESTIONS: [], window: {}, document: {} };
vm.runInNewContext(playersCode + '\n' + questionsCode + '\n' + engineCode, sandbox);
const AkinatorEngine = sandbox.AkinatorEngine;
const PLAYERS = sandbox.PLAYERS;
const QUESTIONS = sandbox.QUESTIONS;
function simulate(playerId) {
  const target = PLAYERS.find(p => p.id === playerId);
  const engine = new AkinatorEngine(PLAYERS, QUESTIONS, { corrections: [] });
  let steps = 0;
  while (true) {
    const state = engine.getState();
    if (state.shouldGuess) {
      return { target: target.name, guess: state.topPlayer ? state.topPlayer.name : null, confidence: state.confidence, questions: engine.questionCount };
    }
    const q = engine.getNextQuestion();
    if (!q) {
      const s = engine.getState();
      return { target: target.name, guess: s.topPlayer ? s.topPlayer.name : null, confidence: s.confidence, questions: engine.questionCount };
    }
    const answer = q.check(target) ? 'yes' : 'no';
    engine.processAnswer(q.id, answer);
    steps++;
    if (steps > 30) {
      const s = engine.getState();
      return { target: target.name, guess: s.topPlayer ? s.topPlayer.name : null, confidence: s.confidence, questions: engine.questionCount, error: 'loop' };
    }
  }
}
const results = [];
for (let i = 0; i < 20; i++) {
  results.push(simulate(PLAYERS[i].id));
}
console.log(JSON.stringify(results, null, 2));
