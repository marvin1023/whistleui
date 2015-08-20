require('./base-css.js');
require('../css/res-detail.css');
var React = require('react');
var BtnGroup = require('./btn-group');
BTNS = [{name: 'Headers', active: true}, 'TextView', 'Cookies', 'JSON', 'Raw'];

var ResDetail = React.createClass({
	render: function() {
		return (
			<div className="w-detail-response">
				<BtnGroup btns={BTNS} />
			</div>
		);
	}
});

module.exports = ResDetail;
