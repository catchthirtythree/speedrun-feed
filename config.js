
var game = {
  id: 'nd24lq10',
  fields: [
    'name',
    'url',
    'category',
    'rank',
    'time',
    'comment',
    'videos'
  ],
  options: {
    time: {
      type: 'primary_t', // 'realtime', 'realtime_noloads_t', 'ingame_t'
      format: 'mm:ss.SSS' // HH:mm:ss.SSS
    },
  }
};

var webhook = {
  color: '16777215',
  title: ((title) => `${title} posted a new time on the leaderboards! Click here to see it.`),
  type: 'link',
  url: 'https://discordapp.com/api/webhooks/286673585894981632/8ZhfK1EuB5XqClMlWbH-LHGbHvMkwZJNypElumZkBw7xc4uuTniG4XbWpOmZ_Jmess4q'
};

module.exports = { game, webhook }