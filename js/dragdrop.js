var VisualIDE = (function(ide) {

	var dragGroup = "VisualIDE";

	// Defines the containers for the drag and drop initialization
	var containers = {
		commands: "",
		trash: "",
		normal: ""
	};

	// 
	// Parameters
	// commands: 	The command list container. Commands can only be dragged out of the container.
	// trash: 		The trash container. Commands can only be dragged into the container.
	// normal:		All other containers that will allow for both dragging and dropping functionality.	
	//
	ide.DragDrop = function( _containers ) {
	
		try
		{
			if ( _containers.commands ) {
				containers.commands = _containers.commands;
			} else {
				throw "VisualIDE.DragDrop: commands parameter is empty.";
			}
			if ( _containers.trash ) {
				containers.trash = _containers.trash;
			} else {
				throw "VisualIDE.DragDrop: draggableOnly parameter is empty.";
			}
			if ( _containers.normal ) {
				containers.normal = _containers.normal;
			} else {
				throw "VisualIDE.DragDrop: draggableOnly parameter is empty.";
			}
			
			initDragDrop();
			
		} catch(err) {
			console.error("VisualIDE.DragDrop: Invalid parameters. Aborting initialization.");
			console.error("VisualIDE.DragDrop: " + err );
			return false;
		}
		
		console.log("VisualIDE.DragDrop: Initialized!");
	};
		
	var pageScrollOptions = {
		scrollDistance: 100,
		scrollDistanceMobile: 50,
		scrollThreshold: 50,
		scrollThresholdMobile: 100,
		isScrolling: false,
		isDragging: false
	};
	
	var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	
	var initDragDrop = function() {
	
		var oldContainer;
		$( containers.normal ).sortable({
			group: dragGroup,
			handle: 'i',
			onDragStart: function (item, container, _super) {
				// Duplicate items of the no drop area
				if (!container.options.drop) item.clone().insertAfter(item);
				pageScrollOptions.isDragging = true;
				$( containers.normal ).height( $( containers.normal ).height() + item.height()/2 );
				_super(item);
			},
			afterMove: function (placeholder, container) {
				if (oldContainer != container) {
					if (oldContainer) oldContainer.el.removeClass("active");
					container.el.addClass("active");
					oldContainer = container;
				}
			},
			onDrop: function (item, container, _super) {
				container.el.removeClass("active");
				$( containers.normal ).css({'height' : 'auto'});
				pageScrollOptions.isDragging = false;
				if (!container.options.drag) {
					item.remove();
					return;
				}
				if (item) _super(item);
			}
		});

		$( containers.commands ).sortable({
			group: dragGroup,
			drop: false
		});

		$( containers.trash ).sortable({
			group: dragGroup,
			drag: false
		});
		
		initPageScrollOnDrag();
	};
	
	/*
	 * Add listeners to the mouse move and touch move events to scroll
	 * the page when the user drags the drag item beyond the window boundary.
	 */
	var initPageScrollOnDrag = function() {
		$( document ).on('mousemove', function(e) {
			var yPos = e.pageY;
			yPos = yPos - $(window).scrollTop();
			scrollPage(yPos, pageScrollOptions.scrollDistance, pageScrollOptions.scrollThreshold);
		});

		document.addEventListener('touchmove', function(e) {
			var yPos = e.touches[0].pageY;
			yPos = yPos - $(window).scrollTop();
			scrollPage(yPos, pageScrollOptions.scrollDistanceMobile, pageScrollOptions.scrollThresholdMobile);
		}, false);
	};
	
	var scrollPage = function(yPos, distance, threshold) {
		if ( !pageScrollOptions.isDragging ) return;
		if ( $('body,html').height() < $(window).height() ) return;
		
		// Scroll down page
		if ( yPos > $(window).height() - threshold && !pageScrollOptions.isScrolling ) {
			animateScrollPage(distance);
		}
		// Scroll up page
		if ( yPos < threshold && !pageScrollOptions.isScrolling ) {
			animateScrollPage(-distance);
		}
	};
	
	var animateScrollPage = function(distance) {
		pageScrollOptions.isScrolling = true;
		var target = is_chrome ? $(document.body) : $('body,html');
		target.animate({ 
			scrollTop: target.scrollTop() + distance + "px"
		}, 100, function(){
			pageScrollOptions.isScrolling = false;
		});
	};
	
	return ide;

}( VisualIDE || {} ));


var VisualIDE = (function(ide) {

	ide.CommandsHtml = function() {
		console.log("VisualIDE.CommandHtml: Initialized!");
	};
	
	var cmd = ide.CommandsHtml;
	var cmdList = cmdDef.cmds;
	var tpl = ide.Templates;
	
	cmd.prototype.getCommandHtml = function(id) {
		var template = tpl.master;
		var command = cmdList[id];
		
		var compiled = _.template( template );
		var templateFn = _.template( tpl.secondary );
		
		var html = compiled( {model: command, templateFn: templateFn } );
		
		return html;
	};
	
	cmd.prototype.getAllCommandsHtml = function() {
		var html = "";
		var command;
		for( i=0; i<cmdList.length; i++ ) {
			html += this.getCommandHtml(i);
		}
		for( i=0; i<cmdList.length; i++ ) {
			html += this.getCommandHtml(i);
		}
		for( i=0; i<cmdList.length; i++ ) {
			html += this.getCommandHtml(i);
		}
		
		return html;
	};
	
	cmd.prototype.getCommandsDemoSetHtml = function() {
		var html = "";
		html += this.getCommandHtml(0);
		html += this.getCommandHtml(1);
		
		var loopNode = $( this.getCommandHtml(7) );
		loopNode.find("ul").append( this.getCommandHtml(4) );
		html += $('<div>').append(loopNode.clone()).html();
		
		return html;
	};
	
	return ide;

}( VisualIDE || {} ));
