import { writeFileSync } from "fs";
import { emptyDir } from "./functions";

export default class Logger {
  public file: string;
  constructor() {
    if (process.env.NODE_ENV !== "production") {
      emptyDir("./logs/");
    }

    const file = `./logs/${new Date()}.log`;
    this.file = file;
    writeFileSync(file, "");
  }

  public log(msg: string) {
    writeFileSync(this.file, `${new Date().toLocaleTimeString()} ${msg}`);
  }
}
