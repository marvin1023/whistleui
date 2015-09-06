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
	getInitialState: function() {
		
		return {
			showOverview: false,
			showRequest: false,
			showResponse: false,
			showTimeline: false,
			showComposer: false,
			showLog: false
		};
	},
	toggleTab: function(tab) {
		var state = {tab: tab};
		state['show' + tab.name] = true;
		this.setState(state);
	}, 
	render: function() {
		var modal = this.props.modal;
		var selectedList = modal && modal.getSelectedList();
		
		return (
				<div className="fill orient-vertical-box w-detail">
				<BtnGroup onClick={this.toggleTab} tabs={TABS} />
				<div className={'fill orient-vertical-box w-detail-content w-show-detail-' + util.getProperty(this, 'state.tab.name', '').toLowerCase()}>
					{this.state.showOverview ? <Overview /> : ''}
					{this.state.showRequest ? <ReqDetail /> : ''}
					{this.state.showResponse ? <ResDetail /> : ''}
					{this.state.showTimeline ? <Timeline /> : ''}
					{this.state.showComposer ? <Composer /> : ''}
					{this.state.showLog ? <Log /> : ''}
				</div>
			</div>
		);
	}
});

module.exports = ReqData;