require('../css/index.css');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var List = require('./list');
var ListModal = require('./list-modal');
var Network = require('./network');
var About = require('./about');
var Online = require('./online');
var MenuItem = require('./menu-item');
var EditorSettings = require('./editor-settings');
var Plugins = require('./plugins');
var dataCenter = require('./data-center');
var util = require('./util');
var protocols = require('./protocols');
var events = require('./events');
var MAX_PLUGINS_TABS = 7;
var MAX_FILE_SIZE = 1024 * 1024 * 64;
var OPTIONS_WITH_SELECTED = ['removeSelected', 'exportWhistleFile', 'exportSazFile'];
var HISTORY_OPTIONS = ['exportHistory', 'importHistory']; 

function getPageName() {
	return location.hash.substring(1) || location.href.replace(/[#?].*$/, '').replace(/.*\//, '');
}

function compareSelectedNames(src, target) {
	var srcLen = src.length;
	if (srcLen !== target.length) {
		return false;
	}
	for (var i = 0; i < srcLen; i++) {
		if ($.inArray(src[i], target) === -1) {
			return false;
		}
	}
	return true;
}

function getKey(url) {
	if (url.indexOf('{') == 0) {
		var index = url.lastIndexOf('}');
		return index > 1 && url.substring(1, index);
	}
	
	return false;
}

function getValue(url) {
	if (url.indexOf('(') == 0) {
		var index = url.lastIndexOf(')');
		return index != -1 && url.substring(1, index) || '';
	}
	
	return false;
}

var Index = React.createClass({
	getInitialState: function() {
		var modal = this.props.modal;
		var rules = modal.rules;
		var values = modal.values;
		var plugins = modal.plugins;
		var state = {
				allowMultipleChoice: modal.rules.allowMultipleChoice,
				syncWithSysHosts: modal.rules.syncWithSysHosts
		};
		var pageName = getPageName();
		if (!pageName || pageName.indexOf('rules') != -1) {
			state.hasRules = true;
			state.name = 'rules';
		} else if (pageName.indexOf('values') != -1) {
			state.hasValues = true;
			state.name = 'values';
		} else if (pageName.indexOf('plugins') != -1) {
			state.hasPlugins = true;
			state.name = 'plugins';
		} else {
			state.hasNetwork = true;
			state.name = 'network';
		}
		var rulesList = [];
		var rulesOptions = [];
		var rulesData = {};
		var valuesList = [];
		var valuesOptions = [];
		var valuesData = {};
		
		if (rules) {
			var selectedName = rules.current;
			var DEFAULT = 'Default';
			var selected = !rules.defaultRulesIsDisabled;
			state.rulesTheme = rules.theme;
			state.rulesFontSize = rules.fontSize;
			state.showRulesLineNumbers = rules.showLineNumbers;
			rulesList.push(DEFAULT);
			var item = rulesData.Default = {
					name: DEFAULT,
					fixed: true,
					value: rules.defaultRules,
					selected: selected,
					isDefault: true,
					active: selectedName === DEFAULT
			};
			
			rulesOptions.push(rulesData.Default);
			
			rules.list.forEach(function(item) {
				rulesList.push(item.name);
				item = rulesData[item.name] = {
					name: item.name,
					value: item.data,
					selected: item.selected,
					active: selectedName === item.name
				};
				rulesOptions.push(item);
			});
		}
		
		if (values) {
			var selectedName = values.current;
			state.valuesTheme = values.theme;
			state.valuesFontSize = values.fontSize;
			state.showValuesLineNumbers = values.showLineNumbers;
			values.list.forEach(function(item) {
				valuesList.push(item.name);
				valuesData[item.name] = {
					name: item.name,
					value: item.data,
					active: selectedName === item.name
				};
				valuesOptions.push({
					name: item.name,
					icon: 'edit'
				});
			});
		}
		
		state.plugins = modal.plugins;
		state.disabledPlugins = modal.disabledPlugins;
		state.disabledAllRules = modal.disabledAllRules;
		state.disabledAllPlugins = modal.disabledAllPlugins;
		state.hideHttpsConnects = modal.hideHttpsConnects;
		state.interceptHttpsConnects = modal.interceptHttpsConnects;
		state.rules = new ListModal(rulesList, rulesData);
		state.rulesOptions = rulesOptions;
		state.pluginsOptions = this.createPluginsOptions(modal.plugins);
		dataCenter.valuesModal = state.values = new ListModal(valuesList, valuesData);
		state.valuesOptions = valuesOptions;
		state.filterText = modal.filterText;
		state.networkOptions = [
		                        {
		                          name: 'Remove All Sessions',
		                          icon: 'remove',
		                          id: 'removeAll',
		                          disabled: true,
		                          title: 'Ctrl[Command] + X'
		                        },
		                        {
		                          name: 'Remove Selected Sessions',
		                          id: 'removeSelected',
		                          disabled: true,
                              title: 'Ctrl[Command] + D'
		                        },
		                        {
		                          name: 'Remove Unselected Sessions',
		                          id: 'removeUnselected',
		                          disabled: true,
                              title: 'Ctrl[Command] + Shift + D'
		                        },
		                        {
		                          name: 'Export Selected Sessions',
		                          icon: 'export',
		                          id: 'exportWhistleFile',
		                          disabled: true,
                              title: 'Ctrl + S'
		                        },
                            {
                              name: 'Export Selected Sessions (For Fiddler)',
                              id: 'exportSazFile',
                              disabled: true,
                              title: 'Ctrl + S'
                            },
                            // {
                            //   name: 'Export Historical Sessions',
                            //   id: 'exportHistory',
                            //   disabled: true
                            // },
                            {
                              name: 'Import Sessions',
                              icon: 'import',
                              id: 'importSessions',
                              title: 'Ctrl + I'
														}
														// ,
                            // {
                            //   name: 'Import Historical Sessions',
                            //   id: 'importHistory',
                            //   disabled: true
                            // }
		                        ];
		state.helpOptions = [
			{
				name: 'Get Started',
				href: 'https://avwo.github.io/whistle/quickstart.html',
				icon: false,
			},
			{
				name: 'Github',
				href: 'https://github.com/avwo/whistle',
				icon: false,
			},
			{
				name: 'Docs',
				href: 'https://avwo.github.io/whistle/',
				icon: false,
			},
			{
				name: 'Network',
				href: 'https://avwo.github.io/whistle/webui/network.html',
				icon: false,
			},
			{
				name: 'Rules',
				href: 'https://avwo.github.io/whistle/webui/rules.html',
				icon: false,
			},
			{
				name: 'Values',
				href: 'https://avwo.github.io/whistle/webui/values.html',
				icon: false,
			},
			{
				name: 'Plugins',
				href: 'https://avwo.github.io/whistle/webui/plugins.html',
				icon: false,
			},
			{
				name: 'Composer',
				href: 'https://avwo.github.io/whistle/webui/composer.html',
				icon: false,
			},
			{
				name: 'Weinre',
				href: 'https://avwo.github.io/whistle/webui/weinre.html',
				icon: false,
			},
			{
				name: 'Https',
				href: 'https://avwo.github.io/whistle/webui/https.html',
				icon: false,
			},
			{
				name: 'Online',
				href: 'https://avwo.github.io/whistle/webui/online.html',
				icon: false,
			}
		];
    protocols.setPlugins(state);
    state.exportFileType = localStorage.exportFileType;
		return state;
	},
	createPluginsOptions: function(plugins) {
		plugins = plugins || {};
		var pluginsOptions = [{
			name: 'Home'
		}];
		
		Object.keys(plugins).sort(function(a, b) {
			var p1 = plugins[a];
			var p2 = plugins[b];
			return (p1.mtime > p2.mtime) ? 1 : -1;
		}).forEach(function(name) {
			pluginsOptions.push({
				name: name.slice(0, -1),
				icon: 'checkbox',
				mtime: plugins[name].mtime
			});
		});
		return pluginsOptions;
	},
	componentDidMount: function() {
		var self = this;
		var preventDefault = function(e) {
		  e.preventDefault();
		};
		$(document)
  		.on( 'dragleave', preventDefault)
  		.on( 'dragenter', preventDefault)
  		.on( 'dragover', preventDefault)
  		.on('drop', function(e) {
  		  e.preventDefault();
  		  if (self.state.name !== 'network') {
  		    return;
  		  }
  		  var files = e.originalEvent.dataTransfer.files;
  		  if (!files || !files.length) {
  		    return;
  		  }
  		  var data = new FormData();
  		  data.append('importSessions', files[0]);
  		  self.uploadSessionsForm(data);
  		});
		$(window).on('hashchange', function() {
			var pageName = getPageName();
			if (!pageName || pageName.indexOf('rules') != -1) {
				self.showRules();
			} else if (pageName.indexOf('values') != -1) {
				self.showValues();
			} else if (pageName.indexOf('plugins') != -1) {
				self.showPlugins();
			} else {
				self.showNetwork();
			}
		}).on('keyup', function(e) {
			if (e.keyCode == 27) {
				self.hideOptions();
				var dialog = $('.modal');
				if (typeof dialog.modal == 'function') {
					dialog.modal('hide');
				}
			}
		}).on('keydown', function(e) {
			if (!e.ctrlKey && !e.metaKey) {
				return;
			}
			var isNetwork = self.state.name === 'network';
			if (isNetwork && e.keyCode == 88) {
				self.clear();
			}
			
			if (e.keyCode == 68) {
				var target = e.target;
				if ( target.nodeName == 'A' 
						&& $(target).parent().hasClass('w-list-data')) {
					self.state.name == 'rules' ? self.removeRules() : self.removeValues();
				}
				e.preventDefault();
			}
			
			var modal = self.state.network;
			if (isNetwork && e.keyCode === 83) {
				e.preventDefault();
				if ($('.modal.in').length) {
					if ($(ReactDOM.findDOMNode(self.refs.chooseFileType)).is(':visible')) {
						self.exportBySave();
					}
					return;
				}
				var hasSelected = modal && modal.hasSelected();
				if (hasSelected) {
					$(ReactDOM.findDOMNode(self.refs.chooseFileType)).modal('show');
				}
			}
			
			if (isNetwork && e.keyCode === 73) {
				self.importSessions();
				e.preventDefault();
			}
		});
		
		function getKey(url) {
			if (!(url = url && url.trim())) {
				return;
			}
			
			var index = url.indexOf('://') + 3;
			url = index != -1 ? url.substring(index) : url;
			if (url.indexOf('{') !== 0) {
				return;
			}
			
			index = url.lastIndexOf('}');
			return index > 1 ? url.substring(1, index) : null;
		}
		
		$(document.body).on('mouseenter', '.cm-js-type', function(e) {
			if (!(e.ctrlKey || e.metaKey)) {
				return;
			}
			var elem = $(this);
			if (getKey(elem.text())) {
				elem.addClass('w-has-key');
			}
		}).on('mouseleave', '.cm-js-type', function(e) {
			$(this).removeClass('w-has-key');
		}).on('mousedown', '.cm-js-type', function(e) {
			var elem = $(this);
			if (!e.ctrlKey && !e.metaKey && !elem.hasClass('w-has-key')) {
				return;
			}
			var name = getKey(elem.text());
			if (name) {
				self.showAndActiveValues({name: name});
				return false;
			}
		});
		
		if (self.state.name == 'network') {
			self.startLoadData();
		}
		dataCenter.on('settings', function(data) {
			var state = self.state;
			if (state.hideHttpsConnects !== data.hideHttpsConnects
				|| state.interceptHttpsConnects !== data.interceptHttpsConnects
				|| state.disabledAllRules !== data.disabledAllRules
				|| state.allowMultipleChoice !== data.allowMultipleChoice
				|| state.disabledAllPlugins !== data.disabledAllPlugins) {
				self.setState({
					hideHttpsConnects: data.hideHttpsConnects,
					interceptHttpsConnects: data.interceptHttpsConnects,
					disabledAllRules: data.disabledAllRules,
					allowMultipleChoice: data.allowMultipleChoice,
					disabledAllPlugins: data.disabledAllPlugins
				});
			}
		});
		dataCenter.on('rules', function(data) {
			var modal = self.state.rules;
			var newSelectedNames = data.list;
			if (!data.defaultRulesIsDisabled) {
				newSelectedNames.unshift('Default');
			}
			var selectedNames = modal.getSelectedNames();
			if (compareSelectedNames(selectedNames, newSelectedNames)) {
				return;
			}
			self.reselectRules(data);
			self.setState({});
		});
		dataCenter.on('serverInfo', function(data) {
			self.serverInfo = data;
		});
		
		events.on('executeComposer', function() {
			self.autoRefresh && self.autoRefresh();
		});
		
		var timeout;
		$(document).on('visibilitychange', function() {
			clearTimeout(timeout);
			if (document.hidden) {
				return;
			}
			timeout = setTimeout(function() {
				var atBottom = self.scrollerAtBottom && self.scrollerAtBottom();
				self.setState({}, function() {
					atBottom && self.autoRefresh();
				});
			}, 100);
		});
		
		setTimeout(function() {
			dataCenter.checkUpdate(function(data) {
				if (data && data.showUpdate) {
					self.setState({
						version: data.version,
						latestVersion: data.latestVersion
					}, function() {
						$(ReactDOM.findDOMNode(self.refs.showUpdateTipsDialog)).modal('show');
					})
				}
			});
		}, 10000);
		
		dataCenter.on('plugins', function(data) {
			var pluginsOptions = self.createPluginsOptions(data.plugins);
			var oldPluginsOptions = self.state.pluginsOptions;
			var oldDisabledPlugins = self.state.disabledPlugins;
			var disabledPlugins = data.disabledPlugins;
			if (pluginsOptions.length == oldPluginsOptions.length) {
				var hasUpdate;
				for (var i = 0, len = pluginsOptions.length; i < len; i++) {
					var plugin = pluginsOptions[i];
					var oldPlugin = oldPluginsOptions[i];
					if (plugin.name != oldPlugin.name || plugin.mtime != oldPlugin.mtime
					|| (oldDisabledPlugins[plugin.name] != disabledPlugins[plugin.name])) {
						hasUpdate = true;
						break;
					}
				}
				if (!hasUpdate) {
					return;
				}
			}
			var pluginsState = {
					plugins: data.plugins,
					disabledPlugins: data.disabledPlugins,
					pluginsOptions: pluginsOptions
				};
			protocols.setPlugins(pluginsState);
			self.setState(pluginsState);
		});
	},
	donotShowAgain: function() {
		dataCenter.donotShowAgain();
	},
	hideUpdateTipsDialog: function() {
		$(ReactDOM.findDOMNode(this.refs.showUpdateTipsDialog)).modal('hide');
	},
	getWeinreFromRules: function() {
		var values = this.state.values;
		var text = ' ' + this.getAllRulesValue();
		if (text = text.match(/\s?weinre:\/\/[^\s#]+/g)) {
			text = text.map(function(weinre) {
				weinre = util.removeProtocol(weinre);
				var value = getValue(weinre);
				if (value !== false) {
					return value;
				}
				var key = getKey(weinre);
				if (key !== false) {
					key = values.get(key);
					return key && key.value;
				}
				
				return weinre;
			}).filter(function(weinre) {
				return !!weinre;
			});
		}
		
		return text;
	},
	getValuesFromRules: function() {
		var values = this.state.values;
		var text = ' ' + this.getAllRulesValue();
		if (text = text.match(/\s(?:[\w-]+:\/\/)?\{[^\s#]+\}/g)) {
			text = text.map(function(key) {
				return getKey(util.removeProtocol(key.trim()));
			}).filter(function(key) {
				return !!key;
			});
		}
		return text;
	},
	getAllRulesValue: function() {
		var result = [];
		var activeList = [];
		var selectedList = [];
		var modal = this.state.rules;
		modal.list.forEach(function(name) {
			var item = modal.get(name);
			var value = item.value || '';
			if (item.active) {
				activeList.push(value);
			} else if (item.selected) {
				selectedList.push(value);
			} else {
				result.push(value);
			}
		});
		modal = this.state.values;
		modal.list.forEach(function(name) {
			if (/\.rules$/.test(name)) {
				result.push(modal.get(name).value);
			}
		});
		
		return activeList.concat(selectedList).concat(result).join('\r\n');
	},
	preventBlur: function(e) {
		e.target.nodeName != 'INPUT' && e.preventDefault();
	},
	startLoadData: function() {
		var self = this;
		if (self._updateNetwork) {
			self._updateNetwork();
			return;
		}
		var scrollTimeout;
		var con = $(ReactDOM.findDOMNode(self.refs.network))
			.find('.w-req-data-list').scroll(function() {
				var modal = self.state.network;
				scrollTimeout && clearTimeout(scrollTimeout);
				scrollTimeout = null;
				if (modal && atBottom()) {
					scrollTimeout = setTimeout(function() {
						update(modal, true);
					}, 1000);
				}
			});
		var body = con.children('table')[0];
		var timeout;
		con = con[0];
		dataCenter.on('data', update);
		
		function update(modal, _atBottom) {
			modal = modal || self.state.network;
			clearTimeout(timeout);
			timeout = null;
			if (self.state.name != 'network' || !modal) {
				return;
			}
			_atBottom = _atBottom || atBottom();
			if (modal.update(_atBottom) && _atBottom) {
				timeout = setTimeout(update, 3000);
			}
			if (document.hidden) {
				return;
			}
			self.setState({
				network: modal
			}, function() {
				_atBottom && scrollToBottom();
			});
		}
		
		function scrollToBottom() {
			con.scrollTop = body.offsetHeight;
		}
		
		self._updateNetwork = update;
		self.autoRefresh = scrollToBottom;
		self.scrollerAtBottom = atBottom;
		
		function atBottom() {
			return con.scrollTop + con.offsetHeight + 5 > body.offsetHeight;
		}
	},
	showPlugins: function(e) {
		if (this.state.name != 'plugins') {
		  this.setMenuOptionsState();
		  this.hidePluginsOptions();
		} else if (e) {
      this.showPluginsOptions();
    }
		this.setState({
			hasPlugins: true,
			name: 'plugins'
		});
		location.hash = 'plugins';
	},
	showNetwork: function(e) {
		if (this.state.name == 'network') {
		  e && this.showNetworkOptions();
		  return;
		}
		this.setMenuOptionsState();
		this.setState({
			hasNetwork: true,
			name: 'network'
		}, function() {
			this.startLoadData();
		});
		location.hash = 'network';
	},
	handleNetwork: function(item) {
	  var modal = this.state.network;
	  if (item.id == 'removeAll') {
	    this.clear();
	  } else if (item.id == 'removeSelected') {
	    modal && modal.removeSelectedItems();
	  } else if (item.id == 'removeUnselected') {
	    modal && modal.removeUnselectedItems();
	  } else if (item.id == 'exportWhistleFile') {
      this.exportSessions('whistle');
    } else if (item.id == 'exportSazFile') {
      this.exportSessions('Fiddler');
    } else if (item.id == 'importSessions') {
      this.importSessions();
    }
	  this.hideNetworkOptions();
	},
	importSessions: function() {
	  ReactDOM.findDOMNode(this.refs.importSessions).click();
	},
	clearNetwork: function() {
	  this.clear();
	  this.hideNetworkOptions();
	},
	showAndActiveRules: function(item) {
	  this.hideRulesOptions();
	  this.setRulesActive(item.name);
		this.showRules();
	},
	showRules: function(e) {
		if (this.state.name != 'rules') {
		  this.setMenuOptionsState();
		  this.hideRulesOptions();
		} else if (e) {
		  this.showRulesOptions(e);
		}
		this.setState({
			hasRules: true,
			name: 'rules'
		});
		location.hash = 'rules';
	},
	showAndActiveValues: function(item) {
		var self = this;
		var modal = self.state.values;
		var name = item.name;
		self.hideValuesOptions();
		if (!modal.exists(name)) {
			dataCenter.values.add({name: name}, function(data) {
				if (data && data.ec === 0) {
					var item = modal.add(name);
					self.setValuesActive(name);
					self.setState({
						activeValues: item
					});
				} else {
					util.showSystemError();
				}
			});
		} else {
			self.setValuesActive(name);
		}
		
		this.showValues();
	},
	showValues: function(e) {
		if (this.state.name != 'values') {
		  this.setMenuOptionsState();
		  this.hideValuesOptions();
		} else if (e) {
      this.showValuesOptions(e);
    }
		this.setState({
			hasValues: true,
			name: 'values'
		});
		location.hash = 'values';
	},
	showNetworkOptions: function() {
	  if (this.state.name == 'network') {
	    this.setState({
	      showNetworkOptions: true
	    });
	  }
	},
  hideNetworkOptions: function() {
    this.setState({
      showNetworkOptions: false
    });
  },
	showHelpOptions: function() {
	  this.setState({
			showHelpOptions: true
		});
	},
  hideHelpOptions: function() {
    this.setState({
      showHelpOptions: false
    });
  },
	showRulesOptions: function(e) {
		var self = this;
		var target = $(e.target);
		var rules = self.state.rules;
		var data = rules.data;
		var rulesOptions = [];
		rules.list.forEach(function(name) {
			rulesOptions.push(data[name]);
		});
		self.setState({
			rulesOptions: rulesOptions,
			showRulesOptions: true
		});
	},
	hideRulesOptions: function() {
		this.setState({
			showRulesOptions: false
		});
	},
	showValuesOptions: function(e) {
		var self = this;
		var valuesList = this.state.values.list;
		var list = self.getValuesFromRules() || [];
		list = util.unique(valuesList.concat(list));
		var valuesOptions = [];
		var newValues = [];
		list.forEach(function(name) {
			var exists = valuesList.indexOf(name) != -1;
			var item = {
					name: name,
					icon: exists ? 'edit' : 'plus'
				};
			exists ? valuesOptions.push(item) : newValues.push(item);
		});
		self.state.valuesOptions = newValues.concat(valuesOptions);
		self.setState({
			showValuesOptions: true
		});
	},
	hideValuesOptions: function() {
		this.setState({
			showValuesOptions: false
		});
	},
	showAndActivePlugins: function(option) {
		this.hidePluginsOptions();
		this.showPlugins();
		this.showPluginTab(option.name);
	},
	showPluginTab: function(name) {
		var active = 'Home';
		var tabs = this.state.tabs || [];
		if (name && name != active) {
			for (var i = 0, len = tabs.length; i < len; i++) {
				if (tabs[i].name == name) {
					active = name;
					name = null;
					break;
				}
			}
		}
		
		var plugin;
		if (name && (plugin = this.state.plugins[name + ':'])) {
			if (tabs.length >= MAX_PLUGINS_TABS) {
				alert('You can only open ' + MAX_PLUGINS_TABS + ' tabs.');
				return this.showPlugins();
			}
			active = name;
			tabs.push({
				name: name,
				url: 'plugin.' + name + '/'
			});
		}
		
		this.setState({
			active: active,
			tabs: tabs
		});
	},
	activePluginTab: function(e) {
		this.showPluginTab($(e.target).attr('data-name'));
	},
	closePluginTab: function(e) {
		var name = $(e.target).attr('data-name');
		var tabs = this.state.tabs || [];
		if (tabs) {
			for (var i = 0, len = tabs.length; i < len; i++) {
				if (tabs[i].name == name) {
					tabs.splice(i, 1);
					var active = this.state.active;
					if (active == name) {
						var plugin = tabs[i] || tabs[i - 1];
						this.state.active = plugin ? plugin.name : null;
					}
					
					return this.setState({
						tabs: tabs
					});
				}
			}
		}
	},
	showPluginsOptions: function(e) {
		this.setState({
			showPluginsOptions: true
		});
	},
	hidePluginsOptions: function() {
		this.setState({
			showPluginsOptions: false
		});
	},
	showWeinreOptions: function(e) {
		var self = this;
		var target = $(e.target);
		var list = self.state.weinreOptions = self.getWeinreFromRules() || [];
		self.state.weinreOptions = util.unique(list).map(function(name) {
			return {
				name: name,
				icon: 'globe'
			};
		});
		self.setState({
			showWeinreOptions: true
		});
	},
	hideWeinreOptions: function() {
		this.setState({
			showWeinreOptions: false
		});
	},
	hideOptions: function() {
		this.setMenuOptionsState();
	},
	setMenuOptionsState: function(name, callback) {
		var state = {
				showCreateRules: false,
				showCreateValues: false,
				showEditRules: false,
				showEditValues: false,
				showEditFilter: false,
				showValuesSettings: false,
				showRulesSettings: false
			
		};
		if (name) {
			state[name] = true;
		}
		this.setState(state, callback);
	},
	showCreateRules: function() {
		var createRulesInput = ReactDOM.findDOMNode(this.refs.createRulesInput);
		this.setState({
			showCreateRules: true
		}, function() {
			createRulesInput.focus();
		});
	},
	showCreateValues: function() {
		var createValuesInput = ReactDOM.findDOMNode(this.refs.createValuesInput);
		this.setState({
			showCreateValues: true
		}, function() {
			createValuesInput.focus();
		});
	},
	showHttpsSettingsDialog: function() {
		$(ReactDOM.findDOMNode(this.refs.rootCADialog)).modal('show');
	},
	hideHttpsConnects: function(e) {
		var self = this;
		var checked = e.target.checked;
		dataCenter.hideHttpsConnects({hideHttpsConnects: checked ? 1 : 0},
				function(data) {
			if (data && data.ec === 0) {
				self.state.hideHttpsConnects = checked;
			} else {
				util.showSystemError();
			}
			self.setState({});
		});
	},
	interceptHttpsConnects: function(e) {
		var self = this;
		var checked = e.target.checked;
		dataCenter.interceptHttpsConnects({interceptHttpsConnects: checked ? 1 : 0},
				function(data) {
			if (data && data.ec === 0) {
				self.state.interceptHttpsConnects = checked;
			} else {
				util.showSystemError();
			}
			self.setState({});
		});
	},
	createRules: function(e) {
		if (e.keyCode != 13 && e.type != 'click') {
			return;
		}
		var self = this;
		var target = ReactDOM.findDOMNode(self.refs.createRulesInput);
		var name = $.trim(target.value);
		if (!name) {
			alert('The name can not be empty.');
			return;
		}
		
		var modal = self.state.rules;
		if (modal.exists(name)) {
			alert('The name \'' + name + '\' already exists.');
			return;
		}
		
		dataCenter.rules.add({name: name}, function(data) {
			if (data && data.ec === 0) {
				var item = modal.add(name);
				self.setRulesActive(name);
				target.value = '';
				target.blur();
				self.setState({
					activeRules: item
				});
			} else {
				util.showSystemError();
			}
		});
	},
	createValues: function(e) {
		if (e.keyCode != 13 && e.type != 'click') {
			return;
		}
		var self = this;
		var target = ReactDOM.findDOMNode(self.refs.createValuesInput);
		var name = $.trim(target.value);
		if (!name) {
			alert('The name can not be empty.');
			return;
		}
		
		if (/\s/.test(name)) {
			alert('The name can not contain spaces.');
			return;
		}

		if (/#/.test(name)) {
			alert('The name can not contain #.');
			return;
		}
		
		var modal = self.state.values;
		if (modal.exists(name)) {
			alert('The name \'' + name + '\' already exists.');
			return;
		}
		
		dataCenter.values.add({name: name}, function(data) {
			if (data && data.ec === 0) {
				var item = modal.add(name);
				self.setValuesActive(name);
				target.value = '';
				target.blur();
				self.setState({
					activeValues: item
				});
			} else {
				util.showSystemError();
			}
		});
	},
	showEditRules: function() {
		var modal = this.state.rules;
		var activeItem = modal.getActive();
		if (!activeItem || activeItem.isDefault) {
			return;
		}
		var editRulesInput = ReactDOM.findDOMNode(this.refs.editRulesInput);
		editRulesInput.value = activeItem.name;
		this.setState({
			showEditRules: true,
			selectedRule: activeItem
		}, function() {
			editRulesInput.select();
			editRulesInput.focus();
		});	
	},
	showEditValuesByDBClick: function(item) {
		!item.changed && this.showEditValues();
	},
	showEditValues: function() {
		var modal = this.state.values;
		var activeItem = modal.getActive();
		if (!activeItem || activeItem.isDefault) {
			return;
		}
		
		var editValuesInput = ReactDOM.findDOMNode(this.refs.editValuesInput);
		editValuesInput.value = activeItem.name;
		this.setState({
			showEditValues: true,
			selectedValue: activeItem
		}, function() {
			editValuesInput.select();
			editValuesInput.focus();
		});	
	},
	showEditFilter: function() {
	  if (this._setEditFilterPending) {
	    return;
	  }
	  var editFilterInput = ReactDOM.findDOMNode(this.refs.editFilterInput);
		this.setState({
			showEditFilter: true
		}, function() {
			editFilterInput.select();
			editFilterInput.focus();
		});
	},
	clearEditFilter: function(e) {
	  var self = this;
	  var target = ReactDOM.findDOMNode(self.refs.editFilterInput);
	  self._setEditFilterPending = true;
	  if (target.value.trim()) {
	    dataCenter.setFilter({filter: ''}, function(data) {
	      if (data && data.ec === 0) {
	        target.blur();
	        target.value = '';
	        self.setState({
	          filterText: ''
	        });
	      } else {
	        util.showSystemError();
	      }
	    });
	  }
	  self.setState({
	    showEditFilter: false
    }, function() {
      self._setEditFilterPending = false;
    });
	},
	editRules: function(e) {
		if (e.keyCode != 13 && e.type != 'click') {
			return;
		}
		var self = this;
		var modal = self.state.rules;
		var activeItem = modal.getActive();
		if (!activeItem) {
			return;
		}
		var target = ReactDOM.findDOMNode(self.refs.editRulesInput);
		var name = $.trim(target.value);
		if (!name) {
			alert('Rule name can not be empty.');
			return;
		}
		
		if (modal.exists(name)) {
			alert('Rule name \'' + name + '\' already exists.');
			return;
		}
		
		dataCenter.rules.rename({name: activeItem.name, newName: name}, function(data) {
			if (data && data.ec === 0) {
				modal.rename(activeItem.name, name);
				self.setRulesActive(name);
				target.value = '';
				target.blur();
				self.setState({
					activeValues: activeItem
				});
			} else {
				util.showSystemError();
			}
		});
	},
	editValues: function(e) {
		if (e.keyCode != 13 && e.type != 'click') {
			return;
		}
		var self = this;
		var modal = self.state.values;
		var activeItem = modal.getActive();
		if (!activeItem) {
			return;
		}
		var target = ReactDOM.findDOMNode(self.refs.editValuesInput);
		var name = $.trim(target.value);
		if (!name) {
			alert('Rule name can not be empty.');
			return;
		}
		
		if (modal.exists(name)) {
			alert('Rule name \'' + name + '\' already exists.');
			return;
		}
		
		dataCenter.values.rename({name: activeItem.name, newName: name}, function(data) {
			if (data && data.ec === 0) {
				modal.rename(activeItem.name, name);
				self.setValuesActive(name);
				target.value = '';
				target.blur();
				self.setState({
					activeValues: activeItem
				});
			} else {
				util.showSystemError();
			}
		});
	},
	showAnonymousWeinre: function() {
		this.openWeinre();
	},
	showWeinre: function(options) {
		this.openWeinre(options.name);
	},
	openWeinre: function(name) {
		window.open('weinre/client/#' + (name || 'anonymous'));
		this.setState({
			showWeinreOptions: false
		});
	},
	onClickRulesOption: function(item) {
		item.selected ? this.unselectRules(item) : this.selectRules(item);
	},
	selectRules: function(item) {
		var self = this;
		dataCenter.rules[item.isDefault ? 'enableDefault' : 'select'](item, function(data) {
			if (data && data.ec === 0) {
				self.reselectRules(data);
				self.setState({});
			} else {
				util.showSystemError();
			}
		});
		return false;
	},
	selectRulesByOptions: function(e) {
		var item = this.state.rules.data[$(e.target).attr('data-name')];
		this[e.target.checked ? 'selectRules' : 'unselectRules'](item);
	},
	unselectRules: function(item) {
		var self = this;
		dataCenter.rules[item.isDefault ? 'disableDefault' : 'unselect'](item, function(data) {
			if (data && data.ec === 0) {
				self.reselectRules(data);
				self.setState({});
			} else {
				util.showSystemError();
			}
		});
		return false;
	},
	reselectRules: function(data) {
		var self = this;
		self.state.rules.clearAllSelected();
		self.setSelected(self.state.rules, 'Default', !data.defaultRulesIsDisabled);
		data.list.forEach(function(name) {
			self.setSelected(self.state.rules, name);
		});
	},
	saveValues: function(item) {
		if (!item.changed) {
			return;
		}
		var self = this;
		dataCenter.values.add(item, function(data) {
			if (data && data.ec === 0) {
				self.setSelected(self.state.values, item.name);
			} else {
				util.showSystemError();
			}
		});
		return false;
	},
	setSelected: function(modal, name, selected) {
		if (modal.setSelected(name, selected)) {
			modal.setChanged(name, false);
			this.setState({
				curSelectedName: name
			});
		}
	},
	replay: function() { 
		var modal = this.state.network;
		if (!modal) {
			return;
		}
		var list = modal.getSelectedList();
		if (!list.length) {
			return;
		}
		
		list.forEach(function(item) {
			if (!item.isHttps) {
				dataCenter.composer({
					url: item.url,
					headers: JSON.stringify(item.req.headers),
					method: item.req.method,
					body: item.reqError ? '' : item.req.body
				});
			}
		});
		this.autoRefresh && this.autoRefresh();
	},
	composer: function() {
		events.trigger('composer');
	},
	setFilter: function(e) {
		if (e.keyCode != 13 && e.type != 'click') {
			return;
		}
		var self = this;
		var target = ReactDOM.findDOMNode(self.refs.editFilterInput);
		var filter = $.trim(target.value);
		dataCenter.setFilter({filter: filter}, function(data) {
			if (data && data.ec === 0) {
				target.blur();
				self.setState({
					filterText: filter
				});
			} else {
				util.showSystemError();
			}
		});
	},
	clear: function() {
		var modal = this.state.network;
		modal && this.setState({
			network: modal.clear()
		});
	},
	removeRules: function() {
		var self = this;
		var modal = this.state.rules;
		var activeItem = modal.getActive();
		if (activeItem && !activeItem.isDefault) {
			var name = activeItem.name;
			if (confirm('Confirm delete this Rule \'' + name + '\'.')) { 
				dataCenter.rules.remove({name: name}, function(data) {
					if (data && data.ec === 0) {
						var nextItem = modal.getSibling(name);
						nextItem && self.setRulesActive(nextItem.name);
						modal.remove(name);
						self.setState({
							activeRules: nextItem
						});
					} else {
						util.showSystemError();
					}
				});
			}
		}
	},
	removeValues: function() {
		var self = this;
		var modal = this.state.values;
		var activeItem = modal.getActive();
		if (activeItem && !activeItem.isDefault) {
			var name = activeItem.name;
			if (confirm('Confirm delete this Value \'' + name + '\'.')) {
				dataCenter.values.remove({name: name}, function(data) {
					if (data && data.ec === 0) {
						var nextItem = modal.getSibling(name);
						nextItem && self.setValuesActive(nextItem.name);
						modal.remove(name);
						self.setState({
							activeValues: nextItem
						});
					} else {
						util.showSystemError();
					}
				});
			}
		}
	},
	setRulesActive: function(name) {
		dataCenter.rules.setCurrent({name: name});
		this.state.rules.setActive(name);
	},
	setValuesActive: function(name) {
		dataCenter.values.setCurrent({name: name});
		this.state.values.setActive(name);
	},
	showRulesSettings: function() {
		$(ReactDOM.findDOMNode(this.refs.rulesSettingsDialog)).modal('show');
	},
	showValuesSettings: function() {
		$(ReactDOM.findDOMNode(this.refs.valuesSettingsDialog)).modal('show');
	},
	onClickMenu: function(e) {
		var target = $(e.target).closest('a');
		var self = this;
		var isRules = self.state.name == 'rules';
		if (target.hasClass('w-create-menu')) {
			isRules ? self.showCreateRules() : self.showCreateValues();
		} else if (target.hasClass('w-edit-menu')) {
			isRules ? self.showEditRules() : self.showEditValues();
		} else if (target.hasClass('w-delete-menu')) {
			isRules ? self.removeRules() : self.removeValues();
		} else if (target.hasClass('w-save-menu')) {
			if (isRules) {
				var list = self.state.rules.getChangedList();
				if(list.length) {
					list.forEach(function(item) {
						self.selectRules(item);
					});
					self.setState({});
				}
			} else {
				var list = self.state.values.getChangedList();
				if (list.length) {
					list.forEach(function(item) {
						self.saveValues(item);
					});
					self.setState({});
				}
			}
		}
	},
	showSettings: function(e) {
		this.state.name == 'rules' ? this.showRulesSettings() : this.showValuesSettings();
	},
	activeRules: function(item) {
		dataCenter.rules.setCurrent({name: item.name});
		this.setState({
			activeRules: item
		});
	},
	activeValues: function(item) {
		dataCenter.values.setCurrent({name: item.name});
		this.setState({
			activeValues: item
		});
	},
	onRulesThemeChange: function(e) {
		var theme = e.target.value;
		dataCenter.rules.setTheme({theme: theme});
		this.setState({
			rulesTheme: theme
		});
	},
	onValuesThemeChange: function(e) {
		var theme = e.target.value;
		dataCenter.values.setTheme({theme: theme});
		this.setState({
			valuesTheme: theme
		});
	},
	onRulesFontSizeChange: function(e) {
		var fontSize = e.target.value;
		dataCenter.rules.setFontSize({fontSize: fontSize});
		this.setState({
			rulesFontSize: fontSize
		});
	},
	onValuesFontSizeChange: function(e) {
		var fontSize = e.target.value;
		dataCenter.values.setFontSize({fontSize: fontSize});
		this.setState({
			valuesFontSize: fontSize
		});
	},
	onRulesLineNumberChange: function(e) {
		var checked = e.target.checked;
		dataCenter.rules.showLineNumbers({showLineNumbers: checked ? 1 : 0});
		this.setState({
			showRulesLineNumbers: checked
		});
	},
	onValuesLineNumberChange: function(e) {
		var checked = e.target.checked;
		dataCenter.values.showLineNumbers({showLineNumbers: checked ? 1 : 0});
		this.setState({
			showValuesLineNumbers: checked
		});
	},
	disableAllRules: function(e) {
		 var checked = e.target.checked;
		 var self = this;
		 dataCenter.rules.disableAllRules({disabledAllRules: checked ? 1 : 0}, function(data) {
			  if (data && data.ec === 0) {
			    self.setState({
			      disabledAllRules: checked
			    });
			  } else {
				util.showSystemError();
			 }
		 });
		 e.preventDefault();
	},
	disableAllPlugins: function(e) {
		 var checked = e.target.checked;
		 var self = this;
		 dataCenter.plugins.disableAllPlugins({disabledAllPlugins: checked ? 1 : 0}, function(data) {
			  if (data && data.ec === 0) {
			    self.state.disabledAllPlugins = checked;
          protocols.setPlugins(self.state);
			    self.setState({});
			  } else {
				util.showSystemError();
			 }
		 });
		 e.preventDefault();
	},
	disablePlugin: function(e) {
		var self = this;
		var target = e.target;
		dataCenter.plugins.disablePlugin({
			name: $(target).attr('data-name'),
			disabled: target.checked ? 0 : 1
		}, function(data) {
			if (data && data.ec === 0) {
			  self.state.disabledPlugins = data.data;
        protocols.setPlugins(self.state);
        self.setState({});
			} else {
				util.showSystemError();
			}
		});
	},
	allowMultipleChoice: function(e) {
		var checked = e.target.checked;
		dataCenter.rules.allowMultipleChoice({allowMultipleChoice: checked ? 1 : 0});
		this.setState({
			allowMultipleChoice: checked
		});
	},
	syncWithSysHosts: function(e) {
		var checked = e.target.checked;
		dataCenter.rules.syncWithSysHosts({syncWithSysHosts: checked ? 1 : 0});
		this.setState({
			syncWithSysHosts: checked
		});
	},
	importSysHosts: function() {
		var self = this;
		var modal = self.state.rules;
		var defaultRules = modal.data['Default'];
		if (!(defaultRules.value || '').trim() || confirm('Confirm overwrite the original Default data?')) {
			dataCenter.rules.getSysHosts(function(data) {
				if (data.ec !== 0) {
					alert(data.em);
					return;
				}
				
				modal.setActive('Default');
				defaultRules.changed = !data.selected || defaultRules.value != data.hosts;
				defaultRules.value = data.hosts;
				self.activeRules(defaultRules);
				self.setState({}, function() {
					ReactDOM.findDOMNode(self.refs.rules.refs.list).scrollTop = 0;
				});
			});
		}
		
	},
	chooseFileType: function(e) {
	  var value = e.target.value;
	  localStorage.exportFileType = value;
	  this.setState({
	    exportFileType: value
	  });
	},
	uploadSessions: function() {
	  this.uploadSessionsForm(new FormData(ReactDOM.findDOMNode(this.refs.importSessionsForm)));
	  ReactDOM.findDOMNode(this.refs.importSessions).value = '';
	},
	uploadSessionsForm: function(data) {
    var file = data.get('importSessions');
	  if (!file || !/\.(txt|saz)$/i.test(file.name)) {
      return alert('Only supports txt or saz file.');
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return alert('The file size can not exceed 64m.');
    }
    dataCenter.sessions.imports(data, dataCenter.addNetworkList);
  },
	exportSessions: function(type) {
	  var modal = this.state.network;
	  var sessions = modal && modal.getSelectedList();
	  if (!sessions || !sessions.length) {
	    return;
	  }
	  var form = ReactDOM.findDOMNode(this.refs.exportSessionsForm);
    ReactDOM.findDOMNode(this.refs.exportFileType).value = type;
    ReactDOM.findDOMNode(this.refs.sessions).value = JSON.stringify(sessions, null, '  ');
    form.submit();
	},
	exportBySave: function() {
	  this.exportSessions(this.state.exportFileType);
	  $(ReactDOM.findDOMNode(this.refs.chooseFileType)).modal('hide');
	},
	render: function() {
		var state = this.state;
		var name = state.name;
		var isNetwork = name === undefined || name == 'network';
		var isRules = name == 'rules';
		var isValues = name == 'values';
		var isPlugins = name == 'plugins';
		var disabledEditBtn = true;
		var disabledDeleteBtn = true;
		var disabledPluginHomepageBtn = true;
		var disabledOpenInNewWindowBtn = true;
		var rulesTheme = 'cobalt';
		var valuesTheme = 'cobalt';
		var rulesFontSize = '14px';
		var valuesFontSize = '14px';
		var showRulesLineNumbers = false;
		var showValuesLineNumbers = false;
		var rulesOptions = state.rulesOptions;
		var pluginsOptions = state.pluginsOptions;
		var uncheckedRules = {};
		var showNetworkOptions = state.showNetworkOptions;
		var showRulesOptions = state.showRulesOptions;
		var showValuesOptions = state.showValuesOptions;
		var showPluginsOptions = state.showPluginsOptions;
		var showWeinreOptions = state.showWeinreOptions;
		var showHelpOptions = state.showHelpOptions;
		
		rulesOptions.forEach(function(item) {
			item.icon = 'checkbox';
			if (!item.selected) {
				uncheckedRules[item.name] = 1;
			}
		});
		
		if (isRules) {
			var data = state.rules.data;
			for (var i in data) {
				if (data[i].active) {
					disabledEditBtn = disabledDeleteBtn = data[i].isDefault;
					break;
				}
			}
			if (state.rulesTheme) {
				rulesTheme = state.rulesTheme;
			}
			
			if (state.rulesFontSize) {
				rulesFontSize = state.rulesFontSize;
			}
			
			if (state.showRulesLineNumbers) {
				showRulesLineNumbers = state.showRulesLineNumbers;
			}
			
		} else if (isValues) {
			var data = state.values.data;
			for (var i in data) {
				if (data[i].active) {
					disabledEditBtn = disabledDeleteBtn = false;
					break;
				}
			}
			if (state.valuesTheme) {
				valuesTheme = state.valuesTheme;
			}
			
			if (state.valuesFontSize) {
				valuesFontSize = state.valuesFontSize;
			}
			
			if (state.showValuesLineNumbers) {
				showValuesLineNumbers = state.showValuesLineNumbers;
			}
		}
		if (state.network) {
		  var networkOptions = state.networkOptions;
	    var hasUnselected = state.network.hasUnselected();
	    if (state.network.hasSelected()) {
	      networkOptions.forEach(function(option) {
					if (HISTORY_OPTIONS.indexOf(option.id) !== -1) {
						return;
					}
	        option.disabled = false;
	        if (option.id === 'removeUnselected') {
	          option.disabled = !hasUnselected;
	        }
	      });
	    } else {
	      networkOptions.forEach(function(option) {
					if (HISTORY_OPTIONS.indexOf(option.id) !== -1) {
						return;
					}
	        if (OPTIONS_WITH_SELECTED.indexOf(option.id) !== -1) {
	          option.disabled = true;
	        } else if (option.id === 'removeUnselected') {
	          option.disabled = !hasUnselected;
	        }
	      });
	      networkOptions[0].disabled = !hasUnselected;
	    }
		}
		return (
			<div className="main orient-vertical-box">
				<div className={'w-menu w-' + name + '-menu-list'}>
  				<div onMouseEnter={this.showNetworkOptions} onMouseLeave={this.hideNetworkOptions} className={'w-menu-wrapper' + (showNetworkOptions ? ' w-menu-wrapper-show' : '')}>
  				  <a onClick={this.showNetwork} onDoubleClick={this.clearNetwork} className="w-network-menu" title="Double click to remove all sessions" style={{background: name == 'network' ? '#ddd' : null}} 
					href="javascript:;"  draggable="false"><span className="glyphicon glyphicon-align-justify"></span>Network</a>
            <MenuItem ref="networkMenuItem" options={state.networkOptions} className="w-network-menu-item" onClickOption={this.handleNetwork} />
          </div>
					<div onMouseEnter={this.showRulesOptions} onMouseLeave={this.hideRulesOptions} className={'w-menu-wrapper' + (showRulesOptions ? ' w-menu-wrapper-show' : '')}>
						<a onClick={this.showRules} className="w-rules-menu" style={{background: name == 'rules' ? '#ddd' : null}} href="javascript:;" draggable="false"><span className="glyphicon glyphicon-list"></span>Rules</a>
						<MenuItem ref="rulesMenuItem"  name={name == 'rules' ? null : 'Open'} options={rulesOptions} checkedOptions={uncheckedRules} disabled={state.disabledAllRules} 
						className="w-rules-menu-item" onClick={this.showRules} onClickOption={this.showAndActiveRules}  onChange={this.selectRulesByOptions} />
					</div>
					<div onMouseEnter={this.showValuesOptions} onMouseLeave={this.hideValuesOptions} className={'w-menu-wrapper' + (showValuesOptions ? ' w-menu-wrapper-show' : '')}>
						<a onClick={this.showValues} className="w-values-menu" style={{background: name == 'values' ? '#ddd' : null}} href="javascript:;" draggable="false"><span className="glyphicon glyphicon-folder-open"></span>Values</a>
						<MenuItem ref="valuesMenuItem" name={name == 'values' ? null : 'Open'} options={state.valuesOptions} className="w-values-menu-item" onClick={this.showValues} onClickOption={this.showAndActiveValues} />
					</div>
					<div ref="pluginsMenu" onMouseEnter={this.showPluginsOptions} onMouseLeave={this.hidePluginsOptions} className={'w-menu-wrapper' + (showPluginsOptions ? ' w-menu-wrapper-show' : '')}>
						<a onClick={this.showPlugins} className="w-plugins-menu" style={{background: name == 'plugins' ? '#ddd' : null}} href="javascript:;" draggable="false"><span className="glyphicon glyphicon-list-alt"></span>Plugins</a>
						<MenuItem ref="pluginsMenuItem" name={name == 'plugins' ? null : 'Open'} options={pluginsOptions} checkedOptions={state.disabledPlugins} disabled={state.disabledAllRules || state.disabledAllPlugins} 
							className="w-plugins-menu-item" onClick={this.showPlugins} onChange={this.disablePlugin} onClickOption={this.showAndActivePlugins} />
					</div>
					<a onClick={this.onClickMenu} className="w-save-menu" style={{display: (isNetwork || isPlugins) ? 'none' : ''}} href="javascript:;" draggable="false" title="Ctrl[Command] + S"><span className="glyphicon glyphicon-save-file"></span>Save</a>
					<a onClick={this.onClickMenu} className="w-create-menu" style={{display: (isNetwork || isPlugins) ? 'none' : ''}} href="javascript:;" draggable="false"><span className="glyphicon glyphicon-plus"></span>Create</a>
					<a onClick={this.onClickMenu} className={'w-edit-menu' + (disabledEditBtn ? ' w-disabled' : '')} style={{display: (isNetwork || isPlugins) ? 'none' : ''}} href="javascript:;" draggable="false"><span className="glyphicon glyphicon-edit"></span>Rename</a>
					<a onClick={this.autoRefresh} className="w-scroll-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;" draggable="false"><span className="glyphicon glyphicon-play"></span>AutoRefresh</a>
					<a onClick={this.replay} className="w-replay-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;" draggable="false"><span className="glyphicon glyphicon-repeat"></span>Replay</a>
					<a onClick={this.composer} className="w-composer-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;" draggable="false"><span className="glyphicon glyphicon-edit"></span>Composer</a>
					<a onClick={this.showEditFilter} onDoubleClick={this.clearEditFilter} className={'w-filter-menu' + (state.filterText ? ' w-menu-enable' : '')} title={state.filterText ? 'Double click to clear the text:\n' + state.filterText : undefined} 
					  style={{display: isNetwork ? '' : 'none'}} href="javascript:;" draggable="false"><span className="glyphicon glyphicon-filter"></span>Filter</a>
					<a onClick={this.onClickMenu} className={'w-delete-menu' + (disabledDeleteBtn ? ' w-disabled' : '')} style={{display: (isNetwork || isPlugins) ? 'none' : ''}} href="javascript:;" draggable="false"><span className="glyphicon glyphicon-trash"></span>Delete</a>
					<a onClick={this.showSettings} className="w-settings-menu" style={{display: (isNetwork || isPlugins) ? 'none' : ''}} href="javascript:;" draggable="false"><span className="glyphicon glyphicon-cog"></span>Settings</a>
					<div onMouseEnter={this.showWeinreOptions} onMouseLeave={this.hideWeinreOptions} className={'w-menu-wrapper' + (showWeinreOptions ? ' w-menu-wrapper-show' : '')}>
						<a onClick={this.showAnonymousWeinre} className="w-weinre-menu" href="javascript:;" draggable="false"><span className="glyphicon glyphicon-globe"></span>Weinre</a>
						<MenuItem ref="weinreMenuItem" name="Anonymous" options={state.weinreOptions} className="w-weinre-menu-item" onClick={this.showAnonymousWeinre} onClickOption={this.showWeinre} />
					</div>
					<a onClick={this.showHttpsSettingsDialog} className="w-https-menu" href="javascript:;" draggable="false"><span className="glyphicon glyphicon-lock"></span>Https</a>
					<div onMouseEnter={this.showHelpOptions} onMouseLeave={this.hideHelpOptions} className={'w-menu-wrapper' + (showHelpOptions ? ' w-menu-wrapper-show' : '')}>
  				  <a className="w-help-menu" href="https://github.com/avwo/whistle#whistle" target="_blank"><span className="glyphicon glyphicon-question-sign"></span>Help</a>
            <MenuItem ref="helpMenuItem" options={state.helpOptions}
							className="w-help-menu-item" onClickOption={this.openWindow} />
          </div>
					<About />
					<Online />
					<div onMouseDown={this.preventBlur} style={{display: state.showCreateRules ? 'block' : 'none'}} className="shadow w-input-menu-item w-create-rules-input"><input ref="createRulesInput" onKeyDown={this.createRules} onBlur={this.hideOptions} type="text" maxLength="64" placeholder="Input the name" /><button type="button" onClick={this.createRules} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: state.showCreateValues ? 'block' : 'none'}} className="shadow w-input-menu-item w-create-values-input"><input ref="createValuesInput" onKeyDown={this.createValues} onBlur={this.hideOptions} type="text" maxLength="64" placeholder="Input the key" /><button type="button" onClick={this.createValues} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: state.showEditRules ? 'block' : 'none'}} className="shadow w-input-menu-item w-edit-rules-input"><input ref="editRulesInput" onKeyDown={this.editRules} onBlur={this.hideOptions} type="text" maxLength="64"  /><button type="button" onClick={this.editRules} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: state.showEditValues ? 'block' : 'none'}} className="shadow w-input-menu-item w-edit-values-input"><input ref="editValuesInput" onKeyDown={this.editValues} onBlur={this.hideOptions} type="text" maxLength="64" /><button type="button" onClick={this.editValues} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: state.showEditFilter ? 'block' : 'none'}} className="shadow w-input-menu-item w-edit-filter-input"><input ref="editFilterInput" onKeyDown={this.setFilter} onBlur={this.hideOptions} type="text" maxLength="128" defaultValue={state.filterText} placeholder={state.filterText ? null : 'Input the Substring or RegExp'} /><button type="button" onClick={this.setFilter} className="btn btn-primary">OK</button></div>
				</div>
				{state.hasRules ? <List ref="rules" disabled={state.disabledAllRules} theme={rulesTheme} fontSize={rulesFontSize} lineNumbers={showRulesLineNumbers} onSelect={this.selectRules} onUnselect={this.unselectRules} onActive={this.activeRules} modal={state.rules} hide={name == 'rules' ? false : true} name="rules" /> : null}
				{state.hasValues ? <List theme={valuesTheme} onDoubleClick={this.showEditValuesByDBClick} fontSize={valuesFontSize} lineNumbers={showValuesLineNumbers} onSelect={this.saveValues} onActive={this.activeValues} modal={state.values} hide={name == 'values' ? false : true} className="w-values-list" /> : null}
				{state.hasNetwork ? <Network ref="network" hide={name != 'rules' && name != 'values' && name != 'plugins' ? false : true} modal={state.network} /> : null}
				{state.hasPlugins ? <Plugins {...state} onOpen={this.activePluginTab} onClose={this.closePluginTab} onActive={this.activePluginTab} onChange={this.disablePlugin} ref="plugins" hide={name == 'plugins' ? false : true} /> : null}
				<div ref="rulesSettingsDialog" className="modal fade w-rules-settings-dialog">
					<div className="modal-dialog">
					  	<div className="modal-content">
					      <div className="modal-body">
					      	<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					      	<EditorSettings theme={rulesTheme} fontSize={rulesFontSize} lineNumbers={showRulesLineNumbers}
						      	onThemeChange={this.onRulesThemeChange} 
						      	onFontSizeChange={this.onRulesFontSizeChange} 
						      	onLineNumberChange={this.onRulesLineNumberChange} />
					      	<p className="w-editor-settings-box"><label><input type="checkbox" checked={state.allowMultipleChoice} onChange={this.allowMultipleChoice} /> Allow multiple choice</label></p>
					      	<p className="w-editor-settings-box"><label><input type="checkbox" checked={state.disabledAllRules} onChange={this.disableAllRules} /> Disable all rules</label></p>
					      	<p className="w-editor-settings-box"><label><input type="checkbox" checked={state.disabledAllPlugins} onChange={this.disableAllPlugins} /> Disable all plugins</label></p>
					      	<p className="w-editor-settings-box"><label><input type="checkbox" checked={state.syncWithSysHosts} onChange={this.syncWithSysHosts} /> Synchronized with the system hosts</label></p>
					      	<p className="w-editor-settings-box"><a onClick={this.importSysHosts} href="javascript:;" draggable="false">Import system hosts to <strong>Default</strong></a></p>
					      </div>
					      <div className="modal-footer">
					        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
					      </div>
					    </div>
					</div>
				</div>
				<div ref="valuesSettingsDialog" className="modal fade w-values-settings-dialog">
					<div className="modal-dialog"> 
				  		<div className="modal-content">
					      <div className="modal-body">
					      	<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						      <EditorSettings theme={valuesTheme} fontSize={valuesFontSize} lineNumbers={showValuesLineNumbers} 
							      onThemeChange={this.onValuesThemeChange} 
							      onFontSizeChange={this.onValuesFontSizeChange} 
							      onLineNumberChange={this.onValuesLineNumberChange} />
					      </div>
					      <div className="modal-footer">
					        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
					      </div>
					    </div>
				    </div>
				</div>
				<div ref="rootCADialog" className="modal fade w-https-dialog">
				<div className="modal-dialog"> 
			  		<div className="modal-content">
				      <div className="modal-body">
				      	<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					      <div>
					      	<a className="w-download-rootca" title="http://rootca.pro/" href="cgi-bin/rootca" target="_blank">Download RootCA</a>
					      	<a className="w-https-help" href="https://avwo.github.io/whistle/webui/https.html" target="_blank" title="How to intercept HTTPS CONNECTs">Help</a>
					      </div>
					      <a title="http://rootca.pro/" href="cgi-bin/rootca" target="_blank"><img src="img/rootca.png" /></a>
					      <div className="w-https-settings">
					      	<p><label><input checked={state.hideHttpsConnects} onChange={this.hideHttpsConnects} type="checkbox" /> Hide HTTPS CONNECTs</label></p>
					      	<p><label><input checked={state.interceptHttpsConnects} onChange={this.interceptHttpsConnects} type="checkbox" /> Intercept HTTPS CONNECTs</label></p>
					      </div>
				      </div>
				      <div className="modal-footer">
				        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
				      </div>
				    </div>
			    </div>
			</div>
			<div ref="chooseFileType" className="modal fade w-choose-filte-type">
  			<div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <label className="w-choose-filte-type-label">Save as:
                <select ref="fileType" className="form-control" value={state.exportFileType} onChange={this.chooseFileType}>
                  <option value="whistle">*.txt</option>
                  <option value="Fiddler">*.saz (For Fiddler)</option>
                </select>
              </label>
              <a type="button" className="btn btn-primary" onClick={this.exportBySave}>Confirm</a>
            </div>
          </div>
        </div>
			</div>
			<div ref="showUpdateTipsDialog" className="modal fade w-show-update-tips-dialog">
				<div className="modal-dialog">
				  	<div className="modal-content">
				      <div className="modal-body">
				      	<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				      	<p className="w-show-update-tips">whistle has important updates, it is recommended that you update to the latest version.</p>
				      	<p>Current version: {state.version}</p>
				      	<p>The latest stable version: {state.latestVersion}</p>
				      	<p>View change: <a title="Change log" href={'https://github.com/avwo/whistle/blob/master/CHANGELOG.md#v' + (state.latestVersion || '-').replace(/\./g, '')} target="_blank">CHANGELOG.md</a></p>
				      </div>
				      <div className="modal-footer">
				        <button type="button" className="btn btn-default" onClick={this.donotShowAgain} data-dismiss="modal">Don't show again</button>
				        <a type="button" className="btn btn-primary" onClick={this.hideUpdateTipsDialog} href="https://avwo.github.io/whistle/update.html" target="_blank">Update now</a>
				      </div>
				    </div>
				</div>
			</div>
			<form ref="exportSessionsForm" action="cgi-bin/sessions/export" style={{display: 'none'}}
			  method="post" enctype="multipart/form-data" target="_blank">
			  <input ref="exportFileType" name="exportFileType" type="hidden" />
			  <input ref="sessions" name="sessions" type="hidden" />
			</form>
			<form ref="importSessionsForm" enctype="multipart/form-data" style={{display: 'none'}}>  
			  <input ref="importSessions" onChange={this.uploadSessions} type="file" name="importSessions" accept=".txt,.saz" />
      </form>
			</div>
		);
	}
});
dataCenter.getInitialData(function(data) {
	ReactDOM.render(<Index modal={data} />, document.getElementById('container'));	
});


