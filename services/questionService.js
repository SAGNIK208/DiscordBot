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

module.exports = {
  getRandomQuestion,
};
