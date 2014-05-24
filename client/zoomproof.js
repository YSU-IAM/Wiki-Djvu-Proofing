$.when(
		//$.getScript("/w/index.php?title=User:HrantKhachatrian/morebits.js&action=raw&ctype=text/javascript"),
		$.Deferred(function (deferred) {
			$(deferred.resolve);
		})
).done(function () {
	var pageName = mw.config.get('wgPageName');
	
	console.log(pageName);
	if(!pageName.match(/Էջ:.*\.djvu\/\d+/)) return;
	console.log(pageName);
	
	var jsonUrl = pageName.replace(/djvu/, "djvu.json").replace("Էջ:", "");
	var json;
	$.getJSON("/w/index.php?title=" + encodeURIComponent(jsonUrl) + "&action=raw&ctype=text/javascript", function (data) {
		json = data;
		var $editorTextarea = $('[name=wpTextbox1]');
		var $editorDivContentEditable = $('<div contenteditable/>')
		.insertBefore($editorTextarea)
		.css({
			height: $editorTextarea.height(), 
			width: $editorTextarea.width(), 
			backgroundColor: '#fff', 
			position:'relative', 
			top: 0, 
			left: 0, 
			'margin-bottom': -$editorTextarea.height(),
			zIndex: 100,
			'overflow': 'scroll',
			'overflow-x': 'hidden',
			'overflow-y': 'scroll',
		});
		var hintWidth = 700;
		var hintHeight = 130;
		var transitionSpeed = 0.2;
		var $hint = $("<div/>").css({
			position: 'absolute',
			'z-index': '500',
			top: 100,
			left: 100,
			width: hintWidth,
			height: hintHeight,
			overflow: 'hidden',
			'background-color': 'white',
			border: '4px solid #ff0',
			transition: 'all ' + transitionSpeed + 's ease-out'
//			'border-top-left-radius': '300px',
//			'border-top-right-radius': '300px'
		}).insertAfter($editorDivContentEditable);
	
		var $hintImage = $("<img>").appendTo($hint).attr("src", $(".prp-page-image img").attr("src")).css({
			'position': 'absolute',
			transition: 'all ' + transitionSpeed + 's ease-out',
			'margin-top': 100,
			'margin-left': hintWidth / 2
		});
		
		var $ov = $("<div/>").appendTo($hint).css({
			'position': 'absolute',
			transition: 'all ' + transitionSpeed + 's ease-out',
			top: 100,
			left: hintWidth / 2,
			'background-color': 'rgba(255, 255, 0, .5)'
		});
		
		var imageSize = {
			height: $hintImage.height(),
			width: $hintImage.width()
		};
		
		var words = json.words;
		var pageSize = json.size;
		
		for(var i = 0; i < words.length; ++i){
			var word = words[i].contents.replace("&#10;", "<br>"); 
			$('<span/>')
				.appendTo($editorDivContentEditable)
				.data("size", words[i].size)
				.data("position", words[i].position)
				.html(word);
		}
		
		$editorDivContentEditable.on("keydown click keyup keypress", function(){
			var $span = $(document.getSelection().anchorNode.parentNode);
			var position = $span.data("position");
			var size = $span.data("size");
			var top = position.top;
			var left = position.left;
			$hintImage.css({
				top: (-top*imageSize.height/pageSize.height),
				left: ((-size.width/2-left)*imageSize.width/pageSize.width)
			});
			top = $span.position().top;
			left = $span.position().left;
			var width = $span.width() / 2;
			$hint.css({
				top: top - hintHeight/2 - 50,
				left: left - hintWidth/2 + width
			});
			$('#firstHeading').html(left - hintWidth/2 + width);
			$ov.css({
				'width': size.width * imageSize.width / pageSize.width, 
				'height': size.height * imageSize.height / pageSize.height,
				'left': hintWidth/2 - size.width * imageSize.width / pageSize.width / 2
			});
		});
	});

	//var currentPage = new Morebits.wiki.page();

	//currentPage.load(function () {
	
	//});

});
