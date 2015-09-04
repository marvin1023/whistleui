var $ = require('jquery');
var createCgi = require('./cgi');
var NetworkModal = require('./network-modal');
var	MAX_COUNT = NetworkModal.MAX_COUNT;
var TIMEOUT = 10000;
var dataCallbacks = [];
var serverInfoCallbacks = [];
var dataList = [];
var networkModal = new NetworkModal(dataList);
var curServerInfo;
var initialData;
var DEFAULT_CONF = {
		timeout: TIMEOUT,
		xhrFields: {
			withCredentials: true
		}
};
var POST_CONF = $.extend({type: 'post'}, DEFAULT_CONF);
var GET_CONF = $.extend({cache: false}, DEFAULT_CONF);
var cgi = createCgi({
	getData: '/cgi-bin/get-data',
	getServerInfo: '/cgi-bin/server-info',
	getInitaial: '/cgi-bin/init'
}, GET_CONF);

exports.values = createCgi({
	get: {
		type: 'get',
		get: '/cgi-bin/values/list'
	},
	add: '/cgi-bin/values/add',
	remove: '/cgi-bin/values/remove',
	rename: '/cgi-bin/values/rename',
	setCurrent: '/cgi-bin/values/set-current',
	setFontSize: '/cgi-bin/values/set-font-size',
	setTheme: '/cgi-bin/values/set-theme',
	showLineNumbers: '/cgi-bin/values/show-line-numbers'
}, POST_CONF);

exports.rules = createCgi({
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
	unselect: '/cgi-bin/rules/unselect'
}, POST_CONF);

exports.log = createCgi({
	get: '/cgi-bin/log/get',
	set: {
		type: 'post',
		url: '/cgi-bin/log/set'
	}
}, GET_CONF);

$.extend(exports, createCgi({
	composer: {
		url: '/cgi-bin/composer',
		type: 'post'
	}
}, GET_CONF));

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
	if (dataList.length) {
		return;
	}
	
	function load() {
		var pendingIds = getPendingIds();
		var startTime = getStartTime();
		
		cgi.getData({
			ids: pendingIds.join(),
			startTime: startTime,
			count: 60
		}, function(data) {
			setTimeout(load, 800);
			if (!data || (!data.ids.length && !data.newIds.length)) {
				return;
			}
			var ids = data.newIds;
			var data = data.data;
			$.each(dataList, function(i) {
				var item = this;
				var newItem = data[item.id];
				if (newItem) {
					dataList[i] = newItem;
				} else {
					item.lost = true;
				}
			});
			
			$.each(ids, function() {
				var item = data[this];
				item && dataList.push(item);
			});
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
	var item = dataList[len];
	return len <= MAX_COUNT ? (item ? item.id : '') : -1;
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
		}
	} else if (type == 'serverInfo') {
		if (typeof callback == 'function') {
			startLoadServerInfo();
			serverInfoCallbacks.push(callback);
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

