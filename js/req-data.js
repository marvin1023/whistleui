require('./base-css.js');
require('../css/req-data.css');
var React = require('react');

var ReqData = React.createClass({
	componentDidMount: function() {
		
	},
	render: function() {
		
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
						      	<tr id="1439623451575-2015" className="success">			        <th className="order" scope="row">2015</th>			        <td className="result">200</td>			        <td className="protocol">HTTP</td>			        <td className="method">GET</td>			        <td className="host">api.cupid.iqiyi.com</td>			        <td className="host-ip">101.227.14.80</td>			        <td className="url" title="http://api.cupid.iqiyi.com/track2?k=200766801&amp;j=6&amp;b=1439623451&amp;f=e57e36816a869438d8768caa2b4a3f7c&amp;s=ff2c7c1c7fa50e23f860fd0b151b560e&amp;cv=5.2.26&amp;ve=1&amp;r=6c20cbcbfae6aa6222fd1c47a4cb1432&amp;g=0ba53baedff5c4b528548d9726f3af9a&amp;a=0&amp;n=387365100&amp;u=1&amp;sv=AdManager%203.2.0&amp;o=4&amp;i=qc_100001_100016&amp;v=5000000707222&amp;c=cbbc0ad38b09743a0863402ae0055cd8&amp;p=1000000000457&amp;kp=e57e36816a869438d8768caa2b4a3f7c&amp;w=1&amp;d=5000000707222&amp;q=5000000774191">http://api.cupid.iqiyi.com/track2?k=200766801&amp;j=6&amp;b=1439623451&amp;f=e57e36816a869438d8768caa2b4a3f7c&amp;s=ff2c7c1c7fa50e23f860fd0b151b560e&amp;cv=5.2.26&amp;ve=1&amp;r=6c20cbcbfae6aa6222fd1c47a4cb1432&amp;g=0ba53baedff5c4b528548d9726f3af9a&amp;a=0&amp;n=387365100&amp;u=1&amp;sv=AdManager%203.2.0&amp;o=4&amp;i=qc_100001_100016&amp;v=5000000707222&amp;c=cbbc0ad38b09743a0863402ae0055cd8&amp;p=1000000000457&amp;kp=e57e36816a869438d8768caa2b4a3f7c&amp;w=1&amp;d=5000000707222&amp;q=5000000774191</td>			        <td className="type" title="text/html;&nbsp;charset=utf-8">text/html;&nbsp;charset=utf-8</td>			        <td className="time">18ms</td>			     </tr>
						      	<tr id="1439623451576-2016" className="">			        <th className="order" scope="row">2016</th>			        <td className="result">200</td>			        <td className="protocol">HTTP</td>			        <td className="method">GET</td>			        <td className="host">api.cupid.iqiyi.com</td>			        <td className="host-ip">101.227.14.80</td>			        <td className="url" title="http://api.cupid.iqiyi.com/etx?k=200766801&amp;r=6c20cbcbfae6aa6222fd1c47a4cb1432&amp;b=1439623451&amp;f=e57e36816a869438d8768caa2b4a3f7c&amp;du=0&amp;cv=5.2.26&amp;ve=1&amp;z=1000000000457&amp;g=0ba53baedff5c4b528548d9726f3af9a&amp;a=0&amp;n=387365100&amp;s=f4791bd45eee5b018797e765ab679731&amp;ds=71000001&amp;sv=AdManager%203.2.0&amp;o=4&amp;i=qc_100001_100016&amp;v=CAASEGseMM8pVUkpiJFs6m_FE1YaIDlhZTlmN2FkN2I4MzFiMDEyZjkwZjIxMzkyNTlhZmNj&amp;c=cbbc0ad38b09743a0863402ae0055cd8&amp;j=6&amp;d=81000009&amp;q=5000000774191">http://api.cupid.iqiyi.com/etx?k=200766801&amp;r=6c20cbcbfae6aa6222fd1c47a4cb1432&amp;b=1439623451&amp;f=e57e36816a869438d8768caa2b4a3f7c&amp;du=0&amp;cv=5.2.26&amp;ve=1&amp;z=1000000000457&amp;g=0ba53baedff5c4b528548d9726f3af9a&amp;a=0&amp;n=387365100&amp;s=f4791bd45eee5b018797e765ab679731&amp;ds=71000001&amp;sv=AdManager%203.2.0&amp;o=4&amp;i=qc_100001_100016&amp;v=CAASEGseMM8pVUkpiJFs6m_FE1YaIDlhZTlmN2FkN2I4MzFiMDEyZjkwZjIxMzkyNTlhZmNj&amp;c=cbbc0ad38b09743a0863402ae0055cd8&amp;j=6&amp;d=81000009&amp;q=5000000774191</td>			        <td className="type" title=""></td>			        <td className="time">17ms</td>			     </tr>
						      </tbody>
						    </table>	
						</div>
					</div>
					<div className="w-req-data-bar">
						<input type="text" className="w-req-data-filter" maxLength="128" placeholder="type filter text" />
						<button type="button" className="close"><span aria-hidden="true">&times;</span></button>
					</div>
			</div>
		);
	}
});

module.exports = ReqData;