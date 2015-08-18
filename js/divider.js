require('./base-css.js');
require('../css/divider.css');
var $ = require('jquery');
var React = require('react');
var util = require('./util');

util.addDragEvent('.w-divider', function(target, x, y) {
	target = target.parent();
	var con = target.parent();
	var isVertical = !con.hasClass('box');
	var isRight = target.hasClass('w-divider-right');
	var size = isVertical ? target[0].offsetHeight - (isRight ? y : -y) : target[0].offsetWidth - (isRight ? x : -x);
	var conSize = con[0][isVertical ? 'offsetHeight' : 'offsetWidth'];
	target[isVertical ? 'height' : 'width'](Math.min(conSize - 5, Math.max(5, size)));
});

var Divider = React.createClass({
	componentDidMount: function() {
		var divider = this.refs.divider.getDOMNode();
		var prop = this.props.vertical ? 'height' : 'width';
		if (this._leftWidth > 0) {
			$(divider).find('.w-divider-left')[prop](this._leftWidth);
			return;
		}
		
		var rightWidth = parseInt(this.props.rightWidth, 10);
		if (!(rightWidth > 0)) {
			rightWidth = (this.props.vertical ? divider.offsetHeight : divider.offsetWidth) / 2;
		}
		
		if (rightWidth >= 5) {
			$(divider).find('.w-divider-right')[prop](rightWidth);
		}
	},
	render: function() {
		var vertical = this.props.vertical;
		var divider = <div className="w-divider"></div>;
		var leftWidth = parseInt(this.props.leftWidth, 10);
		if (leftWidth > 0) {
			this._leftWidth = leftWidth;
		} else {
			leftWidth = 0;
		}
		
		return (
				<div ref="divider" className={(vertical ? 'orient-vertical-box' : 'box') + ' fill w-divider-con'}>
					<div className={(leftWidth ? '' : 'fill ') + 'w-divider-left orient-vertical-box ' + (this.props.leftClassName || '')}>
						{leftWidth ? divider : ''}
						{this.props.children[0]}
					</div>
					<div className={(leftWidth ? 'fill ' : '') + 'w-divider-right orient-vertical-box ' + (this.props.rightClassName || '')}>
						{leftWidth ? '' : divider}
						{this.props.children[1]}
					</div>
				</div>
		);
	}
});

module.exports = Divider;