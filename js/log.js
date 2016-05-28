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
	name: 'Server',
	icon: 'exclamation-sign'
}];

var Log = React.createClass({
	componentDidMount: function() {
		var self = this;
		var container = ReactDOM.findDOMNode(self.refs.container);
		var content = ReactDOM.findDOMNode(self.refs.content);
		var svrContainer = ReactDOM.findDOMNode(self.refs.svrContainer);
		var svrContent = ReactDOM.findDOMNode(self.refs.svrContent);
		document.cookie = '_logComponentDidMount=1';
		dataCenter.on('log', function(logs, svrLogs) {
			var isPageLog = self.isPageLog();
			var atBottom = isPageLog ? scrollAtBottom() : scrollAtBottom(svrContainer, svrContent);
			var data = isPageLog ? logs : svrLogs;
			if (atBottom) {
				var len = data.length - 119;
				if (len > 0) {
					data.splice(0, len);
				}
			}
			var state = {logs: logs, svrLogs: svrLogs};
			if (isPageLog) {
				state.atPageLogBottom = atBottom;
			} else {
				state.atSvrLogBottom = atBottom;
			}
			self.setState(state, function() {
				if (atBottom) {
					if (isPageLog) {
						container.scrollTop = content.offsetHeight;
					} else {
						svrContainer.scrollTop = svrContent.offsetHeight;
					}
				}
			});
		});
		var timeout, svrTimeout;
		$(container).on('scroll', function() {
			var data = self.state.logs;
			timeout && clearTimeout(timeout);
			if (data && (self.state.atPageLogBottom = scrollAtBottom())) {
				timeout = setTimeout(function() {
					var len = data.length - 110;
					if (len > 0) {
						data.splice(0, len);
						self.setState({logs: data});
					}
				}, 2000);
			}
		});
		
		$(svrContainer).on('scroll', function() {
			var data = self.state.svrLogs;
			svrTimeout && clearTimeout(svrTimeout);
			if (data && (self.state.atSvrLogBottom = scrollAtBottom(svrContainer, svrContent))) {
				svrTimeout = setTimeout(function() {
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
		var data = this.isPageLog() ? this.state.logs : this.state.svrLogs;
		data && data.splice(0, data.length);
		this.setState({});
	},
	autoRefresh: function() {
		var self = this;
		var container = ReactDOM.findDOMNode(self.isPageLog() ? self.refs.container : self.refs.svrContainer);
		var content = ReactDOM.findDOMNode(self.isPageLog() ? self.refs.content : self.refs.svrContent);
		container.scrollTop = content.offsetHeight;
	},
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	toggleTabs: function(btn) {
		this.setState({}, function() {
			if (this.isPageLog()) {
				if (this.state.atPageLogBottom !== false) {
					var container = ReactDOM.findDOMNode(this.refs.container);
					var content = ReactDOM.findDOMNode(this.refs.content);
					container.scrollTop = content.offsetHeight;
				}
			} else {
				if (this.state.atSvrLogBottom !== false) {
					var container = ReactDOM.findDOMNode(this.refs.svrContainer);
					var content = ReactDOM.findDOMNode(this.refs.svrContent);
					container.scrollTop = content.offsetHeight;
				}
			}
		});
	},
	isPageLog: function() {
		return BTNS[0].active;
	},
	render: function() {
		var state = this.state || {};
		var logs = state.logs || [];
		var svrLogs = state.svrLogs || [];
		var isPageLog = this.isPageLog();
		var hasLogs = isPageLog ? logs.length : svrLogs.length;
		
		return (
				<div className={'fill orient-vertical-box w-detail-log' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
					<div style={{display: hasLogs ? 'block' : 'none'}} className="w-detail-log-bar">
						<a className="w-auto-scroll-log" href="javascript:;" onClick={this.autoRefresh}>AutoRefresh</a>
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
					<div ref="svrContainer" className={'fill orient-vertical-box w-detail-svr-log' + (!this.isPageLog() ? '' : ' hide')}>
						<ul ref="svrContent">
							{svrLogs.map(function(log) {
								
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