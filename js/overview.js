require('./base-css.js');
require('../css/overview.css');
var React = require('react');
var Properties = require('./properties');
var OVERVIEW_PROPS = ['Url', 'Method', 'Status Code', 'Host IP', 'Client IP', 'Request Length', 'Content Length'
                      , 'Start Date', 'DNS Lookup', 'Request Sent', 'Content Download', 'Host', 'Req', 'Rule', 'Res', 'Weinre', 'Filter', 
                      'Log', 'reqHeaders', 'reqBody', 'prependReq', 'appendReq', 'resHeaders', 'resBody', 'prependRes', 'appendRes'];

var Overview = React.createClass({
	render: function() {
		var modal = {};
		var _modal = this.props.modal || {};
		OVERVIEW_PROPS.forEach(function(name) {
			modal[name] = _modal[name];
		});
		return (
			<div className="w-detail-overview">
				<Properties modal={modal} />
			</div>		
		);
	}
});

module.exports = Overview;