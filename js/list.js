require('./base-css.js');
require('../css/list.css');
var $ = require('jquery');
var React = require('react');
var Divider = require('./divider');
var Editor = require('./editor');
var index = 1;

function getKey() {
	return 'editor-' + index++;
}

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
	exists: function(name) {
		
		return typeof name == 'string' ? this._data[name] : false;
	},
	add: function(name, value) {
		if (this.exists(name)) {
			return false;
		}
		var list = this._list;
		var data = this._data;
		
		list.push(name);
		data[name] = {
				selected: true,
				key: getKey(),
				name: name,
				value: value
		};
		this.setProps({
			modal: {
				list: list,
				data: data
			}
		});
		return true;
	},
	remove: function(name) {
		
	},
	rename: function(name, newName) {
		
	},
	select: function(name) {
		
	},
	unselect: function(name) {
		
	},
	enable: function(name) {
		
	},
	disable: function(name) {
		
	},
	getCurrentItem: function() {
		
	},
	getItem: function(name) {
		
	},
	componentDidMount: function() {
		
	},
	onMouseEnter: function(e) {
		$(e.target).closest('a').addClass('w-hover');
	},
	onMouseLeave: function(e) {
		$(e.target).closest('a').removeClass('w-hover');
	},
	onClick: function(e) {
		var elem = $(e.target).closest('a');
		var item = this._getItemByKey(elem.attr('data-key'));
		var data = this._data;
		Object.keys(data).forEach(function(name) {
			data[name].selected = false;
		});
		item.selected = true;
		this.forceUpdate();
	},
	onDoubleClick: function(e) {
		var elem = $(e.target).closest('a');
		var item = this._getItemByKey(elem.attr('data-key'));
		item.active = true;
		this.forceUpdate();
		//this.select(item && item.name);
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
		var list = self._list = modal.list || [];
		var data = self._data = modal.data || {};
		var selectedItem;
		list.forEach(function(name) {
			var item = data[name];
			if (item) {
				item.key = item.key || getKey();
				item.name = name;
				if (item.selected) {
					if (selectedItem) {
						item.selected = false;
					} else {
						selectedItem = item;
					}
				}
				return;
			}
			data[name] = {
				key: getKey(),
				name: name,
				value: ''
			};
		});
		
		if (!selectedItem && list[0]) {
			selectedItem = data[list[0]];
			selectedItem.selected = true;
		}
		
		self._onItemClick = self.props.onItemClick;
		self._onItemDoubleClick = self.props.onDoubleClick;
		
		return (
				<Divider leftWidth="200">
					<div className="w-list-data fill">
						{
							list.map(function(name) {
								var item = data[name];
								return <a key={item.key} data-key={item.key}
											onMouseEnter={self.onMouseEnter}
											onMouseLeave={self.onMouseLeave}
											onClick={self.onClick} 
											onDoubleClick={self.onDoubleClick} 
											className={(item.selected ? 'w-selected' : '') + (item.active ? ' w-active' : '')} 
											href="javascript:;">{name}<span className="glyphicon glyphicon-ok"></span></a>;
							})
						}
					</div>
					<Editor {...self.props} ref="editor" readOnly value={selectedItem && selectedItem.value} mode={this.props.name == 'rules' ? 'rules' : ''} />
				</Divider>
		);
	}
});

module.exports = List;
