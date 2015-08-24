require('../css/index.css');
var $ = require('jquery');
var React = require('react');
var Menu = require('./menu');
var List = require('./list');
var Network = require('./network');
var MenuItem = require('./menu-item');
var dataCenter = require('./data-center');
var util = require('./util');
var pageName = getPageName();

function getPageName() {
	return location.hash.substring(1) || location.href.replace(/[#?].*$/, '').replace(/.*\//, '');
}

var Index = React.createClass({
	getInitialState: function() {
		var state = {};
		if (!pageName || pageName.indexOf('rules') != -1) {
			state.hasRules = true;
			state.name = 'rules';
		} else if (pageName.indexOf('values') != -1) {
			state.hasValues = true;
			state.name = 'values';
		} else {
			state.hasNetwork = true;
		}
		var rulesList = [];
		var rulesData = [];
		var valuesList = [];
		var valuesData = [];
		
		state.rules = {
				list: rulesList,
				data: rulesData
			};
		state.values = {
				list: valuesList,
				data: valuesData
			};
		var modal = this.props.modal;
		var rules = modal.rules;
		var values = modal.values;
		if (rules) {
			rulesList.push('Default');
			rulesData.Default = {
					name: 'Default',
					value: rules.defaultRules,
					active: !rules.defaultRulesIsDisabled,
					isDefault: true
			};
			$.each(rules.list, function() {
				rulesList.push(this.name);
				rulesData[this.name] = {
					name: this.name,
					value: this.data,
					active: this.selected
				};
			});
		}
		
		if (values) {
			$.each(values.list, function() {
				valuesList.push(this.name);
				valuesData[this.name] = {
					name: this.name,
					value: this.data,
					active: this.selected
				};
			});
		}
		
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
		});
	},
	showNetwork: function() {
		this.setState({
			hasNetwork: true,
			name: 'network'
		});
		location.hash = 'network';
	},
	showRules: function() {
		this.setState({
			hasRules: true,
			name: 'rules'
		});
		location.hash = 'rules';
	},
	showValues: function() {
		this.setState({
			hasValues: true,
			name: 'values'
		});
		location.hash = 'values';
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
		if (e.keyCode != 13) {
			return;
		}
		var target = e.target;
		var name = $.trim(target.value);
		if (!name) {
			alert('Rule name can not be empty.');
			return;
		}
		
		if (this.state.rules.list.indexOf(name) != -1) {
			alert('Rule name  \'' + name + '\' already exists.');
			return;
		}
		var rulesList = this.refs.rules;
		dataCenter.rules.add({name: name}, function(data) {
			if (data && data.ec === 0) {
				target.value = '';
				target.blur();
				rulesList.add(name);
			} else {
				util.showSystemError();
			}
		});
	},
	createValues: function(e) {
		if (e.keyCode != 13) {
			return;
		}
		var target = e.target;
		var name = $.trim(target.value);
		if (!name) {
			alert('Value name can not be empty.');
			return;
		}
		
		if (this.state.values.list.indexOf(name) != -1) {
			alert('Value name  \'' + name + '\' already exists.');
			return;
		}
		var valuesList = this.refs.values;
		dataCenter.values.add({name: name}, function(data) {
			if (data && data.ec === 0) {
				target.value = '';
				target.blur();
				valuesList.add(name);
			} else {
				util.showSystemError();
			}
		});
	},
	showEditRules: function() {
		var rulesList = this.refs.rules;
		var selectedItem = rulesList.getSelectedItem();
		if (!selectedItem || selectedItem.isDefault) {
			return;
		}
		
		var editRulesInput = this.refs.editRulesInput.getDOMNode();
		this.setState({
			showEditRules: true,
			selectedRuleName: selectedItem.name,
			selectedRule: selectedItem
		}, function() {
			editRulesInput.focus();
		});	
	},
	showEditValues: function() {
		var valuesList = this.refs.values;
		var selectedItem = valuesList.getSelectedItem();
		if (!selectedItem || selectedItem.isDefault) {
			return;
		}
		
		var editValuesInput = this.refs.editValuesInput.getDOMNode();
		this.setState({
			showEditValues: true,
			selectedValueName: selectedItem.name,
			selectedValue: selectedItem
		}, function() {
			editValuesInput.focus();
		});	
	},
	editRules: function(e) {
		if (e.keyCode != 13) {
			return;
		}
		var selectedItem = this.state.selectedRule;
		if (!selectedItem) {
			return;
		}
		var target = e.target;
		var name = $.trim(target.value);
		if (!name) {
			alert('Rule name can not be empty.');
			return;
		}
		
		if (this.state.rules.list.indexOf(name) != -1) {
			alert('Rule name  \'' + name + '\' already exists.');
			return;
		}
		var rulesList = this.refs.rules;
		dataCenter.rules.rename({name: selectedItem.name, newName: name}, function(data) {
			if (data && data.ec === 0) {
				target.value = '';
				target.blur();
				rulesList.rename(selectedItem.name, name);
			} else {
				util.showSystemError();
			}
		});
	},
	editValues: function() {
		if (e.keyCode != 13) {
			return;
		}
		var selectedItem = this.state.selectedRule;
		if (!selectedItem) {
			return;
		}
		var target = e.target;
		var name = $.trim(target.value);
		if (!name) {
			alert('Rule name can not be empty.');
			return;
		}
		
		if (this.state.values.list.indexOf(name) != -1) {
			alert('Rule name  \'' + name + '\' already exists.');
			return;
		}
		var valuesList = this.refs.values;
		dataCenter.values.rename({name: selectedItem.name, newName: name}, function(data) {
			if (data && data.ec === 0) {
				target.value = '';
				target.blur();
				valuesList.rename(selectedItem.name, name);
			} else {
				util.showSystemError();
			}
		});
	},
	replay: function() {
		
	},
	composer: function() {
		
	},
	setFilter: function() {
		
	},
	clear: function() {
		
	},
	removeRules: function() {
		var rulesList = this.refs.rules;
		var selectedItem = rulesList.getSelectedItem();
		if (selectedItem && !selectedItem.isDefault) {
			var name = selectedItem.name;
			if (confirm('Confirm delete this Rule \'' + name + '\'.')) {
				dataCenter.rules.remove({name: name}, function(data) {
					if (data && data.ec === 0) {
						rulesList.remove(name);
					} else {
						util.showSystemError();
					}
				});
			}
		}
	},
	removeValues: function() {
		var valuesList = this.refs.values;
		var selectedItem = valuesList.getSelectedItem();
		if (selectedItem && !selectedItem.isDefault) {
			var name = selectedItem.name;
			if (confirm('Confirm delete this Value \'' + name + '\'.')) {
				dataCenter.values.remove({name: name}, function(data) {
					if (data && data.ec === 0) {
						valuesList.remove(name);
					} else {
						util.showSystemError();
					}
				});
			}
		}
	},
	setRulesSettings: function() {
		
	},
	setValuesSettings: function() {
		
	},
	showWeinre: function() {
		
	},
	hideOnBlur: function() {
		this.setState({
			showCreateRules: false,
			showCreateValues: false,
			showEditRules: false,
			showEditValues: false
		});
	},
	onClickMenu: function(e) {
		var target = $(e.target).closest('a');
		if (target.hasClass('w-network-menu')) {
			this.showNetwork();
		} else if (target.hasClass('w-rules-menu')){
			this.showRules();
		} else if (target.hasClass('w-values-menu')) {
			this.showValues();
		} else if (target.hasClass('w-create-menu')) {
			this.state.name == 'rules' ? this.showCreateRules() : this.showCreateValues();
		} else if (target.hasClass('w-edit-menu')) {
			this.state.name == 'rules' ? this.showEditRules() : this.showEditValues();
		} else if (target.hasClass('w-replay-menu')) {
			this.replay();
		} else if (target.hasClass('w-composer-menu')) {
			this.composer();
		} else if (target.hasClass('w-filter-menu')) {
			this.setFilter();
		} else if (target.hasClass('w-clear-menu')) {
			this.clear();
		} else if (target.hasClass('w-delete-menu')) {
			this.state.name == 'rules' ? this.removeRules() : this.removeValues();
		} else if (target.hasClass('w-settings-menu')) {
			this.state.name == 'rules' ? this.setRulesSettings() : this.setValuesSettings();
		} else if (target.hasClass('w-weinre-menu')) {
			this.showWeinre();
		}
	},
	render: function() {
		var name = this.state.name;
		
		return (
			<div className="main orient-vertical-box">
				<Menu name={name} onClick={this.onClickMenu}>
					<MenuItem ref="rulesOptions" onClick={this.props.onClickItem} onClickOption={this.props.onClickOption} />
					<MenuItem ref="valuesOptions" onClick={this.props.onClickItem} onClickOption={this.props.onClickOption} />
					<MenuItem ref="weinreOptions" onClick={this.props.onClickItem} onClickOption={this.props.onClickOption} />
					<input ref="createRulesInput" onKeyDown={this.createRules} onBlur={this.hideOnBlur} type="text" style={{display: this.state.showCreateRules ? 'block' : 'none'}} className="w-input-menu-item w-create-rules-input" maxLength="64" placeholder="press 'enter' to save the rules name" />
					<input ref="createValuesInput" onKeyDown={this.createValues} onBlur={this.hideOnBlur} type="text" style={{display: this.state.showCreateValues ? 'block' : 'none'}} className="w-input-menu-item w-create-values-input" maxLength="64" placeholder="press 'enter' to save the values name" />
					<input ref="editRulesInput" onKeyDown={this.editRules} onBlur={this.hideOnBlur} type="text" style={{display: this.state.showEditRules ? 'block' : 'none'}} className="w-input-menu-item w-edit-rules-input" maxLength="64" placeholder={'press \'enter\' to rename ' + (this.state.selectedRuleName || '')} />
					<input ref="editValuesInput" onKeyDown={this.editValues} onBlur={this.hideOnBlur} type="text" style={{display: this.state.showEditValues ? 'block' : 'none'}} className="w-input-menu-item w-edit-values-input" maxLength="64" placeholder={'press \'enter\' to rename ' + (this.state.selectedValueName || '')} />
				</Menu>
				{this.state.hasRules ? <List ref="rules" modal={this.state.rules} hide={name == 'rules' ? false : true} name="rules" /> : ''}
				{this.state.hasValues ? <List ref="values" modal={this.state.values} hide={name == 'values' ? false : true} className="w-values-list" /> : ''}
				{this.state.hasNetwork ? <Network hide={name != 'rules' && name != 'values' ? false : true} /> : ''}
			</div>
		);
	}
});
dataCenter.getInitialData(function(data) {
	React.render(<Index modal={data} />, document.body);	
});


