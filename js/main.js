$(document).ready(function(){
	$(".save-load-file").hide();
});

$('#run-btn').on('click', function (e) {
	Interpreter.stop();
	Interpreter.run();
});

$('.btn-clear-procedure').on('click', function (e) {
    $('#list-procedures').html("");
});

$('#login-btn').on('click', function (e) {
	loginGoogle();
});

$('#dropbox-btn').on('click', function (e) {
    loginDropbox();
});

$('#save-btn').on('click', function (e) {
	if(loggedIntoGoogle()){
		saveToGoogle();
	} else if(loggedIntoDropbox()){
		saveToDropbox();
	} else {
		alert("An error has occurred. Please try to refresh this page.");
	}
});

$('#load-btn').on('click', function (e) {
	if(loggedIntoGoogle()){
		loadFromGoogle();
	} else if(loggedIntoDropbox()){
		loadFromDropbox();
	} else {
		alert("An error has occurred. Please try to refresh this page.");
	}
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
	
	// Needs for better design on the placement of this
	// initialization method.
	// However, it can only be called when the document is loaded.
	VisualIDE.Templates.init();
});

function initCanvas(spriteName, path) {
	var canvas = new VisualIDE.Canvas(document.getElementById('canvas'));
	// Draw default sprite
	var sprite = new VisualIDE.CanvasSprite(path);
	canvas.addSprite(spriteName, sprite);
	
	return canvas;
}

function initIntepreter(canvas, spriteName) {
	Interpreter.init(canvas, spriteName);
}

function initLayout() {
	
	var dragDrop = new VisualIDE.DragDrop({
		commands: "ul.list-commands-raw",
		trash: "ul.list-trash",
		normal: "ul.list-procedures"
	});

	// Populate the raw static commands
	var commandsHtml = new VisualIDE.CommandsHtml();
	$('.list-commands-raw').append( commandsHtml.populateRawCommands() );
	commandsHtml.initCommands();
	
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
	
	var varManager = VisualIDE.VariableManager;
	varManager.init( {
		container: $('#variable-manager-entries'),
		addBtn: '#btn-variable-manager-add',
		delBtn: '.btn-variable-manager-delete',
		selectContainer: '.select-variable'
	});
	
	resizeAffix();
	// Re initialize affix components on browser resize
	$(window).resize(function(){
		resizeAffix();
	});
}

function resizeAffix() {
	$('.col-commands .list-commands-raw').height( $(window).height() - 
		$('.col-commands .list-commands-raw').offset().top - $('#list-trash').height() - 100 );
	
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
