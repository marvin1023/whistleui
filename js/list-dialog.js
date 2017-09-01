require('./base-css.js');
require('../css/list-dialog.css');
var React = require('react');
var Dialog = require('./dialog');

var ListDialog = React.createClass({
  getInitialState: function() {
    return {
      checkedItems: {}
    };
  },
  onChange: function(e) {
    var target = e.target;
    var name = target.parentNode.title;
    var checkedItems = this.state.checkedItems;
    if (target.checked) {
      checkedItems[name] = 1;
    } else {
      delete checkedItems[name];
    }
    this.setState({});
  },
  onConfirm: function(e) {
    if (e.target.disabled) {
      return;
    }
    this.refs.dialog.hide();
    window.open(this.props.url + encodeURIComponent(JSON.stringify(this.state.checkedItems)));
  },
  show: function() {
    this.refs.dialog.show();
  },
  render: function() {
    var self = this;
    var list = self.props.list || [];
    var checkedItems = self.state.checkedItems;

    return (
      <Dialog ref="dialog" wclassName=" w-list-dialog">
        <div className="modal-body">
          <button type="button" className="close" data-dismiss="modal">
            <span aria-hidden="true">&times;</span>
          </button>
          {list.map(function(name) {
            return (
              <label title={name}>
                <input
                  onChange={self.onChange}
                  type="checkbox"
                  checked={!!checkedItems[name]}
                   />
                {name}
              </label>
            );
          })}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="button" className="btn btn-primary"
            disabled={!Object.keys(checkedItems).length}
            onClick={this.onConfirm}>Confirm</button>
        </div>
      </Dialog>
    );
  }
});

module.exports = ListDialog;
