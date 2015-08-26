var $ = require('jquery');
var util = require('./util');

function ListModal(list, data) {
	var self = this;
	self.list = Array.isArray(list) ? list : [];
	data = self.data || {};
	self.data = {};
	self.list.forEach(function(name) {
		var item = self.data = data[name] || {};
		item.key = item.key || util.getKey();
		item.name = name;
	});
}

var proto = ListModal.prototype;

proto.add = function(name, value) {
	if (!name || this.get(name)) {
		return false;
	}
	this.list.push(name);
	this.data[name] = {
		name: name,
		value: value
	};
};

proto.set = function(name, value) {
	var item = this.get(name);
	if (item) {
		item.value = value;
	}
};

proto.get = function(name) {
	
	return this.data[name];
};

proto.select = function(name) {
	var item = this.get(name);
	if (item) {
		this.clearSelection();
		item.selected = true;
	}
};

proto.unselect = function() {
	var item = this.get(name);
	if (item) {
		item.selected = false;
	}
};

proto.clearSelection = function() {
	for (var i in this.data) {
		this.data[i].selected = false;
	}
};

proto.getSelected = function() {
	for (var i in this.data) {
		var item = this.data[i];
		if (item.selected) {
			return item;
		}
	}
};

proto.enable = function(name) {
	var item = this.get(name);
	if (item) {
		item.disabled = false;
	}
};

proto.disable = function(name) {
	var item = this.get(name);
	if (item) {
		item.disabled = true;
	}
};

proto.getEnabled = function() {
	var enabled = [];
	for (var i in this.data) {
		var item = this.data[i];
		if (!item.disabled) {
			enabled.push(item);
		}
	}
	return enabled;
};

proto.remove = function(name) {
	var index = this.list.indexOf(name);
	if (index != -1) {
		this.list.splice(i, 1);
		delete this.data[name];
	}
};

proto.rename = function(name, newName) {
	if (!name || !newName || name == newName) {
		return;
	}
	
	var index = this.list.indexOf(name);
	if (index != -1) {
		this.list[index] = newName;
		this.data[newName] = this.data[name];
		delete this.data[name];
	}
};

module.exports = ListModal;