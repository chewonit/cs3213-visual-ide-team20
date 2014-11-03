var VisualIDE = (function(my) {
    'use strict';

    var _canvas,
        _spriteName,
        _delay = 750,
        _commandQueue,
        _CONSTANTS = {
            USER_INPUT: 0,
            CMD_JUMP: '-1'
        },
        _USER_CMD_CONSTANTS = {
            SET_X: "0",
            SET_Y: "1",
            SHOW: "2",
            HIDE: "3",
            MOVE: "4",
            CHANGE_COSTUME: "5",
            CHANGE_BG: "6",
            REPEAT: "7",
            IF: "8"
        },
        cmdList = cmdDef.cmds;

    my.Interpreter = function(canvas, spriteName) {
    	_canvas = canvas;
        _spriteName = spriteName;
    };
    
    my.Interpreter.stop = function() {
        if (_commandQueue) 
            _commandQueue.stop();
        
        _commandQueue = new CommandQueue();
    };        
    
    my.Interpreter.run = function() {
        my.Interpreter.stop();

        parse($('#list-procedures > li'));

        executeCommands();
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
        _canvas.getSprite(_spriteName).setX(currX + parseInt(steps), {
            interpolator: new VisualIDE.CanvasLinearInterpolator(),
            duration: _delay * 0.98
        });
        // _canvas.getSprite(_spriteName).setX(currX + parseInt(steps), {
        //     interpolator: new VisualIDE.CanvasAccelerateInterpolator(3.0),
        //     duration: _delay * 0.98
        // });
        // _canvas.getSprite(_spriteName).setX(currX + parseInt(steps), {
        //     interpolator: new VisualIDE.CanvasDecelerateInterpolator(3.0),
        //     duration: _delay * 0.98
        // });
        // _canvas.getSprite(_spriteName).setX(currX + parseInt(steps), {
        //     interpolator: new VisualIDE.CanvasEasingInterpolator(3.0),
        //     duration: _delay * 0.98
        // });
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
     * The mapping from commandId to the actual function.
     */
    var _commandMap = {};  
    _commandMap[_USER_CMD_CONSTANTS.SET_X]          = setX;
    _commandMap[_USER_CMD_CONSTANTS.SET_Y]          = setY;
    _commandMap[_USER_CMD_CONSTANTS.SHOW]           = show;
    _commandMap[_USER_CMD_CONSTANTS.HIDE]           = hide;
    _commandMap[_USER_CMD_CONSTANTS.MOVE]           = move;
    _commandMap[_USER_CMD_CONSTANTS.CHANGE_COSTUME] = changeCostume;
    _commandMap[_USER_CMD_CONSTANTS.CHANGE_BG]      = changeBg;

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
        var commandId = commandObj.attr('data-command-id');
        var args = getParams(commandObj, commandId);

        var cmd;

        if (commandId === _USER_CMD_CONSTANTS.REPEAT) {
            cmd = new JumpCommand(commandId, args);
        }
        else {
            cmd = new Command(commandId, args);
        }

        _commandQueue.addCommand(cmd.parseCommand(commandObj));
    };

    /**
     * Gets the parameters entered by the user. Returns an array of parameters.
     */
    var getParams = function(commandObj, commandId) {
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

            if (_commandQueue.endOfQueue()) {
                _commandQueue.stop();
            }
            else {
                execute(commandObj);
                _commandQueue.incrementPointer();
            }
        }; 
        _commandQueue.run(looply, _delay);
    };

    /**
     * Executes the command.
     */
    var execute = function(commandObj) {
        var commandId = commandObj.commandId;
        var args = commandObj.args;
        var options = commandObj.options;

        if (!(commandId in _commandMap))
            throw 'Interpreter: Undefined command! ' + commandId;

        _commandMap[commandId].apply(this, [args, options]);
    };

    /**
     * The encapsulated command object.
     */
    var Command = function(commandId, args, options) {
        this.commandId = commandId;
        this.args = args;
        this.options = options || {};
    };

    Command.prototype.parseCommand = function() {
        return this;
    };

    Command.prototype.preprocess = function() {
        return this;
    };

    var JumpCommand = function(commandId, args, options) {
        this.commandId = commandId;
        this.args = args;
        this.options = options || {};
    };

    JumpCommand.prototype = new Command();

    JumpCommand.prototype.parseCommand = function(commandObj) {
        var loopStart = _commandQueue.getLength();

        parse(commandObj.children('ul').children('li'));
        
        return new JumpCommand(_CONSTANTS.CMD_JUMP, this.args, {
            jumpTo: loopStart,
            numLooped: 1,
            infiniteLoop: 0
        });
    };

    JumpCommand.prototype.preprocess = function(commandObj) {
        if (this.options.infiniteLoop) {
            _commandQueue.movePointer(options.jumpTo);
        }
        else {
            if (this.options.numLooped < this.args[_CONSTANTS.USER_INPUT]) {
                this.options.numLooped++;
                _commandQueue.movePointer(this.options.jumpTo);
            }
            else {
                this.options.numLooped = 1;
                if (_commandQueue.endOfQueue()) {
                    _commandQueue.stop();
                    return;
                }
                _commandQueue.incrementPointer();
            }
        }
        return _commandQueue.getCommand();
    };


    /**
     * The command queue to store command objects.
     */
    var CommandQueue = function() {
        this._queue = [];
        this._curr = 0;
        this._commandTimer = {};

        this.run = function(looply, delay) {
            this._commandTimer = setInterval(looply, delay);
        };

        this.stop = function() {
            clearInterval(this._commandTimer);
        };

        this.addCommand = function(commandObj) {
            this._queue.push(commandObj);
        };

        this.getCommand = function() {
            return this._queue[this._curr].preprocess();
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

        this.endOfQueue = function() {
            return this.getPointerIndex() === this.getLength() - 1;
        };
    };
    
    return my;
}(VisualIDE || {}));