import { parse, Renderer, Tokens } from 'marked';

class AnsieRenderer extends Renderer {
    simplified: boolean;

    constructor(simplified: boolean = false) {
        super();
        this.simplified = simplified;
    }

    code({ text }: Tokens.Code): string {
        return `<p marginLeft="4" fg="gray">${text}</p>`;
    }
    blockquote({ text }: Tokens.Blockquote): string {
        return `<p marginLeft="4">${text}</p>`;
    }
    html({ text }: Tokens.HTML | Tokens.Tag): string {
        // This html might contain markdown itself so split into lines, parse each line and then join
        //  back together
        const result = text
            .split('\n')
            .map(line => {
                // Remove surrounding html tags and then parse the contents of the inner text between the tags
                const withoutHtml = line
                    .replace(/^<[^>]+>/, '')
                    .replace(/<\/[^>]+>$/, '');

                const parsedContent = parse(withoutHtml, {
                    async: false,
                    breaks: false,
                    gfm: true,
                    renderer: new AnsieRenderer(true)
                }) as string;

                return line.replace(withoutHtml, parsedContent);
            })
            .join('\n');

        return result;
    }
    heading(heading: Tokens.Heading): string {
        return super.heading(heading);
    }
    hr(): string {
        return '----';
    }
    list(list: Tokens.List): string {
        return list.raw;
    }
    listitem(item: Tokens.ListItem): string {
        if (item.task) {
            return `<li>${this.checkbox({
                checked: item.checked || false
            })} ${item.text}</li>`;
        }
        return `<li>${item.text}</li>`;
    }
    checkbox(checkbox: Tokens.Checkbox): string {
        return checkbox.checked ? '[x]' : '[ ]';
    }
    paragraph(paragraph: Tokens.Paragraph): string {
        const content = this.parser.parseInline(paragraph.tokens);
        return this.simplified ? content : `<p>${content}</p>`;
    }
    table(): string {
        return '';
    }
    tablerow(): string {
        return '';
    }
    tablecell(): string {
        return '';
    }
    /**
     * span level renderer
     */
    strong(strong: Tokens.Strong): string {
        return `<span bold>${strong.text}</span>`;
    }
    em(em: Tokens.Em): string {
        return `<span italics>${em.text}</span>`;
    }
    codespan(codespan: Tokens.Codespan): string {
        return codespan.text;
    }
    br(): string {
        return '<br>';
    }
    del(del: Tokens.Del): string {
        return `<span>\x1B[9m${del.text}\x1B[0m</span>`;
    }
    link(link: Tokens.Link): string {
        const titleOrText = link.title || link.text;
        if (titleOrText === link.href) {
            return `🔗 <span fg="blue" underline="single">${link.href}</span>`;
        } else {
            return `🔗 ${titleOrText} (<span fg="blue" underline="single">${link.href}</span>)`;
        }
    }
    image(image: Tokens.Image): string {
        const titleOrText = image.title || image.text;
        if (titleOrText === image.href) {
            return `📷 <span fg="blue" underline="single">${image.href}</span>`;
        } else {
            return `📷 ${titleOrText} (<span fg="blue" underline="single">${image.href}</span>)`;
        }
    }
    text(text: Tokens.Text): string {
        return text.text;
    }
}

export function containsMultipleTopLevelTags(htmlString: string): boolean {
    // Match all tags that don't appear nested
    const topLevelTagPattern =
        /<(\w+)[^>]*>(?:(?!<\/\1>).)*<\/\1>|<(\w+)[^>]*\/>/g;
    const matches = htmlString.match(topLevelTagPattern);

    // Check if there are multiple top-level tags
    return !!matches && matches.length > 1;
}

export function convertMarkdownToAnsie(input: string): string {
    // Check to see if this uses HTML tags.  If it does, then opt out of
    //  doing the markdown parsing as there are too many conflicts with the
    //  markdown parsing and the HTML parsing
    let markup = input;
    if (!/<[^>]+>/.test(input)) {
        markup = parse(input, {
            async: false,
            breaks: false,
            gfm: true,
            renderer: new AnsieRenderer()
        }) as string;
    }

    // If the input is not surrounded with a tag then surround with a
    //  span tag to ensure that the output is a valid ANSIE document
    if (/^<[^>]+>/.test(markup) === false) {
        return `<span>${markup}</span>`;
    }

    if (containsMultipleTopLevelTags(markup)) {
        return `<body>${markup}</body>`;
    }

    return markup;
}
