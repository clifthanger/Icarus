// core/commandLoader.js
import fs from "fs";
import path from "path";
import url from "url";

let commands = {};

// *** LOAD ALL COMMAND FILES ***
export async function loadCommands() {
  const dirPath = path.resolve("core/commands");
  const files = fs.readdirSync(dirPath);
  commands = {}; // CLEAR CACHE

  for (const file of files) {
    if (file.endsWith(".js")) {
      try {
        const fileUrl = url.pathToFileURL(path.resolve(dirPath, file)).href;
        const { default: cmd } = await import(`${fileUrl}?update=${Date.now()}`);

        if (cmd?.name && typeof cmd.execute === "function") {
          commands[cmd.name] = cmd;
        } else {
          console.warn(`⚠ Command invalid format: ${file}`);
        }
      } catch (err) {
        console.error(`❌ Gagal load command ${file}:`, err.message);
      }
    }
  }
  console.log("[ICARUS] Commands loaded:", Object.keys(commands));
}

export function getCommand(name) {
  return commands[name];
}

export function getAllCommands() {
  return Object.keys(commands);
}

// *** AUTO RELOAD SAAT ADA PERUBAHAN DI FOLDER COMMAND ***
export function watchCommands() {
  const dirPath = path.resolve("core/commands");

  fs.watch(dirPath, (event, filename) => {
    if (!filename.endsWith(".js")) return;

    console.log(`🔄 Change detected in: ${filename} → Reloading commands...`);
    loadCommands();
  });

  console.log("[ICARUS] Watching command folder for changes...");
}
