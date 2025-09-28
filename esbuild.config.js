// esbuild.config.js
const esbuild = require('esbuild');

async function runBuild() {
  const commonBuildOptions = {
    entryPoints: ['src/index.jsx'],
    outfile: 'public/bundle.js',
    bundle: true,
    target: ['chrome60', 'firefox60', 'safari11', 'edge20'],
    sourcemap: 'inline',
    jsx: 'automatic',
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
