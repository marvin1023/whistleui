require('./base-css.js');
require('../css/detail.css');
var React = require('react');
var util = require('./util');
var events = require('./events');
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
	componentDidMount: function() {
		var self = this;
		events.on('showOverview', function() {
			self.toggleTab(TABS[0]);
		}).on('composer', function() {
			self.toggleTab(TABS[4]);
		});
	},
	toggleTab: function(tab) {
		this.selectTab(tab);
		this.setState({tab: tab});
	}, 
	selectTab: function(tab) {
		tab.active = true;
		this.state.tab = tab;
		this.state['inited' + tab.name] = true;
	},
	render: function() {
		var modal = this.props.modal;
		var selectedList = modal && modal.getSelectedList();
		var activeItem = modal && modal.getActive();
		var curTab = this.state.tab;
		if (!curTab && activeItem) {
			curTab = TABS[0];
			TABS.forEach(function(tab) {
				tab.active = false;
			});
			this.selectTab(curTab);
		}
		var name = curTab && curTab.name;
		
		return (
				<div className="fill orient-vertical-box w-detail">
				<BtnGroup onClick={this.toggleTab} tabs={TABS} />
				{this.state.initedOverview ? <Overview modal={activeItem} hide={name != TABS[0].name} /> : ''}
				{this.state.initedRequest ? <ReqDetail modal={activeItem} hide={name != TABS[1].name} /> : ''}
				{this.state.initedResponse ? <ResDetail modal={activeItem} hide={name != TABS[2].name} /> : ''}
				{this.state.initedTimeline ? <Timeline modal={modal} hide={name != TABS[3].name} /> : ''}
				{this.state.initedComposer ? <Composer modal={activeItem} hide={name != TABS[4].name} /> : ''}
				{this.state.initedLog ? <Log hide={name != TABS[5].name} /> : ''}
			</div>
		);
	}
});

module.exports = ReqData;