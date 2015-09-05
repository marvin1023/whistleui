require('../css/index.css');
var $ = require('jquery');
var React = require('react');
var List = require('./list');
var ListModal = require('./list-modal');
var Network = require('./network');
var About = require('./about');
var Online = require('./online');
var MenuItem = require('./menu-item');
var dataCenter = require('./data-center');
var util = require('./util');

function getPageName() {
	return location.hash.substring(1) || location.href.replace(/[#?].*$/, '').replace(/.*\//, '');
}

var Index = React.createClass({
	getInitialState: function() {
		var state = {};
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
		
		var modal = this.props.modal;
		var rules = modal.rules;
		var values = modal.values;
		if (rules) {
			var selectedName = rules.current;
			var DEFAULT = 'Default';
			var selected = !rules.defaultRulesIsDisabled;
			rulesOptions.push({
				name: DEFAULT,
				icon: selected ? 'ok' : ''
			});
			rulesList.push(DEFAULT);
			rulesData.Default = {
					name: DEFAULT,
					value: rules.defaultRules,
					selected: selected,
					isDefault: true,
					active: selectedName === DEFAULT
			};
			
			$.each(rules.list, function() {
				rulesList.push(this.name);
				
				rulesData[this.name] = {
					name: this.name,
					value: this.data,
					selected: this.selected,
					active: selectedName === this.name
				};
				rulesOptions.push({
					name: this.name,
					icon: this.selected ? 'ok' : ''
				});
			});
		}
		
		if (values) {
			var selectedName = values.current;
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
				self.hideOnBlur();
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
	},
	preventBlur: function(e) {
		e.target.nodeName != 'INPUT' && e.preventDefault();
	},
	startLoadData: function() {
		var self = this;
		if (self._updateNetwork) {
			self._updateNetwork;
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
		this.setMenuOptionsState();
		this.setState({
			hasNetwork: true,
			name: 'network'
		}, function() {
			this.startLoadData();
		});
		location.hash = 'network';
	},
	showRules: function() {
		this.setMenuOptionsState();
		this.setState({
			hasRules: true,
			name: 'rules'
		});
		location.hash = 'rules';
	},
	showValues: function() {
		this.setMenuOptionsState();
		this.setState({
			hasValues: true,
			name: 'values'
		});
		location.hash = 'values';
	},
	showRulesOptions: function() {
		var self = this;
		self.setMenuOptionsState('showRulesOptions', function() {
			self.refs.rulesMenuItem.getDOMNode().focus();
		});
	},
	showValuesOptions: function() {
		var self = this;
		self.setMenuOptionsState('showValuesOptions', function() {
			self.refs.valuesMenuItem.getDOMNode().focus();
		});
	},
	showWeinreOptions: function() {
		var self = this;
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
				showWeinreOptions: false
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
				modal.add(name);
				self.setRulesActive(name);
				target.value = '';
				target.blur();
				self.forceUpdate();
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
				modal.add(name);
				self.setValuesActive(name);
				target.value = '';
				target.blur();
				self.forceUpdate();
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
				self.forceUpdate();
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
				self.forceUpdate();
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
	selectRules: function(item) {
		var self = this;
		dataCenter.rules[item.isDefault ? 'enableDefault' : 'select'](item, function(data) {
			if (data && data.ec === 0) {
				self.setSelected(self.state.rules, item.name);
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
				self.setSelected(self.state.rules, item.name, false);
			} else {
				util.showSystemError();
			}
		});
		return false;
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
			this.forceUpdate();
		}
	},
	replay: function() {
		
	},
	composer: function() {
		
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
		this.setState({
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
						self.forceUpdate();
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
						self.forceUpdate();
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
	setRulesSettings: function() {
		
	},
	setValuesSettings: function() {
		
	},
	hideOnBlur: function() {
		this.setState({
			showCreateRules: false,
			showCreateValues: false,
			showEditRules: false,
			showEditValues: false,
			showEditFilter: false
		});
	},
	onClickMenu: function(e) {
		var target = $(e.target).closest('a');
		var isRules = this.state.name == 'rules';
		if (target.hasClass('w-create-menu')) {
			isRules ? this.showCreateRules() : this.showCreateValues();
		} else if (target.hasClass('w-edit-menu')) {
			isRules ? this.showEditRules() : this.showEditValues();
		} else if (target.hasClass('w-delete-menu')) {
			isRules ? this.removeRules() : this.removeValues();
		}
	},
	showSettings: function(e) {
		this.state.name == 'rules' ? this.setRulesSettings() : this.setValuesSettings();
	},
	activeRules: function(item) {
		dataCenter.rules.setCurrent({name: item.name});
		this.forceUpdate();
	},
	activeValues: function(item) {
		dataCenter.values.setCurrent({name: item.name});
		this.forceUpdate();
	},
	render: function() {
		var name = this.state.name;
		var isNetwork = name === undefined || name == 'network';
		var isRules = name == 'rules';
		var isValues = name == 'values';
		var disabledEditBtn = true;
		var disabledDeleteBtn = true;
		if (isRules) {
			var data = this.state.rules.data;
			for (var i in data) {
				if (data[i].active) {
					disabledEditBtn = disabledDeleteBtn = data[i].isDefault;
					break;
				}
			}
		} else if (isValues) {
			var data = this.state.values.data;
			for (var i in data) {
				if (data[i].active) {
					disabledEditBtn = disabledDeleteBtn = false;
					break;
				}
			}
		}
		
		return (
			<div className="main orient-vertical-box">
				<div className={'w-menu w-' + name + '-menu-list'}>
					<a onClick={this.showNetwork} className="w-network-menu" style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-align-justify"></span>Network</a>
					<a onClick={this.showRulesOptions} className="w-rules-menu" style={{display: isRules ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-list"></span>Rules</a>
					<a onClick={this.showValuesOptions} className="w-values-menu" style={{display: isValues ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-folder-open"></span>Values</a>
					<a onClick={this.onClickMenu} className="w-create-menu" style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-plus"></span>Create</a>
					<a onClick={this.onClickMenu} className={'w-edit-menu' + (disabledEditBtn ? ' w-disabled' : '')} style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-edit"></span>Edit</a>
					<a onClick={this.autoScroll} className="w-clear-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-play"></span>AutoScroll</a>
					<a onClick={this.replay} className={'w-replay-menu' + (this.state.disabledReplayBtn ? ' w-disabled' : '')} style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-repeat"></span>Replay</a>
					<a onClick={this.composer} className="w-composer-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-edit"></span>Composer</a>
					<a onClick={this.showEditFilter} className={'w-filter-menu' + (this.state.filterText ? ' w-menu-enable' : '')} style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-filter"></span>Filter</a>
					<a onClick={this.clear} className="w-clear-menu" style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-remove"></span>Clear</a>
					<a onClick={this.onClickMenu} className={'w-delete-menu' + (disabledDeleteBtn ? ' w-disabled' : '')} style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-trash"></span>Delete</a>
					<a onClick={this.showSettings} className="w-settings-menu" style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-cog"></span>Settings</a>
					<a onClick={this.showWeinreOptions} className="w-weinre-menu" href="javascript:;"><span className="glyphicon glyphicon-globe"></span>Weinre</a>
					<a onClick={this.onClickMenu} className="w-rootca-menu" href="javascript:;"><span className="glyphicon glyphicon-download-alt"></span>RootCA</a>
					<a className="w-help-menu" href="https://github.com/avwo/whistle#whistle" target="_blank"><span className="glyphicon glyphicon-question-sign"></span>Help</a>
					<About />
					<Online />
					<MenuItem ref="rulesMenuItem" name="Open" options={this.state.rulesOptions} hide={!this.state.showRulesOptions} className="w-rules-menu-item" onBlur={this.hideOptions} onClick={this.showRules} onClickOption={this.props.onClickOption} />
					<MenuItem ref="valuesMenuItem" name="Open" options={this.state.valuesOptions} hide={!this.state.showValuesOptions} className="w-values-menu-item" onBlur={this.hideOptions} onClick={this.showValues} onClickOption={this.props.onClickOption} />
					<MenuItem ref="weinreMenuItem" name="Anonymous" options={this.state.weinreOptions} hide={!this.state.showWeinreOptions} className="w-weinre-menu-item" onBlur={this.hideOptions} onClick={this.showAnonymousWeinre} onClickOption={this.showWeinre} />
					<div onMouseDown={this.preventBlur} style={{display: this.state.showCreateRules ? 'block' : 'none'}} className="shadow w-input-menu-item w-create-rules-input"><input ref="createRulesInput" onKeyDown={this.createRules} onBlur={this.hideOnBlur} type="text" maxLength="64" placeholder="create rules" /><button type="button" onClick={this.createRules} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: this.state.showCreateValues ? 'block' : 'none'}} className="shadow w-input-menu-item w-create-values-input"><input ref="createValuesInput" onKeyDown={this.createValues} onBlur={this.hideOnBlur} type="text" maxLength="64" placeholder="create values" /><button type="button" onClick={this.createValues} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: this.state.showEditRules ? 'block' : 'none'}} className="shadow w-input-menu-item w-edit-rules-input"><input ref="editRulesInput" onKeyDown={this.editRules} onBlur={this.hideOnBlur} type="text" maxLength="64" placeholder={'rename ' + (this.state.selectedRuleName || '')} /><button type="button" onClick={this.editRules} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: this.state.showEditValues ? 'block' : 'none'}} className="shadow w-input-menu-item w-edit-values-input"><input ref="editValuesInput" onKeyDown={this.editValues} onBlur={this.hideOnBlur} type="text" maxLength="64" placeholder={'rename ' + (this.state.selectedValueName || '')} /><button type="button" onClick={this.editValues} className="btn btn-primary">OK</button></div>
					<div onMouseDown={this.preventBlur} style={{display: this.state.showEditFilter ? 'block' : 'none'}} className="shadow w-input-menu-item w-edit-filter-input"><input ref="editFilterInput" onKeyDown={this.setFilter} onBlur={this.hideOnBlur} type="text" maxLength="64" placeholder={this.state.filterText || 'string or regular'} /><button type="button" onClick={this.setFilter} className="btn btn-primary">OK</button></div>
				</div>
				{this.state.hasRules ? <List onSelect={this.selectRules} onUnselect={this.unselectRules} onActive={this.activeRules} modal={this.state.rules} hide={name == 'rules' ? false : true} name="rules" /> : ''}
				{this.state.hasValues ? <List onSelect={this.saveValues} onActive={this.activeValues} modal={this.state.values} hide={name == 'values' ? false : true} className="w-values-list" /> : ''}
				{this.state.hasNetwork ? <Network ref="network" hide={name != 'rules' && name != 'values' ? false : true} modal={this.state.network} /> : ''}
			</div>
		);
	}
});
dataCenter.getInitialData(function(data) {
	React.render(<Index modal={data} />, document.body);	
});


