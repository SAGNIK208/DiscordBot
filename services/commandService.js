const {startQuiz} = require('../commands/startQuiz');
const {stopQuiz} = require('../commands/stopQuiz');
const LeaderBoardEntry = require('../models/LeaderBoardEntry');
const {evaluateUserResponse} = require('../services/userResponseService');

async function runCreateQuizCommand(command,message){
    if (command === '!quiz'){
        const user = message.author;
        const channel = user.dmChannel || await user.createDM();
        if (!channel) {
            console.error('Error starting quiz: Failed to create or fetch private thread with user.');
            return;
        }
        channel.send('Welcome to the quiz use !startquiz to start a new quiz')
      } else {
        const replyMessage = `Hello ${message.author}, to start the quiz, please use !quiz. We'll continue the quiz in a private conversation to avoid cluttering the main server channel.`;
        const reply = await message.reply(replyMessage);
        setTimeout(() => {
            reply.delete().catch(console.error);
        }, 60000); 
      }
}

function runStartQuizCommand(message,participants){
    let participant = participants.get(message.author.id);
        if(!participant){
          participant = new LeaderBoardEntry(message.author.id,message.author.username);
          participants.set(message.author.id,participant);
        }
        startQuiz(message,participant.Quiz,false,participants,participant);
}

function runStopQuizCommand(message,participants){
    let participant = participants.get(message.author.id);
        if(!participant){
          message.channel.send("Quiz not started yet please type !startquiz");
        }else{
            stopQuiz(message,participant.Quiz,participants,participant);
        }
}

async function runEvaluateShortAnswerCommand(message,participants){
    let participant = participants.get(message.author.id);
    if(!participant){
      message.channel.send("Quiz not started yet please type !startquiz");
    }else{
        await evaluateUserResponse(participants,participant.Quiz,message,participant);
    }
}

module.exports = {
    runCreateQuizCommand,
    runStartQuizCommand,
    runStopQuizCommand,
    runEvaluateShortAnswerCommand
}