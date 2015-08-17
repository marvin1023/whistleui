require('./css.js');
require('../css/menu.css');
var React = require('react');

var Menu = React.createClass({
	render: function() {
		
		return (
				<div className="w-menu">
					<a href="javascript:;"><span className="glyphicon glyphicon-list"></span>Rules</a>
					<a href="javascript:;"><span className="glyphicon glyphicon-folder-open"></span>Values</a>
					<a href="javascript:;"><span className="glyphicon glyphicon-repeat"></span>Replay</a>
					<a href="javascript:;"><span className="glyphicon glyphicon-filter"></span>Filter</a>
					<a href="javascript:;"><span className="glyphicon glyphicon-remove"></span>Clear</a>
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