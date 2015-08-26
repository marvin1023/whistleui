require('./base-css.js');
require('../css/menu-item.css');
var React = require('react');
var util = require('./util');

var MenuItem = React.createClass({
	render: function() {
		var options = this.props.options;
		if (options && !options.length) {
			options = null;
		}
		var name = this.props.name;
		var onClick = this.props.onClick || util.noop;
		var onClickOption = this.props.onClickOption || util.noop;
		return (
			<div style={{display: util.getBoolean(this.props.hide) ? 'none' : 'block'}} className="w-menu-item">
				{
					options ? <div className="w-menu-options">{options.map(function(option) {
						
						return (
								<a key={options.name} onClick={function() {
									onClickOption(option);
								}} href="javascript:;">
									<span className={'glyphicon glyphicon-' + (option.icon || 'asterisk')} style={{visibility: option.icon ? '' : 'hidden'}}></span>
									{option.name}
								</a>
						);
					})}</div> : ''
				}
				{
					name ? <a onClick={onClick} className="w-menu-open" href="javascript:;"><span className="glyphicon glyphicon-folder-open"></span>{name}</a> : ''
				}
			</div>
		);
	}
});

module.exports = MenuItem;
