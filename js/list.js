require('./base-css.js');
require('../css/list.css');
var $ = require('jquery');
var util = require('./util');
var React = require('react');
var Divider = require('./divider');
var Editor = require('./editor');

function getSuffix(name) {
	if (typeof name != 'string') {
		return '';
	}
	var index = name.lastIndexOf('.');
	return index == -1 ? '' : name.substring(index + 1);
}

var List = React.createClass({
	componentWillMount: function() {
		this._data = {};
		this._list = [];
	},
	add: function(name, value) {
		if (this.getItem(name)) {
			return false;
		}
		var list = this._list;
		var data =  this._data;
		this._clearSelection();
		list.push(name);
		data[name] = {
				active: true,
				key: util.getKey(),
				name: name,
				value: value
		};
		this.forceUpdate();
		return true;
	},
	remove: function(name) {
		delete this._data[name];
		var index = this._list.indexOf(name);
		if (index != -1) {
			this._list.splice(index, 1);
			var nextItem = this._data[this._list[index] || this._list[index - 1] || ''];
			if (nextItem) {
				nextItem.active = true;
			}
			this.forceUpdate();
			return nextItem;
		}
	},
	rename: function(name, newName) {
		var item = this.getItem(name);
		if (item) {
			delete this._data[name];
			this._data[newName] = item;
			this._list[this._list.indexOf(name)] = item.name = newName;
			this.forceUpdate();
		}
	},
	active: function(name) {
		var item = this.getItem(name);
		if (item) {
			this._clearSelection();
			item.active = true;
			this.forceUpdate();
		}
	},
	_clearSelection: function() {
		var data = this._data;
		Object.keys(data).forEach(function(name) {
			data[name].active = false;
		});
	},
	_clearActive: function() {
		var data = this._data;
		Object.keys(data).forEach(function(name) {
			data[name].selected = false;
		});
	},
	enable: function(name) {
		if (name = this.getItem(name)) {
			name.selected = true;
			name.changed = false;
			this.forceUpdate();
		}
	},
	disable: function(name) {
		if (!arguments.length) {
			this._clearActive();
			this.forceUpdate();
		} else if (name = this.getItem(name)) {
			name.selected = false;
			this.forceUpdate();
		}
	},
	getActiveItem: function() {
		var activeItem;
		$.each(this._data, function(name, item) {
			if (item.active) {
				activeItem = item;
				return false;
			}
		});
		return activeItem;
	},

	getItem: function(name) {
		return this._data[name];
	},
	componentDidMount: function() {
		var self = this;
		var list = $(self.refs.list.getDOMNode());
		$(window).keydown(function(e) {
			if (isSaveFile(e)) {
				list.find('.w-changed').each(trigger);
				return false;
			}
		});
		
		var editor = $(this.refs.editor.getDOMNode()).keydown(function(e) {
			if (isSaveFile(e)) {
				var selectedElem = list.find('.w-active');
				if (selectedElem.hasClass('w-changed') || !selectedElem.hasClass('w-selected')) {
					selectedElem.each(trigger);
				}
				return false;
			}
		});
		
		function trigger() {
			self._onDoubleClick({target: this});
		}
		
		function isSaveFile(e) {
			return editor.is(':visible') && (e.ctrlKey || e.metaKey) && e.keyCode == 83;
		}
	},
	_onMouseEnter: function(e) {
		this._getItemByKey($(e.target).closest('a').attr('data-key')).hover = true;
		this.forceUpdate();
	},
	_onMouseLeave: function(e) {
		this._getItemByKey($(e.target).closest('a').attr('data-key')).hover = false;
		this.forceUpdate();
	},
	_onClick: function(e) {
		var elem = $(e.target).closest('a');
		var item = this._getItemByKey(elem.attr('data-key'));
		if (!item || (typeof this.props.onActive == 'function' && 
				this.props.onActive(item) === false)) {
			return;
		}
		this.active(item.name);
	},
	_onDoubleClick: function(e) {
		var target = $(e.target);
		var elem = target.closest('a');
		var item = this._getItemByKey(elem.attr('data-key'));
		var okIcon = target.hasClass('glyphicon-ok');
		item.selected && !item.changed || okIcon ? this._onDisable(item) : this._onEnable(item);
		okIcon && e.stopPropagation();
	},
	_onEnable: function(data) {
		if (typeof this.props.onEnable != 'function' || 
				this.props.onEnable.call(this, data) !== false) {
			this.enable(data.name);
		}
	},
	_onDisable: function(data) {
		if (typeof this.props.onDisable != 'function' || 
				this.props.onDisable.call(this, data) !== false) {
			this.disable(data.name);
		}
	},
	_onChange: function(e) {
		var item = this.getActiveItem();
		if (!item) {
			return;
		}
		
		var value = e.getValue();
		if (value != item.value && value != item.value) {
			item.changed = true;
			item.value = value;
			this.forceUpdate();
		}
	},
	_getItemByKey: function(key) {
		for (var i in this._data) {
			var item = this._data[i];
			if (item.key == key) {
				return item;
			}
		}
	},
	render: function() {
		var self = this;
		var modal = self.props.modal || {};
		var list = self._list = modal.list = modal.list || [];
		var data = self._data = modal.data = modal.data || {};
		list.forEach(function(name) {
			var item = data[name];
			if (item) {
				item.key = item.key || util.getKey();
				item.name = name;
			} else {
				data[name] = {
					key: util.getKey(),
					name: name,
					value: ''
				};
			}
		});
		
		var activeItem = self.getActiveItem();
		
		return (
				<Divider hide={this.props.hide} leftWidth="200">
					<div ref="list" className={'fill orient-vertical-box w-list-data ' + (this.props.className || '')}>
						{
							list.map(function(name) {
								var item = data[name];
								return <a key={item.key} data-key={item.key}
											onMouseEnter={self._onMouseEnter}
											onMouseLeave={self._onMouseLeave}
											onClick={self._onClick} 
											onDoubleClick={self._onDoubleClick} 
											className={(item.hover ? 'w-hover' : '') 
											+ (item.active ? ' w-active' : '') 
											+ (item.changed ? ' w-changed' : '')
											+ (item.selected ? ' w-selected' : '')} 
											href="javascript:;">{name}<span onClick={self._onDoubleClick} className="glyphicon glyphicon-ok"></span></a>;
							})
						}
					</div>
					<Editor {...self.props} ref="editor" onChange={self._onChange} readOnly={!activeItem} value={activeItem && activeItem.value} 
					mode={self.props.name == 'rules' ? 'rules' : getSuffix(activeItem && activeItem.name)} />
				</Divider>
		);
	}
});

module.exports = List;
