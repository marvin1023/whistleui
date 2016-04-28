require('../css/tabs.css');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var Tabs = React.createClass({
	componentDidMount: function() {
		var tabPanel = ReactDOM.findDOMNode(this.refs.tabPanel);
		var wrapper = tabPanel.parentNode;
		var timer;
		function resizeHandler() {
			clearTimeout(timer);
			timer = setTimeout(_resizeHandler, 60);
		}
		
		function _resizeHandler() {
			tabPanel.style.width = wrapper.offsetWidth + 'px';
			tabPanel.style.height = wrapper.offsetHeight + 'px';
		}
		
		resizeHandler();
		$(window).on('resize', resizeHandler);
	},
	render: function() {
		return (
			<div className="w-nav-tabs fill orient-vertical-box">
				 <ul className="nav nav-tabs">
				    <li className="active"><a href="javascript:;">Home</a></li>
				    <li><a href="javascript:;">Profile</a></li>
				    <li><a href="javascript:;">Messages</a></li>
				    <li><a href="javascript:;">Settings</a></li>
				  </ul>
				  <div className="fill orient-vertical-box w-nav-tab-panel">
				  	<div ref="tabPanel" className="fill">
				  		<iframe src="http://www.ifeng.com/" />
				  	</div>
				  </div>
			</div>
		);
	}
});

module.exports = Tabs;