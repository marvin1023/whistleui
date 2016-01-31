require('./base-css.js');
require('../css/about.css');
var $ = window.jQuery = require('jquery'); //for bootstrap
require('bootstrap/dist/js/bootstrap.js');
var React = require('react');
var dataCenter = require('./data-center');
var dialog;

function compareVersion(v1, v2) {
	return formatSemer(v1) > formatSemer(v2);
}

function formatSemer(ver) {
	return ver ? ver.split('.').map(function(v) {
		v = parseInt(v, 10) || 0;
		return v > 9 ? v : '0' + v;
	}).join('.') : '';
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
			          '<span class="w-about-dialog-ctn"><span class="w-about-dialog-title">Whistle for Web Developers.</span>' +
					  'Version: <span class="w-about-version">' + version + '</span><br>' +
					  '<span class="w-about-latest-version">Latest version: <a class="w-about-github" href="https://github.com/avwo/whistle/wiki/%E6%9B%B4%E6%96%B0whistle" target="_blank">' + latest + '</a><br></span>' +
					  'Visit <a class="w-about-url" title="How to update whistle" href="http://www.whistlejs.com/#v=' + version + '" target="_blank">http://www.whistlejs.com</a></span>' +
					  '<div class="w-about-plugins">Installed plugins:<div class="w-about-plugins-list"></div></div>' +
					  '</div>' + 
				      '<div class="modal-footer">' + 
				        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' + 
				      '</div>' + 
				    '</div>' + 
				  '</div>' + 
				'</div>').appendTo(document.body);
		var curVersion = dialog.find('.w-about-version');
		var latestVersionWrapper = dialog.find('.w-about-latest-version');
		var latestVersion = dialog.find('.w-about-github');
		var aboutUrl = dialog.find('.w-about-url');
		
		function updateVersion(data) {
			if (!data) {
				return;
			}
			var version = data.version;
			var latest = data.latestVersion;
			if (compareVersion(latest, version)) {
				latestVersionWrapper.css('display', 'inline');
				latestVersion.text(latest);
			} else {
				latestVersionWrapper.hide();
			}
			curVersion.text(version);
			aboutUrl.attr('href', 'http://www.whistlejs.com#v=' + version);
		}
		updateVersion(data);
		setPlugins(data.plugins);
		dataCenter.on('serverInfo', updateVersion);
	}
	
	dataCenter.getPlugins(function(data) {
		if (!data || data.ec !== 0) {
			return;
		}
		setPlugins(data.plugins);
	});
	
	function setPlugins(plugins) {
		var pluginsNames = plugins && Object.keys(plugins);
		if (!pluginsNames || !pluginsNames.length) {
			dialog.find('.w-about-plugins').hide();
			return;
		}
		
		var thead = '<thead><tr><td class="w-about-plugin-name">Name</td><td class="w-about-plugin-version">Version</td><td class="w-about-plugin-homepage">Homepage</td></tr></thead>';
		dialog.find('.w-about-plugins').show();
		dialog.find('.w-about-plugins-list')
				.html('<table class="table">' + thead + '<tbody>' + pluginsNames.map(function(name) {
					var pkg = plugins[name];
					name = name.slice(0, -1);
					var homepage = pkg.homepage || '';
					var configPage = 'http://' + name + '.local.whistlejs.com/';
					return '<tr><td><a title="' + configPage + '" href="' + configPage + '" target="_blank">' 
					+ name + '</a></td><td title="' + pkg.version + '">' + pkg.version + 
					'</td><td><a title="' + homepage + '" href="' + homepage + '" target="_blank">' + homepage + '</a></td></tr>';
				}).join('') + '</tbody></table>');
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
			
			self.setState({
				hasUpdate: compareVersion(data.latestVersion, data.version) && compareVersion(data.latestVersion, localStorage.latestVersion)
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