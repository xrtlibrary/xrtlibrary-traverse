//
//  Copyright 2015 - 2019 The XRT Authors. All rights reserved.
//  Use of this source code is governed by a BSD-style license that can be
//  found in the LICENSE.md file.
//

//
//  Imports.
//
var CrType = require("./type");
var CrValidator = require("./validator");
var Util = require("util");

//
//  Classes.
//

/**
 *  Traverse error.
 * 
 *  @constructor
 *  @param {String} [message] - The message.
 */
function TraverseError(message) {
    //  Let parent class initialize.
    if (arguments.length > 0) {
        Error.call(this, message);
        this.message = message;
    } else {
        Error.call(this);
        this.message = "Unknown error.";
    }
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
}

/**
 *  Traverse parameter error.
 * 
 *  @constructor
 *  @extends {TraverseError}
 *  @param {String} [message] - The message.
 */
function TraverseParameterError(message) {
    //  Let parent class initialize.
    TraverseError.apply(this, arguments);
}

/**
 *  Traverse type error.
 * 
 *  @constructor
 *  @extends {TraverseError}
 *  @param {String} [message] - The message.
 */
function TraverseTypeError(message) {
    //  Let parent class initialize.
    TraverseError.apply(this, arguments);
}

/**
 *  Traverse format error.
 * 
 *  @constructor
 *  @extends {TraverseError}
 *  @param {String} [message] - The message.
 */
function TraverseFormatError(message) {
    //  Let parent class initialize.
    TraverseError.apply(this, arguments);
}

/**
 *  Traverse parse error.
 * 
 *  @constructor
 *  @extends {TraverseError}
 *  @param {String} [message] - The message.
 */
function TraverseParseError(message) {
    //  Let parent class initialize.
    TraverseError.apply(this, arguments);
}

/**
 *  Traverse size error.
 * 
 *  @constructor
 *  @extends {TraverseError}
 *  @param {String} [message] - The message.
 */
function TraverseSizeError(message) {
    //  Let parent class initialize.
    TraverseError.apply(this, arguments);
}

/**
 *  Traverse key not found error.
 * 
 *  @constructor
 *  @extends {TraverseError}
 *  @param {String} [message] - The message.
 */
function TraverseKeyNotFoundError(message) {
    //  Let parent class initialize.
    TraverseError.apply(this, arguments);
}

/**
 *  Traverse index out of range error.
 * 
 *  @constructor
 *  @extends {TraverseError}
 *  @param {String} [message] - The message.
 */
function TraverseIndexOutOfRangeError(message) {
    //  Let parent class initialize.
    TraverseError.apply(this, arguments);
}

/**
 *  Traverse value out of range error.
 * 
 *  @constructor
 *  @extends {TraverseError}
 *  @param {String} [message] - The message.
 */
function TraverseValueOutOfRangeError(message) {
    //  Let parent class initialize.
    TraverseError.apply(this, arguments);
}

/**
 *  Traverse helper.
 * 
 *  @constructor
 *  @param {*} inner - The inner object.
 *  @param {String} path - The path.
 */
function Traverse(inner, path) {
    //
    //  Members.
    //

    //  Self reference.
    var self = this;

    //
    //  Private methods.
    //

    /**
     *  Get the representation of specified object.
     * 
     *  @param {*} obj - The object.
     *  @return {String} - The representation string.
     */
    function _GetObjectRepresentation(obj) {
        try {
            return JSON.stringify(obj);
        } catch(error) {
            return "(unserializable)";
        }
    }

    /**
     *  Get the path of specific sub directory.
     * 
     *  @param {String} name - The name of sub directory.
     */
    function _GetSubPath(name) {
        if (path.length == 0 || path[path.length - 1] == "/") {
            return path + name;
        } else {
            return path + "/" + name;
        }
    }

    //
    //  Public methods.
    //

    /**
     *  Check the type of inner object.
     * 
     *  Exception(s):
     *    [1] Traverse.ParameterError: 
     *        Raised if the constructor is not valid.
     *    [2] Traverse.TypeError: 
     *        Raised if the inner object is not constructed by the constructor.
     * 
     *  @param {{new(...args: any[]): object}} constructor - The constructor of 
     *                                                       the type.
     *  @return {Traverse} - Self.
     */
    this.typeOf = function(constructor) {
        //  Check input parameter.
        if (!CrType.IsInstanceOf(constructor, Function)) {
            throw new TraverseParameterError("Not a constructor.");
        }

        //  Check inner type.
        if (inner !== null && !CrType.IsInstanceOf(inner, constructor)) {
            throw new TraverseTypeError(Util.format(
                "Invalid object type (path=\"%s\").",
                path
            ));
        }

        return self;
    };

    /**
     *  Assume that the inner object is numeric.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised if the inner object is not numeric.
     * 
     *  @return {Traverse} - Self.
     */
    this.numeric = function() {
        self.typeOf(Number);
        return self;
    };

    /**
     *  Assume that the inner object is an integer.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised if the inner object is not an integer.
     * 
     *  @return {Traverse} - Self.
     */
    this.integer = function() {
        if (inner !== null) {
            //  The inner object must be a number first.
            self.numeric();
    
            //  Check whether the number is an integer.
            if (!Number.isInteger(inner)) {
                throw new TraverseTypeError(Util.format(
                    "Value should be an integer (path=\"%s\").",
                    path
                ));
            }
        }

        return self;
    };

    /**
     *  Assume that the inner object is a boolean.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised if the inner object is not boolean.
     * 
     *  @return {Traverse} - Self.
     */
    this.boolean = function() {
        self.typeOf(Boolean);
        return self;
    };

    /**
     *  Assume that the inner object is a string.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised if the inner object is not string.
     * 
     *  @return {Traverse} - Self.
     */
    this.string = function() {
        self.typeOf(String);
        return self;
    };

    /**
     *  Validate the string by given character table.
     * 
     *  Exception(s):
     *    [1] Traverse.ParameterError: 
     *        Raised if the character table is not string.
     *    [2] Traverse.FormatError: 
     *        Raised when the inner string mismatched with the character table.
     *    [3] Traverse.TypeError: 
     *        Raised when the inner object is not string.
     * 
     *  @param {String} charTable - The character table.
     *  @return {Traverse} - Self.
     */
    this.stringValidate = function(charTable) {
        //  Check parameter type.
        if (!CrType.IsInstanceOf(charTable, String)) {
            throw new TraverseParameterError("Invalid character table.");
        }

        if (!self.isNull()) {
            //  Check inner type.
            self.string();

            //  Validate the string.
            if (!CrValidator.ValidateString(inner, charTable)) {
                throw new TraverseFormatError(Util.format(
                    "String is invalid (allowed=\"%s\", path=\"%s\").",
                    charTable,
                    path
                ));
            }
        }

        return self;
    };

    /**
     *  Validate the string by given regular expression.
     * 
     *  Exception(s):
     *    [1] Traverse.ParameterError: 
     *        Raised if the "re" parameter is not a RegExp object.
     *    [2] Traverse.FormatError: 
     *        Raised when the inner string mismatched with the regular expressi-
     *        on.
     *    [3] Traverse.TypeError: 
     *        Raised if the inner object is not string.
     * 
     *  @param {RegExp} re - The regular expression.
     *  @return {Traverse} - Self.
     */
    this.stringValidateByRegExp = function(re) {
        //  Check parameter type.
        if (!CrType.IsInstanceOf(re, RegExp)) {
            throw new TraverseParameterError(
                "Invalid regular expression object."
            );
        }

        if (!self.isNull()) {
            //  Check inner type.
            self.string();

            //  Validate the string.
            if (!re.test(inner)) {
                throw new TraverseFormatError(Util.format(
                    "String is invalid (regexp=\"%s\", path=\"%s\").",
                    re.source,
                    path
                ));
            }
        }

        return self;
    };

    /**
     *  Load JSON object from current inner object (a string).
     * 
     *  Exception(s):
     *    [1] Traverse.ParseError: 
     *        Raised when the failed to parse the JSON object.
     *    [2] Traverse.TypeError: 
     *        Raised if the inner object is not string.
     * 
     *  @return {Traverse} - The parsed JSON object wrapped with Traverse.
     */
    this.jsonLoad = function() {
        //  Get the sub path.
        var subPath = _GetSubPath("[JSON(Load)]");

        if (!self.isNull()) {
            //  Ensure the inner object is a string.
            self.string();

            //  Parse the JSON.
            try {
                var parsed = JSON.parse(inner);
            } catch(error) {
                throw new TraverseParseError(Util.format(
                    "Unable to parse JSON object (error=\"%s\", path=\"%s\").",
                    error.message || "(unknown)",
                    subPath
                ));
            }

            return new Traverse(parsed, subPath);
        } else {
            return new Traverse(null, subPath);
        }
    };

    /**
     *  Save JSON object to a new Traverse object.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised when cyclic object value was found.
     *    [2] Traverse.Error: 
     *        Raised when other JSON serialization error occurred.
     * 
     *  @return {Traverse} - The serialized JSON string wrapped with Traverse.
     */
    this.jsonSave = function() {
        //  Serialize.
        try {
            var serialized = JSON.stringify(inner);
        } catch(error) {
            //
            //  Reference(s):
            //    [1] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Re
            //        ference/Global_Objects/JSON/stringify#Exceptions
            //
            if (error instanceof TypeError) {
                throw new TraverseTypeError(Util.format(
                    "Unable to serialize to JSON (error=\"%s\", path=\"%s\").",
                    error.message || "(unknown)",
                    subPath
                ));
            } else {
                //  Handle unstandardized error.
                throw new TraverseError(Util.format(
                    "Unable to serialize to JSON (error=\"%s\", path=\"%s\").",
                    error.message || "(unknown)",
                    subPath
                ));
            }
        }

        return new Traverse(serialized, _GetSubPath("[JSON(Save)]"));
    };

    /**
     *  Go to sub directory.
     *  
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised in one of following situations:
     * 
     *          - The inner object is NULL.
     *          - The inner object is not an Object or a Map object.
     * 
     *    [2] Traverse.ParameterError: 
     *        Raised if the "name" parameter is not a string and the inner obje-
     *        ct is a Object.
     *    [3] Traverse.KeyNotFoundError: 
     *        Raised if the sub path can't be found.
     * 
     *  @param {*} name - The name(key) of sub directory.
     *  @return {Traverse} - Traverse object of sub directory.
     */
    this.sub = function(name) {
        //  Pre-check.
        self.notNull();

        //  Get the sub path.
        var subPath = _GetSubPath(name);

        if (CrType.IsInstanceOf(inner, Map)) {
            if (inner.has(name)) {
                return new Traverse(inner.get(name), subPath);
            } else {
                throw new TraverseKeyNotFoundError(Util.format(
                    "Sub path doesn't exist (path=\"%s\").",
                    subPath
                ));
            }
        } else if (CrType.IsInstanceOf(inner, Object)) {
            //  Check key type.
            if (!CrType.IsInstanceOf(name, String)) {
                throw new TraverseParameterError(
                    "Name(key) must be a string when inner object is an Object."
                );
            }

            if (name in inner) {
                //  Go into inner path.
                return new Traverse(inner[name], subPath);
            } else {
                throw new TraverseKeyNotFoundError(Util.format(
                    "Sub path doesn't exist (path=\"%s\").",
                    subPath
                ));
            }
        } else {
            throw new TraverseTypeError(Util.format(
                "Invalid inner type (expect=Map/Object, path=\"%s\").",
                path
            ));
        }
    };

    /**
     *  Go to sub directory which can be non-existed.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised in following situations:
     * 
     *          - The inner object is NULL.
     *          - The inner object is not an Object or a Map object.
     * 
     *    [2] Traverse.ParameterError: 
     *        Raised if the "name" parameter is not a string and the inner obje-
     *        ct is a Object.
     * 
     *  @param {*} name - The name(key) of sub directory.
     *  @param {*} defaultValue - The default value if the directory doesn't 
     *                            exist.
     *  @return {Traverse} - Traverse object of sub directory.
     */
    this.optionalSub = function(name, defaultValue) {
        //  Pre-check.
        self.notNull();

        //  Get the sub path.
        var subPath = _GetSubPath(name);

        if (CrType.IsInstanceOf(inner, Map)) {
            if (inner.has(name)) {
                return new Traverse(inner.get(name), subPath);
            } else {
                return new Traverse(defaultValue, subPath);
            }
        } else if (CrType.IsInstanceOf(inner, Object)) {
            //  Check key type.
            if (!CrType.IsInstanceOf(name, String)) {
                throw new TraverseParameterError(
                    "Name(key) must be a string when inner object is an Object."
                );
            }

            if (name in inner) {
                //  Go into inner path.
                return new Traverse(inner[name], subPath);
            } else {
                return new Traverse(defaultValue, subPath);
            }
        } else {
            throw new TraverseTypeError(Util.format(
                "Invalid inner type (expect=map/object, path=\"%s\").",
                path
            ));
        }
    };

    /**
     *  Assume that the inner object is not NULL.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised when the inner object is NULL.
     * 
     *  @return {Traverse} - Self.
     */
    this.notNull = function() {
        //  Ensure the value is not null.
        if (inner === null) {
            throw new TraverseTypeError(Util.format(
                "Value should not be NULL (path=\"%s\").",
                path
            ));
        }

        return self;
    };

    /**
     *  Give minimum value threshold to the inner object.
     * 
     *  Expected:
     *    [1] inner >= threshold
     * 
     *  Exception(s):
     *    [1] Traverse.ParameterError: 
     *        Raised if the type of the inner object is different to the thresh-
     *        old object.
     *    [2] Traverse.ValueOutOfRangeError: 
     *        Raised if the value is not within the threshold.
     * 
     *  @param {*} threshold - The threshold.
     *  @return {Traverse} - Self.
     */
    this.min = function(threshold) {
        if (inner !== null) {
            //  Check object type.
            if (!CrType.IsSameType(inner, threshold)) {
                throw new TraverseParameterError(Util.format(
                    "Uncomparable type (path=\"%s\").",
                    path
                ));
            }

            //  Check value range.
            if (inner < threshold) {
                throw new TraverseValueOutOfRangeError(Util.format(
                    "Value is too small (path=\"%s\", require='>=', " + 
                    "threshold=%s).",
                    path,
                    _GetObjectRepresentation(threshold) || "(unrepresentable)"
                ));
            }
        }

        return self;
    };

    /**
     *  Give exclusive minimum value threshold to the inner object.
     * 
     *  Expected:
     *    [1] inner > threshold
     * 
     *  Exception(s):
     *    [1] Traverse.ParameterError: 
     *        Raised if the type of the inner object is different to the thresh-
     *        old object.
     *    [2] Traverse.ValueOutOfRangeError: 
     *        Raised if the value is not within the threshold.
     * 
     *  @param {*} threshold - The threshold.
     *  @return {Traverse} - Self.
     */
    this.minExclusive = function(threshold) {
        if (inner !== null) {
            //  Check object type.
            if (!CrType.IsSameType(inner, threshold)) {
                throw new TraverseParameterError(Util.format(
                    "Uncomparable type (path=\"%s\").",
                    path
                ));
            }

            //  Check value range.
            if (inner <= threshold) {
                throw new TraverseValueOutOfRangeError(Util.format(
                    "Value is too small (path=\"%s\", require='>', " + 
                    "threshold=%s.",
                    path,
                    _GetObjectRepresentation(threshold) || "(unrepresentable)"
                ));
            }
        }

        return self;
    };

    /**
     *  Give maximum value threshold to the inner object.
     * 
     *  Expected:
     *    [1] inner <= threshold
     * 
     *  Exception(s):
     *    [1] Traverse.ParameterError: 
     *        Raised if the type of the inner object is different to the thresh-
     *        old object.
     *    [2] Traverse.ValueOutOfRangeError: 
     *        Raised if the value is not within the threshold.
     * 
     *  @param {*} threshold - The threshold.
     *  @return {Traverse} - Self.
     */
    this.max = function(threshold) {
        if (inner !== null) {
            //  Check object type.
            if (!CrType.IsSameType(inner, threshold)) {
                throw new TraverseParameterError(Util.format(
                    "Uncomparable type (path=\"%s\").",
                    path
                ));
            }

            //  Check value range.
            if (inner > threshold) {
                throw new TraverseValueOutOfRangeError(Util.format(
                    "Value is too large (path=\"%s\", require='<=', " + 
                    "threshold=%s).",
                    path,
                    _GetObjectRepresentation(threshold) || "(unrepresentable)"
                ));
            }
        }

        return self;
    };

    /**
     *  Give exclusive maximum value threshold to the inner object.
     * 
     *  Expected:
     *    [1] inner < threshold
     * 
     *  Exception(s):
     *    [1] Traverse.ParameterError: 
     *        Raised if the type of the inner object is different to the thresh-
     *        old object.
     *    [2] Traverse.ValueOutOfRangeError: 
     *        Raised if the value is not within the threshold.
     * 
     *  @param {*} threshold - The threshold.
     *  @return {Traverse} - Self.
     */
    this.maxExclusive = function(threshold) {
        if (inner !== null) {
            //  Check object type.
            if (!CrType.IsSameType(inner, threshold)) {
                throw new TraverseParameterError(Util.format(
                    "Uncomparable type (path=\"%s\").",
                    path
                ));
            }

            //  Check value range.
            if (inner >= threshold) {
                throw new TraverseValueOutOfRangeError(Util.format(
                    "Value is too large (path=\"%s\", require='<', " + 
                    "threshold=%s).",
                    path,
                    _GetObjectRepresentation(threshold) || "(unrepresentable)"
                ));
            }
        }

        return self;
    };

    /**
     *  Give value threshold to the inner object.
     * 
     *  Expected:
     *    [1] min <= inner <= max
     * 
     *  Exception(s):
     *    [1] Traverse.ParameterError: 
     *        Raised if the type of the inner object is different to the thresh-
     *        old objects.
     *    [2] Traverse.ValueOutOfRangeError: 
     *        Raised if the value is not within the thresholds.
     * 
     *  @param {*} minValue - The minimum threshold.
     *  @param {*} maxValue - The maximum threshold.
     *  @return {Traverse} - Self.
     */
    this.range = function(minValue, maxValue) {
        return self.min(minValue).max(maxValue);
    };

    /**
     *  Select an item from specific array (inner object as the index).
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised in following situations:
     * 
     *          - The inner object is NULL.
     *          - The inner object is not an integer.
     * 
     *    [2] Traverse.IndexOutOfRangeError: 
     *        Raised if the index out of range.
     *    [3] Traverse.ParameterError: 
     *        Raised if the "from" parameter is not valid (not an array).
     * 
     *  @param {Array} from - The array.
     *  @return {Traverse} - Traverse object of selected item.
     */
    this.selectFromArray = function(from) {
        //  Check from object.
        if (!Array.isArray(from)) {
            throw new TraverseParameterError("Expect an array object.");
        }

        //  Check inner type.
        try {
            self.notNull().integer().min(0).maxExclusive(from.length);
        } catch(error) {
            if (error instanceof TraverseValueOutOfRangeError) {
                throw new TraverseIndexOutOfRangeError(error.message);
            } else {
                throw error;
            }
        }

        //  Wrap new object.
        return new Traverse(from[inner], _GetSubPath(Util.format(
            "[%d]",
            inner
        )));
    };

    /**
     *  Select an item from specific object (inner object as the key).
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised in following situations:
     * 
     *          - The inner object is NULL.
     *          - The inner object is not string.
     * 
     *    [2] Traverse.KeyNotFoundError: 
     *        Raised if the key doesn't exist.
     * 
     *  @param {Object} from - The object.
     *  @return {Traverse} - Traverse object of selected item.
     */
    this.selectFromObject = function(from) {
        //  Check from object.
        if (!(from instanceof Object)) {
            throw new TraverseParameterError("Expect an object.");
        }

        //  Check inner type.
        self.notNull().typeOf(String);

        //  Check key existence.
        if (!(inner in from)) {
            throw new TraverseKeyNotFoundError(Util.format(
                "\"%s\" doesn't exist (path=\"%s\").",
                inner,
                path
            ));
        }

        //  Wrap new object.
        return new Traverse(from[inner], _GetSubPath(inner));
    };

    /**
     *  Select an optional item from specific object (inner object as the key).
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised in following situations:
     * 
     *          - The inner object is NULL.
     *          - The inner object is not string.
     * 
     *  @param {Object} from - The object.
     *  @param {*} defaultValue - The default value if the key doesn't exist.
     *  @return {Traverse} - Traverse object of selected item.
     */
    this.selectFromObjectOptional = function(from, defaultValue) {
        //  Check inner type.
        self.notNull().typeOf(String);

        try {
            return self.selectFromObject(from);
        } catch(error) {
            if (error instanceof TraverseKeyNotFoundError) {
                return new Traverse(defaultValue, _GetSubPath(inner));
            } else {
                throw error;
            }
        }
    };

    /**
     *  Select an item from specific map (use inner object as the key).
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised if the inner object is NULL.
     *    [2] Traverse.KeyNotFoundError: 
     *        Raised if the key doesn't exist.
     *    [3] Traverse.ParameterError: 
     *        Raised if the "from" parameter is not valid (not a Map object).
     * 
     *  @param {Map} from - The map.
     *  @return {Traverse} - Traverse object of selected item.
     */
    this.selectFromMap = function(from) {
        //  Check from object.
        if (!(from instanceof Map)) {
            throw new TraverseParameterError("Expect a map object.");
        }

        //  Check inner object.
        self.notNull();

        //  Check key existence.
        if (!from.has(inner)) {
            throw new TraverseKeyNotFoundError(Util.format(
                "\"%s\" doesn't exist (path=\"%s\").",
                inner,
                path
            ));
        }

        //  Wrap new object.
        return new Traverse(from.get(inner), _GetSubPath(
            _GetObjectRepresentation(inner) || "(unrepresentable)"
        ));
    };

    /**
     *  Select an optional item from specific map (inner object as the key).
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised if the inner object is NULL.
     *    [2] Traverse.ParameterError: 
     *        Raised if the "from" parameter is not valid (not a Map object).
     * 
     *  @param {Map} from - The map.
     *  @param {*} defaultValue - The default value when the key doesn't exist.
     *  @return {Traverse} - Traverse object of selected item.
     */
    this.selectFromMapOptional = function(from, defaultValue) {
        try {
            return self.selectFromMap(from);
        } catch(error) {
            if (error instanceof TraverseKeyNotFoundError) {
                return new Traverse(defaultValue, _GetSubPath(
                    _GetObjectRepresentation(inner) || "(unrepresentable)"
                ));
            } else {
                throw error;
            }
        }
    };

    /**
     *  Iterate an object.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised in following situations:
     * 
     *          - The inner object is NULL.
     *          - The inner object is not an Object.
     * 
     *  @param {(value: Traverse) => void} callback - The callback.
     *  @return {Traverse} - Self.
     */
    this.objectForEach = function(callback) {
        self.objectForEachEx(function(traverse) {
            callback.call(self, traverse);
        });
    };

    /**
     *  Iterate an object (will callback with key parameter).
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised in following situations:
     * 
     *          - The inner object is NULL.
     *          - The inner object is not an Object.
     * 
     *  @param {(value: Traverse, key: string) => void} callback - The callback.
     *  @return {Traverse} - Self.
     */
    this.objectForEachEx = function(callback) {
        //  Check type.
        self.notNull().typeOf(Object);

        //  Scan all keys.
        for (var key in inner) {
            callback.call(
                self, 
                new Traverse(inner[key], _GetSubPath(key)), 
                key
            );
        }

        return self;
    };

    /**
     *  Set a key-value pair within an object.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised in following situations:
     * 
     *          - The inner object is NULL.
     *          - The inner object is not an Object.
     * 
     *  @param {String} key - The key.
     *  @param {*} value - The value.
     *  @return {Traverse} - Self.
     */
    this.objectSet = function(key, value) {
        //  Check type.
        self.notNull().typeOf(Object);

        //  Set the key pair.
        inner[key] = value;

        return self;
    };

    /**
     *  Get whether an object has specified key.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised in following situations:
     * 
     *          - The inner object is NULL.
     *          - The inner object is not an Object.
     * 
     *  @param {String} key - The key.
     *  @return {Boolean} - True if so.
     */
    this.objectHas = function(key) {
        //  Check type.
        self.notNull().typeOf(Object);

        return (key in inner);
    };

    /**
     *  Iterate an array.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised in following situations:
     * 
     *          - The inner object is NULL.
     *          - The inner object is not an array.
     * 
     *  @param {(item: Traverse) => void} callback - The callback.
     *  @return {Traverse} - Self.
     */
    this.arrayForEach = function(callback) {
        //  Check type.
        self.notNull().typeOf(Array);

        //  Scan all items.
        for (var i = 0; i < inner.length; ++i) {
            callback.call(self, new Traverse(
                inner[i], 
                _GetSubPath(Util.format("[%d]", i))
            ));
        }

        return self;
    };

    /**
     *  Iterate an array with deletion.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised in following situations:
     * 
     *          - The inner object is NULL.
     *          - The inner object is not an array.
     * 
     *  Note(s):
     *    [1] If the callback returns true, the item would be deleted.
     * 
     *  @param {(item: Traverse) => Boolean} callback - The callback.
     *  @return {Traverse} - Self.
     */
    this.arrayForEachWithDeletion = function(callback) {
        //  Check type.
        self.notNull().typeOf(Array);

        //  Scan all items.
        var cursor = 0;
        while (cursor < inner.length) {
            var isDelete = callback.call(
                self, 
                new Traverse(
                    inner[cursor], 
                    _GetSubPath(Util.format("[%d]", cursor))
                )
            );
            if (isDelete) {
                inner.splice(cursor, 1);
            } else {
                ++cursor;
            }
        }

        return self;
    };

    /**
     *  Assume the array has a minimum length.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised in following situations:
     * 
     *          - The inner object is NULL.
     *          - The inner object is not an array.
     * 
     *    [2] Traverse.SizeError: 
     *        Raised if the array size exceeds.
     * 
     *  @param {Number} minLength - The minimum length.
     *  @return {Traverse} - Self.
     */
    this.arrayMinLength = function(minLength) {
        //  Check type.
        self.notNull().typeOf(Array);

        //  Check array length.
        var currentLength = inner.length;
        if (currentLength < minLength) {
            throw new TraverseSizeError(Util.format(
                "Array should have at least %d item(s) (path=\"%s\", " + 
                "current=%d).",
                minLength,
                path,
                currentLength
            ));
        }

        return self;
    };

    /**
     *  Assume the array has a maximum length.
     * 
     *  Exception(s):
     *    [1] Traverse.TypeError: 
     *        Raised in following situations:
     * 
     *          - The inner object is NULL.
     *          - The inner object is not an array.
     * 
     *    [2] Traverse.SizeError: 
     *        Raised if the array size exceeds.
     * 
     *  @param {Number} maxLength - The maximum length.
     *  @return {Traverse} - Self.
     */
    this.arrayMaxLength = function(maxLength) {
        //  Check type.
        self.notNull().typeOf(Array);

        //  Check array length.
        var currentLength = inner.length;
        if (currentLength > maxLength) {
            throw new TraverseSizeError(Util.format(
                "Array should have at most %d item(s) (path=\"%s\", " + 
                "current=%d).",
                maxLength,
                path,
                currentLength
            ));
        }

        return self;
    };

    /**
     *  Get whether the inner object is NULL.
     * 
     *  @return {Boolean} - True if so.
     */
    this.isNull = function() {
        return inner === null;
    };

    /**
     *  Assume that the inner object is in specific selections.
     * 
     *  Exception(s):
     *    [1] Traverse.ParameterError: 
     *        Raised if the type of "selections" parameter is not supported.
     *    [2] Traverse.KeyNotFoundError: 
     *        Raised if the item doesn't exist in the "selections".
     * 
     *  @param {Set|Map|Array|Object} selections - The selections.
     *  @return {Traverse} - Self.
     */
    this.oneOf = function(selections) {
        if (inner !== null) {
            var has = false;
            if (selections instanceof Set) {
                has = selections.has(inner);
            } else if (selections instanceof Map) {
                has = selections.has(inner);
            } else if (selections instanceof Array) {
                has = (selections.indexOf(inner) >= 0);
            } else if (selections instanceof Object) {
                has = (inner in selections);
            } else {
                throw new TraverseParameterError(
                    "Unsupported selections type (only Map/Set/Array/Object " + 
                    "is valid)."
                );
            }
            if (!has) {
                throw new TraverseKeyNotFoundError(Util.format(
                    "\"%s\" is not available.",
                    _GetObjectRepresentation(inner) || "(unrepresentable)"
                ));
            }
        }

        return self;
    }

    /**
     *  (Compatible, use unwrap() in new application) Get the inner object.
     * 
     *  @return {*} - The inner object.
     */
    this.inner = function() {
        return inner;
    };

    /**
     *  Unwrap the traverse object.
     * 
     *  @return {*} - The inner object.
     */
    this.unwrap = function() {
        return self.inner();
    };
}
Traverse.Error = TraverseError;
Traverse.ParameterError = TraverseParameterError;
Traverse.TypeError = TraverseTypeError;
Traverse.FormatError = TraverseFormatError;
Traverse.ParseError = TraverseParseError;
Traverse.SizeError = TraverseSizeError;
Traverse.KeyNotFoundError = TraverseKeyNotFoundError;
Traverse.IndexOutOfRangeError = TraverseIndexOutOfRangeError;
Traverse.ValueOutOfRangeError = TraverseValueOutOfRangeError;

//
//  Public functions.
//

/**
 *  Wrap an object with Traverse.
 * 
 *  @param {*} inner - The inner object.
 *  @param {Boolean} force - Still wrap the object when the inner object is a 
 *                           Traverse.
 *  @return {Traverse} - The traverse object.
 */
function WrapObject(inner, force) {
    if ((inner instanceof Traverse) && !force) {
        return inner;
    } else {
        return new Traverse(inner, "/");
    }
}

//
//  Inheritances.
//
Util.inherits(TraverseError, Error);
Util.inherits(TraverseParameterError, TraverseError);
Util.inherits(TraverseTypeError, TraverseError);
Util.inherits(TraverseFormatError, TraverseError);
Util.inherits(TraverseParseError, TraverseError);
Util.inherits(TraverseSizeError, TraverseError);
Util.inherits(TraverseKeyNotFoundError, TraverseError);
Util.inherits(TraverseIndexOutOfRangeError, TraverseError);
Util.inherits(TraverseValueOutOfRangeError, TraverseError);

//  Export public APIs.
module.exports = {
    "Traverse": Traverse,
    "WrapObject": WrapObject
};