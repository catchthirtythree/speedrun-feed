
var request = require('sync-request')

function post(url, json) {
  var response = request('POST', url, { json })

  return new Promise((resolve, reject) => {
    if (response.statusCode === 200 || response.statusCode === 204) {
      return resolve(response)
    } else {
      console.log(response.body.toString())
      console.log(response.body.toJSON())
      return reject(response)
    }
  })
}

module.exports = { post }