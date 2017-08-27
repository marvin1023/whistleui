require('../css/image-view.css');
var React = require('react');

var ImageView = React.createClass({
  render: function() {
    var props = this.props;
    return (
      <div className={'fill w-image-view' + (props.hide ? ' hide' : '')}>
        <img src={props.imgSrc} />
      </div>
    );
  }
});

module.exports = ImageView;
