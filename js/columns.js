var dataCenter = require('./data-center');
var settings = dataCenter.getNetworkColumns();

function getDefaultColumns() {

  return [
    {
      title: 'Result',
      name: 'result',
      className: 'result',
      selected: true
    },
    {
      title: 'Method',
      name: 'method',
      className: 'method',
      selected: true
    },
    {
      title: 'Protocol',
      name: 'protocol',
      className: 'protocol',
      selected: true
    },
    {
      title: 'ClientIP',
      name: 'clientIp',
      className: 'hostIp'
    },
    {
      title: 'ServerIP',
      name: 'hostIp',
      className: 'hostIp',
      selected: true
    },
    {
      title: 'Host',
      name: 'hostname',
      className: 'hostname',
      selected: true
    },
    {
      title: 'URL',
      name: 'url',
      className: 'url',
      selected: true
    },
    {
      title: 'Type',
      name: 'type',
      className: 'type',
      selected: true
    },
    {
      title: 'Body',
      name: 'body',
      className: 'hostIp'
    },
    {
      title: 'Sent',
      name: 'sent',
      className: 'time'
    },
    {
      title: 'DNS',
      name: 'dns',
      className: 'time'
    },
    {
      title: 'Download',
      name: 'download',
      className: 'download'
    },
    {
      title: 'Time',
      name: 'time',
      className: 'time',
      selected: true
    }
  ];
}

function filterSelected(item) {
  return item.selected;
}

var columnsMap = {};
var curColumns = getDefaultColumns();
var DEFAULT_COLUMNS = getDefaultColumns();
var DEFAULT_SELECTED_COLUMNS = DEFAULT_COLUMNS.filter(filterSelected);

DEFAULT_COLUMNS.forEach(function(col) {
  columnsMap[col.name] = col;
});

if (Array.isArray(settings.columns)) {
  var flagMap = {};
  var checkColumn = function(col) {
    var name = col && col.name;
    if (!name || flagMap[name] || !columnsMap[name]) {
      return false;
    }
    flagMap[name] = 1;
    return true;
  };
  var columns = settings.columns.filter(checkColumn);
  if (columns.length === curColumns.length) {
    curColumns = columns.map(function(col) {
      var curCol = columnsMap[col.name];
      curCol.selected = !!col.selected;
      return curCol;
    });
  }
}

settings = {
  disabledColumns: !!settings.disabledColumns,
  columns: curColumns,
};

function save() {
  dataCenter.setNetworkColumns(settings);
}

exports.isDisabled = function() {
  return settings.disabledColumns;
}

exports.moveTo = function(name, targetName) {
  if (settings.disabledColumns || name === targetName) {
    return;
  }
  var col = columnsMap[name];
  var target = columnsMap[targetName];
  if (!col || !target) {
    return;
  }
  curColumns.splice(curColumns.indexOf(col), 1);
  curColumns.splice(curColumns.indexOf(target), 0, col);
  save();
}

exports.disable = function(disabled) {
  settings.disabledColumns = disabled !== false;
  save();
};

exports.getAllColumns = function() {
  return curColumns;
};
exports.setselected = function(name, selected) {
  var col = columnsMap[name];
  if (col) {
    col.selected = selected !== false;
    save();
  }
};
exports.getSelectedColumns = function() {
  if (settings.disabledColumns) {
    return DEFAULT_SELECTED_COLUMNS;
  }
  return curColumns.filter(filterSelected);;
};
