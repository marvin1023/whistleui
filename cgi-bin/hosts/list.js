var metaUtil = require('../../lib/meta-util');

module.exports = function(req, res) {
	res.json(metaUtil.getHostsData());
};