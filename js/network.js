require('./base-css.js');
var React = require('react');
var Divider = require('./divider');
var ReqData = require('./req-data');
var Detail = require('./detail');

var Network = React.createClass({
	onClickMenu: function() {
		
	},
	onClickMenuItem: function() {
		
	},
	onClickMenuOption: function() {
		
	},
	componentDidMount: function() {
		
	},
	render: function() {
		return (
			<Divider hide={this.props.hide} rightWidth="560">
				<ReqData />
				<Detail />
			</Divider>		
		);
	}
});

module.exports = Network;
