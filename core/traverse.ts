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
//  Declares.
//

//  JavaScript engine raw Error object.
const _Error = Error;

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
 *  Traverse helper.
 */
export class Traverse {

    //
    //  Private members.
    //

    /**
     *  The inner object.
     */
    private _inner: unknown;

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
    constructor(inner: unknown, path: string) {
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
    public typeOf(constructor: Function): Traverse {
        //  Check input parameter.
        if (!CrType.IsInstanceOf(constructor, Function)) {
            throw new Traverse.ParameterError("Not a constructor.");
        }

        //  Try to use cache first.
        if (this.pckTypeOf.has(constructor)) {
            let passed = this.pckTypeOf.get(constructor);
            if (!passed) {
                throw new Traverse.TypeError(
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
                throw new Traverse.TypeError(
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
                throw new Traverse.TypeError(
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
            throw new Traverse.ParameterError("Invalid character table.");
        }

        if (!this.isNull()) {
            //  Check inner type.
            this.string();

            //  Validate the string.
            if (!CrValidator.ValidateString(this._inner as string, charTable)) {
                throw new Traverse.FormatError(
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
            throw new Traverse.ParameterError(
                "Invalid regular expression object."
            );
        }

        if (!this.isNull()) {
            //  Check inner type.
            this.string();

            //  Validate the string.
            if (!re.test(this._inner as string)) {
                throw new Traverse.FormatError(
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
        if (!CrTextDetector.IsInteger(this._inner as string)) {
            throw new Traverse.FormatError(
                `Not a valid integer string (path=\"${this.path}\").`
            );
        }

        //  Parse the string.
        let intValue = parseInt(this._inner as string, 10);

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
        if (!CrTextDetector.IsNumericStrict(this._inner as string)) {
            throw new Traverse.FormatError(
                `Not a valid float string (path=\"${this.path}\").`
            );
        }

        //  Parse the string.
        let floatValue = parseFloat(this._inner as string);

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
                parsed = JSON.parse(this._inner as string);
            } catch(error) {
                throw new Traverse.ParseError(
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
            let serialized = JSON.stringify(this._inner as any);
            return new Traverse(serialized, subPath);
        } catch(error) {
            //
            //  Reference(s):
            //    [1] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Re
            //        ference/Global_Objects/JSON/stringify#Exceptions
            //
            if (error instanceof TypeError) {
                throw new Traverse.TypeError(
                    `Unable to serialize to JSON (` +
                    `error=\"${error.message || "(unknown)"}\", ` +
                    `path=\"${subPath}\").`
                );
            } else {
                //  Handle unstandardized error.
                throw new Traverse.Error(
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
            let inner_map: Map<unknown, unknown> = 
                this._inner as Map<unknown, unknown>;
            if (inner_map.has(name)) {
                return new Traverse(
                    inner_map.get(name), 
                    subPath
                );
            } else {
                throw new Traverse.KeyNotFoundError(
                    `Sub path doesn't exist (path=\"${subPath}\").`
                );
            }
        } else if (CrType.IsInstanceOf(this._inner, Object)) {
            //  Check key type.
            if (!CrType.IsInstanceOf(name, String)) {
                throw new Traverse.ParameterError(
                    "Name(key) must be a string when inner object is an Object."
                );
            }

            let inner_obj: object = this._inner as object;

            if (name in inner_obj) {
                //  Go into inner path.
                return new Traverse(inner_obj[name], subPath);
            } else {
                throw new Traverse.KeyNotFoundError(
                    `Sub path doesn't exist (path=\"${subPath}\").`
                );
            }
        } else {
            throw new Traverse.TypeError(
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
    public optionalSub(name: any, defaultValue: unknown): Traverse {
        //  Pre-check.
        this.notNull();

        //  Get the sub path.
        let subPath = this._GetSubPath(name);

        if (CrType.IsInstanceOf(this._inner, Map)) {
            let inner_map: Map<unknown, unknown> = 
                this._inner as Map<unknown, unknown>;
            if (inner_map.has(name)) {
                return new Traverse(inner_map.get(name), subPath);
            } else {
                return new Traverse(defaultValue, subPath);
            }
        } else if (CrType.IsInstanceOf(this._inner, Object)) {
            //  Check key type.
            if (!CrType.IsInstanceOf(name, String)) {
                throw new Traverse.ParameterError(
                    "Name(key) must be a string when inner object is an Object."
                );
            }

            let inner_obj: object = this._inner as object;

            if (name in inner_obj) {
                //  Go into inner path.
                return new Traverse(inner_obj[name], subPath);
            } else {
                return new Traverse(defaultValue, subPath);
            }
        } else {
            throw new Traverse.TypeError(
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
            throw new Traverse.TypeError(
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
                throw new Traverse.ParameterError(
                    `Uncomparable type (path=\"${this.path}\").`
                );
            }

            //  Check value range.
            if (comparator.lt(this._inner as T, threshold)) {
                throw new Traverse.ValueOutOfRangeError(
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
                throw new Traverse.ParameterError(
                    `Uncomparable type (path=\"${this.path}\").`
                );
            }

            //  Check value range.
            if (comparator.le(this._inner as T, threshold)) {
                throw new Traverse.ValueOutOfRangeError(
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
                throw new Traverse.ParameterError(
                    `Uncomparable type (path=\"${this.path}\").`
                );
            }

            //  Check value range.
            if (comparator.gt(this._inner as T, threshold)) {
                throw new Traverse.ValueOutOfRangeError(
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
                throw new Traverse.ParameterError(
                    `Uncomparable type (path=\"${this.path}\").`
                );
            }

            //  Check value range.
            if (comparator.ge(this._inner as T, threshold)) {
                throw new Traverse.ValueOutOfRangeError(
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
        comparator: Traverse.Comparator<T> = new Traverse.Comparator<T>()
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
            if (error instanceof Traverse.ValueOutOfRangeError) {
                throw new Traverse.IndexOutOfRangeError(error.message);
            } else {
                throw error;
            }
        }

        //  Wrap new object.
        return new Traverse(
            from[this._inner as number], 
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

        let inner_str = this._inner as string;

        //  Check key existence.
        if (!(inner_str in from)) {
            throw new Traverse.KeyNotFoundError(
                `\"${inner_str}\" doesn't exist (path=\"${this.path}\").`
            );
        }

        //  Wrap new object.
        return new Traverse(from[inner_str], this._GetSubPath(inner_str));
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
        defaultValue: unknown
    ): Traverse {
        //  Check inner type.
        this.notNull().typeOf(String);

        try {
            return this.selectFromObject(from);
        } catch(error) {
            if (error instanceof Traverse.KeyNotFoundError) {
                return new Traverse(
                    defaultValue,
                    this._GetSubPath(this._inner as string)
                );
            } else {
                throw error;
            }
        }
    };

    /**
     *  Select an item from specific map (use inner object as the key).
     * 
     *  @template T1
     *  @template T2
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
        //  Assert inner.
        let inner_t1 = this._inner as T1;

        //  Check key existence.
        if (!from.has(inner_t1)) {
            throw new Traverse.KeyNotFoundError(
                `\"${this._inner}\" doesn't exist (path=\"${this.path}\").`
            );
        }

        //  Wrap new object.
        return new Traverse(
            from.get(inner_t1), 
            this._GetSubPath(
                this._GetObjectRepresentation(this._inner)
            )
        );
    };

    /**
     *  Select an optional item from specific map (inner object as the key).
     * 
     *  @template T1
     *  @template T2
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
        defaultValue: unknown
    ): Traverse {
        try {
            return this.selectFromMap(from);
        } catch(error) {
            if (error instanceof Traverse.KeyNotFoundError) {
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

            //  Assert inner.
            let inner_obj: object = this._inner as object;

            //  Scan all keys.
            for (let key in inner_obj) {
                callback.call(
                    this, 
                    new Traverse(inner_obj[key], this._GetSubPath(key)), 
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
    public objectSet(key: string, value: unknown): Traverse {
        if (!this.isNull()) {
            //  Check type.
            this.typeOf(Object);
    
            //  Set the key pair.
            (this._inner as object)[key] = value;
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

        return (key in (this._inner as object));
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

        return (this._inner as Array<unknown>).length;
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

        //  Assert inner.
        let inner_arr = this._inner as Array<unknown>;

        //  Check the offset.
        if (!Number.isInteger(offset)) {
            throw new Traverse.ParameterError("Offset must be an integer.");
        }
        if (offset < 0 || offset >= inner_arr.length) {
            throw new Traverse.IndexOutOfRangeError("Offset is out of range.");
        }

        //  Get the item.
        return new Traverse(
            inner_arr[offset],
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
    public arraySetItem(offset: number, value: unknown): Traverse {
        //  Check the offset.
        if (!Number.isInteger(offset)) {
            throw new Traverse.ParameterError("Offset must be an integer.");
        }
        if (offset < 0) {
            throw new Traverse.IndexOutOfRangeError("Offset is out of range.");
        }

        if (!this.isNull()) {
            //  Check type.
            this.typeOf(Array);

            let inner_arr = this._inner as Array<unknown>;
            if (offset >= inner_arr.length) {
                throw new Traverse.IndexOutOfRangeError(
                    "Offset is out of range."
                );
            }

            //  Set the item.
            inner_arr[offset] = value;
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
    public arrayPushItem(value: unknown): Traverse {
        if (!this.isNull()) {
            //  Check type.
            this.typeOf(Array);

            //  Push the item.
            let inner_arr = this._inner as Array<unknown>;
            inner_arr.push(value);
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

        //  Assert inner.
        let inner_arr = this._inner as Array<unknown>

        //  Check the array.
        if (inner_arr.length == 0) {
            throw new Traverse.IndexOutOfRangeError("Array is empty.");
        }

        //  Pop an item.
        let item = inner_arr.pop();
        return new Traverse(
            item,
            this._GetSubPath(`[${inner_arr.length}]`)
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

        //  Assert inner.
        let inner_arr = this._inner as Array<unknown>

        //  Check the array.
        if (inner_arr.length == 0) {
            throw new Traverse.IndexOutOfRangeError("Array is empty.");
        }

        //  Shift an item.
        return new Traverse(
            inner_arr.shift(),
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
    public arrayUnshiftItem(value: unknown): Traverse {
        if (!this.isNull()) {
            //  Check type.
            this.typeOf(Array);

            //  Assert inner.
            let inner_arr = this._inner as Array<unknown>;

            //  Unshift the item.
            inner_arr.unshift(value);
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

            //  Assert array.
            let inner_arr = this._inner as Array<unknown>;

            //  Scan all items.
            if (reverse) {
                for (let cursor = inner_arr.length - 1; cursor >= 0; --cursor){
                    callback.call(this, new Traverse(
                        inner_arr[cursor], 
                        this._GetSubPath(`[${cursor}]`)
                    ), callbacks);
                    if (swDelete) {
                        inner_arr.splice(cursor, 1);
                        swDelete = false;
                    }
                    if (swStop) {
                        break;
                    }
                }
            } else {
                let cursor = 0;
                while (cursor < inner_arr.length) {
                    callback.call(this, new Traverse(
                        inner_arr[cursor], 
                        this._GetSubPath(`[${cursor}]`)
                    ), callbacks);
                    if (swDelete) {
                        inner_arr.splice(cursor, 1);
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

            //  Assert inner.
            let inner_arr = this._inner as Array<unknown>;

            //  Scan all items.
            let cursor = 0;
            while (cursor < inner_arr.length) {
                let isDelete = callback.call(
                    this, 
                    new Traverse(
                        inner_arr[cursor], 
                        this._GetSubPath(`[${cursor}]`)
                    )
                );
                if (isDelete) {
                    inner_arr.splice(cursor, 1);
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

            //  Assert inner.
            let inner_arr = this._inner as Array<unknown>;

            //  Check array length.
            let currentLength = inner_arr.length;
            if (currentLength < minLength) {
                throw new Traverse.SizeError(
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

            //  Assert inner.
            let inner_arr = this._inner as Array<unknown>

            //  Check array length.
            let currentLength = inner_arr.length;
            if (currentLength > maxLength) {
                throw new Traverse.SizeError(
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
        selections: Set<unknown> | 
                    Map<unknown, unknown> | 
                    Array<unknown> | 
                    object
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
                has = ((this._inner as any) in selections);
            } else {
                throw new Traverse.ParameterError(
                    "Unsupported selections type (only Map/Set/Array/Object " + 
                    "is valid)."
                );
            }
            if (!has) {
                throw new Traverse.KeyNotFoundError(
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
    public customRule(callback: (inner: unknown) => boolean): Traverse {
        //  Check type.
        if (!(callback instanceof Function)) {
            throw new Traverse.ParameterError("Expect a Function.");
        }
        
        let isConformed = callback.call(this, this._inner);

        //  Check the return value.
        if (
            isConformed === null || 
            typeof(isConformed) == "undefined" ||
            !CrType.IsInstanceOf(isConformed, Boolean)
        ) {
            throw new Traverse.ParameterError(
                `Callback should return a Boolean. (path=\"${this.path}\")`
            );
        }

        if (!isConformed) {
            throw new Traverse.Error(
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
    //
    //  Classes.
    //

    /**
     *  Traverse error.
     */
    export class Error extends _Error {
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
    export class ParameterError extends Traverse.Error {}

    /**
     *  Traverse type error.
     */
    export class TypeError extends Traverse.Error {}

    /**
     *  Traverse format error.
     */
    export class FormatError extends Traverse.Error {}

    /**
     *  Traverse parse error.
     */
    export class ParseError extends Traverse.Error{}

    /**
     *  Traverse size error.
     */
    export class SizeError extends Traverse.Error {}

    /**
     *  Traverse key not found error.
     */
    export class KeyNotFoundError extends Traverse.Error {}

    /**
     *  Traverse index out of range error.
     */
    export class IndexOutOfRangeError extends Traverse.Error {}

    /**
     *  Traverse value out of range error.
     */
    export class ValueOutOfRangeError extends Traverse.Error {}

    /**
     *  Value comparator for traverse module.
     * 
     *  @template T
     */
    export class Comparator<T> {
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

    //
    //  Default.
    //
    export const DEFAULT_COMPARATOR = new Traverse.Comparator<any>();
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
export function WrapObject(inner: unknown, force: boolean = false): Traverse {
    if ((inner instanceof Traverse) && !force) {
        return inner;
    } else {
        return new Traverse(inner, "/");
    }
}
