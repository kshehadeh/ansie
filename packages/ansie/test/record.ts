import { compile } from '../src/compiler/compile';
import compilationFixtures from './test-markup-strings';
import * as readline from 'readline';

import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { parseAnsieMarkdown } from '../src/parser';

export function recordCompilation(input: string): {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ast: any;
    input: string;
    output: string;
} {
    console.log('Recording compilation: ', input);
    const ast = parseAnsieMarkdown(input);
    const output = compile({ markup: input, output: 'ansi' });
    console.log('Result: ', output);
    console.log('--------------------');

    return {
        input,
        ast,
        output
    };
}

// Query the user to ensure that they actually want to overrwrite their fixtures
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const currentDir = import.meta.url
    .replace('file://', '')
    .replace('/record.ts', '');

rl.question('Do you want to overwrite your fixtures? (y/n) ', answer => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        // Write compiler recorded results to a file
        const compilationResults = compilationFixtures.map(f =>
            recordCompilation(f)
        );
        writeFileSync(
            resolve(currentDir, 'generated/compiler-fixtures.json'),
            JSON.stringify(compilationResults, null, 2),
            'utf8'
        );
    } else {
        console.log('Operation cancelled.');
    }
    rl.close();
});
