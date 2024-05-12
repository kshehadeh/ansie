import { ask, console as console$1 } from 'ansie';
import select from '@inquirer/select';

const stringsToShow = {
    categories: {
        "Markdown": [
            { id: "Heading 1 Markdown", tpl: "# Heading 1: Markdown Sample" },
            { id: "Heading 2 Markdown", tpl: "## Heading 2: Markdown Sample" },
            { id: "Heading 3 Markdown", tpl: "### Heading 3: Markdown Sample" },
            { id: "List Items  Markdown", tpl: "* List Item 1\n* List Item 2\n* List Item 3" },
            { id: "Link Markdown", tpl: "[Link with text](https://www.example.com)" },
            { id: "Image Markdown", tpl: "![Image with text](https://www.example.com/image.jpg)" },
        ],
        "HTML": [
            { id: "Heading 1 HTML", tpl: "<h1>Heading 2</h1>" },
            { id: "Heading 2 HTML", tpl: "<h2>Heading 2</h2>" },
            { id: "Heading 3 HTML", tpl: "<h3>Heading 3</h3>" },
            { id: "Multiple Headings HTML", tpl: "<h1>Heading 1</h1>\n<h2>Heading 2</h2>" },
            { id: "Paragraph HTML", tpl: "<p>Paragraph</p>" },
            { id: "Spans HTML", tpl: "And this is a test <span bold>bold</span> and <span italics>italics</span> text." },
        ],
        "Mixed": [
            { id: "Markdown and HTML Span", tpl: "# Heading 1 with markdown\n<span color='blue'>Blue test</span>" },
            { id: "Markdown and Markup Headings Mixed", tpl: `
<h1>Heading 1 with markup</h1>
## Heading 2 with markdown` },
            { id: "Markdown and Markup List Mixed", tpl: `
- List Item 1
<li>List Item 2</li>
* List Item 3` },
        ],
        "Prompts": [
            { id: "Text prompt", tpl: "What is your name?", isPrompt: true, type: "text" },
            { id: "Select prompt", tpl: "Select a color", type: "select", options: ["red", "green", "blue"], isPrompt: true },
            { id: "Password prompt", tpl: "Enter your password", type: "password", isPrompt: true },
            { id: "Confirmation prompt", tpl: "Are you sure?", type: "confirm", default: true, isPrompt: true },
            { id: "Multiline prompt", tpl: "Enter a multiline text", type: "multiline" },
        ]
    }
};
const category = await select({ message: "Select a category", loop: false, choices: Object.keys(stringsToShow.categories).map((c) => ({ value: c, name: c })) });
const items = stringsToShow.categories[category];
const item = await select({ message: "Select an item", loop: false, choices: items.map((i) => ({ value: i.id, name: `${i.id} (${i.isPrompt ? 'prompt' : 'no prompt'})` })) });
const itemData = items.find((i) => i.id === item);
if (itemData?.isPrompt) {
    console.log(`You write:\n${itemData.tpl}`);
    console.log(`Ansie prompts:\n------`);
    const promptType = itemData.type;
    let output = '';
    if (promptType === "password") {
        output = await ask.password(itemData.tpl);
    }
    if (promptType === "confirm") {
        output = await ask.confirm(itemData.tpl, itemData.default || false);
    }
    if (promptType === "multiline") {
        output = await ask.multiline(itemData.tpl);
    }
    if (promptType === "text") {
        output = await ask.text(itemData.tpl);
    }
    if (promptType === "select") {
        output = await ask.select(itemData.tpl, itemData.options || ["Yes", "No"]);
    }
    console.log(`------`);
    console.log(`Ansie reads: ${output}`);
}
else {
    console.log(`You write:\n${itemData?.tpl}`);
    console.log(`Ansie writes:\n------`);
    console$1.log(itemData?.tpl);
    console.log(`------`);
}
// // Examples
// ansieConsole.log(`<h2>Heading 2</h2>
// <h3>Heading 3</h3>
// <p>Paragraph</p>
// And this is a test <span bold>bold</span> and <span italics>italics</span> text.
// `);
// ansieConsole.log(`
// # Heading 1: Markdown Sample
// ## Heading 2: Markdown Sample
// ### Heading 3: Markdown Sample
// * List Item 1
// * List Item 2
// * List Item 3
// [Link with text](https://www.example.com)
// https://www.example.com
// ![Image with text](https://www.example.com/image.jpg)
// `);
// console.log('------');
// ansieConsole.log(`
// # Heading 1 with markdown
// <h2>Heading 2 with markup</h2>
// <li>List Item 1</li>
// * List Item 2 with **markdown**
// <li><span italics>List Item 3 with markup</span></li>
// `);
// console.log('------');
// ansieConsole.log("# Using Compile Function With a Custom Theme");
// const theme = {
//   h1: {
//     font: {
//       color: {
//         fg: "red",
//         bg: "white",
//       },
//     },
//   },
//   p: {
//     font: {
//       color: {
//         fg: "green",
//       },
//     },
//     spacing: {
//       marginTop: 1,
//     },
//   },
//   li: {
//     list: {
//       bullet: "•",
//     },
//   },
// };
// /**
//  * Set the global theme by merging the new theme with the existing global theme
//  * The buildTheme function does a deep merge of the two taking into account the 
//  * nested objects and arrays.
//  */
// themes.set(theme);
// ansieConsole.log(`# Heading 1 with markdown 
// ## Heading 2 with markdown
// ### Heading 3 with markdown
// <p>Paragraph with markup</p>
// <li>List Item 1</li>
// <li>List Item 2</li>
// <li><span italics>List Item 3 Italics with Markup</span></li>
// `);
// themes.reset();
// console.log('------');
// /// Tagged template
// ansieConsole.log("# Using Tagged Template Function");
// ansieConsole.log(`Hello, **${"world"}**`);
// console.log('------');
// /// Ask
// ansieConsole.log("# Prompts");
// await ask.text("What is your name?").then((name) => {
//   ansieConsole.log(`Hello, ${name}!`);
// });
// const color = await ask.select("Select a color", ["red", "green", "blue"])
// ansieConsole.log(`You selected ${color}`);
// const password = await ask.password("Enter your password");
// ansieConsole.log(`Your password is ${password}`);
// const confirm = await ask.confirm("Are you sure?", true);
// ansieConsole.log(`You answered ${confirm}`);
// const multi = await ask.multiline("Enter a multiline text");
// ansieConsole.log(`You entered: ${multi}`);
