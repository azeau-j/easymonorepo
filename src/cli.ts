#!/usr/bin/env node
import { program } from 'commander';
import install from './commands/install.js';
import run from './commands/run.js';

function main(argv: string[]) {
    program
        .command('install')
        .description('')
        .action(install);

    program
        .command('run <args...>')
        .description('')
        .option('-p', '--parallel', '')
        .action(run)

    program.parse(argv);
}

main(process.argv);
