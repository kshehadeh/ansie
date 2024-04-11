import ansie from "ansie";

// Examples

// Compile Function
ansie.console.log("# Using Compile Function");

console.log(
  ansie.compile("<h2>Heading 2</h2><h3>Heading 3</h3><p>Paragraph</p>And this is a test <span bold>bold</span> and <span italics>italics</span> text.")
);
console.log(ansie.compile(`## Heading 2 with markdown`));
console.log(ansie.compile(`Just plain text with some <span bold>bold text</span>`));
console.log(
  ansie.compile(`
## Heading 2 with markdown
### Heading 3 with markdown
Mixing **bold** and <span italics>italics</span> with markup
<li>List Item 1</li>
<li>**List Item 2 Bold with markdown**</li>
<li><span italics>List Item 3 Italics with Markup</span></li>
`)
);

ansie.console.log("# Using Compile Function With a Custom Theme");

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
ansie.setGlobalTheme(ansie.buildTheme(theme, ansie.getGlobalTheme()));

ansie.console.log(
  `## Heading 2 with markdown
### Heading 3 with markdown
<p>Paragraph with markup</p>
<li>List Item 1</li>
<li>**List Item 2 Bold with markdown**</li>
<li><span italics>List Item 3 Italics with Markup</span></li>
`);

/// Tagged template
ansie.console.log("# Using Tagged Template Function");
console.log(ansie.tpl`Hello, **${"world"}**`);

/// Console Logging
ansie.console.log("# Console Logging");
ansie.console.log(`Hello ${"world"}`);

/// Ask
ansie.console.log("# Asking Questions");

await ansie.askSingleLineText("What is your name?").then((name) => {
  ansie.console.log(`Hello, ${name}!`);
});

await ansie
  .askSelect("Select a color", ["red", "green", "blue"])
  .then((color) => {
    ansie.console.log(`You selected ${color}`);
  });

await ansie.askPassword("Enter your password").then((password) => {
  ansie.console.log(`Your password is ${password}`);
});

await ansie
  .askConfirm("Are you sure?", {
    default: false,
    isContinue: false,
    trueValue: "yes",
    falseValue: "no",
  })
  .then((response) => {
    ansie.console.log(`You answered ${response}`);
  });

await ansie.askMultilineText("Enter a multiline text").then((text) => {
  ansie.console.log(`You entered: ${text}`);
});
