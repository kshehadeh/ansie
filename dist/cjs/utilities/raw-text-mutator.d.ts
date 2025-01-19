export declare class RawTextMutator {
    _str: string;
    static EmojiMap: Record<string, string>;
    constructor(str: string);
    get str(): string;
    replaceEmoji(): this;
    trimSpaces(options: {
        left: boolean;
        right: boolean;
        allowNewLines: boolean;
        replaceWithSingleSpace: boolean;
    }): this;
    toString(): string;
}
