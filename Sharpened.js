/* SharpenedJS 
 * Copyright Kelvin K. - https://github.com/LogicReinc
 * Licensed under LGPL license.
 */

var Event = function(){
	var self = this;
	this.Handlers = [];
	
	this.Register = function(func){
		self.Handlers.push(func);
	};
	
	this.Remove = function(func){
		var ind = self.Handlers.indexOf(func);
		if(ind >= 0)
			self.Handlers.splice(ind, 1);
	};
	
	
	this.Fire = function()
	{
		var args = arguments;
		Linq(self.Handlers).Foreach(function(x){
			x.apply(this, args);
		});
	};
};

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
	me.Except = function(items) {
		var newArray = Source.filter(function(x){
			return items.indexOf(x) < 0;
		});
		return new LinqLike(newArray);
	};
	me.Skip = function(count){
		var newArray = [];
		for(var i = count; i < Source.length; i++)
			newArray.push(Source[i]);
		return new LinqLike(newArray);
	};
	me.Take = function(count){
		var newArray = [];
		for(var i = 0; i < count; i++)
			newArray.push(Source[i]);
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
	me.Average = function(selector) {
		var total = 0;
		
		for(var i = 0; i < Source.length; i++)
		{
			var val = selector(Source[i]);
			total += val;
		}
		
		return total / Source.length;
	};
	me.Count = function(condition){
		var count = 0;
		for(var i = 0; i < Source.length; i++)
		{
			if(condition(Source[i]))
				count++;
		}
		return count;
	};
	me.Max = function(selector){
		if(Source.length == 0)
			return undefined;
		var highest = selector(Source[0]);
		for(var i = 1; i < Source.length; i++)
		{
			var val = selector(Source[i]);
			if(highest < val)
				highest = val;
		}
		return highest;
	};
	
	me.Min = function(selector){
		if(Source.length == 0)
			return undefined;
		var lowest = selector(Source[0]);
		for(var i = 1; i < Source.length; i++)
		{
			var val = selector(Source[i]);
			if(lowest > val)
				lowest = val;
		}
		return lowest;
	};
	
	me.Sum = function(selector){
		var value = 0;
		for(var i = 0; i < Source.length; i++)
		{
			value += selector(Source[i]);
		}
		return value;
	}
	
	me.ElementAtOrDefault = function(index){
		if(Source.length > index && index >= 0)
			return Source[index];
			return undefined;
	}
	
    me.Select = function(selector) {
        var stuff = [];
        for (var i = 0; i < Source.length; i++)
            stuff.push(selector(Source[i]));
        return stuff;
    };
	me.SelectMany = function(selector){
		var stuff = [];
		for(var i = 0; i < Source.length; i++)
		{
			var sub = selector(Source[i]);
			for(var n =0; n< sub.length; n++)
				stuff.push(sub[n]);
		}
		return stuff;
	};
	me.GroupBy = function(grouping){
		var aArray = {};
		for(var i = 0; i < Source.length; i++)
		{
			var key = grouping(Source[i]);
			if(!(key in aArray))
				aArray[key] = [];
			aArray[key].push(Source[i]);
		}
		return aArray;
	};
    /*Item*/
    me.FirstOrDefault = function(condition) {
        if (Source.length == 0)
            return undefined;
        if (condition == undefined)
            return Source[0];

		for(var i = 0; i < Source.length; i++)
		{
			if(condition(Source[i]))
				return Source[i];
		}
        return undefined;
    };
	me.LastOrDefault = function(condition){
		if (Source.length == 0)
            return undefined;
        if (condition == undefined)
            return Source[Source.length - 1];

		for(var i = Source.length - 1; i >= 0; i--)
		{
			if(condition(Source[i]))
				return Source[i];
		}
        return undefined;
	};
	
    /*Bool*/
    me.Any = function(condition) {
		if(!condition)
			return Source.length > 0;
	
        for (var i = 0; i < Source.length; i++)
            if (condition(Source[i]))
                return true;
        return false;
    };
	me.Contains = function(item)
	{
		return Source.indexOf(item) >= 0;
	};

    me.Remove = function(val) {
        Source.splice(Source.indexOf(val), 1);
    };
	
	me.RemoveAll = function(condition)
	{
		for(var i = 0; i < Source.length; i++)
		{
			if(condition(Source[i]))
			{
				Source.splice(i, 1);
				i--;
			}
		}
	};
}


var Linq = function(arr){
	return new LinqLike(arr);
}

if(typeof exports != 'undefined')
{
	exports.Linq = LinqLike;
	exports.Event = Event;
	global.Linq = Linq;
}