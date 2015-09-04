var MAX_COUNT = 2000;
var MAX_LENGTH = 512;

function NetworkModal(list) {
	this._list = list;
	this.list = list.slice(0, MAX_LENGTH);
}

NetworkModal.MAX_COUNT = MAX_COUNT;

var proto = NetworkModal.prototype;

proto.clear = function clear() {
	this.list = [];
	this._list.splice(0, this._list.length);
	return this;
};

proto.update = function(scrollAtBottom) {
	if (scrollAtBottom) {
		var exceed = this.list.length - MAX_LENGTH;
		if (exceed >= 0) {
			this._list.splice(0, exceed + 6);
		}
	}
	
	this.list = this._list.slice(0, MAX_LENGTH);
};

module.exports = NetworkModal;

