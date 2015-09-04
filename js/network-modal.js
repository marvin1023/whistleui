var MAX_LENGTH = 720;
var MAX_COUNT = 1280;

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
		var exceed = this._list.length - MAX_LENGTH;
		if (exceed > 0) {
			this._list.splice(0, Math.min(exceed, MAX_LENGTH - 1));
		}
	}
	
	this.list = this._list.slice(0, MAX_LENGTH);
};

module.exports = NetworkModal;

