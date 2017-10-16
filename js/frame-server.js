var React = require('react');
var ReactDOM = require('react-dom');
var dataCenter = require('./data-center');

var FrameServer = React.createClass({
  componentDidMount: function() {
    this.dataField = ReactDOM.findDOMNode(this.refs.uploadData);
    this.dataForm = ReactDOM.findDOMNode(this.refs.uploadDataForm);
  },
  onDrop: function(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files;
    if (!files || !files.length) {
      return;
    }
    var data = new FormData();
    data.append('data', files[0]);
    this.uploadForm(data);
  },
  selectFile: function() {
    this.dataField.click();
  },
  onFormChange: function() {
    this.uploadForm(new FormData(this.dataForm));
	  this.dataField.value = '';
  },
  uploadForm: function(form) {
    data.append('target', 'server');
    ataCenter.socket.upload(data);
  },
  render: function() {
    return (
      <div onDrop={this.onDrop} className={'fill orient-vertical-box w-frames-composer' + (this.props.hide ? ' hide' : '')}>
        <div className="w-frames-composer-action">
          <a href="javascript:;" onClick={this.selectFile}>Click here</a> or drag a file to here to send to the server
          <button type="button" className="btn btn-primary btn-sm">Send</button>
        </div>
        <textarea placeholder="Input the text to be sent to the server, and press Ctrl [Command] + Enter, or click the send button in the upper right corner" className="fill"></textarea>
        <form ref="uploadDataForm" enctype="multipart/form-data" style={{display: 'none'}}>  
          <input ref="uploadData" onChange={this.onFormChange} type="file" name="data" />
        </form>
      </div>
    );
  }
});

module.exports = FrameServer;