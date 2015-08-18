require('./base-css.js');
var React = require('react');
var List = require('./list');
var Menu = require('./menu');

var modal = {
		list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
		data: {
			'1': {
				value: 'test',
				active: true
			}
		}
};

React.render(
		<div className="main orient-vertical-box">
			<div className="w-values-con"></div>
			<div className="w-network-con"></div>
			<Menu name="rules" />
			<List name="rules" onEnable={function(e) {
				this.enable(e.data.name);
				return false;
			}} onDisable={function(e) {
				this.disable(e.data.name);
				return false;
			}} modal={modal} />
		</div>, document.body);