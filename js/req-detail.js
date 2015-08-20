require('./base-css.js');
require('../css/req-detail.css');
var React = require('react');
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
				<div className="w-detail-request-headers">1</div>
				<textarea onKeyDown={util.preventDefault} readOnly="readonly" className="orient-vertical-box w-detail-request-textview">2</textarea>
				<div className="w-detail-request-cookies">3</div>
				<div className="w-detail-request-webforms">4</div>
				<textarea onKeyDown={util.preventDefault} readOnly="readonly" className="orient-vertical-box w-detail-request-raw">5</textarea>
			</div>
		);
	}
});

module.exports = ReqDetail;


