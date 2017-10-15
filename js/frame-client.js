var React = require('react');

var FrameClient = React.createClass({
  render: function() {
    return (
      <div className={'fill orient-vertical-box w-frames-composer' + (this.props.hide ? ' hide' : '')}>
        <div className="w-frames-composer-action">
          <a href="javascript:;">Click here</a> or drag a file to here to send to the client
          <button type="button" className="btn btn-primary btn-sm">Send</button>
        </div>
        <textarea placeholder="请输入要发送到客户端的文本，按住 Ctrl[Command] + Enter，或点击右上角的发送按钮发送" className="fill"></textarea>
      </div>
    );
  }
});

module.exports = FrameClient;
