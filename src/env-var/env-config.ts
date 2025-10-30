import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Compute a module-local directory that works in both CommonJS and ESM.
// When running as ESM (esbuild, import.meta.url), __dirname is not defined,
// so fall back to using fileURLToPath(import.meta.url).
const moduleDir = (typeof __dirname !== 'undefined')
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

interface EnvVarMetadataRaw<K extends string> {
    readonly name: K;
    readonly defaultValue: string | number | boolean;
    readonly description?: string;
}

interface EnvVarMetadata<K extends string> {
    readonly name: K;
    readonly type: 'string' | 'number' | 'boolean' | undefined;
    readonly value: string | number | boolean;
    readonly defaultValue: string | number | boolean;
    readonly description?: string;
}

export class EnvVars {
    private static data: EnvVarMetadata<string>[];

    private constructor() {
    const filePath: fs.PathLike = path.join(moduleDir, 'env-var-data.json');

        console.log(`Attempting to load environment variable data from: ${filePath}`);

        if (fs.existsSync(filePath)) {
            console.log(`Successfully found environment variable data file.`);
            console.log(`Loading environment variable data from: ${filePath}`);

            const readData = fs.readFileSync(filePath, 'utf-8');
            const parsedData: EnvVarMetadataRaw<string>[] = JSON.parse(readData);

            EnvVars.data = parsedData.map(envVar => ({
                ...envVar,
                type: typeof envVar.defaultValue as 'string' | 'number' | 'boolean' | undefined,
                value: process.env[envVar.name] as any || envVar.defaultValue,
            }));
        } else {
            throw new Error(`Environment variable data file not found at path: ${filePath}`);
        }
    }

    public static getData(): EnvVarMetadata<string>[] {
        if (!EnvVars.data) {
            new EnvVars();
        }
        return EnvVars.data;
    }
}