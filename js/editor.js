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
var markdown = require('codemirror/mode/markdown/markdown');
var themes = ['default', 'neat', 'elegant', 'erlang-dark', 'night', 'monokai', 'cobalt', 'eclipse'
              , 'rubyblue', 'lesser-dark', 'xq-dark', 'xq-light', 'ambiance'
              , 'blackboard', 'vibrant-ink', 'solarized dark', 'solarized light', 'twilight', 'midnight'];
var rules = require('./rules-mode');
var DEFAULT_THEME = 'cobalt';
var DEFAULT_FONT_SIZE = '16px';

var Editor = React.createClass({
	getThemes: function() {
		return themes;
	},
	setMode: function(mode) {
		if (/(javascript|css|xml|rules|markdown)/.test(mode)) {
			mode = RegExp.$1;
		} else if (/js/.test(mode)) {
			mode = 'javascript';
		} else if (/html?/.test(mode)) {
			mode = 'htmlmixed';
		} else if (/md/.test(mode)) {
			mode = 'markdown';
		}
		
		this._mode = mode;
		if (this._editor) {
			this._editor.setOption('mode', mode);
		}
	},
	setValue: function(value) {
		value = this._value = value == null ? '' : value + '';
		if (!this._editor || this._editor.getValue() == value) {
			return;
		}
		this._editor.setValue(value);
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
			this.refs.editor.getDOMNode().style.fontSize = fontSize;
		}
	},
	showLineNumber: function(show) {
		show = this._showLineNumber = show === false ? false : true;
		if (this._editor) {
			this._editor.setOption('lineNumbers', show);
		}
	},
	setReadOnly: function(readOnly) {
		readOnly = this._readOnly = readOnly === false || readOnly === 'false' ? false : true;
		if (this._editor) {
			this._editor.setOption('readOnly', readOnly);
		}
	},
	componentDidMount: function() {
		var timeout;
		var self = this;
		var elem = self.refs.editor.getDOMNode();
		var editor = self._editor = CodeMirror(elem);
		editor.on('change', function(e) {
			if (typeof self.props.onChange == 'function' && editor.getValue() !== (self.props.value || '')) {
				self.props.onChange.call(self, e);
			}
		});
		self._init();
		var codeMirrorElem = $(elem).find('.CodeMirror').addClass('fill');
		resize();
		$(window).on('resize', function() {
			timeout && clearTimeout(timeout);
			timeout = null;
			timeout = setTimeout(resize, 30);
		});
		function resize() {
			var height = elem.offsetHeight || 0;
			if (height < 10) {
				timeout && clearTimeout(timeout);
				timeout = setTimeout(resize, 300);
			} else {
				editor.setSize(null, height);
			}
		}
		if (self.props.name == 'rules') {
			$(elem).on('keydown', function(e) {
				if (!(e.ctrlKey || e.metaKey) || e.keyCode != 191) {
					return;
				}

				var list = editor.listSelections();
				if (!list || !list.length) {
					return;
				}
				var ranges = [];
				list.forEach(function(range) {
					var anchor = range.anchor;
					var head = range.head;
					var lines = [];
					var hasComment, hasRule;
	
					for (var i = anchor.line; i <= head.line; i++) {
						var line = editor.getLine(i);
						if (/^\s*#/.test(line)) {
							hasComment = true;
						} else {
							hasRule = true;
						}
						lines.push(line);
					}
	
					if (hasRule) {
						lines = lines.map(function(line) {
										return '#' + line;
								});
						if (anchor.ch > 0) {
							anchor.ch += 1;
						}
						head.ch += 1;
					} else {
						var lastLine = lines[lines.length - 1];
						var hashIndex = lastLine.indexOf('#');
						if (hashIndex < head.ch) {
							head.ch -= 1;
						}
						if (anchor.ch > 0) {
							anchor.ch -= 1;
						}
		
						lines = lines.map(function(line) {
									return line.replace('#', '');
								});
					}
					editor.replaceRange(lines.join('\n') + '\n', {line: anchor.line, ch: 0}, {line: head.line + 1, ch: 0});
					ranges.push({anchor: anchor, head: head});
				});
				editor.setSelections(ranges);
			});
		}
	},
	_init: function() {
		this.setMode(this.props.mode);
		this.setValue(this.props.value);
		this.setTheme(this.props.theme);
		this.setFontSize(this.props.fontSize);
		this.setTheme(this.props.theme);
		this.showLineNumber(this.props.lineNumbers || false);
		this.setReadOnly(this.props.readOnly || false);
	},
	componentDidUpdate: function() {
		this._init();
	},
	render: function() {
		
		return (
			<div tabIndex="0" ref="editor" className="fill orient-vertical-box w-list-content"></div>
		);
	}
});

module.exports = Editor;