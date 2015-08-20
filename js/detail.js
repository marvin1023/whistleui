require('./base-css.js');
require('../css/detail.css');
var React = require('react');
var BtnGroup = require('./btn-group');
var Overview = require('./overview');
var ReqDetail = require('./req-detail');
var ResDetail = require('./res-detail');
var Timeline = require('./timeline');
var Composer = require('./composer');
var Log = require('./log');
var TABS = [{
				name: 'Overview',
				icon: 'eye-open',
				active: true
			}, {
				name: 'Request',
				icon: 'send'
			}, {
				name: 'Response',
				icon: 'flash'
			}, {
				name: 'Timeline',
				icon: 'align-justify'
			}, {
				name: 'Composer',
				icon: 'edit'
			}, {
				name: 'Log',
				icon: 'file'
			}];

var ReqData = React.createClass({
	_handleTab: function(btn) {
		
	}, 
	componentDidMount: function() {
		
	},
	render: function() {
		
		return (
				<div className="fill orient-vertical-box w-detail">
				<BtnGroup tabs={TABS} />
				<div className="w-detail-content fill">
					<div className="w-detail-divider"></div>
					<Overview />
					<ReqDetail />
					<ResDetail />
					<Timeline />
					<Composer />
					<Log />
				</div>
			</div>
		);
	}
});

module.exports = ReqData;