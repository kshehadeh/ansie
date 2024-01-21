
/**
 * Returns an object that only contains the keys that have a value.
 * @param o 
 * @returns 
 */
export function opt(o?: Record<string, unknown>): Record<string, unknown> {    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.fromEntries(Object.entries(o ?? {}).filter(([_, v]) => v !== undefined));
}