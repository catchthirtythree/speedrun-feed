
var _ = require('lodash');
var dt = require('date-and-time');
var request = require('sync-request');

var SRC = require('./speedrun.com/api');
var Discord = require('./discord.gg/webhook');

var config = require('./config');

var query = {
  game: config.game.id,
  status: "verified",
  orderby: "verify-date",
  direction: "desc"
};

var lastDate = new Date();

var monitor = () => {
  var response = SRC.Runs.get(query);

  // TODO: Be able to handle multiple responses (ie: multiple games)
  handleResponse(response)
    .then(runs => {
      // runs
      //   .filter(run => {
      //     var verify = run.status['verify-date'];
      //     var date = new Date(verify);
      //     return date < lastDate;
      //   })
      //   .forEach(processRun);

      processRun(runs[0]);
    })
    .catch(error => {
      if (error.body) {
        console.log(error.getBody('utf-8'));
      } else {
        console.log(error);
      }
    });
};

function handleResponse(response) {
  return new Promise((resolve, reject) => {
    if (response.statusCode === 200) {
      var body = response.getBody('utf-8');
      var json = JSON.parse(body);
      var runs = json.data;
      return resolve(runs);
    }

    return reject(response);
  });
}

function processRun(run) {
  var name = getPlayerNames(run.players);
  var url = run.weblink;
  var category = getCategoryName(run.category);
  var rank = getRankFromCategory(run.category, run.id);
  // TODO: Support for multiple times (RTA and IGT)
  var time = getFormattedTime(run.times[config.game.time.type]);
  var comment = run.comment;
  // TODO: Clean this up somehow.
  var videos = (run.videos || { links: [] }).links.map(link => link.uri).join(', ');

  var json = getFormattedJson({
    url,
    name,
    fields: {
      category, rank, time, comment, videos
    }
  });

  Discord.post(config.webhook.url, json);

  // TODO: Make lastDate less...global.
  lastDate = new Date(run.status['verify-date']);
}

function getPlayerNames(players) {
  // Players comes back as an array, we need to handle it appropriately.
  return players
    .map(player => SRC.Users.get(player.id))
    .filter(response => response.statusCode === 200)
    .map(response => response.getBody('utf-8'))
    .map(JSON.parse)
    .map(json => json.data.names.international)
    .join(' and ');
}

// TODO: Look into a way to either get Level names amd/or omit level runs completely.
function getCategoryName(categoryId) {
  var response = SRC.Categories.get(categoryId);

  if (response.statusCode === 200) {
    var body = response.getBody('utf-8');
    var json = JSON.parse(body);
    var category = json.data;
    if (category.type === 'per-level') {
      return `Level - ${category.name}`;
    }

    return category.name;
  }

  return undefined;
}

function getRankFromCategory(categoryId, runId) {
  var response = SRC.Categories.records.get(categoryId, { top: 1000 });

  if (response.statusCode === 200) {
    var body = response.getBody('utf-8');
    var json = JSON.parse(body);
    var runs = json.data[0].runs;
    var run = _.find(runs, run => {
      return run.run.id === runId;
    });

    return (run || { place: "N/A" }).place;
  }

  return undefined;
}

function getFormattedTime(time) {
  var milliseconds = time * 1000;
  var date = new Date(Date.UTC(2016, 03, 30, 0, 0, 0));
  date.setMilliseconds(milliseconds);
  return dt.format(date, config.game.time.format, true);
}

function getFormattedJson(json) {
  var title = config.webhook.title(json.name);
  var url = json.url;
  var fields = Object.keys(json.fields).map(key => {
    return {
      name: _.startCase(key),
      value: json.fields[key]
    }
  });

  return {
    embeds: [{
      color: config.webhook.color,
      title,
      url,
      type: config.webhook.type,
      fields
    }]
  };
}

var timer = setInterval(monitor, 30000);