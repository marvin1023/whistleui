var React = require('react');
var BtnGroup = require('./btn-group');
var JSONViewer = require('./json-viewer');
var Textarea = require('./textarea');

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
    return (
      <div className={'fill orient-vertical-box w-frames-data' + (this.prop.hide ? ' hide' : '')}>
        <BtnGroup onClick={this.onClickBtn} type="s" btns={BTNS} />
        <Textarea hide={btn.name !== 'TextView'} />
        <JSONViewer hide={btn.name !== 'JSONView'} />
        <Textarea hide={btn.name !== 'HexView'} />
      </div>
    );
  }
});

module.exports = FrameClient;
