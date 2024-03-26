const {evaluateUserResponse,isValidReaction} = require('../services/userResponseService');

async function handleReactions(reaction,user,participants){
    if(user.bot) return;
    const message = reaction.message;
    if(!message.guild){
      let participant = participants.get(user.id);
      if(!participant){
        message.channel.send("Quiz not started yet please type !startquiz");
      }else{
          if(isValidReaction(message.content,participant.Quiz?.currentQuestion?.text)){
            await evaluateUserResponse(participants,participant.Quiz,message,participant);
          }
      }
    }
  }


module.exports = {
    handleReactions
}  