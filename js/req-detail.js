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
	_onClickBtn: function(btn) {
		this.setState({btn: btn});
	},
	render: function() {
		return (
			<div className={'fill orient-vertical-box w-detail-request w-detail-show-request-' 
					+ util.getProperty(this, 'state.btn.name', '').toLowerCase()}>
				<BtnGroup onClick={this._onClickBtn} btns={BTNS} />
				<div className="w-detail-request-headers">
					<Properties />
				</div>
				<textarea onKeyDown={util.preventDefault} readOnly="readonly" className="orient-vertical-box w-detail-request-textview"></textarea>
				<div className="w-detail-request-cookies">
					<Properties />
				</div>
				<Divider leftWidth={(Math.max(window.innerHeight, 360) - 120) / 2} vertical="true" className="w-detail-request-webforms">
					<Properties />
					<Properties />
				</Divider>
				<textarea onKeyDown={util.preventDefault} readOnly="readonly" className="orient-vertical-box w-detail-request-raw"></textarea>
			</div>
		);
	}
});

module.exports = ReqDetail;


