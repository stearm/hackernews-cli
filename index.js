const emoji = require('node-emoji');
const fetch = require('node-fetch');
const chalk = require('chalk');
const Table = require('cli-table2');
const ora = require('ora');

const NEW_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty';
const ITEM_URL = (id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
const SEARCH_WORDS = [ 'a.i.', 'machine learning', 'neural networks', 'deep learning', 'nodejs', 'node.js', 'react', 'redux' ];

const getNewStoriesIds = async () => {
  const response = await fetch(NEW_STORIES_URL);
  return await response.json();
};

const getStories = (ids) => {
  return ids.map((id) => {
    return fetch(ITEM_URL(id)).then(res => res.json());
  });
};

(async () => {

  const spinner = ora({text: 'Loading your stories', color: 'green'}).start();

  try {
    const ids = await getNewStoriesIds();
    const stories = await Promise.all(getStories(ids));
    const filteredStories = stories
      .filter(story => story !== null && story.url && SEARCH_WORDS.some(word => story.title.toLowerCase().includes(word)))
      .map(story => ([story.title, story.url ]));

    spinner.stop();

    const table = new Table({
      head: [ 'Title', 'Url' ],
      colWidths: [ 75, 100 ]
    });

    table.push(...filteredStories);

    console.log(chalk.green.bold(`===== ${emoji.get('space_invader')}  ===== Hacker news stories ===== ${emoji.get('space_invader')}  ======`));
    console.log(table.toString());

  } catch (error) {
    console.log(error.message);
  }

})();