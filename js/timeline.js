require('./base-css.js');
require('../css/timeline.css');
var React = require('react');

var Timeline = React.createClass({
	render: function() {
		
		return (
			<div className="w-detail-Timeline">
				<div style={{height: '1000px'}}></div>
			</div>
		);
	}
});

module.exports = Timeline;