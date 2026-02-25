import { readdir, readFile } from "fs/promises";
import { join, extname } from "path";

const DIST_DIR = join(process.cwd(), "dist");
const FORBIDDEN = ["localhost:3000", "localhost:8081", "ws://localhost"];
const CHECK_EXTENSIONS = [".js", ".html", ".css"];

let errors = 0;

async function scanDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await scanDir(fullPath);
    } else if (CHECK_EXTENSIONS.includes(extname(entry.name))) {
      const content = await readFile(fullPath, "utf-8");
      for (const forbidden of FORBIDDEN) {
        if (content.includes(forbidden)) {
          console.error(`❌ ENCONTRADO "${forbidden}" em: ${fullPath}`);
          errors++;
        }
      }
    }
  }
}

console.log("🔍 Verificando build em dist/...\n");

try {
  await scanDir(DIST_DIR);
  if (errors === 0) {
    console.log("✅ Build limpo! Nenhuma referência proibida encontrada.");
    process.exit(0);
  } else {
    console.error(`\n❌ ${errors} problema(s) encontrado(s) no build!`);
    process.exit(1);
  }
} catch (err) {
  if (err.code === "ENOENT") {
    console.error("❌ Pasta dist/ não encontrada. Execute 'npm run build' primeiro.");
  } else {
    console.error("❌ Erro ao verificar build:", err.message);
  }
  process.exit(1);
}
