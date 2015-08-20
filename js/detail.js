require('./base-css.js');
require('../css/detail.css');
var React = require('react');
var BtnGroup = require('./btn-group');
var ReqDetail = require('./req-detail');
var ResDetail = require('./res-detail');
var TABS = [{
				name: 'Overview',
				icon: 'eye-open',
				active: true
			}, {
				name: 'Request',
				icon: 'send'
			}, {
				name: 'Response',
				icon: 'flash'
			}, {
				name: 'Timeline',
				icon: 'align-justify'
			}, {
				name: 'Composer',
				icon: 'edit'
			}, {
				name: 'Log',
				icon: 'file'
			}];

var ReqData = React.createClass({
	componentDidMount: function() {
		
	},
	render: function() {
		
		return (
				<div className="fill orient-vertical-box w-detail">
				<BtnGroup tabs={TABS} />
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
					<ReqDetail />
					<ResDetail />
					<div className="w-detail-Timeline">
						
					</div>
				</div>
			</div>
		);
	}
});

module.exports = ReqData;