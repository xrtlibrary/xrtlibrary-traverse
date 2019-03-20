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

### (Class) Traverse

Traverse helper.

#### traverse.typeOf(constructor)

Check the type of inner object.

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: Raised if the constructor is not valid.
 - *Traverse.TypeError*: Raised if the inner object is not constructed by the constructor.

<u>Parameter(s)</u>:
 - constructor (*{new(...args: any[]): object}*): The constructor of the type.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.numeric()

Assume that the inner object is numeric.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised if the inner object is not numeric.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.integer()

Assume that the inner object is an integer.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised if the inner object is not an integer.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.boolean()

Assume that the inner object is a boolean.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised if the inner object is not boolean.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.string()

Assume that the inner object is a string.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised if the inner object is not string.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.stringValidate(charTable)

Validate the string by given character table.

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: Raised if the character table is not string.
 - *Traverse.FormatError*: Raised when the inner string mismatched with the character table.
 - *Traverse.TypeError*: Raised when the inner object is not string.

<u>Parameter(s)</u>:
 - charTable (*String*): The character table.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.stringValidateByRegExp(re)

Validate the string by given regular expression.

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: Raised if the "re" parameter is not a RegExp object.
 - *Traverse.FormatError*: Raised when the inner string mismatched with the regular expression.
 - *Traverse.TypeError*: Raised if the inner object is not string.

<u>Parameter(s)</u>:
 - re (*RegExp*): The regular expression.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.jsonLoad()

Load JSON object from current inner object (a string).

<u>Exception(s)</u>:
 - *Traverse.ParseError*: Raised when the failed to parse the JSON object.
 - *Traverse.TypeError*: Raised if the inner object is not string.

<u>Return value</u>:
 - (*Traverse*) The parsed JSON object wrapped with *Traverse*.

<u> Example</u>:
```
var input = "{\"key\": \"value\"}";
var info = XRTLibTraverse.WrapObject(input, false);
console.log(info.notNull().string().jsonLoad().sub("key").unwrap());  //  Output: "value".
```

#### traverse.jsonSave()

Save JSON object to a new Traverse object.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised when cyclic object value was found.
 - *Traverse.Error*: Raised when other JSON serialization error occurred.

<u>Return value</u>:
 - (*Traverse*) The serialized JSON string wrapped with Traverse.

<u> Example</u>:
```
var input = {"key": "value"};
var info = XRTLibTraverse.WrapObject(input, false);
console.log(info.jsonSave().unwrap());     //  Output: "{\"key\": \"value\"}".
```

#### traverse.sub(name)

Go to sub directory.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised in one of following situations:
   - The inner object is NULL.
   - The inner object is not an Object or a Map object.
 - *Traverse.ParameterError*: Raised if the "name" parameter is not a string and the inner object is a Object.
 - *Traverse.KeyNotFoundError*: Raised if the sub path can't be found.

<u>Parameter(s)</u>:
 - name (*): The name(key) of sub directory.

<u>Return value</u>:
 - (*Traverse*) Traverse object of sub directory.

<u> Example</u>:
```
var info = XRTLibTraverse.WrapObject({"a": {"b": "c"}}, false);
console.log(info.sub("a").sub("b").unwrap());  //  Output: "c".
```

```
var mapping = new Map();
mapping.set("a", {"b": "c"});
var info = XRTLibTraverse.WrapObject(mapping, false);
console.log(info.sub("a").sub("b").unwrap());  //  Output: "c".
```

#### traverse.optionalSub(name, defaultValue)

Go to sub directory which can be non-existed.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised in one of following situations:
   - The inner object is NULL.
   - The inner object is not an Object or a Map object.
 - *Traverse.ParameterError*: Raised if the "name" parameter is not a string and the inner object is a Object.

<u>Parameter(s)</u>:
 - name (*): The name(key) of sub directory.
 - defaultValue (*): The default value if the directory doesn't exist.

<u>Return value</u>:
 - (*Traverse*) Traverse object of sub directory.

<u> Example</u>:
```
var info = XRTLibTraverse.WrapObject({"a": "b"}, false);
console.log(info.optionalSub("a", "non-exist").unwrap());  //  Output: "b".
console.log(info.optionalSub("b", "non-exist").unwrap());  //  Output: "non-exist".
```

#### traverse.notNull()

Assume that the inner object is not NULL.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised when the inner object is NULL.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.min(threshold)

Give minimum value threshold to the inner object.

<u>Expected</u>:
 - inner >= threshold

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: Raised if the type of the inner object is different to the threshold object.
 - *Traverse.ValueOutOfRangeError*: Raised if the value is not within the threshold.

<u>Parameter(s)</u>:
 - threshold (*): The threshold.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u> Example</u>:
```
var info = XRTLibTraverse.WrapObject(100, false);
info.min(50);  //  Nothing happened.
info.min(150); //  An error will be raised.
```

#### traverse.minExclusive(threshold)

Give exclusive minimum value threshold to the inner object.

<u>Expected</u>:
 - inner > threshold

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: Raised if the type of the inner object is different to the threshold object.
 - *Traverse.ValueOutOfRangeError*: Raised if the value is not within the threshold.

<u>Parameter(s)</u>:
 - threshold (*): The threshold.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.max(threshold)

Give maximum value threshold to the inner object.

<u>Expected</u>:
 - inner <= threshold

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: Raised if the type of the inner object is different to the threshold object.
 - *Traverse.ValueOutOfRangeError*: Raised if the value is not within the threshold.

<u>Parameter(s)</u>:
 - threshold (*): The threshold.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u> Example</u>:
```
var info = XRTLibTraverse.WrapObject(100, false);
info.max(150);  //  Nothing happened.
info.max(50); //  An error will be raised.
```

#### traverse.maxExclusive(threshold)

Give exclusive maximum value threshold to the inner object.

<u>Expected</u>:
 - inner < threshold

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: Raised if the type of the inner object is different to the threshold object.
 - *Traverse.ValueOutOfRangeError*: Raised if the value is not within the threshold.

<u>Parameter(s)</u>:
 - threshold (*): The threshold.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.range(minValue, maxValue)

Give value threshold to the inner object.

<u>Expected</u>:
 - min <= inner <= max

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: Raised if the type of the inner object is different to the threshold objects.
 - *Traverse.ValueOutOfRangeError*: Raised if the value is not within the thresholds.

<u>Parameter(s)</u>:
 - minValue (*): The minimum threshold.
 - maxValue (*): The maximum threshold.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.selectFromArray(from)

Select an item from specific array (inner object as the index).

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised in following situations:
   - The inner object is NULL.
   - The inner object is not an integer.
 - *Traverse.IndexOutOfRangeError*: Raised if the index out of range.
 - *Traverse.ParameterError*: Raised if the "from" parameter is not valid (not an array).

<u>Parameter(s)</u>:
 - from (*Array*): The array.

<u>Return value</u>:
 - (*Traverse*) Traverse object of selected item.

<u> Example</u>:
```
var info = XRTLibTraverse.WrapObject({
    "array": ["a", "b", "c", "d"],
    "index1": 0,
    "index2": 3
}, false);
console.log(info.sub("index1").selectFromArray(info.sub("array").unwrap()).unwrap());   //  Output: "a".
console.log(info.sub("index2").selectFromArray(info.sub("array").unwrap()).unwrap());   //  Output: "d".
```

#### traverse.selectFromObject(from)

Select an item from specific object (inner object as the key).

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised in following situations:
   - The inner object is NULL.
   - The inner object is not an integer.
 - *Traverse.KeyNotFoundError*: Raised if the key doesn't exist.

<u>Parameter(s)</u>:
 - from (*Object*): The object.

<u>Return value</u>:
 - (*Traverse*) Traverse object of selected item.

<u> Example</u>:
```
var info = XRTLibTraverse.WrapObject({
    "protocol": "SOCKS5"
});
console.log(info.sub("protocol").selectFromObject({
    "SOCKS5": 5,
    "SOCKSv4a": 4
}).unwrap());   //  Output: 5.
```

#### traverse.selectFromObjectOptional(from, defaultValue)

Select an optional item from specific object (inner object as the key).

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised in following situations:
   - The inner object is NULL.
   - The inner object is not an integer.

<u>Parameter(s)</u>:
 - from (*Object*): The object.
 - defaultValue (*): The default value if the key doesn't exist.

<u>Return value</u>:
 - (*Traverse*) Traverse object of selected item.

#### traverse.selectFromMap(from)

Select an item from specific map (inner object as the key).

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised if the inner object is NULL.
 - *Traverse.KeyNotFoundError*: Raised if the key doesn't exist.
 - *Traverse.ParameterError*: Raised if the "from" parameter is not valid (not a Map object).

<u>Parameter(s)</u>:
 - from (Map): The map.

<u>Return value</u>:
 - (*Traverse*) Traverse object of selected item.

#### traverse.selectFromMapOptional(from, defaultValue)

Select an optional item from specific map (inner object as the key).

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised if the inner object is NULL.
 - *Traverse.ParameterError*: Raised if the "from" parameter is not valid (not a Map object).

<u>Parameter(s)</u>:
 - from (*Map*): The map.
 - defaultValue (*): The default value when the key doesn't exist.

<u>Return value</u>:
 - (Traverse) Traverse object of selected item.

#### traverse.objectForEach(callback)

Iterate an object.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised in following situations:
   - The inner object is NULL.
   - The inner object is not an Object.

<u>Parameter(s)</u>:
 - callback (*(value: Traverse) => void*): The callback.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Example</u>:
```
var info = XRTLibTraverse.WrapObject({
    "a": 1,
    "b": 2,
    "c": 3
}, false);
info.objectForEach(function(value) {
    console.log(value.unwrap());
});
//  Output:
//    1
//    2
//    3
```

#### traverse.objectForEachEx(callback)

Iterate an object (will callback with key parameter).

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised in following situations:
   - The inner object is NULL.
   - The inner object is not an Object.

<u>Parameter(s)</u>:
 - callback (*(value: Traverse, key: string) => void*): The callback.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Example</u>:
```
var info = XRTLibTraverse.WrapObject({
    "a": 1,
    "b": 2,
    "c": 3
}, false);
info.objectForEach(function(value, key) {
    console.log(key + " => " + value.unwrap());
});
//  Output:
//    a => 1
//    b => 2
//    c => 3
```

#### traverse.objectSet(key, value)

Set a key-value pair within an object.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised in following situations:
   - The inner object is NULL.
   - The inner object is not an Object.

<u>Parameter(s)</u>:
 - key (*String*): The key.
 - value (*): The value.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Example</u>:
```
var data = {};
var info = XRTLibTraverse.WrapObject(data, false);
info.objectSet("key", "value");
console.log(data);   //  Output: {"key": "value"}
```

#### traverse.objectHas(key)

Get whether an object has specified key.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised in following situations:
   - The inner object is NULL.
   - The inner object is not an Object.

<u>Parameter(s)</u>:
 - key (*String*): The key.

<u>Return value</u>:
 - (*Boolean*) True if so.

<u>Example</u>:
```
var data = {"a": 1234, "c": 5678};
var info = XRTLibTraverse.WrapObject(data, false);
console.log(info.objectHas("a"));   //  Output: true
console.log(info.objectHas("b"));   //  Output: false
console.log(info.objectHas("c"));   //  Output: true
```

#### traverse.arrayForEach(callback)

Iterate an array.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised in following situations:
   - The inner object is NULL.
   - The inner object is not an array.

<u>Parameter(s)</u>:
 - callback (*(item: Traverse) => void*): The callback.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Example</u>:
```
var info = XRTLibTraverse.WrapObject(["I", "love", "you"], false);
info.arrayForEach(function(item) {
    console.log(item.unwrap());
});
//  Output: "I", "love", "you".
```

#### traverse.arrayForEachWithDeletion(callback)

Iterate an array with deletion.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised in following situations:
   - The inner object is NULL.
   - The inner object is not an array.

<u>Parameter(s)</u>:
 - callback (*(item: Traverse) => Boolean*): The callback.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Note(s)</u>:
 - If the callback returns true, the item would be deleted.

<u>Example</u>:
```
var info = XRTLibTraverse.WrapObject(["I", "love", "you"], false);
info.arrayForEachWithDeletion(function(item) {
    return !(item.unwrap() == "love");
});
console.log(info.unwrap());  //  Output: ["love"]
```

#### traverse.arrayMinLength(minLength)

Assume the array has a minimum length.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised in following situations:
   - The inner object is NULL.
   - The inner object is not an array.
 - *Traverse.SizeError*: Raised if the array size exceeds.

<u>Parameter(s)</u>:
 - minLength (*Number*): The minimum length.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.arrayMaxLength(maxLength)

Assume the array has a maximum length.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Raised in following situations:
   - The inner object is NULL.
   - The inner object is not an array.
 - *Traverse.SizeError*: Raised if the array size exceeds.

<u>Parameter(s)</u>:
 - maxLength (*Number*): The maximum length.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.isNull()

Get whether the inner object is NULL.

<u>Return value</u>:
 - (*Boolean*) True if so.

#### traverse.oneOf(selections)

Assume that the inner object is in specific selections.

<u>Exception(s)</u>:
 - Traverse.ParameterError: Raised if the type of "selections" parameter is not supported.
 - Traverse.KeyNotFoundError: Raised if the item doesn't exist in the "selections".

<u>Parameter(s)</u>:
 - selections (*Set|Map|Array|Object*): The selections.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Example</u>:
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

#### traverse.inner()

(Compatible, use unwrap() in new application) Get the inner object.

<u>Return</u>:
 - (*) The inner object.

#### traverse.unwrap()

Unwrap the traverse object.

<u>Return</u>:
 - (*) The inner object.

### (Class) Traverse.Error

Traverse error.

<u>Extend(s)</u>:
 - *Error*

### (Class) Traverse.ParameterError

Traverse parameter error.

<u>Extend(s)</u>:
 - *Traverse.Error*

### (Class) Traverse.TypeError

Traverse type error.

<u>Extend(s)</u>:
 - *Traverse.Error*

### (Class) Traverse.FormatError

Traverse format error.

<u>Extend(s)</u>:
 - *Traverse.Error*

### (Class) Traverse.ParseError

Traverse parse error.

<u>Extend(s)</u>:
 - *Traverse.Error*

### (Class) Traverse.SizeError

Traverse size error.

<u>Extend(s)</u>:
 - *Traverse.Error*

### (Class) Traverse.KeyNotFoundError

Traverse key not found error.

<u>Extend(s)</u>:
 - *Traverse.Error*

### (Class) Traverse.IndexOutOfRangeError

Traverse index out of range error.

<u>Extend(s)</u>:
 - *Traverse.Error*

### (Class) Traverse.ValueOutOfRangeError

Traverse value out of range error.

<u>Extend(s)</u>:
 - *Traverse.Error*

### WrapObject(inner, force)

Wrap an object with Traverse.

<u>Parameter(s)</u>:
 - inner (*): The inner object.
 - force (Boolean): Still wrap the object when the inner object is a Traverse.

<u>Return value</u>:
 - The traverse object.

<u>Example</u>:
```
var wrap1 = XRTLibTraverse.WrapObject({"key": "value"}, false);
var wrap2 = XRTLibTraverse.WrapObject(wrap1, false);
var wrap3 = XRTLibTraverse.WrapObject(wrap1, true);

//  Next three statements have the same output (output: "value").
console.log(wrap1.sub("key").inner());
console.log(wrap2.sub("key").inner());
console.log(wrap3.unwrap().sub("key").inner());
```

