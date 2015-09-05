require('./base-css.js');
require('../css/req-data.css');
var React = require('react');
var util = require('./util');

function getClassName(data) {
	return getStatusClass(data) 
		+ (data.isHttps ? ' w-tunnel' : '') 
			+ (hasRules(data) ? ' w-has-rules' : '')
				+ (data.selected ? ' w-selected' : '');
}

function hasRules(data) {
	for (var i in data.rules) {
		return true;
	}
	return false;
}

function getStatusClass(data) {
	if (data.reqError || data.resError) {
		return 'danger w-error-status';
	}
	
	if (data.res.statusCode == 403) {
		return 'w-forbidden';
	}
	
	if (data.res.statusCode >= 400) {
		return 'w-error-status';
	}
	
	var headers = data.res.headers;
	switch(util.getContentType(headers)) {
		case 'JS':
			return 'warning';
		case 'CSS':
			return 'info';
		case 'HTML':
			return 'success';
		case 'IMG':
			return 'active';
	}
	
	return '';
}

var ReqData = React.createClass({
	getInitialState: function() {
		return {};
	},
	componentDidMount: function() {
		
	},
	onClick: function(e, item) {
		if (!e.ctrlKey && !e.metaKey) {
			this.clearSelection();
		}
		item.selected = true;
		this.forceUpdate();
	},
	clearSelection: function() {
		var modal = this.props.modal;
		if (modal) {
			modal.list.forEach(function(item) {
				item.selected = false;
			});
		}
	},
	_onFilterChange: function(e) {
		this.setState({filterText: e.target.value});
	},
	_onFilterKeyDown: function(e) {
		if ((e.ctrlKey || e.metaKey) && e.keyCode == 68) {
			this._clearFilterText();
			e.preventDefault();
			e.stopPropagation();
		}
	},
	_clearFilterText: function() {
		this.setState({filterText: ''});
	},
	render: function() {
		var self = this;
		var modal = self.props.modal;
		var list = modal ? modal.list : [];
		var first = list[0];
		var index = first && first.order || 1;
		
		return (
				<div className="fill w-req-data-con orient-vertical-box">
					<div className="w-req-data-content fill orient-vertical-box">
						<div className="w-req-data-headers">
							<table className="table">
						      <thead>
						        <tr>
						          <th className="order">#</th>
						          <th className="result">Result</th>
						          <th className="protocol">Protocol</th>
						          <th className="method">Method</th>
						          <th className="host">Host</th>
						          <th className="host-ip">Host IP</th>
						          <th className="url">Url</th>
						          <th className="type">Type</th>
						          <th className="time">Time</th>
						        </tr>
						      </thead>
						    </table>
						</div>
						<div className="w-req-data-list fill">
							<table className="table">
						      <tbody>
						      {
						    	  list.map(function(item, i) {
						    		  var end = item.endTime;
						    		  var defaultValue = end ? '' : '-';
						    		  var req = item.req;
						    		  var res = item.res;
						    		  var type = (res.headers && res.headers['content-type'] || defaultValue).split(';')[0];
						    		  item.order = index + i;
						    		  return (<tr key={item.id} className={getClassName(item)} onClick={function(e) {self.onClick(e, item);}}>
						    		  				<th className="order" scope="row">{item.order}</th>			        
						    		  				<td className="result">{item.res.statusCode || '-'}</td>			        
						    		  				<td className="protocol">{util.getProtocol(item.url)}</td>			        
						    		  				<td className="method">{req.method}</td>			        
						    		  				<td className="host">{util.getHostname(item.url)}</td>			        
						    		  				<td className="host-ip">{res.ip || defaultValue}</td>			        
						    		  				<td className="url" title={item.url}>{item.url}</td>			        
						    		  				<td className="type" title={type}>{type}</td>			        
						    		  				<td className="time">{end ? end - item.startTime + 'ms' : defaultValue}</td>			     
						    		  			</tr>);
						    	  })
						      }	
						      </tbody>
						    </table>	
						</div>
					</div>
					<div className="w-req-data-bar">
						<input type="text" value={this.state.filterText} 
						onChange={this._onFilterChange} 
						onKeyDown={this._onFilterKeyDown}
						className="w-req-data-filter" maxLength="128" placeholder="type filter text" />
						<button
						onClick={this._clearFilterText}
						style={{display: this.state.filterText ? 'block' :  'none'}} type="button" className="close" title="Ctrl+D"><span aria-hidden="true">&times;</span></button>
					</div>
			</div>
		);
	}
});

module.exports = ReqData;