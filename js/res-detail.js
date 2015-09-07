require('./base-css.js');
require('../css/res-detail.css');
var React = require('react');
var Table = require('./table');
var Properties = require('./properties');
var util = require('./util');
var BtnGroup = require('./btn-group');
BTNS = [{name: 'Headers'}, {name: 'TextView'}, {name: 'Cookies'}, {name: 'JSON'}, {name: 'Raw'}];
var COOKIE_HEADERS = ['Name', 'Value', 'Domain', 'Path', 'Http Only', 'Secure'];
var STATUS_CODES = {
		  100 : 'Continue',
		  101 : 'Switching Protocols',
		  102 : 'Processing',                 // RFC 2518, obsoleted by RFC 4918
		  200 : 'OK',
		  201 : 'Created',
		  202 : 'Accepted',
		  203 : 'Non-Authoritative Information',
		  204 : 'No Content',
		  205 : 'Reset Content',
		  206 : 'Partial Content',
		  207 : 'Multi-Status',               // RFC 4918
		  300 : 'Multiple Choices',
		  301 : 'Moved Permanently',
		  302 : 'Moved Temporarily',
		  303 : 'See Other',
		  304 : 'Not Modified',
		  305 : 'Use Proxy',
		  307 : 'Temporary Redirect',
		  308 : 'Permanent Redirect',         // RFC 7238
		  400 : 'Bad Request',
		  401 : 'Unauthorized',
		  402 : 'Payment Required',
		  403 : 'Forbidden',
		  404 : 'Not Found',
		  405 : 'Method Not Allowed',
		  406 : 'Not Acceptable',
		  407 : 'Proxy Authentication Required',
		  408 : 'Request Time-out',
		  409 : 'Conflict',
		  410 : 'Gone',
		  411 : 'Length Required',
		  412 : 'Precondition Failed',
		  413 : 'Request Entity Too Large',
		  414 : 'Request-URI Too Large',
		  415 : 'Unsupported Media Type',
		  416 : 'Requested Range Not Satisfiable',
		  417 : 'Expectation Failed',
		  418 : 'I\'m a teapot',              // RFC 2324
		  422 : 'Unprocessable Entity',       // RFC 4918
		  423 : 'Locked',                     // RFC 4918
		  424 : 'Failed Dependency',          // RFC 4918
		  425 : 'Unordered Collection',       // RFC 4918
		  426 : 'Upgrade Required',           // RFC 2817
		  428 : 'Precondition Required',      // RFC 6585
		  429 : 'Too Many Requests',          // RFC 6585
		  431 : 'Request Header Fields Too Large',// RFC 6585
		  500 : 'Internal Server Error',
		  501 : 'Not Implemented',
		  502 : 'Bad Gateway',
		  503 : 'Service Unavailable',
		  504 : 'Gateway Time-out',
		  505 : 'HTTP Version Not Supported',
		  506 : 'Variant Also Negotiates',    // RFC 2295
		  507 : 'Insufficient Storage',       // RFC 4918
		  509 : 'Bandwidth Limit Exceeded',
		  510 : 'Not Extended',               // RFC 2774
		  511 : 'Network Authentication Required' // RFC 6585
		};

var ResDetail = React.createClass({
	getInitialState: function() {
		return {
			initedHeaders: false,
			initedTextView: false,
			initedCookies: false,
			initedJSON: false,
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
		var res, headers, cookies, body, raw, json;
		if (modal) {
			res = modal.res
			body = res.body || '';
			headers = res.headers;
			json = util.stringify(body);
			if (headers['set-cookie']) {
				cookies = [];
				headers['set-cookie'].split(/;\s*/g)
						.forEach(function(cookie) {
							cookie = util.parseQueryString(cookie, /,\s*/);
						});
			}
			if (res.statusCode != null) {
				raw = ['HTTP/' + (modal.req.httpVersion || '1.1'), res.statusCode, STATUS_CODES[res.statusCode] || ''].join(' ')
					  + '\r\n' + util.objectToString(headers) + '\r\n\r\n' + body;
			}
		}
		
		return (
			<div className={'fill orient-vertical-box w-detail-content w-detail-response' 
				+ (util.getBoolean(this.props.hide) ? ' hide' : '')}>
				<BtnGroup onClick={this.onClickBtn} btns={BTNS} />
				{this.state.initedHeaders ? <div className={'fill w-detail-response-headers' + (name == BTNS[0].name ? '' : ' hide')}><Properties modal={headers} /></div> : ''}
				{this.state.initedTextView ? <textarea value={body} onKeyDown={util.preventDefault} readOnly="readonly" className={'fill w-detail-response-textview' + (name == BTNS[1].name ? '' : ' hide')}></textarea> : ''}
				{this.state.initedCookies ? <div className={'fill w-detail-response-cookies' + (name == BTNS[2].name ? '' : ' hide')}><Table head={COOKIE_HEADERS} modal={cookies} /></div> : ''}
				{this.state.initedJSON ? <textarea value={json} onKeyDown={util.preventDefault} readOnly="readonly" className={'fill w-detail-response-json' + (name == BTNS[3].name ? '' : ' hide')}></textarea> : ''}
				{this.state.initedRaw ? <textarea value={raw} onKeyDown={util.preventDefault} readOnly="readonly" className={'fill w-detail-response-raw' + (name == BTNS[4].name ? '' : ' hide')}></textarea> : ''}
			</div>
		);
	}
});

module.exports = ResDetail;
