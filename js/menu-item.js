require('./base-css.js');
require('../css/menu-item.css');
var React = require('react');
var util = require('./util');

var MenuItem = React.createClass({
	preventBlur: function(e) {
		e.preventDefault();
	},
	render: function() {
		var options = this.props.options;
		if (options && !options.length) {
			options = null;
		}
		var name = this.props.name;
		var onClick = this.props.onClick || util.noop;
		var onClickOption = this.props.onClickOption || util.noop;
		return (
			<div onBlur={this.props.onBlur} tabIndex="0" onMouseDown={this.preventBlur} style={{display: util.getBoolean(this.props.hide) ? 'none' : 'block'}} className={'w-menu-item ' + (this.props.className || '')}>
			{
				name ? <a onClick={onClick} className="w-menu-open" href="javascript:;"><span className="glyphicon glyphicon-folder-open"></span>{name}</a> : ''
			}	
			{
					options ? <div className="w-menu-options">{options.map(function(option) {
						
						return (
								<a key={option.name} onClick={function() {
									onClickOption(option);
								}} href="javascript:;">
									<span className={'glyphicon glyphicon-' + (option.icon || 'asterisk')} style={{visibility: option.icon ? '' : 'hidden'}}></span>
									{option.name}
								</a>
						);
					})}</div> : ''
				}
			</div>
		);
	}
});

module.exports = MenuItem;
