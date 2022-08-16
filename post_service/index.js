const { startGrpcServer, getGrpcServer } = require("./grpc");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const PROTO_PATH = __dirname + "/protos/post.proto";
const {
  createPost,
  getPost,
  updatePost,
  likePost,
  commentPost,
} = require("./post");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});

const post_proto = grpc.loadPackageDefinition(packageDefinition);

startGrpcServer();
const server = getGrpcServer();

server.addService(post_proto.PostService.service, {
  createPost,
  getPost,
  updatePost,
  likePost,
  commentPost,
});
