require('./base-css.js');
require('../css/list.css');
var React = require('react');
var Divider = require('./divider');
var Editor = require('./editor');

var List = React.createClass({
	componentDidMount: function() {
		var isRulesEditor = this.props.type == 'rules';
	},
	render: function() {
		
		return (
				<Divider leftWidth="200">
					<div className="w-list-data fill">
						<a href="javascript:;">Default<span className="glyphicon glyphicon-ok"></span></a>
						<a href="javascript:;">DefaultDefaultDefaultDefaultDefaultDefaultDefaultDefault</a>
					</div>
					<Editor ref="editor" mode="rules" />
				</Divider>
		);
	}
});

module.exports = List;
