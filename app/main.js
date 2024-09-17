const commands = require('./commands');

const [, , commandName, ...args] = process.argv;

try {
  const command = commands[commandName];

  if (command) {
    command.execute(args);
  } else {
    throw new Error(`Unknown command ${commandName}`);
  }
} catch (err) {
  console.error('Error', err);
}

