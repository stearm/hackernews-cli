const emoji = require('node-emoji');
const fetch = require('node-fetch');
const chalk = require('chalk');
const Table = require('cli-table2');
const ora = require('ora');

const NEW_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty';
const ITEM_URL = (id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
const HEADER = chalk.green.bold(`===== ${emoji.get('space_invader')}  ===== Hacker news stories ===== ${emoji.get('space_invader')}  ======`);

const getNewStoriesIds = async () => {
  const response = await fetch(NEW_STORIES_URL);
  return await response.json();
};

const getStories = (ids) => {
  return ids.map((id) => {
    return fetch(ITEM_URL(id)).then(res => res.json());
  });
};

exports.print = async keywords => {

  const spinner = ora({ text: 'Loading your stories', color: 'green' }).start();

  try {
    const ids = await getNewStoriesIds();
    const stories = await Promise.all(getStories(ids));
    const filteredStories = stories
      .filter(story => {
        if (story === null || !story.url) return false;
        if (!keywords.length) return true;
        return keywords.some(word => story.title.toLowerCase().includes(word));
      })
      .map(story => ([ story.title, story.url ]));

    const maxTitleUrl = Math.max(...filteredStories.map(story => story[0].length));
    const maxLengthUrl = Math.max(...filteredStories.map(story => story[1].length));

    spinner.stop();

    if (filteredStories.length) {
      const table = new Table({
        head: [ 'Title', 'Url' ],
        colWidths: [ maxTitleUrl + 3, maxLengthUrl + 3 ],
        style: {
          head: ['green']
        }
      });

      table.push(...filteredStories);

      console.log(HEADER);
      console.log(table.toString());
    } else {
      console.log(chalk.green.bold(`No stories found ${emoji.get('disappointed')}`))
    }

  } catch (error) {
    console.log(error.message);
  }

};