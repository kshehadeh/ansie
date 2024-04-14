# Ansie

A library used to render a simplified markdown+html like markup to rich terminal text.

## Table of Contents

- [Ansie](#ansie)
  - [Table of Contents](#table-of-contents)
  - [Quick Example](#quick-example)
  - [Installation](#installation)
  - [Getting Started](#getting-started)
  - [Ansie Markup](#ansie-markup)
    - [Text Attributes](#text-attributes)
    - [Spacing Attributes](#spacing-attributes)
    - [Free (Raw) Text](#free-raw-text)
    - [Color Table](#color-table)
    - [Emoji](#emoji)
    - [Markdown](#markdown)
  - [APIs](#apis)
    - [`parse`](#parse)
      - [`parse.markdown`](#parsemarkdown)
      - [`parse.markup`](#parsemarkup)
    - [`compile`](#compile)
    - [`ask`](#ask)
      - [`ask.text`](#asktext)
      - [`ask.multiline`](#askmultiline)
      - [`ask.select`](#askselect)
      - [`ask.password`](#askpassword)
      - [`ask.confirm`](#askconfirm)
    - [`themes`](#themes)
      - [`themes.get`](#themesget)
      - [`themes.set`](#themesset)
      - [`themes.reset`](#themesreset)
  - [Themes](#themes-1)
  - [Developing](#developing)
    - [Updating the Grammar](#updating-the-grammar)
  - [Testing](#testing)

## Quick Example

For example,

```xml
<h1 fg="green">Title</h1>
<h2 fg="blue">Subtitle goes here</h2>
<p>
    A description using the default text will appear here.
    But you can also include <span bold>embedded markup</span>
</p>
<div underline="single" fg="gray">Footnote</div>
```

This is a fully markup-based example. But for simpler output constraints you can use a variation of markdown mixed with ansie markup:

```markdown
# Title

## Subtitle goes here

A description use the default text will appear here. But you can
also include **embedded markup**

<span underline="single">Footnote</span>
```

## Installation

`npm install ansie`

## Getting Started

Ansie is divided into a few different APIs:

- parse - Builds an AST out of a string
- compile - Converts an Anie-style markup string to ansi codes
- ask - A convient set of prompts that you can use to get user input in a terminal with ansie-formatted prompts.
- themes - Modify themes to affect all rendered output without having to specify it each time
- console - A convenience wrapper to use `console` functions with ansie formatting

If you're integrating the library into a javascript/typescript application, you can get started with the `compile` function which, at its simplest, takes the markup to translate into ansi codes.

```typescript
import {compile} from 'ansie';
console.log(compile('<h1 bold italics>Hello there</h1>'));

// Output: ^[[1;3mHello there^[[22;23m
```

The above will render the string using a default theme that uses some sensible defaults to style the ouptput, but you can override that by passing in your own theme:

```typescript
import { compile } from 'ansie';
const theme = {
    h1: {
        font: {
            color: {
                fg: 'red'
            },
            bold: true,
            italics: false,
            underline: 'none'
        }
    }
};

console.log(
    compile({ markup: '<h1 bold italics>Hello there</h1>', theme })
);
```

You can also use template tags to render your output:

```typescript
import {tpl} from 'ansie';
console.log(tpl`<h1 bold italics>Hello ${fella}</h1>`);
```

Finally, you can use console logging replacements to avoid having to add a compile step:

```typescript
import {console} from 'ansie';
console.log('# Title\n## Subtitle\nSome content');
```

## Ansie Markup

The markup language follows XML rules in that it uses a declarative tag-based system of angle brackets and attributes. The supported tags available today are:

| Name | Attributes                               | Description                                                                             |
| ---- | ---------------------------------------- | --------------------------------------------------------------------------------------- |
| body | {text attributes} & {spacing attributes} | A semantic tag intended to be a container for multiple other tags - usually at the root |
| div  | {text attributes} & {spacing attributes} | Content that injects new lines before and after                                         |
| p    | {text attributes} & {spacing attributes} | Content that injects new lines before and after                                         |
| h1   | {text attributes} & {spacing attributes} | A semantic tag intended to represent the headline of a block of text                    |
| h2   | {text attributes} & {spacing attributes} | A semantic tag intended to represent the sub-headline of a block of text                |
| h3   | {text attributes} & {spacing attributes} | A semantic tag intended to represent the tertiary headline of a block of text           |
| li   | {text attributes} & {spacing attributes} | A semantic tag intended to represent the tertiary headline of a block of text           |
| span | {text attributes}                        | Content that does not have new lines before and after                                   |
| br   | {spacing attributes}                     | Injects a newline in the compiled output                                                |

### Text Attributes

| Name      | Value                                                               | Description                                                                                 |
| --------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| bold      | "false", "true", "yes", "no", undefined                             | Makes text bold - if `bold` specified but not value then it will assume _true_              |
| italics   | "false", "true", "yes", "no", undefined                             | Makes text italicized - if `italics` specified but not value then it will assume _true_     |
| underline | "single", "double", "none", "false", "true", "yes", "no", undefined | Makes text underlined - if `underline` specified but not value then it will assume _single_ |
| fg        | { fg color }                                                        | Changes the foreground color of the text                                                    |
| bg        | { bg color }                                                        | Changes the background color of the text                                                    |

Tags that accept spacing attributes include:

- h1
- h2
- h3
- body
- p
- div
- span
- li

### Spacing Attributes

| Name         | Value      | Description                                                                                                                               |
| ------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| margin       | "[number]" | Zero or more. Indicates the number of new lines (vertical spacing) or spaces (horizontal spacing) to inject before and after the content. |
| marginLeft   | "[number]" | Zero or more. Indicates the number of spaces to inject before the content.                                                                |
| marginRight  | "[number]" | Zero or more. Indicates the number of spaces to inject after the content.                                                                 |
| marginTop    | "[number]" | Zero or more. Indicates the number of new lines to inject before the content.                                                             |
| marginBottom | "[number]" | Zero or more. Indicates the number of new lines to inject after the content.                                                              |

Tags that accept spacing attributes include:

- h1
- h2
- h3
- body
- p
- div
- br
- li

### Free (Raw) Text

Additionally you can have regular text that is not enclosed in a tag. For example, you can have:

```xml
<h1>Title</h1>
Raw text here
```

Tags can be nested and will render the way you would expect. So, for example,

```xml
<body fg="red">
    <h1 fg="blue">My Title</h1>
</body>
```

You can mix free text with tags to create more readable strings like this:

```xml
This is a quick <span fg="blue">blue</span> test
```

### Color Table

| Color Names   |
| ------------- |
| black         |
| red           |
| green         |
| yellow        |
| blue          |
| magenta       |
| cyan          |
| white         |
| gray          |
| brightred     |
| brightgreen   |
| brightyellow  |
| brightblue    |
| brightmagenta |
| brightcyan    |
| brightwhite   |
| brightgray    |

### Emoji

Text can include emoji either through unicode or through _Slack_ style formatting as in `:fire:`. Supported emoji include:

| Code                        | Emoji  |
| --------------------------- | ------ |
| `:exclamation:`             | ❗     |
| `:warning:`                 | ⚠️   |
| `:no_entry:`                | ⛔     |
| `:heavy_check_mark:`        | ✔️   |
| `:x:`                       | ❌     |
| `:info:`                    | ℹ️    |
| `:question:`                | ❓     |
| `:prompt:`                  | 💬    |
| `:bangbang:`                | ‼️    |
| `:triangular_flag_on_post:` | 🚩    |
| `:fire:`                    | 🔥    |
| `:sos:`                     | 🆘     |
| `:lock:`                    | 🔒    |
| `:key:`                     | 🔑    |
| `:broken_heart:`            | 💔    |
| `:skull_and_crossbones:`    | ☠️   |
| `:grinning:`                | 😀    |
| `:grin:`                    | 😁    |
| `:joy:`                     | 😂    |
| `:heart_eyes:`              | 😍    |
| `:smirk:`                   | 😏    |
| `:sunglasses:`              | 😎    |
| `:thumbsup:`                | 👍    |
| `:thumbsdown:`              | 👎    |
| `:clap:`                    | 👏    |
| `:pray:`                    | 🙏    |
| `:cry:`                     | 😢    |
| `:sob:`                     | 😭    |
| `:rocket:`                  | 🚀    |
| `:sunny:`                   | ☀️   |
| `:umbrella:`                | ☔     |
| `:camera:`                  | 📷    |
| `:book:`                    | 📖    |
| `:moneybag:`                | 💰    |
| `:gift:`                    | 🎁    |
| `:bell:`                    | 🔔    |
| `:hammer:`                  | 🔨    |
| `:thumbsup-skin-tone-1:`    | 👍🏻 |
| `:thumbsup-skin-tone-2:`    | 👍🏻 |
| `:thumbsup-skin-tone-3:`    | 👍🏼 |
| `:thumbsup-skin-tone-4:`    | 👍🏽 |
| `:thumbsup-skin-tone-5:`    | 👍🏾 |
| `:thumbsup-skin-tone-6:`    | 👍🏿 |

### Markdown

Ansie supports simpler markdown constructs to create more readable input. Support markdown includes:

- h1: `# Headline 1` translates to `<h1>Headline 1</h1>`
- h2: `# Headline 2` translates to `<h2>Headline 2</h2>`
- h3: `# Headline 3` translates to `<h3>Headline 3</h3>`
- bold: `**bold**` translates to `<span bold>bold</span>`
- italics: `**italics**` translates to `<span italics>italics</span>`
- underline: `__underline__` translates to `<span underline="single">underline</span>`

But you can also mix both markdown and markup in the same input. The markdown will first converted to the analogous markup before being compiled to the final output.

## APIs

Once the package is installed, you can quickly get up and running by using the `compile` function which takes an ansie markup string and returns rich text using ansi codes.

### `parse`

Functions to build the AST from a string of markup.  This is useful if you want to manipulate the AST before compiling it to ansi codes.

#### `parse.markdown`

Unlike the `parse.markup` function, this will first parse the input string as markdown before then parsing it as markup. This is useful if you want to use markdown in your input string but adds additional processing team.  Only use this if you know that your input string includes markdown.

#### `parse.markup`

This function will only parse ansie-style markup.  Markdown will be ignored.

The AST structure is as follows:

Node:

- `node` - The type of node. This can be `tag`, `text`, or `root`
- `name` - The name of the tag
- `attributes` - The attributes of the tag
- `children` - The children of the node
- `text` - The text of the node

### `compile`

Parameters:

Pass in just a string of markup to compile or an object with options.

- `markup` - The markup string to compile

**OR** pass in an object with options:

- `options.output` - The format to output. This can be either `ansie` or `markup`. The default is `ansie`.  If `markup` then the output will be the pre-compiled markup.
- `options.theme` - The theme to use when compiling the markup. See themes below for more information.
- `options.inputIncludesMarkdown` - If true then the input string is assumed to include markdown and will be converted to markup before being compiled. The default is `true`. You can save some processing time by setting this to `false` if you know that the input string does not include markdown.

```typescript
import { compile } from 'ansie';
compile('<body>Hello, world</body>');
```

### `ask`

The `ask` family of utilities allows you to ask a question and get a response from the user.
It takes a question and returns the response as a promise.

```typescript
import ansie from 'ansie';
const response = ansie.ask('What is your name?');
console.log(`Hello, ${response}`);
```

There are different forms of answers that can be provided:

- `text` - a simple text response
- `password` - a password response
- `select` - a selection from a list of options
- `confirm` - a yes/no response (with a default)

#### `ask.text`

The `text` function asks a question and returns a text response.

| Parameter    | Type   | Description                                        |
| ------------ | ------ | -------------------------------------------------- |
| prompt       | string | The question to ask the user                       |
| defaultValue | string | The default value if nothing is entered (optional) |

```typescript
import { ask } from 'ansie';
const response = await ask.text('What is your name?');
console.log(`Hello, ${response}`);
```

#### `ask.multiline`

The `multinline` function asks a question and returns a multi-line text response.

If you specify multiline then the user will be presented with a multiline editor to provide a response. Once they save the response, the promise will
resolve with the text.

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| prompt    | string | The question to ask the user |
| defaultValue | string | The default value if nothing is entered (optional) |

#### `ask.select`

The `select` function asks a question and returns a selection from a list of options. The options are provided as an array of strings. The promise will resolve with the selected option.

| Parameter    | Type   | Description                                                 |
| ------------ | ------ | ----------------------------------------------------------- |
| question     | string | The question to ask the user                                |
| choices      | array  | An array of strings representing the options to select from |
| defaultValue | string | The default value selected (optional)                       |

```typescript
import { ask } from 'ansie';
const response = await ask.select('What is your name?', [
    'Alice',
    'Bob',
    'Charlie'
]);
console.log(`Hello, ${response}`);
```

#### `ask.password`

The `password` function asks a question and returns a password response. The user's input will be hidden as they
type. The promise will resolve with the password.

| Parameter | Type   | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| prompt    | string | The question to ask the user                    |
| mask      | string | The character to use as a mask for the password |

```typescript
import { ask } from 'ansie';
const response = await ask.password('What is your password?');
console.log(`Password is ${response}`);
```

#### `ask.confirm`

The `confirm` function asks a question and returns a boolean response. The user can respond with 'y' or 'n' or press enter to accept the default value. The promise will resolve with the boolean value.  You can also configure the default value and the keys that will be used to confirm or deny the question.

| Parameter           | Type   | Description                                             |
| ------------------- | ------ | ------------------------------------------------------- |
| prompt              | string | The question to ask the user                            |
| defaultValue        | string | The default value if the user enters nothing (optional) |
| trueFalse.trueValue | string | The name of the true value (defaults to Yes)            |
| trueFalse.falseValue | string | The name of the false value (defaults to No)            |

The options object can contain the following properties:

```typescript
import { ask } from 'ansie';
const response = await ask.confirm('Are you sure?', true, { trueValue: 'Positive', falseValue: 'Negative' });
console.log(`Response is ${response}`);
```

### `themes`

You can pass one off themes to the `compile` function to override the default theme. But you can also use the `themes` object to get or set the current global theme.

#### `themes.get`

This will return the active global theme that is used whenever you call `compile` without specifying a theme.  See [themes](#themes) for more information on themes.

#### `themes.set`

This will set the active global theme that is used whenever you call `compile` without specifying a theme.  See [themes](#themes) for more information on themes.

Note that you can pass in a partial description of a theme and it will merge with the existing global theme.


#### `themes.reset`

This will reset the global theme to the default theme.

## Themes

You can use themes in Ansie to establish a common set of attributes to associate with each type of tag. A default theme is applied automatically but this can be overridden using the theme property in the `compile` function.

A theme is made up of `tags` each of which has its own `style`. The styles available are:

| Style Type | Properties                                                                                 | Applicable Tags                          |
| ---------- | ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| font       | color (see color properties), bold, underline [single, double, none, true, false], italics | h1, h2, h3, div, span, body, text, p, li |
| spacing    | margin, marginLeft, marginRight, marginTop, marginBottom                                   | h1, h2, h3, body, div, p, li             |
| list       | bullet (a string like `*`), indent (number)                                                | li                                       |

The default theme has the following attributes:

| Section | Description                                   |
| ------- | --------------------------------------------- |
| h1      | Used the to style the h1 blocks               |
| h2      | Used to style the h2 blocks                   |
| h3      | Used to style the h3 blocks                   |
| p       | Used the style paragraph blocks               |
| div     | Used to style generic blocks of text          |
| list    | Used to indicate how lists should be styled   |
| span    | Used to style generic inline elements of text |

## Developing

To install dependencies:

```bash
npm install
```

To update the parser if you made changes to the grammar:

```bash
npm run parser:generate
```

If you added new tests to `test-markup-strings.ts` you will need to generate a new `compiler-fixtures.json` file which you can do by running:

```bash
npm run fixture:generate
```

### Updating the Grammar

The parser code in this context is generated from a grammar file (terminal-markup.peggy) using the peggy library. If you want to update the parser, you would need to modify the grammar file and then re-run the generate.ts script to create a new parser. Here are the steps:

1. Navigate to the terminal-markup.peggy file in your project directory.
2. Make the necessary changes to the grammar. This could involve adding new rules, modifying existing ones, or fixing bugs.
3. Run the generate.ts script to generate a new parser. You can do this by running `npm run  parser:generate`
4. The updated parser will be written to `generated-parser.js`.
5. Any new grammar that added or fixed remember to add a test to `test/test-markup-strings.json`

## Testing

Test files are colocated with the files that they are testing using the format `<filename>.test.ts`. For composition and
markup tests, we automatically generate fixture files from an array of test string and commands.

Many of the tests are built off of fixtures that can be re-recorded at any time using the `fixture:generate` script.

`test-markup-strings` is an array of valid markup strings that are used during the `npm run fixture:generate` script to
generate the `compiler-fixtures.json` file which contains the inputs and expected outputs.

> **Note: You should only rerecord the fixtures if you are confident that they will generate correct output**
