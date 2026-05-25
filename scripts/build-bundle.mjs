import { build } from "esbuild";

await build({
  entryPoints: ["src/bin.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  outfile: "dist/cli.cjs",
});
