var cache = {};

exports.set = function(key, value) {
  cache[key] = value;
  try {
    localStorage[key] = value;
    delete cache[key];
  } catch(e) {}
}

exports.get = function(key) {
  cache[key] = value;
  try {
    return localStorage[key] || cache[key];
  } catch(e) {}
  return cache[key];
};
