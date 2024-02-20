export const stopQuiz = (message,quiz,partcipant)=>{
    quiz.initialize();
    message.channel.send("Quiz has ended");
    message.channel.send(`
        No of correct answers : ${partcipant.getCorrectAnswers}
        No of wrong answers : ${partcipant.getWrongAnswers}
        Total Score : ${partcipant.getTotalScore}
    `)
}