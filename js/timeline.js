require('./base-css.js');
require('../css/timeline.css');
var React = require('react');
var util = require('./util');

var Timeline = React.createClass({
	shouldComponentUpdate: function() {
		return !util.getBoolean(this.props.hide);
	},
	render: function() {
		
		return (
				<div className={'w-detail-timeline' + (util.getBoolean(this.props.hide) ? ' hide' : '')}>
					<ul>
						<li>
							<span title="Stalled: 0ms" className="w-detail-timeline-stalled" style={{width: 0}}>-1</span>
							<span title="DNS: 10ms" className="w-detail-timeline-dns">1</span>
							<span title="Request: 10ms" className="w-detail-timeline-request">2</span>
							<span title="Response: 10ms" className="w-detail-timeline-response">3</span>
							<span title= {'Stalled: 0ms\nDNS: 10ms\nRequest: 10ms\nResponse: 10ms'} className="w-detail-timeline-time">222ms</span>
						</li>
						<li>
						<span className="w-detail-timeline-stalled" style={{width: '10%'}}>-1</span>
							<span className="w-detail-timeline-dns">1</span>
							<span className="w-detail-timeline-request">2</span>
							<span className="w-detail-timeline-response">3</span>
							<span className="w-detail-timeline-time">222ms</span>
						</li>
						<li>
						<span className="w-detail-timeline-stalled" style={{width: '20%'}}>-1</span>
							<span className="w-detail-timeline-dns">1</span>
							<span className="w-detail-timeline-request">2</span>
							<span className="w-detail-timeline-response">3</span>
							<span className="w-detail-timeline-time">222ms</span>
						</li>
					</ul>
				</div>
		);
	}
});

module.exports = Timeline;