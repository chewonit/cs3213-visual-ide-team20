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
        $('#list-procedures > li').each(executeWrapper); 
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
        console.log("あれ～～");
    };

    my._changeCostume = function() {

    };

    my._changeBg = function() {

    };

    my._loop = function(times, container) {
        for (var i = 0; i < times; i++) {
            console.log(i);
            container.children("ul").children("li").each(executeWrapper); 
        }
    };

    var executeWrapper = function() {
        execute($(this));
    };

    var execute = function(procedureObj) {
        var procedureId = procedureObj.attr('data-command-id');

        var args = [Math.random() * 500, Math.random() * 500];
        if (procedureId === "7")
            args = [Math.random() * 10, procedureObj];

        _procedureMap[procedureId].apply(this, args);
    };

    var getParams = function() {
        var params = [];
        return params;
    };

    var _procedureMap = {
        "0": my._setX,
        "1": my._setY,
        "2": my._show,
        "3": my._hide,
        "4": my._move,
        "5": my._changeCostume,
        "6": my._changeBg,
        "7": my._loop
    };
    
    return my;
}(Interpreter || {}));