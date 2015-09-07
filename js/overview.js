require('./base-css.js');
require('../css/overview.css');
var React = require('react');
var util = require('./util');
var Properties = require('./properties');
var OVERVIEW = ['Url', 'Method', 'Status Code', 'Host IP', 'Client IP', 'Request Length', 'Content Length'
                      , 'Start Date', 'DNS Lookup', 'Request Sent', 'Content Download'];
/**
 * statusCode://, redirect://[statusCode:]url, [req, res]speed://, 
 * [req, res]delay://, method://, [req, res][content]Type://自动lookup, 
 * cache://xxxs[no], params://json|string(放在url)
 */
var RULES = ['host', 'req', 'rule', 'res', 'weinre', 'filter', 'log', 'params', 'delayReq', 'reqSpeed', 'reqHeaders',
             'method', 'reqType', 'reqBody', 'prependReq', 'appendReq', 'resHeaders', 'statusCode', 'redirect', 'delayRes', 
             'resSpeed', 'resType', 'cache', 'resBody', 'prependRes', 'appendRes'];
var DEFAULT_OVERVIEW_MODAL = {};
var DEFAULT_RULES_MODAL = {};

OVERVIEW.forEach(function(name) {
	DEFAULT_OVERVIEW_MODAL[name] = '';
});
RULES.forEach(function(name) {
	DEFAULT_RULES_MODAL[name] = '';
});

var Overview = React.createClass({
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	render: function() {
		var overviewModal = DEFAULT_OVERVIEW_MODAL;
		var rulesModal = DEFAULT_RULES_MODAL;
		var modal = this.props.modal;
		
		if (modal) {
			OVERVIEW.forEach(function(name) {
				overviewModal[name] = '';
			});
			var rules = modal.rules;
			if (rules) {console.log(rules)
				RULES.forEach(function(name) {
					var rule = rules[name];
					rulesModal[name] = rule && rule.raw;
				});
			}
		}
		
		return (
			<div className={'fill orient-vertical-box w-detail-content w-detail-overview' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
				<Properties modal={overviewModal} />
				<p className="w-detail-overview-title"><a href="https://github.com/avwo/whistle#whistle" target="_blank"><span className="glyphicon glyphicon-question-sign"></span></a>All rules:</p>
				<Properties modal={rulesModal} />
			</div>		
		);
	}
});

module.exports = Overview;