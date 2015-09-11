var MAX_LENGTH = 360;
var MAX_COUNT = 2560;//不能超过MAX_LENGTH * 2，否则order衔接会有问题

function NetworkModal(list) {
	this._list = updateOrder(list);
	this.list =list.slice(0, MAX_LENGTH);
}

NetworkModal.MAX_COUNT = MAX_COUNT;

var proto = NetworkModal.prototype;

/**
 * 默认根据url过滤
 * url[u]:根据url过滤
 * content[c]: 根据content过滤
 * headers[h]: 根据headers过滤
 * ip[i]: 根据ip过滤
 * status[result]: 根据status过滤
 * method[m]: 根据method过滤
 */
proto.search = function(keyword) {
	this._type = 'url';
	this._keyword = typeof keyword != 'string' ? '' : keyword.trim();
	if (this._keyword && /^(url|u|content|c|headers|h|ip|i|status|result|s|r|method|m):(.*)$/.test(keyword)) {
		this._type = RegExp.$1;
		this._keyword = RegExp.$2.trim();
	}
	this.filter();
	return !!this._keyword;
};

proto.hasKeyword = function() {
	return !!this._keyword;
}

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
		case 'method':
		case 'm':
			keyword = keyword.toUpperCase();
			list.forEach(function(item) {
				item.hide = (item.req.method || '').indexOf(keyword) == -1;
			});
			break;
		default:
			keyword = keyword.toLowerCase();
			list.forEach(function(item) {
				item.hide = item.url.toLowerCase().indexOf(keyword) == -1;
			});
	}
	return list;
}

function inObject(obj, keyword) {
	for (var i in obj) {
		if (i.indexOf(keyword) != -1) {
			return true;
		}
		var value = obj[i];
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

proto.prev = function() {
	var list = this.list;
	var len = list.length;
	if (!len) {
		return;
	}
	var activeItem = this.getActive();
	var index = activeItem ? list.indexOf(activeItem) : len - 1;
	for (var i = index - 1; i >= 0; i--) {
		var item = list[i];
		if (!item.hide) {
			return item;
		}
	}
	
	for (var i = len - 1; i > index; i--) {
		var item = list[i];
		if (!item.hide) {
			return item;
		}
	}
};

proto.next = function() {
	var list = this.list;
	var len = list.length;
	if (!len) {
		return;
	}
	var activeItem = this.getActive();
	var index = activeItem ? list.indexOf(activeItem) : 0;
	for (var i = index + 1; i < len; i++) {
		var item = list[i];
		if (!item.hide) {
			return item;
		}
	}
	
	for (var i = 0; i < index; i++) {
		var item = list[i];
		if (!item.hide) {
			return item;
		}
	}
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
	
	return this.getActive();
};

proto.getActive = function() {
	var list = this.list;
	for (var i = 0, len = list.length; i < len; i++) {
		var item = list[i];
		if (item.active) {
			return item;
		}
	}
	
	return this.getSelectedList()[0];
};

proto.setSelected = function(item, selected) {
	item.selected = selected !== false;
};

proto.getSelectedList = function() {
	
	return this.list.filter(function(item) {
		return !item.hide && item.selected;
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

proto.getChangedList = function() {
	var list = [];
	this.list.forEach(function(item) {
		if (item.changed) {
			list.push(item);
		}
	});
	
	return list;
};

proto.clearSelection = function() {
	this.list.forEach(function(item) {
		item.selected = false;
	});
};

proto.clearActive = function() {
	this.list.forEach(function(item) {
		item.active = false;
	});
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

