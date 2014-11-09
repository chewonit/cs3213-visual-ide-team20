var CLIENT_ID = '476091012309-vk0asq3o4itkrh7jqvke3hm49t47qog5.apps.googleusercontent.com';
var SCOPES = [
'https://www.googleapis.com/auth/drive.appfolder',
'https://www.googleapis.com/auth/userinfo.email',
'https://www.googleapis.com/auth/userinfo.profile',
];

function loginGoogle() {
	gapi.auth.authorize(
		{'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false}, handleAuthResult);
}

function loggedIntoGoogle(){
	if(gapi.auth.getToken()){
		return true;
	}
	return false;
}

function handleClientLoad() {
	window.setTimeout(checkAuth, 1);
}

function checkAuth() {
	gapi.auth.authorize(
		{'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},
		handleAuthResult);
}

function setGoogleProfile(obj) {
	$("#login-area").removeClass("no-margin");
	$("#login-area").html("Welcome  <a href='" + obj.link + "'>"+ obj.given_name+" <img src='"+obj.picture+"' class='img-circle' width='20'></a>");
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
				$(".save-load-file").show();
				console.log("You are signed in to Google");
			});
		});		
	} else {
		console.log("You are not signed in to Google");
	}
}

function saveToGoogle(){
	var request = gapi.client.drive.files.list({'q': '\'appfolder\' in parents'});
	request.execute(function(results) {
		var data = results.items;
		var isFound = false;
		var fileId = null;
		for (i = 0; i < data.length; i++) {
			if ( data[i].title == "visual_ide_20_saved_data" ) {
				isFound = true;
				fileId = data[i].id;
				break;
			}
		}

		$("input").each(function(){
			$(this).attr("value", $(this).val());
		});

		$("ul.list-procedures select").each(function(){
			this.options[this.options.selectedIndex].setAttribute("selected","selected");
		});

		var procedures = $('ul.list-procedures').html();
		var variables = $('#variable-manager-entries').html();
		var sprites = $('#sprite-manager-entries').html();

		var dataToSave = procedures+'--=--'+variables+'--=--'+sprites;

		var mdata = {
			title:"visual_ide_20_saved_data",
			mimeType:"text/html",
			parents: [{'id': 'appfolder'}]
		};
		
		if(isFound){
			uploadString(fileId, dataToSave, mdata, null);
		} else {
			uploadString(null, dataToSave, mdata, null);
		}
	});	
}

function loadFromGoogle(canvas){
	$('ul.list-procedures').html('<div id=\'loading-div\'><img src=\'../img/loading.gif\'></div>');
	var request = gapi.client.drive.files.list({'q': '\'appfolder\' in parents'});
	request.execute(function(results) {
		var data = results.items;
		var isFound = false;
		var fileId = null;
		for (i = 0; i < data.length; i++) {
			if ( data[i].title == "visual_ide_20_saved_data" ) {
				isFound = true;
				fileId = data[i].id;
				break;
			}
		}

		if(isFound){
			var request = gapi.client.drive.files.get({'fileId': fileId});
			request.execute(function(file) {
				if (file.downloadUrl) {
					var accessToken = gapi.auth.getToken().access_token;
					var xhr = new XMLHttpRequest();
					xhr.open('GET', file.downloadUrl);
					xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
					xhr.onload = function() {
						var storedData = xhr.responseText;
						var processedStoredData = storedData.split('--=--');
						$('ul.list-procedures').html(processedStoredData[0]);
						$('#variable-manager-entries').html(processedStoredData[1]);
						$('#sprite-manager-entries').html(processedStoredData[2]);

						var i;
						var spriteTableArray = VisualIDE.SpriteManager.spriteTable;
						var varTableArray = VisualIDE.VariableManager.varTable;
						
						for(i=1; i<spriteTableArray.length; i++){
							canvas.removeSprite(spriteTableArray[i].name);
							spriteTableArray.splice(i, 1);
						}

						for(i=3; i<varTableArray.length; i++){
							varTableArray.splice(i, 1);
						}
						
						var spriteimg_array = $("#sprite-manager-entries img").map(function() {
							return $(this).attr("src");
						});

						var spritename_array = $("#sprite-manager-entries input").map(function() {
							return $(this).attr("value");
						});

						var varname_array = $("#variable-manager-entries input").map(function() {
							return $(this).attr("value");
						});

						for (i = 3; i < varname_array.length; i++) {
							VisualIDE.VariableManager.varTable.push({
								name: varname_array[i],
								defalut: false,
							});
						}

						for (i = 1; i < spriteimg_array.length; i++) {
							var sprite = new VisualIDE.CanvasSprite(spriteimg_array[i]);
							
							VisualIDE.SpriteManager.spriteTable.push({
								name: spritename_array[i],
								target: "sprite",
								url: spriteimg_array[i],
								defalut: false,
							});

							canvas.addSprite(spritename_array[i], sprite);
							initIntepreter(canvas, spritename_array[i]);
						}

						VisualIDE.VariableManager.refreshView();
						VisualIDE.VariableManager.refreshSelectVeiws();
						VisualIDE.SpriteManager.refreshView();
						VisualIDE.SpriteManager.refreshSelectVeiws();

					};
					xhr.onerror = function() {
						alert("No record was found!");
					};
					xhr.send();
				} else {
					alert("No record was found!");
				}
			});
	} else {
		alert("No record was found!");
	}
	});

	function addVar( that, name ) {
		var objVar = {};
		objVar.defalut = false;
		objVar.name = name;
		objVar.value = 0;
		
		for ( var i=0; i<that.varTable.length; i++ ) {
			if ( that.varTable[i].name.toLowerCase() == name.toLowerCase() ) {
				return;
			}
		}
		
		that.varTable.push(objVar);
	}

	function addSprite( that, name, url, target ) {
		var objVar = {};
		objVar.defalut = false;
		objVar.name = name;
		objVar.url = url;
		objVar.target = target;

		for ( var i=0; i<that.spriteTable.length; i++ ) {
			if ( that.spriteTable[i].name.toLowerCase() == name.toLowerCase() ) {
				return;
			}
		}

		that.spriteTable.push(objVar);
		refreshManagerView( $('#sprite-manager-entries-container'), { spriteTable: that.spriteTable }, VisualIDE.Templates.spriteManagerEntry );
	}
}

function uploadString(fileId, string, metadata, callback) {
	var data = generateMultipartData(string, metadata);
	if(!fileId){
		uploadMultipart(data.body, data.boundary, callback);
	} else {
		updateMultipart(fileId, data.body, data.boundary, callback);
	}
	alert("Procedures saved!");
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
		};
	}
	request.execute(callback);
}

function updateMultipart(fileId, body, boundary, callback) {
	var request = gapi.client.request({
		'path': '/upload/drive/v2/files/'+fileId,
		'method': 'PUT',
		'params': {'uploadType': 'multipart'},
		'headers': {
			'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
		},
		'body': body});
	if (!callback) {
		callback = function(file) {
		};
	}
	request.execute(callback);
}

function generateMultipartData(data, metadata) {
	var boundary = '-------314159265358979323846';
	var delimiter = "\r\n--" + boundary + "\r\n";
	var close_delim = "\r\n--" + boundary + "--";

	var base64Data = btoa(data);
	var body = delimiter +
	'Content-Type: application/json\r\n\r\n' +
	JSON.stringify(metadata) +
	delimiter +
	'Content-Type: ' + metadata.mimeType + '\r\n' +
	'Content-Transfer-Encoding: base64\r\n' +
	'\r\n' +
	base64Data +
	close_delim;

	return {
		body: body,
		boundary: boundary
	};
}