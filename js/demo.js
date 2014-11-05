var VisualIDE = (function(ide) {
	
	ide.Demo = {
	
		programs: [
			{
				panelId: 'demo-bouncing-ball',
				name: 'Bouncing Ball',
				description: 'A program that animates a ball to bounce.',
			},
			{
				panelId: 'demo-analog-clock',
				name: 'Analog Clock',
				description: 'A program that implements an analog clock.'
			}
		],
		
		populatePrograms: function(container) {
			var compiled = _.template( VisualIDE.Templates.demoProgram );
			var html = compiled( {programs: this.programs} );
			
			container.html( html );
		}
	};
	
	return ide;

}( VisualIDE || {} ));