var React = require('react');
var FilterInput = require('./filter-input');

var FrameList = React.createClass({
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
    var list = this.props.list || [];
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
        {list.map(function(item) {
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
