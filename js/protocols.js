var events = require('./events');
var PROTOCOLS = ['host', 'rule', 'rulesFile', 'weinre', 'log', 'proxy',
                 'socks', 'pac', 'filter', 'ignore', 'enable', 'disable', 'delete', 
                 'plugin', 'dispatch', 'urlParams', 'urlReplace', 'method', 'statusCode', 
                 'replaceStatus', 'hostname', 'referer', 'accept', 'auth', 'etag', 'ua',
                  'cache', 'redirect', 'location', 'attachment', 'params', 'html', 'css', 
                 'js', 'req', 'res', 'reqDelay', 'resDelay', 'reqSpeed', 'resSpeed', 
                 'reqHeaders', 'resHeaders', 'reqType', 'resType', 'reqCharset', 'resCharset', 
                 'reqCookies', 'resCookies', 'reqCors', 'resCors', 'reqPrepend', 'resPrepend',
                  'reqBody', 'resBody', 'reqAppend', 'resAppend', 'reqReplace', 'resReplace',
                  'reqWrite',  'resWrite', 'reqWriteRaw', 'resWriteRaw', 'exportsUrl', 'exports'];

var rules = ['file', 'xfile', 'tpl', 'xtpl', 'rawfile', 'xrawfile',
  'host', 'https2http-proxy', 'http2https-proxy'].concat(PROTOCOLS.slice(2));
var allRules = rules.slice();
var callbacks = [];

exports.setPlugins = function(pluginsState) {
  var pluginsOptions = pluginsState.pluginsOptions;
  var disabledPlugins = pluginsState.disabledPlugins;
  allRules = rules.slice();
  if (!pluginsState.disabledAllPlugins) {
    pluginsOptions.forEach(function(plugin) {
      var name = plugin.name;
      if (!disabledPlugins[name]) {
        allRules.push(name, 'whistle.' + name, 'plugin.' + name);
      }
    });
  }
  events.trigger('updatePlugins');
};

exports.PROTOCOLS = PROTOCOLS;

function getAllRules() {
  return allRules;
}

exports.getAllRules = getAllRules;


