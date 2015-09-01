require('./base-css.js');
require('../css/online.css');
var $ = window.jQuery = require('jquery'); //for bootstrap
require('bootstrap/dist/js/bootstrap.js');
var React = require('react');
var dataCenter = require('./data-center');
var dialog;

function createDialog() {
	if (!dialog) {
		dialog = $('<div class="modal fade w-online-dialog">' + 
				  '<div class="modal-dialog">' + 
				    '<div class="modal-content">' + 
				      '<div class="modal-body">' + 
				      '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				        '<div class="w-online-dialog-ctn"></div>' + 
				        '<div class="w-switch-to-server"><h5>Switch to:</h5>' + 
				        '<input class="w-ip" maxlength="256" type="text" placeholder="127.0.0.1" /> : <input maxlength="5" class="w-port" type="text" placeholder="8899" />' +
				        '</div>' +
				      '</div>' + 
				      '<div class="modal-footer">' + 
				        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' + 
				        '<button type="button" class="btn btn-primary w-switch-btn">Switch</button>' + 
				      '</div>' + 
				    '</div>' + 
				  '</div>' + 
				'</div>').appendTo(document.body);
		dialog.on('click', '.w-switch-btn', function() {
			var ipInput = dialog.find('.w-ip');
			var ip = $.trim(ipInput.val()) || ipInput.prop('placeholder');
			var portInput = dialog.find('.w-port');
			var port = $.trim(portInput.val()) || portInput.prop('placeholder');
			if (!/^\d+$/.test(port)) {
				alert('Please enter the port number of the whistle server.');
				portInput.focus();
				return;
			}
			dataCenter.checkExists({ip: ip, port: port}, function(exists) {
				var host = ip + ':' + port;
				if (!exists) {
					alert('Please check if the whistle server(' + host + ') is started.');
					return;
				}
				host = 'http://' + host + location.pathname + location.search + location.hash;
				if (location.href != host) {
					location.href = host;
				} else {
					dialog.modal('hide');
				}
			});
		});
		dialog.find('input').keydown(function(e) {
			e.keyCode == 13 && dialog.find('.w-switch-btn').trigger('click');
		});
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
			self.setState({server: data});
		});
	},
	showServerInfo: function() {
		var server = this.state.server;
		if (!server) {
			return;
		}
		var info = [];
		if (server.host) {
			info.push('<h5>Host: ' + server.host + '</h5>');
		}
		if (server.port) {
			info.push('<h5>Port: ' + server.port + '</h5>');
		}
		if (server.ipv4.length) {
			info.push('<h5>IPv4:</h5>');
			info.push('<p>' + server.ipv4.join('<br/>') + '</p>');
		}
		if (server.ipv4.length) {
			info.push('<h5>IPv6:</h5>');
			info.push('<p>' + server.ipv6.join('<br/>') + '</p>');
		}
		
		createDialog().find('.w-online-dialog-ctn').html(info.join(''));
		dialog.find('.w-ip').prop('placeholder', server.ipv4[0] || '127.0.0.1');
		dialog.find('.w-port').prop('placeholder', server.port || '8899');
		dialog.modal('show');
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
				</a>
		);
	}
});

module.exports = Online;