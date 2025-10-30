const esbuild = require('esbuild');
require('dotenv').config();

async function runBuild() {
  const envConfigModule = require('./src/env-var/env-config');

  // Now, safely extract the variables, or throw if they're not there
  const clientEnvVars = envConfigModule.EnvVars.getData();

  const isWatching = process.argv.includes('--watch');

  const defineEnv = {};
  for (const item of clientEnvVars) {
    // esbuild expects define values to be valid JS literals (e.g. string literals
    // must be quoted). Use JSON.stringify so strings/numbers/booleans are
    // converted to proper JS literal representations.
    defineEnv[`process.env.${item.name}`] = JSON.stringify(item.value);
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
