/*
  Regex for matching a number in a given string value.

  Prior regex => /[^0-9.\\\-+e]/gi

  Here we look for:
    1. -?(\d+\.\d+|\d+|\.\d+)([e+-]?\d+)?:
        - `-?` => sign if present
        - `(\d+\.\d+|\d+|\.\d+)` => decimal value or whole integer or decimal without leading figure
        - `([e+-]?\d+)?`=> exponent with sign if present
    2. (\\?-?(\d+\.\d+|\d+|\.\d+)([e+-]?\d+)?)? => Optional group
        - `\\?` => DICOM array divider if present
        - `-?(\d+\.\d+|\d+|\.\d+)([e+-]?\d+)?` => See #1 for details.
 */
export const numberFilter =
    /-?(\d+\.\d+|\d+|\.\d+)([e+-]?\d+)?(\\?-?(\d+\.\d+|\d+|\.\d+)([e+-]?\d+)?)?/gi;

export const uuidFilter = /[0-9.]/g;
