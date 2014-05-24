$(function () {
	var pageName = mw.config.get("wgPageName");
	
	if(!pageName.match(/Էջ:.*\.djvu\/\d+/)) return;
	
	var fileName = pageName.replace("Էջ:", "");
	var jsonFile = fileName.replace(/djvu/, "djvu.json");
	var jsonUrl = "/w/index.php?title=%s&action=raw&ctype=text/javascript".replace("%s", jsonFile);
	
	$.getJSON(jsonUrl, function (json) {
		var $editorTextarea = $('#wpTextbox1');
		var editorHeight = $editorTextarea.height();
		var editorWidth = $editorTextarea.width();
		var $editorDivContentEditable = $('<div>')
		.attr("contenteditable", "true")
		.insertBefore($editorTextarea)
		.css({
			"height": 		editorHeight, 
			"width": 		editorWidth, 
			"background-color": 	"white", 
			"position": 		"relative", 
			"top": 			0, 
			"left": 		0,
			"margin-bottom": 	-editorHeight,
			"z-index": 		100,
			"overflow": 		"scroll",
			"overflow-x": 		"hidden",
			"overflow-y": 		"scroll"
		});
		
		var hintWidth = 700;
		var hintHeight = 130;
		var transitionSpeed = 0.2;
		
		var $hint = $("<div>")
		.css({
			"position": 		"absolute",
			"z-index": 		500,
			"top": 			100,
			"left": 		100,
			"width": 		hintWidth,
			"height":		hintHeight,
			"overflow": 		"hidden",
			"background-color": 	"white",
			"border": 		"4px solid #ff0",
			"transition": 		"all %ds ease-out".replace("%d", transitionSpeed)
		}).insertAfter($editorDivContentEditable);
	
		var imageUrl = $(".prp-page-image img").attr("src");
		
		var $hintImage = $("<img>")
		.appendTo($hint)
		.attr("src", imageUrl)
		.css({
			"position": 		"absolute",
			"transition": 		"all %ds ease-out".replace("%d", transitionSpeed),
			"margin-top": 		100,
			"margin-left": 		hintWidth / 2
		});
		
		var $ov = $("<div>")
		.appendTo($hint)
		.css({
			"position": "absolute",
			"transition": "all %ds ease-out".replace("%d", transitionSpeed),
			"top": 100,
			"left": hintWidth / 2,
			"background-color": "rgba(255, 255, 0, .5)"
		});
		
		var imageSize = {
			height: $hintImage.height(),
			width: $hintImage.width()
		};
		
		var words = json.words;
		var pageSize = json.size;
		
		for(var i in words){
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

});
