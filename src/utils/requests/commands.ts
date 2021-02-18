// TODO: Create api for commands
// import fetch from "node-fetch"

export default function get(): Array<Object> {
  return require(process.cwd() + "/src/config/commands.json");

  // let res = await fetch("https://tempo.g-vm.nl/api/commands/");
  // return res;
}
