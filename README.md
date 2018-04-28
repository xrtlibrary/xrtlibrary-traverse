# XRTLibrary-Traverse

## Introduction

In practice, we got trouble in reading configurations from JSON object securely and also in less lines of code.

For example, we have a socket configuration like:

```
var config = {
    "address": "127.0.0.1",
    "port": 443
};
```

In real word, you shouldn't read the configuration like this:

```
var address = config["address"];
var port = config["port"];
```

Because it's insecure, the "address" and "port" must exist and the "port" must be an integer larger than 0. So if you want to write secure codes, you have to write a lot of codes.

So we wrapped these codes into this module, now you can use following code to read it securely in only several lines of code. Like:

```
var XRTLibTraverse = require("xrtlibrary-traverse");
try {
    //  Wrap the configuration.
    var info = XRTLibTraverse.WrapObject(config, false);

    //  Read address and port.
    var address = info.sub("address").notNull().typeOf(String).unwrap();
    var port = info.sub("port").notNull().integer().minExclusive(0).unwrap();
} catch(error) {
    console.log("Invalid configuration.");
    //  Exit here.
}
```

## Installation

To install this package, you can use NPM by typing following command:

```
npm install xrtlibrary-traverse --save
```

Then you can import this library in your JavaScript code:

```
var XRTLibTraverse = require("xrtlibrary-traverse");
```

## API

### Traverse (Object)

#### typeOf(constructor: Function): Traverse

Check the type of inner object. If the type of the inner object mismatched, an error will be raised.

#### numeric(): Traverse

Assume that the inner object is a Number. Equivalent of "typeOf(Number)".

#### integer(): Traverse

Assume that the inner object is an integer (also a Number).

#### boolean(): Traverse

Assume that the inner object is a boolean. Equivalent of "typeOf(Boolean)".

#### string(): Traverse

Assume that the inner object is a string. Equivalent of "typeOf(String)".

#### stringValidate(charTable: String): Traverse

Validate the inner string by given character table. If there is one character in the inner string doesn't occurred in the character table, an error will be raised.

#### stringValidateByRegExp(re: RegExp): Traverse

Validate the inner string by given regular expression. If the inner string doesn't matched with the regular expression, an error will be raised.

#### jsonLoad(): Traverse

Load JSON object from current inner object (a string).

For example:

```
var input = "{\"key\": \"value\"}";
var info = XRTLibTraverse.WrapObject(input, false);
console.log(info.notNull().string().jsonLoad().sub("key").unwrap());  //  Output: "value".
```

#### jsonSave(): Traverse

Save JSON object to a new Traverse object.

```
var input = {"key": "value"};
var info = XRTLibTraverse.WrapObject(input, false);
console.log(info.jsonSave().unwrap());     //  Output: "{\"key\": \"value\"}".
```

#### sub(name: * | String): Traverse

Go to sub directory. The inner object should be an Object or a Map. When the inner object is a Map, the "name" can be any type. Otherwise, it must be a String.

For example:

```
var info = XRTLibTraverse.WrapObject({"a": {"b": "c"}}, false);
console.log(info.sub("a").sub("b").unwrap());  //  Output: "c".
```

Another example:

```
var mapping = new Map();
mapping.set("a", {"b": "c"});
var info = XRTLibTraverse.WrapObject(mapping, false);
console.log(info.sub("a").sub("b").unwrap());  //  Output: "c".
```

#### optionalSub(name: * | String, defaultValue: *): Traverse

Go to sub directory which can be non-existed.

For example:

```
var info = XRTLibTraverse.WrapObject({"a": "b"}, false);
console.log(info.optionalSub("a", "non-exist").unwrap());  //  Output: "b".
console.log(info.optionalSub("b", "non-exist").unwrap());  //  Output: "non-exist".
```

#### notNull(): Traverse

Assume that the inner object is not null. If the inner object is null, an error will be raised.

#### min(threshold: *): Traverse

Give minimum value threshold to the inner object (expect: inner >= threshold). An error will be raised when the inner object is lower than the threshold.

For example:

```
var info = XRTLibTraverse.WrapObject(100, false);
info.min(50);  //  Nothing happened.
info.min(150); //  An error will be raised.
```

#### minExclusive(threshold: *): Traverse

Give exclusive minimum value threshold to the inner object (expect: inner > threshold). An error will be occurred when the inner object is lower than or equal to the threshold.

#### max(threshold: *): Traverse

Give maximum value threshold to the inner object (expect: inner <= threshold). An error will be raised when the inner object is larger than the threshold.

```
var info = XRTLibTraverse.WrapObject(100, false);
info.max(150);  //  Nothing happened.
info.max(50); //  An error will be raised.
```

#### maxExclusive(threshold: *): Traverse

Give exclusive maximum value threshold to the inner object (expect: inner < threshold). An error will be raised when the inner object is larger than or equal to the threshold.

#### range(minValue: *, maxValue: *): Traverse

Give value threshold to the inner object (expect: min <= inner <= max). Equivalent of "min(minValue).max(maxValue)".

#### selectFromArray(from: Array): Traverse

Select an item from specific array (use inner object as the index).

For example:

```
var info = XRTLibTraverse.WrapObject({
    "array": ["a", "b", "c", "d"],
    "index1": 0,
    "index2": 3
}, false);
console.log(info.sub("index1").selectFromArray(info.sub("array").unwrap()).unwrap());   //  Output: "a".
console.log(info.sub("index2").selectFromArray(info.sub("array").unwrap()).unwrap());   //  Output: "d".
```

#### selectFromObject(from: Object): Traverse

Select an item from specific object (use inner object as the key).

For example:

```
var info = XRTLibTraverse.WrapObject({
    "protocol": "SOCKS5"
});
console.log(info.sub("protocol").selectFromObject({
    "SOCKS5": 5,
    "SOCKSv4a": 4
}).unwrap());   //  Output: 5.
```

#### selectFromObjectOptional(from: Object, defaultValue: *): Traverse

Select an optional item from specific object (use inner object as the key).

#### selectFromMap(from: Map): Traverse

Select an item from specific map (use inner object as the key).

#### selectFromMapOptional(from: Map, defaultValue: *): Traverse

Select an optional item from specific map (use inner object as the key).

#### objectForEach(callback: Function): Traverse

Iterate an object.

Callback format:

```
function(key: Traverse) {}
```

For example:

```
var info = XRTLibTraverse.WrapObject({
    "a": 1,
    "b": 2,
    "c": 3
}, false);
info.objectForEach(function(key) {
    console.log(key.unwrap());
});
//  Output: "a", "b", "c".
```

#### objectSet(key: String, value: *): Traverse

Set a key-value pair within an object.

For example:

```
var data = {};
var info = XRTLibTraverse.WrapObject(data, false);
info.objectSet("key", "value");
console.log(data);   //  Output: {"key": "value"}
```

#### arrayForEach(callback: Function): Traverse

Iterate an array.

Callback format:

```
function(item: Traverse) {}
```

For example:

```
var info = XRTLibTraverse.WrapObject(["I", "love", "you"], false);
info.arrayForEach(function(item) {
    console.log(item.unwrap());
});
//  Output: "I", "love", "you".
```

#### arrayForEachWithDeletion(callback: Function): Traverse

Iterate an array with deletion.

Callback format:

```
function(item: Traverse) {
    if ([The item should be deleted]) {
        return true;
    } else {
        return false;
    }
}
```

For example:

```
var info = XRTLibTraverse.WrapObject(["I", "love", "you"], false);
info.arrayForEachWithDeletion(function(item) {
    return !(item.unwrap() == "love");
});
console.log(info.unwrap());  //  Output: ["love"]
```

#### arrayMinLength(minLength: Number): Traverse

Assume the array has a minimum length.

#### arrayMaxLength(maxLength: Number): Traverse

Assume the array has a maximum length.

#### isNull(): Boolean

Get whether the inner object is NULL.

#### oneOf(selections: Set | Map | Array | Object): Traverse

Assume that the inner object is in specific selections. If the inner object is not in the selections, an error will be raised.

For example:

```
var info = XRTLibTraverse.WrapObject("test", false);

//  Array.
info.oneOf(["ubuntu", "test"]);   //  Nothing happened.

//  Set.
var testSet = new Set();
testSet.add("test");
info.oneOf(testSet);              //  Nothing happened.

//  Map.
var testMap = new Map();
testMap.set("test", "value");
info.oneOf(testMap);              //  Nothing happened.

//  Object.
info.oneOf({
    "test": "value"
});                               //  Nothing happened.
info.oneOf({});                   //  Error will occurred.
```

#### inner(): *

(Compatible, use unwrap() in new application) Get the inner object.

#### unwrap(): *

Unwrap the traverse object. Equivalent of "inner()".

### WrapObject(innerObject: *, force: Boolean)

Wrap an object with Traverse. When the force switch is on (true), we will still wrap the object if the inner object is a Traverse. Otherwise, we won't wrap it.

For example:

```
var wrap1 = XRTLibTraverse.WrapObject({"key": "value"}, false);
var wrap2 = XRTLibTraverse.WrapObject(wrap1, false);
var wrap3 = XRTLibTraverse.WrapObject(wrap1, true);

//  Next three statements have the same output (output: "value").
console.log(wrap1.sub("key").inner());
console.log(wrap2.sub("key").inner());
console.log(wrap3.unwrap().sub("key").inner());
```

