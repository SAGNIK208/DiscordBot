const GoogleSheetsRepository = require('../repository/googleSheetRepo');
const config = require('../config/config');
const LeaderboardRepository = require('../repository/LeaderBoardRepository');

let repository;

if (config.REPOSITORY_TYPE === 'googleSheets') {
  repository = new LeaderboardRepository(new GoogleSheetsRepository());
}
module.exports.stopQuiz = (message,quiz,participants,participant)=>{
    repository.updateLeaderboard(participant);
    quiz.initialize();
    message.channel.send("Quiz has ended");
    message.channel.send(`
        No of correct answers : ${participant.correctAnswers}
        No of wrong answers : ${participant.wrongAnswers}
        Total Score : ${participant.totalScore}
    `)
    participants.delete(participant.id);
}