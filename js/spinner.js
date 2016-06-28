require('../css/spinner.css');
var React = require('react');
var ReactDOM = require('react-dom');

var Spinner = React.createClass({
	
	render: function() {
		
		return (
			<div className="w-spinner">
				<span className="glyphicon glyphicon-triangle-top"></span>
				<span className="glyphicon glyphicon-triangle-bottom"></span>
			</div>
		);
	}
});

module.exports = Spinner;