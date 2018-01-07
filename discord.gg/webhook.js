
var request = require('sync-request');

function post(url, json) {
  var response = request('POST', url, { json });

  return new Promise((resolve, reject) => {
    if (response.statusCode == 200) {
      resolve(response);
    } else {
      reject(response.getBody('utf-8'));
    }
  })
}

module.exports = { post };