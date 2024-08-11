/// <reference types="bun-types" />
export declare class AnsieBuffer {
    _chunks: (Uint8Array | string)[];
    write(c: Uint8Array | string): Promise<void>;
    encode(encoder: TextEncoder): Uint8Array;
    asText({ binaryEncoder }?: {
        binaryEncoder?: (encoder: Uint8Array) => void;
    }): string;
}
