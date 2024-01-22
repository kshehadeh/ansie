import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import peggy from 'peggy';

const currentDir = import.meta.dir;
const inFile = path.resolve(currentDir, 'ansie-markup.peggy');

console.log('Reading grammar from ', inFile);

const grammar = readFileSync(inFile, 'utf8');
const parserSource: string =
    '/* eslint-disable */\n' +
    peggy.generate(grammar, {
        output: 'source',
        format: 'es',
        grammarSource: 'ansie-markup.peggy',
    });

const outFile = path.resolve(
    currentDir,
    '../../src/parser/generated-parser.js',
);

console.log('Writing parser to ', outFile);
writeFileSync(outFile, parserSource, 'utf8');
