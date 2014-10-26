var Interpreter = (function(my) {
    'use strict';

    var _canvas,
        _spriteName,
        _delay = 750,
        _USER_INPUT = 0,
        _commandQueue,
        _commandTimer;

    my.init = function(canvas, spriteName) {
    	_canvas = canvas;
        _spriteName = spriteName;
    };
    
    my.run = function() {
        clearInterval(_commandTimer);
        _commandQueue = new CommandQueue();

        parse($('#list-procedures > li'));

        executeCommands();
    };        
    
    my.stop = function() {
        clearInterval(_commandTimer);
        _commandQueue = new CommandQueue();
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
            var loopStart = _commandQueue.getLength() === 0 ? 0 : _commandQueue.getLength();

            parse(commandObj.children('ul').children('li'));

            var jumpArgs = [args[_USER_INPUT]];
            _commandQueue.addCommand(new Command('-1', jumpArgs, {
                loopStart: loopStart,
                numLooped: 1,
                infiniteLoop: 0
            }));
        }
        else {
            _commandQueue.addCommand(new Command(procedureId, args));
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
     * Executes commands in order in _commandQueue. Speed of execution 
     * is specified by _delay.
     */
    var executeCommands = function() {
        var looply = function() {
            var commandObj = _commandQueue.getCommand();

            while (commandObj.procedureId === '-1') {
                if (commandObj.options.infiniteLoop) {
                    _commandQueue.movePointer(options.loopStart);
                }
                else {
                    if (commandObj.options.numLooped < commandObj.args[_USER_INPUT]) {
                        commandObj.options.numLooped++;
                        _commandQueue.movePointer(commandObj.options.loopStart);
                    }
                    else {
                        commandObj.options.numLooped = 1;
                        if (_commandQueue.getPointerIndex() === _commandQueue.getLength() - 1) {
                            clearInterval(_commandTimer);
                            return;
                        }
                        _commandQueue.incrementPointer();
                    }
                }
                commandObj = _commandQueue.getCommand();
            }

            execute(commandObj);

            if (_commandQueue.getPointerIndex() === _commandQueue.getLength() - 1) {
                clearInterval(_commandTimer);
            }
            else {
                _commandQueue.incrementPointer();
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
        var options = commandObj.options;

        if (_procedureMap[procedureId] === undefined)
            throw 'Interpreter: Undefined procedure!';

        _procedureMap[procedureId].apply(this, [args, options]);
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
    var Command = function(procedureId, args, options) {
        this.procedureId = procedureId;
        this.args = args;
        this.options = options || {};
    };

    var CommandQueue = function() {
        this._queue = [];
        this._curr = 0;

        this.addCommand = function(commandObj) {
            this._queue.push(commandObj);
        };

        this.getCommand = function() {
            return this._queue[this._curr];
        };

        this.getLength = function() {
            return this._queue.length;
        };

        this.getPointerIndex = function() {
            return this._curr;
        };

        this.incrementPointer = function() {
            if (this._curr === this.getLength() - 1)
                throw 'CommandQueue: Reached the end of queue!';

            this._curr++;
        };

        this.movePointer = function(moveTo) {
            if (moveTo > this.getLength())
                throw 'CommandQueue: moveTo index out of bounds!';

            this._curr = moveTo;
        };
    };
    
    return my;
}(Interpreter || {}));