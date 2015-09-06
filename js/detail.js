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
			initedOverview: false,
			initedRequest: false,
			initedResponse: false,
			initedTimeline: false,
			initedComposer: false,
			initedLog: false
		};
	},
	toggleTab: function(tab) {
		var state = {tab: tab};
		state['inited' + tab.name] = true;
		this.setState(state);
	}, 
	render: function() {
		var modal = this.props.modal;
		var selectedList = modal && modal.getSelectedList();
		var curTab = this.state.tab;
		var name = curTab && curTab.name;
		
		return (
				<div className="fill orient-vertical-box w-detail">
				<BtnGroup onClick={this.toggleTab} tabs={TABS} />
				<div className="fill orient-vertical-box w-detail-content">
					{this.state.initedOverview ? <Overview hide={name != TABS[0].name} /> : ''}
					{this.state.initedRequest ? <ReqDetail hide={name != TABS[1].name} /> : ''}
					{this.state.initedResponse ? <ResDetail hide={name != TABS[2].name} /> : ''}
					{this.state.initedTimeline ? <Timeline hide={name != TABS[3].name} /> : ''}
					{this.state.initedComposer ? <Composer hide={name != TABS[4].name} /> : ''}
					{this.state.initedLog ? <Log hide={name != TABS[5].name} /> : ''}
				</div>
			</div>
		);
	}
});

module.exports = ReqData;