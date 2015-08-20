require('./base-css.js');
require('../css/composer.css');
var React = require('react');
var Divider = require('./divider');

var Composer = React.createClass({
	render: function() {
		return (
			<div className="w-detail-composer">
				<Divider>
					<div>1</div>
					<div>2</div>
				</Divider>
			</div>
		);
	}
});

module.exports = Composer;