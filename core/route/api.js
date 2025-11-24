// core/route/api.js
const express = require("express");
const router = express.Router();
const { getSock } = require("../bot/baileysClient");

router.post("/send", async (req, res) => {
  try {
    const { number, message } = req.body;
    if (!number || !message) return res.status(400).json({ error: "number & message required" });

    const sock = getSock();
    const jid = number + "@s.whatsapp.net";
    await sock.sendMessage(jid, { text: message });

    res.json({ success: true, to: jid, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
