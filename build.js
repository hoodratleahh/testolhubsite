/**
 * Build script: minifies HTML, CSS, and JS. Use --obfuscate for stronger JS protection.
 * Run: npm run build       (minify only)
 * Run: npm run build:obfuscate   (minify + obfuscate JS)
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const obfuscate = process.argv.includes('--obfuscate');

async function build() {
  // Create dist folder
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Load minifiers
  const CleanCSS = require('clean-css');
  const { minify: minifyHtml } = require('html-minifier-terser');
  const { minify: minifyJs } = require('terser');

  let obfuscateJs;
  if (obfuscate) {
    obfuscateJs = require('javascript-obfuscator').obfuscate;
  }

  console.log('Building...');

  // Minify CSS
  const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
  const cssResult = new CleanCSS({ level: 2 }).minify(css);
  const cssMin = cssResult.styles;
  fs.writeFileSync(path.join(distDir, 'styles.min.css'), cssMin);
  console.log('  ✓ CSS minified');

  // Minify or obfuscate JS
  const js = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
  let jsOutput;
  if (obfuscate) {
    jsOutput = obfuscateJs(js, {
      compact: true,
      controlFlowFlattening: false,
      deadCodeInjection: false,
      debugProtection: false,
      disableConsoleOutput: false,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      numbersToExpressions: false,
      renameGlobals: false,
      selfDefending: false,
      simplify: true,
      splitStrings: false,
      stringArray: true,
      stringArrayCallsTransform: false,
      stringArrayEncoding: ['base64'],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 1,
      stringArrayWrappersType: 'variable',
      stringArrayThreshold: 0.75,
      transformObjectKeys: false,
      unicodeEscapeSequence: false,
    }).getObfuscatedCode();
    console.log('  ✓ JS obfuscated');
  } else {
    const jsResult = await minifyJs(js, {
      compress: { drop_console: false },
      mangle: true,
      format: { comments: false },
    });
    jsOutput = jsResult.code;
    console.log('  ✓ JS minified');
  }
  fs.writeFileSync(path.join(distDir, 'script.min.js'), jsOutput);

  // Minify HTML and update asset paths
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  html = html.replace(/href="styles\.css"/, 'href="styles.min.css"');
  html = html.replace(/src="script\.js[^"]*"/, 'src="script.min.js"');
  const htmlMin = await minifyHtml(html, {
    collapseWhitespace: true,
    minifyCSS: false,
    minifyJS: false,
    removeComments: true,
    removeRedundantAttributes: true,
  });
  fs.writeFileSync(path.join(distDir, 'index.html'), htmlMin);
  console.log('  ✓ HTML minified');

  // Copy assets and screenshots
  const copyDir = (src, dest) => {
    if (fs.existsSync(src)) {
      fs.cpSync(src, dest, { recursive: true });
      console.log('  ✓ Copied', path.basename(src));
    }
  };
  copyDir(path.join(__dirname, 'assets'), path.join(distDir, 'assets'));
  copyDir(path.join(__dirname, 'screenshots'), path.join(distDir, 'screenshots'));

  console.log('\nDone! Output in /dist folder.');
  console.log('Deploy the contents of dist/ to your host.');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
