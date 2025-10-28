import { writeFileSync } from 'fs';
import path from 'path';

const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Hans UI Design CDN</title>
      <link rel="stylesheet" href="/hans-ui-design-lib.css"/>
      <script src="/hans-ui-web-components.js"></script>
    </head>
    <body>
      <div class="!mx-5 !my-3">
        <h1 class="!text-xl !font-bold">Hans UI Design Lib - CDN Preview:</h1>
        <div class="flex !my-2">
          <hans-button class="!mx-2"><a href="/hans-ui-design-lib.css">CSS Link File</a></hans-button>
          <hans-button class="!mx-2"><a href="/hans-ui-web-components.js">JS Link File</a></hans-button>
        </div>
      </div>
    </body>
  </html>
`;

const filePath = path.resolve('cdn', 'index.html');
writeFileSync(filePath, html);
