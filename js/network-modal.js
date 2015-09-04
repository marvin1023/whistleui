var MAX_COUNT = 720;
function NetworkModal(list) {
	this.list = list || [];
}

NetworkModal.MAX_COUNT = MAX_COUNT;

var proto = NetworkModal.prototype;

proto.clear = function clear() {
	this.list.splice(0, this.list.length);
	return this;
};

proto.remove = function() {
	var exceed = this.list.length - MAX_COUNT;
	if (exceed > 0) {
		this.list.splice(0, exceed + 6);
	}
};

module.exports = NetworkModal;

