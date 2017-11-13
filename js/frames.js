require('../css/frames.css');
var React = require('react');
var util = require('./util');
var Divider = require('./divider');
var FrameList = require('./frame-list');
var FrameData = require('./frame-data');
var FrameModal = require('./frame-modal');
var dataCenter = require('./data-center');

var ImageView = React.createClass({
  getInitialState: function() {
    return {
      modal: new FrameModal()
    };
  },
  componentDidMount: function() {
    var self = this;
    dataCenter.on('framesUpdate', function() {
      self.setState({});
    });
  },
  shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
  },
  onClickFrame: function(frame) {
    var modal = this.state.modal;
    modal.setActive(frame);
    this.setState({});
  },
  render: function() {
    var props = this.props;
    var modal = this.state.modal;
    var frames = props.frames;
    modal.reset(frames);
    return (
      <div className={'fill orient-vertical-box w-frames' + ((frames && !props.hide) ? '' : ' hide')}>
        <Divider vertical="true" rightWidth="250">
          <FrameList modal={modal} onClickFrame={this.onClickFrame} />
          <FrameData cId={props.cId} data={modal.getActive()} />
        </Divider>
      </div>
    );
  }
});

module.exports = ImageView;
