require('../css/index.css');
var $ = require('jquery');
var React = require('react');
var List = require('./list');
var ListModal = require('./list-modal');
var Network = require('./network');
var About = require('./about');
var Online = require('./online');
var MenuItem = require('./menu-item');
var EditorSettings = require('./editor-settings');
var dataCenter = require('./data-center');
var util = require('./util');
var events = require('./events');

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
		
		state.rules = new ListModal(rulesList, rulesData);
		state.rulesOptions = rulesOptions;
		state.values = new ListModal(valuesList, valuesData);
		state.valuesOptions = valuesOptions;
		state.filterText = modal.filterText;
		
		return state;
	},
	componentDidMount: function() {
		var self = this;
		$(window).on('hashchange', function() {
			var pageName = getPageName();
			if (!pageName || pageName.indexOf('rules') != -1) {
				self.showRules();
			} else if (pageName.indexOf('values') != -1) {
				self.showValues();
			} else {
				self.showNetwork();
			}
		}).on('keyup', function(e) {
			if (e.keyCode == 27) {
				self.hideOptions();
			}
		}).on('keydown', function(e) {
			if ((e.ctrlKey || e.metaKey) && e.keyCode == 88) {
				self.clear();
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
		var modal = this.state.rules;
		var data = modal.data;
		modal.list.forEach(function(name) {
			var value = data[name].value;
			value && result.push(value);
		});
		return result.join('\r\n');
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
		
		var con = $(self.refs.network.getDOMNode())
			.find('.w-req-data-list').scroll(function() {
				var modal = self.state.network;
				if (modal && atBottom()) {
					update(modal, true);
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
		
		function atBottom() {
			return con.scrollTop + con.offsetHeight + 5 > body.offsetHeight;
		}
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
	showRulesOptions: function() {
		var self = this;
		var rules = self.state.rules;
		var data = rules.data;
		self.state.rulesOptions = rules.list.map(function(name) {
			return data[name];
		});
		self.setMenuOptionsState('showRulesOptions', function() {
			self.refs.rulesMenuItem.getDOMNode().focus();
		});
	},
	showValuesOptions: function() {
		var self = this;
		var valuesList = this.state.values.list;
		var list = self.getValuesFromRules() || [];
		list.push.apply(list, valuesList);
		list = util.unique(list, true);
		self.state.valuesOptions = list.map(function(name) {
			return {
				name: name,
				icon: valuesList.indexOf(name) == -1 ? 'plus' : 'edit'
			};
		});
		self.setMenuOptionsState('showValuesOptions', function() {
			self.refs.valuesMenuItem.getDOMNode().focus();
		});
	},
	showWeinreOptions: function() {
		var self = this;
		var list = self.state.weinreOptions = self.getWeinreFromRules() || [];
		self.state.weinreOptions = util.unique(list).map(function(name) {
			return {
				name: name,
				icon: 'globe'
			};
		});
		self.setMenuOptionsState('showWeinreOptions', function() {
			self.refs.weinreMenuItem.getDOMNode().focus();
		});
	},
	hideOptions: function() {
		this.setMenuOptionsState();
	},
	setMenuOptionsState: function(name, callback) {
		var state = {
				showRulesOptions: false,
				showValuesOptions: false,
				showWeinreOptions: false,
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
		var createRulesInput = this.refs.createRulesInput.getDOMNode();
		this.setState({
			showCreateRules: true
		}, function() {
			createRulesInput.focus();
		});
	},
	showCreateValues: function() {
		var createValuesInput = this.refs.createValuesInput.getDOMNode();
		this.setState({
			showCreateValues: true
		}, function() {
			createValuesInput.focus();
		});
	},
	createRules: function(e) {
		if (e.keyCode != 13 && e.type != 'click') {
			return;
		}
		var self = this;
		var target = self.refs.createRulesInput.getDOMNode();
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
		var target = self.refs.createValuesInput.getDOMNode();
		var name = $.trim(target.value);
		if (!name) {
			alert('Value name can not be empty.');
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
		var editRulesInput = this.refs.editRulesInput.getDOMNode();
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
		
		var editValuesInput = this.refs.editValuesInput.getDOMNode();
		this.setState({
			showEditValues: true,
			selectedValueName: activeItem.name,
			selectedValue: activeItem
		}, function() {
			editValuesInput.focus();
		});	
	},
	showEditFilter: function() {
		var editFilterInput = this.refs.editFilterInput.getDOMNode();
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
		var target = self.refs.editRulesInput.getDOMNode();
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
		var target = self.refs.editValuesInput.getDOMNode();
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
		var target = self.refs.editFilterInput.getDOMNode();
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
		$(this.refs.rulesSettingsDialog.getDOMNode()).modal('show');
	},
	showValuesSettings: function() {
		$(this.refs.valuesSettingsDialog.getDOMNode()).modal('show');
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
					self.refs.rules.refs.list.getDOMNode().scrollTop = 0;
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
		var disabledEditBtn = true;
		var disabledDeleteBtn = true;
		var rulesTheme = 'cobalt';
		var valuesTheme = 'cobalt';
		var rulesFontSize = '14px';
		var valuesFontSize = '14px';
		var showRulesLineNumbers = false;
		var showValuesLineNumbers = false;
		var rulesOptions = state.rulesOptions;
		
		rulesOptions.forEach(function(item) {
			item.icon = item.selected ? 'ok' : '';
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
					<a onClick={this.showRulesOptions} onDoubleClick={this.showRules} className="w-rules-menu" style={{display: isRules ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-list"></span>Rules</a>
					<a onClick={this.showValuesOptions} onDoubleClick={this.showValues} className="w-values-menu" style={{display: isValues ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-folder-open"></span>Values</a>
					<a onClick={this.onClickMenu} className="w-save-menu" style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-save-file"></span>Save</a>
					<a onClick={this.onClickMenu} className="w-create-menu" style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-plus"></span>Create</a>
					<a onClick={this.onClickMenu} className={'w-edit-menu' + (disabledEditBtn ? ' w-disabled' : '')} style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-edit"></span>Edit</a>
					<a onClick={this.autoScroll} className="w-scroll-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-play"></span>AutoScroll</a>
					<a onClick={this.replay} className="w-replay-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-repeat"></span>Replay</a>
					<a onClick={this.composer} className="w-composer-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-edit"></span>Composer</a>
					<a onClick={this.showEditFilter} className={'w-filter-menu' + (state.filterText ? ' w-menu-enable' : '')} style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-filter"></span>Filter</a>
					<a onClick={this.clear} className="w-clear-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;" title="Ctrl[Command]+D"><span className="glyphicon glyphicon-remove"></span>Clear</a>
					<a onClick={this.onClickMenu} className={'w-delete-menu' + (disabledDeleteBtn ? ' w-disabled' : '')} style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-trash"></span>Delete</a>
					<a onClick={this.showSettings} className="w-settings-menu" style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-cog"></span>Settings</a>
					<a onClick={this.showWeinreOptions} onDoubleClick={this.showAnonymousWeinre} className="w-weinre-menu" href="javascript:;"><span className="glyphicon glyphicon-globe"></span>Weinre</a>
					<a onClick={this.onClickMenu} className="w-rootca-menu" href="javascript:;"><span className="glyphicon glyphicon-download-alt"></span>RootCA</a>
					<a className="w-help-menu" href="https://github.com/avwo/whistle#whistle" target="_blank"><span className="glyphicon glyphicon-question-sign"></span>Help</a>
					<About />
					<Online />
					<MenuItem ref="rulesMenuItem" name="Open" options={rulesOptions} hide={!state.showRulesOptions} className="w-rules-menu-item" onBlur={this.hideOptions} onClick={this.showRules} onClickOption={this.onClickRulesOption} onDoubleClickOption={this.showAndActiveRules} />
					<MenuItem ref="valuesMenuItem" name="Open" options={state.valuesOptions} hide={!state.showValuesOptions} className="w-values-menu-item" onBlur={this.hideOptions} onClick={this.showValues} onClickOption={this.showAndActiveValues} />
					<MenuItem ref="weinreMenuItem" name="Anonymous" options={state.weinreOptions} hide={!state.showWeinreOptions} className="w-weinre-menu-item" onBlur={this.hideOptions} onClick={this.showAnonymousWeinre} onClickOption={this.showWeinre} />
					<div onMouseDown={this.preventBlur} style={{display: state.showCreateRules ? 'block' : 'none'}} className="shadow w-input-menu-item w-create-rules-input"><input ref="createRulesInput" onKeyDown={this.createRules} onBlur={this.hideOptions} type="text" maxLength="64" placeholder="create rules" /><button type="button" onClick={this.createRules} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: state.showCreateValues ? 'block' : 'none'}} className="shadow w-input-menu-item w-create-values-input"><input ref="createValuesInput" onKeyDown={this.createValues} onBlur={this.hideOptions} type="text" maxLength="64" placeholder="create values" /><button type="button" onClick={this.createValues} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: state.showEditRules ? 'block' : 'none'}} className="shadow w-input-menu-item w-edit-rules-input"><input ref="editRulesInput" onKeyDown={this.editRules} onBlur={this.hideOptions} type="text" maxLength="64" placeholder={'rename ' + (state.selectedRuleName || '')} /><button type="button" onClick={this.editRules} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: state.showEditValues ? 'block' : 'none'}} className="shadow w-input-menu-item w-edit-values-input"><input ref="editValuesInput" onKeyDown={this.editValues} onBlur={this.hideOptions} type="text" maxLength="64" placeholder={'rename ' + (state.selectedValueName || '')} /><button type="button" onClick={this.editValues} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: state.showEditFilter ? 'block' : 'none'}} className="shadow w-input-menu-item w-edit-filter-input"><input ref="editFilterInput" onKeyDown={this.setFilter} onBlur={this.hideOptions} type="text" maxLength="64" placeholder={state.filterText || 'string or regular'} /><button type="button" onClick={this.setFilter} className="btn btn-primary">OK</button></div>
				</div>
				{state.hasRules ? <List ref="rules" theme={rulesTheme} fontSize={rulesFontSize} lineNumbers={showRulesLineNumbers} onSelect={this.selectRules} onUnselect={this.unselectRules} onActive={this.activeRules} modal={state.rules} hide={name == 'rules' ? false : true} name="rules" /> : ''}
				{state.hasValues ? <List theme={valuesTheme} fontSize={valuesFontSize} lineNumbers={showValuesLineNumbers} onSelect={this.saveValues} onActive={this.activeValues} modal={state.values} hide={name == 'values' ? false : true} className="w-values-list" /> : ''}
				{state.hasNetwork ? <Network ref="network" hide={name != 'rules' && name != 'values' ? false : true} modal={state.network} /> : ''}
				<div ref="rulesSettingsDialog" className="modal fade w-rules-settings-dialog">
					<div className="modal-dialog">
					  	<div className="modal-content">
					      <div className="modal-body">
					      	<EditorSettings theme={rulesTheme} fontSize={rulesFontSize} lineNumbers={showRulesLineNumbers}
						      	onThemeChange={this.onRulesThemeChange} 
						      	onFontSizeChange={this.onRulesFontSizeChange} 
						      	onLineNumberChange={this.onRulesLineNumberChange} />
					      	<p className="w-editor-settings-box"><label><input type="checkbox" checked={state.allowMultipleChoice} onChange={this.allowMultipleChoice} /> Allow multiple choice</label></p>
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
			</div>
		);
	}
});
dataCenter.getInitialData(function(data) {
	React.render(<Index modal={data} />, document.body);	
});


