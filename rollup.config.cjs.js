import typescript from '@rollup/plugin-typescript';

export default async () => ({
    input: './src/index.ts',
    plugins: [typescript({ declarationDir: './dist/cjs' })],
    output: [
        {
            file: './dist/cjs/index.js',
            format: 'cjs'
        }
    ]
});
