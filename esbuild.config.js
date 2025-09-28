// esbuild.config.js
const esbuild = require('esbuild');
require('dotenv').config();

async function runBuild() {
  const commonBuildOptions = {
    entryPoints: ['src/index.jsx'],
    outfile: 'public/bundle.js',
    bundle: true,
    target: ['chrome60', 'firefox60', 'safari11', 'edge20'],
    sourcemap: 'inline',
    jsx: 'automatic',
    define: {
      'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(process.env.VITE_FIREBASE_API_KEY),
      'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.VITE_FIREBASE_AUTH_DOMAIN),
      'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(process.env.VITE_FIREBASE_PROJECT_ID),
      'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.VITE_FIREBASE_STORAGE_BUCKET),
      'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
      'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(process.env.VITE_FIREBASE_APP_ID),
      'process.env.VITE_FIREBASE_MEASUREMENT_ID': JSON.stringify(process.env.VITE_FIREBASE_MEASUREMENT_ID),
      'process.env.VITE_FIREBASE_AUTH_EMULATOR_PORT': JSON.stringify(process.env.VITE_FIREBASE_AUTH_EMULATOR_PORT),
      'process.env.VITE_FIREBASE_DATA_CONNECT_EMULATOR_PORT': JSON.stringify(process.env.VITE_FIREBASE_DATA_CONNECT_EMULATOR_PORT),
    },
  };

  if (process.argv.includes('--watch')) {
    console.log('esbuild: performing initial build for watch mode...');
    // Perform an immediate build first
    await esbuild.build(commonBuildOptions);
    console.log('esbuild: initial build complete. Starting watch mode...');

    // Then, create context and start watching for subsequent changes
    const context = await esbuild.context(commonBuildOptions);
    await context.watch();
  } else {
    console.log('esbuild: performing a single build...');
    await esbuild.build(commonBuildOptions);
    console.log('esbuild: single build finished.');
  }
}

runBuild().catch((e) => {
  console.error("esbuild failed:", e);
  process.exit(1);
});
