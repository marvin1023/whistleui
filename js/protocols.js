var PROTOCOLS = ['host', 'rule', 'weinre', 'log', 'pac', 'filter', 'disable', 'delete', 
                 'plugin', 'dispatch', 'urlParams', 'urlReplace', 'method', 'statusCode', 
                 'replaceStatus', 'hostname', 'referer', 'accept', 'auth', 'etag', 'ua',
                  'cache', 'redirect', 'location', 'attachment', 'params', 'html', 'css', 
                 'js', 'req', 'res', 'reqDelay', 'resDelay', 'reqSpeed', 'resSpeed', 
                 'reqHeaders', 'resHeaders', 'reqType', 'resType', 'reqCharset', 'resCharset', 
                 'reqCookies', 'resCookies', 'reqCors', 'resCors', 'reqPrepend', 'resPrepend',
                  'reqBody', 'resBody', 'reqAppend', 'resAppend', 'reqReplace', 'resReplace',
                  'reqWrite',  'resWrite', 'reqWriteRaw', 'resWriteRaw', 'exportsUrl', 'exports'];

var rules = ['file', 'xfile', 'tpl', 'xtpl', 'rawfile', 'xrawfile', 'proxy', 'socks', 'host'].concat(PROTOCOLS.slice(2));
var allRules = rules.slice();
var callbacks = [];

exports.setPlugins = function(pluginsState) {
  var pluginsOptions = pluginsState.pluginsOptions;
  var disabledPlugins = pluginsState.disabledPlugins;
  allRules = rules.slice();
  pluginsOptions.forEach(function(plugin) {
    var name = plugin.name;
    if (!disabledPlugins[name]) {
      allRules.push(name, 'whistle.' + name);
    }
  });
  callbacks.forEach(function(cb) {
    cb(allRules);
  });
};

exports.onUpdate = function(callback) {
  callback && callbacks.push(callback);
};

exports.PROTOCOLS = PROTOCOLS;

function getAllRules() {
  return allRules;
}

exports.getAllRules = getAllRules;


