import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const cache = new Map();
export function loadTs(url) {
  const filename = url instanceof URL ? url.pathname : path.resolve(url);
  if (cache.has(filename)) return cache.get(filename).exports;
  const compiled = { exports: {} }; cache.set(filename, compiled);
  const source = fs.readFileSync(filename, 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const localRequire = specifier => {
    if (specifier.endsWith('.css')) return {};
    if (specifier.startsWith('.') || specifier.startsWith('@/')) {
      const base = specifier.startsWith('@/') ? path.resolve('' + specifier.slice(2)) : path.resolve(path.dirname(filename), specifier);
      const file = [base, `${base}.ts`, `${base}.tsx`].find(p => fs.existsSync(p) && fs.statSync(p).isFile());
      if (file && /\.tsx?$/.test(file)) return loadTs(file);
    }
    return require(specifier);
  };
  new Function('require', 'module', 'exports', js)(localRequire, compiled, compiled.exports);
  return compiled.exports;
}
