const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const PROTO_PATH = __dirname + "/protos/user.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const UserService = grpc.loadPackageDefinition(packageDefinition).UserService;
const client = new UserService(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

exports.requiresAuth = function requiresAuth(req, res, next) {
  // [Bearer, token]
  const token = req.headers["authorization"].split(" ")[1];

  client.isAuthenticated({ token }, (err, msg) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, msg: "user auth error" });
    } else {
      const user = {
        id: msg.user.id,
        username: msg.user.username,
        email: msg.user.email,
      };
      req.user = user;
    }
    next();
  });
};
