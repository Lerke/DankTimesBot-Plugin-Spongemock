import { BotCommand } from "../../src/bot-commands/bot-command";
import { Chat } from "../../src/chat/chat";
import { User } from "../../src/chat/user/user";
import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";
import TelegramBot from "node-telegram-bot-api";

export class Plugin extends AbstractPlugin {
  private specialCasingMap = {
    '?': "¿",
    "!": "¡",
    ".": "·",
    ",": "'",
    ";": "⁏",
    "/": "\\",
    "\\": "/",
  }

  constructor() {
    super("Spongemock", "1.0.1");
  }

  /**
   * @override
   */
  public getPluginSpecificCommands(): BotCommand[] {
    const command = new BotCommand(["spongemock", "🧽"], "spongemockifies a quoted message", this.spongmockify.bind(this));
    return [command];
  }

  private spongmockify(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    var initialCase = (Math.random() < 0.5) ? 0 : 1;
    let spaces: number = 0;
    const mockery = (value: string, idx: number) => ((initialCase + idx + ((value === " ")
        ? spaces++ : spaces)) % 2)
        ? (this.isSpecialCharacter(value) ? this.convertSpecial(value, true) : value.toLowerCase())
        : (this.isSpecialCharacter(value) ? this.convertSpecial(value, false) : value.toUpperCase());

    let message = "";
    if (msg.reply_to_message) {
      message = msg.reply_to_message.text ?? "";
    } else {
      const textSplit = (msg.text as string).split(" ");
      message = textSplit.slice(1, textSplit.length).join(" ");
    }

    return `${(message ?? "")
        .split("")
        .map(mockery)
        .join("")}`;
  }

  private isSpecialCharacter(character: string): boolean {
    return Object.keys(this.specialCasingMap)
        .concat(Object.values(this.specialCasingMap))
        .find(x => x == character) != undefined;
  }

  private convertSpecial(character: string, leftToRight: boolean): string {
    var r = character;

    if (leftToRight) {
      // @ts-ignore
      r = this.specialCasingMap[character] ?? r;
    } else {
      let values = Object.keys(this.specialCasingMap)
          .filter(f => {
            // @ts-ignore
            return this.specialCasingMap[f] === character
          });
      if (values.length > 0) {
        r = values[0];
      }
    }

    return r;
  }
}
