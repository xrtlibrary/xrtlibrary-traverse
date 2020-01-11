# XRTLibrary-Traverse

## Introduction

In practice, we got trouble in reading configurations from JSON object securely and also in less lines of code.

For example, we have a socket configuration like:

```
let config = {
    "address": "127.0.0.1",
    "port": 443
};
```

In real word, you shouldn't read the configuration like this:

```
let address = config["address"];
let port = config["port"];
```

Because it's insecure, the "address" and "port" must exist and the "port" must be an integer larger than 0. So if you want to write secure codes, you have to write a lot of codes.

So we wrapped these codes into this module, now you can use following code to read it securely in only several lines of code. Like:

```
const XRTLibTraverse = require("xrtlibrary-traverse");
try {
    //  Wrap the configuration.
    let info = XRTLibTraverse.WrapObject(config, false);

    //  Read address and port.
    let address = info.sub("address").notNull().typeOf(String).unwrap();
    let port = info.sub("port").notNull().integer().minExclusive(0).unwrap();
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
const XRTLibTraverse = require("xrtlibrary-traverse");
```

## API

### (Constant) Traverse.DEFAULT_COMPARATOR

The default value comparator used by traverse module (which uses JavaScript's "==", "<=", "<", ">=", ">" operators to compare values).

### (Class) Traverse

Traverse helper.

#### (Type) TIterationCallbacks -> Object

Iteration callbacks.

<u>Properties</u>:
 - stop (*\(\) => void*): Call if the application wants to stop the iteration.
 - delete (*\(\) => void*): Call if the application wants to delete current item.

#### traverse.typeOf(constructor)

Check the type of inner object.

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: The constructor is not valid.
 - *Traverse.TypeError*: The inner object is not constructed by the constructor.

<u>Parameter(s)</u>:
 - constructor (*{new(...args: any[]): object}*): The constructor of the type.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.numeric()

Assume that the inner object is numeric.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is not numeric.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.integer()

Assume that the inner object is an integer.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is not an integer.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.boolean()

Assume that the inner object is a boolean.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is not boolean.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.string()

Assume that the inner object is a string.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is not string.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.stringValidate(charTable)

Validate the string by given character table.

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: The character table is not string.
 - *Traverse.FormatError*: The inner string mismatched with the character table.
 - *Traverse.TypeError*: The inner object is not string.

<u>Parameter(s)</u>:
 - charTable (*String*): The character table.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.stringValidateByRegExp(re)

Validate the string by given regular expression.

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: The "re" parameter is not a RegExp object.
 - *Traverse.FormatError*: The inner string mismatched with the regular expression.
 - *Traverse.TypeError*: The inner object is not string.

<u>Parameter(s)</u>:
 - re (*RegExp*): The regular expression.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.stringToInteger()

Convert the string to integer.

<u>Note(s)</u>:
 - Negative integer is allowed.
 - "-0" is considered as an integer.
 - Positive number starts with "0" is not considered as an integer.

<u>Exception(s)</u>:
 - *Traverse.FormatError*: The inner string does not represent an integer.
 - *Traverse.TypeError*: The inner object is null or not string.

<u>Return value</u>:
 - (*Traverse*) Traverse object that wraps the converted integer object.

#### traverse.stringToFloat()

Convert the string to float.

<u>Note(s)</u>:
 - "-0" is considered as numeric.
 - Floats are considered as numeric.
 - Floats starts with "." are not considered as numeric.
 - Positive numbers starts with "0" is not considered as numeric.

<u>Exception(s)</u>:
 - *Traverse.FormatError*: The inner string does not represent a float number.
 - *Traverse.TypeError*: The inner object is null or not string.

<u>Return value</u>:
 - (*Traverse*) Traverse object that wraps the converted float number object.

#### traverse.jsonLoad()

Load JSON object from current inner object (a string).

<u>Exception(s)</u>:
 - *Traverse.ParseError*: Failed to parse the JSON object.
 - *Traverse.TypeError*: The inner object is not string.

<u>Return value</u>:
 - (*Traverse*) The parsed JSON object wrapped with *Traverse*.

<u> Example</u>:
```
let input = "{\"key\": \"value\"}";
let info = XRTLibTraverse.WrapObject(input, false);
console.log(info.notNull().string().jsonLoad().sub("key").unwrap());  //  Output: "value".
```

#### traverse.jsonSave()

Save JSON object to a new Traverse object.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: Cyclic object value was found.
 - *Traverse.Error*: Other JSON serialization error occurred.

<u>Return value</u>:
 - (*Traverse*) The serialized JSON string wrapped with Traverse.

<u> Example</u>:
```
let input = {"key": "value"};
let info = XRTLibTraverse.WrapObject(input, false);
console.log(info.jsonSave().unwrap());     //  Output: "{\"key\": \"value\"}".
```

#### traverse.sub(name)

Go to sub directory.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: One of following conditions:
   - The inner object is NULL.
   - The inner object is not an Object or a Map object.
 - *Traverse.ParameterError*: The "name" parameter is not a string and the inner object is an Object.
 - *Traverse.KeyNotFoundError*: The sub path can't be found.

<u>Parameter(s)</u>:
 - name (*): The name(key) of sub directory.

<u>Return value</u>:
 - (*Traverse*) Traverse object of sub directory.

<u> Example</u>:
```
let info = XRTLibTraverse.WrapObject({"a": {"b": "c"}}, false);
console.log(info.sub("a").sub("b").unwrap());  //  Output: "c".
```

```
let mapping = new Map();
mapping.set("a", {"b": "c"});
let info = XRTLibTraverse.WrapObject(mapping, false);
console.log(info.sub("a").sub("b").unwrap());  //  Output: "c".
```

#### traverse.optionalSub(name, defaultValue)

Go to sub directory which can be non-existed.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: One of following conditions:
   - The inner object is NULL.
   - The inner object is not an Object or a Map object.
 - *Traverse.ParameterError*: The "name" parameter is not a string and the inner object is a Object.

<u>Parameter(s)</u>:
 - name (*): The name(key) of sub directory.
 - defaultValue (*): The default value if the directory doesn't exist.

<u>Return value</u>:
 - (*Traverse*) Traverse object of sub directory.

<u> Example</u>:
```
let info = XRTLibTraverse.WrapObject({"a": "b"}, false);
console.log(info.optionalSub("a", "non-exist").unwrap());  //  Output: "b".
console.log(info.optionalSub("b", "non-exist").unwrap());  //  Output: "non-exist".
```

#### traverse.notNull()

Assume that the inner object is not NULL.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is NULL.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.min(threshold, [comparator = Traverse.DEFAULT_COMPARATOR])

Give minimum value threshold to the inner object.

<u>Expected</u>:
 - inner >= threshold

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: The type of the inner object is different to the threshold object.
 - *Traverse.ValueOutOfRangeError*: The value is not within the threshold.

<u>Parameter(s)</u>:
 - threshold (*): The threshold.
 - comparator (*Traverse.Comparator*): (Optional) The comparator.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u> Example</u>:
```
let info = XRTLibTraverse.WrapObject(100, false);
info.min(50);  //  Nothing happened.
info.min(150); //  An error will be raised.
```

#### traverse.minExclusive(threshold, [comparator = Traverse.DEFAULT_COMPARATOR])

Give exclusive minimum value threshold to the inner object.

<u>Expected</u>:
 - inner > threshold

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: The type of the inner object is different to the threshold object.
 - *Traverse.ValueOutOfRangeError*: The value is not within the threshold.

<u>Parameter(s)</u>:
 - threshold (*): The threshold.
 - comparator (*Traverse.Comparator*): (Optional) The comparator.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.max(threshold, [comparator = Traverse.DEFAULT_COMPARATOR])

Give maximum value threshold to the inner object.

<u>Expected</u>:
 - inner <= threshold

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: The type of the inner object is different to the threshold object.
 - *Traverse.ValueOutOfRangeError*: The value is not within the threshold.

<u>Parameter(s)</u>:
 - threshold (*): The threshold.
 - comparator (*Traverse.Comparator*): (Optional) The comparator.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u> Example</u>:
```
let info = XRTLibTraverse.WrapObject(100, false);
info.max(150);  //  Nothing happened.
info.max(50); //  An error will be raised.
```

#### traverse.maxExclusive(threshold, [comparator = Traverse.DEFAULT_COMPARATOR])

Give exclusive maximum value threshold to the inner object.

<u>Expected</u>:
 - inner < threshold

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: The type of the inner object is different to the threshold object.
 - *Traverse.ValueOutOfRangeError*: The value is not within the threshold.

<u>Parameter(s)</u>:
 - threshold (*): The threshold.
 - comparator (*Traverse.Comparator*): (Optional) The comparator.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.range(minValue, maxValue, [comparator = Traverse.DEFAULT_COMPARATOR])

Give value threshold to the inner object.

<u>Expected</u>:
 - min <= inner <= max

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: The type of the inner object is different to the threshold objects.
 - *Traverse.ValueOutOfRangeError*: The value is not within the thresholds.

<u>Parameter(s)</u>:
 - minValue (*): The minimum threshold.
 - maxValue (*): The maximum threshold.
 - comparator (*Traverse.Comparator*): (Optional) The comparator.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.selectFromArray(from)

Select an item from specific array (inner object as the index).

<u>Exception(s)</u>:
 - *Traverse.TypeError*: One of following conditions:
   - The inner object is NULL.
   - The inner object is not an integer.
 - *Traverse.IndexOutOfRangeError*: The index out of range.
 - *Traverse.ParameterError*: The "from" parameter is not valid (not an array).

<u>Parameter(s)</u>:
 - from (*Array*): The array.

<u>Return value</u>:
 - (*Traverse*) Traverse object of selected item.

<u> Example</u>:
```
let info = XRTLibTraverse.WrapObject({
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
 - *Traverse.TypeError*: One of following conditions:
   - The inner object is NULL.
   - The inner object is not an integer.
 - *Traverse.KeyNotFoundError*: The key doesn't exist.

<u>Parameter(s)</u>:
 - from (*Object*): The object.

<u>Return value</u>:
 - (*Traverse*) Traverse object of selected item.

<u> Example</u>:
```
let info = XRTLibTraverse.WrapObject({
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
 - *Traverse.TypeError*: One of following conditions:
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
 - *Traverse.KeyNotFoundError*: The key doesn't exist.
 - *Traverse.ParameterError*: The "from" parameter is not valid (not a Map object).

<u>Parameter(s)</u>:
 - from (Map): The map.

<u>Return value</u>:
 - (*Traverse*) Traverse object of selected item.

#### traverse.selectFromMapOptional(from, defaultValue)

Select an optional item from specific map (inner object as the key).

<u>Exception(s)</u>:
 - *Traverse.ParameterError*: The "from" parameter is not valid (not a Map object).

<u>Parameter(s)</u>:
 - from (*Map*): The map.
 - defaultValue (*): The default value when the key doesn't exist.

<u>Return value</u>:
 - (Traverse) Traverse object of selected item.

#### traverse.objectForEach(callback)

Iterate an object.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is not an Object.

<u>Parameter(s)</u>:
 - callback (*(value: Traverse) => void*): The callback.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Example</u>:
```
let info = XRTLibTraverse.WrapObject({
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

Iterate an object (will callback with both key and value).

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is not an Object.

<u>Parameter(s)</u>:
 - callback (*(value: Traverse, key: string) => void*): The callback.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Example</u>:
```
let info = XRTLibTraverse.WrapObject({
    "a": 1,
    "b": 2,
    "c": 3
}, false);
info.objectForEachEx(function(value, key) {
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
 - *Traverse.TypeError*: The inner object is not an Object.

<u>Parameter(s)</u>:
 - key (*String*): The key.
 - value (*): The value.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Example</u>:
```
let data = {};
let info = XRTLibTraverse.WrapObject(data, false);
info.objectSet("key", "value");
console.log(data);   //  Output: {"key": "value"}
```

#### traverse.objectHas(key)

Get whether an object has specified key.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: One of following conditions:
   - The inner object is NULL.
   - The inner object is not an Object.

<u>Parameter(s)</u>:
 - key (*String*): The key.

<u>Return value</u>:
 - (*Boolean*) True if so.

<u>Example</u>:
```
let data = {"a": 1234, "c": 5678};
let info = XRTLibTraverse.WrapObject(data, false);
console.log(info.objectHas("a"));   //  Output: true
console.log(info.objectHas("b"));   //  Output: false
console.log(info.objectHas("c"));   //  Output: true
```

#### traverse.arrayLength()

Get the length of an array.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: One of following conditions:
   - The inner object is NULL.
   - The inner object is not an array.

<u>Return value</u>:
 - (*Number*) The length.

#### traverse.arrayGetItem(offset)

Get an item from an array.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: One of following conditions:
   - The inner object is NULL.
   - The inner object is not an array.
 - *Traverse.ParameterError*: *offset* is not an integer.
 - *Traverse.IndexOutOfRangeError*: *offset* is out of range.

<u>Parameter(s)</u>:
 - offset (*Number*): The offset of the item within the array.

<u>Return value</u>:
 - (*Traverse*) Traverse object of the item.

#### traverse.arraySetItem(offset, value)

Set an item from an array.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is not an array.
 - *Traverse.ParameterError*: *offset* is not an integer.
 - *Traverse.IndexOutOfRangeError*: *offset* is out of range.

<u>Parameter(s)</u>:
 - offset (*Number*): The offset of the item within the array.
 - value (*\**): The item value.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.arrayPushItem(value)

Push an item to an array.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is not an array.

<u>Parameter(s)</u>:
 - value (*\**): The item value.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Example</u>:

```
let nums = XRTLibTraverse.WrapObject([], false);
for (let i = 1; i <= 3; ++i) {
    nums.arrayPushItem(i);
}
console.log(nums.unwrap());
//  Output: [1, 2, 3]
```

#### traverse.arrayPopItem()

Pop an item from an array.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: One of following conditions:
   - The inner object is NULL.
   - The inner object is not an array.
 - *Traverse.IndexOutOfRangeError*: The array is already empty.

<u>Return value</u>:
 - (*Traverse*) Traverse object of the popped item.

```
let nums = XRTLibTraverse.WrapObject([1, 2, 3], false);
for (let i = 1; i <= 3; ++i) {
    console.log(nums.arrayPopItem().unwrap());
}
//  Output: 3, 2, 1
```

#### traverse.arrayShiftItem()

Shift an item from an array.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: One of following conditions:
   - The inner object is NULL.
   - The inner object is not an array.
 - *Traverse.IndexOutOfRangeError*: The array is already empty.

<u>Return value</u>:
 - (*Traverse*) Traverse object of the shifted item.

```
let nums = XRTLibTraverse.WrapObject([1, 2, 3], false);
for (let i = 1; i <= 3; ++i) {
    console.log(nums.arrayShiftItem().unwrap());
}
//  Output: 1, 2, 3
```

#### traverse.arrayUnshiftItem(value)

Unshift an item to an array.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is not an array.

<u>Parameter(s)</u>:
 - value (*\**): The item value.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Example</u>:

```
let nums = XRTLibTraverse.WrapObject([], false);
for (let i = 1; i <= 3; ++i) {
    nums.arrayUnshiftItem(i);
}
console.log(nums.unwrap());
//  Output: [3, 2, 1]
```

#### traverse.arrayForEach(callback, [reverse = false])

Iterate an array.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is not an array.

<u>Parameter(s)</u>:
 - callback (*(item: Traverse, cbs: TIterationCallbacks) => void*): The callback.
   - *item*: The traverse object that wraps the array item.
   - *cbs*: An object that contains callbacks that are used to stop iteration or delete current item.
 - reverse (*Boolean*): True if iteration direction should be inverted (from back to front).

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Example</u>:

A simple example that just iterates an array in normal direction:

```
let info = XRTLibTraverse.WrapObject(["I", "love", "you"], false);
info.arrayForEach(function(item) {
    console.log(item.unwrap());
});
//  Output: "I", "love", "you".
```

And you can also iterate the array in inverted (reverse) direction:

```
info.arrayForEach(function(item) {
    console.log(item.unwrap());
}, true /*  just set this parameter to true.  */);
//  Output: "you", "love", "I".
```

If you want to delete any item, you can call *cbs.delete()*:

```
info.arrayForEach(function(item, cbs) {
    let value = item.unwrap();
    if (value == "I") {
        cbs.delete();
	}
});
console.log(info.unwrap());
//  Output: ["love", "you"].
```

You can also stop iteration at any time by calling *cbs.stop()*:

```
//  Use the unmodified array here.
info.arrayForEach(function(item, cbs) {
    let value = item.unwrap();
    if (value == "you") {
        cbs.stop();
        return;
	}
	console.log(value);
});
//  Output: "I", "love".
```

Use both *cbs.delete()* and *cbs.stop()* is also allowed:

```
let root = XRTLibTraverse.WrapObject([-2, -1, 0, 1, 2, 3, 4, 5], false);
root.arrayForEach(function(item, cbs) {
    let  value = item.notNull().integer().unwrap();
    //  Stop if the value is non-positive.
    if (value <= 0) {
        cbs.stop();
    }
    //  Delete the item if its a even number.
    if ((value & 1) == 0) {
        cbs.delete();
    }
}, true /*  reverse  */);
console.log(root.unwrap());
//  Output: [-2, -1, 1, 3, 5].
```

#### ~~traverse.arrayForEachWithDeletion(callback)~~ (Deprecated)

```
This method has been deprecated. You shall:
1. Not recommended for new applications.
2. Use arrayForEach() instead.
3. This method would be removed totally in next major version.
```

Iterate an array with deletion.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is not an array.

<u>Parameter(s)</u>:
 - callback (*(item: Traverse) => Boolean*): The callback.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Note(s)</u>:
 - If the callback returns true, the item would be deleted.

<u>Example</u>:
```
let info = XRTLibTraverse.WrapObject(["I", "love", "you"], false);
info.arrayForEachWithDeletion(function(item) {
    return !(item.unwrap() == "love");
});
console.log(info.unwrap());  //  Output: ["love"]
```

#### traverse.arrayMinLength(minLength)

Assume the array has a minimum length.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is not an array.
 - *Traverse.SizeError*: The array size exceeds.

<u>Parameter(s)</u>:
 - minLength (*Number*): The minimum length.

<u>Return value</u>:
 - (*Traverse*) Self reference.

#### traverse.arrayMaxLength(maxLength)

Assume the array has a maximum length.

<u>Exception(s)</u>:
 - *Traverse.TypeError*: The inner object is not an array.
 - *Traverse.SizeError*: The array size exceeds.

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
 - Traverse.ParameterError: The type of "selections" parameter is not supported.
 - Traverse.KeyNotFoundError: The item doesn't exist in the "selections".

<u>Parameter(s)</u>:
 - selections (*Set|Map|Array|Object*): The selections.

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Example</u>:
```
let info = XRTLibTraverse.WrapObject("test", false);

//  Array.
info.oneOf(["ubuntu", "test"]);   //  Nothing happened.

//  Set.
let testSet = new Set();
testSet.add("test");
info.oneOf(testSet);              //  Nothing happened.

//  Map.
let testMap = new Map();
testMap.set("test", "value");
info.oneOf(testMap);              //  Nothing happened.

//  Object.
info.oneOf({
    "test": "value"
});                               //  Nothing happened.
info.oneOf({});                   //  Error will occurred.
```

#### traverse.customRule(callback)

Assume that the inner conforms to custom rule.

<u>Note(s)</u>:
 - The callback should return true if the inner conforms the custom rule.

<u>Exception(s)</u>:
 - *Traverse.Parameter*: One of following conditions:
    - The callback is not a Function.
    - The callback doesn't return a Boolean.
 - *Traverse.Error*: The callback return false.

<u>Parameter(s)</u>:
 - callback (*(item: \*) => Boolean)*)

<u>Return value</u>:
 - (*Traverse*) Self reference.

<u>Example</u>:
```
let info = XRTLibTraverse.WrapObject("info", false);

info.customRule(function(inner) {
    if (inner == "info") {
        return true;
    } else {
        return false;
    }
});
```

#### traverse.inner()

(Compatible, use unwrap() in new application) Get the inner object.

<u>Return</u>:
 - (*) The inner object.

#### traverse.unwrap()

Unwrap the traverse object.

<u>Return</u>:
 - (*) The inner object.

### (Class) Traverse.Comparator&lt;T&gt;

Value comparator for traverse module.

#### new Traverse.Comparator()

Constructs a new object.

#### comparator.eq(a, b)

Get whether two values ("a" and "b") are equal.

<u>Parameter(s)</u>:
 - a (*T*): The value "a".
 - b (*T*): The value "b".

<u>Return value</u>:
 - (*Boolean*) True if so.

#### comparator.le(a, b)

Get whether value "a" is less than or equal to value "b".

<u>Parameter(s)</u>:
 - a (*T*): The value "a".
 - b (*T*): The value "b".

<u>Return value</u>:
 - (*Boolean*) True if so.

#### comparator.lt(a, b)

Get whether value "a" is less than value "b".

<u>Parameter(s)</u>:
 - a (*T*): The value "a".
 - b (*T*): The value "b".

<u>Return value</u>:
 - (*Boolean*) True if so.

#### comparator.ge(a, b)

Get whether value "a" is greater than or equal to value "b".

<u>Parameter(s)</u>:
 - a (*T*): The value "a".
 - b (*T*): The value "b".

<u>Return value</u>:
 - (*Boolean*) True if so.

#### comparator.gt(a, b)

Get whether value "a" is greater than value "b".

<u>Parameter(s)</u>:
 - a (*T*): The value "a".
 - b (*T*): The value "b".

<u>Return value</u>:
 - (*Boolean*) True if so.

#### Example (use customized comparator)

First, create a class that inherits from this class, implements all 5 methods with your own comparation algorithm, like following:

```
const Util = require("util");

/*
 *  My custom comparator.
 *
 *  @constructor
 *  @extends {Traverse.Comparator}
 */
function CustomComparator() {
    //  Let parent class initialize.
    Traverse.Comparator.call(this);

    //
    //  Public methods.
    //
    this.eq = function(a, b) {
        return a.key == b.key;
    };
    this.le = function(a, b) {
        return a.key <= b.key;
    };
    this.lt = function(a, b) {
        return a.key < b.key;
    };
    this.ge = function(a, b) {
        return a.key >= b.key;
    };
    this.gt = function(a, b) {
        return a.key > b.key;
    };
}

//  Set inheritance.
Util.inherits(CustomComparator, Traverse.Comparator);
```

Then you have to create an instance of your custom comparator, like following:

```
let comparator = new CustomComparator();
```

Now you can use it with *Traverse*:

```
let root = WrapObject({
    "key": 100
}, false);
root.range({"key": 10}, {"key": 1000}, comparator);
```

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

### WrapObject(inner, [force = false])

Wrap an object with Traverse.

<u>Parameter(s)</u>:
 - inner (*): The inner object.
 - force (*Boolean*): (Optional) Still wrap the object when the inner object is a Traverse.

<u>Return value</u>:
 - The traverse object.

<u>Example</u>:
```
let wrap1 = XRTLibTraverse.WrapObject({"key": "value"}, false);
let wrap2 = XRTLibTraverse.WrapObject(wrap1, false);
let wrap3 = XRTLibTraverse.WrapObject(wrap1, true);

//  Next three statements have the same output (output: "value").
console.log(wrap1.sub("key").inner());
console.log(wrap2.sub("key").inner());
console.log(wrap3.unwrap().sub("key").inner());
```

