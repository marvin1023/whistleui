require('./base-css.js');
require('../css/req-data.css');
var React = require('react');
var $ = require('jquery');
var util = require('./util');
var FilterInput = require('./filter-input');

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
	var type = '';
	var headers = data.res.headers;
	switch(util.getContentType(headers)) {
		case 'JS':
			type = 'warning';
			break;
		case 'CSS':
			type = 'info';
			break;
		case 'HTML':
			type = 'success';
			break;
		case 'IMG':
			type = 'active';
			break;
	}
	
	if (data.reqError || data.resError) {
		type += ' danger w-error-status';
	} else if (data.res.statusCode == 403) {
		type += ' w-forbidden';
	} else if (data.res.statusCode >= 400) {
		type += ' w-error-status';
	}
	
	return type;
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
	componentDidMount: function() {
		var self = this;
		self.container = self.refs.container.getDOMNode();
		self.content = self.refs.content.getDOMNode();
		$(self.container).on('keydown', function(e) {
			var modal = self.props.modal;
			if (!modal) {
				return;
			}
			var item;
			if (e.keyCode == 38) { //up
				item = modal.prev();
			} else if (e.keyCode == 40) {//down
				item = modal.next();
			}
			
			if (item) {
				self.onClick(e, item, true);
				e.preventDefault();
			}
		});
	},
	onClick: function(e, item, hm) {
		var self = this;
		var modal = self.props.modal;
		var allowMultiSelect = e.ctrlKey || e.metaKey;
		if (hm || !allowMultiSelect) {
			self.clearSelection();
		}
		if (hm) {
			item.selected = true;
		} else {
			var rows;
			if (e.shiftKey && (rows = getSelectedRows())) {
				modal.setSelectedList(rows[0].attr('data-id'), 
						rows[1].attr('data-id'));
			} else {
				item.selected = !allowMultiSelect || !item.selected;
			}
		}
		
		modal.clearActive();
		item.active = true;
		if (self.props.onClick && self.props.onClick(item)) {
			self.setState({
				activeItem: item
			});
		}
		hm && util.ensureVisible(self.refs[item.id].getDOMNode(), self.container);
	},
	clearSelection: function() {
		var modal = this.props.modal;
		modal && modal.clearSelection();
	},
	onFilterChange: function(keyword) {
		var self = this;
		var modal = self.props.modal;
		var autoScroll = modal && modal.search(keyword);
		self.setState({filterText: keyword}, function() {
			autoScroll && self.autoScroll()
		});
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
		var hasKeyword = modal && modal.hasKeyword();
		var order = 0;
		
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
						<div ref="container" tabIndex="0" className="w-req-data-list fill">
							<table ref="content" className="table">
						      <tbody>
						      {
						    	  list.map(function(item, i) {
						    		  var end = item.endTime;
						    		  var defaultValue = end ? '' : '-';
						    		  var req = item.req;
						    		  var res = item.res;
						    		  var type = (res.headers && res.headers['content-type'] || defaultValue).split(';')[0];
						    		  return (<tr ref={item.id} data-id={item.id} key={item.id} style={{display: item.hide ? 'none' : ''}} 
						    		  				className={getClassName(item)} 
						    		  				onClick={function(e) {self.onClick(e, item);}}
						    		  				onDoubleClick={self.props.onDoubleClick}>
						    		  				<th className="order" scope="row">{hasKeyword && !item.hide ? ++order : item.order}</th>			        
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
					<FilterInput onChange={this.onFilterChange} />
			</div>
		);
	}
});

module.exports = ReqData;