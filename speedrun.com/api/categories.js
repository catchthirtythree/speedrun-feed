
var request = require('sync-request');
var utils = require('./utils');

const base = "http://speedrun.com/api/v1";

const Categories = (() => {
  const resource = "/categories";
  const records = "/records";
  return Object.assign({
    get: (id, query = {}, options) => {
      try {
        return request('GET', `${base}${resource}/${id}`, options);
      } catch (e) {
        return e;
      }
    },

    records: {
      get: (id, query = {}, options) => {
        try {
          return request('GET', `${base}${resource}/${id}${records}` + utils.buildQueryParameters(query), options);
        } catch (e) {
          return e;
        }
      }
    }
  });
})();

module.exports = Categories;