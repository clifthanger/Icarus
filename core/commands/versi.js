export default {
  name: "versi",
  execute: async (sock, from) => {
    await sock.sendMessage(from, { text: "Icarus Ver: 1.0.0beta" });
  }
};
