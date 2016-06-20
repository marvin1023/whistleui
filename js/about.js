require('./base-css.js');
require('../css/about.css');
var $ = window.jQuery = require('jquery'); //for bootstrap
require('bootstrap/dist/js/bootstrap.js');
var React = require('react');
var ReactDOM = require('react-dom');
var Dialog = require('./dialog');
var dataCenter = require('./data-center');
var util = require('./util');

function compareVersion(v1, v2) {
	return formatSemer(v1) > formatSemer(v2);
}

function formatSemer(ver) {
	return ver ? ver.split('.').map(function(v) {
		v = parseInt(v, 10) || 0;
		return v > 9 ? v : '0' + v;
	}).join('.') : '';
}

function hasNewVersion(data) {
	return compareVersion(data.latestVersion, data.version) && compareVersion(data.latestVersion, localStorage.latestVersion);
}

var About = React.createClass({
	componentDidMount: function() {
		var self = this;
		dataCenter.getInitialData(function(data) {
			self.setState({
				version: data.version,
				latestVersion: data.latestVersion,
				hasUpdate: hasNewVersion(data)
			});
		});
	},
	showAboutInfo: function(showTips) {
		var self = this;
		var state = self.state || {};
		self.showDialog();
		
		dataCenter.checkUpdate(function(data) {
			if (data && data.ec === 0) {
				if (data.latestVersion) {
					localStorage.latestVersion = data.latestVersion;
				}
				self.setState({
					version: data.version,
					latestVersion: data.latestVersion,
					hasUpdate: hasNewVersion(data)
				});
			}
		});
	},
	showDialog: function() {
		this.refs.aboutDialog.show();
	},
	hideDialog: function() {
		this.refs.aboutDialog.hide();
	},
	render: function() {
		var self = this;
		var state = self.state || {};
		var version = state.version;
		var latest = state.latestVersion;
		
		return (
				<a onClick={self.showAboutInfo} className="w-about-menu" href="javascript:;">
					<i style={{display: state.hasUpdate ? 'block' : ''}}></i><span className="glyphicon glyphicon-info-sign"></span>About
					<Dialog ref="aboutDialog" wstyle="w-about-dialog">
						<div className="modal-body w-about-has-plugins">
							<button type="button" className="close" data-dismiss="modal">
								<span aria-hidden="true">&times;</span>
							</button>
							<img alt="logo" src="/img/whistle.png?v=2016" />
							<span className="w-about-dialog-ctn">
								<span className="w-about-dialog-title">Whistle for Web Developers.</span>
								Version: <span className="w-about-version">{version}</span><br/>
								{compareVersion(latest, version) ? (<span className="w-about-latest-version">
									Latest version: <a className="w-about-github" href="https://github.com/avwo/whistle/wiki/%E6%9B%B4%E6%96%B0whistle" target="_blank">{latest}</a><br/>
								</span>) : ''}
								Visit <a className="w-about-url" title="How to update whistle" href={'http://www.whistlejs.com#v=' + version} target="_blank">http://www.whistlejs.com</a>
							</span>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
						</div>
					</Dialog>
				</a>
		);
	}
});

module.exports = About;

