Array.prototype.each = function(callback) {
    for (var i = 0 ; i < this.length ; i++ )
        callback(this[i]);
}

Array.prototype.lastElement = function() {
    return (this.length === 0) ? undefined : this[this.length - 1];
}

Array.prototype.verify = function(callback){ 
    var newArray = [];
    for (var i = 0 ; i < this.length; i++) if(callback(this[i])) newArray.push(this[i]); 
    return newArray;
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

Array.prototype.isEmpty = function() {
    return (this.length === 0);   
}

Array.prototype.hasSubArray = function(subArray) {
    for (var i = 0; i < subArray.length; i++)
        if (this.indexOf(subArray[i]) === -1)
            return false;
    return true;
}