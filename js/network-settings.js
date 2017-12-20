require('./base-css.js');
require('../css/network-settings.css');
var $ = require('jquery');
var React = require('react');
var Dialog = require('./dialog');
var columns = require('./columns');
var dataCenter = require('./data-center');
var events = require('./events');

var Settings = React.createClass({
  getInitialState: function() {
    var dragger = columns.getDragger();
    dragger.onDrop = dragger.onDrop.bind(this);
    return $.extend(this.getNetworkSettings(), { dragger: dragger });
  },
  getNetworkSettings: function() {
    return $.extend(dataCenter.getFilterText(), {
      disabledColumns: columns.isDisabled(),
      columns: columns.getAllColumns()
    });
  },
  onColumnsResort: function() {
    events.trigger('onColumnsChanged');
    this.setState({ columns: columns.getAllColumns() });
  },
  resetColumns: function() {
    columns.reset();
    this.onColumnsResort();
  },
  onNetworkSettingsChange: function(e) {
		var target = e.target;
		var name = target.getAttribute('data-name');
		if (!name) {
			return;
    }
    if (name === 'viewOwn') {
      dataCenter.setOnlyViewOwnData(target.checked);
      this.setState({});
      this.props.onFilterTextChanged(true);
      return;
    }
    var settings = this.state;
    var filterTextChanged;
    var filterStateChanged;
    var columnsChanged;
		switch(name) {
			case 'filter':
        settings.disabledFilterText = !target.checked;
        filterStateChanged = filterTextChanged = true;
				break;
      case 'filterText':
        var value = target.value.trim();
        filterTextChanged = true;
        filterStateChanged = (!value && settings.filterText) || (value && !settings.filterText);
				settings.filterText = target.value;
        break;
      case 'networkColumns':
        settings.disabledColumns = !target.checked;
        columns.disable(settings.disabledColumns);
        columnsChanged = true;
        break;
      default:
        columns.setselected(name, target.checked);
        columnsChanged = true;
    }
    if (filterTextChanged) {
      dataCenter.setFilterText(settings);
      if (filterStateChanged && typeof this.props.onFilterTextChanged === 'function') {
        this.props.onFilterTextChanged();
      }
    } else if (columnsChanged) {
      events.trigger('onColumnsChanged');
    }
    this.setState(settings);
  },
  onFilterKeyDown: function(e) {
		if ((e.ctrlKey || e.metaKey)) {
			if (e.keyCode == 68) {
        var settings = this.state;
        if (settings.filterText) {
          settings.filterText = '';
          dataCenter.setFilterText(settings);
          if (typeof this.props.onFilterTextChanged === 'function') {
            this.props.onFilterTextChanged();
          }
        }
        this.setState({ filterText: '' });
				e.preventDefault();
				e.stopPropagation();
			} else if (e.keyCode == 88) {
				e.stopPropagation();
			}
		}
		
	},
  showDialog: function() {
    var settings = this.getNetworkSettings();
    this.setState(settings);
		this.refs.networkSettingsDialog.show();
	},
	hideDialog: function() {
		this.refs.networkSettingsDialog.hide();
	},
  render: function() {
    var state = this.state;
    var disabledColumns = state.disabledColumns;
    var columnList = state.columns;

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
            <textarea disabled={state.disabledFilterText}
              onKeyDown={this.onFilterKeyDown}
              value={state.filterText} data-name="filterText"
              placeholder="type filter text" maxLength={300} />
          </fieldset>
          <label className="w-network-settings-own">
            <input checked={dataCenter.isOnlyViewOwnData()} data-name="viewOwn" type="checkbox" />Only view own request data (IP: {dataCenter.clientIp})
          </label>
          <fieldset className="network-settings-columns">
            <legend>
              <label>
                <input checked={!disabledColumns} data-name="networkColumns" type="checkbox" />Network Columns
              </label>
              <label onClick={this.resetColumns} className="btn btn-default">Reset</label>
            </legend>
            {columnList.map(function(col) {
              return (
                <label
                  {...state.dragger}
                  data-name={col.name}
                  draggable={!disabledColumns}
                  >
                  <input disabled={disabledColumns} checked={!!col.selected} data-name={col.name} type="checkbox" />{col.title}
                </label>
              );
            })}
          </fieldset>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </Dialog>
    );
  }
});

module.exports = Settings;
