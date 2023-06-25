import { readdirSync, statSync, accessSync, constants } from "fs";
import { getAppDirectories, getConfig } from "../config.js";
import { spawnSync } from "child_process";
import chalk from 'chalk';

export default function (): void {
    const config = getConfig();

    let directories: string[] = getAppDirectories((config));

    directories.forEach(directory => {
        if (!IsNodeProject(directory)) {
            console.error(chalk.redBright(`No package.json find in ${directory}. This directory will be skip.`));
            return;
        }

        console.log(chalk.greenBright(`Run Install for ${directory}`));

        const result = spawnSync("npm", ["install"], {
            cwd: directory,
            stdio: 'inherit',
        });

        if (result.status != 0) {
            console.error(chalk.redBright('Command execution failed.'));
        } else {
            console.log(chalk.greenBright('Command executed successfully\n'));
        }
    });
}

function IsNodeProject(directoryPath: string): boolean {
    try {
        accessSync(`${directoryPath}/package.json`, constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}