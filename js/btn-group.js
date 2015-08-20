require('./base-css.js');
require('../css/btn-group.css');
var React = require('react');
var util = require('./util');

var BtnGroup = React.createClass({
	render: function() {
		var tabs = this.props.tabs;
		var list = tabs || this.props.btns;
		return (
				<div className={'btn-group btn-group-sm ' + (tabs ? 'w-tabs-sm' : 'w-btn-group-sm')}>
					{list.map(function(btn) {
						 if (typeof btn == 'string') {
							 btn = {
									key: btn,
									name: btn
							 };
						 }
						 var icon = btn.icon ? <span className={'glyphicon glyphicon-' + btn.icon}></span> : '';
						 btn.key = btn.key || util.getKey();
						 return <button key={btn.key} type="button" className="btn btn-default">{icon}{btn.name}</button>;	
					 })}
				</div>
		);
	}
});

module.exports = BtnGroup;