const program = require('commander');

const { print } = require('./index.js');

program
  .command('stories')
  .description('Read last hacker news stories')
  .option('-k, --keywords <keywords>', 'Keywords of your interest (comma separated)', list => list.split(','), [])
  .action(command => {
    if (command.keywords) {
      print(command.keywords)
    }
  });

program.parse(process.argv);
