var Interpreter = (function(my) {
    'use strict';

    var _canvas;
    var _spriteName;

    my.init = function(canvas, spriteName) {
    	if (!canvas) throw 'Interpreter: Need canvas';
    	_canvas = canvas;
        _spriteName = spriteName;
    };
    
    my.run = function() {
    	// Loop through each procedure call in the procedure list
        $('#list-procedures > li').each(function(index, ele) {
            execute($(this).attr('data-command-id'));
        }); 
    };

    my._setX = function(x) {
        _canvas.getSprite(_spriteName).setX(x);
    };

    my._setY = function(y) {
        _canvas.getSprite(_spriteName).setY(y);
    };

    my._show = function() {
        _canvas.getSprite(_spriteName).show();
    };

    my._hide = function() {
        _canvas.getSprite(_spriteName).hide();
    };

    my._move = function(newX, newY) {
        console.log("あれ～～")
    };

    my._loop = function(times, container) {
        for (var i = 0; i < times; i++) {
            container.children("ul").children("li").each(function(index, ele) {
                execute($(this).attr('data-command-id'));
            });
        }
    };

    var execute = function(procedureId) {
        var args = [Math.random() * 500, Math.random() * 500];
        if (procedureId === 5)
            args = [Math.random() * 10, $(this)]

        _procedureMap[procedureId].apply(this, args);
    }

    var _procedureMap = {
    	"1": my._setX,
    	"2": my._setY,
    	"3": my._show,
    	"4": my._hide,
    	"5": my._loop
    };
    
    return my;
}(Interpreter || {}));