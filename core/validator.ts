//
//  Copyright 2015 - 2021 The XRT Authors. All rights reserved.
//  Use of this source code is governed by a BSD-style license that can be
//  found in the LICENSE.md file.
//

//
//  Public functions.
//

/**
 *  Validate a string.
 *
 *  @param text 
 *      - The text.
 *  @param charTable 
 *      - The character table.
 *  @returns
 *      - True if valid.
 */
export function ValidateString(text: string, charTable: string): boolean {
    for (let i = 0; i < text.length; ++i) {
        if (charTable.indexOf(text[i]) < 0) {
            return false;
        }
    }
    return true;
}
