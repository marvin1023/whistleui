require('./base-css.js');
require('../css/detail.css');
var React = require('react');
var BtnGroup = require('./btn-group');
var TABS = [{
				name: 'Overview',
				icon: 'eye-open'
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

var REQ_BTNS = ['Headers', 'TextView', 'Cookies', 'WebForms', 'Raw'];
var RES_BTNS = ['Headers', 'TextView', 'Cookies', 'JSON', 'Raw'];

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
					<div className="w-detail-request">
						<BtnGroup btns={REQ_BTNS} />
					</div>
					<div className="w-detail-response">
						<BtnGroup btns={RES_BTNS} />
					</div>
					<div className="w-detail-Timeline">
						
					</div>
				</div>
			</div>
		);
	}
});

module.exports = ReqData;