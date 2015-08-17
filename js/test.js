require('../css/base.css');
var React = require('react');
var Divider = require('./divider');
var Menu = require('./menu');
var ReqData = require('./req-data');

React.render(
		<div className="main box-orient-vertical">
			<Menu />
			<Divider rate="3:2" leftClassName="box-orient-vertical" rightClassName="box-orient-vertical">
				<ReqData />
				<div>222222</div>
			</Divider>
		</div>, document.body);
