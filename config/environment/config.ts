const scopes = [
    'Calendars.ReadWrite',
    'Calendars.ReadWrite.Shared',
    'Contacts.ReadWrite',
    'Contacts.ReadWrite.Shared',
    'Files.ReadWrite.All',
    'Files.ReadWrite.AppFolder',
    'Mail.ReadWrite',
    'Mail.ReadWrite.Shared',
    'Mail.Send',
    'Mail.Send.Shared',
    'MailboxSettings.ReadWrite',
    'Notes.ReadWrite.All',
    'People.Read',
    'Sites.ReadWrite.All',
    'Tasks.ReadWrite',
    'Tasks.ReadWrite.Shared',
    'User.ReadBasic.All',
    'User.ReadWrite'
];

const config = {
    clientId: '3c5fc213-072e-4178-a3c1-2f8f333e59ae',
    redirectUrl: 'https://authredirect-dev-aussoutheast.azurewebsites.net/api/OAuthCallback/redirect/botwebchat',
    scopes: scopes,

    webChat: {
        botFrameworkId: '331e99c1-42d3-49bc-ba05-316c38ca5332',
        directLineSecret: 'b1ViqpI4uWg.cwA.yd0.zccxgllvLGZAsEmUg8Qb7icOHmYrP_-ZXxCML8oVOb8',
    },

    botApiUrl: 'https://botservice-dev-aussoutheast.azurewebsites.net/api/'
};

export default config;