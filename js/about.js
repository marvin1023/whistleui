require('./base-css.js');
require('../css/about.css');
var $ = window.jQuery = require('jquery'); //for bootstrap
require('bootstrap/dist/js/bootstrap.js');
var React = require('react');
var dataCenter = require('./data-center');
var dialog;

function compareVersion(v1, v2) {
	if (!v1) {
		return false;
	}
	if (!v2) {
		return true;
	}
	v1 = v1.split('.');
	v2 = v2.split('.');
	var v1Major = parseInt(v1[0], 10) || 0;
	var v2Major = parseInt(v2[0], 10) || 0;
	
	if (v1Major < v2Major) {
		return false;
	}
	
	if (v1Major > v2Major) {
		return true;
	}
	
	return parseInt(v1[1], 10) > parseInt(v2[1], 10);
}

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
					  (!latest || latest == version ? '' : 'Latest version: <span class="w-about-version"><a class="w-about-github" href="https://github.com/avwo/whistle/wiki/%E6%9B%B4%E6%96%B0whistle" target="_blank">' + latest + '</a></span><br>') +
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
	showAboutInfo: function(showTips) {
		this._showUpdateTips(function(data) {
			createDialog(data).modal('show');
			if (data.latestVersion) {
				localStorage.latestVersion = data.latestVersion;
			}
		});
	},
	_showUpdateTips: function(callback) {
		var self = this;
		dataCenter.getInitialData(function(data) {
			callback && callback(data);
			var version = data.version;
			var latest = data.latestVersion;
			
			self.setState({
				hasUpdate: !latest || localStorage.latestVersion == latest ? false : latest != version
			});
		});
	},
	componentDidMount: function() {
		this._showUpdateTips();
	},
	render: function() {
		return (
				<a onClick={this.showAboutInfo} className="w-about-menu" href="javascript:;"><i style={{display: this.state && this.state.hasUpdate ? 'block' : ''}}></i><span className="glyphicon glyphicon-info-sign"></span>About</a>
		);
	}
});

module.exports = About;