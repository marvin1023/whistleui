require('./base-css.js');
var React = require('react');
var dataCenter = require('./data-center');

var Online = React.createClass({
	getInitialState: function() {
		return {};
	},
	componentWillMount: function() {
		var self = this;
		dataCenter.on('serverInfo', function(data) {
			self.setState({server: data});
		});
	},
	showServerInfo: function() {
		var server = this.state.server;
		if (!server) {
			return;
		}
		
		if (!this._dialog) {
			var dialog = <div ref="dialog"></div>;
			this._dialog = dialog.refs.dialog.getDOMNode();
		}
		
	},
	render: function() {
		var info = [];
		var server = this.state.server;
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
					className={'w-online' + (server ? '' : ' w-offline')} onClick={this.showServerInfo}>
					<span className="glyphicon glyphicon-stats"></span>{server ? 'Online' : 'Offline'}
				</a>
		);
	}
});

module.exports = Online;