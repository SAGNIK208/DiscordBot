const Quiz = require("./Quiz");

class LeaderboardEntry {
  constructor(id, name, email) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._totalScore = 0;
    this._correctAnswers = 0;
    this._wrongAnswers = 0;
    this._Quiz = new Quiz();
  }
  get id() {
    return this._id;
  }
  set id(in_id) {
    this._id = in_id;
  }

  get name() {
    return this._name;
  }
  set name(in_name) {
    this._name = in_name;
  }

  get email() {
    return this._email;
  }
  set email(in_email) {
    this._email = in_email;
  }

  get totalScore() {
    return this._totalScore;
  }
  set totalScore(in_totalScore) {
    this._totalScore = in_totalScore;
  }

  get correctAnswers() {
    return this._correctAnswers;
  }
  set correctAnswers(in_correctAnswers) {
    this._correctAnswers = in_correctAnswers;
  }

  get wrongAnswers() {
    return this._wrongAnswers;
  }
  set wrongAnswers(in_wrongAnswers) {
    this._wrongAnswers = in_wrongAnswers;
  }

  get Quiz() {
    return this._Quiz;
  }
  set Quiz(in_Quiz) {
    this._Quiz = in_Quiz;
  }

  updateScore(isCorrect) {
    this._totalScore += isCorrect ? 1 : 0;
    this._correctAnswers += isCorrect ? 1 : 0;
    this._wrongAnswers += isCorrect ? 0 : 1;
  }

  closeQuiz() {
    this.Quiz.initialize();
  }
}

module.exports = LeaderboardEntry;
