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
								var value = modal[name];
								
								return (Array.isArray(value) ?
										value.map(function(val, i) {
											return (
												<tr key={i}>
													<th>{name}</th>
													<td>{val}</td>
												</tr>		
											);
										})
										: 
										<tr key={name}>
											<th>{name}</th>
											<td>{value}</td>
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