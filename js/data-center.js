var $ = require('jquery');
var createCgi = require('./cgi');
var util = require('./util');
var NetworkModal = require('./network-modal');
var	MAX_COUNT = NetworkModal.MAX_COUNT;
var TIMEOUT = 10000;
var dataCallbacks = [];
var serverInfoCallbacks = [];
var logCallbacks = [];
var svrLogCallbacks = [];
var dataList = [];
var logList = [];
var svrLogList = [];
var networkModal = new NetworkModal(dataList);
var curServerInfo;
var initialData, startedLoad;
var lastPageLogTime = -2;
var lastSvrLogTime = -2;
var lastRowData;
var DEFAULT_CONF = {
		timeout: TIMEOUT,
		xhrFields: {
			withCredentials: true
		}
};
var POST_CONF = $.extend({type: 'post'}, DEFAULT_CONF);
var GET_CONF = $.extend({cache: false}, DEFAULT_CONF);
var cgi = createCgi({
	getLog: '/cgi-bin/log/get',
	getData: '/cgi-bin/get-data',
	getServerInfo: '/cgi-bin/server-info',
	getInitaial: '/cgi-bin/init'
}, GET_CONF);

if (/_lastPageLogTime=([^;]+)/.test(document.cookie)) {
	lastPageLogTime = RegExp.$1;
}

if (/_lastSvrLogTime=([^;]+)/.test(document.cookie)) {
	lastSvrLogTime = RegExp.$1;
}

exports.values = createCgi({
	get: {
		type: 'get',
		url: '/cgi-bin/values/list'
	},
	add: '/cgi-bin/values/add',
	remove: '/cgi-bin/values/remove',
	rename: '/cgi-bin/values/rename',
	setCurrent: '/cgi-bin/values/set-current',
	setFontSize: '/cgi-bin/values/set-font-size',
	setTheme: '/cgi-bin/values/set-theme',
	showLineNumbers: '/cgi-bin/values/show-line-numbers',
	moveUp: '/cgi-bin/values/move-up',
	moveDown: '/cgi-bin/values/move-down'
}, POST_CONF);

exports.plugins = createCgi({
	disablePlugin: '/cgi-bin/plugins/disable-plugin',
	disableAllPlugins: '/cgi-bin/plugins/disable-all-plugins',
	getPlugins: {
		type: 'get',
		url: '/cgi-bin/plugins/get-plugins'
	}
}, POST_CONF);

exports.rules = createCgi({
	disableAllRules: '/cgi-bin/rules/disable-all-rules',
	get: {
		type: 'get',
		get: '/cgi-bin/rules/list'
	},
	add: '/cgi-bin/rules/add',
	disableDefault: '/cgi-bin/rules/disable-default',
	enableDefault: '/cgi-bin/rules/enable-default',
	remove: '/cgi-bin/rules/remove',
	rename: '/cgi-bin/rules/rename',
	select: '/cgi-bin/rules/select',
	setCurrent: '/cgi-bin/rules/set-current',
	setFontSize: '/cgi-bin/rules/set-font-size',
	setTheme: '/cgi-bin/rules/set-theme',
	showLineNumbers: '/cgi-bin/rules/show-line-numbers',
	unselect: '/cgi-bin/rules/unselect',
	allowMultipleChoice: '/cgi-bin/rules/allow-multiple-choice',
	syncWithSysHosts: '/cgi-bin/rules/sync-with-sys-hosts',
	setSysHosts: '/cgi-bin/rules/set-sys-hosts',
	getSysHosts: '/cgi-bin/rules/get-sys-hosts',
	moveUp: '/cgi-bin/rules/move-up',
	moveDown: '/cgi-bin/rules/move-down'
}, POST_CONF);

exports.log = createCgi({
	set: '/cgi-bin/log/set'
}, POST_CONF);

$.extend(exports, createCgi({
	composer: '/cgi-bin/composer',
	setFilter: '/cgi-bin/set-filter',
	interceptHttpsConnects: '/cgi-bin/intercept-https-connects',
	hideHttpsConnects: '/cgi-bin/hide-https-connects',
	donotShowAgain: '/cgi-bin/do-not-show-again',
	checkUpdate: '/cgi-bin/check-update'
}, POST_CONF));

exports.getInitialData = function(callback) {
	if (!initialData) {
		initialData = $.Deferred();
		function load() {
			cgi.getInitaial(function(data) {
				data ? initialData.resolve(data) : setTimeout(load, 1000);
			});
		}
		load();
	}
	
	initialData.done(callback);
};

function startLoadData() {
	if (startedLoad) {
		return;
	}
	startedLoad = true;
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
		cgi.getData({
			startLogTime: startLogTime,
			startSvrLogTime: startSvrLogTime,
			ids: pendingIds.join(),
			startTime: startTime,
			count: 60
		}, function(data) {
			setTimeout(load, 900);
			if (!data || data.ec !== 0) {
				return;
			}
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
				
				$.each(logCallbacks, function() {
					this(logList, svrLogList);
				});
			}
			
			data = data.data;
			if (!data.ids.length && !data.newIds.length) {
				return;
			}
			var ids = data.newIds;
			var data = data.data;
			$.each(dataList, function(i) {
				var item = this;
				var newItem = data[item.id];
				if (newItem) {
					$.extend(dataList[i], newItem);
				} else {
					item.lost = true;
				}
			});
			
			$.each(ids, function() {
				var item = data[this];
				item && dataList.push(item);
			});
			lastRowData = dataList[dataList.length - 1];
			$.each(dataCallbacks, function() {
				this(networkModal);
			});
		});
	}
	load();
}

function getPendingIds() {
	var pendingIds = [];
	$.each(dataList, function() {
		var item = this;
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
	
	return (!lastRowData || util.compareReqId(item.id, lastRowData.id)) ? item.id : lastRowData.id;
}

function startLoadServerInfo() {
	if (serverInfoCallbacks.length) {
		return;
	}
	
	function load() {
		cgi.getServerInfo(function(data) {
			setTimeout(load, 6000);
			if (data == curServerInfo) {
				return;
			}
			if (!(data = data && data.server)) {
				curServerInfo = data;
				$.each(serverInfoCallbacks, function() {
					this(false);
				});
				return;
			}
			
			if (curServerInfo && curServerInfo.version == data.version && 
				curServerInfo.port == data.port && curServerInfo.host == data.host && 
				curServerInfo.ipv4.sort().join() == data.ipv4.sort().join()
				&& curServerInfo.ipv6.sort().join() == data.ipv6.sort().join()) {
				return;
			}
			curServerInfo = data;
			$.each(serverInfoCallbacks, function() {
				this(data);
			});
		});
	}
	
	load();
}

exports.on = function(type, callback) {
	if (type == 'data') {
		if (typeof callback == 'function') {
			dataCallbacks.push(callback);
			startLoadData();
			callback(networkModal);
		}
	} else if (type == 'serverInfo') {
		if (typeof callback == 'function') {
			startLoadServerInfo();
			serverInfoCallbacks.push(callback);
		}
	} else if (type == 'log') {
		if (typeof callback == 'function') {
			logCallbacks.push(callback);
			startLoadData();
			callback(logList, svrLogList);
		}
	}
};

exports.checkExists = function(options, callback) {
	if (typeof callback != 'function') {
		return;
	}
	
	$.ajax({
		url: 'http://' + options.ip + ':' + options.port + '/cgi-bin/server-info?_=' + Date.now(),
		xhrFields: {
			withCredentials: true
		},
		timeout: 3000,
		dataType: 'json',
		success: function(data) {
			callback(!!data && data.ec === 0 && !!data.server);
		},
		error: function() {
			callback(false);
		}
	});
};

