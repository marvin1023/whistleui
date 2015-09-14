require('./base-css.js');
require('../css/list.css');
var $ = require('jquery');
var util = require('./util');
var React = require('react');
var Divider = require('./divider');
var Editor = require('./editor');
var FilterInput = require('./filter-input');

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
		var listCon = $(self.refs.list.getDOMNode()).focus().on('keydown', function(e) {
			var item;
			if (e.keyCode == 38) { //up
				item = modal.prev();
			} else if (e.keyCode == 40) {//down
				item = modal.next();
			}
			
			if (item) {
				self.onClick(item);
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
			util.ensureVisible(this.refs[activeItem.name].getDOMNode(), this.refs.list.getDOMNode());
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
		if ((!value && !item.value) || value != item.value) {
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
	render: function() {
		var self = this;
		var modal = self.props.modal;
		var list = modal.list;
		var data = modal.data;
		var activeItem = modal.getActive();
		//不设置height为0，滚动会有问题
		return (
				<Divider hide={this.props.hide} leftWidth="200">
				<div className="fill orient-vertical-box w-list-left">	
					<div ref="list" tabIndex="0" className={'fill orient-vertical-box w-list-data ' + (this.props.className || '')}>
							{
								list.map(function(name) {
									var item = data[name];
									
									return <a ref={name} style={{display: item.hide ? 'none' : null}} key={item.key} data-key={item.key} href="javascript:;"
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
												href="javascript:;">{name}<span onClick={function(e) {
													self.onDoubleClick(item, true);
													e.stopPropagation();
												}} className="glyphicon glyphicon-ok"></span></a>;
								})
							}
						</div>
						<FilterInput onChange={this.onFilterChange} />
					</div>
					<Editor {...self.props} onChange={self.onChange} readOnly={!activeItem} value={activeItem ? activeItem.value : ''} 
					mode={self.props.name == 'rules' ? 'rules' : getSuffix(activeItem && activeItem.name)} />
				</Divider>
		);
	}
});

module.exports = List;
