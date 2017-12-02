require('codemirror/addon/hint/show-hint.css');
require('codemirror/addon/hint/show-hint.js');
var $ = require('jquery');
var CodeMirror = require('codemirror');
var protocols = require('./protocols');

var PROTOCOL_RE = /^([^\s:]+):\/\//;
var SPACE_RE = /(\s+)/;
var extraKeys = {'Alt-/': 'autocomplete'};
var CHARS = ['"-"', '"_"'];
for (var i = 0; i < 10; i++) {
  CHARS.push('\'' + i + '\'');
}
for (var a = 'a'.charCodeAt(), z = 'z'.charCodeAt(); a <= z; a++) {
  var ch = String.fromCharCode(a);
  CHARS.push('\'' + ch.toUpperCase() + '\'');
  CHARS.push('\'' + ch + '\'');
}

function getHints(keyword) {
  var allRules = protocols.getAllRules();
  if (!keyword) {
    return allRules;
  }
  keyword = keyword.toLowerCase();
  if (keyword === 'csp') {
    return ['disable://csp'];
  }
  var list = allRules.filter(function(name) {
    return name.toLowerCase().indexOf(keyword) !== -1;
  });
  list.sort(function(cur, next) {
    var curIndex = cur.toLowerCase().indexOf(keyword);
    var nextIndex = next.toLowerCase().indexOf(keyword);
    if (curIndex === nextIndex) {
      return 0;
    }
    return curIndex > nextIndex ? 1 : -1;
  });
  return list;
}

var WORD = /[^\s]+/;
CodeMirror.registerHelper('hint', 'rulesHint', function(editor, options) {
  var cur = editor.getCursor();
  var curLine = editor.getLine(cur.line);
  var end = cur.ch, start = end, list;
  var commentIndex = curLine.indexOf('#');
  if ((commentIndex !== -1 && commentIndex < start)) {
    return;
  }
  while (start && WORD.test(curLine.charAt(start - 1))) {
    --start;
  }
  var curChar = curLine[end];
  if (curChar === ':') {
    end++;
    curChar = curLine[end];
  }
  if (curChar === '/') {
    end++;
    curChar = curLine[end];
    if (curChar === '/') {
      end++;
    }
  }
  var curWord = start != end && curLine.slice(start, end);
  if (curWord && curWord.indexOf('//') !== -1) {
    return;
  }
  var list = getHints(curWord);
  if (!list.length) {
    return;
  }
  return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
});

CodeMirror.commands.autocomplete = function(cm) {
  cm.showHint({
    hint: CodeMirror.hint.rulesHint,
    completeSingle: false
  });
};

function completeAfter(cm, pred) {
  if (!pred || pred()) setTimeout(function() {
    if (!cm.state.completionActive) {
      cm.showHint({
        hint: CodeMirror.hint.rulesHint,
        completeSingle: false
      });
    }
  }, 100);
  return CodeMirror.Pass;
}

CHARS.forEach(function(ch) {
  extraKeys[ch] = completeAfter;
});

function getFocusRuleName(editor) {
	var name;
	var activeHint = $('li.CodeMirror-hint-active');
	if (activeHint.is(':visible')) {
    name = activeHint.text();
    var index = name.indexOf(':');
    if (index !== -1) {
      name = name.substring(0, index);
    }
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

exports.getExtraKeys = function() {
  return extraKeys;
};

exports.getHelpUrl = function(editor) {
  return protocols.getHelpUrl(getFocusRuleName(editor));
};
