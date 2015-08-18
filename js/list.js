require('./base-css.js');
require('../css/list.css');
var React = require('react');
var Divider = require('./divider');
var Editor = require('./editor');

var List = React.createClass({
	componentDidMount: function() {
		
	},
	render: function() {
		
		return (
				<Divider leftWidth="200">
					<div className="w-list-data fill">
						<a href="javascript:;">Default<span className="glyphicon glyphicon-ok"></span></a>
						<a href="javascript:;">DefaultDefaultDefaultDefaultDefaultDefaultDefaultDefault</a>
					</div>
					<Editor ref="editor" mode={this.props.type == 'rules' ? 'rules' : ''} />
				</Divider>
		);
	}
});

module.exports = List;
