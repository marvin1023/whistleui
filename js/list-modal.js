var $ = require('jquery');
var util = require('./util');

function ListModal(list, data) {
	var self = this;
	self.list = Array.isArray(list) ? list : [];
	data = data || {};
	self.data = {};
	self.list.forEach(function(name) {
		var item = self.data[name] = data[name] || {};
		item.key = item.key || util.getKey();
		item.name = name;
	});
}

var proto = ListModal.prototype;

proto._getList = function(prop) {
	var list = [];
	var data = this.data;
	Object.keys(data)
			.forEach(function(name) {
				var item = data[name];
				if (item && item[prop]) {
					list.push(item);
				}
			});
	return list;
};

proto._setBoolProp = function(name, prop, bool) {
	var item = this.get(name);
	if (item) {
		item[prop] = bool !== false;
	}
	return item;
};

proto.add = function(name, value) {
	if (!name || this.get(name)) {
		return false;
	}
	this.list.push(name);
	this.data[name] = {
		key: util.getKey(),
		name: name,
		value: value || ''
	};
	return true;
};

proto.set = function(name, value) {
	var item = this.get(name);
	if (item) {
		if (typeof value == 'string') {
			item.value = value;
		} else {
			$.extend(item, value);
		}
	}
};

proto.get = function(name) {
	
	return this.data[name];
};

proto.getByKey = function(key) {
	for (var i in this.data) {
		var item = this.data[i];
		if (item.key == key) {
			return item;
		}
	}
};

proto.setSelected = function(name, selected) {
	
	return this._setBoolProp(name, 'selected', selected);
};

proto.getSelectedList = function() {
	
	return this._getList('selected');
};

proto.setChanged = function(name, changed) {

	return this._setBoolProp(name, 'changed', changed);
};

proto.getChangedList = function() {
	
	return this._getList('changed');
};

proto.clearAllActive = function() {
	var data = this.data;
	Object.keys(data).forEach(function(name) {
		data[name].active = false;
	});
};

proto.setActive = function(name, active) {
	var item = this.get(name);
	if (item) {
		active = active !== false;
		active && this.clearAllActive();
		item.active = active;
	}
};

proto.getActive = function() {
	for (var i in this.data) {
		var item = this.data[i];
		if (item.active) {
			return item;
		}
	}
};

proto.remove = function(name) {
	var index = this.getIndex(name);
	if (index != -1) {
		this.list.splice(index, 1);
		delete this.data[name];
		return true;
	}
};

proto.rename = function(name, newName) {
	if (!name || !newName || name == newName) {
		return;
	}
	
	var index = this.getIndex(name);
	if (index != -1) {
		this.list[index] = newName;
		this.data[newName] = this.data[name];
		delete this.data[name];
		return true;
	}
};

proto.getIndex = function(name) {
	return this.list.indexOf(name);
};

module.exports = ListModal;