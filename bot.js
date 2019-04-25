
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var request = require('request');
var cheerio = require('cheerio');

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

    logger.info('Who command triggered');
    const args = message.slice(4).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    logger.info(args);
    logger.info(command);

    let daoc = command;
    let phoenixurl = "https://herald.playphoenix.online/c/" + daoc;

    request(phoenixurl, (error, response, html) => {
      // if a webpage is found
      if (!error && response.statusCode == 200) {
        // load html through cheerio
        const $ = cheerio.load(html);
        const player = $('.col-md-12');

        const [playerName, guild, className, classLevel, realmRank, race, realmTitle] = player.text().trim()
          .split('\n')
          .filter(el => el.replace('-', '').trim().length)
          .map(function(item) {
          return item.trim();
        });;

        bot.sendMessage({
          to: channelID,
          embed: {
            color: 6826080,
            fields: [
              { 
                name: 'Name',
                value:  `${playerName} ${guild}`
              },
              {
                name: 'Class',
                value: className,
                inline: true
              },
              {
                name: 'Level',
                value: classLevel,
                inline: true
              },
              {
                name: 'Realm Rank',
                value: realmRank,
                inline: true
              },
              {
                name: 'Race/Title',
                value: `${race} ${realmTitle}`,
                inline: true
              }
            ]
          }
        });

      }
      else {
        // have not looked at this line yet, but suspect it needs to change
        return  bot.sendMessage({
          to: channelID,
          message: 'Player not found'
        });
      }
    });

  }
}
);
