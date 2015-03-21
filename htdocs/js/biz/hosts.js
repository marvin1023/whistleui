define('/style/js/biz/hosts.js', function(require, exports, module) {
	var hostsData;
	var newHostsList = $('#newHostsList');
	var glyphiconOk = '<span class="glyphicon glyphicon-ok"></span>';
	
	var body = $(document.body).on('click', '.hosts-list .list-group-item', function() {
		var self = $(this);
		if (self.hasClass('create-hosts')) {
			return;
		}
		
		var hostsList = self.closest('.hosts-list');
		var activeItem = hostsList.find('.list-group-item.active').removeClass('active');
		var hostsName = activeItem.text();
		
		if (activeItem.hasClass('public-hosts')) {
			hostsData.publicHosts = $('#hostsText').val();
		} else {
			hostsData.hostsData[hostsName] = $('#hostsText').val();
		}
		
		self.addClass('active');
		
		var hostsNav = $('#hostsNav');
		hostsName = self.text();
		
		hostsNav.find('.hosts-title').text(hostsName);
		
		if (self.hasClass('public-hosts')) {
			hostsNav.find('.remove-hosts').hide();
			hostsNav.find('.enable-public-hosts').show();
			$('#hostsText').val(formatText(hostsData.publicHosts));
		} else {
			hostsNav.find('.remove-hosts').show();
			hostsNav.find('.enable-public-hosts').hide();
			$('#hostsText').val(formatText(hostsData.hostsData[hostsName]));
		}
	});
	
	function addTextChangeEvents() {
		var hostsList = $('#hostsList');
		$('#hostsText').on('keyup keypress mouseover mouseout keydown', function() {
			var activeItem = hostsList.find('.list-group-item.active');
			if (activeItem.hasClass('public-hosts')) {
				if ((hostsData.publicHosts || '') != this.value) {
					setChanged();
				}
			} else {
				if ((hostsData.hostsData[activeItem.text()] || '') != this.value) {
					setChanged();
				}
			}
		});
	}
	
	addTextChangeEvents();
	
	body.on('click', '.enable-public-hosts', function() {
		var glyphicon = $('#publicHosts').find('.glyphicon-ok');
		var enable = $('#enablePublicHosts').prop('checked');
		enable ? glyphicon.show() : glyphicon.hide();
		$.post('/cgi-bin/hosts/enable',{enable: enable ? 1 : 0});
	});
	
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
			$('#hostsText').blur();
			$('.apply-hosts').trigger('click');
			$('#hostsText').focus();
		}
	});
	
	$('#hostsText').on('input, change', setChanged);
	
	body.on('click', '.apply-hosts', function() {
		var self = $(this);
		var hostsList = $('#hostsList');
		var activeHosts = hostsList.find('.active');
		if (!activeHosts.length) {
			return;
		}
		
		var content = $('#hostsText').val();
		
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
		
		removeChanged();
	});
	
	var createHostsBtn = $('#createHostsBtn').click(function() {
		if (createHostsBtn.hasClass('disabled')) {
			return;
		}
		$('#createHostsDialog').modal();
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
	
	function formatText(text) {
		return text ? text.replace(/\t/g, '    ') : '';
	}
	
	function createHosts(name) {
		return $('<a href="javascript:;" class="list-group-item"></a>').text(name).appendTo(newHostsList);
	}
	
	function updateCreateHostsBtnState() {
		if (newHostsList.find('.list-group-item').length >= 20) {
			createHostsBtn.addClass('disabled');
		} else {
			createHostsBtn.removeClass('disabled');
		}
	}
	
	function setChanged() {
		$('#hostsList').find('a.active').addClass('changed');
	}
	
	function removeChanged() {
		$('#hostsList').find('a.active').removeClass('changed');
	}
	

	$.ajax({
		url: '/cgi-bin/hosts/list',
		dataType: 'json',
		success: function(data) {
			hostsData = data || {};
			var hostsList = hostsData.hostsList;
			var curHostsName = hostsData.curHostsName;
			var hasActive;
			for (var i = 0, len = hostsList.length; i < len; i++) {
				var name = hostsList[i];
				var item = createHosts(name);
				if (curHostsName == name) {
					item.append(glyphiconOk).trigger('click');
					hasActive = true;
					$('#hostsText').val(formatText(hostsData.hostsData[name]));
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
		
		},
		error: function() {
			alert('加载失败，请重新刷新页面。');
		}
	});

});