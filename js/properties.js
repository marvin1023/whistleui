require('./base-css.js');
require('../css/properties.css');
var React = require('react');

var Properties = React.createClass({
	render: function() {
		var modal = this.props.modal || {};
		return (
				<table className="table w-properties">
					<tbody>
						{
							Object.keys(modal).map(function(name) {
								return (
										<tr key={name}>
											<th>{name}</th>
											<td>{modal[name]}</td>
										</tr>	
								);
							})
						}
					</tbody>
				</table>
		);
	}
});

module.exports = Properties;