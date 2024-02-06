// AUTOMATICALLY GENERATED FILE - DO NOT EDIT - RUN bun run fixture:generate TO UPDATE
import {
    compose,
    h1,
    h2,
    h3,
    span,
    div,
    p,
    body,
    text,
    markup,
    li,
} from '../composer/compose';
export default [
    {
        cmd: () => compose([h1('Hello')]).toString(),
        markup: '<body ><h1 >Hello</h1></body>',
    },
    {
        cmd: () => compose([h2('Hello')]).toString(),
        markup: '<body ><h2 >Hello</h2></body>',
    },
    {
        cmd: () => compose([h3('Hello')]).toString(),
        markup: '<body ><h3 >Hello</h3></body>',
    },
    {
        cmd: () => compose([body('Hello')]).toString(),
        markup: '<body ><body >Hello</body></body>',
    },
    {
        cmd: () => compose([p('Hello')]).toString(),
        markup: '<body ><p >Hello</p></body>',
    },
    {
        cmd: () => compose([div('Hello')]).toString(),
        markup: '<body ><div >Hello</div></body>',
    },
    {
        cmd: () => compose([li('Test')]).toString(),
        markup: '<body ><li ><div >Test</div></li></body>',
    },
    {
        cmd: () => compose([markup('<h1>Hello</h1>')]).toString(),
        markup: '<body ><h1>Hello</h1></body>',
    },
    {
        cmd: () => compose([span('<h1>Hello</h1>')]).toString(),
        markup: '<body ><span ><h1>Hello</h1></span></body>',
    },
    {
        cmd: () =>
            compose([h1('H1'), h2('H2'), h3('H3'), body('BODY')]).toString(),
        markup: '<body ><h1 >H1</h1><h2 >H2</h2><h3 >H3</h3><body >BODY</body></body>',
    },
    {
        cmd: () =>
            compose([body([h1('H1'), h2('H2'), h3('H3'), p('p')])]).toString(),
        markup: '<body ><body ><h1 >H1</h1><h2 >H2</h2><h3 >H3</h3><p >p</p></body></body>',
    },
    {
        cmd: () =>
            compose([
                body(h1('H1')),
                p(['text1', div('div'), text('text2')]),
            ]).toString(),
        markup: '<body ><body ><h1 >H1</h1></body><p >text1<div >div</div>text2</p></body>',
    },
];
