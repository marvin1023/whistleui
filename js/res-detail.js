require('./base-css.js');
require('../css/res-detail.css');
var React = require('react');
var BtnGroup = require('./btn-group');
BTNS = [{name: 'Headers'}, {name: 'TextView'}, {name: 'Cookies'}, {name: 'JSON'}, {name: 'Raw'}];

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
