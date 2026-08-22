import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "client/src/lib/imageRegistry.ts");
const registry = fs.readFileSync(registryPath, "utf8");
const paths = [...registry.matchAll(/asset\("([^"]+)"\)/g)].map((match) => match[1]);
const missing = paths.filter((assetPath) => !fs.existsSync(path.join(root, "client/public/assets/images", assetPath)));

if (missing.length) {
  console.error(`Missing image assets:\n${missing.map((item) => `- ${item}`).join("\n")}`);
  process.exit(1);
}

console.log(`Verified ${paths.length} local image registry assets.`);
