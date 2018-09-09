import config from './config';

config.clientId = '15fdc2f3-27b3-447b-8c56-10c163183bb6';
config.redirectUrl = 'https://authredirect-prod-aussoutheast.azurewebsites.net/api/OAuthCallback/redirect/botwebchat';

config.webChat.botFrameworkId = process.env.BOT_FRAMEWORK_ID;
config.webChat.directLineSecret = process.env.DIRECTLINE_SECRET;

config.botApiUrl = 'https://botservice.livetilesbots.com/api/';

export default config;
