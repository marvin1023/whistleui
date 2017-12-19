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
var ReactDOM = require('react-dom');
var CodeMirror = require('codemirror');
var javascript = require('codemirror/mode/javascript/javascript');
var css = require('codemirror/mode/css/css');
var xml = require('codemirror/mode/xml/xml');
var htmlmixed = require('codemirror/mode/htmlmixed/htmlmixed');
var markdown = require('codemirror/mode/markdown/markdown');
var rulesHint = require('./rules-hint');

var themes = ['default', 'neat', 'elegant', 'erlang-dark', 'night', 'monokai', 'cobalt', 'eclipse'
              , 'rubyblue', 'lesser-dark', 'xq-dark', 'xq-light', 'ambiance'
              , 'blackboard', 'vibrant-ink', 'solarized dark', 'solarized light', 'twilight', 'midnight'];
var rulesMode = require('./rules-mode');
var DEFAULT_THEME = 'cobalt';
var DEFAULT_FONT_SIZE = '16px';
var RULES_COMMENT_RE = /^()\s*#\s*/;
var JS_COMMENT_RE = /^(\s*)\/\/+\s?/;
var NO_SPACE_RE = /[^\s]/;

var Editor = React.createClass({
	getThemes: function() {
		return themes;
	},
	setMode: function(mode) {
		if (/^(javascript|css|xml|rules|markdown)$/i.test(mode)) {
			mode = RegExp.$1.toLowerCase();
		} else if (/^(js|pac|jsx|json)$/i.test(mode)) {
			mode = 'javascript';
		} else if (/^html?$/i.test(mode)) {
			mode = 'htmlmixed';
		} else if (/^md$/i.test(mode)) {
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
			ReactDOM.findDOMNode(this.refs.editor).style.fontSize = fontSize;
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
	setAutoComplete: function(enable) {
		var option = this.isRulesEditor() ? rulesHint.getExtraKeys() : null;
		this._editor.setOption('extraKeys', option);
	},
	isRulesEditor: function() {
		return this.props.name === 'rules' || this._mode === 'rules';
	},
	componentDidMount: function() {
		var timeout;
		var self = this;
		var elem = ReactDOM.findDOMNode(self.refs.editor);
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
		$(elem).on('keydown', function(e) {
			var isRules = self.isRulesEditor();
			var isJS = self._mode == 'javascript';
			if (isRules && !e.ctrlKey && !e.metaKey && e.keyCode === 112) {
				window.open(rulesHint.getHelpUrl(self._editor));
				return true;
			}
			if ((!isRules && !isJS) || !(e.ctrlKey || e.metaKey) || e.keyCode != 191) {
				return;
			}

			var list = editor.listSelections();
			if (!list || !list.length) {
				return;
			}
			var commentRE = isRules ? RULES_COMMENT_RE : JS_COMMENT_RE;
			var isShiftKey = e.shiftKey;
			var isEmpty;
			var ranges = [];
			list.forEach(function(range) {
				var anchor = range.anchor;
				var head = range.head;
				var lines = [];
				var hasComment, hasRule, revert;
				
				if (anchor.line > head.line) {
					revert = anchor;
					anchor = head;
					head = revert;
				}

				for (var i = anchor.line; i <= head.line; i++) {
					var line = editor.getLine(i);
					if (commentRE.test(line)) {
						hasComment = true;
					} else if (NO_SPACE_RE.test(line)) {
						hasRule = true;
					}
					lines.push(line);
				}

				if (isEmpty = !hasComment && !hasRule) {
					return;
				}
				var lastIndex, firstLine, lastLine;
				if (hasRule) {
					lastIndex = lines.length - 1;
					firstLine = lines[0];
					lastLine = lines[lastIndex];
					lines = lines.map(function(line) {
						if (!NO_SPACE_RE.test(line)) {
							return line;
						}
						if (isShiftKey && commentRE.test(line)) {
							return line.replace(commentRE, '$1');
						}
						return (isRules ? '# ' : '// ') + line;
					});
				} else {
					firstLine = lines[0];
					lastIndex = lines.length - 1;
					lastLine = lines[lastIndex];
					lines = lines.map(function(line) {
						return line.replace(commentRE, '$1');
					});
				}
				if (anchor.ch != 0) {
					anchor.ch +=  lines[0].length - firstLine.length;
					if (anchor.ch < 0) {
						anchor.ch = 0;
					}
				}
				if (head.ch != 0 && head != anchor) {
					head.ch += lines[lastIndex].length - lastLine.length;
					if (head.ch < 0) {
						head.ch = 0;
					} 
				}
				if (revert) {
					editor.replaceRange(lines.join('\n') + '\n', {line: head.line + 1, ch: 0}, {line: anchor.line, ch: 0});
					ranges.push({anchor: head, head: anchor});
				} else {
					editor.replaceRange(lines.join('\n') + '\n', {line: anchor.line, ch: 0}, {line: head.line + 1, ch: 0});
					ranges.push({anchor: anchor, head: head});
				}
			});
			if (!isEmpty) {
				editor.setSelections(ranges);
			}
		});
	},
	_init: function() {
		this.setMode(this.props.mode);
		this.setValue(this.props.value);
		this.setTheme(this.props.theme);
		this.setFontSize(this.props.fontSize);
		this.setTheme(this.props.theme);
		this.showLineNumber(this.props.lineNumbers || false);
		this.setReadOnly(this.props.readOnly || false);
		this.setAutoComplete();
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