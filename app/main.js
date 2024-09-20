const commands = require('./commands');

const [, , commandName, ...args] = process.argv;

try {
  const command = commands[commandName];

  if (command) {
    command.execute(args);
  } else {
    console.log(`Unknown command ${commandName}`);
  }
} catch (err) {
  console.error('Error', err);
}

