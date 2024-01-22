// A set of variables that map to the ANSI escape codes for terminal manipulation
// and colorization.  See https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters
// for more information.
export enum TerminalStyle {
    // Reset all styles
    reset = 0,

    // Text Styles

    bold = 1,
    boldOff = 22,

    italic = 3,
    italicOff = 23,

    underline = 4,
    doubleunderline = 21,
    underlineOff = 24, // this reset both underline and doubleunderline

    inverse = 7,
    inverseOff = 27,

    hidden = 8,
    hiddenOff = 28,

    strikethrough = 9,
    strikethroughOff = 29,

    // *** Foreground Colors
    fgBlack = 30,
    fgRed = 31,
    fgGreen = 32,
    fgYellow = 33,
    fgBlue = 34,
    fgMagenta = 35,
    fgCyan = 36,
    fgWhite = 37,
    fgBrightRed = 91,
    fgBrightGreen = 92,
    fgBrightYellow = 93,
    fgBrightBlue = 94,
    fgBrightMagenta = 95,
    fgBrightCyan = 96,
    fgBrightWhite = 97,
    fgGray = 90,

    // Resets foreground color to default
    fgDefault = 39,

    // *** Background Colors
    bgBlack = 40,
    bgRed = 41,
    bgGreen = 42,
    bgYellow = 43,
    bgBlue = 44,
    bgMagenta = 45,
    bgCyan = 46,
    bgWhite = 47,
    bgBrightRed = 101,
    bgBrightGreen = 102,
    bgBrightYellow = 103,
    bgBrightBlue = 104,
    bgBrightMagenta = 105,
    bgBrightCyan = 106,
    bgBrightWhite = 107,
    bgGray = 100,

    // Resets background color to default
    bgDefault = 49,

    // *** Containers
    framed = 51,
    encircled = 52,
    overline = 53,
}

// Given a name or array of names, return the ANSI escape code for that name.
export function escapeCodeFromName(names: number[]): string {
    if (names.length === 0) {
        return '';
    }

    const codeString = names.join(';');
    return `\x1b[${codeString}m`;
}
