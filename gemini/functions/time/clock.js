const setAlarmClockDeclaration = {
	name: "setAlarmClock",
	parameters: {
		type: "OBJECT",
		description: "Set an alarm that triggers after a specified number of seconds",
		properties: {
			seconds: {
				type: "NUMBER",
				description: "The number of seconds after which the alarm should trigger.",
			},
			text: {
				type: "STRING",
				description: "The text to send to discord channel when the alarm triggers. You should mention user with userId",
			},
		},
		required: ["seconds", "text"],
	},
};

/**
 * @param {import('discord.js').Message} msg - The discord message object.
 */
function setAlarmClock(msg, {seconds, text}) {
	setTimeout(() => {
		console.log("im trying")
		msg.channel.send(text);
	}, seconds * 1000);
	return { succeed: true };
}

const getCurrentTimestampDeclaration = {
	name: "getCurrentTimestamp",
	parameters: {
		type: "OBJECT",
		description: "Get current timestamp by using javascript Date.now().",
	},
};

function getCurrentTimestamp(msg) {
	console.log(Date.now());
	return Date.now();
}

module.exports = {setAlarmClockDeclaration, setAlarmClock, getCurrentTimestampDeclaration, getCurrentTimestamp}