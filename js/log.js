require('./base-css.js');
require('../css/log.css');
var $ = require('jquery');
var React = require('react');
var util = require('./util');
var dataCenter = require('./data-center');

var Log = React.createClass({
	componentDidMount: function() {
		var self = this;
		var container = self.refs.container.getDOMNode();
		var content = self.refs.content.getDOMNode();
		
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
		
		$(container).on('scroll', function() {
			var data = self.state.logs;
			if (data && scrollAtBottom()) {
				var len = data.length - 110;
				if (len > 0) {
					data.splice(0, len);
					self.setState({logs: data});
				}
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
	render: function() {
		var logs = this.state && this.state.logs || [];
		return (
				<div ref="container" className={'fill orient-vertical-box w-detail-content w-detail-log' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
					<div style={{display: logs.length ? 'block' : 'none'}} className="w-detail-log-bar">
						<a className="w-auto-scroll-log" href="javascript:;">AutoScroll</a>
						<a className="w-clear-log" href="javascript:;">Clear</a>
					</div>
					<ul ref="content">
						{logs.map(function(log) {
							
							return (
								<li key={log.id} className={'w-' + log.level}>
									<pre>
										{'Date: ' + (new Date(log.date)).toLocaleString() + '\r\n' + log.text}
									</pre>
								</li>		
							);
						})}
					</ul>
			</div>
		);
	}
});

module.exports = Log;