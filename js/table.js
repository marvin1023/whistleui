require('./base-css.js');
require('../css/table.css');
var React = require('react');

var Table = React.createClass({
	render: function() {
		var head = this.props.head;
		var hasHead = Array.isArray(head) && head.length;
		
		return (
			<table className="table w-table">
				{
					hasHead ? (
							<thead>
							{head.map(function(head) {
								return <th key={head}>{head}</th>;
							})}
							</thead>
					) : ''
				}
				<tr>
					<td>test</td>
					<td>test</td>
					<td>test</td>
					<td>test</td>
					<td>test</td>
					<td>√</td>
				</tr>
				<tr>
					<td>test</td>
					<td>test</td>
					<td>test</td>
					<td>test</td>
					<td>√</td>
					<td>test</td>
				</tr>
			</table>
		);
	}
});

module.exports = Table;