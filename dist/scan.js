#!/usr/bin/env node
// @bun
import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: __accessProp.bind(mod, key),
        enumerable: true
      });
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// node_modules/.bun/sisteransi@1.0.5/node_modules/sisteransi/src/index.js
var require_src = __commonJS((exports, module) => {
  var ESC2 = "\x1B";
  var CSI2 = `${ESC2}[`;
  var beep = "\x07";
  var cursor = {
    to(x, y) {
      if (!y)
        return `${CSI2}${x + 1}G`;
      return `${CSI2}${y + 1};${x + 1}H`;
    },
    move(x, y) {
      let ret = "";
      if (x < 0)
        ret += `${CSI2}${-x}D`;
      else if (x > 0)
        ret += `${CSI2}${x}C`;
      if (y < 0)
        ret += `${CSI2}${-y}A`;
      else if (y > 0)
        ret += `${CSI2}${y}B`;
      return ret;
    },
    up: (count = 1) => `${CSI2}${count}A`,
    down: (count = 1) => `${CSI2}${count}B`,
    forward: (count = 1) => `${CSI2}${count}C`,
    backward: (count = 1) => `${CSI2}${count}D`,
    nextLine: (count = 1) => `${CSI2}E`.repeat(count),
    prevLine: (count = 1) => `${CSI2}F`.repeat(count),
    left: `${CSI2}G`,
    hide: `${CSI2}?25l`,
    show: `${CSI2}?25h`,
    save: `${ESC2}7`,
    restore: `${ESC2}8`
  };
  var scroll = {
    up: (count = 1) => `${CSI2}S`.repeat(count),
    down: (count = 1) => `${CSI2}T`.repeat(count)
  };
  var erase = {
    screen: `${CSI2}2J`,
    up: (count = 1) => `${CSI2}1J`.repeat(count),
    down: (count = 1) => `${CSI2}J`.repeat(count),
    line: `${CSI2}2K`,
    lineEnd: `${CSI2}K`,
    lineStart: `${CSI2}1K`,
    lines(count) {
      let clear = "";
      for (let i = 0;i < count; i++)
        clear += this.line + (i < count - 1 ? cursor.up() : "");
      if (count)
        clear += cursor.left;
      return clear;
    }
  };
  module.exports = { cursor, scroll, erase, beep };
});

// node_modules/.bun/@clack+core@1.4.3/node_modules/@clack/core/dist/index.mjs
import { styleText } from "node:util";
import { stdout, stdin } from "node:process";
import * as l from "node:readline";
import l__default from "node:readline";

// node_modules/.bun/fast-string-truncated-width@3.0.3/node_modules/fast-string-truncated-width/dist/utils.js
var getCodePointsLength = (() => {
  const SURROGATE_PAIR_RE = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  return (input) => {
    let surrogatePairsNr = 0;
    SURROGATE_PAIR_RE.lastIndex = 0;
    while (SURROGATE_PAIR_RE.test(input)) {
      surrogatePairsNr += 1;
    }
    return input.length - surrogatePairsNr;
  };
})();
var isFullWidth = (x) => {
  return x === 12288 || x >= 65281 && x <= 65376 || x >= 65504 && x <= 65510;
};
var isWideNotCJKTNotEmoji = (x) => {
  return x === 8987 || x === 9001 || x >= 12272 && x <= 12287 || x >= 12289 && x <= 12350 || x >= 12441 && x <= 12543 || x >= 12549 && x <= 12591 || x >= 12593 && x <= 12686 || x >= 12688 && x <= 12771 || x >= 12783 && x <= 12830 || x >= 12832 && x <= 12871 || x >= 12880 && x <= 19903 || x >= 65040 && x <= 65049 || x >= 65072 && x <= 65106 || x >= 65108 && x <= 65126 || x >= 65128 && x <= 65131 || x >= 127488 && x <= 127490 || x >= 127504 && x <= 127547 || x >= 127552 && x <= 127560 || x >= 131072 && x <= 196605 || x >= 196608 && x <= 262141;
};

// node_modules/.bun/fast-string-truncated-width@3.0.3/node_modules/fast-string-truncated-width/dist/index.js
var ANSI_RE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]|\u001b\]8;[^;]*;.*?(?:\u0007|\u001b\u005c)/y;
var CONTROL_RE = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y;
var CJKT_WIDE_RE = /(?:(?![\uFF61-\uFF9F\uFF00-\uFFEF])[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Tangut}]){1,1000}/yu;
var TAB_RE = /\t{1,1000}/y;
var EMOJI_RE = /[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F\u20E3?))*/yu;
var LATIN_RE = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y;
var MODIFIER_RE = /\p{M}+/gu;
var NO_TRUNCATION = { limit: Infinity, ellipsis: "" };
var getStringTruncatedWidth = (input, truncationOptions = {}, widthOptions = {}) => {
  const LIMIT = truncationOptions.limit ?? Infinity;
  const ELLIPSIS = truncationOptions.ellipsis ?? "";
  const ELLIPSIS_WIDTH = truncationOptions?.ellipsisWidth ?? (ELLIPSIS ? getStringTruncatedWidth(ELLIPSIS, NO_TRUNCATION, widthOptions).width : 0);
  const ANSI_WIDTH = 0;
  const CONTROL_WIDTH = widthOptions.controlWidth ?? 0;
  const TAB_WIDTH = widthOptions.tabWidth ?? 8;
  const EMOJI_WIDTH = widthOptions.emojiWidth ?? 2;
  const FULL_WIDTH_WIDTH = 2;
  const REGULAR_WIDTH = widthOptions.regularWidth ?? 1;
  const WIDE_WIDTH = widthOptions.wideWidth ?? FULL_WIDTH_WIDTH;
  const PARSE_BLOCKS = [
    [LATIN_RE, REGULAR_WIDTH],
    [ANSI_RE, ANSI_WIDTH],
    [CONTROL_RE, CONTROL_WIDTH],
    [TAB_RE, TAB_WIDTH],
    [EMOJI_RE, EMOJI_WIDTH],
    [CJKT_WIDE_RE, WIDE_WIDTH]
  ];
  let indexPrev = 0;
  let index = 0;
  let length = input.length;
  let lengthExtra = 0;
  let truncationEnabled = false;
  let truncationIndex = length;
  let truncationLimit = Math.max(0, LIMIT - ELLIPSIS_WIDTH);
  let unmatchedStart = 0;
  let unmatchedEnd = 0;
  let width = 0;
  let widthExtra = 0;
  outer:
    while (true) {
      if (unmatchedEnd > unmatchedStart || index >= length && index > indexPrev) {
        const unmatched = input.slice(unmatchedStart, unmatchedEnd) || input.slice(indexPrev, index);
        lengthExtra = 0;
        for (const char of unmatched.replaceAll(MODIFIER_RE, "")) {
          const codePoint = char.codePointAt(0) || 0;
          if (isFullWidth(codePoint)) {
            widthExtra = FULL_WIDTH_WIDTH;
          } else if (isWideNotCJKTNotEmoji(codePoint)) {
            widthExtra = WIDE_WIDTH;
          } else {
            widthExtra = REGULAR_WIDTH;
          }
          if (width + widthExtra > truncationLimit) {
            truncationIndex = Math.min(truncationIndex, Math.max(unmatchedStart, indexPrev) + lengthExtra);
          }
          if (width + widthExtra > LIMIT) {
            truncationEnabled = true;
            break outer;
          }
          lengthExtra += char.length;
          width += widthExtra;
        }
        unmatchedStart = unmatchedEnd = 0;
      }
      if (index >= length) {
        break outer;
      }
      for (let i = 0, l = PARSE_BLOCKS.length;i < l; i++) {
        const [BLOCK_RE, BLOCK_WIDTH] = PARSE_BLOCKS[i];
        BLOCK_RE.lastIndex = index;
        if (BLOCK_RE.test(input)) {
          lengthExtra = BLOCK_RE === CJKT_WIDE_RE ? getCodePointsLength(input.slice(index, BLOCK_RE.lastIndex)) : BLOCK_RE === EMOJI_RE ? 1 : BLOCK_RE.lastIndex - index;
          widthExtra = lengthExtra * BLOCK_WIDTH;
          if (width + widthExtra > truncationLimit) {
            truncationIndex = Math.min(truncationIndex, index + Math.floor((truncationLimit - width) / BLOCK_WIDTH));
          }
          if (width + widthExtra > LIMIT) {
            truncationEnabled = true;
            break outer;
          }
          width += widthExtra;
          unmatchedStart = indexPrev;
          unmatchedEnd = index;
          index = indexPrev = BLOCK_RE.lastIndex;
          continue outer;
        }
      }
      index += 1;
    }
  return {
    width: truncationEnabled ? truncationLimit : width,
    index: truncationEnabled ? truncationIndex : length,
    truncated: truncationEnabled,
    ellipsed: truncationEnabled && LIMIT >= ELLIPSIS_WIDTH
  };
};
var dist_default = getStringTruncatedWidth;

// node_modules/.bun/fast-string-width@3.0.2/node_modules/fast-string-width/dist/index.js
var NO_TRUNCATION2 = {
  limit: Infinity,
  ellipsis: "",
  ellipsisWidth: 0
};
var fastStringWidth = (input, options = {}) => {
  return dist_default(input, NO_TRUNCATION2, options).width;
};
var dist_default2 = fastStringWidth;

// node_modules/.bun/fast-wrap-ansi@0.2.2/node_modules/fast-wrap-ansi/lib/main.js
var ESC = "\x1B";
var CSI = "";
var END_CODE = 39;
var ANSI_ESCAPE_BELL = "\x07";
var ANSI_CSI = "[";
var ANSI_OSC = "]";
var ANSI_SGR_TERMINATOR = "m";
var ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;
var GROUP_REGEX = new RegExp(`(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`, "y");
var getClosingCode = (openingCode) => {
  if (openingCode >= 30 && openingCode <= 37)
    return 39;
  if (openingCode >= 90 && openingCode <= 97)
    return 39;
  if (openingCode >= 40 && openingCode <= 47)
    return 49;
  if (openingCode >= 100 && openingCode <= 107)
    return 49;
  if (openingCode === 1 || openingCode === 2)
    return 22;
  if (openingCode === 3)
    return 23;
  if (openingCode === 4)
    return 24;
  if (openingCode === 7)
    return 27;
  if (openingCode === 8)
    return 28;
  if (openingCode === 9)
    return 29;
  if (openingCode === 0)
    return 0;
  return;
};
var wrapAnsiCode = (code) => `${ESC}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`;
var wrapAnsiHyperlink = (url) => `${ESC}${ANSI_ESCAPE_LINK}${url}${ANSI_ESCAPE_BELL}`;
var wrapWord = (rows, word, columns) => {
  const characters = word[Symbol.iterator]();
  let isInsideEscape = false;
  let isInsideLinkEscape = false;
  let lastRow = rows.at(-1);
  let visible = lastRow === undefined ? 0 : dist_default2(lastRow);
  let currentCharacter = characters.next();
  let nextCharacter = characters.next();
  let rawCharacterIndex = 0;
  while (!currentCharacter.done) {
    const character = currentCharacter.value;
    const characterLength = dist_default2(character);
    if (visible + characterLength <= columns) {
      rows[rows.length - 1] += character;
    } else {
      rows.push(character);
      visible = 0;
    }
    if (character === ESC || character === CSI) {
      isInsideEscape = true;
      isInsideLinkEscape = word.startsWith(ANSI_ESCAPE_LINK, rawCharacterIndex + 1);
    }
    if (isInsideEscape) {
      if (isInsideLinkEscape) {
        if (character === ANSI_ESCAPE_BELL) {
          isInsideEscape = false;
          isInsideLinkEscape = false;
        }
      } else if (character === ANSI_SGR_TERMINATOR) {
        isInsideEscape = false;
      }
    } else {
      visible += characterLength;
      if (visible === columns && !nextCharacter.done) {
        rows.push("");
        visible = 0;
      }
    }
    currentCharacter = nextCharacter;
    nextCharacter = characters.next();
    rawCharacterIndex += character.length;
  }
  lastRow = rows.at(-1);
  if (!visible && lastRow !== undefined && lastRow.length && rows.length > 1) {
    rows[rows.length - 2] += rows.pop();
  }
};
var stringVisibleTrimSpacesRight = (string) => {
  const words = string.split(" ");
  let last = words.length;
  while (last) {
    if (dist_default2(words[last - 1])) {
      break;
    }
    last--;
  }
  if (last === words.length) {
    return string;
  }
  return words.slice(0, last).join(" ") + words.slice(last).join("");
};
var exec = (string, columns, options = {}) => {
  if (options.trim !== false && string.trim() === "") {
    return "";
  }
  let returnValue = "";
  let escapeCode;
  let escapeUrl;
  const words = string.split(" ");
  let rows = [""];
  let rowLength = 0;
  for (let index = 0;index < words.length; index++) {
    const word = words[index];
    if (options.trim !== false) {
      const row = rows.at(-1) ?? "";
      const trimmed = row.trimStart();
      if (row.length !== trimmed.length) {
        rows[rows.length - 1] = trimmed;
        rowLength = dist_default2(trimmed);
      }
    }
    if (index !== 0) {
      if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
        rows.push("");
        rowLength = 0;
      }
      if (rowLength || options.trim === false) {
        rows[rows.length - 1] += " ";
        rowLength++;
      }
    }
    const wordLength = dist_default2(word);
    if (options.hard && wordLength > columns) {
      const remainingColumns = columns - rowLength;
      const breaksStartingThisLine = 1 + Math.floor((wordLength - remainingColumns - 1) / columns);
      const breaksStartingNextLine = Math.floor((wordLength - 1) / columns);
      if (breaksStartingNextLine < breaksStartingThisLine) {
        rows.push("");
      }
      wrapWord(rows, word, columns);
      rowLength = dist_default2(rows.at(-1) ?? "");
      continue;
    }
    if (rowLength + wordLength > columns && rowLength && wordLength) {
      if (options.wordWrap === false && rowLength < columns) {
        wrapWord(rows, word, columns);
        rowLength = dist_default2(rows.at(-1) ?? "");
        continue;
      }
      rows.push("");
      rowLength = 0;
    }
    if (rowLength + wordLength > columns && options.wordWrap === false) {
      wrapWord(rows, word, columns);
      rowLength = dist_default2(rows.at(-1) ?? "");
      continue;
    }
    rows[rows.length - 1] += word;
    rowLength += wordLength;
  }
  if (options.trim !== false) {
    rows = rows.map((row) => stringVisibleTrimSpacesRight(row));
  }
  const preString = rows.join(`
`);
  let inSurrogate = false;
  for (let i = 0;i < preString.length; i++) {
    const character = preString[i];
    returnValue += character;
    if (!inSurrogate) {
      inSurrogate = character >= "\uD800" && character <= "\uDBFF";
      if (inSurrogate) {
        continue;
      }
    } else {
      inSurrogate = false;
    }
    if (character === ESC || character === CSI) {
      GROUP_REGEX.lastIndex = i + 1;
      const groupsResult = GROUP_REGEX.exec(preString);
      const groups = groupsResult?.groups;
      if (groups?.code !== undefined) {
        const code = Number.parseFloat(groups.code);
        escapeCode = code === END_CODE ? undefined : code;
      } else if (groups?.uri !== undefined) {
        escapeUrl = groups.uri.length === 0 ? undefined : groups.uri;
      }
    }
    if (preString[i + 1] === `
`) {
      if (escapeUrl) {
        returnValue += wrapAnsiHyperlink("");
      }
      const closingCode = escapeCode ? getClosingCode(escapeCode) : undefined;
      if (escapeCode && closingCode) {
        returnValue += wrapAnsiCode(closingCode);
      }
    } else if (character === `
`) {
      if (escapeCode && getClosingCode(escapeCode)) {
        returnValue += wrapAnsiCode(escapeCode);
      }
      if (escapeUrl) {
        returnValue += wrapAnsiHyperlink(escapeUrl);
      }
    }
  }
  return returnValue;
};
var CRLF_OR_LF = /\r?\n/;
function wrapAnsi(string, columns, options) {
  return String(string).normalize().split(CRLF_OR_LF).map((line) => exec(line, columns, options)).join(`
`);
}

// node_modules/.bun/@clack+core@1.4.3/node_modules/@clack/core/dist/index.mjs
var import_sisteransi = __toESM(require_src(), 1);
import { ReadStream } from "node:tty";
function findCursor(s, o, l2) {
  if (!l2.some((r) => !r.disabled))
    return s;
  const t = s + o, n = Math.max(l2.length - 1, 0), e = t < 0 ? n : t > n ? 0 : t;
  return l2[e]?.disabled ? findCursor(e, o < 0 ? -1 : 1, l2) : e;
}
function findTextCursor(s, o, l2, i) {
  const t = i.split(`
`);
  let n = 0, e = s;
  for (const r of t) {
    if (e <= r.length)
      break;
    e -= r.length + 1, n++;
  }
  for (n = Math.max(0, Math.min(t.length - 1, n + l2)), e = Math.min(e, t[n].length) + o;e < 0 && n > 0; )
    n--, e += t[n].length + 1;
  for (;e > t[n].length && n < t.length - 1; )
    e -= t[n].length + 1, n++;
  e = Math.max(0, Math.min(t[n].length, e));
  let h = 0;
  for (let r = 0;r < n; r++)
    h += t[r].length + 1;
  return h + e;
}
var a$1 = ["up", "down", "left", "right", "space", "enter", "cancel"];
var t = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var settings = {
  actions: new Set(a$1),
  aliases: /* @__PURE__ */ new Map([
    ["k", "up"],
    ["j", "down"],
    ["h", "left"],
    ["l", "right"],
    ["\x03", "cancel"],
    ["escape", "cancel"]
  ]),
  messages: {
    cancel: "Canceled",
    error: "Something went wrong"
  },
  withGuide: true,
  date: {
    monthNames: [...t],
    messages: {
      required: "Please enter a valid date",
      invalidMonth: "There are only 12 months in a year",
      invalidDay: (n, e) => `There are only ${n} days in ${e}`,
      afterMin: (n) => `Date must be on or after ${n.toISOString().slice(0, 10)}`,
      beforeMax: (n) => `Date must be on or before ${n.toISOString().slice(0, 10)}`
    }
  }
};
function isActionKey(n, e) {
  if (typeof n == "string")
    return settings.aliases.get(n) === e;
  for (const s of n)
    if (s !== undefined && isActionKey(s, e))
      return true;
  return false;
}
function diffLines(i, s) {
  if (i === s)
    return;
  const e = i.split(`
`), t2 = s.split(`
`), r = Math.max(e.length, t2.length), f = [];
  for (let n = 0;n < r; n++)
    e[n] !== t2[n] && f.push(n);
  return {
    lines: f,
    numLinesBefore: e.length,
    numLinesAfter: t2.length,
    numLines: r
  };
}
var R = globalThis.process.platform.startsWith("win");
var CANCEL_SYMBOL = Symbol("clack:cancel");
function setRawMode(e, r) {
  const o = e;
  o.isTTY && o.setRawMode(r);
}
function block({
  input: e = stdin,
  output: r = stdout,
  overwrite: o = true,
  hideCursor: t2 = true
} = {}) {
  const s = l.createInterface({
    input: e,
    output: r,
    prompt: "",
    tabSize: 1
  });
  l.emitKeypressEvents(e, s), e instanceof ReadStream && e.isTTY && e.setRawMode(true);
  const n = (f, { name: a, sequence: p }) => {
    const c = String(f);
    if (isActionKey([c, a, p], "cancel")) {
      t2 && r.write(import_sisteransi.cursor.show), process.exit(0);
      return;
    }
    if (!o)
      return;
    const i = a === "return" ? 0 : -1, m = a === "return" ? -1 : 0;
    l.moveCursor(r, i, m, () => {
      l.clearLine(r, 1, () => {
        e.once("keypress", n);
      });
    });
  };
  return t2 && r.write(import_sisteransi.cursor.hide), e.once("keypress", n), () => {
    e.off("keypress", n), t2 && r.write(import_sisteransi.cursor.show), e instanceof ReadStream && e.isTTY && !R && e.setRawMode(false), s.terminal = false, s.close();
  };
}
var getColumns = (e) => ("columns" in e) && typeof e.columns == "number" ? e.columns : 80;
var getRows = (e) => ("rows" in e) && typeof e.rows == "number" ? e.rows : 20;
function runValidation(e, n) {
  if ("~standard" in e) {
    const a = e["~standard"].validate(n);
    if (a instanceof Promise)
      throw new TypeError("Schema validation must be synchronous. Update `validate()` and remove any asynchronous logic.");
    return a.issues?.at(0)?.message;
  }
  return e(n);
}

class V {
  input;
  output;
  _abortSignal;
  rl;
  opts;
  _render;
  _track = false;
  _prevFrame = "";
  _subscribers = /* @__PURE__ */ new Map;
  _cursor = 0;
  state = "initial";
  error = "";
  value;
  userInput = "";
  constructor(t2, e = true) {
    const { input: i = stdin, output: n = stdout, render: s, signal: r, ...o } = t2;
    this.opts = o, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = s.bind(this), this._track = e, this._abortSignal = r, this.input = i, this.output = n;
  }
  unsubscribe() {
    this._subscribers.clear();
  }
  setSubscriber(t2, e) {
    const i = this._subscribers.get(t2) ?? [];
    i.push(e), this._subscribers.set(t2, i);
  }
  on(t2, e) {
    this.setSubscriber(t2, { cb: e });
  }
  once(t2, e) {
    this.setSubscriber(t2, { cb: e, once: true });
  }
  emit(t2, ...e) {
    const i = this._subscribers.get(t2) ?? [], n = [];
    for (const s of i)
      s.cb(...e), s.once && n.push(() => i.splice(i.indexOf(s), 1));
    for (const s of n)
      s();
  }
  prompt() {
    return new Promise((t2) => {
      if (this._abortSignal) {
        if (this._abortSignal.aborted)
          return this.state = "cancel", this.close(), t2(CANCEL_SYMBOL);
        this._abortSignal.addEventListener("abort", () => {
          this.state = "cancel", this.close();
        }, { once: true });
      }
      this.rl = l__default.createInterface({
        input: this.input,
        tabSize: 2,
        prompt: "",
        escapeCodeTimeout: 50,
        terminal: true
      }), this.rl.prompt(), this.opts.initialUserInput !== undefined && this._setUserInput(this.opts.initialUserInput, true), this.input.on("keypress", this.onKeypress), setRawMode(this.input, true), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), setRawMode(this.input, false), t2(this.value);
      }), this.once("cancel", () => {
        this.output.write(import_sisteransi.cursor.show), this.output.off("resize", this.render), setRawMode(this.input, false), t2(CANCEL_SYMBOL);
      });
    });
  }
  _isActionKey(t2, e) {
    return t2 === "\t";
  }
  _shouldSubmit(t2, e) {
    return true;
  }
  _setValue(t2) {
    this.value = t2, this.emit("value", this.value);
  }
  _setUserInput(t2, e) {
    this.userInput = t2 ?? "", this.emit("userInput", this.userInput), e && this._track && this.rl && (this.rl.write(this.userInput), this._cursor = this.rl.cursor);
  }
  _clearUserInput() {
    this.rl?.write(null, { ctrl: true, name: "u" }), this._setUserInput("");
  }
  onKeypress(t2, e) {
    if (this._track && e.name !== "return" && (e.name && this._isActionKey(t2, e) && this.rl?.write(null, { ctrl: true, name: "h" }), this._cursor = this.rl?.cursor ?? 0, this._setUserInput(this.rl?.line)), this.state === "error" && (this.state = "active"), e?.name && (!this._track && settings.aliases.has(e.name) && this.emit("cursor", settings.aliases.get(e.name)), settings.actions.has(e.name) && this.emit("cursor", e.name)), t2 && (t2.toLowerCase() === "y" || t2.toLowerCase() === "n") && this.emit("confirm", t2.toLowerCase() === "y"), this.emit("key", t2, e), e?.name === "return" && this._shouldSubmit(t2, e)) {
      if (this.opts.validate) {
        const i = runValidation(this.opts.validate, this.value);
        i && (this.error = i instanceof Error ? i.message : i, this.state = "error", this.rl?.write(this.userInput));
      }
      this.state !== "error" && (this.state = "submit");
    }
    isActionKey([t2, e?.name, e?.sequence], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
  }
  close() {
    this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write(`
`), setRawMode(this.input, false), this.rl?.close(), this.rl = undefined, this.emit(`${this.state}`, this.value), this.unsubscribe();
  }
  restoreCursor() {
    const t2 = wrapAnsi(this._prevFrame, process.stdout.columns, { hard: true, trim: false }).split(`
`).length - 1;
    this.output.write(import_sisteransi.cursor.move(-999, t2 * -1));
  }
  render() {
    const t2 = wrapAnsi(this._render(this) ?? "", process.stdout.columns, {
      hard: true,
      trim: false
    });
    if (t2 !== this._prevFrame) {
      if (this.state === "initial")
        this.output.write(import_sisteransi.cursor.hide);
      else {
        const e = diffLines(this._prevFrame, t2), i = getRows(this.output);
        if (this.restoreCursor(), e) {
          const n = Math.max(0, e.numLinesAfter - i), s = Math.max(0, e.numLinesBefore - i);
          let r = e.lines.find((o) => o >= n);
          if (r === undefined) {
            this._prevFrame = t2;
            return;
          }
          if (e.lines.length === 1) {
            this.output.write(import_sisteransi.cursor.move(0, r - s)), this.output.write(import_sisteransi.erase.lines(1));
            const o = t2.split(`
`);
            this.output.write(o[r]), this._prevFrame = t2, this.output.write(import_sisteransi.cursor.move(0, o.length - r - 1));
            return;
          } else if (e.lines.length > 1) {
            if (n < s)
              r = n;
            else {
              const h = r - s;
              h > 0 && this.output.write(import_sisteransi.cursor.move(0, h));
            }
            this.output.write(import_sisteransi.erase.down());
            const f = t2.split(`
`).slice(r);
            this.output.write(f.join(`
`)), this._prevFrame = t2;
            return;
          }
        }
        this.output.write(import_sisteransi.erase.down());
      }
      this.output.write(t2), this.state === "initial" && (this.state = "active"), this._prevFrame = t2;
    }
  }
}
function p$1(l2, e) {
  if (l2 === undefined || e.length === 0)
    return 0;
  const i = e.findIndex((s) => s.value === l2);
  return i !== -1 ? i : 0;
}
function g(l2, e) {
  return (e.label ?? String(e.value)).toLowerCase().includes(l2.toLowerCase());
}
function m(l2, e) {
  if (e)
    return l2 ? e : e[0];
}
var T$1 = class T extends V {
  filteredOptions;
  multiple;
  isNavigating = false;
  selectedValues = [];
  focusedValue;
  #e = 0;
  #s = "";
  #t;
  #i;
  #n;
  get cursor() {
    return this.#e;
  }
  get userInputWithCursor() {
    if (!this.userInput)
      return styleText(["inverse", "hidden"], "_");
    if (this._cursor >= this.userInput.length)
      return `${this.userInput}█`;
    const e = this.userInput.slice(0, this.cursor), t2 = this.userInput.slice(this.cursor, this.cursor + 1), i = this.userInput.slice(this.cursor + 1);
    return `${e}${styleText("inverse", t2)}${i}`;
  }
  get options() {
    return typeof this.#i == "function" ? this.#i() : this.#i;
  }
  constructor(e) {
    super(e), this.#i = e.options, this.#n = e.placeholder;
    const t2 = this.options;
    this.filteredOptions = [...t2], this.multiple = e.multiple === true, this.#t = typeof e.options == "function" ? e.filter : e.filter ?? g;
    let i;
    if (e.initialValue && Array.isArray(e.initialValue) ? this.multiple ? i = e.initialValue : i = e.initialValue.slice(0, 1) : !this.multiple && this.options.length > 0 && (i = [this.options[0]?.value]), i)
      for (const s of i) {
        const n = t2.findIndex((o) => o.value === s);
        n !== -1 && (this.toggleSelected(s), this.#e = n);
      }
    this.focusedValue = this.options[this.#e]?.value, this.on("key", (s, n) => this.#l(s, n)), this.on("userInput", (s) => this.#u(s));
  }
  _isActionKey(e, t2) {
    return e === "\t" || this.multiple && this.isNavigating && t2.name === "space" && e !== undefined && e !== "";
  }
  #l(e, t2) {
    const i = t2.name === "up", s = t2.name === "down", n = t2.name === "return", o = this.userInput === "" || this.userInput === "\t", u = this.#n, a = this.options, f = u !== undefined && u !== "" && a.some((r) => !r.disabled && (this.#t ? this.#t(u, r) : true));
    if (t2.name === "tab" && o && f) {
      this.userInput === "\t" && this._clearUserInput(), this._setUserInput(u, true), this.isNavigating = false;
      return;
    }
    i || s ? (this.#e = findCursor(this.#e, i ? -1 : 1, this.filteredOptions), this.focusedValue = this.filteredOptions[this.#e]?.value, this.multiple || (this.selectedValues = [this.focusedValue]), this.isNavigating = true) : n ? this.value = m(this.multiple, this.selectedValues) : this.multiple ? this.focusedValue !== undefined && (t2.name === "tab" || this.isNavigating && t2.name === "space") ? this.toggleSelected(this.focusedValue) : this.isNavigating = false : (this.focusedValue && (this.selectedValues = [this.focusedValue]), this.isNavigating = false);
  }
  deselectAll() {
    this.selectedValues = [];
  }
  toggleSelected(e) {
    this.filteredOptions.length !== 0 && (this.multiple ? this.selectedValues.includes(e) ? this.selectedValues = this.selectedValues.filter((t2) => t2 !== e) : this.selectedValues = [...this.selectedValues, e] : this.selectedValues = [e]);
  }
  #u(e) {
    if (e !== this.#s) {
      this.#s = e;
      const t2 = this.options;
      e && this.#t ? this.filteredOptions = t2.filter((n) => this.#t?.(e, n)) : this.filteredOptions = [...t2];
      const i = p$1(this.focusedValue, this.filteredOptions);
      this.#e = findCursor(i, 0, this.filteredOptions);
      const s = this.filteredOptions[this.#e];
      s && !s.disabled ? this.focusedValue = s.value : this.focusedValue = undefined, this.multiple || (this.focusedValue !== undefined ? this.toggleSelected(this.focusedValue) : this.deselectAll());
    }
  }
};
var _ = {
  Y: { type: "year", len: 4 },
  M: { type: "month", len: 2 },
  D: { type: "day", len: 2 }
};
function M(r) {
  return [...r].map((t2) => _[t2]);
}
function P(r) {
  const i = new Intl.DateTimeFormat(r, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date(2000, 0, 15)), s = [];
  let n = "/";
  for (const e of i)
    e.type === "literal" ? n = e.value.trim() || e.value : (e.type === "year" || e.type === "month" || e.type === "day") && s.push({ type: e.type, len: e.type === "year" ? 4 : 2 });
  return { segments: s, separator: n };
}
function p(r) {
  return Number.parseInt((r || "0").replace(/_/g, "0"), 10) || 0;
}
function f(r) {
  return {
    year: p(r.year),
    month: p(r.month),
    day: p(r.day)
  };
}
function c(r, t2) {
  return new Date(r || 2001, t2 || 1, 0).getDate();
}
function b(r) {
  const { year: t2, month: i, day: s } = f(r);
  if (!t2 || t2 < 0 || t2 > 9999 || !i || i < 1 || i > 12 || !s || s < 1)
    return;
  const n = new Date(Date.UTC(t2, i - 1, s));
  if (!(n.getUTCFullYear() !== t2 || n.getUTCMonth() !== i - 1 || n.getUTCDate() !== s))
    return { year: t2, month: i, day: s };
}
function C(r) {
  const t2 = b(r);
  return t2 ? new Date(Date.UTC(t2.year, t2.month - 1, t2.day)) : undefined;
}
function T2(r, t2, i, s) {
  const n = i ? {
    year: i.getUTCFullYear(),
    month: i.getUTCMonth() + 1,
    day: i.getUTCDate()
  } : null, e = s ? {
    year: s.getUTCFullYear(),
    month: s.getUTCMonth() + 1,
    day: s.getUTCDate()
  } : null;
  return r === "year" ? { min: n?.year ?? 1, max: e?.year ?? 9999 } : r === "month" ? {
    min: n && t2.year === n.year ? n.month : 1,
    max: e && t2.year === e.year ? e.month : 12
  } : {
    min: n && t2.year === n.year && t2.month === n.month ? n.day : 1,
    max: e && t2.year === e.year && t2.month === e.month ? e.day : c(t2.year, t2.month)
  };
}

class U extends V {
  #i;
  #o;
  #t;
  #h;
  #u;
  #e = { segmentIndex: 0, positionInSegment: 0 };
  #n = true;
  #s = null;
  inlineError = "";
  get segmentCursor() {
    return { ...this.#e };
  }
  get segmentValues() {
    return { ...this.#t };
  }
  get segments() {
    return this.#i;
  }
  get separator() {
    return this.#o;
  }
  get formattedValue() {
    return this.#l(this.#t);
  }
  #l(t2) {
    return this.#i.map((i) => t2[i.type]).join(this.#o);
  }
  #r() {
    this._setUserInput(this.#l(this.#t)), this._setValue(C(this.#t) ?? undefined);
  }
  constructor(t2) {
    const i = t2.format ? { segments: M(t2.format), separator: t2.separator ?? "/" } : P(t2.locale), s = t2.separator ?? i.separator, n = t2.format ? M(t2.format) : i.segments, e = t2.initialValue ?? t2.defaultValue, m2 = e ? {
      year: String(e.getUTCFullYear()).padStart(4, "0"),
      month: String(e.getUTCMonth() + 1).padStart(2, "0"),
      day: String(e.getUTCDate()).padStart(2, "0")
    } : { year: "____", month: "__", day: "__" }, o = n.map((a) => m2[a.type]).join(s);
    super({ ...t2, initialUserInput: o }, false), this.#i = n, this.#o = s, this.#t = m2, this.#h = t2.minDate, this.#u = t2.maxDate, this.#r(), this.on("cursor", (a) => this.#f(a)), this.on("key", (a, u) => this.#y(a, u)), this.on("finalize", () => this.#p(t2));
  }
  #a() {
    const t2 = Math.max(0, Math.min(this.#e.segmentIndex, this.#i.length - 1)), i = this.#i[t2];
    if (i)
      return this.#e.positionInSegment = Math.max(0, Math.min(this.#e.positionInSegment, i.len - 1)), { segment: i, index: t2 };
  }
  #m(t2) {
    this.inlineError = "", this.#s = null;
    const i = this.#a();
    i && (this.#e.segmentIndex = Math.max(0, Math.min(this.#i.length - 1, i.index + t2)), this.#e.positionInSegment = 0, this.#n = true);
  }
  #d(t2) {
    const i = this.#a();
    if (!i)
      return;
    const { segment: s } = i, n = this.#t[s.type], e = !n || n.replace(/_/g, "") === "", m2 = Number.parseInt((n || "0").replace(/_/g, "0"), 10) || 0, o = T2(s.type, f(this.#t), this.#h, this.#u);
    let a;
    e ? a = t2 === 1 ? o.min : o.max : a = Math.max(Math.min(o.max, m2 + t2), o.min), this.#t = {
      ...this.#t,
      [s.type]: a.toString().padStart(s.len, "0")
    }, this.#n = true, this.#s = null, this.#r();
  }
  #f(t2) {
    if (t2)
      switch (t2) {
        case "right":
          return this.#m(1);
        case "left":
          return this.#m(-1);
        case "up":
          return this.#d(1);
        case "down":
          return this.#d(-1);
      }
  }
  #y(t2, i) {
    if (i?.name === "backspace" || i?.sequence === "" || i?.sequence === "\b" || t2 === "" || t2 === "\b") {
      this.inlineError = "";
      const n = this.#a();
      if (!n)
        return;
      if (!this.#t[n.segment.type].replace(/_/g, "")) {
        this.#m(-1);
        return;
      }
      this.#t[n.segment.type] = "_".repeat(n.segment.len), this.#n = true, this.#e.positionInSegment = 0, this.#r();
      return;
    }
    if (i?.name === "tab") {
      this.inlineError = "";
      const n = this.#a();
      if (!n)
        return;
      const e = i.shift ? -1 : 1, m2 = n.index + e;
      m2 >= 0 && m2 < this.#i.length && (this.#e.segmentIndex = m2, this.#e.positionInSegment = 0, this.#n = true);
      return;
    }
    if (t2 && /^[0-9]$/.test(t2)) {
      const n = this.#a();
      if (!n)
        return;
      const { segment: e } = n, m2 = !this.#t[e.type].replace(/_/g, "");
      if (this.#n && this.#s !== null && !m2) {
        const h = this.#s + t2, d = { ...this.#t, [e.type]: h }, g2 = this.#g(d, e);
        if (g2) {
          this.inlineError = g2, this.#s = null, this.#n = false;
          return;
        }
        this.inlineError = "", this.#t[e.type] = h, this.#s = null, this.#n = false, this.#r(), n.index < this.#i.length - 1 && (this.#e.segmentIndex = n.index + 1, this.#e.positionInSegment = 0, this.#n = true);
        return;
      }
      this.#n && !m2 && (this.#t[e.type] = "_".repeat(e.len), this.#e.positionInSegment = 0), this.#n = false, this.#s = null;
      const o = this.#t[e.type], a = o.indexOf("_"), u = a >= 0 ? a : Math.min(this.#e.positionInSegment, e.len - 1);
      if (u < 0 || u >= e.len)
        return;
      let l2 = o.slice(0, u) + t2 + o.slice(u + 1), D = false;
      if (u === 0 && o === "__" && (e.type === "month" || e.type === "day")) {
        const h = Number.parseInt(t2, 10);
        l2 = `0${t2}`, D = h <= (e.type === "month" ? 1 : 2);
      }
      if (e.type === "year" && (l2 = (o.replace(/_/g, "") + t2).padStart(e.len, "_")), !l2.includes("_")) {
        const h = { ...this.#t, [e.type]: l2 }, d = this.#g(h, e);
        if (d) {
          this.inlineError = d;
          return;
        }
      }
      this.inlineError = "", this.#t[e.type] = l2;
      const y = l2.includes("_") ? undefined : b(this.#t);
      if (y) {
        const { year: h, month: d } = y, g2 = c(h, d);
        this.#t = {
          year: String(Math.max(0, Math.min(9999, h))).padStart(4, "0"),
          month: String(Math.max(1, Math.min(12, d))).padStart(2, "0"),
          day: String(Math.max(1, Math.min(g2, y.day))).padStart(2, "0")
        };
      }
      this.#r();
      const S = l2.indexOf("_");
      D ? (this.#n = true, this.#s = t2) : S >= 0 ? this.#e.positionInSegment = S : a >= 0 && n.index < this.#i.length - 1 ? (this.#e.segmentIndex = n.index + 1, this.#e.positionInSegment = 0, this.#n = true) : this.#e.positionInSegment = Math.min(u + 1, e.len - 1);
    }
  }
  #g(t2, i) {
    const { month: s, day: n } = f(t2);
    if (i.type === "month" && (s < 0 || s > 12))
      return settings.date.messages.invalidMonth;
    if (i.type === "day" && (n < 0 || n > 31))
      return settings.date.messages.invalidDay(31, "any month");
  }
  #p(t2) {
    const { year: i, month: s, day: n } = f(this.#t);
    if (i && s && n) {
      const e = c(i, s);
      this.#t = {
        ...this.#t,
        day: String(Math.min(n, e)).padStart(2, "0")
      };
    }
    this.value = C(this.#t) ?? t2.defaultValue ?? undefined;
  }
}
var u$2 = class u extends V {
  options;
  cursor = 0;
  #t;
  getGroupItems(t2) {
    return this.options.filter((r) => r.group === t2);
  }
  isGroupSelected(t2) {
    const r = this.getGroupItems(t2), e = this.value;
    return e === undefined ? false : r.every((s) => e.includes(s.value));
  }
  toggleValue() {
    const t2 = this.options[this.cursor];
    if (t2 !== undefined)
      if (this.value === undefined && (this.value = []), t2.group === true) {
        const r = t2.value, e = this.getGroupItems(r);
        this.isGroupSelected(r) ? this.value = this.value.filter((s) => e.findIndex((i) => i.value === s) === -1) : this.value = [...this.value, ...e.map((s) => s.value)], this.value = Array.from(new Set(this.value));
      } else {
        const r = this.value.includes(t2.value);
        this.value = r ? this.value.filter((e) => e !== t2.value) : [...this.value, t2.value];
      }
  }
  constructor(t2) {
    super(t2, false);
    const { options: r } = t2;
    this.#t = t2.selectableGroups !== false, this.options = Object.entries(r).flatMap(([e, s]) => [
      { value: e, group: true, label: e },
      ...s.map((i) => ({ ...i, group: e }))
    ]), this.value = [...t2.initialValues ?? []], this.cursor = Math.max(this.options.findIndex(({ value: e }) => e === t2.cursorAt), this.#t ? 0 : 1), this.on("cursor", (e) => {
      switch (e) {
        case "left":
        case "up": {
          this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
          const s = this.options[this.cursor]?.group === true;
          !this.#t && s && (this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1);
          break;
        }
        case "down":
        case "right": {
          this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
          const s = this.options[this.cursor]?.group === true;
          !this.#t && s && (this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1);
          break;
        }
        case "space":
          this.toggleValue();
          break;
      }
    });
  }
};
var o = /* @__PURE__ */ new Set(["up", "down", "left", "right"]);

class h extends V {
  #t = false;
  #s;
  focused = "editor";
  get userInputWithCursor() {
    if (this.state === "submit")
      return this.userInput;
    const t2 = this.userInput;
    if (this.cursor >= t2.length)
      return `${t2}█`;
    const s = t2.slice(0, this.cursor), r = t2.slice(this.cursor, this.cursor + 1), i = t2.slice(this.cursor + 1);
    return r === `
` ? `${s}█
${i}` : `${s}${styleText("inverse", r)}${i}`;
  }
  get cursor() {
    return this._cursor;
  }
  #r(t2) {
    if (this.userInput.length === 0) {
      this._setUserInput(t2);
      return;
    }
    this._setUserInput(this.userInput.slice(0, this.cursor) + t2 + this.userInput.slice(this.cursor));
  }
  #i(t2) {
    const s = this.value ?? "";
    switch (t2) {
      case "up":
        this._cursor = findTextCursor(this._cursor, 0, -1, s);
        return;
      case "down":
        this._cursor = findTextCursor(this._cursor, 0, 1, s);
        return;
      case "left":
        this._cursor = findTextCursor(this._cursor, -1, 0, s);
        return;
      case "right":
        this._cursor = findTextCursor(this._cursor, 1, 0, s);
        return;
    }
  }
  _shouldSubmit(t2, s) {
    if (this.#s)
      return this.focused === "submit" ? true : (this.#r(`
`), this._cursor++, false);
    const r = this.#t;
    return this.#t = true, r && this.cursor === this.userInput.length ? (this.userInput[this.cursor - 1] === `
` && (this._setUserInput(this.userInput.slice(0, this.cursor - 1) + this.userInput.slice(this.cursor)), this._cursor--), true) : (this.#r(`
`), this._cursor++, false);
  }
  constructor(t2) {
    const s = t2.initialUserInput ?? t2.initialValue;
    super({
      ...t2,
      initialUserInput: s
    }, false), s !== undefined && (this._cursor = s.length), this.#s = t2.showSubmit ?? false, this.on("key", (r, i) => {
      if (i?.name && o.has(i.name)) {
        this.#t = false, this.#i(i.name);
        return;
      }
      if (r === "\t" && this.#s) {
        this.focused = this.focused === "editor" ? "submit" : "editor";
        return;
      }
      if (i?.name !== "return") {
        if (this.#t = false, i?.name === "backspace" && this.cursor > 0) {
          this._setUserInput(this.userInput.slice(0, this.cursor - 1) + this.userInput.slice(this.cursor)), this._cursor--;
          return;
        }
        if (i?.name === "delete" && this.cursor < this.userInput.length) {
          this._setUserInput(this.userInput.slice(0, this.cursor) + this.userInput.slice(this.cursor + 1));
          return;
        }
        r && (this.#s && this.focused === "submit" && (this.focused = "editor"), this.#r(r ?? ""), this._cursor++);
      }
    }), this.on("userInput", (r) => {
      this._setValue(r);
    }), this.on("finalize", () => {
      this.value || (this.value = t2.defaultValue), this.value === undefined && (this.value = "");
    });
  }
}

// node_modules/.bun/@clack+prompts@1.7.0/node_modules/@clack/prompts/dist/index.mjs
import { styleText as styleText2, stripVTControlCharacters } from "node:util";
import process$1 from "node:process";
var import_sisteransi2 = __toESM(require_src(), 1);
function isUnicodeSupported() {
  if (process$1.platform !== "win32") {
    return process$1.env.TERM !== "linux";
  }
  return Boolean(process$1.env.CI) || Boolean(process$1.env.WT_SESSION) || Boolean(process$1.env.TERMINUS_SUBLIME) || process$1.env.ConEmuTask === "{cmd::Cmder}" || process$1.env.TERM_PROGRAM === "Terminus-Sublime" || process$1.env.TERM_PROGRAM === "vscode" || process$1.env.TERM === "xterm-256color" || process$1.env.TERM === "alacritty" || process$1.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
var unicode = isUnicodeSupported();
var isCI = () => process.env.CI === "true";
var unicodeOr = (o2, e) => unicode ? o2 : e;
var S_STEP_ACTIVE = unicodeOr("◆", "*");
var S_STEP_CANCEL = unicodeOr("■", "x");
var S_STEP_ERROR = unicodeOr("▲", "x");
var S_STEP_SUBMIT = unicodeOr("◇", "o");
var S_BAR_START = unicodeOr("┌", "T");
var S_BAR = unicodeOr("│", "|");
var S_BAR_END = unicodeOr("└", "—");
var S_BAR_START_RIGHT = unicodeOr("┐", "T");
var S_BAR_END_RIGHT = unicodeOr("┘", "—");
var S_RADIO_ACTIVE = unicodeOr("●", ">");
var S_RADIO_INACTIVE = unicodeOr("○", " ");
var S_CHECKBOX_ACTIVE = unicodeOr("◻", "[•]");
var S_CHECKBOX_SELECTED = unicodeOr("◼", "[+]");
var S_CHECKBOX_INACTIVE = unicodeOr("◻", "[ ]");
var S_PASSWORD_MASK = unicodeOr("▪", "•");
var S_BAR_H = unicodeOr("─", "-");
var S_CORNER_TOP_RIGHT = unicodeOr("╮", "+");
var S_CONNECT_LEFT = unicodeOr("├", "+");
var S_CORNER_BOTTOM_RIGHT = unicodeOr("╯", "+");
var S_CORNER_BOTTOM_LEFT = unicodeOr("╰", "+");
var S_CORNER_TOP_LEFT = unicodeOr("╭", "+");
var S_INFO = unicodeOr("●", "•");
var S_SUCCESS = unicodeOr("◆", "*");
var S_WARN = unicodeOr("▲", "!");
var S_ERROR = unicodeOr("■", "x");
var MULTISELECT_INSTRUCTIONS = [
  `${styleText2("dim", "↑/↓")} to navigate`,
  `${styleText2("dim", "Space:")} select`,
  `${styleText2("dim", "Enter:")} confirm`
];
var log = {
  message: (s = [], {
    symbol: e = styleText2("gray", S_BAR),
    secondarySymbol: r2 = styleText2("gray", S_BAR),
    output: m2 = process.stdout,
    spacing: l2 = 1,
    withGuide: c2
  } = {}) => {
    const t2 = [], o2 = c2 ?? settings.withGuide, f2 = o2 ? r2 : "", O = o2 ? `${e}  ` : "", u3 = o2 ? `${r2}  ` : "";
    for (let i = 0;i < l2; i++)
      t2.push(f2);
    const g2 = Array.isArray(s) ? s : s.split(`
`);
    if (g2.length > 0) {
      const [i, ...y] = g2;
      i.length > 0 ? t2.push(`${O}${i}`) : t2.push(o2 ? e : "");
      for (const p2 of y)
        p2.length > 0 ? t2.push(`${u3}${p2}`) : t2.push(o2 ? r2 : "");
    }
    m2.write(`${t2.join(`
`)}
`);
  },
  info: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("blue", S_INFO) });
  },
  success: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("green", S_SUCCESS) });
  },
  step: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("green", S_STEP_SUBMIT) });
  },
  warn: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("yellow", S_WARN) });
  },
  warning: (s, e) => {
    log.warn(s, e);
  },
  error: (s, e) => {
    log.message(s, { ...e, symbol: styleText2("red", S_ERROR) });
  }
};
var intro = (o2 = "", t2) => {
  const i = t2?.output ?? process.stdout, e = t2?.withGuide ?? settings.withGuide ? `${styleText2("gray", S_BAR_START)}  ` : "";
  i.write(`${e}${o2}
`);
};
var outro = (o2 = "", t2) => {
  const i = t2?.output ?? process.stdout, e = t2?.withGuide ?? settings.withGuide ? `${styleText2("gray", S_BAR)}
${styleText2("gray", S_BAR_END)}  ` : "";
  i.write(`${e}${o2}

`);
};
var W = (l2) => styleText2("magenta", l2);
var spinner = ({
  indicator: l2 = "dots",
  onCancel: h2,
  output: n2 = process.stdout,
  cancelMessage: G,
  errorMessage: O,
  frames: E = unicode ? ["◒", "◐", "◓", "◑"] : ["•", "o", "O", "0"],
  delay: F = unicode ? 80 : 120,
  signal: m2,
  ...I
} = {}) => {
  const u3 = isCI();
  let M2, T3, d = false, S = false, s = "", p2, w = performance.now();
  const x = getColumns(n2), k = I?.styleFrame ?? W, g2 = (e) => {
    const r2 = e > 1 ? O ?? settings.messages.error : G ?? settings.messages.cancel;
    S = e === 1, d && (a2(r2, e), S && typeof h2 == "function" && h2());
  }, f2 = () => g2(2), i = () => g2(1), A = () => {
    process.on("uncaughtExceptionMonitor", f2), process.on("unhandledRejection", f2), process.on("SIGINT", i), process.on("SIGTERM", i), process.on("exit", g2), m2 && m2.addEventListener("abort", i);
  }, H = () => {
    process.removeListener("uncaughtExceptionMonitor", f2), process.removeListener("unhandledRejection", f2), process.removeListener("SIGINT", i), process.removeListener("SIGTERM", i), process.removeListener("exit", g2), m2 && m2.removeEventListener("abort", i);
  }, y = () => {
    if (p2 === undefined)
      return;
    u3 && n2.write(`
`);
    const r2 = wrapAnsi(p2, x, {
      hard: true,
      trim: false
    }).split(`
`);
    r2.length > 1 && n2.write(import_sisteransi2.cursor.up(r2.length - 1)), n2.write(import_sisteransi2.cursor.to(0)), n2.write(import_sisteransi2.erase.down());
  }, C2 = (e) => e.replace(/\.+$/, ""), _2 = (e) => {
    const r2 = (performance.now() - e) / 1000, t2 = Math.floor(r2 / 60), o2 = Math.floor(r2 % 60);
    return t2 > 0 ? `[${t2}m ${o2}s]` : `[${o2}s]`;
  }, N = I.withGuide ?? settings.withGuide, P2 = (e = "") => {
    d = true, M2 = block({ output: n2 }), s = C2(e), w = performance.now(), N && n2.write(`${styleText2("gray", S_BAR)}
`);
    let r2 = 0, t2 = 0;
    A(), T3 = setInterval(() => {
      if (u3 && s === p2)
        return;
      y(), p2 = s;
      const o2 = k(E[r2]);
      let v;
      if (u3)
        v = `${o2}  ${s}...`;
      else if (l2 === "timer")
        v = `${o2}  ${s} ${_2(w)}`;
      else {
        const B = ".".repeat(Math.floor(t2)).slice(0, 3);
        v = `${o2}  ${s}${B}`;
      }
      const j = wrapAnsi(v, x, {
        hard: true,
        trim: false
      });
      n2.write(j), r2 = r2 + 1 < E.length ? r2 + 1 : 0, t2 = t2 < 4 ? t2 + 0.125 : 0;
    }, F);
  }, a2 = (e = "", r2 = 0, t2 = false) => {
    if (!d)
      return;
    d = false, clearInterval(T3), y();
    const o2 = r2 === 0 ? styleText2("green", S_STEP_SUBMIT) : r2 === 1 ? styleText2("red", S_STEP_CANCEL) : styleText2("red", S_STEP_ERROR);
    s = e ?? s, t2 || (l2 === "timer" ? n2.write(`${o2}  ${s} ${_2(w)}
`) : n2.write(`${o2}  ${s}
`)), H(), M2();
  };
  return {
    start: P2,
    stop: (e = "") => a2(e, 0),
    message: (e = "") => {
      s = C2(e ?? s);
    },
    cancel: (e = "") => a2(e, 1),
    error: (e = "") => a2(e, 2),
    clear: () => a2("", 0, true),
    get isCancelled() {
      return S;
    }
  };
};
var u3 = {
  light: unicodeOr("─", "-"),
  heavy: unicodeOr("━", "="),
  block: unicodeOr("█", "#")
};
var SELECT_INSTRUCTIONS = [
  `${styleText2("dim", "↑/↓")} to navigate`,
  `${styleText2("dim", "Enter:")} confirm`
];
var i = `${styleText2("gray", S_BAR)}  `;

// packages/scanner/src/types.ts
var ECategory = {
  CRAWLER_ACCESS: "crawler_access",
  RENDERING: "rendering",
  STRUCTURED_DATA: "structured_data",
  TRUST: "trust",
  GEO_CONTENT: "geo_content"
};
var CATEGORY_LABELS = {
  [ECategory.CRAWLER_ACCESS]: "Crawler access",
  [ECategory.RENDERING]: "Rendering",
  [ECategory.STRUCTURED_DATA]: "Structured data",
  [ECategory.TRUST]: "Trust & security",
  [ECategory.GEO_CONTENT]: "Content (GEO)"
};
var EStatus = {
  PASS: "pass",
  WARN: "warn",
  FAIL: "fail",
  INFO: "info",
  ERROR: "error"
};
var ELevel = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high"
};
var ECheckScope = {
  SITE: "site",
  PAGE: "page"
};
var EGrade = {
  EXCELLENT: "excellent",
  GOOD: "good",
  MODERATE: "moderate",
  POOR: "poor"
};

// packages/scanner/src/checks/builder.ts
var DEFAULT_SCORES = {
  [EStatus.PASS]: 1,
  [EStatus.WARN]: 0.5,
  [EStatus.FAIL]: 0,
  [EStatus.INFO]: 1,
  [EStatus.ERROR]: 0
};
function defineCheck(def, run) {
  return { ...def, scope: def.scope ?? ECheckScope.PAGE, run };
}
function makeResult(def, status, detail, extra = {}) {
  return {
    id: def.id,
    category: def.category,
    status,
    score: extra.score ?? DEFAULT_SCORES[status],
    weight: def.weight,
    title: def.title,
    detail,
    evidence: extra.evidence,
    fix: extra.fix,
    impact: extra.impact,
    effort: extra.effort,
    docsUrl: extra.docsUrl
  };
}

// packages/scanner/src/util/robots.ts
function parseRobots(text) {
  const groups = [];
  const sitemaps = [];
  const warnings = [];
  let current = null;
  let lastWasAgent = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (line.length === 0) {
      continue;
    }
    const colon = line.indexOf(":");
    if (colon === -1) {
      warnings.push(`Line without directive: "${truncate(rawLine)}"`);
      continue;
    }
    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    switch (field) {
      case "user-agent": {
        if (!lastWasAgent || current === null) {
          current = { agents: [], rules: [] };
          groups.push(current);
        }
        current.agents.push(value.toLowerCase());
        lastWasAgent = true;
        break;
      }
      case "allow":
      case "disallow": {
        if (current === null) {
          warnings.push(`Rule before any User-agent: "${truncate(rawLine)}"`);
          break;
        }
        current.rules.push({ type: field, path: value });
        lastWasAgent = false;
        break;
      }
      case "sitemap": {
        if (value.length > 0) {
          sitemaps.push(value);
        }
        lastWasAgent = false;
        break;
      }
      case "crawl-delay":
      case "host": {
        lastWasAgent = false;
        break;
      }
      default: {
        warnings.push(`Unknown directive "${field}"`);
        lastWasAgent = false;
      }
    }
  }
  return { groups, sitemaps, warnings };
}
function groupFor(robots, userAgent) {
  const ua = userAgent.toLowerCase();
  let best = null;
  let bestLen = -1;
  let star = null;
  for (const group of robots.groups) {
    for (const agent of group.agents) {
      if (agent === "*") {
        star ??= group;
        continue;
      }
      if (ua.includes(agent) && agent.length > bestLen) {
        best = group;
        bestLen = agent.length;
      }
    }
  }
  return best ?? star;
}
function isAllowed(robots, userAgent, path) {
  const group = groupFor(robots, userAgent);
  if (group === null) {
    return true;
  }
  let verdict = true;
  let bestLen = -1;
  for (const rule of group.rules) {
    if (rule.path.length === 0) {
      continue;
    }
    if (pathMatches(rule.path, path)) {
      const specificity = rule.path.replace(/\*/g, "").length;
      if (specificity > bestLen || specificity === bestLen && rule.type === "allow" && verdict === false) {
        verdict = rule.type === "allow";
        bestLen = specificity;
      }
    }
  }
  return verdict;
}
function isFullyBlocked(robots, userAgent) {
  return !isAllowed(robots, userAgent, "/");
}
function pathMatches(pattern, path) {
  const anchored = pattern.endsWith("$");
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const segments = body.split("*");
  const first = segments[0] ?? "";
  if (!path.startsWith(first)) {
    return false;
  }
  let pos = first.length;
  for (let i2 = 1;i2 < segments.length - 1; i2++) {
    const seg = segments[i2];
    if (!seg) {
      continue;
    }
    const at = path.indexOf(seg, pos);
    if (at === -1) {
      return false;
    }
    pos = at + seg.length;
  }
  if (segments.length === 1) {
    return anchored ? pos === path.length : true;
  }
  const last = segments[segments.length - 1] ?? "";
  if (anchored) {
    return path.length - last.length >= pos && path.endsWith(last);
  }
  return last.length === 0 || path.indexOf(last, pos) !== -1;
}
function truncate(s) {
  return s.length > 60 ? `${s.slice(0, 57)}…` : s;
}

// packages/scanner/src/checks/crawler/robots-exists.ts
var def = {
  id: "crawler.robots.exists",
  category: ECategory.CRAWLER_ACCESS,
  weight: 2,
  title: "robots.txt is present and parseable",
  scope: ECheckScope.SITE
};
var DOCS = "https://developers.google.com/search/docs/crawling-indexing/robots/intro";
var robotsExistsCheck = defineCheck(def, async (ctx) => {
  const robotsUrl = new URL("/robots.txt", ctx.url).toString();
  const res = await ctx.fetchCached(robotsUrl);
  if (res.error !== undefined || res.status === 0) {
    return makeResult(def, EStatus.WARN, "Could not fetch robots.txt (network error).", {
      evidence: { url: robotsUrl, status: res.status, error: res.error },
      fix: "Ensure /robots.txt is reachable so crawlers can read your crawl directives and sitemap pointer.",
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      docsUrl: DOCS
    });
  }
  if (res.status >= 500) {
    return makeResult(def, EStatus.FAIL, `robots.txt returned ${res.status}; Google treats a 5xx robots.txt as "disallow all", blocking crawling site-wide.`, {
      evidence: { url: robotsUrl, status: res.status },
      fix: "Fix the server error on /robots.txt (return 200 with valid rules, or 404 if you have none). A persistent 5xx halts crawling.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS
    });
  }
  if (res.status === 404 || res.status >= 400) {
    return makeResult(def, EStatus.WARN, "No robots.txt (404). Crawlers default to allow-all, but you have no place to declare crawl rules or point to your sitemap.", {
      evidence: { url: robotsUrl, status: res.status },
      fix: "Add a /robots.txt (even a minimal allow-all with a Sitemap: line) to gain explicit control and surface your sitemap.",
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      docsUrl: DOCS
    });
  }
  const body = res.body.trim();
  if (body.length === 0) {
    return makeResult(def, EStatus.WARN, "robots.txt is empty.", {
      evidence: { url: robotsUrl, status: res.status },
      fix: "Populate /robots.txt with at least an allow-all group and a Sitemap: directive.",
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      docsUrl: DOCS
    });
  }
  const robots = parseRobots(res.body);
  return makeResult(def, EStatus.PASS, "robots.txt is present and parseable.", {
    evidence: {
      url: robotsUrl,
      status: res.status,
      groups: robots.groups.length,
      sitemaps: robots.sitemaps.length,
      warnings: robots.warnings
    },
    docsUrl: DOCS
  });
});

// packages/scanner/src/crawlers.ts
var ECrawlerPurpose = {
  TRAINING: "training",
  SEARCH: "search",
  USER: "user"
};
var AI_CRAWLERS = [
  {
    token: "GPTBot",
    operator: "OpenAI",
    purpose: "training",
    surface: "OpenAI model training",
    docsUrl: "https://platform.openai.com/docs/bots"
  },
  {
    token: "OAI-SearchBot",
    operator: "OpenAI",
    purpose: "search",
    surface: "ChatGPT Search",
    docsUrl: "https://platform.openai.com/docs/bots"
  },
  {
    token: "ChatGPT-User",
    operator: "OpenAI",
    purpose: "user",
    surface: "ChatGPT live browsing",
    docsUrl: "https://platform.openai.com/docs/bots"
  },
  {
    token: "ClaudeBot",
    operator: "Anthropic",
    purpose: "training",
    surface: "Claude model training",
    docsUrl: "https://support.anthropic.com/en/articles/8896518"
  },
  {
    token: "Claude-SearchBot",
    operator: "Anthropic",
    purpose: "search",
    surface: "Claude search",
    docsUrl: "https://support.anthropic.com/en/articles/8896518"
  },
  {
    token: "Claude-User",
    operator: "Anthropic",
    purpose: "user",
    surface: "Claude live fetch",
    docsUrl: "https://support.anthropic.com/en/articles/8896518"
  },
  {
    token: "Google-Extended",
    operator: "Google",
    purpose: "training",
    surface: "Gemini / Vertex AI training",
    docsUrl: "https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers"
  },
  {
    token: "Googlebot",
    operator: "Google",
    purpose: "search",
    surface: "Google Search & AI Overviews",
    docsUrl: "https://developers.google.com/search/docs/crawling-indexing/googlebot"
  },
  {
    token: "PerplexityBot",
    operator: "Perplexity",
    purpose: "search",
    surface: "Perplexity answers",
    docsUrl: "https://docs.perplexity.ai/guides/bots"
  },
  {
    token: "Perplexity-User",
    operator: "Perplexity",
    purpose: "user",
    surface: "Perplexity live fetch",
    docsUrl: "https://docs.perplexity.ai/guides/bots"
  },
  {
    token: "Applebot",
    operator: "Apple",
    purpose: "search",
    surface: "Apple search / Siri",
    docsUrl: "https://support.apple.com/en-us/119829"
  },
  {
    token: "Applebot-Extended",
    operator: "Apple",
    purpose: "training",
    surface: "Apple AI training",
    docsUrl: "https://support.apple.com/en-us/119829"
  },
  {
    token: "Amazonbot",
    operator: "Amazon",
    purpose: "search",
    surface: "Alexa / Rufus",
    docsUrl: "https://developer.amazon.com/amazonbot"
  },
  {
    token: "Meta-ExternalAgent",
    operator: "Meta",
    purpose: "training",
    surface: "Meta AI training",
    docsUrl: "https://developers.facebook.com/docs/sharing/webmasters/web-crawlers"
  },
  {
    token: "Bytespider",
    operator: "ByteDance",
    purpose: "training",
    surface: "ByteDance / TikTok AI",
    docsUrl: "https://support.bytespider.com"
  },
  {
    token: "CCBot",
    operator: "Common Crawl",
    purpose: "training",
    surface: "Common Crawl corpus",
    docsUrl: "https://commoncrawl.org/ccbot"
  },
  {
    token: "Bingbot",
    operator: "Microsoft",
    purpose: "search",
    surface: "Bing Search & Microsoft Copilot",
    docsUrl: "https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0"
  },
  {
    token: "MistralAI-User",
    operator: "Mistral",
    purpose: "user",
    surface: "Le Chat live fetch",
    docsUrl: "https://docs.mistral.ai/robots"
  },
  {
    token: "DuckAssistBot",
    operator: "DuckDuckGo",
    purpose: "search",
    surface: "DuckAssist AI answers",
    docsUrl: "https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot/"
  },
  {
    token: "Meta-ExternalFetcher",
    operator: "Meta",
    purpose: "user",
    surface: "Meta AI live fetch",
    docsUrl: "https://developers.facebook.com/docs/sharing/webmasters/web-crawlers"
  },
  {
    token: "cohere-training-data-crawler",
    operator: "Cohere",
    purpose: "training",
    surface: "Cohere model training",
    docsUrl: "https://github.com/ai-robots-txt/ai.robots.txt"
  }
];
var PRIORITY_TOKENS = [
  "GPTBot",
  "OAI-SearchBot",
  "Bingbot",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended"
];

// packages/scanner/src/checks/crawler/robots-ai-bots.ts
var def2 = {
  id: "crawler.robots.ai-bots",
  category: ECategory.CRAWLER_ACCESS,
  weight: 5,
  title: "AI crawlers are allowed in robots.txt",
  scope: ECheckScope.SITE
};
var DOCS2 = "https://platform.openai.com/docs/bots";
var robotsAiBotsCheck = defineCheck(def2, async (ctx) => {
  const robotsUrl = new URL("/robots.txt", ctx.url).toString();
  const res = await ctx.fetchCached(robotsUrl);
  const hasRobots = res.error === undefined && res.status >= 200 && res.status < 400 && res.body.trim().length > 0;
  if (!hasRobots) {
    return makeResult(def2, EStatus.PASS, "No robots.txt rules block AI crawlers (allow-all by default).", {
      evidence: { url: robotsUrl, status: res.status, robotsPresent: false },
      docsUrl: DOCS2
    });
  }
  const robots = parseRobots(res.body);
  const verdicts = AI_CRAWLERS.map((c2) => ({
    token: c2.token,
    operator: c2.operator,
    purpose: c2.purpose,
    surface: c2.surface,
    blocked: isFullyBlocked(robots, c2.token)
  }));
  const priority = verdicts.filter((v) => PRIORITY_TOKENS.includes(v.token));
  const allowedPriority = priority.filter((v) => !v.blocked).length;
  const score = priority.length > 0 ? allowedPriority / priority.length : 1;
  const blocked = verdicts.filter((v) => v.blocked);
  const blockedSearchOrUser = blocked.filter((v) => PRIORITY_TOKENS.includes(v.token) && (v.purpose === ECrawlerPurpose.SEARCH || v.purpose === ECrawlerPurpose.USER));
  const blockedTrainingOnly = blocked.filter((v) => v.purpose === ECrawlerPurpose.TRAINING);
  const evidence = {
    url: robotsUrl,
    crawlers: verdicts,
    priorityAllowed: allowedPriority,
    priorityTotal: priority.length
  };
  if (blockedSearchOrUser.length > 0) {
    const surfaces = blockedSearchOrUser.map((v) => `${v.token} (${v.surface})`).join(", ");
    return makeResult(def2, EStatus.FAIL, `robots.txt fully blocks AI answer crawlers — you are removed from: ${surfaces}.`, {
      evidence,
      fix: `Remove the Disallow rules for these tokens (or add explicit Allow groups): ${blockedSearchOrUser.map((v) => v.token).join(", ")}. These power live AI search/answer surfaces, not just training.`,
      impact: ELevel.HIGH,
      effort: ELevel.LOW,
      score,
      docsUrl: DOCS2
    });
  }
  if (blockedTrainingOnly.length > 0) {
    const tokens = blockedTrainingOnly.map((v) => v.token).join(", ");
    return makeResult(def2, EStatus.WARN, `robots.txt blocks training-only crawlers (${tokens}). This is a legitimate policy choice; the consequence is your content won't be ingested into those models' training corpora (it remains readable by live search/answer crawlers).`, {
      evidence,
      fix: `If excluding your content from AI training is intentional, no action needed. To allow it, remove the Disallow rules for: ${tokens}.`,
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      score,
      docsUrl: DOCS2
    });
  }
  return makeResult(def2, EStatus.PASS, "All priority AI crawlers are allowed in robots.txt.", {
    evidence,
    score,
    docsUrl: DOCS2
  });
});

// packages/scanner/src/checks/crawler/anti-bot.ts
var def3 = {
  id: "crawler.anti-bot",
  category: ECategory.CRAWLER_ACCESS,
  weight: 5,
  title: "No anti-bot challenge blocks crawlers",
  scope: ECheckScope.SITE
};
var DOCS3 = "https://developers.cloudflare.com/bots/concepts/ai-crawl-control/";
var CF_CHALLENGE_MARKERS = ["_cf_chl_opt", "cf-browser-verification"];
var CF_CHALLENGE_TITLES = ["just a moment", "attention required! | cloudflare"];
var CF_FIX = "Allowlist verified AI crawlers via Cloudflare AI Crawl Control (or your WAF) so GPTBot, ClaudeBot, PerplexityBot et al. are not served a JS challenge.";
var antiBotCheck = defineCheck(def3, (ctx) => {
  const { raw } = ctx;
  const headers = raw.headers;
  const body = raw.body.toLowerCase();
  const server = (headers["server"] ?? "").toLowerCase();
  const status = raw.status;
  const blockedNote = "A human browser may pass it, but AI crawlers (which do not execute the challenge) are almost certainly blocked too.";
  if ((headers["cf-mitigated"] ?? "").toLowerCase() === "challenge") {
    return fail(`Cloudflare is serving a managed challenge (cf-mitigated: challenge). ${blockedNote}`, {
      vendor: "Cloudflare",
      signal: "cf-mitigated: challenge",
      status
    });
  }
  if ((status === 403 || status === 503) && server.includes("cloudflare")) {
    return fail(`Cloudflare returned ${status} from its edge (server: cloudflare). ${blockedNote}`, {
      vendor: "Cloudflare",
      signal: `status ${status} + server: cloudflare`,
      status
    });
  }
  const title = /<title[^>]*>([^<]*)<\/title>/.exec(body)?.[1]?.trim() ?? "";
  const cfMarker = CF_CHALLENGE_MARKERS.find((sig) => body.includes(sig));
  const cfTitle = CF_CHALLENGE_TITLES.find((sig) => title.includes(sig));
  if (cfMarker !== undefined || cfTitle !== undefined) {
    return fail(`A Cloudflare anti-bot interstitial was detected in the response. ${blockedNote}`, {
      vendor: "Cloudflare",
      signal: cfMarker ?? `title: ${cfTitle}`,
      status
    });
  }
  const dataDomeHeader = Object.keys(headers).some((k) => k.includes("datadome"));
  if (status === 403 && (dataDomeHeader || body.includes("datadome"))) {
    return makeResult(def3, EStatus.FAIL, `DataDome is blocking the request (403). ${blockedNote}`, {
      evidence: {
        vendor: "DataDome",
        signal: dataDomeHeader ? "datadome header" : "datadome in body",
        status
      },
      fix: "Configure your DataDome policy to allowlist verified AI crawlers (GPTBot, ClaudeBot, PerplexityBot…) so they receive content rather than a block.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS3
    });
  }
  if (status === 403 && /reference #/i.test(raw.body)) {
    return makeResult(def3, EStatus.WARN, 'Akamai may be challenging the request (403 with an Akamai-style "Reference #" error). AI crawlers could be blocked.', {
      evidence: { vendor: "Akamai", signal: "reference #", status },
      fix: "Verify your Akamai bot-management policy allowlists legitimate AI crawlers; serve them content instead of a denial page.",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS3
    });
  }
  if (status === 403) {
    return makeResult(def3, EStatus.WARN, "The site returned 403 Forbidden to the scanner. Some access control is rejecting non-browser clients; AI crawlers may be blocked too.", {
      evidence: { vendor: "unknown", signal: "generic 403", status },
      fix: "Check your WAF / server rules. Allow verified AI crawler user-agents and IP ranges instead of returning 403.",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS3
    });
  }
  return makeResult(def3, EStatus.PASS, "No anti-bot challenge detected in the response.", {
    evidence: { status },
    docsUrl: DOCS3
  });
  function fail(detail, evidence) {
    return makeResult(def3, EStatus.FAIL, detail, {
      evidence,
      fix: CF_FIX,
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS3
    });
  }
});

// packages/scanner/src/checks/crawler/sitemap.ts
var def4 = {
  id: "crawler.sitemap",
  category: ECategory.CRAWLER_ACCESS,
  weight: 2,
  title: "XML sitemap is discoverable",
  scope: ECheckScope.SITE
};
var DOCS4 = "https://www.sitemaps.org/protocol.html";
var sitemapCheck = defineCheck(def4, async (ctx) => {
  const robotsUrl = new URL("/robots.txt", ctx.url).toString();
  const robotsRes = await ctx.fetchCached(robotsUrl);
  const robots = robotsRes.error === undefined && robotsRes.status >= 200 && robotsRes.status < 400 ? parseRobots(robotsRes.body) : null;
  const fromRobots = robots?.sitemaps[0];
  const sitemapUrl = fromRobots ?? new URL("/sitemap.xml", ctx.url).toString();
  const source = fromRobots !== undefined ? "robots.txt Sitemap directive" : "/sitemap.xml fallback";
  const res = await ctx.fetchCached(sitemapUrl);
  const found = res.error === undefined && res.status >= 200 && res.status < 300;
  if (!found) {
    return makeResult(def4, EStatus.WARN, "No XML sitemap found. Crawlers must discover every URL by following links, slowing and limiting AI indexing.", {
      evidence: {
        sitemapUrl,
        source,
        status: res.status,
        robotsSitemaps: robots?.sitemaps ?? []
      },
      fix: "Publish an XML sitemap and reference it with a Sitemap: line in robots.txt.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      docsUrl: DOCS4
    });
  }
  const body = res.body;
  if (!/<urlset|<sitemapindex/i.test(body)) {
    return makeResult(def4, EStatus.WARN, "A sitemap was served but is not valid XML (missing <urlset> / <sitemapindex>).", {
      evidence: { sitemapUrl, source, status: res.status, bodyPreview: body.slice(0, 120) },
      fix: "Serve a well-formed XML sitemap with a root <urlset> (or <sitemapindex>) element.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      docsUrl: DOCS4
    });
  }
  return makeResult(def4, EStatus.PASS, `XML sitemap found via ${source}.`, {
    evidence: { sitemapUrl, source, status: res.status },
    docsUrl: DOCS4
  });
});

// packages/scanner/src/checks/crawler/redirects.ts
var def5 = {
  id: "crawler.redirects",
  category: ECategory.CRAWLER_ACCESS,
  weight: 2,
  title: "Redirect chain is short",
  scope: ECheckScope.SITE
};
var DOCS5 = "https://developers.google.com/search/docs/crawling-indexing/301-redirects";
var redirectsCheck = defineCheck(def5, (ctx) => {
  const { raw } = ctx;
  const hops = raw.redirects;
  const chain = hops.map((h2) => ({ from: h2.url, status: h2.status, to: h2.location }));
  if (raw.error !== undefined && /redirect loop|redirects/i.test(raw.error)) {
    return makeResult(def5, EStatus.FAIL, `Redirects never resolve: ${raw.error}. Crawlers abandon the URL without ever reaching content.`, {
      evidence: { error: raw.error, hops: chain },
      fix: "Remove the redirect loop / excessive redirects so the URL resolves to a 200 in one or two hops.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS5
    });
  }
  if (hops.length >= 3) {
    return makeResult(def5, EStatus.WARN, `${hops.length} redirect hops before content. AI fetchers run on 1–5 s budgets, and each extra hop adds latency that can trip their timeout.`, {
      evidence: { hopCount: hops.length, hops: chain },
      fix: "Collapse the chain to a single redirect that points straight at the final URL.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      docsUrl: DOCS5
    });
  }
  const detail = hops.length === 0 ? "No redirects — the URL serves content directly." : `${hops.length} redirect hop${hops.length === 1 ? "" : "s"} (within the safe limit).`;
  return makeResult(def5, EStatus.PASS, detail, {
    evidence: { hopCount: hops.length, hops: chain },
    docsUrl: DOCS5
  });
});

// packages/scanner/src/checks/crawler/ttfb.ts
var def6 = {
  id: "crawler.ttfb",
  category: ECategory.CRAWLER_ACCESS,
  weight: 2,
  title: "Server responds quickly (TTFB)",
  scope: ECheckScope.SITE
};
var DOCS6 = "https://web.dev/articles/ttfb";
var ttfbCheck = defineCheck(def6, (ctx) => {
  const ttfb = ctx.raw.timing.ttfbMs;
  const score = Math.max(0, Math.min(1, (2000 - ttfb) / 1500));
  const evidence = { ttfbMs: ttfb };
  const note = "AI fetchers operate on short per-request timeouts (often 1–5 s), unlike Googlebot which tolerates slow servers.";
  if (ttfb <= 500) {
    return makeResult(def6, EStatus.PASS, `TTFB is ${ttfb} ms — fast.`, {
      evidence,
      score,
      docsUrl: DOCS6
    });
  }
  if (ttfb <= 1500) {
    return makeResult(def6, EStatus.WARN, `TTFB is ${ttfb} ms. ${note}`, {
      evidence,
      fix: "Reduce server response time (caching, CDN, faster origin) to keep TTFB under ~500 ms.",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      score,
      docsUrl: DOCS6
    });
  }
  return makeResult(def6, EStatus.FAIL, `TTFB is ${ttfb} ms — too slow. ${note}`, {
    evidence,
    fix: "Cut TTFB well below 1.5 s via a CDN, edge caching, or origin optimization; slow responses get dropped by AI fetchers.",
    impact: ELevel.HIGH,
    effort: ELevel.MEDIUM,
    score,
    docsUrl: DOCS6
  });
});

// packages/scanner/src/util/html.ts
var TAG_RE = (tag) => new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
function htmlToText(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}
function wordCount(text) {
  if (text.length === 0) {
    return 0;
  }
  return text.split(/\s+/).filter(Boolean).length;
}
function extractTitle(html) {
  const match = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return match?.[1]?.trim() ?? null;
}
function extractHtmlLangAttr(html) {
  const match = /<html\b[^>]*\blang=["']([^"']+)["']/i.exec(html);
  return match?.[1]?.trim() ?? null;
}
function extractMetaTags(html) {
  const tags = [];
  const re = /<meta\b([^>]*)>/gi;
  let m2;
  while ((m2 = re.exec(html)) !== null) {
    const attrs = m2[1] ?? "";
    tags.push({
      name: attr(attrs, "name"),
      property: attr(attrs, "property"),
      content: attr(attrs, "content")
    });
  }
  return tags;
}
function metaContent(tags, key) {
  const lowered = key.toLowerCase();
  const hit = tags.find((t2) => t2.name?.toLowerCase() === lowered || t2.property?.toLowerCase() === lowered);
  return hit?.content;
}
function extractJsonLd(html) {
  const out = [];
  const re = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m2;
  while ((m2 = re.exec(html)) !== null) {
    const raw = (m2[1] ?? "").trim();
    if (raw.length === 0) {
      continue;
    }
    try {
      out.push(JSON.parse(raw));
    } catch {}
  }
  return out;
}
function jsonLdTypes(blocks) {
  const types = new Set;
  const visit = (node) => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (node && typeof node === "object") {
      const obj = node;
      const t2 = obj["@type"];
      if (typeof t2 === "string") {
        types.add(t2);
      } else if (Array.isArray(t2)) {
        t2.forEach((x) => typeof x === "string" && types.add(x));
      }
      if (Array.isArray(obj["@graph"])) {
        obj["@graph"].forEach(visit);
      }
    }
  };
  blocks.forEach(visit);
  return [...types];
}
function countTag(html, tag) {
  const matches = html.match(new RegExp(`<${tag}\\b`, "gi"));
  return matches ? matches.length : 0;
}
function tagTextContents(html, tag) {
  const out = [];
  const re = TAG_RE(tag);
  let m2;
  while ((m2 = re.exec(html)) !== null) {
    out.push(htmlToText(m2[1] ?? ""));
  }
  return out;
}
function extractCanonical(html) {
  const re = /<link\b([^>]*\brel=["']canonical["'][^>]*)>/i;
  const m2 = re.exec(html);
  if (!m2) {
    return null;
  }
  return attr(m2[1] ?? "", "href") ?? null;
}
function hasHreflang(html) {
  return /<link\b[^>]*\bhreflang=["'][^"']+["'][^>]*>/i.test(html);
}
function attr(attrs, name) {
  const re = new RegExp(`\\b${name}=["']([^"']*)["']`, "i");
  const m2 = re.exec(attrs);
  return m2?.[1];
}

// packages/scanner/src/checks/crawler/http-status.ts
var def7 = {
  id: "crawler.http-status",
  category: ECategory.CRAWLER_ACCESS,
  weight: 3,
  title: "URL returns a healthy 200 status"
};
var DOCS7 = "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status";
var SOFT_404_RE = /not found|404|page doesn'?t exist/i;
var httpStatusCheck = defineCheck(def7, (ctx) => {
  const { raw } = ctx;
  const status = raw.status;
  if (raw.error !== undefined || status === 0) {
    return makeResult(def7, EStatus.FAIL, `The URL did not return a response (${raw.error ?? "no status"}).`, {
      evidence: { status, error: raw.error, finalUrl: raw.finalUrl },
      fix: "Make the URL reachable over HTTPS and return a 200; crawlers index nothing if the request fails.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS7
    });
  }
  if (status >= 400) {
    return makeResult(def7, EStatus.FAIL, `The URL returns ${status}. Crawlers cannot index an error page.`, {
      evidence: { status, finalUrl: raw.finalUrl },
      fix: "Return a 200 for content URLs. Fix the underlying 4xx/5xx so AI crawlers receive the page.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS7
    });
  }
  if (status === 200) {
    const title = extractTitle(raw.body) ?? "";
    const bodyText = htmlToText(raw.body).slice(0, 200);
    if (SOFT_404_RE.test(title) || SOFT_404_RE.test(bodyText)) {
      return makeResult(def7, EStatus.WARN, 'The URL returns 200 but the content looks like a "not found" page (soft 404). Crawlers may index an empty/error page.', {
        evidence: { status, title, bodyPreview: bodyText },
        fix: "Return a real 404 status for missing pages; serve a 200 only when there is genuine content.",
        impact: ELevel.MEDIUM,
        effort: ELevel.MEDIUM,
        docsUrl: DOCS7
      });
    }
    return makeResult(def7, EStatus.PASS, "The URL returns 200 OK.", {
      evidence: { status, finalUrl: raw.finalUrl },
      docsUrl: DOCS7
    });
  }
  return makeResult(def7, EStatus.PASS, `The URL returns ${status} (2xx, but not 200).`, {
    evidence: {
      status,
      finalUrl: raw.finalUrl,
      note: "Non-200 2xx may not carry indexable content."
    },
    docsUrl: DOCS7
  });
});

// packages/scanner/src/checks/crawler/noindex.ts
var def8 = {
  id: "crawler.noindex",
  category: ECategory.CRAWLER_ACCESS,
  weight: 4,
  title: "Page is indexable (no noindex)"
};
var DOCS8 = "https://developers.google.com/search/docs/crawling-indexing/block-indexing";
var noindexCheck = defineCheck(def8, (ctx) => {
  const { raw } = ctx;
  const xRobots = (raw.headers["x-robots-tag"] ?? "").toLowerCase();
  const metaRobots = (metaContent(extractMetaTags(raw.body), "robots") ?? "").toLowerCase();
  const noindex = xRobots.includes("noindex") || metaRobots.includes("noindex");
  const nofollow = xRobots.includes("nofollow") || metaRobots.includes("nofollow");
  const evidence = {
    xRobotsTag: raw.headers["x-robots-tag"] ?? null,
    metaRobots: metaRobots || null
  };
  if (noindex) {
    const source = xRobots.includes("noindex") ? "X-Robots-Tag header" : '<meta name="robots">';
    return makeResult(def8, EStatus.FAIL, `The page declares noindex (via ${source}). It is invisible to every indexer, including AI search and answer engines.`, {
      evidence,
      fix: "Remove the noindex directive from the X-Robots-Tag header and the robots meta tag so the page can be indexed.",
      impact: ELevel.HIGH,
      effort: ELevel.LOW,
      docsUrl: DOCS8
    });
  }
  if (nofollow) {
    return makeResult(def8, EStatus.WARN, "The page declares nofollow. It can be indexed, but crawlers will not follow its links to discover related content.", {
      evidence,
      fix: "Remove the nofollow directive unless you intentionally want crawlers to ignore this page's outbound links.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      docsUrl: DOCS8
    });
  }
  return makeResult(def8, EStatus.PASS, "No noindex/nofollow directive — the page is indexable.", {
    evidence,
    docsUrl: DOCS8
  });
});

// packages/scanner/src/util/url.ts
var HOSTNAME_RE = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/i;
var IPV4_RE = /^\d{1,3}(?:\.\d{1,3}){3}$/;
var EUrlProblem = {
  INVALID: "invalid",
  PRIVATE: "private"
};
function validateScanInput(input) {
  const trimmed = input.trim();
  if (trimmed.length === 0 || /\s/.test(trimmed)) {
    return { ok: false, problem: EUrlProblem.INVALID };
  }
  let parsed;
  try {
    parsed = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return { ok: false, problem: EUrlProblem.INVALID };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, problem: EUrlProblem.INVALID };
  }
  const host = parsed.hostname;
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) {
    return { ok: false, problem: EUrlProblem.PRIVATE };
  }
  if (IPV4_RE.test(host) || host.startsWith("[")) {
    return { ok: false, problem: EUrlProblem.PRIVATE };
  }
  if (!HOSTNAME_RE.test(host)) {
    return { ok: false, problem: EUrlProblem.INVALID };
  }
  return { ok: true, url: parsed.toString() };
}
function isPrivateAddress(ip) {
  const trimmed = ip.trim();
  if (trimmed.includes(":")) {
    const bytes = ipv6ToBytes(trimmed);
    return bytes === null ? true : isPrivateIpv6(bytes);
  }
  const n2 = ipv4ToInt(trimmed);
  return n2 === null ? true : isPrivateIpv4(n2);
}
function normalizeUrl(input) {
  const trimmed = input.trim();
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const parsed = new URL(withScheme);
  return parsed.toString();
}
function originOf(url) {
  return new URL(url).origin;
}
function hostOf(url) {
  return new URL(url).host;
}
function counterpartHost(host) {
  if (host.startsWith("www.")) {
    return host.slice(4);
  }
  const labels = host.split(".");
  if (labels.length === 2) {
    return `www.${host}`;
  }
  return null;
}
function resolveUrl(base, ref) {
  return new URL(ref, base).toString();
}
function ipv4ToInt(ip) {
  const parts = ip.split(".");
  if (parts.length !== 4) {
    return null;
  }
  let n2 = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) {
      return null;
    }
    const value = Number(part);
    if (value > 255) {
      return null;
    }
    n2 = n2 * 256 + value;
  }
  return n2 >>> 0;
}
function isPrivateIpv4(n2) {
  const inRange = (base, bits) => {
    const b2 = ipv4ToInt(base);
    if (b2 === null) {
      return false;
    }
    const mask = bits === 0 ? 0 : 4294967295 << 32 - bits >>> 0;
    return (n2 & mask) === (b2 & mask);
  };
  return inRange("0.0.0.0", 8) || inRange("10.0.0.0", 8) || inRange("100.64.0.0", 10) || inRange("127.0.0.0", 8) || inRange("169.254.0.0", 16) || inRange("172.16.0.0", 12) || inRange("192.0.0.0", 24) || inRange("192.0.2.0", 24) || inRange("192.168.0.0", 16) || inRange("198.18.0.0", 15) || inRange("198.51.100.0", 24) || inRange("203.0.113.0", 24) || inRange("224.0.0.0", 4) || inRange("240.0.0.0", 4);
}
function ipv6ToBytes(input) {
  let s = (input.split("%")[0] ?? input).toLowerCase();
  if (!s.includes(":")) {
    return null;
  }
  const lastColon = s.lastIndexOf(":");
  const tail = s.slice(lastColon + 1);
  if (tail.includes(".")) {
    const n2 = ipv4ToInt(tail);
    if (n2 === null) {
      return null;
    }
    const hi = (n2 >>> 16 & 65535).toString(16);
    const lo = (n2 & 65535).toString(16);
    s = `${s.slice(0, lastColon + 1)}${hi}:${lo}`;
  }
  const halves = s.split("::");
  if (halves.length > 2) {
    return null;
  }
  const head = hextetsToBytes(halves[0] ?? "");
  if (head === null) {
    return null;
  }
  if (halves.length === 1) {
    return head.length === 16 ? Uint8Array.from(head) : null;
  }
  const back = hextetsToBytes(halves[1] ?? "");
  if (back === null) {
    return null;
  }
  const total = head.length + back.length;
  if (total > 16) {
    return null;
  }
  return Uint8Array.from([...head, ...Array.from({ length: 16 - total }).fill(0), ...back]);
}
function hextetsToBytes(segment) {
  if (segment === "") {
    return [];
  }
  const out = [];
  for (const group of segment.split(":")) {
    if (!/^[0-9a-f]{1,4}$/.test(group)) {
      return null;
    }
    const value = parseInt(group, 16);
    out.push(value >> 8 & 255, value & 255);
  }
  return out;
}
function isPrivateIpv6(b2) {
  const at = (i2) => b2[i2] ?? 0;
  const mapped = at(10) === 255 && at(11) === 255 && b2.slice(0, 10).every((x) => x === 0);
  if (mapped) {
    return isPrivateIpv4((at(12) << 24 | at(13) << 16 | at(14) << 8 | at(15)) >>> 0);
  }
  if (b2.every((x) => x === 0)) {
    return true;
  }
  if (at(15) === 1 && b2.slice(0, 15).every((x) => x === 0)) {
    return true;
  }
  if ((at(0) & 254) === 252) {
    return true;
  }
  if (at(0) === 254 && (at(1) & 192) === 128) {
    return true;
  }
  if (at(0) === 255) {
    return true;
  }
  return false;
}

// packages/scanner/src/checks/crawler/www-consistency.ts
var def9 = {
  id: "crawler.www-consistency",
  category: ECategory.CRAWLER_ACCESS,
  weight: 1,
  title: "Single canonical host (www vs apex)",
  scope: ECheckScope.SITE
};
var DOCS9 = "https://developers.google.com/search/docs/crawling-indexing/canonicalization";
var wwwConsistencyCheck = defineCheck(def9, async (ctx) => {
  const canonicalHost = hostOf(ctx.raw.finalUrl);
  const counterpart = counterpartHost(canonicalHost);
  if (counterpart === null) {
    return makeResult(def9, EStatus.PASS, "Host has no www/apex counterpart to reconcile.", {
      evidence: { canonicalHost },
      docsUrl: DOCS9
    });
  }
  const counterpartUrl = `https://${counterpart}/`;
  const res = await ctx.fetchCached(counterpartUrl);
  const finalHost = res.error === undefined ? hostOf(res.finalUrl) : null;
  const redirectedToCanonical = res.redirects.length > 0 && finalHost === canonicalHost;
  if (redirectedToCanonical) {
    return makeResult(def9, EStatus.PASS, `The ${counterpart} variant redirects to ${canonicalHost} (single canonical host).`, {
      evidence: {
        canonicalHost,
        counterpart,
        counterpartStatus: res.status,
        counterpartFinalHost: finalHost
      },
      docsUrl: DOCS9
    });
  }
  if (res.error !== undefined || res.status === 0) {
    return makeResult(def9, EStatus.WARN, `The ${counterpart} host is not reachable (${res.error ?? "no response"}).`, {
      evidence: { canonicalHost, counterpart, counterpartStatus: res.status, error: res.error },
      fix: `Either redirect ${counterpart} to ${canonicalHost}, or make it reachable — an unreachable counterpart can confuse crawlers and break inbound links.`,
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      docsUrl: DOCS9
    });
  }
  if (res.status === 404) {
    return makeResult(def9, EStatus.PASS, `The ${counterpart} host returns 404; ${canonicalHost} is the single host.`, {
      evidence: { canonicalHost, counterpart, counterpartStatus: res.status },
      docsUrl: DOCS9
    });
  }
  if (res.status >= 200 && res.status < 300) {
    return makeResult(def9, EStatus.WARN, `Both ${canonicalHost} and ${counterpart} serve content without redirecting. This host split risks duplicate content and divided crawl signals.`, {
      evidence: {
        canonicalHost,
        counterpart,
        counterpartStatus: res.status,
        counterpartFinalHost: finalHost
      },
      fix: `Pick one canonical host and 301-redirect the other (e.g. ${counterpart} → ${canonicalHost}).`,
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      docsUrl: DOCS9
    });
  }
  return makeResult(def9, EStatus.WARN, `The ${counterpart} host returned ${res.status} (not a clean redirect to ${canonicalHost}).`, {
    evidence: {
      canonicalHost,
      counterpart,
      counterpartStatus: res.status,
      counterpartFinalHost: finalHost
    },
    fix: `Ensure ${counterpart} 301-redirects to ${canonicalHost} so there is one canonical host.`,
    impact: ELevel.LOW,
    effort: ELevel.LOW,
    docsUrl: DOCS9
  });
});

// packages/scanner/src/checks/crawler/ua-blocking.ts
var GPTBOT_UA = "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot";
var BLOCKED_STATUSES = new Set([401, 403, 406, 429, 503]);
var def10 = {
  id: "crawler.ua-blocking",
  category: ECategory.CRAWLER_ACCESS,
  weight: 3,
  title: "Server responds equally to AI user-agents",
  scope: ECheckScope.SITE
};
var uaBlocking = defineCheck(def10, async (ctx) => {
  if (!ctx.raw.ok) {
    return makeResult(def10, EStatus.INFO, "primary fetch failed — UA comparison skipped", {
      evidence: { normalStatus: ctx.raw.status }
    });
  }
  const asBot = await ctx.fetchWith(ctx.url, { "user-agent": GPTBOT_UA });
  const evidence = { normalStatus: ctx.raw.status, gptbotUaStatus: asBot.status };
  if (asBot.ok) {
    return makeResult(def10, EStatus.PASS, "AI user-agents receive the same response as browsers", {
      evidence
    });
  }
  if (BLOCKED_STATUSES.has(asBot.status) || asBot.status === 0) {
    return makeResult(def10, EStatus.WARN, `requests presenting a GPTBot user-agent get HTTP ${asBot.status || "no response"} while normal requests get ${ctx.raw.status} — a WAF/server rule is discriminating AI crawlers`, {
      score: 0.25,
      fix: "Review WAF/bot-management rules: if you want AI visibility, allowlist verified AI crawlers (by published IP ranges) instead of blocking by user-agent. Note: if your rule only blocks UNVERIFIED AI user-agents, real crawlers from provider IPs may still pass.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      evidence,
      docsUrl: "https://developers.cloudflare.com/ai-crawl-control/"
    });
  }
  return makeResult(def10, EStatus.WARN, `AI user-agent receives HTTP ${asBot.status} (normal: ${ctx.raw.status}) — responses differ`, {
    score: 0.5,
    fix: "Serve the same content to AI crawlers as to browsers.",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    evidence
  });
});

// packages/scanner/src/checks/crawler/snippet-directives.ts
var def11 = {
  id: "crawler.snippet-directives",
  category: ECategory.CRAWLER_ACCESS,
  weight: 1,
  title: "Snippets are not restricted"
};
var snippetDirectives = defineCheck(def11, (ctx) => {
  const headerValue = ctx.raw.headers["x-robots-tag"] ?? "";
  const metaValue = metaContent(extractMetaTags(ctx.raw.body), "robots") ?? "";
  const combined = `${headerValue},${metaValue}`.toLowerCase();
  if (combined.includes("nosnippet") || /max-snippet\s*:\s*0\b/.test(combined)) {
    return makeResult(def11, EStatus.WARN, "nosnippet / max-snippet:0 is declared — AI answer surfaces cannot quote this page", {
      score: 0,
      fix: "Remove nosnippet (or raise max-snippet) so AI search surfaces can cite your content.",
      impact: ELevel.HIGH,
      effort: ELevel.LOW,
      evidence: { headerValue, metaValue },
      docsUrl: "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag"
    });
  }
  const limited = /max-snippet\s*:\s*([1-9]\d{0,1})\b/.exec(combined);
  if (limited !== null && Number(limited[1]) < 50) {
    return makeResult(def11, EStatus.WARN, `max-snippet:${limited[1]} caps quotable text very low for generative answers`, {
      score: 0.5,
      fix: "Raise max-snippet (≥160) or remove the cap.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      evidence: { headerValue, metaValue },
      docsUrl: "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag"
    });
  }
  return makeResult(def11, EStatus.PASS, "no snippet restrictions declared", {
    evidence: { headerValue, metaValue }
  });
});

// packages/scanner/src/checks/crawler/index.ts
var crawlerChecks = [
  robotsExistsCheck,
  robotsAiBotsCheck,
  antiBotCheck,
  sitemapCheck,
  redirectsCheck,
  ttfbCheck,
  httpStatusCheck,
  noindexCheck,
  wwwConsistencyCheck,
  uaBlocking,
  snippetDirectives
];

// packages/scanner/src/checks/rendering/empty-shell.ts
var def12 = {
  id: "rendering.empty-shell",
  category: ECategory.RENDERING,
  weight: 4,
  title: "Empty HTML shell"
};
var EMPTY_MOUNT_RE = /<div[^>]*id=["'](root|app|__next|___gatsby)["'][^>]*>\s*<\/div>/i;
var FINGERPRINT_RES = [/data-reactroot/i, /ng-version=/i, /data-v-app/i, /id=["']__nuxt["']/i];
var emptyShell = defineCheck(def12, (ctx) => {
  const html = ctx.raw.body;
  const words = wordCount(htmlToText(html));
  if (words >= 100) {
    return makeResult(def12, EStatus.PASS, "initial HTML carries substantive content", {
      evidence: { words }
    });
  }
  const hasFingerprint = EMPTY_MOUNT_RE.test(html) || FINGERPRINT_RES.some((re) => re.test(html));
  if (words < 30 && hasFingerprint) {
    return makeResult(def12, EStatus.FAIL, "page is an empty SPA shell — no content without JS", {
      fix: "render content server-side (SSR/SSG) so crawlers receive real HTML",
      impact: ELevel.HIGH,
      effort: ELevel.HIGH,
      evidence: { words, hasFingerprint }
    });
  }
  if (words < 30) {
    return makeResult(def12, EStatus.WARN, "near-empty initial HTML", {
      score: 0.5,
      fix: "ensure primary content is present in the server-rendered HTML",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      evidence: { words, hasFingerprint }
    });
  }
  return makeResult(def12, EStatus.WARN, "thin initial HTML", {
    score: 0.5,
    fix: "expand the server-rendered content so crawlers have more to index",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    evidence: { words, hasFingerprint }
  });
});

// packages/scanner/src/checks/rendering/main-content.ts
var def13 = {
  id: "rendering.main-content",
  category: ECategory.RENDERING,
  weight: 2,
  title: "Main content extractability"
};
var mainContent = defineCheck(def13, (ctx) => {
  const html = ctx.raw.body;
  const hasMain = countTag(html, "main") > 0 || countTag(html, "article") > 0;
  const hasSingleH1 = countTag(html, "h1") === 1;
  const hasH2 = countTag(html, "h2") >= 1;
  const hasChrome = countTag(html, "nav") > 0 && countTag(html, "footer") > 0;
  const missing = [];
  if (!hasMain) {
    missing.push("<main> or <article>");
  }
  if (!hasSingleH1) {
    missing.push("exactly one <h1>");
  }
  if (!hasH2) {
    missing.push("at least one <h2>");
  }
  if (!hasChrome) {
    missing.push("<nav> and <footer>");
  }
  const signals = 4 - missing.length;
  const score = signals / 4;
  const evidence = { signals, hasMain, hasSingleH1, hasH2, hasChrome };
  if (signals === 4) {
    return makeResult(def13, EStatus.PASS, "served HTML is semantically extractable", {
      evidence
    });
  }
  const detail = `missing semantic signals: ${missing.join(", ")}`;
  if (signals >= 2) {
    return makeResult(def13, EStatus.WARN, detail, {
      score,
      fix: "add the missing semantic landmarks so crawlers can isolate the main content",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      evidence
    });
  }
  return makeResult(def13, EStatus.FAIL, detail, {
    score,
    fix: "wrap content in <main>/<article> with a single <h1> and section headings",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    evidence
  });
});

// packages/scanner/src/checks/rendering/noscript-fallback.ts
var def14 = {
  id: "rendering.noscript",
  category: ECategory.RENDERING,
  weight: 1,
  title: "Noscript fallback"
};
var noscriptFallback = defineCheck(def14, (ctx) => {
  const html = ctx.raw.body;
  const words = wordCount(htmlToText(html));
  if (words >= 50) {
    return makeResult(def14, EStatus.PASS, "content is present in raw HTML — fallback not needed", {
      evidence: { words }
    });
  }
  if (countTag(html, "script") === 0) {
    return makeResult(def14, EStatus.PASS, "thin page but no JavaScript — nothing hidden behind JS", {
      evidence: { words, scripts: 0 }
    });
  }
  const noscriptWords = tagTextContents(html, "noscript").reduce((sum, text) => sum + wordCount(text), 0);
  if (noscriptWords > 20) {
    return makeResult(def14, EStatus.WARN, "noscript fallback exists but AI crawlers index it poorly", {
      score: 0.5,
      fix: "serve real content in the initial HTML rather than relying on <noscript>",
      impact: ELevel.LOW,
      effort: ELevel.MEDIUM,
      evidence: { words, noscriptWords }
    });
  }
  return makeResult(def14, EStatus.FAIL, "no fallback at all — crawlers see an empty page", {
    score: 0,
    fix: "render content server-side so non-JS crawlers receive real HTML",
    impact: ELevel.MEDIUM,
    effort: ELevel.HIGH,
    evidence: { words, noscriptWords }
  });
});

// packages/scanner/src/checks/rendering/markdown-negotiation.ts
var def15 = {
  id: "rendering.markdown-negotiation",
  category: ECategory.RENDERING,
  weight: 1,
  title: "Markdown content negotiation",
  scope: ECheckScope.SITE
};
var markdownNegotiation = defineCheck(def15, async (ctx) => {
  const response = await ctx.fetchWith(ctx.url, {
    accept: "text/markdown, text/html;q=0.8, */*;q=0.5"
  });
  const contentType = response.headers["content-type"] ?? "";
  const vary = response.headers["vary"] ?? "";
  const looksMarkdown = contentType.includes("text/markdown") || contentType.includes("text/plain") && !response.body.trimStart().startsWith("<");
  if (response.ok && looksMarkdown) {
    return makeResult(def15, EStatus.PASS, "serves Markdown via Accept negotiation (~80% fewer tokens for agents)", {
      evidence: {
        contentType,
        varyAccept: vary.toLowerCase().includes("accept"),
        tokensHeader: response.headers["x-markdown-tokens"]
      },
      docsUrl: "https://blog.cloudflare.com/markdown-for-agents/"
    });
  }
  return makeResult(def15, EStatus.INFO, "no Markdown negotiation — emerging standard (Cloudflare, Vercel, Mintlify serve it); no score impact", {
    evidence: { contentType },
    docsUrl: "https://blog.cloudflare.com/markdown-for-agents/"
  });
});

// packages/scanner/src/checks/rendering/image-alt.ts
var def16 = {
  id: "rendering.image-alt",
  category: ECategory.RENDERING,
  weight: 1,
  title: "Images carry alt text"
};
var imageAlt = defineCheck(def16, (ctx) => {
  const html = ctx.raw.body;
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  if (imgs.length === 0) {
    return makeResult(def16, EStatus.INFO, "no <img> elements found — nothing to check", {
      evidence: { images: 0 }
    });
  }
  const withAlt = imgs.filter((tag) => /\balt=["'][^"']+["']/i.test(tag)).length;
  const coverage = withAlt / imgs.length;
  const evidence = { images: imgs.length, withAlt, coverage: Math.round(coverage * 100) / 100 };
  if (coverage >= 0.8) {
    return makeResult(def16, EStatus.PASS, `${withAlt}/${imgs.length} images have alt text`, {
      evidence
    });
  }
  return makeResult(def16, coverage >= 0.5 ? EStatus.WARN : EStatus.FAIL, `only ${withAlt}/${imgs.length} images have alt text — invisible to multimodal extraction`, {
    score: coverage,
    fix: 'Add descriptive alt attributes to every meaningful image (empty alt="" for decorative ones).',
    impact: ELevel.MEDIUM,
    effort: ELevel.LOW,
    evidence
  });
});

// packages/scanner/src/checks/rendering/index.ts
var renderingChecks = [
  emptyShell,
  mainContent,
  noscriptFallback,
  markdownNegotiation,
  imageAlt
];

// packages/scanner/src/checks/structured-data/json-ld.ts
var def17 = {
  id: "structured.json-ld",
  category: ECategory.STRUCTURED_DATA,
  weight: 5,
  title: "JSON-LD structured data"
};
var IDENTITY_TYPES = new Set(["Organization", "WebSite", "Person"]);
var CONTENT_TYPES = new Set([
  "Article",
  "BlogPosting",
  "NewsArticle",
  "Product",
  "SoftwareApplication",
  "FAQPage",
  "HowTo",
  "BreadcrumbList"
]);
var jsonLdCheck = defineCheck(def17, (ctx) => {
  const blocks = extractJsonLd(ctx.raw.body);
  if (blocks.length === 0) {
    return makeResult(def17, EStatus.FAIL, "no JSON-LD found in the served HTML", {
      fix: "add schema.org JSON-LD to the HTML the server returns. Schema injected client-side by JS is invisible to non-JS AI crawlers.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      evidence: { blocks: 0, types: [] }
    });
  }
  const types = jsonLdTypes(blocks);
  const hasIdentity = types.some((t2) => IDENTITY_TYPES.has(t2));
  const hasContent = types.some((t2) => CONTENT_TYPES.has(t2));
  const score = 0.5 + (hasIdentity ? 0.25 : 0) + (hasContent ? 0.25 : 0);
  const evidence = { blocks: blocks.length, types, hasIdentity, hasContent };
  if (score >= 0.75) {
    return makeResult(def17, EStatus.PASS, "JSON-LD describes identity and/or content", {
      score,
      evidence
    });
  }
  const missing = !hasIdentity && !hasContent ? "no identity (Organization/WebSite/Person) or content (Article/Product/FAQ…) types" : !hasIdentity ? "no identity type (Organization/WebSite/Person)" : "no content type (Article/Product/FAQPage/HowTo…)";
  return makeResult(def17, EStatus.WARN, `JSON-LD present but ${missing}`, {
    score,
    fix: "add identity (Organization/WebSite/Person) and content (Article/Product/FAQPage…) schema so AI crawlers can model the page.",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    evidence
  });
});

// packages/scanner/src/checks/structured-data/meta-basics.ts
var def18 = {
  id: "structured.meta-basics",
  category: ECategory.STRUCTURED_DATA,
  weight: 4,
  title: "Title, description & canonical"
};
var TITLE_MIN = 10;
var TITLE_MAX = 70;
var DESC_MIN = 50;
var DESC_MAX = 160;
var metaBasicsCheck = defineCheck(def18, (ctx) => {
  const html = ctx.raw.body;
  const tags = extractMetaTags(html);
  const title = extractTitle(html);
  const titleLen = title?.length ?? 0;
  const description = metaContent(tags, "description") ?? null;
  const descLen = description?.length ?? 0;
  const canonical = extractCanonical(html);
  const issues = [];
  if (title === null || titleLen === 0) {
    issues.push("title is missing");
  } else if (titleLen < TITLE_MIN) {
    issues.push(`title is too short (${titleLen} chars, want ${TITLE_MIN}–${TITLE_MAX})`);
  } else if (titleLen > TITLE_MAX) {
    issues.push(`title is too long (${titleLen} chars, want ${TITLE_MIN}–${TITLE_MAX})`);
  }
  if (description === null || descLen === 0) {
    issues.push("meta description is missing");
  } else if (descLen < DESC_MIN) {
    issues.push(`meta description is too short (${descLen} chars, want ${DESC_MIN}–${DESC_MAX})`);
  } else if (descLen > DESC_MAX) {
    issues.push(`meta description is too long (${descLen} chars, want ${DESC_MIN}–${DESC_MAX})`);
  }
  const canonicalIssue = checkCanonical(canonical, ctx.raw.finalUrl);
  if (canonicalIssue !== null) {
    issues.push(canonicalIssue);
  }
  const score = Math.max(0, (3 - issues.length) / 3);
  const evidence = { titleLength: titleLen, descriptionLength: descLen, canonical };
  if (issues.length === 0) {
    return makeResult(def18, EStatus.PASS, "title, description and canonical are all healthy", {
      score,
      evidence
    });
  }
  const status = issues.length >= 2 ? EStatus.FAIL : EStatus.WARN;
  return makeResult(def18, status, issues.join("; "), {
    score,
    fix: 'set a 10–70 char <title>, a 50–160 char meta description, and an absolute same-host <link rel="canonical">.',
    impact: issues.length >= 2 ? ELevel.HIGH : ELevel.MEDIUM,
    effort: ELevel.LOW,
    evidence
  });
});
function checkCanonical(canonical, finalUrl) {
  if (canonical === null || canonical.length === 0) {
    return "canonical link is missing";
  }
  let parsed;
  try {
    parsed = new URL(canonical);
  } catch {
    return `canonical is not an absolute URL (${canonical})`;
  }
  const finalHost = new URL(finalUrl).host;
  if (parsed.host !== finalHost) {
    return `canonical points to a different host (${parsed.host} ≠ ${finalHost})`;
  }
  return null;
}

// packages/scanner/src/checks/structured-data/open-graph.ts
var def19 = {
  id: "structured.open-graph",
  category: ECategory.STRUCTURED_DATA,
  weight: 2,
  title: "Open Graph metadata"
};
var SIGNALS = ["og:title", "og:description", "og:image", "og:url", "twitter:card"];
var openGraphCheck = defineCheck(def19, (ctx) => {
  const tags = extractMetaTags(ctx.raw.body);
  const present = SIGNALS.filter((key) => {
    const value = metaContent(tags, key);
    return value !== undefined && value.trim().length > 0;
  });
  const missing = SIGNALS.filter((key) => !present.includes(key));
  const score = present.length / SIGNALS.length;
  const evidence = { present, missing };
  if (present.length >= 4) {
    return makeResult(def19, EStatus.PASS, "core Open Graph signals are present", {
      score,
      evidence
    });
  }
  const status = present.length >= 2 ? EStatus.WARN : EStatus.FAIL;
  return makeResult(def19, status, `missing Open Graph signals: ${missing.join(", ")}`, {
    score,
    fix: "add og:title, og:description, og:image, og:url and twitter:card so share surfaces and AI summaries render correctly.",
    impact: present.length >= 2 ? "low" : "medium",
    effort: ELevel.LOW,
    evidence
  });
});

// packages/scanner/src/checks/structured-data/author-eeat.ts
var def20 = {
  id: "structured.author-eeat",
  category: ECategory.STRUCTURED_DATA,
  weight: 2,
  title: "Author & E-E-A-T signals"
};
var ARTICLE_TYPES = new Set(["Article", "BlogPosting", "NewsArticle"]);
var authorEeatCheck = defineCheck(def20, (ctx) => {
  const blocks = extractJsonLd(ctx.raw.body);
  const nodes = flatten(blocks);
  const metaAuthor = hasMetaAuthor(ctx.raw.body);
  const articleNodes = nodes.filter((n2) => nodeHasType(n2, ARTICLE_TYPES));
  if (articleNodes.length > 0) {
    const hasAuthor = articleNodes.some(hasAuthorName) || metaAuthor;
    const hasDate = articleNodes.some((n2) => hasNonEmpty(n2, "datePublished"));
    const evidence2 = { mode: "article", hasAuthor, hasDate, metaAuthor };
    if (hasAuthor && hasDate) {
      return makeResult(def20, EStatus.PASS, "article declares author and publish date", {
        evidence: evidence2
      });
    }
    if (hasAuthor || hasDate) {
      return makeResult(def20, EStatus.WARN, hasAuthor ? "article is missing datePublished" : "article is missing an author", {
        score: 0.5,
        fix: "add both author (with name) and datePublished to the article JSON-LD for E-E-A-T attribution.",
        impact: ELevel.MEDIUM,
        effort: ELevel.LOW,
        evidence: evidence2
      });
    }
    return makeResult(def20, EStatus.FAIL, "article has no author or publish date", {
      fix: "add author (with name) and datePublished to the article JSON-LD so AI crawlers can attribute the content.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      evidence: evidence2
    });
  }
  const orgWithIdentity = nodes.some((n2) => nodeHasType(n2, new Set(["Organization"])) && (hasNonEmpty(n2, "logo") || hasNonEmpty(n2, "sameAs")));
  const evidence = { mode: "entity", orgWithIdentity, metaAuthor };
  if (orgWithIdentity) {
    return makeResult(def20, EStatus.PASS, "Organization declares logo / sameAs identity", {
      evidence
    });
  }
  return makeResult(def20, EStatus.WARN, "no entity-identity signals (E-E-A-T)", {
    score: 0.5,
    fix: "add an Organization with logo and sameAs links (or author markup) to establish E-E-A-T.",
    impact: ELevel.LOW,
    effort: ELevel.LOW,
    evidence
  });
});
function flatten(blocks) {
  const out = [];
  const visit = (node) => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (node && typeof node === "object") {
      const obj = node;
      out.push(obj);
      if (Array.isArray(obj["@graph"])) {
        obj["@graph"].forEach(visit);
      }
    }
  };
  blocks.forEach(visit);
  return out;
}
function nodeHasType(node, types) {
  const t2 = node["@type"];
  if (typeof t2 === "string") {
    return types.has(t2);
  }
  if (Array.isArray(t2)) {
    return t2.some((x) => typeof x === "string" && types.has(x));
  }
  return false;
}
function hasNonEmpty(node, key) {
  const value = node[key];
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null;
}
function hasAuthorName(node) {
  return authorHasName(node["author"]);
}
function authorHasName(author) {
  if (typeof author === "string") {
    return author.trim().length > 0;
  }
  if (Array.isArray(author)) {
    return author.some(authorHasName);
  }
  if (author && typeof author === "object") {
    const name = author["name"];
    return typeof name === "string" && name.trim().length > 0;
  }
  return false;
}
function hasMetaAuthor(html) {
  const value = metaContent(extractMetaTags(html), "author");
  return value !== undefined && value.trim().length > 0;
}

// packages/scanner/src/checks/structured-data/lang-hreflang.ts
var def21 = {
  id: "structured.lang",
  category: ECategory.STRUCTURED_DATA,
  weight: 1,
  title: "Language declaration"
};
var langHreflangCheck = defineCheck(def21, (ctx) => {
  const lang = extractHtmlLangAttr(ctx.raw.body);
  const hreflang = hasHreflang(ctx.raw.body);
  const evidence = { lang, hreflang };
  if (lang !== null && lang.length > 0) {
    const detail2 = hreflang ? `content language declared (lang="${lang}"); hreflang alternates present` : `content language declared (lang="${lang}")`;
    return makeResult(def21, EStatus.PASS, detail2, { evidence });
  }
  const detail = hreflang ? "<html lang> attribute is missing; hreflang alternates present" : "<html lang> attribute is missing";
  return makeResult(def21, EStatus.WARN, detail, {
    score: 0.25,
    fix: 'add a <html lang="…"> attribute so crawlers and LLMs know the content language.',
    impact: ELevel.LOW,
    effort: ELevel.LOW,
    evidence
  });
});

// packages/scanner/src/checks/structured-data/index.ts
var structuredDataChecks = [
  jsonLdCheck,
  metaBasicsCheck,
  openGraphCheck,
  authorEeatCheck,
  langHreflangCheck
];

// packages/scanner/src/checks/trust/https.ts
var def22 = {
  id: "trust.https",
  category: ECategory.TRUST,
  weight: 3,
  title: "Site is served over a valid HTTPS connection",
  scope: ECheckScope.SITE
};
var DOCS10 = "https://developers.google.com/search/docs/crawling-indexing/https";
var httpsCheck = defineCheck(def22, (ctx) => {
  const { finalUrl, tls } = ctx.raw;
  if (tls?.valid === false) {
    return makeResult(def22, EStatus.FAIL, "TLS certificate is invalid; crawlers reject the connection.", {
      evidence: { finalUrl, tlsError: tls.error },
      fix: "Install a valid certificate (correct chain, hostname, and not expired). AI crawlers abort on TLS errors.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS10
    });
  }
  if (!finalUrl.startsWith("https://")) {
    return makeResult(def22, EStatus.FAIL, "Final URL is served over plain HTTP, not HTTPS.", {
      evidence: { finalUrl },
      fix: "Serve the site over HTTPS and redirect HTTP to HTTPS. AI crawlers and search engines down-rank or skip insecure pages.",
      impact: ELevel.HIGH,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS10
    });
  }
  return makeResult(def22, EStatus.PASS, "Site is served over a valid HTTPS connection.", {
    evidence: { finalUrl, tlsValid: tls?.valid ?? true },
    docsUrl: DOCS10
  });
});

// packages/scanner/src/checks/trust/hsts.ts
var def23 = {
  id: "trust.hsts",
  category: ECategory.TRUST,
  weight: 1,
  title: "Strict-Transport-Security header is present",
  scope: ECheckScope.SITE
};
var DOCS11 = "https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security";
var MIN_MAX_AGE = 31536000;
var hstsCheck = defineCheck(def23, (ctx) => {
  const value = ctx.raw.headers["strict-transport-security"];
  if (value === undefined) {
    return makeResult(def23, EStatus.WARN, "No Strict-Transport-Security header.", {
      evidence: { present: false },
      fix: "Add a Strict-Transport-Security header (e.g. max-age=31536000; includeSubDomains) to enforce HTTPS on every request.",
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      docsUrl: DOCS11
    });
  }
  const maxAgeMatch = /max-age\s*=\s*(\d+)/i.exec(value);
  const maxAge = maxAgeMatch ? Number(maxAgeMatch[1]) : undefined;
  const weak = maxAge !== undefined && maxAge < MIN_MAX_AGE;
  const detail = weak ? `HSTS present but max-age (${maxAge}s) is below the recommended ${MIN_MAX_AGE}s.` : "Strict-Transport-Security header is present.";
  return makeResult(def23, EStatus.PASS, detail, {
    evidence: { value, maxAge },
    docsUrl: DOCS11
  });
});

// packages/scanner/src/checks/trust/mixed-content.ts
var def24 = {
  id: "trust.mixed-content",
  category: ECategory.TRUST,
  weight: 1,
  title: "No insecure (http://) sub-resources on an HTTPS page"
};
var DOCS12 = "https://developer.mozilla.org/docs/Web/Security/Mixed_content";
var MIXED_RE = /<(?:script|img|link|iframe)\b[^>]*?\b(?:src|href)\s*=\s*["'](http:\/\/[^"']+)["']/gi;
var mixedContentCheck = defineCheck(def24, (ctx) => {
  const { finalUrl, body } = ctx.raw;
  if (!finalUrl.startsWith("https://")) {
    return makeResult(def24, EStatus.INFO, "Page is HTTP; mixed-content check is not applicable.", {
      evidence: { finalUrl },
      docsUrl: DOCS12
    });
  }
  const hits = [];
  let m2;
  while ((m2 = MIXED_RE.exec(body)) !== null) {
    if (m2[1] !== undefined) {
      hits.push(m2[1]);
    }
  }
  if (hits.length > 0) {
    return makeResult(def24, EStatus.WARN, `Found ${hits.length} insecure http:// sub-resource(s) on an HTTPS page.`, {
      evidence: { count: hits.length, examples: hits.slice(0, 3) },
      fix: "Load every sub-resource (scripts, images, stylesheets, iframes) over https://. Browsers block mixed content and it signals a neglected site.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      docsUrl: DOCS12
    });
  }
  return makeResult(def24, EStatus.PASS, "No insecure http:// sub-resources detected.", {
    evidence: { count: 0 },
    docsUrl: DOCS12
  });
});

// packages/scanner/src/checks/trust/index.ts
var trustChecks = [httpsCheck, hstsCheck, mixedContentCheck];

// packages/scanner/src/checks/geo/content-depth.ts
var def25 = {
  id: "geo.content-depth",
  category: ECategory.GEO_CONTENT,
  weight: 3,
  title: "Page has enough content to be cited by AI answer engines"
};
var DOCS13 = "https://arxiv.org/abs/2311.09735";
var contentDepthCheck = defineCheck(def25, (ctx) => {
  const html = ctx.raw.body;
  const words = wordCount(htmlToText(html));
  if (words >= 800) {
    return makeResult(def25, EStatus.PASS, `Page has ${words} words — substantial enough for AI citation.`, {
      evidence: { wordCount: words },
      docsUrl: DOCS13
    });
  }
  if (words >= 300) {
    return makeResult(def25, EStatus.WARN, `Page has ${words} words — thin for AI citation; sub-800-word pages are cited far less.`, {
      evidence: { wordCount: words },
      fix: "Expand the page past ~800 words of substantive, on-topic content. Generative engines disproportionately cite deeper pages.",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      score: 0.6,
      docsUrl: DOCS13
    });
  }
  return makeResult(def25, EStatus.FAIL, `Page has only ${words} words — too thin to be cited by AI answer engines.`, {
    evidence: { wordCount: words },
    fix: "Add real, substantive content (aim for 800+ words). Pages under 300 words are rarely surfaced or cited by generative search.",
    impact: ELevel.HIGH,
    effort: ELevel.MEDIUM,
    docsUrl: DOCS13
  });
});

// packages/scanner/src/checks/geo/headings-structure.ts
var def26 = {
  id: "geo.headings",
  category: ECategory.GEO_CONTENT,
  weight: 2,
  title: "Page uses a clear heading hierarchy"
};
var DOCS14 = "https://arxiv.org/abs/2311.09735";
var WORDS_PER_HEADING = 250;
var headingsStructureCheck = defineCheck(def26, (ctx) => {
  const html = ctx.raw.body;
  const words = wordCount(htmlToText(html));
  const h1 = countTag(html, "h1");
  const h2 = countTag(html, "h2");
  const h3 = countTag(html, "h3");
  const headings = h1 + h2 + h3;
  const hasSingleH1 = h1 === 1;
  const hasEnoughH2 = h2 >= 2;
  const denseEnough = words > 0 && headings >= words / WORDS_PER_HEADING;
  const signals = [hasSingleH1, hasEnoughH2, denseEnough].filter(Boolean).length;
  const score = signals / 3;
  const evidence = { h1, h2, h3, wordCount: words, hasSingleH1, hasEnoughH2, denseEnough };
  if (signals === 3) {
    return makeResult(def26, EStatus.PASS, "Page has a clear heading hierarchy.", {
      evidence,
      docsUrl: DOCS14
    });
  }
  if (signals === 2) {
    return makeResult(def26, EStatus.WARN, "Heading hierarchy is partly weak; AI engines chunk content by headings.", {
      evidence,
      fix: "Use exactly one <h1>, at least two <h2> sections, and roughly one heading per 250 words to make content easy to chunk and cite.",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      score,
      docsUrl: DOCS14
    });
  }
  return makeResult(def26, EStatus.FAIL, "Page lacks a usable heading hierarchy for AI chunking.", {
    evidence,
    fix: "Add a single <h1>, multiple <h2> section headings, and enough sub-headings so generative engines can segment and cite the page.",
    impact: ELevel.MEDIUM,
    effort: ELevel.LOW,
    score,
    docsUrl: DOCS14
  });
});

// packages/scanner/src/checks/geo/statistics-citations.ts
var def27 = {
  id: "geo.statistics",
  category: ECategory.GEO_CONTENT,
  weight: 2,
  title: "Content includes statistics, quotations, and external citations"
};
var DOCS15 = "https://arxiv.org/abs/2311.09735";
var STAT_RE = /\b\d+([.,]\d+)?\s*(%|percent|million|billion|k\b)/gi;
var YEAR_RE = /\b(19|20)\d{2}\b/g;
var QUOTED_SPAN_RE = /[“"]([^“”"]{41,})[”"]/g;
var ANCHOR_RE = /<a\b[^>]*?\bhref\s*=\s*["'](https?:\/\/[^"']+)["']/gi;
var statisticsCitationsCheck = defineCheck(def27, (ctx) => {
  const html = ctx.raw.body;
  const text = htmlToText(html);
  const pageHost = safeHost(ctx.raw.finalUrl);
  const stats = (text.match(STAT_RE)?.length ?? 0) + (text.match(YEAR_RE)?.length ?? 0);
  const quotations = countTag(html, "blockquote") + countTag(html, "q") + (text.match(QUOTED_SPAN_RE)?.length ?? 0);
  let externalCitations = 0;
  let m2;
  while ((m2 = ANCHOR_RE.exec(html)) !== null) {
    const linkHost = safeHost(m2[1] ?? "");
    if (linkHost !== null && linkHost !== pageHost) {
      externalCitations++;
    }
  }
  const hasStats = stats > 0;
  const hasQuotes = quotations > 0;
  const hasCitations = externalCitations > 0;
  const families = [hasStats, hasQuotes, hasCitations].filter(Boolean).length;
  const score = families / 3;
  const evidence = { statistics: stats, quotations, externalCitations, families };
  const detail = "Quotations lift visibility ~+41% and statistics ~+32% in generative answers (Aggarwal et al., KDD 2024).";
  if (families >= 2) {
    return makeResult(def27, EStatus.PASS, `Content has ${families}/3 citation signals. ${detail}`, {
      evidence,
      docsUrl: DOCS15
    });
  }
  if (families === 1) {
    return makeResult(def27, EStatus.WARN, `Content has only 1/3 citation signals. ${detail}`, {
      evidence,
      fix: "Add concrete statistics, direct quotations, and links to authoritative external sources; these are the strongest GEO levers.",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      score,
      docsUrl: DOCS15
    });
  }
  return makeResult(def27, EStatus.WARN, `Content has no statistics, quotations, or external citations. ${detail}`, {
    evidence,
    fix: "Add concrete statistics, direct quotations, and links to authoritative external sources; these are the strongest GEO levers.",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    score: 0.25,
    docsUrl: DOCS15
  });
});
function safeHost(url) {
  try {
    return hostOf(url);
  } catch {
    return null;
  }
}

// packages/scanner/src/checks/geo/content-noise.ts
var def28 = {
  id: "geo.content-noise",
  category: ECategory.GEO_CONTENT,
  weight: 2,
  title: "Main content outweighs navigation/chrome"
};
var DOCS16 = "https://arxiv.org/abs/2311.09735";
var contentNoiseCheck = defineCheck(def28, (ctx) => {
  const html = ctx.raw.body;
  const totalWords = wordCount(htmlToText(html));
  const mains = tagTextContents(html, "main");
  const articles = tagTextContents(html, "article");
  const region = mains[0] ?? articles[0];
  if (region === undefined) {
    return makeResult(def28, EStatus.INFO, "No <main> or <article> — cannot measure content-to-noise ratio. Add semantic <main>.", {
      evidence: { hasMain: false, hasArticle: false, totalWords },
      fix: "Wrap the primary content in a semantic <main> or <article> so crawlers (and this check) can separate content from chrome.",
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      score: 0.5,
      docsUrl: DOCS16
    });
  }
  const mainWords = wordCount(region);
  const ratio = totalWords > 0 ? mainWords / totalWords : 0;
  const evidence = { mainWords, totalWords, ratio: Number(ratio.toFixed(2)) };
  if (ratio >= 0.5) {
    return makeResult(def28, EStatus.PASS, "Main content clearly outweighs navigation and chrome.", {
      evidence,
      docsUrl: DOCS16
    });
  }
  if (ratio >= 0.25) {
    return makeResult(def28, EStatus.WARN, "Roughly half the page is chrome; main content is diluted.", {
      evidence,
      fix: "Trim boilerplate (nav, sidebars, footers) or expand the <main> content so the primary content dominates the page.",
      impact: ELevel.MEDIUM,
      effort: ELevel.MEDIUM,
      docsUrl: DOCS16
    });
  }
  return makeResult(def28, EStatus.FAIL, "Content drowned in chrome; main content is a small fraction of the page.", {
    evidence,
    fix: "Restructure so the <main>/<article> content dominates. Crawlers may treat a chrome-heavy page as low-value.",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    docsUrl: DOCS16
  });
});

// packages/scanner/src/checks/geo/freshness.ts
var STALE_MONTHS = 18;
var def29 = {
  id: "geo.freshness",
  category: ECategory.GEO_CONTENT,
  weight: 1,
  title: "Machine-readable freshness signals"
};
var freshness = defineCheck(def29, (ctx) => {
  const dates = [];
  const visit = (node) => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (node !== null && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) {
        if ((key === "dateModified" || key === "datePublished") && typeof value === "string") {
          dates.push(value);
        } else if (typeof value === "object") {
          visit(value);
        }
      }
    }
  };
  extractJsonLd(ctx.raw.body).forEach(visit);
  const lastModified = ctx.raw.headers["last-modified"];
  if (lastModified !== undefined) {
    dates.push(lastModified);
  }
  const parsed = dates.map((d) => new Date(d).getTime()).filter((t2) => !Number.isNaN(t2));
  if (parsed.length === 0) {
    return makeResult(def29, EStatus.WARN, "no machine-readable dates (JSON-LD datePublished/dateModified or Last-Modified header)", {
      score: 0.5,
      fix: "Add datePublished and dateModified to your JSON-LD (or send a Last-Modified header) so engines can judge freshness.",
      impact: ELevel.LOW,
      effort: ELevel.LOW,
      evidence: { sources: 0 }
    });
  }
  const newest = Math.max(...parsed);
  const ageMonths = (Date.now() - newest) / (1000 * 60 * 60 * 24 * 30);
  const evidence = { newest: new Date(newest).toISOString().slice(0, 10), sources: parsed.length };
  if (ageMonths <= STALE_MONTHS) {
    return makeResult(def29, EStatus.PASS, `freshness signals present (newest: ${evidence.newest})`, {
      evidence
    });
  }
  return makeResult(def29, EStatus.WARN, `newest declared date is ${evidence.newest} — stale content is cited less by generative engines`, {
    score: 0.5,
    fix: "Refresh the content and update dateModified — recently-updated pages earn measurably more AI citations.",
    impact: ELevel.LOW,
    effort: ELevel.MEDIUM,
    evidence
  });
});

// packages/scanner/src/checks/geo/extractability.ts
var def30 = {
  id: "geo.extractability",
  category: ECategory.GEO_CONTENT,
  weight: 2,
  title: "Content is structured for AI extraction"
};
var DOCS17 = "https://arxiv.org/abs/2311.09735";
var QUESTION_HEADING_RE = /<h[2-4][^>]*>[^<]*\?[^<]*<\/h[2-4]>/gi;
var MIN_WORDS = 120;
var extractabilityCheck = defineCheck(def30, (ctx) => {
  const html = ctx.raw.body;
  const words = wordCount(htmlToText(html));
  if (words < MIN_WORDS) {
    return makeResult(def30, EStatus.INFO, "too little text to judge extractable structure — see content depth instead", { evidence: { wordCount: words } });
  }
  const tables = countTag(html, "table");
  const lists = countTag(html, "ul") + countTag(html, "ol");
  const definitionLists = countTag(html, "dl");
  const questionHeadings = html.match(QUESTION_HEADING_RE)?.length ?? 0;
  const hasTables = tables > 0 || definitionLists > 0;
  const hasLists = lists > 0;
  const hasQa = questionHeadings > 0;
  const formats = [hasTables, hasLists, hasQa].filter(Boolean).length;
  const score = formats / 3;
  const evidence = { tables, lists, definitionLists, questionHeadings, wordCount: words };
  if (formats >= 2) {
    return makeResult(def30, EStatus.PASS, `Content offers ${formats}/3 extractable formats (tables, lists, Q&A headings) — easy for generative engines to quote.`, { evidence, score, docsUrl: DOCS17 });
  }
  if (formats === 1) {
    return makeResult(def30, EStatus.WARN, "Content offers only 1/3 extractable formats — AI engines favor tables, lists and Q&A-shaped sections when composing answers.", {
      evidence,
      fix: "Structure key facts as data tables or lists and add question-shaped headings with self-contained answers (Q&A / FAQ sections).",
      impact: ELevel.MEDIUM,
      effort: ELevel.LOW,
      score,
      docsUrl: DOCS17
    });
  }
  return makeResult(def30, EStatus.WARN, "Content is wall-of-text: no tables, lists or Q&A-shaped sections for generative engines to lift.", {
    evidence,
    fix: "Break prose into lists and tables and add Q&A-style headings — extractable passages are what AI answers actually quote.",
    impact: ELevel.MEDIUM,
    effort: ELevel.MEDIUM,
    score: 0.25,
    docsUrl: DOCS17
  });
});

// packages/scanner/src/checks/geo/index.ts
var geoChecks = [
  contentDepthCheck,
  headingsStructureCheck,
  statisticsCitationsCheck,
  contentNoiseCheck,
  freshness,
  extractabilityCheck
];

// packages/scanner/src/checks/llms-txt.ts
var def31 = {
  id: "llms-txt.present",
  category: ECategory.CRAWLER_ACCESS,
  weight: 0,
  title: "llms.txt presence (informational)",
  scope: ECheckScope.SITE
};
var DOCS18 = "https://llmstxt.org";
var llmsTxtCheck = defineCheck(def31, async (ctx) => {
  const llmsUrl = `${originOf(ctx.raw.finalUrl)}/llms.txt`;
  const res = await ctx.fetchCached(llmsUrl);
  const body = res.body.trim();
  const present = res.error === undefined && res.status === 200 && body.length > 0 && !body.startsWith("<");
  if (present) {
    return makeResult(def31, EStatus.INFO, "llms.txt present — optional signal consumed by some dev tools (Cursor, IDE agents), ignored by major AI crawlers.", {
      evidence: { url: llmsUrl, status: res.status, present: true },
      score: 1,
      docsUrl: DOCS18
    });
  }
  return makeResult(def31, EStatus.INFO, "no llms.txt — optional; not consumed by major AI providers, low priority.", {
    evidence: { url: llmsUrl, status: res.status, present: false },
    score: 1,
    docsUrl: DOCS18
  });
});

// packages/scanner/src/checks/content-signals.ts
var def32 = {
  id: "content-signals.present",
  category: ECategory.CRAWLER_ACCESS,
  weight: 0,
  title: "Content Signals policy",
  scope: ECheckScope.SITE
};
var contentSignalsCheck = defineCheck(def32, async (ctx) => {
  const robots = await ctx.fetchCached(`${originOf(ctx.url)}/robots.txt`);
  if (!robots.ok) {
    return makeResult(def32, EStatus.INFO, "no robots.txt — no Content Signals to read", {
      evidence: { robotsStatus: robots.status }
    });
  }
  const lines = robots.body.split(/\r?\n/).filter((line) => /^\s*content-signal\s*:/i.test(line)).map((line) => line.trim());
  const detail = lines.length > 0 ? `declares Content Signals (${lines.join(" · ")}) — advisory AI-usage policy (no score impact)` : "no Content Signals in robots.txt — emerging advisory standard (~4% adoption); no score impact";
  return makeResult(def32, EStatus.INFO, detail, {
    evidence: { signals: lines },
    docsUrl: "https://blog.cloudflare.com/content-signals-policy/"
  });
});

// packages/scanner/src/checks/index.ts
var allChecks = [
  ...crawlerChecks,
  ...renderingChecks,
  ...structuredDataChecks,
  ...trustChecks,
  ...geoChecks,
  llmsTxtCheck,
  contentSignalsCheck
];
// packages/scanner/src/smart-agent/template-sample.ts
function templateKey(rawUrl) {
  let pathname;
  try {
    pathname = new URL(rawUrl).pathname;
  } catch {
    pathname = rawUrl;
  }
  const segments = pathname.split("/").filter((segment) => segment.length > 0);
  return `/${segments.map(normalizeSegment).join("/")}`;
}
function normalizeSegment(segment) {
  const value = segment.toLowerCase();
  if (/^\d+$/.test(value)) {
    return ":n";
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value)) {
    return ":uuid";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return ":date";
  }
  if (/^[0-9a-f]{16,}$/.test(value)) {
    return ":hash";
  }
  if (/\d/.test(value) && value.includes("-") || value.length > 24) {
    return ":slug";
  }
  return value;
}

// packages/scanner/src/markdown.ts
function reportToMarkdown(report, mode = "human") {
  if ("primary" in report) {
    const site = report;
    const base = mode === "llm" ? llmMarkdown(site.primary) : humanMarkdown(site.primary);
    return spliceClusters(base, siteClustersBlock(site, mode));
  }
  return mode === "llm" ? llmMarkdown(report) : humanMarkdown(report);
}
function siteClustersBlock(site, mode) {
  const clusters = site.clusters ?? [];
  const totalFound = clusters.reduce((sum, c2) => sum + c2.pageCount, 0);
  const totalScanned = clusters.reduce((sum, c2) => sum + c2.scannedCount, 0);
  const heading = mode === "llm" ? "## Site scope (deep crawl)" : "## Structural templates";
  const lines = [
    heading,
    "",
    `${clusters.length} template${clusters.length !== 1 ? "s" : ""} · ${totalFound} pages found · ${totalScanned} scanned`,
    "",
    "| Template | Avg score | Found | Scanned |",
    "|---|---:|---:|---:|",
    ...clusters.map((cluster) => {
      const pattern = templateKey(cluster.representativeUrl).replace(/:[a-z]+/g, "*");
      return `| \`${pattern}\` | ${cluster.avgScore} | ${cluster.pageCount} | ${cluster.scannedCount} |`;
    }),
    ""
  ];
  return lines.join(`
`);
}
function spliceClusters(base, block2) {
  const sep = `
---
`;
  const idx = base.lastIndexOf(sep);
  if (idx === -1)
    return `${base}
${block2}`;
  return `${base.slice(0, idx)}

${block2}${base.slice(idx)}`;
}
function humanMarkdown(report) {
  const lines = [];
  const failing = report.checks.filter((c2) => c2.status === "fail");
  const warning = report.checks.filter((c2) => c2.status === "warn");
  const passed = report.checks.filter((c2) => c2.status === "pass");
  lines.push(`# AI readiness report — ${hostOf(report.finalUrl)}`);
  lines.push("");
  lines.push(`> **${report.overall}/100 · ${report.grade.toUpperCase()}** — scanned ${report.finishedAt.slice(0, 10)} · score v${report.scoreVersion} · [isready.ai](https://isready.ai)`);
  lines.push("");
  lines.push(`Scanned URL: ${report.finalUrl}`);
  lines.push("");
  lines.push("## Scores");
  lines.push("");
  lines.push("| Category | Score | Weight |");
  lines.push("|---|---:|---:|");
  for (const category of report.categories) {
    lines.push(`| ${category.label} | ${category.score} | ${Math.round(category.weight * 100)}% |`);
  }
  lines.push("");
  if (failing.length > 0) {
    lines.push("## ✗ Failed checks");
    lines.push("");
    for (const check of failing) {
      lines.push(...findingBlock(check));
    }
  }
  if (warning.length > 0) {
    lines.push("## ▲ Warnings");
    lines.push("");
    for (const check of warning) {
      lines.push(...findingBlock(check));
    }
  }
  lines.push("## ✓ Passed");
  lines.push("");
  lines.push(passed.map((c2) => `\`${c2.id}\``).join(" · "));
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("Re-scan any time: `npx isreadyai " + hostOf(report.finalUrl) + "` or https://isready.ai");
  lines.push("");
  return lines.join(`
`);
}
function findingBlock(check) {
  const lines = [];
  lines.push(`### ${check.title} (\`${check.id}\`)`);
  lines.push("");
  lines.push(check.detail);
  lines.push("");
  if (check.fix !== undefined) {
    lines.push(`**Fix:** ${check.fix}`);
    lines.push("");
  }
  const meta = [];
  if (check.impact !== undefined) {
    meta.push(`impact: ${check.impact}`);
  }
  if (check.effort !== undefined) {
    meta.push(`effort: ${check.effort}`);
  }
  if (check.docsUrl !== undefined) {
    meta.push(`docs: ${check.docsUrl}`);
  }
  if (meta.length > 0) {
    lines.push(`_${meta.join(" · ")}_`);
    lines.push("");
  }
  return lines;
}
function llmMarkdown(report) {
  const lines = [];
  const failing = report.checks.filter((c2) => c2.status === "fail");
  const warning = report.checks.filter((c2) => c2.status === "warn");
  const host = hostOf(report.finalUrl);
  lines.push(`# AI-readiness fix plan for ${host}`);
  lines.push("");
  lines.push("## Context for the AI agent");
  lines.push("");
  lines.push(`You are an autonomous coding agent working on the codebase that serves ${report.finalUrl}. ` + `An AI-readiness audit (isready.ai, score v${report.scoreVersion}, ${report.finishedAt.slice(0, 10)}) ` + `scored this site **${report.overall}/100 (${report.grade})**. Your task is to fix the findings below ` + "so the site becomes fully readable by AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot) " + "and AI search engines.");
  lines.push("");
  lines.push("Ground rules:");
  lines.push("");
  lines.push("1. Most AI crawlers do NOT execute JavaScript — every fix must land in the **server-rendered HTML**, not client-side.");
  lines.push("2. Work through findings in order (failures first, then warnings); they are sorted by impact.");
  lines.push("3. The `evidence` blocks contain the exact observed values — use them to locate the problem.");
  lines.push("4. After your changes, verify with `npx isreadyai " + host + "` (or curl the page without JS and inspect the HTML).");
  lines.push("5. Do not fabricate content: where a fix needs copy (descriptions, author names), derive it from the existing site content.");
  lines.push("");
  const ordered = [...failing, ...warning];
  if (ordered.length === 0) {
    lines.push("## Findings");
    lines.push("");
    lines.push("No failures or warnings — this site is already AI-ready. No action required.");
    lines.push("");
    return lines.join(`
`);
  }
  lines.push(`## Findings to fix (${failing.length} failed, ${warning.length} warnings)`);
  lines.push("");
  ordered.forEach((check, index) => {
    lines.push(`### ${index + 1}. [${check.status.toUpperCase()}] ${check.title}`);
    lines.push("");
    lines.push(`- **Check id:** \`${check.id}\` (category: ${check.category})`);
    lines.push(`- **Observed:** ${check.detail}`);
    if (check.fix !== undefined) {
      lines.push(`- **Required change:** ${check.fix}`);
    }
    if (check.impact !== undefined || check.effort !== undefined) {
      lines.push(`- **Priority:** impact ${check.impact ?? "n/a"}, effort ${check.effort ?? "n/a"}`);
    }
    if (check.docsUrl !== undefined) {
      lines.push(`- **Reference:** ${check.docsUrl}`);
    }
    if (check.evidence !== undefined) {
      lines.push("- **Evidence:**");
      lines.push("");
      lines.push("```json");
      lines.push(JSON.stringify(check.evidence, null, 2));
      lines.push("```");
    }
    lines.push("");
  });
  lines.push("## Acceptance criteria");
  lines.push("");
  lines.push(`- All ${failing.length} failed checks pass on re-scan.`);
  lines.push("- No previously passing check regresses.");
  lines.push("- The fixes are visible in the raw HTML response (verify with `curl`, not a browser).");
  lines.push("");
  return lines.join(`
`);
}
// packages/scanner/src/guards.ts
var GRADES = new Set(Object.values(EGrade));
// packages/scanner/src/providers/native.ts
var MAX_REDIRECTS = 10;
var FETCH_TIMEOUT_MS = 20000;
var MAX_BODY_BYTES = 8 * 1024 * 1024;
var SCANNER_UA = "Mozilla/5.0 (compatible; IsReadyBot/1.0; +https://isready.ai/bot)";

class NativeProvider {
  name = "native";
  resolve;
  isPrivate;
  maxBodyBytes;
  constructor(options = {}) {
    this.resolve = options.resolve ?? defaultResolve;
    this.isPrivate = options.isPrivate ?? isPrivateAddress;
    this.maxBodyBytes = options.maxBodyBytes ?? MAX_BODY_BYTES;
  }
  async rawFetch(url, extraHeaders) {
    const first = await this.fetchChain(url, extraHeaders, false);
    if (first.error === undefined || !looksLikeTlsError(first.error)) {
      return first;
    }
    const retried = await this.fetchChain(url, extraHeaders, true);
    if (retried.error !== undefined) {
      return first;
    }
    return { ...retried, tls: { valid: false, error: first.error } };
  }
  async fetchChain(url, extraHeaders, insecure) {
    const redirects = [];
    const started = performance.now();
    let currentUrl = url;
    let ttfbMs = 0;
    try {
      for (let hop = 0;hop <= MAX_REDIRECTS; hop++) {
        const host = new URL(currentUrl).hostname;
        let addresses;
        try {
          addresses = await this.resolve(host);
        } catch {
          return this.errorResponse(url, currentUrl, redirects, started, `DNS lookup failed for ${host}`);
        }
        if (addresses.length === 0) {
          return this.errorResponse(url, currentUrl, redirects, started, `DNS lookup failed for ${host}`);
        }
        const blocked = addresses.find((ip) => this.isPrivate(ip));
        if (blocked !== undefined) {
          return this.errorResponse(url, currentUrl, redirects, started, `Blocked private address (${host} → ${blocked})`);
        }
        const headers = {
          "user-agent": SCANNER_UA,
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "accept-language": "en",
          ...extraHeaders
        };
        const response = await sendRequest(currentUrl, {
          headers,
          insecure,
          lookup: pinnedLookup(addresses),
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
        });
        ttfbMs = performance.now() - started;
        const status = response.statusCode ?? 0;
        const location = headerValue(response.headers.location);
        if (status >= 300 && status < 400 && location !== null) {
          const next = resolveUrl(currentUrl, location);
          redirects.push({ url: currentUrl, status, location: next });
          response.resume();
          if (redirects.some((r2, i2) => i2 < redirects.length - 1 && r2.url === next)) {
            return this.errorResponse(url, currentUrl, redirects, started, "Redirect loop detected");
          }
          currentUrl = next;
          continue;
        }
        const declared = Number(headerValue(response.headers["content-length"]) ?? "");
        if (Number.isFinite(declared) && declared > this.maxBodyBytes) {
          response.destroy();
          return this.errorResponse(url, currentUrl, redirects, started, `Response body too large (${declared} bytes)`);
        }
        const body = await readBody(response, this.maxBodyBytes);
        const totalMs = performance.now() - started;
        return {
          requestedUrl: url,
          finalUrl: currentUrl,
          ok: status >= 200 && status < 300,
          status,
          headers: lowerCaseHeaders(response.headers),
          body,
          redirects,
          timing: { ttfbMs: Math.round(ttfbMs), totalMs: Math.round(totalMs) },
          tls: tlsFromSuccess(currentUrl)
        };
      }
      return this.errorResponse(url, currentUrl, redirects, started, `More than ${MAX_REDIRECTS} redirects`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const code = err instanceof Error && "code" in err ? String(err.code) : "";
      const tls = looksLikeTlsError(`${code} ${message}`) ? { valid: false, error: message } : undefined;
      return this.errorResponse(url, currentUrl, redirects, started, message, tls);
    }
  }
  errorResponse(requestedUrl, finalUrl, redirects, started, error, tls) {
    const totalMs = Math.round(performance.now() - started);
    return {
      requestedUrl,
      finalUrl,
      ok: false,
      status: 0,
      headers: {},
      body: "",
      redirects,
      timing: { ttfbMs: totalMs, totalMs },
      tls,
      error
    };
  }
}
var cachedNodeHttp = null;
async function nodeHttp() {
  if (cachedNodeHttp !== null) {
    return cachedNodeHttp;
  }
  const [dns, http, https] = await Promise.all([
    import("node:dns/promises"),
    import("node:http"),
    import("node:https")
  ]);
  cachedNodeHttp = { lookup: dns.lookup, httpRequest: http.request, httpsRequest: https.request };
  return cachedNodeHttp;
}
var defaultResolve = async (host) => {
  const { lookup } = await nodeHttp();
  const records = await lookup(host, { all: true, verbatim: true });
  return records.map((record) => record.address);
};
async function sendRequest(url, options) {
  const { httpRequest, httpsRequest } = await nodeHttp();
  return new Promise((resolve, reject) => {
    const isHttps = new URL(url).protocol === "https:";
    const send = isHttps ? httpsRequest : httpRequest;
    const req = send(url, {
      method: "GET",
      headers: options.headers,
      lookup: options.lookup,
      rejectUnauthorized: !options.insecure,
      signal: options.signal
    }, resolve);
    req.on("error", reject);
    req.end();
  });
}
var familyOf = (ip) => ip.includes(":") ? 6 : 4;
function pinnedLookup(addresses) {
  return (_hostname, options, callback) => {
    if (typeof options === "object" && options.all === true) {
      callback(null, addresses.map((address) => ({ address, family: familyOf(address) })));
      return;
    }
    const first = addresses[0] ?? "0.0.0.0";
    callback(null, first, familyOf(first));
  };
}
function readBody(response, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    response.on("data", (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        response.destroy();
        reject(new Error(`Response body too large (>${maxBytes} bytes)`));
        return;
      }
      chunks.push(chunk);
    });
    response.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    response.on("error", reject);
  });
}
function headerValue(value) {
  if (value === undefined) {
    return null;
  }
  return Array.isArray(value) ? value[0] ?? null : value;
}
function lowerCaseHeaders(raw) {
  const headers = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined) {
      continue;
    }
    headers[key.toLowerCase()] = Array.isArray(value) ? value.join(", ") : value;
  }
  return headers;
}
function tlsFromSuccess(url) {
  if (!url.startsWith("https://")) {
    return;
  }
  return { valid: true };
}
function looksLikeTlsError(message) {
  return /certificate|cert|tls|ssl|handshake/i.test(message);
}
// packages/scanner/src/score.ts
var SCORE_VERSION = "2026.06.2";
var CATEGORY_WEIGHTS = {
  [ECategory.CRAWLER_ACCESS]: 0.25,
  [ECategory.RENDERING]: 0.2,
  [ECategory.STRUCTURED_DATA]: 0.3,
  [ECategory.TRUST]: 0.1,
  [ECategory.GEO_CONTENT]: 0.15
};
function scoreCategories(checks) {
  const order = Object.values(ECategory);
  return order.map((category) => {
    const inCategory = checks.filter((c2) => c2.category === category);
    const totalWeight = inCategory.reduce((sum, c2) => sum + c2.weight, 0);
    const weighted = totalWeight > 0 ? inCategory.reduce((sum, c2) => sum + c2.score * c2.weight, 0) / totalWeight : 1;
    return {
      category,
      label: CATEGORY_LABELS[category],
      score: Math.round(weighted * 100),
      weight: CATEGORY_WEIGHTS[category],
      checks: inCategory
    };
  });
}
function overallScore(categories) {
  const totalWeight = categories.reduce((sum, c2) => sum + c2.weight, 0);
  if (totalWeight === 0) {
    return 0;
  }
  const weighted = categories.reduce((sum, c2) => sum + c2.score * c2.weight, 0) / totalWeight;
  return Math.round(weighted);
}
function gradeOf(overall) {
  if (overall >= 90) {
    return EGrade.EXCELLENT;
  }
  if (overall >= 75) {
    return EGrade.GOOD;
  }
  if (overall >= 50) {
    return EGrade.MODERATE;
  }
  return EGrade.POOR;
}

// packages/scanner/src/smart-agent/structural-cluster.ts
var K = 64;
var MAX_DEPTH = 5;
var FNV_OFFSET = 2166136261;
var FNV_PRIME = 16777619;
var VOID_ELEMENTS = new Set([
  "br",
  "img",
  "input",
  "hr",
  "meta",
  "link",
  "source",
  "area",
  "base",
  "col",
  "embed",
  "param",
  "track",
  "wbr"
]);
function fnv1aSeeded(seed, str) {
  let h2 = (FNV_OFFSET ^ seed) >>> 0;
  for (let i2 = 0;i2 < str.length; i2++) {
    h2 = Math.imul(h2 ^ str.charCodeAt(i2), FNV_PRIME) >>> 0;
  }
  return h2;
}
function extractTagPaths(html) {
  const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  const TAG_RE2 = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g;
  const stack = [];
  const paths = new Set;
  let match;
  while ((match = TAG_RE2.exec(stripped)) !== null) {
    const [, closing = "", rawTag = "", rest = ""] = match;
    const isClosing = closing === "/";
    const tag = rawTag.toLowerCase();
    const isSelfClosing = rest.trimEnd().endsWith("/");
    if (isClosing) {
      for (let i2 = stack.length - 1;i2 >= 0; i2--) {
        if (stack[i2] === tag) {
          stack.splice(i2);
          break;
        }
      }
    } else if (isSelfClosing || VOID_ELEMENTS.has(tag)) {
      if (stack.length < MAX_DEPTH) {
        paths.add([...stack, tag].join(">"));
      }
    } else {
      if (stack.length < MAX_DEPTH) {
        stack.push(tag);
        paths.add(stack.join(">"));
      }
    }
  }
  return paths;
}
function structuralFingerprint(html) {
  const paths = extractTagPaths(html);
  const sig = [];
  for (let i2 = 0;i2 < K; i2++) {
    let min = 4294967295;
    for (const path of paths) {
      const h2 = fnv1aSeeded(i2, path);
      if (h2 < min)
        min = h2;
    }
    sig.push(min);
  }
  return sig;
}
function minhashSimilarity(a2, b2) {
  const k = Math.min(a2.length, b2.length);
  if (k === 0)
    return 0;
  let matches = 0;
  for (let i2 = 0;i2 < k; i2++) {
    if (a2[i2] === b2[i2])
      matches++;
  }
  return matches / k;
}
function clusterByStructure(pages, threshold = 0.75) {
  const clusters = [];
  let nextId = 0;
  for (const page of pages) {
    let bestSim = -1;
    let bestCluster;
    for (const cluster of clusters) {
      const sim = minhashSimilarity(page.fingerprint, cluster.rep);
      if (sim >= threshold && sim > bestSim) {
        bestSim = sim;
        bestCluster = cluster;
      }
    }
    if (bestCluster !== undefined) {
      bestCluster.members.push(page.id);
    } else {
      clusters.push({ id: nextId++, rep: page.fingerprint, members: [page.id] });
    }
  }
  const result = new Map;
  for (const cluster of clusters) {
    result.set(cluster.id, cluster.members);
  }
  return result;
}

// packages/scanner/src/engine.ts
async function scan(inputUrl, options) {
  const startedAt = new Date;
  const url = normalizeUrl(inputUrl);
  const providers = options.providers ?? [new NativeProvider];
  const native = providers[0] ?? new NativeProvider;
  const log2 = options.onProgress ?? (() => {
    return;
  });
  log2(`Fetching ${url}`);
  const raw = await native.rawFetch(url);
  const cache = new Map;
  const cachedFetch = (target, headers) => {
    const key = headers === undefined ? target : `${target}|${JSON.stringify(headers)}`;
    const existing = cache.get(key);
    if (existing !== undefined) {
      return existing;
    }
    const pending = native.rawFetch(target, headers);
    cache.set(key, pending);
    return pending;
  };
  const ctx = {
    url,
    raw,
    providers,
    fetchCached: (target) => cachedFetch(target),
    fetchWith: (target, headers) => cachedFetch(target, headers),
    log: log2
  };
  log2(`Running ${options.checks.length} checks`);
  const results = await Promise.all(options.checks.map((check) => runSafely(check, ctx)));
  const categories = scoreCategories(results);
  const overall = overallScore(categories);
  const finishedAt = new Date;
  return {
    url,
    finalUrl: raw.finalUrl,
    scoreVersion: SCORE_VERSION,
    overall,
    grade: gradeOf(overall),
    categories,
    checks: results,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    meta: {
      renderProvider: null,
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      fetchOk: raw.error === undefined && raw.status > 0,
      error: raw.error
    },
    fingerprint: structuralFingerprint(raw.body)
  };
}
async function runSafely(check, ctx) {
  try {
    return await check.run(ctx);
  } catch (err) {
    return {
      id: check.id,
      category: check.category,
      status: EStatus.ERROR,
      score: 0,
      weight: 0,
      title: check.title,
      detail: `Check crashed: ${err instanceof Error ? err.message : String(err)}`
    };
  }
}
// packages/scanner/src/crawl.ts
var DEFAULT_LIMIT = 10;
var DEFAULT_CONCURRENCY = 4;
var SAMPLE_PER_TEMPLATE = 5;
var DEFAULT_MAX_URLS = 500;
var URLS_PER_CHILD_SITEMAP = 500;
var MAX_CHILD_SITEMAPS = 10;
var MAX_SITEMAP_PARSE = 1e4;
var MAX_HREFS = 5000;
var SKIP_EXTENSION_RE = /\.(png|jpe?g|gif|webp|avif|svg|ico|css|js|mjs|map|json|xml|pdf|zip|gz|tar|mp4|webm|mp3|wav|woff2?|ttf|eot|otf|txt)([?#]|$)/i;
function spreadSample(arr, k) {
  if (k <= 0 || arr.length === 0)
    return [];
  if (arr.length <= k)
    return [...arr];
  if (k === 1)
    return [arr[0]];
  return Array.from({ length: k }, (_2, i2) => arr[Math.round(i2 * (arr.length - 1) / (k - 1))]);
}
async function scanBatch(urls, checks, providers, concurrency, counter, total, log2) {
  if (urls.length === 0) {
    return { reports: [], failed: 0 };
  }
  const results = [];
  let failed = 0;
  const queue = [...urls];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    for (let url = queue.shift();url !== undefined; url = queue.shift()) {
      log2(`Scanning page ${++counter.n}/${total}: ${url}`);
      try {
        results.push(await scan(url, { checks, providers }));
      } catch (error) {
        failed += 1;
        const reason = error instanceof Error ? error.message : String(error);
        log2(`Page failed (${failed}): ${url} — ${reason}`);
      }
    }
  });
  await Promise.all(workers);
  return { reports: results, failed };
}
async function scanAdaptive(urls, primary, pageChecks, providers, concurrency, log2) {
  const allCandidates = [primary.finalUrl, ...urls];
  const templateGroups = new Map;
  for (const url of allCandidates) {
    const key = templateKey(url);
    const group = templateGroups.get(key);
    if (group === undefined) {
      templateGroups.set(key, [url]);
    } else {
      group.push(url);
    }
  }
  const pages = [];
  const clusters = [];
  let failed = 0;
  let nextId = 0;
  const counter = { n: 0 };
  const total = urls.length;
  for (const [, groupUrls] of templateGroups) {
    const groupSize = groupUrls.length;
    const preScanned = groupUrls.includes(primary.finalUrl) ? [primary] : [];
    const unscanned = groupUrls.filter((u4) => u4 !== primary.finalUrl);
    const sampleQuota = Math.max(0, SAMPLE_PER_TEMPLATE - preScanned.length);
    const toSample = spreadSample(unscanned, sampleQuota);
    const sampleBatch = await scanBatch(toSample, pageChecks, providers, concurrency, counter, total, log2);
    pages.push(...sampleBatch.reports);
    failed += sampleBatch.failed;
    const groupScanned = [...preScanned, ...sampleBatch.reports];
    if (groupScanned.length === 0) {
      continue;
    }
    const sampleClusterMap = clusterByStructure(groupScanned.map((p2) => ({ id: p2.finalUrl, fingerprint: p2.fingerprint ?? [] })));
    if (sampleClusterMap.size <= 1) {
      const rep = groupScanned.reduce((best, p2) => completeness(p2) > completeness(best) ? p2 : best);
      const avgScore = Math.round(groupScanned.reduce((sum, p2) => sum + p2.overall, 0) / groupScanned.length);
      clusters.push({
        id: nextId++,
        representativeUrl: rep.finalUrl,
        pageUrls: groupScanned.map((p2) => p2.finalUrl),
        pageCount: groupSize,
        scannedCount: groupScanned.length,
        avgScore
      });
    } else {
      const totalSampled = groupScanned.length;
      const subClusters = [...sampleClusterMap.values()].map((memberIds) => {
        const members = groupScanned.filter((p2) => memberIds.includes(p2.finalUrl));
        return { members, rawPageCount: Math.round(groupSize * members.length / totalSampled) };
      });
      const pageCountSum = subClusters.reduce((sum, s) => sum + s.rawPageCount, 0);
      const diff = groupSize - pageCountSum;
      if (diff !== 0) {
        const largest = subClusters.reduce((best, s) => s.members.length > best.members.length ? s : best);
        largest.rawPageCount += diff;
      }
      for (const { members, rawPageCount } of subClusters) {
        const rep = members.reduce((best, p2) => completeness(p2) > completeness(best) ? p2 : best);
        const avgScore = Math.round(members.reduce((sum, p2) => sum + p2.overall, 0) / members.length);
        clusters.push({
          id: nextId++,
          representativeUrl: rep.finalUrl,
          pageUrls: members.map((p2) => p2.finalUrl),
          pageCount: rawPageCount,
          scannedCount: members.length,
          avgScore
        });
      }
    }
  }
  clusters.sort((a2, b2) => b2.pageCount - a2.pageCount);
  return { pages, clusters, failed };
}
async function scanSite(inputUrl, options) {
  const startedAt = new Date;
  const log2 = options.onProgress ?? (() => {
    return;
  });
  const providers = options.providers ?? [new NativeProvider];
  const native = providers[0] ?? new NativeProvider;
  const limit = options.limit ?? DEFAULT_LIMIT;
  const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY;
  const primary = options.primary ?? await scan(inputUrl, {
    checks: options.checks,
    providers,
    onProgress: log2
  });
  const skip = options.skip ?? 0;
  let urls = [];
  let discovered = 0;
  if (primary.meta.fetchOk !== false && limit > 0) {
    log2("Discovering pages (sitemap + links)");
    const discovery = await discoverPages((u4) => native.rawFetch(u4), primary.finalUrl, {
      maxUrls: limit + skip
    });
    discovered = discovery.discovered;
    urls = discovery.urls.slice(skip, skip + limit);
  }
  const pageChecks = options.checks.filter((c2) => c2.scope !== ECheckScope.SITE);
  const { pages, clusters, failed } = await scanAdaptive(urls, primary, pageChecks, providers, concurrency, log2);
  pages.sort((a2, b2) => urls.indexOf(a2.url) - urls.indexOf(b2.url));
  const overall = Math.round((primary.overall * 2 + pages.reduce((sum, p2) => sum + p2.overall, 0)) / (2 + pages.length));
  return {
    url: primary.finalUrl,
    scoreVersion: SCORE_VERSION,
    overall,
    grade: gradeOf(overall),
    categories: aggregateCategories(primary, pages),
    primary,
    pages,
    discovered,
    failed,
    clusters,
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString()
  };
}
function aggregateCategories(primary, pages) {
  return primary.categories.map((base) => {
    let weighted = base.score * 2;
    let total = 2;
    for (const page of pages) {
      const match = page.categories.find((c2) => c2.category === base.category);
      if (match !== undefined && match.checks.length > 0) {
        weighted += match.score;
        total += 1;
      }
    }
    return { ...base, score: Math.round(weighted / total), checks: [] };
  });
}
function aggregateSiteFindings(site) {
  const groups = new Map;
  for (const report of [site.primary, ...site.pages]) {
    for (const check of report.checks) {
      if (check.status !== EStatus.FAIL && check.status !== EStatus.WARN) {
        continue;
      }
      const existing = groups.get(check.id);
      if (existing === undefined) {
        groups.set(check.id, { result: check, pages: [report.finalUrl] });
      } else {
        existing.pages.push(report.finalUrl);
        if (check.status === EStatus.FAIL && existing.result.status !== EStatus.FAIL) {
          existing.result = check;
        }
      }
    }
  }
  return [...groups.values()].toSorted((a2, b2) => {
    const failDiff = Number(b2.result.status === EStatus.FAIL) - Number(a2.result.status === EStatus.FAIL);
    return failDiff !== 0 ? failDiff : b2.pages.length - a2.pages.length;
  });
}
function completeness(page) {
  const fetched = page.meta.fetchOk ? 1 : 0;
  const passes = page.checks.filter((c2) => c2.status === "pass").length;
  return fetched * 1e4 + passes * 100 + page.overall;
}
async function discoverPages(fetcher, primaryUrl, options = {}) {
  const maxUrls = options.maxUrls ?? DEFAULT_MAX_URLS;
  const host = hostOf(primaryUrl);
  const seen = new Set([normalizeForDedupe(primaryUrl)]);
  const fromSitemap = [];
  const fromLinks = [];
  let discovered = 0;
  const add = (target, candidate) => {
    const url = sanitizeCandidate(candidate, primaryUrl, host);
    if (url === null) {
      return;
    }
    const key = normalizeForDedupe(url);
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    discovered += 1;
    if (target.length < maxUrls) {
      target.push(url);
    }
  };
  const robotsRes = await fetcher(new URL("/robots.txt", primaryUrl).toString());
  const robotsSitemaps = robotsRes.error === undefined && robotsRes.status < 400 ? parseRobots(robotsRes.body).sitemaps : [];
  const sitemapUrl = robotsSitemaps[0] ?? new URL("/sitemap.xml", primaryUrl).toString();
  const sitemapRes = await fetcher(sitemapUrl);
  if (sitemapRes.error === undefined && sitemapRes.ok) {
    const locs = extractLocs(sitemapRes.body);
    if (/<sitemapindex/i.test(sitemapRes.body)) {
      const childCount = Number.isFinite(maxUrls) ? Math.min(MAX_CHILD_SITEMAPS, Math.max(3, Math.ceil(maxUrls / URLS_PER_CHILD_SITEMAP))) : locs.length;
      const children = await Promise.all(locs.slice(0, childCount).map((child) => fetcher(child).catch(() => null)));
      for (const child of children) {
        if (child !== null && child.error === undefined && child.ok) {
          for (const loc of extractLocs(child.body)) {
            add(fromSitemap, loc);
          }
        }
      }
    } else {
      for (const loc of locs) {
        add(fromSitemap, loc);
      }
    }
  }
  const homeRes = await fetcher(primaryUrl);
  if (homeRes.error === undefined && homeRes.ok) {
    for (const href of extractHrefs(homeRes.body)) {
      add(fromLinks, href);
    }
  }
  const byDepth = (a2, b2) => pathDepth(a2) - pathDepth(b2);
  return {
    urls: [...fromSitemap.toSorted(byDepth), ...fromLinks.toSorted(byDepth)],
    discovered
  };
}
function extractLocs(xml) {
  const locs = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m2;
  while ((m2 = re.exec(xml)) !== null && locs.length < MAX_SITEMAP_PARSE) {
    locs.push(m2[1] ?? "");
  }
  return locs;
}
function extractHrefs(html) {
  const hrefs = [];
  const re = /<a\b[^>]*?\bhref\s*=\s*["']([^"'#][^"']*)["']/gi;
  let m2;
  while ((m2 = re.exec(html)) !== null && hrefs.length < MAX_HREFS) {
    hrefs.push(m2[1] ?? "");
  }
  return hrefs;
}
function sanitizeCandidate(candidate, baseUrl, host) {
  if (candidate.startsWith("mailto:") || candidate.startsWith("tel:")) {
    return null;
  }
  let absolute;
  try {
    absolute = resolveUrl(baseUrl, candidate);
  } catch {
    return null;
  }
  let parsed;
  try {
    parsed = new URL(absolute);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return null;
  }
  if (parsed.host !== host) {
    return null;
  }
  if (SKIP_EXTENSION_RE.test(parsed.pathname)) {
    return null;
  }
  parsed.hash = "";
  return parsed.toString();
}
function normalizeForDedupe(url) {
  try {
    const parsed = new URL(normalizeUrl(url));
    parsed.hash = "";
    const path = parsed.pathname.replace(/\/+$/, "");
    return `${parsed.host}${path}${parsed.search}`;
  } catch {
    return url;
  }
}
function pathDepth(url) {
  try {
    return new URL(url).pathname.split("/").filter((s) => s.length > 0).length;
  } catch {
    return 99;
  }
}
// packages/scanner/src/smart-agent/types.ts
var ESmartAgentCategory = {
  VISIBLE_CONTENT: "visible_content",
  UNDERSTANDABLE_STRUCTURE: "understandable_structure",
  CONTENT_QUALITY: "content_quality",
  ACCESSIBLE_CONTROLS: "accessible_controls",
  NAVIGABILITY: "navigability",
  BARRIERS: "barriers"
};
var SMART_AGENT_CATEGORY_LABELS = {
  [ESmartAgentCategory.VISIBLE_CONTENT]: "Visible content",
  [ESmartAgentCategory.UNDERSTANDABLE_STRUCTURE]: "Understandable structure",
  [ESmartAgentCategory.CONTENT_QUALITY]: "Content quality",
  [ESmartAgentCategory.ACCESSIBLE_CONTROLS]: "Accessible controls",
  [ESmartAgentCategory.NAVIGABILITY]: "Navigability",
  [ESmartAgentCategory.BARRIERS]: "Agent barriers"
};
var SMART_AGENT_CATEGORY_WEIGHTS = {
  [ESmartAgentCategory.VISIBLE_CONTENT]: 30,
  [ESmartAgentCategory.UNDERSTANDABLE_STRUCTURE]: 20,
  [ESmartAgentCategory.CONTENT_QUALITY]: 20,
  [ESmartAgentCategory.ACCESSIBLE_CONTROLS]: 15,
  [ESmartAgentCategory.NAVIGABILITY]: 10,
  [ESmartAgentCategory.BARRIERS]: 5
};
var ESmartAgentStatus = {
  PASS: EStatus.PASS,
  WARN: EStatus.WARN,
  FAIL: EStatus.FAIL
};
// packages/scanner/src/smart-agent/analyze.ts
var SCORE_VERSION2 = "2026.06-smart.1";
var INTERACTIVE_ROLES = new Set([
  "button",
  "checkbox",
  "combobox",
  "link",
  "menuitem",
  "option",
  "radio",
  "searchbox",
  "slider",
  "spinbutton",
  "switch",
  "tab",
  "textbox"
]);
var LANDMARK_PATTERN = /\b(banner|contentinfo|form|main|navigation|region|search)\b/gi;
var CONTENT_PATTERN = /\b(article|blockquote|cell|definition|document|heading|list|listitem|paragraph|row)\b/gi;
var BARRIER_PATTERN = /\b(access denied|captcha|challenge|checking your browser|enable javascript|forbidden|just a moment|not authorized|robot verification|security check)\b/gi;
function analyzeSmartAgentObservation(observation, provider, startedAt = new Date, agentBrowserVersion = null) {
  const snapshot = cleanSnapshot(observation.snapshot);
  const refs = Object.values(observation.refs);
  const namedRefs = refs.filter((ref) => ref.name.trim().length > 0);
  const interactiveRefs = refs.filter((ref) => INTERACTIVE_ROLES.has(ref.role.toLowerCase()));
  const namedInteractiveRefs = interactiveRefs.filter((ref) => ref.name.trim().length > 0);
  const links = refs.filter((ref) => ref.role.toLowerCase() === "link");
  const namedLinks = links.filter((ref) => ref.name.trim().length > 0);
  const images = refs.filter((ref) => {
    const role = ref.role.toLowerCase();
    return role === "image" || role === "img";
  });
  const namedImages = images.filter((ref) => ref.name.trim().length > 0);
  const headingLevels = Array.from(snapshot.matchAll(/\bheading\b[^\n]*\blevel=(\d)/gi)).map((match) => Number(match[1]));
  const headingCount = countMatches(snapshot, /\bheading\b/gi);
  const landmarkCount = countMatches(snapshot, LANDMARK_PATTERN);
  const contentNodeCount = countMatches(snapshot, CONTENT_PATTERN);
  const barrierMatches = uniqueMatches(snapshot, BARRIER_PATTERN);
  const meaningfulCharacters = snapshot.replace(/[-\s()[\]{}"'`=:,@]/g, "").length;
  const signals = [
    signal({
      id: "smart-visible-content",
      category: ESmartAgentCategory.VISIBLE_CONTENT,
      score: thresholdScore(meaningfulCharacters, 1200, 300),
      title: "Rendered content is visible",
      detail: meaningfulCharacters >= 1200 ? `The browser snapshot exposes ${meaningfulCharacters} meaningful characters.` : `The browser snapshot exposes only ${meaningfulCharacters} meaningful characters.`,
      evidence: { meaningfulCharacters },
      fix: meaningfulCharacters < 1200 ? "Render the primary page content as semantic HTML and avoid hiding it behind interaction-only states." : undefined
    }),
    signal({
      id: "smart-content-nodes",
      category: ESmartAgentCategory.VISIBLE_CONTENT,
      score: thresholdScore(contentNodeCount, 12, 4),
      title: "Content has readable nodes",
      detail: `The accessibility tree exposes ${contentNodeCount} content nodes.`,
      evidence: { contentNodeCount },
      fix: contentNodeCount < 12 ? "Use headings, paragraphs, lists and articles so an agent receives structured content instead of a shallow shell." : undefined
    }),
    signal({
      id: "smart-images",
      category: ESmartAgentCategory.VISIBLE_CONTENT,
      score: ratioScore(namedImages.length, images.length),
      weight: 0.6,
      title: "Images carry a text alternative",
      detail: images.length === 0 ? "No images are exposed to the agent." : `${namedImages.length} of ${images.length} images have an accessible name.`,
      evidence: { images: images.length, namedImages: namedImages.length },
      fix: images.length > 0 && ratioScore(namedImages.length, images.length) < 0.9 ? "Give meaningful images alt text so a browser-capable agent can read their content, and mark decorative images as such." : undefined
    }),
    signal({
      id: "smart-landmarks",
      category: ESmartAgentCategory.UNDERSTANDABLE_STRUCTURE,
      score: thresholdScore(landmarkCount, 3, 1),
      weight: 0.45,
      title: "Page landmarks are understandable",
      detail: `The snapshot contains ${landmarkCount} semantic landmarks.`,
      evidence: { landmarkCount },
      fix: landmarkCount < 3 ? "Add semantic main, nav, header, footer and named region landmarks around the page structure." : undefined
    }),
    signal({
      id: "smart-headings",
      category: ESmartAgentCategory.UNDERSTANDABLE_STRUCTURE,
      score: headingStructureScore(headingLevels, headingCount),
      weight: 0.55,
      title: "Heading hierarchy is usable",
      detail: headingCount > 0 ? `The agent sees ${headingCount} headings${headingLevels.length > 0 ? ` across levels ${uniqueNumbers(headingLevels).join(", ")}` : ""}.` : "The agent does not see a heading hierarchy.",
      evidence: { headingCount, headingLevels },
      fix: headingCount === 0 ? "Expose one descriptive H1 and organize sections with sequential headings." : hasHeadingJump(headingLevels) ? "Keep heading levels sequential so agents can infer section relationships." : undefined
    }),
    signal({
      id: "smart-page-title",
      category: ESmartAgentCategory.CONTENT_QUALITY,
      score: observation.title.trim().length >= 8 ? 1 : observation.title.trim().length > 0 ? 0.5 : 0,
      weight: 0.3,
      title: "Page purpose is named",
      detail: observation.title.trim().length > 0 ? `The rendered page title is "${observation.title.trim()}".` : "The rendered page has no title.",
      evidence: { title: observation.title },
      fix: observation.title.trim().length < 8 ? "Use a specific page title that states the page purpose and organization or product name." : undefined
    }),
    signal({
      id: "smart-content-depth",
      category: ESmartAgentCategory.CONTENT_QUALITY,
      score: thresholdScore(contentNodeCount, 20, 6),
      weight: 0.4,
      title: "Content has enough depth",
      detail: `The agent can identify ${contentNodeCount} structured content nodes.`,
      evidence: { contentNodeCount },
      fix: contentNodeCount < 20 ? "Add self-contained explanations, descriptive headings and concrete supporting detail." : undefined
    }),
    signal({
      id: "smart-named-elements",
      category: ESmartAgentCategory.CONTENT_QUALITY,
      score: ratioScore(namedRefs.length, refs.length),
      weight: 0.3,
      title: "Elements carry understandable names",
      detail: `${namedRefs.length} of ${refs.length} referenced elements have an accessible name.`,
      evidence: { namedElements: namedRefs.length, referencedElements: refs.length },
      fix: ratioScore(namedRefs.length, refs.length) < 0.9 ? "Give links, controls and regions concise accessible names that explain their purpose." : undefined
    }),
    signal({
      id: "smart-controls",
      category: ESmartAgentCategory.ACCESSIBLE_CONTROLS,
      score: ratioScore(namedInteractiveRefs.length, interactiveRefs.length),
      title: "Interactive controls are addressable",
      detail: interactiveRefs.length === 0 ? "No interactive controls are required on this page." : `${namedInteractiveRefs.length} of ${interactiveRefs.length} controls have usable names.`,
      evidence: {
        interactiveElements: interactiveRefs.length,
        namedInteractiveElements: namedInteractiveRefs.length
      },
      fix: ratioScore(namedInteractiveRefs.length, interactiveRefs.length) < 0.9 ? "Add visible labels or accessible names to every interactive control." : undefined
    }),
    signal({
      id: "smart-navigation",
      category: ESmartAgentCategory.NAVIGABILITY,
      score: links.length === 0 ? 0.25 : ratioScore(namedLinks.length, links.length),
      title: "Navigation links are discoverable",
      detail: links.length === 0 ? "The agent cannot find any navigational links." : `${namedLinks.length} of ${links.length} links have understandable names.`,
      evidence: { links: links.length, namedLinks: namedLinks.length },
      fix: links.length === 0 ? "Expose semantic links to important destinations and next steps." : ratioScore(namedLinks.length, links.length) < 0.9 ? "Replace empty or ambiguous link names with destination-oriented text." : undefined
    }),
    signal({
      id: "smart-barriers",
      category: ESmartAgentCategory.BARRIERS,
      score: snapshot.length === 0 ? 0 : barrierMatches.length === 0 ? 1 : 0,
      title: "No browser barrier obscures the page",
      detail: snapshot.length === 0 ? "The browser returned an empty accessibility snapshot." : barrierMatches.length === 0 ? "No common anti-bot, JavaScript or access challenge was detected." : `The agent encountered possible barriers: ${barrierMatches.join(", ")}.`,
      evidence: { matches: barrierMatches },
      fix: snapshot.length === 0 || barrierMatches.length > 0 ? "Let read-only browser agents reach public content without a challenge, interstitial or JavaScript-only gate." : undefined
    })
  ];
  const categories = categoryScores(signals);
  const overall = Math.round(categories.reduce((sum, category) => sum + category.score * category.weight, 0) / 100);
  const finishedAt = new Date;
  return {
    url: observation.requestedUrl,
    finalUrl: observation.finalUrl,
    scoreVersion: SCORE_VERSION2,
    overall,
    grade: gradeOf(overall),
    categories,
    signals,
    agentView: {
      title: observation.title,
      snapshot: observation.snapshot,
      interactiveSnapshot: observation.interactiveSnapshot,
      interactiveElements: interactiveRefs
    },
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    meta: {
      provider,
      durationMs: Math.max(0, finishedAt.getTime() - startedAt.getTime()),
      agentBrowserVersion
    }
  };
}
function aggregateSmartReports(primary, pages) {
  const rendered = pages.filter(didRender);
  const overall = Math.round((primary.overall * 2 + rendered.reduce((sum, page) => sum + page.overall, 0)) / (2 + rendered.length));
  const categories = primary.categories.map((base) => {
    let weighted = base.score * 2;
    let total = 2;
    for (const page of rendered) {
      const match = page.categories.find((category) => category.category === base.category);
      if (match !== undefined) {
        weighted += match.score;
        total += 1;
      }
    }
    return { ...base, score: Math.round(weighted / total), signals: [] };
  });
  return {
    url: primary.finalUrl,
    scoreVersion: primary.scoreVersion,
    overall,
    grade: gradeOf(overall),
    categories,
    primary,
    pages: rendered,
    startedAt: primary.startedAt,
    finishedAt: rendered.at(-1)?.finishedAt ?? primary.finishedAt,
    meta: primary.meta
  };
}
function didRender(report) {
  return /^https?:\/\//i.test(report.finalUrl);
}
function signal(input) {
  const score = clamp(input.score);
  return {
    id: input.id,
    category: input.category,
    score,
    weight: input.weight ?? 1,
    status: statusFor(score),
    title: input.title,
    detail: input.detail,
    evidence: input.evidence,
    ...input.fix !== undefined ? { fix: input.fix } : {}
  };
}
function categoryScores(signals) {
  return Object.values(ESmartAgentCategory).map((category) => {
    const categorySignals = signals.filter((item) => item.category === category);
    const totalWeight = categorySignals.reduce((sum, item) => sum + item.weight, 0);
    const score = totalWeight === 0 ? 0 : Math.round(categorySignals.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight * 100);
    return {
      category,
      label: SMART_AGENT_CATEGORY_LABELS[category],
      score,
      weight: SMART_AGENT_CATEGORY_WEIGHTS[category],
      signals: categorySignals
    };
  });
}
function thresholdScore(value, pass, warn) {
  if (value >= pass) {
    return 1;
  }
  if (value >= warn) {
    return 0.55;
  }
  return 0;
}
function ratioScore(named, total) {
  if (total === 0) {
    return 1;
  }
  return named / total;
}
function headingStructureScore(levels, count) {
  if (count === 0) {
    return 0;
  }
  if (levels.length === 0) {
    return 0.55;
  }
  return hasHeadingJump(levels) ? 0.55 : 1;
}
function hasHeadingJump(levels) {
  return levels.some((level, index) => index > 0 && level - (levels[index - 1] ?? level) > 1);
}
function cleanSnapshot(snapshot) {
  return snapshot.replace(/^--- AGENT_BROWSER_PAGE_CONTENT[^\n]*---$/gm, "").replace(/^--- END_AGENT_BROWSER_PAGE_CONTENT[^\n]*---$/gm, "").trim();
}
function countMatches(value, pattern) {
  return Array.from(value.matchAll(pattern)).length;
}
function uniqueMatches(value, pattern) {
  return [...new Set(Array.from(value.matchAll(pattern), (match) => match[0].toLowerCase()))];
}
function uniqueNumbers(values) {
  return [...new Set(values)];
}
function clamp(value) {
  return Math.max(0, Math.min(1, value));
}
function statusFor(score) {
  if (score >= 0.85) {
    return ESmartAgentStatus.PASS;
  }
  if (score >= 0.45) {
    return ESmartAgentStatus.WARN;
  }
  return ESmartAgentStatus.FAIL;
}
// packages/scanner/src/smart-agent/run.ts
async function runSmartAgentAudit(url, executor) {
  const startedAt = new Date;
  let opened = false;
  try {
    opened = true;
    await execute(executor, ["open", url, "--json"]);
    const titleResult = await execute(executor, ["get", "title", "--json"]);
    const urlResult = await execute(executor, ["get", "url", "--json"]);
    const snapshotResult = await execute(executor, ["snapshot", "--json"]);
    const interactiveResult = await execute(executor, ["snapshot", "-i", "-c", "--json"]);
    const versionResult = await executor.run(["--version"]);
    const snapshotEnvelope = parseEnvelope(snapshotResult.stdout, "snapshot");
    const interactiveEnvelope = parseEnvelope(interactiveResult.stdout, "interactive snapshot");
    const observation = {
      requestedUrl: url,
      finalUrl: readString(parseEnvelope(urlResult.stdout, "url").data, "url") ?? url,
      title: readString(parseEnvelope(titleResult.stdout, "title").data, "title") ?? "",
      snapshot: readString(snapshotEnvelope.data, "snapshot") ?? "",
      interactiveSnapshot: readString(interactiveEnvelope.data, "snapshot") ?? "",
      refs: readRefs(interactiveEnvelope.data?.refs)
    };
    if (observation.snapshot.trim().length === 0) {
      throw new Error("agent-browser returned an empty accessibility snapshot");
    }
    return analyzeSmartAgentObservation(observation, executor.name, startedAt, parseVersion(versionResult));
  } finally {
    if (opened) {
      await executor.run(["close"]).catch(() => {
        return;
      });
    }
  }
}
async function execute(executor, args) {
  const result = await executor.run(args);
  if (result.exitCode !== 0) {
    const reason = result.stderr.trim() || result.stdout.trim() || "unknown agent-browser error";
    throw new Error(`agent-browser ${args[0] ?? "command"} failed: ${reason.slice(0, 500)}`);
  }
  return result;
}
function parseEnvelope(value, label) {
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("not an object");
    }
    const envelope = parsed;
    if (envelope.success === false) {
      throw new Error("command reported failure");
    }
    return envelope;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`invalid ${label} JSON from agent-browser: ${reason}`, { cause: error });
  }
}
function readString(data, key) {
  const value = data?.[key];
  return typeof value === "string" ? value : null;
}
function readRefs(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {};
  }
  const refs = {};
  for (const [key, raw] of Object.entries(value)) {
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
      continue;
    }
    const role = "role" in raw && typeof raw.role === "string" ? raw.role : "";
    const name = "name" in raw && typeof raw.name === "string" ? raw.name : "";
    refs[key] = { role, name };
  }
  return refs;
}
function parseVersion(result) {
  if (result.exitCode !== 0) {
    return null;
  }
  const match = `${result.stdout}
${result.stderr}`.match(/\d+\.\d+\.\d+/);
  return match?.[0] ?? null;
}
// apps/cli/src/ansi.ts
var CSI2 = "\x1B[";
function colorEnabled() {
  if (process.env.NO_COLOR !== undefined && process.env.NO_COLOR !== "") {
    return false;
  }
  const force = process.env.FORCE_COLOR;
  if (force !== undefined) {
    return force !== "0" && force !== "false" && force !== "";
  }
  return process.stdout.isTTY === true;
}
function wrap(open, close) {
  return (text) => {
    if (!colorEnabled()) {
      return text;
    }
    return `${CSI2}${open}m${text}${CSI2}${close}m`;
  };
}
var reset = `${CSI2}0m`;
var bold = wrap(1, 22);
var dim = wrap(2, 22);
var italic = wrap(3, 23);
var underline = wrap(4, 24);
var red = wrap(31, 39);
var green = wrap(32, 39);
var yellow = wrap(33, 39);
var blue = wrap(34, 39);
var magenta = wrap(35, 39);
var cyan = wrap(36, 39);
var gray = wrap(90, 39);
var white = wrap(97, 39);
function accent(text) {
  if (!colorEnabled()) {
    return text;
  }
  const colorterm = process.env.COLORTERM ?? "";
  if (colorterm.includes("truecolor") || colorterm.includes("24bit")) {
    return `${CSI2}38;2;184;245;61m${text}${CSI2}39m`;
  }
  return `${CSI2}92m${text}${CSI2}39m`;
}
var bgGreen = wrap(42, 49);
var bgYellow = wrap(43, 49);
var bgRed = wrap(41, 49);
var bgCyan = wrap(46, 49);
var eraseLine = `${CSI2}K`;

// apps/cli/src/render.ts
var WIDTH = 72;
var BAR_WIDTH = 40;
var MINI_BAR_WIDTH = 10;
function renderReport(report) {
  const lines = [];
  lines.push("");
  lines.push(...header("Agent Readability", "AI readiness report", displayUrl(report.finalUrl || report.url), report.finishedAt));
  lines.push("");
  lines.push(...scoreBlock(report.overall, report.grade));
  lines.push("");
  lines.push(...categoryTable(report.categories));
  lines.push("");
  lines.push(...findings(report.checks));
  lines.push("");
  lines.push(...footer(report));
  lines.push("");
  return lines.join(`
`);
}
function renderSiteReport(site) {
  const total = site.pages.length + 1;
  const lines = [];
  lines.push("");
  lines.push(...header("Agent Readability", "AI readiness report", wildcardUrl(displayUrl(site.primary.finalUrl || site.url)), site.finishedAt));
  lines.push("");
  lines.push(...scoreBlock(site.overall, site.grade));
  lines.push("");
  lines.push(...categoryTable(site.categories));
  lines.push("");
  lines.push(...clustersTable(site));
  lines.push("");
  lines.push(...siteFindings(site, total));
  lines.push("");
  lines.push(...pagesTable(site, total));
  lines.push("");
  lines.push(...siteFooter(site, total));
  lines.push("");
  return lines.join(`
`);
}
function renderSmartAgentReport(report) {
  const paint = scoreColor(report.overall);
  const smartFindings = report.signals.filter((signal2) => signal2.status !== "pass");
  const lines = [
    "",
    ...header("Smart Agent Readability", "browser-capable agent", displayUrl(report.finalUrl || report.url), report.finishedAt),
    `  ${paint(bold(String(report.overall)))}${dim("/100")}   ${paint(bold(report.grade.toUpperCase()))}`,
    `  ${scoreBar(report.overall, paint)}`,
    "",
    ...report.categories.map((category) => {
      const categoryPaint = scoreColor(category.score);
      return `  ${miniBar(category.score, categoryPaint)}  ${categoryPaint(String(category.score).padStart(3))}  ${gray(category.label)}`;
    }),
    "",
    dim("SMART AGENT FINDINGS"),
    ""
  ];
  if (smartFindings.length === 0) {
    lines.push(`  ${green("✓")} ${dim("No browser-agent readability issues detected.")}`);
  } else {
    for (const item of smartFindings) {
      const marker = item.status === "fail" ? red("✗") : yellow("▲");
      lines.push(`  ${marker} ${bold(item.title)} ${dim("—")} ${item.detail}`);
      if (item.fix !== undefined) {
        lines.push(`     ${dim(`→ ${item.fix}`)}`);
      }
    }
  }
  lines.push("");
  lines.push(dim(`  Smart Agent View: ${report.agentView.interactiveElements.length} interactive elements · ${report.meta.provider}`));
  lines.push(dim("  powered by agent-browser — an open-source Vercel Labs project"));
  lines.push("");
  return lines.join(`
`);
}
function renderSmartAgentSiteReport(site) {
  const total = site.pages.length + 1;
  const paint = scoreColor(site.overall);
  const lines = [
    "",
    ...header("Smart Agent Readability", "browser-capable agent", wildcardUrl(displayUrl(site.primary.finalUrl || site.url)), site.finishedAt),
    `  ${paint(bold(String(site.overall)))}${dim("/100")}   ${paint(bold(site.grade.toUpperCase()))}`,
    `  ${scoreBar(site.overall, paint)}`,
    "",
    ...site.categories.map((category) => {
      const categoryPaint = scoreColor(category.score);
      return `  ${miniBar(category.score, categoryPaint)}  ${categoryPaint(String(category.score).padStart(3))}  ${gray(category.label)}`;
    }),
    "",
    dim(`SMART AGENT — ${total} pages`),
    "",
    ...[site.primary, ...site.pages].map((page) => {
      const pagePaint = scoreColor(page.overall);
      return `  ${pagePaint(String(page.overall).padStart(3))}  ${gray(displayUrl(page.finalUrl))}`;
    }),
    "",
    dim("  powered by agent-browser — an open-source Vercel Labs project"),
    ""
  ];
  return lines.join(`
`);
}
function renderSmartAgentUnavailable(reason) {
  return [
    "",
    `${accent("◆")} ${bold("Smart Agent Readability")}`,
    rule(),
    `  ${yellow("unavailable")} ${dim("—")} ${reason}`,
    `  ${dim("Install: npm install -g agent-browser && agent-browser install")}`,
    ""
  ].join(`
`);
}
function header(title, descriptor, url, finishedAt) {
  const heading = `${accent("◆")} ${bold(title)} ${dim(`— ${descriptor}`)}`;
  return [heading, `${white(url)}  ${dim("·")}  ${dim(formatDate(finishedAt))}`, rule()];
}
function scoreBlock(overall, grade) {
  const paint = gradeColor(grade);
  const big = bold(paint(String(overall)));
  const outOf = dim("/100");
  const word = paint(bold(grade.toUpperCase()));
  const bar = scoreBar(overall, paint);
  return [`  ${big}${outOf}   ${word}`, `  ${bar}`];
}
function scoreBar(score, paint) {
  const filled = Math.round(clamp2(score) / 100 * BAR_WIDTH);
  const full = paint("█".repeat(filled));
  const empty = dim("░".repeat(BAR_WIDTH - filled));
  return `${full}${empty}`;
}
function categoryTable(categories) {
  const labelWidth = Math.max(...categories.map((cat) => cat.label.length));
  return categories.map((cat) => {
    const paint = scoreColor(cat.score);
    const bar = miniBar(cat.score, paint);
    const label = cat.label.padEnd(labelWidth);
    return `  ${bar}  ${paint(String(cat.score).padStart(3))}  ${gray(label)}`;
  });
}
function miniBar(score, paint) {
  const filled = Math.round(clamp2(score) / 100 * MINI_BAR_WIDTH);
  const full = paint("▰".repeat(filled));
  const empty = dim("▱".repeat(MINI_BAR_WIDTH - filled));
  return `${full}${empty}`;
}
function findings(checks) {
  const fails = checks.filter((r2) => r2.status === EStatus.FAIL || r2.status === EStatus.ERROR);
  const warns = checks.filter((r2) => r2.status === EStatus.WARN);
  const infos = checks.filter((r2) => r2.status === EStatus.INFO);
  const lines = [dim("FINDINGS"), ""];
  if (fails.length === 0 && warns.length === 0) {
    lines.push(`  ${green("✓")} ${dim("No blocking issues — looking sharp.")}`);
  }
  for (const r2 of fails) {
    lines.push(...finding(r2, red("✗")));
  }
  for (const r2 of warns) {
    lines.push(...finding(r2, yellow("▲")));
  }
  if (infos.length > 0) {
    lines.push("");
    const noun = infos.length === 1 ? "note" : "notes";
    lines.push(dim(`  ${infos.length} informational ${noun} — run with --json for details`));
  }
  return lines;
}
function finding(r2, marker) {
  const out = [`  ${marker} ${bold(r2.id)} ${dim("—")} ${r2.detail}`];
  if (r2.fix !== undefined && r2.fix !== "") {
    out.push(`     ${dim(`→ ${r2.fix}`)}`);
  }
  return out;
}
function footer(report) {
  const passed = count(report.checks, EStatus.PASS);
  const warnings = count(report.checks, EStatus.WARN);
  const failed = count(report.checks, EStatus.FAIL) + count(report.checks, EStatus.ERROR);
  const summary = [
    `${green("passed")} ${bold(String(passed))}`,
    `${yellow("warnings")} ${bold(String(warnings))}`,
    `${red("failed")} ${bold(String(failed))}`,
    dim(`scanned in ${report.meta.durationMs} ms`)
  ].join(dim("  ·  "));
  return [rule(), `  ${summary}`, dim("  https://isready.ai — full report & monitoring")];
}
function clusterPattern(representativeUrl) {
  return templateKey(representativeUrl).replace(/:[a-z]+/g, "*");
}
function clustersTable(site) {
  const totalFound = site.clusters.reduce((sum, cluster) => sum + cluster.pageCount, 0);
  const totalScanned = site.clusters.reduce((sum, cluster) => sum + cluster.scannedCount, 0);
  const title = dim(`TEMPLATES — ${site.clusters.length} template${site.clusters.length !== 1 ? "s" : ""} · ${totalFound} found · ${totalScanned} scanned`);
  const lines = [title, ""];
  for (const cluster of site.clusters) {
    const paint = scoreColor(cluster.avgScore);
    const pattern = clusterPattern(cluster.representativeUrl);
    const counts = dim(cluster.scannedCount < cluster.pageCount ? `${cluster.pageCount} found · ${cluster.scannedCount} scanned` : `${cluster.pageCount} page${cluster.pageCount !== 1 ? "s" : ""}`);
    lines.push(`  ${miniBar(cluster.avgScore, paint)}  ${paint(String(cluster.avgScore).padStart(3))}  ${gray(pattern)}  ${counts}`);
  }
  return lines;
}
function siteFindings(site, total) {
  const groups = aggregateSiteFindings(site);
  const lines = [dim(`FINDINGS — across ${total} pages`), ""];
  if (groups.length === 0) {
    lines.push(`  ${green("✓")} ${dim("No blocking issues on any page — looking sharp.")}`);
    return lines;
  }
  for (const group of groups) {
    const failed = group.result.status === EStatus.FAIL;
    const marker = failed ? red("✗") : yellow("▲");
    lines.push(`  ${marker} ${bold(group.result.id)} ${dim(`[${group.pages.length}/${total} pages]`)} ${dim("—")} ${group.result.detail}`);
    if (group.result.fix !== undefined && group.result.fix !== "") {
      lines.push(`     ${dim(`→ ${group.result.fix}`)}`);
    }
  }
  const infos = site.primary.checks.filter((r2) => r2.status === EStatus.INFO).length;
  if (infos > 0) {
    lines.push("");
    lines.push(dim(`  ${infos} informational notes — run with --json for details`));
  }
  return lines;
}
function pagesTable(site, total) {
  const summary = `${total} pages scanned${site.discovered > site.pages.length ? dim(`  ·  ${site.discovered} discovered`) : ""}`;
  const lines = [dim("PAGES — ") + summary, ""];
  for (const page of [site.primary, ...site.pages]) {
    const paint = scoreColor(page.overall);
    const failed = page.checks.filter((r2) => r2.status === EStatus.FAIL).length;
    const issues = failed > 0 ? red(`✗ ${failed}`) : green("✓");
    lines.push(`  ${miniBar(page.overall, paint)}  ${paint(String(page.overall).padStart(3))}  ${issues.padEnd(6)} ${gray(displayPath(page.finalUrl))}`);
  }
  return lines;
}
function siteFooter(site, total) {
  const checks = [site.primary, ...site.pages].flatMap((page) => page.checks);
  const passed = count(checks, EStatus.PASS);
  const warnings = count(checks, EStatus.WARN);
  const failed = count(checks, EStatus.FAIL) + count(checks, EStatus.ERROR);
  const durationMs = Math.max(0, new Date(site.finishedAt).getTime() - new Date(site.startedAt).getTime());
  const summary = [
    `${green("passed")} ${bold(String(passed))}`,
    `${yellow("warnings")} ${bold(String(warnings))}`,
    `${red("failed")} ${bold(String(failed))}`,
    dim(`${total} pages in ${durationMs} ms`)
  ].join(dim("  ·  "));
  return [rule(), `  ${summary}`, dim("  https://isready.ai — full report & monitoring")];
}
function wildcardUrl(url) {
  return url.endsWith("/") ? `${url}*` : `${url}/*`;
}
function displayPath(url) {
  try {
    const parsed = new URL(url);
    const path = `${parsed.pathname}${parsed.search}`;
    return path === "/" ? parsed.host : path;
  } catch {
    return url;
  }
}
function withGutter(text) {
  return text.split(`
`).map((line) => line.length === 0 ? gray("│") : `${gray("│")}  ${line}`).join(`
`);
}
function rule() {
  return dim("─".repeat(WIDTH));
}
var GRADE_PAINT = {
  [EGrade.EXCELLENT]: green,
  [EGrade.GOOD]: cyan,
  [EGrade.MODERATE]: yellow,
  [EGrade.POOR]: red
};
function gradeColor(grade) {
  return GRADE_PAINT[grade];
}
function scoreColor(score) {
  if (score >= 90) {
    return green;
  }
  if (score >= 75) {
    return cyan;
  }
  if (score >= 50) {
    return yellow;
  }
  return red;
}
function count(checks, status) {
  return checks.filter((r2) => r2.status === status).length;
}
function clamp2(n2) {
  return Math.max(0, Math.min(100, n2));
}
function displayUrl(url) {
  return url.replace(/\/$/, "");
}
function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  return d.toISOString().slice(0, 10);
}

// apps/cli/src/smart-agent.ts
import { spawn } from "node:child_process";
var COMMAND_TIMEOUT_MS = 90000;
var MAX_OUTPUT = 16000000;

class CliAgentBrowserExecutor {
  name = "agent-browser local";
  executable = process.env.AGENT_BROWSER_EXECUTABLE ?? "agent-browser";
  session = `isready-${crypto.randomUUID()}`;
  run(args) {
    const childEnv = { ...process.env };
    delete childEnv.AGENT_BROWSER_PROVIDER;
    return new Promise((resolve, reject) => {
      const child = spawn(this.executable, ["--session", this.session, "--content-boundaries", "--max-output", "50000", ...args], {
        env: childEnv,
        stdio: ["ignore", "pipe", "pipe"]
      });
      let stdout2 = "";
      let stderr = "";
      let settled = false;
      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        finish(() => reject(new Error(`agent-browser timed out after ${COMMAND_TIMEOUT_MS} ms`)));
      }, COMMAND_TIMEOUT_MS);
      child.stdout.on("data", (chunk) => {
        stdout2 = appendBounded(stdout2, chunk.toString());
      });
      child.stderr.on("data", (chunk) => {
        stderr = appendBounded(stderr, chunk.toString());
      });
      child.on("error", (error) => {
        finish(() => reject(error));
      });
      child.on("close", (exitCode) => {
        finish(() => resolve({ exitCode: exitCode ?? 1, stdout: stdout2, stderr }));
      });
      function finish(action) {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        action();
      }
    });
  }
}
function appendBounded(current, addition) {
  if (current.length >= MAX_OUTPUT) {
    return current;
  }
  return `${current}${addition}`.slice(0, MAX_OUTPUT);
}

// apps/cli/src/ansi.ts
var CSI3 = "\x1B[";
function colorEnabled2() {
  if (process.env.NO_COLOR !== undefined && process.env.NO_COLOR !== "") {
    return false;
  }
  const force = process.env.FORCE_COLOR;
  if (force !== undefined) {
    return force !== "0" && force !== "false" && force !== "";
  }
  return process.stdout.isTTY === true;
}
function wrap2(open, close) {
  return (text) => {
    if (!colorEnabled2()) {
      return text;
    }
    return `${CSI3}${open}m${text}${CSI3}${close}m`;
  };
}
var reset2 = `${CSI3}0m`;
var bold2 = wrap2(1, 22);
var dim2 = wrap2(2, 22);
var italic2 = wrap2(3, 23);
var underline2 = wrap2(4, 24);
var red2 = wrap2(31, 39);
var green2 = wrap2(32, 39);
var yellow2 = wrap2(33, 39);
var blue2 = wrap2(34, 39);
var magenta2 = wrap2(35, 39);
var cyan2 = wrap2(36, 39);
var gray2 = wrap2(90, 39);
var white2 = wrap2(97, 39);
function accent2(text) {
  if (!colorEnabled2()) {
    return text;
  }
  const colorterm = process.env.COLORTERM ?? "";
  if (colorterm.includes("truecolor") || colorterm.includes("24bit")) {
    return `${CSI3}38;2;184;245;61m${text}${CSI3}39m`;
  }
  return `${CSI3}92m${text}${CSI3}39m`;
}
var bgGreen2 = wrap2(42, 49);
var bgYellow2 = wrap2(43, 49);
var bgRed2 = wrap2(41, 49);
var bgCyan2 = wrap2(46, 49);
var eraseLine2 = `${CSI3}K`;

// apps/cli/src/index.ts
var VERSION = "0.1.0";
var PASS_THRESHOLD = 50;
await main();
async function main() {
  const flags = parseArgs(process.argv.slice(2));
  if (flags.help) {
    process.stdout.write(helpText());
    process.exit(0);
  }
  if (flags.version) {
    process.stdout.write(`${VERSION}
`);
    process.exit(0);
  }
  if (flags.url === undefined) {
    process.stderr.write(`${red2("error")} missing <url>

`);
    process.stderr.write(helpText());
    process.exit(2);
  }
  const fancy = !flags.json && !flags.md && !flags.llm && !flags.quiet && process.stdout.isTTY === true;
  const spinner2 = fancy ? createClackSpinner(flags.url) : createSpinner();
  try {
    let report;
    let site = null;
    let smartReport = null;
    let smartSite = null;
    let smartError = null;
    if (flags.deep) {
      site = await scanSite(flags.url, {
        checks: allChecks,
        limit: flags.limit ?? Number.POSITIVE_INFINITY,
        skip: flags.skip,
        onProgress: (message) => spinner2.tick(message)
      });
      report = site.primary;
    } else {
      report = await scan(flags.url, {
        checks: allChecks,
        onProgress: (message) => spinner2.tick(message)
      });
    }
    if (report.meta.fetchOk === false) {
      const reason = report.meta.error ?? "site unreachable";
      spinner2.fail(`could not scan ${flags.url} \u2014 ${reason}`);
      process.exit(1);
    }
    const overall = site !== null ? site.overall : report.overall;
    const grade = site !== null ? site.grade : report.grade;
    const baseLabel = `Agent Readability ${overall}/100 \u2014 ${grade.toUpperCase()}`;
    const renderHuman = !flags.json && !flags.md && !flags.llm && !flags.quiet;
    const decorate = fancy ? withGutter : (text) => text;
    const emit = (text) => {
      if (text !== "") {
        process.stdout.write(`${decorate(text)}
`);
      }
    };
    const runSmartAudit = async () => {
      const executor = new CliAgentBrowserExecutor;
      const targetUrls = site !== null ? site.clusters.map((cluster) => cluster.representativeUrl) : [report.finalUrl];
      try {
        const reports = [];
        for (const [index, url] of targetUrls.entries()) {
          const validated = validateScanInput(url);
          if (!validated.ok) {
            throw new Error(`Smart Agent navigation rejected: ${validated.problem}`);
          }
          spinner2.tick(targetUrls.length > 1 ? `Smart Agent ${index + 1}/${targetUrls.length}: ${url}` : "Rendering Smart Agent View with agent-browser");
          reports.push(await runSmartAgentAudit(validated.url, executor));
        }
        smartReport = reports[0] ?? null;
        if (reports.length > 1 && reports[0] !== undefined) {
          smartSite = aggregateSmartReports(reports[0], reports.slice(1));
        }
      } catch (error) {
        smartError = error instanceof Error ? error.message : String(error);
      }
    };
    const smartLabel = () => {
      const smart = smartSite ?? smartReport;
      return smart !== null ? `Smart Agent Readability ${smart.overall}/100 \u2014 ${smart.grade.toUpperCase()}` : "Smart Agent Readability unavailable";
    };
    const smartSection = () => smartSite !== null ? renderSmartAgentSiteReport(smartSite) : smartReport !== null ? renderSmartAgentReport(smartReport) : smartError !== null ? renderSmartAgentUnavailable(shortError(smartError)) : "";
    if (renderHuman) {
      const baseText = site !== null ? renderSiteReport(site) : renderReport(report);
      spinner2.stop(baseLabel);
      emit(baseText);
      if (flags.smart) {
        spinner2.open("Rendering Smart Agent View with agent-browser");
        await runSmartAudit();
        spinner2.stop(smartLabel());
        emit(smartSection());
      }
      if (fancy) {
        outro(dim2("full report & monitoring \u2192 https://isready.ai"));
      }
    } else {
      if (flags.smart) {
        spinner2.phase(baseLabel);
        await runSmartAudit();
        spinner2.stop(smartLabel());
      } else {
        spinner2.stop(baseLabel);
      }
      if (flags.json) {
        process.stdout.write(`${JSON.stringify({
          ...site ?? report,
          ...flags.smart ? { smartAgent: smartSite ?? smartReport, smartAgentError: smartError } : {}
        }, null, 2)}
`);
      } else if (flags.llm) {
        process.stdout.write(`${reportToMarkdown(site ?? report, "llm")}${smartMarkdown(smartReport, smartError)}
`);
      } else if (flags.md) {
        process.stdout.write(`${reportToMarkdown(site ?? report, "human")}${smartMarkdown(smartReport, smartError)}
`);
      } else if (flags.quiet) {
        process.stdout.write(`${quietLine(overall, site !== null ? site.grade : report.grade)}${smartQuiet(smartReport, smartError)}
`);
      }
    }
    await sendTelemetry({
      host: hostOf(report.finalUrl),
      score: overall,
      deep: flags.deep,
      smart: smartSite !== null || smartReport !== null
    });
    process.exit(overall >= PASS_THRESHOLD ? 0 : 1);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    spinner2.fail(`scan failed \u2014 ${message}`);
    process.exit(1);
  }
}
function parseArgs(argv) {
  const flags = {
    json: false,
    md: false,
    llm: false,
    quiet: false,
    deep: false,
    smart: false,
    limit: undefined,
    skip: undefined,
    help: false,
    version: false,
    url: undefined
  };
  for (let i2 = 0;i2 < argv.length; i2++) {
    const arg = argv[i2] ?? "";
    switch (arg) {
      case "--json":
        flags.json = true;
        break;
      case "--md":
        flags.md = true;
        break;
      case "--llm":
        flags.llm = true;
        break;
      case "--quiet":
      case "-q":
        flags.quiet = true;
        break;
      case "--deep":
        flags.deep = true;
        break;
      case "--smart-ai":
        flags.smart = true;
        break;
      case "--limit": {
        const value = Number(argv[i2 + 1]);
        if (Number.isFinite(value) && value >= 0) {
          flags.limit = Math.floor(value);
          i2++;
        }
        break;
      }
      case "--skip": {
        const value = Number(argv[i2 + 1]);
        if (Number.isFinite(value) && value >= 0) {
          flags.skip = Math.floor(value);
          i2++;
        }
        break;
      }
      case "--help":
      case "-h":
        flags.help = true;
        break;
      case "--version":
      case "-v":
        flags.version = true;
        break;
      default:
        if (arg.startsWith("--limit=")) {
          const value = Number(arg.slice("--limit=".length));
          if (Number.isFinite(value) && value >= 0) {
            flags.limit = Math.floor(value);
          }
        } else if (arg.startsWith("--skip=")) {
          const value = Number(arg.slice("--skip=".length));
          if (Number.isFinite(value) && value >= 0) {
            flags.skip = Math.floor(value);
          }
        } else if (!arg.startsWith("-") && flags.url === undefined) {
          flags.url = arg;
        }
        break;
    }
  }
  return flags;
}
async function sendTelemetry(payload) {
  if (process.env.TELEMETRY === "false") {
    return;
  }
  if ((process.env.ISREADYAI_API_KEY ?? "").length > 0) {
    return;
  }
  const apiUrl = process.env.ISREADYAI_API_URL ?? "https://isready.ai";
  try {
    await fetch(`${apiUrl}/api/telemetry`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ source: "cli", ...payload }),
      signal: AbortSignal.timeout(1500)
    });
  } catch {}
}
function quietLine(overall, grade) {
  const paint = scoreColor(overall);
  return `${paint(bold2(String(overall)))}${dim2("/100")} ${paint(grade)}`;
}
function smartQuiet(report, error) {
  if (report !== null) {
    const paint = scoreColor(report.overall);
    return ` ${dim2("\xB7 Smart")} ${paint(bold2(String(report.overall)))}${dim2("/100")}`;
  }
  return error !== null ? ` ${dim2("\xB7 Smart unavailable")}` : "";
}
function smartMarkdown(report, error) {
  if (report === null) {
    return error === null ? "" : `

## Smart Agent Readability

Unavailable: ${shortError(error)}
`;
  }
  const findings2 = report.signals.filter((signal2) => signal2.status !== "pass");
  const lines = [
    "",
    "",
    "## Smart Agent Readability",
    "",
    `**${report.overall}/100 \u2014 ${report.grade.toUpperCase()}**`,
    "",
    ...report.categories.map((category) => `- ${category.label}: ${category.score}/100`),
    "",
    "### Smart Agent findings",
    "",
    ...findings2.length === 0 ? ["- No browser-agent readability issues detected."] : findings2.map((finding2) => `- **${finding2.title}**: ${finding2.detail}${finding2.fix !== undefined ? ` Fix: ${finding2.fix}` : ""}`),
    "",
    "Powered by [agent-browser](https://agent-browser.dev), an open-source Vercel Labs project."
  ];
  return lines.join(`
`);
}
function shortError(error) {
  return error.replace(/\s+/g, " ").slice(0, 220);
}
function createClackSpinner(url) {
  intro(`${accent2("\u25C6")} ${bold2("isready")} ${dim2(`v${VERSION}`)}`);
  log.step(`Scanning ${bold2(url)}`);
  let s = spinner();
  s.start(`Scanning ${url}`);
  return {
    tick(message) {
      s.message(message);
    },
    phase(message) {
      s.stop(`${green2("\u2713")} ${message}`);
      s = spinner();
      s.start("Working\u2026");
    },
    open(message) {
      s = spinner();
      s.start(message);
    },
    stop(message) {
      s.stop(`${green2("\u2713")} ${message}`);
    },
    fail(message) {
      s.stop(`${red2("\u2717")} ${message}`);
      outro(dim2("https://isready.ai"));
    }
  };
}
function createSpinner() {
  const frames = ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"];
  const isTty = process.stderr.isTTY === true;
  let i2 = 0;
  let timer;
  let current = "Starting";
  const draw = () => {
    const frame = frames[i2 % frames.length] ?? frames[0];
    process.stderr.write(`\r${accent2(frame ?? "\xB7")} ${dim2(current)}${eraseLine2}`);
    i2 += 1;
  };
  if (isTty) {
    timer = setInterval(draw, 80);
  }
  return {
    tick(message) {
      current = message;
      if (!isTty) {
        process.stderr.write(`${dim2("\xB7")} ${dim2(message)}
`);
      }
    },
    phase(message) {
      if (isTty) {
        process.stderr.write(`\r${eraseLine2}`);
      }
      process.stderr.write(`${green2("\u2713")} ${message}
`);
    },
    open(message) {
      current = message;
      if (isTty) {
        if (timer !== undefined) {
          clearInterval(timer);
        }
        i2 = 0;
        timer = setInterval(draw, 80);
      } else {
        process.stderr.write(`${dim2("\xB7")} ${dim2(message)}
`);
      }
    },
    stop(message) {
      if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
      if (isTty) {
        process.stderr.write(`\r${eraseLine2}`);
      }
      process.stderr.write(`${green2("\u2713")} ${message}
`);
    },
    fail(message) {
      if (timer !== undefined) {
        clearInterval(timer);
      }
      if (isTty) {
        process.stderr.write(`\r${eraseLine2}`);
      }
      process.stderr.write(`${red2("\u2717")} ${message}
`);
    }
  };
}
function helpText() {
  const b2 = bold2;
  return [
    `${accent2("\u25C6")} ${b2("isready")} ${dim2(`v${VERSION}`)}`,
    dim2("Check if your website is ready for AI \u2014 LLM crawlability & AI-SEO audit."),
    "",
    `${b2("USAGE")}`,
    `  isreadyai <url> [options]`,
    "",
    `${b2("OPTIONS")}`,
    `  --json        Print the raw IScanReport as JSON (no decoration)`,
    `  --md          Print the report as human-readable Markdown`,
    `  --llm         Print an AI-agent fix plan (paste into Claude Code/Cursor)`,
    `  --quiet, -q   Print only the final score line`,
    `  --deep        Crawl the site too: sitemap + links, page checks on each page`,
    `  --smart-ai    Add Smart Agent Readability using local agent-browser`,
    `  --limit <n>   Max pages for --deep (default: unlimited)`,
    `  --skip <n>    Skip the first n discovered pages (with --deep)`,
    `  --help, -h    Show this help`,
    `  --version, -v Show the version`,
    "",
    `${b2("EXAMPLES")}`,
    `  ${dim2("$")} isreadyai example.com`,
    `  ${dim2("$")} isreadyai https://example.com --json | jq .overall`,
    `  ${dim2("$")} isreadyai example.com --quiet`,
    `  ${dim2("$")} isreadyai example.com --smart-ai`,
    "",
    dim2("Exit code: 0 when score >= 50, 1 when below or scan failed, 2 on misuse."),
    dim2("https://isready.ai"),
    ""
  ].join(`
`);
}
