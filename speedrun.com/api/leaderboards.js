
var request = require('sync-request');
var utils = require('./utils');

const base = "http://speedrun.com/api/v1";

const Leaderboards = (() => {
  const resource = "/leaderboards";
  return Object.assign({
    get: (game, category, options) => {
      try {
        return request('GET', `${base}${resource}/${game}/category/${category}`, options);
      } catch (e) {
        return e;
      }
    }
  });
})();

module.exports = Leaderboards;