require('./base-css.js');
require('../css/req-detail.css');
var React = require('react');
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
				<BtnGroup btns={BTNS} />
				<div className="fill w-detail-response-headers"></div>
				<div className="fill w-detail-response-textview"></div>
				<div className="fill w-detail-response-cookies"></div>
				<div className="fill w-detail-response-webforms"></div>
				<div className="fill w-detail-response-raw"></div>
			</div>
		);
	}
});

module.exports = ReqDetail;


