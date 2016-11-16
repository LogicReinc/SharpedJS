/* SharpenedJS 
 * Copyright Kelvin K. - https://github.com/LogicReinc
 * Licensed under LGPL license.
 */


var LinqLike = function(array) {
    var me = this;
    var Source = array;
    if (Source == undefined)
        Source = [];

    me.ToArray = function() {
        return Source;
    };

    //No Result
    me.Foreach = function(action) {
        for (var i = 0; i < Source.length; i++)
            action(Source[i]);
    }

    //LINQLike result
    /*LINQ*/
    me.Where = function(condition) {
        var newArray = Source.filter(condition);
        return new LinqLike(newArray);
    };
    /*LINQ*/
    me.OrderBy = function(selector) {
        var newArray = Source;
        newArray.sort(function(a, b) {
            var o1 = selector(a);
            var o2 = selector(b);

            if (o1 > o2)
                return 1;
            if (o1 < o2)
                return -1;
            return 0;
        });
        return new LinqLike(newArray);
    };
    /*LINQ*/
    me.OrderByDescending = function(selector) {
        var newArray = Source;
        newArray.sort(function(a, b) {
            var o1 = selector(a);
            var o2 = selector(b);

            if (o1 > o2)
                return -1;
            if (o1 < o2)
                return 1;
            return 0;
        });
        return new LinqLike(newArray);
    };

    //Items Result
    /*Array*/
    me.Select = function(selector) {
        var stuff = [];
        for (var i = 0; i < Source.length; i++)
            stuff.push(selector(Source[i]));
        return stuff;
    };
    /*Item*/
    me.FirstOrDefault = function(condition) {
        if (Source.length == 0)
            return undefined;
        if (condition == undefined)
            return Source[0];
        var newArray = Source.filter(condition);
        if (newArray.length == 0)
            return undefined;
        return newArray[0];
    };
    /*Bool*/
    me.Any = function(condition) {
        for (var i = 0; i < Source.length; i++)
            if (condition(Source[i]))
                return true;
        return false;
    };

    me.Remove = function(val) {
        Source.splice(Source.indexOf(val), 1);
    };
}


exports.Linq = LinqLike;
global.Linq = function(array){
	return new LinqLike(array);
};
