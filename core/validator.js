//
//  Copyright 2015 - 2018 The XRT Authors. All rights reserved.
//  Use of this source code is governed by a BSD-style license that can be
//  found in the LICENSE.md file.
//

/**
 *  Validate a string..
 * 
 *  @param {String} text - The text.
 *  @param {String} charTable - The character table.
 *  @return {Boolean} - True if valid.
 */
function ValidateString(text, charTable) {
    for (var i = 0; i < text.length; ++i) {
        if (charTable.indexOf(text[i]) < 0) {
            return false;
        }
    }
    return true;
}

//  Export public APIs.
module.exports = {
    "ValidateString": ValidateString
};