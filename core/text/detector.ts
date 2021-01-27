//
//  Copyright 2015 - 2021 The XRT Authors. All rights reserved.
//  Use of this source code is governed by a BSD-style license that can be
//  found in the LICENSE.md file.
//

//
//  Constants.
//

//  Testers.
// const REGEX_SPACE = /^([\s]*)$/;
// const REGEX_NEWLINE = /^([\n\r]*)$/
// const REGEX_ALPHABET = /^([a-zA-Z]*)$/;
// const REGEX_LOWER = /^([^A-Z]*)$/;
// const REGEX_UPPER = /^([^a-z]*)$/;
const REGEX_INTEGER = /^-?(0|[1-9]([0-9]*))$/;
// const REGEX_NUMERIC = /^([0-9]*)$/;
const REGEX_NUMERIC_STRICT = /^(-?(0|[1-9]([0-9]*)))(\.[0-9]+)?$/;

//
//  Public methods.
//

/**
 *  Check whether a text is an integer.
 * 
 *  Note(s):
 *    [1] Negative integer is allowed.
 *    [2] "-0" is considered as an integer.
 *    [3] Positive number starts with "0" is not considered as an integer.
 * 
 *  @param text
 *      - The text.
 *  @return 
 *      - True if so.
 */
export function IsInteger(text: string) {
    return REGEX_INTEGER.test(text);
}

/**
 *  Check whether a text is numeric strictly.
 * 
 *  Note(s):
 *    [1] "-0" is considered as numeric.
 *    [2] Floats are considered as numeric.
 *    [2] Floats starts with "." are not considered as numeric.
 *    [3] Positive numbers starts with "0" is not considered as numeric.
 * 
 *  Example(s):
 *    [1] 0 => true
 *    [2] 1000 => true
 *    [3] 0111 => false
 *    [4] -0.2 => true
 *    [5] .2 => false
 * 
 *  @param text
 *      - The text.
 *  @return {Boolean}
 *      - True if so.
 */
export function IsNumericStrict(text: string) {
    return REGEX_NUMERIC_STRICT.test(text);
}
