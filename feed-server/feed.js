var feed = (io) => io
  .of('/feed')
  .on('connection', socket => {
    socket.on('game', game => {
      var pattern = new RegExp(/[0-9a-z]+/)
      if (pattern.test(game)) {
        socket.join(game)
      }
    })
  })

module.exports = feed