require('./base-css.js');
require('../css/btn-group.css');
var React = require('react');
var util = require('./util');

var BtnGroup = React.createClass({
	handleClick: function(btn) {
		 if (btn.active || btn.disabled) {
			 return;
		 }
		 var list = this.props.tabs || this.props.btns;
		 list.forEach(function(btn) {
			 btn.active = false;
		 });
		 btn.active = true;
		 if (!this.props.onClick || this.props.onClick(btn)) {
			 this.setState({
				 curBtn: btn
			 });
		 }
	},
	render: function() {
		var self = this;
		var tabs = self.props.tabs;
		var list = tabs || self.props.btns;
		var disabled = util.getBoolean(self.props.disabled);
		
		return (
				<div className={'btn-group btn-group-sm ' + (tabs ? 'w-tabs-sm' : 'w-btn-group-sm')}>
					{list.map(function(btn, i) {
						 btn.disabled = disabled;
						 var icon = btn.icon ? <span className={'glyphicon glyphicon-' + btn.icon}></span> : '';
						 btn.key = btn.key || util.getKey();
						 
						 return <button onClick={function() {
							 self.handleClick(btn);
						 }} onDoubleClick={self.props.onDoubleClick} key={btn.key} type="button" 
							 	className={'btn btn-default' + (btn.active && !disabled ? ' active' : '')}>
								 {icon}{btn.name}
								</button>;	
					 })}
				</div>
		);
	}
});

module.exports = BtnGroup;