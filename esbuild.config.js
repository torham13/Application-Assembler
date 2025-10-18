const esbuild = require('esbuild');
require('dotenv').config();

async function runBuild() {
  const envConfigModule = require('./src/env-config');

  console.log("--- DEBUG: Full envConfigModule object ---");
  console.log(envConfigModule);

  console.log("\n--- DEBUG: envVarDefinitions property ---");
  console.log(envConfigModule.envVarDefinitions);

  console.log("\n--- DEBUG: Type of envVarDefinitions property ---");
  console.log(typeof envConfigModule.envVarDefinitions);

  console.log("\n--- DEBUG: Is envVarDefinitions an Array? ---");
  console.log(Array.isArray(envConfigModule.envVarDefinitions));

  // Now, safely extract the variables, or throw if they're not there
  const envVarDefinitions = envConfigModule.envVarDefinitions;
  const getClientEnvVar = envConfigModule.getClientEnvVar;

  const isWatching = process.argv.includes('--watch');

  const defineEnv = {};
  for (const def of envVarDefinitions) {
    // getClientEnvVar correctly fetches from process.env or falls back to default.
    // JSON.stringify is essential for esbuild's define replacement.
    defineEnv[`process.env.${def.name}`] = JSON.stringify(getClientEnvVar(def.name));
  }

  const config = {
    entryPoints: ['src/index.tsx'],
    bundle: true,
    outfile: 'public/bundle.js',
    platform: 'browser', // Explicitly target browser environment
    define: defineEnv, // Inject the environment variables here
    target: ['chrome60', 'firefox60', 'safari11', 'edge20'],
    sourcemap: 'inline',
    jsx: 'automatic',
  };

  if (isWatching) {
    console.log('esbuild: performing initial build for watch mode...');
    // Perform an immediate build first
    await esbuild.build(config);
    console.log('esbuild: initial build complete. Starting watch mode...');

    // Then, create context and start watching for subsequent changes
    const context = await esbuild.context(config);
    await context.watch();
  } else {
    console.log('esbuild: performing a single build...');
    await esbuild.build(config);
    console.log('esbuild: single build finished.');
  }
}

runBuild().catch((e) => {
  console.error("esbuild failed:", e);
  process.exit(1);
});
