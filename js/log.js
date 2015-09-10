require('./base-css.js');
require('../css/log.css');
var React = require('react');
var util = require('./util');

var Log = React.createClass({
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	render: function() {
		var text = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\r\nbbbbb\r\nccccc\r\ndddddd';
		return (
				<div  className={'fill orient-vertical-box w-detail-content w-detail-log' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
					<ul>
						<li className="w-fatal">
							<label className="w-level">Fatal</label>
							<pre>
								{text}
							</pre>
						</li>
						<li className="w-error">
							<label className="w-level">Error</label>
							<pre>
								{text}
							</pre>
						</li>
						<li className="w-warn">
							<label className="w-level">Warn</label>
							<pre>
								{text}
							</pre>
						</li>
						<li className="w-info">
							<label className="w-level">Info</label>
							<pre>
								{text}
							</pre>
						</li>
						<li className="w-debug">
							<label className="w-level">Debug</label>
							<pre>
								{text}
							</pre>
						</li>
					</ul>
			</div>
		);
	}
});

module.exports = Log;