require('codemirror/addon/hint/show-hint.css');
require('codemirror/addon/hint/show-hint.js');
var $ = require('jquery');
var CodeMirror = require('codemirror');

var PROTOCOL_RE = /^([^\s]+):\/\//;
var SPACE_RE = /(\s+)/;

function getHints(keyword) {
  
}

var WORD = /[^\s]+/;
CodeMirror.registerHelper('hint', 'rulesHint', function(editor, options) {
  var cur = editor.getCursor();
  var curLine = editor.getLine(cur.line);
  var end = cur.ch, start = end, list;
  var commentIndex = curLine.indexOf('#');
  if (commentIndex !== -1 && commentIndex < start) {
    return;
  }
  while (start && WORD.test(curLine.charAt(start - 1))) {
    --start;
  }
  var curWord = start != end && curLine.slice(start, end);
  list = ['1111','212222','33121321'].filter(function(i) {
    return !curWord || i.indexOf(curWord) !== -1;
  });
  if (!list.length) {
    return;
  }
  return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
});

CodeMirror.commands.autocomplete = function(cm) {
  cm.showHint({hint: CodeMirror.hint.rulesHint});
};

function getFocusRuleName(editor) {
	var name;
	var activeHint = $('li.CodeMirror-hint-active');
	if (activeHint.is(':visible')) {
		name = activeHint.text().replace('://', '');
	} else {
		var cur = editor.getCursor();
		var curLine = editor.getLine(cur.line).replace(/#/, ' ');
		var end = cur.ch;
		if (end > 0) {
      var start = SPACE_RE.test(curLine) ? curLine.indexOf(RegExp.$1) + 1 : 0;
			curLine = curLine.slice(start > end ? 0 :start);
      if (PROTOCOL_RE.test(curLine)) {
        name = RegExp.$1;
      }
		}
  }
  return name;
}

exports.getFocusRuleName = getFocusRuleName;
