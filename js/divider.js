require('./base-css.js');
require('../css/divider.css');
var $ = require('jquery');
var React = require('react');
var util = require('./util');

util.addDragEvent('.w-divider', function(target, x, y) {
	target = target.parent();
	var con = target.parent();
	var isVertical = !con.hasClass('box');
	var size = isVertical ? target[0].offsetHeight - y : target[0].offsetWidth - x;
	var conSize = con[0][isVertical ? 'offsetHeight' : 'offsetWidth'];
	target[isVertical ? 'height' : 'width'](Math.min(conSize - 5, Math.max(5, size)));
});

var Divider = React.createClass({
	componentDidMount: function() {
		var divider = this.refs.divider.getDOMNode();
		var leftWidth = parseInt(this.props.leftWidth, 10);
		var rightWidth;
		var width = this.props.vertical ? divider.offsetHeight : divider.offsetWidth;
		if (leftWidth > 0) {
			rightWidth = width - leftWidth;
		}
		
		if (!(rightWidth > 0)) {
			rightWidth = parseInt(this.props.rightWidth, 10);
		}
		
		if (!(rightWidth > 0)) {
			var left = 1;
			var right = 1;
			if (/^(\d+):(\d+)$/.test(this.props.rate)) {
				left = parseInt(RegExp.$1, 10) || 1;
				right = parseInt(RegExp.$2, 10) || 1;
			}
			
			rightWidth = width * right / (left + right);
		}
		
		$(divider).find('.w-divider-right')[this.props.vertical ?
				'height' : 'width'](rightWidth);
	},
	render: function() {
		var vertical = this.props.vertical;
		return (
				<div ref="divider" className={(vertical ? 'box-orient-vertical' : 'box') + ' fill w-divider-con'}>
					<div className={'fill w-divider-left box-orient-vertical' + (this.props.leftClassName || '')}>
						{this.props.children[0]}
					</div>
					<div className={'w-divider-right box-orient-vertical' + (this.props.rightClassName || '')}>
						<div className="w-divider"></div>
						{this.props.children[1]}
					</div>
				</div>
		);
	}
});

module.exports = Divider;