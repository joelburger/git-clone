const commands = require("./commands");

const [, , commandName, ...args] = process.argv;
const command = commands[commandName];

if (command) {
  command.execute(args);
} else {
  throw new Error(`Unknown command ${commandName}`);
}

