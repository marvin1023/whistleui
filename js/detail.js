require('./base-css.js');
require('../css/detail.css');
var React = require('react');
var $ = require('jquery');
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
			var modal = self.props.modal;
			self.showComposer(modal && modal.getActive());
		});
	},
	showComposer: function(item) {
		if (item) {
			this.state.activeItem = item;
		}
		this.toggleTab(TABS[4], function() {
			events.trigger('setComposer');
		});
	},
	onDragEnter: function(e) {
		if (e.dataTransfer.types.indexOf('reqdataid') != -1) {
			this.showComposer();
			e.preventDefault();
		}
	},
	onDrop: function(e) {
		var modal = this.props.modal;
		var id = e.dataTransfer.getData('reqDataId');
		var list = modal && modal.list;
		if (!id || !list) {
			return;
		}
		for (var i = 0, len = list.length; i < len; i++) {
			var data = list[i];
			if (data && data.id === id) {
				return this.showComposer(data);
			}
		}
	},
	toggleTab: function(tab, callback) {
		this.selectTab(tab);
		this.setState({tab: tab}, callback);
	}, 
	selectTab: function(tab) {
		TABS.forEach(function(tab) {
			tab.active = false;
		});
		tab.active = true;
		this.state.tab = tab;
		this.state['inited' + tab.name] = true;
	},
	render: function() {
		var modal = this.props.modal;
		var selectedList = modal && modal.getSelectedList();
		var activeItem;
		var overview;
		if (selectedList && selectedList.length > 1) {
			overview = {
				req: {
					size: 0,
					headers: {}
				},
				res: {
					size: 0,
					headers: {}
				}
			};
			var startTime;
			selectedList.forEach(function(item) {
				if (overview.startTime == null || overview.startTime > item.startTime) {
					overview.startTime = item.startTime;
				}
				if (overview.endTime == null || overview.endTime < item.endTime) {
					overview.endTime = item.endTime;
				}
				if (item.req.size > 0) {
					overview.req.size += item.req.size > 0;
				}
				if (item.res.size > 0) {
					overview.res.size += item.res.size > 0;
				}
			});
		} else {
			overview = activeItem = modal && modal.getActive();
		}
		var curTab = this.state.tab;
		if (!curTab && overview) {
			curTab = TABS[0];
			TABS.forEach(function(tab) {
				tab.active = false;
			});
			this.selectTab(curTab);
		}
		var name = curTab && curTab.name;
		
		return (
				<div className="fill orient-vertical-box w-detail" onDragEnter={this.onDragEnter} onDrop={this.onDrop}>
				<BtnGroup onClick={this.toggleTab} tabs={TABS} />
				{this.state.initedOverview ? <Overview modal={overview} hide={name != TABS[0].name} /> : ''}
				{this.state.initedRequest ? <ReqDetail modal={activeItem} hide={name != TABS[1].name} /> : ''}
				{this.state.initedResponse ? <ResDetail modal={activeItem} hide={name != TABS[2].name} /> : ''}
				{this.state.initedTimeline ? <Timeline modal={modal} hide={name != TABS[3].name} /> : ''}
				{this.state.initedComposer ? <Composer modal={this.state.activeItem} hide={name != TABS[4].name} /> : ''}
				{this.state.initedLog ? <Log hide={name != TABS[5].name} /> : ''}
			</div>
		);
	}
});

module.exports = ReqData;