export function toSnakeCase(str: string) {
    return str
        .replace(new RegExp(/[A-Z]/, 'g'), match => '_' + match.toLowerCase()) // Insert an underscore before uppercase letters and convert them to lowercase
        .replace(new RegExp(/[-\s]+/, 'g'), '_') // Replace hyphens and spaces with underscores
        .replace(new RegExp(/^_/, 'g'), '') // Remove leading underscore if it exists
        .toLowerCase(); // Convert the entire string to lowercase
}
