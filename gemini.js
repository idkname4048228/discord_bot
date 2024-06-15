const AUTH = require("./auth.json");
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(AUTH.GEMINI);



// Use a model that supports function calling, like a Gemini 1.5 model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



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

module.exports = {chat};