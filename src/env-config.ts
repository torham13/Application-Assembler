interface EnvVarMetadata<K extends string, T> {
  readonly name: K;
  readonly type: 'string' | 'number' | 'boolean' | undefined; // Explicit type string for validation
  readonly defaultValue: T;
  readonly description?: string; // Optional description for documentation
}

// Helper function to make it easier to define env vars with correct type inference.
function defineEnvVar<K extends string, T>(metadata: EnvVarMetadata<K, T>): EnvVarMetadata<K, T> {
  return metadata;
}

// 2. This is your "ONE SPOT": an array of all client-side environment variable definitions.
//    The `as const` assertion is CRUCIAL for TypeScript to infer the most specific types.
export const envVarDefinitions = [
  defineEnvVar({
    name: 'VITE_FIREBASE_DATACONNECT_URL',
    type: 'string',
    defaultValue: 'http://localhost:9010/graphql',
    description: 'The URL for the Firebase Data Connect GraphQL endpoint.',
  }),
  defineEnvVar({
    name: 'VITE_FIREBASE_API_KEY',
    type: 'string',
    defaultValue: '',
    description: 'The Firebase client-side API Key.',
  }),
  defineEnvVar({
    name: 'VITE_FIREBASE_AUTH_DOMAIN',
    type: 'string',
    defaultValue: '',
    description: 'An example feature flag.',
  }),
  defineEnvVar({
    name: 'VITE_FIREBASE_PROJECT_ID',
    type: 'string',
    defaultValue: '',
    description: 'Maximum number of items to fetch/display.',
  }),
  defineEnvVar({
    name: 'VITE_FIREBASE_STORAGE_BUCKET',
    type: 'string',
    defaultValue: '',
    description: 'An example feature flag.',
  }),
  defineEnvVar({
    name: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
    type: 'string',
    defaultValue: '',
    description: 'Maximum number of items to fetch/display.',
  }),
  defineEnvVar({
    name: 'VITE_FIREBASE_APP_ID',
    type: 'string',
    defaultValue: '',
    description: 'An example feature flag.',
  }),
  defineEnvVar({
    name: 'VITE_FIREBASE_MEASUREMENT_ID',
    type: 'string',
    defaultValue: '',
    description: 'Maximum number of items to fetch/display.',
  }),
  defineEnvVar({
    name: 'VITE_FIREBASE_AUTH_EMULATOR_PORT',
    type: 'number',
    defaultValue: 0,
    description: 'An example feature flag.',
  }),
  defineEnvVar({
    name: 'VITE_FIREBASE_DATA_CONNECT_EMULATOR_PORT',
    type: 'number',
    defaultValue: 0,
    description: 'Maximum number of items to fetch/display.',
  }),
  // Add more environment variable definitions here as needed.
  // Add all other client-side environment variables here
] as const;

// 3. --- TYPE DERIVATION ---
//    These complex types automatically create the ClientEnv interface from envVarDefinitions.

// Extracts a union of all possible `name` string literals from envVarDefinitions.
type EnvVarNames = typeof envVarDefinitions[number]['name'];

// Creates the ClientEnv interface using a Mapped Type.
// For each `K` (name) in `EnvVarNames`, it finds the corresponding `defaultValue` type `T`.
export type ClientEnv = {
  [K in EnvVarNames]: (typeof envVarDefinitions)[number] extends { name: K, defaultValue: infer T } ? T : never;
};

// 4. --- DEFAULT VALUES DERIVATION ---
//    Creates an object containing all the default values, correctly typed as ClientEnv.
export const defaultClientEnv: ClientEnv = envVarDefinitions.reduce((acc, def) => {
  // We need to assert types here because `reduce` doesn't always infer complex mapped types correctly.
  (acc as any)[def.name] = def.defaultValue;
  return acc;
}, {} as ClientEnv); // Initialize `acc` with the desired `ClientEnv` type.


// 5. Utility function to get the actual environment variable value during Node.js runtime.
//    (Used primarily in esbuild.config.js to build the `define` object)
export function getClientEnvVar(key: keyof ClientEnv): string | number | boolean {
  // Prioritize environment variables loaded by dotenv, then fall back to our defined defaults.
  // Note: process.env values are ALWAYS strings, so we handle type conversion if necessary
  const envValue = process.env[key];
  const defaultValue = defaultClientEnv[key];
  const definition = envVarDefinitions.find(def => def.name === key);

  if (envValue !== undefined) {
    // If an environment variable is set, parse it according to its defined type
    switch (definition?.type) {
      case 'number': return Number(envValue);
      case 'boolean': return envValue.toLowerCase() === 'true';
      case 'string': return envValue;
      default: return envValue; // Fallback for unknown types (shouldn't happen with strict types)
    }
  }
  // Otherwise, use the default value from our config
  return defaultValue;
}