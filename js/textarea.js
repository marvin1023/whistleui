require('../css/textarea.css');
var React = require('react');
var util = require('./util');
var MAX_LENGTH =1024 * 100;

var Textarea = React.createClass({
	getInitialState: function() {
		return {};
	},
	componentDidMount: function() {
		this.updateValue();
	},
	componentDidUpdate: function() {
		this.updateValue();
	},
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || (!hide && this.props.value != nextProps.value);
	},
	edit: function() {
		var self = this;
		var win = window.open('/editor.html');
		win.getValue = function() {
			return self.props.value;
		};
		if (win.setValue) {
			win.setValue(self.props.value);
		}
	},
	updateValue: function() {
		var self = this;
		clearTimeout(self._timeout);
		var value = self.state.value;
		self._timeout = setTimeout(function() {
			self.refs.textarea.getDOMNode().value = value;
		}, Math.ceil((value && value.length || 0) / 1024));
	},
	render: function() {
		var value = this.props.value || '';
		var exceed = value.length - MAX_LENGTH;
		if (exceed > 10240) {
			value = value.substring(0, MAX_LENGTH) + '...(' + exceed + ' characters left)';
		}
		this.state.value = value;
		return (
				<div className={'fill orient-vertical-box w-textarea' + (this.props.hide ? ' hide' : '')}>
					<a className={'w-edit' + (value ? '' : ' hide')} onClick={this.edit} href="javascript:;">Edit</a>
					<textarea ref="textarea" onKeyDown={util.preventDefault} readOnly="readonly" className={this.props.className || ''}></textarea>
				</div>
		);
	}
});

module.exports = Textarea;