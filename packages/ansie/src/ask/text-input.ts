import fs from 'fs';
import { spawn } from 'child_process';
import os from 'os';
import path from 'path';

import readline from 'readline';

function multilineEditor(defaultContent: string = ''): Promise<string> {
    // Generate a temporary filename that includes some random characters
    const tempFilename = `ansie-${Math.random().toString(36).substring(2)}.txt`;

    // Generate a temporary file for the user to edit
    const tempFilePath = path.join(os.tmpdir(), tempFilename);

    // Write initial content to the file if necessary
    fs.writeFileSync(tempFilePath, defaultContent);

    // Determine the default editor. Prefer the EDITOR environment variable; fall back to vim, nano, or notepad
    const editor =
        process.env['EDITOR'] ||
        (os.platform() === 'win32' ? 'notepad' : 'vim');

    // Spawn the editor process
    const child = spawn(editor, [tempFilePath], {
        stdio: 'inherit' // Use the parent's stdio to control the editor
    });

    return new Promise<string>((resolve, reject) => {
        child.on('exit', code => {
            if (code === 0) {
                // Editor closed, read the file's contents
                const content = fs.readFileSync(tempFilePath, 'utf8');
                resolve(content);
            } else {
                reject(new Error(`Editor process exited with code ${code}`));
            }

            // Delete the temporary file after reading its contents
            fs.unlinkSync(tempFilePath);
        });
    });
}

function singleLineInput(defaultContent: string = ''): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
    });

    return new Promise<string>(resolve => {
        rl.question('', a => {
            if (a === '') a = defaultContent;
            resolve(a);
            rl.close();
        });
    });
}

export default function textInput(
    multiline: boolean,
    defaultContent: string
): Promise<string> {
    if (multiline) {
        return multilineEditor(defaultContent);
    } else {
        return singleLineInput(defaultContent);
    }
}
