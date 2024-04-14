import { parse, Renderer } from 'marked';

class AnsieRenderer extends Renderer {
    code(code: string): string {
        return `<p marginLeft="4" fg="gray">${code}</p>`;
    }
    blockquote(quote: string): string {
        return `<p marginLeft="4">${quote}</p>`;
    }
    html(html: string): string {
        return html;
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
        return `<p>${text}</p>`;
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
export function convertMarkdownToAnsie(input: string): string {
    const html = parse(input, {
        async: false,
        breaks: false,
        gfm: true,
        renderer: new AnsieRenderer()
    }) as string;

    return html;
}
