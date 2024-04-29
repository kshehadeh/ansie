import { console as console$1, themes, ask } from 'ansie';

// Examples
console$1.log(`<h2>Heading 2</h2>
<h3>Heading 3</h3>
<p>Paragraph</p>
And this is a test <span bold>bold</span> and <span italics>italics</span> text.
`);
console$1.log(`
# Heading 1: Markdown Sample
## Heading 2: Markdown Sample
### Heading 3: Markdown Sample
* List Item 1
* List Item 2
* List Item 3

[Link with text](https://www.example.com)
https://www.example.com

![Image with text](https://www.example.com/image.jpg)
`);
console.log('------');
console$1.log(`
# Heading 1 with markdown
<h2>Heading 2 with markup</h2>
<li>List Item 1</li>

* List Item 2 with **markdown**

<li><span italics>List Item 3 with markup</span></li>
`);
console.log('------');
console$1.log("# Using Compile Function With a Custom Theme");
const theme = {
    h1: {
        font: {
            color: {
                fg: "red",
                bg: "white",
            },
        },
    },
    p: {
        font: {
            color: {
                fg: "green",
            },
        },
        spacing: {
            marginTop: 1,
        },
    },
    li: {
        list: {
            bullet: "•",
        },
    },
};
/**
 * Set the global theme by merging the new theme with the existing global theme
 * The buildTheme function does a deep merge of the two taking into account the
 * nested objects and arrays.
 */
themes.set(theme);
console$1.log(`# Heading 1 with markdown 
## Heading 2 with markdown
### Heading 3 with markdown
<p>Paragraph with markup</p>
<li>List Item 1</li>
<li>List Item 2</li>
<li><span italics>List Item 3 Italics with Markup</span></li>
`);
themes.reset();
console.log('------');
/// Tagged template
console$1.log("# Using Tagged Template Function");
console$1.log(`Hello, **${"world"}**`);
console.log('------');
/// Ask
console$1.log("# Prompts");
await ask.text("What is your name?").then((name) => {
    console$1.log(`Hello, ${name}!`);
});
const color = await ask.select("Select a color", ["red", "green", "blue"]);
console$1.log(`You selected ${color}`);
const password = await ask.password("Enter your password");
console$1.log(`Your password is ${password}`);
const confirm = await ask.confirm("Are you sure?", true);
console$1.log(`You answered ${confirm}`);
const multi = await ask.multiline("Enter a multiline text");
console$1.log(`You entered: ${multi}`);
