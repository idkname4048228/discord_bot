/**
 * @param {import('discord.js').Message} msg - The discord message object.
 */
function startDetection(msg) {
    if (msg.attachments.first()) {//checks if an attachment is sent
        if (msg.attachments.first().contentType.includes(`png`)) {//Download only png (customize this)
            download(msg, msg.attachments.first().url);//Function I will show later
        }
    }
}

module.exports = startDetection