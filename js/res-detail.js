require('./base-css.js');
require('../css/res-detail.css');
var React = require('react');
var Table = require('./table');
var Properties = require('./properties');
var util = require('./util');
var BtnGroup = require('./btn-group');
BTNS = [{name: 'Headers'}, {name: 'TextView'}, {name: 'Cookies'}, {name: 'JSON'}, {name: 'Raw'}];
var COOKIE_HEADERS = ['Name', 'Value', 'Domain', 'Path', 'Http Only', 'Secure'];

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
		return (
			<div className={'fill orient-vertical-box w-detail-content w-detail-response w-detail-show-response-' 
				+ util.getProperty(this, 'state.btn.name', '').toLowerCase() 
				+ (util.getBoolean(this.props.hide) ? ' hide' : '')}>
				<BtnGroup onClick={this.onClickBtn} btns={BTNS} />
				{this.state.initedHeaders ? <div className={'w-detail-response-headers' + (name == BTNS[0].name ? '' : ' hide')}><Properties /></div> : ''}
				{this.state.initedTextView ? <textarea onKeyDown={util.preventDefault} readOnly="readonly" className={'orient-vertical-box w-detail-response-textview' + (name == BTNS[1].name ? '' : ' hide')}></textarea> : ''}
				{this.state.initedCookies ? <div className={'w-detail-response-cookies' + (name == BTNS[2].name ? '' : ' hide')}><Table head={COOKIE_HEADERS} /></div> : ''}
				{this.state.initedJSON ? <textarea onKeyDown={util.preventDefault} readOnly="readonly" className={'fill w-detail-response-json' + (name == BTNS[3].name ? '' : ' hide')}></textarea> : ''}
				{this.state.initedRaw ? <textarea onKeyDown={util.preventDefault} readOnly="readonly" className={'fill w-detail-response-raw' + (name == BTNS[4].name ? '' : ' hide')}></textarea> : ''}
			</div>
		);
	}
});

module.exports = ResDetail;
