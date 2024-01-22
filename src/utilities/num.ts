export function num(n: unknown) {
    if (typeof n === 'number') {
        return n;
    }
    if (typeof n === 'string') {
        return Number(n);
    }
    if (typeof n === 'boolean') {
        return n ? 1 : 0;
    }
    return 0;
}
