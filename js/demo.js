var VisualIDE = (function(ide) {
	
	ide.Demo = {

		programs: [
		{
			panelId: 'demo-bouncing-ball',
			name: 'Bouncing Ball',
			description: 'A program that animates a ball to bounce.',
			procedures: '<li class="command command-raw" data-command-id="3" style=""><div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4>Hide Character</h4><div class="command-input-wrap"><div class="display-in-line"><select data-toggle="tooltip" data-placement="top" title="" class="form-control parm1-sprite select-sprite" data-original-title="Select a sprite."><option value="Pikachu" selected="selected">Pikachu</option><option value="Ball">Ball</option></select></div> </div></li><li class="command command-raw" data-command-id="0"><div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4>X Position</h4><div class="command-input-wrap"><div class="display-in-line"><select data-toggle="tooltip" data-placement="top" title="" class="form-control parm1-sprite select-sprite" data-original-title="Select a sprite."><option value="Pikachu">Pikachu</option><option value="Ball" selected="selected">Ball</option></select></div> <div class="display-in-line"><button data-toggle="tooltip" data-placement="top" title="" class="btn btn-default btn-toggle-var-num btn-tooltip" data-original-title="Swap input type between variables and numbers."><i class="fa fa-random"></i></button><select class="no-show form-control parm1-variable select-variable"><option value="count" selected="selected">count</option><option value="value">value</option><option value="total">total</option></select><input class="form-control numbers parm1-value active" type="number" value="0"></div></div></li><li class="command command-raw" data-command-id="1"><div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4>Y Position</h4><div class="command-input-wrap"><div class="display-in-line"><select data-toggle="tooltip" data-placement="top" title="" class="form-control parm1-sprite select-sprite" data-original-title="Select a sprite."><option value="Pikachu">Pikachu</option><option value="Ball" selected="selected">Ball</option></select></div> <div class="display-in-line"><button data-toggle="tooltip" data-placement="top" title="" class="btn btn-default btn-toggle-var-num btn-tooltip" data-original-title="Swap input type between variables and numbers."><i class="fa fa-random"></i></button><select class="no-show form-control parm1-variable select-variable"><option value="count" selected="selected">count</option><option value="value">value</option><option value="total">total</option></select><input class="form-control numbers parm1-value active" type="number" value="0"></div></div></li><li class="command command-raw command-loop" data-command-id="9" style=""><div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4>Loop</h4><ul class=""><li class="command command-raw" data-command-id="4" style=""><div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4>Move</h4><div class="command-input-wrap"><div class="display-in-line"><select data-toggle="tooltip" data-placement="top" title="" class="form-control parm1-sprite select-sprite" data-original-title="Select a sprite."><option value="Pikachu">Pikachu</option><option value="Ball" selected="selected">Ball</option></select></div> <div class="display-in-line"><button data-toggle="tooltip" data-placement="top" title="" class="btn btn-default btn-toggle-move-dir btn-tooltip" data-original-title="Swap between the horizontal and vertical move direction."><i class="fa fa-arrows-v"></i></button>&nbsp;&nbsp;<button data-toggle="tooltip" data-placement="top" title="" class="btn btn-default btn-toggle-var-num btn-tooltip" data-original-title="Swap input type between variables and numbers."><i class="fa fa-random"></i></button><select class="no-show form-control parm2-variable select-variable"><option value="count" selected="selected">count</option><option value="value">value</option><option value="total">total</option></select><input class="form-control numbers parm2 move-vertical" type="number" value="50"></div><div class="display-in-line"></div>&nbsp;&nbsp;&nbsp;<select data-toggle="tooltip" data-placement="top" title="" class="form-control parm3-easing select-easing" data-original-title="Select an easing function for the movement."><option value="normla">Normal</option><option value="faster">Faster</option><option value="slower">Slower</option><option value="smooth">Smooth</option><option value="bounce" selected="selected">Bounce</option></select></div></li><li class="command command-raw" data-command-id="4" style=""><div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4>Move</h4><div class="command-input-wrap"><div class="display-in-line"><select data-toggle="tooltip" data-placement="top" title="" class="form-control parm1-sprite select-sprite" data-original-title="Select a sprite."><option value="Pikachu">Pikachu</option><option value="Ball" selected="selected">Ball</option></select></div> <div class="display-in-line"><button data-toggle="tooltip" data-placement="top" title="" class="btn btn-default btn-toggle-move-dir btn-tooltip" data-original-title="Swap between the horizontal and vertical move direction."><i class="fa fa-arrows-v"></i></button>&nbsp;&nbsp;<button data-toggle="tooltip" data-placement="top" title="" class="btn btn-default btn-toggle-var-num btn-tooltip" data-original-title="Swap input type between variables and numbers."><i class="fa fa-random"></i></button><select class="no-show form-control parm2-variable select-variable"><option value="count" selected="selected">count</option><option value="value">value</option><option value="total">total</option></select><input class="form-control numbers parm2 move-vertical" type="number" value="-50"></div><div class="display-in-line"></div>&nbsp;&nbsp;&nbsp;<select data-toggle="tooltip" data-placement="top" title="" class="form-control parm3-easing select-easing" data-original-title="Select an easing function for the movement."><option value="normla">Normal</option><option value="faster">Faster</option><option value="slower">Slower</option><option value="smooth" selected="selected">Smooth</option><option value="bounce">Bounce</option></select></div></li></ul></li>',
			variables: '<div class="form-group input-group"><input type="text" class="form-control" readonly="" value="count"><span class="input-group-btn"><button class="btn btn-danger btn-variable-manager-delete" type="button" disabled=""><span class="fa fa-times"></span></button></span></div><div class="form-group input-group"><input type="text" class="form-control" readonly="" value="value"><span class="input-group-btn"><button class="btn btn-danger btn-variable-manager-delete" type="button" disabled=""><span class="fa fa-times"></span></button></span></div><div class="form-group input-group"><input type="text" class="form-control" readonly="" value="total"><span class="input-group-btn"><button class="btn btn-danger btn-variable-manager-delete" type="button" disabled=""><span class="fa fa-times"></span></button></span></div>',
			spriteName: 'Ball',
			spriteImg: '../img/ball.jpg'
		}
		/*
		,
		{
			panelId: 'demo-analog-clock',
			name: 'Analog Clock',
			description: 'A program that implements an analog clock.',
			procedure: ''
		}
		*/
		],
		
		populatePrograms: function(container) {
			var compiled = _.template( VisualIDE.Templates.demoProgram );
			var html = compiled( {programs: this.programs} );
			
			container.html( html );
			
			$(document).on('miaRunning', function() {
				$(container).find('button').each( function() {
					if ( !$(this).hasClass('btn-managers-close') ) {
						$(this).attr('disabled','disabled');
						$(this).addClass('disabled-demo-load-run');
					}
				});
			});
			
			$(document).on('miaStop', function() {
				$('.disabled-demo-load-run').removeAttr('disabled');
				$('.disabled-demo-load-run').removeClass('.disabled-demo-load-run');
			});
		}
	};
	
	return ide;

}( VisualIDE || {} ));