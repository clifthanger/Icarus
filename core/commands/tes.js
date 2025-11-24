export default {
  name: "tes",
  execute: async (sock, from) => {
    await sock.sendMessage(from, { text: "Ada yang bisa dibantu?" });
  }
};
