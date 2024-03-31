

export class AnsieBuffer {
    _chunks: (Uint8Array | string)[] = []


    write(c: Uint8Array | string): Promise<void> {
        this._chunks.push(c);
        return Promise.resolve();
    }

    encode(encoder: TextEncoder): Uint8Array {
        const uint8Chunks = [];
        for (const c of this._chunks) {
            if (typeof c === 'string') {
                uint8Chunks.push(encoder.encode(c))
            } else if ("BYTES_PER_ELEMENT" in c && c.BYTES_PER_ELEMENT === 1) {
                uint8Chunks.push(c)
            } else {
                throw new TypeError("expected Uint8Array or string, got " + c);
            }
        }

        const outBuffer = new Uint8Array(uint8Chunks.reduce((sum, c) => sum + c.length, 0));
        let offset = 0;
        for (const c of uint8Chunks) {
            outBuffer.set(c, offset);
            offset += c.length;
        }

        return outBuffer;
    }

    asText({ binaryEncoder }: { binaryEncoder?: (encoder: Uint8Array) => void; } = {}): string {
        let str = "";
        for (const c of this._chunks) {
            if (typeof c === 'string') {
                str += c;
            } else if ("BYTES_PER_ELEMENT" in c && c.BYTES_PER_ELEMENT === 1) {
                if (binaryEncoder) {
                    str += binaryEncoder(c);
                } else {
                    throw new Error("cannot stringify binary blob");
                }
            } else {
                throw new TypeError("expected Uint8Array or string, got " + c);
            }
        }

        return str;
    }

}