require('../css/plugins.css');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var Tabs = React.createClass({
	componentDidMount: function() {
		var self = this;
		var tabPanel = ReactDOM.findDOMNode(self.refs.tabPanel);
		var wrapper = tabPanel.parentNode;
		var timer;
		
		function resizeHandler() {
			clearTimeout(timer);
			timer = setTimeout(_resizeHandler, 60);
		}
		
		function _resizeHandler() {
			if (self.props.hide) {
				return;
			}
			var height =  wrapper.offsetHeight;
			if (height) {
				tabPanel.style.width = wrapper.offsetWidth + 'px';
				tabPanel.style.height = height + 'px';
			}
		}
		
		resizeHandler();
		$(window).on('resize', resizeHandler);
	},
	render: function() {
		return (
			<div className="w-nav-tabs fill orient-vertical-box" style={{display: this.props.hide ? 'none' : ''}}>
				 <ul className="nav nav-tabs">
				    <li className="active w-nav-home-tab"><a href="javascript:;">Home</a></li>
				    <li><a href="javascript:;">Profile<span title="Close">&times;</span></a></li>
				    <li><a href="javascript:;">Messages<span title="Close">&times;</span></a></li>
				    <li><a href="javascript:;">Settings<span title="Close">&times;</span></a></li>
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