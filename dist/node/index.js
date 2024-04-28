import {createRequire} from "node:module";
var __require = createRequire(import.meta.url);

// src/compiler/types.ts
function isAttribute(key) {
  return AllAttributeKeysList.includes(key);
}
var ValidTags;
(function(ValidTags2) {
  ValidTags2["h1"] = "h1";
  ValidTags2["h2"] = "h2";
  ValidTags2["h3"] = "h3";
  ValidTags2["body"] = "body";
  ValidTags2["span"] = "span";
  ValidTags2["p"] = "p";
  ValidTags2["div"] = "div";
  ValidTags2["text"] = "text";
  ValidTags2["li"] = "li";
  ValidTags2["br"] = "br";
})(ValidTags || (ValidTags = {}));
var ValidTagsList = Object.keys(ValidTags);
var ColorAttributeValues = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "default",
  "brightblack",
  "brightred",
  "brightgreen",
  "brightyellow",
  "brightblue",
  "brightmagenta",
  "brightcyan",
  "gray"
];
var booleanValues = ["true", "false", "yes", "no", "y", "n", "1", "0"];
var SpaceAttributes = {
  margin: ["number"],
  marginTop: ["number"],
  marginBottom: ["number"],
  marginLeft: ["number"],
  marginRight: ["number"]
};
var TextAttributes = {
  fg: ColorAttributeValues,
  bg: ColorAttributeValues,
  bold: [...booleanValues],
  italics: [...booleanValues],
  underline: [...booleanValues, "single", "double", "none"]
};
var ListAttributes = {
  bullet: ["*", "-", "+"],
  indent: ["number"]
};
var RawTextAttributes = {
  value: ["string"]
};
var AllAttributeKeysList = [
  ...Object.keys(SpaceAttributes),
  ...Object.keys(TextAttributes),
  ...Object.keys(ListAttributes),
  ...Object.keys(RawTextAttributes)
];
var TagAttributeMap = {
  [ValidTags.h1]: {
    ...TextAttributes,
    ...SpaceAttributes
  },
  [ValidTags.h2]: {
    ...TextAttributes,
    ...SpaceAttributes
  },
  [ValidTags.h3]: {
    ...TextAttributes,
    ...SpaceAttributes
  },
  [ValidTags.body]: {
    ...TextAttributes,
    ...SpaceAttributes
  },
  [ValidTags.span]: {
    ...TextAttributes
  },
  [ValidTags.p]: {
    ...TextAttributes,
    ...SpaceAttributes
  },
  [ValidTags.div]: {
    ...TextAttributes,
    ...SpaceAttributes
  },
  [ValidTags.li]: {
    ...TextAttributes,
    ...SpaceAttributes,
    ...ListAttributes
  },
  [ValidTags.text]: {},
  [ValidTags.br]: {
    ...SpaceAttributes
  }
};

class AnsieNodeImpl {
  _raw;
  _style;
  constructor(node, style) {
    this._raw = node;
    this._style = style;
  }
  get node() {
    return this._raw.node;
  }
  get attributes() {
    return Object.entries(this._raw).reduce((acc, [key, value]) => {
      if (isAttribute(key) && typeof value === "string") {
        acc[key] = value;
      }
      return acc;
    }, {});
  }
  attr(key) {
    return this._raw[key];
  }
}

class CompilerError {
  name = "CompilerError";
  message;
  fatal;
  markupNode;
  markupStack;
  constructor(message, markupNode, markupStack, fatal = false) {
    this.message = message;
    this.markupNode = markupNode;
    this.markupStack = markupStack;
    this.fatal = fatal;
  }
  toString() {
    return `${this.name}: ${this.message} (${this.markupNode.node}, ${this.markupStack.map((node) => node.node).join(", ")})`;
  }
  continue() {
    return !this.fatal;
  }
}

// src/parser/generated-parser.js
var clumpStrings = function(vals) {
  const ret = [];
  let lastStr = "";
  for (const val of vals) {
    if (typeof val === "string") {
      lastStr += val;
    } else {
      if (lastStr) {
        ret.push(lastStr);
        lastStr = "";
      }
      ret.push(val);
    }
  }
  if (lastStr) {
    ret.push(lastStr);
  }
  return ret;
};
var peg$subclass = function(child, parent) {
  function C() {
    this.constructor = child;
  }
  C.prototype = parent.prototype;
  child.prototype = new C;
};
var peg$SyntaxError = function(message, expected, found, location) {
  var self = Error.call(this, message);
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(self, peg$SyntaxError.prototype);
  }
  self.expected = expected;
  self.found = found;
  self.location = location;
  self.name = "SyntaxError";
  return self;
};
var peg$padEnd = function(str, targetLength, padString) {
  padString = padString || " ";
  if (str.length > targetLength) {
    return str;
  }
  targetLength -= str.length;
  padString += padString.repeat(targetLength);
  return str + padString.slice(0, targetLength);
};
var peg$parse = function(input, options) {
  options = options !== undefined ? options : {};
  var peg$FAILED = {};
  var peg$source = options.grammarSource;
  var peg$startRuleFunctions = { document: peg$parsedocument };
  var peg$startRuleFunction = peg$parsedocument;
  var peg$c0 = "\t";
  var peg$c1 = "\n";
  var peg$c2 = "\r";
  var peg$c3 = ".";
  var peg$c4 = "-";
  var peg$c5 = "_";
  var peg$c6 = ":";
  var peg$c7 = " ";
  var peg$c8 = '"';
  var peg$c9 = "'";
  var peg$c10 = "<!--";
  var peg$c11 = "--";
  var peg$c12 = "-->";
  var peg$c13 = "<![CDATA[";
  var peg$c14 = "]]>";
  var peg$c15 = "=";
  var peg$c16 = "1.0";
  var peg$c17 = "standalone";
  var peg$c18 = "yes";
  var peg$c19 = "no";
  var peg$c20 = "<";
  var peg$c21 = ">";
  var peg$c22 = "</";
  var peg$c23 = "/>";
  var peg$r0 = /^[ -\uD7FF]/;
  var peg$r1 = /^[\uE000-\uFFFD]/;
  var peg$r2 = /^[\uD800-\uDBFF]/;
  var peg$r3 = /^[\uDC00-\uDFFF]/;
  var peg$r4 = /^[ \t\r\n]/;
  var peg$r5 = /^[^%&"]/;
  var peg$r6 = /^[^%&']/;
  var peg$r7 = /^[^<&"]/;
  var peg$r8 = /^[^<&']/;
  var peg$r9 = /^[^"]/;
  var peg$r10 = /^[^']/;
  var peg$r11 = /^[\-()+,.\/:=?;!*#@$_% \r\na-zA-Z0-9]/;
  var peg$r12 = /^[^<&]/;
  var peg$r13 = /^[A-Za-z\xC0-\xD6]/;
  var peg$r14 = /^[\xD8-\xF6\xF8-\xFF\u0100-\u0131]/;
  var peg$r15 = /^[\u0134-\u013E\u0141-\u0148\u014A-\u017E]/;
  var peg$r16 = /^[\u0180-\u01C3\u01CD-\u01F0\u01F4-\u01F5]/;
  var peg$r17 = /^[\u01FA-\u0217\u0250-\u02A8\u02BB-\u02C1]/;
  var peg$r18 = /^[\u0386\u0388-\u038A\u038C\u038E-\u03A1]/;
  var peg$r19 = /^[\u03A3-\u03CE\u03D0-\u03D6\u03DA\u03DC]/;
  var peg$r20 = /^[\u03DE\u03E0\u03E2-\u03F3\u0401-\u040C]/;
  var peg$r21 = /^[\u040E-\u044F\u0451-\u045C\u045E-\u0481]/;
  var peg$r22 = /^[\u0490-\u04C4\u04C7-\u04C8\u04CB-\u04CC]/;
  var peg$r23 = /^[\u04D0-\u04EB\u04EE-\u04F5\u04F8-\u04F9]/;
  var peg$r24 = /^[\u0531-\u0556\u0559\u0561-\u0586]/;
  var peg$r25 = /^[\u05D0-\u05EA\u05F0-\u05F2\u0621-\u063A]/;
  var peg$r26 = /^[\u0641-\u064A\u0671-\u06B7\u06BA-\u06BE]/;
  var peg$r27 = /^[\u06C0-\u06CE\u06D0-\u06D3\u06D5\u06E5-\u06E6]/;
  var peg$r28 = /^[\u0905-\u0939\u093D\u0958-\u0961\u0985-\u098C]/;
  var peg$r29 = /^[\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0]/;
  var peg$r30 = /^[\u09B2\u09B6-\u09B9\u09DC-\u09DD\u09DF-\u09E1]/;
  var peg$r31 = /^[\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10]/;
  var peg$r32 = /^[\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33]/;
  var peg$r33 = /^[\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C]/;
  var peg$r34 = /^[\u0A5E\u0A72-\u0A74\u0A85-\u0A8B\u0A8D]/;
  var peg$r35 = /^[\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0]/;
  var peg$r36 = /^[\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AE0]/;
  var peg$r37 = /^[\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28]/;
  var peg$r38 = /^[\u0B2A-\u0B30\u0B32-\u0B33\u0B36-\u0B39]/;
  var peg$r39 = /^[\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61]/;
  var peg$r40 = /^[\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95]/;
  var peg$r41 = /^[\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F]/;
  var peg$r42 = /^[\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5]/;
  var peg$r43 = /^[\u0BB7-\u0BB9\u0C05-\u0C0C\u0C0E-\u0C10]/;
  var peg$r44 = /^[\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39]/;
  var peg$r45 = /^[\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90]/;
  var peg$r46 = /^[\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9]/;
  var peg$r47 = /^[\u0CDE\u0CE0-\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10]/;
  var peg$r48 = /^[\u0D12-\u0D28\u0D2A-\u0D39\u0D60-\u0D61]/;
  var peg$r49 = /^[\u0E01-\u0E2E\u0E30\u0E32-\u0E33\u0E40-\u0E45]/;
  var peg$r50 = /^[\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A]/;
  var peg$r51 = /^[\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3]/;
  var peg$r52 = /^[\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EAE\u0EB0]/;
  var peg$r53 = /^[\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0F40-\u0F47]/;
  var peg$r54 = /^[\u0F49-\u0F69\u10A0-\u10C5\u10D0-\u10F6\u1100]/;
  var peg$r55 = /^[\u1102-\u1103\u1105-\u1107\u1109\u110B-\u110C]/;
  var peg$r56 = /^[\u110E-\u1112\u113C\u113E\u1140\u114C\u114E]/;
  var peg$r57 = /^[\u1150\u1154-\u1155\u1159\u115F-\u1161\u1163]/;
  var peg$r58 = /^[\u1165\u1167\u1169\u116D-\u116E\u1172-\u1173]/;
  var peg$r59 = /^[\u1175\u119E\u11A8\u11AB\u11AE-\u11AF]/;
  var peg$r60 = /^[\u11B7-\u11B8\u11BA\u11BC-\u11C2\u11EB\u11F0]/;
  var peg$r61 = /^[\u11F9\u1E00-\u1E9B\u1EA0-\u1EF9\u1F00-\u1F15]/;
  var peg$r62 = /^[\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D]/;
  var peg$r63 = /^[\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D]/;
  var peg$r64 = /^[\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4]/;
  var peg$r65 = /^[\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB]/;
  var peg$r66 = /^[\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2126]/;
  var peg$r67 = /^[\u212A-\u212B\u212E\u2180-\u2182\u3041-\u3094]/;
  var peg$r68 = /^[\u30A1-\u30FA\u3105-\u312C\uAC00-\uD7A3]/;
  var peg$r69 = /^[\u4E00-\u9FA5\u3007\u3021-\u3029]/;
  var peg$r70 = /^[\u0300-\u0345\u0360-\u0361\u0483-\u0486]/;
  var peg$r71 = /^[\u0591-\u05A1\u05A3-\u05B9\u05BB-\u05BD\u05BF]/;
  var peg$r72 = /^[\u05C1-\u05C2\u05C4\u064B-\u0652\u0670]/;
  var peg$r73 = /^[\u06D6-\u06DC\u06DD-\u06DF\u06E0-\u06E4]/;
  var peg$r74 = /^[\u06E7-\u06E8\u06EA-\u06ED\u0901-\u0903]/;
  var peg$r75 = /^[\u093C\u093E-\u094C\u094D\u0951-\u0954]/;
  var peg$r76 = /^[\u0962-\u0963\u0981-\u0983\u09BC\u09BE]/;
  var peg$r77 = /^[\u09BF\u09C0-\u09C4\u09C7-\u09C8\u09CB-\u09CD]/;
  var peg$r78 = /^[\u09D7\u09E2-\u09E3\u0A02\u0A3C\u0A3E\u0A3F]/;
  var peg$r79 = /^[\u0A40-\u0A42\u0A47-\u0A48\u0A4B-\u0A4D]/;
  var peg$r80 = /^[\u0A70-\u0A71\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5]/;
  var peg$r81 = /^[\u0AC7-\u0AC9\u0ACB-\u0ACD\u0B01-\u0B03\u0B3C]/;
  var peg$r82 = /^[\u0B3E-\u0B43\u0B47-\u0B48\u0B4B-\u0B4D]/;
  var peg$r83 = /^[\u0B56-\u0B57\u0B82-\u0B83\u0BBE-\u0BC2]/;
  var peg$r84 = /^[\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C01-\u0C03]/;
  var peg$r85 = /^[\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D]/;
  var peg$r86 = /^[\u0C55-\u0C56\u0C82-\u0C83\u0CBE-\u0CC4]/;
  var peg$r87 = /^[\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5-\u0CD6]/;
  var peg$r88 = /^[\u0D02-\u0D03\u0D3E-\u0D43\u0D46-\u0D48]/;
  var peg$r89 = /^[\u0D4A-\u0D4D\u0D57\u0E31\u0E34-\u0E3A]/;
  var peg$r90 = /^[\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB-\u0EBC]/;
  var peg$r91 = /^[\u0EC8-\u0ECD\u0F18-\u0F19\u0F35\u0F37\u0F39]/;
  var peg$r92 = /^[\u0F3E\u0F3F\u0F71-\u0F84\u0F86-\u0F8B]/;
  var peg$r93 = /^[\u0F90-\u0F95\u0F97\u0F99-\u0FAD\u0FB1-\u0FB7]/;
  var peg$r94 = /^[\u0FB9\u20D0-\u20DC\u20E1\u302A-\u302F]/;
  var peg$r95 = /^[\u3099\u309A]/;
  var peg$r96 = /^[0-9\u0660-\u0669\u06F0-\u06F9]/;
  var peg$r97 = /^[\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F]/;
  var peg$r98 = /^[\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE7-\u0BEF]/;
  var peg$r99 = /^[\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F]/;
  var peg$r100 = /^[\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29]/;
  var peg$r101 = /^[\xB7\u02D0\u02D1\u0387\u0640\u0E46]/;
  var peg$r102 = /^[\u0EC6\u3005\u3031-\u3035\u309D-\u309E]/;
  var peg$r103 = /^[\u30FC-\u30FE]/;
  var peg$e0 = peg$literalExpectation("\t", false);
  var peg$e1 = peg$literalExpectation("\n", false);
  var peg$e2 = peg$literalExpectation("\r", false);
  var peg$e3 = peg$classExpectation([[" ", "\uD7FF"]], false, false);
  var peg$e4 = peg$classExpectation([["\uE000", "\uFFFD"]], false, false);
  var peg$e5 = peg$classExpectation([["\uD800", "\uDBFF"]], false, false);
  var peg$e6 = peg$classExpectation([["\uDC00", "\uDFFF"]], false, false);
  var peg$e7 = peg$classExpectation([" ", "\t", "\r", "\n"], false, false);
  var peg$e8 = peg$literalExpectation(".", false);
  var peg$e9 = peg$literalExpectation("-", false);
  var peg$e10 = peg$literalExpectation("_", false);
  var peg$e11 = peg$literalExpectation(":", false);
  var peg$e12 = peg$literalExpectation(" ", false);
  var peg$e13 = peg$literalExpectation('"', false);
  var peg$e14 = peg$classExpectation(["%", "&", '"'], true, false);
  var peg$e15 = peg$literalExpectation("'", false);
  var peg$e16 = peg$classExpectation(["%", "&", "'"], true, false);
  var peg$e17 = peg$classExpectation(["<", "&", '"'], true, false);
  var peg$e18 = peg$classExpectation(["<", "&", "'"], true, false);
  var peg$e19 = peg$classExpectation(['"'], true, false);
  var peg$e20 = peg$classExpectation(["'"], true, false);
  var peg$e21 = peg$classExpectation([
    "-",
    "(",
    ")",
    "+",
    ",",
    ".",
    "/",
    ":",
    "=",
    "?",
    ";",
    "!",
    "*",
    "#",
    "@",
    "$",
    "_",
    "%",
    " ",
    "\r",
    "\n",
    ["a", "z"],
    ["A", "Z"],
    ["0", "9"]
  ], false, false);
  var peg$e22 = peg$classExpectation(["<", "&"], true, false);
  var peg$e23 = peg$literalExpectation("<!--", false);
  var peg$e24 = peg$literalExpectation("--", false);
  var peg$e25 = peg$literalExpectation("-->", false);
  var peg$e26 = peg$literalExpectation("<![CDATA[", false);
  var peg$e27 = peg$literalExpectation("]]>", false);
  var peg$e28 = peg$literalExpectation("=", false);
  var peg$e29 = peg$literalExpectation("1.0", false);
  var peg$e30 = peg$literalExpectation("standalone", false);
  var peg$e31 = peg$literalExpectation("yes", false);
  var peg$e32 = peg$literalExpectation("no", false);
  var peg$e33 = peg$literalExpectation("<", false);
  var peg$e34 = peg$literalExpectation(">", false);
  var peg$e35 = peg$literalExpectation("</", false);
  var peg$e36 = peg$literalExpectation("/>", false);
  var peg$e37 = peg$classExpectation([
    ["A", "Z"],
    ["a", "z"],
    ["\xC0", "\xD6"]
  ], false, false);
  var peg$e38 = peg$classExpectation([
    ["\xD8", "\xF6"],
    ["\xF8", "\xFF"],
    ["\u0100", "\u0131"]
  ], false, false);
  var peg$e39 = peg$classExpectation([
    ["\u0134", "\u013E"],
    ["\u0141", "\u0148"],
    ["\u014A", "\u017E"]
  ], false, false);
  var peg$e40 = peg$classExpectation([
    ["\u0180", "\u01C3"],
    ["\u01CD", "\u01F0"],
    ["\u01F4", "\u01F5"]
  ], false, false);
  var peg$e41 = peg$classExpectation([
    ["\u01FA", "\u0217"],
    ["\u0250", "\u02A8"],
    ["\u02BB", "\u02C1"]
  ], false, false);
  var peg$e42 = peg$classExpectation(["\u0386", ["\u0388", "\u038A"], "\u038C", ["\u038E", "\u03A1"]], false, false);
  var peg$e43 = peg$classExpectation([["\u03A3", "\u03CE"], ["\u03D0", "\u03D6"], "\u03DA", "\u03DC"], false, false);
  var peg$e44 = peg$classExpectation(["\u03DE", "\u03E0", ["\u03E2", "\u03F3"], ["\u0401", "\u040C"]], false, false);
  var peg$e45 = peg$classExpectation([
    ["\u040E", "\u044F"],
    ["\u0451", "\u045C"],
    ["\u045E", "\u0481"]
  ], false, false);
  var peg$e46 = peg$classExpectation([
    ["\u0490", "\u04C4"],
    ["\u04C7", "\u04C8"],
    ["\u04CB", "\u04CC"]
  ], false, false);
  var peg$e47 = peg$classExpectation([
    ["\u04D0", "\u04EB"],
    ["\u04EE", "\u04F5"],
    ["\u04F8", "\u04F9"]
  ], false, false);
  var peg$e48 = peg$classExpectation([["\u0531", "\u0556"], "\u0559", ["\u0561", "\u0586"]], false, false);
  var peg$e49 = peg$classExpectation([
    ["\u05D0", "\u05EA"],
    ["\u05F0", "\u05F2"],
    ["\u0621", "\u063A"]
  ], false, false);
  var peg$e50 = peg$classExpectation([
    ["\u0641", "\u064A"],
    ["\u0671", "\u06B7"],
    ["\u06BA", "\u06BE"]
  ], false, false);
  var peg$e51 = peg$classExpectation([
    ["\u06C0", "\u06CE"],
    ["\u06D0", "\u06D3"],
    "\u06D5",
    ["\u06E5", "\u06E6"]
  ], false, false);
  var peg$e52 = peg$classExpectation([
    ["\u0905", "\u0939"],
    "\u093D",
    ["\u0958", "\u0961"],
    ["\u0985", "\u098C"]
  ], false, false);
  var peg$e53 = peg$classExpectation([
    ["\u098F", "\u0990"],
    ["\u0993", "\u09A8"],
    ["\u09AA", "\u09B0"]
  ], false, false);
  var peg$e54 = peg$classExpectation([
    "\u09B2",
    ["\u09B6", "\u09B9"],
    ["\u09DC", "\u09DD"],
    ["\u09DF", "\u09E1"]
  ], false, false);
  var peg$e55 = peg$classExpectation([
    ["\u09F0", "\u09F1"],
    ["\u0A05", "\u0A0A"],
    ["\u0A0F", "\u0A10"]
  ], false, false);
  var peg$e56 = peg$classExpectation([
    ["\u0A13", "\u0A28"],
    ["\u0A2A", "\u0A30"],
    ["\u0A32", "\u0A33"]
  ], false, false);
  var peg$e57 = peg$classExpectation([
    ["\u0A35", "\u0A36"],
    ["\u0A38", "\u0A39"],
    ["\u0A59", "\u0A5C"]
  ], false, false);
  var peg$e58 = peg$classExpectation(["\u0A5E", ["\u0A72", "\u0A74"], ["\u0A85", "\u0A8B"], "\u0A8D"], false, false);
  var peg$e59 = peg$classExpectation([
    ["\u0A8F", "\u0A91"],
    ["\u0A93", "\u0AA8"],
    ["\u0AAA", "\u0AB0"]
  ], false, false);
  var peg$e60 = peg$classExpectation([["\u0AB2", "\u0AB3"], ["\u0AB5", "\u0AB9"], "\u0ABD", "\u0AE0"], false, false);
  var peg$e61 = peg$classExpectation([
    ["\u0B05", "\u0B0C"],
    ["\u0B0F", "\u0B10"],
    ["\u0B13", "\u0B28"]
  ], false, false);
  var peg$e62 = peg$classExpectation([
    ["\u0B2A", "\u0B30"],
    ["\u0B32", "\u0B33"],
    ["\u0B36", "\u0B39"]
  ], false, false);
  var peg$e63 = peg$classExpectation(["\u0B3D", ["\u0B5C", "\u0B5D"], ["\u0B5F", "\u0B61"]], false, false);
  var peg$e64 = peg$classExpectation([
    ["\u0B85", "\u0B8A"],
    ["\u0B8E", "\u0B90"],
    ["\u0B92", "\u0B95"]
  ], false, false);
  var peg$e65 = peg$classExpectation([["\u0B99", "\u0B9A"], "\u0B9C", ["\u0B9E", "\u0B9F"]], false, false);
  var peg$e66 = peg$classExpectation([
    ["\u0BA3", "\u0BA4"],
    ["\u0BA8", "\u0BAA"],
    ["\u0BAE", "\u0BB5"]
  ], false, false);
  var peg$e67 = peg$classExpectation([
    ["\u0BB7", "\u0BB9"],
    ["\u0C05", "\u0C0C"],
    ["\u0C0E", "\u0C10"]
  ], false, false);
  var peg$e68 = peg$classExpectation([
    ["\u0C12", "\u0C28"],
    ["\u0C2A", "\u0C33"],
    ["\u0C35", "\u0C39"]
  ], false, false);
  var peg$e69 = peg$classExpectation([
    ["\u0C60", "\u0C61"],
    ["\u0C85", "\u0C8C"],
    ["\u0C8E", "\u0C90"]
  ], false, false);
  var peg$e70 = peg$classExpectation([
    ["\u0C92", "\u0CA8"],
    ["\u0CAA", "\u0CB3"],
    ["\u0CB5", "\u0CB9"]
  ], false, false);
  var peg$e71 = peg$classExpectation([
    "\u0CDE",
    ["\u0CE0", "\u0CE1"],
    ["\u0D05", "\u0D0C"],
    ["\u0D0E", "\u0D10"]
  ], false, false);
  var peg$e72 = peg$classExpectation([
    ["\u0D12", "\u0D28"],
    ["\u0D2A", "\u0D39"],
    ["\u0D60", "\u0D61"]
  ], false, false);
  var peg$e73 = peg$classExpectation([
    ["\u0E01", "\u0E2E"],
    "\u0E30",
    ["\u0E32", "\u0E33"],
    ["\u0E40", "\u0E45"]
  ], false, false);
  var peg$e74 = peg$classExpectation([["\u0E81", "\u0E82"], "\u0E84", ["\u0E87", "\u0E88"], "\u0E8A"], false, false);
  var peg$e75 = peg$classExpectation([
    "\u0E8D",
    ["\u0E94", "\u0E97"],
    ["\u0E99", "\u0E9F"],
    ["\u0EA1", "\u0EA3"]
  ], false, false);
  var peg$e76 = peg$classExpectation([
    "\u0EA5",
    "\u0EA7",
    ["\u0EAA", "\u0EAB"],
    ["\u0EAD", "\u0EAE"],
    "\u0EB0"
  ], false, false);
  var peg$e77 = peg$classExpectation([
    ["\u0EB2", "\u0EB3"],
    "\u0EBD",
    ["\u0EC0", "\u0EC4"],
    ["\u0F40", "\u0F47"]
  ], false, false);
  var peg$e78 = peg$classExpectation([
    ["\u0F49", "\u0F69"],
    ["\u10A0", "\u10C5"],
    ["\u10D0", "\u10F6"],
    "\u1100"
  ], false, false);
  var peg$e79 = peg$classExpectation([
    ["\u1102", "\u1103"],
    ["\u1105", "\u1107"],
    "\u1109",
    ["\u110B", "\u110C"]
  ], false, false);
  var peg$e80 = peg$classExpectation([
    ["\u110E", "\u1112"],
    "\u113C",
    "\u113E",
    "\u1140",
    "\u114C",
    "\u114E"
  ], false, false);
  var peg$e81 = peg$classExpectation([
    "\u1150",
    ["\u1154", "\u1155"],
    "\u1159",
    ["\u115F", "\u1161"],
    "\u1163"
  ], false, false);
  var peg$e82 = peg$classExpectation([
    "\u1165",
    "\u1167",
    "\u1169",
    ["\u116D", "\u116E"],
    ["\u1172", "\u1173"]
  ], false, false);
  var peg$e83 = peg$classExpectation(["\u1175", "\u119E", "\u11A8", "\u11AB", ["\u11AE", "\u11AF"]], false, false);
  var peg$e84 = peg$classExpectation([
    ["\u11B7", "\u11B8"],
    "\u11BA",
    ["\u11BC", "\u11C2"],
    "\u11EB",
    "\u11F0"
  ], false, false);
  var peg$e85 = peg$classExpectation([
    "\u11F9",
    ["\u1E00", "\u1E9B"],
    ["\u1EA0", "\u1EF9"],
    ["\u1F00", "\u1F15"]
  ], false, false);
  var peg$e86 = peg$classExpectation([
    ["\u1F18", "\u1F1D"],
    ["\u1F20", "\u1F45"],
    ["\u1F48", "\u1F4D"]
  ], false, false);
  var peg$e87 = peg$classExpectation([
    ["\u1F50", "\u1F57"],
    "\u1F59",
    "\u1F5B",
    "\u1F5D",
    ["\u1F5F", "\u1F7D"]
  ], false, false);
  var peg$e88 = peg$classExpectation([
    ["\u1F80", "\u1FB4"],
    ["\u1FB6", "\u1FBC"],
    "\u1FBE",
    ["\u1FC2", "\u1FC4"]
  ], false, false);
  var peg$e89 = peg$classExpectation([
    ["\u1FC6", "\u1FCC"],
    ["\u1FD0", "\u1FD3"],
    ["\u1FD6", "\u1FDB"]
  ], false, false);
  var peg$e90 = peg$classExpectation([
    ["\u1FE0", "\u1FEC"],
    ["\u1FF2", "\u1FF4"],
    ["\u1FF6", "\u1FFC"],
    "\u2126"
  ], false, false);
  var peg$e91 = peg$classExpectation([
    ["\u212A", "\u212B"],
    "\u212E",
    ["\u2180", "\u2182"],
    ["\u3041", "\u3094"]
  ], false, false);
  var peg$e92 = peg$classExpectation([
    ["\u30A1", "\u30FA"],
    ["\u3105", "\u312C"],
    ["\uAC00", "\uD7A3"]
  ], false, false);
  var peg$e93 = peg$classExpectation([["\u4E00", "\u9FA5"], "\u3007", ["\u3021", "\u3029"]], false, false);
  var peg$e94 = peg$classExpectation([
    ["\u0300", "\u0345"],
    ["\u0360", "\u0361"],
    ["\u0483", "\u0486"]
  ], false, false);
  var peg$e95 = peg$classExpectation([
    ["\u0591", "\u05A1"],
    ["\u05A3", "\u05B9"],
    ["\u05BB", "\u05BD"],
    "\u05BF"
  ], false, false);
  var peg$e96 = peg$classExpectation([["\u05C1", "\u05C2"], "\u05C4", ["\u064B", "\u0652"], "\u0670"], false, false);
  var peg$e97 = peg$classExpectation([
    ["\u06D6", "\u06DC"],
    ["\u06DD", "\u06DF"],
    ["\u06E0", "\u06E4"]
  ], false, false);
  var peg$e98 = peg$classExpectation([
    ["\u06E7", "\u06E8"],
    ["\u06EA", "\u06ED"],
    ["\u0901", "\u0903"]
  ], false, false);
  var peg$e99 = peg$classExpectation(["\u093C", ["\u093E", "\u094C"], "\u094D", ["\u0951", "\u0954"]], false, false);
  var peg$e100 = peg$classExpectation([["\u0962", "\u0963"], ["\u0981", "\u0983"], "\u09BC", "\u09BE"], false, false);
  var peg$e101 = peg$classExpectation([
    "\u09BF",
    ["\u09C0", "\u09C4"],
    ["\u09C7", "\u09C8"],
    ["\u09CB", "\u09CD"]
  ], false, false);
  var peg$e102 = peg$classExpectation([
    "\u09D7",
    ["\u09E2", "\u09E3"],
    "\u0A02",
    "\u0A3C",
    "\u0A3E",
    "\u0A3F"
  ], false, false);
  var peg$e103 = peg$classExpectation([
    ["\u0A40", "\u0A42"],
    ["\u0A47", "\u0A48"],
    ["\u0A4B", "\u0A4D"]
  ], false, false);
  var peg$e104 = peg$classExpectation([
    ["\u0A70", "\u0A71"],
    ["\u0A81", "\u0A83"],
    "\u0ABC",
    ["\u0ABE", "\u0AC5"]
  ], false, false);
  var peg$e105 = peg$classExpectation([
    ["\u0AC7", "\u0AC9"],
    ["\u0ACB", "\u0ACD"],
    ["\u0B01", "\u0B03"],
    "\u0B3C"
  ], false, false);
  var peg$e106 = peg$classExpectation([
    ["\u0B3E", "\u0B43"],
    ["\u0B47", "\u0B48"],
    ["\u0B4B", "\u0B4D"]
  ], false, false);
  var peg$e107 = peg$classExpectation([
    ["\u0B56", "\u0B57"],
    ["\u0B82", "\u0B83"],
    ["\u0BBE", "\u0BC2"]
  ], false, false);
  var peg$e108 = peg$classExpectation([
    ["\u0BC6", "\u0BC8"],
    ["\u0BCA", "\u0BCD"],
    "\u0BD7",
    ["\u0C01", "\u0C03"]
  ], false, false);
  var peg$e109 = peg$classExpectation([
    ["\u0C3E", "\u0C44"],
    ["\u0C46", "\u0C48"],
    ["\u0C4A", "\u0C4D"]
  ], false, false);
  var peg$e110 = peg$classExpectation([
    ["\u0C55", "\u0C56"],
    ["\u0C82", "\u0C83"],
    ["\u0CBE", "\u0CC4"]
  ], false, false);
  var peg$e111 = peg$classExpectation([
    ["\u0CC6", "\u0CC8"],
    ["\u0CCA", "\u0CCD"],
    ["\u0CD5", "\u0CD6"]
  ], false, false);
  var peg$e112 = peg$classExpectation([
    ["\u0D02", "\u0D03"],
    ["\u0D3E", "\u0D43"],
    ["\u0D46", "\u0D48"]
  ], false, false);
  var peg$e113 = peg$classExpectation([["\u0D4A", "\u0D4D"], "\u0D57", "\u0E31", ["\u0E34", "\u0E3A"]], false, false);
  var peg$e114 = peg$classExpectation([
    ["\u0E47", "\u0E4E"],
    "\u0EB1",
    ["\u0EB4", "\u0EB9"],
    ["\u0EBB", "\u0EBC"]
  ], false, false);
  var peg$e115 = peg$classExpectation([
    ["\u0EC8", "\u0ECD"],
    ["\u0F18", "\u0F19"],
    "\u0F35",
    "\u0F37",
    "\u0F39"
  ], false, false);
  var peg$e116 = peg$classExpectation(["\u0F3E", "\u0F3F", ["\u0F71", "\u0F84"], ["\u0F86", "\u0F8B"]], false, false);
  var peg$e117 = peg$classExpectation([
    ["\u0F90", "\u0F95"],
    "\u0F97",
    ["\u0F99", "\u0FAD"],
    ["\u0FB1", "\u0FB7"]
  ], false, false);
  var peg$e118 = peg$classExpectation(["\u0FB9", ["\u20D0", "\u20DC"], "\u20E1", ["\u302A", "\u302F"]], false, false);
  var peg$e119 = peg$classExpectation(["\u3099", "\u309A"], false, false);
  var peg$e120 = peg$classExpectation([
    ["0", "9"],
    ["\u0660", "\u0669"],
    ["\u06F0", "\u06F9"]
  ], false, false);
  var peg$e121 = peg$classExpectation([
    ["\u0966", "\u096F"],
    ["\u09E6", "\u09EF"],
    ["\u0A66", "\u0A6F"]
  ], false, false);
  var peg$e122 = peg$classExpectation([
    ["\u0AE6", "\u0AEF"],
    ["\u0B66", "\u0B6F"],
    ["\u0BE7", "\u0BEF"]
  ], false, false);
  var peg$e123 = peg$classExpectation([
    ["\u0C66", "\u0C6F"],
    ["\u0CE6", "\u0CEF"],
    ["\u0D66", "\u0D6F"]
  ], false, false);
  var peg$e124 = peg$classExpectation([
    ["\u0E50", "\u0E59"],
    ["\u0ED0", "\u0ED9"],
    ["\u0F20", "\u0F29"]
  ], false, false);
  var peg$e125 = peg$classExpectation(["\xB7", "\u02D0", "\u02D1", "\u0387", "\u0640", "\u0E46"], false, false);
  var peg$e126 = peg$classExpectation(["\u0EC6", "\u3005", ["\u3031", "\u3035"], ["\u309D", "\u309E"]], false, false);
  var peg$e127 = peg$classExpectation([["\u30FC", "\u30FE"]], false, false);
  var peg$f0 = function(head, tail) {
    return [head, ...tail];
  };
  var peg$f1 = function(head, tail) {
    return [head, ...tail];
  };
  var peg$f2 = function(vals) {
    return clumpStrings(vals);
  };
  var peg$f3 = function(vals) {
    return clumpStrings(vals);
  };
  var peg$f4 = function(value) {
    return value ? {
      node: "text",
      value
    } : null;
  };
  var peg$f5 = function(value) {
    return {
      node: "comment",
      value: value.join("")
    };
  };
  var peg$f6 = function(value) {
    return {
      node: "text",
      value
    };
  };
  var peg$f7 = function(start, c) {
    start.content = c;
    return start;
  };
  var peg$f8 = function(name, attr) {
    return {
      node: processTag(name, attr),
      ...convertAttr(attr)
    };
  };
  var peg$f9 = function(name) {
    return {
      type: "attribute",
      name,
      value: "true",
      loc: location()
    };
  };
  var peg$f10 = function(name, value) {
    return {
      type: "attribute",
      name,
      value,
      loc: location()
    };
  };
  var peg$f11 = function(n) {
    names.push(n);
    return n;
  };
  var peg$f12 = function(n) {
    const other = names.pop();
    if (other === n) {
      return true;
    }
    const loc = location();
    loc.start.offset -= n.length;
    loc.start.column -= n.length;
    error(`Expected end tag "${other}" but got "${n}"`, loc);
  };
  var peg$f13 = function(c1, content) {
    const res = [];
    if (c1) {
      res.push(c1);
    }
    for (const c of content) {
      res.push(c[0]);
      if (c[1]) {
        res.push(c[1]);
      }
    }
    return res;
  };
  var peg$f14 = function(name, attr) {
    return {
      node: name,
      ...convertAttr(attr)
    };
  };
  var peg$currPos = 0;
  var peg$savedPos = 0;
  var peg$posDetailsCache = [{ line: 1, column: 1 }];
  var peg$maxFailPos = 0;
  var peg$maxFailExpected = [];
  var peg$silentFails = 0;
  var peg$result;
  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error('Can\'t start parsing from rule "' + options.startRule + '".');
    }
    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }
  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }
  function offset() {
    return peg$savedPos;
  }
  function range() {
    return {
      source: peg$source,
      start: peg$savedPos,
      end: peg$currPos
    };
  }
  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }
  function expected(description, location2) {
    location2 = location2 !== undefined ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location2);
  }
  function error(message, location2) {
    location2 = location2 !== undefined ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildSimpleError(message, location2);
  }
  function peg$literalExpectation(text2, ignoreCase) {
    return { type: "literal", text: text2, ignoreCase };
  }
  function peg$classExpectation(parts, inverted, ignoreCase) {
    return {
      type: "class",
      parts,
      inverted,
      ignoreCase
    };
  }
  function peg$anyExpectation() {
    return { type: "any" };
  }
  function peg$endExpectation() {
    return { type: "end" };
  }
  function peg$otherExpectation(description) {
    return { type: "other", description };
  }
  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos];
    var p;
    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }
      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };
      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }
        p++;
      }
      peg$posDetailsCache[pos] = details;
      return details;
    }
  }
  function peg$computeLocation(startPos, endPos, offset2) {
    var startPosDetails = peg$computePosDetails(startPos);
    var endPosDetails = peg$computePosDetails(endPos);
    var res = {
      source: peg$source,
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
    if (offset2 && peg$source && typeof peg$source.offset === "function") {
      res.start = peg$source.offset(res.start);
      res.end = peg$source.offset(res.end);
    }
    return res;
  }
  function peg$fail(expected2) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }
    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }
    peg$maxFailExpected.push(expected2);
  }
  function peg$buildSimpleError(message, location2) {
    return new peg$SyntaxError(message, null, null, location2);
  }
  function peg$buildStructuredError(expected2, found, location2) {
    return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected2, found), expected2, found, location2);
  }
  function peg$parsedocument() {
    var s0;
    s0 = peg$parsecontent();
    return s0;
  }
  function peg$parseChar() {
    var s0, s1, s2, s3;
    if (input.charCodeAt(peg$currPos) === 9) {
      s0 = peg$c0;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e0);
      }
    }
    if (s0 === peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 10) {
        s0 = peg$c1;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e1);
        }
      }
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 13) {
          s0 = peg$c2;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e2);
          }
        }
        if (s0 === peg$FAILED) {
          if (peg$r0.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e3);
            }
          }
          if (s0 === peg$FAILED) {
            if (peg$r1.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e4);
              }
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$currPos;
              if (peg$r2.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e5);
                }
              }
              if (s2 !== peg$FAILED) {
                if (peg$r3.test(input.charAt(peg$currPos))) {
                  s3 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e6);
                  }
                }
                if (s3 !== peg$FAILED) {
                  s2 = [s2, s3];
                  s1 = s2;
                } else {
                  peg$currPos = s1;
                  s1 = peg$FAILED;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
              if (s1 !== peg$FAILED) {
                s0 = input.substring(s0, peg$currPos);
              } else {
                s0 = s1;
              }
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parseS() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = [];
    if (peg$r4.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e7);
      }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$r4.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e7);
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }
    return s0;
  }
  function peg$parseNameChar() {
    var s0;
    s0 = peg$parseLetter();
    if (s0 === peg$FAILED) {
      s0 = peg$parseDigit();
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s0 = peg$c3;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e8);
          }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 45) {
            s0 = peg$c4;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e9);
            }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 95) {
              s0 = peg$c5;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e10);
              }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 58) {
                s0 = peg$c6;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e11);
                }
              }
              if (s0 === peg$FAILED) {
                s0 = peg$parseCombiningChar();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseExtender();
                }
              }
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parseName() {
    var s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$parseLetter();
    if (s2 === peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 95) {
        s2 = peg$c5;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e10);
        }
      }
      if (s2 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 58) {
          s2 = peg$c6;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e11);
          }
        }
      }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parseNameChar();
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$parseNameChar();
      }
      s2 = [s2, s3];
      s1 = s2;
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }
    return s0;
  }
  function peg$parseNames() {
    var s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    s1 = peg$parseName();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 32) {
        s4 = peg$c7;
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e12);
        }
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parseName();
        if (s5 !== peg$FAILED) {
          s3 = s5;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 32) {
          s4 = peg$c7;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e12);
          }
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseName();
          if (s5 !== peg$FAILED) {
            s3 = s5;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f0(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseNmtoken() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parseNameChar();
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseNameChar();
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s0 = input.substring(s0, peg$currPos);
    } else {
      s0 = s1;
    }
    return s0;
  }
  function peg$parseNmtokens() {
    var s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    s1 = peg$parseNmtoken();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 32) {
        s4 = peg$c7;
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e12);
        }
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parseNmtoken();
        if (s5 !== peg$FAILED) {
          s3 = s5;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 32) {
          s4 = peg$c7;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e12);
          }
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseNmtoken();
          if (s5 !== peg$FAILED) {
            s3 = s5;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f1(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseEntityValue() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 34) {
      s1 = peg$c8;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e13);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (peg$r5.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e14);
        }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        if (peg$r5.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e14);
          }
        }
      }
      if (input.charCodeAt(peg$currPos) === 34) {
        s3 = peg$c8;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e13);
        }
      }
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f2(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 39) {
        s1 = peg$c9;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e15);
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$r6.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e16);
          }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$r6.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e16);
            }
          }
        }
        if (input.charCodeAt(peg$currPos) === 39) {
          s3 = peg$c9;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e15);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f3(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }
    return s0;
  }
  function peg$parseAttValue() {
    var s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 34) {
      s1 = peg$c8;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e13);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = [];
      if (peg$r7.test(input.charAt(peg$currPos))) {
        s4 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e17);
        }
      }
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        if (peg$r7.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e17);
          }
        }
      }
      s2 = input.substring(s2, peg$currPos);
      if (input.charCodeAt(peg$currPos) === 34) {
        s3 = peg$c8;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e13);
        }
      }
      if (s3 !== peg$FAILED) {
        s0 = s2;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 39) {
        s1 = peg$c9;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e15);
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = [];
        if (peg$r8.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e18);
          }
        }
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          if (peg$r8.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e18);
            }
          }
        }
        s2 = input.substring(s2, peg$currPos);
        if (input.charCodeAt(peg$currPos) === 39) {
          s3 = peg$c9;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e15);
          }
        }
        if (s3 !== peg$FAILED) {
          s0 = s2;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }
    return s0;
  }
  function peg$parseSystemLiteral() {
    var s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 34) {
      s1 = peg$c8;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e13);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = [];
      if (peg$r9.test(input.charAt(peg$currPos))) {
        s4 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e19);
        }
      }
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        if (peg$r9.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e19);
          }
        }
      }
      s2 = input.substring(s2, peg$currPos);
      if (input.charCodeAt(peg$currPos) === 34) {
        s3 = peg$c8;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e13);
        }
      }
      if (s3 !== peg$FAILED) {
        s0 = s2;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 39) {
        s1 = peg$c9;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e15);
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = [];
        if (peg$r10.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e20);
          }
        }
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          if (peg$r10.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e20);
            }
          }
        }
        s2 = input.substring(s2, peg$currPos);
        if (input.charCodeAt(peg$currPos) === 39) {
          s3 = peg$c9;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e15);
          }
        }
        if (s3 !== peg$FAILED) {
          s0 = s2;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }
    return s0;
  }
  function peg$parsePubidLiteral() {
    var s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 34) {
      s1 = peg$c8;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e13);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = [];
      s4 = peg$parsePubidChar();
      if (s4 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 39) {
          s4 = peg$c9;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e15);
          }
        }
      }
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$parsePubidChar();
        if (s4 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 39) {
            s4 = peg$c9;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e15);
            }
          }
        }
      }
      s2 = input.substring(s2, peg$currPos);
      if (input.charCodeAt(peg$currPos) === 34) {
        s3 = peg$c8;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e13);
        }
      }
      if (s3 !== peg$FAILED) {
        s0 = s2;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 39) {
        s1 = peg$c9;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e15);
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = [];
        s4 = peg$parsePubidChar();
        if (s4 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s4 = peg$c8;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e13);
            }
          }
        }
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parsePubidChar();
          if (s4 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
              s4 = peg$c8;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e13);
              }
            }
          }
        }
        s2 = input.substring(s2, peg$currPos);
        if (input.charCodeAt(peg$currPos) === 39) {
          s3 = peg$c9;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e15);
          }
        }
        if (s3 !== peg$FAILED) {
          s0 = s2;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }
    return s0;
  }
  function peg$parsePubidChar() {
    var s0;
    if (peg$r11.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e21);
      }
    }
    return s0;
  }
  function peg$parseCharData() {
    var s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = [];
    s3 = peg$currPos;
    s4 = peg$currPos;
    peg$silentFails++;
    s5 = peg$parseCDEnd();
    peg$silentFails--;
    if (s5 === peg$FAILED) {
      s4 = undefined;
    } else {
      peg$currPos = s4;
      s4 = peg$FAILED;
    }
    if (s4 !== peg$FAILED) {
      if (peg$r12.test(input.charAt(peg$currPos))) {
        s5 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e22);
        }
      }
      if (s5 !== peg$FAILED) {
        s4 = [s4, s5];
        s3 = s4;
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
    } else {
      peg$currPos = s3;
      s3 = peg$FAILED;
    }
    while (s3 !== peg$FAILED) {
      s2.push(s3);
      s3 = peg$currPos;
      s4 = peg$currPos;
      peg$silentFails++;
      s5 = peg$parseCDEnd();
      peg$silentFails--;
      if (s5 === peg$FAILED) {
        s4 = undefined;
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        if (peg$r12.test(input.charAt(peg$currPos))) {
          s5 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e22);
          }
        }
        if (s5 !== peg$FAILED) {
          s4 = [s4, s5];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
    }
    s1 = input.substring(s1, peg$currPos);
    peg$savedPos = s0;
    s1 = peg$f4(s1);
    s0 = s1;
    return s0;
  }
  function peg$parseComment() {
    var s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c10) {
      s1 = peg$c10;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e23);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$currPos;
      peg$silentFails++;
      if (input.substr(peg$currPos, 2) === peg$c11) {
        s5 = peg$c11;
        peg$currPos += 2;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e24);
        }
      }
      peg$silentFails--;
      if (s5 === peg$FAILED) {
        s4 = undefined;
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parseChar();
        if (s5 !== peg$FAILED) {
          s3 = s5;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c11) {
          s5 = peg$c11;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e24);
          }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = undefined;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseChar();
          if (s5 !== peg$FAILED) {
            s3 = s5;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      if (input.substr(peg$currPos, 3) === peg$c12) {
        s3 = peg$c12;
        peg$currPos += 3;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e25);
        }
      }
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f5(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseCDSect() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parseCDStart();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseCData();
      s3 = peg$parseCDEnd();
      if (s3 !== peg$FAILED) {
        s1 = [s1, s2, s3];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseCDStart() {
    var s0;
    if (input.substr(peg$currPos, 9) === peg$c13) {
      s0 = peg$c13;
      peg$currPos += 9;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e26);
      }
    }
    return s0;
  }
  function peg$parseCData() {
    var s0, s1, s2, s3;
    s0 = [];
    s1 = peg$currPos;
    s2 = peg$currPos;
    peg$silentFails++;
    s3 = peg$parseCDEnd();
    peg$silentFails--;
    if (s3 === peg$FAILED) {
      s2 = undefined;
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parseChar();
      if (s3 !== peg$FAILED) {
        s2 = [s2, s3];
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      s1 = peg$currPos;
      s2 = peg$currPos;
      peg$silentFails++;
      s3 = peg$parseCDEnd();
      peg$silentFails--;
      if (s3 === peg$FAILED) {
        s2 = undefined;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseChar();
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    }
    return s0;
  }
  function peg$parseCDEnd() {
    var s0;
    if (input.substr(peg$currPos, 3) === peg$c14) {
      s0 = peg$c14;
      peg$currPos += 3;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e27);
      }
    }
    return s0;
  }
  function peg$parseEq() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parseS();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (input.charCodeAt(peg$currPos) === 61) {
      s2 = peg$c15;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e28);
      }
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parseS();
      if (s3 === peg$FAILED) {
        s3 = null;
      }
      s1 = [s1, s2, s3];
      s0 = s1;
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseVersionNum() {
    var s0;
    if (input.substr(peg$currPos, 3) === peg$c16) {
      s0 = peg$c16;
      peg$currPos += 3;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e29);
      }
    }
    return s0;
  }
  function peg$parseMisc() {
    var s0, s1;
    s0 = peg$parseComment();
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseS();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f6(s1);
      }
      s0 = s1;
    }
    return s0;
  }
  function peg$parseSDDecl() {
    var s0, s1, s2, s3, s4, s5, s6, s7;
    s0 = peg$currPos;
    s1 = peg$parseS();
    if (s1 !== peg$FAILED) {
      if (input.substr(peg$currPos, 10) === peg$c17) {
        s2 = peg$c17;
        peg$currPos += 10;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e30);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseEq();
        if (s3 !== peg$FAILED) {
          s4 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 39) {
            s5 = peg$c9;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e15);
            }
          }
          if (s5 !== peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c18) {
              s6 = peg$c18;
              peg$currPos += 3;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e31);
              }
            }
            if (s6 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c19) {
                s6 = peg$c19;
                peg$currPos += 2;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e32);
                }
              }
            }
            if (s6 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 39) {
                s7 = peg$c9;
                peg$currPos++;
              } else {
                s7 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e15);
                }
              }
              if (s7 !== peg$FAILED) {
                s5 = [s5, s6, s7];
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 === peg$FAILED) {
            s4 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 34) {
              s5 = peg$c8;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e13);
              }
            }
            if (s5 !== peg$FAILED) {
              if (input.substr(peg$currPos, 3) === peg$c18) {
                s6 = peg$c18;
                peg$currPos += 3;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e31);
                }
              }
              if (s6 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c19) {
                  s6 = peg$c19;
                  peg$currPos += 2;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e32);
                  }
                }
              }
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 34) {
                  s7 = peg$c8;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e13);
                  }
                }
                if (s7 !== peg$FAILED) {
                  s5 = [s5, s6, s7];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          }
          if (s4 !== peg$FAILED) {
            s1 = [s1, s2, s3, s4];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseelement() {
    var s0, s1, s2, s3;
    s0 = peg$parseEmptyElemTag();
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseSTag();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsecontent();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseETag();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f7(s1, s2);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }
    return s0;
  }
  function peg$parseSTag() {
    var s0, s1, s2, s3, s4, s5, s6, s7;
    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parseS();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parseS();
    }
    if (input.charCodeAt(peg$currPos) === 60) {
      s2 = peg$c20;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e33);
      }
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parsepushName();
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$currPos;
        s6 = peg$parseS();
        if (s6 !== peg$FAILED) {
          s7 = peg$parseAttribute();
          if (s7 === peg$FAILED) {
            s7 = peg$parseEmptyAttribute();
          }
          if (s7 !== peg$FAILED) {
            s5 = s7;
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
        } else {
          peg$currPos = s5;
          s5 = peg$FAILED;
        }
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$currPos;
          s6 = peg$parseS();
          if (s6 !== peg$FAILED) {
            s7 = peg$parseAttribute();
            if (s7 === peg$FAILED) {
              s7 = peg$parseEmptyAttribute();
            }
            if (s7 !== peg$FAILED) {
              s5 = s7;
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
        }
        s5 = peg$parseS();
        if (s5 === peg$FAILED) {
          s5 = null;
        }
        if (input.charCodeAt(peg$currPos) === 62) {
          s6 = peg$c21;
          peg$currPos++;
        } else {
          s6 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e34);
          }
        }
        if (s6 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f8(s3, s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseEmptyAttribute() {
    var s0, s1;
    s0 = peg$currPos;
    s1 = peg$parseName();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f9(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parseAttribute() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parseName();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseEq();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseAttValue();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f10(s1, s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseETag() {
    var s0, s1, s2, s3, s4, s5, s6;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c22) {
      s1 = peg$c22;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e35);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepopName();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseS();
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (input.charCodeAt(peg$currPos) === 62) {
          s4 = peg$c21;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e34);
          }
        }
        if (s4 !== peg$FAILED) {
          s5 = [];
          s6 = peg$parseS();
          while (s6 !== peg$FAILED) {
            s5.push(s6);
            s6 = peg$parseS();
          }
          s1 = [s1, s2, s3, s4, s5];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsepushName() {
    var s0, s1;
    s0 = peg$currPos;
    s1 = peg$parseName();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f11(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parsepopName() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = peg$parseName();
    if (s1 !== peg$FAILED) {
      peg$savedPos = peg$currPos;
      s2 = peg$f12(s1);
      if (s2) {
        s2 = undefined;
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsecontent() {
    var s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    s1 = peg$parseCharData();
    s2 = [];
    s3 = peg$currPos;
    s4 = peg$parseelement();
    if (s4 === peg$FAILED) {
      s4 = peg$parseCDSect();
      if (s4 === peg$FAILED) {
        s4 = peg$parseComment();
      }
    }
    if (s4 !== peg$FAILED) {
      s5 = peg$parseCharData();
      s4 = [s4, s5];
      s3 = s4;
    } else {
      peg$currPos = s3;
      s3 = peg$FAILED;
    }
    while (s3 !== peg$FAILED) {
      s2.push(s3);
      s3 = peg$currPos;
      s4 = peg$parseelement();
      if (s4 === peg$FAILED) {
        s4 = peg$parseCDSect();
        if (s4 === peg$FAILED) {
          s4 = peg$parseComment();
        }
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parseCharData();
        s4 = [s4, s5];
        s3 = s4;
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
    }
    peg$savedPos = s0;
    s0 = peg$f13(s1, s2);
    return s0;
  }
  function peg$parseEmptyElemTag() {
    var s0, s1, s2, s3, s4, s5, s6;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 60) {
      s1 = peg$c20;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e33);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseName();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$currPos;
        s5 = peg$parseS();
        if (s5 !== peg$FAILED) {
          s6 = peg$parseAttribute();
          if (s6 !== peg$FAILED) {
            s4 = s6;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$currPos;
          s5 = peg$parseS();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseAttribute();
            if (s6 !== peg$FAILED) {
              s4 = s6;
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        }
        s4 = peg$parseS();
        if (s4 === peg$FAILED) {
          s4 = null;
        }
        if (input.substr(peg$currPos, 2) === peg$c23) {
          s5 = peg$c23;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e36);
          }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f14(s2, s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseLetter() {
    var s0;
    s0 = peg$parseBaseChar();
    if (s0 === peg$FAILED) {
      s0 = peg$parseIdeographic();
    }
    return s0;
  }
  function peg$parseBaseChar() {
    var s0;
    if (peg$r13.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e37);
      }
    }
    if (s0 === peg$FAILED) {
      if (peg$r14.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e38);
        }
      }
      if (s0 === peg$FAILED) {
        if (peg$r15.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e39);
          }
        }
        if (s0 === peg$FAILED) {
          if (peg$r16.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e40);
            }
          }
          if (s0 === peg$FAILED) {
            if (peg$r17.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e41);
              }
            }
            if (s0 === peg$FAILED) {
              if (peg$r18.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e42);
                }
              }
              if (s0 === peg$FAILED) {
                if (peg$r19.test(input.charAt(peg$currPos))) {
                  s0 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e43);
                  }
                }
                if (s0 === peg$FAILED) {
                  if (peg$r20.test(input.charAt(peg$currPos))) {
                    s0 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$e44);
                    }
                  }
                  if (s0 === peg$FAILED) {
                    if (peg$r21.test(input.charAt(peg$currPos))) {
                      s0 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$e45);
                      }
                    }
                    if (s0 === peg$FAILED) {
                      if (peg$r22.test(input.charAt(peg$currPos))) {
                        s0 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$e46);
                        }
                      }
                      if (s0 === peg$FAILED) {
                        if (peg$r23.test(input.charAt(peg$currPos))) {
                          s0 = input.charAt(peg$currPos);
                          peg$currPos++;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$e47);
                          }
                        }
                        if (s0 === peg$FAILED) {
                          if (peg$r24.test(input.charAt(peg$currPos))) {
                            s0 = input.charAt(peg$currPos);
                            peg$currPos++;
                          } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                              peg$fail(peg$e48);
                            }
                          }
                          if (s0 === peg$FAILED) {
                            if (peg$r25.test(input.charAt(peg$currPos))) {
                              s0 = input.charAt(peg$currPos);
                              peg$currPos++;
                            } else {
                              s0 = peg$FAILED;
                              if (peg$silentFails === 0) {
                                peg$fail(peg$e49);
                              }
                            }
                            if (s0 === peg$FAILED) {
                              if (peg$r26.test(input.charAt(peg$currPos))) {
                                s0 = input.charAt(peg$currPos);
                                peg$currPos++;
                              } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                  peg$fail(peg$e50);
                                }
                              }
                              if (s0 === peg$FAILED) {
                                if (peg$r27.test(input.charAt(peg$currPos))) {
                                  s0 = input.charAt(peg$currPos);
                                  peg$currPos++;
                                } else {
                                  s0 = peg$FAILED;
                                  if (peg$silentFails === 0) {
                                    peg$fail(peg$e51);
                                  }
                                }
                                if (s0 === peg$FAILED) {
                                  if (peg$r28.test(input.charAt(peg$currPos))) {
                                    s0 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                  } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                      peg$fail(peg$e52);
                                    }
                                  }
                                  if (s0 === peg$FAILED) {
                                    if (peg$r29.test(input.charAt(peg$currPos))) {
                                      s0 = input.charAt(peg$currPos);
                                      peg$currPos++;
                                    } else {
                                      s0 = peg$FAILED;
                                      if (peg$silentFails === 0) {
                                        peg$fail(peg$e53);
                                      }
                                    }
                                    if (s0 === peg$FAILED) {
                                      if (peg$r30.test(input.charAt(peg$currPos))) {
                                        s0 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                      } else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                          peg$fail(peg$e54);
                                        }
                                      }
                                      if (s0 === peg$FAILED) {
                                        if (peg$r31.test(input.charAt(peg$currPos))) {
                                          s0 = input.charAt(peg$currPos);
                                          peg$currPos++;
                                        } else {
                                          s0 = peg$FAILED;
                                          if (peg$silentFails === 0) {
                                            peg$fail(peg$e55);
                                          }
                                        }
                                        if (s0 === peg$FAILED) {
                                          if (peg$r32.test(input.charAt(peg$currPos))) {
                                            s0 = input.charAt(peg$currPos);
                                            peg$currPos++;
                                          } else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                              peg$fail(peg$e56);
                                            }
                                          }
                                          if (s0 === peg$FAILED) {
                                            if (peg$r33.test(input.charAt(peg$currPos))) {
                                              s0 = input.charAt(peg$currPos);
                                              peg$currPos++;
                                            } else {
                                              s0 = peg$FAILED;
                                              if (peg$silentFails === 0) {
                                                peg$fail(peg$e57);
                                              }
                                            }
                                            if (s0 === peg$FAILED) {
                                              if (peg$r34.test(input.charAt(peg$currPos))) {
                                                s0 = input.charAt(peg$currPos);
                                                peg$currPos++;
                                              } else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                  peg$fail(peg$e58);
                                                }
                                              }
                                              if (s0 === peg$FAILED) {
                                                if (peg$r35.test(input.charAt(peg$currPos))) {
                                                  s0 = input.charAt(peg$currPos);
                                                  peg$currPos++;
                                                } else {
                                                  s0 = peg$FAILED;
                                                  if (peg$silentFails === 0) {
                                                    peg$fail(peg$e59);
                                                  }
                                                }
                                                if (s0 === peg$FAILED) {
                                                  if (peg$r36.test(input.charAt(peg$currPos))) {
                                                    s0 = input.charAt(peg$currPos);
                                                    peg$currPos++;
                                                  } else {
                                                    s0 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                      peg$fail(peg$e60);
                                                    }
                                                  }
                                                  if (s0 === peg$FAILED) {
                                                    if (peg$r37.test(input.charAt(peg$currPos))) {
                                                      s0 = input.charAt(peg$currPos);
                                                      peg$currPos++;
                                                    } else {
                                                      s0 = peg$FAILED;
                                                      if (peg$silentFails === 0) {
                                                        peg$fail(peg$e61);
                                                      }
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                      if (peg$r38.test(input.charAt(peg$currPos))) {
                                                        s0 = input.charAt(peg$currPos);
                                                        peg$currPos++;
                                                      } else {
                                                        s0 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                          peg$fail(peg$e62);
                                                        }
                                                      }
                                                      if (s0 === peg$FAILED) {
                                                        if (peg$r39.test(input.charAt(peg$currPos))) {
                                                          s0 = input.charAt(peg$currPos);
                                                          peg$currPos++;
                                                        } else {
                                                          s0 = peg$FAILED;
                                                          if (peg$silentFails === 0) {
                                                            peg$fail(peg$e63);
                                                          }
                                                        }
                                                        if (s0 === peg$FAILED) {
                                                          if (peg$r40.test(input.charAt(peg$currPos))) {
                                                            s0 = input.charAt(peg$currPos);
                                                            peg$currPos++;
                                                          } else {
                                                            s0 = peg$FAILED;
                                                            if (peg$silentFails === 0) {
                                                              peg$fail(peg$e64);
                                                            }
                                                          }
                                                          if (s0 === peg$FAILED) {
                                                            if (peg$r41.test(input.charAt(peg$currPos))) {
                                                              s0 = input.charAt(peg$currPos);
                                                              peg$currPos++;
                                                            } else {
                                                              s0 = peg$FAILED;
                                                              if (peg$silentFails === 0) {
                                                                peg$fail(peg$e65);
                                                              }
                                                            }
                                                            if (s0 === peg$FAILED) {
                                                              if (peg$r42.test(input.charAt(peg$currPos))) {
                                                                s0 = input.charAt(peg$currPos);
                                                                peg$currPos++;
                                                              } else {
                                                                s0 = peg$FAILED;
                                                                if (peg$silentFails === 0) {
                                                                  peg$fail(peg$e66);
                                                                }
                                                              }
                                                              if (s0 === peg$FAILED) {
                                                                if (peg$r43.test(input.charAt(peg$currPos))) {
                                                                  s0 = input.charAt(peg$currPos);
                                                                  peg$currPos++;
                                                                } else {
                                                                  s0 = peg$FAILED;
                                                                  if (peg$silentFails === 0) {
                                                                    peg$fail(peg$e67);
                                                                  }
                                                                }
                                                                if (s0 === peg$FAILED) {
                                                                  if (peg$r44.test(input.charAt(peg$currPos))) {
                                                                    s0 = input.charAt(peg$currPos);
                                                                    peg$currPos++;
                                                                  } else {
                                                                    s0 = peg$FAILED;
                                                                    if (peg$silentFails === 0) {
                                                                      peg$fail(peg$e68);
                                                                    }
                                                                  }
                                                                  if (s0 === peg$FAILED) {
                                                                    if (peg$r45.test(input.charAt(peg$currPos))) {
                                                                      s0 = input.charAt(peg$currPos);
                                                                      peg$currPos++;
                                                                    } else {
                                                                      s0 = peg$FAILED;
                                                                      if (peg$silentFails === 0) {
                                                                        peg$fail(peg$e69);
                                                                      }
                                                                    }
                                                                    if (s0 === peg$FAILED) {
                                                                      if (peg$r46.test(input.charAt(peg$currPos))) {
                                                                        s0 = input.charAt(peg$currPos);
                                                                        peg$currPos++;
                                                                      } else {
                                                                        s0 = peg$FAILED;
                                                                        if (peg$silentFails === 0) {
                                                                          peg$fail(peg$e70);
                                                                        }
                                                                      }
                                                                      if (s0 === peg$FAILED) {
                                                                        if (peg$r47.test(input.charAt(peg$currPos))) {
                                                                          s0 = input.charAt(peg$currPos);
                                                                          peg$currPos++;
                                                                        } else {
                                                                          s0 = peg$FAILED;
                                                                          if (peg$silentFails === 0) {
                                                                            peg$fail(peg$e71);
                                                                          }
                                                                        }
                                                                        if (s0 === peg$FAILED) {
                                                                          if (peg$r48.test(input.charAt(peg$currPos))) {
                                                                            s0 = input.charAt(peg$currPos);
                                                                            peg$currPos++;
                                                                          } else {
                                                                            s0 = peg$FAILED;
                                                                            if (peg$silentFails === 0) {
                                                                              peg$fail(peg$e72);
                                                                            }
                                                                          }
                                                                          if (s0 === peg$FAILED) {
                                                                            if (peg$r49.test(input.charAt(peg$currPos))) {
                                                                              s0 = input.charAt(peg$currPos);
                                                                              peg$currPos++;
                                                                            } else {
                                                                              s0 = peg$FAILED;
                                                                              if (peg$silentFails === 0) {
                                                                                peg$fail(peg$e73);
                                                                              }
                                                                            }
                                                                            if (s0 === peg$FAILED) {
                                                                              if (peg$r50.test(input.charAt(peg$currPos))) {
                                                                                s0 = input.charAt(peg$currPos);
                                                                                peg$currPos++;
                                                                              } else {
                                                                                s0 = peg$FAILED;
                                                                                if (peg$silentFails === 0) {
                                                                                  peg$fail(peg$e74);
                                                                                }
                                                                              }
                                                                              if (s0 === peg$FAILED) {
                                                                                if (peg$r51.test(input.charAt(peg$currPos))) {
                                                                                  s0 = input.charAt(peg$currPos);
                                                                                  peg$currPos++;
                                                                                } else {
                                                                                  s0 = peg$FAILED;
                                                                                  if (peg$silentFails === 0) {
                                                                                    peg$fail(peg$e75);
                                                                                  }
                                                                                }
                                                                                if (s0 === peg$FAILED) {
                                                                                  if (peg$r52.test(input.charAt(peg$currPos))) {
                                                                                    s0 = input.charAt(peg$currPos);
                                                                                    peg$currPos++;
                                                                                  } else {
                                                                                    s0 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) {
                                                                                      peg$fail(peg$e76);
                                                                                    }
                                                                                  }
                                                                                  if (s0 === peg$FAILED) {
                                                                                    if (peg$r53.test(input.charAt(peg$currPos))) {
                                                                                      s0 = input.charAt(peg$currPos);
                                                                                      peg$currPos++;
                                                                                    } else {
                                                                                      s0 = peg$FAILED;
                                                                                      if (peg$silentFails === 0) {
                                                                                        peg$fail(peg$e77);
                                                                                      }
                                                                                    }
                                                                                    if (s0 === peg$FAILED) {
                                                                                      if (peg$r54.test(input.charAt(peg$currPos))) {
                                                                                        s0 = input.charAt(peg$currPos);
                                                                                        peg$currPos++;
                                                                                      } else {
                                                                                        s0 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) {
                                                                                          peg$fail(peg$e78);
                                                                                        }
                                                                                      }
                                                                                      if (s0 === peg$FAILED) {
                                                                                        if (peg$r55.test(input.charAt(peg$currPos))) {
                                                                                          s0 = input.charAt(peg$currPos);
                                                                                          peg$currPos++;
                                                                                        } else {
                                                                                          s0 = peg$FAILED;
                                                                                          if (peg$silentFails === 0) {
                                                                                            peg$fail(peg$e79);
                                                                                          }
                                                                                        }
                                                                                        if (s0 === peg$FAILED) {
                                                                                          if (peg$r56.test(input.charAt(peg$currPos))) {
                                                                                            s0 = input.charAt(peg$currPos);
                                                                                            peg$currPos++;
                                                                                          } else {
                                                                                            s0 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) {
                                                                                              peg$fail(peg$e80);
                                                                                            }
                                                                                          }
                                                                                          if (s0 === peg$FAILED) {
                                                                                            if (peg$r57.test(input.charAt(peg$currPos))) {
                                                                                              s0 = input.charAt(peg$currPos);
                                                                                              peg$currPos++;
                                                                                            } else {
                                                                                              s0 = peg$FAILED;
                                                                                              if (peg$silentFails === 0) {
                                                                                                peg$fail(peg$e81);
                                                                                              }
                                                                                            }
                                                                                            if (s0 === peg$FAILED) {
                                                                                              if (peg$r58.test(input.charAt(peg$currPos))) {
                                                                                                s0 = input.charAt(peg$currPos);
                                                                                                peg$currPos++;
                                                                                              } else {
                                                                                                s0 = peg$FAILED;
                                                                                                if (peg$silentFails === 0) {
                                                                                                  peg$fail(peg$e82);
                                                                                                }
                                                                                              }
                                                                                              if (s0 === peg$FAILED) {
                                                                                                if (peg$r59.test(input.charAt(peg$currPos))) {
                                                                                                  s0 = input.charAt(peg$currPos);
                                                                                                  peg$currPos++;
                                                                                                } else {
                                                                                                  s0 = peg$FAILED;
                                                                                                  if (peg$silentFails === 0) {
                                                                                                    peg$fail(peg$e83);
                                                                                                  }
                                                                                                }
                                                                                                if (s0 === peg$FAILED) {
                                                                                                  if (peg$r60.test(input.charAt(peg$currPos))) {
                                                                                                    s0 = input.charAt(peg$currPos);
                                                                                                    peg$currPos++;
                                                                                                  } else {
                                                                                                    s0 = peg$FAILED;
                                                                                                    if (peg$silentFails === 0) {
                                                                                                      peg$fail(peg$e84);
                                                                                                    }
                                                                                                  }
                                                                                                  if (s0 === peg$FAILED) {
                                                                                                    if (peg$r61.test(input.charAt(peg$currPos))) {
                                                                                                      s0 = input.charAt(peg$currPos);
                                                                                                      peg$currPos++;
                                                                                                    } else {
                                                                                                      s0 = peg$FAILED;
                                                                                                      if (peg$silentFails === 0) {
                                                                                                        peg$fail(peg$e85);
                                                                                                      }
                                                                                                    }
                                                                                                    if (s0 === peg$FAILED) {
                                                                                                      if (peg$r62.test(input.charAt(peg$currPos))) {
                                                                                                        s0 = input.charAt(peg$currPos);
                                                                                                        peg$currPos++;
                                                                                                      } else {
                                                                                                        s0 = peg$FAILED;
                                                                                                        if (peg$silentFails === 0) {
                                                                                                          peg$fail(peg$e86);
                                                                                                        }
                                                                                                      }
                                                                                                      if (s0 === peg$FAILED) {
                                                                                                        if (peg$r63.test(input.charAt(peg$currPos))) {
                                                                                                          s0 = input.charAt(peg$currPos);
                                                                                                          peg$currPos++;
                                                                                                        } else {
                                                                                                          s0 = peg$FAILED;
                                                                                                          if (peg$silentFails === 0) {
                                                                                                            peg$fail(peg$e87);
                                                                                                          }
                                                                                                        }
                                                                                                        if (s0 === peg$FAILED) {
                                                                                                          if (peg$r64.test(input.charAt(peg$currPos))) {
                                                                                                            s0 = input.charAt(peg$currPos);
                                                                                                            peg$currPos++;
                                                                                                          } else {
                                                                                                            s0 = peg$FAILED;
                                                                                                            if (peg$silentFails === 0) {
                                                                                                              peg$fail(peg$e88);
                                                                                                            }
                                                                                                          }
                                                                                                          if (s0 === peg$FAILED) {
                                                                                                            if (peg$r65.test(input.charAt(peg$currPos))) {
                                                                                                              s0 = input.charAt(peg$currPos);
                                                                                                              peg$currPos++;
                                                                                                            } else {
                                                                                                              s0 = peg$FAILED;
                                                                                                              if (peg$silentFails === 0) {
                                                                                                                peg$fail(peg$e89);
                                                                                                              }
                                                                                                            }
                                                                                                            if (s0 === peg$FAILED) {
                                                                                                              if (peg$r66.test(input.charAt(peg$currPos))) {
                                                                                                                s0 = input.charAt(peg$currPos);
                                                                                                                peg$currPos++;
                                                                                                              } else {
                                                                                                                s0 = peg$FAILED;
                                                                                                                if (peg$silentFails === 0) {
                                                                                                                  peg$fail(peg$e90);
                                                                                                                }
                                                                                                              }
                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                if (peg$r67.test(input.charAt(peg$currPos))) {
                                                                                                                  s0 = input.charAt(peg$currPos);
                                                                                                                  peg$currPos++;
                                                                                                                } else {
                                                                                                                  s0 = peg$FAILED;
                                                                                                                  if (peg$silentFails === 0) {
                                                                                                                    peg$fail(peg$e91);
                                                                                                                  }
                                                                                                                }
                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                  if (peg$r68.test(input.charAt(peg$currPos))) {
                                                                                                                    s0 = input.charAt(peg$currPos);
                                                                                                                    peg$currPos++;
                                                                                                                  } else {
                                                                                                                    s0 = peg$FAILED;
                                                                                                                    if (peg$silentFails === 0) {
                                                                                                                      peg$fail(peg$e92);
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parseIdeographic() {
    var s0;
    if (peg$r69.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e93);
      }
    }
    return s0;
  }
  function peg$parseCombiningChar() {
    var s0;
    if (peg$r70.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e94);
      }
    }
    if (s0 === peg$FAILED) {
      if (peg$r71.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e95);
        }
      }
      if (s0 === peg$FAILED) {
        if (peg$r72.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e96);
          }
        }
        if (s0 === peg$FAILED) {
          if (peg$r73.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e97);
            }
          }
          if (s0 === peg$FAILED) {
            if (peg$r74.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e98);
              }
            }
            if (s0 === peg$FAILED) {
              if (peg$r75.test(input.charAt(peg$currPos))) {
                s0 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e99);
                }
              }
              if (s0 === peg$FAILED) {
                if (peg$r76.test(input.charAt(peg$currPos))) {
                  s0 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e100);
                  }
                }
                if (s0 === peg$FAILED) {
                  if (peg$r77.test(input.charAt(peg$currPos))) {
                    s0 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$e101);
                    }
                  }
                  if (s0 === peg$FAILED) {
                    if (peg$r78.test(input.charAt(peg$currPos))) {
                      s0 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$e102);
                      }
                    }
                    if (s0 === peg$FAILED) {
                      if (peg$r79.test(input.charAt(peg$currPos))) {
                        s0 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$e103);
                        }
                      }
                      if (s0 === peg$FAILED) {
                        if (peg$r80.test(input.charAt(peg$currPos))) {
                          s0 = input.charAt(peg$currPos);
                          peg$currPos++;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$e104);
                          }
                        }
                        if (s0 === peg$FAILED) {
                          if (peg$r81.test(input.charAt(peg$currPos))) {
                            s0 = input.charAt(peg$currPos);
                            peg$currPos++;
                          } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) {
                              peg$fail(peg$e105);
                            }
                          }
                          if (s0 === peg$FAILED) {
                            if (peg$r82.test(input.charAt(peg$currPos))) {
                              s0 = input.charAt(peg$currPos);
                              peg$currPos++;
                            } else {
                              s0 = peg$FAILED;
                              if (peg$silentFails === 0) {
                                peg$fail(peg$e106);
                              }
                            }
                            if (s0 === peg$FAILED) {
                              if (peg$r83.test(input.charAt(peg$currPos))) {
                                s0 = input.charAt(peg$currPos);
                                peg$currPos++;
                              } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                  peg$fail(peg$e107);
                                }
                              }
                              if (s0 === peg$FAILED) {
                                if (peg$r84.test(input.charAt(peg$currPos))) {
                                  s0 = input.charAt(peg$currPos);
                                  peg$currPos++;
                                } else {
                                  s0 = peg$FAILED;
                                  if (peg$silentFails === 0) {
                                    peg$fail(peg$e108);
                                  }
                                }
                                if (s0 === peg$FAILED) {
                                  if (peg$r85.test(input.charAt(peg$currPos))) {
                                    s0 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                  } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                      peg$fail(peg$e109);
                                    }
                                  }
                                  if (s0 === peg$FAILED) {
                                    if (peg$r86.test(input.charAt(peg$currPos))) {
                                      s0 = input.charAt(peg$currPos);
                                      peg$currPos++;
                                    } else {
                                      s0 = peg$FAILED;
                                      if (peg$silentFails === 0) {
                                        peg$fail(peg$e110);
                                      }
                                    }
                                    if (s0 === peg$FAILED) {
                                      if (peg$r87.test(input.charAt(peg$currPos))) {
                                        s0 = input.charAt(peg$currPos);
                                        peg$currPos++;
                                      } else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                          peg$fail(peg$e111);
                                        }
                                      }
                                      if (s0 === peg$FAILED) {
                                        if (peg$r88.test(input.charAt(peg$currPos))) {
                                          s0 = input.charAt(peg$currPos);
                                          peg$currPos++;
                                        } else {
                                          s0 = peg$FAILED;
                                          if (peg$silentFails === 0) {
                                            peg$fail(peg$e112);
                                          }
                                        }
                                        if (s0 === peg$FAILED) {
                                          if (peg$r89.test(input.charAt(peg$currPos))) {
                                            s0 = input.charAt(peg$currPos);
                                            peg$currPos++;
                                          } else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                              peg$fail(peg$e113);
                                            }
                                          }
                                          if (s0 === peg$FAILED) {
                                            if (peg$r90.test(input.charAt(peg$currPos))) {
                                              s0 = input.charAt(peg$currPos);
                                              peg$currPos++;
                                            } else {
                                              s0 = peg$FAILED;
                                              if (peg$silentFails === 0) {
                                                peg$fail(peg$e114);
                                              }
                                            }
                                            if (s0 === peg$FAILED) {
                                              if (peg$r91.test(input.charAt(peg$currPos))) {
                                                s0 = input.charAt(peg$currPos);
                                                peg$currPos++;
                                              } else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                  peg$fail(peg$e115);
                                                }
                                              }
                                              if (s0 === peg$FAILED) {
                                                if (peg$r92.test(input.charAt(peg$currPos))) {
                                                  s0 = input.charAt(peg$currPos);
                                                  peg$currPos++;
                                                } else {
                                                  s0 = peg$FAILED;
                                                  if (peg$silentFails === 0) {
                                                    peg$fail(peg$e116);
                                                  }
                                                }
                                                if (s0 === peg$FAILED) {
                                                  if (peg$r93.test(input.charAt(peg$currPos))) {
                                                    s0 = input.charAt(peg$currPos);
                                                    peg$currPos++;
                                                  } else {
                                                    s0 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                      peg$fail(peg$e117);
                                                    }
                                                  }
                                                  if (s0 === peg$FAILED) {
                                                    if (peg$r94.test(input.charAt(peg$currPos))) {
                                                      s0 = input.charAt(peg$currPos);
                                                      peg$currPos++;
                                                    } else {
                                                      s0 = peg$FAILED;
                                                      if (peg$silentFails === 0) {
                                                        peg$fail(peg$e118);
                                                      }
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                      if (peg$r95.test(input.charAt(peg$currPos))) {
                                                        s0 = input.charAt(peg$currPos);
                                                        peg$currPos++;
                                                      } else {
                                                        s0 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                          peg$fail(peg$e119);
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parseDigit() {
    var s0;
    if (peg$r96.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e120);
      }
    }
    if (s0 === peg$FAILED) {
      if (peg$r97.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e121);
        }
      }
      if (s0 === peg$FAILED) {
        if (peg$r98.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e122);
          }
        }
        if (s0 === peg$FAILED) {
          if (peg$r99.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e123);
            }
          }
          if (s0 === peg$FAILED) {
            if (peg$r100.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e124);
              }
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parseExtender() {
    var s0;
    if (peg$r101.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e125);
      }
    }
    if (s0 === peg$FAILED) {
      if (peg$r102.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e126);
        }
      }
      if (s0 === peg$FAILED) {
        if (peg$r103.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e127);
          }
        }
      }
    }
    return s0;
  }
  const names = [];
  function checkAttributeRule(attr, rule) {
    const isType = ["string", "boolean", "number"].includes(rule);
    const isEnum = !isType;
    if (isType || attr.value !== rule) {
      if (isType) {
        if (rule === "string") {
          if (typeof attr.value !== "string") {
            error(`Expect ${attr.name} to be a string but got ${attr.value}`);
            return false;
          } else {
            return true;
          }
        } else if (rule === "boolean") {
          if (![
            "1",
            "0",
            "yes",
            "no",
            "off",
            "on",
            "true",
            "false"
          ].includes(attr.value)) {
            error(`Expected "${attr.name}" to have a boolean descriptor but got "${attr.value}" (Try "true", "false", "yes", "no", "on", "off", "1", "0"`);
            return false;
          } else {
            return true;
          }
        } else if (rule == "number") {
          if (isNaN(Number(attr.value))) {
            error(`Expected "${attr.name}" to be a number but got "${attr.value}"`);
            return false;
          } else {
            return true;
          }
        } else {
          error(`Unknown type "${rule}"`);
          return false;
        }
      }
      if (isEnum) {
        return false;
      }
    }
    return true;
  }
  function processTag(tag, attribs) {
    if (Object.keys(TagAttributeMap).includes(tag)) {
      attribs.forEach((tagAttr) => {
        if (Object.keys(TagAttributeMap[tag]).includes(tagAttr.name)) {
          const attrName = tagAttr.name;
          const attrValue = tagAttr.value;
          const attrRules = TagAttributeMap[tag][attrName];
          const matched = attrRules.some((r) => checkAttributeRule(tagAttr, r));
          if (!matched) {
            error(`Invalid attribute "${tagAttr.name}" found in tag "${tag}".  Expected ["${attrRules.join('", "')}"] but got "${attrValue}"`);
          }
        } else {
          error(`Invalid attribute "${tagAttr.name}" found in tag "${tag}"`);
        }
      });
      return tag;
    } else {
      error(`Invalid tag "${tag}" found`);
    }
  }
  function convertAttr(attr) {
    const ret = {};
    for (const { name, value, loc } of attr) {
      if (ret[name]) {
        error(`Duplicate attribute "${name}"`, loc);
      }
      ret[name] = value;
    }
    return ret;
  }
  peg$result = peg$startRuleFunction();
  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }
    throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
  }
};
peg$subclass(peg$SyntaxError, Error);
peg$SyntaxError.prototype.format = function(sources) {
  var str = "Error: " + this.message;
  if (this.location) {
    var src = null;
    var k;
    for (k = 0;k < sources.length; k++) {
      if (sources[k].source === this.location.source) {
        src = sources[k].text.split(/\r\n|\n|\r/g);
        break;
      }
    }
    var s = this.location.start;
    var offset_s = this.location.source && typeof this.location.source.offset === "function" ? this.location.source.offset(s) : s;
    var loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
    if (src) {
      var e = this.location.end;
      var filler = peg$padEnd("", offset_s.line.toString().length, " ");
      var line = src[s.line - 1];
      var last = s.line === e.line ? e.column : line.length + 1;
      var hatLen = last - s.column || 1;
      str += "\n --> " + loc + "\n" + filler + " |\n" + offset_s.line + " | " + line + "\n" + filler + " | " + peg$padEnd("", s.column - 1, " ") + peg$padEnd("", hatLen, "^");
    } else {
      str += "\n at " + loc;
    }
  }
  return str;
};
peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function(expectation) {
      return '"' + literalEscape(expectation.text) + '"';
    },
    class: function(expectation) {
      var escapedParts = expectation.parts.map(function(part) {
        return Array.isArray(part) ? classEscape(part[0]) + "-" + classEscape(part[1]) : classEscape(part);
      });
      return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]";
    },
    any: function() {
      return "any character";
    },
    end: function() {
      return "end of input";
    },
    other: function(expectation) {
      return expectation.description;
    }
  };
  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }
  function literalEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function classEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }
  function describeExpected(expected2) {
    var descriptions = expected2.map(describeExpectation);
    var i, j;
    descriptions.sort();
    if (descriptions.length > 0) {
      for (i = 1, j = 1;i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }
    switch (descriptions.length) {
      case 1:
        return descriptions[0];
      case 2:
        return descriptions[0] + " or " + descriptions[1];
      default:
        return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
    }
  }
  function describeFound(found2) {
    return found2 ? '"' + literalEscape(found2) + '"' : "end of input";
  }
  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

// src/utilities/convert-markdown-to-ansie.ts
function convertMarkdownToAnsie(input) {
  const regex = /\*\*(.*?)\*\*|\*(.*?)\*|\[c=(.*?)\](.*?)\[\/c\]/g;
  const translated = input.replace(regex, (match, boldText, italicText, color, colorText) => {
    if (boldText !== undefined) {
      return `<span bold>${boldText}</span>`;
    } else if (italicText !== undefined) {
      return `<span italics>${italicText}</span>`;
    } else if (color !== undefined) {
      return `<span fg="${color}">${colorText}</span>`;
    }
    return match;
  });
  return translated.split("\n").map((line) => line.trim()).filter((line) => line.length > 0).map((line) => {
    if (line.trim().startsWith("###")) {
      return line.replace(/^\s*###\s(.*?)$/, "<h3>$1</h3>");
    } else if (line.trim().startsWith("##")) {
      return line.replace(/^\s*##\s(.*?)$/, "<h2>$1</h2>");
    } else if (line.trim().startsWith("#")) {
      return line.replace(/^#\s(.*?)$/, "<h1>$1</h1>");
    }
    return line;
  }).join("\n");
}

// src/parser/index.ts
function parseAnsieMarkdown(input) {
  if (!input) {
    return null;
  }
  return parseAnsieMarkup(convertMarkdownToAnsie(input));
}
function parseAnsieMarkup(input) {
  if (!input) {
    return null;
  }
  return peg$parse(input);
}

// src/utilities/num.ts
function num(n) {
  if (typeof n === "number") {
    return n;
  }
  if (typeof n === "string") {
    return Number(n);
  }
  if (typeof n === "boolean") {
    return n ? 1 : 0;
  }
  return 0;
}

// src/utilities/get-spacing-from-properties.ts
function getSpacingFromProperties(node, style) {
  const left = num(node.marginLeft ?? node.margin ?? style?.spacing?.marginLeft ?? 0);
  const right = num(node.marginRight ?? node.margin ?? style?.spacing?.marginRight ?? 0);
  const top = num(node.marginTop ?? node.margin ?? style?.spacing?.marginTop ?? 0);
  const bottom = num(node.marginBottom ?? node.margin ?? style?.spacing?.marginBottom ?? 0);
  const vpre = top ? "\n".repeat(top) : "";
  const vpost = bottom ? "\n".repeat(bottom) : "";
  const hpre = left ? " ".repeat(left) : "";
  const hpost = right ? " ".repeat(right) : "";
  return {
    on: `${vpre}${hpre}`,
    off: `${hpost}${vpost}`
  };
}

// src/utilities/render-space-attributes.ts
function renderSpaceAttributesStart({
  node,
  format,
  style
}) {
  if (format === "ansi") {
    return getSpacingFromProperties(node, style).on;
  } else if (format === "markup") {
    return Object.entries(node).filter(([key]) => Object.keys(SpaceAttributes).includes(key)).map(([key, value]) => `${key}="${value}"`).join(" ");
  } else {
    return "";
  }
}
function renderSpaceAttributesEnd({
  style,
  attributes,
  format
}) {
  if (format === "ansi") {
    return getSpacingFromProperties(attributes, style).off;
  } else if (format === "markup") {
    return "";
  } else {
    return "";
  }
}

// src/utilities/escape-code-from-name.ts
function escapeCodeFromName(names) {
  if (names.length === 0) {
    return "";
  }
  const codeString = names.join(";");
  return `\x1B[${codeString}m`;
}
var TerminalStyle;
(function(TerminalStyle2) {
  TerminalStyle2[TerminalStyle2["reset"] = 0] = "reset";
  TerminalStyle2[TerminalStyle2["bold"] = 1] = "bold";
  TerminalStyle2[TerminalStyle2["boldOff"] = 22] = "boldOff";
  TerminalStyle2[TerminalStyle2["italic"] = 3] = "italic";
  TerminalStyle2[TerminalStyle2["italicOff"] = 23] = "italicOff";
  TerminalStyle2[TerminalStyle2["underline"] = 4] = "underline";
  TerminalStyle2[TerminalStyle2["doubleunderline"] = 21] = "doubleunderline";
  TerminalStyle2[TerminalStyle2["underlineOff"] = 24] = "underlineOff";
  TerminalStyle2[TerminalStyle2["inverse"] = 7] = "inverse";
  TerminalStyle2[TerminalStyle2["inverseOff"] = 27] = "inverseOff";
  TerminalStyle2[TerminalStyle2["hidden"] = 8] = "hidden";
  TerminalStyle2[TerminalStyle2["hiddenOff"] = 28] = "hiddenOff";
  TerminalStyle2[TerminalStyle2["strikethrough"] = 9] = "strikethrough";
  TerminalStyle2[TerminalStyle2["strikethroughOff"] = 29] = "strikethroughOff";
  TerminalStyle2[TerminalStyle2["fgBlack"] = 30] = "fgBlack";
  TerminalStyle2[TerminalStyle2["fgRed"] = 31] = "fgRed";
  TerminalStyle2[TerminalStyle2["fgGreen"] = 32] = "fgGreen";
  TerminalStyle2[TerminalStyle2["fgYellow"] = 33] = "fgYellow";
  TerminalStyle2[TerminalStyle2["fgBlue"] = 34] = "fgBlue";
  TerminalStyle2[TerminalStyle2["fgMagenta"] = 35] = "fgMagenta";
  TerminalStyle2[TerminalStyle2["fgCyan"] = 36] = "fgCyan";
  TerminalStyle2[TerminalStyle2["fgWhite"] = 37] = "fgWhite";
  TerminalStyle2[TerminalStyle2["fgBrightred"] = 91] = "fgBrightred";
  TerminalStyle2[TerminalStyle2["fgBrightgreen"] = 92] = "fgBrightgreen";
  TerminalStyle2[TerminalStyle2["fgBrightyellow"] = 93] = "fgBrightyellow";
  TerminalStyle2[TerminalStyle2["fgBrightblue"] = 94] = "fgBrightblue";
  TerminalStyle2[TerminalStyle2["fgBrightmagenta"] = 95] = "fgBrightmagenta";
  TerminalStyle2[TerminalStyle2["fgBrightcyan"] = 96] = "fgBrightcyan";
  TerminalStyle2[TerminalStyle2["fgBrightwhite"] = 97] = "fgBrightwhite";
  TerminalStyle2[TerminalStyle2["fgGray"] = 90] = "fgGray";
  TerminalStyle2[TerminalStyle2["fgDefault"] = 39] = "fgDefault";
  TerminalStyle2[TerminalStyle2["bgBlack"] = 40] = "bgBlack";
  TerminalStyle2[TerminalStyle2["bgRed"] = 41] = "bgRed";
  TerminalStyle2[TerminalStyle2["bgGreen"] = 42] = "bgGreen";
  TerminalStyle2[TerminalStyle2["bgYellow"] = 43] = "bgYellow";
  TerminalStyle2[TerminalStyle2["bgBlue"] = 44] = "bgBlue";
  TerminalStyle2[TerminalStyle2["bgMagenta"] = 45] = "bgMagenta";
  TerminalStyle2[TerminalStyle2["bgCyan"] = 46] = "bgCyan";
  TerminalStyle2[TerminalStyle2["bgWhite"] = 47] = "bgWhite";
  TerminalStyle2[TerminalStyle2["bgBrightred"] = 101] = "bgBrightred";
  TerminalStyle2[TerminalStyle2["bgBrightgreen"] = 102] = "bgBrightgreen";
  TerminalStyle2[TerminalStyle2["bgBrightyellow"] = 103] = "bgBrightyellow";
  TerminalStyle2[TerminalStyle2["bgBrightblue"] = 104] = "bgBrightblue";
  TerminalStyle2[TerminalStyle2["bgBrightmagenta"] = 105] = "bgBrightmagenta";
  TerminalStyle2[TerminalStyle2["bgBrightcyan"] = 106] = "bgBrightcyan";
  TerminalStyle2[TerminalStyle2["bgBrightwhite"] = 107] = "bgBrightwhite";
  TerminalStyle2[TerminalStyle2["bgGray"] = 100] = "bgGray";
  TerminalStyle2[TerminalStyle2["bgDefault"] = 49] = "bgDefault";
  TerminalStyle2[TerminalStyle2["framed"] = 51] = "framed";
  TerminalStyle2[TerminalStyle2["encircled"] = 52] = "encircled";
  TerminalStyle2[TerminalStyle2["overline"] = 53] = "overline";
})(TerminalStyle || (TerminalStyle = {}));

// src/utilities/to-title-case.ts
function toTitleCase(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : "";
}

// src/utilities/get-text-escape-codes-from-properties.ts
function getTextEscapeCodesFromProperties(properties, style) {
  const on = [];
  const off = [];
  const fg = properties.fg ?? style?.font?.color?.fg;
  const bg = properties.bg ?? style?.font?.color?.bg;
  const bold = properties.bold ?? style?.font?.bold;
  const underline = properties.underline ?? style?.font?.underline;
  const italics = properties.italics ?? style?.font?.italics;
  if (fg) {
    on.push(colorToTerminalStyle(fg, true));
    off.push(TerminalStyle.fgDefault);
  }
  if (bg) {
    on.push(colorToTerminalStyle(bg, false));
    off.push(TerminalStyle.bgDefault);
  }
  if (bold) {
    on.push(TerminalStyle.bold);
    off.push(TerminalStyle.boldOff);
  }
  if (underline) {
    if (underline === "single") {
      on.push(TerminalStyle.underline);
    } else if (underline === "double") {
      on.push(TerminalStyle.doubleunderline);
    }
    off.push(TerminalStyle.underlineOff);
  }
  if (italics) {
    on.push(TerminalStyle.italic);
    off.push(TerminalStyle.italicOff);
  }
  return {
    on: on.length > 0 ? escapeCodeFromName(on) : "",
    off: off.length > 0 ? escapeCodeFromName(off) : ""
  };
}
function colorToTerminalStyle(color, foreground) {
  if (foreground) {
    return TerminalStyle[`fg${toTitleCase(color)}`];
  } else {
    return TerminalStyle[`bg${toTitleCase(color)}`];
  }
}

// src/utilities/render-text-attributes.ts
function renderTextAttributesStart({
  style,
  attributes,
  format = "ansi"
}) {
  if (format === "ansi") {
    return getTextEscapeCodesFromProperties(attributes, style).on;
  } else if (format === "markup") {
    return Object.entries(attributes).filter(([key]) => isAttribute(key)).map(([key, value]) => `${key}="${value}"`).join(" ");
  }
}
function renderTextAttributesEnd({
  style,
  attributes,
  format = "ansi"
}) {
  if (format === "ansi") {
    return getTextEscapeCodesFromProperties(attributes, style).off;
  } else if (format === "markup") {
    return "";
  }
}

// src/utilities/render-node-as-markup.ts
function renderNodeAsMarkupStart(node) {
  const attribs = Object.entries(node).filter(([key]) => isAttribute(key)).map(([key, value]) => `${key}="${value}"`).join(" ");
  return `<${node.node}${attribs ? ` ${attribs}` : ""}>`;
}
function renderNodeAsMarkupEnd(node) {
  return `</${node.node}>`;
}

// src/compiler/node/block.ts
class BlockTextNodeImpl extends AnsieNodeImpl {
  constructor() {
    super(...arguments);
  }
  renderStart({
    stack,
    format
  }) {
    if (format === "ansi") {
      return renderSpaceAttributesStart({
        node: this._raw,
        format,
        style: this._style
      }) + renderTextAttributesStart({
        style: this._style,
        attributes: this._raw,
        format
      });
    } else if (format === "markup") {
      return renderNodeAsMarkupStart(this._raw);
    } else {
      throw new CompilerError(`Invalid format: ${format}`, this._raw, stack, false);
    }
  }
  renderEnd({
    stack,
    format = "ansi"
  }) {
    if (format === "ansi") {
      return `${renderTextAttributesEnd({ style: this._style, attributes: this._raw, format })}${renderSpaceAttributesEnd({ attributes: this._raw, format, style: this._style })}`;
    } else if (format === "markup") {
      return renderNodeAsMarkupEnd(this._raw);
    } else {
      throw new CompilerError(`Invalid format: ${format}`, this._raw, stack, false);
    }
  }
}

// src/compiler/node/break.ts
class BreakNodeImpl extends AnsieNodeImpl {
  constructor() {
    super(...arguments);
  }
  renderStart({
    stack,
    format
  }) {
    if (format === "ansi") {
      return "\n".repeat(this._style?.spacing?.marginBottom || 1);
    } else if (format === "markup") {
      return "<br/>";
    }
    throw new CompilerError(`Invalid format: ${format}`, this._raw, stack, false);
  }
  renderEnd() {
    return "";
  }
}

// src/utilities/raw-text-mutator.ts
class RawTextMutator {
  _str;
  static EmojiMap = {
    ":exclamation:": "\u2757",
    ":warning:": "\u26A0\uFE0F",
    ":no_entry:": "\u26D4",
    ":heavy_check_mark:": "\u2714\uFE0F",
    ":x:": "\u274C",
    ":bangbang:": "\u203C\uFE0F",
    ":triangular_flag_on_post:": "\uD83D\uDEA9",
    ":fire:": "\uD83D\uDD25",
    ":sos:": "\uD83C\uDD98",
    ":lock:": "\uD83D\uDD12",
    ":key:": "\uD83D\uDD11",
    ":heart:": "\u2764\uFE0F",
    ":broken_heart:": "\uD83D\uDC94",
    ":skull_and_crossbones:": "\u2620\uFE0F",
    ":grin:": "\uD83D\uDE01",
    ":joy:": "\uD83D\uDE02",
    ":heart_eyes:": "\uD83D\uDE0D",
    ":smirk:": "\uD83D\uDE0F",
    ":sunglasses:": "\uD83D\uDE0E",
    ":thumbsup:": "\uD83D\uDC4D",
    ":thumbsdown:": "\uD83D\uDC4E",
    ":clap:": "\uD83D\uDC4F",
    ":pray:": "\uD83D\uDE4F",
    ":cry:": "\uD83D\uDE22",
    ":sob:": "\uD83D\uDE2D",
    ":rocket:": "\uD83D\uDE80",
    ":sunny:": "\u2600\uFE0F",
    ":umbrella:": "\u2614",
    ":camera:": "\uD83D\uDCF7",
    ":book:": "\uD83D\uDCD6",
    ":moneybag:": "\uD83D\uDCB0",
    ":gift:": "\uD83C\uDF81",
    ":bell:": "\uD83D\uDD14",
    ":hammer:": "\uD83D\uDD28",
    ":thumbsup::skin-tone-2:": "\uD83D\uDC4D\uD83C\uDFFB",
    ":thumbsup::skin-tone-3:": "\uD83D\uDC4D\uD83C\uDFFC",
    ":thumbsup::skin-tone-4:": "\uD83D\uDC4D\uD83C\uDFFD",
    ":thumbsup::skin-tone-5:": "\uD83D\uDC4D\uD83C\uDFFE",
    ":thumbsup::skin-tone-6:": "\uD83D\uDC4D\uD83C\uDFFF"
  };
  constructor(str) {
    this._str = str;
  }
  get str() {
    return this.toString();
  }
  replaceEmoji() {
    const emojiMatches = this._str.match(/:[a-z_]+:/g);
    if (emojiMatches) {
      emojiMatches.forEach((match) => {
        const emoji = RawTextMutator.EmojiMap[match];
        if (emoji) {
          this._str = this._str.replace(match, emoji);
        }
      });
    }
    return this;
  }
  trimSpaces(options) {
    const whiteSpacePattern = options.allowNewLines ? "[ \\t\\v\\v]" : "\\s";
    const leftPattern = options.left ? `^${whiteSpacePattern}+` : "";
    const rightPattern = options.right ? `${whiteSpacePattern}+\$` : "";
    const pattern = new RegExp(`${leftPattern}|${rightPattern}`, "g");
    this._str = this._str.replace(pattern, options.replaceWithSingleSpace ? " " : "");
    return this;
  }
  toString() {
    return this._str;
  }
}

// src/compiler/node/raw.ts
class RawTextNodeImpl extends AnsieNodeImpl {
  constructor() {
    super(...arguments);
  }
  renderStart({ format }) {
    const text = this.attr("value") ?? "";
    if (format === "markup") {
      return text;
    } else {
      return new RawTextMutator(text).replaceEmoji().trimSpaces({
        left: true,
        right: true,
        allowNewLines: false,
        replaceWithSingleSpace: true
      }).toString();
    }
  }
  renderEnd() {
    return "";
  }
}

// src/utilities/get-list-prefix-from-properties.ts
function getListItemFromProperties(node, style) {
  const bullet = node.bullet ? node.bullet : style?.list?.bullet ?? "";
  const indent = node.indent ? " ".repeat(num(node.indent)) : " ".repeat(style?.list?.indent ?? 0);
  return {
    on: `${bullet}${indent}`,
    off: ""
  };
}

// src/utilities/render-list-attributes.ts
function renderListAttributesStart({
  node,
  style,
  format = "ansi"
}) {
  if (format === "ansi") {
    return getListItemFromProperties(node, style).on;
  } else if (format === "markup") {
    return Object.entries(node).filter(([key]) => Object.keys(ListAttributes).includes(key)).map(([key, value]) => `${key}="${value}"`).join(" ");
  } else {
    return "";
  }
}
function renderListAttributesEnd({
  node,
  style,
  format = "ansi"
}) {
  if (format === "ansi") {
    return getListItemFromProperties(node, style).off;
  } else if (format === "markup") {
    return "";
  } else {
    return "";
  }
}

// src/compiler/node/list.ts
class ListItemNodeImpl extends AnsieNodeImpl {
  constructor() {
    super(...arguments);
  }
  renderStart({
    stack,
    format
  }) {
    if (format === "ansi") {
      return renderSpaceAttributesStart({
        node: this._raw,
        format,
        style: this._style
      }) + renderListAttributesStart({
        node: this._raw,
        format,
        style: this._style
      }) + renderTextAttributesStart({
        attributes: this._raw,
        format,
        style: this._style
      });
    } else if (format === "markup") {
      return renderNodeAsMarkupStart(this._raw);
    }
    throw new CompilerError(`Invalid format: ${format}`, this._raw, stack, false);
  }
  renderEnd({
    format = "ansi"
  }) {
    if (format === "ansi") {
      return renderTextAttributesEnd({
        style: this._style,
        attributes: this._raw,
        format
      }) + renderListAttributesEnd({
        node: this._raw,
        format,
        style: this._style
      }) + renderSpaceAttributesEnd({
        attributes: this._raw,
        format,
        style: this._style
      });
    } else if (format === "markup") {
      return renderNodeAsMarkupEnd(this._raw);
    } else {
      return "";
    }
  }
}

// src/compiler/node/inline.ts
class InlineTextNodeImpl extends AnsieNodeImpl {
  constructor() {
    super(...arguments);
  }
  renderStart({
    stack,
    format
  }) {
    if (format === "ansi") {
      return renderSpaceAttributesStart({
        node: this._raw,
        format,
        style: this._style
      }) + renderTextAttributesStart({
        style: this._style,
        attributes: this._raw,
        format
      });
    } else if (format === "markup") {
      return renderNodeAsMarkupStart(this._raw);
    } else {
      throw new CompilerError(`Invalid format: ${format}`, this._raw, stack, false);
    }
  }
  renderEnd({
    stack,
    format = "ansi"
  }) {
    if (format === "ansi") {
      return `${renderTextAttributesEnd({ style: this._style, attributes: this._raw, format })}${renderSpaceAttributesEnd({ attributes: this._raw, format, style: this._style })}`;
    } else if (format === "markup") {
      return renderNodeAsMarkupEnd(this._raw);
    } else {
      throw new CompilerError(`Invalid format: ${format}`, this._raw, stack, false);
    }
  }
}

// src/compiler/Compiler.ts
class Compiler {
  _ast;
  _stack = [];
  _theme;
  constructor(ast, theme) {
    this._ast = ast;
    this._theme = theme;
  }
  compile({
    format,
    theme
  }) {
    return this._ast.reduce((finalString, node) => {
      finalString += this._compileNode({ node, format, theme });
      return finalString;
    }, "");
  }
  makeNodeImplementation(raw2) {
    switch (raw2.node) {
      case ValidTags.body:
        return new BlockTextNodeImpl(raw2, this._theme.body);
      case ValidTags.h1:
        return new BlockTextNodeImpl(raw2, this._theme.h1);
      case ValidTags.h2:
        return new BlockTextNodeImpl(raw2, this._theme.h2);
      case ValidTags.h3:
        return new BlockTextNodeImpl(raw2, this._theme.h3);
      case ValidTags.div:
        return new BlockTextNodeImpl(raw2, this._theme.div);
      case ValidTags.p:
        return new BlockTextNodeImpl(raw2, this._theme.p);
      case ValidTags.text:
        return new RawTextNodeImpl(raw2, this._theme.text);
      case ValidTags.br:
        return new BreakNodeImpl(raw2, this._theme.br);
      case ValidTags.span:
        return new InlineTextNodeImpl(raw2, this._theme.span);
      case ValidTags.li:
        return new ListItemNodeImpl(raw2, this._theme.li);
      default:
        throw new CompilerError(`Invalid node type: ${raw2.node}`, raw2, this._stack, true);
    }
  }
  _push({
    state,
    format = "ansi"
  }) {
    const node = this.makeNodeImplementation(state);
    this._stack.push(node);
    return node.renderStart({ stack: this._stack, format });
  }
  _pop({
    format = "ansi"
  } = {}) {
    const old = this._stack.pop();
    return old?.renderEnd({ stack: this._stack, format });
  }
  _compileNode({
    node,
    theme,
    format = "ansi"
  }) {
    const strings = [];
    try {
      strings.push(this._push({ state: node, format }));
      if (node.content) {
        if (Array.isArray(node.content)) {
          node.content.forEach((node2) => strings.push(this._compileNode({ node: node2, theme, format })));
        } else {
          strings.push(this._compileNode({
            node: node.content,
            theme,
            format
          }));
        }
      }
      const n = this._pop({ format });
      if (n) {
        strings.push(n);
      }
      return strings.join("");
    } catch (e) {
      if (e instanceof CompilerError) {
        console.error(e.toString());
        if (!e.continue) {
          throw e;
        }
      }
    }
    return "";
  }
}

// src/themes/themes.ts
function setGlobalTheme(theme) {
  _globalTheme = theme;
}
function getGlobalTheme() {
  return _globalTheme;
}
var cleanStyle = {
  font: {
    color: {
      fg: "default",
      bg: "default"
    },
    bold: false,
    underline: "none",
    italics: false
  },
  list: {
    bullet: "* ",
    indent: 1
  },
  spacing: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0
  }
};
var body = {
  font: {
    color: {
      fg: "default",
      bg: "default"
    },
    bold: false,
    underline: "none",
    italics: false
  },
  spacing: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0
  }
};
var text = body;
var br = {
  spacing: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0
  }
};
var h1 = {
  font: {
    color: {
      fg: "blue"
    },
    bold: true,
    underline: "double",
    italics: false
  },
  spacing: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 1,
    marginBottom: 0
  }
};
var h2 = {
  font: {
    color: {
      fg: "default"
    },
    bold: true,
    underline: "single",
    italics: false
  },
  spacing: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 1,
    marginBottom: 0
  }
};
var h3 = {
  font: {
    color: {
      fg: "gray"
    },
    bold: true,
    underline: "none",
    italics: false
  },
  spacing: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 1,
    marginBottom: 0
  }
};
var p = {
  spacing: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 1,
    marginBottom: 0
  }
};
var span = {};
var li = {
  list: {
    bullet: "* ",
    indent: 1
  },
  spacing: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 1,
    marginBottom: 0
  }
};
var div = {
  spacing: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 1,
    marginBottom: 0
  }
};
var defaultTheme = {
  h1: { ...cleanStyle, ...h1 },
  h2: { ...cleanStyle, ...h2 },
  h3: { ...cleanStyle, ...h3 },
  body: { ...cleanStyle, ...body },
  p: { ...cleanStyle, ...p },
  li: { ...cleanStyle, ...li },
  span: { ...cleanStyle, ...span },
  div: { ...cleanStyle, ...div },
  br: { ...cleanStyle, ...br },
  text: { ...cleanStyle, ...text }
};
var _globalTheme = defaultTheme;
setGlobalTheme(defaultTheme);

// src/compiler/compile.ts
function compile(optionsOrMarkup) {
  let theme = getGlobalTheme();
  let markup = "";
  let output = "ansi";
  let inputIncludesMarkdown = true;
  if (typeof optionsOrMarkup === "string") {
    markup = optionsOrMarkup;
  } else {
    markup = optionsOrMarkup.markup;
    theme = optionsOrMarkup.theme ?? theme;
    output = optionsOrMarkup.output ?? "ansi";
    inputIncludesMarkdown = optionsOrMarkup.inputIncludesMarkdown ?? true;
  }
  const ast = inputIncludesMarkdown ? parseAnsieMarkdown(markup) : parseAnsieMarkup(markup);
  if (ast) {
    const compiler = new Compiler(ast, theme || defaultTheme);
    return compiler.compile({ format: output, theme });
  } else {
    return "";
  }
}

// src/template/index.ts
function tpl(strings, ...keys) {
  const final = strings.reduce((result, string, i) => {
    const value = keys[i] || "";
    if (typeof value === "number") {
      return result + string + value;
    }
    return result + string + value;
  }, "");
  return compile({ markup: final });
}

// src/console/console.ts
import util from "util";
var ansieConsole = {
  log: (message, ...optionalParams) => {
    const logWithMarkup = util.format(message, ...optionalParams);
    console.log(compile(logWithMarkup));
  },
  error: (message, ...optionalParams) => {
    const logWithMarkup = util.format(message, ...optionalParams);
    console.error(compile(logWithMarkup));
  },
  info: (message, ...optionalParams) => {
    const logWithMarkup = util.format(message, ...optionalParams);
    console.info(compile(logWithMarkup));
  },
  warn: (message, ...optionalParams) => {
    const logWithMarkup = util.format(message, ...optionalParams);
    console.warn(compile(logWithMarkup));
  }
};

// src/index.ts
var src_default = {
  compile,
  tpl,
  console: ansieConsole,
  setGlobalTheme,
  getGlobalTheme
};
export {
  src_default as default
};

//# debugId=0BD080CB58BE9F8864756e2164756e21
