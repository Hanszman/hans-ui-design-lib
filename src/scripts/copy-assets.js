import { cpSync, existsSync, mkdirSync, rmSync } from 'fs';
import path from 'path';

const sourceDir = path.resolve('src', 'assets');
const targetDir = path.resolve('dist', 'assets');

if (!existsSync(sourceDir)) {
  process.exit(0);
}

rmSync(targetDir, { force: true, recursive: true });
mkdirSync(path.dirname(targetDir), { recursive: true });
cpSync(sourceDir, targetDir, { recursive: true });
