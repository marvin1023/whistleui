require('./base-css.js');
require('../css/overview.css');
var React = require('react');

var Log = React.createClass({
	render: function() {
		
		return (
			<div className="w-detail-log">
				<div style={{height: '1000px'}}></div>
			</div>		
		);
	}
});

module.exports = Log;