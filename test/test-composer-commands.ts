import { body, compose, div, h1, h2, h3, p, text, markup, span, li } from '..';

export default [
    () => compose([h1('Hello')]).toString(),
    () => compose([h2('Hello')]).toString(),
    () => compose([h3('Hello')]).toString(),
    () => compose([body('Hello')]).toString(),
    () => compose([p('Hello')]).toString(),
    () => compose([div('Hello')]).toString(),
    () => compose([li('Test')]).toString(),
    () => compose([markup('<h1>Hello</h1>')]).toString(),
    () => compose([span('<h1>Hello</h1>')]).toString(),

    () => compose([h1('H1'), h2('H2'), h3('H3'), body('BODY')]).toString(),
    () => compose([body([h1('H1'), h2('H2'), h3('H3'), p('p')])]).toString(),
    () =>
        compose([
            body(h1('H1')),
            p(['text1', div('div'), text('text2')]),
        ]).toString(),
];
