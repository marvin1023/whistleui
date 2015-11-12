require('./base-css.js');
require('../css/about.css');
var $ = window.jQuery = require('jquery'); //for bootstrap
require('bootstrap/dist/js/bootstrap.js');
var React = require('react');
var dataCenter = require('./data-center');
var dialog;

function createDialog(data) {
	if (!dialog) {
		var version = data.version;
		var latest = data.latestVersion;
		dialog = $('<div class="modal fade w-about-dialog">' + 
				  '<div class="modal-dialog">' + 
				    '<div class="modal-content">' + 
				      '<div class="modal-body">' + 
				      '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				        '<img alt="logo" src="/img/whistle.png">' + 
			          '<span" class="w-about-dialog-ctn"><span class="w-about-dialog-title">Whistle for Web Developers.</span>' +
					  'Version: <span class="w-about-version">' + version + '</span><br>' +
					  (!latest || latest == version ? '' : 'Latest version: <span class="w-about-version"><a class="w-about-url" href="https://github.com/avwo/whistle/wiki/%E6%9B%B4%E6%96%B0whistle" target="_blank">' + latest + '</a></span><br>') +
					  'Visit <a class="w-about-url" title="How to update whistle" href="http://www.whistlejs.com#v=' + version + '" target="_blank">http://www.whistlejs.com</a></span>' +
				      '</div>' + 
				      '<div class="modal-footer">' + 
				        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' + 
				      '</div>' + 
				    '</div>' + 
				  '</div>' + 
				'</div>').appendTo(document.body);
		dataCenter.on('serverInfo', function(server) {
			if (!server) {
				return;
			}
			dialog.find('.w-about-version').html(server.version);
			dialog.find('.w-about-url').attr('href', 'http://www.whistlejs.com#v=' + server.version);
		});
	}
	
	return dialog;
}

var About = React.createClass({
	showAboutInfo: function() {
		var self = this;
		dataCenter.getInitialData(function(data) {
			createDialog(data).modal('show');
			
			var version = data.version;
			var latest = data.latestVersion;
			var _latest = localStorage.latestVersion;
			if (_latest == latest) {
				latest = null;
			} else if (latest) {
				localStorage.latestVersion = latest;
			}
			self.setState({
				hasUpdate: !!latest && latest != version
			});
		});
	},
	render: function() {
		return (
				<a onClick={this.showAboutInfo} className="w-about-menu" href="javascript:;"><i style={{display: this.state && this.state.hasUpdate ? 'block' : ''}}></i><span className="glyphicon glyphicon-info-sign"></span>About</a>
		);
	}
});

module.exports = About;