const CronJob = require('cron').CronJob;

const messages = ["週報，是一定要交的，不交不行", "RRRR。幫、幫我開直播。一定要把我的週報，繳交出去..."];


function scheduleReminder(client) {
    const reminder = new CronJob('0 29 21 * * 0', () => { // 每週日早上 10 點
        const channel = client.channels.cache.get('978540757591924810');
        if (channel) {
            let message = messages[Math.floor(Math.random() * messages.length)];
            channel.send('@everyone ' + message);
        } else {
            console.error('目標頻道未找到');
        }
    });
    reminder.start();
}

module.exports = scheduleReminder