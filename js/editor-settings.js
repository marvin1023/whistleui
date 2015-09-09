require('./base-css.js');
require('../css/editor-settings.css');
var React = require('react');

var EditorSettings = React.createClass({
	
	render: function() {
		
		return (
				<div className="w-editor-settings">
					<p>
				      <label><span className="w-label">Theme:</span> 
				    	  <select className="form-control">
								<option selected="selected" value="default">default</option>
						        <option value="ambiance">ambiance</option>
						        <option  value="blackboard">blackboard</option>
						        <option  value="cobalt">cobalt</option>
						        <option  value="eclipse">eclipse</option>
						        <option  value="elegant">elegant</option>
						        <option  value="erlang-dark">erlang-dark</option>
						        <option  value="lesser-dark">lesser-dark</option>
						        <option  value="midnight">midnight</option>
						        <option  value="monokai">monokai</option>
						        <option  value="neat">neat</option>
						        <option  value="night">night</option>
						        <option  value="rubyblue">rubyblue</option>
						        <option  value="solarized dark">solarized dark</option>
						        <option  value="solarized light">solarized light</option>
						        <option  value="twilight">twilight</option>
						        <option  value="vibrant-ink">vibrant-ink</option>
						        <option  value="xq-dark">xq-dark</option>
						        <option  value="xq-light">xq-light</option>
							</select>
						</label>
			      </p>
				  <p>
					  <label><span className="w-label">Font size:</span>
						  <select className="form-control">
								<option value="13px">13px</option>
								<option selected="selected" value="14px">14px</option>
								<option value="16px">16px</option>
								<option value="18px">18px</option>
								<option value="20px">20px</option>
								<option value="24px">24px</option>
								<option value="26px">26px</option>
								<option value="28px">28px</option>
								<option value="30px">30px</option>
								<option value="32px">32px</option>
								<option value="34px">34px</option>
								<option value="36px">36px</option>
							</select>
						</label>
				  </p>
				  <p className="w-editor-settings-box"><label><input type="checkbox" /> Show line number</label></p>
				 </div>
		);
	}
});

module.exports = EditorSettings;