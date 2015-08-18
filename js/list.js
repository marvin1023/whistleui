require('./base-css.js');
require('../css/list.css');
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
	add: function(name, value) {
		if (!name || this._data[name]) {
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
	render: function() {
		var modal = this.props.modal || {};
		var list = this._list = modal.list || ['Default'];
		var data = this._data = modal.data || {Default: {
			key: getKey(),
			selected: true,
			value: 'test'
		}};
		
		return (
				<Divider leftWidth="200">
					<div className="w-list-data fill">
						{
							list.map(function(name) {
								var item = data[name];
								return <a key={item.key} onClick={function() {
									console.log('click');
								}} onDoubleClick={function() {
									console.log('dblclick');
								}} className={(item.selected ? 'w-selected' : '') + (item.show ? ' w-active' : '')} 
											href="javascript:;">{name}<span className="glyphicon glyphicon-ok"></span></a>;
							})
						}
					</div>
					<Editor {...this.props} ref="editor" mode={this.props.name == 'rules' ? 'rules' : ''} />
				</Divider>
		);
	}
});

module.exports = List;
