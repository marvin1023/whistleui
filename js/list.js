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
		var list = $(self.refs.list.getDOMNode());
		$(window).keydown(function(e) {
			if (visible && (e.ctrlKey || e.metaKey) && e.keyCode == 83) {
				list.find('.w-changed,.w-active').each(trigger);
				return false;
			}
		});
		
		function trigger() {
			self.onDoubleClick({target: this});
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
	onDoubleClick: function(e) {
		var target = $(e.target);
		var elem = target.closest('a');
		var item = this.getItemByKey(elem.attr('data-key'));
		var okIcon = target.hasClass('glyphicon-ok');
		item.selected && !item.changed || okIcon ? this.onDisable(item) : this.onEnable(item);
		okIcon && e.stopPropagation();
	},
	onEnable: function(data) {
		if (typeof this.props.onEnable != 'function' || 
				this.props.onEnable.call(this, data) !== false) {
			this.enable(data.name);
		}
	},
	onDisable: function(data) {
		if (typeof this.props.onDisable != 'function' || 
				this.props.onDisable.call(this, data) !== false) {
			this.disable(data.name);
		}
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
		
		return (
				<Divider hide={this.props.hide} leftWidth="200">
					<div ref="list" className={'fill orient-vertical-box w-list-data ' + (this.props.className || '')}>
						{
							list.map(function(name) {
								var item = data[name];
								return <a key={item.key} data-key={item.key}
											onMouseEnter={self.onMouseEnter}
											onMouseLeave={self.onMouseLeave}
											onClick={self.onClick} 
											onDoubleClick={self.onDoubleClick} 
											className={(item.hover ? 'w-hover' : '') 
											+ (item.active ? ' w-active' : '') 
											+ (item.changed ? ' w-changed' : '')
											+ (item.selected ? ' w-selected' : '')} 
											href="javascript:;">{name}<span onClick={self.onDoubleClick} className="glyphicon glyphicon-ok"></span></a>;
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
