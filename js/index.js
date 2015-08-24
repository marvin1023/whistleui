var $ = require('jquery');
var React = require('react');
var Menu = require('./menu');
var List = require('./list');
var Network = require('./network');
var MenuItem = require('./menu-item');
var dataCenter = require('./data-center');
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
			valuesData.Default = {
					name: 'Default',
					value: rules.defaultRules,
					active: !rules.defaultRulesIsDisabled
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
	onClickMenu: function(e) {
		var target = $(e.target).closest('a');
		if (target.hasClass('w-network-menu')) {
			this.showNetwork();
		} else if (target.hasClass('w-rules-menu')){
			this.showRules();
		} else if (target.hasClass('w-values-menu')) {
			this.showValues();
		}
	},
	render: function() {
		var name = this.state.name;
		
		return (
			<div className="main orient-vertical-box">
				<Menu name={name} onClick={this.onClickMenu}>
					<MenuItem onClick={this.props.onClickItem} onClickOption={this.props.onClickOption} />
				</Menu>
				{this.state.hasRules ? <List modal={this.state.rules} hide={name == 'rules' ? false : true} name="rules" /> : ''}
				{this.state.hasValues ? <List modal={this.state.values} hide={name == 'values' ? false : true} className="w-values-list" /> : ''}
				{this.state.hasNetwork ? <Network hide={name != 'rules' && name != 'values' ? false : true} /> : ''}
			</div>
		);
	}
});
dataCenter.getInitialData(function(data) {
	React.render(<Index modal={data} />, document.body);	
});


