const { QUIZ_QUESTION_LIMIT } = require("../constants/constants");
const questionsData = require('../data/questions.json');

class Quiz {
  constructor() {
    this._currentQuestion = null;
    this._askedQuestionsSet = new Set();
    this._timer = null;
  }

  initialize() {
    this._currentQuestion = null;
    this._askedQuestionsSet.clear();
  }

  get currentQuestion() {
    return this._currentQuestion;
  }

  set currentQuestion(question) {
    this._currentQuestion = question;
    this._askedQuestionsSet.add(question.id);
  }

  set timer(timerId){
    this._timer = timerId;
  }

  hasQuestionBeenAsked(question) {
    return this._askedQuestionsSet.has(question.id);
  }

  clearTimer(){
    clearTimeout(this._timer);
  }

  isQuizOver(){
    return this._askedQuestionsSet.size >= Math.min(questionsData.questions.length,QUIZ_QUESTION_LIMIT);
  }
}

module.exports = Quiz;
