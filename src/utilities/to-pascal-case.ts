export function toPascalCase(str: string) {
    return str
        .replace(new RegExp(/[-_]+/, 'g'), ' ') // Replace underscores/hyphens with spaces
        .replace(new RegExp(/[^\w\s]/, 'g'), '') // Remove all non-word characters
        .replace(
            new RegExp(/\s+(.)(\w+)/, 'g'),
            (_, $1, $2) => $1.toUpperCase() + $2.toLowerCase()
        ) // Capitalize the first letter of each word
        .replace(new RegExp(/\s/, 'g'), '') // Remove spaces
        .replace(new RegExp(/\w/), s => s.toUpperCase()); // Capitalize the first letter of the string
}
