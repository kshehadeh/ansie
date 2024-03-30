import readline from 'readline';


export default function confirmInput(options?: {defaultValue?: boolean, isContinue?: boolean, trueValue?: string, falseValue?: string}): Promise<boolean> {
    const isContinue = options?.isContinue || false;
    const trueValue = options?.trueValue || 'y';
    const falseValue = options?.falseValue || 'n';
    const defaultValue = options?.defaultValue;
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
    });

    let val = false
    const keypressHandler = (_str: string, key: {name: string, ctrl: boolean}) => {
        // Handle exits
        if (key.ctrl && (key.name === 'c' || key.name === 'd' || key.name === 'z')) {
            process.exit();
        }
    }

    const dataHandler = (key: Buffer) => {
        // look for escape key

        if (isContinue) {
            if (key.at(0) === 27) {
                val = false;
                rl.close();
                return;
            }

            // Any key other than escape is considered a confirmation
            val = true;
            rl.close();
            
            // Remove entered value by sending a delete
            process.stdout.write('\u0008 \u0008')

            return;
        }

        if (key.at(0) === 13) {
            readline.moveCursor(process.stdout, 0, -1);
            // Only set the value if the user pressed enter and a
            // default value was provided
            if (typeof defaultValue !== 'undefined') {
                val = defaultValue;
                rl.close();                
            }                        
        }

        if (key.at(0) === trueValue.charCodeAt(0)) {
            val = true;
            rl.close();
        } else if (key.at(0) === falseValue.charCodeAt(0)) {
            val = false;
            rl.close();
        }

        // Remove entered value by sending a delete
        process.stdout.write('\u0008 \u0008')

    }

    process.stdin.on('data', dataHandler);
    process.stdin.on('keypress', keypressHandler);

    return new Promise<boolean>(resolve => {
        rl.on('close', () => {                        
            process.stdin.removeListener('keypress', keypressHandler);
            process.stdin.removeListener('data', dataHandler);
            resolve(val);
        })
    });
}
