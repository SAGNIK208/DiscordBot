const spacyNLP = require("spacy-nlp");
const nlp = spacyNLP.load("en_core_web_sm-3.0.0");
const { SHORT_ANSWER_THRESHOLD, QUESTION_TYPE } = require("../constants/constants");

function evaluateUserResponse(partcipant,question, message) {
  let isCorrect = false;
  switch(question.type){
    case QUESTION_TYPE.TRUE_FALSE :
        isCorrect = evaluateTrueFalseQuestions(question.correctAnswer,message);
        break;
    case QUESTION_TYPE.MCQ :
        isCorrect = evaluateMCQQuestions(question.options.indexOf(question.correctAnswer),message);
        break;
    case QUESTION_TYPE.SHORT_ANSWER :
        isCorrect = evaluateShortAnswerQuestions(question.correctAnswer,message);
        break;        
  }
  partcipant.updateScore(isCorrect);
}
async function evaluateTrueFalseQuestions(expectedAnswer,message){
 try{
    const filter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
    const collected = await message.awaitReactions(filter, { max: 1, time: 5000, errors: ['time'] });
    const userReaction = collected.first();
    return userReaction.emoji.name === (expectedAnswer === 'true' ? '👍' : '👎');
 }catch(error){
    console.error(error);
    return false;
 }
}
async function evaluateMCQQuestions(expectedAnswer,message){
   try{
    const filter = (reaction, user) => {
        const validEmojis = currentQuestion.choices.map((_, index) => `${index + 1}️⃣`);
        return validEmojis.includes(reaction.emoji.name) && user.id === message.author.id;
    };
    const collected = await message.awaitReactions(filter, { max: 1, time: 5000, errors: ['time'] });
    const userReaction = collected.first();
    const userChoiceIndex = currentQuestion.choices.findIndex(
        (_, index) => userReaction.emoji.name === `${index + 1}️⃣`
    );
    return userChoiceIndex === expectedAnswer;
   }catch(error){
    console.error(error);
    return false;
   }
}
async function evaluateShortAnswerQuestions(expectedAnswer,message) {
try{ 
  const actualAnswer = message.content().trim();
  const doc1 = await nlp(expectedAnswer);
  const doc2 = await nlp(actualAnswer);

  const similarity = doc1.similarity(doc2);

  return similarity >= SHORT_ANSWER_THRESHOLD;
 }catch(error){
    console.log(error);
    return false;
 }
}

module.exports = {
    evaluateUserResponse
}