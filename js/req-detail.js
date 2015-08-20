require('./base-css.js');
require('../css/req-detail.css');
var React = require('react');
var BtnGroup = require('./btn-group');
var BTNS = [{name: 'Headers', active: true}, 'TextView', 'Cookies', 'WebForms', 'Raw'];

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


