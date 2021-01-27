//
//  Copyright 2015 - 2021 The XRT Authors. All rights reserved.
//  Use of this source code is governed by a BSD-style license that can be
//  found in the LICENSE.md file.
//

//
//  Public functions.
//

/**
 *  Check the type of an object. 
 * 
 *  @param instance 
 *      - The object instance. 
 *  @param constructor 
 *      - The object constructor (type).
 *  @returns 
 *      - True if type matches.
 */
export function IsInstanceOf(instance: any, constructor: any): boolean {
    if (
        constructor == Number || 
        constructor == Boolean || 
        constructor == String
    ) {
        return instance.constructor == constructor;
    } else {
        return (instance instanceof constructor);
    }
}

/**
 *  Get whether two objects are the same type.
 * 
 *  @param instance1
 *      - The first instance.
 *  @param instance2
 *      - The second instance.
 *  @returns
 *      - True if types are the same.
 */
export function IsSameType(instance1: any, instance2: any): boolean {
    let t1 = typeof(instance1);
    let t2 = typeof(instance2);
    if (
        (instance1 === null && instance2 !== null) || 
        (instance2 === null && instance1 !== null)
    ) {
        return false;
    }
    if (
        (t1 == "undefined" && t2 != "undefined") || 
        (t2 == "undefined" && t1 != "undefined")
    ) {
        return false;
    }
    return t1 == t2 && IsInstanceOf(instance1, instance2.constructor);
}