import typescript from '@rollup/plugin-typescript';

export default async () => ({
    input: './src/index.ts',
    plugins: [typescript()],
    output: [
        {
            file: 'dist/cjs/index.js',
            format: 'cjs',
        },
        {
            file: 'dist/esm/index.js',
            format: 'esm',
        },
    ],
});
