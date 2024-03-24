import typescript from '@rollup/plugin-typescript';

export default (async () => ({
	input: './index.ts',
	plugins: [
		typescript(),
	],
	output: {
        file: 'dist/index.js',
        format: 'esm'
	}
}))();
