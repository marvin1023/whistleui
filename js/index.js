var $ = require('jquery');
var React = require('react');
var Menu = require('./menu');
var Network = require('./network');
var Rules = require('./rules');
var Values = require('./values');
var MenuItem = require('./menu-item');
var dataCenter = require('./data-center');
var filename = location.href.replace(/[#?].*$/, '').replace(/.*\//, '');

var Index = React.createClass({
	getInitialState: function() {
		var state = {};
		if (!filename || filename.indexOf('rules') != -1) {
			state.hasRules = true;
			state.name = 'rules';
		} else if (filename.indexOf('values') != -1) {
			state.hasValues = true;
			state.name = 'values';
		} else {
			state.hasNetwork = true;
		}
		return state;
	},
	showNetwork: function() {
		this.setState({
			hasNetwork: true,
			name: 'network'
		});
	},
	showRules: function() {
		this.setState({
			hasRules: true,
			name: 'rules'
		});
	},
	showValues: function() {
		this.setState({
			hasValues: true,
			name: 'values'
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
		}
	},
	render: function() {
		var name = this.state.name;
		
		return (
			<div className="main orient-vertical-box">
				<Menu name={name} onClick={this.onClickMenu}>
					<MenuItem onClick={this.props.onClickItem} onClickOption={this.props.onClickOption} />
				</Menu>
				{this.state.hasRules ? <Rules hide={name == 'rules' ? false : true} /> : ''}
				{this.state.hasValues ? <Values hide={name == 'values' ? false : true} /> : ''}
				{this.state.hasNetwork ? <Network hide={name != 'rules' && name != 'values' ? false : true} /> : ''}
			</div>
		);
	}
});
dataCenter.getInitialData(function(data) {
	React.render(<Index />, document.body);	
});


