require('./base-css.js');
require('../css/about.css');
var $ = window.jQuery = require('jquery'); //for bootstrap
require('bootstrap/dist/js/bootstrap.js');
var React = require('react');
var dataCenter = require('./data-center');
var dialog;

function createDialog(version) {
	if (!dialog) {
		dialog = $('<div class="modal fade w-about-dialog">' + 
				  '<div class="modal-dialog">' + 
				    '<div class="modal-content">' + 
				      '<div class="modal-body">' + 
				      '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
				        '<img alt="logo" src="/img/whistle.png">' + 
			          '<span" class="w-about-dialog-ctn"><span class="w-about-dialog-title">Whistle for Web Developers.</span>' +
					  'Version: <span id="aboutVersion">' + version + '</span><br>' + 
					  'Visit <a id="aboutUrl" href="http://www.whistlejs.com#v=' + version + '" target="_blank">http://www.whistlejs.com</a></span>' +
				      '</div>' + 
				      '<div class="modal-footer">' + 
				        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' + 
				      '</div>' + 
				    '</div>' + 
				  '</div>' + 
				'</div>').appendTo(document.body);
	}
	
	return dialog;
}

var About = React.createClass({
	showAboutInfo: function() {
		dataCenter.getInitialData(function(data) {
			createDialog(data.version).modal('show');
		});
	},
	render: function() {
		return (
				<a onClick={this.showAboutInfo} className="w-about-menu" href="javascript:;"><span className="glyphicon glyphicon-info-sign"></span>About</a>
		);
	}
});

module.exports = About;