const program = require('commander');
const chalk = require('chalk');
const os = require('os');
const fs = require('fs');

const { print } = require('./index.js');

const list = list => list.split(',');

program
  .command('stories')
  .description('Read last hacker news stories')
  .option('-k, --keywords <keywords>', 'Keywords of your interest (comma separated)', list, [])
  .option('-c, --collections <collections>', 'Collections of keywords in your home directory', list, [])
  .action(command => {

    const keywords = [];

    if (command.keywords && command.keywords.length) {
      keywords.push(...command.keywords);
    }

    if (command.collections) {

      command.collections.forEach(collection => {
        try {
          let collectionKeywords = fs.readFileSync(`${os.homedir()}/.hackernews-cli/${collection}`, { encoding: 'utf-8' });
          keywords.push(...collectionKeywords.trim().split(','));
        } catch (error) {
          console.log(chalk.red.bold(`Cannot read collection with name ${collection}, check your collections inside ${os.homedir()}/.hackernews-cli`));
          process.exit(1);
        }
      }, '');

    }

    print(keywords);

  });

program.command('create <collection>')
  .description('Create a collection, use the following input string "collection_name=keyword1,keyword2,keyword3"')
  .action(command => {

    let collectionName, keywords;
    const isValid = new RegExp(/([a-zA-Z0-9]+=)([a-zA-Z0-9]+,{0,1})+\w$/g).test(command);

    try {

      if (!isValid) {
        throw new Error('Invalid input');
      }

      [ collectionName, keywords ] = command.split('=');
      fs.writeFileSync(`${os.homedir()}/.hackernews-cli/${collectionName}`, keywords);
      console.log(chalk.green.bold(`Collection ${command} created`))

    } catch (error) {
      console.log(chalk.red.bold(`Cannot write collection: ${error.message}`));
      process.exit(1);
    }

  });

program.command('remove <collection>')
  .description('Remove a collection')
  .action(command => {
    try {
      fs.unlinkSync(`${os.homedir()}/.hackernews-cli/${command}`);
      console.log(chalk.green.bold(`Collection ${command} removed`))
    } catch (error) {
      console.log(chalk.red.bold(`Cannot read collection with name ${command}, check your collections inside ${os.homedir()}/.hackernews-cli`));
      process.exit(1);
    }

  });

program.parse(process.argv);
