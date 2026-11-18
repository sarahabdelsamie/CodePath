require("dotenv").config();
const mongoose = require("mongoose");
const app = require("../src/app");
const http = require("http");

let server;
let baseUrl;

const startTestServer = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/codepath");
  }

  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}/api`;
      resolve({ server, baseUrl });
    });
  });
};

const stopTestServer = async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

module.exports = {
  startTestServer,
  stopTestServer,
};
