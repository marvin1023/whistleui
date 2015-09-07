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
	onClick: function(item) {
		this.setState({activeItem: item});
	},
	onDoubleClick: function() {
		this.setState({showFirstTab: true});
	},
	render: function() {
		var modal = this.props.modal;
		var showFirstTab = false;
		if (this.state && this.state.showFirstTab) {
			this.state.showFirstTab = false;
			showFirstTab = true;
		}
		return (
			<Divider hide={this.props.hide} rightWidth="560">
				<ReqData modal={modal} onClick={this.onClick} onDoubleClick={this.onDoubleClick} />
				<Detail showFirstTab={showFirstTab} modal={modal} />
			</Divider>		
		);
	}
});

module.exports = Network;
