
var _ = require('lodash');

function build_query_parameters(obj) {
  if (_.isEmpty(obj)) {
    return "";
  }

  return "?" + Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');
}

module.exports = { build_query_parameters }