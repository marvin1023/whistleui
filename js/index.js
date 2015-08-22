var React = require('react');
var Menu = require('./menu');
var Network = require('./network');
var Rules = require('./rules');
var Values = require('./values');
var filename = location.href.replace(/[#?].*$/, '').replace(/.*\//, '');

var Index = React.createClass({
	getInitialState: function() {
		var state = {};
		if (!filename || filename.indexOf('rules') != -1) {
			state.hasRules = true;
			state.name = 'rules';
		} else if (filename.indexOf('values') != -1) {
			state.hasValues = true;
			state.name = 'rules';
		} else {
			state.hasNetwork = true;
			state.name = 'rules';
		}
		return state;
	},
	render: function() {
		var name = this.state.name;
		return (
			<div className="main orient-vertical-box">
				<Menu name={name} />
				{this.state.hasRules ? <Rules hide={name == 'rules' ? true : false} /> : ''}
				{this.state.hasValues ? <Values hide={name == 'values' ? true : false} /> : ''}
				{this.state.hasNetwork ? <Network hide={name != 'rules' && name != 'values' ? true : false} /> : ''}
			</div>
		);
	}
});

React.render(<Index />, document.body);
