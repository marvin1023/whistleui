require('./base-css.js');
require('../css/req-data.css');
var React = require('react');
var $ = require('jquery');
var util = require('./util');

function getClassName(data) {
	return getStatusClass(data) + ' w-req-data-item'
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

function getSelectedRows() {
	var range = getSelection();
	if (!range) {
		return;
	}
	range = range.getRangeAt(0);
	var startElem = $(range.startContainer).closest('.w-req-data-item');
	if (!startElem.length) {
		return null;
	}
	var endElem = $(range.endContainer).closest('.w-req-data-item');
	if (!startElem.length || !endElem.length) {
		return null;
	}
	return [startElem, endElem];
}

function getSelection() {
	if (window.getSelection) {
		return window.getSelection();
	}
	return document.getSelection();
}

var ReqData = React.createClass({
	getInitialState: function() {
		return {};
	},
	componentDidMount: function() {
		this.container = this.refs.container.getDOMNode();
		this.content = this.refs.content.getDOMNode();
	},
	onClick: function(e, item) {
		var modal = this.props.modal;
		var allowMultiSelect = e.ctrlKey || e.metaKey;
		if (!allowMultiSelect || !modal) {
			this.clearSelection();
		}
		
		var rows;
		if (e.shiftKey && (rows = getSelectedRows())) {
			modal.setSelectedList(rows[0].attr('data-id'), 
					rows[1].attr('data-id'));
		} else {
			item.selected = !allowMultiSelect || !item.selected;
		}
		
		this.setState({
			selectedItem: item
		});
	},
	clearSelection: function() {
		var modal = this.props.modal;
		modal && modal.clearSelection();
	},
	onFilterChange: function(e) {
		var self = this;
		var modal = self.props.modal;
		var value = e.target.value;
		var autoScroll = modal && modal.search(value);
		this.setState({filterText: value}, function() {
			autoScroll && self.autoScroll()
		});
	},
	onFilterKeyDown: function(e) {
		if ((e.ctrlKey || e.metaKey) && e.keyCode == 68) {
			this.clearFilterText();
			e.preventDefault();
			e.stopPropagation();
		}
	},
	clearFilterText: function() {
		var modal = this.props.modal;
		modal && modal.search();
		this.setState({filterText: ''}, this.autoScroll.bind(this));
	},
	autoScroll: function() {
		if (this.container) {
			this.container.scrollTop = this.content.offsetHeight;
		}
	},
	render: function() {
		var self = this;
		var modal = self.props.modal;
		var list = modal ? modal.list : [];
		
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
						<div ref="container" className="w-req-data-list fill">
							<table ref="content" className="table">
						      <tbody>
						      {
						    	  list.map(function(item, i) {
						    		  var end = item.endTime;
						    		  var defaultValue = end ? '' : '-';
						    		  var req = item.req;
						    		  var res = item.res;
						    		  var type = (res.headers && res.headers['content-type'] || defaultValue).split(';')[0];
						    		  return (<tr data-id={item.id} key={item.id} style={{display: item.hide ? 'none' : ''}} className={getClassName(item)} onClick={function(e) {self.onClick(e, item);}}>
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
						onChange={this.onFilterChange} 
						onKeyDown={this.onFilterKeyDown}
						className="w-req-data-filter" maxLength="128" placeholder="type filter text" />
						<button
						onClick={this.clearFilterText}
						style={{display: this.state.filterText ? 'block' :  'none'}} type="button" className="close" title="Ctrl+D"><span aria-hidden="true">&times;</span></button>
					</div>
			</div>
		);
	}
});

module.exports = ReqData;