import { BotCommand } from "../../src/bot-commands/bot-command";
import { Chat } from "../../src/chat/chat";
import { User } from "../../src/chat/user/user";
import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";

export class Plugin extends AbstractPlugin {

  constructor() {
    super("Spongemock", "1.0.0");
    console.log("Loaded Spongemock!");
  }

  /**
   * @override
   */
  public getPluginSpecificCommands(): BotCommand[] {
    const command = new BotCommand("spongemock", "spongemockifies a quoted message", this.spongmockify.bind(this));
    return [command];
  }

  private spongmockify(chat: Chat, user: User, msg: any, match: string[]): string {

    let spaces: number = 0;
    const mockery = (value, idx) => ((idx + ((value === " ")
      ? spaces++ : spaces)) % 2) ? value.toLowerCase() : value.toUpperCase();
    let message: string;

    if (msg.reply_to_message) {
      message = msg.reply_to_message.text;
    } else {
      const textSplit = (msg.text as string).split(" ");
      message = textSplit.slice(1, textSplit.length).join(" ");
    }

    if (message) {
      return `${message
        .split("")
        .map(mockery)
        .join("")}`;
    }
  }
}
