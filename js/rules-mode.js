var CodeMirror = require('codemirror');
var events = require('./events');
var protocols = require('./protocols');
var forwardRules = protocols.getForwardRules();
var pluginRules = protocols.getPluginRules();
events.on('updatePlugins', function() {
	forwardRules = protocols.getForwardRules();
	pluginRules = protocols.getPluginRules();
});

CodeMirror.defineMode('rules', function() {
			function isIP(str) {
				return /^(?:\/\/)?(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\:\d+)?$/.test(str) || /^hosts?:\/\//.test(str);
			}
			
			function isHead(str) {
				return /^head:\/\//.test(str);
			}
			
			function isWeinre(str) {
				return /^weinre:\/\//.test(str);
			}
			
			function isReq(str) {
				return /^(?:req|hostname|reqHost|accept|etag|referer|auth|ua|forwardedFor|reqCookies|reqDelay|reqSpeed|reqCors|reqHeaders|method|reqType|reqCharset|reqBody|reqPrepend|reqAppend|reqReplace|reqWrite|reqWriteRaw):\/\//.test(str);
			}
			
			function isRes(str) {
				return /^(?:resScript|responseFor|res|resCookies|resHeaders|statusCode|status|replaceStatus|redirect|resDelay|resSpeed|resCors|resType|resCharset|cache|attachment|download|location|resBody|resPrepend|resAppend|css(?:Append|Prepend|Body)?|html(?:Append|Prepend|Body)?|js(?:Append|Prepend|Body)?|resReplace|resWrite|resWriteRaw):\/\//.test(str);
			}
			
			function isUrl(str) {
				return /^(?:https?|wss?|tunnel):\/\//i.test(str);
			}
			
			function isRule(str) {
				return /^[^\s:]+:\/\//i.test(str);
			}
			
			function notExistRule(str) {
			  str = str.substring(0, str.indexOf(':'));
			  return forwardRules.indexOf(str) == -1;
			}

			function notExistPlugin(str) {
			  str = str.substring(0, str.indexOf(':'));
			  return pluginRules.indexOf(str) == -1;
			}
			
			function isRegExp(str) {
				return /^\/[^/](.*)\/i?$/.test(str) || /^\$/.test(str);
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
				return (/^plugin:\/\//.test(str) || /^(?:plugin|whistle)\.[a-z\d_\-]+:\/\//.test(str)) && !notExistPlugin(str);
			}
			
			function isRulesFile(str) {
			  return /^(?:rules?(?:File|Script)|reqScript):\/\//.test(str);
			}
			
			function isDisable(str) {
				return /^disable:\/\//.test(str);
			}
			
			function isIgnore(str) {
			  return /^ignore:\/\//.test(str);
			}
			
			function isEnable(str) {
			  return /^enable:\/\//.test(str);
			}
			
			function isDelete(str) {
        return /^delete:\/\//.test(str);
      }
			
			function isExports(str) {
				return /^exports?:\/\//.test(str);
			}
			
			function isExportsUrl(str) {
				return /^exports?Url:\/\//.test(str);
			}
			
			function isDispatch(str) {
				return /^dispatch:\/\//.test(str);
			}
			
			function isProxy(str) {
			  return /^(?:proxy|http-proxy|http2https-proxy|https2http-proxy):\/\//.test(str);
			}
			
			function isSocks(str) {
			  return /^socks:\/\//.test(str);
			}
			
			function isPac(str) {
			  return /^pac:\/\//.test(str);
			}

			function isLocalPath(str) {
				return /^[a-z]:(?:\\|\/(?!\/))/i.test(str) || /^\/[^/]/.test(str);
			}

			function isWildcard(str) {
				return /^(?:\$?(?:https?:|wss?:|tunnel:)?\/\/)?(?:\*\*?\.|[~*]\/)/.test(str);
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

					 var not = ch === '!';
					 var str = not ? stream.next() : ch;
					 var type = '';
					 var pre;
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
								 type = 'variable-2 js-req js-type';
							 } else if (isRes(str)) {
								 type = 'positive js-res js-type';
							 } else if (isParams(str)) {
								 type = 'meta js-params js-type';
							 } else if (isLog(str)) {
								 type = 'atom js-log js-type';
							 } else if (isPlugin(str)) {
                 type = 'variable-2 js-plugin js-type';
               } else if (isFilter(str)) {
                 type = 'negative js-filter js-type';
               } else if (isIgnore(str)) {
                 type = 'negative js-ignore js-type';
               } else if (isEnable(str)) {
                 type = 'atom js-enable js-type';
               } else if (isDisable(str)) {
                 type = 'negative js-disable js-type';
               } else if (isDelete(str)) {
                 type = 'negative js-delete js-type';
               } else if (isExports(str)) {
								 type = 'atom js-exports js-type';
							 } else if (isExportsUrl(str)) {
								 type = 'atom js-exportsUrl js-type';
							 } else if (isDispatch(str)) {
								type = 'variable-2 js-dispatch js-type';
							} else if (isProxy(str)) {
								type = 'variable-2 js-proxy js-type';
							} else if (isSocks(str)) {
								type = 'variable-2 js-socks js-type';
							} else if (isPac(str)) {
								type = 'variable-2 js-pac js-type';
							} else if (isRulesFile(str)) {
								type = 'variable-2 js-rulesFile js-type';
							} else if (isUrl(str)) {
								type = 'string-2 js-url js-type';
							} else if (isWildcard(str)) {
								type = 'attribute js-attribute';
							} else if (isRule(str)) {
								type = 'builtin js-rule js-type' + (notExistRule(str) ? ' error-rule' : '');
							}
						}
						pre = ch;
						return true;
					 });
					 if (isRegExp(str)) {
						 return 'attribute js-attribute';
					 }
					 if (/^@/.test(str)) {
						 return 'atom js-at js-type';
					 }
					 if (isWildcard(str)) {
						 type = 'attribute js-attribute';
					 }
					 if (isIP(str)) {
						 type = 'number js-number';
					 }
					 if (isLocalPath(str)) {
						 type = 'builtin js-rule js-type';
					 }
					 if (/^\{.*\}$/.test(str) || /^<.*>$/.test(str) || /^\(.*\)$/.test(str)) {
						 return 'builtin js-rule js-type';
					 }
					 return not ? type + ' error-rule' : type;
				 }
			};
});