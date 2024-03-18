const Compromise = require('compromise');
const natural = require('natural');
const pos = require('pos');
const synonyms = require('synonyms');
const { SHORT_ANSWER_THRESHOLD, QUESTION_TYPE } = require("../constants/constants");
const { startQuiz } = require('../commands/startQuiz');

function jaccardSimilarity(set1, set2) {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

function isValidReaction(question1,question2){
  return question1.includes(question2);
}

async function evaluateUserResponse(participants,quiz, message,participant) {
  let isCorrect = false;
  let question = quiz.currentQuestion;
  quiz.clearTimer();
  switch(question.type){
    case QUESTION_TYPE.TRUE_FALSE :
        isCorrect = await evaluateTrueFalseQuestions(question.correctAnswer,message,participant.id);
        break;
    case QUESTION_TYPE.MCQ :
        isCorrect = await evaluateMCQQuestions(question.options.indexOf(question.correctAnswer),message,quiz,participant.id);
        break;
    case QUESTION_TYPE.SHORT_ANSWER :
        isCorrect = await evaluateShortAnswerQuestions(question.correctAnswer.toLowerCase().trim(),message);
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
  if(!message || !userId){
    return false;
  }
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
    if(!message || !userId || !quiz){
      return false;
    }
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
  if(!message){
    return false;
  } 
  const actualAnswer = message.content.toLowerCase().trim();
  const stemmer = natural.PorterStemmer;
    const tokenizer = new natural.WordTokenizer();

    const stemmedQuestion = stemmer.tokenizeAndStem(expectedAnswer.toLowerCase());
    const stemmedUserAnswer = stemmer.tokenizeAndStem(actualAnswer.toLowerCase());

   
    const tagger = new pos.Tagger();
    const tagsQuestion = tagger.tag(tokenizer.tokenize(expectedAnswer));
    const tagsUserAnswer = tagger.tag(tokenizer.tokenize(actualAnswer));

    const synonymDictionary = {};
    const expectedAnswerWords = expectedAnswer.toLowerCase().split(/\W+/);

    for (const word of expectedAnswerWords) {
      synonymDictionary[word] = synonyms(word) || [word];
    }

    for (let i = 0; i < stemmedQuestion.length; i++) {
      if (synonymDictionary[stemmedQuestion[i]] && tagsQuestion[i][1] === 'NN') {
        stemmedQuestion[i] = synonymDictionary[stemmedQuestion[i]][0]; 
      }
    }

    for (let i = 0; i < stemmedUserAnswer.length; i++) {
      if (synonymDictionary[stemmedUserAnswer[i]] && tagsUserAnswer[i][1] === 'NN') {
        stemmedUserAnswer[i] = synonymDictionary[stemmedUserAnswer[i]][0];
      }
    }
    const jaccardSim = jaccardSimilarity(new Set(stemmedQuestion), new Set(stemmedUserAnswer));
    return jaccardSim >= SHORT_ANSWER_THRESHOLD
  } catch (error) {
    console.error("Error evaluating answer:", error);
  }
}

module.exports = {
    evaluateUserResponse,
    isValidReaction
}