require('./base-css.js');
require('../css/btn-group.css');
var React = require('react');
var util = require('./util');

var BtnGroup = React.createClass({
	clearSelection: function() {
		this._clearSelection();
		this.forceUpdate();
	},
	_clearSelection: function() {
		var list = this.props.tabs || this.props.btns;
		list.forEach(function(btn) {
			 btn.active = false;
		 });
	},
	componentDidMount: function() {
		this._handleInitClick && this._handleInitClick();
	},
	render: function() {
		var self = this;
		var tabs = self.props.tabs;
		var list = tabs || self.props.btns;
		var handleClick = self.props.onClick || util.noop;
		
		return (
				<div className={'btn-group btn-group-sm ' + (tabs ? 'w-tabs-sm' : 'w-btn-group-sm')}>
					{list.map(function(btn, i) {
						var disabled = self.props.disabled;
						if (!disabled || disabled === 'false') {
							disabled = false;
						}
						 function onClick() {
							 if (btn.active || disabled) {
								 return;
							 }
							 self._clearSelection();
							 btn.active = true;
							 handleClick(btn);
							 self.forceUpdate();
						 }
						 
						 if (btn.active) {
							 self._handleInitClick = function() {
								 self._handleInitClick = null;
								 btn.active = false;
								 onClick();
							 };
						 }
						 
						 var icon = btn.icon ? <span className={'glyphicon glyphicon-' + btn.icon}></span> : '';
						 btn.key = btn.key || util.getKey();
						 
						 return <button onClick={onClick} key={btn.key} type="button" 
							 	className={'btn btn-default' + (btn.active && !disabled ? ' active' : '')}>
								 {icon}{btn.name}
								</button>;	
					 })}
				</div>
		);
	}
});

module.exports = BtnGroup;