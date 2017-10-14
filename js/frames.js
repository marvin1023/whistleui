require('../css/frames.css');
var React = require('react');
var util = require('./util');
var Divider = require('./divider');
var FrameList = require('./frame-list');
var FrameDetail = require('./frame-detail');

var ImageView = React.createClass({
  shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
  render: function() {
    var props = this.props;
    var frames = props.frames;
    return (
      <div className={'fill orient-vertical-box w-frames' + (props.hide ? ' hide' : '')}>
        <Divider vertical="true" rightWidth="180">
          <FrameList />
          <FrameDetail />
        </Divider>
      </div>
    );
  }
});

module.exports = ImageView;
