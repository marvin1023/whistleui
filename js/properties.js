require('./base-css.js');
require('../css/properties.css');
var React = require('react');
var util = require('./util');

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
													<td><pre>{util.toString(val)}</pre></td>
												</tr>		
											);
										})
										: 
										<tr key={name}>
											<th>{name}</th>
											<td><pre>{util.toString(value)}</pre></td>
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