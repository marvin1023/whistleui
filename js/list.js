require('./base-css.js');
require('../css/list.css');
var React = require('react');
var Divider = require('./divider');

var List = React.createClass({
	render: function() {
		
		return (
				<Divider leftWidth="200">
					<div className="w-list-data fill">
						<a href="javascript:;">Default<span className="glyphicon glyphicon-ok"></span></a>
						<a href="javascript:;">DefaultDefaultDefaultDefaultDefaultDefaultDefaultDefault</a>
					</div>
					<div className="fill w-list-content">
						
					</div>
				</Divider>
		);
	}
});

module.exports = List;
