require('./base-css.js');
require('../css/overview.css');
var React = require('react');

var Overview = React.createClass({
	render: function() {
		
		return (
			<div className="w-detail-overview">
				<table className="table w-properties">
					<tr>
						<th>Content Download:</th>
						<td>sssssss</td>
					</tr>
					<tr>
						<th>Content Download:</th>
						<td>sssssss</td>
					</tr>
					<tr>
						<th>Content Download:</th>
						<td>sssssss</td>
					</tr>
					<tr>
						<th>Content Download:</th>
						<td>sssssss</td>
					</tr>
					<tr className="w-properties-separator">
						<th>Content Download:</th>
						<td>sssssss</td>
					</tr>
					<tr>
						<th>Content Download:</th>
						<td>sssssss</td>
					</tr>
					<tr>
						<th>Content Download:</th>
						<td>sssssss</td>
					</tr>
				</table>
			</div>		
		);
	}
});

module.exports = Overview;