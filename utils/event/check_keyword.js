const startDetection = require("../tools/poker_detection/trigger");
const getArticle = require("../tools/copy_articles_getter");
const gemini = require("../../gemini/ai");

/**
 * @param {import('discord.js').Message} msg - The discord message object.
 */
async function checkContentForKeyword(chatModel, id, msg) {
    msgWithoutMention = msg.content.replace(`<@${id}>`, '').trim();
    if (msgWithoutMention === '打電話問功夫') {
        startDetection(msg);
        return;
    }
    if (msgWithoutMention === '你怎麼說') {
        msg.channel.send("你是對的");
        return;
    }
    if (msgWithoutMention === '補充一下') {
        msg.channel.send(getArticle());
        return;
    }

    let response = "";
    try {
        response = await gemini.GeminiAnswer(chatModel, id, msg);
    } catch (e) {
        response = `[Gemini][Error] ${e}`;
        console.error(`[Gemini][Error] ${e}`);
    }
    msg.channel.send(response);

}

module.exports = checkContentForKeyword