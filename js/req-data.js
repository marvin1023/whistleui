require('./base-css.js');
require('../css/req-data.css');
var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var util = require('./util');
var FilterInput = require('./filter-input');
var Spinner = require('./spinner');
var HEIGHT = 24; //每条数据的高度
var columns = {};
var NOT_BOLD_RULES = {
    plugin: 1,
    pac: 1,
    reqWrite: 1,
    resWrite: 1,
    reqWriteRaw: 1,
    resWriteRaw: 1,
    exports: 1,
    exportsUrl: 1
};

function getClassName(data) {
	return getStatusClass(data) + ' w-req-data-item'
		+ (data.isHttps ? ' w-tunnel' : '') 
			+ (hasRules(data) ? ' w-has-rules' : '')
				+ (data.selected ? ' w-selected' : '');
}

function hasRules(data) {
  var rules = data.rules;
  if (!rules) {
    return false;
  }
	var keys = Object.keys(data.rules);
	if (keys && keys.length) {
	  for (var i = 0, len = keys.length; i < len; i++) {
	    if (rules[keys[i]] && !NOT_BOLD_RULES[keys[i]]) {
	      return true;
	    }
	  }
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
	
	var statusCode = data.res && data.res.statusCode;
	if (data.reqError || data.resError) {
		type += ' danger w-error-status';
	} else if (statusCode == 403) {
		type += ' w-forbidden';
	} else if (statusCode && (!/^\d+$/.test(statusCode) || statusCode >= 400)) {
		type += ' w-error-status';
	}
	
	return type;
}

function getSelectedRows() {
	var range = getSelection();
	if (!range) {
		return;
	}
	try {
		range = range.getRangeAt(0);
	} catch(e) {
		return;
	}
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
		return { draggable: true };
	},
	componentDidMount: function() {
		var self = this;
		var timer;
		var update = function() {
			self.setState({});
		};
		var render = function() {
			timer && clearTimeout(timer);
			timer = setTimeout(update, 60);
		};
		self.container = ReactDOM.findDOMNode(self.refs.container);
		self.content = ReactDOM.findDOMNode(self.refs.content);
		var toggoleDraggable = function(e) {
			var draggable = !e.shiftKey;
			if (self.state.draggable === draggable) {
				return;
			}
			if (!draggable && !getSelectedRows()) {
				var range = window.getSelection();
				range && range.removeAllRanges();
			}
			self.setState({ draggable: draggable });
		};
		$(self.container).on('keydown', function(e) {
			var modal = self.props.modal;
			toggoleDraggable(e);
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
		}).on('scroll', render).on('keyup', toggoleDraggable)
		.on('mouseover', toggoleDraggable)
		.on('mouseleave', toggoleDraggable);
		
		$(window).on('resize', render);
	},
	onDragStart: function(e) {
		var target = $(e.target).closest('.w-req-data-item');
		e.dataTransfer.setData('reqDataId', target.attr('data-id'));
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
		hm && util.ensureVisible(ReactDOM.findDOMNode(self.refs[item.id]), self.container);
	},
	clearSelection: function() {
		var modal = this.props.modal;
		modal && modal.clearSelection();
	},
	onFilterChange: function(keyword) {
		var self = this;
		var modal = self.props.modal;
		var autoRefresh = modal && modal.search(keyword);
		self.setState({filterText: keyword}, function() {
			autoRefresh && self.autoRefresh()
		});
	},
	autoRefresh: function() {
		if (this.container) {
			this.container.scrollTop = this.content.offsetHeight;
		}
	},
	getVisibleIndex: function() {
		var container = this.container;
		var len = container && this.props.modal && this.props.modal.list.length;
		var height = len && container.offsetHeight;
		if (height) {
			var scrollTop = container.scrollTop;
			var startIndex = Math.floor(Math.max(scrollTop - 240, 0) / HEIGHT);
			var endIndex = Math.floor(Math.max(scrollTop + height + 240, 0) / HEIGHT); 
			this.indeies = [startIndex, endIndex];
		}
		
		return this.indeies;
	},
	orderBy: function(e) {
		var target = $(e.target).closest('th')[0];
		if (!target) {
			return;
		}
		var modal = this.props.modal;
		var state = this.state;
		var name = target.className;
		if (name == 'order') {
			columns = {};
		} else {
		  if (name === 'url') {
		    name = 'path';
		  }
			var order = columns[name];
			if (order == 'desc') {
				columns[name] = 'asc';
			} else if (order == 'asc') {
				columns[name] = null;
			} else {
				columns[name] = 'desc';
			}
		}
		
		if (modal) {
			var sortColumns = [];
			var order;
			Object.keys(columns).forEach(function(name) {
				if (order = columns[name]) {
					sortColumns.push({
						name: name,
						order: order
					});
				}
			});
			modal.setSortColumns(sortColumns);
		}
		this.setState({});
	},
	render: function() {
		var self = this;
		var state = this.state;
		var modal = self.props.modal;
		var list = modal ? modal.list : [];
		var hasKeyword = modal && modal.hasKeyword();
		var index = 0;
		var indeies = self.getVisibleIndex();
		var draggable = state.draggable;
		var startIndex, endIndex;
		if (indeies) {
			startIndex = indeies[0];
			endIndex = indeies[1];
		} else {
			startIndex = 0;
			endIndex = list.length;
		}
		
		return (
				<div className="fill w-req-data-con orient-vertical-box">
					<div className="w-req-data-content fill orient-vertical-box">
						<div className="w-req-data-headers">
							<table className="table">
						      <thead>
						        <tr onClick={self.orderBy}>
						          <th className="order">#</th>
						          <th className="result" style={{color: columns.result ? '#337ab7' : null}}>Result<Spinner order={columns.result} /></th>
						          <th className="method" style={{color: columns.method ? '#337ab7' : null}}>Method<Spinner order={columns.method} /></th>
						          <th className="protocol" style={{color: columns.protocol ? '#337ab7' : null}}>Protocol<Spinner order={columns.protocol} /></th>
						          <th className="hostIp" style={{color: columns.hostIp ? '#337ab7' : null}}>Host IP<Spinner order={columns.hostIp} /></th>
						          <th className="hostname" style={{color: columns.hostname ? '#337ab7' : null}}>Host<Spinner order={columns.hostname} /></th>
						          <th className="url" style={{color: columns.path ? '#337ab7' : null}}>URL<Spinner order={columns.path} /></th>
						          <th className="type" style={{color: columns.type ? '#337ab7' : null}}>Type<Spinner order={columns.type} /></th>
						          <th className="time" style={{color: columns.time ? '#337ab7' : null}}>Time<Spinner order={columns.time} /></th>
						        </tr>
						      </thead>
						    </table>
						</div>
						<div ref="container" tabIndex="0" className="w-req-data-list fill">
							<table ref="content" className="table" onDragStart={this.onDragStart}>
						      <tbody>
						      {
						    	  list.map(function(item, i) {
						    		  i = hasKeyword ? index : i;
						    		  var url, path;
						    		  if (!item.hide && i >= startIndex && i <= endIndex) {
						    		    url = item.url;
						    		    path = item.path;
						    		  }
						    		  
						    		  return (<tr draggable={draggable} ref={item.id} data-id={item.id} key={item.id} style={{display: item.hide ? 'none' : ''}} 
						    		  				className={getClassName(item)} 
						    		  				onClick={function(e) {self.onClick(e, item);}}
						    		  				onDoubleClick={self.props.onDoubleClick}>
						    		  				<th className="order" scope="row">{hasKeyword && !item.hide ? ++index : item.order}</th>			        
						    		  				<td className="result">{item.result}</td>
						    		  				<td className="method">{item.method}</td>
						    		  				<td className="protocol">{item.protocol}</td>
						    		  				<td className="hostIp" title={item.hostIp}>{item.hostIp}</td>
						    		  				<td className="hostname" title={item.hostname}>{item.hostname}</td>
						    		  				<td className="url" title={url}>{path}</td>
						    		  				<td className="type" title={item.type}>{item.type}</td>			        
						    		  				<td className="time">{item.time >= 0 ? item.time  + 'ms' : item.time}</td>			     
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