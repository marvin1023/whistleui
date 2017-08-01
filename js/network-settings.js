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
		switch(name) {
			case 'filter':
        settings.disabledFilterText = !target.checked;
				break;
			case 'filterText':
				settings.filterText = target.value;
				break;
		}
    dataCenter.setNetworkSettings(settings);
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

    return (
      <Dialog ref="networkSettingsDialog" wstyle="w-network-settings-dialog">
        <div onChange={this.onNetworkSettingsChange} className="modal-body">
          <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <fieldset className="network-settings-filter">
            <legend>
              <label>
                <input checked={!state.disabledFilterText} data-name="filter" type="checkbox" />Filter
              </label>
            </legend>
            <textarea disabled={state.disabledFilterText} value={state.filterText} data-name="filterText" placeholder="type filter text" maxLength={300} />
          </fieldset>
          <fieldset className="network-settings-columns">
            <legend>
              <label>
                <input data-name="networkColumns" onChange={this.change} type="checkbox" />Network Columns
              </label>
            </legend>
            <label><input data-name="result" type="checkbox" />Result</label>
            <label><input data-name="method" type="checkbox" />Method</label>
            <label><input data-name="protocol" type="checkbox" />Protocol</label>
            <label><input data-name="clientIP" type="checkbox" />ClientIP</label>
            <label><input data-name="serverIP" type="checkbox" />ServerIP</label>
            <label><input data-name="host" type="checkbox" />Host</label>
            <label><input data-name="url" type="checkbox" />URL</label>
            <label><input data-name="body" type="checkbox" />Body</label>
            <label><input data-name="sent" type="checkbox" />Sent</label>
            <label><input data-name="DNS" type="checkbox" />DNS</label>
            <label><input data-name="download" type="checkbox" />Download</label>
            <label><input data-name="time" type="checkbox" />Time</label>
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
