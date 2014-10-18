var Interpreter = (function(my) {
    'use strict';

    var _canvas;
    var _spriteName;
    var _delay = 1000;

    var Procedure = function(procedureId, args) {
        this.procedureId = procedureId;
        this.args = args;
    };

    my.init = function(canvas, spriteName) {
    	_canvas = canvas;
        _spriteName = spriteName;
    };
    
    my.run = function() {
        parse($('#list-procedures > li')); 
    };

    var setX = function(x) {
        _canvas.getSprite(_spriteName).setX(x);
    };

    var setY = function(y) {
        _canvas.getSprite(_spriteName).setY(y);
    };

    var show = function() {
        _canvas.getSprite(_spriteName).show();
    };

    var hide = function() {
        _canvas.getSprite(_spriteName).hide();
    };

    var move = function(newX, newY) {
        console.log("あれ～～");
    };

    var changeCostume = function(url) {
        _canvas.getSprite(_spriteName).setImage(url);
    };

    var changeBg = function() {

    };

    // Add a slight delay after each iteration otherwise all will appear as one
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

    // Loop through each procedure call in the procedure list
    // Add a slight delay after each procedure otherwise all will appear as one
    var parse = function(procedureList) {
        var i = 0;
        var looply = function() {
            execute($(procedureList[i]));
            if (++i < procedureList.length) {
                setTimeout(looply, _delay);
            }
        };
        looply();
    };

    var executeWrapper = function() {
        execute($(this));
    };

    var execute = function(procedureObj) {
        var procedureId = procedureObj.attr('data-command-id');
        var args = getParams(procedureObj, procedureId);

        _procedureMap[procedureId].apply(this, args);
    };

    var getParams = function(procedureObj, procedureId) {
        var params = [];

        params.push(procedureObj.children("input").val());

        if (procedureId === "7")
            params.push(procedureObj);
        
        return params;
    };

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