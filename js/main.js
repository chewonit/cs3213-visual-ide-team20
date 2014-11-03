$(document).ready(function(){
	$(".save-load-file").hide();
	hello.init({
		google   : "422020427556-4bvqu0mhb4p1j56sikgcgnf5a96eg81q.apps.googleusercontent.com"
	});
});

hello.on('auth.login', function(auth){
	console.log("You are signed in to Google");
	getGoogleProfileName();
});

function getGoogleProfileName() {
	hello( "google" ).api("me").then(function(json){
		/*
		var saveBtn = '<button type="button" class="btn btn-default navbar-btn navbar-btn"><span class="glyphicon glyphicon-cloud-upload"></span> Save Program</button>';
		var loadBtn = '<button type="button" class="btn btn-default navbar-btn navbar-btn"><span class="glyphicon glyphicon-cloud-download"></span> Load Program</button>';
		
		if( json.url ) {
			$("#login-area").html("Welcome <a href='" + json.url + "'>" + json.name + "</a> " + saveBtn + " " + loadBtn );
		} else {
			$("#login-area").html("Welcome " + json.name + " " + saveBtn + " " + loadBtn );
		}
		*/
		
		$("#login-area").removeClass("no-margin");
		if( json.url ) {
			$("#login-area").html("Welcome <a href='" + json.url + "'>" + json.name + "</a> ");
		} else {
			$("#login-area").html("Welcome " + json.name);
		}
		
		console.log("Hello "+ json.name);
	}, function(e){
		console.log("Whoops! " + e.error.message );
	});
}

$('#login-btn').on('click', function (e) {
	hello( 'google' ).login();
});

$('#run-btn').on('click', function (e) {
	VisualIDE.Interpreter.stop();
	VisualIDE.Interpreter.run();
});

$('#stop-btn').on('click', function (e) {
	VisualIDE.Interpreter.stop();
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
	
	var spriteName = "pikachu";
	var path = "../img/pikachu.gif";
	var canvas = initCanvas(spriteName, path);
	
	initIntepreter(canvas, spriteName);

	initLayout();
});

function initCanvas(spriteName, path) {
	var canvas = new VisualIDE.Canvas(document.getElementById('canvas'));
	// Draw default sprite
	var sprite = new VisualIDE.CanvasSprite(path);
	canvas.addSprite(spriteName, sprite);
	
	return canvas;
}

function initIntepreter(canvas, spriteName) {
	VisualIDE.Interpreter(canvas, spriteName);
}

function initLayout() {
	
	var dragDrop = new VisualIDE.DragDrop({
		commands: "ul.list-commands-raw",
		trash: "ul.list-trash",
		normal: "ul.list-procedures"
	});

	// Populate the raw static commands
	var commandsHtml = new VisualIDE.CommandsHtml();
	$('.list-commands-raw').append( commandsHtml.getAllCommandsHtml() );

	// Populate some commands into the procedures list for demonstration
	$('#list-procedures').append( commandsHtml.getCommandsDemoSetHtml() );
	
	// Initialize off canvas command list panel
	$('.command-panel-btn').on('click', function(event){
		event.preventDefault();
		$('.cd-panel').addClass('is-visible');
		$("#navbar-collapse").collapse('hide');
	});
	$('.cd-panel').on('click', function(event){
		if( $(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close-btn') ) { 
			$('.cd-panel').removeClass('is-visible');
			event.preventDefault();
		}
	});
	
	resizeAffix();
	// Re initialize affix components on browser resize
	$(window).resize(function(){
		resizeAffix();
	});
}

function resizeAffix() {
	$('.list-commands-raw').height( $(window).height() - 
		$('.list-commands-raw').offset().top - $('#list-trash').height() - 100 );
	
	if ( $(window).width() > 991 ) {
		$('.affix-container').affix({
			offset: {
				top: 0
			}
		});
		$('.cd-panel').removeClass('is-visible');
	} else {
		$(window).off('.affix');
		$('.affix-container')
			.removeClass("affix affix-top affix-bottom")
			.removeData("bs.affix");
	}
}

Backbone.history.start();
