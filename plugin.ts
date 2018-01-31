import { AbstractPlugin } from "../../src/plugin-host/plugin/plugin";

export class Plugin extends AbstractPlugin
{
  constructor()
  {
    super("Spongemock", "1.0.0", {});

    this.registerCommand("spongemock", (_params: string[]) => 
    {
      return [ this.spongmockify(_params) ];
    })
  }

  private spongmockify(_message: string[]): string {
      let spaces: number = 0;
      return `${_message.join(' ').split("").map((value,idx) => { return ((idx+((value===' ') ? spaces++ : spaces))%2) ? value.toLowerCase() : value.toUpperCase() }).join("")}`;
  }
} 