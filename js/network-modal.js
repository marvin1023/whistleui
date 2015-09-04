var MAX_LENGTH = 512;
var MAX_COUNT = 1000;//不能超过MAX_LENGTH * 2，否则order衔接会有问题

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

