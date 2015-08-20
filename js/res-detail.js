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
				<div className="fill w-detail-response-headers">11</div>
				<div className="fill w-detail-response-textview">22</div>
				<div className="fill w-detail-response-cookies">33</div>
				<div className="fill w-detail-response-json">44</div>
				<div className="fill w-detail-response-raw">55</div>
			</div>
		);
	}
});

module.exports = ResDetail;
