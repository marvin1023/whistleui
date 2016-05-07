require('../css/plugins.css');
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var dataCenter = require('./data-center');
var util = require('./util');
var events = require('./events');
var MAX_COUNT = 6;

var Home = React.createClass({
	
	render: function() {
		var self = this;
		var data = self.props.data || {};
		var plugins = data.plugins || [];
		var list = Object.keys(plugins);
		var disabledPlugins = data.disabledPlugins || {};
		return (
				<div className="fill orient-vertical-box w-plugins" style={{display: self.props.hide ? 'none' : ''}}>
					<div className="w-plugins-headers">
						<table className="table">
							<thead>
								<tr>
									<th className="w-plugins-order">#</th>
									<th className="w-plugins-active">Active</th>
									<th className="w-plugins-date">Date</th>
									<th className="w-plugins-name">Name</th>
									<th className="w-plugins-version">Version</th>
									<th className="w-plugins-operation">Operation</th>
								</tr>
							</thead>
						</table>
					</div>
					<div className="fill w-plugins-list">
						<table className="table table-hover">
							<tbody>
								{list.length ? list.sort(function(a, b) {
									var p1 = plugins[a];
									var p2 = plugins[b];
									return (p1.mtime > p2.mtime) ? 1 : -1;
								}).map(function(name, i) {
									var plugin = plugins[name];
									name = name.slice(0, -1);
									var checked = !disabledPlugins[name];
									var disabled = data.disabledAllRules || data.disabledAllPlugins;
									var url = 'http://' + name + '.local.whistlejs.com/';
									return (
										<tr key={name}>
											<th className="w-plugins-order">{i + 1}</th>
											<td className="w-plugins-active">
												<input type="checkbox"  title={disabled ? 'Disabled' : (checked ? 'Disable ' : 'Enable ') + name} 
													data-name={name} checked={checked} disabled={disabled} onChange={self.props.onChange} />
											</td>
											<td className="w-plugins-date">{new Date(plugin.mtime).toLocaleString()}</td>
											<td className="w-plugins-name"><a href={url} target="_blank">{name}</a></td>
											<td className="w-plugins-version">{plugin.homepage ? <a href={plugin.homepage} target="_blank">{plugin.version}</a> : plugin.version}</td>
											<td className="w-plugins-operation">
												<a href={url} target="_blank">Open</a>	
												{(plugin.rules || plugin._rules) ? <a href="javascript:;">Rules</a> : <span className="disabled">Rules</span>}
												{plugin.homepage ? <a href={plugin.homepage} target="_blank">Homepage</a> : <span className="disabled">Homepage</span>}
											</td>
										</tr>
									);
								}) : <tr><td colSpan="5" className="w-empty"><a href="https://github.com/whistle-plugins" target="_blank">no data</a></td></tr>}
							</tbody>
						</table>
					</div>
				</div>
		);
	}
});

var Tabs = React.createClass({
	getInitialState: function() {
		return {
			tabs: []
		};
	},
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
		
		events.on('disableAllRules', function(e, checked) {
			 self.setState({
				 disabledAllRules: checked
			 });
		});
		events.on('disableAllPlugins', function(e, checked) {
			 self.setState({
				 disabledAllPlugins: checked
			 });
		});
		
		dataCenter.getInitialData(function(data) {
			self.setState({
				plugins: data.plugins,
				disabledPlugins: data.disabledPlugins,
				disabledAllRules: self.state.disabledAllRules != null ? self.state.disabledAllRules : data.disabledAllRules,
				disabledAllPlugins: self.state.disabledAllPlugins != null ? self.state.disabledAllPlugins : data.disabledAllPlugins,
			});
			loadPlugins();
		});
		
		function loadPlugins() {
			dataCenter.plugins.getPlugins(function(data) {
				if (data && data.ec === 0) {
					self.state.plugins = data.plugins;
					self.state.disabledPlugins = data.disabledPlugins;
					if (!self.props.hide) {
						self.setState({});
					}
				}
				setTimeout(loadPlugins, 8000);
			});
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		return !this.props.hide || !nextProps.hide;
	},
	onClose: function(i) {
		this.state.tabs.splice(i, 1);
		this.setState({});
	},
	render: function() {
		var self = this;
		var tabs = self.state.tabs;
		var activeName = 'Home';
		var activeTabName = self.props.activeTabName;
		if (activeTabName && activeTabName != activeName) {
			for (var i = 0, len = tabs.length; i < len; i++) {
				var tab = tabs[i];
				if (tab.name == activeTabName) {
					activeName = tab.name;
					break;
				}
			}
		}
		
		return (
			<div className="w-nav-tabs fill orient-vertical-box" style={{display: self.props.hide ? 'none' : ''}}>
				 <ul className="nav nav-tabs">
				    <li className={'w-nav-home-tab' + (activeName == 'Home' ? ' active' : '')}><a href="javascript:;">Home</a></li>
				    {tabs.map(function(tab, i) {
				    	return <li className={activeName == tab.name ? ' active' : ''}>
						    	<a href="javascript:;">
						    		{tab.name}
						    		<span title="Close" 
							    		onClick={function() {
							    		self.onClose(i);
							    		}}>&times;</span>
							    </a>
						      </li>;
				    })}
				  </ul>
				  <div className="fill orient-vertical-box w-nav-tab-panel">
				  	<div ref="tabPanel" className="fill orient-vertical-box">
				  		<Home data={self.props} hide={activeName != 'Home'} onChange={self.props.onChange} />
				  		{tabs.map(function(tab) {
				  			return <iframe style={{display: activeName == tab.name ? '' : 'none'}} src={tab.url} />
				  		})}
				  	</div>
				  </div>
			</div>
		);
	}
});

module.exports = Tabs;