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
var javascript = require('codemirror/mode/javascript/javascript');
var css = require('codemirror/mode/css/css');
var xml = require('codemirror/mode/xml/xml');
var htmlmixed = require('codemirror/mode/htmlmixed/htmlmixed');
var rules = require('./rules-mode');
var DEFAULT_THEME = 'cobalt';
var DEFAULT_FONT_SIZE = '16px';

var Editor = React.createClass({
	setMode: function(mode) {
		if (/(javascript|css|xml|rules)/.test(mode)) {
			mode = RegExp.$1;
		} else if (/js/.test(mode)) {
			mode = 'javascript';
		} else if (/html?/.test(mode)) {
			mode = 'htmlmixed';
		}
		
		this._mode = mode;
		if (this._editor) {
			this._editor.setOption('mode', mode);
		}
	},
	setValue: function(value) {
		value = this._value = value == null ? '' : value + '';
		if (!this._editor) {
			return;
		}
		this._editor.setOption('value', value);
	},
	getValue: function() {
		return this._editor ? '' : this._editor.getValue();
	},
	setTheme: function(theme) {
		theme = this._theme = theme || DEFAULT_THEME;
		if (!this._editor) {
			return;
		}
		this._editor.setOption('theme', theme);
	},
	setFontSize: function(fontSize) {
		fontSize = this._fontSize = fontSize || DEFAULT_FONT_SIZE;
		if (this._editor) {
			elem.style.fontSize = fontSize;
		}
	},
	showLineNumber: function(show) {
		show = this._showLineNumber = show === false ? false : true;
		if (this._editor) {
			this._editor.setOption('lineNumbers', show);
		}
	},
	componentDidMount: function() {
		var timeout;
		var elem = this.refs.editor.getDOMNode();
		var editor = this._editor = CodeMirror(elem);
		this.setMode(this.props.mode);
		elem.style.fontSize = this._fontSize || DEFAULT_FONT_SIZE;
		editor.setOption('mode', this._mode);
		editor.setOption('value', this._value || '');
		editor.setOption('font', this._showLineNumber);
		editor.setOption('lineNumbers', this._showLineNumber);
		editor.setOption('theme', this._theme || DEFAULT_THEME);
		$(elem).find('.CodeMirror').addClass('fill');
		resize();
		$(window).on('resize', function() {
			clearTimeout(timeout);
			timeout = setTimeout(resize, 30);
		});
		function resize() {
			editor.setSize(null, elem.offsetHeight);
		}
	},
	render: function() {
		
		return (
			<div ref="editor" className="fill orient-vertical-box w-list-content"></div>
		);
	}
});

module.exports = Editor;