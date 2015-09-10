require('./base-css.js');
require('../css/log.css');
var React = require('react');
var util = require('./util');
var dataCenter = require('./data-center');

var Log = React.createClass({
	componentDidMount: function() {
		var self = this;
		dataCenter.on('log', function(data) {
			var len = data.length - 120;
			if (len > 0) {
				data.splice(0, len);
			}
			self.setState({logs: data});
		});
	},
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	render: function() {
		var logs = this.state && this.state.logs || [];
		return (
				<div  className={'fill orient-vertical-box w-detail-content w-detail-log' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
					<ul>
						{logs.map(function(log) {
							
							return (
								<li key={log.id} className={'w-' + log.level}>
									<label className="w-level">{log.level}</label>
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