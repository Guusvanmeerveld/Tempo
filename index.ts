require("dotenv").config();
import fs from "fs";
import Manager from "./src/manager";
import Console from "./src/utils/console";

if (!fs.existsSync("./node_modules/")) {
  console.log(
    "Could not find node_modules, did you remember to run npm install?"
  );
  process.exit();
}

if (!fs.existsSync("./database/")) {
  Console.info("Could not find database folder, creating one...");
  fs.mkdirSync("./database");
}

const manager = new Manager();
manager.start();
