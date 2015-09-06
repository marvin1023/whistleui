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
		
		return (
				<div  className={'w-detail-log' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
					<ul>
						<li className="fatal">
							<h5>Level: FATAL</h5>
							<h5>Date: xxxxxx</h5>
							<h5>Source:</h5>
							<pre>
								xxxxxx
							</pre>
							<h5>Message:</h5>
							<pre>
								mmmmmmm
							</pre>
							<h5>stack:</h5>
							<pre>
								ssssssssssssssss
							</pre>
							<h5>UA:</h5>
							<pre>
								xxxxxx
							</pre>
						</li>
						<li className="error">
							<h5>Level: ERROR</h5>
							<h5>Date: xxxxxx</h5>
							<h5>Source:</h5>
							<pre>
								xxxxxx
							</pre>
							<h5>Message:</h5>
							<pre>
								mmmmmmm
							</pre>
							<h5>stack:</h5>
							<pre>
								ssssssssssssssss
							</pre>
							<h5>UA:</h5>
							<pre>
								xxxxxx
							</pre>
						</li>
						<li className="warn">
							<h5>Level: WARN</h5>
							<h5>Date: xxxxxx</h5>
							<h5>Source:</h5>
							<pre>
								xxxxxx
							</pre>
							<h5>Message:</h5>
							<pre>
								mmmmmmm
							</pre>
							<h5>stack:</h5>
							<pre>
								ssssssssssssssss
							</pre>
							<h5>UA:</h5>
							<pre>
								xxxxxx
							</pre>
						</li>
						<li className="info">
							<h5>Level: INFO</h5>
							<h5>Date: xxxxxx</h5>
							<h5>Source:</h5>
							<pre>
								xxxxxx
							</pre>
							<h5>Message:</h5>
							<pre>
								mmmmmmm
							</pre>
							<h5>stack:</h5>
							<pre>
								ssssssssssssssss
							</pre>
							<h5>UA:</h5>
							<pre>
								xxxxxx
							</pre>
						</li>
						<li className="debug">
							<h5>Level: DEBUG</h5>
							<h5>Date: xxxxxx</h5>
							<h5>Source:</h5>
							<pre>
								xxxxxx
							</pre>
							<h5>Message:</h5>
							<pre>
								mmmmmmm
							</pre>
							<h5>stack:</h5>
							<pre>
								ssssssssssssssss
							</pre>
							<h5>UA:</h5>
							<pre>
								xxxxxx
							</pre>
						</li>
					</ul>
			</div>
		);
	}
});

module.exports = Log;