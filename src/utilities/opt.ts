/**
 * Returns an object that only contains the keys that have a value.
 * @param o
 * @returns
 */
export function opt(o?: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(o ?? {}).filter(([_, v]) => v !== undefined)
    );
}
