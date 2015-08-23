require('./base-css.js');
var React = require('react');
var dataCenter = require('./data-center');
var util = require('./util');

var Online = React.createClass({
	componentWillMount: function() {
		var self = this;
		dataCenter.on('serverInfo', function(data) {
			self.setState({server: data});
		});
	},
	showServerInfo: function() {
		var server = util.getProperty(this, 'state.server');
		if (!server) {
			return;
		}
		
	},
	render: function() {
		var info = [];
		var server = util.getProperty(this, 'state.server');
		if (server) {
			if (server.host) {
				info.push('Host:');
				info.push(server.host);
			}
			if (server.ipv4.length) {
				info.push('IPv4:');
				info.push.apply(info, server.ipv4);
			}
			if (server.ipv4.length) {
				info.push('IPv6:');
				info.push.apply(info, server.ipv6);
			}
		}
		return (
				<a className="w-online-menu" title={info.join('\n')} href="javascript:;" 
					className={'w-online' + (server ? '' : ' w-offline')} onClick={this.showServerInfo.bind(this)}>
					<span className="glyphicon glyphicon-stats"></span>Online
				</a>
		);
	}
});

module.exports = Online;