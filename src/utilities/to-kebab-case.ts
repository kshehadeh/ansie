export function toKebabCase(str: string) {
    return str
        .replace(new RegExp(/[A-Z]/, 'g'), match => '-' + match.toLowerCase()) // Insert a hyphen before uppercase letters and convert them to lowercase
        .replace(new RegExp(/[-_\s]+/, 'g'), '-') // Replace underscores, spaces, and multiple hyphens with a single hyphen
        .replace(new RegExp(/^-/, 'g'), '') // Remove leading hyphen if it exists
        .toLowerCase(); // Convert the entire string to lowercase
}
