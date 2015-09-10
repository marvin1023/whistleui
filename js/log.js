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
		
		$(container).on('click', '.w-level', function() {
			container.scrollTop = content.offsetHeight;
		}).on('scroll', function() {
			var data = self.state.logs;
			if (data && scrollAtBottom()) {
				var len = data.length - 110;
				if (len > 0) {
					data.splice(0, len);
				}
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
					<ul ref="content">
						{logs.map(function(log) {
							
							return (
								<li key={log.id} className={'w-' + log.level}>
									<label className="w-level" title="Auto scroll">{log.level}<span className="glyphicon glyphicon-arrow-down" aria-hidden="true"></span></label>
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