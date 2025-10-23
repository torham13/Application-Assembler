import fs from 'fs';

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
        const filePath: string = 'env-var-data.json';

        if (fs.existsSync(filePath)) {

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