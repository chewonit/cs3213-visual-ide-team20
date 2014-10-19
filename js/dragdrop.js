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
	
	var initDragDrop = function() {
	
		var oldContainer;
		$( containers.normal ).sortable({
			group: dragGroup,
			onDragStart: function (item, container, _super) {
				// Duplicate items of the no drop area
				if (!container.options.drop) item.clone().insertAfter(item);
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
	};
	
	return ide;

}( VisualIDE || {} ));


var VisualIDE = (function(ide) {

	ide.CommandList = [
		{
			id: 0,
			name: "Set Horizontal Position",
			parms: ['Horizontal position'],
			classes: [],
			extraHtml: []
		},
		{
			id: 1,
			name: "Set Vertical Position",
			parms: ['Vertical position'],
			classes: [],
			extraHtml: []
		},
		{
			id: 2,
			name: "Show Character",
			parms: [],
			classes: [],
			extraHtml: []
		},
		{
			id: 3,
			name: "Hide Character",
			parms: [],
			classes: [],
			extraHtml: []
		},
		{
			id: 4,
			name: "Move",
			parms: ['Steps'],
			classes: [],
			extraHtml: []
		},
		{
			id: 5,
			name: "Change Costume",
			parms: ['Image URL'],
			classes: [],
			extraHtml: []
		},
		{
			id: 6,
			name: "Change Background",
			parms: ['Image URL'],
			classes: [],
			extraHtml: []
		},
		{
			id: 7,
			name: "Repeat",
			parms: ['Number of reptitions'],
			classes: ["command-loop"],
			extraHtml: ["<ul></ul>"]
		},
	];

	ide.CommandsHtml = function() {
		console.log("VisualIDE.CommandHtml: Initialized!");
	};
	
	var cmd = ide.CommandsHtml;
	var cmdList = ide.CommandList;
	
	cmd.prototype.getCommandHtml = function(id) {
		var html = "";
		var command = cmdList[id];
		html += '<li class="command command-raw ';
		
		for( j=0; j<command.classes.length; j++ ) {
			var c = command.classes[j];
			html += c + ' ';
		}
		html += '"';
		
		html += 'data-command-id=' + command.id + '>';
		html += '<h4>' + command.name + '</h4>';
		
		for( j=0; j<command.parms.length; j++ ) {
			var placeholder = command.parms[j];
			html += '<input id="parm1" class="form-control" placeholder="' + placeholder + '">';
		}
		
		for( j=0; j<command.extraHtml.length; j++ ) {
			var extraHtml = command.extraHtml[j];
			html += extraHtml;
		}
		html += ('</li>');
		return html;
	};
	
	cmd.prototype.getAllCommandsHtml = function() {
		var html = "";
		var command;
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
