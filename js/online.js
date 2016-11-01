require('./base-css.js');
require('../css/online.css');
var $ = window.jQuery = require('jquery'); //for bootstrap
require('bootstrap/dist/js/bootstrap.js');
var React = require('react');
var Dialog = require('./dialog');
var dataCenter = require('./data-center');
var INDENT = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
var dialog;

function createDialog() {
	if (!dialog) {
		dialog = $('<div class="modal fade w-online-dialog">' + 
				  '<div class="modal-dialog">' + 
				    '<div class="modal-content">' + 
				      '<div class="modal-body">' + 
				      '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				        '<div class="w-online-dialog-ctn"></div>' + 
				      '</div>' + 
				      '<div class="modal-footer">' + 
				        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' + 
				      '</div>' + 
				    '</div>' + 
				  '</div>' + 
				'</div>').appendTo(document.body);
	}
	
	return dialog;
}

var Online = React.createClass({
	getInitialState: function() {
		return {};
	},
	componentWillMount: function() {
		var self = this;
		dataCenter.on('serverInfo', function(data) {
			self.updateServerInfo(data);
			data && self.checkServerChanged(data);
			self.setState({server: data});
		});
		
	},
	checkServerChanged: function(data) {
		if (this.macAddr === undefined) {
			this.macAddr = data.mac || '';
			this.serverPort = data.port;
		} else if (this.macAddr != (data.mac || '') || this.serverPort != data.port) {
			this.refs.confirmReload.show();
		} else {
			this.refs.confirmReload.hide();
		}
	},
	showServerInfo: function() {
		if (!this.state.server) {
		  return;
		}
	  this.updateServerInfo(this.state.server);
		dialog.modal('show');
	},
	updateServerInfo: function(server) {
		var info = [];
		if (server) {
			if (server.host) {
				info.push('<h5><strong>Host:</strong> ' + server.host + '</h5>');
			}
			if (server.nodeVersion) {
				info.push('<h5><strong>Node:</strong> ' + server.nodeVersion + '</h5>');
			}
			if (server.port) {
				info.push('<h5><strong>Port:</strong> ' + server.port + '</h5>');
			}
			if (server.ipv4.length) {
				info.push('<h5><strong>IPv4:</strong></h5>');
				info.push('<p>' + INDENT + server.ipv4.join('<br/>' + INDENT) + '</p>');
			}
			if (server.ipv6.length) {
				info.push('<h5><strong>IPv6:</strong></h5>');
				info.push('<p>' + INDENT + server.ipv6.join('<br/>' + INDENT) + '</p>');
			}
		}
		
		var ctn = createDialog().find('.w-online-dialog-ctn').html(info.join(''));
		server && ctn.find('h5:first').attr('title', server.host);
		dialog.find('.w-ip').prop('placeholder', server && server.ipv4[0] || '127.0.0.1');
		dialog.find('.w-port').prop('placeholder', server && server.port || '8899');
	},
	reload: function() {
		location.reload();
	},
	render: function() {
		var info = [];
		var server = this.state.server;
		if (server) {
			if (server.host) {
				info.push('Host: ' + server.host);
			}
			
			if (server.port) {
				info.push('Port: ' + server.port);
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
					<Dialog ref="confirmReload" wstyle="w-confirm-reload-dialog">
						<div className="modal-body w-confirm-reload">
							<button type="button" className="close" data-dismiss="modal">
								<span aria-hidden="true">&times;</span>
							</button>
							Proxy Server has been changed, whether to refresh the page to reload the data.
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
							<button type="button" className="btn btn-primary" onClick={this.reload}>Reload</button>
						</div>
					</Dialog>
				</a>
		);
	}
});

module.exports = Online;