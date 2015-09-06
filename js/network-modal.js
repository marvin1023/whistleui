var MAX_LENGTH = 360;
var MAX_COUNT = 2560;//不能超过MAX_LENGTH * 2，否则order衔接会有问题

function NetworkModal(list) {
	this._list = updateOrder(list);
	this.list =list.slice(0, MAX_LENGTH);
}

NetworkModal.MAX_COUNT = MAX_COUNT;

var proto = NetworkModal.prototype;

proto.search = function(keywork) {
	
};

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

