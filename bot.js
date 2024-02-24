const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const {startQuiz} = require('./commands/startQuiz');
const {stopQuiz} = require('./commands/stopQuiz');
const {evaluateUserResponse} = require('./services/userResponseService');
const LeaderBoardEntry = require('./models/LeaderBoardEntry');

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildEmojisAndStickers
    ],
  });
const participants = new Map();

try{
 client.on('message', (message) => {
    if (message.author.bot) return;
  
    const args = message.content.split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === '!startquiz') {
      let participant = participants.get(message.author.id);
      if(!participant){
        participant = new LeaderBoardEntry(message.author.id,message.author.username);
        participants.set(message.author.id,participant);
      }
      startQuiz(message,participant.getQuiz());
    } else if (command === '!stopquiz') {
      let participant = participants.get(message.author.id);
      if(!participant){
        message.channel.send("Quiz no started yet please type !startquiz");
      }else{
          stopQuiz(message,participant.getQuiz(),participant);
      }
    } else {
        let participant = participants.get(message.author.id);
        if(!participant){
          message.channel.send("Quiz no started yet please type !startquiz");
        }else{
            evaluateUserResponse(participant,participant.getQuiz(),message);
        }
    }
  });
}catch(error){
    console.log(error);
}  


client.login(process.env.DISCORD_TOKEN);