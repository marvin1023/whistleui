require('./base-css.js');
require('../css/req-data.css');
var React = require('react');

var ReqData = React.createClass({
	getInitialState: function() {
		return {};
	},
	componentDidMount: function() {
		
	},
	_onFilterChange: function(e) {
		this.setState({filterText: e.target.value});
	},
	_onFilterKeyDown: function(e) {
		if ((e.ctrlKey || e.metaKey) && e.keyCode == 68) {
			this._clearFilterText();
			e.preventDefault();
			e.stopPropagation();
		}
	},
	_clearFilterText: function() {
		this.setState({filterText: ''});
	},
	render: function() {
		var modal = this.props.modal;
		var list = modal ? modal.list : [];
		return (
				<div className="fill w-req-data-con orient-vertical-box">
					<div className="w-req-data-content fill orient-vertical-box">
						<div className="w-req-data-headers">
							<table className="table">
						      <thead>
						        <tr>
						          <th className="order">#</th>
						          <th className="result">Result</th>
						          <th className="protocol">Protocol</th>
						          <th className="method">Method</th>
						          <th className="host">Host</th>
						          <th className="host-ip">Host IP</th>
						          <th className="url">Url</th>
						          <th className="type">Type</th>
						          <th className="time">Time</th>
						        </tr>
						      </thead>
						    </table>
						</div>
						<div className="w-req-data-list fill">
							<table className="table">
						      <tbody>
						      {
						    	  list.map(function(item, i) {
						    		  var end = item.endTime;
						    		  var defaultValue = end ? '' : '-';
						    		  var type;
						    		  return (<tr key={item.id} className="success">
						    		  				<th className="order" scope="row">{i + 1}</th>			        
						    		  				<td className="result">{item.res.statusCode || '-'}</td>			        
						    		  				<td className="protocol">HTTP</td>			        
						    		  				<td className="method">GET</td>			        
						    		  				<td className="host">api.cupid.iqiyi.com</td>			        
						    		  				<td className="host-ip">101.227.14.80</td>			        
						    		  				<td className="url" title={item.url}>{item.url}</td>			        
						    		  				<td className="type" title="text/html;&nbsp;charset=utf-8">text/html</td>			        
						    		  				<td className="time">18ms</td>			     
						    		  			</tr>);
						    	  })
						      }	
						      </tbody>
						    </table>	
						</div>
					</div>
					<div className="w-req-data-bar">
						<input type="text" value={this.state.filterText} 
						onChange={this._onFilterChange} 
						onKeyDown={this._onFilterKeyDown}
						className="w-req-data-filter" maxLength="128" placeholder="type filter text" />
						<button
						onClick={this._clearFilterText}
						style={{display: this.state.filterText ? 'block' :  'none'}} type="button" className="close" title="Ctrl+D"><span aria-hidden="true">&times;</span></button>
					</div>
			</div>
		);
	}
});

module.exports = ReqData;