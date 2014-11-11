var VisualIDE = (function(ide) {
	
	ide.Demo = {

		programs: [
		{
			panelId: 'demo-bouncing-ball',
			name: 'Bouncing Ball',
			description: 'A program that animates a ball to bounce.',
			procedures: '<li class="command command-raw" data-command-id="6" style=""><div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4>Change Background</h4><div class="command-input-wrap"><input class="form-control parm1" value=""></div></li><li class="command command-raw" data-command-id="3" style=""><div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4>Hide Character</h4><div class="command-input-wrap"><div class="display-in-line"><select data-toggle="tooltip" data-placement="top" title="" class="form-control parm1-sprite select-sprite" data-original-title="Select a sprite."><option value="Pikachu" selected="selected">Pikachu</option><option value="Ball">Ball</option></select></div> </div></li><li class="command command-raw" data-command-id="0"><div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4>X Position</h4><div class="command-input-wrap"><div class="display-in-line"><select data-toggle="tooltip" data-placement="top" title="" class="form-control parm1-sprite select-sprite" data-original-title="Select a sprite."><option value="Pikachu">Pikachu</option><option value="Ball" selected="selected">Ball</option></select></div> <div class="display-in-line"><button data-toggle="tooltip" data-placement="top" title="" class="btn btn-default btn-toggle-var-num btn-tooltip" data-original-title="Swap input type between variables and numbers."><i class="fa fa-random"></i></button><select class="no-show form-control parm1-variable select-variable"><option value="count" selected="selected">count</option><option value="value">value</option><option value="total">total</option></select><input class="form-control numbers parm1-value active" type="number" value="0"></div></div></li><li class="command command-raw" data-command-id="1"><div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4>Y Position</h4><div class="command-input-wrap"><div class="display-in-line"><select data-toggle="tooltip" data-placement="top" title="" class="form-control parm1-sprite select-sprite" data-original-title="Select a sprite."><option value="Pikachu">Pikachu</option><option value="Ball" selected="selected">Ball</option></select></div> <div class="display-in-line"><button data-toggle="tooltip" data-placement="top" title="" class="btn btn-default btn-toggle-var-num btn-tooltip" data-original-title="Swap input type between variables and numbers."><i class="fa fa-random"></i></button><select class="no-show form-control parm1-variable select-variable"><option value="count" selected="selected">count</option><option value="value">value</option><option value="total">total</option></select><input class="form-control numbers parm1-value active" type="number" value="0"></div></div></li><li class="command command-raw command-loop" data-command-id="9" style=""><div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4>Loop</h4><ul class=""><li class="command command-raw" data-command-id="4" style=""><div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4>Move</h4><div class="command-input-wrap"><div class="display-in-line"><select data-toggle="tooltip" data-placement="top" title="" class="form-control parm1-sprite select-sprite" data-original-title="Select a sprite."><option value="Pikachu">Pikachu</option><option value="Ball" selected="selected">Ball</option></select></div> <div class="display-in-line"><button data-toggle="tooltip" data-placement="top" title="" class="btn btn-default btn-toggle-move-dir btn-tooltip" data-original-title="Swap between the horizontal and vertical move direction."><i class="fa fa-arrows-v"></i></button>&nbsp;&nbsp;<button data-toggle="tooltip" data-placement="top" title="" class="btn btn-default btn-toggle-var-num btn-tooltip" data-original-title="Swap input type between variables and numbers."><i class="fa fa-random"></i></button><select class="no-show form-control parm2-variable select-variable"><option value="count" selected="selected">count</option><option value="value">value</option><option value="total">total</option></select><input class="form-control numbers parm2 move-vertical" type="number" value="50"></div><div class="display-in-line"></div>&nbsp;&nbsp;&nbsp;<select data-toggle="tooltip" data-placement="top" title="" class="form-control parm3-easing select-easing" data-original-title="Select an easing function for the movement."><option value="normla">Normal</option><option value="faster">Faster</option><option value="slower">Slower</option><option value="smooth">Smooth</option><option value="bounce" selected="selected">Bounce</option></select></div></li><li class="command command-raw" data-command-id="4" style=""><div class="handle"><i class="handle fa fa-bars fa-2x"></i></div><h4>Move</h4><div class="command-input-wrap"><div class="display-in-line"><select data-toggle="tooltip" data-placement="top" title="" class="form-control parm1-sprite select-sprite" data-original-title="Select a sprite."><option value="Pikachu">Pikachu</option><option value="Ball" selected="selected">Ball</option></select></div> <div class="display-in-line"><button data-toggle="tooltip" data-placement="top" title="" class="btn btn-default btn-toggle-move-dir btn-tooltip" data-original-title="Swap between the horizontal and vertical move direction."><i class="fa fa-arrows-v"></i></button>&nbsp;&nbsp;<button data-toggle="tooltip" data-placement="top" title="" class="btn btn-default btn-toggle-var-num btn-tooltip" data-original-title="Swap input type between variables and numbers."><i class="fa fa-random"></i></button><select class="no-show form-control parm2-variable select-variable"><option value="count" selected="selected">count</option><option value="value">value</option><option value="total">total</option></select><input class="form-control numbers parm2 move-vertical" type="number" value="-50"></div><div class="display-in-line"></div>&nbsp;&nbsp;&nbsp;<select data-toggle="tooltip" data-placement="top" title="" class="form-control parm3-easing select-easing" data-original-title="Select an easing function for the movement."><option value="normla">Normal</option><option value="faster">Faster</option><option value="slower">Slower</option><option value="smooth" selected="selected">Smooth</option><option value="bounce">Bounce</option></select></div></li></ul></li>',
			variables: '<div class="form-group input-group"><input type="text" class="form-control" readonly="" value="count"><span class="input-group-btn"><button class="btn btn-danger btn-variable-manager-delete" type="button" disabled=""><span class="fa fa-times"></span></button></span></div><div class="form-group input-group"><input type="text" class="form-control" readonly="" value="value"><span class="input-group-btn"><button class="btn btn-danger btn-variable-manager-delete" type="button" disabled=""><span class="fa fa-times"></span></button></span></div><div class="form-group input-group"><input type="text" class="form-control" readonly="" value="total"><span class="input-group-btn"><button class="btn btn-danger btn-variable-manager-delete" type="button" disabled=""><span class="fa fa-times"></span></button></span></div>',
			spriteName: 'Ball',
			spriteImg: '../img/ball.png'
		},
		{
			panelId: 'demo-analog-clock',
			name: 'Analog Clock',
			description: 'A program that implements an analog clock.',
			procedure: ''
		}
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
		},
		
		getDemoClockProgram: function(commandsHtml) {
			var program = {},
				html='',
				rotateSpeed = 60,
				sprites = [];
				
				
			// Initialize BG to blank
			var changeBg = $( commandsHtml.getCommandHtml(10) );
			changeBg.find( 'input' ).attr( 'value', '' );
			html += $('<div>').append(changeBg.clone()).html();
			
			// hide default character
			var hideChar = $( commandsHtml.getCommandHtml(12) );
			hideChar.find( 'input' ).attr( 'value', '' );
			html += $('<div>').append(hideChar.clone()).html();
			
			// Initialize positions
			var init = $( commandsHtml.getCommandHtml(0) );
			init.find( '.parm1-sprite' ).html('<option value="clock">clock</option>');
			html += $('<div>').append(init.clone()).html();
			init = $( commandsHtml.getCommandHtml(0) );
			init.find( '.parm1-sprite' ).html('<option value="hour">hour</option>');
			html += $('<div>').append(init.clone()).html();
			init = $( commandsHtml.getCommandHtml(0) );
			init.find( '.parm1-sprite' ).html('<option value="minute">minute</option>');
			html += $('<div>').append(init.clone()).html();
			init = $( commandsHtml.getCommandHtml(1) );
			init.find( '.parm1-sprite' ).html('<option value="clock">clock</option>');
			html += $('<div>').append(init.clone()).html();
			init = $( commandsHtml.getCommandHtml(1) );
			init.find( '.parm1-sprite' ).html('<option value="hour">hour</option>');
			html += $('<div>').append(init.clone()).html();
			init = $( commandsHtml.getCommandHtml(1) );
			init.find( '.parm1-sprite' ).html('<option value="minute">minute</option>');
			html += $('<div>').append(init.clone()).html();
			
			// Assignment to 'count' variable of 0.
			var assign = $( commandsHtml.getCommandHtml(3) );
			assign.find('.parm1-variable').html('<option value="count">count</option>');
			assign.find('.parm2-value').attr( 'value', 0 );
			html += $('<div>').append(assign.clone()).html();
			
			// Assignment to 'value' variable of 60.
			assign = $( commandsHtml.getCommandHtml(3) );
			assign.find('.parm1-variable').html('<option value="value">value</option>');
			assign.find('.parm2-value').attr( 'value', rotateSpeed/2 );
			html += $('<div>').append(assign.clone()).html();
			
			// Rotate Hour hand
			var rotateh = $( commandsHtml.getCommandHtml(4) );
			rotateh.find('.select-sprite').html('<option value="hour">hour</option>');
			rotateh.find('.parm1-value').attr( 'value', rotateSpeed/3 );
			rotateh = $('<div>').append(rotateh.clone()).html();
			
			// Reset Count.
			var resetCount = $( commandsHtml.getCommandHtml(3) );
			resetCount.find('.parm1-variable').html('<option value="count">count</option>');
			resetCount.find('.parm2-value').attr( 'value', 0 );
			resetCount = $('<div>').append(resetCount.clone()).html();
			
			// Rotate minute hand
			var rotatem = $( commandsHtml.getCommandHtml(4) );
			rotatem.find('.select-sprite').html('<option value="minute">minute</option>');
			rotatem.find('.parm1-variable').html('<option value="value">value</option>');
			rotatem.find('.parm1-variable').addClass('active');
			rotatem.find('.parm1-variable').removeClass('no-show');
			rotatem.find('.parm1-value').addClass('no-show');
			rotatem.find('.parm1-value').removeClass('active');
			rotatem = $('<div>').append(rotatem.clone()).html();
			
			// Increment value.
			var incValue = $( commandsHtml.getCommandHtml(3) );
			incValue.find('.parm1-variable').html('<option value="count">count</option>');
			incValue.find('.parm2-variable').html('<option value="value">value</option>');
			incValue.find('.parm2-variable').addClass('active');
			incValue.find('.parm2-variable').removeClass('no-show');
			incValue.find('.parm2-value').addClass('no-show');
			incValue.find('.parm2-value').removeClass('active');
			incValue.find('.parm2-variable').first().html('<option value="count">count</option>');
			incValue = $('<div>').append(incValue.clone()).html();
			
			// If command.
			var ifCmd = $( commandsHtml.getCommandHtml(5) );
			ifCmd.find('.parm1-variable').html('<option value="count">count</option>');
			ifCmd.find('.parm1-variable').addClass('active');
			ifCmd.find('.parm1-variable').removeClass('no-show');
			ifCmd.find('.parm1-value').addClass('no-show');
			ifCmd.find('.parm1-value').removeClass('active');
			ifCmd.find('.dropdown-toggle').html('&gt;');
			ifCmd.find('.parm2-value').attr('value', 359);
			ifCmd.find('ul').first().append( rotateh + resetCount );
			ifCmd = $('<div>').append(ifCmd.clone()).html();
			
			var loop = $( commandsHtml.getCommandHtml(8) );
			loop.find('ul').first().append( ifCmd + rotatem + incValue );
			html += $('<div>').append(loop.clone()).html();
			
			program.html = html;
			
			sprites = [
				{
					name: 'clock',
					target: "sprite",
					url: '../img/clock.png',
					defalut: false,
				},
				{
					name: 'hour',
					target: "sprite",
					url: '../img/hour_hand.png',
					defalut: false,
				},
				{
					name: 'minute',
					target: "sprite",
					url: '../img/minute_hand.png',
					defalut: false,
				}
			];
			
			program.sprites = sprites;
			
			return program;
		}
	};
	
	return ide;

}( VisualIDE || {} ));