require('bootstrap/dist/css/bootstrap.css');
var $ = require('jquery');
var React = require('react');
var util = require('./util');

util.addDragEvent('.w-divider', function(target, x, y) {
	target = target.parent();
	var isVertical = target.hasClass('w-divider-bottom');
	var size = isVertical ? target[0].offsetHeight - y : target[0].offsetWidth - x;
	var conSize = target.parent()[0][isVertical ? 'offsetHeight' : 'offsetWidth'];
	target[isVertical ? 'height' : 'width'](Math.min(conSize - 5, Math.max(5, size)));
});

window.util = util;