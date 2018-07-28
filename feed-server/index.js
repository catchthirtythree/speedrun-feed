
var _ = require('lodash')

var config = require('./config')
var io = require('socket.io')(config.feed.port)
var feed = require('./feed')(io)

var SRC = require('./../speedrun.com/api')

var INTERVAL = 15000
var last_date = new Date()

var monitor = () => {
  var response = SRC.Runs.get(config.query)

  handle_response(response)
    .then(runs => {
      var new_runs = _.filter(runs, run => {
        var verify = run.status['verify-date']
        var date = new Date(verify)
        return date > last_date
      })

      console.log('runs:', new_runs.length, 'after', last_date)
      if (new_runs.length > 0) {
        last_date = new Date(_.head(runs).status['verify-date'])

        _.chain(new_runs)
          .orderBy(['stats.verify-date'], ['asc'])
          .value()
          .forEach(run => {
            // Emit to all subscribers listening to run.
            feed.emit('run', run)

            // Emit too all subscribers listening to game-run in a specific room.
            feed.to(run.game).emit('game-run', run)
          })
      }
    })
    .catch(error => {
      if (error.body) {
        console.log(error.getBody('utf-8'))
      } else {
        console.log(error)
      }
    })
}

function handle_response(response) {
  return new Promise((resolve, reject) => {
    if (response.statusCode === 200) {
      var body = response.getBody('utf-8')
      var json = JSON.parse(body)
      var runs = json.data
      return resolve(runs)
    }

    return reject(response)
  })
}

var timer = setInterval(monitor, INTERVAL)