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
      <h1>Hans UI Design Lib - CDN Preview:</h1>
      <hans-button><a href="/hans-ui-design-lib.css">CSS Link File</a></hans-button>
      <hans-button><a href="/hans-ui-web-components.js">JS Link File</a></hans-button>
    </body>
  </html>
`;

const filePath = path.resolve('cdn', 'index.html');
writeFileSync(filePath, html);
