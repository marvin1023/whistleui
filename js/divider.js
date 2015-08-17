require('../css/divider.css');
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
	render: function() {
		var vertical = this.props.vertical;
		return (
				<div className={(vertical ? 'box-orient-vertical' : 'box') + ' fill w-divider-con'}>
					<div className="fill w-divider-left">
						{this.props.children[0]}
					</div>
					<div className="w-divider-right">
						<div className="w-divider"></div>
						{this.props.children[1]}
					</div>
				</div>
		);
	}
});

module.exports = Divider;