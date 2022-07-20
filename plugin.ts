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
    super("sPoNgEmOcK", "1.0.3");
  }

  /**
   * @override
   */
  public getPluginSpecificCommands(): BotCommand[] {
    const spongeMockCmd = new BotCommand(["spongemock", "🧽", "s", "spons"], "spongemockifies a quoted message", this.spongemockify.bind(this));
    const miakoMockCmd = new BotCommand(["miakomock", "🙏", "mm"], "miakomockifies a quoted message", this.miakoMockify.bind(this));
    const sneakymockCommand = new BotCommand(["sneakymock", "💨", "sm"], "spongemockifies a quoted message and deletes your message", this.sneakymockify.bind(this));
    return [spongeMockCmd, miakoMockCmd, sneakymockCommand];
  }

  private spongemockify(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    var initialCase = (Math.random() < 0.5) ? 0 : 1;
    let spaces: number = 0;
    const mockery = (value: string, idx: number) => ((initialCase + idx + ((value === " ")
        ? spaces++ : spaces)) % 2)
        ? (this.isSpecialCharacter(value) ? value : value.toLowerCase())
        : (this.isSpecialCharacter(value) ? this.convertSpecial(value) : value.toUpperCase());

    let message = "";
    let replyToMessageId: number | undefined = undefined;

    let msgTextSplit = (msg.text as string).split(" ");
    if (msgTextSplit.length > 1){
      message = msgTextSplit.slice(1, msgTextSplit.length).join(" ");
    }
    if (msg.reply_to_message) {
      if (message === "") {
        if (msg.reply_to_message.text) {
          message = msg.reply_to_message.text;
        }
        else if (msg.reply_to_message.caption) {
          message = msg.reply_to_message.caption;
        }
      }
      else {
        replyToMessageId = msg.reply_to_message.message_id;
      }
    } 

    let messageToSend = `${(message ?? "")
        .split("")
        .map(mockery)
        .join("")}`;

    if (messageToSend) {
      this.sendMessage(chat.id, messageToSend, replyToMessageId, false);
    }

    return "";
  }

  private sneakymockify(chat: Chat, user: User, msg: TelegramBot.Message, match: string): string {
    this.spongemockify(chat, user, msg, match);

    this.deleteMessage(chat.id, msg.message_id);

    return "";
  }

  private isSpecialCharacter(character: string): boolean {
    return Object.keys(this.specialCasingMap)
        .concat(Object.values(this.specialCasingMap))
        .find(x => x == character) != undefined;
  }

  private convertSpecial(character: string): string {
    var r = character;

    let valueByKey = this.specialCasingMap[r];
    let keyByValue = Object.keys(this.specialCasingMap).find(key => this.specialCasingMap[key] === r);

    if (valueByKey != undefined) {
      return valueByKey;
    }
    else if (keyByValue != undefined){
      return keyByValue
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

    let message = "";
    let replyToMessageId: number | undefined = undefined;

    let msgTextSplit = (msg.text as string).split(" ");
    if (msgTextSplit.length > 1){
      message = msgTextSplit.slice(1, msgTextSplit.length).join(" ");
    }
    if (msg.reply_to_message) {
      if (message === "") {
        message = msg.reply_to_message.text ?? "";
      }
      else {
        replyToMessageId = msg.reply_to_message.message_id;
      }
    } 
    
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

    const messageToSend = msgArr.join("");
    if (messageToSend) {
      this.sendMessage(chat.id, messageToSend, replyToMessageId, false);
    }

    return "";
  }
}
