var CodeMirror = require('codemirror');
/* eslint-disable max-len */
var KEYWORD_RE = /^@[^\s]*$/;

CodeMirror.defineMode('conf', function() {
  var index = 0;
  return {
    token: function(stream) {
      var sol = stream.sol();
      if (sol) {
        index = 0;
      }
      if (stream.eatSpace()) {
        return;
      }
      var str = stream.next();
      if (str === '#') {
        stream.eatWhile(function() {
          return true;
        });
        return 'comment';
      }
      ++index;
      if (index === 1) {
        stream.eatWhile(function(ch) {
          if (ch === '#' || /\s/.test(ch)) {
            return false;
          }
          str += ch;
          return true;
        });
        return KEYWORD_RE.test(str) ? 'special' : 'keyword';
      }
      return 'string';
    }
  };
});
