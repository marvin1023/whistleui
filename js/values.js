require('./base-css.js');
var React = require('react');
var List = require('./list');
var Menu = require('./menu');

React.render(
		<div className="main box-orient-vertical">
			<div className="w-rules-con"></div>
			<div className="w-network-con"></div>
			<Menu />
			<List />
		</div>, document.body);
