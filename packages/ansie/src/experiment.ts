import { compile } from '.';

// console.log(
//     compile(
//         '<h1>Test</h1><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>'
//     )
// );

const result = compile(`<body>
<h1 bold marginBottom="1">My Console App</h1>
<h2 fg="gray" marginBottom="1">A little something I wrote</h2>
<p marginBottom="1">
    In order to used this app, do the following:
    <ul>
        <li bullet="*" marginBottom="1"> Create a config file</li>
        <li bullet="*" marginBottom="1"> Run the utility with the -h flag</li>
        <li bullet="*" marginBottom="1"> etc...</li>
    </ul>
</p>
</body>
`);

console.log(result);