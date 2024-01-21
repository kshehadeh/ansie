
export class RawTextMutator {
    _str: string;

    static EmojiMap: Record<string, string> = {
        ":exclamation:": "❗",
        ":warning:": "⚠️",
        ":no_entry:": "⛔",
        ":heavy_check_mark:": "✔️",
        ":x:": "❌",
        ":bangbang:": "‼️",
        ":triangular_flag_on_post:": "🚩",
        ":fire:": "🔥",
        ":sos:": "🆘",
        ":lock:": "🔒",
        ":key:": "🔑",
        ":heart:": "❤️",
        ":broken_heart:": "💔",
        ":skull_and_crossbones:": "☠️",
        ":grin:": "😁",
        ":joy:": "😂",
        ":heart_eyes:": "😍",
        ":smirk:": "😏",
        ":sunglasses:": "😎",
        ":thumbsup:": "👍",
        ":thumbsdown:": "👎",
        ":clap:": "👏",
        ":pray:": "🙏",
        ":cry:": "😢",
        ":sob:": "😭",
        ":rocket:": "🚀",
        ":sunny:": "☀️",
        ":umbrella:": "☔",
        ":camera:": "📷",
        ":book:": "📖",
        ":moneybag:": "💰",
        ":gift:": "🎁",
        ":bell:": "🔔",
        ":hammer:": "🔨",
        ":thumbsup::skin-tone-2:": "👍🏻",
        ":thumbsup::skin-tone-3:": "👍🏼",
        ":thumbsup::skin-tone-4:": "👍🏽",
        ":thumbsup::skin-tone-5:": "👍🏾",
        ":thumbsup::skin-tone-6:": "👍🏿"    
    }
    
    constructor(str: string) {
        this._str = str;
    }

    get str(): string {
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

    trimSpaces(options: { left: boolean, right: boolean, allowNewLines: boolean, replaceWithSingleSpace: boolean }) {
        // Construct a regex pattern based on the options
        const whiteSpacePattern = options.allowNewLines ? '[ \\t\\v\\v]' : '\\s';
        const leftPattern = options.left ? `^${whiteSpacePattern}+` : '';
        const rightPattern = options.right ? `${whiteSpacePattern}+$` : '';
        const pattern = new RegExp(`${leftPattern}|${rightPattern}`, 'g');
        this._str = this._str.replace(pattern, options.replaceWithSingleSpace ? ' ' : '');
        return this;
    }

    toString() {
        return this._str;    
    }
}