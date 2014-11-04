var VisualIDE = (function(ide) {

	var tpl = ide.Templates;
	var container;
	var selectContainer;
	
	var update = "varTableUpdate";
	
	
	ide.VariableManager = {
		
		varTable: [
			{
				name: "count",
				defalut: true,
			},
			{
				name: "value",
				defalut: true,
			},
			{
				name: "total",
				defalut: true,
			}
		],
		
		init: function( parms ) {
			
			container = parms.container;
			selectContainer = parms.selectContainer;
			
			var that = this;
			
			$(document).on('click', parms.addBtn, function() {
				var name = $(this).parent().parent().find('input').val();
				if ( !name ) return;
				
				$(this).parent().parent().find('input').val('');
				
				addVar( that, name );
				refreshVariableManagerView( that );
				triggerSelectViewUpdate();
			});
			
			$(document).on('click', parms.delBtn, function() {
				var name = $(this).parent().parent().find('input').val();
				
				deleteVar( that, name );
				refreshVariableManagerView( that );
				triggerSelectViewUpdate();
			});
			
			refreshVariableManagerView( this );
			
			$(document).on( update, selectContainer, function() {
				var selected = $(this).val();
				refreshVariableSelectView( that, $(this) );
				$(this).val( selected );
				if( !$(this).val() ) $(this)[0].selectedIndex = 0;
			});
			triggerSelectViewUpdate();
		},
		
	};
	
	function addVar( that, name ) {
		var objVar = {};
		objVar.defalut = false;
		objVar.name = name;
		
		for ( var i=0; i<that.varTable.length; i++ ) {
			if ( that.varTable[i].name.toLowerCase() == name.toLowerCase() ) {
				return;
			}
		}
		
		that.varTable.push(objVar);
	}
	
	function deleteVar( that, name ) {
		for ( var i=0; i<that.varTable.length; i++ ) {
			if ( that.varTable[i].name.toLowerCase() == name.toLowerCase() ) {
				that.varTable.splice(i,1);
				break;
			}
		}
	}
	
	function refreshVariableSelectView( that, selectContainer ) {
		var compiled = _.template( tpl.variableSelectEntry );
		var html = compiled( { varTable: that.varTable } );
		
		selectContainer.html( html );
	}
	
	function refreshVariableManagerView( that ) {
		var compiled = _.template( tpl.variableManagerEntry );
		var html = compiled( { varTable: that.varTable } );
		
		container.html( html );
	}
	
	function triggerSelectViewUpdate() {
		$( selectContainer ).trigger( update );
	}
	
	return ide;

}( VisualIDE || {} ));

var VisualIDE = (function(ide) {

	ide.SpriteManager = {
		
		spriteTable: [
			{
				name: "main",
				target: undefined,
				defalut: true,
			}
		],
	};
	
	return ide;

}( VisualIDE || {} ));