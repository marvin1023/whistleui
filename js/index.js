var React = require('react');
var Network = require('./network');
var Rules = require('./rules');
var Values = require('./values');
var filename = location.href.replace(/[#?].*$/, '').replace(/.*\//, '');

var isRules = !filename || filename.indexOf('rules') != -1;
var isValues = !isRules && filename.indexOf('values') != -1;

React.render(isRules ? <Rules /> : (isValues ? <Values /> : <Network />), document.body);
