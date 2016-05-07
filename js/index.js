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
var events = require('./events');
var MAX_PLUGINS_TABS = 6;

function getPageName() {
	return location.hash.substring(1) || location.href.replace(/[#?].*$/, '').replace(/.*\//, '');
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
					value: rules.defaultRules,
					selected: selected,
					isDefault: true,
					active: selectedName === DEFAULT
			};
			
			rulesOptions.push(rulesData.Default);
			
			$.each(rules.list, function() {
				rulesList.push(this.name);
				item = rulesData[this.name] = {
					name: this.name,
					value: this.data,
					selected: this.selected,
					active: selectedName === this.name
				};
				rulesOptions.push(item);
			});
		}
		
		if (values) {
			var selectedName = values.current;
			state.valuesTheme = values.theme;
			state.valuesFontSize = values.fontSize;
			state.showValuesLineNumbers = values.showLineNumbers;
			$.each(values.list, function() {
				valuesList.push(this.name);
				valuesData[this.name] = {
					name: this.name,
					value: this.data,
					active: selectedName === this.name
				};
				valuesOptions.push({
					name: this.name,
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
				icon: 'checkbox'
			});
		});
		return pluginsOptions;
	},
	componentDidMount: function() {
		var self = this;
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
			if ((e.ctrlKey || e.metaKey) && e.keyCode == 88) {
				self.clear();
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
		
		dataCenter.on('serverInfo', function(data) {
			self.serverInfo = data;
		});
		
		events.on('executeComposer', function() {
			self.autoScroll && self.autoScroll();
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
					atBottom && self.autoScroll();
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
			loadPlugins();
		}, 10000);
		
		function loadPlugins() {
	        dataCenter.plugins.getPlugins(function(data) {
	            if (data && data.ec === 0) {
	            	self.setState({
                    	plugins: data.plugins,
                    	disabledPlugins: data.disabledPlugins,
                    	pluginsOptions: self.createPluginsOptions(data.plugins)
                    });
	            }
	            setTimeout(loadPlugins, 10000);
	        });
	    }
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
		self.autoScroll = scrollToBottom;
		self.scrollerAtBottom = atBottom;
		
		function atBottom() {
			return con.scrollTop + con.offsetHeight + 5 > body.offsetHeight;
		}
	},
	showPlugins: function() {
		if (this.state.name == 'plugins') {
			return;
		}
		this.setMenuOptionsState();
		this.hidePluginsOptions();
		this.setState({
			hasPlugins: true,
			name: 'plugins'
		});
		location.hash = 'plugins';
	},
	showNetwork: function() {
		if (this.state.name == 'network') {
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
	showAndActiveRules: function(item) {
		this.setRulesActive(item.name);
		this.showRules();
	},
	showRules: function() {
		if (this.state.name == 'rules') {
			return;
		}
		this.setMenuOptionsState();
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
	showValues: function() {
		if (this.state.name == 'values') {
			return;
		}
		this.setMenuOptionsState();
		this.setState({
			hasValues: true,
			name: 'values'
		});
		location.hash = 'values';
	},
	showRulesOptions: function(e) {
		var self = this;
		var target = $(e.target);
		var rules = self.state.rules;
		var data = rules.data;
		var selectedList = [];
		var list = [];
		rules.list.forEach(function(name) {
			var item = data[name];
			item.selected ? selectedList.push(item) : list.push(item);
		});
		self.state.rulesOptions = selectedList.concat(list);
		self.setState({}, function() {
			target.closest('.w-menu-wrapper').addClass('w-menu-wrapper-show');
		});
	},
	hideMenuOptions: function(e) {
		$(e.target).closest('.w-menu-wrapper').removeClass('w-menu-wrapper-show');
	},
	showValuesOptions: function(e) {
		var self = this;
		var target = $(e.target);
		var valuesList = this.state.values.list;
		var list = self.getValuesFromRules() || [];
		list = util.unique(list.concat(valuesList));
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
		self.setState({}, function() {
			target.closest('.w-menu-wrapper').addClass('w-menu-wrapper-show');
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
				alert('You can only open ' + MAX_PLUGINS_TABS + ' tabs');
				return this.showPlugins();
			}
			active = name;
			tabs.push({
				name: name,
				url: 'http://' + name + '.local.whistlejs.com/'
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
	showPluginsOptions: function(e) {
		$(e.target).closest('.w-menu-wrapper').addClass('w-menu-wrapper-show');
	},
	hidePluginsOptions: function() {
		$(ReactDOM.findDOMNode(this.refs.pluginsMenu)).removeClass('w-menu-wrapper-show');
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
		self.setState({}, function() {
			target.closest('.w-menu-wrapper').addClass('w-menu-wrapper-show');
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
			alert('Rule name can not be empty.');
			return;
		}
		
		var modal = self.state.rules;
		if (modal.exists(name)) {
			alert('Rule name \'' + name + '\' already exists.');
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
			alert('Value name can not be empty.');
			return;
		}
		
		if (/\s/.test(name)) {
			alert('Name can not have spaces.');
			return;
		}
		
		var modal = self.state.values;
		if (modal.exists(name)) {
			alert('Value name \'' + name + '\' already exists.');
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
		this.setState({
			showEditRules: true,
			selectedRuleName: activeItem.name,
			selectedRule: activeItem
		}, function() {
			editRulesInput.focus();
		});	
	},
	showEditValues: function() {
		var modal = this.state.values;
		var activeItem = modal.getActive();
		if (!activeItem || activeItem.isDefault) {
			return;
		}
		
		var editValuesInput = ReactDOM.findDOMNode(this.refs.editValuesInput);
		this.setState({
			showEditValues: true,
			selectedValueName: activeItem.name,
			selectedValue: activeItem
		}, function() {
			editValuesInput.focus();
		});	
	},
	showEditFilter: function() {
		var editFilterInput = ReactDOM.findDOMNode(this.refs.editFilterInput);
		this.setState({
			showEditFilter: true
		}, function() {
			editFilterInput.focus();
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
		var hostname = location.hostname;
		hostname = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) && this.serverInfo ? 
				hostname + ':' + this.serverInfo.weinrePort : 'weinre.local.whistlejs.com';
		window.open('http://' + hostname + '/client/#' + (name || 'anonymous'));
		this.hideOptions();
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
		this.autoScroll && this.autoScroll();
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
				target.value = '';
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
				  self.setState({
					  disabledAllPlugins: checked
				});
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
				self.setState({
					disabledPlugins: data.data
				});
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
		
		rulesOptions.forEach(function(item) {
			item.icon = item.selected ? 'ok' : 'edit';
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
		
		return (
			<div className="main orient-vertical-box">
				<div className={'w-menu w-' + name + '-menu-list'}>
					<a onClick={this.showNetwork} className="w-network-menu" style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-align-justify"></span>Network</a>
					<div onMouseEnter={this.showRulesOptions} onMouseLeave={this.hideMenuOptions} style={{display: isRules ? 'none' : ''}} className="w-menu-wrapper">
						<a onClick={this.showRules} className="w-rules-menu" href="javascript:;"><span className="glyphicon glyphicon-list"></span>Rules</a>
						<MenuItem ref="rulesMenuItem" name="Open" options={rulesOptions} disabled={state.disabledAllRules} className="w-rules-menu-item" onClick={this.showRules} onClickOption={this.showAndActiveRules} />
					</div>
					<div onMouseEnter={this.showValuesOptions} onMouseLeave={this.hideMenuOptions} style={{display: isValues ? 'none' : ''}} className="w-menu-wrapper">
						<a onClick={this.showValues} className="w-values-menu" href="javascript:;"><span className="glyphicon glyphicon-folder-open"></span>Values</a>
						<MenuItem ref="valuesMenuItem" name="Open" options={state.valuesOptions} className="w-values-menu-item" onClick={this.showValues} onClickOption={this.showAndActiveValues} />
					</div>
					<div ref="pluginsMenu" onMouseEnter={this.showPluginsOptions} onMouseLeave={this.hidePluginsOptions} className="w-menu-wrapper">
						<a onClick={this.showPlugins} className="w-plugins-menu" href="javascript:;"><span className="glyphicon glyphicon-list-alt"></span>Plugins</a>
						<MenuItem ref="pluginsMenuItem" name={name == 'plugins' ? null : 'Open'} options={pluginsOptions} checkedOptions={state.disabledPlugins} disabled={state.disabledAllRules || state.disabledAllPlugins} className="w-plugins-menu-item" onClick={this.showPlugins} onChange={this.disablePlugin} onClickOption={this.showAndActivePlugins} />
					</div>
					<a onClick={this.onClickMenu} className="w-save-menu" style={{display: (isNetwork || isPlugins) ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-save-file"></span>Save</a>
					<a onClick={this.onClickMenu} className="w-create-menu" style={{display: (isNetwork || isPlugins) ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-plus"></span>Create</a>
					<a onClick={this.onClickMenu} className={'w-edit-menu' + (disabledEditBtn ? ' w-disabled' : '')} style={{display: (isNetwork || isPlugins) ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-edit"></span>Edit</a>
					<a onClick={this.autoScroll} className="w-scroll-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-play"></span>AutoScroll</a>
					<a onClick={this.replay} className="w-replay-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-repeat"></span>Replay</a>
					<a onClick={this.composer} className="w-composer-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-edit"></span>Composer</a>
					<a onClick={this.showEditFilter} className={'w-filter-menu' + (state.filterText ? ' w-menu-enable' : '')} title={state.filterText} style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-filter"></span>Filter</a>
					<a onClick={this.clear} className="w-clear-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;" title="Ctrl[Command]+D"><span className="glyphicon glyphicon-remove"></span>Clear</a>
					<a onClick={this.onClickMenu} className={'w-delete-menu' + (disabledDeleteBtn ? ' w-disabled' : '')} style={{display: (isNetwork || isPlugins) ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-trash"></span>Delete</a>
					<a onClick={this.showSettings} className="w-settings-menu" style={{display: (isNetwork || isPlugins) ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-cog"></span>Settings</a>
					<div onMouseEnter={this.showWeinreOptions} onMouseLeave={this.hideMenuOptions} className="w-menu-wrapper">
						<a onClick={this.showAnonymousWeinre} className="w-weinre-menu" href="javascript:;"><span className="glyphicon glyphicon-globe"></span>Weinre</a>
						<MenuItem ref="weinreMenuItem" name="Anonymous" options={state.weinreOptions} className="w-weinre-menu-item" onClick={this.showAnonymousWeinre} onClickOption={this.showWeinre} />
					</div>
					<a onClick={this.showHttpsSettingsDialog} className="w-https-menu" href="javascript:;"><span className="glyphicon glyphicon-lock"></span>Https</a>
					<a className="w-help-menu" href="https://github.com/avwo/whistle#whistle" target="_blank"><span className="glyphicon glyphicon-question-sign"></span>Help</a>
					<About />
					<Online />
					<div onMouseDown={this.preventBlur} style={{display: state.showCreateRules ? 'block' : 'none'}} className="shadow w-input-menu-item w-create-rules-input"><input ref="createRulesInput" onKeyDown={this.createRules} onBlur={this.hideOptions} type="text" maxLength="64" placeholder="create rules" /><button type="button" onClick={this.createRules} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: state.showCreateValues ? 'block' : 'none'}} className="shadow w-input-menu-item w-create-values-input"><input ref="createValuesInput" onKeyDown={this.createValues} onBlur={this.hideOptions} type="text" maxLength="64" placeholder="create values" /><button type="button" onClick={this.createValues} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: state.showEditRules ? 'block' : 'none'}} className="shadow w-input-menu-item w-edit-rules-input"><input ref="editRulesInput" onKeyDown={this.editRules} onBlur={this.hideOptions} type="text" maxLength="64" placeholder={'rename ' + (state.selectedRuleName || '')} /><button type="button" onClick={this.editRules} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: state.showEditValues ? 'block' : 'none'}} className="shadow w-input-menu-item w-edit-values-input"><input ref="editValuesInput" onKeyDown={this.editValues} onBlur={this.hideOptions} type="text" maxLength="64" placeholder={'rename ' + (state.selectedValueName || '')} /><button type="button" onClick={this.editValues} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: state.showEditFilter ? 'block' : 'none'}} className="shadow w-input-menu-item w-edit-filter-input"><input ref="editFilterInput" onKeyDown={this.setFilter} onBlur={this.hideOptions} type="text" maxLength="64" placeholder={state.filterText || 'substring or regular'} /><button type="button" onClick={this.setFilter} className="btn btn-primary">OK</button></div>
				</div>
				{state.hasRules ? <List ref="rules" disabled={state.disabledAllRules} theme={rulesTheme} fontSize={rulesFontSize} lineNumbers={showRulesLineNumbers} onSelect={this.selectRules} onUnselect={this.unselectRules} onActive={this.activeRules} modal={state.rules} hide={name == 'rules' ? false : true} name="rules" /> : null}
				{state.hasValues ? <List theme={valuesTheme} fontSize={valuesFontSize} lineNumbers={showValuesLineNumbers} onSelect={this.saveValues} onActive={this.activeValues} modal={state.values} hide={name == 'values' ? false : true} className="w-values-list" /> : null}
				{state.hasNetwork ? <Network ref="network" hide={name != 'rules' && name != 'values' && name != 'plugins' ? false : true} modal={state.network} /> : null}
				{state.hasPlugins ? <Plugins {...state} onActive={this.activePluginTab} onChange={this.disablePlugin} ref="plugins" hide={name == 'plugins' ? false : true} /> : null}
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
					      	<p className="w-editor-settings-box"><a onClick={this.importSysHosts} href="javascript:;">Import system hosts to <strong>Default</strong></a></p>
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
					      	<a className="w-download-rootca" href="/cgi-bin/rootca" target="_blank">Download RootCA</a>
					      	<a className="w-https-help" href="https://github.com/avwo/whistle/wiki/%E5%90%AF%E7%94%A8https" target="_blank" title="How to intercept HTTPS CONNECTs">Help</a>
					      </div>
					      <a title="Download RootCA" href="/cgi-bin/rootca" target="_blank"><img src="/img/rootca.png" /></a>
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
			<div ref="showUpdateTipsDialog" className="modal fade w-show-update-tips-dialog">
				<div className="modal-dialog">
				  	<div className="modal-content">
				      <div className="modal-body">
				      	<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				      	<p className="w-show-update-tips">whistle has important updates, it is recommended that you update to the latest version.</p>
				      	<p>Current version: {state.version}</p>
				      	<p>The latest stable version: {state.latestVersion}</p>
				      	<p>View change: <a title="Change log" href={'https://github.com/avwo/whistle/blob/master/CHANGELOG.md#v' + (state.latestVersion || '').replace(/\./g, '')} target="_blank">CHANGELOG.md</a></p>
				      </div>
				      <div className="modal-footer">
				        <button type="button" className="btn btn-default" onClick={this.donotShowAgain} data-dismiss="modal">Don't show again</button>
				        <a type="button" className="btn btn-primary" onClick={this.hideUpdateTipsDialog} href="https://github.com/avwo/whistle/wiki/%E6%9B%B4%E6%96%B0whistle" target="_blank">Update now</a>
				      </div>
				    </div>
				</div>
			</div>
			</div>
		);
	}
});
dataCenter.getInitialData(function(data) {
	ReactDOM.render(<Index modal={data} />, document.getElementById('container'));	
});


