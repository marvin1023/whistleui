var $ = require('jquery');
var createCgi = require('./cgi');
var util = require('./util');
var NetworkModal = require('./network-modal');
var storage = require('./storage');
var events = require('./events');

var MAX_FRAMES_LENGTH = exports.MAX_FRAMES_LENGTH = 100;
var MAX_COUNT = NetworkModal.MAX_COUNT;
var TIMEOUT = 20000;
var dataCallbacks = [];
var serverInfoCallbacks = [];
var framesUpdateCallbacks = [];
var logCallbacks = [];
var svrLogCallbacks = [];
var directCallbacks = [];
var dataList = [];
var logList = [];
var svrLogList = [];
var networkModal = new NetworkModal(dataList);
var curServerInfo;
var initialDataPromise, initialData, startedLoad;
var lastPageLogTime = -2;
var lastSvrLogTime = -2;
var dataIndex = 10000;
var MAX_URL_LENGTH = 1024 * 2;
var lastRowId;
var DEFAULT_CONF = {
	timeout: TIMEOUT,
	xhrFields: {
		withCredentials: true
	},
	data: {}
};

function setFilterText(settings) {
	settings = settings || {};
	storage.set('filterText', JSON.stringify({
		disabledFilterText: settings.disabledFilterText,
		filterText: settings.filterText
	}));
}
exports.setFilterText = setFilterText;

function getFilterText() {
	var settings = util.parseJSON(storage.get('filterText'));
	return settings ? {
		disabledFilterText: settings.disabledFilterText,
		filterText: settings.filterText
	} : {};
}
exports.getFilterText = getFilterText;

function hasFilterText() {
	var settings = getFilterText();
	if (!settings || settings.disabledFilterText) {
		return;
	}
	var filterText = settings.filterText;
	if (typeof filterText !== 'string') {
		return '';
	}
	filterText = filterText.trim();
	return filterText;
}

exports.hasFilterText = hasFilterText;

function setNetworkColumns(settings) {
	settings = settings || {};
	storage.set('networkColumns', JSON.stringify({
		disabledColumns: settings.disabledColumns,
		columns: settings.columns
	}));
}

exports.setNetworkColumns = setNetworkColumns;

function getNetworkColumns() {
	return util.parseJSON(storage.get('networkColumns')) || {};
}

exports.getNetworkColumns = getNetworkColumns;

var FILTER_TYPES_RE = /^(m|s|i|h|b):/;
var FILTER_TYPES = {
	m: 'method',
	s: 'statusCode',
	i: 'ip',
	h: 'headers',
	b: 'body'
};
function parseFilterText() {
	var filterText = hasFilterText();
	if (!filterText) {
		return;
	}
	filterText = filterText.split(/\r|\n/g);
	var result = {};
	filterText.forEach(function(line) {
		line = line.trim();
		if (FILTER_TYPES_RE.test(line)) {
			var name = FILTER_TYPES[RegExp.$1];
			line = line.substring(2);
			if (line) {
				result[name] = result[name] ? result[name] + '\n' + line : line;
			}
		} else if (line) {
			result.url = result.url ? result.url + '\n' + line : line;
		}
	});
	return result;
}

var POST_CONF = $.extend({
	type: 'post'
}, DEFAULT_CONF);
var GET_CONF = $.extend({
	cache: false
}, DEFAULT_CONF);
var cgi = createCgi({
	getLog: 'cgi-bin/log/get',
	getData: 'cgi-bin/get-data',
	getInitaial: 'cgi-bin/init'
}, GET_CONF);

if (/_lastPageLogTime=([^;]+)/.test(document.cookie)) {
	lastPageLogTime = RegExp.$1;
}

if (/_lastSvrLogTime=([^;]+)/.test(document.cookie)) {
	lastSvrLogTime = RegExp.$1;
}

function toLowerCase(str) {
	return String(str == null ? '' : str).trim().toLowerCase();
}

function decode(str) {
	try {
		return str && decodeURIComponent(str);
	} catch (e) {}
	return str;
}

function parseEnv(env) {
	if (!env || typeof env !== 'string') {
		return;
	}
	env = env.trim();
	if (!env) {
		return;
	}
	env = env.split(':');
	return {
		name: decode(env[0]),
		env: decode(env[1])
	};
}

exports.values = createCgi({
	moveTo: {
		mode: 'chain',
		url: 'cgi-bin/values/move-to'
	},
	list: {
		type: 'get',
		url: 'cgi-bin/values/list'
	},
	add: 'cgi-bin/values/add',
	remove: 'cgi-bin/values/remove',
	rename: 'cgi-bin/values/rename'
}, POST_CONF);

exports.plugins = createCgi({
	disablePlugin: 'cgi-bin/plugins/disable-plugin',
	disableAllPlugins: 'cgi-bin/plugins/disable-all-plugins',
	getPlugins: {
		type: 'get',
		url: 'cgi-bin/plugins/get-plugins'
	}
}, POST_CONF);

exports.rules = createCgi({
	disableAllRules: 'cgi-bin/rules/disable-all-rules',
	moveTo: {
		mode: 'chain',
		url: 'cgi-bin/rules/move-to'
	},
	list: {
		type: 'get',
		url: 'cgi-bin/rules/list'
	},
	add: 'cgi-bin/rules/add',
	disableDefault: 'cgi-bin/rules/disable-default',
	enableDefault: 'cgi-bin/rules/enable-default',
	remove: 'cgi-bin/rules/remove',
	rename: 'cgi-bin/rules/rename',
	select: 'cgi-bin/rules/select',
	unselect: 'cgi-bin/rules/unselect',
	allowMultipleChoice: 'cgi-bin/rules/allow-multiple-choice',
	syncWithSysHosts: 'cgi-bin/rules/sync-with-sys-hosts',
	setSysHosts: 'cgi-bin/rules/set-sys-hosts',
	getSysHosts: 'cgi-bin/rules/get-sys-hosts'
}, POST_CONF);

exports.log = createCgi({
	set: 'cgi-bin/log/set'
}, POST_CONF);

$.extend(exports, createCgi({
	composer: 'cgi-bin/composer',
	interceptHttpsConnects: 'cgi-bin/intercept-https-connects',
	hideHttpsConnects: 'cgi-bin/hide-https-connects',
	donotShowAgain: 'cgi-bin/do-not-show-again',
	checkUpdate: 'cgi-bin/check-update'
}, POST_CONF));

exports.socket = $.extend(createCgi({
	upload: 'cgi-bin/socket/upload'
}, $.extend({
	type: 'post'
}, DEFAULT_CONF, {
	contentType: false,
	processData: false,
	timeout: 36000
})), createCgi({
	send: 'cgi-bin/socket/data'
}, POST_CONF));

exports.getInitialData = function (callback) {
	if (!initialDataPromise) {
		initialDataPromise = $.Deferred();

		function load() {
			cgi.getInitaial(function (data) {
				if (data) {
					initialData = data;
					DEFAULT_CONF.data.clientId = data.clientId;
					exports.upload = createCgi({
						importSessions: 'cgi-bin/sessions/import?clientId=' + data.clientId,
						importRules: 'cgi-bin/rules/import?clientId=' + data.clientId,
						importValues: 'cgi-bin/values/import?clientId=' + data.clientId
					}, $.extend({
						type: 'post'
					}, DEFAULT_CONF, {
						contentType: false,
						processData: false,
						timeout: 36000
					}));
					initialDataPromise.resolve(data)
				} else {
					setTimeout(load, 1000);
				}
			});
		}
		load();
	}

	initialDataPromise.done(callback);
};

function checkFiled(keyword, text) {
	if (!keyword) {
		return true;
	}
	if (!text) {
		return false;
	}
	keyword = toLowerCase(keyword);
	keyword = keyword.split(/\n/g);
	text = toLowerCase(text);
	var check = function(kw) {
		if (!kw) {
			return false;
		}
		kw = kw.split(/\s+/g);
		return checkKeyword(text, kw[0]) && checkKeyword(text, kw[1]) && checkKeyword(text, kw[2]);
	};

	return check(keyword[0]) || check(keyword[1]) || check(keyword[2]);
}

function checkKeyword(text, kw) {
	if (!kw || kw === '!') {
		return true;
	}
	var not;
	if (kw[0] === '!') {
		not = true;
		kw = kw.substring(1);
	}
	kw = text.indexOf(kw);
	return not ? kw === -1 : kw !== -1;
}

function joinString(str1, str2) {
	var result = [];
	if (str1 != null || str1) {
		result.push(str1);
	}
	if (str2 == null || str2) {
		result.push(str2);
	}
	return result.join('\n');
}

function filterData(obj, item) {
	if (!obj) {
		return true;
	}
	if (!checkFiled(obj.url, item.url)) {
		return false;
	}
	if (!checkFiled(obj.statusCode, item.res.statusCode)) {
		return false;
	}
	if (!checkFiled(obj.method, item.req.method)) {
		return false;
	}
	if (!checkFiled(obj.ip, joinString(item.req.ip, item.res.ip))) {
		return false;
	}
	if (!checkFiled(obj.body, joinString(item.req.body, item.res.body))) {
		return false;
	}

	if (!checkFiled(obj.headers, joinString(util.objectToString(item.req.headers),
		util.objectToString(item.res.headers)))) {
		return false;
	}
	return true;
}

function checkDataChanged(data, mclientName, mtimeName) {
	if (!data[mtimeName] || initialData.clientId === data[mclientName]) {
		return false;
	}
	
	var mclient = data[mclientName];
	var mtime = data[mtimeName];
	if (initialData[mclientName] === mclient && initialData[mtimeName] === mtime) {
		return false;
	}
	initialData[mclientName] = mclient;
	initialData[mtimeName] = mtime;
	return true;
}

function emitRulesChanged(data) {
	if (checkDataChanged(data, 'mrulesClientId', 'mrulesTime')) {
		events.trigger('rulesChanged');
	}
}

function emitValuesChanged(data) {
	if (checkDataChanged(data, 'mvaluesClientId', 'mvaluesTime')) {
		events.trigger('valuesChanged');
	}
}

function startLoadData() {
	if (startedLoad) {
		return;
	}
	startedLoad = true;
// TODO: remove
var index = 0;
	function load() {
		var pendingIds = getPendingIds();
		var startTime = getStartTime();
		var len = logList.length;
		var svrLen = svrLogList.length;
		var startLogTime = -1;
		var startSvrLogTime = -1;

		if (!len) {
			startLogTime = lastPageLogTime;
		} else if (len < 120) {
			startLogTime = logList[len - 1].id;
		}

		if (!svrLen) {
			startSvrLogTime = lastSvrLogTime;
		} else if (svrLen < 120) {
			startSvrLogTime = svrLogList[svrLen - 1].id;
		}

		lastPageLogTime = lastSvrLogTime = null;
		var curActiveItem = networkModal.getActive();
		var curFrames = curActiveItem && curActiveItem.frames;
		var lastFrameId, curReqId;
		if (curFrames) {
			var framesLen = curFrames.length - 1;
			if (framesLen < MAX_FRAMES_LENGTH) {
				curReqId = curActiveItem.id;
				lastFrameId = curFrames[framesLen] && curFrames[framesLen].id;
			}
		}
		cgi.getData({
			startLogTime: startLogTime,
			startSvrLogTime: startSvrLogTime,
			ids: pendingIds.join(),
			startTime: startTime,
			lastRowId: lastRowId,
			curReqId: curReqId,
			lastFrameId: lastFrameId,
			count: 60
		}, function (data) {
			setTimeout(load, 900);
			updateServerInfo(data);
			if (!data || data.ec !== 0) {
				return;
			}
			emitRulesChanged(data);
			emitValuesChanged(data);
			directCallbacks.forEach(function (cb) {
				cb(data);
			});
			var len = data.log.length;
			var svrLen = data.svrLog.length;
			if (len || svrLen) {
				if (len) {
					logList.push.apply(logList, data.log);
					document.cookie = '_lastPageLogTime=' + data.log[data.log.length - 1].id;
				}

				if (svrLen) {
					svrLogList.push.apply(svrLogList, data.svrLog);
					document.cookie = '_lastSvrLogTime=' + data.svrLog[data.svrLog.length - 1].id;
				}

				logCallbacks.forEach(function (cb) {
					cb(logList, svrLogList);
				});
			}

			data = data.data;
			// TODO: remove
			if (isSocket(curActiveItem)) {
				data.frames = [{
					isClient: ++index % 2 === 0,
					text: index % 2 === 0 ? index + ' sfsdddddddddddddddddddddd' : '',
					bin: index % 2 !== 0 ? index + ' a asfd asdf dsa fdsa ' : ''
				}];
			}
			var hasFrames = data.frames && data.frames.length;
			if (hasFrames) {
				curFrames.push.apply(curFrames, data.frames);
			}
			if (!data.ids.length && !data.newIds.length) {
				if (hasFrames) {
					framesUpdateCallbacks.forEach(function(cb) {
						cb();
					});
				}
				return;
			}
			var ids = data.newIds;
			var data = data.data;
			dataList.forEach(function (item) {
				var newItem = data[item.id];
				if (newItem) {
					$.extend(item, newItem);
					setReqData(item);
				} else {
					item.lost = true;
				}
			});

			if (ids.length) {
				var filterObj = parseFilterText();
				var lastRow;
				ids.forEach(function (id) {
					var item = data[id];
					if (item) {
						lastRow = item;
						if (filterData(filterObj, item)) {
							setReqData(item);
							dataList.push(item);
						}
					}
				});

				lastRow = lastRow || dataList[dataList.length - 1];
				if (lastRow && (!lastRowId || util.compareReqId(lastRow.id, lastRowId))) {
					lastRowId = lastRow.id;
				}
			}
			dataCallbacks.forEach(function (cb) {
				cb(networkModal);
			});
		});
	}
	load();
}

function setRawHeaders(obj) {
	var headers = obj.headers;
	var rawHeaderNames = obj.rawHeaderNames;
	if (!headers || !rawHeaderNames) {
		return;
	}
	var rawHeaders = {};
	Object.keys(headers).forEach(function (name) {
		if (name !== 'x-whistle-https-request' && name.indexOf('x-forwarded-from-whistle-') !== 0) {
			rawHeaders[rawHeaderNames[name] || name] = headers[name];
		}
	});
	obj.rawHeaders = rawHeaders;
}

function isSocket(item) {
	if (!item) {
		return false;
	}
	if (/^wss?:\/\//.test(item.url)) {
		return true;
	}
	return /^tunnel:\/\//.test(item.url) && item.req.headers['x-whistle-policy'] === 'tunnel';
}

function setReqData(item) {
	var url = item.url;
	item.method = item.req.method;
	var end = item.endTime;
	var defaultValue = end ? '' : '-';
	var res = item.res;
	item.hostIp = res.ip || defaultValue;
	item.clientIp = item.req.ip || '127.0.0.1';
	item.clientPort = item.req.port;
	item.serverPort = item.res.port;
	item.body = res.size == null ? defaultValue : res.size;
	var result = res.statusCode == null ? defaultValue : res.statusCode;
	item.result = /^[1-9]/.test(result) && parseInt(result, 10) || result;
	item.type = (res.headers && res.headers['content-type'] || defaultValue).split(';')[0].toLowerCase();
	item.dns = item.request = item.response = item.download = item.time = defaultValue;
	if (item.dnsTime > 0) {
		item.dns = item.dnsTime - item.startTime + 'ms';
		if (item.requestTime > 0) {
			item.request =  item.requestTime - item.dnsTime + 'ms';
			if (item.responseTime > 0) {
				item.response = item.responseTime - item.requestTime + 'ms';
				if (end > 0) {
					item.download = end - item.responseTime + 'ms';
					item.time = end - item.startTime + 'ms';
				}
			}
		}
	}
	setRawHeaders(item.req);
	setRawHeaders(res);
	if (url.length > MAX_URL_LENGTH) {
		item.shortUrl = url = url.substring(0, MAX_URL_LENGTH) + '...';
	}
	if (!item.path) {
		item.protocol = item.isHttps ? 'HTTP' : util.getProtocol(url);
		item.hostname = item.isHttps ? 'Tunnel to' : util.getHost(url);
		var pathIndex = url.indexOf('://');
		if (pathIndex !== -1) {
			pathIndex = url.indexOf('/', pathIndex + 3);
			item.path = pathIndex === -1 ? '/' : url.substring(pathIndex);
		} else {
			item.path = url;
		}
	}
	if (!item.frames && isSocket(item)) {
		item.frames = [];
	}
}

exports.addNetworkList = function (list) {
	if (!Array.isArray(list) || !list.length) {
		return;
	}
	var hasData;
	list.forEach(function (data) {
		if (!data || !(data.startTime >= 0) || !data.req ||
			!data.req.headers || !data.res) {
			return;
		}
		delete data.active;
		delete data.selected;
		delete data.hide;
		delete data.order;
		data.lost = true;
		data.id = data.startTime + '-' + ++dataIndex;
		setReqData(data);
		dataList.push(data);
		hasData = true;
	});
	if (hasData) {
		dataCallbacks.forEach(function (cb) {
			cb(networkModal);
		});
	}
};

function getPendingIds() {
	var pendingIds = [];
	dataList.forEach(function (item) {
		if (!item.endTime && !item.lost) {
			pendingIds.push(item.id);
		}
	});
	return pendingIds;
}

function getStartTime() {
	var len = dataList.length - 1;
	if (len > MAX_COUNT) {
		return -1;
	}
	var item = dataList[len];
	if (!item) {
		return '';
	}

	return (!lastRowId || util.compareReqId(item.id, lastRowId)) ? item.id : lastRowId;
}

function updateServerInfo(data) {
	if (!serverInfoCallbacks.length) {
		return;
	}

	if (!(data = data && data.server)) {
		curServerInfo = data;
		serverInfoCallbacks.forEach(function (cb) {
			cb(false);
		});
		return;
	}

	if (curServerInfo && curServerInfo.version == data.version &&
		curServerInfo.baseDir == data.baseDir && curServerInfo.username == data.username &&
		curServerInfo.port == data.port && curServerInfo.host == data.host &&
		curServerInfo.ipv4.sort().join() == data.ipv4.sort().join() &&
		curServerInfo.ipv6.sort().join() == data.ipv6.sort().join()) {
		return;
	}
	curServerInfo = data;
	serverInfoCallbacks.forEach(function (cb) {
		cb(data);
	});

}

exports.on = function (type, callback) {
	startLoadData();
	if (type == 'data') {
		if (typeof callback == 'function') {
			dataCallbacks.push(callback);
			callback(networkModal);
		}
	} else if (type == 'serverInfo') {
		if (typeof callback == 'function') {
			serverInfoCallbacks.push(callback);
		}
	} else if (type == 'log') {
		if (typeof callback == 'function') {
			logCallbacks.push(callback);
			callback(logList, svrLogList);
		}
	} else if (type === 'plugins' || type === 'settings' || type === 'rules') {
		if (typeof callback == 'function') {
			directCallbacks.push(callback);
		}
	} else if (type == 'framesUpdate') {
		if (typeof callback == 'function') {
			framesUpdateCallbacks.push(callback);
		}
	}
};
