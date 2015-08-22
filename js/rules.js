require('./base-css.js');
var React = require('react');
var List = require('./list');

var modal = {
		list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
		data: {
			'1': {
				value: 'test',
				active: true
			}
		}
};

var Rules = React.createClass({
	render: function() {
		
		return (
				<List name="rules" onEnable={function(e) {
					this.enable(e.data.name);
					return false;
				}} onDisable={function(e) {
					this.disable(e.data.name);
					return false;
				}} modal={modal} />
		);
	}
});

module.exports = Rules;