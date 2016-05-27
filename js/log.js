require('./base-css.js');
require('../css/log.css');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var BtnGroup = require('./btn-group');
var util = require('./util');
var dataCenter = require('./data-center');
var BTNS = [{
	name: 'Page',
	icon: 'file',
	active: true
}, {
	name: 'System',
	icon: 'exclamation-sign'
}];

var Log = React.createClass({
	componentDidMount: function() {
		var self = this;
		var container = ReactDOM.findDOMNode(self.refs.container);
		var content = ReactDOM.findDOMNode(self.refs.content);
		var sysContainer = ReactDOM.findDOMNode(self.refs.sysContainer);
		var sysContent = ReactDOM.findDOMNode(self.refs.sysContent);
		document.cookie = '_logComponentDidMount=1';
		dataCenter.on('log', function(data, sysLogs) {
			var atBottom = self.isPageLog() ? scrollAtBottom() : scrollAtBottom(sysContainer, sysContent);
			if (atBottom) {
				var len = data.length - 119;
				if (len > 0) {
					data.splice(0, len);
				}
			}
			
			self.setState({logs: data, sysLogs: sysLogs}, function() {
				if (atBottom) {
					if (self.isPageLog()) {
						container.scrollTop = content.offsetHeight;
					} else {
						sysContainer.scrollTop = content.sysContent;
					}
				}
			});
		});
		var timeout, sysTimeout;
		$(container).on('scroll', function() {
			var data = self.state.logs;
			timeout && clearTimeout(timeout);
			if (data && scrollAtBottom()) {
				timeout = setTimeout(function() {
					var len = data.length - 110;
					if (len > 0) {
						data.splice(0, len);
						self.setState({logs: data});
					}
				}, 2000);
			}
		});
		
		$(sysContainer).on('scroll', function() {
			var data = self.state.sysLogs;
			sysTimeout && clearTimeout(timeout);
			if (data && scrollAtBottom(sysContainer, sysContent)) {
				sysTimeout = setTimeout(function() {
					var len = data.length - 110;
					if (len > 0) {
						data.splice(0, len);
						self.setState({});
					}
				}, 2000);
			}
		});
		
		function scrollAtBottom(con, ctn) {
			con = con || container;
			ctn = ctn || content;
			return con.scrollTop + con.offsetHeight + 5 > ctn.offsetHeight;
		}
	},
	clearLogs: function() {
		var data = this.isPageLog() ? this.state.logs : this.state.sysLogs;
		data && data.splice(0, data.length);
		this.setState({});
	},
	autoScroll: function() {
		var container = ReactDOM.findDOMNode(self.isPageLog() ? self.refs.container : self.refs.sysContainer);
		var content = ReactDOM.findDOMNode(self.isPageLog() ? self.refs.content : self.refs.sysContent);
		container.scrollTop = content.offsetHeight;
	},
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	toggleTabs: function(btn) {
		this.setState({});
	},
	isPageLog: function() {
		return BTNS[0].active;
	},
	render: function() {
		var state = this.state || {};
		var logs = state.logs || [];
		var sysLogs = state.sysLogs || [];
		var isPageLog = this.isPageLog();
		var hasLogs = isPageLog ? logs.length : sysLogs.length;
		
		return (
				<div className={'fill orient-vertical-box w-detail-log' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
					<div style={{display: hasLogs ? 'block' : 'none'}} className="w-detail-log-bar">
						<a className="w-auto-scroll-log" href="javascript:;" onClick={this.autoScroll}>AutoScroll</a>
						<a className="w-clear-log" href="javascript:;" onClick={this.clearLogs}>Clear</a>
					</div>
					<BtnGroup onClick={this.toggleTabs} btns={BTNS} />
					<div ref="container" className={'fill orient-vertical-box w-detail-page-log' + (isPageLog ? '' : ' hide')}>
						<ul ref="content">
							{logs.map(function(log) {
								
								return (
									<li key={log.id} title={log.level.toUpperCase()} className={'w-' + log.level}>
										<pre>
											{'Date: ' + (new Date(log.date)).toLocaleString() + '\r\n' + log.text}
										</pre>
									</li>		
								);
							})}
						</ul>
					</div>
					<div ref="sysContainer" className={'fill orient-vertical-box w-detail-sys-log' + (!this.isPageLog() ? '' : ' hide')}>
						<ul ref="sysContent">
							{sysLogs.map(function(log) {
								
								return (
									<li key={log.id} title={log.level.toUpperCase()} className={'w-' + log.level}>
										<pre>
											{'Date: ' + (new Date(log.date)).toLocaleString() + '\r\n' + log.text}
										</pre>
									</li>		
								);
							})}
						</ul>
					</div>
			</div>
		);
	}
});

module.exports = Log;