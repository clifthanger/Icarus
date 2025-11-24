// core/bot/baileysClient.js
import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import pino from "pino";
import qrcode from "qrcode-terminal";
import { log } from "../utils/logger.js";


let sock = null;

async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState("sessions/icarus");
    const { version, isLatest } = await fetchLatestBaileysVersion();

    log(`WA Web Version: ${version.join(".")} | Latest: ${isLatest ? "Yes" : "No"}`);

    sock = makeWASocket({
      auth: state,
      version,
      browser: ["Chrome", "Windows", "10"],
      logger: pino({ level: "silent" }),
    });

    // Simpan creds jika ada update
    sock.ev.on("creds.update", saveCreds);

    const red = "\x1b[31m";
    const green ="\x1b[32m";
    const reset = "\x1b[0m";

    //#region CONNECTION HANDLER
    sock.ev.on("connection.update", ({ connection, qr, lastDisconnect }) => {
      if (qr) {
        console.log("\n===== ICARUS QR LOGIN =====");
        qrcode.generate(qr, { small: true });
        console.log("============================\n");
      }

      if (connection === 'open') {
          log(`${green}┌====================[ STATUS ]========================┐`);
          log(`│                  WHATSAPP ACTIVE                     │`);
          log(`└======================================================┘${reset}`);
      } 

      if (connection === "close") {
        const reason = lastDisconnect?.error?.output?.statusCode;
        log(`❌ Connection closed. Code: ${reason || "UNKNOWN"}`);
        log(`${red}┌====================[ STATUS ]========================┐`);
        log(`│                  WHATSAPP CONNECTING                     │`);
        log(`└======================================================┘${reset}`);
        setTimeout(startBot, 2000);
      }

      log("Connection:", connection);
    });
    //#endregion

    log("ICARUS BOT READY");
    return sock;
  } catch (err) {
    console.error("Fatal error on startBot:", err);
  }
}

function getSock() {
  if (!sock) throw new Error("Bot belum jalan. Panggil startBot() dulu.");
  return sock;
}

export { startBot, getSock };
