require('./base-css.js');
require('../css/detail.css');
var React = require('react');
var util = require('./util');
var BtnGroup = require('./btn-group');
var Overview = require('./overview');
var ReqDetail = require('./req-detail');
var ResDetail = require('./res-detail');
var Timeline = require('./timeline');
var Composer = require('./composer');
var Log = require('./log');
var TABS = [{
				name: 'Overview',
				icon: 'eye-open'
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
	_handleTab: function(tab) {
		this.setState({tab: tab});
	}, 
	componentDidMount: function() {
		
	},
	render: function() {
		return (
				<div className="fill orient-vertical-box w-detail">
				<BtnGroup onClick={this._handleTab} tabs={TABS} />
				<div className={'fill orient-vertical-box w-detail-content w-show-detail-' + util.getProperty(this, 'state.tab.name', '').toLowerCase()}>
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