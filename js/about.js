require('./base-css.js');
require('../css/about.css');
var $ = window.jQuery = require('jquery'); //for bootstrap
require('bootstrap/dist/js/bootstrap.js');
var React = require('react');
var ReactDOM = require('react-dom');
var Dialog = require('./dialog');
var dataCenter = require('./data-center');
var util = require('./util');
var events = require('./events');
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
	
	dataCenter.plugins.getPlugins(function(data) {
		if (!data || data.ec !== 0) {
			return;
		}
		setPlugins(data.plugins);
	});
	
	function setPlugins(plugins) {
		var pluginsNames = plugins && Object.keys(plugins);
		var dialogBody = dialog.find('.modal-body');
		if (!pluginsNames || !pluginsNames.length) {
			dialogBody.removeClass('w-about-has-plugins');
			return;
		}
		
		var thead = '<thead><tr><td class="w-about-plugin-name">Name</td><td class="w-about-plugin-version">Version</td><td class="w-about-plugin-homepage">Homepage</td></tr></thead>';
		dialogBody.addClass('w-about-has-plugins');
		dialog.find('.w-about-plugins-list')
				.html('<table class="table">' + thead + '<tbody>' + pluginsNames.sort(function(a, b) {
					return a > b ? 1 : -1;
				}).map(function(name) {
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

var PluginsList = React.createClass({
	componentDidMount: function() {
		var self = this;
		if (!self.props.isRules) {
			return;
		}
		
		$(ReactDOM.findDOMNode(this.refs.pluginsList))
				.on('click', '.w-about-plugin-item', function(e) {
					var data = self.props.data[$(e.target).attr('data-key')];
					util.openEditor(data.rules);
					e.preventDefault();
				});
	},
	render: function() {
		var self = this;
		var props = self.props;
		var data = props.data;
		var list = Object.keys(data || {});
		var disabledData = props.disabledData || {};
		
		return (
			<div ref="pluginsList" className={props.wstyle}>
				<table className="table">
					<thead>
						<tr>
							<td className="w-about-plugin-active">Active</td>
							<td className="w-about-plugin-name">Name</td>
							<td className="w-about-plugin-version">Version</td>
							<td className="w-about-plugin-homepage">Homepage</td>
						</tr>
					</thead>
					<tbody>
						{!list.length ? <td colSpan="4" className="w-empty"><a href="https://github.com/avwo/whistle/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8F%92%E4%BB%B6" target="_blank">no data</a></td> : list.map(function(name) {
							var item = data[name];
							name = name.slice(0, -1);
							var configPage = 'http://' + name + '.local.whistlejs.com/';
							return (
								<tr key={name}>
									<td>
										<input type="checkbox" data-name={name} checked={!disabledData[name]} onChange={props.onChange} disabled={props.disabled} />
									</td>
									<td>
										<a title={configPage} href={configPage} className="w-about-plugin-item" data-key={name + ':'} target="_blank">{name}</a>
									</td>
									<td title={item.version}>{item.version}</td>
									<td>
										<a title={item.homepage} href={item.homepage} target="_blank">{item.homepage}</a>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
});

var About = React.createClass({
	componentDidMount: function() {
		var self = this;
		events.on('disableAllRules', function(e, checked) {
			 self.setState({
				 disabledAllRules: checked
			 });
		});
	},
	showAboutInfo: function(showTips) {
		var self = this;
		var state = self.state || {};
		self.showDialog();
		if (!state.plugins) {
			dataCenter.getInitialData(function(data) {
				self.setState({
					plugins: data.plugins,
					pluginsRules: data.pluginsRules,
					disabledPlugins: data.disabledPlugins,
					disabledRules: data.disabledPluginsRules,
					disabledAllRules: state.disabledAllRules != null ? state.disabledAllRules : data.disabledAllRules,
					hasUpdate: compareVersion(data.latestVersion, data.version) && compareVersion(data.latestVersion, localStorage.latestVersion)
				});
				if (data.latestVersion) {
					localStorage.latestVersion = data.latestVersion;
				}
			});
		}
		
		dataCenter.plugins.getPluginsAndRules(function(data) {
			self.setState({
				plugins: data.plugins,
				pluginsRules: data.pluginsRules,
				disabledPlugins: data.disabledPlugins,
				disabledRules: data.disabledPluginsRules
			});
		});
	},
	disablePlugin: function(e) {
		var self = this;
		var target = e.target;
		dataCenter.plugins.disablePlugin({
			name: $(target).attr('data-name'),
			disabled: target.checked ? 0 : 1
		}, function(data) {
			if (data && data.ec === 0) {
				self.setState({
					disabledPlugins: data.data
				});
			} else {
				util.showSystemError();
			}
		});
	},
	disableRules: function(e) {
		var self = this;
		var target = e.target;
		dataCenter.plugins.disableRules({
			name: $(target).attr('data-name'),
			disabled: target.checked ? 0 : 1
		}, function(data) {
			if (data && data.ec === 0) {
				self.setState({
					disabledRules: data.data
				});
			} else {
				util.showSystemError();
			}
		});
	},
	showDialog: function() {
		this.refs.aboutDialog.show();
	},
	hideDialog: function() {
		this.refs.aboutDialog.hide();
	},
	toggleTab: function(e) {
		var target = $(e.target);
		if (target.hasClass('active')) {
			return;
		}
		target.parent().find('.active').removeClass('active');
		target.addClass('active');
		return target;
	},
	showPlugins: function(e) {
		var target = this.toggleTab(e);
		if (!target) {
			return;
		}
		target.closest('.w-about-plugins').removeClass('w-about-show-rules');
	},
	showRules: function(e) {
		var target = this.toggleTab(e);
		if (!target) {
			return;
		}
		target.closest('.w-about-plugins').addClass('w-about-show-rules');
	},
	render: function() {
		var self = this;
		var state = self.state || {};
		var data = state.data || {};
		
		return (
				<a onClick={self.showAboutInfo} className="w-about-menu" href="javascript:;">
					<i style={{display: state.hasUpdate ? 'block' : ''}}></i><span className="glyphicon glyphicon-info-sign"></span>About
					<Dialog ref="aboutDialog" wstyle="w-about-dialog">
						<div className="modal-body w-about-has-plugins">
							<button type="button" className="close" data-dismiss="modal">
								<span aria-hidden="true">×</span>
							</button>
							<img alt="logo" src="/img/whistle.png" />
							<span className="w-about-dialog-ctn">
								<span className="w-about-dialog-title">Whistle for Web Developers.</span>
								Version: <span className="w-about-version">0.10.0</span><br/>
								<span className="w-about-latest-version">
									Latest version: <a className="w-about-github"
										href="https://github.com/avwo/whistle/wiki/%E6%9B%B4%E6%96%B0whistle"
										target="_blank">0.9.5</a><br/>
									</span>
								Visit <a className="w-about-url" title="How to update whistle" href="http://www.whistlejs.com#v=0.10.0" target="_blank">http://www.whistlejs.com</a>
							</span>
							<div className="w-about-plugins">
								<div className="btn-group btn-group-sm w-btn-group-sm">
									<button type="button" onClick={self.showPlugins} className="btn btn-default active">Plugins</button>
									<button type="button" onClick={self.showRules} className="btn btn-default">Rules</button>
								</div>
								<PluginsList wstyle="w-about-plugins-list" data={state.plugins} disabledData={state.disabledPlugins} disabled={state.disabledAllRules} onChange={self.disablePlugin} />
								<PluginsList wstyle="w-about-rules-list" data={state.pluginsRules} disabledData={state.disabledRules} disabled={state.disabledAllRules} isRules={true} onChange={self.disableRules} />
							</div>
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