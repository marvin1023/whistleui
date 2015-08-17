require('.base-css.js');
require('../css/detail.css');
var React = require('react');

var ReqData = React.createClass({
	componentDidMount: function() {
		
	},
	render: function() {
		
		return (
				<div className="fill box-orient-vertical w-detail">
				<div className="btn-group btn-group-sm w-detail-tabs">
				  <button type="button" className="btn btn-default"><span className="glyphicon glyphicon-eye-open"></span>Overview</button>
				  <button type="button" className="btn btn-default"><span className="glyphicon glyphicon-send"></span>Request</button>
				  <button type="button" className="btn btn-default"><span className="glyphicon glyphicon-flash"></span>Response</button>
				  <button type="button" className="btn btn-default"><span className="glyphicon glyphicon-align-justify"></span>Timeline</button>
				  <button type="button" className="btn btn-default"><span className="glyphicon glyphicon-edit"></span>Composer</button>
				  <button type="button" className="btn btn-default"><span className="glyphicon glyphicon-file"></span>Log</button>
				</div>
				<div className="w-detail-content fill">
					<div className="w-detail-divider"></div>
					<div className="w-detail-overview" style={{display: 'none'}}>
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
					<div className="w-detail-request">
						<div className="btn-group btn-group-sm w-sub-btn-group-sm">
						  <button type="button" className="btn btn-default">Headers</button>
						  <button type="button" className="btn btn-default">TextView</button>
						  <button type="button" className="btn btn-default">Cookies</button>
						  <button type="button" className="btn btn-default">WebForms</button>
						  <button type="button" className="btn btn-default">Raw</button>
						</div>
					</div>
					<div className="w-detail-response">
						<div className="btn-group btn-group-sm w-sub-btn-group-sm">
						  <button type="button" className="btn btn-default">Headers</button>
						  <button type="button" className="btn btn-default">TextView</button>
						  <button type="button" className="btn btn-default">Cookies</button>
						  <button type="button" className="btn btn-default">JSON</button>
						  <button type="button" className="btn btn-default">Raw</button>
						</div>
					</div>
					<div className="w-detail-Timeline">
						
					</div>
				</div>
			</div>
		);
	}
});

module.exports = ReqData;