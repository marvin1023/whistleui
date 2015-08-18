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
		
	},
	onDoubleClick: function(e) {
		
	},
	render: function() {
		var self = this;
		var modal = self.props.modal || {};
		var list = self._list = modal.list || [];
		var data = self._data = modal.data || {};
		var seletedItem;
		list.forEach(function(name) {
			var item = data[name];
			if (item) {
				item.key = item.key || getKey();
				item.name = name;
				if (item.selected) {
					if (selectedItem) {
						item.selected = false;
					} else {
						seletedItem = item;
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
		
		if (!seletedItem && list[0]) {
			seletedItem = data[list[0]];
			seletedItem.selected = true;
		}
		
		return (
				<Divider leftWidth="200">
					<div className="w-list-data fill">
						{
							list.map(function(name) {
								var item = data[name];
								return <a key={item.key}
											onMouseEnter={self.onMouseEnter}
											onMouseLeave={self.onMouseLeave}
											onClick={self.onClick} 
											onDoubleClick={self.onDoubleClick} 
											className={(item.selected ? 'w-selected' : '') + (item.active ? ' w-active' : '')} 
											href="javascript:;">{name}<span className="glyphicon glyphicon-ok"></span></a>;
							})
						}
					</div>
					<Editor {...self.props} ref="editor" value={seletedItem && seletedItem.value} mode={this.props.name == 'rules' ? 'rules' : ''} />
				</Divider>
		);
	}
});

module.exports = List;
