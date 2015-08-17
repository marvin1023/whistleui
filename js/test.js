require('../css/base.css');
var React = require('react');
var Divider = require('./divider');
var Menu = require('./menu');
var ReqData = require('./req-data');

React.render(
		<div className="main box-orient-vertical">
			<Menu />
			<Divider rate="3:2">
				<ReqData />
				<div>222222</div>
			</Divider>
		</div>, document.body);
