//
//  Copyright 2015 - 2019 The XRT Authors. All rights reserved.
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
// const REGEX_BASE64 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;  //  See "https://stackoverflow.com/a/7874175".

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
 *  @param {String} text
 *      - The text.
 *  @return {Boolean}
 *      - True if so.
 */
function IsInteger(text) {
    return REGEX_INTEGER.test(text);
}

// /**
//  *  Check whether a text is numeric.
//  * 
//  *  Note(s):
//  *    [1] Only texts consists of character "0" ~ "9" are considered as numerics.
//  * 
//  *  @deprecated
//  *      - This routine is ONLY for compatible use.
//  *  @param {String} text
//  *      - The text.
//  *  @return {Boolean}
//  *      - True if so.
//  */
// function IsNumeric(text) {
//     return REGEX_NUMERIC.test(text);
// }

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
 *  @param {String} text
 *      - The text.
 *  @return {Boolean}
 *      - True if so.
 */
function IsNumericStrict(text) {
    return REGEX_NUMERIC_STRICT.test(text);
}

// /**
//  *  Check whether a text is lowered.
//  * 
//  *  @param {String} text
//  *      - The text.
//  *  @return {Boolean}
//  *      - True if so.
//  */
// function IsLower(text) {
//     return REGEX_LOWER.test(text);
// }

// /**
//  *  Check whether a text is uppered.
//  * 
//  *  @param {String} text
//  *      - The text.
//  *  @return {Boolean}
//  *      - True if so.
//  */
// function IsUpper(text) {
//     return REGEX_UPPER.test(text);
// }

// /**
//  *  Check whether a text is alphabetic.
//  * 
//  *  @param {String} text
//  *      - The text.
//  *  @return {Boolean}
//  *      - True if so.
//  */
// function IsAlphabet(text) {
//     return REGEX_ALPHABET.test(text);
// }

// /**
//  *  Check whether a text is space-only.
//  * 
//  *  Note(s):
//  *    [1] The space character set also contains new line characters.
//  * 
//  *  @param {String} text
//  *      - The text.
//  *  @return {Boolean}
//  *      - True if so.
//  */
// function IsSpace(text) {
//     return REGEX_SPACE.test(text);
// }

// /**
//  *  Check whether a text is newline-only.
//  * 
//  *  @param {String} text
//  *      - The text.
//  *  @return {Boolean}
//  *      - True if so.
//  */
// function IsNewLine(text) {
//     return REGEX_NEWLINE.test(text);
// }

// /**
//  *  Check whether a text is Base-64 encoded.
//  * 
//  *  @param {String} text
//  *      - The text.
//  *  @return {Boolean}
//  *      - True if so.
//  */
// function IsBase64(text) {
//     return REGEX_BASE64.test(text);
// }

//  Export public APIs.
module.exports = {
    "IsInteger": IsInteger,
    // "IsNumeric": IsNumeric,
    "IsNumericStrict": IsNumericStrict,
    // "IsLower": IsLower,
    // "IsUpper": IsUpper,
    // "IsAlphabet": IsAlphabet,
    // "IsSpace": IsSpace,
    // "IsNewLine": IsNewLine,
    // "IsBase64": IsBase64
};