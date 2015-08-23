var $ = require('jquery');
var createCgi = require('./cgi');
var	MAX_COUNT = 1024;
var TIMEOUT = 10000;
var dataCallbacks = [];
var dataList = [];

var cgi = $.extend(createCgi({
	getData: '/cgi-bin/get-data',
	getInitaial: '/cgi-bin/init',
	getServerInfo: '/cgi-bin/server-info',
	getLog: '/cgi-bin/log/get',
	getRules: '/cgi-bin/rules/list'
}, {
	mode: 'ignore', 
	timeout: TIMEOUT,
	cache: false
}), createCgi({
	composer: '/cgi-bin/composer',
	removeValues: '/cgi-bin/values/remove',
	renameValues: '/cgi-bin/values/rename',
	setCurrentValues: '/cgi-bin/values/set-current',
	setValuesFontSize: '/cgi-bin/values/set-font-size',
	setValuesTheme: '/cgi-bin/values/set-theme',
	showValuesLineNumbers: '/cgi-bin/values/show-line-numbers',
	setValues: '/cgi-bin/values/add',
	setLog: '/cgi-bin/log/set',
	addRules: '/cgi-bin/rules/add',
	disableDefaultRules: '/cgi-bin/rules/disable-default',
	enableDefaultRules: '/cgi-bin/rules/enable-default',
	removeRules: '/cgi-bin/rules/remove',
	renameRules: '/cgi-bin/rules/rename',
	selectRules: '/cgi-bin/rules/select',
	setCurrentRules: '/cgi-bin/rules/set-current',
	setRulesFontSize: '/cgi-bin/rules/set-font-size',
	setRulesTheme: '/cgi-bin/rules/set-theme',
	showRulesLineNumbers: '/cgi-bin/rules/show-line-numbers',
	unselectRules: '/cgi-bin/rules/unselect'
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




