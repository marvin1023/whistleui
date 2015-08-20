require('./base-css.js');
require('../css/btn-group.css');
var React = require('react');
var util = require('./util');

var BtnGroup = React.createClass({
	render: function() {
		var self = this;
		var tabs = self.props.tabs;
		var list = tabs || self.props.btns;
		var handleClick = self.props.onClick || util.noop;
		
		return (
				<div className={'btn-group btn-group-sm ' + (tabs ? 'w-tabs-sm' : 'w-btn-group-sm')}>
					{list.map(function(btn) {
						var _btn = btn;
						 if (typeof btn == 'string') {
							 btn = {
									key: btn,
									name: btn
							 };
						 }
						 
						 function onClick(first) {
							 list.forEach(function(btn) {
								 btn.active = false;
							 });
							 btn.active = true;
							 btn.clicked = true;
							 handleClick(_btn);
							first !== true && self.forceUpdate();
						 }
						 
						 var icon = btn.icon ? <span className={'glyphicon glyphicon-' + btn.icon}></span> : '';
						 btn.key = btn.key || util.getKey();
						 if (btn.active && !btn.clicked) {
							 onClick(true);
						 }
						 
						 return <button onClick={onClick} key={btn.key} type="button" 
							 	className={'btn btn-default' + (btn.active ? ' active' : '')}>
								 {icon}{btn.name}
								</button>;	
					 })}
				</div>
		);
	}
});

module.exports = BtnGroup;