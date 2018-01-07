
function buildQueryParameters(obj) {
  return "?" + Object.keys(obj).map(key => `${key}=${obj[key]}`).join('&');
}

module.exports = { buildQueryParameters }