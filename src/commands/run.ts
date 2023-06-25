import { readdirSync, statSync, accessSync, constants } from "fs";
import { getAppDirectories, getConfig } from "../config.js";
import { exec, spawn, spawnSync } from "child_process";
import chalk from 'chalk';

export default function run(args: string[], options: any): void {

    const [command, ...rest] = args;
    const config = getConfig();

    let directories: string[] = getAppDirectories((config));

    if (options.p) {
        runParallel(directories, command);
    } else {
        runSync(directories, command);
    }
}

function execCommandSync(directory: string, command: string) {
    const result = spawnSync("npm", ["run", command], {
        cwd: directory,
        stdio: 'inherit',
    });

    if (result.status != 0) {
        console.error(chalk.redBright('Command execution failed.'));
    } else {
        console.log(chalk.greenBright('Command executed successfully\n'));
    }
}

function execCommandAsync(directory: string, command: string) {
    return new Promise((resolve, reject) => {
        console.log(chalk.greenBright(`Run ${command} for ${directory}`));

        const childProcess = spawn("npm", ["run", command], {
            cwd: directory,
            stdio: 'inherit'
        });

        let stdout = '';
        let stderr = '';

        childProcess.stdout?.on('data', (data) => {
            if (!(/^\s*$/.test(data.toString())))
                console.log(`${chalk.bgBlueBright(directory)}\n}`);

            stdout += data.toString();
        });

        childProcess.stderr?.on('data', (data) => {
            if (!(/^\s*$/.test(data.toString())))
                console.log(`${chalk.bgBlueBright('directory')}\n}`);

            stderr += data.toString();
        });

        childProcess.on('error', (error) => {
            reject(error);
        });

        childProcess.on('close', (code) => {
            if (code === 0) {
                resolve({ stdout, stderr });
            } else {
                reject(new Error(`Command execution failed with code ${code}`));
            }
        });
    });
}

function runSync(directories: string[], command: string): void {
    directories.forEach(async directory => {
        await execCommandSync(directory, command);
    });
}

type TaskCallback<T> = (err: Error | null, result?: T) => void;
function runParallel(directories: string[], command: string) {
    const promises: Promise<any>[] = [];
    directories.forEach((directory) => {
        const promise = execCommandAsync(directory, command);
        promises.push(promise);
    });

    // Wait for all promises to resolve
    Promise.all(promises)
        .then((results) => {
            console.log('All tasks completed successfully !');
        })
        .catch((err) => {
            console.error('An error occurred:', err);
        });
}