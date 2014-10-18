var Interpreter = (function(my) {
    'use strict';

    var _canvas;
    var _spriteName;
    var _delay = 1000;

    my.init = function(canvas, spriteName) {
    	_canvas = canvas;
        _spriteName = spriteName;
    };
    
    my.run = function() {
        parse($('#list-procedures > li')); 
    };

    /**
     * Sets the position of the sprite.
     */
    var setX = function(x) {
        _canvas.getSprite(_spriteName).setX(parseInt(x));
    };

    var setY = function(y) {
        _canvas.getSprite(_spriteName).setY(parseInt(y));
    };

    /**
     * Sets the visibility of the sprite.
     */
    var show = function() {
        _canvas.getSprite(_spriteName).show();
    };

    var hide = function() {
        _canvas.getSprite(_spriteName).hide();
    };

    /**
     * Moves the sprite by the amount specified by steps. Each step is one pixel.
     */
    var move = function(steps) {
        var currX = _canvas.getSprite(_spriteName).sprite.position.x;
        _canvas.getSprite(_spriteName).setX(currX + parseInt(steps));
    };

    /**
     * Sets the image of the sprite to that specified by the url.
     */
    var changeCostume = function(url) {
        _canvas.getSprite(_spriteName).setImage(url);
    };

    /**
     * Sets the image of the background to that specified by the url.
     */
    var changeBg = function(url) {

    };

    /**
     * The loop command. Loops the child commands numIterations times. The child commands 
     * are handled in the same way as the main commands in my.run. A delay is added after
     * each iteration otherwise all iterations will appear as one.
     */
    var loop = function(numIterations, container) {
        var i = 0;
        var looply = function() {
            parse(container.children("ul").children("li"));
            if (++i < numIterations) {
                setTimeout(looply, _delay);
            }
        };
        looply();
    };

    /**
     * Parses the list of commands. A delay is added after each command otherwise all 
     * commands will appear as one.
     */
    var parse = function(commandList) {
        var i = 0;
        var looply = function() {
            execute($(commandList[i]));
            if (++i < commandList.length) {
                setTimeout(looply, _delay);
            }
        };
        looply();
    };

    /**
     * Executes the command.
     */
    var execute = function(commandObj) {
        var procedureId = commandObj.attr('data-command-id');
        var args = getParams(commandObj, procedureId);

        _procedureMap[procedureId].apply(this, args);
    };

    /**
     * Gets the parameters entered by the user. Any special processing of the 
     * paramters can be done here. Returns an array of parameters.
     */
    var getParams = function(commandObj, procedureId) {
        var params = [];

        params.push(commandObj.children("input").val());

        if (procedureId === "7")
            params.push(commandObj);
        
        return params;
    };

    /**
     * The mapping from procedureId to the actual function.
     */
    var _procedureMap = {
        "0": setX,
        "1": setY,
        "2": show,
        "3": hide,
        "4": move,
        "5": changeCostume,
        "6": changeBg,
        "7": loop
    };
    
    return my;
}(Interpreter || {}));