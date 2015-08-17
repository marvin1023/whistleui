require('../css/base.css');
var React = require('react');
var Divider = require('./divider');
var Menu = require('./menu');

React.render(
		<div className="main box-orient-vertical">
			<Menu />
			<Divider>
				<div>111111</div>
				<div>222222</div>
			</Divider>
		</div>, document.body);
