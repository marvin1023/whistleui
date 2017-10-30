var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
var FilterInput = require('./filter-input');

var FrameList = React.createClass({
  onFilterChange: function(keyword) {
    this.props.modal.search(keyword);
    this.setState({ keyword: keyword.trim() });
  },
  componentWillUpdate: function() {
    this.atBottom = this.shouldScrollToBottom();
  },
  componentDidUpdate: function() {
    if (this.atBottom) {
      this.autoRefresh();
    }
  },
  stopRefresh: function() {
    this.container.scrollTop = this.container.scrollTop - 10;
  },
  abort: function() {
    if (!confirm('Are you sure abort this connection?')) {
      return;
    }

  },
  autoRefresh: function() {
    this.container.scrollTop = 100000000;
  },
  clear: function() {
    this.props.modal.clear();
    this.setState({});
  },
  shouldScrollToBottom: function() {
    var con = this.container;
    var ctn =this.content;
    var modal = this.props.modal;
    var atBottom = con.scrollTop + con.offsetHeight + 5 > ctn.offsetHeight;
    if (atBottom) {
      modal.update();
    }
    return atBottom;
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
    var keyword = this.state && this.state.keyword;
    return (<div className="fill orient-vertical-box w-frames-list">
      <div className="w-frames-action">
        <FilterInput onChange={self.onFilterChange} />
        <a onClick={self.abort} onDoubleClick={self.stopRefresh} className="w-connect-abort"
          href="javascript:;" draggable="false">
          <span className="glyphicon glyphicon-ban-circle"></span>Abort
        </a>
        <a onClick={self.autoRefresh} onDoubleClick={self.stopRefresh} className="w-remove-menu"
          href="javascript:;" draggable="false">
          <span className="glyphicon glyphicon-play"></span>AutoRefresh
        </a>
        <a onClick={self.clear} className="w-remove-menu"
          href="javascript:;" draggable="false">
          <span className="glyphicon glyphicon-remove"></span>Clear
        </a>
      </div>
      <div
        style={{background: keyword ? '#ffffe0' : undefined}}
        onScroll={self.shouldScrollToBottom} ref={self.setContainer} className="fill w-frames-list">
        <ul ref={self.setContent}>
          {modal.getList().map(function(item) {
            if (!item.data) {
              item.data = item.text || item.bin || '';
              if (item.data.length > 3072) {
                item.data = item.data.substring(0, 3072) + '...';
              }
            }
            if (!item.title) {
              item.title = 'Date: ' + new Date(parseInt(item.frameId, 10)).toLocaleString()
               + '\nFrom: ' + (item.isClient ? 'Client' : 'Server')
               + '\nMessage: ' + item.data;
            }
            return (
              <li
                title={item.title}
                style={{display: item.hide ? 'none' : undefined}}
                onClick={function() {
                  onClickFrame && onClickFrame(item);
                }} className={(item.isClient ? 'w-frames-send' : '') + (item.active ? '  w-frames-selected' : '')}>
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
