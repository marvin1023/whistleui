var React = require('react');
var FilterInput = require('./filter-input');
var FrameModal = require('./frame-modal');

var FrameList = React.createClass({
  getInitialState: function() {
    return {
      modal: new FrameModal()
    };
  },
  onFilterChange: function(keyword) {
    keyword = keyword.trim();
    if (keyword) {
      keyword = keyword.split(/\s+/g);
    }
    this.setState({ keyword: keyword });
  },
  filter: function(item) {

  },
  autoRefresh: function() {

  },
  clear: function() {

  },
  render: function() {
    const modal = this.state.modal;
    modal.reset(this.props.list);
    return (<div className="fill orient-vertical-box w-frames-list">
      <div className="w-frames-action">
        <FilterInput onChange={this.onFilterChange} />
        <a onClick={this.autoRefresh} className="w-remove-menu"
          href="javascript:;" draggable="false">
          <span className="glyphicon glyphicon-play"></span>AutoRefresh
        </a>
        <a onClick={this.clear} className="w-remove-menu"
          href="javascript:;" draggable="false">
          <span className="glyphicon glyphicon-remove"></span>Clear
        </a>
      </div>
      <ul className="fill w-frames-list">
        {modal.getList().map(function(item) {
          return (
            <li className={item.isClient ? 'w-frames-send' : undefined}>
              <span className={'glyphicon glyphicon-' + (item.isClient ? 'send' : 'flash')}></span>
              {item.text}
            </li>
          );
        })}
      </ul>
    </div>);
  }
});

module.exports = FrameList;
