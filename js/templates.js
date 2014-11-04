var VisualIDE = (function(ide) {
	
	ide.Templates = {
	
		init: function() {
			$(".dropdown-menu li a").on('click', function(){
				var selText = $(this).text();
				$(this).parents('.btn-group').find('.dropdown-toggle').html(selText);
			});
			$(".btn-toggle-if").on('click', function(){
				$(this).parent().find('select').toggleClass('no-show');
				$(this).parent().find('input').toggleClass('no-show');
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
			
		secondary: '<div class="command-input-wrap">' + 
			'<% parms.forEach(function (placeholder) { %>' +
			'<input class="form-control parm1" placeholder="<%= placeholder %>" value="<%= def_value %>">' + 
			'<% }); %>' +
			'</div>' +  // END of command input wrap
			
			'<% extraHtml.forEach(function (extraHtml) { %>' +
			'<%= extraHtml %>' + 
			'<% }); %>',
		
		textInput: '<div class="command-input-wrap">' + 
			'<input class="form-control parm1" value="<%= def_value %>">' + 
			'</div>' ,  // END of command input wrap
		
		numberInput: '<div class="command-input-wrap">' + 
			'<input class="form-control numbers parm1" type="number" min="0" value="<%= def_value %>">' + 
			'</div>' ,  // END of command input wrap

		loop: '<ul></ul>',			
		
		repeat: '<div class="command-input-wrap">' + 
			'<input class="form-control numbers parm1" type="number" min="0" value="<%= def_value %>">' + 
			'</div>' +  // END of command input wrap
			'<ul></ul>',
			
		loopWhile: '<div class="command-input-wrap">' + 
			'<div class="display-in-line">' +
			'<button data-toggle="tooltip" data-placement="top" title="Swap input type between variables and numbers." ' +
			'class="btn btn-default btn-toggle-if btn-tooltip"><i class="fa fa-undo"></i></button>' +
			'<select class="no-show form-control parm1-variable">' +
				'<option value="volvo">Volvo</option>' +
				'<option value="saab">Saab</option>' +
				'<option value="mercedes">Mercedes</option>' +
				'<option value="audi">Audi</option>' +
			'</select>' +
			'<input class="form-control numbers parm1-value" type="number" min="0" value="<%= def_value %>">' + 
			'</div>' +
			
			'&nbsp;&nbsp;&nbsp;' +
			'<div class="btn-group operator"> <a class="btn btn-default dropdown-toggle btn-select" data-toggle="dropdown" href="#">&lt;</span></a>' +
				'<ol class="dropdown-menu">' +
					'<li><a href="#">=</a></li>' +
					'<li><a href="#">&lt;</a></li>' +
					'<li><a href="#">&gt;</a></li>' +
					'<li><a href="#">!=</a></li>' +
				'</ol>' +
			'</div>' +
			'&nbsp;&nbsp;&nbsp;' +
			
			'<div class="display-in-line">' +
			'<button data-toggle="tooltip" data-placement="top" title="Swap input type between variables and numbers." ' +
			'class="btn btn-default btn-toggle-if btn-tooltip"><i class="fa fa-undo"></i></button>' +
			'<select class="no-show form-control parm2-variable">' +
				'<option value="volvo">Volvo</option>' +
				'<option value="saab">Saab</option>' +
				'<option value="mercedes">Mercedes</option>' +
				'<option value="audi">Audi</option>' +
			'</select>' +
			'<input class="form-control numbers parm2-value" type="number" min="0" value="<%= def_value %>">' + 
			'</div>' +
			
			'</div>' + // END of command input wrap
			'<ul></ul>',
			
		ifCondition: '<div class="command-input-wrap">' + 
			'<div class="display-in-line">' +
			'<button data-toggle="tooltip" data-placement="top" title="Swap input type between variables and numbers." ' +
			'class="btn btn-default btn-toggle-if btn-tooltip"><i class="fa fa-undo"></i></button>' +
			'<select class="no-show form-control parm1-variable">' +
				'<option value="volvo">Volvo</option>' +
				'<option value="saab">Saab</option>' +
				'<option value="mercedes">Mercedes</option>' +
				'<option value="audi">Audi</option>' +
			'</select>' +
			'<input class="form-control numbers parm1-value" type="number" min="0" value="<%= def_value %>">' + 
			'</div>' +
			
			'&nbsp;&nbsp;&nbsp;' +
			'<div class="btn-group operator"> <a class="btn btn-default dropdown-toggle btn-select" data-toggle="dropdown" href="#">&lt;</span></a>' +
				'<ol class="dropdown-menu">' +
					'<li><a href="#">=</a></li>' +
					'<li><a href="#">&lt;</a></li>' +
					'<li><a href="#">&gt;</a></li>' +
					'<li><a href="#">!=</a></li>' +
				'</ol>' +
			'</div>' +
			'&nbsp;&nbsp;&nbsp;' +
			
			'<div class="display-in-line">' +
			'<button data-toggle="tooltip" data-placement="top" title="Swap input type between variables and numbers." ' +
			'class="btn btn-default btn-toggle-if btn-tooltip"><i class="fa fa-undo"></i></button>' +
			'<select class="no-show form-control parm2-variable">' +
				'<option value="volvo">Volvo</option>' +
				'<option value="saab">Saab</option>' +
				'<option value="mercedes">Mercedes</option>' +
				'<option value="audi">Audi</option>' +
			'</select>' +
			'<input class="form-control numbers parm2-value" type="number" min="0" value="<%= def_value %>">' + 
			'</div>' +
			
			'</div>' + // END of command input wrap
			
			'<ul></ul><h4 class="sub-heading">Else</h4><ul></ul>',
			
		assign: '<div class="command-input-wrap">' + 
			'<div class="display-in-line">' +
			'<select class="form-control parm1-variable">' +
				'<option value="volvo">Volvo</option>' +
				'<option value="saab">Saab</option>' +
				'<option value="mercedes">Mercedes</option>' +
				'<option value="audi">Audi</option>' +
			'</select>' +
			'</div>' +
			
			' = ' +
			
			'<div class="command-input-wrap">' + 
			
			'<div class="display-in-line">' +
			'<button data-toggle="tooltip" data-placement="top" title="Swap input type between variables and numbers." ' +
			'class="btn btn-default btn-toggle-if btn-tooltip"><i class="fa fa-undo"></i></button>' +
			'<select class="no-show form-control parm2-variable">' +
				'<option value="volvo">Volvo</option>' +
				'<option value="saab">Saab</option>' +
				'<option value="mercedes">Mercedes</option>' +
				'<option value="audi">Audi</option>' +
			'</select>' +
			'<input class="form-control numbers parm2-value" type="number" min="0" value="<%= def_value[0] %>">' + 
			'</div>' +
			
			'&nbsp;&nbsp;&nbsp;' +
			'<div class="btn-group operator"> <a class="btn btn-default dropdown-toggle btn-select" data-toggle="dropdown" href="#">+</span></a>' +
				'<ol class="dropdown-menu">' +
					'<li><a href="#">-</a></li>' +
					'<li><a href="#">*</a></li>' +
					'<li><a href="#">/</a></li>' +
					'<li><a href="#">%</a></li>' +
				'</ol>' +
			'</div>' +
			
			'&nbsp;&nbsp;&nbsp;' +
			'<div class="display-in-line">' +
			'<button data-toggle="tooltip" data-placement="top" title="Swap input type between variables and numbers." ' +
			'class="btn btn-default btn-toggle-if btn-tooltip"><i class="fa fa-undo"></i></button>' +
			'<select class="no-show form-control parm2-variable">' +
				'<option value="volvo">Volvo</option>' +
				'<option value="saab">Saab</option>' +
				'<option value="mercedes">Mercedes</option>' +
				'<option value="audi">Audi</option>' +
			'</select>' +
			'<input class="form-control numbers parm2-value" type="number" min="0" value="<%= def_value[1] %>">' + 
			'</div>' +
			
			'</div>' +
			
			'</div>', // END of command input wrap
			
		commandCategories: '<div class="panel-group accordion-raw-commands" id="accordion" role="tablist" aria-multiselectable="true">' +
			'<% category.forEach(function ( cat ) { %>' +
			'<%= templateFn( cat ) %>' +
			'<% }); %>' + 
			'</div>',
			
		commandCategory: '<div class="panel panel-default">' +
			'<a data-toggle="collapse" data-parent=".accordion-raw-commands" href=".collapse-<%= id %>" aria-expanded="true" aria-controls="collapse-<%= id %>">' +
				'<div class="panel-heading command-category-heading" role="tab" id="headingOne">' +
					'<h4 class="panel-title">' +
						'<%= heading %>' +
					'</h4>' +
				'</div>' +
			'</a>' +			
			'<div id="collapse-<%= id %>" class="panel-collapse collapse <% if(opened) print("in"); %> collapse-<%= id %>" role="tabpanel" aria-labelledby="headingOne">' +
				'<div class="panel-body">' +
					'<%= content %>' +
				'</div>' +
			'</div>' +
			'</div>',
			
		commandButton: '<hr />' +
			'<% buttons.forEach(function ( btn ) { %>' +
			'<div class="form-group">' +
			'<button id="<%= btn.cssId %>" data-toggle="tooltip" data-placement="top" title="<%= btn.tooltip %>" ' +
			'class="btn btn-default btn-tooltip btn-full-length">' +
			'<i class="fa fa-<%= btn.iconClass %>"></i>&nbsp; <%= btn.name %></button>' +
			'</div>' +
			'<% }); %>',
			
		
	};
	
	return ide;

}( VisualIDE || {} ));