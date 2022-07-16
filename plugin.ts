import { BotCommand } from "../../src/bot-commands/bot-command";
import { Chat } from "../../src/chat/chat";
import { User } from "../../src/chat/user/user";
import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";
import TelegramBot, { Message } from "node-telegram-bot-api";

export class Plugin extends AbstractPlugin {
  private specialCasingMap = {
    '?': "¿",
    "!": "¡",
    ".": "·",
    ",": "'",
    ";": "⁏",
    "/": "\\",
    "\\": "/",
    "(": ")",
    ")":"(",
  }

  constructor() {
    super("Spongemock", "1.0.2");
  }

  /**
   * @override
   */
  public getPluginSpecificCommands(): BotCommand[] {
    const spongeMockCmd = new BotCommand(["spongemock", "🧽", "s", "spons"], "spongemockifies a quoted message", this.spongmockify.bind(this));
    const miakoMockCmd = new BotCommand(["miakomock", "🙏", "mm"], "miakomockifies a quoted message", this.miakoMockify.bind(this));
    return [spongeMockCmd, miakoMockCmd];
  }

  private spongmockify(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    var initialCase = (Math.random() < 0.5) ? 0 : 1;
    let spaces: number = 0;
    const mockery = (value: string, idx: number) => ((initialCase + idx + ((value === " ")
        ? spaces++ : spaces)) % 2)
        ? (this.isSpecialCharacter(value) ? this.convertSpecial(value, true) : value.toLowerCase())
        : (this.isSpecialCharacter(value) ? this.convertSpecial(value, false) : value.toUpperCase());

    var message = this.getMsgToMockify(msg);

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

  private getMsgToMockify(msg: Message) {
    if (msg.reply_to_message) {
      return msg.reply_to_message.text ?? "";
    } else {
      const textSplit = (msg.text as string).split(" ");
      return textSplit.slice(1, textSplit.length).join(" ");
    }
  }

  private miakoMockify(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    var message = this.getMsgToMockify(msg);

    if (!message)
      return "";
    
    const indexesToSwap = new Array<number>();
    let msgArr = message.split("");
    msgArr = msgArr.map((value: string, idx: number) => {
      let swapChance = 0.1;
      if (value === " ") {
        if (msgArr[idx - 3] && msgArr[idx - 3] !== " " &&
          msgArr[idx - 2] && msgArr[idx - 2] !== " " &&
          msgArr[idx - 1] && msgArr[idx - 1] !== " " &&
          msgArr[idx + 1] && msgArr[idx + 1] !== " " &&
          msgArr[idx + 2] && msgArr[idx + 2] !== " " &&
          msgArr[idx + 3] && msgArr[idx + 3] !== " ") {
            swapChance = 0.3;
          }
      }
      if (Math.random() < (value === " " ? 0.8 : 0.1))
        indexesToSwap.push(idx);

      if (value === "r")
        return Math.random() < 0.5 ? "t" : "r";
      if (value === "t" || value === "d") {
        const chance = Math.random();
        if (chance < 0.33)
          return "d";
        if (chance > 0.66)
          return "t";
        else
          return "dt";
      }
      return value;
    });

    for (const index of indexesToSwap) {
      const charToSwap = index + Math.random() > 0.5 ? 1 : -1;
      if (!msgArr[charToSwap])
        continue;
      const char = msgArr[index];
      msgArr[index] = msgArr[charToSwap];
      msgArr[charToSwap] = char;
    }

    return msgArr.join("");
  }
}
