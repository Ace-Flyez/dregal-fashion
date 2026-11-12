import { readFile } from "node:fs/promises";
const files = ["js/store.js", "js/shop.js", "js/compliance.js", "js/monitoring.js"];
for (const file of files) await readFile(file, "utf8");
console.log(`Checked ${files.length} browser scripts.`);
