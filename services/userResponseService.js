const nlp = require('compromise');
const { SHORT_ANSWER_THRESHOLD, QUESTION_TYPE } = require("../constants/constants");
const { startQuiz } = require('../commands/startQuiz');

async function evaluateUserResponse(participants,quiz, message,participant) {
  let isCorrect = false;
  let question = quiz.currentQuestion;
  switch(question.type){
    case QUESTION_TYPE.TRUE_FALSE :
        isCorrect = await evaluateTrueFalseQuestions(question.correctAnswer,message,participant.id);
        break;
    case QUESTION_TYPE.MCQ :
        isCorrect = await evaluateMCQQuestions(question.options.indexOf(question.correctAnswer),message,quiz,participant.id);
        break;
    case QUESTION_TYPE.SHORT_ANSWER :
        // isCorrect = evaluateShortAnswerQuestions(question.correctAnswer.toLowerCase().trim(),message);
        isCorrect = true;
        break;        
  }
  if(!isCorrect){
    message.channel.send(`Correct Answer is ${question.correctAnswer}`)
  }
  else{
    message.channel.send(`Congratulations your answer is correct`);
  }
  participant.updateScore(isCorrect);
  startQuiz(message,quiz,true,participants,participant);
}
function evaluateTrueFalseQuestions(expectedAnswer,message,userId){
 try{
  const reactions = message.reactions.cache;
  const timerPromise = () => {
    const userReaction = reactions.find(reaction => {
      const users = reaction.users.cache;
      return users.has(userId);
    });
      return (userReaction) ? userReaction.emoji.name:null;
  }
    const resultEmoji = timerPromise();
    return resultEmoji === (expectedAnswer ? '👍' : '👎');
 }catch(error){
    console.error(error);
    return false;
 }
}
function evaluateMCQQuestions(expectedAnswer,message,quiz,userId){
   try{
    const reactions = message.reactions.cache;
    const currentQuestion = quiz.currentQuestion;
    const timerPromise = () => {
      const userReaction = reactions.find(reaction => {
        const users = reaction.users.cache;
        return users.has(userId);
      });
        return (userReaction) ? userReaction.emoji.name:null;
    }
    const resultEmoji = timerPromise();
    const userChoiceIndex = currentQuestion.options.findIndex(
        (_, index) => resultEmoji === `${index + 1}️⃣`
    );
    return userChoiceIndex === expectedAnswer;
   }catch(error){
    console.error(error);
    return false;
   }
}
async function evaluateShortAnswerQuestions(expectedAnswer,message) {
try{ 
  const actualAnswer = message.content.toLowerCase().trim();
  console.log(nlp);
  nlp.Vector.ensureLoaded();
  const vector1 = new nlp.Vector(expectedAnswer);
  const vector2 = new nlp.Vector(actualAnswer);
  const similarity = vector1.cosine(vector2);
  return similarity >= SHORT_ANSWER_THRESHOLD;
 }catch(error){
    console.log("error");
    console.log(error);
    return false;
 }
}

module.exports = {
    evaluateUserResponse
}