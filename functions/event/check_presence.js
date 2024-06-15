/**
 * @param {import('discord.js').Presence} newPresence - The discord presence object.
 */

function checkNewPresenceForValorant(newPresence) {
    const guild = newPresence.guild;
    if (guild.name != '摳丁人') return;
    const member = guild.members.cache.get(newPresence.user.id);
    const activity = newPresence.activities[0];
    if (!activity) return ;
    if (member.id == '978557921786986517' && activity.name === "VALORANT") {
        client.channels.fetch("982238904683986954").then((channel) => {
            // channel.send(`<@${member.id}> 欸欸欸 你幹嘛你幹嘛`);
            // channel.send(`<@732592553085370469> <@877826053920423936> <@333150512125837312> 有人偷上線啦`);
            channel.send("有人上線不想被吵到 <@732592553085370469> <@877826053920423936> <@333150512125837312>");
        });
    }
}

module.exports = checkNewPresenceForValorant