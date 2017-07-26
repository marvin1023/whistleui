require('../css/users.css');
var React = require('react');

var Users = React.createClass({
  render: function() {
    var self = this;
    return (
      <div className="fill orient-vertical-box w-plugins" style={{display: self.props.hide ? 'none' : ''}}>
					<div className="w-plugins-headers">
						<table className="table">
							<thead>
								<tr>
									<th className="w-plugins-order">#</th>
									<th className="w-plugins-active">Active</th>
									<th className="w-plugins-name">Name</th>
									<th className="w-plugins-operation">Operation</th>
									<th className="w-plugins-desc">Description</th>
								</tr>
							</thead>
						</table>
					</div>
					<div className="fill w-plugins-list">
						<table className="table table-hover">
							<tbody>
								<tr><td colSpan="5" className="w-empty"><a href="https://github.com/whistle-plugins" target="_blank">Add User</a></td></tr>
							</tbody>
						</table>
					</div>
				</div>
    );
  }
});

module.exports = Users;
