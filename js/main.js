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
	hello( 'google' ).login()
})

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

var router = new Router;
router.on('route:home', function() {
  // render home view
  homeView.render();
})

Backbone.history.start();