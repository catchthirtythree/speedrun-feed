var _ = require('lodash')

var io = require('socket.io-client')
var socket = io.connect('http://localhost:2000/feed')

var game = 'pd0w5n31'

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
  })