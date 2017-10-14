require('../css/frames.css');
var React = require('react');
var util = require('./util');
var BtnGroup = require('./btn-group');
var Divider = require('./divider');
var FilterInput = require('./filter-input');

var BTNS = [{name: 'Detail'}, {name: 'Client'}, {name: 'Server'}];
var WS_BTNS = [{name: 'TextView'}, {name: 'JSONView'}, {name: 'HexView'}];

var ImageView = React.createClass({
  shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
  render: function() {
    var props = this.props;
    var frames = props.frames;
    return (
      <div className={'fill orient-vertical-box w-frames' + (props.hide ? ' hide' : '')}>
        <Divider vertical="true" rightWidth="180">
          <div className="fill orient-vertical-box w-frames-list">
            <div className="w-frames-action">
              <label>
                <input type="checkbox" checked /> Send
              </label>
              <label>
                <input type="checkbox" checked /> Receive
              </label>
              <a onClick={this.clear} className="w-remove-menu"
                href="javascript:;" draggable="false">
                <span className="glyphicon glyphicon-remove"></span>Clear
              </a>
              <a onClick={this.clear} className="w-remove-menu"
                href="javascript:;" draggable="false">
                <span className="glyphicon glyphicon-play"></span>AutoRefresh
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
          </div>
          <div className="fill orient-vertical-box w-frames-detail">
            <BtnGroup btns={BTNS} />
            <BtnGroup type="s" btns={WS_BTNS} />
            <div className="fill orient-vertical-box w-frames-composer">
              <div className="w-frames-composer-action">
                <a href="javascript">Click here</a> or drag a file to here to send to the client
                <button type="button" className="btn btn-primary btn-sm">Send</button>
              </div>
              <textarea className="fill"></textarea>
            </div>
            <div className="fill orient-vertical-box w-frames-composer">
              <div className="w-frames-composer-action">
                <a href="javascript">Click here</a> or drag a file to here to send to the server
                <button type="button" className="btn btn-primary btn-sm">Send</button>
              </div>
              <textarea className="fill"></textarea>
            </div>
          </div>
        </Divider>
        <FilterInput onChange={this.onFilterChange} />
      </div>
    );
  }
});

module.exports = ImageView;
