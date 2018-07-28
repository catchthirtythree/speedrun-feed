
var request = require('sync-request');
var utils = require('./utils');

const base = "http://speedrun.com/api/v1";

const Runs = (() => {
  const resource = "/runs";
  return Object.assign({
    get: (query, options) => {
      try {
        return request('GET', base + resource + utils.build_query_parameters(query), options);
      } catch (e) {
        return e;
      }
    }
  });
})();

module.exports = Runs;