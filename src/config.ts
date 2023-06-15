import { existsSync, readdirSync, statSync, readFileSync } from "fs"
import YAML from 'yaml'

export interface Config {
    apps: string[];
}

export function getConfig(): Config {
    const path: string = `${process.cwd()}/easymonorepo-config.yml`;

    if (!existsSync(path))
        throw new Error(`File "easymonorepo-config.yml" not found !`)

    const file = readFileSync(path, 'utf8')
    return YAML.parse(file)
}

export function getAppDirectories(config: Config): string[] {
    let directories: string[] = [];

    config.apps.forEach(path => {
        const foundDirectories = readdirSync(path)
            .filter((file) => {
                const filePath = `${path}${file}`;
                return statSync(filePath).isDirectory();
            });

        directories.push(...foundDirectories.map(dir => `${path}${dir}`));
    });

    return directories;
}