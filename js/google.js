var CLIENT_ID = '476091012309-vk0asq3o4itkrh7jqvke3hm49t47qog5.apps.googleusercontent.com';
var SCOPES = [
'https://www.googleapis.com/auth/drive.file',
'https://www.googleapis.com/auth/userinfo.email',
'https://www.googleapis.com/auth/userinfo.profile',
];

$('#login-btn').on('click', function (e) {
	gapi.auth.authorize(
		{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false}, handleAuthResult);
});

function handleClientLoad() {
	window.setTimeout(checkAuth, 1);
}

function checkAuth() {
	gapi.auth.authorize(
		{'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},
		handleAuthResult);
}

function setGoogleProfile(obj) {
	var saveBtn = '<button type="button" class="btn btn-default navbar-btn navbar-btn"><span class="glyphicon glyphicon-cloud-upload"></span> Save Program</button>';
	var loadBtn = '<button type="button" class="btn btn-default navbar-btn navbar-btn"><span class="glyphicon glyphicon-cloud-download"></span> Load Program</button>';
	$("#login-area").html("Welcome  <a href='" + obj.link + "'>"+ obj.given_name+"</a> "+saveBtn+" "+loadBtn);
}

function handleAuthResult(authResult) {
	if (authResult && !authResult.error) {
		gapi.auth.setToken(authResult);
		gapi.client.load('drive', 'v2', function() {
			gapi.client.load('oauth2', 'v2', function() {
				var request = gapi.client.oauth2.userinfo.get();
				request.execute(function(obj){
					setGoogleProfile(obj);
				});
			});
		});		
	} else {
		console.log("You are not signed in to Google");
	}
}

function uploadString(string, metadata, callback) {
	var data = generateMultipartData(string, metadata);
	uploadMultipart(data.body, data.boundary, callback);
}

function uploadMultipart(body, boundary, callback) {
	var request = gapi.client.request({
		'path': '/upload/drive/v2/files',
		'method': 'POST',
		'params': {'uploadType': 'multipart'},
		'headers': {
			'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
		},
		'body': body});
	if (!callback) {
		callback = function(file) {
			console.log(file);
		};
	}
	request.execute(callback);
}