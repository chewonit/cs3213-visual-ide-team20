$(document).ready(function(){
	$("ul.save-load-file").hide();
});

$('#run-btn').on('click', function (e) {
	Interpreter.stop();
	Interpreter.run();
});

$('.btn-clear-procedure').on('click', function (e) {
    $('#list-procedures').html("");
});

var HomeView = Backbone.View.extend({
	el: '.page',
	render: function () {
		//this.$el.html("<h4>HelloWorld</h4>");
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

// Create a new rendering area.
jQuery(document).ready(function() {
	$("save-load-file").hide();
	var canvas = new VisualIDE.Canvas(document.getElementById('canvas'));
	// Draw default sprite
	var sprite = new VisualIDE.CanvasSprite("../img/pikachu.gif");
	var spriteName = "pikachu";
	canvas.addSprite(spriteName, sprite);
	Interpreter.init(canvas, spriteName);

	var dragDrop = new VisualIDE.DragDrop({
		commands: "ul.list-commands-raw",
		trash: "ul.list-trash",
		normal: "ul.list-procedures"
	});
	
	// Populate the raw static commands
	var commandsHtml = new VisualIDE.CommandsHtml();
	$('#list-commands-raw').append( commandsHtml.getAllCommandsHtml() );

	// Populate some commands into the procedures list for demonstration
	$('#list-procedures').append( commandsHtml.getCommandsDemoSetHtml() );
	
	/*
	$('.affix-container').affix({
		offset: {
			top: 0
		}
	});
	*/
});

Backbone.history.start();
