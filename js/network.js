require('./base-css.js');
var $ = require('jquery');
var React = require('react');
var util = require('./util');
var events = require('./events');
var Divider = require('./divider');
var ReqData = require('./req-data');
var Detail = require('./detail');
var dataCenter = require('./data-center');

var Network = React.createClass({
	componentDidMount: function() {
		var self = this;
		$(window).on('keydown', function(e) {
			if (self.props.hide || e.target.nodeName == 'INPUT' 
				|| e.target.nodeName == 'TEXTAREA') {
				return;
			}
			if (e.keyCode == 8 || e.keyCode == 46) {
				var modal = self.props.modal;
				if (modal && modal.removeSelectedItems()) {
					self.setState({});
				}
				e.preventDefault();
			}
		});
	},
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	onClick: function(item) {
		this.setState({activeItem: item});
	},
	onDoubleClick: function() {
		events.trigger('showOverview');
	},
	render: function() {
		var modal = this.props.modal;
		
		return (
			<Divider hide={this.props.hide} rightWidth="560">
				<ReqData modal={modal} onClick={this.onClick} onDoubleClick={this.onDoubleClick} />
				<Detail modal={modal} />
			</Divider>		
		);
	}
});

module.exports = Network;
