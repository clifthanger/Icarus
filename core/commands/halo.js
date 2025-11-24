export default {
  name: "halo",
  execute: async (sock, from) => {
    await sock.sendMessage(from, { text: "Halo gouz! 🦅" });
  }
};
