var MAX_FRAMES_LENGTH = require('./data-center').MAX_FRAMES_LENGTH;

var filterItem = function(keyword, item) {
	var text = item.text || item.bin;
	if (!keyword) {
		return true;
	}
	console.log(keyword)
	return text.indexOf(keyword) !== -1;
}

function FramesModal(list) {
	this.list = [];
}

var proto = FramesModal.prototype;

proto.search = function(keyword) {
	keyword = typeof keyword !== 'string' ? '' : keyword.trim();
	if (keyword) {
		var k = this._keyword = {};
		var i = 0;
		keyword.split(/\s+/g).forEach(function(key) {
			if (/^(c|s):([^\s]*)$/i.test(keyword)) {
				k[RegExp.$1.toLowerCase()] = RegExp.$2;
			} else {
				k['k' + i++] = key; 
			}
		});
	} else {
		this._keyword = '';
	}
	this.filter();
};

proto.filter = function(newList) {
	var keyword = this._keyword;
	var list = this.list;
	if (!keyword) {
		list.forEach(function(item) {
			item.hide = false;
		});
		return;
	}
	list.forEach(function(item) {
		if (!filterItem(keyword.k1, item) || !filterItem(keyword.k2, item)
			|| !filterItem(keyword.k3, item)) {
			item.hide = true;
			return;
		}
		if (!filterItem(keyword.c, item) && filterItem(keyword.s, item)) {
			item.hide = true;
			return;
		}
		item.hide = false;
	});
}

proto.setActive = function(item, active) {
	this.list.forEach(function(item) {
		item.active = false;
	});
	item.active = active !== false;
};

proto.getActive = function() {
	var list = this.list;
	for (var i = 0, len = list.length; i < len; i++) {
		var item = list[i];
		if (item.active) {
			return item;
		}
	}
};

proto.getList = function() {
	return this.list;
};

proto.update = function() {
	var len = this.list.length - MAX_FRAMES_LENGTH;
	if (len > 0) {
		this.list.splice(0, len);
	}
};

proto.clear = function() {
	this.list.splice(0, this.list.length);
	return this;
};

proto.reset = function(list) {
	if (!list || this.list === list) {
		return;
	}
	var len = this.list.length - 20;
	if (len > 0) {
		this.list.splice(0, len);
	}
	this.list = list || [];
	this.filter();
};

module.exports = FramesModal;

