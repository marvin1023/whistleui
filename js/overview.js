require('./base-css.js');
require('../css/overview.css');
var React = require('react');
var Properties = require('./properties');
var OVERVIEW = ['Url', 'Method', 'Status Code', 'Host IP', 'Client IP', 'Request Length', 'Content Length'
                      , 'Start Date', 'DNS Lookup', 'Request Sent', 'Content Download'];
/**
 * statusCode://, redirect://[statusCode:]url, [req, res]speed://, 
 * [req, res]delay://, method://, [req, res][content]Type://自动lookup, 
 * cache://xxxs[no], params://json|string(放在url)
 */
var RULES = ['Host', 'Req', 'Rule', 'Res', 'Weinre', 'Filter', 'Log', 'params', 'delayReq', 'reqSpeed', 'reqHeaders',
             'method', 'reqType', 'reqBody', 'prependReq', 'appendReq', 'resHeaders', 'statusCode', 'redirect', 'delayRes', 
             'resSpeed', 'resType', 'cache', 'resBody', 'prependRes', 'appendRes'];

var Overview = React.createClass({
	render: function() {
		var overviewModal = {};
		var rulesModal = {};
		var _modal = this.props.modal || {};
		var _overviewModal = _modal.overview || {};
		var _rulesModal = _modal.rules || {};
		OVERVIEW.forEach(function(name) {
			overviewModal[name] = _overviewModal[name];
		});
		RULES.forEach(function(name) {
			rulesModal[name] = _rulesModal[name];
		});
		return (
			<div className="w-detail-overview orient-vertical-box">
				<Properties modal={overviewModal} />
				<p className="w-detail-overview-title">All rules:</p>
				<Properties modal={rulesModal} />
			</div>		
		);
	}
});

module.exports = Overview;