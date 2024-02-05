import { basename, resolve, join } from 'path';
import fs from 'fs';
import { build, type BuildArtifact, type Target } from 'bun';
import { exit } from 'process';

const projectDir = resolve(import.meta.dir, '../..');
const targets: Target[] = ['node' /*'bun'*/];
const errors: string[] = [];

for (const target of targets) {
    console.log('Building for target:', target);
    console.log('Output dir:', resolve(projectDir, `./dist/${target}`));

    const outputs = await build({
        entrypoints: [
            join(projectDir, './src/index.ts'),
            join(projectDir, './src/cli.ts'),
        ],
        outdir: resolve(projectDir, `./dist/${target}`),
        minify: false,
        sourcemap: 'external',
        splitting: false,
        target,
    });

    // Set the cli files as executable
    outputs.outputs.forEach((out: BuildArtifact) => {
        if (basename(out.path) === 'cli.js') {
            fs.chmodSync(out.path, '711');
        }
    });

    if (outputs.success) {
        console.info('Successfully built package');
    } else {
        errors.push(`Error during build of package: ${target}`);
        console.error('Failed to build package:');
        console.error(outputs.logs.join('\n'));
    }
}

exit(errors.length > 0 ? 1 : 0);
