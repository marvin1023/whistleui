var $ = require('jquery');

var dragCallbacks = {};
var dragTarget, dragOffset, dragCallback;

function noop() {}

exports.noop = noop;

exports.preventDefault = function preventDefault(e) {
	e.keyCode == 8 && e.preventDefault();
};

$(document).on('mousedown', function(e) {
	stopDrag();
	var target = $(e.target);
	$.each(dragCallbacks, function(selector) {
		dragTarget = target.closest(selector);
		if (dragTarget.length) {
			dragCallback = dragCallbacks[selector];
			return false;
		}
		stopDrag();
	});
	
	if (!dragTarget || !dragCallback) {
		return;
	}
	dragOffset = e;
	e.preventDefault();
}).on('mousemove', function(e) {
	if (!dragTarget) {
		return;
	}
	$.each(dragCallback, function() {
		this(dragTarget, e.clientX - dragOffset.clientX, 
				e.clientY - dragOffset.clientY, dragOffset.clientX, dragOffset.clientY);
	});
	dragOffset = e;
}).on('mouseup', stopDrag)
.on('mouseout', function(e) {
	!e.relatedTarget && stopDrag();
});

function stopDrag() {
	dragCallback = dragTarget = dragOffset = null;
}

function addDragEvent(selector, callback) {
	if (!selector || typeof callback != 'function' 
			|| typeof selector != 'string' 
					|| !(selector = $.trim(selector))) {
		return;
	}
	var callbacks = dragCallbacks[selector] = dragCallbacks[selector] || [];
	if ($.inArray(callback, callbacks) == -1) {
		callbacks.push(callback);
	}
}

function removeDragEvent(selector, callback) {
	var callbacks = dragCallbacks[selector];
	if (!callbacks) {
		return;
	}
	if (typeof callback == 'function') {
		var index = $.inArray(callback, callbacks);
		if (index != -1) {
			callbacks.splice(index, 1);
		}
		return;
	}
	delete dragCallbacks[selector];
}

exports.addDragEvent = addDragEvent;
exports.removeDragEvent = removeDragEvent;

var keyIndex = 1;

exports.getKey = function getKey() {
	return 'w-reactkey-' + keyIndex++;
};

function getProperty(obj, name, defaultValue) {
	if (obj && (name || name !== '')) {
		if (typeof name == 'string') {
			name = name.split('.');
		}
		for (var i = 0, len = name.length - 1; i <= len; i++) {
			var prop = name[i];
			if (prop in obj) {
				obj = obj[prop];
				if (i == len) {
					return obj;
				}
				if (!obj) {
					return defaultValue;
				}
			} else {
				return defaultValue;
			}
		}
	}
	
	return defaultValue;
}

exports.getProperty = getProperty;

function getBoolean(val) {
	
	return !(!val || val === 'false');
}

exports.getBoolean = getBoolean;

