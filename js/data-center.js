var $ = require('jquery');
var createCgi = require('./cgi');
var	MAX_COUNT = 1024;
var TIMEOUT = 10000;
var dataCallbacks = [];
var dataList = [];

var values = createCgi({
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
	timeout: TIMEOUT
});

var rules = createCgi({
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
	timeout: TIMEOUT
});

var cgi = $.extend(createCgi({
	getData: '/cgi-bin/get-data',
	getInitaial: '/cgi-bin/init',
	getServerInfo: '/cgi-bin/server-info',
	getLog: '/cgi-bin/log/get',
}, {
	mode: 'ignore', 
	timeout: TIMEOUT,
	cache: false
}), createCgi({
	composer: '/cgi-bin/composer',
	setLog: '/cgi-bin/log/set'
}, {
	mode: 'ignore', 
	type: 'post', 
	timeout: TIMEOUT
}));

function startLadData() {
	if (dataList.length) {
		return;
	}
	
	var pendingIds = getPendingIds();
	var startTime = getStartTime();
	
	function _load() {
		cgi.getData({
			ids: pendingIds.join(),
			startTime: startTime,
			count: 60
		}, function(data) {
			setTimeout(_load, 600);
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
	
	if (startTime == -1 && !pendingIds.length) {
		setTimeout(_load, 3000);
	} else {
		_load();
	}
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

exports.on = function(type, callback) {
	if (type == 'data') {
		if (typeof callback == 'function') {
			startLadData();
			dataCallbacks.push(callback);
		}
		return;
	}
};




