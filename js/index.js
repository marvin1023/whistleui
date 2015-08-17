require('./base-css.js');
var React = require('react');
var Divider = require('./divider');
var Menu = require('./menu');
var ReqData = require('./req-data');
var Detail = require('./detail');

React.render(
		<div className="main box-orient-vertical">
			<div className="w-rules-con"></div>
			<div className="w-values-con"></div>
			<Menu />
			<Divider rightWidth="560">
				<ReqData />
				<Detail />
			</Divider>
		</div>, document.body);
