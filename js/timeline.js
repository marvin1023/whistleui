require('./base-css.js');
require('../css/timeline.css');
var React = require('react');
var util = require('./util');
var TOTAL_RATE = 80;

var Timeline = React.createClass({
	shouldComponentUpdate: function(nextProps) {
		var hide = util.getBoolean(this.props.hide);
		return hide != util.getBoolean(nextProps.hide) || !hide;
	},
	render: function() {
		var modal = this.props.modal;
		var list = modal && modal.getSelectedList() || [];
		var maxTotal = 1;
		var startTime;
		
		list.forEach(function(item) {
			if (!startTime || item.startTime < startTime) {
				startTime = item.startTime;
			}
			
		});
		
		list.forEach(function(item) {
			var total = (item.endTime || item.responseTime || item.requestTime || item.dnsTime) - startTime;
			if (total > maxTotal) {
				maxTotal = total;
			}
		});
		
		return (
				<div className={'fill orient-vertical-box w-detail-content w-detail-timeline' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
					<ul>
						{list.map(function(item) {
							var stalled = item.startTime - startTime;
							var stalled, stalledRate, dns, dnsRate, request, requestRate, response, responseRate, load, loadRate;
							if (item.dnsTime) {
								stalled = item.startTime - startTime;
								stalledRate = stalled * TOTAL_RATE / maxTotal + '%';
								stalled += 'ms';
							} else {
								stalled = '-';
								stalledRate = 0;
							}
							
							if (item.dnsTime) {
								dns = item.dnsTime - item.startTime;
								dnsRate = dns * TOTAL_RATE / maxTotal + '%';
								dns += 'ms';
							} else {
								dns = '-';
								dnsRate = 0;
							}
							
							if (item.requestTime) {
								request = item.requestTime - item.dnsTime;
								requestRate = request * TOTAL_RATE / maxTotal + '%';
								request += 'ms';
							} else {
								request = '-';
								requestRate = 0;
							}
							
							if (item.responseTime) {
								response = item.responseTime - item.requestTime;
								responseRate = response * TOTAL_RATE / maxTotal + '%';
								response += 'ms';
							} else {
								response = '-';
								responseRate = 0;
							}
							
							if (item.endTime) {
								load = item.endTime - item.responseTime;
								loadRate = load * TOTAL_RATE / maxTotal + '%';
								load += 'ms';
							} else {
								load = '-';
								loadRate = 0;
							}
							
							var total = item.endTime ? item.endTime - item.startTime + 'ms' : '-';
							
							return (
									<li key={item.id}>
										<span title={item.url} className="w-detail-timeline-url">{util.getFilename(item.url)}</span>	
										<span style={{width: stalledRate}} title={'Stalled: ' + stalled} className="w-detail-timeline-stalled">{stalled}</span>
										<span style={{width: dnsRate}} title={'DNS: ' + dns} className="w-detail-timeline-dns">{dns}</span>
										<span style={{width: requestRate}} title={'Request: ' + request} className="w-detail-timeline-request">{request}</span>
										<span style={{width: responseRate}} title={'Response: ' + response} className="w-detail-timeline-response">{response}</span>
										<span style={{width: loadRate}} title={'Load: ' + load} className="w-detail-timeline-load">{load}</span>
										<span title= {'Stalled: ' + stalled + '\nDNS: ' + dns + '\nRequest: ' + 
											request + '\nResponse: ' + response + '\nLoad: ' + load + '\nTotal: ' + total} 
											className="w-detail-timeline-time">{total}</span>
									</li>		
							);
						})}
					</ul>
				</div>
		);
	}
});

module.exports = Timeline;