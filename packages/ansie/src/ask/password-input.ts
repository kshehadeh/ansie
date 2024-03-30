
import readline from 'readline';


export default function passwordInput(maskKey: string = '*') {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '',
        terminal: false
    });

    process.stdin.setRawMode(true);

    let password = '';
    process.stdin.on('keypress', (_str, key) => {
        // Handle exits
        if (key.ctrl && (key.name === 'c' || key.name === 'd' || key.name === 'z')) {
            process.exit();
        }
    });

    process.stdin.on('data', function onData(key) {
        if (key.at(0) === 13) {
            // They've finished typing their password
            process.stdin.removeListener('data', onData);
            rl.close();
        } else if (key.at(0) === 27) {
            // They've pressed the escape key
            process.exit();
        } else if (key.at(0) === 127) {
            // Remove the last character from the password
            password = password.slice(0, -1);
            readline.moveCursor(process.stdout, -1, 0);
            process.stdout.write(' ')
            readline.moveCursor(process.stdout, -1, 0);
        } else {
            // Mask password with maskKey
            password += key;
            process.stdout.write(maskKey)
        }
    });

    readline.emitKeypressEvents(process.stdin);

    return new Promise<string>(resolve => {
        rl.on('close', () => {
            process.stdin.setRawMode(false);
            resolve(password);
        });
    });
}
