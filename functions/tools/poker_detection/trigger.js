const fs = require('fs');
const request = require(`request`);
const { exec } = require('child_process');

const pythonPath = "/home/user/bot-test/k7env/bin/python3"
const directoryPath = "/home/user/bot-test/functions/tools/poker_detection"

/**
 * @param {import('discord.js').Message} msg - The discord message object.
 */
async function startDetection(msg) {
    if (!msg.attachments.first()) return; // checks if an attachment is sent

    const attachment = msg.attachments.first();
    if (!attachment.contentType.includes('png')) return; // download only png (customize this)

    const downloadSuccess = await download(attachment.url).catch((err) => {
        return false;
    });
    if (!downloadSuccess) return;

    processImage(msg); // Assuming you meant `processImage` instead of `processImge`
}

function download(url) {
    return new Promise((resolve, reject) => {
        request.get(url)
            .on('error', (err) => {
                console.error(err);
                reject(false);
            })
            .pipe(fs.createWriteStream(`${directoryPath}/image.png`)
                .on('finish', () => resolve(true))
                .on('error', (err) => {
                    console.error(err);
                    reject(false);
                })
            );
    });
}

function processImage(msg) {
    let count = 0;
    const firstInterval = setInterval(() => {
        count++;
        // 檢查文件是否存在
        fs.access(`${directoryPath}/image.png`, fs.constants.F_OK, (err) => {
            if (!err || count == 10) {
                runPython(msg)
                sendImage(msg)
                clearInterval(firstInterval); // 如果文件存在，清除定時器
            } else {
                console.log('iamge.png 不存在！');
            }
        });
    }, 1000); // 1000 毫秒 = 1 秒
}

function runPython(msg) {
    console.log("running python")
    exec(`${pythonPath} ${directoryPath}/model.py`, (error, stdout, stderr) => {
        if (error) {
            msg.channel.send(`exec error: ${error}`);
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        let length = stdout.length;
        for (let i = 0; i < length; i += 1500) {
            msg.channel.send(stdout.slice(i, i + 1500)); //將 stdout 送到頻道
        }
        if (stderr) {
            msg.channel.send(`stderr: ${stderr}`);
            console.error(`stderr: ${stderr}`);
        }
    });
}


function sendImage(msg) {
    let count = 0;
    const interval = setInterval(() => {
        count++;
        // 檢查文件是否存在
        fs.access(`${directoryPath}/result.jpg`, fs.constants.F_OK, (err) => {
            if (count == 10) {
                clearInterval(interval); // 如果文件存在，清除定時器
                msg.channel.send('處理太久了');
            }
            else if (!err) {
                console.log('result.jpg 存在！');

                clearInterval(interval); // 如果文件存在，清除定時器
            } else {
                console.log('result.jpg 不存在！');
            }
        });
    }, 1000); // 1000 毫秒 = 1 秒
}


module.exports = startDetection

