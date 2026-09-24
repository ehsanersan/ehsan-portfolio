import { build } from "esbuild";
import { readFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "..");
const entry = resolve(root, "cms/worker.mjs");

const exactFiles = {
  zod: require.resolve("zod"),
};

await build({
  stdin: {
    contents: await readFile(entry, "utf8"),
    resolveDir: dirname(entry),
    sourcefile: entry,
    loader: "js",
  },
  outfile: resolve(root, ".data/cms-worker.mjs"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  plugins: [
    {
      name: "workspace-only-resolver",
      setup(build) {
        build.onResolve({ filter: /.*/ }, (args) => {
          if (exactFiles[args.path]) return { path: exactFiles[args.path] };
          if (!args.path.startsWith(".")) {
            throw new Error(`Unexpected package import: ${args.path}`);
          }
          return { path: resolve(args.resolveDir, args.path) };
        });
        build.onLoad({ filter: /.*/ }, async (args) => ({
          contents: await readFile(args.path, "utf8"),
          loader: extname(args.path) === ".json" ? "json" : "js",
          resolveDir: dirname(args.path),
        }));
      },
    },
  ],
});

console.log("CMS Worker bundled inside the project workspace.");
