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
		
		// console.log("VisualIDE.DragDrop: Initialized!");
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
			handle: 'i.handle',
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
	
	ide.DragDrop.disableDrag = function(id) {
		$( containers.normal ).sortable("disable");
		$( containers.commands ).sortable("disable");
		$( containers.trash ).sortable("disable");
		$( containers.normal + ' .btn' ).attr('disabled','disabled');
		$( containers.normal + ' select' ).attr('disabled','disabled');
		$( containers.normal + ' input' ).attr('disabled','disabled');
		$( containers.trash + ' button'  ).attr('disabled','disabled');
	};
	
	ide.DragDrop.enableDrag = function(id) {
		$( containers.normal ).sortable("enable");
		$( containers.commands ).sortable("enable");
		$( containers.trash ).sortable("enable");
		$( containers.normal + ' .btn' ).removeAttr('disabled');
		$( containers.normal + ' select' ).removeAttr('disabled');
		$( containers.normal + ' input' ).removeAttr('disabled');
		$( containers.trash + ' button'  ).removeAttr('disabled');
		$( document ).trigger( "miaStop" );
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
		// console.log("VisualIDE.CommandHtml: Initialized!");
	};
	
	var cmdHtml = ide.CommandsHtml;
	var cmd = ide.Commands;
	var cmdList = cmd.commands;
	var tpl = ide.Templates;
	
	cmdHtml.prototype.getCommandHtml = function(id) {
		return this.getCommandWithCategoryHtml(id, -1);
	};
	
	cmdHtml.prototype.getCommandWithCategoryHtml = function(id, catId) {
		
		var command = cmdList[id];
		
		if ( catId != -1 ) {
			if ( command.category != catId ) return "";
		}
		
		var template = tpl.master;
		
		var test = "ifCondition";
		var secondaryTemplate = command.template ? tpl[command.template] : tpl.secondary;
		
		
		var compiled = _.template( template );
		var templateFn = _.template( secondaryTemplate );
		
		var html = compiled( {model: command, templateFn: templateFn } );
		
		return html;
	};
	
	cmdHtml.prototype.populateRawCommands = function() {
		
		var html = "";
		var categories = [];
		
		var catList = cmd.categories;
		for ( i = 0; i < catList.length; i++ ) { 
			
			var catObj = {};
			var commandHtml = "";
			
			catObj.id = i;
			catObj.heading = catList[i];
			for( j=0; j<cmdList.length; j++ ) {
				commandHtml += this.getCommandWithCategoryHtml(j, i);
			}
			catObj.content = commandHtml;
			catObj.opened = (i===0) ? true : false;
			
			categories.push( catObj );
		}
		
		var compiled = _.template( tpl.commandCategories );
		var templateFn = _.template( tpl.commandCategory );
		html += compiled( {category: categories, templateFn: templateFn } );
		
		var buttons = cmd.commandButtons;
		
		compiled = _.template( tpl.commandButton );
		html += compiled( { buttons: buttons } );
			
		return html;
	};
	
	cmdHtml.prototype.getCommandsDemoSetHtml = function() {
		var html = "";
		
		var width = parseInt( $('#canvas canvas').width()/12 );
		var height = parseInt( $('#canvas canvas').height()/2 );
		
		// Initialize BG to blank
		var changeBg = $( this.getCommandHtml(10) );
		changeBg.find( 'input' ).attr( 'value', '' );
		html += $('<div>').append(changeBg.clone()).html();
		
		// Set X Position to 0
		html += this.getCommandHtml(0);
		
		// Set Y position to 200
		var setY = $( this.getCommandHtml(1) );
		setY.find('input').attr('value', height);
		html += $('<div>').append(setY.clone()).html();
		
		// Show character
		html += this.getCommandHtml(11);
			
		// Assignment to 'value' variable of 100.
		var assign = $( this.getCommandHtml(3) );
		assign.find('.parm1-variable').html('<option value="value">value</option>');
		assign.find('.parm2-value').attr( 'value', width );
		html += $('<div>').append(assign.clone()).html();
		
		// Move character with the 'value' variable
		var move = $( this.getCommandHtml(2) );
		move.find('.no-show').html('<option value="value">value</option>');
		move.find('.no-show').addClass('active');
		move.find('.no-show').removeClass('no-show');
		move.find('input').addClass('no-show');
		move.find('input').removeClass('active');
		move.find('.select-easing option:nth-child(4)').attr('selected', 'selected');
		
		// Insert the move command into a loop node
		var loopNode = $( this.getCommandHtml(7) );
		loopNode.find("input").attr( 'value', '2' );
		loopNode.find("ul").append( move );
		html += $('<div>').append(loopNode.clone()).html();
		
		// Change to the final background image
		var bg = "http://3.bp.blogspot.com/-jeUvFn97RYE/T-p2FZBhICI/AAAAAAAAHog/grtvCr-S9l4/s320/Ash_Pikachu_Thunder.png";
		changeBg.find( 'input' ).attr( 'value', bg );
		html += $('<div>').append(changeBg.clone()).html();
		
		// Hide the original character
		html += this.getCommandHtml(12);
		
		return html;
	};
	
	cmdHtml.prototype.initCommands = function() {
		$('.btn-variable-manager').on('click', function() {
			$('#variable-manager').slideToggle();
			$('#sprite-manager').slideUp();
			$('#demo-manager').slideUp();
		});
		$('.btn-sprite-manager').on('click', function() {
			$('#sprite-manager').slideToggle();
			$('#variable-manager').slideUp();
			$('#demo-manager').slideUp();
		});
		$('.btn-demo-manager').on('click', function() {
			$('#demo-manager').slideToggle();
			$('#variable-manager').slideUp();
			$('#sprite-manager').slideUp();
		});
		$('.btn-managers-close').on('click', function() {
			$( '#'+ $(this).data('target') ).slideUp();
		});
	};
	
	return ide;

}( VisualIDE || {} ));
