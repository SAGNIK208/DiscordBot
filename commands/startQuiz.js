import { QUESTION_TYPE } from '../constants/constants';

const {getRandomQuestion} = require('../services/questionService');
const {stopQuiz} = require('./stopQuiz');
export const startQuiz = (message,quiz) => {
    
    if(quiz.isQuizOver()){
        message.channel.send("Quiz is alredy over please start a new quiz");
        stopQuiz(message,quiz);
        return;
    }

    if(quiz.getCurrentQuestion()){
        message.channel.send("Quiz is already in progress");
        return;
    }

    quiz.initialize();

    const newQuestion = null;

    do{
        newQuestion = getRandomQuestion();
    }while(!quiz.hasQuestionBeenAsked(newQuestion));
    
    message.channel.send(`Question: ${newQuestion.text}`);
    
    if(newQuestion.type === QUESTION_TYPE.TRUE_FALSE){
        message.react('👍'); // True emoji
        message.react('👎'); // False emoji
    }else if(newQuestion.type === QUESTION_TYPE.MCQ){
        newQuestion.options.array.forEach((_,index) => {
            message.react(`${index + 1}️⃣`);
        });
    }

}