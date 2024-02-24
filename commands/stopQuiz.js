const GoogleSheetsRepository = require('../repository/googleSheetRepo');
const config = require('../config/config');
const LeaderboardRepository = require('../repository/LeaderBoardRepository');

let repository;

if (config.REPOSITORY_TYPE === 'googleSheets') {
  repository = new LeaderboardRepository(new GoogleSheetsRepository());
}
module.exports.stopQuiz = (message,quiz,partcipant)=>{
    repository.updateLeaderboard(partcipant);
    quiz.initialize();
    message.channel.send("Quiz has ended");
    message.channel.send(`
        No of correct answers : ${partcipant.getCorrectAnswers}
        No of wrong answers : ${partcipant.getWrongAnswers}
        Total Score : ${partcipant.getTotalScore}
    `)
}