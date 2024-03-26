const { Client, GatewayIntentBits } = require('discord.js');
module.exports.REPOSITORY_TYPE = 'googleSheets'; 
module.exports.SPREADSHEET_ID = "1ncCL1E0G_ALJAa4L4sMo2lxaI0oq5PfJZ3jS8jOZb28";
module.exports.SHEET_NAME = "LEADERBOARD";

module.exports.getClient = ()=>{
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
    
    return client;  
}
