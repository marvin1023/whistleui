define('/style/js/biz/hosts.js', function(require, exports, module) {
	var hostsData;
	var newHostsList = $('#newHostsList');
	var glyphiconOk = '<span class="glyphicon glyphicon-ok"></span>';
	
	var hostsEditor = CodeMirror($('#hostsEditor')[0], {
    	mode: 'text/whistle'
  	});
	
	var themeOptions = $('#themeOptions').change(function() {
		var theme = this.value;
		$.post('/cgi-bin/hosts/set-theme',{theme: theme});
		hostsEditor.setOption('theme', theme);
	});
	
	var fontSizeOptions = $('#fontSizeOptions').change(function() {
        var fontSize = this.value;
        $.post('/cgi-bin/hosts/set-font-size',{fontSize: fontSize});
        hostsEditor.getWrapperElement().style.fontSize = fontSize;
        hostsEditor.refresh();
	});
		
	var showLineNumbers = $('#showLineNumbers').change(function() {
		$.post('/cgi-bin/hosts/show-line-numbers',{showLineNumbers: this.checked ? 1 : 0});
		hostsEditor.setOption('lineNumbers', this.checked);
	});
	
	function initActionBar(data) {
		if (data.theme) {
			themeOptions.val(data.theme).trigger('change');
		}
		
		if (data.fontSize) {
			fontSizeOptions.val(data.fontSize).trigger('change');
		}
		
		showLineNumbers.prop('checked', data.showLineNumbers == true);
		showLineNumbers.trigger('change');
	}
	
	var body = $(document.body).on('click', '.hosts-list .list-group-item', function() {
		var self = $(this);
		if (self.hasClass('create-hosts')) {
			return;
		}
		
		var hostsList = self.closest('.hosts-list');
		var activeItem = hostsList.find('.list-group-item.active').removeClass('active');
		var hostsName = activeItem.text();
		
		if (activeItem.hasClass('public-hosts')) {
			hostsData.publicHosts = hostsEditor.getValue();
		} else {
			hostsData.hostsData[hostsName] = hostsEditor.getValue();
		}
		
		self.addClass('active');
		
		var hostsNav = $('#hostsNav');
		hostsName = self.text();
		
		hostsNav.find('.hosts-title').text(hostsName);
		
		if (self.hasClass('public-hosts')) {
			hostsNav.find('.remove-hosts').hide();
			hostsNav.find('.enable-public-hosts').show();
			hostsEditor.setValue(hostsData.publicHosts || '');
		} else {
			hostsNav.find('.remove-hosts').show();
			hostsNav.find('.enable-public-hosts').hide();
			hostsEditor.setValue(hostsData.hostsData[hostsName] || '');
		}
	}).on('dblclick', '.hosts-list .list-group-item', function() {
		$('.apply-hosts').trigger('click');
	});
	
	body.on('click', '.enable-public-hosts', function() {
		var enable = $('#enablePublicHosts').prop('checked');
		var glyphicon = $('#publicHosts').find('.glyphicon-ok');
		enable ? glyphicon.show() : glyphicon.hide();
		updatePublicHostsState();
		$.post('/cgi-bin/hosts/enable',{enable: enable ? 1 : 0});
	});
	
	function updatePublicHostsState() {
		var enable = $('#enablePublicHosts').prop('checked');
		$('#publicHosts').css('color', enable ? '' : '#ccc')
		.attr('title', enable ? '先在自定义分组找hosts、head协议及匹配规则，找不到再到公用环境找' : '公用环境已禁用');
	}
	
	body.on('click', '.remove-hosts', function() {
		if (confirm("确认删除？"))  {  
			var hosts = newHostsList.find('.active');
			var name = hosts.text();
			
			$.post('/cgi-bin/hosts/remove',{name: name});
			$('#publicHosts').trigger('click');
			hosts.remove();
			delete hostsData.hostsData[name];
			updateCreateHostsBtnState();
		}
		
	});
	
	$(window).keydown(function(e) {
		if (e.ctrlKey && e.keyCode == 83) {
			e.preventDefault();
			return false;
		}
	}).keyup(function(e) {
		if (e.ctrlKey && e.keyCode == 83) {
			$('.apply-hosts').trigger('click');
		}
	});
	
	$('#hostsEditor').keyup(function(e) {
		if (e.ctrlKey && e.keyCode == 13) {
			$('.apply-hosts').trigger('click');
		}
	});
	
	body.on('click', '.apply-hosts', function() {
		var self = $(this);
		var hostsList = $('#hostsList');
		var activeHosts = hostsList.find('.active');
		if (!activeHosts.length) {
			return;
		}
		
		var content = hostsEditor.getValue();
		
		if (activeHosts.hasClass('public-hosts')) {
			hostsData.publicHosts = content;
			$.post('/cgi-bin/hosts/save-public', {name: name, content: content});
		} else {
			var name = activeHosts.text();
			hostsData.hostsData[name] = content;
			$.post('/cgi-bin/hosts/save', {name: name, content: content});
			var glyphicon = newHostsList.find('.glyphicon-ok').remove();
			activeHosts.append(glyphicon.length ? glyphicon : glyphiconOk);
		}
		
		$('#hostsList').find('a.active').removeClass('changed');
	});
	
	var createHostsBtn = $('#createHostsBtn').click(function() {
		if (createHostsBtn.hasClass('disabled')) {
			return;
		}
		$('#createHostsDialog').modal();
		setTimeout(function() {
			try {$('#newHostsName').focus();} catch(e) {}
		}, 300);
	});
	
	var createHostsNameBtn = $('#createHostsNameBtn').click(function() {
		var name = $.trim($('#newHostsName').val());
		if (!name) {
			return;
		}
		
		for (var i in hostsData.hostsData) {
			if (i == name) {
				alert('该名称已存在。');
				return;
			}
		}
		createHosts(name).trigger('click');
		$.post('/cgi-bin/hosts/create', {name: name});
		$('#createHostsDialog').modal('toggle');
		updateCreateHostsBtnState();
		$('#newHostsName').val('');
		newHostsList.scrollTop(1000);
	});
	
	$('#newHostsName').keyup(function(e) {
		if (e.keyCode == 13) {
			createHostsNameBtn.trigger('click');
		}
	});
	
	function createHosts(name) {
		return $('<a href="javascript:;" class="list-group-item" title="双击切换环境"></a>').text(name).appendTo(newHostsList);
	}
	
	function updateCreateHostsBtnState() {
		if (newHostsList.find('.list-group-item').length >= 36) {
			createHostsBtn.addClass('disabled');
		} else {
			createHostsBtn.removeClass('disabled');
		}
	}
	
	$.ajax({
		url: '/cgi-bin/hosts/list',
		dataType: 'json',
		success: function(data) {
			hostsData = data || {};
			initActionBar(data);
			
			var hostsList = hostsData.hostsList;
			var curHostsName = hostsData.curHostsName;
			var hasActive;
			for (var i = 0, len = hostsList.length; i < len; i++) {
				var name = hostsList[i];
				var item = createHosts(name);
				if (curHostsName == name) {
					item.append(glyphiconOk).trigger('click');
					hasActive = true;
					hostsEditor.setValue(hostsData.hostsData[name] || '');
					curHostsName = null;
				}
			}
			if (hostsData.disabled) {
				$('#publicHosts').find('.glyphicon-ok').hide();
				$('#enablePublicHosts').prop('checked', false);
			}
			updateCreateHostsBtnState();
			
			if (!hasActive) {
				$('#publicHosts').trigger('click');
			}
			
			updatePublicHostsState();
			setInterval(function() {
				var activeItem = $('#hostsList').find('a.active');
				var value = hostsEditor.getValue();
				var hosts = hostsData.hostsData[activeItem.text()];
				if (activeItem.hasClass('public-hosts')) {
					if((!value && !hostsData.publicHosts) || hostsData.publicHosts == value) {
						activeItem.removeClass('changed');
						return;
					}
				} else if((!value && !hosts) || hosts == value) {
						activeItem.removeClass('changed');
						return;
				}
				
				activeItem.addClass('changed');
			}, 300)
		},
		error: function() {
			alert('加载失败，请重新刷新页面。');
		}
	});
	
	function addResizeEvents() {
		var editor = $('#hostsEditor')[0];
		var timeoutId;
		
		function resize() {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(function() {
				hostsEditor.setSize(editor.offsetWidth, editor.offsetHeight - 2);
			}, 60);
		}
		
		$(window).on('resize', resize);
		resize();
	}
	addResizeEvents();
});