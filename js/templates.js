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
			
			$(".btn-toggle-move-dir").on('click', function(){
				$(this).find('i').toggleClass('fa-arrows-h');
				$(this).find('i').toggleClass('fa-arrows-v');
				$(this).parent().find('input').toggleClass('move-horizontal');
				$(this).parent().find('input').toggleClass('move-vertical');
			});
			
			$("input.numbers").on('input', function(){
				var input = $(this).val();
				var patt = new RegExp("^[0-9]+$");
				if( ! patt.test(input) ) {
					$(this).parent().addClass("has-error");
					return;
				}
				$(this).parent().removeClass("has-error");
			});
			
			$("input.numbers").on('blur', function(){
				if ( $(this).parent().hasClass("has-error") ) {
					$(this).focus();
				}
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
			
		move: '<div class="command-input-wrap">' + 
			'<div class="display-in-line">' +
			'<button data-toggle="tooltip" data-placement="top" title="Swap between the horizontal and vertical move direction." ' +
			'class="btn btn-default btn-toggle-move-dir btn-tooltip"><i class="fa fa-arrows-h"></i></button>' +
			'<input class="form-control numbers parm1 move-horizontal" type="number" min="0" value="<%= def_value %>">' + 
			'</div>' +
			
			'&nbsp;&nbsp;&nbsp;' +
			'<select data-toggle="tooltip" data-placement="top" title="Select an easing function for the movement." ' + 
			'class="form-control parm1-easing select-easing">' +
				'<option value="normla">Normal</option>' +
				'<option value="faster">Faster</option>' +
				'<option value="slower">Slower</option>' +
				'<option value="smooth">Smooth</option>' +
				'<option value="bounce">Bounce</option>' +
			'</select>' +
			
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
			'<select class="no-show form-control parm1-variable select-variable">' +
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
			'<select class="no-show form-control parm2-variable select-variable">' +
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
			'<select class="no-show form-control parm1-variable select-variable">' +
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
			'<select class="no-show form-control parm2-variable select-variable">' +
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
			'<select class="form-control parm1-variable select-variable">' +
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
			'<select class="no-show form-control parm2-variable select-variable">' +
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
			'<select class="no-show form-control parm2-variable select-variable">' +
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
			'<div class="form-group btn-command-wrap">' +
			'<button data-toggle="tooltip" data-placement="top" title="<%= btn.tooltip %>" ' +
			'class="btn btn-default btn-tooltip btn-full-length <%= btn.cssClass %>">' +
			'<i class="fa fa-<%= btn.iconClass %>"></i>&nbsp; <%= btn.name %></button>' +
			'</div>' +
			'<% }); %>',
			
		variableManagerEntry: '<% varTable.forEach(function ( v ) { %>' +
			'<div class="form-group input-group">' +
				'<input type="text" class="form-control" <% if(v.defalut) print("disabled") %> value="<%= v.name %>">' +
				'<span class="input-group-btn">' +
					'<button class="btn btn-danger btn-variable-manager-delete" type="button" <% if(v.defalut) print("disabled") %>>' +
						'<span class="fa fa-times"></span>' + 
					'</button>' +
				'</span>' +
			'</div>' +
			'<% }); %>',
			
		variableSelectEntry: '<% varTable.forEach(function ( v ) { %>' +
			'<option value="<%= v.name %>"><%= v.name %></option>' +
			'<% }); %>',
			
		demoProgram: '<% programs.forEach(function ( program ) { %>' +
			'<div class="panel panel-primary">' +
				'<div class="panel-heading">' +
					'<%= program.name %>' +
				'</div>' +
				'<div class="panel-body">' +
					'<%= program.description %>' +
					'<div>' +
						'<button type="button" class="btn btn-default navbar-btn">' +
							'<span class="fa fa-folder-open"></span> Load Program' +
						'</button>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<% }); %>',
	};
	
	return ide;

}( VisualIDE || {} ));