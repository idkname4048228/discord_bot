const { GEMINI } = require("../auth.json");
const declarations = require("./functions/declaration_collections")
const functions = require("./functions/function_trigger")
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(GEMINI);

// Use a model that supports function calling, like a Gemini 1.5 model
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",

    tools: {
        functionDeclarations: declarations,
    },
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



function getInitModel(history) {
    let initHistory = [
        {
            role: "user",
            parts: [{ text: "現在你是一台 discord 聊天機器人，你的代稱是 乖乖BOT 。你所在的 discord 伺服器的主要語言是繁體中文。最後，你的回應請盡量別超過 200 個字。" }],
        },
        {
            role: "model",
            parts: [{ text: "好的，我是你的 Discord 聊天機器人，很高興在這個繁體中文伺服器上認識大家。我會盡力用簡單易懂的中文回應各位，並提供即時的協助。如有任何問題或需要，歡迎隨時與我交流！" }],
        },
        {
            role: "user",
            parts: [{ text: "在傳送訊息時會附上訊息作者、來源頻道，在不需要呼叫函式時，可以忽略。" }],
        },
        {
            role: "model",
            parts: [{ text: "了解，我將會在呼叫函式時才使用訊息內額外的資訊，而不會在聊天時提及。" }],
        },
        {
            role: "user",
            parts: [{ text: "請記住，<@877826053920423936> 是這個伺服器裡最全能的成員。" }],
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

async function check(chatModel) {
    let history = await chatModel.getHistory();
    console.log(`[Gemini] history length ${history.length}`);

    if (history.length >= 20) {
        console.log("[Gemini] Clear history");

        history = history.slice(-4);
        chatModel = createChat(history)
    }
    return chatModel;
}

/**
 * @param {import('discord.js').Message} msg - The discord message object.
 */
async function GeminiAnswer(chatModel, id, msg) {
    input = msg.content;
    console.log("receive chat message")
    input = input.replace(`${id}`, " 乖乖BOT ")
    input += "\nfrom channel " + msg.channel
    input += "\nby user id " + msg.author.id

    console.log(input)

    const result = await chatModel.sendMessage(input);
    const response = result.response;

    let functionCalls = result.response.functionCalls();
    console.log("==================");
    console.log(functionCalls);
    console.log("==================");
    if (functionCalls) {
        try {
            const call = functionCalls[0];
            const apiResponse = await functions[call.name](msg, call.args);
        } catch (e) {
            console.log(e)
        }
    }

    await check(chatModel);
    return response.text();
}



module.exports = { getInitModel, check, GeminiAnswer }