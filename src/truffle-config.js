module.exports = {
  networks: {
    loc_9898_9898: {
      network_id: "*",
      port: 8888,
      host: "127.0.0.1"
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.19"
    }
  }
};
