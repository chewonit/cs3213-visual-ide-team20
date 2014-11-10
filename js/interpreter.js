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
            IF: "8",
            LOOP: "9",
            ASSIGN: "10",
            ROTATE: "11",
            WHILE: "12"
        },
        cmdList = VisualIDE.Commands.commands,
        varTable = VisualIDE.VariableManager.varTable,
        spriteTable = VisualIDE.SpriteManager.spriteTable;

    var resetStyles = function() {   
        $('li').removeClass('command-executing');
    };

    var restoreUI = function() {
        resetStyles();
        $('#stop-btn').attr('disabled','disabled');
        $('#run-btn').removeAttr('disabled');
        VisualIDE.DragDrop.enableDrag();
    };

    my.Interpreter = function(canvas, spriteName) {
    	_canvas = canvas;
        _spriteName = spriteName;
    };
    
    my.Interpreter.stop = function() {
        if (_commandQueue) 
            _commandQueue.stop(restoreUI);
        
        _commandQueue = new CommandQueue();
    };        
    
    my.Interpreter.run = function() {
        initVarTable();
        initSpriteTable();
        resetCanvasBg();
        
        parse($('#list-procedures > li'));
        // console.log(_commandQueue);

        executeCommands();
    };        

    var initVarTable = function() {
        varTable = VisualIDE.VariableManager.varTable;
        for (var v in varTable) {
            varTable[v].value = 0;
        }
    };

    var initSpriteTable = function() {
        spriteTable = VisualIDE.SpriteManager.spriteTable;
        for (var s in spriteTable) {
            changeCostume(spriteTable[s].url, spriteTable[s].name);
            resetSprite(spriteTable[s].name);
        }
    };

    var resetSprite = function(sprite) {
        _canvas.getSprite(sprite).show();
        _canvas.getSprite(sprite).setRotation(0);
        _canvas.getSprite(sprite).setX(0);
        _canvas.getSprite(sprite).setY(0);
    };

    var resetCanvasBg = function() {
        changeBg();
    };

    /**
     * Sets the position of the sprite.
     */
    var setX = function(x, sprite) {
        _canvas.getSprite(sprite).setX(resolveVariable(x));
    };

    var setY = function(y, sprite) {
        _canvas.getSprite(sprite).setY(resolveVariable(y));
    };

    /**
     * Sets the visibility of the sprite.
     */
    var show = function(sprite) {
        _canvas.getSprite(sprite).show();
    };

    var hide = function(sprite) {
        _canvas.getSprite(sprite).hide();
    };

    /**
     * Moves the sprite by the amount specified by steps in the specified direction using the specified interpolator. Each step is one pixel.
     */
    var move = function(direction, steps, interpolator, sprite) {
        // _commandQueue.stop();

        var Interpolators = {
            "normla": VisualIDE.CanvasLinearInterpolator,
            "faster": VisualIDE.CanvasAccelerateInterpolator,
            "slower": VisualIDE.CanvasDecelerateInterpolator,
            "smooth": VisualIDE.CanvasEasingInterpolator,
            "bounce": VisualIDE.CanvasBounceInterpolator,
        };

        var curr;

        steps = resolveVariable(steps);

        if (direction == "h") {
            curr = _canvas.getSprite(sprite).getX();
            _canvas.getSprite(sprite).setX(curr + steps, {
                interpolator: new Interpolators[interpolator](3.0),
                duration: _delay * 0.98
            });
        }
        else {
            curr = _canvas.getSprite(sprite).getY();
            _canvas.getSprite(sprite).setY(curr + steps, {
                interpolator: new Interpolators[interpolator](3.0),
                duration: _delay * 0.98
            });
        }
    };

    // var canvasAnimateCallback = function() {
    //     looply();
    //     _commandQueue.run();
    // };

    /**
     * Sets the image of the sprite to that specified by the url. If no 
     * url is provided, sets the sprite to the default sprite.
     */
    var changeCostume = function(url, sprite) {
        if (!url) url = "../img/pikachu.gif";
        _canvas.getSprite(sprite).setImage(url);
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
     * Rotates the specified sprite by the amount. Converts the amount from degree to radians
     * before calling canvas API.
     */
    var rotate = function(degree, sprite) {
        // _commandQueue.stop();
        degree = resolveVariable(degree);

        var radians = (degree / 180) * Math.PI + _canvas.getSprite(sprite).getRotation();
        
        _canvas.getSprite(sprite).setRotation(radians, {
            interpolator: new VisualIDE.CanvasLinearInterpolator(),
            duration: _delay * 0.98
        });
    };

    /**
     * Modifies the value of the variable with the evaluated result of the expression.
     */
    var assign = function(varName, operand1, operand2, operator) {
        operand1 = resolveVariable(operand1);
        operand2 = resolveVariable(operand2);

        for (var i = 0; i < varTable.length; i++) {
            if (varTable[i].name.toLowerCase() === varName.toLowerCase()) {
                varTable[i].value = MathOperations[operator].apply(this, [operand1, operand2]);
                break;
            }
        }
    };

    /**
     * Resolves the variable argument to it's value in varTable.
     */
    var resolveVariable = function(operand) {
        // console.log('resolve ' + operand);
        if (isNaN(operand)) {
            for (var i = 0; i < varTable.length; i++) {
                if (varTable[i].name.toLowerCase() === operand.toLowerCase()) {
                    return varTable[i].value;
                }
            }
            throw 'Interpreter: Unable to resolve operand "' + operand + '".';
        }
        else {
            return parseInt(operand);
        }
    };

    /**
     * Array of mathematical operations (add, subtract etc.) for use in assign command.
     */
    var MathOperations = {
        "+": function(arg1, arg2) {
            return arg1 + arg2;   
        },
        "-": function(arg1, arg2) {
            return arg1 - arg2;   
        },
        "*": function(arg1, arg2) {
            return arg1 * arg2;   
        },
        "/": function(arg1, arg2) {
            return arg1 / arg2;   
        },
        "%": function(arg1, arg2) {
            return arg1 % arg2;   
        }
    };

    /**
     * The mapping from commandId to the actual function. Commands such as WHILE, REPEAT, and LOOP
     * have a dummy map to ensure that the command does not hang the browser if user does not drag
     * any commands into the statement list. 
     */
    var _commandMap = {};  
    _commandMap[_USER_CMD_CONSTANTS.SET_X]          = setX;
    _commandMap[_USER_CMD_CONSTANTS.SET_Y]          = setY;
    _commandMap[_USER_CMD_CONSTANTS.SHOW]           = show;
    _commandMap[_USER_CMD_CONSTANTS.HIDE]           = hide;
    _commandMap[_USER_CMD_CONSTANTS.MOVE]           = move;
    _commandMap[_USER_CMD_CONSTANTS.CHANGE_COSTUME] = changeCostume;
    _commandMap[_USER_CMD_CONSTANTS.CHANGE_BG]      = changeBg;
    _commandMap[_USER_CMD_CONSTANTS.ROTATE]         = rotate;
    _commandMap[_USER_CMD_CONSTANTS.ASSIGN]         = assign;
    _commandMap[_USER_CMD_CONSTANTS.WHILE]          = function(){};
    _commandMap[_USER_CMD_CONSTANTS.REPEAT]         = function(){};
    _commandMap[_USER_CMD_CONSTANTS.LOOP]           = function(){};

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

        if (commandId === _USER_CMD_CONSTANTS.REPEAT || 
            commandId === _USER_CMD_CONSTANTS.IF || 
            commandId === _USER_CMD_CONSTANTS.WHILE ||
            commandId === _USER_CMD_CONSTANTS.LOOP) {

            cmd = new JumpCommand(commandId, commandObj, args);
        }
        else if (commandId === _USER_CMD_CONSTANTS.ASSIGN) {
            cmd = new AssignCommand(commandId, commandObj, args);
        }
        else {
            cmd = new Command(commandId, commandObj, args);
        }

        cmd.parseCommand(commandObj);
    };

    /**
     * Gets the parameters entered by the user. Returns an array of parameters.
     */
    var getParams = function(commandObj, commandId) {
        var params = ParamGetters[commandId].apply(this, [commandObj]);
        // console.log(params);
        return params;
    };

    /**
     * A list of the parameter getter methods.
     */
    var ParamGetters = {};

    ParamGetters[_USER_CMD_CONSTANTS.ASSIGN] = function(commandObj) {
        var params = [];

        // lhs
        commandObj.children(".command-input-wrap").children(".display-in-line").children("select").each(function() {
            if (!$(this).hasClass("no-show")) {
                params.push($(this).val());
            }
        });

        // rhs
        commandObj.children(".command-input-wrap").children(".command-input-wrap").children(".display-in-line").children(":not(:first-child)").each(function() {
            if (!$(this).hasClass("no-show")) {
                params.push($(this).val());
            }
        });

        commandObj.children(".command-input-wrap").find(".operator").children('a').each(function() {
            params.push($(this).text());
        });

        return params;
    };

    ParamGetters[_USER_CMD_CONSTANTS.IF] = function(commandObj) {
        var params = [];

        commandObj.children(".command-input-wrap").children(".display-in-line").children(":not(:first-child)").each(function() {
            if (!$(this).hasClass("no-show")) {
                params.push($(this).val());
            }
        });

        commandObj.children(".command-input-wrap").find(".operator").children('a').each(function() {
            params.push($(this).text());
        });

        return params;
    };

    ParamGetters[_USER_CMD_CONSTANTS.WHILE] = function(commandObj) {
        var params = [];
        
        commandObj.children(".command-input-wrap").children(".display-in-line").children(":not(:first-child)").each(function() {
            if (!$(this).hasClass("no-show")) {
                params.push($(this).val());
            }
        });

        commandObj.children(".command-input-wrap").find(".operator").children('a').each(function() {
            params.push($(this).text());
        });

        return params;
    };

    ParamGetters[_USER_CMD_CONSTANTS.REPEAT] = function(commandObj) {
        var params = [];

        commandObj.children(".command-input-wrap").children("input").each(function() {
            params.push($(this).val());
        });

        return params;
    };

    ParamGetters[_USER_CMD_CONSTANTS.MOVE] = function(commandObj) {
        var params = [];

        commandObj.children(".command-input-wrap").children(".display-in-line:not(:first-child)").children("button:first-child").children("i").each(function() {
            if ($(this).hasClass("fa-arrows-v")) {
                params.push("v");
            }
            else {
                params.push("h");
            }
        });

        commandObj.children(".command-input-wrap").children(".display-in-line:not(:first-child)").children("select").each(function() {
            if (!$(this).hasClass("no-show")) {
                params.push($(this).val());
            }
        });

        commandObj.children(".command-input-wrap").children(".display-in-line:not(:first-child)").children("input").each(function() {
            if (!$(this).hasClass("no-show")) {
                params.push($(this).val());
            }
        });

        params.push(commandObj.children(".command-input-wrap").children("select").val());

        params.push(commandObj.find(".select-sprite").val());

        return params;
    };

    ParamGetters[_USER_CMD_CONSTANTS.SET_X] = function(commandObj) {
        var params = [];
        
        commandObj.children(".command-input-wrap").children(".display-in-line").children(":not(:first-child)").each(function() {
            if (!$(this).hasClass("no-show")) {
                params.push($(this).val());
            }
        });

        commandObj.find(".select-sprite").each(function() {
            params.push($(this).val());
        });

        return params;
    };
    ParamGetters[_USER_CMD_CONSTANTS.SET_Y] = ParamGetters[_USER_CMD_CONSTANTS.SET_X];
    ParamGetters[_USER_CMD_CONSTANTS.SHOW] = ParamGetters[_USER_CMD_CONSTANTS.SET_X];
    ParamGetters[_USER_CMD_CONSTANTS.HIDE] = ParamGetters[_USER_CMD_CONSTANTS.SET_X];
    ParamGetters[_USER_CMD_CONSTANTS.ROTATE] = ParamGetters[_USER_CMD_CONSTANTS.SET_X];

    ParamGetters[_USER_CMD_CONSTANTS.CHANGE_COSTUME] = function(commandObj) {
        var params = [];

        commandObj.children(".command-input-wrap").find("input").each(function() {
            params.push($(this).val());
        });

        commandObj.find(".select-sprite").each(function() {
            params.push($(this).val());
        });

        return params;
    };

    ParamGetters[_USER_CMD_CONSTANTS.CHANGE_BG] = ParamGetters[_USER_CMD_CONSTANTS.CHANGE_COSTUME];

    ParamGetters[_USER_CMD_CONSTANTS.LOOP] = function(commandObj) {
        return [];
    };

    var looply = function() {
        if (_commandQueue.endOfQueue()) {
            _commandQueue.stop(restoreUI);
        }
        else {
            var commandObj = _commandQueue.getCommand();
            if (commandObj) {
                execute(commandObj);
                _commandQueue.incrementPointer();
            }
            else {
                _commandQueue.stop(restoreUI);
            }
        }
    }; 

    /**
     * Executes commands in order in _commandQueue. Speed of execution is specified by _delay.
     */
    var executeCommands = function() {
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

        resetStyles();
        commandObj.commandObjInList.addClass('command-executing');

        _commandMap[commandId].apply(this, args);
    };

    /**
     * The encapsulated command object.
     */
    var Command = function(commandId, cmd, args, options) {
        this.commandId = commandId;
        this.commandObjInList = cmd;
        this.args = args;
        this.options = options || {};
    };

    /**
     * Perform any special functions to the commandQueue here (e.g. see JumpCommand.parseCommand).
     * Then add the command to the commandQueue. This method will be called when parsing the main list of commands.
     */
    Command.prototype.parseCommand = function() {
        _commandQueue.addCommand(this);
    };

    /**
     * Perform any preprocessing of the command before executing this command (e.g. see JumpCommand.preprocess).
     * This method will be called just before executing the command, during the command loop (in executeCommands()).
     */
    Command.prototype.preprocess = function() {
        return this;
    };

    var AssignCommand = function(commandId, cmd, args, options) {
        this.commandId = commandId;
        this.commandObjInList = cmd;
        this.args = args;
        this.options = options || {};
    };

    AssignCommand.prototype.parseCommand = function() {
        _commandQueue.addCommand(this);
    };

    AssignCommand.prototype.preprocess = function() {

        // execute(this);

        // _commandQueue.incrementPointer();

        // if (_commandQueue.endOfQueue()) {
        //     _commandQueue.stop(restoreUI);
        //     return;
        // }
        // return _commandQueue.getCommand();
        return this;
    };

    var JumpCommand = function(commandId, cmd, args, options) {
        this.commandId = commandId;
        this.commandObjInList = cmd;
        this.args = args;
        this.options = options || {};
    };

    JumpCommand.prototype = new Command();

    JumpCommand.prototype.parseCommand = function() {
        var loopStart, statementList;

        if (this.commandId === _USER_CMD_CONSTANTS.REPEAT) {

            statementList = this.commandObjInList.children('ul').children('li');

            _commandQueue.addCommand(new JumpCommand(this.commandId, undefined, this.args, {
                jumpTo: _commandQueue.getLength() + statementList.length + 2,
                arg1: 0,
                arg2: this.args[_CONSTANTS.USER_INPUT],
                evaluator: Comparators["="]
            }));

            loopStart = _commandQueue.getLength();
            parse(this.commandObjInList.children('ul').children('li'));

            if (statementList.length === 0) {
                _commandQueue.addCommand(new Command(this.commandId, this.commandObjInList, this.args, {}));
            }
            
            _commandQueue.addCommand(new JumpCommand(this.commandId, undefined, this.args, {
                jumpTo: loopStart,
                arg1: 1,
                arg2: this.args[_CONSTANTS.USER_INPUT],
                evaluator: Comparators["!="]
            }));
        }
        else if (this.commandId === _USER_CMD_CONSTANTS.LOOP) {

            loopStart = _commandQueue.getLength();
            statementList = this.commandObjInList.children('ul').children('li');
            
            parse(statementList);

            if (statementList.length === 0) {
                _commandQueue.addCommand(new Command(this.commandId, this.commandObjInList, this.args, {}));
            }

            _commandQueue.addCommand(new JumpCommand(this.commandId, undefined, this.args, {
                jumpTo: loopStart,
                infiniteLoop: 1
            }));
        }
        else if (this.commandId === _USER_CMD_CONSTANTS.WHILE) {

            statementList = this.commandObjInList.children('ul').children('li');

            _commandQueue.addCommand(new JumpCommand(this.commandId, undefined, this.args, {
                jumpTo: _commandQueue.getLength() + statementList.length + 2,
                arg1: this.args[0],
                arg2: this.args[1],
                evaluator: Comparators[this.args[2]],
                negateEvaluator: true
            }));

            loopStart = _commandQueue.getLength();
            
            parse(statementList);

            if (statementList.length === 0) {
                _commandQueue.addCommand(new Command(this.commandId, this.commandObjInList, this.args, {}));
            }
            
            _commandQueue.addCommand(new JumpCommand(_CONSTANTS.CMD_JUMP, undefined, this.args, {
                jumpTo: loopStart - 1,
                arg1: 0,
                arg2: 0,
                evaluator: Comparators["="]
            }));
        }
        else if (this.commandId === _USER_CMD_CONSTANTS.IF) {

            var trueStatementList = $(this.commandObjInList.children('ul')[0]).children('li'),
                falseStatementList = $(this.commandObjInList.children('ul')[1]).children('li');

            _commandQueue.addCommand(new JumpCommand(this.commandId, undefined, this.args, {
                jumpTo: _commandQueue.getLength() + falseStatementList.length + 2,
                arg1: this.args[0],
                arg2: this.args[1],
                evaluator: Comparators[this.args[2]]
            }));

            parse(falseStatementList);

            _commandQueue.addCommand(new JumpCommand(this.commandId, undefined, this.args, {
                jumpTo: _commandQueue.getLength() + trueStatementList.length + 1,
                arg1: 0,
                arg2: 0,
                evaluator: Comparators["="]
            }));

            parse(trueStatementList);
        }
    };

    JumpCommand.prototype.preprocess = function() {
        if (this.options.infiniteLoop) {
            _commandQueue.movePointer(this.options.jumpTo);
        }
        else {
            if (this.evaluateJumpCondition(this)) {
                if (this.commandId === _USER_CMD_CONSTANTS.REPEAT) {
                    this.options.arg1++;
                }
                _commandQueue.movePointer(this.options.jumpTo);
            }
            else {
                _commandQueue.incrementPointer();
            }
        }
        if (_commandQueue.endOfQueue()) {
            _commandQueue.stop(restoreUI);
            return;
        }
        return _commandQueue.getCommand();
    };

    /**
     * Evaluates the jumping boolean condition. 
     */
    JumpCommand.prototype.evaluateJumpCondition = function(commandObj) {
        // console.log(commandObj);
        var res = commandObj.options.evaluator.apply(this, [commandObj.options.arg1, commandObj.options.arg2]);
        // console.log(commandObj.options.arg1);
        // console.log(commandObj.options.arg2);
        return commandObj.options.negateEvaluator ? !res : res;
    };

    /**
     * A list of the available boolean expressions for jumping conditions.
     */
    var Comparators = {
        "=": function(arg1, arg2) {
            // console.log('compare =: ' + arg1 + ' ' + arg2);
            return resolveVariable(arg1) == resolveVariable(arg2);   
        },
        "!=": function(arg1, arg2) {
            // console.log('compare !=: ' + arg1 + ' ' + arg2);
            return resolveVariable(arg1) != resolveVariable(arg2);   
        },
        "<": function(arg1, arg2) {
            // console.log('compare <: ' + arg1 + ' ' + arg2);
            return resolveVariable(arg1) < resolveVariable(arg2);   
        },
        ">": function(arg1, arg2) {
            // console.log('compare >: ' + arg1 + ' ' + arg2);
            return resolveVariable(arg1) > resolveVariable(arg2);   
        }
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

        this.stop = function(callback) {
            clearInterval(this._commandTimer);
            
            if (callback) {
                callback.apply(this);
            }
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
            if (this.endOfQueue())
                throw 'CommandQueue: Reached the end of queue!';
            this._curr++;
        };

        this.movePointer = function(moveTo) {
            if (moveTo > this.getLength())
                throw 'CommandQueue: moveTo index out of bounds!';

            this._curr = moveTo;
        };

        this.endOfQueue = function() {
            return this.getPointerIndex() >= this.getLength();
        };
    };
    
    return my;
}(VisualIDE || {}));
