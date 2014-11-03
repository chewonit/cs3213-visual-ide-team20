var VisualIDE = (function(ide) {
	
	ide.Templates = {
	
		init: function() {
			$(".dropdown-menu li a").on('click', function(){
				var selText = $(this).text();
				$(this).parents('.btn-group').find('.dropdown-toggle').html(selText);
			});
			$("body").tooltip({ selector: '[data-toggle=tooltip]' });
		},
		
		master : '<li class="command command-raw ' +
			'<% model.classes.forEach(function ( className ) { %>' +
			'<% print( className + " " ); %>' +
			'<% }); %>' + 
	
			'" data-command-id=<%= model.id %>>' +
			'<div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4><%= model.name %></h4>' +
	
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
			
		ifCondition: '<button data-toggle="tooltip" data-placement="left" title="Swap input type between variables and numbers." ' +
			'class="btn btn-default btn-toggle-if btn-tooltip"><i class="fa fa-undo"></i></button>' +
			
			'<input id="parm1" class="form-control numbers" type="number" min="0" value="<%= def_value %>">' + 
			'&nbsp;&nbsp;&nbsp;' +
			'<div class="btn-group"> <a class="btn btn-default dropdown-toggle btn-select" data-toggle="dropdown" href="#">&lt;</span></a>' +
				'<ol class="dropdown-menu">' +
					'<li><a href="#">=</a></li>' +
					'<li><a href="#">&lt;</a></li>' +
					'<li><a href="#">&gt;</a></li>' +
					'<li><a href="#">!=</a></li>' +
				'</ol>' +
			'</div>' +
			'&nbsp;&nbsp;&nbsp;' +
			'<button data-toggle="tooltip" data-placement="left" title="Swap input type between variables and numbers." ' +
			'class="btn btn-default btn-toggle-if"><i class="fa fa-undo"></i></button>' +
			
			'<input id="parm1" class="form-control numbers" type="number" min="0" value="<%= def_value %>">' + 
			'<ul></ul><h4 class="sub-heading">Else</h4><ul></ul>',
	};
	
	return ide;

}( VisualIDE || {} ));