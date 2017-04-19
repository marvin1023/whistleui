require('./base-css.js');
require('../css/req-detail.css');
var React = require('react');
var Divider = require('./divider');
var Properties = require('./properties');
var util = require('./util');
var BtnGroup = require('./btn-group');
var Textarea = require('./textarea');
var BTNS = [{name: 'Headers'}, {name: 'TextView'}, {name: 'Cookies'}, {name: 'WebForms'}, {name: 'Raw'}];

var ReqDetail = React.createClass({
	getInitialState: function() {
		return {
			initedHeaders: false,
			initedTextView: false,
			initedCookies: false,
			initedWebForms: false,
			initedRaw: false
		};
	},
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	onClickBtn: function(btn) {
		this.selectBtn(btn);
		this.setState({});
	},
	selectBtn: function(btn) {
		btn.active = true;
		this.state.btn = btn;
		this.state['inited' + btn.name] = true;
	},
	render: function() {
		var btn = this.state.btn;
		if (!btn) {
			btn = BTNS[0];
			this.selectBtn(btn);
		}
		var name = btn && btn.name;
		var modal = this.props.modal;
		var req, headers, rawHeaders, cookies, body, raw, query, form, tips;
		body = raw = '';
		if (modal) {
			req = modal.req
			rawHeaders = req.rawHeaders;
			body = req.body || '';
			headers = req.headers;
			delete headers.Host;
			cookies = util.parseQueryString(headers.cookie, /;\s*/g, null, decodeURIComponent);
			var url = modal.url;
			var index = modal.url.indexOf('?');
			query = util.parseQueryString(index == -1 ? '' : url.substring(index + 1), null, null, decodeURIComponent);
			if (util.isUrlEncoded(req)) {
				form = util.parseQueryString(req.body, null, null, decodeURIComponent);
			}
			
			raw = [req.method, req.method == 'CONNECT' ? headers.host : util.getPath(modal.url), 'HTTP/' + (req.httpVersion || '1.1')].join(' ')
					+ '\r\n' + util.objectToString(headers, req.rawHeaderNames) + '\r\n\r\n' + body;
			if (modal.isHttps) {
				tips = { isHttps: true };
			} else if (/^wss?:/.test(modal.url)) {
				tips = { ws: true };
			} else if (modal.requestTime && !body) {
				if (req.size < 5120) {
					tips = { message: 'No Content' };
				}	else {
					tips = { message: 'Request data too large to display' };
				}
			}
		}
		this.state.raw = raw;
		this.state.body = body;
		
		return (
			<div className={'fill orient-vertical-box w-detail-content w-detail-request' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
				<BtnGroup onClick={this.onClickBtn} btns={BTNS} />
				{this.state.initedHeaders ? <div className={'fill w-detail-request-headers' + (name == BTNS[0].name ? '' : ' hide')}><Properties modal={rawHeaders || headers} enableViewSource="1" /></div> : ''}
				{this.state.initedTextView ? <Textarea tips={tips} value={body} className="fill w-detail-request-textview" hide={name != BTNS[1].name} /> : ''}
				{this.state.initedCookies ? <div className={'fill w-detail-request-cookies' + (name == BTNS[2].name ? '' : ' hide')}><Properties modal={cookies} enableViewSource="1" /></div> : ''}
				{this.state.initedWebForms ? <Divider vertical="true" className={'w-detail-request-webforms' + (name == BTNS[3].name ? '' : ' hide')}>
					<div className="fill w-detail-request-query"><Properties modal={query} enableViewSource="1" /></div>
					<div className="fill w-detail-request-form"><Properties modal={form} enableViewSource="1" /></div>
				</Divider> : ''}
				{this.state.initedRaw ? <Textarea value={raw} className="fill w-detail-request-raw" hide={name != BTNS[4].name} /> : ''}
			</div>
		);
	}
});

module.exports = ReqDetail;


