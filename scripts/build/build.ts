import { basename, resolve, join } from 'path';
import fs from 'fs';
import { build, type BuildArtifact, type Target } from 'bun';

const projectDir = resolve(import.meta.dir, '../..');
const targets: Target[] = ['node', /*'bun'*/];

for (const target of targets) {
    console.log("Building for target:", target)
    const outputs = await build({
        entrypoints: [
            join(projectDir, './index.ts'),
            join(projectDir, './cli.ts'),
        ],
        outdir: resolve(projectDir, `./dist/${target}`),
        minify: false,
        sourcemap: 'external',
        splitting: true,
        target,
    });

    // Set the cli files as executable
    outputs.outputs.forEach((out: BuildArtifact) => {
        if (basename(out.path) === 'cli.js') {
            fs.chmodSync(out.path, '711')
        }
    })
}
