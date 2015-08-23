var $ = require('jquery');
var createCgi = require('./cgi');
var	MAX_COUNT = 1024;
var TIMEOUT = 10000;
var dataCallbacks = [];
var serverInfoCallbacks = [];
var dataList = [];
var curServerInfo;

var cgi = createCgi({
	getData: '/cgi-bin/get-data',
	getServerInfo: '/cgi-bin/server-info'
}, {
	mode: 'ignore', 
	timeout: TIMEOUT,
	xhrFields: {
		withCredentials: true
	},
	cache: false
});

exports.values = createCgi({
	remove: '/cgi-bin/values/remove',
	rename: '/cgi-bin/values/rename',
	setCurrent: '/cgi-bin/values/set-current',
	setFontSize: '/cgi-bin/values/set-font-size',
	setTheme: '/cgi-bin/values/set-theme',
	showLineNumbers: '/cgi-bin/values/show-line-numbers',
	set: '/cgi-bin/values/add'
}, {
	mode: 'ignore', 
	type: 'post', 
	xhrFields: {
		withCredentials: true
	},
	timeout: TIMEOUT
});

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
}, {
	mode: 'ignore', 
	type: 'post', 
	xhrFields: {
		withCredentials: true
	},
	timeout: TIMEOUT
});

exports.log = createCgi({
	get: '/cgi-bin/log/get',
	set: {
		type: 'post',
		url: '/cgi-bin/log/set'
	}
}, {
	mode: 'ignore', 
	timeout: TIMEOUT,
	xhrFields: {
		withCredentials: true
	},
	cache: false
});

$.extend(exports, createCgi({
	composer: {
		url: '/cgi-bin/composer',
		mode: 'ignore', 
		type: 'post', 
		timeout: TIMEOUT
	},
	getInitaial: '/cgi-bin/init'
}, {
	xhrFields: {
		withCredentials: true
	},
}));

function startLadData() {
	if (dataList.length) {
		return;
	}
	
	function load() {
		var pendingIds = getPendingIds();
		var startTime = getStartTime();
		if (startTime == -1 && !pendingIds.length) {
			return setTimeout(load, 3000);
		}
		
		cgi.getData({
			ids: pendingIds.join(),
			startTime: startTime,
			count: 60
		}, function(data) {
			setTimeout(load, 600);
			if (!data || (!data.ids.length && !data.newIds.length)) {
				return;
			}
			var ids = data.ids;
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
				this(dataList);
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
			pendingIds.push(id);
		}
	});
	return pendingIds;
}

function getStartTime() {
	var len = dataList.length;
	return len < MAX_COUNT ? dataList[len - 1] : -1;
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
			
			if (curServerInfo && curServerInfo.port == data.port && curServerInfo.host == data.host && 
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
			startLadData();
			dataCallbacks.push(callback);
		}
	} else if (type == 'serverInfo') {
		if (typeof callback == 'function') {
			startLoadServerInfo();
			serverInfoCallbacks.push(callback);
		}
	}
};


exports.on('serverInfo', function(data) {
	console.log(data)
})

