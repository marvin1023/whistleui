require('bootstrap/dist/css/bootstrap.css');
var $ = require('jquery');
var React = require('react');
var util = require('./util');

util.addDragEvent('.w-divider', function(target, x, y) {
	target = target.parent();
	var width = target[0].offsetWidth - x;
	target.width(Math.min(target.parent()[0].offsetWidth - 5, Math.max(5, width)));
});