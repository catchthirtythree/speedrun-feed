# speedrun-feed

create a leaderboard feed for a game for discord (or whatever place you want to post to)

# use

create a config.js similar to this to make it work

```javascript
var game = {
  id: "nd24lq10", // game id
  time: {
    type: 'primary_t', // 'realtime', 'realtime_noloads_t', 'ingame_t'
    format: "mm:ss.SSS" // HH:mm:ss.SSS
  }
};

var webhook = {
  color: "16777215",
  title: ((title) => `${title} posted a new time on the leaderboards! Click here to see it.`),
  type: "link",
  url: "webhook rl goes here"
};

module.exports = { game, webhook }
```
