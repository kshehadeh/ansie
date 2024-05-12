import { parse, Renderer } from 'marked';

class AnsieRenderer extends Renderer {
    simplified: boolean;

    constructor(simplified: boolean = false) {
        super();
        this.simplified = simplified;
    }

    code(code: string): string {
        return `<p marginLeft="4" fg="gray">${code}</p>`;
    }
    blockquote(quote: string): string {
        return `<p marginLeft="4">${quote}</p>`;
    }
    html(html: string): string {
        // This html might contain markdown itself so split into lines, parse each line and then join
        //  back together
        const result = html
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
    heading(text: string, level: number, raw: string): string {
        return super.heading(text, level, raw);
    }
    hr(): string {
        return '----';
    }
    list(body: string): string {
        return body;
    }
    listitem(text: string, task: boolean, checked: boolean): string {
        if (task) {
            return `<li>${this.checkbox(checked)} ${text}</li>`;
        }
        return `<li>${text}</li>`;
    }
    checkbox(checked: boolean): string {
        return checked ? '[x]' : '[ ]';
    }
    paragraph(text: string): string {
        return this.simplified ? text : `<p>${text}</p>`;
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
    strong(text: string): string {
        return `<span bold>${text}</span>`;
    }
    em(text: string): string {
        return `<span italics>${text}</span>`;
    }
    codespan(text: string): string {
        return text;
    }
    br(): string {
        return '<br>';
    }
    del(text: string): string {
        return `<span>\x1B[9m${text}\x1B[0m</span>`;
    }
    link(href: string, title: string | null | undefined, text: string): string {
        const titleOrText = title || text;
        if (titleOrText === href) {
            return `🔗 <span fg="blue" underline="single">${href}</span>`;
        } else {
            return `🔗 ${titleOrText} (<span fg="blue" underline="single">${href}</span>)`;
        }
    }
    image(href: string, title: string | null, text: string): string {
        const titleOrText = title || text;
        if (titleOrText === href) {
            return `📷 <span fg="blue" underline="single">${href}</span>`;
        } else {
            return `📷 ${titleOrText} (<span fg="blue" underline="single">${href}</span>)`;
        }
    }
    text(text: string): string {
        return text;
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
