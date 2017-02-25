const cli = require('commander');
const os = require('os');

const { print } = require('./index.js');

cli
  .version('0.0.1')
  .option('-a, --add', 'Add keywords of interest')
  .option('-k, --keywords <keywords>', 'Read stories about keywords (semicolon separated)')
  .parse(process.argv);

if (cli.keywords) {
  const keywords = cli.keywords.split(';');
  print(keywords);
}
