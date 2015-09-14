require('../css/textarea.css');
var React = require('react');
var util = require('./util');
var dataCenter = require('./data-center');
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
	preventBlur: function(e) {
		e.target.nodeName != 'INPUT' && e.preventDefault();
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
	showAddToValues: function() {
		var self = this;
		self.state.showAddToValues = true;
		self.forceUpdate(function() {
			self.refs.valuesNameInput.getDOMNode().focus();
		});
	},
	addToValues: function(e) {
		if (e.keyCode != 13 && e.type != 'click') {
			return;
		}
		var modal = dataCenter.valuesModal;
		if (!modal) {
			return;
		}
		var target = this.refs.valuesNameInput.getDOMNode();
		var name = target.value.trim();
		if (!name) {
			alert('Value name can not be empty.');
			return;
		}
		
		if (/\s/.test(name)) {
			alert('Name can not have spaces.');
			return;
		}
		
		if (modal.exists(name)) {
			alert('Value name \'' + name + '\' already exists.');
			return;
		}
		
		var value = (this.props.value || '').replace(/\r\n|\r/g, '\n');
		dataCenter.values.add({name: name, value: value}, function(data) {
			if (data && data.ec === 0) {
				modal.add(name, value);
				target.value = '';
				target.blur();
			} else {
				util.showSystemError();
			}
		});
	},
	hideAddValuesInput: function() {
		this.state.showAddToValues = false;
		this.forceUpdate();
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
		var showAddToValuesBtn = /[^\s]/.test(value);
		if (exceed > 512) {
			showAddToValuesBtn = false;
			value = value.substring(0, MAX_LENGTH) + '...\r\n\r\n(' + exceed + ' characters left, you can click on the Edit button in the upper right corner to view all)\r\n';
		}
		
		this.state.value = value;
		var displayClass = value ? '' : ' hide';
		return (
				<div className={'fill orient-vertical-box w-textarea' + (this.props.hide ? ' hide' : '')}>
					<div className="w-textarea-bar">
						{showAddToValuesBtn ? <a className={'w-add' + displayClass} onClick={this.showAddToValues} href="javascript:;">AddToValues</a> : ''}	
						<a className={'w-edit' + displayClass} onClick={this.edit} href="javascript:;">Edit</a>
						<div onMouseDown={this.preventBlur} style={{display: this.state.showAddToValues ? 'block' : 'none'}} className="shadow w-textarea-input"><input ref="valuesNameInput" onKeyDown={this.addToValues} onBlur={this.hideAddValuesInput} type="text" maxLength="64" placeholder="name" /><button type="button" onClick={this.addToValues} className="btn btn-primary">OK</button></div>
					</div>
					<textarea ref="textarea" onKeyDown={util.preventDefault} readOnly="readonly" className={this.props.className || ''}></textarea>
				</div>
		);
	}
});

module.exports = Textarea;