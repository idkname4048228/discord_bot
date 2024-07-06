const puppeteer = require('puppeteer');
const userAgent = require('user-agents');
const CronJob = require('cron').CronJob;

async function leetcodeReminder(client) {
    const reminder = new CronJob('0 0 8 * * *', async () => { // 每天 13:05:00 执行
        const channel = client.channels.cache.get('982238904683986954'); // now in 摳丁人 "978540757591924810" for general
        console.log("爬ing");
        if (channel) {
            try {
                let dailyProblemLink = 'undefined';
                // 启动浏览器
                const browser = await puppeteer.launch();
                const page = await browser.newPage();

                await page.setUserAgent(userAgent.random().toString());
                // 导航到目标页面
                await page.goto('https://leetcode.com/problemset/', { waitUntil: 'networkidle2' });

                const link = await page.evaluate(() => {
                    const rowgroup = document.querySelectorAll('div[role="rowgroup"]')[2];
                    const row = rowgroup.querySelectorAll('div[role="row"]')[0];
                    const anchors = row.querySelectorAll('.truncate')[0];
                    const result = anchors.querySelector('a');

                    // 提取链接
                    return result.href;
                });

                dailyProblemLink = link;
                console.log(link); // 打印链接

                // 关闭浏览器
                await browser.close();

                // 发送消息到 Discord
                await channel.send(`@everyone ${dailyProblemLink}`);
            } catch (error) {
                console.error('爬蟲錯誤：', error);
            }
        } else {
            console.error('目標頻道未找到');
        }
    });

    console.log("running");
    reminder.start();
}

module.exports = leetcodeReminder;
