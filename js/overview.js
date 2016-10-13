require('./base-css.js');
require('../css/overview.css');
var React = require('react');
var util = require('./util');
var Properties = require('./properties');
var OVERVIEW = ['Url', 'Real Url', 'Method', 'Http Version', 'Status Code', 'Status Message', 'Host IP', 'Client IP', 'Request Length', 'Content Length'
                      , 'Start Date', 'DNS Lookup', 'Request Sent', 'Response Headers', 'Content Download'];
var OVERVIEW_PROPS = ['url', 'realUrl', 'req.method', 'req.httpVersion', 'res.statusCode', 'res.statusMessage', 'res.ip', 'req.ip', 'req.size', 'res.size'];
/**
 * statusCode://, redirect://[statusCode:]url, [req, res]speed://, 
 * [req, res]delay://, method://, [req, res][content]Type://自动lookup, 
 * cache://xxxs[no], params://json|string(放在url)
 */
var RULES = ['host', 'rule', 'dispatch', 'urlParams', 'urlReplace', 'method',  
             'statusCode', 'replaceStatus', 'weinre', 'log', 'pac', 'filter', 'disable', 
             'delete', 'plugin', 'hostname', 'referer', 'accept', 'auth', 'etag', 'ua',
              'cache', 'redirect', 'location', 'attachment', 'params', 'html', 'css', 
             'js', 'req', 'res', 'reqHeaders', 'resHeaders',  'reqDelay', 'resDelay', 
             'reqSpeed', 'resSpeed', 'reqType', 'resType', 'reqCharset', 'resCharset', 
             'reqCookies', 'resCookies', 'reqCors', 'resCors', 'reqPrepend', 'resPrepend',
              'reqBody', 'resBody', 'reqAppend', 'resAppend', 'reqReplace', 'resReplace',
              'reqWrite',  'resWrite', 'reqWriteRaw', 'resWriteRaw', 'exportsUrl', 'exports'];
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
			overviewModal = {};
			OVERVIEW.forEach(function(name, i) {
				var prop = OVERVIEW_PROPS[i];
				if (prop) {
					var value = util.getProperty(modal, prop);
					if (value) {
						if ((prop == 'req.size' || prop == 'res.size') && value > 1024) {
							value += '(' + Number(value / 1024).toFixed(2) + 'k)'
						} else if (prop == 'realUrl' && value == modal.url) {
							value = '';
						}
					} else if (prop == 'res.statusMessage') {
						value = util.getStatusMessage(modal.res);
					}
					overviewModal[name] = value;
				} else {
					var lastIndex = OVERVIEW.length - 1;
					var time;
					switch(name) {
						case OVERVIEW[lastIndex - 4]:
							time = new Date(modal.startTime).toLocaleString();
							break;
						case OVERVIEW[lastIndex - 3]:
							if (modal.dnsTime) {
								time = modal.dnsTime - modal.startTime + 'ms'
							}
							break;
						case OVERVIEW[lastIndex - 2]:
							if (modal.requestTime) {
								time = modal.requestTime - modal.startTime + 'ms'
							}
							break;
						case OVERVIEW[lastIndex - 1]:
							if (modal.responseTime) {
								time = modal.responseTime - modal.startTime + 'ms'
							}
							break;
						case OVERVIEW[lastIndex]:
							if (modal.endTime) {
								time = modal.endTime - modal.startTime + 'ms'
							}
							break;
					}
					overviewModal[name] = time;
				}
			});
			var rules = modal.rules;
			var titleModal = {};
			if (rules) {
				rulesModal = {};
				RULES.forEach(function(name) {
					var rule = rules[name];
					rulesModal[name] = rule ? rule.rawPattern + ' ' + rule.matcher + (rule.port ? ':' + rule.port : '') : undefined;
					titleModal[name] = rule ? rule.raw : undefined;
				});
			}
		}
		
		return (
			<div className={'fill orient-vertical-box w-detail-content w-detail-overview' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
				<Properties modal={overviewModal} />
				<p className="w-detail-overview-title"><a href="https://whistle.gitbooks.io/help/content/rules/" target="_blank"><span className="glyphicon glyphicon-question-sign"></span></a>All rules:</p>
				<Properties modal={rulesModal} title={titleModal} />
			</div>		
		);
	}
});

module.exports = Overview;