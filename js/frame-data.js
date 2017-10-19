var React = require('react');
var BtnGroup = require('./btn-group');
var JSONViewer = require('./json-viewer');
var Textarea = require('./textarea');
var util = require('./util');

var BTNS = [{name: 'TextView'}, {name: 'JSONView'}, {name: 'HexView'}];

var FrameClient = React.createClass({
  getInitialState: function() {
    var state = {};
    BTNS.forEach(function(btn) {
      state['inited' + btn.name] = false;
    });
    return state;
  },
  onClickBtn: function(btn) {
		this.selectBtn(btn);
		this.setState({});
	},
  selectBtn: function(btn) {
		btn.active = true;
		this.state.btn = btn;
		this.state['inited' + btn.name] = true;
	},
  render: function() {
    var state = this.state;
    var btn = state.btn;
		if (!btn) {
			btn = BTNS[0];
			this.selectBtn(btn);
    }
    var data = this.props.data;
    var text, json, bin;
    if (data) {
      text = data.text || '';
      bin = data.bin;
      if (data.json) {
				json = data.json;
			} else if (json = util.parseJSON(text)) {
				json = data.json = {
					json: json,
					str: JSON.stringify(json, null, '    ')
				};
      }
      if (!bin) {
        bin = [];
        for (var i = 0, len = text.length; i< len; i++) {
          var ch = text[i];
          var code = encodeURIComponent(ch);
          if (code === ch) {
            bin.push('%' + ch.charCodeAt().toString(16));
          } else {
            bin.push(code);
          }
          data.bin = bin.join('').substring(1).replace(/%/g, ' ');
        }
      }
    }
    return (
      <div className={'fill orient-vertical-box w-frames-data' + (this.props.hide ? ' hide' : '')}>
        <BtnGroup onClick={this.onClickBtn} type="s" btns={BTNS} />
        <Textarea value={text} hide={btn.name !== 'TextView'} />
        <JSONViewer data={json} hide={btn.name !== 'JSONView'} />
        <Textarea value={bin} hide={btn.name !== 'HexView'} />
      </div>
    );
  }
});

module.exports = FrameClient;
