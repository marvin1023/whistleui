require('../css/users.css');
var React = require('react');

var Users = React.createClass({
  render: function() {

    return (
      <div style={{display: this.props.hide ? 'none' : undefined}}>
        Add Users
      </div>
    );
  }
});

module.exports = Users;
