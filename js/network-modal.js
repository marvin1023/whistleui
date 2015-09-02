function NetworkModal(list) {
	this.list = list || [];
}

var proto = NetworkModal.prototype;

proto.clear = function clear() {
	this.list.splice(0, this.list.length);
	return this;
};

module.exports = NetworkModal;

