import { BotCommand } from "../../src/bot-commands/bot-command";
import { Chat } from "../../src/chat/chat";
import { User } from "../../src/chat/user/user";
import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";
import TelegramBot from "node-telegram-bot-api";
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
    const spongemockCommand = new BotCommand(["spongemock", "🧽", "s", "spons"], "spongemockifies a quoted message", this.spongemockify.bind(this));
    const sneakymockCommand = new BotCommand(["sneakymock", "💨", "sm"], "spongemockifies a quoted message and deletes your message", this.sneakymockify.bind(this));
    return [spongemockCommand, sneakymockCommand];
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
        message = msg.reply_to_message.text ?? "";
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
}
