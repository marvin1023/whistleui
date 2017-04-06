require('../css/json-viewer.css');
var React = require('react');
var JSONTree = require('react-json-tree')['default'];
var util = require('./util');

var JsonViewer = React.createClass({
	getInitialState: function() {
		return { emptyElem: <div className="hide"></div> };
	},
  toggle: function() {
		this.setState({ viewSource: !this.state.viewSource });
	},
	render: function() {
    var state = this.state;
		var viewSource = state.viewSource
    var props = this.props;
    var data = props.data;
    if (!data) {
      return state.emptyElem;
    }
    if (state.data !== data) {
      state.jsonStr = JSON.stringify(data, null, '\t');
    }
		return (
				<div className={'fill orient-vertical-box w-properties-wrap w-json-viewer' + (props.hide ? ' hide' : '')}>
					<a onClick={this.toggle} className="w-properties-btn">{ viewSource ? 'view parsed' : 'view source' }</a>
          <pre className={'fill w-json-viewer-str' + (viewSource ? '' : ' hide')}>{state.jsonStr}</pre>
          <div className={'fill w-json-viewer-tree' + (viewSource ? ' hide' : '')}>
            <JSONTree data={data} />
          </div>
				</div>
		);
	}
});

module.exports = JsonViewer;