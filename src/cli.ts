#!/usr/bin/env node
import { program } from 'commander';
import install from './commands/install.js';

function main(argv: string[]) {
    program
        .command('install')
        .description('')
        .action(install);

    program.parse(argv);
}

main(process.argv);
