const { Client, GatewayIntentBits, Events } = require('discord.js');
const { DISCORD } = require('./auth.json');
const scheduleReminder = require('./utils/alarm/reminder');
const leetcodeReminder = require('./utils/alarm/leetcode_daily');
const checkNewPresenceForValorant = require('./utils/event/check_presence');
const checkContentForKeyword = require('./utils/event/check_keyword');
const gemini = require('./gemini/ai');

function printMessageDetail(msg) {
    console.log(
        `Received message from ${msg.author.tag}(${msg.author.id}) in ${msg.channel}.`
    );
    console.log("============= Message content =============");
    console.log(msg.content + "\n\n");
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences
    ],
    disableEveryone: true,
});

let ID = null;
let mentionBot = null;
let geminiModel = null;

client.on("ready", () => {
    console.log(`[BOT][INFO] Logged in as ${client.user.tag}.\n`);
    // scheduleReminder(client);
    leetcodeReminder(client);


    geminiModel = gemini.getInitModel();
    ID = client.user.id;
    mentionBot = `<@${ID}>`;
});

client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.id == ID) return ;
    printMessageDetail(msg);

    if (!msg.content.startsWith(mentionBot)) return ;
    
    
    checkContentForKeyword(geminiModel, ID, msg);
});


client.on("presenceUpdate", (oldPresence, newPresence) => {
    // checkNewPresenceForValorant(client, newPresence);
});

client.login(DISCORD);