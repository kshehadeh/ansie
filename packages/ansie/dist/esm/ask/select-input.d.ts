/**
 * Ask the user to select an option from a list
 * @param prompt
 * @param options
 * @returns {Promise<{choice: string, index: number}>}
 */
export default function selectInput(choices: string[], defaultChoice?: string): Promise<{
    choice: string;
    index: number;
}>;
