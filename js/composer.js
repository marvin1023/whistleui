require('./base-css.js');
require('../css/composer.css');
var React = require('react');
var util = require('./util');
var Divider = require('./divider');

var Composer = React.createClass({
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	render: function() {
		return (
			<div className={'fill orient-vertical-box w-detail-composer' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
				<div className="w-composer-url box">
					<input type="text" maxLength="8192" placeholder="url" className="fill w-composer-input" />
					<select className="form-control w-composer-method">
		          		<option value="GET">GET</option>
		          		<option value="POST">POST</option>
		          		<option value="PUT">PUT</option>
		          		<option value="HEAD">HEAD</option>
		          		<option value="TRACE">TRACE</option>
		          		<option value="DELETE">DELETE</option>
		          		<option value="SEARCH">SEARCH</option>
		          		<option value="CONNECT">CONNECT</option>
		          		<option value="PROPFIND">PROPFIND</option>
		          		<option value="PROPPATCH">PROPPATCH</option>
		          		<option value="MKCOL">MKCOL</option>
		          		<option value="COPY">COPY</option>
		          		<option value="MOVE">MOVE</option>
		          		<option value="LOCK">LOCK</option>
		          		<option value="UNLOCK">UNLOCK</option>
		          		<option value="OPTIONS">OPTIONS</option>
		          	</select>
					<button className="btn btn-primary w-composer-execute">Execute</button>
				</div>
				<Divider vertical="true">
					<textarea className="fill w-composer-headers" placeholder="headers"></textarea>
					<textarea className="fill w-composer-body" placeholder="body"></textarea>
				</Divider>
			</div>
		);
	}
});

module.exports = Composer;