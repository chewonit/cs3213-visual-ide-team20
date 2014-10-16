var VisualIDE_DD = (function(my) {

	my.dragContainer = "#dashboard";
	my.dragNodes = ".command";
	my.dropTargetClass = ".drop-target";
	
	my.commandRawClassName = "command-raw";
	my.commandDragClass = "command-drag";
	my.commandInTransitClass = "command-in-transit";
	my.commandNewClass = "command-new";
	
	my.spawnCommand = function(node) {
		if (node.hasClass( my.commandRawClassName )) {
			var id = node.getData("command-id");
			return '<li class="command command-new" data-command-id="' + id + '">Command ' + id + '</li>';
		}
	};
	
	my.animateNewCommand = function(drag) {
		setTimeout((function(s){
			return function() { //rename shape to s in the new scope.
				drag.removeClass( my.commandNewClass );
			};
		})(drag), 100);
	};
	
	return my;

}( VisualIDE_DD || {} ));


YUI().use('node', 'dd-delegate', 'dd-drop-plugin', 'dd-proxy', 'dd-constrain', 'dd-drop', function (Y) {
	
	var dd = VisualIDE_DD;

    var commandNodes = new Y.DD.Delegate({
        container: dd.dragContainer,
        nodes: dd.dragNodes,
		target: true
    });

    commandNodes.dd.plug(Y.Plugin.DDProxy, {
        moveOnEnd: false,
        cloneNode: true
    });
	
	commandNodes.dd.plug(Y.Plugin.DDConstrained, {
		constrain2node: dd.dragContainer
    });	
	
	//Static Vars
    var goingUp = false, lastY = 0;
	commandNodes.on('drag:drag', function(e) {
		//Get the last y point
		var y = e.target.lastXY[1];
		//is it greater than the lastY var?
		if (y < lastY) {
			//We are going up
			goingUp = true;
		} else {
			//We are going down.
			goingUp = false;
		}
		//Cache for next check
		lastY = y;
	});
	
	commandNodes.on('drag:start', function(e) {
		var drag = e.target;
        //Set some styles here
        drag.get('node').addClass( dd.commandInTransitClass );
        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
        drag.get('dragNode').addClass( dd.commandDragClass );
		Y.all(".yui3-dd-drop-over").removeClass("yui3-dd-drop-over");
    });
	commandNodes.on('drag:end', function(e) {
        var drag = e.target;
        drag.get('node').removeClass( dd.commandInTransitClass );
    });
	
	commandNodes.on('drop:over', function(e) {
		//Get a reference to our drag and drop nodes
		var drag = e.drag.get('node'),
			drop = e.drop.get('node');	
			
		if (drag.hasClass( dd.commandRawClassName ) || drop.hasClass( dd.commandRawClassName )) {
			return false;
		}
		
		if (drop.get('tagName').toLowerCase() === 'li') {
			
			//Are we not going up?
			if (!goingUp) {
				drop = drop.get('nextSibling');
			}
			//Add the node to this list
			e.drop.get('node').get('parentNode').insertBefore(drag, drop);
			//Resize this nodes shim, so we can drop on it later.
			e.drop.sizeShim();
			return false;
		}
	});
	
	commandNodes.on('drag:drophit', function(e) {
		var drop = e.drop.get('node'),
			drag = e.drag.get('node');
		
		if (drop.hasClass( dd.commandRawClassName )) {
			return false;   
		}
		
		if (drop.hasClass("list-trash")){
			if (drag.hasClass( dd.commandRawClassName )){
				return false;
			}
			drag.remove();
			commandNodes.syncTargets();
			return false;
		}
		
		if (drag.hasClass( dd.commandRawClassName )){
			
			drag = dd.spawnCommand(drag);
			drag = Y.Node.create(drag);
			
			if (drop.get('tagName').toLowerCase() === 'li') {
				e.drop.get('node').get('parentNode').insertBefore(drag, drop);
				e.drop.sizeShim();
			} else {
				drop.appendChild(drag);
			}
			dd.animateNewCommand(drag);
			
			commandNodes.syncTargets();
			return false;
		}
		
		if (drop.get('tagName').toLowerCase() !== 'li') {
			if (!drop.contains(drag)) {
				drop.appendChild(drag);
				commandNodes.syncTargets();
			}
		}
	});

    var uls = Y.Node.all( dd.dropTargetClass );
    uls.each(function (v, k) {
        var tar = new Y.DD.Drop({
            node: v
        });
    });
	
	commandNodes.syncTargets();
	
});