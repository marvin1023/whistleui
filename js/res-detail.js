require('./base-css.js');
require('../css/res-detail.css');
var React = require('react');
var Table = require('./table');
var Properties = require('./properties');
var util = require('./util');
var BtnGroup = require('./btn-group');
BTNS = [{name: 'Headers'}, {name: 'TextView'}, {name: 'Cookies'}, {name: 'JSON'}, {name: 'Raw'}];
var COOKIE_HEADERS = ['Name', 'Value', 'Domain', 'Path', 'Expires', 'Http Only', 'Secure'];

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
			if (headers && headers['set-cookie']) {
				cookies = headers['set-cookie'].map(function(cookie) {
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
