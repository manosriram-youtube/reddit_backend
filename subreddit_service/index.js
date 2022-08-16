const { startGrpcServer, getGrpcServer } = require("./grpc");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const PROTO_PATH = __dirname + "/protos/subreddit.proto";
const { createSubreddit, getSubreddit } = require("./subreddit");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const subreddit_proto = grpc.loadPackageDefinition(packageDefinition);

startGrpcServer();
const server = getGrpcServer();

server.addService(subreddit_proto.SubRedditService.service, {
  createSubReddit: createSubreddit,
  getSubReddit: getSubreddit,
});
