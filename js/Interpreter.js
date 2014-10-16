var Interpreter = (function(my) {
    my.run = function() {
        $('#list2 > li').each(function(index, ele) {
            alert(ele.id);
        });
    };
    return my;
}(Interpreter || {}));