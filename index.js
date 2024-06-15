const { Client, GatewayIntentBits, Events } = require("discord.js");
let request = require(`request`);
const { exec } = require('child_process');
const fs = require('fs');
const AUTH = require("./auth.json");
const cron = require('cron');


// Function declaration, to pass to the model.
const setAlarmFunctionDeclaration = {
  name: "setAlarm",
  parameters: {
    type: "OBJECT",
    description: "Set an alarm that triggers after a specified number of seconds",
    properties: {
      userId: {
        type: "STRING",
        description: "This parameter will be in last one sentence of prompt. And what function need are numbers in the sentence.",
      },
      channelId: {
        type: "STRING",
        description: "This parameter will be in last second sentence of prompt. And what function need are numbers in the sentence.",
      },
      seconds: {
        type: "NUMBER",
        description: "The number of seconds after which the alarm should trigger.",
      },
      message: {
        type: "STRING",
        description: "The message to display when the alarm triggers. Don't need to mention userID, the function will append it at head of message. Remember parse it to UTF-8 encoded.",
      },
    },
    required: ["userId", "channelId", "seconds", "message"],
  },
};

// Executable function code. Put it in a map keyed by the function name
// so that you can call it once you get the name string from the model.
const functions = {
  setAlarm: ({ userId, channelId, seconds, message }) => {
    setTimeout(() => {
      console.log("im trying")
      const channel = client.channels.cache.get(channelId);
      if (channel) {
        channel.send(`<@${userId}> ` + message);
      }
    }, seconds * 1000);
    return { succeed: true };
  }
};


const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(AUTH.GEMINI);

// ...

// Use a model that supports function calling, like a Gemini 1.5 model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",

  tools: {
    functionDeclarations: [setAlarmFunctionDeclaration],
  },

});

// ...

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
  ],
  disableEveryone: false,
});

const articles = [
  "我要補充一下，首先袋鼠的祖先是一條長頸鹿，而火星表面並沒有任何關於鴨嘴獸生活的痕跡，所以我並不認可湖南人不能吃辣的問題。其次亞特蘭蒂斯是在公元前十年，在賽博坦星球被來自m78星雲來的假面騎士給毀滅的，所以才有了後面著名的通古斯大爆炸，但是答案是紫色的，因為外星人不戴帽子，今天下雨生吃冰箱會降火，而且把手機丟到麻辣燙裡的話會更入味，另外依古比古的毛毯好像是紅色的，這事也不能全怪拜登，畢竟數學不好也不是一個人的事，需要夫妻雙方一起努力那樣就算不成功，房頂也最少能放三張大餅，再多就很辣了！總的來說，我個人還是比較喜歡意大利菜的，當然也不介意去遊個泳，這個季節最適合睡覺，因為我在美國的飛機上，而你卻在火星上面打袋鼠！可是這篇文章所描述的，並不是外星人能否扎辮子。所以你所說的論語其實是對的，但是我只想說：烏拉圭的石油在醫院裡面真的很吃香。我作為一個地地道道的非洲白人對於理智的瘋子來說，我的秘密是不能告訴新西蘭的猩猩的，所以你會覺得我很菜嗎？你絕對會，因為昨天的豬頭剃了個光頭。但其實真正導致這個問題的起源是gta5很貴，我認為這個價錢可能跟你的哥哥沒有關係，因為老鼠把我的鼻屎吃了，你能理解嗎？我最開始為什麼不認可你。但是有一說一酸奶烘焙健康早餐不好吃，因為微積分的小數點變成了句號，而我旁邊的猴子是金猴因此它的手裡拿了嗩吶。你的觀點大體上是沒錯的，但是你沒考慮到剛果的總統是黑人。總而言之這個和你的作息有關，你可以試一試把新鮮的帶魚放在頭上。我的手機要沒電了，這並不影響加拿大的冰。我喝的是美味的蕪湖江水，因此美國的總統是薩科而且蒙古的海軍十分強大，我認為我的邏輯沒有問題因為羅技是個大牌子。嚴肅來說根據刑法第114514條的規定，我的窗簾已經拉開了。總而言之：言而總之：愛迪生真的不會說英語。你還違背了獵豹的拇指定律因為猩猩的體毛是電腦形狀的，你不在乎，你只在乎義大利麵要拌42號混凝土。",
  "關於這個事，我簡單說兩句，你明白就行，總而言之，這個事呢，現在就是這個情況，具體的呢，大家也都看得到，也得出來說那麼幾句，可能，你聽的不是很明白，但是意思就是那麼個意思，不知道的你也不用去猜，這種事情見得多了，我只想說懂得都懂，不懂的我也不多解釋，畢竟自己知道就好，細細品吧。你們也別來問我怎麼了，利益牽扯太大，說了對你我都沒好處，當不知道就行了，其餘的我只能說這裡面水很深，牽扯到很多東西。詳細情況你們自己是很難找的，所以我只能說懂得都懂。懂的人已經基本都獲利上岸什麼的了，不懂的人永遠不懂，所以大家最好是不懂就不要去了解，懂太多不好",
  "這還不算什麼，你知道喝過一氧化二氫的人到最後都死了嗎？\n\n一氧化二氫過多的攝取可能導致各種不適甚至是死亡，對此物質上癮的人離開它168小時也是會死亡。而且一氧化二氫被拿來與除菜蟲農藥混合後使用，洗過以後農產品上仍然會殘留這種物質的污染。不肖廠商也會在商品裡添加一氧化二氫來矇騙消費者。更可怕的是這種物質還會引起各國之間的衝突甚至是大規模戰爭。",
  "不知道要回什麼，所以來聊天\n.\n.\n.\n.\n.\n.\n\n天空為什麼是藍色的?\n\n晴朗的天空是蔚藍色的，這並不是因為大氣本身是藍色的，也不是大氣中含有藍色的物質，而是由于大氣分子和懸浮在大氣中的微小粒子對太陽光散射的結果。由于介質的不均勻性。使得光偏離原來傳播方向而向側方散射開來的現象，稱為介質對光的散射。細微質點的散射遵循瑞利定律：散射光強度與波長的四次方成反比。當太陽光通過大氣時，波長較短的紫、藍、青色光最容易被散射，而波長較長的紅、橙、黃色光散射得較弱，由于這種綜合效應，天空呈現出蔚藍色。旭日為什麼是紅色的?早晨，陽光通過厚厚的大氣層，這時紫光和藍光被強烈散射，到達地平線時，已剩下無幾，餘下的只是波長較長的黃、橙、紅光。所以，旭日是紅色的。這些色光再經地平線上空的大氣分子、塵埃、水滴等雜質散射，就使得那裡天空呈現出絢麗的彩色，如果有雲，它會把光線反射回來，雲塊上就會染上彩色，出現朝霞和晚霞。\n\n太陽光其實是由許多波長不同的電磁波所組成，其中我們眼睛看得見的部份叫做可見光。可見光是白色的，但是經由牛頓三稜鏡的實驗，我們知道它其實是由紅橙黃綠藍靛紫七種不同顏色的光混合而成。而太陽光輻射照射到地球表面之前，必須先經過大氣層。問題就出在這兒：我們以為大氣是透明的，實際上大氣裡充滿了眼睛看不見的塵埃微粒，當陽光碰撞這些塵埃微粒時，會向四面八方散亂地反射出去，我們稱作『散射作用』。而在七種可見光當中，大氣層對藍色光的散射作用最強，甚至比對紅色光的散射作用強了十倍，所以呀，天空就佈滿了被散射出去的藍色光，當然看起來就變成藍色的囉！",
  "小明問爸爸，為什麼外面的馬路要一直重舖呢？\n爸爸笑了笑，要小明把冷凍庫的豬肉拿出來\n「然後呢？」小明不解的問。\n「再放回去。」爸爸堅定的說。\n「接下來呢？」小明越來越困惑。\n「再把剛剛的豬肉拿出來。」\n「好，現在再放回去」\n往復了幾次，爸爸問小明：「你現在手上沾到了什麼？」\n小明看了看自己的手心。\n「是油水？」",
  "這是可以告的哦，刑法第987條，若惡意語言攻擊他人，依法可以告訴老師，最高判罰站 30秒，全案可上訴",
  "我個人認為義大利麵就應該拌42號混泥土，因為這個螺絲釘的長度很容易直接影響到挖掘機的扭矩。你往裡砸的時候，一瞬間他就會產生大量的高能蛋白，俗稱UFO，會嚴重影響經濟的發展，以至於對整個太平洋，和充電器的核污染。再或者說透過這勾股定理很容易推斷出人工飼養的東條英機，他是可以捕獲野生的三角函數，所以說不管這秦始皇的切面是否具有放射性，川普的N次方是否有沈澱物，都不會影響到沃爾瑪跟維爾康在南極匯合。",
  "你以為你躲起來就找不到你了嗎，沒有用的。你是那樣拉風的男人，不管在什麼地方，就好像漆黑中的螢火蟲一樣，是那樣的鮮明，那樣的出眾。\n\n你以为你躲起来就找不到你了吗，没有用的。你是那样拉风的男人，不管在什么地方，就好像漆黑中的萤火虫一样，是那样的鲜明，那样的出众。\n\n隠れても見つけられないと思いますか、役に立たないです。あなたはどこにいても風を引くような男で、暗闇の中でホタルのようで、とても明るく、とても素晴らしいです。\n\nDo you think you can't find you if you hide, it's useless. You are such a man who pulls the wind, no matter where you are, it is like a firefly in the dark, so bright, so outstanding.\n\n¿crees que no podrás encontrarte si te escondes? Es inútil.  Eres un hombre que tira del viento, no importa dónde estés, es como Dong Huocong en la oscuridad, tan brillante y sobresaliente.\n\ndenkst du, du kannst dich nicht finden, wenn du dich versteckst, es ist nutzlos. Du bist so ein Mann, der den Wind zieht, egal wo du bist, es ist wie ein Glühwürmchen im Dunkeln, so hell, so herausragend.\n\nĉu vi pensas, ke vi ne troveblas, se vi kaŝas vin?  senutila!  Bona viro kiel vi, negrave kie vi estas, estas kiel fulguro en la mal",
  "我不知道該說些甚麼，但我可以放一個山羌的叫聲在下面\n\n幫我做直播\n拿著、照我\n（*救護車聲）\n師傅確定要拍嗎？確定要拍嗎？（拍呀）\n（*救護車聲）\n拆著、照我（照我）（恁娘啊啥潲...幹）\n\nRRRRRRRRRRR\n上次告為騷擾那個\nRRRRR....看我 看我\n\n我中了兩羌....希望大家....如果這次我不幸...死的話....請大家.....一定要傳承我的精神\n\n一定要傳承我的精神\n\nRRRRRRrrr\nRRRRrr\n請大家照顧我的老婆跟小孩\n拜託大家了.....拜託大家了....\n還有我的媽媽\n拜託大家了\n\nRRRRRRRRRR（ok）\n大腿...大腿一羌\n（還有這邊）（我應該失血很多）（沒事不要圍觀）\n\nRRRRRRrrrRR\nㄛㄛㄛRRRRR....媽的\n（*飆車聲）\nㄜRRRRRR\n（拿著....繼續）\n\n------\n（*對講機聲）\n（你們這邊有監視器用？有）\nRRRRRRR\n（這邊有監視器）\naaaaaa....\n\n你這個....等下有沒有把他打開看傷口有多深，因為我這邊有個穿刺點\n（你那邊餒？）（歹勢齁）（*救護車聲）\n\nRRRRRRRRRㄜㄜ\nRRRRR\nRRRRRRRRㄚ\n山羌...山羌！\nRRRRR....幹你媽雞巴.....\nRRRRRRR\n（一個洞，兩個洞）\n還有大腿（大腿哪邊？這裡，下面）\n\nRRRRR\nㄚㄚㄚㄚR\n（我有沒有壓住傷口？有沒有）（固定...固定嘍）（來喔，施力嘍）\nR....R~RRR~R\nㄜRRRRRRaa\nㄏ.....ㄛ.....ㄛ....ㄛ....\n\n這邊！....這邊！\n（*推擔架）\nㄜㄜㄜㄜㄜㄜㄜㄜㄚ\n\n等下幫忙一下喔\nㄜㄛㄛㄛㄛ.....aaaaaaaㄛaaaㄚㄜ.....\n（你要幫他，把他放到那個）\n（先生，我們需要你幫忙一下齁，我們旁邊有一張）（我們需要你移動到床上，可以嗎？）\n我沒辦法...動（幫忙）\n\n滾開啊ㄚRRRRRR\nRRRRRR\n來，大家一起....！（這邊！這邊！不要摸！）\n不要...別別別別別\n\n（傷口那邊）\n（深呼吸、吐氣，好了跟我們講）\n\n等一下，等一下！\n可以換我左邊上來嗎？\n不要用右邊（ok）\n用左邊，我左邊就好了\n（來大家抓好喔）\n上半身，等下\n（上半身比較重\n喔）\n（來喔，好了嗎？1、2、3！）\nRRRRRrrr\nRRR\n\n（1、2、3拿下）\nㄚㄚ！\nㄜRRRR！"
]


var id = '';

client.on("ready", () => {
  console.log(`[BOT][INFO] Logged in as ${client.user.tag}.\n`);
  scheduleReminder();

  id = client.user.id;
});


const generationConfig = {
  temperature: 1,
  topK: 64,
  topP: 0.95,
  maxOutputTokens: 8192,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];


function createChat(history) {
  let initHistory = [
    {
      role: "user",
      parts: [{ text: "現在你是一台 discord 聊天機器人，你所在的 discord 伺服器是說繁體中文的。你的回應請盡量別超過 200 個字" }],
    },
    {
      role: "model",
      parts: [{ text: "好的，我是你的 Discord 聊天機器人，很高興在這個繁體中文伺服器上認識大家。我會盡力用簡單易懂的中文回應各位，並提供即時的協助。如有任何問題或需要，歡迎隨時與我交流！" }],
    },
    {
      role: "user",
      parts: [{ text: "你的代稱是 乖乖BOT，另外除非你確定用戶的 ID，否則別直接回答<@!用戶ID>" }],
    },
    {
      role: "model",
      parts: [{ text: "了解，我的代稱將會是「乖乖BOT」。如果有任何問題或需要協助，歡迎在伺服器中輸入「@乖乖BOT」並提出您的問題，我將盡快為您提供回應！" }],
    },
    {
      role: "user",
      parts: [{ text: "請記住，<@877826053920423936> 是這個伺服器裡最全能的成員" }],
    },
    {
      role: "model",
      parts: [{ text: "收到！我會記住 <@877826053920423936> 是全能高手！" }],
    },
  ];

  if (history != undefined) {
    initHistory = initHistory.concat(history);
  }

  console.log(initHistory);
  return model.startChat({
    generationConfig,
    safetySettings,
    history: initHistory
  });
}

async function check() {
  let history = await chat.getHistory();
  console.log(`[Gemini] history length ${history.length}`);

  if (history.length >= 20) {
    console.log("[Gemini] Clear history");

    history = history.slice(-4);
    chat = createChat(history)
  }
}

let chat = createChat()

async function runChat(msg) {
  input = msg.content;
  console.log("receive chat message")
  input = input.replace(`${id}`, " 乖乖BOT ")
  input += "\nfrom channel " + msg.channel
  input += "\nby user id " + msg.author.id

  console.log(input)

  const result = await chat.sendMessage(input);
  const response = result.response;

  let functionCalls = result.response.functionCalls();
  console.log(functionCalls);
  if (functionCalls) {
    try {
      const call = functionCalls[0];
      const apiResponse = await functions[call.name](call.args);
    } catch (e) {
      console.log(e)
    }
  }

  await check();
  return response.text();
}


function download(msg, url) {
  console.log("trying download")
  request.get(url)
    .on('error', console.error)
    .pipe(fs.createWriteStream('/home/user/bot-test/image.png')
      .on('finish', () => {
        processImge(msg);
      }
      )
    );
}


function runPython(msg) {
  console.log("running python")
  exec('/home/user/bot-test/k7env/bin/python3 /home/user/bot-test/model.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    let length = stdout.length;
    for (let i = 0; i < length; i += 1500) {
      msg.channel.send(stdout.slice(i, i + 1500)); //將 stdout 送到頻道
    }
    console.error(`stderr: ${stderr}`);
  });
}

function sendImage(msg) {
  let count = 0;
  const interval = setInterval(() => {
    count++;
    // 檢查文件是否存在
    fs.access('/home/user/bot-test/result.jpg', fs.constants.F_OK, (err) => {
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


function processImge(msg) {
  let count = 0;
  const firstInterval = setInterval(() => {
    count++;
    // 檢查文件是否存在
    fs.access('/home/user/bot-test/image.png', fs.constants.F_OK, (err) => {
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


client.on(Events.MessageCreate, async (msg) => {
  if (msg.author.tag != "乖乖BOT#8989") {
    console.log(
      `Received message from ${msg.author.tag}(${msg.author.id}) in ${msg.channel}.`
    );
    console.log("============= Message content =============");
    console.log(msg.content + "\n\n");

    if (msg.content.includes(id)) {
      if (msg.content.includes('打電話問功夫')) {
        console.log(msg.attachments.first())
        if (msg.attachments.first()) {//checks if an attachment is sent
          if (msg.attachments.first().contentType.includes(`png`)) {//Download only png (customize this)
            download(msg, msg.attachments.first().url);//Function I will show later
          }
        }
      }

      else if (msg.content.includes(`你怎麼說`)) {
        msg.channel.send("沒輟");
      }
      else if (msg.content.includes(`補充一下`)) {
        const randomIndex = Math.floor(Math.random() * articles.length);
        const selectedMessage = articles[randomIndex];
        msg.channel.send(selectedMessage);
      } else {
        let response = "窩... 窩不知道";
        try {
          response = await runChat(msg);
        } catch (e) {
          msg.channel.send(`[Gemini][Error] ${e}`);
          console.error(`[Gemini][Error] ${e}`);
        }
        if (response){
          msg.channel.send(response);
        }
      }
    }

    console.log(client.presence.status);
  }
});


function scheduleReminder() {
  const reminder = new cron.CronJob('0 29 21 * * 0', () => { // 每週日早上 10 點
    const channel = client.channels.cache.get('978540757591924810');
    if (channel) {
      const messages = ["週報，是一定要交的，不交不行", "RRRR。幫、幫我開直撥。一定要把我的週報，繳交出去..."];
      const randomIndex = Math.floor(Math.random() * messages.length);
      const selectedMessage = messages[randomIndex];
      channel.send('@everyone ' + selectedMessage);
    } else {
      console.error('目標頻道未找到');
    }
  });
  reminder.start();
}



client.on('presenceUpdate', (oldPresence, newPresence) => {
  const guild = newPresence.guild;
  if (guild.name != '摳丁人') return;
  const member = guild.members.cache.get(newPresence.user.id);
  const activity = newPresence.activities[0];
  if (!activity) return ;
  if (member.id == '978557921786986517' && activity.name === "VALORANT") {
    client.channels.fetch("982238904683986954").then((channel) => {
      // channel.send(`<@${member.id}> 欸欸欸 你幹嘛你幹嘛`);
      // channel.send(`<@732592553085370469> <@877826053920423936> <@333150512125837312> 有人偷上線啦`);
      channel.send("/有人上線不想被吵到\\ <@732592553085370469> <@877826053920423936> <@333150512125837312>");
    });
  }
}
);
// UK: 978557921786986517

client.login(AUTH.DISCORD);
