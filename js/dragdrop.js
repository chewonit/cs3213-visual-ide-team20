var VisualIDE = (function(ide) {

	ide.dd = {};
	var dd = ide.dd;
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

VisualIDE.dd.executeDragAndDrop();