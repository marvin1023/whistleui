require('./base-css.js');
require('../css/log.css');
var React = require('react');

var Log = React.createClass({
	render: function() {
		
		return (
				<div  className="w-detail-log">
					<ul>
						<li className="fatal">
							<h5>Level: fatal</h5>
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
							<h5>Level: error</h5>
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
							<h5>Level: warn</h5>
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
							<h5>Level: info</h5>
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
							<h5>Level: debug</h5>
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