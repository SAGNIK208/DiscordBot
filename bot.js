require('dotenv').config();
const commandService = require('./services/commandService');
const reactionService = require('./services/reactionService');
const {getClient} = require('./config/config')
const participants = new Map();


const client = getClient();
try{
  client.once('ready', () => {
    console.log('Bot is online!');
  });
 client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
  
    const args = message.content.split(/ +/);
    const command = args.shift().toLowerCase();
  
    if(message.guild){
      commandService.runCreateQuizCommand(command,message);
    }else{
      if (command === '!startquiz') {
        commandService.runStartQuizCommand(message,participants);
      } else if (command === '!stopquiz') {
        commandService.runStopQuizCommand(message,participants);
      } else {
        commandService.runEvaluateShortAnswerCommand(message,participants);
      }
    }
  });

  client.on('messageReactionAdd',async(reaction,user)=>{
    reactionService.handleReactions(reaction,user,participants);
  });
}catch(error){
    console.log(error);
}  


client.login(process.env.DISCORD_TOKEN);