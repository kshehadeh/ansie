#!/usr/bin/env node
import yargs from 'yargs';
import * as fs from 'fs';
import { hideBin } from 'yargs/helpers';
import { parser, compile } from 'ansie';

var name = "ansie-cli";
var description = "A simple CLI for the ansie library.";
var version = "0.6.6";
var type = "module";
var main = "./dist/index.js";
var bin = {
	ansie: "./dist/index.js"
};
var scripts = {
	dev: "node dist/index.js --",
	test: "echo \"Error: no tests for this module yet\"",
	lint: "eslint .",
	build: "rollup -c",
	"build:watch": "rollup -c -w"
};
var dependencies = {
	ansie: "0.8.4",
	yargs: "^17.7.2"
};
var devDependencies = {
	"@rollup/plugin-json": "^6.1.0",
	"@types/bun": "latest"
};
var peerDependencies = {
	typescript: "^5.0.0"
};
var pkg = {
	name: name,
	description: description,
	version: version,
	type: type,
	main: main,
	bin: bin,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	peerDependencies: peerDependencies
};

// A command parser for the composer CLI that takes the following arguments:
//       --help     Show help                                             [boolean]
//       --version  Show version number                                   [boolean]
//   -i, --input    Specify the input file                                 [string]
//   -m, --markup   Specify the markup text (instead of a file)            [string]
//   -o, --output   Specify the output file                                [string]
//   -a, --ast      Output the AST instead of the compiled text           [boolean]
function readStdinWithTimeout(timeout) {
    return new Promise((resolve, reject) => {
        let inputData = "";
        // Set a timeout to abort reading
        const timer = setTimeout(() => {
            process.stdin.pause();
            resolve("");
        }, timeout);
        process.stdin.on("data", (data) => {
            inputData += data;
        });
        process.stdin.on("end", () => {
            clearTimeout(timer);
            resolve(inputData);
        });
        process.stdin.on("error", (err) => {
            clearTimeout(timer);
            reject(err);
        });
        process.stdin.resume();
    });
}
async function handleInput() {
    const stdInput = await readStdinWithTimeout(10);
    const y = yargs(hideBin(process.argv))
        .scriptName("ansie")
        .version(pkg.version)
        .usage("Usage: ansie [markup] -i [input] -o [output]")
        .positional("markup", {
        alias: "m",
        type: "string",
        description: "Specify the markup text (instead of a file)",
    })
        .option("input", {
        alias: "i",
        type: "string",
        description: "Specify the input file",
    })
        .option("output", {
        alias: "o",
        type: "string",
        description: "Specify the output file",
    })
        .option("ast", {
        alias: "a",
        type: "boolean",
        description: "Output the AST instead of the compiled text",
    })
        .check((argv) => {
        const markup = argv._.join(" ");
        if (argv.input && markup.length > 0) {
            throw new Error("You must specify either --input or markup as a positional argument, not both");
        }
        if (!argv.input && !markup && !stdInput) {
            throw new Error("You must specify either --input or --markup so that the compiler knows what to compile");
        }
        if (argv.input) {
            if (!fs.existsSync(argv.input)) {
                throw new Error(`The input file ${argv.input} does not exist`);
            }
        }
        return true;
    });
    const argv = await y.argv;
    if (argv["help"]) {
        y.showHelp();
    }
    else if (argv["version"]) {
        console.log(pkg.version);
    }
    else {
        let input = "";
        if (argv.input) {
            // Read the input file into the string `input`
            input = fs.readFileSync(argv.input, "utf8");
        }
        else if (argv._.length > 0) {
            input = argv._.join(" ");
        }
        else if (stdInput) {
            input = stdInput;
        }
        if (input) {
            let output = "";
            if (argv.ast) {
                output = JSON.stringify(parser.markdown(input), null, 4);
            }
            else {
                output = compile({ markup: input }) || "";
            }
            if (output) {
                if (argv.output) {
                    fs.writeFileSync(argv.output, output);
                }
                else {
                    console.log(output);
                }
            }
            else {
                throw new Error("No output was generated");
            }
        }
    }
}
handleInput()
    .then(() => process.exit(0))
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
