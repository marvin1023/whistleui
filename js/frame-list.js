var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var FilterInput = require('./filter-input');

var FrameList = React.createClass({
  onFilterChange: function(keyword) {
    keyword = keyword.trim();
    if (keyword) {
      keyword = keyword.split(/\s+/g);
    }
    this.setState({ keyword: keyword });
  },
  componentWillUpdate: function() {
    var con = this.container;
    var ctn =this.content;
    var modal = this.props.modal;
    var scrollToBottom = con.scrollTop + con.offsetHeight + 5 > ctn.offsetHeight;
    this.scrollToBottom = scrollToBottom;
    if (scrollToBottom) {
      modal.update();
    }
  },
  componentDidUpdate: function() {
    if (this.scrollToBottom) {
      this.container.scrollTop = 100000000;
    }
  },
  filter: function(item) {

  },
  autoRefresh: function() {

  },
  clear: function() {

  },
  setContainer: function(container) {
    this.container = ReactDOM.findDOMNode(container);
  },
  setContent: function(content) {
    this.content = ReactDOM.findDOMNode(content);
  },
  render: function() {
    var self = this;
    var props = self.props;
    var onClickFrame = props.onClickFrame;
    var modal = self.props.modal;
    return (<div className="fill orient-vertical-box w-frames-list">
      <div className="w-frames-action">
        <FilterInput onChange={self.onFilterChange} />
        <a onClick={self.autoRefresh} className="w-remove-menu"
          href="javascript:;" draggable="false">
          <span className="glyphicon glyphicon-play"></span>AutoRefresh
        </a>
        <a onClick={self.clear} className="w-remove-menu"
          href="javascript:;" draggable="false">
          <span className="glyphicon glyphicon-remove"></span>Clear
        </a>
      </div>
      <div ref={self.setContainer} className="fill w-frames-list">
        <ul ref={self.setContent}>
          {modal.getList().map(function(item) {
            if (!item.data) {
              item.data = item.text || item.bin || '';
              if (item.data.length > 3072) {
                item.data = item.data.substring(0, 3072) + '...';
              }
            }
            return (
              <li onClick={function() {
                onClickFrame && onClickFrame(item);
              }} className={item.isClient ? 'w-frames-send' : undefined}>
                <span className={'glyphicon glyphicon-' + (item.isClient ? 'send' : 'flash')}></span>
                {item.data}
              </li>
            );
          })}
        </ul>
      </div>
    </div>);
  }
});

module.exports = FrameList;
