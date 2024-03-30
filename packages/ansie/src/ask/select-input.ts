import * as readline from 'readline';
import { type AskOptions } from './util';
import { compile } from '../compiler/compile';


/**
 * Display the options with the selection indicator
 * @param choices 
 * @param radio
 * @param selectedIndex 
 * @param previousIndex 
 */
function displayOptions(choices: string[], radio: { sel: string, unsel: string, spacing: number }, selectedIndex: number, previousIndex: number = -1): void {
    if (selectedIndex === previousIndex) return;
    
    const spacing = ' '.repeat(radio.spacing);
    if (previousIndex >= 0) {
        // Move cursor to the previous option line and clear it
        // readline.moveCursor(process.stdout, 0, previousIndex - selectedIndex);
        readline.clearLine(process.stdout, 0);
        // Rewrite the previous option without the selection indicator
        process.stdout.write(`${radio.unsel}${spacing}${choices[previousIndex]}\n`);
        // Move cursor back to the selected line
        readline.moveCursor(process.stdout, 0, selectedIndex - previousIndex - 1);
    } else {
        // Initial display of all options
        choices.forEach((c) => {
            process.stdout.write(`${radio.unsel}${spacing}${c}\n`);
        });
        // Move cursor to the first line
        readline.moveCursor(process.stdout, 0, -choices.length);
    }

    // Clear and rewrite the selected option with the selection indicator
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${radio.sel}${spacing}${choices[selectedIndex]}`);
    readline.cursorTo(process.stdout, 0);
}

/**
 * Ask the user to select an option from a list
 * @param prompt 
 * @param options 
 * @returns {Promise<{choice: string, index: number}>}
 */
export default function selectInput(options: AskOptions['typeOptions']): Promise<{choice: string, index: number}>{
    if (options.type !== 'select') {
        throw new Error('Invalid options type');
    }
    const choices = options.choices.map(c => compile(c));

    let selectedIndex = 0;
    const renderOpts = { sel: "\u{25CF}", unsel: "\u{25CB}", spacing: 2 };
    displayOptions(options.choices, renderOpts, selectedIndex);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
    });

    readline.cursorTo(process.stdout, 0);
    
    process.stdout.write('\u001B[?25l'); // Hide the cursor

    const handleKeypress = (_: string, key: readline.Key) => {
        if (!key) return;

        const previousIndex = selectedIndex;

        if (key.name === 'up' && selectedIndex > 0) {
            selectedIndex--;
        } else if (key.name === 'down' && selectedIndex < (choices.length - 1)) {
            selectedIndex++;
        } else if (key.name === 'return') {
            // Move cursor to the end of the list
            readline.moveCursor(process.stdout, 0, choices.length + 1);

            // output end of input character to close the input stream
            process.stdin.write('\u0004');
            rl.close();
            return;
        }

        displayOptions(choices, renderOpts, selectedIndex, previousIndex);
    }

    process.stdin.on('keypress', handleKeypress);
    
    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    return new Promise(resolve => {
        rl.on('close', () => {
            if (process.stdin.isTTY) process.stdin.setRawMode(false);
            process.stdin.removeListener('keypress', handleKeypress)
            process.stdout.write('\u001B[?25h'); // Show the cursor
            resolve({choice: options.choices[selectedIndex], index: selectedIndex});                        
            rl.close();            
        });
    });
}
