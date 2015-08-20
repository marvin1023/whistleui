require('./base-css.js');
require('../css/menu.css');
var React = require('react');

var Menu = React.createClass({
	render: function() {
		var name = this.props.name;
		var isNetwork = name === undefined || name == 'network';
		var isRules = name == 'rules';
		var isValues = name == 'values';
		
		return (
				<div className="w-menu">
					<a style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-align-justify"></span>Network</a>
					<a style={{display: isRules ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-list"></span>Rules</a>
					<a style={{display: isValues ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-folder-open"></span>Values</a>
					<a style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-plus"></span>Create</a>
					<a style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-edit"></span>Edit</a>
					<a style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-repeat"></span>Replay</a>
					<a style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-edit"></span>Composer</a>
					<a style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-filter"></span>Filter</a>
					<a style={{display: isNetwork ? '' : 'none'}} href="javascript:;"><span className="glyphicon glyphicon-remove"></span>Clear</a>
					<a style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-trash"></span>Delete</a>
					<a style={{display: isNetwork ? 'none' : ''}} href="javascript:;"><span className="glyphicon glyphicon-cog"></span>Settings</a>
					<a href="javascript:;"><span className="glyphicon glyphicon-globe"></span>Weinre</a>
					<a href="javascript:;"><span className="glyphicon glyphicon-download-alt"></span>RootCA</a>
					<a href="https://github.com/avwo/whistle#whistle" target="_blank"><span className="glyphicon glyphicon-question-sign"></span>Help</a>
					<a href="javascript:;"><span className="glyphicon glyphicon-info-sign"></span>About</a>
					<a href="javascript:;" className="w-online"><span className="glyphicon glyphicon-stats"></span>Online</a>
				</div>
		);
	}
});

module.exports = Menu;