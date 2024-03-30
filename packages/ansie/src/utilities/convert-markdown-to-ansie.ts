export function convertMarkdownToAnsie(input: string) {
    // Unified regex for bold, italics, and color. Headers are handled separately.
    const regex = /\*\*(.*?)\*\*|\*(.*?)\*|\[c=(.*?)\](.*?)\[\/c\]/g;

    // Replace bold, italics, and color with their respective ANSIE escape codes
    const translated = input.replace(
        regex,
        (match, boldText, italicText, color, colorText) => {
            if (boldText !== undefined) {
                return `<span bold>${boldText}</span>`;
            } else if (italicText !== undefined) {
                return `<span italics>${italicText}</span>`;
            } else if (color !== undefined) {
                return `<span fg="${color}">${colorText}</span>`;
            }
            return match; // Fallback, should never reach here.
        }
    );

    // Handle headers as a special case, due to the need for multiline matching
    return translated
        .split('\n')
        .map(line => line.trim()) // Remove leading/trailing whitespace
        .filter(line => line.length > 0) // Remove empty lines
        .map(line => {
            if (line.trim().startsWith('###')) {
                return line.replace(/^\s*###\s(.*?)$/, '<h3>$1</h3>');
            } else if (line.trim().startsWith('##')) {
                return line.replace(/^\s*##\s(.*?)$/, '<h2>$1</h2>');
            } else if (line.trim().startsWith('#')) {
                return line.replace(/^#\s(.*?)$/, '<h1>$1</h1>');
            }
            return line;
        })
        .join('\n'); // Rejoin the lines back into a single string
}
