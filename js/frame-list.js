var React = require('react');
var FilterInput = require('./filter-input');

var FrameList = React.createClass({
  render: function() {
    return (<div className="fill orient-vertical-box w-frames-list">
      <div className="w-frames-action">
        <FilterInput onChange={this.onFilterChange} />
        <a onClick={this.clear} className="w-remove-menu"
          href="javascript:;" draggable="false">
          <span className="glyphicon glyphicon-play"></span>AutoRefresh
        </a>
        <a onClick={this.clear} className="w-remove-menu"
          href="javascript:;" draggable="false">
          <span className="glyphicon glyphicon-remove"></span>Clear
        </a>
      </div>
      <ul className="fill w-frames-list">
        <li className="w-frames-send">test</li>
        <li>test</li>
        <li className="w-frames-send">test</li>
        <li className="w-frames-send">test</li>
        <li className="w-frames-selected">test</li>
        <li><span className="glyphicon glyphicon-flash"></span>test</li>
        <li>test</li>
        <li className="w-frames-send">test</li>
        <li>test</li>
        <li className="w-frames-send">test</li>
        <li>test</li>
        <li className="w-frames-send">test</li>
        <li>test</li>
        <li className="w-frames-send">test</li>
        <li>test</li>
        <li className="w-frames-send">test</li>
        <li>test</li>
        <li className="w-frames-send">
          <span className="glyphicon glyphicon-send"></span>test
        </li>
        <li className="w-frames-send">test</li>
      </ul>
    </div>);
  }
});

module.exports = FrameList;
