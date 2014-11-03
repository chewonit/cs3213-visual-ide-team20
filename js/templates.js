var VisualIDE = (function(ide) {
	
	ide.Templates = {
		
		master : '<li class="command command-raw ' +
			'<% model.classes.forEach(function ( className ) { %>' +
			'<% print( className + " " ); %>' +
			'<% }); %>' + 
	
			'" data-command-id=<%= model.id %>>' +
			'<div class="handle"><i class="fa fa-bars fa-2x"></i></div><h4><%= model.name %></h4>' +
	
			'<%= templateFn( model ) %>' +
			
			'</li>',
			
		secondary: '<% parms.forEach(function (placeholder) { %>' +
			'<input id="parm1" class="form-control" placeholder="<%= placeholder %>">' + 
			'<% }); %>' +
			
			'<% extraHtml.forEach(function (extraHtml) { %>' +
			'<%= extraHtml %>' + 
			'<% }); %>'
	};
	
	return ide;

}( VisualIDE || {} ));
