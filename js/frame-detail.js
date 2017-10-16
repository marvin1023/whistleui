var React = require('react');
var BtnGroup = require('./btn-group');
var FrameData = require('./frame-data');
var FrameComposer = require('./frame-composer');

var BTNS = [{name: 'Detail'}, {name: 'Client'}, {name: 'Server'}];

var FrameDetail = React.createClass({
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
      <div className={'fill orient-vertical-box w-frames-detail' + (this.props.hide ? ' hide' : '')}>
        <BtnGroup onClick={this.onClickBtn} btns={BTNS} />
        {state.initedDetail ? <FrameData hide={btn.name !== 'Detail'} /> : undefined}
        {state.initedClient ? <FrameComposer name="client" hide={btn.name !== 'Client'} /> : undefined}
        {state.initedServer ? <FrameComposer hide={btn.name !== 'Server'} /> : undefined}
      </div>
    );
  }
});

module.exports = FrameDetail;
