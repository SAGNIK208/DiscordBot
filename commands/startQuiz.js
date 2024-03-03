const {QUESTION_TYPE} = require('../constants/constants');
const {getRandomQuestion} = require('../services/questionService');
const {stopQuiz} = require('./stopQuiz');
module.exports.startQuiz = (message,quiz,nextQuestion,participants,participant) => {
    
    if(quiz.isQuizOver()){
        message.channel.send("Quiz is already over please start a new quiz");
        stopQuiz(message,quiz,participants,participant);
        return;
    }

    if(quiz.currentQuestion && !nextQuestion){
        message.channel.send("Quiz is already in progress");
        return;
    }

    if(!nextQuestion){
        quiz.initialize();
    }

    let newQuestion = null;

    do{
        newQuestion = getRandomQuestion();
    }while(quiz.hasQuestionBeenAsked(newQuestion));
    
    quiz.currentQuestion = newQuestion;

    message.channel.send(`Question: ${newQuestion.text}`).then((currentQuestion)=>{
        if(newQuestion.type === QUESTION_TYPE.TRUE_FALSE){
            currentQuestion.react('👍'); // True emoji
            currentQuestion.react('👎'); // False emoji
        }else if(newQuestion.type === QUESTION_TYPE.MCQ){
            newQuestion.options.forEach((choice,index) => {
                message.channel.send(choice);
                currentQuestion.react(`${index + 1}️⃣`);
            });
        }
    });
    
    

}