
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    
    // listen for messages that will start with `/who`
    if (message.substring(0, 4) === '/who') {
        
        var cmd = args[0];
       
        let daoc = args.join('')
        let phoenixurl = "https://herald.playphoenix.online/c/" + daoc;
    
        request(phoenixurl, (error, response, html) =>
        {
            // if a webpage is found
            if(!error && response.statusCode == 200)
            {
                // load html through cheerio
                const $ = cheerio.load(html);
                
                const player = $('.col-md-12')
                                
                message.channel.send(player.text);
                
            }
            
            // error for invalid name
            else return message.channel.send(cannotFind + "\nCharacter not found.. we're they in Swoop?");
                });
           
         }
     }
);

//request('https://herald.playphoenix.online/c/Svot', (error, response, html) => {
  // if(!error && response.statusCode ==200) {
  //      const $ = cheerio.load(html);

  //      const player = $('.col-md-12')

 //       console.log(player.text());
  //  }
//});