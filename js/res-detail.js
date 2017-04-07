require('./base-css.js');
require('../css/res-detail.css');
var $ = require('jquery');
var React = require('react');
var Table = require('./table');
var Properties = require('./properties');
var util = require('./util');
var BtnGroup = require('./btn-group');
var Textarea = require('./textarea');
var JSONViewer = require('./json-viewer');
var BTNS = [{name: 'Headers'}, {name: 'TextView'}, {name: 'Cookies'}, {name: 'JSON'}, {name: 'Raw'}];
var COOKIE_HEADERS = ['Name', 'Value', 'Domain', 'Path', 'Expires', 'HttpOnly', 'Secure'];

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
		var res, rawHeaders, headers, cookies, body, raw, json;
		body = raw = '';
		if (modal) {
			res = modal.res
			rawHeaders = res.rawHeaders;
			body = res.body || '';
			headers = res.headers;
			if (res.json) {
				json = res.json;
			} else if (json = util.parseJSON(body)) {
				json = res.json = {
					json: json,
					str: JSON.stringify(json, null, '    ')
				};
			}
			if (headers && headers['set-cookie']) {
				cookies = headers['set-cookie'];
				if (!$.isArray(cookies)) {
					cookies = typeof cookies == 'string' ? [cookies] : [];
				}
				cookies = cookies.map(function(cookie) {
							cookie = util.parseQueryString(cookie, /;\s*/, null, decodeURIComponent);
							var row = ['', '', '', '', '', '', ''];
							for (var i in cookie) {
								switch(i.toLowerCase()) {
									case 'domain':
										row[2] = cookie[i];
										break;
									case 'path':
										row[3] = cookie[i];
										break;
									case 'expires':
									case 'max-age':
										row[4] = cookie[i];
										break;
									case 'httponly':
										row[5] = '√';
										break;
									case 'secure':
										row[6] = '√';
										break;
									default:
										if (!row[0]) {
											row[0] = i;
											row[1] = cookie[i];
										}
								}
							}
							
							return row;
						});
			}
			if (res.statusCode != null) {
				raw = ['HTTP/' + (modal.req.httpVersion || '1.1'), res.statusCode, util.getStatusMessage(res)].join(' ')
					  + '\r\n' + util.objectToString(headers, res.rawHeaderNames) + '\r\n\r\n' + body;
			}
		}
		
		this.state.raw = raw;
		this.state.body = body;
		
		return (
			<div className={'fill orient-vertical-box w-detail-content w-detail-response' 
				+ (util.getBoolean(this.props.hide) ? ' hide' : '')}>
				<BtnGroup onClick={this.onClickBtn} btns={BTNS} />
				{this.state.initedHeaders ? <div className={'fill w-detail-response-headers' + (name == BTNS[0].name ? '' : ' hide')}><Properties modal={rawHeaders || headers} enableViewSource="1" /></div> : ''}
				{this.state.initedTextView ? <Textarea value={body} className="fill w-detail-response-textview" hide={name != BTNS[1].name} /> : ''}
				{this.state.initedCookies ? <div className={'fill w-detail-response-cookies' + (name == BTNS[2].name ? '' : ' hide')}><Table head={COOKIE_HEADERS} modal={cookies} /></div> : ''}
				{this.state.initedJSON ? <JSONViewer data={json} hide={name != BTNS[3].name} /> : ''}
				{this.state.initedRaw ? <Textarea value={raw} className="fill w-detail-response-raw" hide={name != BTNS[4].name} /> : ''}
			</div>
		);
	}
});

module.exports = ResDetail;
