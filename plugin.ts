import { BotCommand } from "../../src/bot-commands/bot-command";
import { Chat } from "../../src/chat/chat";
import { User } from "../../src/chat/user/user";
import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";
import TelegramBot, { Message } from "node-telegram-bot-api";
import { throws } from "assert";

export class Plugin extends AbstractPlugin {
  private specialCasingMap = {
    '?': "¿",
    "!": "¡",
    ".": "·",
    ",": "'",
    ";": "⁏",
    "(": ")",
    "/": "\\",
    "_": "—",
  }

  constructor() {
    super("sPoNgEmOcK", "1.1.0");
  }

  /**
   * @override
   */
  public getPluginSpecificCommands(): BotCommand[] {
    const spongeMockCmd = new BotCommand(["spongemock", "sm", "🧽", "spons"], "spongemockifies a quoted message", this.spongeMockify.bind(this));
    const miakoMockCmd = new BotCommand(["miakomock", "mm", "🙏"], "miakomockifies a quoted message", this.miakoMockify.bind(this));
    const sneakySpongeMockCmd = new BotCommand(["sneakyspongemock", "ssm", "💨🧽"], "spongemockifies a quoted message and deletes your message", this.sneakySpongeMockify.bind(this));
    const sneakyMiakoMockCmd = new BotCommand(["sneakymiakomock", "smm", "💨🙏"], "miakomockifies a quoted message and deletes your message", this.sneakyMiakoMockify.bind(this));
    return [spongeMockCmd, miakoMockCmd, sneakySpongeMockCmd, sneakyMiakoMockCmd];
  }

  private spongeMockify(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    let textToMock = this.getTextToMock(msg);
    let replyToMessageId = this.getReplyToMessageId(msg);

    var initialCase = (Math.random() < 0.5) ? 0 : 1;
    let spaces: number = 0;

    let messageToSend = textToMock.split("")
      .map((value: string, idx: number) => ((initialCase + idx + ((value === " ")
        ? spaces++ : spaces)) % 2)
        ? (this.isSpecialCharacter(value) ? value : value.toLowerCase())
        : (this.isSpecialCharacter(value) ? this.convertSpecialCharacter(value) : value.toUpperCase()))
      .join("");

    if (messageToSend) {
      this.sendMessage(chat.id, messageToSend, replyToMessageId, false);
    }

    return "";
  }

  private miakoMockify(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    let textToMock = this.getTextToMock(msg);
    let replyToMessageId = this.getReplyToMessageId(msg);

    const indexesToSwap = new Array<number>();
    let textToMockArray = textToMock.split("");
    textToMockArray = textToMockArray.map((value: string, idx: number) => {
      let swapChance = 0.1;
      if (value === " ") {
        if (textToMockArray[idx - 3] && textToMockArray[idx - 3] !== " " &&
          textToMockArray[idx - 2] && textToMockArray[idx - 2] !== " " &&
          textToMockArray[idx - 1] && textToMockArray[idx - 1] !== " " &&
          textToMockArray[idx + 1] && textToMockArray[idx + 1] !== " " &&
          textToMockArray[idx + 2] && textToMockArray[idx + 2] !== " " &&
          textToMockArray[idx + 3] && textToMockArray[idx + 3] !== " ") {
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
      if (!textToMockArray[charToSwap])
        continue;
      const char = textToMockArray[index];
      textToMockArray[index] = textToMockArray[charToSwap];
      textToMockArray[charToSwap] = char;
    }

    const messageToSend = textToMockArray.join("");
    if (messageToSend) {
      this.sendMessage(chat.id, messageToSend, replyToMessageId, false);
    }

    return "";
  }

  private sneakySpongeMockify(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    this.spongeMockify(chat, user, msg, match);

    this.deleteMessage(chat.id, msg.message_id);

    return "";
  }

  private sneakyMiakoMockify(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    this.miakoMockify(chat, user, msg, match);

    this.deleteMessage(chat.id, msg.message_id);

    return "";
  }

  private getTextToMock(msg: TelegramBot.Message): string {
    let msgTextSplit = (msg.text as string).split(" ");
    if (msgTextSplit.length > 1) {
      return msgTextSplit.slice(1, msgTextSplit.length).join(" ");
    }
    else if (msg.reply_to_message?.text) {
      return msg.reply_to_message.text;
    }
    else if (msg.reply_to_message?.caption) {
      return msg.reply_to_message.caption;
    }

    return "";
  }

  private getReplyToMessageId(msg: TelegramBot.Message): number | undefined {
    let msgTextSplit = (msg.text as string).split(" ");
    if (msgTextSplit.length > 1 && msg.reply_to_message) {
      return msg.reply_to_message.message_id;
    }

    return undefined;
  }

  private isSpecialCharacter(character: string): boolean {
    return Object.keys(this.specialCasingMap)
      .concat(Object.values(this.specialCasingMap))
      .find(x => x == character) != undefined;
  }

  private convertSpecialCharacter(character: string): string {
    var r = character;

    let valueByKey = this.specialCasingMap[r];
    let keyByValue = Object.keys(this.specialCasingMap).find(key => this.specialCasingMap[key] === r);

    if (valueByKey != undefined) {
      return valueByKey;
    }
    else if (keyByValue != undefined) {
      return keyByValue
    }

    return r;
  }
}
