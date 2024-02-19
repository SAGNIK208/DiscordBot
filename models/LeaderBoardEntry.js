class LeaderboardEntry {
    constructor(id, name,email) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.totalScore = 0;
      this.correctAnswers = 0;
      this.wrongAnswers = 0;
    }
  
    updateScore(isCorrect) {
      this.totalScore += isCorrect ? 1 : 0;
      this.correctAnswers += isCorrect ? 1 : 0;
      this.wrongAnswers += isCorrect ? 0 : 1;
    }
  }
  
  module.exports = LeaderboardEntry;
  