var React = require('react');
var ReactDOM = require('react-dom');

var FrameClient = React.createClass({
  componentDidMount: function() {
    this.wsDataField = ReactDOM.findDOMNode(this.refs.uploadWSData);
    this.wsDataForm = ReactDOM.findDOMNode(this.refs.uploadWSDataForm);
  },
  onDrop: function(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files;
    if (!files || !files.length) {
      return;
    }
    alert(files[0])
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
      <div onDrop={this.onDrop} className={'fill orient-vertical-box w-frames-composer' + (this.props.hide ? ' hide' : '')}>
        <div className="w-frames-composer-action">
          <a href="javascript:;" onClick={this.selectFile}>Click here</a> or drag a file to here to send to the client
          <button type="button" className="btn btn-primary btn-sm">Send</button>
        </div>
        <textarea placeholder="Input the text to be sent to the client, press Ctrl [Command] + Enter, or click the send button in the upper right corner" className="fill"></textarea>
        <form ref="uploadWSDataForm" enctype="multipart/form-data" style={{display: 'none'}}>  
          <input ref="uploadWSData" onChange={this.onFormChange} type="file" name="uploadWSData" />
        </form>
      </div>
    );
  }
});

module.exports = FrameClient;
