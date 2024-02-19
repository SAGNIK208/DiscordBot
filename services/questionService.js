const spacyNLP = require('spacy-nlp');
const nlp = spacyNLP.load('en_core_web_sm-3.0.0');
const Question = require('../models/Question');
const questionsData = require('../data/questions.json');
const {SHORT_ANSWER_THRESHOLD} = require('../constants/constants');

function getRandomQuestion() {
  const randomIndex = Math.floor(Math.random() * questionsData.questions.length);
  const randomQuestionData = questionsData.questions[randomIndex];

  return new Question(
    randomQuestionData.id,
    randomQuestionData.question_type,
    randomQuestionData.question_text,
    randomQuestionData.options,
    randomQuestionData.correct_answer
  );
}

function evaluateUserResponse(question, userResponse) {
  const response = userResponse.toLowerCase();

  if (question.type === 'TRUE_FALSE' || question.type === 'MCQ') {
    return response === question.correctAnswer.toLowerCase();
  } else {
    return evaluateShortAnswerQuestions(question.correctAnswer,response);
  }
}

async function evaluateShortAnswerQuestions(expectedAnswer,actualAnswer){
    const doc1 = await nlp(expectedAnswer);
    const doc2 = await nlp(actualAnswer);

    const similarity = doc1.similarity(doc2);

    return similarity>=SHORT_ANSWER_THRESHOLD;
}

module.exports = {
  getRandomQuestion,
  evaluateUserResponse,
};
