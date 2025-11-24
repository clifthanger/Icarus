// core/controller.js
import { getSock } from "./bot/baileysClient.js";
import { getCommand } from "./commandLoader.js";
import { log } from "./utils/logger.js";

async function processIncomingMessage(msg) {
  try {
    const sock = getSock();
    const m = msg.messages[0];
    if (!m?.message) return;

    const from = m.key.remoteJid;
    if (m.key.fromMe) return;

    const text =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      "";

    if (!text.trim()) return;

    log("Incoming:", from, "Text:", text);

    const cmd = getCommand(text.toLowerCase());
    if (cmd) {
      await cmd.execute(sock, from, text);
      return;
    }

    await sock.sendMessage(from, {
      text: `Command "${text}" tidak ditemukan.`
    });
  } catch (err) {
    log("❌ Error controller:", err.message);
  }
}

export { processIncomingMessage };
