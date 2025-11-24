// core/api/sendMessage.js
import { getSock } from "../bot/baileysClient.js";

export async function sendMessageAPI(req, res) {
  try {
    const sock = getSock();
    const { receiver, message } = req.body;
    const file = req.file;

    if (!receiver) {
      return res.status(400).json({ success: false, error: "Receiver wajib" });
    }

    const jid = receiver.includes("@s.whatsapp.net")
      ? receiver
      : `${receiver}@s.whatsapp.net`;

    // === MEDIA LOCAL (IMAGE / VIDEO) ===
    if (file) {
      const isVideo = file.mimetype.startsWith("video");

      const payload = {
        caption: message || "",
        mimetype: file.mimetype || (isVideo ? "video/mp4" : "image/jpeg"),
      };

      // WA BUTUH KEY YANG TEPAT!
      payload[isVideo ? "video" : "image"] = file.buffer;

      // Optional tapi recommended jika video
      if (isVideo) payload.fileLength = file.size;

      await sock.sendMessage(jid, payload);
      return res.json({ success: true, status: `media_sent_${isVideo ? "video" : "image"}` });
    }

    // ===== TEXT ONLY =====
    await sock.sendMessage(jid, { text: message });
    return res.json({ success: true, status: "text_sent" });

  } catch (err) {
    console.error("[ICARUS ERROR] => ", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
