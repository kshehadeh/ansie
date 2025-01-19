import typescript from '@rollup/plugin-typescript';

export default async () => ({
    input: './src/index.ts',
    plugins: [typescript({ declarationDir: './dist/esm' })],
    output: [
        {
            file: './dist/esm/index.js',
            format: 'esm'
        }
    ]
});
