require('./base-css.js');
require('../css/composer.css');
var React = require('react');

var Composer = React.createClass({
	render: function() {
		return (
			<div className="w-detail-composer">
				<div style={{height: '1000px', width: '1000px'}}></div>
			</div>
		);
	}
});

module.exports = Composer;