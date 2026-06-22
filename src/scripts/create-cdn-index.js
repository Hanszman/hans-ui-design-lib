import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const packageJsonPath = path.resolve('package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const releaseVersion = packageJson.version;
const cssFileName = 'hans-ui-design-lib.css';
const jsFileName = 'hans-ui-web-components.js';
const versionedCssFileName = `hans-ui-design-lib-${releaseVersion}.css`;
const versionedJsFileName = `hans-ui-web-components-${releaseVersion}.js`;
const assetManifest = {
  version: releaseVersion,
  css: {
    raw: `/${cssFileName}`,
    versioned: `/${cssFileName}?v=${releaseVersion}`,
    versionedFile: `/${versionedCssFileName}`,
  },
  js: {
    raw: `/${jsFileName}`,
    versioned: `/${jsFileName}?v=${releaseVersion}`,
    versionedFile: `/${versionedJsFileName}`,
  },
};

const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Hans UI Design CDN</title>
      <link rel="stylesheet" href="${assetManifest.css.versioned}"/>
      <script src="${assetManifest.js.versioned}"></script>
    </head>
    <body>
      <div class="!mx-5 !my-3">
        <h1 class="!text-xl !font-bold">Hans UI Design Lib - CDN Preview:</h1>
        <p class="!mb-3 !font-mono">Current CDN version: ${releaseVersion}</p>
        <div class="flex !my-2">
          <hans-button class="!mx-2"><a href="${assetManifest.css.raw}">CSS Link File</a></hans-button>
          <hans-button class="!mx-2"><a href="${assetManifest.js.raw}">JS Link File</a></hans-button>
          <hans-button class="!mx-2"><a href="${assetManifest.css.versioned}">Versioned CSS Link</a></hans-button>
          <hans-button class="!mx-2"><a href="${assetManifest.js.versioned}">Versioned JS Link</a></hans-button>
          <hans-button class="!mx-2"><a href="${assetManifest.css.versionedFile}">Versioned CSS File</a></hans-button>
          <hans-button class="!mx-2"><a href="${assetManifest.js.versionedFile}">Versioned JS File</a></hans-button>
        </div>
      </div>
    </body>
  </html>
`;

const cdnDirectoryPath = path.resolve('cdn');
const filePath = path.resolve('cdn', 'index.html');
const manifestPath = path.resolve('cdn', 'version.json');
const cssSourcePath = path.resolve('cdn', cssFileName);
const jsSourcePath = path.resolve('cdn', jsFileName);
const cssVersionedPath = path.resolve('cdn', versionedCssFileName);
const jsVersionedPath = path.resolve('cdn', versionedJsFileName);

mkdirSync(cdnDirectoryPath, { recursive: true });
copyFileSync(cssSourcePath, cssVersionedPath);
copyFileSync(jsSourcePath, jsVersionedPath);
writeFileSync(filePath, html);
writeFileSync(`${manifestPath}`, `${JSON.stringify(assetManifest, null, 2)}\n`);
