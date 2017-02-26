const program = require('commander');

const { print } = require('./index.js');

const list = list => list.split(',');

program
  .command('stories')
  .description('Read last hacker news stories')
  .option('-k, --keywords <keywords>', 'Keywords of your interest (comma separated)', list, [])
  .option('-c, --collections <collections>', 'Collections of keywords in your home directory', list, [])
  .action(command => {
    if (command.keywords) {
      print(command.keywords)
    }

    if(command.collections) {
      // TODO
    }
  });

program.parse(process.argv);
