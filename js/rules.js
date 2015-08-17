require('./base-css.js');
var React = require('react');
var List = require('./list');
var Menu = require('./menu');

React.render(
		<div className="main orient-vertical-box">
			<div className="w-values-con"></div>
			<div className="w-network-con"></div>
			<Menu name="rules" />
			<List />
		</div>, document.body);