hello.init({
	google   : "422020427556-4bvqu0mhb4p1j56sikgcgnf5a96eg81q.apps.googleusercontent.com"
});

hello.on('auth.login', function(auth){
	console.log("You are signed in to Google");
	getGoogleProfileName();
});

function getGoogleProfileName() {
	hello( "google" ).api("me").then(function(json){
		var saveBtn = '<button type="button" class="btn btn-default navbar-btn navbar-btn"><span class="glyphicon glyphicon-cloud-upload"></span> Save Program</button>';
		var loadBtn = '<button type="button" class="btn btn-default navbar-btn navbar-btn"><span class="glyphicon glyphicon-cloud-download"></span> Load Program</button>';
		$("#login-area").html("Welcome <a href='" + json.url + "'>" + json.name + "</a> " + saveBtn + " " + loadBtn );
		//$("#login-area").removeClass("no-margin");
		console.log("Your name is "+ json.name + ", " + json.url);
	}, function(e){
		console.log("Whoops! " + e.error.message );
	});
}

$('#login-btn').on('click', function (e) {
	hello( 'google' ).login();
});

$('#run-btn').on('click', function (e) {
    Interpreter.run();
});

$('#btn-clear-procedure').on('click', function (e) {
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

});

Backbone.history.start();
