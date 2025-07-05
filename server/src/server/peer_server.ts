const { PeerServer }: any = require("peer");

PeerServer({
  corsOptions: {
    origin: "*",
  },
  path: "/myapp",
  port: 9000,
});
console.log("✅ PeerJS Server running at http://localhost:9000/myapp");
