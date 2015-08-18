require('codemirror/lib/codemirror.css');
require('codemirror/theme/neat.css');
require('codemirror/theme/elegant.css');
require('codemirror/theme/erlang-dark.css');
require('codemirror/theme/night.css');
require('codemirror/theme/monokai.css');
require('codemirror/theme/cobalt.css');
require('codemirror/theme/eclipse.css');
require('codemirror/theme/rubyblue.css');
require('codemirror/theme/lesser-dark.css');
require('codemirror/theme/xq-dark.css');
require('codemirror/theme/xq-light.css');
require('codemirror/theme/ambiance.css');
require('codemirror/theme/blackboard.css');
require('codemirror/theme/vibrant-ink.css');
require('codemirror/theme/solarized.css');
require('codemirror/theme/twilight.css');
require('codemirror/theme/midnight.css');
require('../css/list.css');
require('../css/editor.css');
var $ = require('jquery');
var React = require('react');
var CodeMirror = require('codemirror');
var jsMode = require('codemirror/mode/javascript/javascript');
var cssMode = require('codemirror/mode/css/css');
var xmlMode = require('codemirror/mode/xml/xml');
var htmlMode = require('codemirror/mode/htmlmixed/htmlmixed');

var Editor = React.createClass({
	componentDidMount: function() {
		var myCodeMirror = CodeMirror(this.refs.editor.getDOMNode(), {
			  value: "function myScript(){return 100;}\n",
			  mode:  "css"
			});
		var con = this.refs.editor.getDOMNode();
		var timeout;
		
		resize();
		$(window).on('resize', function() {
			clearTimeout(timeout);
			timeout = setTimeout(resize, 30);
		});
		
		function resize() {
			myCodeMirror.setSize(con.offsetWidth, con.offsetHeight);
		}
	},
	render: function() {
		
		return (
			<div ref="editor" className="fill w-list-content"></div>
		);
	}
});

module.exports = Editor;