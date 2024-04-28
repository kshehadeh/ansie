#!/usr/bin/env node
import {createRequire} from "node:module";
var __require = createRequire(import.meta.url);

// node_modules/yargs/lib/platform-shims/esm.mjs
import {notStrictEqual, strictEqual} from "assert";

// node_modules/cliui/build/lib/index.js
var addBorder = function(col, ts, style) {
  if (col.border) {
    if (/[.']-+[.']/.test(ts)) {
      return "";
    }
    if (ts.trim().length !== 0) {
      return style;
    }
    return "  ";
  }
  return "";
};
var _minWidth = function(col) {
  const padding = col.padding || [];
  const minWidth = 1 + (padding[left] || 0) + (padding[right] || 0);
  if (col.border) {
    return minWidth + 4;
  }
  return minWidth;
};
var getWindowWidth = function() {
  if (typeof process === "object" && process.stdout && process.stdout.columns) {
    return process.stdout.columns;
  }
  return 80;
};
var alignRight = function(str, width) {
  str = str.trim();
  const strWidth = mixin.stringWidth(str);
  if (strWidth < width) {
    return " ".repeat(width - strWidth) + str;
  }
  return str;
};
var alignCenter = function(str, width) {
  str = str.trim();
  const strWidth = mixin.stringWidth(str);
  if (strWidth >= width) {
    return str;
  }
  return " ".repeat(width - strWidth >> 1) + str;
};
function cliui(opts, _mixin) {
  mixin = _mixin;
  return new UI({
    width: (opts === null || opts === undefined ? undefined : opts.width) || getWindowWidth(),
    wrap: opts === null || opts === undefined ? undefined : opts.wrap
  });
}
var align = {
  right: alignRight,
  center: alignCenter
};
var top = 0;
var right = 1;
var bottom = 2;
var left = 3;

class UI {
  constructor(opts) {
    var _a;
    this.width = opts.width;
    this.wrap = (_a = opts.wrap) !== null && _a !== undefined ? _a : true;
    this.rows = [];
  }
  span(...args) {
    const cols = this.div(...args);
    cols.span = true;
  }
  resetOutput() {
    this.rows = [];
  }
  div(...args) {
    if (args.length === 0) {
      this.div("");
    }
    if (this.wrap && this.shouldApplyLayoutDSL(...args) && typeof args[0] === "string") {
      return this.applyLayoutDSL(args[0]);
    }
    const cols = args.map((arg) => {
      if (typeof arg === "string") {
        return this.colFromString(arg);
      }
      return arg;
    });
    this.rows.push(cols);
    return cols;
  }
  shouldApplyLayoutDSL(...args) {
    return args.length === 1 && typeof args[0] === "string" && /[\t\n]/.test(args[0]);
  }
  applyLayoutDSL(str) {
    const rows = str.split("\n").map((row) => row.split("\t"));
    let leftColumnWidth = 0;
    rows.forEach((columns) => {
      if (columns.length > 1 && mixin.stringWidth(columns[0]) > leftColumnWidth) {
        leftColumnWidth = Math.min(Math.floor(this.width * 0.5), mixin.stringWidth(columns[0]));
      }
    });
    rows.forEach((columns) => {
      this.div(...columns.map((r, i) => {
        return {
          text: r.trim(),
          padding: this.measurePadding(r),
          width: i === 0 && columns.length > 1 ? leftColumnWidth : undefined
        };
      }));
    });
    return this.rows[this.rows.length - 1];
  }
  colFromString(text) {
    return {
      text,
      padding: this.measurePadding(text)
    };
  }
  measurePadding(str) {
    const noAnsi = mixin.stripAnsi(str);
    return [0, noAnsi.match(/\s*$/)[0].length, 0, noAnsi.match(/^\s*/)[0].length];
  }
  toString() {
    const lines = [];
    this.rows.forEach((row) => {
      this.rowToString(row, lines);
    });
    return lines.filter((line) => !line.hidden).map((line) => line.text).join("\n");
  }
  rowToString(row, lines) {
    this.rasterize(row).forEach((rrow, r) => {
      let str = "";
      rrow.forEach((col, c) => {
        const { width } = row[c];
        const wrapWidth = this.negatePadding(row[c]);
        let ts = col;
        if (wrapWidth > mixin.stringWidth(col)) {
          ts += " ".repeat(wrapWidth - mixin.stringWidth(col));
        }
        if (row[c].align && row[c].align !== "left" && this.wrap) {
          const fn = align[row[c].align];
          ts = fn(ts, wrapWidth);
          if (mixin.stringWidth(ts) < wrapWidth) {
            ts += " ".repeat((width || 0) - mixin.stringWidth(ts) - 1);
          }
        }
        const padding = row[c].padding || [0, 0, 0, 0];
        if (padding[left]) {
          str += " ".repeat(padding[left]);
        }
        str += addBorder(row[c], ts, "| ");
        str += ts;
        str += addBorder(row[c], ts, " |");
        if (padding[right]) {
          str += " ".repeat(padding[right]);
        }
        if (r === 0 && lines.length > 0) {
          str = this.renderInline(str, lines[lines.length - 1]);
        }
      });
      lines.push({
        text: str.replace(/ +$/, ""),
        span: row.span
      });
    });
    return lines;
  }
  renderInline(source, previousLine) {
    const match = source.match(/^ */);
    const leadingWhitespace = match ? match[0].length : 0;
    const target = previousLine.text;
    const targetTextWidth = mixin.stringWidth(target.trimRight());
    if (!previousLine.span) {
      return source;
    }
    if (!this.wrap) {
      previousLine.hidden = true;
      return target + source;
    }
    if (leadingWhitespace < targetTextWidth) {
      return source;
    }
    previousLine.hidden = true;
    return target.trimRight() + " ".repeat(leadingWhitespace - targetTextWidth) + source.trimLeft();
  }
  rasterize(row) {
    const rrows = [];
    const widths = this.columnWidths(row);
    let wrapped;
    row.forEach((col, c) => {
      col.width = widths[c];
      if (this.wrap) {
        wrapped = mixin.wrap(col.text, this.negatePadding(col), { hard: true }).split("\n");
      } else {
        wrapped = col.text.split("\n");
      }
      if (col.border) {
        wrapped.unshift("." + "-".repeat(this.negatePadding(col) + 2) + ".");
        wrapped.push("'" + "-".repeat(this.negatePadding(col) + 2) + "'");
      }
      if (col.padding) {
        wrapped.unshift(...new Array(col.padding[top] || 0).fill(""));
        wrapped.push(...new Array(col.padding[bottom] || 0).fill(""));
      }
      wrapped.forEach((str, r) => {
        if (!rrows[r]) {
          rrows.push([]);
        }
        const rrow = rrows[r];
        for (let i = 0;i < c; i++) {
          if (rrow[i] === undefined) {
            rrow.push("");
          }
        }
        rrow.push(str);
      });
    });
    return rrows;
  }
  negatePadding(col) {
    let wrapWidth = col.width || 0;
    if (col.padding) {
      wrapWidth -= (col.padding[left] || 0) + (col.padding[right] || 0);
    }
    if (col.border) {
      wrapWidth -= 4;
    }
    return wrapWidth;
  }
  columnWidths(row) {
    if (!this.wrap) {
      return row.map((col) => {
        return col.width || mixin.stringWidth(col.text);
      });
    }
    let unset = row.length;
    let remainingWidth = this.width;
    const widths = row.map((col) => {
      if (col.width) {
        unset--;
        remainingWidth -= col.width;
        return col.width;
      }
      return;
    });
    const unsetWidth = unset ? Math.floor(remainingWidth / unset) : 0;
    return widths.map((w, i) => {
      if (w === undefined) {
        return Math.max(unsetWidth, _minWidth(row[i]));
      }
      return w;
    });
  }
}
var mixin;

// node_modules/cliui/build/lib/string-utils.js
function stripAnsi(str) {
  return str.replace(ansi, "");
}
function wrap(str, width) {
  const [start, end] = str.match(ansi) || ["", ""];
  str = stripAnsi(str);
  let wrapped = "";
  for (let i = 0;i < str.length; i++) {
    if (i !== 0 && i % width === 0) {
      wrapped += "\n";
    }
    wrapped += str.charAt(i);
  }
  if (start && end) {
    wrapped = `${start}${wrapped}${end}`;
  }
  return wrapped;
}
var ansi = new RegExp("\x1B(?:\\[(?:\\d+[ABCDEFGJKSTm]|\\d+;\\d+[Hfm]|" + "\\d+;\\d+;\\d+m|6n|s|u|\\?25[lh])|\\w)", "g");

// node_modules/cliui/index.mjs
function ui(opts) {
  return cliui(opts, {
    stringWidth: (str) => {
      return [...str].length;
    },
    stripAnsi,
    wrap
  });
}

// node_modules/escalade/sync/index.mjs
import {dirname, resolve} from "path";
import {readdirSync, statSync} from "fs";
function sync_default(start, callback) {
  let dir = resolve(".", start);
  let tmp, stats = statSync(dir);
  if (!stats.isDirectory()) {
    dir = dirname(dir);
  }
  while (true) {
    tmp = callback(dir, readdirSync(dir));
    if (tmp)
      return resolve(dir, tmp);
    dir = dirname(tmp = dir);
    if (tmp === dir)
      break;
  }
}

// node_modules/yargs/lib/platform-shims/esm.mjs
import {inspect} from "util";
import {readFileSync as readFileSync3} from "fs";
import {fileURLToPath} from "url";

// node_modules/yargs-parser/build/lib/index.js
import {format} from "util";
import {normalize, resolve as resolve2} from "path";

// node_modules/yargs-parser/build/lib/string-utils.js
function camelCase(str) {
  const isCamelCase = str !== str.toLowerCase() && str !== str.toUpperCase();
  if (!isCamelCase) {
    str = str.toLowerCase();
  }
  if (str.indexOf("-") === -1 && str.indexOf("_") === -1) {
    return str;
  } else {
    let camelcase = "";
    let nextChrUpper = false;
    const leadingHyphens = str.match(/^-+/);
    for (let i = leadingHyphens ? leadingHyphens[0].length : 0;i < str.length; i++) {
      let chr = str.charAt(i);
      if (nextChrUpper) {
        nextChrUpper = false;
        chr = chr.toUpperCase();
      }
      if (i !== 0 && (chr === "-" || chr === "_")) {
        nextChrUpper = true;
      } else if (chr !== "-" && chr !== "_") {
        camelcase += chr;
      }
    }
    return camelcase;
  }
}
function decamelize(str, joinString) {
  const lowercase = str.toLowerCase();
  joinString = joinString || "-";
  let notCamelcase = "";
  for (let i = 0;i < str.length; i++) {
    const chrLower = lowercase.charAt(i);
    const chrString = str.charAt(i);
    if (chrLower !== chrString && i > 0) {
      notCamelcase += `${joinString}${lowercase.charAt(i)}`;
    } else {
      notCamelcase += chrString;
    }
  }
  return notCamelcase;
}
function looksLikeNumber(x) {
  if (x === null || x === undefined)
    return false;
  if (typeof x === "number")
    return true;
  if (/^0x[0-9a-f]+$/i.test(x))
    return true;
  if (/^0[^.]/.test(x))
    return false;
  return /^[-]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}

// node_modules/yargs-parser/build/lib/tokenize-arg-string.js
function tokenizeArgString(argString) {
  if (Array.isArray(argString)) {
    return argString.map((e) => typeof e !== "string" ? e + "" : e);
  }
  argString = argString.trim();
  let i = 0;
  let prevC = null;
  let c = null;
  let opening = null;
  const args = [];
  for (let ii = 0;ii < argString.length; ii++) {
    prevC = c;
    c = argString.charAt(ii);
    if (c === " " && !opening) {
      if (!(prevC === " ")) {
        i++;
      }
      continue;
    }
    if (c === opening) {
      opening = null;
    } else if ((c === "'" || c === '"') && !opening) {
      opening = c;
    }
    if (!args[i])
      args[i] = "";
    args[i] += c;
  }
  return args;
}

// node_modules/yargs-parser/build/lib/yargs-parser-types.js
var DefaultValuesForTypeKey;
(function(DefaultValuesForTypeKey2) {
  DefaultValuesForTypeKey2["BOOLEAN"] = "boolean";
  DefaultValuesForTypeKey2["STRING"] = "string";
  DefaultValuesForTypeKey2["NUMBER"] = "number";
  DefaultValuesForTypeKey2["ARRAY"] = "array";
})(DefaultValuesForTypeKey || (DefaultValuesForTypeKey = {}));

// node_modules/yargs-parser/build/lib/yargs-parser.js
var combineAliases = function(aliases) {
  const aliasArrays = [];
  const combined = Object.create(null);
  let change = true;
  Object.keys(aliases).forEach(function(key) {
    aliasArrays.push([].concat(aliases[key], key));
  });
  while (change) {
    change = false;
    for (let i = 0;i < aliasArrays.length; i++) {
      for (let ii = i + 1;ii < aliasArrays.length; ii++) {
        const intersect = aliasArrays[i].filter(function(v) {
          return aliasArrays[ii].indexOf(v) !== -1;
        });
        if (intersect.length) {
          aliasArrays[i] = aliasArrays[i].concat(aliasArrays[ii]);
          aliasArrays.splice(ii, 1);
          change = true;
          break;
        }
      }
    }
  }
  aliasArrays.forEach(function(aliasArray) {
    aliasArray = aliasArray.filter(function(v, i, self) {
      return self.indexOf(v) === i;
    });
    const lastAlias = aliasArray.pop();
    if (lastAlias !== undefined && typeof lastAlias === "string") {
      combined[lastAlias] = aliasArray;
    }
  });
  return combined;
};
var increment = function(orig) {
  return orig !== undefined ? orig + 1 : 1;
};
var sanitizeKey = function(key) {
  if (key === "__proto__")
    return "___proto___";
  return key;
};
var stripQuotes = function(val) {
  return typeof val === "string" && (val[0] === "'" || val[0] === '"') && val[val.length - 1] === val[0] ? val.substring(1, val.length - 1) : val;
};
var mixin2;

class YargsParser {
  constructor(_mixin) {
    mixin2 = _mixin;
  }
  parse(argsInput, options) {
    const opts = Object.assign({
      alias: undefined,
      array: undefined,
      boolean: undefined,
      config: undefined,
      configObjects: undefined,
      configuration: undefined,
      coerce: undefined,
      count: undefined,
      default: undefined,
      envPrefix: undefined,
      narg: undefined,
      normalize: undefined,
      string: undefined,
      number: undefined,
      __: undefined,
      key: undefined
    }, options);
    const args = tokenizeArgString(argsInput);
    const inputIsString = typeof argsInput === "string";
    const aliases = combineAliases(Object.assign(Object.create(null), opts.alias));
    const configuration = Object.assign({
      "boolean-negation": true,
      "camel-case-expansion": true,
      "combine-arrays": false,
      "dot-notation": true,
      "duplicate-arguments-array": true,
      "flatten-duplicate-arrays": true,
      "greedy-arrays": true,
      "halt-at-non-option": false,
      "nargs-eats-options": false,
      "negation-prefix": "no-",
      "parse-numbers": true,
      "parse-positional-numbers": true,
      "populate--": false,
      "set-placeholder-key": false,
      "short-option-groups": true,
      "strip-aliased": false,
      "strip-dashed": false,
      "unknown-options-as-args": false
    }, opts.configuration);
    const defaults = Object.assign(Object.create(null), opts.default);
    const configObjects = opts.configObjects || [];
    const envPrefix = opts.envPrefix;
    const notFlagsOption = configuration["populate--"];
    const notFlagsArgv = notFlagsOption ? "--" : "_";
    const newAliases = Object.create(null);
    const defaulted = Object.create(null);
    const __ = opts.__ || mixin2.format;
    const flags = {
      aliases: Object.create(null),
      arrays: Object.create(null),
      bools: Object.create(null),
      strings: Object.create(null),
      numbers: Object.create(null),
      counts: Object.create(null),
      normalize: Object.create(null),
      configs: Object.create(null),
      nargs: Object.create(null),
      coercions: Object.create(null),
      keys: []
    };
    const negative = /^-([0-9]+(\.[0-9]+)?|\.[0-9]+)$/;
    const negatedBoolean = new RegExp("^--" + configuration["negation-prefix"] + "(.+)");
    [].concat(opts.array || []).filter(Boolean).forEach(function(opt) {
      const key = typeof opt === "object" ? opt.key : opt;
      const assignment = Object.keys(opt).map(function(key2) {
        const arrayFlagKeys = {
          boolean: "bools",
          string: "strings",
          number: "numbers"
        };
        return arrayFlagKeys[key2];
      }).filter(Boolean).pop();
      if (assignment) {
        flags[assignment][key] = true;
      }
      flags.arrays[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.boolean || []).filter(Boolean).forEach(function(key) {
      flags.bools[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.string || []).filter(Boolean).forEach(function(key) {
      flags.strings[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.number || []).filter(Boolean).forEach(function(key) {
      flags.numbers[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.count || []).filter(Boolean).forEach(function(key) {
      flags.counts[key] = true;
      flags.keys.push(key);
    });
    [].concat(opts.normalize || []).filter(Boolean).forEach(function(key) {
      flags.normalize[key] = true;
      flags.keys.push(key);
    });
    if (typeof opts.narg === "object") {
      Object.entries(opts.narg).forEach(([key, value]) => {
        if (typeof value === "number") {
          flags.nargs[key] = value;
          flags.keys.push(key);
        }
      });
    }
    if (typeof opts.coerce === "object") {
      Object.entries(opts.coerce).forEach(([key, value]) => {
        if (typeof value === "function") {
          flags.coercions[key] = value;
          flags.keys.push(key);
        }
      });
    }
    if (typeof opts.config !== "undefined") {
      if (Array.isArray(opts.config) || typeof opts.config === "string") {
        [].concat(opts.config).filter(Boolean).forEach(function(key) {
          flags.configs[key] = true;
        });
      } else if (typeof opts.config === "object") {
        Object.entries(opts.config).forEach(([key, value]) => {
          if (typeof value === "boolean" || typeof value === "function") {
            flags.configs[key] = value;
          }
        });
      }
    }
    extendAliases(opts.key, aliases, opts.default, flags.arrays);
    Object.keys(defaults).forEach(function(key) {
      (flags.aliases[key] || []).forEach(function(alias) {
        defaults[alias] = defaults[key];
      });
    });
    let error = null;
    checkConfiguration();
    let notFlags = [];
    const argv = Object.assign(Object.create(null), { _: [] });
    const argvReturn = {};
    for (let i = 0;i < args.length; i++) {
      const arg = args[i];
      const truncatedArg = arg.replace(/^-{3,}/, "---");
      let broken;
      let key;
      let letters;
      let m;
      let next;
      let value;
      if (arg !== "--" && /^-/.test(arg) && isUnknownOptionAsArg(arg)) {
        pushPositional(arg);
      } else if (truncatedArg.match(/^---+(=|$)/)) {
        pushPositional(arg);
        continue;
      } else if (arg.match(/^--.+=/) || !configuration["short-option-groups"] && arg.match(/^-.+=/)) {
        m = arg.match(/^--?([^=]+)=([\s\S]*)$/);
        if (m !== null && Array.isArray(m) && m.length >= 3) {
          if (checkAllAliases(m[1], flags.arrays)) {
            i = eatArray(i, m[1], args, m[2]);
          } else if (checkAllAliases(m[1], flags.nargs) !== false) {
            i = eatNargs(i, m[1], args, m[2]);
          } else {
            setArg(m[1], m[2], true);
          }
        }
      } else if (arg.match(negatedBoolean) && configuration["boolean-negation"]) {
        m = arg.match(negatedBoolean);
        if (m !== null && Array.isArray(m) && m.length >= 2) {
          key = m[1];
          setArg(key, checkAllAliases(key, flags.arrays) ? [false] : false);
        }
      } else if (arg.match(/^--.+/) || !configuration["short-option-groups"] && arg.match(/^-[^-]+/)) {
        m = arg.match(/^--?(.+)/);
        if (m !== null && Array.isArray(m) && m.length >= 2) {
          key = m[1];
          if (checkAllAliases(key, flags.arrays)) {
            i = eatArray(i, key, args);
          } else if (checkAllAliases(key, flags.nargs) !== false) {
            i = eatNargs(i, key, args);
          } else {
            next = args[i + 1];
            if (next !== undefined && (!next.match(/^-/) || next.match(negative)) && !checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts)) {
              setArg(key, next);
              i++;
            } else if (/^(true|false)$/.test(next)) {
              setArg(key, next);
              i++;
            } else {
              setArg(key, defaultValue(key));
            }
          }
        }
      } else if (arg.match(/^-.\..+=/)) {
        m = arg.match(/^-([^=]+)=([\s\S]*)$/);
        if (m !== null && Array.isArray(m) && m.length >= 3) {
          setArg(m[1], m[2]);
        }
      } else if (arg.match(/^-.\..+/) && !arg.match(negative)) {
        next = args[i + 1];
        m = arg.match(/^-(.\..+)/);
        if (m !== null && Array.isArray(m) && m.length >= 2) {
          key = m[1];
          if (next !== undefined && !next.match(/^-/) && !checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts)) {
            setArg(key, next);
            i++;
          } else {
            setArg(key, defaultValue(key));
          }
        }
      } else if (arg.match(/^-[^-]+/) && !arg.match(negative)) {
        letters = arg.slice(1, -1).split("");
        broken = false;
        for (let j = 0;j < letters.length; j++) {
          next = arg.slice(j + 2);
          if (letters[j + 1] && letters[j + 1] === "=") {
            value = arg.slice(j + 3);
            key = letters[j];
            if (checkAllAliases(key, flags.arrays)) {
              i = eatArray(i, key, args, value);
            } else if (checkAllAliases(key, flags.nargs) !== false) {
              i = eatNargs(i, key, args, value);
            } else {
              setArg(key, value);
            }
            broken = true;
            break;
          }
          if (next === "-") {
            setArg(letters[j], next);
            continue;
          }
          if (/[A-Za-z]/.test(letters[j]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next) && checkAllAliases(next, flags.bools) === false) {
            setArg(letters[j], next);
            broken = true;
            break;
          }
          if (letters[j + 1] && letters[j + 1].match(/\W/)) {
            setArg(letters[j], next);
            broken = true;
            break;
          } else {
            setArg(letters[j], defaultValue(letters[j]));
          }
        }
        key = arg.slice(-1)[0];
        if (!broken && key !== "-") {
          if (checkAllAliases(key, flags.arrays)) {
            i = eatArray(i, key, args);
          } else if (checkAllAliases(key, flags.nargs) !== false) {
            i = eatNargs(i, key, args);
          } else {
            next = args[i + 1];
            if (next !== undefined && (!/^(-|--)[^-]/.test(next) || next.match(negative)) && !checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts)) {
              setArg(key, next);
              i++;
            } else if (/^(true|false)$/.test(next)) {
              setArg(key, next);
              i++;
            } else {
              setArg(key, defaultValue(key));
            }
          }
        }
      } else if (arg.match(/^-[0-9]$/) && arg.match(negative) && checkAllAliases(arg.slice(1), flags.bools)) {
        key = arg.slice(1);
        setArg(key, defaultValue(key));
      } else if (arg === "--") {
        notFlags = args.slice(i + 1);
        break;
      } else if (configuration["halt-at-non-option"]) {
        notFlags = args.slice(i);
        break;
      } else {
        pushPositional(arg);
      }
    }
    applyEnvVars(argv, true);
    applyEnvVars(argv, false);
    setConfig(argv);
    setConfigObjects();
    applyDefaultsAndAliases(argv, flags.aliases, defaults, true);
    applyCoercions(argv);
    if (configuration["set-placeholder-key"])
      setPlaceholderKeys(argv);
    Object.keys(flags.counts).forEach(function(key) {
      if (!hasKey(argv, key.split(".")))
        setArg(key, 0);
    });
    if (notFlagsOption && notFlags.length)
      argv[notFlagsArgv] = [];
    notFlags.forEach(function(key) {
      argv[notFlagsArgv].push(key);
    });
    if (configuration["camel-case-expansion"] && configuration["strip-dashed"]) {
      Object.keys(argv).filter((key) => key !== "--" && key.includes("-")).forEach((key) => {
        delete argv[key];
      });
    }
    if (configuration["strip-aliased"]) {
      [].concat(...Object.keys(aliases).map((k) => aliases[k])).forEach((alias) => {
        if (configuration["camel-case-expansion"] && alias.includes("-")) {
          delete argv[alias.split(".").map((prop) => camelCase(prop)).join(".")];
        }
        delete argv[alias];
      });
    }
    function pushPositional(arg) {
      const maybeCoercedNumber = maybeCoerceNumber("_", arg);
      if (typeof maybeCoercedNumber === "string" || typeof maybeCoercedNumber === "number") {
        argv._.push(maybeCoercedNumber);
      }
    }
    function eatNargs(i, key, args2, argAfterEqualSign) {
      let ii;
      let toEat = checkAllAliases(key, flags.nargs);
      toEat = typeof toEat !== "number" || isNaN(toEat) ? 1 : toEat;
      if (toEat === 0) {
        if (!isUndefined(argAfterEqualSign)) {
          error = Error(__("Argument unexpected for: %s", key));
        }
        setArg(key, defaultValue(key));
        return i;
      }
      let available = isUndefined(argAfterEqualSign) ? 0 : 1;
      if (configuration["nargs-eats-options"]) {
        if (args2.length - (i + 1) + available < toEat) {
          error = Error(__("Not enough arguments following: %s", key));
        }
        available = toEat;
      } else {
        for (ii = i + 1;ii < args2.length; ii++) {
          if (!args2[ii].match(/^-[^0-9]/) || args2[ii].match(negative) || isUnknownOptionAsArg(args2[ii]))
            available++;
          else
            break;
        }
        if (available < toEat)
          error = Error(__("Not enough arguments following: %s", key));
      }
      let consumed = Math.min(available, toEat);
      if (!isUndefined(argAfterEqualSign) && consumed > 0) {
        setArg(key, argAfterEqualSign);
        consumed--;
      }
      for (ii = i + 1;ii < consumed + i + 1; ii++) {
        setArg(key, args2[ii]);
      }
      return i + consumed;
    }
    function eatArray(i, key, args2, argAfterEqualSign) {
      let argsToSet = [];
      let next = argAfterEqualSign || args2[i + 1];
      const nargsCount = checkAllAliases(key, flags.nargs);
      if (checkAllAliases(key, flags.bools) && !/^(true|false)$/.test(next)) {
        argsToSet.push(true);
      } else if (isUndefined(next) || isUndefined(argAfterEqualSign) && /^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next)) {
        if (defaults[key] !== undefined) {
          const defVal = defaults[key];
          argsToSet = Array.isArray(defVal) ? defVal : [defVal];
        }
      } else {
        if (!isUndefined(argAfterEqualSign)) {
          argsToSet.push(processValue(key, argAfterEqualSign, true));
        }
        for (let ii = i + 1;ii < args2.length; ii++) {
          if (!configuration["greedy-arrays"] && argsToSet.length > 0 || nargsCount && typeof nargsCount === "number" && argsToSet.length >= nargsCount)
            break;
          next = args2[ii];
          if (/^-/.test(next) && !negative.test(next) && !isUnknownOptionAsArg(next))
            break;
          i = ii;
          argsToSet.push(processValue(key, next, inputIsString));
        }
      }
      if (typeof nargsCount === "number" && (nargsCount && argsToSet.length < nargsCount || isNaN(nargsCount) && argsToSet.length === 0)) {
        error = Error(__("Not enough arguments following: %s", key));
      }
      setArg(key, argsToSet);
      return i;
    }
    function setArg(key, val, shouldStripQuotes = inputIsString) {
      if (/-/.test(key) && configuration["camel-case-expansion"]) {
        const alias = key.split(".").map(function(prop) {
          return camelCase(prop);
        }).join(".");
        addNewAlias(key, alias);
      }
      const value = processValue(key, val, shouldStripQuotes);
      const splitKey = key.split(".");
      setKey(argv, splitKey, value);
      if (flags.aliases[key]) {
        flags.aliases[key].forEach(function(x) {
          const keyProperties = x.split(".");
          setKey(argv, keyProperties, value);
        });
      }
      if (splitKey.length > 1 && configuration["dot-notation"]) {
        (flags.aliases[splitKey[0]] || []).forEach(function(x) {
          let keyProperties = x.split(".");
          const a = [].concat(splitKey);
          a.shift();
          keyProperties = keyProperties.concat(a);
          if (!(flags.aliases[key] || []).includes(keyProperties.join("."))) {
            setKey(argv, keyProperties, value);
          }
        });
      }
      if (checkAllAliases(key, flags.normalize) && !checkAllAliases(key, flags.arrays)) {
        const keys = [key].concat(flags.aliases[key] || []);
        keys.forEach(function(key2) {
          Object.defineProperty(argvReturn, key2, {
            enumerable: true,
            get() {
              return val;
            },
            set(value2) {
              val = typeof value2 === "string" ? mixin2.normalize(value2) : value2;
            }
          });
        });
      }
    }
    function addNewAlias(key, alias) {
      if (!(flags.aliases[key] && flags.aliases[key].length)) {
        flags.aliases[key] = [alias];
        newAliases[alias] = true;
      }
      if (!(flags.aliases[alias] && flags.aliases[alias].length)) {
        addNewAlias(alias, key);
      }
    }
    function processValue(key, val, shouldStripQuotes) {
      if (shouldStripQuotes) {
        val = stripQuotes(val);
      }
      if (checkAllAliases(key, flags.bools) || checkAllAliases(key, flags.counts)) {
        if (typeof val === "string")
          val = val === "true";
      }
      let value = Array.isArray(val) ? val.map(function(v) {
        return maybeCoerceNumber(key, v);
      }) : maybeCoerceNumber(key, val);
      if (checkAllAliases(key, flags.counts) && (isUndefined(value) || typeof value === "boolean")) {
        value = increment();
      }
      if (checkAllAliases(key, flags.normalize) && checkAllAliases(key, flags.arrays)) {
        if (Array.isArray(val))
          value = val.map((val2) => {
            return mixin2.normalize(val2);
          });
        else
          value = mixin2.normalize(val);
      }
      return value;
    }
    function maybeCoerceNumber(key, value) {
      if (!configuration["parse-positional-numbers"] && key === "_")
        return value;
      if (!checkAllAliases(key, flags.strings) && !checkAllAliases(key, flags.bools) && !Array.isArray(value)) {
        const shouldCoerceNumber = looksLikeNumber(value) && configuration["parse-numbers"] && Number.isSafeInteger(Math.floor(parseFloat(`${value}`)));
        if (shouldCoerceNumber || !isUndefined(value) && checkAllAliases(key, flags.numbers)) {
          value = Number(value);
        }
      }
      return value;
    }
    function setConfig(argv2) {
      const configLookup = Object.create(null);
      applyDefaultsAndAliases(configLookup, flags.aliases, defaults);
      Object.keys(flags.configs).forEach(function(configKey) {
        const configPath = argv2[configKey] || configLookup[configKey];
        if (configPath) {
          try {
            let config = null;
            const resolvedConfigPath = mixin2.resolve(mixin2.cwd(), configPath);
            const resolveConfig = flags.configs[configKey];
            if (typeof resolveConfig === "function") {
              try {
                config = resolveConfig(resolvedConfigPath);
              } catch (e) {
                config = e;
              }
              if (config instanceof Error) {
                error = config;
                return;
              }
            } else {
              config = mixin2.require(resolvedConfigPath);
            }
            setConfigObject(config);
          } catch (ex) {
            if (ex.name === "PermissionDenied")
              error = ex;
            else if (argv2[configKey])
              error = Error(__("Invalid JSON config file: %s", configPath));
          }
        }
      });
    }
    function setConfigObject(config, prev) {
      Object.keys(config).forEach(function(key) {
        const value = config[key];
        const fullKey = prev ? prev + "." + key : key;
        if (typeof value === "object" && value !== null && !Array.isArray(value) && configuration["dot-notation"]) {
          setConfigObject(value, fullKey);
        } else {
          if (!hasKey(argv, fullKey.split(".")) || checkAllAliases(fullKey, flags.arrays) && configuration["combine-arrays"]) {
            setArg(fullKey, value);
          }
        }
      });
    }
    function setConfigObjects() {
      if (typeof configObjects !== "undefined") {
        configObjects.forEach(function(configObject) {
          setConfigObject(configObject);
        });
      }
    }
    function applyEnvVars(argv2, configOnly) {
      if (typeof envPrefix === "undefined")
        return;
      const prefix = typeof envPrefix === "string" ? envPrefix : "";
      const env = mixin2.env();
      Object.keys(env).forEach(function(envVar) {
        if (prefix === "" || envVar.lastIndexOf(prefix, 0) === 0) {
          const keys = envVar.split("__").map(function(key, i) {
            if (i === 0) {
              key = key.substring(prefix.length);
            }
            return camelCase(key);
          });
          if ((configOnly && flags.configs[keys.join(".")] || !configOnly) && !hasKey(argv2, keys)) {
            setArg(keys.join("."), env[envVar]);
          }
        }
      });
    }
    function applyCoercions(argv2) {
      let coerce;
      const applied = new Set;
      Object.keys(argv2).forEach(function(key) {
        if (!applied.has(key)) {
          coerce = checkAllAliases(key, flags.coercions);
          if (typeof coerce === "function") {
            try {
              const value = maybeCoerceNumber(key, coerce(argv2[key]));
              [].concat(flags.aliases[key] || [], key).forEach((ali) => {
                applied.add(ali);
                argv2[ali] = value;
              });
            } catch (err) {
              error = err;
            }
          }
        }
      });
    }
    function setPlaceholderKeys(argv2) {
      flags.keys.forEach((key) => {
        if (~key.indexOf("."))
          return;
        if (typeof argv2[key] === "undefined")
          argv2[key] = undefined;
      });
      return argv2;
    }
    function applyDefaultsAndAliases(obj, aliases2, defaults2, canLog = false) {
      Object.keys(defaults2).forEach(function(key) {
        if (!hasKey(obj, key.split("."))) {
          setKey(obj, key.split("."), defaults2[key]);
          if (canLog)
            defaulted[key] = true;
          (aliases2[key] || []).forEach(function(x) {
            if (hasKey(obj, x.split(".")))
              return;
            setKey(obj, x.split("."), defaults2[key]);
          });
        }
      });
    }
    function hasKey(obj, keys) {
      let o = obj;
      if (!configuration["dot-notation"])
        keys = [keys.join(".")];
      keys.slice(0, -1).forEach(function(key2) {
        o = o[key2] || {};
      });
      const key = keys[keys.length - 1];
      if (typeof o !== "object")
        return false;
      else
        return key in o;
    }
    function setKey(obj, keys, value) {
      let o = obj;
      if (!configuration["dot-notation"])
        keys = [keys.join(".")];
      keys.slice(0, -1).forEach(function(key2) {
        key2 = sanitizeKey(key2);
        if (typeof o === "object" && o[key2] === undefined) {
          o[key2] = {};
        }
        if (typeof o[key2] !== "object" || Array.isArray(o[key2])) {
          if (Array.isArray(o[key2])) {
            o[key2].push({});
          } else {
            o[key2] = [o[key2], {}];
          }
          o = o[key2][o[key2].length - 1];
        } else {
          o = o[key2];
        }
      });
      const key = sanitizeKey(keys[keys.length - 1]);
      const isTypeArray = checkAllAliases(keys.join("."), flags.arrays);
      const isValueArray = Array.isArray(value);
      let duplicate = configuration["duplicate-arguments-array"];
      if (!duplicate && checkAllAliases(key, flags.nargs)) {
        duplicate = true;
        if (!isUndefined(o[key]) && flags.nargs[key] === 1 || Array.isArray(o[key]) && o[key].length === flags.nargs[key]) {
          o[key] = undefined;
        }
      }
      if (value === increment()) {
        o[key] = increment(o[key]);
      } else if (Array.isArray(o[key])) {
        if (duplicate && isTypeArray && isValueArray) {
          o[key] = configuration["flatten-duplicate-arrays"] ? o[key].concat(value) : (Array.isArray(o[key][0]) ? o[key] : [o[key]]).concat([value]);
        } else if (!duplicate && Boolean(isTypeArray) === Boolean(isValueArray)) {
          o[key] = value;
        } else {
          o[key] = o[key].concat([value]);
        }
      } else if (o[key] === undefined && isTypeArray) {
        o[key] = isValueArray ? value : [value];
      } else if (duplicate && !(o[key] === undefined || checkAllAliases(key, flags.counts) || checkAllAliases(key, flags.bools))) {
        o[key] = [o[key], value];
      } else {
        o[key] = value;
      }
    }
    function extendAliases(...args2) {
      args2.forEach(function(obj) {
        Object.keys(obj || {}).forEach(function(key) {
          if (flags.aliases[key])
            return;
          flags.aliases[key] = [].concat(aliases[key] || []);
          flags.aliases[key].concat(key).forEach(function(x) {
            if (/-/.test(x) && configuration["camel-case-expansion"]) {
              const c = camelCase(x);
              if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                flags.aliases[key].push(c);
                newAliases[c] = true;
              }
            }
          });
          flags.aliases[key].concat(key).forEach(function(x) {
            if (x.length > 1 && /[A-Z]/.test(x) && configuration["camel-case-expansion"]) {
              const c = decamelize(x, "-");
              if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                flags.aliases[key].push(c);
                newAliases[c] = true;
              }
            }
          });
          flags.aliases[key].forEach(function(x) {
            flags.aliases[x] = [key].concat(flags.aliases[key].filter(function(y) {
              return x !== y;
            }));
          });
        });
      });
    }
    function checkAllAliases(key, flag) {
      const toCheck = [].concat(flags.aliases[key] || [], key);
      const keys = Object.keys(flag);
      const setAlias = toCheck.find((key2) => keys.includes(key2));
      return setAlias ? flag[setAlias] : false;
    }
    function hasAnyFlag(key) {
      const flagsKeys = Object.keys(flags);
      const toCheck = [].concat(flagsKeys.map((k) => flags[k]));
      return toCheck.some(function(flag) {
        return Array.isArray(flag) ? flag.includes(key) : flag[key];
      });
    }
    function hasFlagsMatching(arg, ...patterns) {
      const toCheck = [].concat(...patterns);
      return toCheck.some(function(pattern) {
        const match = arg.match(pattern);
        return match && hasAnyFlag(match[1]);
      });
    }
    function hasAllShortFlags(arg) {
      if (arg.match(negative) || !arg.match(/^-[^-]+/)) {
        return false;
      }
      let hasAllFlags = true;
      let next;
      const letters = arg.slice(1).split("");
      for (let j = 0;j < letters.length; j++) {
        next = arg.slice(j + 2);
        if (!hasAnyFlag(letters[j])) {
          hasAllFlags = false;
          break;
        }
        if (letters[j + 1] && letters[j + 1] === "=" || next === "-" || /[A-Za-z]/.test(letters[j]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next) || letters[j + 1] && letters[j + 1].match(/\W/)) {
          break;
        }
      }
      return hasAllFlags;
    }
    function isUnknownOptionAsArg(arg) {
      return configuration["unknown-options-as-args"] && isUnknownOption(arg);
    }
    function isUnknownOption(arg) {
      arg = arg.replace(/^-{3,}/, "--");
      if (arg.match(negative)) {
        return false;
      }
      if (hasAllShortFlags(arg)) {
        return false;
      }
      const flagWithEquals = /^-+([^=]+?)=[\s\S]*$/;
      const normalFlag = /^-+([^=]+?)$/;
      const flagEndingInHyphen = /^-+([^=]+?)-$/;
      const flagEndingInDigits = /^-+([^=]+?\d+)$/;
      const flagEndingInNonWordCharacters = /^-+([^=]+?)\W+.*$/;
      return !hasFlagsMatching(arg, flagWithEquals, negatedBoolean, normalFlag, flagEndingInHyphen, flagEndingInDigits, flagEndingInNonWordCharacters);
    }
    function defaultValue(key) {
      if (!checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts) && `${key}` in defaults) {
        return defaults[key];
      } else {
        return defaultForType(guessType(key));
      }
    }
    function defaultForType(type) {
      const def = {
        [DefaultValuesForTypeKey.BOOLEAN]: true,
        [DefaultValuesForTypeKey.STRING]: "",
        [DefaultValuesForTypeKey.NUMBER]: undefined,
        [DefaultValuesForTypeKey.ARRAY]: []
      };
      return def[type];
    }
    function guessType(key) {
      let type = DefaultValuesForTypeKey.BOOLEAN;
      if (checkAllAliases(key, flags.strings))
        type = DefaultValuesForTypeKey.STRING;
      else if (checkAllAliases(key, flags.numbers))
        type = DefaultValuesForTypeKey.NUMBER;
      else if (checkAllAliases(key, flags.bools))
        type = DefaultValuesForTypeKey.BOOLEAN;
      else if (checkAllAliases(key, flags.arrays))
        type = DefaultValuesForTypeKey.ARRAY;
      return type;
    }
    function isUndefined(num) {
      return num === undefined;
    }
    function checkConfiguration() {
      Object.keys(flags.counts).find((key) => {
        if (checkAllAliases(key, flags.arrays)) {
          error = Error(__("Invalid configuration: %s, opts.count excludes opts.array.", key));
          return true;
        } else if (checkAllAliases(key, flags.nargs)) {
          error = Error(__("Invalid configuration: %s, opts.count excludes opts.narg.", key));
          return true;
        }
        return false;
      });
    }
    return {
      aliases: Object.assign({}, flags.aliases),
      argv: Object.assign(argvReturn, argv),
      configuration,
      defaulted: Object.assign({}, defaulted),
      error,
      newAliases: Object.assign({}, newAliases)
    };
  }
}

// node_modules/yargs-parser/build/lib/index.js
import {readFileSync} from "fs";
var _a;
var _b;
var _c;
var minNodeVersion = process && process.env && process.env.YARGS_MIN_NODE_VERSION ? Number(process.env.YARGS_MIN_NODE_VERSION) : 12;
var nodeVersion = (_b = (_a = process === null || process === undefined ? undefined : process.versions) === null || _a === undefined ? undefined : _a.node) !== null && _b !== undefined ? _b : (_c = process === null || process === undefined ? undefined : process.version) === null || _c === undefined ? undefined : _c.slice(1);
if (nodeVersion) {
  const major = Number(nodeVersion.match(/^([^.]+)/)[1]);
  if (major < minNodeVersion) {
    throw Error(`yargs parser supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`);
  }
}
var env = process ? process.env : {};
var parser = new YargsParser({
  cwd: process.cwd,
  env: () => {
    return env;
  },
  format,
  normalize,
  resolve: resolve2,
  require: (path) => {
    if (typeof __require !== "undefined") {
      return __require(path);
    } else if (path.match(/\.json$/)) {
      return JSON.parse(readFileSync(path, "utf8"));
    } else {
      throw Error("only .json config files are supported in ESM");
    }
  }
});
var yargsParser = function Parser(args, opts) {
  const result = parser.parse(args.slice(), opts);
  return result.argv;
};
yargsParser.detailed = function(args, opts) {
  return parser.parse(args.slice(), opts);
};
yargsParser.camelCase = camelCase;
yargsParser.decamelize = decamelize;
yargsParser.looksLikeNumber = looksLikeNumber;
var lib_default = yargsParser;

// node_modules/yargs/lib/platform-shims/esm.mjs
import {basename, dirname as dirname2, extname, relative, resolve as resolve4} from "path";

// node_modules/yargs/build/lib/utils/process-argv.js
var getProcessArgvBinIndex = function() {
  if (isBundledElectronApp())
    return 0;
  return 1;
};
var isBundledElectronApp = function() {
  return isElectronApp() && !process.defaultApp;
};
var isElectronApp = function() {
  return !!process.versions.electron;
};
function hideBin(argv) {
  return argv.slice(getProcessArgvBinIndex() + 1);
}
function getProcessArgvBin() {
  return process.argv[getProcessArgvBinIndex()];
}

// node_modules/yargs/build/lib/yerror.js
class YError extends Error {
  constructor(msg) {
    super(msg || "yargs error");
    this.name = "YError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, YError);
    }
  }
}

// node_modules/y18n/build/lib/platform-shims/node.js
import {readFileSync as readFileSync2, statSync as statSync2, writeFile} from "fs";
import {format as format2} from "util";
import {resolve as resolve3} from "path";
var node_default = {
  fs: {
    readFileSync: readFileSync2,
    writeFile
  },
  format: format2,
  resolve: resolve3,
  exists: (file) => {
    try {
      return statSync2(file).isFile();
    } catch (err) {
      return false;
    }
  }
};

// node_modules/y18n/build/lib/index.js
function y18n(opts, _shim) {
  shim = _shim;
  const y18n2 = new Y18N(opts);
  return {
    __: y18n2.__.bind(y18n2),
    __n: y18n2.__n.bind(y18n2),
    setLocale: y18n2.setLocale.bind(y18n2),
    getLocale: y18n2.getLocale.bind(y18n2),
    updateLocale: y18n2.updateLocale.bind(y18n2),
    locale: y18n2.locale
  };
}
var shim;

class Y18N {
  constructor(opts) {
    opts = opts || {};
    this.directory = opts.directory || "./locales";
    this.updateFiles = typeof opts.updateFiles === "boolean" ? opts.updateFiles : true;
    this.locale = opts.locale || "en";
    this.fallbackToLanguage = typeof opts.fallbackToLanguage === "boolean" ? opts.fallbackToLanguage : true;
    this.cache = Object.create(null);
    this.writeQueue = [];
  }
  __(...args) {
    if (typeof arguments[0] !== "string") {
      return this._taggedLiteral(arguments[0], ...arguments);
    }
    const str = args.shift();
    let cb = function() {
    };
    if (typeof args[args.length - 1] === "function")
      cb = args.pop();
    cb = cb || function() {
    };
    if (!this.cache[this.locale])
      this._readLocaleFile();
    if (!this.cache[this.locale][str] && this.updateFiles) {
      this.cache[this.locale][str] = str;
      this._enqueueWrite({
        directory: this.directory,
        locale: this.locale,
        cb
      });
    } else {
      cb();
    }
    return shim.format.apply(shim.format, [this.cache[this.locale][str] || str].concat(args));
  }
  __n() {
    const args = Array.prototype.slice.call(arguments);
    const singular = args.shift();
    const plural = args.shift();
    const quantity = args.shift();
    let cb = function() {
    };
    if (typeof args[args.length - 1] === "function")
      cb = args.pop();
    if (!this.cache[this.locale])
      this._readLocaleFile();
    let str = quantity === 1 ? singular : plural;
    if (this.cache[this.locale][singular]) {
      const entry = this.cache[this.locale][singular];
      str = entry[quantity === 1 ? "one" : "other"];
    }
    if (!this.cache[this.locale][singular] && this.updateFiles) {
      this.cache[this.locale][singular] = {
        one: singular,
        other: plural
      };
      this._enqueueWrite({
        directory: this.directory,
        locale: this.locale,
        cb
      });
    } else {
      cb();
    }
    const values = [str];
    if (~str.indexOf("%d"))
      values.push(quantity);
    return shim.format.apply(shim.format, values.concat(args));
  }
  setLocale(locale) {
    this.locale = locale;
  }
  getLocale() {
    return this.locale;
  }
  updateLocale(obj) {
    if (!this.cache[this.locale])
      this._readLocaleFile();
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        this.cache[this.locale][key] = obj[key];
      }
    }
  }
  _taggedLiteral(parts, ...args) {
    let str = "";
    parts.forEach(function(part, i) {
      const arg = args[i + 1];
      str += part;
      if (typeof arg !== "undefined") {
        str += "%s";
      }
    });
    return this.__.apply(this, [str].concat([].slice.call(args, 1)));
  }
  _enqueueWrite(work) {
    this.writeQueue.push(work);
    if (this.writeQueue.length === 1)
      this._processWriteQueue();
  }
  _processWriteQueue() {
    const _this = this;
    const work = this.writeQueue[0];
    const directory = work.directory;
    const locale = work.locale;
    const cb = work.cb;
    const languageFile = this._resolveLocaleFile(directory, locale);
    const serializedLocale = JSON.stringify(this.cache[locale], null, 2);
    shim.fs.writeFile(languageFile, serializedLocale, "utf-8", function(err) {
      _this.writeQueue.shift();
      if (_this.writeQueue.length > 0)
        _this._processWriteQueue();
      cb(err);
    });
  }
  _readLocaleFile() {
    let localeLookup = {};
    const languageFile = this._resolveLocaleFile(this.directory, this.locale);
    try {
      if (shim.fs.readFileSync) {
        localeLookup = JSON.parse(shim.fs.readFileSync(languageFile, "utf-8"));
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        err.message = "syntax error in " + languageFile;
      }
      if (err.code === "ENOENT")
        localeLookup = {};
      else
        throw err;
    }
    this.cache[this.locale] = localeLookup;
  }
  _resolveLocaleFile(directory, locale) {
    let file = shim.resolve(directory, "./", locale + ".json");
    if (this.fallbackToLanguage && !this._fileExistsSync(file) && ~locale.lastIndexOf("_")) {
      const languageFile = shim.resolve(directory, "./", locale.split("_")[0] + ".json");
      if (this._fileExistsSync(languageFile))
        file = languageFile;
    }
    return file;
  }
  _fileExistsSync(file) {
    return shim.exists(file);
  }
}

// node_modules/y18n/index.mjs
var y18n2 = (opts) => {
  return y18n(opts, node_default);
};
var y18n_default = y18n2;

// node_modules/yargs/lib/platform-shims/esm.mjs
var REQUIRE_ERROR = "require is not supported by ESM";
var REQUIRE_DIRECTORY_ERROR = "loading a directory of commands is not supported yet for ESM";
var __dirname2;
try {
  __dirname2 = fileURLToPath(import.meta.url);
} catch (e) {
  __dirname2 = process.cwd();
}
var mainFilename = __dirname2.substring(0, __dirname2.lastIndexOf("node_modules"));
var esm_default = {
  assert: {
    notStrictEqual,
    strictEqual
  },
  cliui: ui,
  findUp: sync_default,
  getEnv: (key) => {
    return process.env[key];
  },
  inspect,
  getCallerFile: () => {
    throw new YError(REQUIRE_DIRECTORY_ERROR);
  },
  getProcessArgvBin,
  mainFilename: mainFilename || process.cwd(),
  Parser: lib_default,
  path: {
    basename,
    dirname: dirname2,
    extname,
    relative,
    resolve: resolve4
  },
  process: {
    argv: () => process.argv,
    cwd: process.cwd,
    emitWarning: (warning, type) => process.emitWarning(warning, type),
    execPath: () => process.execPath,
    exit: process.exit,
    nextTick: process.nextTick,
    stdColumns: typeof process.stdout.columns !== "undefined" ? process.stdout.columns : null
  },
  readFileSync: readFileSync3,
  require: () => {
    throw new YError(REQUIRE_ERROR);
  },
  requireDirectory: () => {
    throw new YError(REQUIRE_DIRECTORY_ERROR);
  },
  stringWidth: (str) => {
    return [...str].length;
  },
  y18n: y18n_default({
    directory: resolve4(__dirname2, "../../../locales"),
    updateFiles: false
  })
};

// node_modules/yargs/build/lib/typings/common-types.js
function assertNotStrictEqual(actual, expected, shim2, message) {
  shim2.assert.notStrictEqual(actual, expected, message);
}
function assertSingleKey(actual, shim2) {
  shim2.assert.strictEqual(typeof actual, "string");
}
function objectKeys(object) {
  return Object.keys(object);
}

// node_modules/yargs/build/lib/utils/is-promise.js
function isPromise(maybePromise) {
  return !!maybePromise && !!maybePromise.then && typeof maybePromise.then === "function";
}

// node_modules/yargs/build/lib/parse-command.js
function parseCommand(cmd) {
  const extraSpacesStrippedCommand = cmd.replace(/\s{2,}/g, " ");
  const splitCommand = extraSpacesStrippedCommand.split(/\s+(?![^[]*]|[^<]*>)/);
  const bregex = /\.*[\][<>]/g;
  const firstCommand = splitCommand.shift();
  if (!firstCommand)
    throw new Error(`No command found in: ${cmd}`);
  const parsedCommand = {
    cmd: firstCommand.replace(bregex, ""),
    demanded: [],
    optional: []
  };
  splitCommand.forEach((cmd2, i) => {
    let variadic = false;
    cmd2 = cmd2.replace(/\s/g, "");
    if (/\.+[\]>]/.test(cmd2) && i === splitCommand.length - 1)
      variadic = true;
    if (/^\[/.test(cmd2)) {
      parsedCommand.optional.push({
        cmd: cmd2.replace(bregex, "").split("|"),
        variadic
      });
    } else {
      parsedCommand.demanded.push({
        cmd: cmd2.replace(bregex, "").split("|"),
        variadic
      });
    }
  });
  return parsedCommand;
}

// node_modules/yargs/build/lib/argsert.js
function argsert(arg1, arg2, arg3) {
  function parseArgs() {
    return typeof arg1 === "object" ? [{ demanded: [], optional: [] }, arg1, arg2] : [
      parseCommand(`cmd ${arg1}`),
      arg2,
      arg3
    ];
  }
  try {
    let position = 0;
    const [parsed, callerArguments, _length] = parseArgs();
    const args = [].slice.call(callerArguments);
    while (args.length && args[args.length - 1] === undefined)
      args.pop();
    const length = _length || args.length;
    if (length < parsed.demanded.length) {
      throw new YError(`Not enough arguments provided. Expected ${parsed.demanded.length} but received ${args.length}.`);
    }
    const totalCommands = parsed.demanded.length + parsed.optional.length;
    if (length > totalCommands) {
      throw new YError(`Too many arguments provided. Expected max ${totalCommands} but received ${length}.`);
    }
    parsed.demanded.forEach((demanded) => {
      const arg = args.shift();
      const observedType = guessType(arg);
      const matchingTypes = demanded.cmd.filter((type) => type === observedType || type === "*");
      if (matchingTypes.length === 0)
        argumentTypeError(observedType, demanded.cmd, position);
      position += 1;
    });
    parsed.optional.forEach((optional) => {
      if (args.length === 0)
        return;
      const arg = args.shift();
      const observedType = guessType(arg);
      const matchingTypes = optional.cmd.filter((type) => type === observedType || type === "*");
      if (matchingTypes.length === 0)
        argumentTypeError(observedType, optional.cmd, position);
      position += 1;
    });
  } catch (err) {
    console.warn(err.stack);
  }
}
var guessType = function(arg) {
  if (Array.isArray(arg)) {
    return "array";
  } else if (arg === null) {
    return "null";
  }
  return typeof arg;
};
var argumentTypeError = function(observedType, allowedTypes, position) {
  throw new YError(`Invalid ${positionName[position] || "manyith"} argument. Expected ${allowedTypes.join(" or ")} but received ${observedType}.`);
};
var positionName = ["first", "second", "third", "fourth", "fifth", "sixth"];

// node_modules/yargs/build/lib/middleware.js
function commandMiddlewareFactory(commandMiddleware) {
  if (!commandMiddleware)
    return [];
  return commandMiddleware.map((middleware) => {
    middleware.applyBeforeValidation = false;
    return middleware;
  });
}
function applyMiddleware(argv, yargs, middlewares, beforeValidation) {
  return middlewares.reduce((acc, middleware) => {
    if (middleware.applyBeforeValidation !== beforeValidation) {
      return acc;
    }
    if (middleware.mutates) {
      if (middleware.applied)
        return acc;
      middleware.applied = true;
    }
    if (isPromise(acc)) {
      return acc.then((initialObj) => Promise.all([initialObj, middleware(initialObj, yargs)])).then(([initialObj, middlewareObj]) => Object.assign(initialObj, middlewareObj));
    } else {
      const result = middleware(acc, yargs);
      return isPromise(result) ? result.then((middlewareObj) => Object.assign(acc, middlewareObj)) : Object.assign(acc, result);
    }
  }, argv);
}

class GlobalMiddleware {
  constructor(yargs) {
    this.globalMiddleware = [];
    this.frozens = [];
    this.yargs = yargs;
  }
  addMiddleware(callback, applyBeforeValidation, global = true, mutates = false) {
    argsert("<array|function> [boolean] [boolean] [boolean]", [callback, applyBeforeValidation, global], arguments.length);
    if (Array.isArray(callback)) {
      for (let i = 0;i < callback.length; i++) {
        if (typeof callback[i] !== "function") {
          throw Error("middleware must be a function");
        }
        const m = callback[i];
        m.applyBeforeValidation = applyBeforeValidation;
        m.global = global;
      }
      Array.prototype.push.apply(this.globalMiddleware, callback);
    } else if (typeof callback === "function") {
      const m = callback;
      m.applyBeforeValidation = applyBeforeValidation;
      m.global = global;
      m.mutates = mutates;
      this.globalMiddleware.push(callback);
    }
    return this.yargs;
  }
  addCoerceMiddleware(callback, option) {
    const aliases = this.yargs.getAliases();
    this.globalMiddleware = this.globalMiddleware.filter((m) => {
      const toCheck = [...aliases[option] || [], option];
      if (!m.option)
        return true;
      else
        return !toCheck.includes(m.option);
    });
    callback.option = option;
    return this.addMiddleware(callback, true, true, true);
  }
  getMiddleware() {
    return this.globalMiddleware;
  }
  freeze() {
    this.frozens.push([...this.globalMiddleware]);
  }
  unfreeze() {
    const frozen = this.frozens.pop();
    if (frozen !== undefined)
      this.globalMiddleware = frozen;
  }
  reset() {
    this.globalMiddleware = this.globalMiddleware.filter((m) => m.global);
  }
}

// node_modules/yargs/build/lib/utils/maybe-async-result.js
function maybeAsyncResult(getResult, resultHandler, errorHandler = (err) => {
  throw err;
}) {
  try {
    const result = isFunction(getResult) ? getResult() : getResult;
    return isPromise(result) ? result.then((result2) => resultHandler(result2)) : resultHandler(result);
  } catch (err) {
    return errorHandler(err);
  }
}
var isFunction = function(arg) {
  return typeof arg === "function";
};

// node_modules/yargs/build/lib/utils/which-module.js
function whichModule(exported) {
  if (typeof __require === "undefined")
    return null;
  for (let i = 0, files = Object.keys(__require.cache), mod;i < files.length; i++) {
    mod = __require.cache[files[i]];
    if (mod.exports === exported)
      return mod;
  }
  return null;
}

// node_modules/yargs/build/lib/command.js
function command(usage, validation, globalMiddleware, shim2) {
  return new CommandInstance(usage, validation, globalMiddleware, shim2);
}
function isCommandBuilderDefinition(builder) {
  return typeof builder === "object" && !!builder.builder && typeof builder.handler === "function";
}
var isCommandAndAliases = function(cmd) {
  return cmd.every((c) => typeof c === "string");
};
function isCommandBuilderCallback(builder) {
  return typeof builder === "function";
}
var isCommandBuilderOptionDefinitions = function(builder) {
  return typeof builder === "object";
};
function isCommandHandlerDefinition(cmd) {
  return typeof cmd === "object" && !Array.isArray(cmd);
}
var DEFAULT_MARKER = /(^\*)|(^\$0)/;

class CommandInstance {
  constructor(usage, validation, globalMiddleware, shim2) {
    this.requireCache = new Set;
    this.handlers = {};
    this.aliasMap = {};
    this.frozens = [];
    this.shim = shim2;
    this.usage = usage;
    this.globalMiddleware = globalMiddleware;
    this.validation = validation;
  }
  addDirectory(dir, req, callerFile, opts) {
    opts = opts || {};
    if (typeof opts.recurse !== "boolean")
      opts.recurse = false;
    if (!Array.isArray(opts.extensions))
      opts.extensions = ["js"];
    const parentVisit = typeof opts.visit === "function" ? opts.visit : (o) => o;
    opts.visit = (obj, joined, filename) => {
      const visited = parentVisit(obj, joined, filename);
      if (visited) {
        if (this.requireCache.has(joined))
          return visited;
        else
          this.requireCache.add(joined);
        this.addHandler(visited);
      }
      return visited;
    };
    this.shim.requireDirectory({ require: req, filename: callerFile }, dir, opts);
  }
  addHandler(cmd, description, builder, handler, commandMiddleware, deprecated) {
    let aliases = [];
    const middlewares = commandMiddlewareFactory(commandMiddleware);
    handler = handler || (() => {
    });
    if (Array.isArray(cmd)) {
      if (isCommandAndAliases(cmd)) {
        [cmd, ...aliases] = cmd;
      } else {
        for (const command2 of cmd) {
          this.addHandler(command2);
        }
      }
    } else if (isCommandHandlerDefinition(cmd)) {
      let command2 = Array.isArray(cmd.command) || typeof cmd.command === "string" ? cmd.command : this.moduleName(cmd);
      if (cmd.aliases)
        command2 = [].concat(command2).concat(cmd.aliases);
      this.addHandler(command2, this.extractDesc(cmd), cmd.builder, cmd.handler, cmd.middlewares, cmd.deprecated);
      return;
    } else if (isCommandBuilderDefinition(builder)) {
      this.addHandler([cmd].concat(aliases), description, builder.builder, builder.handler, builder.middlewares, builder.deprecated);
      return;
    }
    if (typeof cmd === "string") {
      const parsedCommand = parseCommand(cmd);
      aliases = aliases.map((alias) => parseCommand(alias).cmd);
      let isDefault = false;
      const parsedAliases = [parsedCommand.cmd].concat(aliases).filter((c) => {
        if (DEFAULT_MARKER.test(c)) {
          isDefault = true;
          return false;
        }
        return true;
      });
      if (parsedAliases.length === 0 && isDefault)
        parsedAliases.push("$0");
      if (isDefault) {
        parsedCommand.cmd = parsedAliases[0];
        aliases = parsedAliases.slice(1);
        cmd = cmd.replace(DEFAULT_MARKER, parsedCommand.cmd);
      }
      aliases.forEach((alias) => {
        this.aliasMap[alias] = parsedCommand.cmd;
      });
      if (description !== false) {
        this.usage.command(cmd, description, isDefault, aliases, deprecated);
      }
      this.handlers[parsedCommand.cmd] = {
        original: cmd,
        description,
        handler,
        builder: builder || {},
        middlewares,
        deprecated,
        demanded: parsedCommand.demanded,
        optional: parsedCommand.optional
      };
      if (isDefault)
        this.defaultCommand = this.handlers[parsedCommand.cmd];
    }
  }
  getCommandHandlers() {
    return this.handlers;
  }
  getCommands() {
    return Object.keys(this.handlers).concat(Object.keys(this.aliasMap));
  }
  hasDefaultCommand() {
    return !!this.defaultCommand;
  }
  runCommand(command2, yargs, parsed, commandIndex, helpOnly, helpOrVersionSet) {
    const commandHandler = this.handlers[command2] || this.handlers[this.aliasMap[command2]] || this.defaultCommand;
    const currentContext = yargs.getInternalMethods().getContext();
    const parentCommands = currentContext.commands.slice();
    const isDefaultCommand = !command2;
    if (command2) {
      currentContext.commands.push(command2);
      currentContext.fullCommands.push(commandHandler.original);
    }
    const builderResult = this.applyBuilderUpdateUsageAndParse(isDefaultCommand, commandHandler, yargs, parsed.aliases, parentCommands, commandIndex, helpOnly, helpOrVersionSet);
    return isPromise(builderResult) ? builderResult.then((result) => this.applyMiddlewareAndGetResult(isDefaultCommand, commandHandler, result.innerArgv, currentContext, helpOnly, result.aliases, yargs)) : this.applyMiddlewareAndGetResult(isDefaultCommand, commandHandler, builderResult.innerArgv, currentContext, helpOnly, builderResult.aliases, yargs);
  }
  applyBuilderUpdateUsageAndParse(isDefaultCommand, commandHandler, yargs, aliases, parentCommands, commandIndex, helpOnly, helpOrVersionSet) {
    const builder = commandHandler.builder;
    let innerYargs = yargs;
    if (isCommandBuilderCallback(builder)) {
      yargs.getInternalMethods().getUsageInstance().freeze();
      const builderOutput = builder(yargs.getInternalMethods().reset(aliases), helpOrVersionSet);
      if (isPromise(builderOutput)) {
        return builderOutput.then((output) => {
          innerYargs = isYargsInstance(output) ? output : yargs;
          return this.parseAndUpdateUsage(isDefaultCommand, commandHandler, innerYargs, parentCommands, commandIndex, helpOnly);
        });
      }
    } else if (isCommandBuilderOptionDefinitions(builder)) {
      yargs.getInternalMethods().getUsageInstance().freeze();
      innerYargs = yargs.getInternalMethods().reset(aliases);
      Object.keys(commandHandler.builder).forEach((key) => {
        innerYargs.option(key, builder[key]);
      });
    }
    return this.parseAndUpdateUsage(isDefaultCommand, commandHandler, innerYargs, parentCommands, commandIndex, helpOnly);
  }
  parseAndUpdateUsage(isDefaultCommand, commandHandler, innerYargs, parentCommands, commandIndex, helpOnly) {
    if (isDefaultCommand)
      innerYargs.getInternalMethods().getUsageInstance().unfreeze(true);
    if (this.shouldUpdateUsage(innerYargs)) {
      innerYargs.getInternalMethods().getUsageInstance().usage(this.usageFromParentCommandsCommandHandler(parentCommands, commandHandler), commandHandler.description);
    }
    const innerArgv = innerYargs.getInternalMethods().runYargsParserAndExecuteCommands(null, undefined, true, commandIndex, helpOnly);
    return isPromise(innerArgv) ? innerArgv.then((argv) => ({
      aliases: innerYargs.parsed.aliases,
      innerArgv: argv
    })) : {
      aliases: innerYargs.parsed.aliases,
      innerArgv
    };
  }
  shouldUpdateUsage(yargs) {
    return !yargs.getInternalMethods().getUsageInstance().getUsageDisabled() && yargs.getInternalMethods().getUsageInstance().getUsage().length === 0;
  }
  usageFromParentCommandsCommandHandler(parentCommands, commandHandler) {
    const c = DEFAULT_MARKER.test(commandHandler.original) ? commandHandler.original.replace(DEFAULT_MARKER, "").trim() : commandHandler.original;
    const pc = parentCommands.filter((c2) => {
      return !DEFAULT_MARKER.test(c2);
    });
    pc.push(c);
    return `\$0 ${pc.join(" ")}`;
  }
  handleValidationAndGetResult(isDefaultCommand, commandHandler, innerArgv, currentContext, aliases, yargs, middlewares, positionalMap) {
    if (!yargs.getInternalMethods().getHasOutput()) {
      const validation = yargs.getInternalMethods().runValidation(aliases, positionalMap, yargs.parsed.error, isDefaultCommand);
      innerArgv = maybeAsyncResult(innerArgv, (result) => {
        validation(result);
        return result;
      });
    }
    if (commandHandler.handler && !yargs.getInternalMethods().getHasOutput()) {
      yargs.getInternalMethods().setHasOutput();
      const populateDoubleDash = !!yargs.getOptions().configuration["populate--"];
      yargs.getInternalMethods().postProcess(innerArgv, populateDoubleDash, false, false);
      innerArgv = applyMiddleware(innerArgv, yargs, middlewares, false);
      innerArgv = maybeAsyncResult(innerArgv, (result) => {
        const handlerResult = commandHandler.handler(result);
        return isPromise(handlerResult) ? handlerResult.then(() => result) : result;
      });
      if (!isDefaultCommand) {
        yargs.getInternalMethods().getUsageInstance().cacheHelpMessage();
      }
      if (isPromise(innerArgv) && !yargs.getInternalMethods().hasParseCallback()) {
        innerArgv.catch((error) => {
          try {
            yargs.getInternalMethods().getUsageInstance().fail(null, error);
          } catch (_err) {
          }
        });
      }
    }
    if (!isDefaultCommand) {
      currentContext.commands.pop();
      currentContext.fullCommands.pop();
    }
    return innerArgv;
  }
  applyMiddlewareAndGetResult(isDefaultCommand, commandHandler, innerArgv, currentContext, helpOnly, aliases, yargs) {
    let positionalMap = {};
    if (helpOnly)
      return innerArgv;
    if (!yargs.getInternalMethods().getHasOutput()) {
      positionalMap = this.populatePositionals(commandHandler, innerArgv, currentContext, yargs);
    }
    const middlewares = this.globalMiddleware.getMiddleware().slice(0).concat(commandHandler.middlewares);
    const maybePromiseArgv = applyMiddleware(innerArgv, yargs, middlewares, true);
    return isPromise(maybePromiseArgv) ? maybePromiseArgv.then((resolvedInnerArgv) => this.handleValidationAndGetResult(isDefaultCommand, commandHandler, resolvedInnerArgv, currentContext, aliases, yargs, middlewares, positionalMap)) : this.handleValidationAndGetResult(isDefaultCommand, commandHandler, maybePromiseArgv, currentContext, aliases, yargs, middlewares, positionalMap);
  }
  populatePositionals(commandHandler, argv, context, yargs) {
    argv._ = argv._.slice(context.commands.length);
    const demanded = commandHandler.demanded.slice(0);
    const optional = commandHandler.optional.slice(0);
    const positionalMap = {};
    this.validation.positionalCount(demanded.length, argv._.length);
    while (demanded.length) {
      const demand = demanded.shift();
      this.populatePositional(demand, argv, positionalMap);
    }
    while (optional.length) {
      const maybe = optional.shift();
      this.populatePositional(maybe, argv, positionalMap);
    }
    argv._ = context.commands.concat(argv._.map((a) => "" + a));
    this.postProcessPositionals(argv, positionalMap, this.cmdToParseOptions(commandHandler.original), yargs);
    return positionalMap;
  }
  populatePositional(positional, argv, positionalMap) {
    const cmd = positional.cmd[0];
    if (positional.variadic) {
      positionalMap[cmd] = argv._.splice(0).map(String);
    } else {
      if (argv._.length)
        positionalMap[cmd] = [String(argv._.shift())];
    }
  }
  cmdToParseOptions(cmdString) {
    const parseOptions = {
      array: [],
      default: {},
      alias: {},
      demand: {}
    };
    const parsed = parseCommand(cmdString);
    parsed.demanded.forEach((d) => {
      const [cmd, ...aliases] = d.cmd;
      if (d.variadic) {
        parseOptions.array.push(cmd);
        parseOptions.default[cmd] = [];
      }
      parseOptions.alias[cmd] = aliases;
      parseOptions.demand[cmd] = true;
    });
    parsed.optional.forEach((o) => {
      const [cmd, ...aliases] = o.cmd;
      if (o.variadic) {
        parseOptions.array.push(cmd);
        parseOptions.default[cmd] = [];
      }
      parseOptions.alias[cmd] = aliases;
    });
    return parseOptions;
  }
  postProcessPositionals(argv, positionalMap, parseOptions, yargs) {
    const options = Object.assign({}, yargs.getOptions());
    options.default = Object.assign(parseOptions.default, options.default);
    for (const key of Object.keys(parseOptions.alias)) {
      options.alias[key] = (options.alias[key] || []).concat(parseOptions.alias[key]);
    }
    options.array = options.array.concat(parseOptions.array);
    options.config = {};
    const unparsed = [];
    Object.keys(positionalMap).forEach((key) => {
      positionalMap[key].map((value) => {
        if (options.configuration["unknown-options-as-args"])
          options.key[key] = true;
        unparsed.push(`--${key}`);
        unparsed.push(value);
      });
    });
    if (!unparsed.length)
      return;
    const config = Object.assign({}, options.configuration, {
      "populate--": false
    });
    const parsed = this.shim.Parser.detailed(unparsed, Object.assign({}, options, {
      configuration: config
    }));
    if (parsed.error) {
      yargs.getInternalMethods().getUsageInstance().fail(parsed.error.message, parsed.error);
    } else {
      const positionalKeys = Object.keys(positionalMap);
      Object.keys(positionalMap).forEach((key) => {
        positionalKeys.push(...parsed.aliases[key]);
      });
      Object.keys(parsed.argv).forEach((key) => {
        if (positionalKeys.includes(key)) {
          if (!positionalMap[key])
            positionalMap[key] = parsed.argv[key];
          if (!this.isInConfigs(yargs, key) && !this.isDefaulted(yargs, key) && Object.prototype.hasOwnProperty.call(argv, key) && Object.prototype.hasOwnProperty.call(parsed.argv, key) && (Array.isArray(argv[key]) || Array.isArray(parsed.argv[key]))) {
            argv[key] = [].concat(argv[key], parsed.argv[key]);
          } else {
            argv[key] = parsed.argv[key];
          }
        }
      });
    }
  }
  isDefaulted(yargs, key) {
    const { default: defaults } = yargs.getOptions();
    return Object.prototype.hasOwnProperty.call(defaults, key) || Object.prototype.hasOwnProperty.call(defaults, this.shim.Parser.camelCase(key));
  }
  isInConfigs(yargs, key) {
    const { configObjects } = yargs.getOptions();
    return configObjects.some((c) => Object.prototype.hasOwnProperty.call(c, key)) || configObjects.some((c) => Object.prototype.hasOwnProperty.call(c, this.shim.Parser.camelCase(key)));
  }
  runDefaultBuilderOn(yargs) {
    if (!this.defaultCommand)
      return;
    if (this.shouldUpdateUsage(yargs)) {
      const commandString = DEFAULT_MARKER.test(this.defaultCommand.original) ? this.defaultCommand.original : this.defaultCommand.original.replace(/^[^[\]<>]*/, "$0 ");
      yargs.getInternalMethods().getUsageInstance().usage(commandString, this.defaultCommand.description);
    }
    const builder = this.defaultCommand.builder;
    if (isCommandBuilderCallback(builder)) {
      return builder(yargs, true);
    } else if (!isCommandBuilderDefinition(builder)) {
      Object.keys(builder).forEach((key) => {
        yargs.option(key, builder[key]);
      });
    }
    return;
  }
  moduleName(obj) {
    const mod = whichModule(obj);
    if (!mod)
      throw new Error(`No command name given for module: ${this.shim.inspect(obj)}`);
    return this.commandFromFilename(mod.filename);
  }
  commandFromFilename(filename) {
    return this.shim.path.basename(filename, this.shim.path.extname(filename));
  }
  extractDesc({ describe, description, desc }) {
    for (const test of [describe, description, desc]) {
      if (typeof test === "string" || test === false)
        return test;
      assertNotStrictEqual(test, true, this.shim);
    }
    return false;
  }
  freeze() {
    this.frozens.push({
      handlers: this.handlers,
      aliasMap: this.aliasMap,
      defaultCommand: this.defaultCommand
    });
  }
  unfreeze() {
    const frozen = this.frozens.pop();
    assertNotStrictEqual(frozen, undefined, this.shim);
    ({
      handlers: this.handlers,
      aliasMap: this.aliasMap,
      defaultCommand: this.defaultCommand
    } = frozen);
  }
  reset() {
    this.handlers = {};
    this.aliasMap = {};
    this.defaultCommand = undefined;
    this.requireCache = new Set;
    return this;
  }
}

// node_modules/yargs/build/lib/utils/obj-filter.js
function objFilter(original = {}, filter = () => true) {
  const obj = {};
  objectKeys(original).forEach((key) => {
    if (filter(key, original[key])) {
      obj[key] = original[key];
    }
  });
  return obj;
}

// node_modules/yargs/build/lib/utils/set-blocking.js
function setBlocking(blocking) {
  if (typeof process === "undefined")
    return;
  [process.stdout, process.stderr].forEach((_stream) => {
    const stream = _stream;
    if (stream._handle && stream.isTTY && typeof stream._handle.setBlocking === "function") {
      stream._handle.setBlocking(blocking);
    }
  });
}

// node_modules/yargs/build/lib/usage.js
var isBoolean = function(fail) {
  return typeof fail === "boolean";
};
function usage(yargs, shim2) {
  const __ = shim2.y18n.__;
  const self = {};
  const fails = [];
  self.failFn = function failFn(f) {
    fails.push(f);
  };
  let failMessage = null;
  let globalFailMessage = null;
  let showHelpOnFail = true;
  self.showHelpOnFail = function showHelpOnFailFn(arg1 = true, arg2) {
    const [enabled, message] = typeof arg1 === "string" ? [true, arg1] : [arg1, arg2];
    if (yargs.getInternalMethods().isGlobalContext()) {
      globalFailMessage = message;
    }
    failMessage = message;
    showHelpOnFail = enabled;
    return self;
  };
  let failureOutput = false;
  self.fail = function fail(msg, err) {
    const logger = yargs.getInternalMethods().getLoggerInstance();
    if (fails.length) {
      for (let i = fails.length - 1;i >= 0; --i) {
        const fail = fails[i];
        if (isBoolean(fail)) {
          if (err)
            throw err;
          else if (msg)
            throw Error(msg);
        } else {
          fail(msg, err, self);
        }
      }
    } else {
      if (yargs.getExitProcess())
        setBlocking(true);
      if (!failureOutput) {
        failureOutput = true;
        if (showHelpOnFail) {
          yargs.showHelp("error");
          logger.error();
        }
        if (msg || err)
          logger.error(msg || err);
        const globalOrCommandFailMessage = failMessage || globalFailMessage;
        if (globalOrCommandFailMessage) {
          if (msg || err)
            logger.error("");
          logger.error(globalOrCommandFailMessage);
        }
      }
      err = err || new YError(msg);
      if (yargs.getExitProcess()) {
        return yargs.exit(1);
      } else if (yargs.getInternalMethods().hasParseCallback()) {
        return yargs.exit(1, err);
      } else {
        throw err;
      }
    }
  };
  let usages = [];
  let usageDisabled = false;
  self.usage = (msg, description) => {
    if (msg === null) {
      usageDisabled = true;
      usages = [];
      return self;
    }
    usageDisabled = false;
    usages.push([msg, description || ""]);
    return self;
  };
  self.getUsage = () => {
    return usages;
  };
  self.getUsageDisabled = () => {
    return usageDisabled;
  };
  self.getPositionalGroupName = () => {
    return __("Positionals:");
  };
  let examples = [];
  self.example = (cmd, description) => {
    examples.push([cmd, description || ""]);
  };
  let commands = [];
  self.command = function command(cmd, description, isDefault, aliases, deprecated = false) {
    if (isDefault) {
      commands = commands.map((cmdArray) => {
        cmdArray[2] = false;
        return cmdArray;
      });
    }
    commands.push([cmd, description || "", isDefault, aliases, deprecated]);
  };
  self.getCommands = () => commands;
  let descriptions = {};
  self.describe = function describe(keyOrKeys, desc) {
    if (Array.isArray(keyOrKeys)) {
      keyOrKeys.forEach((k) => {
        self.describe(k, desc);
      });
    } else if (typeof keyOrKeys === "object") {
      Object.keys(keyOrKeys).forEach((k) => {
        self.describe(k, keyOrKeys[k]);
      });
    } else {
      descriptions[keyOrKeys] = desc;
    }
  };
  self.getDescriptions = () => descriptions;
  let epilogs = [];
  self.epilog = (msg) => {
    epilogs.push(msg);
  };
  let wrapSet = false;
  let wrap2;
  self.wrap = (cols) => {
    wrapSet = true;
    wrap2 = cols;
  };
  self.getWrap = () => {
    if (shim2.getEnv("YARGS_DISABLE_WRAP")) {
      return null;
    }
    if (!wrapSet) {
      wrap2 = windowWidth();
      wrapSet = true;
    }
    return wrap2;
  };
  const deferY18nLookupPrefix = "__yargsString__:";
  self.deferY18nLookup = (str) => deferY18nLookupPrefix + str;
  self.help = function help() {
    if (cachedHelpMessage)
      return cachedHelpMessage;
    normalizeAliases();
    const base$0 = yargs.customScriptName ? yargs.$0 : shim2.path.basename(yargs.$0);
    const demandedOptions = yargs.getDemandedOptions();
    const demandedCommands = yargs.getDemandedCommands();
    const deprecatedOptions = yargs.getDeprecatedOptions();
    const groups = yargs.getGroups();
    const options = yargs.getOptions();
    let keys = [];
    keys = keys.concat(Object.keys(descriptions));
    keys = keys.concat(Object.keys(demandedOptions));
    keys = keys.concat(Object.keys(demandedCommands));
    keys = keys.concat(Object.keys(options.default));
    keys = keys.filter(filterHiddenOptions);
    keys = Object.keys(keys.reduce((acc, key) => {
      if (key !== "_")
        acc[key] = true;
      return acc;
    }, {}));
    const theWrap = self.getWrap();
    const ui2 = shim2.cliui({
      width: theWrap,
      wrap: !!theWrap
    });
    if (!usageDisabled) {
      if (usages.length) {
        usages.forEach((usage2) => {
          ui2.div({ text: `${usage2[0].replace(/\$0/g, base$0)}` });
          if (usage2[1]) {
            ui2.div({ text: `${usage2[1]}`, padding: [1, 0, 0, 0] });
          }
        });
        ui2.div();
      } else if (commands.length) {
        let u = null;
        if (demandedCommands._) {
          u = `${base$0} <${__("command")}>\n`;
        } else {
          u = `${base$0} [${__("command")}]\n`;
        }
        ui2.div(`${u}`);
      }
    }
    if (commands.length > 1 || commands.length === 1 && !commands[0][2]) {
      ui2.div(__("Commands:"));
      const context = yargs.getInternalMethods().getContext();
      const parentCommands = context.commands.length ? `${context.commands.join(" ")} ` : "";
      if (yargs.getInternalMethods().getParserConfiguration()["sort-commands"] === true) {
        commands = commands.sort((a, b) => a[0].localeCompare(b[0]));
      }
      const prefix = base$0 ? `${base$0} ` : "";
      commands.forEach((command2) => {
        const commandString = `${prefix}${parentCommands}${command2[0].replace(/^\$0 ?/, "")}`;
        ui2.span({
          text: commandString,
          padding: [0, 2, 0, 2],
          width: maxWidth(commands, theWrap, `${base$0}${parentCommands}`) + 4
        }, { text: command2[1] });
        const hints = [];
        if (command2[2])
          hints.push(`[${__("default")}]`);
        if (command2[3] && command2[3].length) {
          hints.push(`[${__("aliases:")} ${command2[3].join(", ")}]`);
        }
        if (command2[4]) {
          if (typeof command2[4] === "string") {
            hints.push(`[${__("deprecated: %s", command2[4])}]`);
          } else {
            hints.push(`[${__("deprecated")}]`);
          }
        }
        if (hints.length) {
          ui2.div({
            text: hints.join(" "),
            padding: [0, 0, 0, 2],
            align: "right"
          });
        } else {
          ui2.div();
        }
      });
      ui2.div();
    }
    const aliasKeys = (Object.keys(options.alias) || []).concat(Object.keys(yargs.parsed.newAliases) || []);
    keys = keys.filter((key) => !yargs.parsed.newAliases[key] && aliasKeys.every((alias) => (options.alias[alias] || []).indexOf(key) === -1));
    const defaultGroup = __("Options:");
    if (!groups[defaultGroup])
      groups[defaultGroup] = [];
    addUngroupedKeys(keys, options.alias, groups, defaultGroup);
    const isLongSwitch = (sw) => /^--/.test(getText(sw));
    const displayedGroups = Object.keys(groups).filter((groupName) => groups[groupName].length > 0).map((groupName) => {
      const normalizedKeys = groups[groupName].filter(filterHiddenOptions).map((key) => {
        if (aliasKeys.includes(key))
          return key;
        for (let i = 0, aliasKey;(aliasKey = aliasKeys[i]) !== undefined; i++) {
          if ((options.alias[aliasKey] || []).includes(key))
            return aliasKey;
        }
        return key;
      });
      return { groupName, normalizedKeys };
    }).filter(({ normalizedKeys }) => normalizedKeys.length > 0).map(({ groupName, normalizedKeys }) => {
      const switches = normalizedKeys.reduce((acc, key) => {
        acc[key] = [key].concat(options.alias[key] || []).map((sw) => {
          if (groupName === self.getPositionalGroupName())
            return sw;
          else {
            return (/^[0-9]$/.test(sw) ? options.boolean.includes(key) ? "-" : "--" : sw.length > 1 ? "--" : "-") + sw;
          }
        }).sort((sw1, sw2) => isLongSwitch(sw1) === isLongSwitch(sw2) ? 0 : isLongSwitch(sw1) ? 1 : -1).join(", ");
        return acc;
      }, {});
      return { groupName, normalizedKeys, switches };
    });
    const shortSwitchesUsed = displayedGroups.filter(({ groupName }) => groupName !== self.getPositionalGroupName()).some(({ normalizedKeys, switches }) => !normalizedKeys.every((key) => isLongSwitch(switches[key])));
    if (shortSwitchesUsed) {
      displayedGroups.filter(({ groupName }) => groupName !== self.getPositionalGroupName()).forEach(({ normalizedKeys, switches }) => {
        normalizedKeys.forEach((key) => {
          if (isLongSwitch(switches[key])) {
            switches[key] = addIndentation(switches[key], "-x, ".length);
          }
        });
      });
    }
    displayedGroups.forEach(({ groupName, normalizedKeys, switches }) => {
      ui2.div(groupName);
      normalizedKeys.forEach((key) => {
        const kswitch = switches[key];
        let desc = descriptions[key] || "";
        let type = null;
        if (desc.includes(deferY18nLookupPrefix))
          desc = __(desc.substring(deferY18nLookupPrefix.length));
        if (options.boolean.includes(key))
          type = `[${__("boolean")}]`;
        if (options.count.includes(key))
          type = `[${__("count")}]`;
        if (options.string.includes(key))
          type = `[${__("string")}]`;
        if (options.normalize.includes(key))
          type = `[${__("string")}]`;
        if (options.array.includes(key))
          type = `[${__("array")}]`;
        if (options.number.includes(key))
          type = `[${__("number")}]`;
        const deprecatedExtra = (deprecated) => typeof deprecated === "string" ? `[${__("deprecated: %s", deprecated)}]` : `[${__("deprecated")}]`;
        const extra = [
          key in deprecatedOptions ? deprecatedExtra(deprecatedOptions[key]) : null,
          type,
          key in demandedOptions ? `[${__("required")}]` : null,
          options.choices && options.choices[key] ? `[${__("choices:")} ${self.stringifiedValues(options.choices[key])}]` : null,
          defaultString(options.default[key], options.defaultDescription[key])
        ].filter(Boolean).join(" ");
        ui2.span({
          text: getText(kswitch),
          padding: [0, 2, 0, 2 + getIndentation(kswitch)],
          width: maxWidth(switches, theWrap) + 4
        }, desc);
        const shouldHideOptionExtras = yargs.getInternalMethods().getUsageConfiguration()["hide-types"] === true;
        if (extra && !shouldHideOptionExtras)
          ui2.div({ text: extra, padding: [0, 0, 0, 2], align: "right" });
        else
          ui2.div();
      });
      ui2.div();
    });
    if (examples.length) {
      ui2.div(__("Examples:"));
      examples.forEach((example) => {
        example[0] = example[0].replace(/\$0/g, base$0);
      });
      examples.forEach((example) => {
        if (example[1] === "") {
          ui2.div({
            text: example[0],
            padding: [0, 2, 0, 2]
          });
        } else {
          ui2.div({
            text: example[0],
            padding: [0, 2, 0, 2],
            width: maxWidth(examples, theWrap) + 4
          }, {
            text: example[1]
          });
        }
      });
      ui2.div();
    }
    if (epilogs.length > 0) {
      const e = epilogs.map((epilog) => epilog.replace(/\$0/g, base$0)).join("\n");
      ui2.div(`${e}\n`);
    }
    return ui2.toString().replace(/\s*$/, "");
  };
  function maxWidth(table, theWrap, modifier) {
    let width = 0;
    if (!Array.isArray(table)) {
      table = Object.values(table).map((v) => [v]);
    }
    table.forEach((v) => {
      width = Math.max(shim2.stringWidth(modifier ? `${modifier} ${getText(v[0])}` : getText(v[0])) + getIndentation(v[0]), width);
    });
    if (theWrap)
      width = Math.min(width, parseInt((theWrap * 0.5).toString(), 10));
    return width;
  }
  function normalizeAliases() {
    const demandedOptions = yargs.getDemandedOptions();
    const options = yargs.getOptions();
    (Object.keys(options.alias) || []).forEach((key) => {
      options.alias[key].forEach((alias) => {
        if (descriptions[alias])
          self.describe(key, descriptions[alias]);
        if (alias in demandedOptions)
          yargs.demandOption(key, demandedOptions[alias]);
        if (options.boolean.includes(alias))
          yargs.boolean(key);
        if (options.count.includes(alias))
          yargs.count(key);
        if (options.string.includes(alias))
          yargs.string(key);
        if (options.normalize.includes(alias))
          yargs.normalize(key);
        if (options.array.includes(alias))
          yargs.array(key);
        if (options.number.includes(alias))
          yargs.number(key);
      });
    });
  }
  let cachedHelpMessage;
  self.cacheHelpMessage = function() {
    cachedHelpMessage = this.help();
  };
  self.clearCachedHelpMessage = function() {
    cachedHelpMessage = undefined;
  };
  self.hasCachedHelpMessage = function() {
    return !!cachedHelpMessage;
  };
  function addUngroupedKeys(keys, aliases, groups, defaultGroup) {
    let groupedKeys = [];
    let toCheck = null;
    Object.keys(groups).forEach((group) => {
      groupedKeys = groupedKeys.concat(groups[group]);
    });
    keys.forEach((key) => {
      toCheck = [key].concat(aliases[key]);
      if (!toCheck.some((k) => groupedKeys.indexOf(k) !== -1)) {
        groups[defaultGroup].push(key);
      }
    });
    return groupedKeys;
  }
  function filterHiddenOptions(key) {
    return yargs.getOptions().hiddenOptions.indexOf(key) < 0 || yargs.parsed.argv[yargs.getOptions().showHiddenOpt];
  }
  self.showHelp = (level) => {
    const logger = yargs.getInternalMethods().getLoggerInstance();
    if (!level)
      level = "error";
    const emit = typeof level === "function" ? level : logger[level];
    emit(self.help());
  };
  self.functionDescription = (fn) => {
    const description = fn.name ? shim2.Parser.decamelize(fn.name, "-") : __("generated-value");
    return ["(", description, ")"].join("");
  };
  self.stringifiedValues = function stringifiedValues(values, separator) {
    let string = "";
    const sep = separator || ", ";
    const array = [].concat(values);
    if (!values || !array.length)
      return string;
    array.forEach((value) => {
      if (string.length)
        string += sep;
      string += JSON.stringify(value);
    });
    return string;
  };
  function defaultString(value, defaultDescription) {
    let string = `[${__("default:")} `;
    if (value === undefined && !defaultDescription)
      return null;
    if (defaultDescription) {
      string += defaultDescription;
    } else {
      switch (typeof value) {
        case "string":
          string += `"${value}"`;
          break;
        case "object":
          string += JSON.stringify(value);
          break;
        default:
          string += value;
      }
    }
    return `${string}]`;
  }
  function windowWidth() {
    const maxWidth2 = 80;
    if (shim2.process.stdColumns) {
      return Math.min(maxWidth2, shim2.process.stdColumns);
    } else {
      return maxWidth2;
    }
  }
  let version = null;
  self.version = (ver) => {
    version = ver;
  };
  self.showVersion = (level) => {
    const logger = yargs.getInternalMethods().getLoggerInstance();
    if (!level)
      level = "error";
    const emit = typeof level === "function" ? level : logger[level];
    emit(version);
  };
  self.reset = function reset(localLookup) {
    failMessage = null;
    failureOutput = false;
    usages = [];
    usageDisabled = false;
    epilogs = [];
    examples = [];
    commands = [];
    descriptions = objFilter(descriptions, (k) => !localLookup[k]);
    return self;
  };
  const frozens = [];
  self.freeze = function freeze() {
    frozens.push({
      failMessage,
      failureOutput,
      usages,
      usageDisabled,
      epilogs,
      examples,
      commands,
      descriptions
    });
  };
  self.unfreeze = function unfreeze(defaultCommand = false) {
    const frozen = frozens.pop();
    if (!frozen)
      return;
    if (defaultCommand) {
      descriptions = { ...frozen.descriptions, ...descriptions };
      commands = [...frozen.commands, ...commands];
      usages = [...frozen.usages, ...usages];
      examples = [...frozen.examples, ...examples];
      epilogs = [...frozen.epilogs, ...epilogs];
    } else {
      ({
        failMessage,
        failureOutput,
        usages,
        usageDisabled,
        epilogs,
        examples,
        commands,
        descriptions
      } = frozen);
    }
  };
  return self;
}
var isIndentedText = function(text) {
  return typeof text === "object";
};
var addIndentation = function(text, indent) {
  return isIndentedText(text) ? { text: text.text, indentation: text.indentation + indent } : { text, indentation: indent };
};
var getIndentation = function(text) {
  return isIndentedText(text) ? text.indentation : 0;
};
var getText = function(text) {
  return isIndentedText(text) ? text.text : text;
};

// node_modules/yargs/build/lib/completion-templates.js
var completionShTemplate = `###-begin-{{app_name}}-completions-###
#
# yargs command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.bashrc
#    or {{app_path}} {{completion_command}} >> ~/.bash_profile on OSX.
#
_{{app_name}}_yargs_completions()
{
    local cur_word args type_list

    cur_word="\${COMP_WORDS[COMP_CWORD]}"
    args=("\${COMP_WORDS[@]}")

    # ask yargs to generate completions.
    type_list=$({{app_path}} --get-yargs-completions "\${args[@]}")

    COMPREPLY=( $(compgen -W "\${type_list}" -- \${cur_word}) )

    # if no match was found, fall back to filename completion
    if [ \${#COMPREPLY[@]} -eq 0 ]; then
      COMPREPLY=()
    fi

    return 0
}
complete -o bashdefault -o default -F _{{app_name}}_yargs_completions {{app_name}}
###-end-{{app_name}}-completions-###
`;
var completionZshTemplate = `#compdef {{app_name}}
###-begin-{{app_name}}-completions-###
#
# yargs command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.zshrc
#    or {{app_path}} {{completion_command}} >> ~/.zprofile on OSX.
#
_{{app_name}}_yargs_completions()
{
  local reply
  local si=$IFS
  IFS=$'
' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" {{app_path}} --get-yargs-completions "\${words[@]}"))
  IFS=$si
  _describe 'values' reply
}
compdef _{{app_name}}_yargs_completions {{app_name}}
###-end-{{app_name}}-completions-###
`;

// node_modules/yargs/build/lib/completion.js
function completion(yargs, usage2, command3, shim2) {
  return new Completion(yargs, usage2, command3, shim2);
}
var isSyncCompletionFunction = function(completionFunction) {
  return completionFunction.length < 3;
};
var isFallbackCompletionFunction = function(completionFunction) {
  return completionFunction.length > 3;
};

class Completion {
  constructor(yargs, usage2, command3, shim2) {
    var _a2, _b2, _c2;
    this.yargs = yargs;
    this.usage = usage2;
    this.command = command3;
    this.shim = shim2;
    this.completionKey = "get-yargs-completions";
    this.aliases = null;
    this.customCompletionFunction = null;
    this.indexAfterLastReset = 0;
    this.zshShell = (_c2 = ((_a2 = this.shim.getEnv("SHELL")) === null || _a2 === undefined ? undefined : _a2.includes("zsh")) || ((_b2 = this.shim.getEnv("ZSH_NAME")) === null || _b2 === undefined ? undefined : _b2.includes("zsh"))) !== null && _c2 !== undefined ? _c2 : false;
  }
  defaultCompletion(args, argv, current, done) {
    const handlers = this.command.getCommandHandlers();
    for (let i = 0, ii = args.length;i < ii; ++i) {
      if (handlers[args[i]] && handlers[args[i]].builder) {
        const builder = handlers[args[i]].builder;
        if (isCommandBuilderCallback(builder)) {
          this.indexAfterLastReset = i + 1;
          const y = this.yargs.getInternalMethods().reset();
          builder(y, true);
          return y.argv;
        }
      }
    }
    const completions = [];
    this.commandCompletions(completions, args, current);
    this.optionCompletions(completions, args, argv, current);
    this.choicesFromOptionsCompletions(completions, args, argv, current);
    this.choicesFromPositionalsCompletions(completions, args, argv, current);
    done(null, completions);
  }
  commandCompletions(completions, args, current) {
    const parentCommands = this.yargs.getInternalMethods().getContext().commands;
    if (!current.match(/^-/) && parentCommands[parentCommands.length - 1] !== current && !this.previousArgHasChoices(args)) {
      this.usage.getCommands().forEach((usageCommand) => {
        const commandName = parseCommand(usageCommand[0]).cmd;
        if (args.indexOf(commandName) === -1) {
          if (!this.zshShell) {
            completions.push(commandName);
          } else {
            const desc = usageCommand[1] || "";
            completions.push(commandName.replace(/:/g, "\\:") + ":" + desc);
          }
        }
      });
    }
  }
  optionCompletions(completions, args, argv, current) {
    if ((current.match(/^-/) || current === "" && completions.length === 0) && !this.previousArgHasChoices(args)) {
      const options = this.yargs.getOptions();
      const positionalKeys = this.yargs.getGroups()[this.usage.getPositionalGroupName()] || [];
      Object.keys(options.key).forEach((key) => {
        const negable = !!options.configuration["boolean-negation"] && options.boolean.includes(key);
        const isPositionalKey = positionalKeys.includes(key);
        if (!isPositionalKey && !options.hiddenOptions.includes(key) && !this.argsContainKey(args, key, negable)) {
          this.completeOptionKey(key, completions, current, negable && !!options.default[key]);
        }
      });
    }
  }
  choicesFromOptionsCompletions(completions, args, argv, current) {
    if (this.previousArgHasChoices(args)) {
      const choices = this.getPreviousArgChoices(args);
      if (choices && choices.length > 0) {
        completions.push(...choices.map((c) => c.replace(/:/g, "\\:")));
      }
    }
  }
  choicesFromPositionalsCompletions(completions, args, argv, current) {
    if (current === "" && completions.length > 0 && this.previousArgHasChoices(args)) {
      return;
    }
    const positionalKeys = this.yargs.getGroups()[this.usage.getPositionalGroupName()] || [];
    const offset = Math.max(this.indexAfterLastReset, this.yargs.getInternalMethods().getContext().commands.length + 1);
    const positionalKey = positionalKeys[argv._.length - offset - 1];
    if (!positionalKey) {
      return;
    }
    const choices = this.yargs.getOptions().choices[positionalKey] || [];
    for (const choice of choices) {
      if (choice.startsWith(current)) {
        completions.push(choice.replace(/:/g, "\\:"));
      }
    }
  }
  getPreviousArgChoices(args) {
    if (args.length < 1)
      return;
    let previousArg = args[args.length - 1];
    let filter = "";
    if (!previousArg.startsWith("-") && args.length > 1) {
      filter = previousArg;
      previousArg = args[args.length - 2];
    }
    if (!previousArg.startsWith("-"))
      return;
    const previousArgKey = previousArg.replace(/^-+/, "");
    const options = this.yargs.getOptions();
    const possibleAliases = [
      previousArgKey,
      ...this.yargs.getAliases()[previousArgKey] || []
    ];
    let choices;
    for (const possibleAlias of possibleAliases) {
      if (Object.prototype.hasOwnProperty.call(options.key, possibleAlias) && Array.isArray(options.choices[possibleAlias])) {
        choices = options.choices[possibleAlias];
        break;
      }
    }
    if (choices) {
      return choices.filter((choice) => !filter || choice.startsWith(filter));
    }
  }
  previousArgHasChoices(args) {
    const choices = this.getPreviousArgChoices(args);
    return choices !== undefined && choices.length > 0;
  }
  argsContainKey(args, key, negable) {
    const argsContains = (s) => args.indexOf((/^[^0-9]$/.test(s) ? "-" : "--") + s) !== -1;
    if (argsContains(key))
      return true;
    if (negable && argsContains(`no-${key}`))
      return true;
    if (this.aliases) {
      for (const alias of this.aliases[key]) {
        if (argsContains(alias))
          return true;
      }
    }
    return false;
  }
  completeOptionKey(key, completions, current, negable) {
    var _a2, _b2, _c2, _d;
    let keyWithDesc = key;
    if (this.zshShell) {
      const descs = this.usage.getDescriptions();
      const aliasKey = (_b2 = (_a2 = this === null || this === undefined ? undefined : this.aliases) === null || _a2 === undefined ? undefined : _a2[key]) === null || _b2 === undefined ? undefined : _b2.find((alias) => {
        const desc2 = descs[alias];
        return typeof desc2 === "string" && desc2.length > 0;
      });
      const descFromAlias = aliasKey ? descs[aliasKey] : undefined;
      const desc = (_d = (_c2 = descs[key]) !== null && _c2 !== undefined ? _c2 : descFromAlias) !== null && _d !== undefined ? _d : "";
      keyWithDesc = `${key.replace(/:/g, "\\:")}:${desc.replace("__yargsString__:", "").replace(/(\r\n|\n|\r)/gm, " ")}`;
    }
    const startsByTwoDashes = (s) => /^--/.test(s);
    const isShortOption = (s) => /^[^0-9]$/.test(s);
    const dashes = !startsByTwoDashes(current) && isShortOption(key) ? "-" : "--";
    completions.push(dashes + keyWithDesc);
    if (negable) {
      completions.push(dashes + "no-" + keyWithDesc);
    }
  }
  customCompletion(args, argv, current, done) {
    assertNotStrictEqual(this.customCompletionFunction, null, this.shim);
    if (isSyncCompletionFunction(this.customCompletionFunction)) {
      const result = this.customCompletionFunction(current, argv);
      if (isPromise(result)) {
        return result.then((list) => {
          this.shim.process.nextTick(() => {
            done(null, list);
          });
        }).catch((err) => {
          this.shim.process.nextTick(() => {
            done(err, undefined);
          });
        });
      }
      return done(null, result);
    } else if (isFallbackCompletionFunction(this.customCompletionFunction)) {
      return this.customCompletionFunction(current, argv, (onCompleted = done) => this.defaultCompletion(args, argv, current, onCompleted), (completions) => {
        done(null, completions);
      });
    } else {
      return this.customCompletionFunction(current, argv, (completions) => {
        done(null, completions);
      });
    }
  }
  getCompletion(args, done) {
    const current = args.length ? args[args.length - 1] : "";
    const argv = this.yargs.parse(args, true);
    const completionFunction = this.customCompletionFunction ? (argv2) => this.customCompletion(args, argv2, current, done) : (argv2) => this.defaultCompletion(args, argv2, current, done);
    return isPromise(argv) ? argv.then(completionFunction) : completionFunction(argv);
  }
  generateCompletionScript($0, cmd) {
    let script = this.zshShell ? completionZshTemplate : completionShTemplate;
    const name = this.shim.path.basename($0);
    if ($0.match(/\.js$/))
      $0 = `./${$0}`;
    script = script.replace(/{{app_name}}/g, name);
    script = script.replace(/{{completion_command}}/g, cmd);
    return script.replace(/{{app_path}}/g, $0);
  }
  registerFunction(fn) {
    this.customCompletionFunction = fn;
  }
  setParsed(parsed) {
    this.aliases = parsed.aliases;
  }
}

// node_modules/yargs/build/lib/utils/levenshtein.js
function levenshtein(a, b) {
  if (a.length === 0)
    return b.length;
  if (b.length === 0)
    return a.length;
  const matrix = [];
  let i;
  for (i = 0;i <= b.length; i++) {
    matrix[i] = [i];
  }
  let j;
  for (j = 0;j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (i = 1;i <= b.length; i++) {
    for (j = 1;j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        if (i > 1 && j > 1 && b.charAt(i - 2) === a.charAt(j - 1) && b.charAt(i - 1) === a.charAt(j - 2)) {
          matrix[i][j] = matrix[i - 2][j - 2] + 1;
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
        }
      }
    }
  }
  return matrix[b.length][a.length];
}

// node_modules/yargs/build/lib/validation.js
function validation(yargs, usage2, shim2) {
  const __ = shim2.y18n.__;
  const __n = shim2.y18n.__n;
  const self = {};
  self.nonOptionCount = function nonOptionCount(argv) {
    const demandedCommands = yargs.getDemandedCommands();
    const positionalCount = argv._.length + (argv["--"] ? argv["--"].length : 0);
    const _s = positionalCount - yargs.getInternalMethods().getContext().commands.length;
    if (demandedCommands._ && (_s < demandedCommands._.min || _s > demandedCommands._.max)) {
      if (_s < demandedCommands._.min) {
        if (demandedCommands._.minMsg !== undefined) {
          usage2.fail(demandedCommands._.minMsg ? demandedCommands._.minMsg.replace(/\$0/g, _s.toString()).replace(/\$1/, demandedCommands._.min.toString()) : null);
        } else {
          usage2.fail(__n("Not enough non-option arguments: got %s, need at least %s", "Not enough non-option arguments: got %s, need at least %s", _s, _s.toString(), demandedCommands._.min.toString()));
        }
      } else if (_s > demandedCommands._.max) {
        if (demandedCommands._.maxMsg !== undefined) {
          usage2.fail(demandedCommands._.maxMsg ? demandedCommands._.maxMsg.replace(/\$0/g, _s.toString()).replace(/\$1/, demandedCommands._.max.toString()) : null);
        } else {
          usage2.fail(__n("Too many non-option arguments: got %s, maximum of %s", "Too many non-option arguments: got %s, maximum of %s", _s, _s.toString(), demandedCommands._.max.toString()));
        }
      }
    }
  };
  self.positionalCount = function positionalCount(required, observed) {
    if (observed < required) {
      usage2.fail(__n("Not enough non-option arguments: got %s, need at least %s", "Not enough non-option arguments: got %s, need at least %s", observed, observed + "", required + ""));
    }
  };
  self.requiredArguments = function requiredArguments(argv, demandedOptions) {
    let missing = null;
    for (const key of Object.keys(demandedOptions)) {
      if (!Object.prototype.hasOwnProperty.call(argv, key) || typeof argv[key] === "undefined") {
        missing = missing || {};
        missing[key] = demandedOptions[key];
      }
    }
    if (missing) {
      const customMsgs = [];
      for (const key of Object.keys(missing)) {
        const msg = missing[key];
        if (msg && customMsgs.indexOf(msg) < 0) {
          customMsgs.push(msg);
        }
      }
      const customMsg = customMsgs.length ? `\n${customMsgs.join("\n")}` : "";
      usage2.fail(__n("Missing required argument: %s", "Missing required arguments: %s", Object.keys(missing).length, Object.keys(missing).join(", ") + customMsg));
    }
  };
  self.unknownArguments = function unknownArguments(argv, aliases, positionalMap, isDefaultCommand, checkPositionals = true) {
    var _a2;
    const commandKeys = yargs.getInternalMethods().getCommandInstance().getCommands();
    const unknown = [];
    const currentContext = yargs.getInternalMethods().getContext();
    Object.keys(argv).forEach((key) => {
      if (!specialKeys.includes(key) && !Object.prototype.hasOwnProperty.call(positionalMap, key) && !Object.prototype.hasOwnProperty.call(yargs.getInternalMethods().getParseContext(), key) && !self.isValidAndSomeAliasIsNotNew(key, aliases)) {
        unknown.push(key);
      }
    });
    if (checkPositionals && (currentContext.commands.length > 0 || commandKeys.length > 0 || isDefaultCommand)) {
      argv._.slice(currentContext.commands.length).forEach((key) => {
        if (!commandKeys.includes("" + key)) {
          unknown.push("" + key);
        }
      });
    }
    if (checkPositionals) {
      const demandedCommands = yargs.getDemandedCommands();
      const maxNonOptDemanded = ((_a2 = demandedCommands._) === null || _a2 === undefined ? undefined : _a2.max) || 0;
      const expected = currentContext.commands.length + maxNonOptDemanded;
      if (expected < argv._.length) {
        argv._.slice(expected).forEach((key) => {
          key = String(key);
          if (!currentContext.commands.includes(key) && !unknown.includes(key)) {
            unknown.push(key);
          }
        });
      }
    }
    if (unknown.length) {
      usage2.fail(__n("Unknown argument: %s", "Unknown arguments: %s", unknown.length, unknown.map((s) => s.trim() ? s : `"${s}"`).join(", ")));
    }
  };
  self.unknownCommands = function unknownCommands(argv) {
    const commandKeys = yargs.getInternalMethods().getCommandInstance().getCommands();
    const unknown = [];
    const currentContext = yargs.getInternalMethods().getContext();
    if (currentContext.commands.length > 0 || commandKeys.length > 0) {
      argv._.slice(currentContext.commands.length).forEach((key) => {
        if (!commandKeys.includes("" + key)) {
          unknown.push("" + key);
        }
      });
    }
    if (unknown.length > 0) {
      usage2.fail(__n("Unknown command: %s", "Unknown commands: %s", unknown.length, unknown.join(", ")));
      return true;
    } else {
      return false;
    }
  };
  self.isValidAndSomeAliasIsNotNew = function isValidAndSomeAliasIsNotNew(key, aliases) {
    if (!Object.prototype.hasOwnProperty.call(aliases, key)) {
      return false;
    }
    const newAliases = yargs.parsed.newAliases;
    return [key, ...aliases[key]].some((a) => !Object.prototype.hasOwnProperty.call(newAliases, a) || !newAliases[key]);
  };
  self.limitedChoices = function limitedChoices(argv) {
    const options = yargs.getOptions();
    const invalid = {};
    if (!Object.keys(options.choices).length)
      return;
    Object.keys(argv).forEach((key) => {
      if (specialKeys.indexOf(key) === -1 && Object.prototype.hasOwnProperty.call(options.choices, key)) {
        [].concat(argv[key]).forEach((value) => {
          if (options.choices[key].indexOf(value) === -1 && value !== undefined) {
            invalid[key] = (invalid[key] || []).concat(value);
          }
        });
      }
    });
    const invalidKeys = Object.keys(invalid);
    if (!invalidKeys.length)
      return;
    let msg = __("Invalid values:");
    invalidKeys.forEach((key) => {
      msg += `\n  ${__("Argument: %s, Given: %s, Choices: %s", key, usage2.stringifiedValues(invalid[key]), usage2.stringifiedValues(options.choices[key]))}`;
    });
    usage2.fail(msg);
  };
  let implied = {};
  self.implies = function implies(key, value) {
    argsert("<string|object> [array|number|string]", [key, value], arguments.length);
    if (typeof key === "object") {
      Object.keys(key).forEach((k) => {
        self.implies(k, key[k]);
      });
    } else {
      yargs.global(key);
      if (!implied[key]) {
        implied[key] = [];
      }
      if (Array.isArray(value)) {
        value.forEach((i) => self.implies(key, i));
      } else {
        assertNotStrictEqual(value, undefined, shim2);
        implied[key].push(value);
      }
    }
  };
  self.getImplied = function getImplied() {
    return implied;
  };
  function keyExists(argv, val) {
    const num = Number(val);
    val = isNaN(num) ? val : num;
    if (typeof val === "number") {
      val = argv._.length >= val;
    } else if (val.match(/^--no-.+/)) {
      val = val.match(/^--no-(.+)/)[1];
      val = !Object.prototype.hasOwnProperty.call(argv, val);
    } else {
      val = Object.prototype.hasOwnProperty.call(argv, val);
    }
    return val;
  }
  self.implications = function implications(argv) {
    const implyFail = [];
    Object.keys(implied).forEach((key) => {
      const origKey = key;
      (implied[key] || []).forEach((value) => {
        let key2 = origKey;
        const origValue = value;
        key2 = keyExists(argv, key2);
        value = keyExists(argv, value);
        if (key2 && !value) {
          implyFail.push(` ${origKey} -> ${origValue}`);
        }
      });
    });
    if (implyFail.length) {
      let msg = `${__("Implications failed:")}\n`;
      implyFail.forEach((value) => {
        msg += value;
      });
      usage2.fail(msg);
    }
  };
  let conflicting = {};
  self.conflicts = function conflicts(key, value) {
    argsert("<string|object> [array|string]", [key, value], arguments.length);
    if (typeof key === "object") {
      Object.keys(key).forEach((k) => {
        self.conflicts(k, key[k]);
      });
    } else {
      yargs.global(key);
      if (!conflicting[key]) {
        conflicting[key] = [];
      }
      if (Array.isArray(value)) {
        value.forEach((i) => self.conflicts(key, i));
      } else {
        conflicting[key].push(value);
      }
    }
  };
  self.getConflicting = () => conflicting;
  self.conflicting = function conflictingFn(argv) {
    Object.keys(argv).forEach((key) => {
      if (conflicting[key]) {
        conflicting[key].forEach((value) => {
          if (value && argv[key] !== undefined && argv[value] !== undefined) {
            usage2.fail(__("Arguments %s and %s are mutually exclusive", key, value));
          }
        });
      }
    });
    if (yargs.getInternalMethods().getParserConfiguration()["strip-dashed"]) {
      Object.keys(conflicting).forEach((key) => {
        conflicting[key].forEach((value) => {
          if (value && argv[shim2.Parser.camelCase(key)] !== undefined && argv[shim2.Parser.camelCase(value)] !== undefined) {
            usage2.fail(__("Arguments %s and %s are mutually exclusive", key, value));
          }
        });
      });
    }
  };
  self.recommendCommands = function recommendCommands(cmd, potentialCommands) {
    const threshold = 3;
    potentialCommands = potentialCommands.sort((a, b) => b.length - a.length);
    let recommended = null;
    let bestDistance = Infinity;
    for (let i = 0, candidate;(candidate = potentialCommands[i]) !== undefined; i++) {
      const d = levenshtein(cmd, candidate);
      if (d <= threshold && d < bestDistance) {
        bestDistance = d;
        recommended = candidate;
      }
    }
    if (recommended)
      usage2.fail(__("Did you mean %s?", recommended));
  };
  self.reset = function reset(localLookup) {
    implied = objFilter(implied, (k) => !localLookup[k]);
    conflicting = objFilter(conflicting, (k) => !localLookup[k]);
    return self;
  };
  const frozens = [];
  self.freeze = function freeze() {
    frozens.push({
      implied,
      conflicting
    });
  };
  self.unfreeze = function unfreeze() {
    const frozen = frozens.pop();
    assertNotStrictEqual(frozen, undefined, shim2);
    ({ implied, conflicting } = frozen);
  };
  return self;
}
var specialKeys = ["$0", "--", "_"];

// node_modules/yargs/build/lib/utils/apply-extends.js
function applyExtends(config, cwd, mergeExtends, _shim) {
  shim2 = _shim;
  let defaultConfig = {};
  if (Object.prototype.hasOwnProperty.call(config, "extends")) {
    if (typeof config.extends !== "string")
      return defaultConfig;
    const isPath = /\.json|\..*rc$/.test(config.extends);
    let pathToDefault = null;
    if (!isPath) {
      try {
        pathToDefault = __require.resolve(config.extends);
      } catch (_err) {
        return config;
      }
    } else {
      pathToDefault = getPathToDefaultConfig(cwd, config.extends);
    }
    checkForCircularExtends(pathToDefault);
    previouslyVisitedConfigs.push(pathToDefault);
    defaultConfig = isPath ? JSON.parse(shim2.readFileSync(pathToDefault, "utf8")) : __require(config.extends);
    delete config.extends;
    defaultConfig = applyExtends(defaultConfig, shim2.path.dirname(pathToDefault), mergeExtends, shim2);
  }
  previouslyVisitedConfigs = [];
  return mergeExtends ? mergeDeep(defaultConfig, config) : Object.assign({}, defaultConfig, config);
}
var checkForCircularExtends = function(cfgPath) {
  if (previouslyVisitedConfigs.indexOf(cfgPath) > -1) {
    throw new YError(`Circular extended configurations: '${cfgPath}'.`);
  }
};
var getPathToDefaultConfig = function(cwd, pathToExtend) {
  return shim2.path.resolve(cwd, pathToExtend);
};
var mergeDeep = function(config1, config2) {
  const target = {};
  function isObject(obj) {
    return obj && typeof obj === "object" && !Array.isArray(obj);
  }
  Object.assign(target, config1);
  for (const key of Object.keys(config2)) {
    if (isObject(config2[key]) && isObject(target[key])) {
      target[key] = mergeDeep(config1[key], config2[key]);
    } else {
      target[key] = config2[key];
    }
  }
  return target;
};
var previouslyVisitedConfigs = [];
var shim2;

// node_modules/yargs/build/lib/yargs-factory.js
function YargsFactory(_shim) {
  return (processArgs = [], cwd = _shim.process.cwd(), parentRequire) => {
    const yargs = new YargsInstance(processArgs, cwd, parentRequire, _shim);
    Object.defineProperty(yargs, "argv", {
      get: () => {
        return yargs.parse();
      },
      enumerable: true
    });
    yargs.help();
    yargs.version();
    return yargs;
  };
}
function isYargsInstance(y) {
  return !!y && typeof y.getInternalMethods === "function";
}
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _YargsInstance_command;
var _YargsInstance_cwd;
var _YargsInstance_context;
var _YargsInstance_completion;
var _YargsInstance_completionCommand;
var _YargsInstance_defaultShowHiddenOpt;
var _YargsInstance_exitError;
var _YargsInstance_detectLocale;
var _YargsInstance_emittedWarnings;
var _YargsInstance_exitProcess;
var _YargsInstance_frozens;
var _YargsInstance_globalMiddleware;
var _YargsInstance_groups;
var _YargsInstance_hasOutput;
var _YargsInstance_helpOpt;
var _YargsInstance_isGlobalContext;
var _YargsInstance_logger;
var _YargsInstance_output;
var _YargsInstance_options;
var _YargsInstance_parentRequire;
var _YargsInstance_parserConfig;
var _YargsInstance_parseFn;
var _YargsInstance_parseContext;
var _YargsInstance_pkgs;
var _YargsInstance_preservedGroups;
var _YargsInstance_processArgs;
var _YargsInstance_recommendCommands;
var _YargsInstance_shim;
var _YargsInstance_strict;
var _YargsInstance_strictCommands;
var _YargsInstance_strictOptions;
var _YargsInstance_usage;
var _YargsInstance_usageConfig;
var _YargsInstance_versionOpt;
var _YargsInstance_validation;
var kCopyDoubleDash = Symbol("copyDoubleDash");
var kCreateLogger = Symbol("copyDoubleDash");
var kDeleteFromParserHintObject = Symbol("deleteFromParserHintObject");
var kEmitWarning = Symbol("emitWarning");
var kFreeze = Symbol("freeze");
var kGetDollarZero = Symbol("getDollarZero");
var kGetParserConfiguration = Symbol("getParserConfiguration");
var kGetUsageConfiguration = Symbol("getUsageConfiguration");
var kGuessLocale = Symbol("guessLocale");
var kGuessVersion = Symbol("guessVersion");
var kParsePositionalNumbers = Symbol("parsePositionalNumbers");
var kPkgUp = Symbol("pkgUp");
var kPopulateParserHintArray = Symbol("populateParserHintArray");
var kPopulateParserHintSingleValueDictionary = Symbol("populateParserHintSingleValueDictionary");
var kPopulateParserHintArrayDictionary = Symbol("populateParserHintArrayDictionary");
var kPopulateParserHintDictionary = Symbol("populateParserHintDictionary");
var kSanitizeKey = Symbol("sanitizeKey");
var kSetKey = Symbol("setKey");
var kUnfreeze = Symbol("unfreeze");
var kValidateAsync = Symbol("validateAsync");
var kGetCommandInstance = Symbol("getCommandInstance");
var kGetContext = Symbol("getContext");
var kGetHasOutput = Symbol("getHasOutput");
var kGetLoggerInstance = Symbol("getLoggerInstance");
var kGetParseContext = Symbol("getParseContext");
var kGetUsageInstance = Symbol("getUsageInstance");
var kGetValidationInstance = Symbol("getValidationInstance");
var kHasParseCallback = Symbol("hasParseCallback");
var kIsGlobalContext = Symbol("isGlobalContext");
var kPostProcess = Symbol("postProcess");
var kRebase = Symbol("rebase");
var kReset = Symbol("reset");
var kRunYargsParserAndExecuteCommands = Symbol("runYargsParserAndExecuteCommands");
var kRunValidation = Symbol("runValidation");
var kSetHasOutput = Symbol("setHasOutput");
var kTrackManuallySetKeys = Symbol("kTrackManuallySetKeys");

class YargsInstance {
  constructor(processArgs = [], cwd, parentRequire, shim3) {
    this.customScriptName = false;
    this.parsed = false;
    _YargsInstance_command.set(this, undefined);
    _YargsInstance_cwd.set(this, undefined);
    _YargsInstance_context.set(this, { commands: [], fullCommands: [] });
    _YargsInstance_completion.set(this, null);
    _YargsInstance_completionCommand.set(this, null);
    _YargsInstance_defaultShowHiddenOpt.set(this, "show-hidden");
    _YargsInstance_exitError.set(this, null);
    _YargsInstance_detectLocale.set(this, true);
    _YargsInstance_emittedWarnings.set(this, {});
    _YargsInstance_exitProcess.set(this, true);
    _YargsInstance_frozens.set(this, []);
    _YargsInstance_globalMiddleware.set(this, undefined);
    _YargsInstance_groups.set(this, {});
    _YargsInstance_hasOutput.set(this, false);
    _YargsInstance_helpOpt.set(this, null);
    _YargsInstance_isGlobalContext.set(this, true);
    _YargsInstance_logger.set(this, undefined);
    _YargsInstance_output.set(this, "");
    _YargsInstance_options.set(this, undefined);
    _YargsInstance_parentRequire.set(this, undefined);
    _YargsInstance_parserConfig.set(this, {});
    _YargsInstance_parseFn.set(this, null);
    _YargsInstance_parseContext.set(this, null);
    _YargsInstance_pkgs.set(this, {});
    _YargsInstance_preservedGroups.set(this, {});
    _YargsInstance_processArgs.set(this, undefined);
    _YargsInstance_recommendCommands.set(this, false);
    _YargsInstance_shim.set(this, undefined);
    _YargsInstance_strict.set(this, false);
    _YargsInstance_strictCommands.set(this, false);
    _YargsInstance_strictOptions.set(this, false);
    _YargsInstance_usage.set(this, undefined);
    _YargsInstance_usageConfig.set(this, {});
    _YargsInstance_versionOpt.set(this, null);
    _YargsInstance_validation.set(this, undefined);
    __classPrivateFieldSet(this, _YargsInstance_shim, shim3, "f");
    __classPrivateFieldSet(this, _YargsInstance_processArgs, processArgs, "f");
    __classPrivateFieldSet(this, _YargsInstance_cwd, cwd, "f");
    __classPrivateFieldSet(this, _YargsInstance_parentRequire, parentRequire, "f");
    __classPrivateFieldSet(this, _YargsInstance_globalMiddleware, new GlobalMiddleware(this), "f");
    this.$0 = this[kGetDollarZero]();
    this[kReset]();
    __classPrivateFieldSet(this, _YargsInstance_command, __classPrivateFieldGet(this, _YargsInstance_command, "f"), "f");
    __classPrivateFieldSet(this, _YargsInstance_usage, __classPrivateFieldGet(this, _YargsInstance_usage, "f"), "f");
    __classPrivateFieldSet(this, _YargsInstance_validation, __classPrivateFieldGet(this, _YargsInstance_validation, "f"), "f");
    __classPrivateFieldSet(this, _YargsInstance_options, __classPrivateFieldGet(this, _YargsInstance_options, "f"), "f");
    __classPrivateFieldGet(this, _YargsInstance_options, "f").showHiddenOpt = __classPrivateFieldGet(this, _YargsInstance_defaultShowHiddenOpt, "f");
    __classPrivateFieldSet(this, _YargsInstance_logger, this[kCreateLogger](), "f");
  }
  addHelpOpt(opt, msg) {
    const defaultHelpOpt = "help";
    argsert("[string|boolean] [string]", [opt, msg], arguments.length);
    if (__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f")) {
      this[kDeleteFromParserHintObject](__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f"));
      __classPrivateFieldSet(this, _YargsInstance_helpOpt, null, "f");
    }
    if (opt === false && msg === undefined)
      return this;
    __classPrivateFieldSet(this, _YargsInstance_helpOpt, typeof opt === "string" ? opt : defaultHelpOpt, "f");
    this.boolean(__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f"));
    this.describe(__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f"), msg || __classPrivateFieldGet(this, _YargsInstance_usage, "f").deferY18nLookup("Show help"));
    return this;
  }
  help(opt, msg) {
    return this.addHelpOpt(opt, msg);
  }
  addShowHiddenOpt(opt, msg) {
    argsert("[string|boolean] [string]", [opt, msg], arguments.length);
    if (opt === false && msg === undefined)
      return this;
    const showHiddenOpt = typeof opt === "string" ? opt : __classPrivateFieldGet(this, _YargsInstance_defaultShowHiddenOpt, "f");
    this.boolean(showHiddenOpt);
    this.describe(showHiddenOpt, msg || __classPrivateFieldGet(this, _YargsInstance_usage, "f").deferY18nLookup("Show hidden options"));
    __classPrivateFieldGet(this, _YargsInstance_options, "f").showHiddenOpt = showHiddenOpt;
    return this;
  }
  showHidden(opt, msg) {
    return this.addShowHiddenOpt(opt, msg);
  }
  alias(key, value) {
    argsert("<object|string|array> [string|array]", [key, value], arguments.length);
    this[kPopulateParserHintArrayDictionary](this.alias.bind(this), "alias", key, value);
    return this;
  }
  array(keys) {
    argsert("<array|string>", [keys], arguments.length);
    this[kPopulateParserHintArray]("array", keys);
    this[kTrackManuallySetKeys](keys);
    return this;
  }
  boolean(keys) {
    argsert("<array|string>", [keys], arguments.length);
    this[kPopulateParserHintArray]("boolean", keys);
    this[kTrackManuallySetKeys](keys);
    return this;
  }
  check(f, global) {
    argsert("<function> [boolean]", [f, global], arguments.length);
    this.middleware((argv, _yargs) => {
      return maybeAsyncResult(() => {
        return f(argv, _yargs.getOptions());
      }, (result) => {
        if (!result) {
          __classPrivateFieldGet(this, _YargsInstance_usage, "f").fail(__classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.__("Argument check failed: %s", f.toString()));
        } else if (typeof result === "string" || result instanceof Error) {
          __classPrivateFieldGet(this, _YargsInstance_usage, "f").fail(result.toString(), result);
        }
        return argv;
      }, (err) => {
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").fail(err.message ? err.message : err.toString(), err);
        return argv;
      });
    }, false, global);
    return this;
  }
  choices(key, value) {
    argsert("<object|string|array> [string|array]", [key, value], arguments.length);
    this[kPopulateParserHintArrayDictionary](this.choices.bind(this), "choices", key, value);
    return this;
  }
  coerce(keys, value) {
    argsert("<object|string|array> [function]", [keys, value], arguments.length);
    if (Array.isArray(keys)) {
      if (!value) {
        throw new YError("coerce callback must be provided");
      }
      for (const key of keys) {
        this.coerce(key, value);
      }
      return this;
    } else if (typeof keys === "object") {
      for (const key of Object.keys(keys)) {
        this.coerce(key, keys[key]);
      }
      return this;
    }
    if (!value) {
      throw new YError("coerce callback must be provided");
    }
    __classPrivateFieldGet(this, _YargsInstance_options, "f").key[keys] = true;
    __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").addCoerceMiddleware((argv, yargs) => {
      let aliases;
      const shouldCoerce = Object.prototype.hasOwnProperty.call(argv, keys);
      if (!shouldCoerce) {
        return argv;
      }
      return maybeAsyncResult(() => {
        aliases = yargs.getAliases();
        return value(argv[keys]);
      }, (result) => {
        argv[keys] = result;
        const stripAliased = yargs.getInternalMethods().getParserConfiguration()["strip-aliased"];
        if (aliases[keys] && stripAliased !== true) {
          for (const alias of aliases[keys]) {
            argv[alias] = result;
          }
        }
        return argv;
      }, (err) => {
        throw new YError(err.message);
      });
    }, keys);
    return this;
  }
  conflicts(key1, key2) {
    argsert("<string|object> [string|array]", [key1, key2], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_validation, "f").conflicts(key1, key2);
    return this;
  }
  config(key = "config", msg, parseFn) {
    argsert("[object|string] [string|function] [function]", [key, msg, parseFn], arguments.length);
    if (typeof key === "object" && !Array.isArray(key)) {
      key = applyExtends(key, __classPrivateFieldGet(this, _YargsInstance_cwd, "f"), this[kGetParserConfiguration]()["deep-merge-config"] || false, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects = (__classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects || []).concat(key);
      return this;
    }
    if (typeof msg === "function") {
      parseFn = msg;
      msg = undefined;
    }
    this.describe(key, msg || __classPrivateFieldGet(this, _YargsInstance_usage, "f").deferY18nLookup("Path to JSON config file"));
    (Array.isArray(key) ? key : [key]).forEach((k) => {
      __classPrivateFieldGet(this, _YargsInstance_options, "f").config[k] = parseFn || true;
    });
    return this;
  }
  completion(cmd, desc, fn) {
    argsert("[string] [string|boolean|function] [function]", [cmd, desc, fn], arguments.length);
    if (typeof desc === "function") {
      fn = desc;
      desc = undefined;
    }
    __classPrivateFieldSet(this, _YargsInstance_completionCommand, cmd || __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f") || "completion", "f");
    if (!desc && desc !== false) {
      desc = "generate completion script";
    }
    this.command(__classPrivateFieldGet(this, _YargsInstance_completionCommand, "f"), desc);
    if (fn)
      __classPrivateFieldGet(this, _YargsInstance_completion, "f").registerFunction(fn);
    return this;
  }
  command(cmd, description, builder, handler, middlewares, deprecated) {
    argsert("<string|array|object> [string|boolean] [function|object] [function] [array] [boolean|string]", [cmd, description, builder, handler, middlewares, deprecated], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_command, "f").addHandler(cmd, description, builder, handler, middlewares, deprecated);
    return this;
  }
  commands(cmd, description, builder, handler, middlewares, deprecated) {
    return this.command(cmd, description, builder, handler, middlewares, deprecated);
  }
  commandDir(dir, opts) {
    argsert("<string> [object]", [dir, opts], arguments.length);
    const req = __classPrivateFieldGet(this, _YargsInstance_parentRequire, "f") || __classPrivateFieldGet(this, _YargsInstance_shim, "f").require;
    __classPrivateFieldGet(this, _YargsInstance_command, "f").addDirectory(dir, req, __classPrivateFieldGet(this, _YargsInstance_shim, "f").getCallerFile(), opts);
    return this;
  }
  count(keys) {
    argsert("<array|string>", [keys], arguments.length);
    this[kPopulateParserHintArray]("count", keys);
    this[kTrackManuallySetKeys](keys);
    return this;
  }
  default(key, value, defaultDescription) {
    argsert("<object|string|array> [*] [string]", [key, value, defaultDescription], arguments.length);
    if (defaultDescription) {
      assertSingleKey(key, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      __classPrivateFieldGet(this, _YargsInstance_options, "f").defaultDescription[key] = defaultDescription;
    }
    if (typeof value === "function") {
      assertSingleKey(key, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      if (!__classPrivateFieldGet(this, _YargsInstance_options, "f").defaultDescription[key])
        __classPrivateFieldGet(this, _YargsInstance_options, "f").defaultDescription[key] = __classPrivateFieldGet(this, _YargsInstance_usage, "f").functionDescription(value);
      value = value.call();
    }
    this[kPopulateParserHintSingleValueDictionary](this.default.bind(this), "default", key, value);
    return this;
  }
  defaults(key, value, defaultDescription) {
    return this.default(key, value, defaultDescription);
  }
  demandCommand(min = 1, max, minMsg, maxMsg) {
    argsert("[number] [number|string] [string|null|undefined] [string|null|undefined]", [min, max, minMsg, maxMsg], arguments.length);
    if (typeof max !== "number") {
      minMsg = max;
      max = Infinity;
    }
    this.global("_", false);
    __classPrivateFieldGet(this, _YargsInstance_options, "f").demandedCommands._ = {
      min,
      max,
      minMsg,
      maxMsg
    };
    return this;
  }
  demand(keys, max, msg) {
    if (Array.isArray(max)) {
      max.forEach((key) => {
        assertNotStrictEqual(msg, true, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
        this.demandOption(key, msg);
      });
      max = Infinity;
    } else if (typeof max !== "number") {
      msg = max;
      max = Infinity;
    }
    if (typeof keys === "number") {
      assertNotStrictEqual(msg, true, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      this.demandCommand(keys, max, msg, msg);
    } else if (Array.isArray(keys)) {
      keys.forEach((key) => {
        assertNotStrictEqual(msg, true, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
        this.demandOption(key, msg);
      });
    } else {
      if (typeof msg === "string") {
        this.demandOption(keys, msg);
      } else if (msg === true || typeof msg === "undefined") {
        this.demandOption(keys);
      }
    }
    return this;
  }
  demandOption(keys, msg) {
    argsert("<object|string|array> [string]", [keys, msg], arguments.length);
    this[kPopulateParserHintSingleValueDictionary](this.demandOption.bind(this), "demandedOptions", keys, msg);
    return this;
  }
  deprecateOption(option, message) {
    argsert("<string> [string|boolean]", [option, message], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_options, "f").deprecatedOptions[option] = message;
    return this;
  }
  describe(keys, description) {
    argsert("<object|string|array> [string]", [keys, description], arguments.length);
    this[kSetKey](keys, true);
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").describe(keys, description);
    return this;
  }
  detectLocale(detect) {
    argsert("<boolean>", [detect], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_detectLocale, detect, "f");
    return this;
  }
  env(prefix) {
    argsert("[string|boolean]", [prefix], arguments.length);
    if (prefix === false)
      delete __classPrivateFieldGet(this, _YargsInstance_options, "f").envPrefix;
    else
      __classPrivateFieldGet(this, _YargsInstance_options, "f").envPrefix = prefix || "";
    return this;
  }
  epilogue(msg) {
    argsert("<string>", [msg], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").epilog(msg);
    return this;
  }
  epilog(msg) {
    return this.epilogue(msg);
  }
  example(cmd, description) {
    argsert("<string|array> [string]", [cmd, description], arguments.length);
    if (Array.isArray(cmd)) {
      cmd.forEach((exampleParams) => this.example(...exampleParams));
    } else {
      __classPrivateFieldGet(this, _YargsInstance_usage, "f").example(cmd, description);
    }
    return this;
  }
  exit(code, err) {
    __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
    __classPrivateFieldSet(this, _YargsInstance_exitError, err, "f");
    if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
      __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.exit(code);
  }
  exitProcess(enabled = true) {
    argsert("[boolean]", [enabled], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_exitProcess, enabled, "f");
    return this;
  }
  fail(f) {
    argsert("<function|boolean>", [f], arguments.length);
    if (typeof f === "boolean" && f !== false) {
      throw new YError("Invalid first argument. Expected function or boolean 'false'");
    }
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").failFn(f);
    return this;
  }
  getAliases() {
    return this.parsed ? this.parsed.aliases : {};
  }
  async getCompletion(args, done) {
    argsert("<array> [function]", [args, done], arguments.length);
    if (!done) {
      return new Promise((resolve5, reject) => {
        __classPrivateFieldGet(this, _YargsInstance_completion, "f").getCompletion(args, (err, completions) => {
          if (err)
            reject(err);
          else
            resolve5(completions);
        });
      });
    } else {
      return __classPrivateFieldGet(this, _YargsInstance_completion, "f").getCompletion(args, done);
    }
  }
  getDemandedOptions() {
    argsert([], 0);
    return __classPrivateFieldGet(this, _YargsInstance_options, "f").demandedOptions;
  }
  getDemandedCommands() {
    argsert([], 0);
    return __classPrivateFieldGet(this, _YargsInstance_options, "f").demandedCommands;
  }
  getDeprecatedOptions() {
    argsert([], 0);
    return __classPrivateFieldGet(this, _YargsInstance_options, "f").deprecatedOptions;
  }
  getDetectLocale() {
    return __classPrivateFieldGet(this, _YargsInstance_detectLocale, "f");
  }
  getExitProcess() {
    return __classPrivateFieldGet(this, _YargsInstance_exitProcess, "f");
  }
  getGroups() {
    return Object.assign({}, __classPrivateFieldGet(this, _YargsInstance_groups, "f"), __classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f"));
  }
  getHelp() {
    __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
    if (!__classPrivateFieldGet(this, _YargsInstance_usage, "f").hasCachedHelpMessage()) {
      if (!this.parsed) {
        const parse = this[kRunYargsParserAndExecuteCommands](__classPrivateFieldGet(this, _YargsInstance_processArgs, "f"), undefined, undefined, 0, true);
        if (isPromise(parse)) {
          return parse.then(() => {
            return __classPrivateFieldGet(this, _YargsInstance_usage, "f").help();
          });
        }
      }
      const builderResponse = __classPrivateFieldGet(this, _YargsInstance_command, "f").runDefaultBuilderOn(this);
      if (isPromise(builderResponse)) {
        return builderResponse.then(() => {
          return __classPrivateFieldGet(this, _YargsInstance_usage, "f").help();
        });
      }
    }
    return Promise.resolve(__classPrivateFieldGet(this, _YargsInstance_usage, "f").help());
  }
  getOptions() {
    return __classPrivateFieldGet(this, _YargsInstance_options, "f");
  }
  getStrict() {
    return __classPrivateFieldGet(this, _YargsInstance_strict, "f");
  }
  getStrictCommands() {
    return __classPrivateFieldGet(this, _YargsInstance_strictCommands, "f");
  }
  getStrictOptions() {
    return __classPrivateFieldGet(this, _YargsInstance_strictOptions, "f");
  }
  global(globals, global) {
    argsert("<string|array> [boolean]", [globals, global], arguments.length);
    globals = [].concat(globals);
    if (global !== false) {
      __classPrivateFieldGet(this, _YargsInstance_options, "f").local = __classPrivateFieldGet(this, _YargsInstance_options, "f").local.filter((l) => globals.indexOf(l) === -1);
    } else {
      globals.forEach((g) => {
        if (!__classPrivateFieldGet(this, _YargsInstance_options, "f").local.includes(g))
          __classPrivateFieldGet(this, _YargsInstance_options, "f").local.push(g);
      });
    }
    return this;
  }
  group(opts, groupName) {
    argsert("<string|array> <string>", [opts, groupName], arguments.length);
    const existing = __classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f")[groupName] || __classPrivateFieldGet(this, _YargsInstance_groups, "f")[groupName];
    if (__classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f")[groupName]) {
      delete __classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f")[groupName];
    }
    const seen = {};
    __classPrivateFieldGet(this, _YargsInstance_groups, "f")[groupName] = (existing || []).concat(opts).filter((key) => {
      if (seen[key])
        return false;
      return seen[key] = true;
    });
    return this;
  }
  hide(key) {
    argsert("<string>", [key], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_options, "f").hiddenOptions.push(key);
    return this;
  }
  implies(key, value) {
    argsert("<string|object> [number|string|array]", [key, value], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_validation, "f").implies(key, value);
    return this;
  }
  locale(locale) {
    argsert("[string]", [locale], arguments.length);
    if (locale === undefined) {
      this[kGuessLocale]();
      return __classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.getLocale();
    }
    __classPrivateFieldSet(this, _YargsInstance_detectLocale, false, "f");
    __classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.setLocale(locale);
    return this;
  }
  middleware(callback, applyBeforeValidation, global) {
    return __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").addMiddleware(callback, !!applyBeforeValidation, global);
  }
  nargs(key, value) {
    argsert("<string|object|array> [number]", [key, value], arguments.length);
    this[kPopulateParserHintSingleValueDictionary](this.nargs.bind(this), "narg", key, value);
    return this;
  }
  normalize(keys) {
    argsert("<array|string>", [keys], arguments.length);
    this[kPopulateParserHintArray]("normalize", keys);
    return this;
  }
  number(keys) {
    argsert("<array|string>", [keys], arguments.length);
    this[kPopulateParserHintArray]("number", keys);
    this[kTrackManuallySetKeys](keys);
    return this;
  }
  option(key, opt) {
    argsert("<string|object> [object]", [key, opt], arguments.length);
    if (typeof key === "object") {
      Object.keys(key).forEach((k) => {
        this.options(k, key[k]);
      });
    } else {
      if (typeof opt !== "object") {
        opt = {};
      }
      this[kTrackManuallySetKeys](key);
      if (__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f") && (key === "version" || (opt === null || opt === undefined ? undefined : opt.alias) === "version")) {
        this[kEmitWarning]([
          '"version" is a reserved word.',
          "Please do one of the following:",
          '- Disable version with `yargs.version(false)` if using "version" as an option',
          "- Use the built-in `yargs.version` method instead (if applicable)",
          "- Use a different option key",
          "https://yargs.js.org/docs/#api-reference-version"
        ].join("\n"), undefined, "versionWarning");
      }
      __classPrivateFieldGet(this, _YargsInstance_options, "f").key[key] = true;
      if (opt.alias)
        this.alias(key, opt.alias);
      const deprecate = opt.deprecate || opt.deprecated;
      if (deprecate) {
        this.deprecateOption(key, deprecate);
      }
      const demand = opt.demand || opt.required || opt.require;
      if (demand) {
        this.demand(key, demand);
      }
      if (opt.demandOption) {
        this.demandOption(key, typeof opt.demandOption === "string" ? opt.demandOption : undefined);
      }
      if (opt.conflicts) {
        this.conflicts(key, opt.conflicts);
      }
      if ("default" in opt) {
        this.default(key, opt.default);
      }
      if (opt.implies !== undefined) {
        this.implies(key, opt.implies);
      }
      if (opt.nargs !== undefined) {
        this.nargs(key, opt.nargs);
      }
      if (opt.config) {
        this.config(key, opt.configParser);
      }
      if (opt.normalize) {
        this.normalize(key);
      }
      if (opt.choices) {
        this.choices(key, opt.choices);
      }
      if (opt.coerce) {
        this.coerce(key, opt.coerce);
      }
      if (opt.group) {
        this.group(key, opt.group);
      }
      if (opt.boolean || opt.type === "boolean") {
        this.boolean(key);
        if (opt.alias)
          this.boolean(opt.alias);
      }
      if (opt.array || opt.type === "array") {
        this.array(key);
        if (opt.alias)
          this.array(opt.alias);
      }
      if (opt.number || opt.type === "number") {
        this.number(key);
        if (opt.alias)
          this.number(opt.alias);
      }
      if (opt.string || opt.type === "string") {
        this.string(key);
        if (opt.alias)
          this.string(opt.alias);
      }
      if (opt.count || opt.type === "count") {
        this.count(key);
      }
      if (typeof opt.global === "boolean") {
        this.global(key, opt.global);
      }
      if (opt.defaultDescription) {
        __classPrivateFieldGet(this, _YargsInstance_options, "f").defaultDescription[key] = opt.defaultDescription;
      }
      if (opt.skipValidation) {
        this.skipValidation(key);
      }
      const desc = opt.describe || opt.description || opt.desc;
      const descriptions = __classPrivateFieldGet(this, _YargsInstance_usage, "f").getDescriptions();
      if (!Object.prototype.hasOwnProperty.call(descriptions, key) || typeof desc === "string") {
        this.describe(key, desc);
      }
      if (opt.hidden) {
        this.hide(key);
      }
      if (opt.requiresArg) {
        this.requiresArg(key);
      }
    }
    return this;
  }
  options(key, opt) {
    return this.option(key, opt);
  }
  parse(args, shortCircuit, _parseFn) {
    argsert("[string|array] [function|boolean|object] [function]", [args, shortCircuit, _parseFn], arguments.length);
    this[kFreeze]();
    if (typeof args === "undefined") {
      args = __classPrivateFieldGet(this, _YargsInstance_processArgs, "f");
    }
    if (typeof shortCircuit === "object") {
      __classPrivateFieldSet(this, _YargsInstance_parseContext, shortCircuit, "f");
      shortCircuit = _parseFn;
    }
    if (typeof shortCircuit === "function") {
      __classPrivateFieldSet(this, _YargsInstance_parseFn, shortCircuit, "f");
      shortCircuit = false;
    }
    if (!shortCircuit)
      __classPrivateFieldSet(this, _YargsInstance_processArgs, args, "f");
    if (__classPrivateFieldGet(this, _YargsInstance_parseFn, "f"))
      __classPrivateFieldSet(this, _YargsInstance_exitProcess, false, "f");
    const parsed = this[kRunYargsParserAndExecuteCommands](args, !!shortCircuit);
    const tmpParsed = this.parsed;
    __classPrivateFieldGet(this, _YargsInstance_completion, "f").setParsed(this.parsed);
    if (isPromise(parsed)) {
      return parsed.then((argv) => {
        if (__classPrivateFieldGet(this, _YargsInstance_parseFn, "f"))
          __classPrivateFieldGet(this, _YargsInstance_parseFn, "f").call(this, __classPrivateFieldGet(this, _YargsInstance_exitError, "f"), argv, __classPrivateFieldGet(this, _YargsInstance_output, "f"));
        return argv;
      }).catch((err) => {
        if (__classPrivateFieldGet(this, _YargsInstance_parseFn, "f")) {
          __classPrivateFieldGet(this, _YargsInstance_parseFn, "f")(err, this.parsed.argv, __classPrivateFieldGet(this, _YargsInstance_output, "f"));
        }
        throw err;
      }).finally(() => {
        this[kUnfreeze]();
        this.parsed = tmpParsed;
      });
    } else {
      if (__classPrivateFieldGet(this, _YargsInstance_parseFn, "f"))
        __classPrivateFieldGet(this, _YargsInstance_parseFn, "f").call(this, __classPrivateFieldGet(this, _YargsInstance_exitError, "f"), parsed, __classPrivateFieldGet(this, _YargsInstance_output, "f"));
      this[kUnfreeze]();
      this.parsed = tmpParsed;
    }
    return parsed;
  }
  parseAsync(args, shortCircuit, _parseFn) {
    const maybePromise = this.parse(args, shortCircuit, _parseFn);
    return !isPromise(maybePromise) ? Promise.resolve(maybePromise) : maybePromise;
  }
  parseSync(args, shortCircuit, _parseFn) {
    const maybePromise = this.parse(args, shortCircuit, _parseFn);
    if (isPromise(maybePromise)) {
      throw new YError(".parseSync() must not be used with asynchronous builders, handlers, or middleware");
    }
    return maybePromise;
  }
  parserConfiguration(config) {
    argsert("<object>", [config], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_parserConfig, config, "f");
    return this;
  }
  pkgConf(key, rootPath) {
    argsert("<string> [string]", [key, rootPath], arguments.length);
    let conf = null;
    const obj = this[kPkgUp](rootPath || __classPrivateFieldGet(this, _YargsInstance_cwd, "f"));
    if (obj[key] && typeof obj[key] === "object") {
      conf = applyExtends(obj[key], rootPath || __classPrivateFieldGet(this, _YargsInstance_cwd, "f"), this[kGetParserConfiguration]()["deep-merge-config"] || false, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects = (__classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects || []).concat(conf);
    }
    return this;
  }
  positional(key, opts) {
    argsert("<string> <object>", [key, opts], arguments.length);
    const supportedOpts = [
      "default",
      "defaultDescription",
      "implies",
      "normalize",
      "choices",
      "conflicts",
      "coerce",
      "type",
      "describe",
      "desc",
      "description",
      "alias"
    ];
    opts = objFilter(opts, (k, v) => {
      if (k === "type" && !["string", "number", "boolean"].includes(v))
        return false;
      return supportedOpts.includes(k);
    });
    const fullCommand = __classPrivateFieldGet(this, _YargsInstance_context, "f").fullCommands[__classPrivateFieldGet(this, _YargsInstance_context, "f").fullCommands.length - 1];
    const parseOptions = fullCommand ? __classPrivateFieldGet(this, _YargsInstance_command, "f").cmdToParseOptions(fullCommand) : {
      array: [],
      alias: {},
      default: {},
      demand: {}
    };
    objectKeys(parseOptions).forEach((pk) => {
      const parseOption = parseOptions[pk];
      if (Array.isArray(parseOption)) {
        if (parseOption.indexOf(key) !== -1)
          opts[pk] = true;
      } else {
        if (parseOption[key] && !(pk in opts))
          opts[pk] = parseOption[key];
      }
    });
    this.group(key, __classPrivateFieldGet(this, _YargsInstance_usage, "f").getPositionalGroupName());
    return this.option(key, opts);
  }
  recommendCommands(recommend = true) {
    argsert("[boolean]", [recommend], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_recommendCommands, recommend, "f");
    return this;
  }
  required(keys, max, msg) {
    return this.demand(keys, max, msg);
  }
  require(keys, max, msg) {
    return this.demand(keys, max, msg);
  }
  requiresArg(keys) {
    argsert("<array|string|object> [number]", [keys], arguments.length);
    if (typeof keys === "string" && __classPrivateFieldGet(this, _YargsInstance_options, "f").narg[keys]) {
      return this;
    } else {
      this[kPopulateParserHintSingleValueDictionary](this.requiresArg.bind(this), "narg", keys, NaN);
    }
    return this;
  }
  showCompletionScript($0, cmd) {
    argsert("[string] [string]", [$0, cmd], arguments.length);
    $0 = $0 || this.$0;
    __classPrivateFieldGet(this, _YargsInstance_logger, "f").log(__classPrivateFieldGet(this, _YargsInstance_completion, "f").generateCompletionScript($0, cmd || __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f") || "completion"));
    return this;
  }
  showHelp(level) {
    argsert("[string|function]", [level], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
    if (!__classPrivateFieldGet(this, _YargsInstance_usage, "f").hasCachedHelpMessage()) {
      if (!this.parsed) {
        const parse = this[kRunYargsParserAndExecuteCommands](__classPrivateFieldGet(this, _YargsInstance_processArgs, "f"), undefined, undefined, 0, true);
        if (isPromise(parse)) {
          parse.then(() => {
            __classPrivateFieldGet(this, _YargsInstance_usage, "f").showHelp(level);
          });
          return this;
        }
      }
      const builderResponse = __classPrivateFieldGet(this, _YargsInstance_command, "f").runDefaultBuilderOn(this);
      if (isPromise(builderResponse)) {
        builderResponse.then(() => {
          __classPrivateFieldGet(this, _YargsInstance_usage, "f").showHelp(level);
        });
        return this;
      }
    }
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").showHelp(level);
    return this;
  }
  scriptName(scriptName) {
    this.customScriptName = true;
    this.$0 = scriptName;
    return this;
  }
  showHelpOnFail(enabled, message) {
    argsert("[boolean|string] [string]", [enabled, message], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").showHelpOnFail(enabled, message);
    return this;
  }
  showVersion(level) {
    argsert("[string|function]", [level], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").showVersion(level);
    return this;
  }
  skipValidation(keys) {
    argsert("<array|string>", [keys], arguments.length);
    this[kPopulateParserHintArray]("skipValidation", keys);
    return this;
  }
  strict(enabled) {
    argsert("[boolean]", [enabled], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_strict, enabled !== false, "f");
    return this;
  }
  strictCommands(enabled) {
    argsert("[boolean]", [enabled], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_strictCommands, enabled !== false, "f");
    return this;
  }
  strictOptions(enabled) {
    argsert("[boolean]", [enabled], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_strictOptions, enabled !== false, "f");
    return this;
  }
  string(keys) {
    argsert("<array|string>", [keys], arguments.length);
    this[kPopulateParserHintArray]("string", keys);
    this[kTrackManuallySetKeys](keys);
    return this;
  }
  terminalWidth() {
    argsert([], 0);
    return __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.stdColumns;
  }
  updateLocale(obj) {
    return this.updateStrings(obj);
  }
  updateStrings(obj) {
    argsert("<object>", [obj], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_detectLocale, false, "f");
    __classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.updateLocale(obj);
    return this;
  }
  usage(msg, description, builder, handler) {
    argsert("<string|null|undefined> [string|boolean] [function|object] [function]", [msg, description, builder, handler], arguments.length);
    if (description !== undefined) {
      assertNotStrictEqual(msg, null, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      if ((msg || "").match(/^\$0( |$)/)) {
        return this.command(msg, description, builder, handler);
      } else {
        throw new YError(".usage() description must start with $0 if being used as alias for .command()");
      }
    } else {
      __classPrivateFieldGet(this, _YargsInstance_usage, "f").usage(msg);
      return this;
    }
  }
  usageConfiguration(config) {
    argsert("<object>", [config], arguments.length);
    __classPrivateFieldSet(this, _YargsInstance_usageConfig, config, "f");
    return this;
  }
  version(opt, msg, ver) {
    const defaultVersionOpt = "version";
    argsert("[boolean|string] [string] [string]", [opt, msg, ver], arguments.length);
    if (__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f")) {
      this[kDeleteFromParserHintObject](__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f"));
      __classPrivateFieldGet(this, _YargsInstance_usage, "f").version(undefined);
      __classPrivateFieldSet(this, _YargsInstance_versionOpt, null, "f");
    }
    if (arguments.length === 0) {
      ver = this[kGuessVersion]();
      opt = defaultVersionOpt;
    } else if (arguments.length === 1) {
      if (opt === false) {
        return this;
      }
      ver = opt;
      opt = defaultVersionOpt;
    } else if (arguments.length === 2) {
      ver = msg;
      msg = undefined;
    }
    __classPrivateFieldSet(this, _YargsInstance_versionOpt, typeof opt === "string" ? opt : defaultVersionOpt, "f");
    msg = msg || __classPrivateFieldGet(this, _YargsInstance_usage, "f").deferY18nLookup("Show version number");
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").version(ver || undefined);
    this.boolean(__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f"));
    this.describe(__classPrivateFieldGet(this, _YargsInstance_versionOpt, "f"), msg);
    return this;
  }
  wrap(cols) {
    argsert("<number|null|undefined>", [cols], arguments.length);
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").wrap(cols);
    return this;
  }
  [(_YargsInstance_command = new WeakMap, _YargsInstance_cwd = new WeakMap, _YargsInstance_context = new WeakMap, _YargsInstance_completion = new WeakMap, _YargsInstance_completionCommand = new WeakMap, _YargsInstance_defaultShowHiddenOpt = new WeakMap, _YargsInstance_exitError = new WeakMap, _YargsInstance_detectLocale = new WeakMap, _YargsInstance_emittedWarnings = new WeakMap, _YargsInstance_exitProcess = new WeakMap, _YargsInstance_frozens = new WeakMap, _YargsInstance_globalMiddleware = new WeakMap, _YargsInstance_groups = new WeakMap, _YargsInstance_hasOutput = new WeakMap, _YargsInstance_helpOpt = new WeakMap, _YargsInstance_isGlobalContext = new WeakMap, _YargsInstance_logger = new WeakMap, _YargsInstance_output = new WeakMap, _YargsInstance_options = new WeakMap, _YargsInstance_parentRequire = new WeakMap, _YargsInstance_parserConfig = new WeakMap, _YargsInstance_parseFn = new WeakMap, _YargsInstance_parseContext = new WeakMap, _YargsInstance_pkgs = new WeakMap, _YargsInstance_preservedGroups = new WeakMap, _YargsInstance_processArgs = new WeakMap, _YargsInstance_recommendCommands = new WeakMap, _YargsInstance_shim = new WeakMap, _YargsInstance_strict = new WeakMap, _YargsInstance_strictCommands = new WeakMap, _YargsInstance_strictOptions = new WeakMap, _YargsInstance_usage = new WeakMap, _YargsInstance_usageConfig = new WeakMap, _YargsInstance_versionOpt = new WeakMap, _YargsInstance_validation = new WeakMap, kCopyDoubleDash)](argv) {
    if (!argv._ || !argv["--"])
      return argv;
    argv._.push.apply(argv._, argv["--"]);
    try {
      delete argv["--"];
    } catch (_err) {
    }
    return argv;
  }
  [kCreateLogger]() {
    return {
      log: (...args) => {
        if (!this[kHasParseCallback]())
          console.log(...args);
        __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
        if (__classPrivateFieldGet(this, _YargsInstance_output, "f").length)
          __classPrivateFieldSet(this, _YargsInstance_output, __classPrivateFieldGet(this, _YargsInstance_output, "f") + "\n", "f");
        __classPrivateFieldSet(this, _YargsInstance_output, __classPrivateFieldGet(this, _YargsInstance_output, "f") + args.join(" "), "f");
      },
      error: (...args) => {
        if (!this[kHasParseCallback]())
          console.error(...args);
        __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
        if (__classPrivateFieldGet(this, _YargsInstance_output, "f").length)
          __classPrivateFieldSet(this, _YargsInstance_output, __classPrivateFieldGet(this, _YargsInstance_output, "f") + "\n", "f");
        __classPrivateFieldSet(this, _YargsInstance_output, __classPrivateFieldGet(this, _YargsInstance_output, "f") + args.join(" "), "f");
      }
    };
  }
  [kDeleteFromParserHintObject](optionKey) {
    objectKeys(__classPrivateFieldGet(this, _YargsInstance_options, "f")).forEach((hintKey) => {
      if (((key) => key === "configObjects")(hintKey))
        return;
      const hint = __classPrivateFieldGet(this, _YargsInstance_options, "f")[hintKey];
      if (Array.isArray(hint)) {
        if (hint.includes(optionKey))
          hint.splice(hint.indexOf(optionKey), 1);
      } else if (typeof hint === "object") {
        delete hint[optionKey];
      }
    });
    delete __classPrivateFieldGet(this, _YargsInstance_usage, "f").getDescriptions()[optionKey];
  }
  [kEmitWarning](warning, type, deduplicationId) {
    if (!__classPrivateFieldGet(this, _YargsInstance_emittedWarnings, "f")[deduplicationId]) {
      __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.emitWarning(warning, type);
      __classPrivateFieldGet(this, _YargsInstance_emittedWarnings, "f")[deduplicationId] = true;
    }
  }
  [kFreeze]() {
    __classPrivateFieldGet(this, _YargsInstance_frozens, "f").push({
      options: __classPrivateFieldGet(this, _YargsInstance_options, "f"),
      configObjects: __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects.slice(0),
      exitProcess: __classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"),
      groups: __classPrivateFieldGet(this, _YargsInstance_groups, "f"),
      strict: __classPrivateFieldGet(this, _YargsInstance_strict, "f"),
      strictCommands: __classPrivateFieldGet(this, _YargsInstance_strictCommands, "f"),
      strictOptions: __classPrivateFieldGet(this, _YargsInstance_strictOptions, "f"),
      completionCommand: __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f"),
      output: __classPrivateFieldGet(this, _YargsInstance_output, "f"),
      exitError: __classPrivateFieldGet(this, _YargsInstance_exitError, "f"),
      hasOutput: __classPrivateFieldGet(this, _YargsInstance_hasOutput, "f"),
      parsed: this.parsed,
      parseFn: __classPrivateFieldGet(this, _YargsInstance_parseFn, "f"),
      parseContext: __classPrivateFieldGet(this, _YargsInstance_parseContext, "f")
    });
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").freeze();
    __classPrivateFieldGet(this, _YargsInstance_validation, "f").freeze();
    __classPrivateFieldGet(this, _YargsInstance_command, "f").freeze();
    __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").freeze();
  }
  [kGetDollarZero]() {
    let $0 = "";
    let default$0;
    if (/\b(node|iojs|electron)(\.exe)?$/.test(__classPrivateFieldGet(this, _YargsInstance_shim, "f").process.argv()[0])) {
      default$0 = __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.argv().slice(1, 2);
    } else {
      default$0 = __classPrivateFieldGet(this, _YargsInstance_shim, "f").process.argv().slice(0, 1);
    }
    $0 = default$0.map((x) => {
      const b = this[kRebase](__classPrivateFieldGet(this, _YargsInstance_cwd, "f"), x);
      return x.match(/^(\/|([a-zA-Z]:)?\\)/) && b.length < x.length ? b : x;
    }).join(" ").trim();
    if (__classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("_") && __classPrivateFieldGet(this, _YargsInstance_shim, "f").getProcessArgvBin() === __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("_")) {
      $0 = __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("_").replace(`${__classPrivateFieldGet(this, _YargsInstance_shim, "f").path.dirname(__classPrivateFieldGet(this, _YargsInstance_shim, "f").process.execPath())}/`, "");
    }
    return $0;
  }
  [kGetParserConfiguration]() {
    return __classPrivateFieldGet(this, _YargsInstance_parserConfig, "f");
  }
  [kGetUsageConfiguration]() {
    return __classPrivateFieldGet(this, _YargsInstance_usageConfig, "f");
  }
  [kGuessLocale]() {
    if (!__classPrivateFieldGet(this, _YargsInstance_detectLocale, "f"))
      return;
    const locale = __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("LC_ALL") || __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("LC_MESSAGES") || __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("LANG") || __classPrivateFieldGet(this, _YargsInstance_shim, "f").getEnv("LANGUAGE") || "en_US";
    this.locale(locale.replace(/[.:].*/, ""));
  }
  [kGuessVersion]() {
    const obj = this[kPkgUp]();
    return obj.version || "unknown";
  }
  [kParsePositionalNumbers](argv) {
    const args = argv["--"] ? argv["--"] : argv._;
    for (let i = 0, arg;(arg = args[i]) !== undefined; i++) {
      if (__classPrivateFieldGet(this, _YargsInstance_shim, "f").Parser.looksLikeNumber(arg) && Number.isSafeInteger(Math.floor(parseFloat(`${arg}`)))) {
        args[i] = Number(arg);
      }
    }
    return argv;
  }
  [kPkgUp](rootPath) {
    const npath = rootPath || "*";
    if (__classPrivateFieldGet(this, _YargsInstance_pkgs, "f")[npath])
      return __classPrivateFieldGet(this, _YargsInstance_pkgs, "f")[npath];
    let obj = {};
    try {
      let startDir = rootPath || __classPrivateFieldGet(this, _YargsInstance_shim, "f").mainFilename;
      if (!rootPath && __classPrivateFieldGet(this, _YargsInstance_shim, "f").path.extname(startDir)) {
        startDir = __classPrivateFieldGet(this, _YargsInstance_shim, "f").path.dirname(startDir);
      }
      const pkgJsonPath = __classPrivateFieldGet(this, _YargsInstance_shim, "f").findUp(startDir, (dir, names) => {
        if (names.includes("package.json")) {
          return "package.json";
        } else {
          return;
        }
      });
      assertNotStrictEqual(pkgJsonPath, undefined, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
      obj = JSON.parse(__classPrivateFieldGet(this, _YargsInstance_shim, "f").readFileSync(pkgJsonPath, "utf8"));
    } catch (_noop) {
    }
    __classPrivateFieldGet(this, _YargsInstance_pkgs, "f")[npath] = obj || {};
    return __classPrivateFieldGet(this, _YargsInstance_pkgs, "f")[npath];
  }
  [kPopulateParserHintArray](type, keys) {
    keys = [].concat(keys);
    keys.forEach((key) => {
      key = this[kSanitizeKey](key);
      __classPrivateFieldGet(this, _YargsInstance_options, "f")[type].push(key);
    });
  }
  [kPopulateParserHintSingleValueDictionary](builder, type, key, value) {
    this[kPopulateParserHintDictionary](builder, type, key, value, (type2, key2, value2) => {
      __classPrivateFieldGet(this, _YargsInstance_options, "f")[type2][key2] = value2;
    });
  }
  [kPopulateParserHintArrayDictionary](builder, type, key, value) {
    this[kPopulateParserHintDictionary](builder, type, key, value, (type2, key2, value2) => {
      __classPrivateFieldGet(this, _YargsInstance_options, "f")[type2][key2] = (__classPrivateFieldGet(this, _YargsInstance_options, "f")[type2][key2] || []).concat(value2);
    });
  }
  [kPopulateParserHintDictionary](builder, type, key, value, singleKeyHandler) {
    if (Array.isArray(key)) {
      key.forEach((k) => {
        builder(k, value);
      });
    } else if (((key2) => typeof key2 === "object")(key)) {
      for (const k of objectKeys(key)) {
        builder(k, key[k]);
      }
    } else {
      singleKeyHandler(type, this[kSanitizeKey](key), value);
    }
  }
  [kSanitizeKey](key) {
    if (key === "__proto__")
      return "___proto___";
    return key;
  }
  [kSetKey](key, set) {
    this[kPopulateParserHintSingleValueDictionary](this[kSetKey].bind(this), "key", key, set);
    return this;
  }
  [kUnfreeze]() {
    var _a2, _b2, _c2, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const frozen = __classPrivateFieldGet(this, _YargsInstance_frozens, "f").pop();
    assertNotStrictEqual(frozen, undefined, __classPrivateFieldGet(this, _YargsInstance_shim, "f"));
    let configObjects;
    _a2 = this, _b2 = this, _c2 = this, _d = this, _e = this, _f = this, _g = this, _h = this, _j = this, _k = this, _l = this, _m = this, {
      options: { set value(_o) {
        __classPrivateFieldSet(_a2, _YargsInstance_options, _o, "f");
      } }.value,
      configObjects,
      exitProcess: { set value(_o) {
        __classPrivateFieldSet(_b2, _YargsInstance_exitProcess, _o, "f");
      } }.value,
      groups: { set value(_o) {
        __classPrivateFieldSet(_c2, _YargsInstance_groups, _o, "f");
      } }.value,
      output: { set value(_o) {
        __classPrivateFieldSet(_d, _YargsInstance_output, _o, "f");
      } }.value,
      exitError: { set value(_o) {
        __classPrivateFieldSet(_e, _YargsInstance_exitError, _o, "f");
      } }.value,
      hasOutput: { set value(_o) {
        __classPrivateFieldSet(_f, _YargsInstance_hasOutput, _o, "f");
      } }.value,
      parsed: this.parsed,
      strict: { set value(_o) {
        __classPrivateFieldSet(_g, _YargsInstance_strict, _o, "f");
      } }.value,
      strictCommands: { set value(_o) {
        __classPrivateFieldSet(_h, _YargsInstance_strictCommands, _o, "f");
      } }.value,
      strictOptions: { set value(_o) {
        __classPrivateFieldSet(_j, _YargsInstance_strictOptions, _o, "f");
      } }.value,
      completionCommand: { set value(_o) {
        __classPrivateFieldSet(_k, _YargsInstance_completionCommand, _o, "f");
      } }.value,
      parseFn: { set value(_o) {
        __classPrivateFieldSet(_l, _YargsInstance_parseFn, _o, "f");
      } }.value,
      parseContext: { set value(_o) {
        __classPrivateFieldSet(_m, _YargsInstance_parseContext, _o, "f");
      } }.value
    } = frozen;
    __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects = configObjects;
    __classPrivateFieldGet(this, _YargsInstance_usage, "f").unfreeze();
    __classPrivateFieldGet(this, _YargsInstance_validation, "f").unfreeze();
    __classPrivateFieldGet(this, _YargsInstance_command, "f").unfreeze();
    __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").unfreeze();
  }
  [kValidateAsync](validation3, argv) {
    return maybeAsyncResult(argv, (result) => {
      validation3(result);
      return result;
    });
  }
  getInternalMethods() {
    return {
      getCommandInstance: this[kGetCommandInstance].bind(this),
      getContext: this[kGetContext].bind(this),
      getHasOutput: this[kGetHasOutput].bind(this),
      getLoggerInstance: this[kGetLoggerInstance].bind(this),
      getParseContext: this[kGetParseContext].bind(this),
      getParserConfiguration: this[kGetParserConfiguration].bind(this),
      getUsageConfiguration: this[kGetUsageConfiguration].bind(this),
      getUsageInstance: this[kGetUsageInstance].bind(this),
      getValidationInstance: this[kGetValidationInstance].bind(this),
      hasParseCallback: this[kHasParseCallback].bind(this),
      isGlobalContext: this[kIsGlobalContext].bind(this),
      postProcess: this[kPostProcess].bind(this),
      reset: this[kReset].bind(this),
      runValidation: this[kRunValidation].bind(this),
      runYargsParserAndExecuteCommands: this[kRunYargsParserAndExecuteCommands].bind(this),
      setHasOutput: this[kSetHasOutput].bind(this)
    };
  }
  [kGetCommandInstance]() {
    return __classPrivateFieldGet(this, _YargsInstance_command, "f");
  }
  [kGetContext]() {
    return __classPrivateFieldGet(this, _YargsInstance_context, "f");
  }
  [kGetHasOutput]() {
    return __classPrivateFieldGet(this, _YargsInstance_hasOutput, "f");
  }
  [kGetLoggerInstance]() {
    return __classPrivateFieldGet(this, _YargsInstance_logger, "f");
  }
  [kGetParseContext]() {
    return __classPrivateFieldGet(this, _YargsInstance_parseContext, "f") || {};
  }
  [kGetUsageInstance]() {
    return __classPrivateFieldGet(this, _YargsInstance_usage, "f");
  }
  [kGetValidationInstance]() {
    return __classPrivateFieldGet(this, _YargsInstance_validation, "f");
  }
  [kHasParseCallback]() {
    return !!__classPrivateFieldGet(this, _YargsInstance_parseFn, "f");
  }
  [kIsGlobalContext]() {
    return __classPrivateFieldGet(this, _YargsInstance_isGlobalContext, "f");
  }
  [kPostProcess](argv, populateDoubleDash, calledFromCommand, runGlobalMiddleware) {
    if (calledFromCommand)
      return argv;
    if (isPromise(argv))
      return argv;
    if (!populateDoubleDash) {
      argv = this[kCopyDoubleDash](argv);
    }
    const parsePositionalNumbers = this[kGetParserConfiguration]()["parse-positional-numbers"] || this[kGetParserConfiguration]()["parse-positional-numbers"] === undefined;
    if (parsePositionalNumbers) {
      argv = this[kParsePositionalNumbers](argv);
    }
    if (runGlobalMiddleware) {
      argv = applyMiddleware(argv, this, __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").getMiddleware(), false);
    }
    return argv;
  }
  [kReset](aliases = {}) {
    __classPrivateFieldSet(this, _YargsInstance_options, __classPrivateFieldGet(this, _YargsInstance_options, "f") || {}, "f");
    const tmpOptions = {};
    tmpOptions.local = __classPrivateFieldGet(this, _YargsInstance_options, "f").local || [];
    tmpOptions.configObjects = __classPrivateFieldGet(this, _YargsInstance_options, "f").configObjects || [];
    const localLookup = {};
    tmpOptions.local.forEach((l) => {
      localLookup[l] = true;
      (aliases[l] || []).forEach((a) => {
        localLookup[a] = true;
      });
    });
    Object.assign(__classPrivateFieldGet(this, _YargsInstance_preservedGroups, "f"), Object.keys(__classPrivateFieldGet(this, _YargsInstance_groups, "f")).reduce((acc, groupName) => {
      const keys = __classPrivateFieldGet(this, _YargsInstance_groups, "f")[groupName].filter((key) => !(key in localLookup));
      if (keys.length > 0) {
        acc[groupName] = keys;
      }
      return acc;
    }, {}));
    __classPrivateFieldSet(this, _YargsInstance_groups, {}, "f");
    const arrayOptions = [
      "array",
      "boolean",
      "string",
      "skipValidation",
      "count",
      "normalize",
      "number",
      "hiddenOptions"
    ];
    const objectOptions = [
      "narg",
      "key",
      "alias",
      "default",
      "defaultDescription",
      "config",
      "choices",
      "demandedOptions",
      "demandedCommands",
      "deprecatedOptions"
    ];
    arrayOptions.forEach((k) => {
      tmpOptions[k] = (__classPrivateFieldGet(this, _YargsInstance_options, "f")[k] || []).filter((k2) => !localLookup[k2]);
    });
    objectOptions.forEach((k) => {
      tmpOptions[k] = objFilter(__classPrivateFieldGet(this, _YargsInstance_options, "f")[k], (k2) => !localLookup[k2]);
    });
    tmpOptions.envPrefix = __classPrivateFieldGet(this, _YargsInstance_options, "f").envPrefix;
    __classPrivateFieldSet(this, _YargsInstance_options, tmpOptions, "f");
    __classPrivateFieldSet(this, _YargsInstance_usage, __classPrivateFieldGet(this, _YargsInstance_usage, "f") ? __classPrivateFieldGet(this, _YargsInstance_usage, "f").reset(localLookup) : usage(this, __classPrivateFieldGet(this, _YargsInstance_shim, "f")), "f");
    __classPrivateFieldSet(this, _YargsInstance_validation, __classPrivateFieldGet(this, _YargsInstance_validation, "f") ? __classPrivateFieldGet(this, _YargsInstance_validation, "f").reset(localLookup) : validation(this, __classPrivateFieldGet(this, _YargsInstance_usage, "f"), __classPrivateFieldGet(this, _YargsInstance_shim, "f")), "f");
    __classPrivateFieldSet(this, _YargsInstance_command, __classPrivateFieldGet(this, _YargsInstance_command, "f") ? __classPrivateFieldGet(this, _YargsInstance_command, "f").reset() : command(__classPrivateFieldGet(this, _YargsInstance_usage, "f"), __classPrivateFieldGet(this, _YargsInstance_validation, "f"), __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f"), __classPrivateFieldGet(this, _YargsInstance_shim, "f")), "f");
    if (!__classPrivateFieldGet(this, _YargsInstance_completion, "f"))
      __classPrivateFieldSet(this, _YargsInstance_completion, completion(this, __classPrivateFieldGet(this, _YargsInstance_usage, "f"), __classPrivateFieldGet(this, _YargsInstance_command, "f"), __classPrivateFieldGet(this, _YargsInstance_shim, "f")), "f");
    __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").reset();
    __classPrivateFieldSet(this, _YargsInstance_completionCommand, null, "f");
    __classPrivateFieldSet(this, _YargsInstance_output, "", "f");
    __classPrivateFieldSet(this, _YargsInstance_exitError, null, "f");
    __classPrivateFieldSet(this, _YargsInstance_hasOutput, false, "f");
    this.parsed = false;
    return this;
  }
  [kRebase](base, dir) {
    return __classPrivateFieldGet(this, _YargsInstance_shim, "f").path.relative(base, dir);
  }
  [kRunYargsParserAndExecuteCommands](args, shortCircuit, calledFromCommand, commandIndex = 0, helpOnly = false) {
    let skipValidation = !!calledFromCommand || helpOnly;
    args = args || __classPrivateFieldGet(this, _YargsInstance_processArgs, "f");
    __classPrivateFieldGet(this, _YargsInstance_options, "f").__ = __classPrivateFieldGet(this, _YargsInstance_shim, "f").y18n.__;
    __classPrivateFieldGet(this, _YargsInstance_options, "f").configuration = this[kGetParserConfiguration]();
    const populateDoubleDash = !!__classPrivateFieldGet(this, _YargsInstance_options, "f").configuration["populate--"];
    const config = Object.assign({}, __classPrivateFieldGet(this, _YargsInstance_options, "f").configuration, {
      "populate--": true
    });
    const parsed = __classPrivateFieldGet(this, _YargsInstance_shim, "f").Parser.detailed(args, Object.assign({}, __classPrivateFieldGet(this, _YargsInstance_options, "f"), {
      configuration: { "parse-positional-numbers": false, ...config }
    }));
    const argv = Object.assign(parsed.argv, __classPrivateFieldGet(this, _YargsInstance_parseContext, "f"));
    let argvPromise = undefined;
    const aliases = parsed.aliases;
    let helpOptSet = false;
    let versionOptSet = false;
    Object.keys(argv).forEach((key) => {
      if (key === __classPrivateFieldGet(this, _YargsInstance_helpOpt, "f") && argv[key]) {
        helpOptSet = true;
      } else if (key === __classPrivateFieldGet(this, _YargsInstance_versionOpt, "f") && argv[key]) {
        versionOptSet = true;
      }
    });
    argv.$0 = this.$0;
    this.parsed = parsed;
    if (commandIndex === 0) {
      __classPrivateFieldGet(this, _YargsInstance_usage, "f").clearCachedHelpMessage();
    }
    try {
      this[kGuessLocale]();
      if (shortCircuit) {
        return this[kPostProcess](argv, populateDoubleDash, !!calledFromCommand, false);
      }
      if (__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f")) {
        const helpCmds = [__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f")].concat(aliases[__classPrivateFieldGet(this, _YargsInstance_helpOpt, "f")] || []).filter((k) => k.length > 1);
        if (helpCmds.includes("" + argv._[argv._.length - 1])) {
          argv._.pop();
          helpOptSet = true;
        }
      }
      __classPrivateFieldSet(this, _YargsInstance_isGlobalContext, false, "f");
      const handlerKeys = __classPrivateFieldGet(this, _YargsInstance_command, "f").getCommands();
      const requestCompletions = __classPrivateFieldGet(this, _YargsInstance_completion, "f").completionKey in argv;
      const skipRecommendation = helpOptSet || requestCompletions || helpOnly;
      if (argv._.length) {
        if (handlerKeys.length) {
          let firstUnknownCommand;
          for (let i = commandIndex || 0, cmd;argv._[i] !== undefined; i++) {
            cmd = String(argv._[i]);
            if (handlerKeys.includes(cmd) && cmd !== __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f")) {
              const innerArgv = __classPrivateFieldGet(this, _YargsInstance_command, "f").runCommand(cmd, this, parsed, i + 1, helpOnly, helpOptSet || versionOptSet || helpOnly);
              return this[kPostProcess](innerArgv, populateDoubleDash, !!calledFromCommand, false);
            } else if (!firstUnknownCommand && cmd !== __classPrivateFieldGet(this, _YargsInstance_completionCommand, "f")) {
              firstUnknownCommand = cmd;
              break;
            }
          }
          if (!__classPrivateFieldGet(this, _YargsInstance_command, "f").hasDefaultCommand() && __classPrivateFieldGet(this, _YargsInstance_recommendCommands, "f") && firstUnknownCommand && !skipRecommendation) {
            __classPrivateFieldGet(this, _YargsInstance_validation, "f").recommendCommands(firstUnknownCommand, handlerKeys);
          }
        }
        if (__classPrivateFieldGet(this, _YargsInstance_completionCommand, "f") && argv._.includes(__classPrivateFieldGet(this, _YargsInstance_completionCommand, "f")) && !requestCompletions) {
          if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
            setBlocking(true);
          this.showCompletionScript();
          this.exit(0);
        }
      }
      if (__classPrivateFieldGet(this, _YargsInstance_command, "f").hasDefaultCommand() && !skipRecommendation) {
        const innerArgv = __classPrivateFieldGet(this, _YargsInstance_command, "f").runCommand(null, this, parsed, 0, helpOnly, helpOptSet || versionOptSet || helpOnly);
        return this[kPostProcess](innerArgv, populateDoubleDash, !!calledFromCommand, false);
      }
      if (requestCompletions) {
        if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
          setBlocking(true);
        args = [].concat(args);
        const completionArgs = args.slice(args.indexOf(`--${__classPrivateFieldGet(this, _YargsInstance_completion, "f").completionKey}`) + 1);
        __classPrivateFieldGet(this, _YargsInstance_completion, "f").getCompletion(completionArgs, (err, completions) => {
          if (err)
            throw new YError(err.message);
          (completions || []).forEach((completion3) => {
            __classPrivateFieldGet(this, _YargsInstance_logger, "f").log(completion3);
          });
          this.exit(0);
        });
        return this[kPostProcess](argv, !populateDoubleDash, !!calledFromCommand, false);
      }
      if (!__classPrivateFieldGet(this, _YargsInstance_hasOutput, "f")) {
        if (helpOptSet) {
          if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
            setBlocking(true);
          skipValidation = true;
          this.showHelp("log");
          this.exit(0);
        } else if (versionOptSet) {
          if (__classPrivateFieldGet(this, _YargsInstance_exitProcess, "f"))
            setBlocking(true);
          skipValidation = true;
          __classPrivateFieldGet(this, _YargsInstance_usage, "f").showVersion("log");
          this.exit(0);
        }
      }
      if (!skipValidation && __classPrivateFieldGet(this, _YargsInstance_options, "f").skipValidation.length > 0) {
        skipValidation = Object.keys(argv).some((key) => __classPrivateFieldGet(this, _YargsInstance_options, "f").skipValidation.indexOf(key) >= 0 && argv[key] === true);
      }
      if (!skipValidation) {
        if (parsed.error)
          throw new YError(parsed.error.message);
        if (!requestCompletions) {
          const validation3 = this[kRunValidation](aliases, {}, parsed.error);
          if (!calledFromCommand) {
            argvPromise = applyMiddleware(argv, this, __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").getMiddleware(), true);
          }
          argvPromise = this[kValidateAsync](validation3, argvPromise !== null && argvPromise !== undefined ? argvPromise : argv);
          if (isPromise(argvPromise) && !calledFromCommand) {
            argvPromise = argvPromise.then(() => {
              return applyMiddleware(argv, this, __classPrivateFieldGet(this, _YargsInstance_globalMiddleware, "f").getMiddleware(), false);
            });
          }
        }
      }
    } catch (err) {
      if (err instanceof YError)
        __classPrivateFieldGet(this, _YargsInstance_usage, "f").fail(err.message, err);
      else
        throw err;
    }
    return this[kPostProcess](argvPromise !== null && argvPromise !== undefined ? argvPromise : argv, populateDoubleDash, !!calledFromCommand, true);
  }
  [kRunValidation](aliases, positionalMap, parseErrors, isDefaultCommand) {
    const demandedOptions = { ...this.getDemandedOptions() };
    return (argv) => {
      if (parseErrors)
        throw new YError(parseErrors.message);
      __classPrivateFieldGet(this, _YargsInstance_validation, "f").nonOptionCount(argv);
      __classPrivateFieldGet(this, _YargsInstance_validation, "f").requiredArguments(argv, demandedOptions);
      let failedStrictCommands = false;
      if (__classPrivateFieldGet(this, _YargsInstance_strictCommands, "f")) {
        failedStrictCommands = __classPrivateFieldGet(this, _YargsInstance_validation, "f").unknownCommands(argv);
      }
      if (__classPrivateFieldGet(this, _YargsInstance_strict, "f") && !failedStrictCommands) {
        __classPrivateFieldGet(this, _YargsInstance_validation, "f").unknownArguments(argv, aliases, positionalMap, !!isDefaultCommand);
      } else if (__classPrivateFieldGet(this, _YargsInstance_strictOptions, "f")) {
        __classPrivateFieldGet(this, _YargsInstance_validation, "f").unknownArguments(argv, aliases, {}, false, false);
      }
      __classPrivateFieldGet(this, _YargsInstance_validation, "f").limitedChoices(argv);
      __classPrivateFieldGet(this, _YargsInstance_validation, "f").implications(argv);
      __classPrivateFieldGet(this, _YargsInstance_validation, "f").conflicting(argv);
    };
  }
  [kSetHasOutput]() {
    __classPrivateFieldSet(this, _YargsInstance_hasOutput, true, "f");
  }
  [kTrackManuallySetKeys](keys) {
    if (typeof keys === "string") {
      __classPrivateFieldGet(this, _YargsInstance_options, "f").key[keys] = true;
    } else {
      for (const k of keys) {
        __classPrivateFieldGet(this, _YargsInstance_options, "f").key[k] = true;
      }
    }
  }
}

// node_modules/yargs/index.mjs
var Yargs = YargsFactory(esm_default);
var yargs_default = Yargs;

// src/cli.ts
import fs from "fs";

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
  constructor(node2, style) {
    this._raw = node2;
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
    return `${this.name}: ${this.message} (${this.markupNode.node}, ${this.markupStack.map((node2) => node2.node).join(", ")})`;
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
function getSpacingFromProperties(node2, style) {
  const left2 = num(node2.marginLeft ?? node2.margin ?? style?.spacing?.marginLeft ?? 0);
  const right2 = num(node2.marginRight ?? node2.margin ?? style?.spacing?.marginRight ?? 0);
  const top2 = num(node2.marginTop ?? node2.margin ?? style?.spacing?.marginTop ?? 0);
  const bottom2 = num(node2.marginBottom ?? node2.margin ?? style?.spacing?.marginBottom ?? 0);
  const vpre = top2 ? "\n".repeat(top2) : "";
  const vpost = bottom2 ? "\n".repeat(bottom2) : "";
  const hpre = left2 ? " ".repeat(left2) : "";
  const hpost = right2 ? " ".repeat(right2) : "";
  return {
    on: `${vpre}${hpre}`,
    off: `${hpost}${vpost}`
  };
}

// src/utilities/render-space-attributes.ts
function renderSpaceAttributesStart({
  node: node2,
  format: format3,
  style
}) {
  if (format3 === "ansi") {
    return getSpacingFromProperties(node2, style).on;
  } else if (format3 === "markup") {
    return Object.entries(node2).filter(([key]) => Object.keys(SpaceAttributes).includes(key)).map(([key, value]) => `${key}="${value}"`).join(" ");
  } else {
    return "";
  }
}
function renderSpaceAttributesEnd({
  style,
  attributes,
  format: format3
}) {
  if (format3 === "ansi") {
    return getSpacingFromProperties(attributes, style).off;
  } else if (format3 === "markup") {
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
  format: format3 = "ansi"
}) {
  if (format3 === "ansi") {
    return getTextEscapeCodesFromProperties(attributes, style).on;
  } else if (format3 === "markup") {
    return Object.entries(attributes).filter(([key]) => isAttribute(key)).map(([key, value]) => `${key}="${value}"`).join(" ");
  }
}
function renderTextAttributesEnd({
  style,
  attributes,
  format: format3 = "ansi"
}) {
  if (format3 === "ansi") {
    return getTextEscapeCodesFromProperties(attributes, style).off;
  } else if (format3 === "markup") {
    return "";
  }
}

// src/utilities/render-node-as-markup.ts
function renderNodeAsMarkupStart(node2) {
  const attribs = Object.entries(node2).filter(([key]) => isAttribute(key)).map(([key, value]) => `${key}="${value}"`).join(" ");
  return `<${node2.node}${attribs ? ` ${attribs}` : ""}>`;
}
function renderNodeAsMarkupEnd(node2) {
  return `</${node2.node}>`;
}

// src/compiler/node/block.ts
class BlockTextNodeImpl extends AnsieNodeImpl {
  constructor() {
    super(...arguments);
  }
  renderStart({
    stack,
    format: format3
  }) {
    if (format3 === "ansi") {
      return renderSpaceAttributesStart({
        node: this._raw,
        format: format3,
        style: this._style
      }) + renderTextAttributesStart({
        style: this._style,
        attributes: this._raw,
        format: format3
      });
    } else if (format3 === "markup") {
      return renderNodeAsMarkupStart(this._raw);
    } else {
      throw new CompilerError(`Invalid format: ${format3}`, this._raw, stack, false);
    }
  }
  renderEnd({
    stack,
    format: format3 = "ansi"
  }) {
    if (format3 === "ansi") {
      return `${renderTextAttributesEnd({ style: this._style, attributes: this._raw, format: format3 })}${renderSpaceAttributesEnd({ attributes: this._raw, format: format3, style: this._style })}`;
    } else if (format3 === "markup") {
      return renderNodeAsMarkupEnd(this._raw);
    } else {
      throw new CompilerError(`Invalid format: ${format3}`, this._raw, stack, false);
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
    format: format3
  }) {
    if (format3 === "ansi") {
      return "\n".repeat(this._style?.spacing?.marginBottom || 1);
    } else if (format3 === "markup") {
      return "<br/>";
    }
    throw new CompilerError(`Invalid format: ${format3}`, this._raw, stack, false);
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
  renderStart({ format: format3 }) {
    const text = this.attr("value") ?? "";
    if (format3 === "markup") {
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
function getListItemFromProperties(node2, style) {
  const bullet = node2.bullet ? node2.bullet : style?.list?.bullet ?? "";
  const indent = node2.indent ? " ".repeat(num(node2.indent)) : " ".repeat(style?.list?.indent ?? 0);
  return {
    on: `${bullet}${indent}`,
    off: ""
  };
}

// src/utilities/render-list-attributes.ts
function renderListAttributesStart({
  node: node2,
  style,
  format: format3 = "ansi"
}) {
  if (format3 === "ansi") {
    return getListItemFromProperties(node2, style).on;
  } else if (format3 === "markup") {
    return Object.entries(node2).filter(([key]) => Object.keys(ListAttributes).includes(key)).map(([key, value]) => `${key}="${value}"`).join(" ");
  } else {
    return "";
  }
}
function renderListAttributesEnd({
  node: node2,
  style,
  format: format3 = "ansi"
}) {
  if (format3 === "ansi") {
    return getListItemFromProperties(node2, style).off;
  } else if (format3 === "markup") {
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
    format: format3
  }) {
    if (format3 === "ansi") {
      return renderSpaceAttributesStart({
        node: this._raw,
        format: format3,
        style: this._style
      }) + renderListAttributesStart({
        node: this._raw,
        format: format3,
        style: this._style
      }) + renderTextAttributesStart({
        attributes: this._raw,
        format: format3,
        style: this._style
      });
    } else if (format3 === "markup") {
      return renderNodeAsMarkupStart(this._raw);
    }
    throw new CompilerError(`Invalid format: ${format3}`, this._raw, stack, false);
  }
  renderEnd({
    format: format3 = "ansi"
  }) {
    if (format3 === "ansi") {
      return renderTextAttributesEnd({
        style: this._style,
        attributes: this._raw,
        format: format3
      }) + renderListAttributesEnd({
        node: this._raw,
        format: format3,
        style: this._style
      }) + renderSpaceAttributesEnd({
        attributes: this._raw,
        format: format3,
        style: this._style
      });
    } else if (format3 === "markup") {
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
    format: format3
  }) {
    if (format3 === "ansi") {
      return renderSpaceAttributesStart({
        node: this._raw,
        format: format3,
        style: this._style
      }) + renderTextAttributesStart({
        style: this._style,
        attributes: this._raw,
        format: format3
      });
    } else if (format3 === "markup") {
      return renderNodeAsMarkupStart(this._raw);
    } else {
      throw new CompilerError(`Invalid format: ${format3}`, this._raw, stack, false);
    }
  }
  renderEnd({
    stack,
    format: format3 = "ansi"
  }) {
    if (format3 === "ansi") {
      return `${renderTextAttributesEnd({ style: this._style, attributes: this._raw, format: format3 })}${renderSpaceAttributesEnd({ attributes: this._raw, format: format3, style: this._style })}`;
    } else if (format3 === "markup") {
      return renderNodeAsMarkupEnd(this._raw);
    } else {
      throw new CompilerError(`Invalid format: ${format3}`, this._raw, stack, false);
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
    format: format3,
    theme
  }) {
    return this._ast.reduce((finalString, node2) => {
      finalString += this._compileNode({ node: node2, format: format3, theme });
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
    format: format3 = "ansi"
  }) {
    const node2 = this.makeNodeImplementation(state);
    this._stack.push(node2);
    return node2.renderStart({ stack: this._stack, format: format3 });
  }
  _pop({
    format: format3 = "ansi"
  } = {}) {
    const old = this._stack.pop();
    return old?.renderEnd({ stack: this._stack, format: format3 });
  }
  _compileNode({
    node: node2,
    theme,
    format: format3 = "ansi"
  }) {
    const strings = [];
    try {
      strings.push(this._push({ state: node2, format: format3 }));
      if (node2.content) {
        if (Array.isArray(node2.content)) {
          node2.content.forEach((node3) => strings.push(this._compileNode({ node: node3, theme, format: format3 })));
        } else {
          strings.push(this._compileNode({
            node: node2.content,
            theme,
            format: format3
          }));
        }
      }
      const n = this._pop({ format: format3 });
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
// package.json
var package_default = {
  name: "ansie",
  version: "0.4.0",
  type: "module",
  types: "dist/node/index.d.ts",
  exports: {
    ".": {
      import: "./dist/node/index.js"
    }
  },
  homepage: "https://github.com/kshehadeh/ansie/blob/main/README.md",
  repository: {
    type: "git",
    url: "https://github.com/kshehadeh/ansie"
  },
  author: "Karim Shehadeh <karim@karim.cloud> (http://karim.cloud/)",
  funding: {
    type: "patreon",
    url: "https://www.patreon.com/karimshehadeh"
  },
  bugs: {
    url: "https://github.com/kshehadeh/ansie/issues"
  },
  license: "MIT",
  bin: {
    ansie: "dist/node/cli.js"
  },
  keywords: [
    "terminal",
    "cli",
    "markup",
    "parser",
    "rendering",
    "rich",
    "text",
    "ansi",
    "color",
    "colour",
    "form"
  ],
  description: "A simple rendering engine for rich text terminal output with its own markup language.",
  scripts: {
    clean: "rimraf dist",
    test: "bun test",
    "fixture:generate": "bun test/record.ts",
    "parser:generate": "bun scripts/parser/generate.ts",
    "ver:pre": "npm version prerelease",
    "ver:pat": "npm version patch",
    "ver:min": "npm version minor",
    "ver:maj": "npm version major",
    bld: "bun test && bun clean && bun ./scripts/build/build.ts && bun bld:types",
    "bld:types": "npx dts-bundle-generator ./src/index.ts -o ./dist/node/index.d.ts --export-referenced-types=false --no-check",
    pub: "bun run bld && npm publish",
    "pub:dry": "bun run bld && npm publish --dry-run"
  },
  devDependencies: {
    "@types/jest": "^29.5.12",
    "@types/node": "^20.11.16",
    "@types/yargs": "^17.0.32",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "bun-types": "^1.0.26",
    "dts-bundle-generator": "^9.3.1",
    eslint: "^8.56.0",
    lefthook: "^1.6.0",
    peggy: "^3.0.2",
    prettier: "^3.2.4",
    rimraf: "^5.0.5",
    "ts-pegjs": "^4.2.1"
  },
  peerDependencies: {
    typescript: "^5.3.3"
  },
  dependencies: {
    yargs: "^17.7.2"
  },
  eslintIgnore: [
    "generated-parser.js"
  ]
};

// src/cli.ts
var readStdinWithTimeout = function(timeout) {
  return new Promise((resolve5, reject) => {
    let inputData = "";
    const timer = setTimeout(() => {
      process.stdin.pause();
      resolve5("");
    }, timeout);
    process.stdin.on("data", (data) => {
      inputData += data;
    });
    process.stdin.on("end", () => {
      clearTimeout(timer);
      resolve5(inputData);
    });
    process.stdin.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    process.stdin.resume();
  });
};
async function handleInput() {
  const stdInput = await readStdinWithTimeout(10);
  const y = yargs_default(hideBin(process.argv)).scriptName("ansie").version(package_default.version).usage("Usage: ansie [markup] -i [input] -o [output]").positional("markup", {
    alias: "m",
    type: "string",
    description: "Specify the markup text (instead of a file)"
  }).option("input", {
    alias: "i",
    type: "string",
    description: "Specify the input file"
  }).option("output", {
    alias: "o",
    type: "string",
    description: "Specify the output file"
  }).option("ast", {
    alias: "a",
    type: "boolean",
    description: "Output the AST instead of the compiled text"
  }).check((argv2) => {
    const markup = argv2._.join(" ");
    if (argv2.input && markup.length > 0) {
      throw new Error("You must specify either --input or markup as a positional argument, not both");
    }
    if (!argv2.input && !markup && !stdInput) {
      throw new Error("You must specify either --input or --markup so that the compiler knows what to compile");
    }
    if (argv2.input) {
      if (!fs.existsSync(argv2.input)) {
        throw new Error(`The input file ${argv2.input} does not exist`);
      }
    }
    return true;
  });
  const argv = await y.argv;
  if (argv["help"]) {
    y.showHelp();
  } else if (argv["version"]) {
    console.log(package_default.version);
  } else {
    let input = "";
    if (argv.input) {
      input = fs.readFileSync(argv.input, "utf8");
    } else if (argv._.length > 0) {
      input = argv._.join(" ");
    } else if (stdInput) {
      input = stdInput;
    }
    if (input) {
      let output = "";
      if (argv.ast) {
        output = JSON.stringify(parseAnsieMarkdown(input), null, 4);
      } else {
        output = compile({ markup: input }) || "";
      }
      if (output) {
        if (argv.output) {
          fs.writeFileSync(argv.output, output);
        } else {
          console.log(output);
        }
      } else {
        throw new Error("No output was generated");
      }
    }
  }
}
handleInput().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});

//# debugId=87A1C45CE0784F6A64756e2164756e21
