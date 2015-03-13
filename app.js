var EventEmitter = require('events').EventEmitter;
var events = new EventEmitter();
events.uiport = 9528;
require('./lib')(events);