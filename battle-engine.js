/**
 * 🎮 BattleEngine — Handles the "Reverse Akinator" logic
 * The AI thinks of a player, and provides clues to the user.
 */
class BattleEngine {
  constructor(players) {
    this.allPlayers = players;
    this.reset();
  }

  reset() {
    this.targetPlayer = this.allPlayers[Math.floor(Math.random() * this.allPlayers.length)];
    this.clues = this._generateClues(this.targetPlayer);
    this.revealedClueCount = 1;
    this.isGameOver = false;
  }

  _generateClues(p) {
    const clues = [];
    
    // Role Clue
    clues.push(`I am primarily a ${p.role}.`);
    
    // Country Clue
    clues.push(p.country === 'India' ? "I am an Indian player." : "I am an overseas player.");
    
    // Team Clue (most recent)
    const currentTeam = p.teams[p.teams.length - 1];
    clues.push(`I currently play (or last played) for ${currentTeam}.`);
    
    // Handedness
    clues.push(p.isLeftHanded ? "I am a left-handed player." : "I am a right-handed player.");
    
    // Captaincy
    if (p.isCaptain) clues.push("I have the experience of captaining an IPL team.");
    
    // Titles
    if (p.titles > 0) clues.push(`I have won ${p.titles} IPL title${p.titles > 1 ? 's' : ''}.`);
    else clues.push("I am still searching for my first IPL trophy.");
    
    // Batting Position
    if (p.battingPosition !== 'None') clues.push(`I usually bat in the ${p.battingPosition} order.`);
    
    // Wicketkeeper
    if (p.isWicketkeeper) clues.push("I am also a wicketkeeper.");

    // Shuffle clues (except the first two which are usually good starters)
    const starters = clues.splice(0, 2);
    for (let i = clues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clues[i], clues[clues[j]]] = [clues[j], clues[clues[i]]];
    }
    
    return [...starters, ...clues];
  }

  getRevealedClues() {
    return this.clues.slice(0, this.revealedClueCount);
  }

  revealNextClue() {
    if (this.revealedClueCount < this.clues.length) {
      this.revealedClueCount++;
      return true;
    }
    return false;
  }

  checkGuess(playerName) {
    if (this.isGameOver) return false;
    
    const normalizedGuess = playerName.toLowerCase().trim();
    const normalizedTarget = this.targetPlayer.name.toLowerCase().trim();
    
    const isCorrect = normalizedGuess === normalizedTarget;
    if (isCorrect) this.isGameOver = true;
    
    return isCorrect;
  }
}
