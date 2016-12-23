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

function getHost(url) {
  var start = url.indexOf(':\/\/');
  start = start == -1 ? 0 : start + 3;
  var end = url.indexOf('\/', start);
  url = end == -1 ? url.substring(start) : url.substring(start, end);
  return url;
}

exports.getHostname = function getHostname(url) {
	url = getHost(url);
	var end = url.lastIndexOf(':');
	return end == -1 ? url : url.substring(0, end);
};

exports.getHost = getHost;

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
	if (!str || !(str = (str + '').trim())) {
		return result;
	}
	delimiter = delimiter || '&';
	seperator = seperator || '=';
	str.split(delimiter).forEach(function(pair) {
		pair = pair.split(seperator);
		var key = pair[0];
		var value = pair.slice(1).join('=');
		if (key || value) {
			try {
				var val = value;
				var k = key;
				if (decode == decodeURIComponent) {
					val = value.replace(/\+/g, ' ');
					k = k.replace(/\+/g, ' ');
				}
				value = decode ? decode(val) : value;
				key = decode ? decode(k) : key;
			} catch(e) {}
			
			result[key] = value;
		}
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

function removeProtocol(url) {
	var index = url.indexOf('://');
	return index == -1 ? url : url.substring(index + 3);
}

exports.removeProtocol = removeProtocol;

exports.getPath = function(url) {
	url = removeProtocol(url);
	var index = url.indexOf('/');
	return index == -1 ? '/' : url.substring(index);
};

exports.stringify = function(str) {
	if (!str || !(str = str.trim()) || !/({[\w\W]+}|\[[\w\W]+\])/.test(str)) {
		return '';
	}
	
	str = RegExp.$1;
	try {
		str = JSON.parse(str);
		return str ? JSON.stringify(str, null, '\t') : '';
	} catch(e) {}
	
	return '';
};

exports.unique = function(arr, reverse) {
	var result = [];
	if (reverse) {
		for (var i = arr.length - 1; i >= 0; i--) {
			var item = arr[i];
			if (result.indexOf(item) == -1) {
				result.unshift(item);
			}
		}
	} else {
		arr.forEach(function(item) {
			if (result.indexOf(item) == -1) {
				result.push(item);
			}
		});
	}
	
	return result;
};

exports.getFilename = function(url) {
	url = removeProtocol(url.replace(/[?#].*/, ''));
	var index = url.lastIndexOf('/');
	return index != -1 && url.substring(index + 1) || '/';
};

var STATUS_CODES = {
		  100 : 'Continue',
		  101 : 'Switching Protocols',
		  102 : 'Processing',                 // RFC 2518, obsoleted by RFC 4918
		  200 : 'OK',
		  201 : 'Created',
		  202 : 'Accepted',
		  203 : 'Non-Authoritative Information',
		  204 : 'No Content',
		  205 : 'Reset Content',
		  206 : 'Partial Content',
		  207 : 'Multi-Status',               // RFC 4918
		  208 : 'Already Reported',
		  226 : 'IM Used',
		  300 : 'Multiple Choices',
		  301 : 'Moved Permanently',
		  302 : 'Moved Temporarily',
		  303 : 'See Other',
		  304 : 'Not Modified',
		  305 : 'Use Proxy',
		  307 : 'Temporary Redirect',
		  308 : 'Permanent Redirect',         // RFC 7238
		  400 : 'Bad Request',
		  401 : 'Unauthorized',
		  402 : 'Payment Required',
		  403 : 'Forbidden',
		  404 : 'Not Found',
		  405 : 'Method Not Allowed',
		  406 : 'Not Acceptable',
		  407 : 'Proxy Authentication Required',
		  408 : 'Request Time-out',
		  409 : 'Conflict',
		  410 : 'Gone',
		  411 : 'Length Required',
		  412 : 'Precondition Failed',
		  413 : 'Request Entity Too Large',
		  414 : 'Request-URI Too Large',
		  415 : 'Unsupported Media Type',
		  416 : 'Requested Range Not Satisfiable',
		  417 : 'Expectation Failed',
		  418 : 'I\'m a teapot',              // RFC 2324
		  422 : 'Unprocessable Entity',       // RFC 4918
		  423 : 'Locked',                     // RFC 4918
		  424 : 'Failed Dependency',          // RFC 4918
		  425 : 'Unordered Collection',       // RFC 4918
		  426 : 'Upgrade Required',           // RFC 2817
		  428 : 'Precondition Required',      // RFC 6585
		  429 : 'Too Many Requests',          // RFC 6585
		  431 : 'Request Header Fields Too Large',// RFC 6585
		  500 : 'Internal Server Error',
		  501 : 'Not Implemented',
		  502 : 'Bad Gateway',
		  503 : 'Service Unavailable',
		  504 : 'Gateway Time-out',
		  505 : 'HTTP Version Not Supported',
		  506 : 'Variant Also Negotiates',    // RFC 2295
		  507 : 'Insufficient Storage',       // RFC 4918
		  509 : 'Bandwidth Limit Exceeded',
		  510 : 'Not Extended',               // RFC 2774
		  511 : 'Network Authentication Required' // RFC 6585
		};

exports.getStatusMessage = function(res) {
	return res.statusMessage || STATUS_CODES[res.statusCode] || 'unknown';
};

function isUrlEncoded(req) {
	
	return /^post$/i.test(req.method) && /urlencoded/i.test(req.headers && req.headers['content-type']);
}

exports.isUrlEncoded = isUrlEncoded;

function toString(value) {
	return value === undefined ? '' : value + '';
}

exports.toString = toString;


function openEditor(value) {
	var win = window.open('/editor.html');
	win.getValue = function() {
		return value;
	};
	if (win.setValue) {
		win.setValue(value);
	}
}

exports.openEditor = openEditor;


function compareReqId(prev, next) {
	if (prev >= next) {
		return true;
	}
	
	prev = prev.split('-');
	next = next.split('-');
	return prev[0] == next[0] && prev[1] > next[1];
}

exports.compareReqId = compareReqId;



