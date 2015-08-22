require('./base-css.js');
require('../css/values.css');
var React = require('react');
var List = require('./list');
var Menu = require('./menu');

var modal = {
		list: ['1.js', '2.html', '3.md', '4.json', '5.css', '6.xml', 7, 8, 9, 0]
};

var Values = React.createClass({
	
	render: function() {
		
		return (
			<div className="main orient-vertical-box">
				<div className="w-rules-con"></div>
				<div className="w-network-con"></div>
				<Menu name="values" />
				<List modal={modal} className="w-values-list" />
			</div>
		);
	}
});

module.exports = Values;
