require('./base-css.js');
require('../css/network-settings.css');
var React = require('react');
var Dialog = require('./dialog');
var dataCenter = require('./data-center');

var Settings = React.createClass({
  getInitialState: function() {
    return dataCenter.getNetworkSettings() || {};
  },
  onNetworkSettingsChange: function(e) {
		var target = e.target;
		var name = target.getAttribute('data-name');
		if (!name) {
			return;
		}
    var settings = this.state;
    var filterTextChanged;
    var columnsChanged;
		switch(name) {
			case 'filter':
        settings.disabledFilterText = !target.checked;
        filterTextChanged = true;
				break;
      case 'filterText':
        var value = target.value.trim();
        filterTextChanged = (!value && settings.filterText) || (value && !settings.filterText);
				settings.filterText = target.value;
        break;
      case 'networkColumns':
        settings.disabledColumns = !target.checked;
        columnsChanged = true;
        break;
      default:
        columnsChanged = true;
    }
    dataCenter.setNetworkSettings(settings);
    if (filterTextChanged) {
      if (typeof this.props.onFilterTextChanged === 'function') {
        this.props.onFilterTextChanged();
      }
    } else if (columnsChanged && typeof this.props.onColumnsChanged === 'function') {
      this.props.onColumnsChanged();
    }
    this.setState(settings);
	},
  showDialog: function() {
    var settings = dataCenter.getNetworkSettings() || {};
    this.setState(settings);
		this.refs.networkSettingsDialog.show();
	},
	hideDialog: function() {
		this.refs.networkSettingsDialog.hide();
	},
  render: function() {
    var state = this.state;
    var disabledColumns = state.disabledColumns;

    return (
      <Dialog ref="networkSettingsDialog" wstyle="w-network-settings-dialog">
        <div onChange={this.onNetworkSettingsChange} className="modal-body">
          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <fieldset className="network-settings-filter">
            <legend>
              <label>
                <input checked={!state.disabledFilterText} data-name="filter" type="checkbox" />Filter
              </label>
              <a className="w-help-menu"
                title="Click here to learn how to use the filter"
                href="https://avwo.github.io/whistle/webui/settings.html" target="_blank">
                <span className="glyphicon glyphicon-question-sign"></span>
              </a>
            </legend>
            <textarea disabled={state.disabledFilterText} value={state.filterText} data-name="filterText" placeholder="type filter text" maxLength={300} />
          </fieldset>
          <fieldset className="network-settings-columns">
            <legend>
              <label>
                <input checked={!disabledColumns} data-name="networkColumns" onChange={this.change} type="checkbox" />Network Columns
              </label>
            </legend>
            <label><input disabled={disabledColumns} data-name="result" type="checkbox" />Result</label>
            <label><input disabled={disabledColumns} data-name="method" type="checkbox" />Method</label>
            <label><input disabled={disabledColumns} data-name="protocol" type="checkbox" />Protocol</label>
            <label><input disabled={disabledColumns} data-name="clientIP" type="checkbox" />ClientIP</label>
            <label><input disabled={disabledColumns} data-name="serverIP" type="checkbox" />ServerIP</label>
            <label><input disabled={disabledColumns} data-name="host" type="checkbox" />Host</label>
            <label><input disabled={disabledColumns} data-name="url" type="checkbox" />URL</label>
            <label><input disabled={disabledColumns} data-name="body" type="checkbox" />Body</label>
            <label><input disabled={disabledColumns} data-name="sent" type="checkbox" />Sent</label>
            <label><input disabled={disabledColumns} data-name="DNS" type="checkbox" />DNS</label>
            <label><input disabled={disabledColumns} data-name="download" type="checkbox" />Download</label>
            <label><input disabled={disabledColumns} data-name="time" type="checkbox" />Time</label>
          </fieldset>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
        </div>
      </Dialog>
    );
  }
});

module.exports = Settings;
