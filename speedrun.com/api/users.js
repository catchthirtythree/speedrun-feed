
var request = require('sync-request');
var utils = require('./utils');

const base = "http://speedrun.com/api/v1";

const Users = (() => {
  const resource = "/users";
  return Object.assign({
    get: (id, options) => {
      try {
        return request('GET', `${base}${resource}/${id}`, options);
      } catch (e) {
        return e;
      }
    }
  });
})();

module.exports = Users;