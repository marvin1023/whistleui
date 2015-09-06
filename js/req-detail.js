require('./base-css.js');
require('../css/req-detail.css');
var React = require('react');
var Table = require('./table');
var Divider = require('./divider');
var Properties = require('./properties');
var util = require('./util');
var BtnGroup = require('./btn-group');
var BTNS = [{name: 'Headers', active: true}, {name: 'TextView'}, {name: 'Cookies'}, {name: 'WebForms'}, {name: 'Raw'}];

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
		var state = {btn: btn};
		state['inited' + btn.name] = true;
		this.setState(state);
	},
	render: function() {
		var btn = this.state.btn;
		var name = btn && btn.name;
		return (
			<div className={'fill orient-vertical-box w-detail-request' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
				<BtnGroup onClick={this.onClickBtn} btns={BTNS} />
				{this.state.initedHeaders ? <div className={'w-detail-request-headers' + (name == BTNS[0].name ? '' : ' hide')}><Properties /></div> : ''}
				{this.state.initedTextView ? <textarea onKeyDown={util.preventDefault} readOnly="readonly" className={'orient-vertical-box w-detail-request-textview' + (name == BTNS[1].name ? '' : ' hide')}></textarea> : ''}
				{this.state.initedCookies ? <div className={'w-detail-request-cookies' + (name == BTNS[2].name ? '' : ' hide')}><Properties /></div> : ''}
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


