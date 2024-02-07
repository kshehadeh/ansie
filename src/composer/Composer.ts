import { compile } from '../compiler/compile';
import type { CompilerFormat } from '../compiler/types';
import { ComposerNode } from './nodes/ComposerNode';
import { type AnsieTheme } from '../themes';
import { BodyComposerNode } from './nodes/BodyComposerNode';

/**
 * Used to compose a string of text with styles and formatting.
 */
export class Composer {
    private _body: BodyComposerNode;
    private _theme: AnsieTheme;

    constructor(theme: AnsieTheme) {
        this._theme = theme;
        this._body = new BodyComposerNode({ theme });
    }

    public add(node: ComposerNode | ComposerNode[]) {
        const nodeArr = Array.isArray(node) ? node : [node];
        nodeArr.forEach(n => {
            this._body.add(n);
        });
    }

    compile() {
        return this.compileTo('ansi');
    }

    compileTo(format: CompilerFormat) {
        return compile({
            markup: this.toString(),
            output: format,
            theme: this.theme,
        });
    }

    toString() {
        return this._body.toString();
    }

    get theme() {
        return this._theme;
    }
}

export type ComposerNodeCompatible = ComposerNode | string | number | boolean;
