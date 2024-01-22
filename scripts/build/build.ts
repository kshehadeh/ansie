import { basename, resolve, join } from 'path';
import fs from 'fs';
import { build, type BuildArtifact, type Target } from 'bun';

const projectDir = resolve(import.meta.dir, '../..');
const targets: Target[] = ['node', /*'bun'*/];

for (const target of targets) {
    console.log("Building for target:", target)
    console.log("Output dir:", resolve(projectDir, `./dist/${target}`))

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

    if (outputs.success) {
        console.info("Successfully built package");
    } else {
        console.error("Failed to build package:");
        console.error(outputs.logs.join('\n'))
    }
}
