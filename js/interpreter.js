var Interpreter = (function(my) {
    'use strict';

    var _canvas;
    var _spriteName;
    var _delay = 750;
    var _USER_INPUT = 0;
    var _commandQueue;
    var _commandTimer;

    my.init = function(canvas, spriteName) {
    	_canvas = canvas;
        _spriteName = spriteName;
    };
    
    my.run = function() {
        clearInterval(_commandTimer);
        _commandQueue = [];
        parse($('#list-procedures > li'));
        executeCommands();
    };        
    
    my.stop = function() {
        clearInterval(_commandTimer);
        _commandQueue = [];
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
     * Sets the image of the sprite to that specified by the url. If no 
     * url is provided, sets the sprite to the default sprite.
     */
    var changeCostume = function(url) {
        if (!url) url = "../img/pikachu.gif";
        _canvas.getSprite(_spriteName).setImage(url);
    };

    /**
     * Sets the image of the background to that specified by the url. If no 
     * url is provided, sets the background to the default background (clear).
     */
    var changeBg = function(url) {
        if (!url) {
            _canvas.clearBackgroundImage();
        }
        else {
            _canvas.setBackgroundImage(url);
        }
    };

    /**
     * Parses the list of commands.
     */
    var parse = function(commandList) {
        commandList.each(encapsulateCommand);
    };

    /**
     * Encapsulates each command into a compact data structure and enqueues
     * them into the command queue.
     */
    var encapsulateCommand = function() {
        var commandObj = $(this);
        var procedureId = commandObj.attr('data-command-id');
        var args = getParams(commandObj, procedureId);

        if (procedureId === "7") {
            for (var i = 0; i < args[_USER_INPUT]; i++) {
                parse(commandObj.children('ul').children('li'));
            }
        }
        else {
            _commandQueue.push(new Procedure(procedureId, args));
        }
    };

    /**
     * Gets the parameters entered by the user. Any special processing of the 
     * paramters can be done here. Returns an array of parameters.
     */
    var getParams = function(commandObj, procedureId) {
        var params = [];

        params.push(commandObj.children("input").val());
        
        return params;
    };

    /**
     * Dequeues commands one at a time and executes them. Speed of dequeuing 
     * is specified by _delay.
     */
    var executeCommands = function() {
        var looply = function() {
            execute(_commandQueue.shift());
            if (_commandQueue.length <= 0) {
                clearInterval(_commandTimer);
            }
        };
        _commandTimer = setInterval(looply, _delay);
    };

    /**
     * Executes the command.
     */
    var execute = function(commandObj) {
        var procedureId = commandObj.procedureId;
        var args = commandObj.args;

        if (_procedureMap[procedureId] === undefined)
            throw 'Interpreter: Undefined procedure!';

        _procedureMap[procedureId].apply(this, args);
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
        "6": changeBg
    };

    /**
     * The encapsulated procedure object.
     */
    var Procedure = function(procedureId, args) {
        this.procedureId = procedureId;
        this.args = args;
    };

    // var commandList = cmdDef.cmds;
    
    return my;
}(Interpreter || {}));