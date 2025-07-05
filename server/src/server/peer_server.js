const { PeerServer } = require("peer");

const peerServer = PeerServer({
  port: 9000,
  path: "/myapp",
  corsOptions: {
    origin: "*",
  },
});

console.log("✅ PeerJS Server is running at http://localhost:9000/myapp");
