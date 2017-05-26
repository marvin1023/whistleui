require('./base-css.js');
require('../css/composer.css');
var React = require('react');
var ReactDOM = require('react-dom');
var dataCenter = require('./data-center');
var util = require('./util');
var events = require('./events');
var Divider = require('./divider');

var Composer = React.createClass({
	componentDidMount: function() {
		var self = this;
		self.update(self.props.modal);
		events.on('setComposer', function() {
			var activeItem = self.props.modal;
			activeItem && self.setState({
				data: activeItem
			}, function() {
				self.update(activeItem);
			});
		});
	},
	update: function(item) {
		if (!item) {
			return;
		}
		var refs = this.refs;
		var req = item.req;
		ReactDOM.findDOMNode(refs.url).value = item.url;
		ReactDOM.findDOMNode(refs.method).value = req.method;
		delete req.headers.Host;
		ReactDOM.findDOMNode(refs.headers).value = util.objectToString(req.headers, req.rawHeaderNames);
		ReactDOM.findDOMNode(refs.body).value = req.body || '';
	},
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	execute: function() {
		var refs = this.refs;
		var url = ReactDOM.findDOMNode(refs.url).value.trim();
		if (!url) {
			return;
		}
		
		dataCenter.composer({
			url: url,
			headers: ReactDOM.findDOMNode(refs.headers).value,
			method: ReactDOM.findDOMNode(refs.method).value || 'GET',
			body: ReactDOM.findDOMNode(refs.body).value
		});
		events.trigger('executeComposer');
	},
	selectAll: function(e) {
		e.target.select();
	},
	render: function() {
		
		return (
			<div className={'fill orient-vertical-box w-detail-content w-detail-composer' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
				<div className="w-composer-url box">
					<input onFocus={this.selectAll} ref="url" type="text" maxLength="8192" placeholder="url" className="fill w-composer-input" />
					<select ref="method" className="form-control w-composer-method">
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
					<button onClick={this.execute} className="btn btn-primary w-composer-execute">Go</button>
				</div>
				<Divider vertical="true">
					<textarea ref="headers" className="fill w-composer-headers" placeholder="headers"></textarea>
					<textarea ref="body" className="fill w-composer-body" placeholder="body"></textarea>
				</Divider>
			</div>
		);
	}
});

module.exports = Composer;