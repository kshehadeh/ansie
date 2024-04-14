import { console as ansieConsole, themes, tpl, ask } from "ansie";

// Examples

ansieConsole.log(`<h2>Heading 2</h2>
<h3>Heading 3</h3>
<p>Paragraph</p>
And this is a test <span bold>bold</span> and <span italics>italics</span> text.
`);

console.log('------');

ansieConsole.log(`
# Heading 1: Markdown Sample
## Heading 2: Markdown Sample
### Heading 3: Markdown Sample
* List Item 1
* List Item 2
* List Item 3

[This is a link](https://www.example.com)
`);
console.log('------');
ansieConsole.log(`
# Heading 1 with markdown
<h2>Heading 2 with markup</h2>
<li>List Item 1</li>

* List Item 2 with **markdown**

<li><span italics>List Item 3 with markup</span></li>
`);
console.log('------');

ansieConsole.log("# Using Compile Function With a Custom Theme");

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

ansieConsole.log(`# Heading 1 with markdown 
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
ansieConsole.log("# Using Tagged Template Function");

console.log(tpl`Hello, **${"world"}**`);

console.log('------');

/// Ask
ansieConsole.log("# Prompts");

await ask.text("What is your name?").then((name) => {
  ansieConsole.log(`Hello, ${name}!`);
});

const color = await ask.select("Select a color", ["red", "green", "blue"])
ansieConsole.log(`You selected ${color}`);

const password = await ask.password("Enter your password");
ansieConsole.log(`Your password is ${password}`);

const confirm = await ask.confirm("Are you sure?", true);
ansieConsole.log(`You answered ${confirm}`);

const multi = await ask.multiline("Enter a multiline text");
ansieConsole.log(`You entered: ${multi}`);

