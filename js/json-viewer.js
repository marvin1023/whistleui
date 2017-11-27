require('../css/json-viewer.css');
var React = require('react');
var ReactDOM = require('react-dom');
var JSONTree = require('react-json-tree')['default'];
var util = require('./util');

var JsonViewer = React.createClass({
	getInitialState: function() {
		return { lastData: {} };
	},
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	preventBlur: function(e) {
		e.target.nodeName != 'INPUT' && e.preventDefault();
	},
	showNameInput: function(e) {
		var self = this;
		self.setState({ showNameInput: true }, function() {
			ReactDOM.findDOMNode(self.refs.nameInput).focus();
		});
	},
	hideNameInput: function() {
		this.state.showNameInput = false;
		this.forceUpdate();
	},
	download: function() {
		var target = ReactDOM.findDOMNode(this.refs.nameInput);
		var name = target.value.trim();
		target.value = '';
		var data = this.props.data || {};
		ReactDOM.findDOMNode(this.refs.filename).value = name;
		ReactDOM.findDOMNode(this.refs.content).value = data.str || '';
		ReactDOM.findDOMNode(this.refs.downloadForm).submit();
	},
	submit: function(e) {
		if (e.keyCode === 13) {
			this.download();
		}
	},
  toggle: function() {
		this.setState({ viewSource: !this.state.viewSource });
	},
	render: function() {
    var state = this.state;
		var viewSource = state.viewSource
    var props = this.props;
    var data = props.data;
		var noData = !data;
    if (!data) {
      data = state.lastData;
    } else {
			state.lastData = data;
		}
		return (
				<div className={'fill orient-vertical-box w-properties-wrap w-json-viewer' + ((noData || props.hide) ? ' hide' : '')}>
					<div className="w-textarea-bar">
						<a className="w-download" onDoubleClick={this.download}
							onClick={this.showNameInput} href="javascript:;" draggable="false">Download</a>
						<a onClick={this.toggle} className="w-properties-btn">{ viewSource ? 'ViewParsed' : 'ViewSource' }</a>
						<div onMouseDown={this.preventBlur}
							style={{display: this.state.showNameInput ? 'block' : 'none'}}
							className="shadow w-textarea-input"><input ref="nameInput"
							onKeyDown={this.submit}
							onBlur={this.hideNameInput}
							type="text"
							maxLength="64"
							placeholder="Input the filename"
						/><button type="button" onClick={this.download} className="btn btn-primary">OK</button></div>
						<form ref="downloadForm" action="cgi-bin/download" style={{display: 'none'}}
							method="post" target="_blank">
							<input ref="filename" name="filename" type="hidden" />
							<input ref="content" name="content" type="hidden" />
						</form>
					</div>
					<pre className={'fill w-json-viewer-str' + (viewSource ? '' : ' hide')}>{data.str}</pre>
          <div className={'fill w-json-viewer-tree' + (viewSource ? ' hide' : '')}>
            <JSONTree data={data.json} />
					</div>
				</div>
		);
	}
});

module.exports = JsonViewer;