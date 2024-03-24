import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default (async () => ({
	input: './index.ts',
	plugins: [
		typescript(),
		json()
	],
	output: {
        file: 'dist/index.js',
        format: 'esm'
	}
}))();
