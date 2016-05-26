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
		
		dataCenter.on('log', function(data) {
			var atBottom = scrollAtBottom();
			if (atBottom) {
				var len = data.length - 119;
				if (len > 0) {
					data.splice(0, len);
				}
			}
			
			self.setState({logs: data}, function() {
				if (atBottom) {
					container.scrollTop = content.offsetHeight;
				}
			});
		});
		var timeout;
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
		}).on('click', '.w-auto-scroll-log', function() {
			container.scrollTop = content.offsetHeight;
		}).on('click', '.w-clear-log', function() {
			var data = self.state.logs;
			if (data) {
				data.splice(0, data.length);
				self.setState({logs: data});
			}
		});
		
		function scrollAtBottom() {
			return container.scrollTop + container.offsetHeight + 5 > content.offsetHeight;
		}
	},
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	toggleTab: function() {
		
	},
	render: function() {
		var logs = this.state && this.state.logs || [];
		return (
				<div ref="container" className={'fill orient-vertical-box w-detail-log' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
					<div style={{display: logs.length ? 'block' : 'none'}} className="w-detail-log-bar">
						<a className="w-auto-scroll-log" href="javascript:;">AutoScroll</a>
						<a className="w-clear-log" href="javascript:;">Clear</a>
					</div>
					<BtnGroup onClick={this.toggleTab} btns={BTNS} />
					<div className="fill orient-vertical-box w-detail-page-log">
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
					<div className="fill orient-vertical-box w-detail-sys-log hide">
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
			</div>
		);
	}
});

module.exports = Log;