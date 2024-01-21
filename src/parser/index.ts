import { readFileSync } from 'fs';
import { parse } from './generated-parser.js';
import { type Ast } from '../compiler/types';
// import { type Stage, type LocationRange, type DiagnosticNote } from 'peggy'

export function parseString(text: string): Ast | null {
    return parse(text) as Ast;
}

export function parseFile(filename: string): Ast | null {
    const fileContent = readFileSync(filename, 'utf8');
    return parseString(fileContent);
}

if (process.argv[1].includes('parser')) {
    // console.log(JSON.stringify(parseString('<h1 underline="double" bold="true" fg="blue" marginTop="1" marginBottom="1">Title</h1><h2 underline="single" bold="true" fg="default" marginTop="1" marginBottom="1">A subtitle</h2><p marginTop="1" marginBottom="1">Paragraph</p>'), null, 2))
    // console.log(JSON.stringify(parseString('<body><h1 underline="double" bold="true" fg="blue" marginTop="1" marginBottom="1">Title</h1><h2 underline="single" bold="true" fg="default" marginTop="1" marginBottom="1">A subtitle</h2><p marginTop="1" marginBottom="1">Paragraph</p></body>'), null, 2))
    // console.log(JSON.stringify(parseString('<body bold italics underline fg="red" bg="white">Hello</body>'), null, 2))
    // console.log(JSON.stringify(parseString('<h1 margin="12" fg="red">HELLO</h1>'), null, 2))
    // console.log(JSON.stringify(parseString('<body bold=true>Hello</body>'), null, 2))
    

    // console.log(JSON.stringify(parseString('<color name="red">Hello</color>'), null, 2))
    // console.log(JSON.stringify(parseString('<bold>Hello</bold>'), null, 2))
    // console.log(JSON.stringify(parseString('Hello'), null, 2))
}
