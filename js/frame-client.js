var React = require('react');
var ReactDOM = require('react-dom');

var FrameClient = React.createClass({
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
  uploadForm: function(data) {
    data.append('target', 'client');
    console.log(data);
  },
  render: function() {
    return (
      <div onDrop={this.onDrop} className={'fill orient-vertical-box w-frames-composer' + (this.props.hide ? ' hide' : '')}>
        <div className="w-frames-composer-action">
          <a href="javascript:;" onClick={this.selectFile}>Click here</a> or drag a file to here to send to the client
          <button type="button" className="btn btn-primary btn-sm">Send</button>
        </div>
        <textarea placeholder="Input the text to be sent to the client, press Ctrl [Command] + Enter, or click the send button in the upper right corner" className="fill"></textarea>
        <form ref="uploadDataForm" enctype="multipart/form-data" style={{display: 'none'}}>  
          <input ref="uploadData" onChange={this.onFormChange} type="file" name="data" />
        </form>
      </div>
    );
  }
});

module.exports = FrameClient;
