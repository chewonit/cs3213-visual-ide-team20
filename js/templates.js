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
			'<input id="parm1" class="form-control" placeholder="<%= placeholder %>" value="<%= def_value %>">' + 
			'<% }); %>' +
			
			'<% extraHtml.forEach(function (extraHtml) { %>' +
			'<%= extraHtml %>' + 
			'<% }); %>',
			
		whileCondition: '<input id="parm1" class="form-control" value="<%= def_value %>">' + 
			'<ul></ul>',
			
		ifCondition: '<input id="parm1" class="form-control" value="<%= def_value %>">' + 
			'<ul></ul><h4 class="sub-heading">Else</h4><ul></ul>',
	};
	
	return ide;

}( VisualIDE || {} ));
