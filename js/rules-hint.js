require('codemirror/addon/hint/show-hint.css');
require('codemirror/addon/hint/show-hint.js');
var CodeMirror = require('codemirror');

var WORD = /[^\s]+/;
CodeMirror.registerHelper('hint', 'rulesHint', function(editor, options) {
  var cur = editor.getCursor();
  var curLine = editor.getLine(cur.line);
  var end = cur.ch, start = end;
  while (start && WORD.test(curLine.charAt(start - 1))) --start;
  var curWord = start != end && curLine.slice(start, end);

  var list = ['1111','212222','33121321'].filter(function(i) {
    return !curWord || i.indexOf(curWord) !== -1;
  });
  return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
});

CodeMirror.commands.autocomplete = function(cm) {
  cm.showHint({hint: CodeMirror.hint.rulesHint});
};
