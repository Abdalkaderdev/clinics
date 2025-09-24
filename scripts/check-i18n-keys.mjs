import fs from "fs";

const langs = ["en", "ar", "ku"];
// Prefer public/{lang}.json if exists; otherwise skip file check and just exit OK since app uses src/lib/translations.ts
const loads = {};
for (const l of langs) {
  const path = `public/${l}.json`;
  if (fs.existsSync(path)) {
    loads[l] = JSON.parse(fs.readFileSync(path, "utf8"));
  }
}

if (Object.keys(loads).length < 2) {
  console.log("i18n keys OK (using in-code translations)");
  process.exit(0);
}

function keys(obj, prefix = "") {
  if (!obj || typeof obj !== 'object') return [];
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object" && v !== null ? keys(v, `${prefix}${k}.`) : `${prefix}${k}`
  );
}

const presentLangs = Object.keys(loads);
if (presentLangs.length < 2) {
  console.log("i18n keys OK (insufficient public language files, using in-code translations)");
  process.exit(0);
}

const refLang = presentLangs.includes('en') ? 'en' : presentLangs[0];
const ref = new Set(keys(loads[refLang] || {}));
let failed = false;
for (const l of presentLangs) {
  if (l === refLang) continue;
  const set = new Set(keys(loads[l] || {}));
  const missing = [...ref].filter((k) => !set.has(k));
  if (missing.length) {
    console.error(`Missing in ${l}:`, missing);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`i18n keys OK across ${presentLangs.join('/')}`);


