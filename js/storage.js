var PREFIX = location.href.replace(/[?#].*$/, '').replace(/\/index.html$/i, '/');
var cache = {};

function getKey(key) {
  return PREFIX + '?' + key;
}

exports.set = function(key, value) {
  key = getKey(key);
  cache[key] = value;
  try {
    localStorage[key] = value;
  } catch(e) {}
}

exports.get = function(key) {
  key = getKey(key);
  try {
    return cache[key] || localStorage[key];
  } catch(e) {}
  return cache[key];
};
