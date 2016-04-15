var $ = window.jQuery = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');

var Dialog = React.createClass({
	componentDidMount: function() {
		this.container = document.createElement('div');
		this.container.className = 'modal fade';
	    document.body.appendChild(this.container);
	    this.componentDidUpdate();
	},
	componentDidUpdate: function() {
		ReactDOM.unstable_renderSubtreeIntoContainer(this,
		        this.getDialogElement(), this.container);
	},
	getDialogElement: function() {
		
		return (
				<div className="modal-dialog">
				  	<div className="modal-content">
				  		{this.props.children}
				    </div>
				</div>
		);
	},
	show: function() {
		$(this.container).modal('show');
	},
	hide: function() {
		$(this.container).modal('hide');
	},
	render: function() {
		
		return null;
	}
});

module.exports = Dialog;