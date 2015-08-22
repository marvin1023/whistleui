require('./base-css.js');
var React = require('react');
var Divider = require('./divider');
var Menu = require('./menu');
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
			<div className="main orient-vertical-box w-network-con">
				<Menu />
				<Divider rightWidth="560">
					<ReqData />
					<Detail />
				</Divider>
			</div>		
		);
	}
});

module.exports = Network;
