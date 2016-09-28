var CodeMirror = require('codemirror');
CodeMirror.defineMode('rules', function() {
			function isIP(str) {
				return /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\:\d+)?$/.test(str) || /^host:\/\//.test(str);
			}
			
			function isHead(str) {
				return /^head:\/\//.test(str);
			}
			
			function isWeinre(str) {
				return /^weinre:\/\//.test(str);
			}
			
			function isProxy(str) {
				return /^proxy:\/\//.test(str);
			}
			
			function isReq(str) {
				return /^(?:req|hostname|accept|etag|referer|auth|ua|reqCookies|reqDelay|reqSpeed|reqCors|reqHeaders|method|reqType|reqCharset|reqBody|reqPrepend|reqAppend|reqReplace|reqWrite|reqWriteRaw):\/\//.test(str);
			}
			
			function isRes(str) {
				return /^(?:res|resCookies|resHeaders|statusCode|replaceStatus|redirect|resDelay|resSpeed|resCors|resType|resCharset|cache|attachment|location|resBody|resPrepend|resAppend|css|html|js|resReplace|resWrite|resWriteRaw):\/\//.test(str);
			}
			
			function isUrl(str) {
				return /^(?:https?|wss?|tunnel):\/\//i.test(str);
			}
			
			function isRule(str) {
				return /^(?:[a-z0-9.+-]+:\/\/|[a-z]:(?:\\|\/(?!\/))|\/)/i.test(str);
			}
			
			function isRegExp(str) {
				
				return /^\/(.+)\/(i)?$/.test(str);
			}
			
			function isParams(str) {
				return /^(?:urlParams|params|urlReplace):\/\//.test(str);
			}
			
			function isLog(str) {
				return /^log:\/\//.test(str);
			}
			
			function isFilter(str) {
				return /^filter:\/\//.test(str);
			}
			
			function isPlugin(str) {
				return /^plugin:\/\//.test(str) || /^(?:plugin|whistle)\.[a-z\d_\-]+:\/\//.test(str);
			}
			
			function isDisable(str) {
				return /^disable:\/\//.test(str);
			}
			
			function isExports(str) {
				return /^exports:\/\//.test(str);
			}
			
			function isExportsUrl(str) {
				return /^exportsUrl:\/\//.test(str);
			}
			
			function isDispatch(str) {
				return /^dispatch:\/\//.test(str);
			}
			
			function isPac(str) {
			  return /^pac:\/\//.test(str);
			}
			
			return {
				 token: function(stream, state) {
					 if (stream.eatSpace()) {
					     return null;
					   }
					 
					 var ch = stream.next();
					 if (ch == '#') {
						 stream.eatWhile(function(ch) {
							 return true;
						 });
						 return 'comment';
					 }
					
					 var str = ch;
					 var pre, type;
					 stream.eatWhile(function(ch) {
						if (/\s/.test(ch) || ch == '#') {
							return false;
						}
						
						str += ch;
						if (!type && ch == '/' && pre == '/') {
							if (isHead(str)) {
								 type = 'header js-head js-type';
							 } else if (isWeinre(str)) {
								 type = 'atom js-weinre js-type';
							 } else if (isProxy(str)) {
								 type = 'tag js-proxy js-type';
							 } else if (isReq(str)) {
								 type = 'negative js-req js-type';
							 } else if (isRes(str)) {
								 type = 'positive js-res js-type';
							 } else if (isUrl(str)) {
								 type = 'string-2 js-url js-type';
							 } else if (isParams(str)) {
								 type = 'meta js-params js-type';
							 } else if (isLog(str)) {
								 type = 'error js-log js-type';
							 } else if (isPlugin(str)) {
								 type = 'variable-2 js-plugin js-type';
							 } else if (isFilter(str)) {
								 type = 'variable-2 js-filter js-type';
							 } else if (isDisable(str)) {
								 type = 'variable-2 js-disable js-type';
							 } else if (isExports(str)) {
								 type = 'variable-2 js-exports js-type';
							 } else if (isExportsUrl(str)) {
								 type = 'variable-2 js-exportsUrl js-type';
							 } else if (isDispatch(str)) {
                 type = 'variable-2 js-dispatch js-type';
               } else if (isPac(str)) {
                 type = 'variable-2 js-pac js-type';
               } else if (!isIP(str) && isRule(str)) {
								 type = 'builtin js-rule js-type';
							 }
						}
						pre = ch;
						return true;
					 });
					
					 if (type) {
						 return type;
					 }
					 
					 if (isIP(str)) {
						 return 'number js-number';
					 }
					 
					 if (isRegExp(str)) {
						 return 'attribute js-attribute';
					 }
					 
					 if (isRule(str)) {
						 return 'builtin js-rule js-type';
					 }
					 
					 return null;
				 }
			};
});