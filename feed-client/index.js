var _ = require('lodash')

var io = require('socket.io-client')
var socket = io.connect('http://localhost:2000/feed')

var Discord = require('./../discord.gg/webhook')

var game = 'pd0w5n31' // hidden_paws

socket
  .on('connect', () => {
    // Connect to game room.
    socket.emit('game', game)
  })
  // Listen for all runs.
  .on('run', run => {
    if (_.isEqual(run.game, game)) {
      console.log("This is the game I'm expecting (on the main feed)")
    }

    console.log(run.weblink)
  })
  // Listen only for game runs.
  .on('game-run', run => {
    console.log("This is the game I'm expecting (on the game feed)")
    console.log(run.weblink)

    // Do something with the run.
    process_run(run)
  })

var process_run = (run) => {
  // Get relevant information.
  var link = run.weblink
  var category = run.category
  /**
   * {
   *  videos: {
   *   links: [{
   *    uri: '<video url>'
   *   }]
   *  }
   * }
   */
  var video = _.isEmpty(run.videos) ? "" : _.head(run.videos.links).uri
  var comment = run.comment
  /**
   * {
   *  players: [{
   *   rel: 'user',
   *   id: '134124124',
   *   uri: '<api uri to user>'
   *  }]
   * }
   */
  var player = _.head(run.players).id
  /**
   * times: {
   *  primary: "PT22.760S",
   *  primary_t: 22.76,
   *  realtime: null,
   *  realtime_t: 0,
   *  realtime_noloads: null,
   *  realtime_noloads_t: 0,
   *  ingame: "PT22.760S",
   *  ingame_t: 22.76
   * }
   */
  var time = run.times.primary_t

  // Turn into webhook json.
  var title = `${player} has posted a time to ${category} leaderboard. Click here to see it.`
  var url = link
  var fields = { category, time, comment, video }

  var embedded_fields = _.reduce(fields, (acc, value, key) => {
    var field = {
      name: _.startCase(key),
      value: (value || '').toString()
    }

    if (!_.isEmpty(field.value)) {
      acc.push(field)
    }

    return acc
  }, [])

  // Post run to discord.
  post_run(title, url, embedded_fields)
}

var post_run = (title, url, fields) => {
  var url = 'https://discordapp.com/api/webhooks/286673585894981632/8ZhfK1EuB5XqClMlWbH-LHGbHvMkwZJNypElumZkBw7xc4uuTniG4XbWpOmZ_Jmess4q'
  var json = {
    embeds: [{
      color: 16777215,
      title,
      url,
      type: 'link',
      fields
    }]
  }

  // Post to discord webhook.
  Discord.post(url, json)
    .then(response => console.log)
    .catch(error => console.log)
}