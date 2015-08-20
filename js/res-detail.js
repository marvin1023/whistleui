require('./base-css.js');
require('../css/res-detail.css');
var React = require('react');
var util = require('./util');
var BtnGroup = require('./btn-group');
BTNS = [{name: 'Headers', active: true}, {name: 'TextView'}, {name: 'Cookies'}, {name: 'JSON'}, {name: 'Raw'}];

var ResDetail = React.createClass({
	_onClickBtn: function(btn) {
		this.setState({btn: btn});
	},
	render: function() {
		
		return (
			<div className={'fill orient-vertical-box w-detail-response w-detail-show-response-' 
				+ util.getProperty(this, 'state.btn.name', '').toLowerCase()}>
				<BtnGroup onClick={this._onClickBtn} btns={BTNS} />
				<div className="fill w-detail-response-headers"></div>
				<div className="fill w-detail-response-textview"></div>
				<div className="fill w-detail-response-cookies"></div>
				<div className="fill w-detail-response-json"></div>
				<div className="fill w-detail-response-raw"></div>
			</div>
		);
	}
});

module.exports = ResDetail;
