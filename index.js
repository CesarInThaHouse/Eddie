import "dotenv/config";
import Bot from "./classes/Bot.js";
const client = new Bot({ intents: 3276799 });
client.start(process.env.token);
