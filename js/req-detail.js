require('./base-css.js');
require('../css/req-detail.css');
var React = require('react');
var BtnGroup = require('./btn-group');
var BTNS = [{name: 'Headers'}, {name: 'TextView'}, {name: 'Cookies'}, {name: 'WebForms'}, {name: 'Raw'}];

var ReqDetail = React.createClass({
	render: function() {
		return (
			<div className="w-detail-request">
				<BtnGroup btns={BTNS} />
			</div>
		);
	}
});

module.exports = ReqDetail;


