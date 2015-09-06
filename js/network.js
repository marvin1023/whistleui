require('./base-css.js');
var React = require('react');
var util = require('./util');
var Divider = require('./divider');
var ReqData = require('./req-data');
var Detail = require('./detail');
var dataCenter = require('./data-center');

var Network = React.createClass({
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	render: function() {
		var modal = this.props.modal;
		return (
			<Divider hide={this.props.hide} rightWidth="560">
				<ReqData modal={modal} />
				<Detail modal={modal} />
			</Divider>		
		);
	}
});

module.exports = Network;
