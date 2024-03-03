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
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions
    ],
  });
const participants = new Map();

try{
  client.once('ready', () => {
    console.log('Bot is online!');
  });
 client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
  
    const args = message.content.split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === '!startquiz') {
      let participant = participants.get(message.author.id);
      if(!participant){
        participant = new LeaderBoardEntry(message.author.id,message.author.username);
        participants.set(message.author.id,participant);
      }
      startQuiz(message,participant.Quiz,false,participants,participant);
    } else if (command === '!stopquiz') {
      let participant = participants.get(message.author.id);
      if(!participant){
        message.channel.send("Quiz not started yet please type !startquiz");
      }else{
          stopQuiz(message,participant.Quiz,participants,participant);
      }
    } else {
        let participant = participants.get(message.author.id);
        if(!participant){
          message.channel.send("Quiz not started yet please type !startquiz");
        }else{
            await evaluateUserResponse(participants,participant.Quiz,message,participant);
        }
    }
  });

  client.on('messageReactionAdd',async (reaction,user)=>{
    if(user.bot) return;
    const message = reaction.message;
    let participant = participants.get(user.id);
    if(!participant){
      message.channel.send("Quiz not started yet please type !startquiz");
    }else{
        await evaluateUserResponse(participants,participant.Quiz,message,participant);
    }
  });
}catch(error){
    console.log(error);
}  


client.login(process.env.DISCORD_TOKEN);