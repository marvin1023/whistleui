require('./base-css.js');
require('../css/composer.css');
var React = require('react');
var Divider = require('./divider');

var Composer = React.createClass({
	render: function() {
		return (
			<div className="fill orient-vertical-box w-detail-composer">
				<Divider leftWidth={(window.innerHeight - 120) / 2 + 'px'} vertical="true">
					<div>1</div>
					<div>2</div>
				</Divider>
			</div>
		);
	}
});

module.exports = Composer;