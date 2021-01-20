//
//  Copyright 2015 - 2021 The XRT Authors. All rights reserved.
//  Use of this source code is governed by a BSD-style license that can be
//  found in the LICENSE.md file.
//

//
//  Imports.
//

//  Imported modules.
import CrTextDetector = require("./text/detector");
import CrType = require("./type");
import CrValidator = require("./validator");

//
//  Interfaces.
//

/**
 *  Interation callbacks.
 */
interface TIterationCallbacks {
    //
    //  Members.
    //

    /**
     *  Call if the application wants to stop the iteration.
     */
    stop: () => void;

    /**
     *  Call if the application wants to delete current item.
     */
    delete: () => void;
}

//
//  Classes.
//

/**
 *  Traverse error.
 */
class TraverseError extends Error {
    //
    //  Constructor.
    //

    /**
     *  Constructor of the object.
     * 
     *  @param message 
     *      - The message.
     */
    constructor(message: string = "") {
        super(message);
        this.message = message;
        this.name = this.constructor.name;
    }
}

/**
 *  Traverse parameter error.
 */
class TraverseParameterError extends TraverseError {}

/**
 *  Traverse type error.
 */
class TraverseTypeError extends TraverseError {}

/**
 *  Traverse format error.
 */
class TraverseFormatError extends TraverseError {}

/**
 *  Traverse parse error.
 */
class TraverseParseError extends TraverseError{}

/**
 *  Traverse size error.
 */
class TraverseSizeError extends TraverseError {}

/**
 *  Traverse key not found error.
 */
class TraverseKeyNotFoundError extends TraverseError {}

/**
 *  Traverse index out of range error.
 */
class TraverseIndexOutOfRangeError extends TraverseError {}

/**
 *  Traverse value out of range error.
 */
class TraverseValueOutOfRangeError extends TraverseError {}

/**
 *  Value comparator for traverse module.
 * 
 *  @template T
 */
class TraverseComparator<T> {
    //
    //  Public methods.
    //

    /**
     *  Get whether two values ("a" and "b") are equal.
     * 
     *  @param a
     *      - The value "a".
     *  @param b
     *      - The value "b".
     *  @returns 
     *      - True if so.
     */
    public eq(a: T, b: T) {
        return a == b;
    };

    /**
     *  Get whether value "a" is less than or equal to value "b".
     * 
     *  @param a
     *      - The value "a".
     *  @param b
     *      - The value "b".
     *  @returns 
     *      - True if so.
     */
    public le(a: T, b: T) {
        return a <= b;
    };

    /**
     *  Get whether value "a" is less than value "b".
     * 
     *  @param a
     *      - The value "a".
     *  @param b
     *      - The value "b".
     *  @returns 
     *      - True if so.
     */
    public lt(a: T, b: T) {
        return a < b;
    };

    /**
     *  Get whether value "a" is greater than or equal to value "b".
     * 
     *  @param a
     *      - The value "a".
     *  @param b
     *      - The value "b".
     *  @returns
     *      - True if so.
     */
    public ge(a: T, b: T) {
        return a >= b;
    };

    /**
     *  Get whether value "a" is greater than value "b".
     * 
     *  @param a
     *      - The value "a".
     *  @param b
     *      - The value "b".
     *  @returns
     *      - True if so.
     */
    public gt(a: T, b: T) {
        return a > b;
    };
}

/**
 *  Traverse helper.
 */
export class Traverse {

    //
    //  Private members.
    //

    /**
     *  The inner object.
     */
    private _inner: any;

    /**
     *  The path.
     */
    private path: string;

    //  Passed condition checks.
    private pckNotNull = false;
    private pckTypeOf = new Map();

    //
    //  Constructor.
    //

    /**
     *  Construct the objefct.
     * 
     *  @param inner 
     *      - The inner.
     *  @param path 
     *      - The path.
     */
    constructor(inner: any, path: string) {
        this._inner = inner;
        this.path = path;
    }

    //
    //  Private methods.
    //

    /**
     *  Get the representation of specified object.
     * 
     *  @param obj
     *      - The object.
     *  @returns
     *      - The representation string.
     */
    private _GetObjectRepresentation(obj: any): string {
        try {
            return JSON.stringify(obj);
        } catch(error) {
            return "(unserializable)";
        }
    }

    /**
     *  Get the path of specific sub directory.
     * 
     *  @param name
     *      - The name of sub directory.
     *  @returns
     *      - The path of specific sub directory.
     */
    private _GetSubPath(name: string): string {
        if (this.path.length == 0 || this.path[this.path.length - 1] == "/") {
            return this.path + name;
        } else {
            return this.path + "/" + name;
        }
    }

    //
    //  Public methods.
    //

    /**
     *  Check the type of inner object.
     * 
     *  @throws {Traverse.ParameterError}
     *      - The constructor is not valid.
     *  @throws {Traverse.TypeError}
     *      - The inner object is not constructed by the constructor.
     *  @param constructor
     *      - The constructor of the type.
     *  @return
     *      - Self.
     */
    public typeOf(constructor: any): Traverse {
        //  Check input parameter.
        if (!CrType.IsInstanceOf(constructor, Function)) {
            throw new TraverseParameterError("Not a constructor.");
        }

        //  Try to use cache first.
        if (this.pckTypeOf.has(constructor)) {
            let passed = this.pckTypeOf.get(constructor);
            if (!passed) {
                throw new TraverseTypeError(
                    `Invalid object type (path=\"${this.path}\").`
                );
            }
        } else {
            //  Cache missed.
            if (
                this._inner !== null && 
                !CrType.IsInstanceOf(this._inner, constructor)
            ) {
                
                this.pckTypeOf.set(constructor, false);
                throw new TraverseTypeError(
                    `Invalid object type (path=\"${this.path}\").`
                );
            }
            this.pckTypeOf.set(constructor, true);
        }

        return this;
    };

    /**
     *  Assume that the inner object is numeric.
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is not numeric.
     *  @return
     *      - Self.
     */
    public numeric(): Traverse {
        this.typeOf(Number);
        return this;
    };

    /**
     *  Assume that the inner object is an integer.
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is not an integer.
     *  @returns 
     *      - Self.
     */
    public integer(): Traverse {
        if (this._inner !== null) {
            //  The inner object must be a number first.
            this.numeric();
    
            //  Check whether the number is an integer.
            if (!Number.isInteger(this._inner)) {
                throw new TraverseTypeError(
                    `Value should be an integer (path=\"${this.path}\").`,
                );
            }
        }

        return this;
    };

    /**
     *  Assume that the inner object is a boolean.
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is not a boolean.
     *  @returns
     *      - Self.
     */
    public boolean(): Traverse {
        this.typeOf(Boolean);
        return this;
    };

    /**
     *  Assume that the inner object is a string.
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is not string.
     *  @return
     *      - Self.
     */
    public string(): Traverse {
        this.typeOf(String);
        return this;
    };

    /**
     *  Validate the string by given character table.
     * 
     *  @throws {Traverse.ParameterError}
     *      - The character table is not string.
     *  @throws {Traverse.FormatError}
     *      - The inner string mismatched with the character table.
     *  @throws {Traverse.TypeError}
     *      - The inner object is not string.
     *  @param charTable
     *      - The character table.
     *  @returns
     *      - Self.
     */
    public stringValidate(charTable: string): Traverse {
        //  Check parameter type.
        if (!CrType.IsInstanceOf(charTable, String)) {
            throw new TraverseParameterError("Invalid character table.");
        }

        if (!this.isNull()) {
            //  Check inner type.
            this.string();

            //  Validate the string.
            if (!CrValidator.ValidateString(this._inner, charTable)) {
                throw new TraverseFormatError(
                    `String is invalid (allowed=\"${charTable}\", ` + 
                    `path=\"${this.path}\").`,
                );
            }
        }

        return this;
    };

    /**
     *  Validate the string by given regular expression.
     * 
     *  @throws {Traverse.ParameterError}
     *      - The "re" parameter is not a RegExp object.
     *  @throws {Traverse.FormatError}
     *      - The inner string mismatched with the regular expression.
     *  @throws {Traverse.TypeError}
     *      - The inner object is not string.
     *  @param re
     *      - The regular expression.
     *  @returns 
     *      - Self.
     */
    public stringValidateByRegExp(re: RegExp): Traverse {
        //  Check parameter type.
        if (!CrType.IsInstanceOf(re, RegExp)) {
            throw new TraverseParameterError(
                "Invalid regular expression object."
            );
        }

        if (!this.isNull()) {
            //  Check inner type.
            this.string();

            //  Validate the string.
            if (!re.test(this._inner)) {
                throw new TraverseFormatError(
                    `String is invalid (regexp=\"${re.source}\", ` +
                    `path=\"${this.path}\").`
                );
            }
        }

        return this;
    };

    /**
     *  Convert the string to integer.
     * 
     *  Note(s):
     *    [1] Negative integer is allowed.
     *    [2] "-0" is considered as an integer.
     *    [3] Positive number starts with "0" is not considered as an integer.
     * 
     *  @throws {Traverse.FormatError}
     *      - The inner string does not represent an integer.
     *  @throws {Traverse.TypeError}
     *      - The inner object is null or not string.
     *  @returns 
     *      - Traverse object that wraps the converted integer object.
     */
    public stringToInteger(): Traverse {
        //  Check inner type.
        this.notNull().typeOf(String);

        //  Validate the string.
        if (!CrTextDetector.IsInteger(this._inner)) {
            throw new TraverseFormatError(
                `Not a valid integer string (path=\"${this.path}\").`
            );
        }

        //  Parse the string.
        let intValue = parseInt(this._inner, 10);

        return new Traverse(
            intValue,
            this._GetSubPath("[str->int]")
        );
    };

    /**
     *  Convert the string to float.
     * 
     *  Note(s):
     *    [1] "-0" is considered as numeric.
     *    [2] Floats are considered as numeric.
     *    [2] Floats starts with "." are not considered as numeric.
     *    [3] Positive numbers starts with "0" is not considered as numeric.
     * 
     *  @throws {Traverse.FormatError}
     *      - The inner string does not represent a float number.
     *  @throws {Traverse.TypeError}
     *      - The inner object is null or not string.
     *  @returns 
     *      - Traverse object that wraps the converted float number object.
     */
    public stringToFloat(): Traverse {
        //  Check inner type.
        this.notNull().typeOf(String);

        //  Validate the string.
        if (!CrTextDetector.IsNumericStrict(this._inner)) {
            throw new TraverseFormatError(
                `Not a valid float string (path=\"${this.path}\").`
            );
        }

        //  Parse the string.
        let floatValue = parseFloat(this._inner);

        return new Traverse(
            floatValue,
            this._GetSubPath("[str->float]")
        );
    };

    /**
     *  Load JSON object from current inner object (a string).
     * 
     *  @throws {Traverse.ParseError}
     *      - Failed to parse the JSON object.
     *  @throws {Traverse.TypeError}
     *      - The inner object is not string.
     *  @returns 
     *      - The parsed JSON object wrapped with Traverse.
     */
    public jsonLoad(): Traverse {
        //  Get the sub path.
        let subPath = this._GetSubPath("[JSON(Load)]");

        if (!this.isNull()) {
            //  Ensure the inner object is a string.
            this.string();

            //  Parse the JSON.
            let parsed = null;
            try {
                parsed = JSON.parse(this._inner);
            } catch(error) {
                throw new TraverseParseError(
                    `Unable to parse JSON object (` +
                    `error=\"${error.message || "(unknown)"}\", ` +
                    `path=\"${subPath}\").`
                );
            }

            return new Traverse(parsed, subPath);
        } else {
            return new Traverse(null, subPath);
        }
    };

    /**
     *  Save JSON object to a new Traverse object.
     * 
     *  @throws {Traverse.TypeError}
     *      - Cyclic object value was found.
     *  @throws {Traverse.Error}
     *      - Other JSON serialization error occurred.
     *  @returns 
     *      - The serialized JSON string wrapped with Traverse.
     */
    public jsonSave(): Traverse {
        
        let subPath: string = this._GetSubPath("[JSON(Save)]");
        try {
            //  Serialize.
            let serialized = JSON.stringify(this._inner);
            return new Traverse(serialized, subPath);
        } catch(error) {
            //
            //  Reference(s):
            //    [1] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Re
            //        ference/Global_Objects/JSON/stringify#Exceptions
            //
            if (error instanceof TypeError) {
                throw new TraverseTypeError(
                    `Unable to serialize to JSON (` +
                    `error=\"${error.message || "(unknown)"}\", ` +
                    `path=\"${subPath}\").`
                );
            } else {
                //  Handle unstandardized error.
                throw new TraverseError(
                    `Unable to serialize to JSON (` +
                    `error=\"${error.message || "(unknown)"}\", ` +
                    `path=\"${subPath}\").`
                );
            }
        }
    };

    /**
     *  Go to sub directory.
     *  
     *  @throws {Traverse.TypeError}
     *      - One of following conditions:
     *        - The inner object is NULL.
     *        - The inner object is not an Object or a Map object.
     *  @throws {Traverse.ParameterError}
     *      - The "name" parameter is not a string and the inner object is an
     *        Object.
     *  @throws {Traverse.KeyNotFoundError}
     *      - The sub path can't be found.
     *  @param name
     *      - The name(key) of sub directory.
     *  @returns 
     *      - Traverse object of sub directory.
     */
    public sub(name: any): Traverse {
        //  Pre-check.
        this.notNull();

        //  Get the sub path.
        let subPath = this._GetSubPath(name);

        if (CrType.IsInstanceOf(this._inner, Map)) {
            if (this._inner.has(name)) {
                return new Traverse(this._inner.get(name), subPath);
            } else {
                throw new TraverseKeyNotFoundError(
                    `Sub path doesn't exist (path=\"${subPath}\").`
                );
            }
        } else if (CrType.IsInstanceOf(this._inner, Object)) {
            //  Check key type.
            if (!CrType.IsInstanceOf(name, String)) {
                throw new TraverseParameterError(
                    "Name(key) must be a string when inner object is an Object."
                );
            }

            if (name in this._inner) {
                //  Go into inner path.
                return new Traverse(this._inner[name], subPath);
            } else {
                throw new TraverseKeyNotFoundError(
                    `Sub path doesn't exist (path=\"${subPath}\").`
                );
            }
        } else {
            throw new TraverseTypeError(
                `Invalid inner type (expect=Map/Object, path=\"${this.path}\").`
            );
        }
    };

    /**
     *  Go to sub directory which can be non-existed.
     * 
     *  @throws {Traverse.TypeError}
     *      - One of following conditions:
     *        - The inner object is NULL.
     *        - The inner object is not an Object or a Map object.
     *  @throws {Traverse.ParameterError}
     *      - The "name" parameter is not a string and the inner object is an
     *        Object.
     *  @param name
     *      - The name(key) of sub directory.
     *  @param defaultValue
     *      - The default value if the directory doesn't exist.
     *  @returns 
     *      - Traverse object of sub directory.
     */
    public optionalSub(name: any, defaultValue: any): Traverse {
        //  Pre-check.
        this.notNull();

        //  Get the sub path.
        let subPath = this._GetSubPath(name);

        if (CrType.IsInstanceOf(this._inner, Map)) {
            if (this._inner.has(name)) {
                return new Traverse(this._inner.get(name), subPath);
            } else {
                return new Traverse(defaultValue, subPath);
            }
        } else if (CrType.IsInstanceOf(this._inner, Object)) {
            //  Check key type.
            if (!CrType.IsInstanceOf(name, String)) {
                throw new TraverseParameterError(
                    "Name(key) must be a string when inner object is an Object."
                );
            }

            if (name in this._inner) {
                //  Go into inner path.
                return new Traverse(this._inner[name], subPath);
            } else {
                return new Traverse(defaultValue, subPath);
            }
        } else {
            throw new TraverseTypeError(
                `Invalid inner type (expect=map/object, path=\"${this.path}\").`
            );
        }
    };

    /**
     *  Assume that the inner object is not NULL.
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is NULL.
     *  @returns 
     *      - Self.
     */
    public notNull(): Traverse {
        //  Try to use cache first.
        if (this.pckNotNull) {
            return this;
        }

        //  Ensure the value is not null.
        if (this._inner === null) {
            throw new TraverseTypeError(
                `Value should not be NULL (path=\"${this.path}\").`
            );
        }

        //  Write cache.
        this.pckNotNull = true;

        return this;
    };

    /**
     *  Give minimum value threshold to the inner object.
     * 
     *  Expected:
     *    [1] inner >= threshold
     * 
     *  @template T
     *  @throws {Traverse.ParameterError}
     *      - The type of the inner object is different to the threshold object.
     *  @throws {Traverse.ValueOutOfRangeError}
     *      - The value is not within the threshold.
     *  @param threshold
     *      - The threshold.
     *  @param comparator
     *      - The comparator.
     *  @returns
     *      - Self.
     */
    public min<T>(
        threshold: T, 
        comparator: Traverse.Comparator<T> = new Traverse.Comparator<T>()
    ): Traverse {
        if (this._inner !== null) {
            //  Check object type.
            if (!CrType.IsSameType(this._inner, threshold)) {
                throw new TraverseParameterError(
                    `Uncomparable type (path=\"${this.path}\").`
                );
            }

            //  Check value range.
            if (comparator.lt(this._inner, threshold)) {
                throw new TraverseValueOutOfRangeError(
                    `Value is too small (path=\"${this.path}\", require='>=', `+
                    `threshold=${this._GetObjectRepresentation(threshold)}).`
                );
            }
        }

        return this;
    };

    /**
     *  Give exclusive minimum value threshold to the inner object.
     * 
     *  Expected:
     *    [1] inner > threshold
     * 
     *  @template T
     *  @throws {Traverse.ParameterError}
     *      - The type of the inner object is different to the threshold object.
     *  @throws {Traverse.ValueOutOfRangeError}
     *      - The value is not within the threshold.
     *  @param threshold
     *      - The threshold.
     *  @param comparator
     *      - The comparator.
     *  @returns 
     *      - Self.
     */
    public minExclusive<T>(
        threshold: T, 
        comparator: Traverse.Comparator<T> = new Traverse.Comparator<T>()
    ): Traverse {
        if (this._inner !== null) {
            //  Check object type.
            if (!CrType.IsSameType(this._inner, threshold)) {
                throw new TraverseParameterError(
                    `Uncomparable type (path=\"${this.path}\").`
                );
            }

            //  Check value range.
            if (comparator.le(this._inner, threshold)) {
                throw new TraverseValueOutOfRangeError(
                    `Value is too small (path=\"${this.path}\", require='>', ` + 
                    `threshold=${this._GetObjectRepresentation(threshold)}.`
                );
            }
        }

        return this;
    };

    /**
     *  Give maximum value threshold to the inner object.
     * 
     *  Expected:
     *    [1] inner <= threshold
     * 
     *  @template T
     *  @throws {Traverse.ParameterError}
     *      - The type of the inner object is different to the threshold object.
     *  @throws {Traverse.ValueOutOfRangeError}
     *      - The value is not within the threshold.
     *  @param threshold
     *      - The threshold.
     *  @param comparator
     *      - The comparator.
     *  @returns 
     *      - Self.
     */
    public max<T>(
        threshold: T, 
        comparator: Traverse.Comparator<T> = new Traverse.Comparator<T>()
    ): Traverse {
        if (this._inner !== null) {
            //  Check object type.
            if (!CrType.IsSameType(this._inner, threshold)) {
                throw new TraverseParameterError(
                    `Uncomparable type (path=\"${this.path}\").`
                );
            }

            //  Check value range.
            if (comparator.gt(this._inner, threshold)) {
                throw new TraverseValueOutOfRangeError(
                    `Value is too large (path=\"${this.path}\", require='<=', `+ 
                    `threshold=${this._GetObjectRepresentation(threshold)}).`
                );
            }
        }

        return this;
    };

    /**
     *  Give exclusive maximum value threshold to the inner object.
     * 
     *  Expected:
     *    [1] inner < threshold
     * 
     *  @template T
     *  @throws {Traverse.ParameterError}
     *      - The type of the inner object is different to the threshold object.
     *  @throws {Traverse.ValueOutOfRangeError}
     *      - The value is not within the threshold.
     *  @param threshold
     *      - The threshold.
     *  @param comparator
     *      - The comparator.
     *  @returns 
     *      - Self.
     */
    public maxExclusive<T>(
        threshold: T, 
        comparator: Traverse.Comparator<T> = new Traverse.Comparator<T>()
    ): Traverse {
        if (this._inner !== null) {
            //  Check object type.
            if (!CrType.IsSameType(this._inner, threshold)) {
                throw new TraverseParameterError(
                    `Uncomparable type (path=\"${this.path}\").`
                );
            }

            //  Check value range.
            if (comparator.ge(this._inner, threshold)) {
                throw new TraverseValueOutOfRangeError(
                    `Value is too large (path=\"${this.path}\", require='<', ` + 
                    `threshold=${this._GetObjectRepresentation(threshold)}).`
                );
            }
        }

        return this;
    };

    /**
     *  Give value threshold to the inner object.
     * 
     *  Expected:
     *    [1] min <= inner <= max
     * 
     *  @template T
     *  @throws {Traverse.ParameterError}
     *      - The type of the inner object is different to the threshold 
     *        objects.
     *  @throws {Traverse.ValueOutOfRangeError}
     *      - The value is not within the thresholds.
     *  @param minValue
     *      - The minimum threshold.
     *  @param maxValue
     *      - The maximum threshold.
     *  @param comparator
     *      - The comparator.
     *  @returns 
     *      - Self.
     */
    public range<T>(
        minValue: T, 
        maxValue: T, 
        comparator: TraverseComparator<T> = new TraverseComparator<T>()
    ): Traverse {
        return this.min(minValue, comparator).max(maxValue, comparator);
    };

    /**
     *  Select an item from specific array (inner object as the index).
     * 
     *  @template T
     *  @throws {Traverse.TypeError}
     *      - One of following conditions:
     *        - The inner object is NULL.
     *        - The inner object is not an integer.
     *  @throws {Traverse.IndexOutOfRangeError}
     *      - The index out of range.
     *  @throws {Traverse.ParameterError}
     *      - The "from" parameter is not valid (not an array).
     *  @param from
     *      - The array.
     *  @returns 
     *      - Traverse object of selected item.
     */
    public selectFromArray<T>(from: Array<T>): Traverse {
        //  Check inner type.
        try {
            this.notNull().integer().min(0).maxExclusive(from.length);
        } catch(error) {
            if (error instanceof TraverseValueOutOfRangeError) {
                throw new TraverseIndexOutOfRangeError(error.message);
            } else {
                throw error;
            }
        }

        //  Wrap new object.
        return new Traverse(
            from[this._inner], 
            this._GetSubPath(`[${this._inner}]`)
        );
    };

    /**
     *  Select an item from specific object (inner object as the key).
     * 
     *  @throws {Traverse.TypeError}
     *      - One of following conditions:
     *        - The inner object is NULL.
     *        - The inner object is not string.
     *  @throws {Traverse.KeyNotFoundError}
     *      - The key doesn't exist.
     *  @param from
     *      - The object.
     *  @returns 
     *      - Traverse object of selected item.
     */
    public selectFromObject(from: object): Traverse {
        //  Check inner type.
        this.notNull().typeOf(String);

        //  Check key existence.
        if (!(this._inner in from)) {
            throw new TraverseKeyNotFoundError(
                `\"${this._inner}\" doesn't exist (path=\"${this.path}\").`
            );
        }

        //  Wrap new object.
        return new Traverse(from[this._inner], this._GetSubPath(this._inner));
    };

    /**
     *  Select an optional item from specific object (inner object as the key).
     * 
     *  @throws {Traverse.TypeError}
     *      - One of following conditions:
     *        - The inner object is NULL.
     *        - The inner object is not string.
     *  @param from
     *      - The object.
     *  @param defaultValue
     *      - The default value if the key doesn't exist.
     *  @returns 
     *      - Traverse object of selected item.
     */
    public selectFromObjectOptional(
        from: object, 
        defaultValue: any
    ): Traverse {
        //  Check inner type.
        this.notNull().typeOf(String);

        try {
            return this.selectFromObject(from);
        } catch(error) {
            if (error instanceof TraverseKeyNotFoundError) {
                return new Traverse(defaultValue,this._GetSubPath(this._inner));
            } else {
                throw error;
            }
        }
    };

    /**
     *  Select an item from specific map (use inner object as the key).
     * 
     *  @throws {Traverse.KeyNotFoundError}
     *      - The key doesn't exist.
     *  @throws {Traverse.ParameterError}
     *      - The "from" parameter is not valid (not a Map object).
     *  @param from
     *      - The map.
     *  @returns 
     *      - Traverse object of selected item.
     */
    public selectFromMap<T1, T2>(from: Map<T1, T2>): Traverse {
        //  Check key existence.
        if (!from.has(this._inner)) {
            throw new TraverseKeyNotFoundError(
                `\"${this._inner}\" doesn't exist (path=\"${this.path}\").`
            );
        }

        //  Wrap new object.
        return new Traverse(from.get(this._inner), this._GetSubPath(
            this._GetObjectRepresentation(this._inner)
        ));
    };

    /**
     *  Select an optional item from specific map (inner object as the key).
     * 
     *  @throws {Traverse.ParameterError}
     *      - The "from" parameter is not valid (not a Map object).
     *  @param from
     *      - The map.
     *  @param defaultValue
     *      - The default value when the key doesn't exist.
     *  @returns 
     *      - Traverse object of selected item.
     */
    public selectFromMapOptional<T1, T2>(
        from: Map<T1, T2>, 
        defaultValue: any
    ): Traverse {
        try {
            return this.selectFromMap(from);
        } catch(error) {
            if (error instanceof TraverseKeyNotFoundError) {
                return new Traverse(defaultValue, this._GetSubPath(
                    this._GetObjectRepresentation(this._inner)
                ));
            } else {
                throw error;
            }
        }
    };

    /**
     *  Iterate an object.
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is not an Object.
     *  @param callback
     *      - The callback.
     *  @returns 
     *      - Self.
     */
    public objectForEach(callback: (value: Traverse) => void): Traverse {
        let _self = this;
        this.objectForEachEx(function(traverse) {
            callback.call(_self, traverse);
        });
        return this;
    };

    /**
     *  Iterate an object (will callback with both key and value).
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is not an Object.
     *  @param callback
     *      - The callback.
     *  @returns 
     *      - Self.
     */
    public objectForEachEx(
        callback: (value: Traverse, key: string) => void
    ): Traverse {
        if (!this.isNull()) {
            //  Check type.
            this.typeOf(Object);

            //  Scan all keys.
            for (let key in this._inner) {
                callback.call(
                    this, 
                    new Traverse(this._inner[key], this._GetSubPath(key)), 
                    key
                );
            }
        }

        return this;
    };

    /**
     *  Set a key-value pair within an object.
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is not an Object.
     *  @param key
     *      - The key.
     *  @param value
     *      - The value.
     *  @returns 
     *      - Self.
     */
    public objectSet(key: string, value: any): Traverse {
        if (!this.isNull()) {
            //  Check type.
            this.typeOf(Object);
    
            //  Set the key pair.
            this._inner[key] = value;
        }

        return this;
    };

    /**
     *  Get whether an object has specified key.
     * 
     *  @throws {Traverse.TypeError}
     *      - One of following conditions:
     *        - The inner object is NULL.
     *        - The inner object is not an Object.
     *  @param key
     *      - The key.
     *  @returns 
     *      - True if so.
     */
    public objectHas(key: string): boolean {
        //  Check type.
        this.notNull().typeOf(Object);

        return (key in this._inner);
    };

    /**
     *  Get the length of an array.
     * 
     *  @throws {Traverse.TypeError}
     *      - One of following conditions:
     *        - The inner object is NULL.
     *        - The inner object is not an array.
     *  @returns 
     *      - The length.
     */
    public arrayLength(): number {
        //  Check type.
        this.notNull().typeOf(Array);

        return this._inner.length;
    };

    /**
     *  Get an item from an array.
     * 
     *  @throws {Traverse.TypeError}
     *      - One of following conditions:
     *        - The inner object is NULL.
     *        - The inner object is not an array.
     *  @throws {Traverse.ParameterError}
     *      - 'offset' is not an integer.
     *  @throws {Traverse.IndexOutOfRangeError}
     *      - 'offset' is out of range.
     *  @param offset
     *      - The offset of the item within the array.
     *  @returns  
     *      - Traverse object of the item.
     */
    public arrayGetItem(offset: number): Traverse {
        //  Check type.
        this.notNull().typeOf(Array);

        //  Check the offset.
        if (!Number.isInteger(offset)) {
            throw new TraverseParameterError("Offset must be an integer.");
        }
        if (offset < 0 || offset >= this._inner.length) {
            throw new TraverseIndexOutOfRangeError("Offset is out of range.");
        }

        //  Get the item.
        return new Traverse(
            this._inner[offset],
            this._GetSubPath(`[${offset}]`)
        );
    };

    /**
     *  Set an item from an array.
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is not an array.
     *  @throws {Traverse.ParameterError}
     *      - 'offset' is not an integer.
     *  @throws {Traverse.IndexOutOfRangeError}
     *      - 'offset' is out of range.
     *  @param offset
     *      - The offset of the item within the array.
     *  @param value
     *      - The item value.
     *  @returns  
     *      - Self.
     */
    public arraySetItem(offset: number, value: any): Traverse {
        //  Check the offset.
        if (!Number.isInteger(offset)) {
            throw new TraverseParameterError("Offset must be an integer.");
        }
        if (offset < 0) {
            throw new TraverseIndexOutOfRangeError("Offset is out of range.");
        }

        if (!this.isNull()) {
            //  Check type.
            this.typeOf(Array);

            if (offset >= this._inner.length) {
                throw new TraverseIndexOutOfRangeError(
                    "Offset is out of range."
                );
            }

            //  Set the item.
            this._inner[offset] = value;
        }

        return this;
    };

    /**
     *  Push an item to an array.
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is not an array.
     *  @param value
     *      - The item value.
     *  @returns 
     *      - Self.
     */
    public arrayPushItem(value): Traverse {
        if (!this.isNull()) {
            //  Check type.
            this.typeOf(Array);

            //  Push the item.
            this._inner.push(value);
        }

        return this;
    };

    /**
     *  Pop an item from an array.
     * 
     *  @throws {Traverse.TypeError}
     *      - One of following conditions:
     *        - The inner object is NULL.
     *        - The inner object is not an array.
     *  @throws {Traverse.IndexOutOfRangeError}
     *      - The array is already empty.
     *  @returns 
     *      - Traverse object of the popped item.
     */
    public arrayPopItem(): Traverse {
        //  Check type.
        this.notNull().typeOf(Array);

        //  Check the array.
        if (this._inner.length == 0) {
            throw new TraverseIndexOutOfRangeError("Array is empty.");
        }

        //  Pop an item.
        let item = this._inner.pop();
        return new Traverse(
            item,
            this._GetSubPath(`[${this._inner.length}]`)
        );
    };

    /**
     *  Shift an item from an array.
     * 
     *  @throws {Traverse.TypeError}
     *      - One of following conditions:
     *        - The inner object is NULL.
     *        - The inner object is not an array.
     *  @throws {Traverse.IndexOutOfRangeError}
     *      - The array is already empty.
     *  @returns 
     *      - Traverse object of the shifted item.
     */
    public arrayShiftItem(): Traverse {
        //  Check type.
        this.notNull().typeOf(Array);

        //  Check the array.
        if (this._inner.length == 0) {
            throw new TraverseIndexOutOfRangeError("Array is empty.");
        }

        //  Shift an item.
        return new Traverse(
            this._inner.shift(),
            this._GetSubPath("[0]")
        );
    };

    /**
     *  Unshift an item to an array.
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is not an array.
     *  @param value
     *      - The item value.
     *  @returns 
     *      - Self.
     */
    public arrayUnshiftItem(value: any): Traverse {
        if (!this.isNull()) {
            //  Check type.
            this.typeOf(Array);

            //  Unshift the item.
            this._inner.unshift(value);
        }

        return this;
    };

    /**
     *  Iterate an array.
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is not an array.
     *  @param callback
     *      - The callback.
     *        - "item": The traverse object that wraps the array item.
     *        - "cbs":  An object that contains callbacks that are used to stop 
     *                  iteration or delete current item.
     *  @param reverse
     *      - True if iteration direction should be inverted (from back to 
     *        front).
     *  @returns 
     *      - Self.
     */
    public arrayForEach(
        callback: (item: Traverse, cbs: TIterationCallbacks) => void,
        reverse: boolean = false
    ): Traverse {
        if (!this.isNull()) {
            //  Check type.
            this.typeOf(Array);

            //  Initialize iteration context.
            let swStop = false;
            let swDelete = false;

            let callbacks: TIterationCallbacks = {
                "stop": function() {
                    swStop = true;
                },
                "delete": function() {
                    swDelete = true;
                }
            };

            //  Scan all items.
            if (reverse) {
                for (let cursor = this._inner.length - 1; cursor >= 0; --cursor){
                    callback.call(this, new Traverse(
                        this._inner[cursor], 
                        this._GetSubPath(`[${cursor}]`)
                    ), callbacks);
                    if (swDelete) {
                        this._inner.splice(cursor, 1);
                        swDelete = false;
                    }
                    if (swStop) {
                        break;
                    }
                }
            } else {
                let cursor = 0;
                while (cursor < this._inner.length) {
                    callback.call(this, new Traverse(
                        this._inner[cursor], 
                        this._GetSubPath(`[${cursor}]`)
                    ), callbacks);
                    if (swDelete) {
                        this._inner.splice(cursor, 1);
                        swDelete = false;
                    } else {
                        ++cursor;
                    }
                    if (swStop) {
                        break;
                    }
                }
            }
        }

        return this;
    };

    /**
     *  Iterate an array with deletion.
     * 
     *  Note(s):
     *    [1] If the callback returns true, the item would be deleted.
     * 
     *  @deprecated
     *      - Not recommended for new applications.
     *      - Use arrayForEach() instead.
     *      - This method would be removed totally in next major version.
     *  @throws {Traverse.TypeError}
     *      - The inner object is not an array.
     *  @param callback
     *      - The callback.
     *  @returns 
     *      - Self.
     */
    public arrayForEachWithDeletion(
        callback: (item: Traverse) => boolean
    ): Traverse {
        if (!this.isNull()) {
            //  Check type.
            this.typeOf(Array);

            //  Scan all items.
            let cursor = 0;
            while (cursor < this._inner.length) {
                let isDelete = callback.call(
                    this, 
                    new Traverse(
                        this._inner[cursor], 
                        this._GetSubPath(`[${cursor}]`)
                    )
                );
                if (isDelete) {
                    this._inner.splice(cursor, 1);
                } else {
                    ++cursor;
                }
            }
        }

        return this;
    };

    /**
     *  Assume the array has a minimum length.
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is not an array.
     *  @throws {Traverse.SizeError}
     *      - The array size exceeds.
     *  @param minLength
     *      - The minimum length.
     *  @returns 
     *      - Self.
     */
    public arrayMinLength(minLength: number): Traverse {
        if (!this.isNull()) {
            //  Check type.
            this.typeOf(Array);

            //  Check array length.
            let currentLength = this._inner.length;
            if (currentLength < minLength) {
                throw new TraverseSizeError(
                    `Array should have at least ${minLength} item(s) ` +
                    `(path=\"${this.path}\", current=${currentLength}).`
                );
            }    
        }

        return this;
    };

    /**
     *  Assume the array has a maximum length.
     * 
     *  @throws {Traverse.TypeError}
     *      - The inner object is not an array.
     *  @throws {Traverse.SizeError}
     *      - The array size exceeds.
     *  @param maxLength
     *      - The maximum length.
     *  @returns 
     *      - Self.
     */
    public arrayMaxLength(maxLength: number): Traverse {
        if (!this.isNull()) {
            //  Check type.
            this.typeOf(Array);

            //  Check array length.
            let currentLength = this._inner.length;
            if (currentLength > maxLength) {
                throw new TraverseSizeError(
                    `Array should have at most ${maxLength} item(s) ` +
                    `(path=\"${this.path}\", current=${currentLength}).`
                );
            }
        }

        return this;
    };

    /**
     *  Get whether the inner object is NULL.
     * 
     *  @returns 
     *      - True if so.
     */
    public isNull(): boolean {
        return this._inner === null;
    };

    /**
     *  Assume that the inner object is in specific selections.
     * 
     *  @throws {Traverse.ParameterError}
     *      - The type of "selections" parameter is not supported.
     *  @throws {Traverse.KeyNotFoundError}
     *      - The item doesn't exist in the "selections".
     *  @param selections
     *      - The selections.
     *  @returns 
     *      - Self.
     */
    public oneOf(
        selections: Set<any> | Map<any, any> | Array<any> | object
    ): Traverse {
        if (this._inner !== null) {
            let has = false;
            if (selections instanceof Set) {
                has = selections.has(this._inner);
            } else if (selections instanceof Map) {
                has = selections.has(this._inner);
            } else if (selections instanceof Array) {
                has = (selections.indexOf(this._inner) >= 0);
            } else if (selections instanceof Object) {
                has = (this._inner in selections);
            } else {
                throw new TraverseParameterError(
                    "Unsupported selections type (only Map/Set/Array/Object " + 
                    "is valid)."
                );
            }
            if (!has) {
                throw new TraverseKeyNotFoundError(
                    `\"${this._GetObjectRepresentation(this._inner)}\" ` +
                    `is not available.`
                );
            }
        }

        return this;
    }

    /**
     *  Assume that the inner conforms to custom rule.
     * 
     *  Note(s):
     *    [1] The callback return true if the inner conforms the custom rule.
     * 
     *  @throws {Traverse.Parameter}
     *      - One of following conditions:
     *        - The callback is not a Function.
     *        - The callback doesn't return a Boolean.
     *  @throws {Traverse.Error}
     *      - The callback return false.
     *  @param callback
     *      - The rule callback.
     *  @returns 
     *      - Self.
     */
    public customRule(callback: (inner: any) => boolean): Traverse {
        //  Check type.
        if (!(callback instanceof Function)) {
            throw new TraverseParameterError("Expect a Function.");
        }
        
        let isConformed = callback.call(this, this._inner);

        //  Check the return value.
        if (
            isConformed === null || 
            typeof(isConformed) == "undefined" ||
            !CrType.IsInstanceOf(isConformed, Boolean)
        ) {
            throw new TraverseParameterError(
                `Callback should return a Boolean. (path=\"${this.path}\")`
            );
        }

        if (!isConformed) {
            throw new TraverseError(
                `The inner doesn't conform the custom rule. ` +
                `(path=\"${this.path}\")`
            );
        }

        return this;
    };

    /**
     *  (Compatible, use unwrap() in new application) Get the inner object.
     * 
     *  @returns 
     *      - The inner object.
     */
    public inner(): any {
        return this._inner;
    };

    /**
     *  Unwrap the traverse object.
     * 
     *  @returns 
     *      - The inner object.
     */
    public unwrap(): any {
        return this._inner;
    };
}

//
//  Namespace.
//
export namespace Traverse {
    export const DEFAULT_COMPARATOR = new TraverseComparator<any>();
    export const Error = TraverseError;
    export const ParameterError = TraverseParameterError;
    export const TypeError = TraverseTypeError;
    export const FormatError = TraverseFormatError;
    export const ParseError = TraverseParseError;
    export const SizeError = TraverseSizeError;
    export const KeyNotFoundError = TraverseKeyNotFoundError;
    export const IndexOutOfRangeError = TraverseIndexOutOfRangeError;
    export const ValueOutOfRangeError = TraverseValueOutOfRangeError;
    export const Comparator = TraverseComparator;

    export type Error = TraverseError;
    export type ParameterError = TraverseParameterError;
    export type TypeError = TraverseTypeError;
    export type FormatError = TraverseFormatError;
    export type ParseError = TraverseParseError;
    export type SizeError = TraverseSizeError;
    export type KeyNotFoundError = TraverseKeyNotFoundError;
    export type IndexOutOfRangeError = TraverseIndexOutOfRangeError;
    export type ValueOutOfRangeError = TraverseValueOutOfRangeError;
    export type Comparator<T> = TraverseComparator<T>;
}

//
//  Public functions.
//

/**
 *  Wrap an object with Traverse.
 * 
 *  @param inner
 *      - The inner object.
 *  @param force
 *      - Still wrap the object when the inner object is a Traverse.
 *  @returns 
 *      - The traverse object.
 */
export function WrapObject(inner: any, force: boolean = false): Traverse {
    if ((inner instanceof Traverse) && !force) {
        return inner;
    } else {
        return new Traverse(inner, "/");
    }
}
