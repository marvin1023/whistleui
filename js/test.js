require('./base-css.js');
var React = require('react');
var Divider = require('./divider');
var Menu = require('./menu');
var ReqData = require('./req-data');
var Detail = require('./detail');

React.render(
		<div className="main box-orient-vertical">
			<Menu />
			<Divider rate="3:2">
				<ReqData />
				<Detail />
			</Divider>
		</div>, document.body);
