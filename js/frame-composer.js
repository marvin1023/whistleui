var React = require('react');
var ReactDOM = require('react-dom');
var dataCenter = require('./data-center');

var MAX_FILE_SIZE = 1024 * 1024 * 16;

var FrameComposer = React.createClass({
  getInitialState: function() {
    return {};
  },
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
    var form = new FormData();
    form.append('data', files[0]);
    form.append('cId', this.props.cId);
    this.uploadForm(form);
  },
  selectFile: function() {
    this.dataField.click();
  },
  onFormChange: function() {
    this.uploadForm(new FormData(this.dataForm));
	  this.dataField.value = '';
  },
  uploadForm: function(form) {
    if (form.get('data').size > MAX_FILE_SIZE) {
      return alert('The file size can not exceed 16m.');
    }
    dataCenter.socket.upload(form);
  },
  onSend: function(e) {
    var value = this.state.data;
    if (!value) {
      return;
    }
    var self = this;
    dataCenter.socket.send({
      cId: this.props.cId,
      type: e.target.nodeName === 'A' ? 'bin' : 'text/plain',
      data: value
    }, function(data) {
      self.setState({ data: '' });
    });
  },
  onTextareaChange: function(e) {
    this.setState({
      data: e.target.value
    });
  },
  preventDefault: function(e) {
    e.preventDefault();
  },
  render: function() {
    var state = this.state;
    var data = state.data;
    var noData = !data;
    var cId = this.props.cId;

    return (
      <div onDrop={this.onDrop} className={'fill orient-vertical-box w-frames-composer' + (this.props.hide ? ' hide' : '')}>
        <div className="w-frames-composer-action">
          <a href="javascript:;" onClick={this.selectFile}>Click here</a> or drag a file to here to send to the server
          <div className="btn-group">
            <button disabled={noData} onMouseDown={this.preventDefault} onClick={this.onSend} type="button" className="btn btn-primary btn-sm">Send</button>
            <button disabled={noData} type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="caret"></span>
            </button>
            <ul className="dropdown-menu">
              <li><a onClick={this.onSend} href="javascript:;">Send to server with binary</a></li>
            </ul>
          </div>
        </div>
        <textarea value={data} onChange={this.onTextareaChange} ref="textarea" placeholder={'Input the text to be sent to the server, and press Ctrl [Command] + Enter, or click the send button'} className="fill"></textarea>
        <form ref="uploadDataForm" enctype="multipart/form-data" style={{display: 'none'}}> 
          <input name="cId" value={cId} type="hidden" /> 
          <input ref="uploadData" onChange={this.onFormChange} type="file" name="data" />
        </form>
      </div>
    );
  }
});

module.exports = FrameComposer;