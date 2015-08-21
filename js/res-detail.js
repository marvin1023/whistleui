require('./base-css.js');
require('../css/res-detail.css');
var React = require('react');
var Table = require('./table');
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
				<div className="w-detail-response-headers"></div>
				<textarea onKeyDown={util.preventDefault} readOnly="readonly" className="orient-vertical-box w-detail-response-textview"></textarea>
				<div className="w-detail-response-cookies">
					<Table />
				</div>
				<div className="w-detail-response-json"></div>
				<textarea onKeyDown={util.preventDefault} readOnly="readonly" className="orient-vertical-box w-detail-response-raw"></textarea>
			</div>
		);
	}
});

module.exports = ResDetail;
