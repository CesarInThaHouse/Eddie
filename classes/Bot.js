import { Client, Collection } from "discord.js";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import fs from "fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
function getFiles(directory) {
  return fs.readdirSync(directory).filter((file) => file.endsWith(".js"));
}
export default class Bot extends Client {
  constructor(args) {
    super(args);
    this.commands = new Collection();
    this.aliases = new Collection();
    this.cooldowns = new Collection();
    this.events = new Collection();
    this.body = [];
  }
  async start(token) {
    this.loadEvents();
    console.log(`Loaded ${this.events.size} events.`);
    this.loadCommands();
    console.log(`Loaded ${this.commands.size} commands.`);
    await super.login(token);
    console.log(`Successfully logged in as ${this.user.tag}.`);
  }
  loadEvents() {
    getFiles(`${(this, __dirname)}/../events`).forEach(async (file, i) => {
      console.log(`${i + 1}.- ${file} event loaded.`);
      const name = file.split(".js")[0];
      const Event = (
        await import(
          pathToFileURL(`${(this, __dirname)}/../events/${file}`).toString()
        )
      ).default;
      const event = new Event(this, name);
      event.startListener();
      this.events.set(name, event);
    });
  }
  loadCommands() {}
  getCommand(cmd) {
    let command = this.commands.get(cmd);
    if (!command) command = this.commands.get(this.aliases.get(cmd));
    return command;
  }
}
