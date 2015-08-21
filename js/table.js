require('./base-css.js');
require('../css/table.css');
var React = require('react');

var Table = React.createClass({
	render: function() {
		
		return (
			<table className="table w-table">
				<thead>
					<th>Test</th>
					<th>Test</th>
					<th>Test</th>
				</thead>
				<tr>
					<td>test</td>
					<td>test</td>
					<td>test</td>
				</tr>
				<tr>
					<td>test</td>
					<td>test</td>
					<td>test</td>
				</tr>
			</table>
		);
	}
});

module.exports = Table;