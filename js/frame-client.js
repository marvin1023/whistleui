var React = require('react');
var ReactDOM = require('react-dom');

var FrameClient = React.createClass({
  componentDidMount: function() {
    this.wsDataField = ReactDOM.findDOMNode(this.refs.uploadWSData);
    this.wsDataForm = ReactDOM.findDOMNode(this.refs.uploadWSDataForm);
  },
  selectFile: function() {
    this.wsDataField.click();
  },
  onFormChange: function() {
    this.uploadForm(new FormData(this.wsDataForm));
	  this.wsDataField.value = '';
  },
  uploadForm: function(form) {

  },
  render: function() {
    return (
      <div className={'fill orient-vertical-box w-frames-composer' + (this.props.hide ? ' hide' : '')}>
        <div className="w-frames-composer-action">
          <a href="javascript:;" onClick={this.selectFile}>Click here</a> or drag a file to here to send to the client
          <button type="button" className="btn btn-primary btn-sm">Send</button>
        </div>
        <textarea placeholder="请输入要发送到客户端的文本，按住 Ctrl[Command] + Enter，或点击右上角的发送按钮发送" className="fill"></textarea>
        <form ref="uploadWSDataForm" enctype="multipart/form-data" style={{display: 'none'}}>  
          <input ref="uploadWSData" onChange={this.onFormChange} type="file" name="uploadWSData" />
        </form>
      </div>
    );
  }
});

module.exports = FrameClient;
