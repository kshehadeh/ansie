# Ansie

A library used to render a simplified markdown+html like markup to rich terminal text.

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

## Installation

`bun add ansie`

or

`npm install ansie`

## Getting Started

The quickest way to get started is through the `compile` function:

```typescript
import { compile } from 'ansie';
console.log(compile('<h1 bold italics>Hello there</h1>'));

// Output: ^[[1;3mHello there^[[22;23m
```

This directly takes markup and produces a terminal string you can output to the terminal to get rich text.

A slightly more advanced way of doing it is to use the composer:

```typescript
import { compose } from 'ansie';
console.log(compose([h1('Title'), h2('A subtitle'), p('Paragraph')]).compile());

// Output:
//
// ^[[34;1;21mTitle^[[39;22;24m
//
// ^[[39;1;4mA subtitle^[[39;22;24m
//
// Paragraph
//
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

## Using the API

Once the package is installed, you can quickly get up and running by using the `compile` function which takes an ansie markup string and returns rich text using ansi codes.

```typescript
import { compile } from 'ansie';
compile('<body>Hello, world</body>');
```

### Using Template Tags

Ansie supports template tags allowing you to build string templates using tagged templates.

```typescript
import { ansie } from 'ansie';
const person = 'world';
console.log(ansie`<body>Hello, ${person}`);
```

## Composition

The library includes a Composer that allows for easy composition through a programmatic interface and includes the concept of _themes_. A
theme is a method with which you can easily apply a consistent look and feel across outputted content. Themes operate at the markup level,
not at the compilation level meaning that themes cannot do anything that is not possible through the standard markup grammar.

### Using the Composer

The composer allows you to associate a theme with a set of nodes all at once. It takes an array of nodes and a theme. If no theme is given then it will use the default theme.

The `compose` function takes an array of nodes which can take array of other nodes themselves to create a hierarchy of nodes. For example:

```typescript
const result = compose([
    h1('Title'),
    h2('A subtitle'),
    p('Paragraph'),
    text('This is some text that is not formatted'),
    bundle(['Text', span('injected'), 'more text']),
    markup('<h1>Raw Markup</h1>'),
]).toString();

console.log(markup);
console.log(compile(markup));
```

The order in which these nodes are rendered match the order they appear in the array. Each one can take an array of nodes or, in most cases, a string which is automatically converted to a raw text node. You can mix and match raw text and nodes as you can see in the _bundle_ call above. The same approach would work with most of the other node building functions. For a full list of node creation functions, see `Node Creation` below.

### Node Creation

| Function | Params                            | Description                                                                                     |
| -------- | --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `h1`     | Text or _Child Nodes_, [_styles_] | Represents a top level header                                                                   |
| `h2`     | Text or _Child Nodes_, [_styles_] | Represents a secondary header                                                                   |
| `h3`     | Text or _Child Nodes_, [_styles_] | Represents a tertiary header                                                                    |
| `span`   | Text or _Child Nodes_, [_styles_] | Represents inline text (usually only needed if doing alternate styling)                         |
| `div`    | Text or _Child Nodes_, [_styles_] | Allows you to combine raw markup with composed items from above                                 |
| `text`   | Text, [_styles_]                  | Inserts text as-is (but will replace `:emoji:`)                                                 |
| `p`      | Text or _Child Nodes_, [_styles_] | Contained items are surrounded with `<color>`                                                   |
| `list`   | _Child Nodes_, [_styles_]         | Adds a bulleted list item for each item in the passed array of nodes                            |
| `br`     | [_styles_]                        | Inserts a `<br/>`                                                                               |
| `bundle` | _Sibling Nodes_                   | Outputs a set of sibling nodes - useful when passing to other functions that need a single node |
| `markup` | _Valid Markup_                    | Allows you to combine raw markup with composed items from above                                 |

Most of these functions take a style object which can be used to override the theme associated with compose function. This is useful in cases where you want to diverge of the overall look and feel of the output.

### The `compose` function

`compose( composition: ComposerNode[] = [],  theme: AnsieTheme = defaultTheme,) => string`

#### Parameters

`composition` - An array of nodes that will be iterated over to generate the final markup
`theme` - An object that defines the styles to use for the various semantic tags that the markup supports.

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
