require('./base-css.js');
require('../css/list.css');
var $ = require('jquery');
var util = require('./util');
var React = require('react');
var ReactDOM = require('react-dom');
var Divider = require('./divider');
var Editor = require('./editor');
var FilterInput = require('./filter-input');
var dataCenter = require('./data-center');
var events = require('./events');

var NAME_PREFIX = 'listmodal$';
var curTarget;

function getTarget(e) {
  var target = e.target;
  var nodeName = target.nodeName;
  if (nodeName === 'A') {
    return target;
  }
  target = target.parentNode;
  if (target) {
    nodeName = target.nodeName;
    if (nodeName === 'A') {
      return target;
    }
  }
}

function getName(name) {
	if (typeof name !== 'string') {
		return '';
	}
	return name.substring(name.indexOf('_') + 1);
}

function getDragInfo(e) {
  var target = getTarget(e);
  var name = target && target.getAttribute('data-name');
  if (!name) {
    return;
  }
  var fromName = getNameFromTypes(e);
  if (fromName && name.toLowerCase() !== fromName) {
    return {
      target: target,
      toName: getName(name)
    };
  }
}

function getNameFromTypes(e) {
  var types = e.dataTransfer.types;
  var type = util.findArray(e.dataTransfer.types, function(type) {
    if (type.indexOf(NAME_PREFIX) === 0) {
      return true;
    }
	});
	return type && type.substring(NAME_PREFIX.length);
}

$(document).on('drop', function() {
  if (curTarget) {
    curTarget.style.background = '';
  }
  curTarget = null;
});

function getSuffix(name) {
	if (typeof name != 'string') {
		return '';
	}
	var index = name.lastIndexOf('.');
	return index == -1 ? '' : name.substring(index + 1);
}

var List = React.createClass({
	componentDidMount: function() {
		var self = this;
		var visible = !self.props.hide;
		$(window).keydown(function(e) {
			if (visible && (e.ctrlKey || e.metaKey) && e.keyCode == 83) {
				var modal = self.props.modal;
				modal.getChangedList().forEach(trigger);
				return false;
			}
		});
		
		function trigger(item) {
			self.onDoubleClick(item);
		}
		var modal = self.props.modal;
		var isRules = self.props.name == 'rules';
		var pending;
		
		var listCon = $(ReactDOM.findDOMNode(self.refs.list)).focus().on('keydown', function(e) {
			var item;
			if (e.keyCode == 38) { //up
				item =  modal.prev();
			} else if (e.keyCode == 40) {//down
				item = modal.next();
			}
			
			if (item) {
				e.shiftKey ? self.setState({}) : self.onClick(item);
				e.preventDefault();
			}
		});
		this.ensureVisible();
	},
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	componentDidUpdate: function() {
		this.ensureVisible();
	},
	ensureVisible: function() {
		var activeItem = this.props.modal.getActive();
		if (activeItem) {
			util.ensureVisible(ReactDOM.findDOMNode(this.refs[activeItem.name]), ReactDOM.findDOMNode(this.refs.list));
		}
	},
	onClick: function(item) {
		var self = this;
		if (typeof self.props.onActive != 'function' ||
				self.props.onActive(item) !== false) {
			self.props.modal.setActive(item.name);
			self.setState({activeItem: item});
		}
	},
	onDoubleClick: function(item, okIcon) {
		item.selected && !item.changed || okIcon ? this.onUnselect(item) : this.onSelect(item);
		var onDoubleClick = this.props.onDoubleClick;
		typeof onDoubleClick == 'function' && onDoubleClick(item);
	},
	onSelect: function(data) {
		var onSelect = this.props.onSelect;
		typeof  onSelect == 'function' && onSelect(data);
	},
	onUnselect: function(data) {
		var onUnselect = this.props.onUnselect;
		typeof onUnselect == 'function' && onUnselect(data);
	},
	onChange: function(e) {
		var item = this.props.modal.getActive();
		if (!item) {
			return;
		}
		var oldValue = item.value || '';
		var value = e.getValue() || '';
		if (value != oldValue) {
			item.changed = true;
			item.value = value;
			this.setState({
				selectedItem: item
			});
		}
	},
	onFilterChange: function(keyword) {
		this.props.modal.search(keyword, this.props.name != 'rules');
		this.setState({filterText: keyword});
	},
	getItemByKey: function(key) {
		return this.props.modal.getByKey(key);
	},
	onDragStart: function(e) {
		var target = getTarget(e);
		var name = target && target.getAttribute('data-name');
		if (name) {
			e.dataTransfer.setData(NAME_PREFIX + name, 1);
			e.dataTransfer.setData('-' + NAME_PREFIX, name);
		}
	},
	onDragEnter: function(e) {
		var info = getDragInfo(e);
		if (info) {
			curTarget = info.target;
			curTarget.style.background = '#ddd';
		}
	},
	onDragLeave: function(e) {
		var info = getDragInfo(e);
		if (info) {
			info.target.style.background = '';
		}
	},
	onDrop: function(e) {
		var info = getDragInfo(e);
		if (info) {
			var fromName = getName(e.dataTransfer.getData('-' + NAME_PREFIX));
			info.target.style.background = '';
			if (this.props.modal.moveTo(fromName, info.toName)) {
				var name = this.props.name === 'rules' ? 'rules' : 'values';
				dataCenter[name].moveTo({
					from: fromName,
					to: info.toName
				}, function(data) {
					if (!data) {
						util.showSystemError();
						return;
					}
					if (data.ec === 2) {
						events.trigger(name + 'Changed');
					}
				});
				this.setState({});
			}
		}
	},
	render: function() {
		var self = this;
		var modal = self.props.modal;
		var list = modal.list;
		var data = modal.data;
		var activeItem = modal.getActive();
		if (!activeItem && list[0] && (activeItem = data[list[0]])) {
		  activeItem.active = true;
		}
		var isRules = self.props.name == 'rules';
		var draggable = false;
		
		if (isRules) {
			draggable = list.length > 2;
		} else if (list.length > 1) {
			draggable = true;
		}

		//不设置height为0，滚动会有问题
		return (
				<Divider hide={this.props.hide} leftWidth="200">
				<div className="fill orient-vertical-box w-list-left">	
					<div ref="list" tabIndex="0"
						className={'fill orient-vertical-box w-list-data ' + (this.props.className || '') + (this.props.disabled ? ' w-disabled' : '')}
						>
							{
								list.map(function(name, i) {
									var item = data[name];
									var isDefaultRule = isRules && i === 0;
									
									return <a ref={name}
														data-name={i + '_' + name}
														onDragStart={isDefaultRule ? undefined : self.onDragStart}
														onDragEnter={isDefaultRule ? undefined : self.onDragEnter}
														onDragLeave={isDefaultRule ? undefined : self.onDragLeave}
														onDrop={isDefaultRule ? undefined : self.onDrop}
														style={{display: item.hide ? 'none' : null}}
														key={item.key} data-key={item.key}
														href="javascript:;"
														draggable={isDefaultRule ? false : draggable}
														onClick={function() {
															self.onClick(item);
														}} 
														onDoubleClick={function() {
															self.onDoubleClick(item);
														}} 
														className={util.getClasses({
															'w-active': item.active,
															'w-changed': item.changed,
															'w-selected': item.selected
														})} 
														href="javascript:;">{name}<span className="glyphicon glyphicon-ok"></span></a>;
								})
							}
						</div>
						<FilterInput onChange={this.onFilterChange} />
					</div>
					<Editor {...self.props} onChange={self.onChange} readOnly={!activeItem} value={activeItem ? activeItem.value : ''} 
					mode={isRules ? 'rules' : getSuffix(activeItem && activeItem.name)} />
				</Divider>
		);
	}
});

module.exports = List;
