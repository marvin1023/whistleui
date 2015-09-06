var MAX_LENGTH = 360;
var MAX_COUNT = 2560;//不能超过MAX_LENGTH * 2，否则order衔接会有问题

function NetworkModal(list) {
	this._list = updateOrder(list);
	this.list =list.slice(0, MAX_LENGTH);
}

NetworkModal.MAX_COUNT = MAX_COUNT;

var proto = NetworkModal.prototype;

/**
 * 默认搜索url
 * url[u]:搜索url
 * content[c]: 搜索请求或响应内容
 * headers[h]: 搜索头部内容
 * ip: 搜索ip
 * status[result]: 搜索响应状态码
 * protocol[p]: 搜索协议
 */
proto.search = function(keyword) {
	this._type = 'url';
	this._keyword = typeof keyword != 'string' ? '' : keyword.trim();
	if (this._keyword && /^(url|u|content|c|headers|h|ip|i|status|result|s|r|protocol|p):(.*)$/.test(keyword)) {
		this._type = RegExp.$1;
		this._keyword = RegExp.$2.trim();
	}
	this.filter();
};

proto.filter = function() {
	var keyword = this._keyword;
	var list = this.list;
	if (!keyword) {
		list.forEach(function(item) {
			item.hide = false;
		});
		return;
	}
	
	switch(this._type) {
		case 'c':
		case 'content':
			list.forEach(function(item) {
				var reqBody = item.req.body;
				var resBody = item.res.body;
				item.hide = (!reqBody || reqBody.indexOf(keyword) == -1) && 
				 			(!resBody || resBody.indexOf(keyword) == -1);
			});
			break;
		case 'headers':
		case 'h':
			list.forEach(function(item) {
				item.hide = !inObject(item.req.headers, keyword) 
							&& !inObject(item.res.headers, keyword);
			});
			break;
		case 'ip':
		case 'i':
			list.forEach(function(item) {
				var ip = item.req.ip || '';
				var host = item.res.ip || '';
				item.hide = ip.indexOf(keyword) == -1 
							&& host.indexOf(keyword) == -1;
			});
			break;
		case 'status':
		case 's':
		case 'result':
		case 'r':
			list.forEach(function(item) {
				item.hide = item.res.statusCode == null ? true : 
					(item.res.statusCode + '').indexOf(keyword) == -1;
			});
			break;
		default:
			list.forEach(function(item) {
				item.hide = item.url.indexOf(keyword) == -1;
			});
	}
	return list;
}

function inObject(obj, keyword) {
	for (var i in obj) {
		if (i.indexOf(keyword) != -1) {
			return true;
		}
		var value = headers[i];
		if (typeof value == 'string' 
				&& value.indexOf(keyword) != -1) {
			return true;
		}
	}
	
	return false;
}

proto.clear = function clear() {
	this._list.splice(0, this.list.length);
	this.update();
	return this;
};

proto.update = function(scrollAtBottom) {
	updateOrder(this._list);
	if (scrollAtBottom) {
		var exceed = this._list.length - MAX_LENGTH;
		if (exceed > 0) {
			this._list.splice(0, Math.min(exceed, MAX_LENGTH - 1));
		}
	}
	
	this.list = this._list.slice(0, MAX_LENGTH);
	this.filter();
	return this._list.length > MAX_LENGTH;
};

proto.getSelected = function() {
	
	return this.getSelectedList()[0];
};

proto.setSelected = function(item, selected) {
	item.selected = selected !== false;
};

proto.getSelectedList = function() {
	
	return this.list.filter(function(item) {
		return item.selected;
	});
};

proto.setSelectedList = function(startId, endId) {
	if (!startId || !endId) {
		return;
	}
	
	var selected, item;
	for (var i = 0, len = this.list.length; i < len; i++) {
		item = this.list[i];
		if (item.id == startId) {
			selected = !selected;
			item.selected = true;
		} else {
			item.selected = selected;
		}
		
		if (item.id == endId) {
			selected = !selected;
		}
	}
};

proto.clearSelection = function() {
	this.list.forEach(function(item) {
		item.selected = false;
	});
};

proto.hide = function(item) {
	item.hide = true;
};

proto.show = function(item) {
	item.hide = false;
};

function updateOrder(list) {
	var len = list.length;
	if (len && !list[len - 1].order) {
		var order = list[0].order || 1;
		list.forEach(function(item, i) {
			item.order = order + i;
		});
	}
	
	return list;
}

module.exports = NetworkModal;

