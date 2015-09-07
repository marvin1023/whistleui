require('./base-css.js');
require('../css/req-detail.css');
var React = require('react');
var Table = require('./table');
var Divider = require('./divider');
var Properties = require('./properties');
var util = require('./util');
var BtnGroup = require('./btn-group');
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
		var req, headers, cookies, body;
		if (modal) {
			req = modal.req
			body = req.body;
			headers = req.headers;
			if (cookies = headers.cookie) {
				var list = cookies.split(/;\s*/g);
				cookies = {};
				list.forEach(function(cookie) {
					cookie = cookie.split('=');
					cookies[cookie[0]] = cookie[1];
				});
			}
		}
		return (
			<div className={'fill orient-vertical-box w-detail-content w-detail-request' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
				<BtnGroup onClick={this.onClickBtn} btns={BTNS} />
				{this.state.initedHeaders ? <div className={'w-detail-request-headers' + (name == BTNS[0].name ? '' : ' hide')}><Properties modal={headers} /></div> : ''}
				{this.state.initedTextView ? <textarea value={body} onKeyDown={util.preventDefault} readOnly="readonly" className={'orient-vertical-box w-detail-request-textview' + (name == BTNS[1].name ? '' : ' hide')}></textarea> : ''}
				{this.state.initedCookies ? <div className={'w-detail-request-cookies' + (name == BTNS[2].name ? '' : ' hide')}><Properties modal={cookies} /></div> : ''}
				{this.state.initedWebForms ? <Divider vertical="true" className={'w-detail-request-webforms' + (name == BTNS[3].name ? '' : ' hide')}>
					<Properties />
					<Properties />
				</Divider> : ''}
				{this.state.initedRaw ? <textarea onKeyDown={util.preventDefault} readOnly="readonly" className={'fill w-detail-request-raw' + (name == BTNS[4].name ? '' : ' hide')}></textarea> : ''}
			</div>
		);
	}
});

module.exports = ReqDetail;


