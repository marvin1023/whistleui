require('./base-css.js');
require('../css/properties.css');
var React = require('react');

var Properties = React.createClass({
	render: function() {
		var modal = this.props.modal || {};
		return (
				<table className="table w-properties">
					{
						Object.keys(modal).map(function(name) {
							return (
									<tr>
										<th>{name}</th>
										<td>{modal[name]}</td>
									</tr>	
							);
						})
					}
				</table>
		);
	}
});

module.exports = Properties;