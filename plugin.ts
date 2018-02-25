import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";
import { ChatMessage } from "../../src/chat/chat-message/chat-message";

export class Plugin extends AbstractPlugin
{
  constructor()
  {
    super("Spongemock", "1.0.0", {});

    this.registerCommand("spongemock", (params: ChatMessage) => 
    {
      return [ 
        (params.reply_text.length > 0) 
        ? this.spongmockify(params.reply_text)
        : this.spongmockify(params.text) 
      ];
    });

    console.log("Loaded Spongemock!");
  }

  private spongmockify(_message: string): string {
      let spaces: number = 0;
      const mockery = (value, idx) => ((idx+((value === ' ') ? spaces++ : spaces))%2) ? value.toLowerCase() : value.toUpperCase();

      return `${_message
      .split("")
      .map(mockery)
      .join("")}`;
  }
} 