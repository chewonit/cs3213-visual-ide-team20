hello.init({
	google   : "422020427556-4bvqu0mhb4p1j56sikgcgnf5a96eg81q.apps.googleusercontent.com"
});

hello.on('auth.login', function(auth){
	console.log("You are signed in to Google");
	getGoogleProfileName();
});

function getGoogleProfileName() {
	hello( "google" ).api("me").then(function(json){
		$("#login-area").html("Signed in as <a href='" + json.url + "'>" + json.name + "</a>");
		$("#login-area").removeClass("no-margin");
		console.log("Your name is "+ json.name + ", " + json.url);
	}, function(e){
		console.log("Whoops! " + e.error.message );
	});
}

$('#login-btn').on('click', function (e) {
	hello( 'google' ).login();
});

var HomeView = Backbone.View.extend({
  el: '.page',
  render: function () {
	this.$el.html("<h4>HelloWorld</h4>");
  }
});

var homeView = new HomeView();

var Router = Backbone.Router.extend({
	routes: {
	  "": "home"
	}
});

var router = new Router();
router.on('route:home', function() {
  // render home view
  homeView.render();
});

Backbone.history.start();

YUI().use('dd-delegate', 'dd-drop-plugin', 'dd-proxy', 'dd-constrain', 'dd-drop', function (Y) {

    var commandNodes = new Y.DD.Delegate({
        container: '#dashboard',
        nodes: '.command',
        target: true
    });

    commandNodes.dd.plug(Y.Plugin.DDProxy, {
        moveOnEnd: false,
        cloneNode: true
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
        //Get our drag object
        var drag = e.target;
        //Set some styles here
        drag.get('node').setStyle('opacity', '.25');
        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
        drag.get('dragNode').setStyles({
            opacity: '.5',
            borderColor: drag.get('node').getStyle('borderColor'),
            backgroundColor: drag.get('node').getStyle('backgroundColor')
        });
    });
	commandNodes.on('drag:end', function(e) {
        var drag = e.target;
        //Put our styles back
        drag.get('node').setStyles({
            visibility: '',
            opacity: '1'
        });
    });
	
	commandNodes.on('drop:over', function(e) {
		//Get a reference to our drag and drop nodes
		var drag = e.drag.get('node'),
			drop = e.drop.get('node');

		if (drag.hasClass("command-raw")) {
			return false;
		}
			
		if (!drop.get('parentNode').hasClass("droppable")) {
			return false;
		}
		
		if (drop.get('tagName').toLowerCase() === 'li') {
			//Are we not going up?
			if (!goingUp) {
				drop = drop.get('nextSibling');
			}
			//Add the node to this list
			e.drop.get('node').get('parentNode').get('parentNode').insertBefore(drag, drop);
			//Resize this nodes shim, so we can drop on it later.
			e.drop.sizeShim();
		}
	});
	
	commandNodes.on('drag:drophit', function(e) {
		var drop = e.drop.get('node'),
			drag = e.drag.get('node');
			
		if (drop.hasClass("command-raw")) {
	            return false;   
	        }
		
		if (drop.hasClass("list-trash")){
			if (drag.hasClass("command-raw")){
				return false;
			}
			drag.remove();
			commandNodes.syncTargets();
			return false;
		}
		
		if (drag.hasClass("command-raw")){
			drag = spawnCommand(drag);
			
			if (drop.get('tagName').toLowerCase() === 'li') {
				e.drop.get('node').get('parentNode').get('parentNode').insertBefore(drag, drop);
				e.drop.sizeShim();
			} else {
				drop.appendChild(drag);
			}
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

    var uls = Y.Node.all('.list-trash, .list-procedures');
    uls.each(function (v, k) {
        var tar = new Y.DD.Drop({
            node: v
        });
    });
	
	commandNodes.syncTargets();
	
});

function spawnCommand(node) {
    if (node.hasClass("command-raw")) {
		var id = node.getData("command-id");
        return '<li class="command">Command ' + id + '</li>';
    }
}
