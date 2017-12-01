var events = require('./events');
var PROTOCOLS = ['host', 'rule', 'rulesFile', 'weinre', 'log', 'proxy',
                 'socks', 'pac', 'filter', 'ignore', 'enable', 'disable', 'delete', 
                 'plugin', 'dispatch', 'urlParams', 'urlReplace', 'method', 'statusCode', 
                 'replaceStatus', 'hostname', 'referer', 'accept', 'auth', 'etag', 'ua',
                  'cache', 'redirect', 'location', 'attachment', 'forwardedFor', 'params', 
                  'html', 'css', 'js', 'reqDelay', 'resDelay', 'reqSpeed', 'resSpeed', 
                 'reqHeaders', 'resHeaders', 'reqType', 'resType', 'reqCharset', 'resCharset', 
                 'reqCookies', 'resCookies', 'reqCors', 'resCors', 'reqPrepend', 'resPrepend',
                  'reqBody', 'resBody', 'reqAppend', 'resAppend', 'reqReplace', 'resReplace',
                  'req', 'res', 'reqWrite',  'resWrite', 'reqWriteRaw', 'resWriteRaw', 'exportsUrl', 'exports'];

var innerRules = ['file', 'xfile', 'tpl', 'xtpl', 'rawfile', 'xrawfile'];
var pluginRules = [];
var forwardRules = innerRules.slice();
var allInnerRules = PROTOCOLS.slice(0, 1).concat(innerRules).concat(PROTOCOLS.slice(2));
var allRules = allInnerRules = allInnerRules.map(function(name) {
  return name + '://';
});

exports.setPlugins = function(pluginsState) {
  var pluginsOptions = pluginsState.pluginsOptions;
  var disabledPlugins = pluginsState.disabledPlugins;
  pluginRules = [];
  forwardRules = innerRules.slice();
  allRules = allInnerRules.slice();
  if (!pluginsState.disabledAllPlugins) {
    pluginsOptions.forEach(function(plugin) {
      var name = plugin.name;
      if (!disabledPlugins[name]) {
        forwardRules.push(name);
        pluginRules.push('whistle.' + name, 'plugin.' + name);
        name += '://';
        allRules.push(name, 'whistle.' + name, 'plugin.' + name);
      }
    });
  }
  events.trigger('updatePlugins');
};

exports.PROTOCOLS = PROTOCOLS;

exports.getForwardRules = function() {
  return forwardRules;
};

exports.getPluginRules = function() {
  return pluginRules;
};

exports.getAllRules = function() {
  return allRules;
};
