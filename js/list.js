require('./base-css.js');
require('../css/list.css');
var React = require('react');
var Divider = require('./divider');
var Editor = require('./editor');

var List = React.createClass({
	componentDidMount: function() {
		
	},
	render: function() {
		var modal = this.props.modal || {};
		var list = modal.list || [];
		var data = modal.data || {};
		return (
				<Divider leftWidth="200">
					<div className="w-list-data fill">
						{
							list.map(function(item) {
								return <a key={item.id} className={(item.selected ? 'w-selected' : '') + (item.active ? ' w-active' : '')} 
											href="javascript:;">{item.name}<span className="glyphicon glyphicon-ok"></span></a>;
							})
						}
					</div>
					<Editor {...this.props} ref="editor" mode={this.props.name == 'rules' ? 'rules' : ''} />
				</Divider>
		);
	}
});

module.exports = List;
