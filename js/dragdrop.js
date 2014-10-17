var VisualIDE = (function(ide) {

	ide.dd = {};
	var dd = ide.dd;
	
	dd.commands = [
		{
			id: 0,
			name: "Set X Position",
			parms: ['x pos'],
			classes: [],
			extraHtml: []
		},
		{
			id: 1,
			name: "Set y Position",
			parms: ['y pos'],
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
			parms: ['steps'],
			classes: [],
			extraHtml: []
		},
		{
			id: 5,
			name: "Change Costume",
			parms: ['image url'],
			classes: [],
			extraHtml: []
		},
		{
			id: 6,
			name: "Change Background",
			parms: ['image url'],
			classes: [],
			extraHtml: []
		},
		{
			id: 7,
			name: "Repeat",
			parms: ['number of reptitions'],
			classes: ["command-loop"],
			extraHtml: ["<ul></ul>"]
		},
	];
	
	dd.getCommand = function(id) {
		var html = "";
		var command = dd.commands[id];
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
	
	dd.getAllCommands = function() {
		var html = "";
		var command;
		for( i=0; i<dd.commands.length; i++ ) {
			html += dd.getCommand(i);
		}
		return html;
	};
	
	dd.dragGroup = "VisualIDE";

	dd.containers = {
		listCommandsRaw: "ul.list-commands-raw",
		listProcedures: "ul.list-procedures",
		listTrash: "ul.list-trash"
	};
	
	dd.executeDragAndDrop = function() {
		var oldContainer;
		$( dd.containers.listProcedures ).sortable({
			group: dd.dragGroup,
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

		$( dd.containers.listCommandsRaw ).sortable({
			group: dd.dragGroup,
			drop: false
		});

		$( dd.containers.listTrash ).sortable({
			group: dd.dragGroup,
			drag: false
		});
	};
	
	return ide;

}( VisualIDE || {} ));

// Populate the raw static commands
$('#list-commands-raw').append( VisualIDE.dd.getAllCommands() );

// Populate some commands into the procedures list for demonstration
$('#list-procedures').append( VisualIDE.dd.getCommand(0) );
$('#list-procedures').append( VisualIDE.dd.getCommand(1) );
var loopNode = $( VisualIDE.dd.getCommand(7) );
loopNode.find("ul").append( VisualIDE.dd.getCommand(0) );
$('#list-procedures').append( loopNode );

VisualIDE.dd.executeDragAndDrop();

	
