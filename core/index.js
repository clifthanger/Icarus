// core/index.js
import express from "express";
import multer from "multer";
import { startBot } from "./bot/baileysClient.js";
import { processIncomingMessage } from "./controller.js";
import { sendMessageAPI } from "./api/sendMessage.js";
import { log } from "./utils/logger.js";
import { loadCommands, watchCommands } from "./commandLoader.js";

const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3000;

async function start() {
  const app = express();

  // 🛠 SUPAYA req.body KEISI SAAT FORM-DATA
  app.use(express.urlencoded({ extended: true }));  // <--- WAJIB
  app.use(express.json());

  await loadCommands();
  watchCommands();

  // API SEND MESSAGE
  app.post("/send-message", upload.single("file"), sendMessageAPI);

  const sock = await startBot();
  sock.ev.on("messages.upsert", processIncomingMessage);

  app.listen(PORT, () => log(`🚀 ICARUS API running at http://localhost:${PORT}`));
}

start();
