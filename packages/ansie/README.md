# Ansie

A library used to render a simplified markdown+html like markup to rich terminal text.

## Table of Contents

-   [Ansie](#ansie)
    -   [Table of Contents](#table-of-contents)
    -   [Quick Example](#quick-example)
    -   [Installation](#installation)
    -   [Getting Started](#getting-started)
    -   [Ansie Markup](#ansie-markup)
        -   [Text Attributes](#text-attributes)
        -   [Spacing Attributes](#spacing-attributes)
        -   [Free (Raw) Text](#free-raw-text)
        -   [Color Table](#color-table)
        -   [Emoji](#emoji)
        -   [Markdown](#markdown)
    -   [API](#api)
        -   [Compilation Function](#compilation-function)
        -   [Using Template Tags](#using-template-tags)
    -   [User Input](#user-input)
        -   [`ask`](#ask)
        -   [`askSingleLineText`](#asksinglelinetext)
        -   [`askMultiLineText`](#askmultilinetext)
        -   [`askSelect`](#askselect)
        -   [`askPassword`](#askpassword)
        -   [`askConfirm`](#askconfirm)
    -   [Themes](#themes)
        -   [Themes](#themes-1)
    -   [Using the CLI](#using-the-cli)
    -   [Developing](#developing)
        -   [Updating the Grammar](#updating-the-grammar)
    -   [Testing](#testing)

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

## [c=blue]Subtitle goes here[/c]

A description use the default text will appear here. But you can
also include **embedded markup**

<span underline="single">Footnote</span>
```

Using the CLI, you can generate rich text by piping in your markup/down to the utility:

```bash
echo "# Hello **world**" | ansie
```

## Installation

`bun add ansie`

or

`npm install ansie`

## Getting Started

If you're integrating the library into a javascript/typescript application, you can get started with the `compile` function which, at its simplest, takes the markup to translate into ansi codes.

```typescript
import ansie from 'ansie';
console.log(ansie.compile('<h1 bold italics>Hello there</h1>'));

// Output: ^[[1;3mHello there^[[22;23m
```

The above will render the string using a default theme that uses some sensible defaults to style the ouptput, but you can override that by passing in your own theme:

```typescript
import ansie from 'ansie';
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
    ansie.compile({ markup: '<h1 bold italics>Hello there</h1>', theme })
);
```

You can also use template tags to render your output:

```typescript
import ansie from 'ansie';
console.log(ansie.tpl`<h1 bold italics>Hello ${fella}</h1>`);
```

Finally, you can use console logging replacements to avoid having to add a compile step:

```typescript
import ansie from 'ansie';
ansie.console.log('# Title\n## Subtitle\nSome content');
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

-   h1
-   h2
-   h3
-   body
-   p
-   div
-   span
-   li

### Spacing Attributes

| Name         | Value      | Description                                                                                                                               |
| ------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| margin       | "[number]" | Zero or more. Indicates the number of new lines (vertical spacing) or spaces (horizontal spacing) to inject before and after the content. |
| marginLeft   | "[number]" | Zero or more. Indicates the number of spaces to inject before the content.                                                                |
| marginRight  | "[number]" | Zero or more. Indicates the number of spaces to inject after the content.                                                                 |
| marginTop    | "[number]" | Zero or more. Indicates the number of new lines to inject before the content.                                                             |
| marginBottom | "[number]" | Zero or more. Indicates the number of new lines to inject after the content.                                                              |

Tags that accept spacing attributes include:

-   h1
-   h2
-   h3
-   body
-   p
-   div
-   br
-   li

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

| Code                        | Emoji |
| --------------------------- | ----- |
| `:exclamation:`             | ❗    |
| `:warning:`                 | ⚠️    |
| `:no_entry:`                | ⛔    |
| `:heavy_check_mark:`        | ✔️    |
| `:x:`                       | ❌    |
| `:bangbang:`                | ‼️    |
| `:triangular_flag_on_post:` | 🚩    |
| `:fire:`                    | 🔥    |
| `:sos:`                     | 🆘    |
| `:lock:`                    | 🔒    |
| `:key:`                     | 🔑    |
| `:broken_heart:`            | 💔    |
| `:skull_and_crossbones:`    | ☠️    |
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
| `:sunny:`                   | ☀️    |
| `:umbrella:`                | ☔    |
| `:camera:`                  | 📷    |
| `:book:`                    | 📖    |
| `:moneybag:`                | 💰    |
| `:gift:`                    | 🎁    |
| `:bell:`                    | 🔔    |
| `:hammer:`                  | 🔨    |
| `:thumbsup-skin-tone-1:`    | 👍🏻    |
| `:thumbsup-skin-tone-2:`    | 👍🏻    |
| `:thumbsup-skin-tone-3:`    | 👍🏼    |
| `:thumbsup-skin-tone-4:`    | 👍🏽    |
| `:thumbsup-skin-tone-5:`    | 👍🏾    |
| `:thumbsup-skin-tone-6:`    | 👍🏿    |

### Markdown

Ansie supports simpler markdown constructs to create more readable input. Support markdown includes:

-   h1: `# Headline 1` translates to `<h1>Headline 1</h1>`
-   h2: `# Headline 2` translates to `<h2>Headline 2</h2>`
-   h3: `# Headline 3` translates to `<h3>Headline 3</h3>`
-   bold: `**bold**` translates to `<span bold>bold</span>`
-   italics: `**italics**` translates to `<span italics>italics</span>`
-   color: `[c=blue]blue[/c]` translates to `<span fg="blue">blue</span>`

But you can also mix both markdown and markup in the same input. The markdown will first converted to the analogous markup before being compiled to the final output.

## API

Once the package is installed, you can quickly get up and running by using the `compile` function which takes an ansie markup string and returns rich text using ansi codes.

### Compilation Function

```typescript
import ansie from 'ansie';
ansie.compile('<body>Hello, world</body>');
```

### Using Template Tags

Ansie supports template tags allowing you to build string templates using tagged templates.

```typescript
import ansie from 'ansie';
const person = 'world';

// supports markup
console.log(ansie.tpl`<body>Hello</body>, ${person}`);

// support markdown also
console.log(ansie.tpl`# Hello, ${person}!`);

// supports a combination
console.log(
    ansie.tpl`# Hello <span fg="blue" underline="single">${person}</span>`
);
```

## User Input

The `ask` family of utilities allows you to ask a question and get a response from the user.
It takes a question and returns the response as a promise.

```typescript
import ansie from 'ansie';
const response = ansie.ask('What is your name?');
console.log(`Hello, ${response}`);
```

There are different forms of answers that can be provided:

-   `text` - a simple text response
-   `password` - a password response
-   `select` - a selection from a list of options
-   `confirm` - a yes/no response (with a default)

### `ask`

The `ask` function asks a question and returns a response. The promise will resolve with the response.
This is the base ask function that can be configured to return a text, password, select, or confirm response.
It might be easier to use the more specific functions below.

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| question  | string | The question to ask the user |
| options   | object | Additional options to pass   |

```typescript
import ansie from 'ansie';
const response = await ansie.ask('What is your name?', {
    format: 'ansie';
    theme: 'default';
    default: '';
    typeOptions: {
        type: 'select';
        choices: ['Alice', 'Bob', 'Charlie'];
    }
});
console.log(`Hello, ${response}`);
```

### `askSingleLineText`

The `askSingleLineText` function asks a question and returns a text response.

| Parameter | Type   | Description                                        |
| --------- | ------ | -------------------------------------------------- |
| question  | string | The question to ask the user                       |
| def       | string | The default value if nothing is entered (optional) |

```typescript
import ansie from 'ansie';
const response = await ansie.askText('What is your name?');
console.log(`Hello, ${response}`);
```

### `askMultiLineText`

The `askMultiLineText` function asks a question and returns a multi-line text response.

If you specify multiline then the user
will be presented with a multiline editor to provide a response. Once they save the response, the promise will
resolve with the text.

| Parameter | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| question  | string | The question to ask the user |

### `askSelect`

The `askSelect` function asks a question and returns a selection from a list of options. The options are provided
as an array of strings. The promise will resolve with the selected option.

| Parameter | Type   | Description                                                 |
| --------- | ------ | ----------------------------------------------------------- |
| question  | string | The question to ask the user                                |
| choices   | array  | An array of strings representing the options to select from |
| def       | string | The default value selected (optional)                       |

```typescript
import ansie from 'ansie';
const response = await ansie.askSelect('What is your name?', [
    'Alice',
    'Bob',
    'Charlie'
]);
console.log(`Hello, ${response}`);
```

### `askPassword`

The `askPassword` function asks a question and returns a password response. The user's input will be hidden as they
type. The promise will resolve with the password.

| Parameter | Type   | Description                                             |
| --------- | ------ | ------------------------------------------------------- |
| question  | string | The question to ask the user                            |
| def       | string | The default value if the user enters nothing (optional) |

```typescript
import ansie from 'ansie';
const response = await ansie.askPassword('What is your password?');
console.log(`Password is ${response}`);
```

### `askConfirm`

The `askConfirm` function asks a question and returns a boolean response. The user can respond with 'y' or 'n' or
press enter to accept the default value. The promise will resolve with the boolean value.

| Parameter | Type   | Description                                             |
| --------- | ------ | ------------------------------------------------------- |
| question  | string | The question to ask the user                            |
| options   | object | Options to configure the confirmation method            |
| def       | string | The default value if the user enters nothing (optional) |

The options object can contain the following properties:

| Property   | Type    | Description                                                                                                                                                                                           |
| ---------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default    | boolean | This should be the same as either the "trueValue" to default to true or the "falseValue" to default to false. For example, if trueValue is "y" and you want to default to true, then set this to "y". |
| isConfirm  | boolean | If true then treat this as a confirmation input meaning that any key other than escape will return true                                                                                               |
| trueValue  | string  | A single character that the user must press to return true, defaults to "y"                                                                                                                           |
| falseValue | string  | A single character that the user must press to return false, defaults to "n"                                                                                                                          |

```typescript
import ansie from 'ansie';
const response = await ansie.askConfirm('Are you sure? [Y/n]', {
    default: 'y'
});
console.log(`Response is ${response}`);
```

## Themes

You can use themes in Ansie to establish a common set of attributes to associate with each type of tag. A default theme is applied automatically but this can be overridden using the theme property in the `compile` and `compose` functions.

A theme is made up of `tags` each of which has its own `style`. The styles available are:

| Style Type | Properties                                                                                 | Applicable Tags                          |
| ---------- | ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| font       | color (see color properties), bold, underline [single, double, none, true, false], italics | h1, h2, h3, div, span, body, text, p, li |
| spacing    | margin, marginLeft, marginRight, marginTop, marginBottom                                   | h1, h2, h3, body, div, p, li             |
| list       | bullet (a string like `*`), indent (number)                                                | li                                       |

The default theme has the following attributes:

```typescript

```

### Themes

The theme is made up of the following sections:

| Section | Description                                   |
| ------- | --------------------------------------------- |
| h1      | Used the to style the h1 blocks               |
| h2      | Used to style the h2 blocks                   |
| h3      | Used to style the h3 blocks                   |
| p       | Used the style paragraph blocks               |
| div     | Used to style generic blocks of text          |
| list    | Used to indicate how lists should be styled   |
| span    | Used to style generic inline elements of text |

## Using the CLI

You can access the functionality in ansie through a CLI as in:

```bash
> ansie "<h1 bold>This is bold</h1>"
```

This will output:

> **This is bold**

You can also pipe in the markup to produce the output:

```bash
> echo "<h1 bold>This is bold</h1>" | ansie
```

> **This is bold**

## Developing

This package is developed using bun to make the building and packaging of Typescript easier. If you have an interest in making this `npm` compatible please submit a PR.

To install dependencies:

```bash
bun install
```

To update the parser if you made changes to the grammar:

```bash
bun run parser:generate
```

If you added new tests to `test-strings.ts` you will need to generate a new `fixtures.json` file which you can do by running:

```bash
bun run test:record
```

The library contains three components:

1. _Parser_ - this is used to convert a string to an Abstract Syntax Tree. You probably won't need to use this as it represents an incremental state
2. _Compiler_ - Converts the abstract syntax tree to renderer terminal text. You can use this if you want to just pass in markup to get your terminal string.
3. _Composer_ - A convenient set of methods to build markup through a functional syntax. You can use this if you want a nicer, functional way of building your markup.

### Updating the Grammar

The parser code in this context is generated from a grammar file (terminal-markup.peggy) using the peggy library. If you want to update the parser, you would need to modify the grammar file and then re-run the generate.ts script to create a new parser. Here are the steps:

1. Navigate to the terminal-markup.peggy file in your project directory.
2. Make the necessary changes to the grammar. This could involve adding new rules, modifying existing ones, or fixing bugs.
3. Run the generate.ts script to generate a new parser. You can do this by running `bun parser:generate`
4. The updated parser will be written to `generated-parser.js`.
5. Any new grammar that added or fixed remember to add a test to `test/test-markup-strings.json`

## Testing

Test files are colocated with the files that they are testing using the format `<filename>.test.ts`. For composition and
markup tests, we automatically generate fixture files from an array of test string and commands.

Many of the tests are built off of fixtures that can be re-recorded at any time using the `tests:record` script.

`test-composer-commands` is a file that export an array where each item in the array is a function that runs an compose command.
When you run `bun run tests:record` each of these functions is executed and the results are stored in the `composer-fixtures.json` file
which is then run as part of the package's tests.

`test-markup-strings` is an array of valid markup strings that are used during the `bun run tests:record` script to
generate the `compiler-fixtures.json` file which contains the inputs and expected outputs.

> **Note: You should only rerecord the fixtures if you are confident that they will generate correct output**
