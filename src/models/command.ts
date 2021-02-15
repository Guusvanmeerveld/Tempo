export interface Command {
  name: string;
  description?: string;
  usage?: string;
  aliases?: Array<string>;
  voice?: boolean;
  run: Function;
}
