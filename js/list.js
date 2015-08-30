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
	componentDidMount: function() {
		var self = this;
		var visible = !self.props.hide;
		$(window).keydown(function(e) {
			if (visible && (e.ctrlKey || e.metaKey) && e.keyCode == 83) {
				var modal = self.props.modal;
				modal.getChangedList().forEach(trigger);
				var activeItem = modal.getActive();
				activeItem && trigger(activeItem);
				return false;
			}
		});
		
		function trigger(item) {
			self.onDoubleClick(item);
		}
	},
	onMouseEnter: function(e) {
		this.getItemByKey($(e.target).closest('a').attr('data-key')).hover = true;
		this.forceUpdate();
	},
	onMouseLeave: function(e) {
		this.getItemByKey($(e.target).closest('a').attr('data-key')).hover = false;
		this.forceUpdate();
	},
	onClick: function(e) {
		var elem = $(e.target).closest('a');
		var item = this.getItemByKey(elem.attr('data-key'));
		if (!item || (typeof this.props.onActive == 'function' && 
				this.props.onActive(item) === false)) {
			return;
		}
		this.props.modal.setActive(item.name);
	},
	onDoubleClick: function(item, okIcon) {
		item.selected && !item.changed || okIcon ? this.onUnselect(item) : this.onSelect(item);
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
		
		var value = e.getValue();
		if (value != item.value && value != item.value) {
			item.changed = true;
			item.value = value;
			this.forceUpdate();
		}
	},
	getItemByKey: function(key) {
		return this.props.modal.getByKey(key);
	},
	render: function() {
		var self = this;
		var modal = self.props.modal;
		var list = modal.list;
		var data = modal.data;
		var activeItem = modal.getActive();
		//不设置height为0，滚动会有问题
		return (
				<Divider hide={this.props.hide} leftWidth="200">
					<div style={{height: 0}} ref="list" className={'fill orient-vertical-box w-list-data ' + (this.props.className || '')}>
						{
							list.map(function(name) {
								var item = data[name];
								
								return <a key={item.key} data-key={item.key} href="javascript:;"
											onClick={self.onClick} 
											onDoubleClick={function() {
												self.onDoubleClick(item);
											}} 
											className={util.getClasses({
												'w-active': item.active,
												'w-changed': item.changed,
												'w-selected': item.selected
											})} 
											href="javascript:;">{name}<span onClick={function(e) {
												self.onDoubleClick(item, true);
												e.stopPropagation();
											}} className="glyphicon glyphicon-ok"></span></a>;
							})
						}
					</div>
					<Editor {...self.props} onChange={self.onChange} readOnly={!activeItem} value={activeItem ? activeItem.value : ''} 
					mode={self.props.name == 'rules' ? 'rules' : getSuffix(activeItem && activeItem.name)} />
				</Divider>
		);
	}
});

module.exports = List;
