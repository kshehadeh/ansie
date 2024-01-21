import { compile } from '../src/compiler';
import { parse } from '../src/parser/generated-parser';
import compilationFixtures from './test-markup-strings';
import compositionFixtures from './test-composer-commands';
import * as readline from 'readline';

import { writeFileSync } from 'fs';
import { resolve } from 'path';

export function recordCompilation(input: string): {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ast: any;
    input: string;
    output: string;
} {
    console.log('Recording compilation: ', input);
    const ast = parse(input);
    const output = compile(input);
    console.log("Result: ", output);
    console.log("--------------------");

    return {
        input,
        ast,
        output,
    };
}

export function recordComposition(cmd: () => string) {
    console.log('Recording composition: ', cmd.toString());
    const markup = cmd();

    // Validate that the markup is valid
    const result = compile(markup);
    console.log("Result: ", result);
    console.log("--------------------");

    return {
        cmd: cmd.toString(),
        markup,
    }
}


// Query the user to ensure that they actually want to overrwrite their fixtures
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const currentDir = import.meta.url
    .replace('file://', '')
    .replace('/record.ts', '');


rl.question('Do you want to overwrite your fixtures? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        // Write compiler recorded results to a file
        const compilationResults = compilationFixtures.map(f => recordCompilation(f));
        writeFileSync(
            resolve(currentDir, 'compiler-fixtures.json'),
            JSON.stringify(compilationResults, null, 2),
            'utf8',
        );

        // Write composer recorded results to a file
        const compositionResults = compositionFixtures.map(f => recordComposition(f));
        writeFileSync(
            resolve(currentDir, 'composer-fixtures.js'),
            `// AUTOMATICALLY GENERATED FILE - DO NOT EDIT - RUN bun run fixture:generate TO UPDATE
import {compose, h1, h2, h3, span, div, p, body, text, markup, li} from '../src/composer'
export default [\n${
                compositionResults.map(r => {
                return `    { cmd: ${r.cmd}, markup: "${r.markup.replaceAll('"', '\\"')}" }`}).join(',\n')}
]`,            
            'utf8',
        );
    } else {
        console.log('Operation cancelled.');
    }
    rl.close();
});
