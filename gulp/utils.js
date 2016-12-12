/**
 * Created by my on 2016/11/19.
 */
var utils = {
    slice: sliceFn,
    log: logFn
};

function sliceFn(obj, index) {
    index = index || 0;
    return Array.prototype.slice.call(obj, index);
}

function logFn(msg, specfix, isObj) {
    var args = sliceFn(arguments, 1);
    specfix = specfix || "Attention";
    args.push("[----"+ specfix +"----]--->"+msg);
    if(isObj){
        var str = "\n";
        var o = Object.keys(msg);
        o.forEach(function (item) {
            str += item +": "+msg[item]+"\n";
        });
        args.push(str);
    }
    return console.log.apply(console, args);
}

module.exports = utils;