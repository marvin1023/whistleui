var $ = require('jquery');
var dragCallbacks = {};
var dragTarget, dragOffset, dragCallback;

function noop() {}

exports.noop = noop;

exports.preventDefault = function preventDefault(e) {
	e.keyCode == 8 && e.preventDefault();
};

exports.preventBlur = function preventDefault(e) {
	e.preventDefault();
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

exports.showSystemError = function showSystemError() {
	alert('Please check if the whistle server is started.');
};

exports.getClasses = function getClasses(obj) {
	var classes = [];
	for (var i in obj) {
		obj[i] && classes.push(i);
	}
	return classes.join(' ');
};

exports.getContentType = function getContentType(contentType) {
	if (contentType && typeof contentType != 'string') {
		contentType = contentType['content-type'] || contentType.contentType;
	}
	
	if (typeof contentType == 'string') {
		contentType = contentType.toLowerCase();
		if (contentType.indexOf('javascript') != -1) {
	        return 'JS';
	    }
		
		if (contentType.indexOf('css') != -1) {
	        return 'CSS';
	    }
		
		if (contentType.indexOf('html') != -1) {
	        return 'HTML';
	    }
		
		if (contentType.indexOf('json') != -1) {
	        return 'JSON';
	    }
		
		if (contentType.indexOf('text/') != -1) {
	        return 'TEXT';
	    }
		
		if (contentType.indexOf('image') != -1) {
	        return 'IMG';
	    } 
	}
	
	return null;
};

exports.getHostname = function getHostname(url) {
	var start = url.indexOf(':\/\/');
	start = start == -1 ? 0 : start + 3;
	var end = url.indexOf('\/', start);
	url = end == -1 ? url.substring(start) : url.substring(start, end);
	end = url.indexOf(':', start);
	return end == -1 ? url : url.substring(0, end);
};

exports.getProtocol = function getProtocol(url) {
	var index = url.indexOf(':\/\/');
	return index == -1 ? 'TUNNEL' : url.substring(0, index).toUpperCase();
};

exports.ensureVisible = function(elem, container) {
	elem = $(elem);
	container = $(container);
	var top = elem.offset().top - container.offset().top;
	if (!top) {
		return;
	}
	
	if (top < 0) {
		container.scrollTop(container.scrollTop() + top - 2);
		return;
	}
	
	top += elem[0].offsetHeight - container[0].offsetHeight;
	if (top > 0) {
		container.scrollTop(container.scrollTop() + top + 2);
	}
};

exports.parseQueryString = function(str, delimiter, seperator, decode) {
	var result = {};
	if (!str || !(str = str.trim())) {
		return result;
	}
	delimiter = delimiter || '&';
	seperator = seperator || '=';
	str.split(delimiter).forEach(function(sep) {
		sep = sep.split(seperator);
		result[sep[0]] = decode ? decode(sep[1] || '') : sep[1];
	});
	return result;
}

exports.objectToString = function(obj) {
	var result = [];
	for (var i in obj) {
		result.push(i + ': ' + (obj[i] || ''))
	}
	return result.join('\r\n');
};

exports.getPath = function(url) {
	var index = url.indexOf('://');
	if (index != -1) {
		url = url.substring(index + 3);
	}
	index = url.indexOf('/');
	return index == -1 ? '/' : url.substring(index);
};


